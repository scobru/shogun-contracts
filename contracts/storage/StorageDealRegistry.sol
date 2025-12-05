// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "../registry/ShogunRelayRegistry.sol";

/**
 * @title StorageDealRegistry
 * @notice Registry for storage deals between relays and clients
 * @dev Manages storage deal registration, client stake, and integration with relay registry for griefing
 * 
 * Features:
 * - Register storage deals (only active relays)
 * - Client stake management for better griefing ratios
 * - Integration with ShogunRelayRegistry for relay verification and griefing
 * - Deal lifecycle management
 */
contract StorageDealRegistry is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // =========================================== Types ===========================================

    /// @notice Storage deal information
    struct StorageDeal {
        bytes32 dealId;             // Unique deal identifier
        address relay;              // Relay handling the deal
        address client;             // Client who created the deal
        string cid;                 // IPFS CID being stored
        uint256 sizeMB;             // Size in MB
        uint256 priceUSDC;          // Total price paid
        uint256 createdAt;          // Creation timestamp
        uint256 expiresAt;          // Expiration timestamp
        bool active;                // Whether deal is active
        uint256 clientStake;        // Optional client stake for better griefing ratio
    }

    // =========================================== State ===========================================

    /// @notice Reference to ShogunRelayRegistry (for relay verification and griefing)
    ShogunRelayRegistry public immutable registry;

    /// @notice USDC token contract (same as registry)
    IERC20 public immutable stakingToken;

    /// @notice Storage deals by ID
    mapping(bytes32 => StorageDeal) public deals;

    /// @notice Deals by relay
    mapping(address => bytes32[]) public dealsByRelay;

    /// @notice Deals by client
    mapping(address => bytes32[]) public dealsByClient;

    /// @notice Total deals counter
    uint256 public totalDeals;

    // =========================================== Events ===========================================

    event StorageDealRegistered(
        bytes32 indexed dealId,
        address indexed relay,
        address indexed client,
        string cid,
        uint256 sizeMB,
        uint256 priceUSDC,
        uint256 expiresAt,
        uint256 clientStake
    );

    event StorageDealCompleted(
        bytes32 indexed dealId,
        address indexed relay
    );

    event ClientStakeDeposited(
        bytes32 indexed dealId,
        address indexed client,
        uint256 amount
    );

    event ClientStakeWithdrawn(
        bytes32 indexed dealId,
        address indexed client,
        uint256 amount
    );

    // =========================================== Errors ===========================================

    error DealNotFound();
    error DealAlreadyExists();
    error NotDealParty();
    error DealNotActive();
    error ClientStakeStillLocked();
    error InvalidAmount();
    error RelayNotActive();

    // ========================================= Constructor ========================================

    /**
     * @notice Initialize the storage deal registry
     * @param _registry Address of ShogunRelayRegistry contract
     */
    constructor(address _registry) Ownable(msg.sender) {
        registry = ShogunRelayRegistry(_registry);
        stakingToken = IERC20(registry.stakingToken());
    }

    // ======================================= Storage Deals =======================================

    /**
     * @notice Register a storage deal on-chain
     * @param _dealId Unique deal identifier (from off-chain system)
     * @param _client Client address
     * @param _cid IPFS CID being stored
     * @param _sizeMB Size in MB
     * @param _priceUSDC Total price paid
     * @param _durationDays Deal duration in days
     * @param _clientStake Optional client stake for better griefing ratio
     * @dev Only active relays can register deals (verified via registry)
     */
    function registerDeal(
        bytes32 _dealId,
        address _client,
        string calldata _cid,
        uint256 _sizeMB,
        uint256 _priceUSDC,
        uint256 _durationDays,
        uint256 _clientStake
    ) external nonReentrant whenNotPaused {
        // Verify relay is active via registry
        if (!registry.isActiveRelay(msg.sender)) revert RelayNotActive();
        if (deals[_dealId].createdAt != 0) revert DealAlreadyExists();

        uint256 expiresAt = block.timestamp + (_durationDays * 1 days);

        // If client wants to stake, transfer it
        if (_clientStake > 0) {
            stakingToken.safeTransferFrom(_client, address(this), _clientStake);
        }

        deals[_dealId] = StorageDeal({
            dealId: _dealId,
            relay: msg.sender,
            client: _client,
            cid: _cid,
            sizeMB: _sizeMB,
            priceUSDC: _priceUSDC,
            createdAt: block.timestamp,
            expiresAt: expiresAt,
            active: true,
            clientStake: _clientStake
        });

        dealsByRelay[msg.sender].push(_dealId);
        dealsByClient[_client].push(_dealId);
        totalDeals++;

        emit StorageDealRegistered(
            _dealId,
            msg.sender,
            _client,
            _cid,
            _sizeMB,
            _priceUSDC,
            expiresAt,
            _clientStake
        );

        if (_clientStake > 0) {
            emit ClientStakeDeposited(_dealId, _client, _clientStake);
        }
    }

    /**
     * @notice Add client stake to an existing deal (improves griefing ratio)
     * @param _dealId Deal identifier
     * @param _amount Amount to stake
     */
    function addClientStake(bytes32 _dealId, uint256 _amount) external nonReentrant {
        if (_amount == 0) revert InvalidAmount();
        StorageDeal storage deal = deals[_dealId];
        if (deal.createdAt == 0) revert DealNotFound();
        if (msg.sender != deal.client) revert NotDealParty();
        if (!deal.active) revert DealNotActive();

        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        deal.clientStake += _amount;

        emit ClientStakeDeposited(_dealId, msg.sender, _amount);
    }

    /**
     * @notice Withdraw client stake after deal completion
     * @param _dealId Deal identifier
     */
    function withdrawClientStake(bytes32 _dealId) external nonReentrant {
        StorageDeal storage deal = deals[_dealId];
        if (deal.createdAt == 0) revert DealNotFound();
        if (msg.sender != deal.client) revert NotDealParty();
        
        // Can only withdraw if deal is completed or expired
        if (deal.active && block.timestamp < deal.expiresAt) {
            revert ClientStakeStillLocked();
        }

        uint256 amount = deal.clientStake;
        deal.clientStake = 0;

        stakingToken.safeTransfer(msg.sender, amount);

        emit ClientStakeWithdrawn(_dealId, msg.sender, amount);
    }

    /**
     * @notice Mark a deal as completed (expired or fulfilled)
     * @param _dealId Deal identifier
     */
    function completeDeal(bytes32 _dealId) external {
        StorageDeal storage deal = deals[_dealId];
        if (deal.createdAt == 0) revert DealNotFound();
        if (msg.sender != deal.relay && msg.sender != deal.client) revert NotDealParty();

        deal.active = false;

        emit StorageDealCompleted(_dealId, deal.relay);
    }

    /**
     * @notice Client griefs relay for a storage deal (calls registry.grief)
     * @param _dealId Related deal ID (must be active deal with this client)
     * @param _slashAmount Amount to slash from relay stake (in USDC atomic units)
     * @param _reason Reason for griefing
     * @dev Calculates griefing ratio based on client stake, transfers cost from client, then delegates to registry.grief()
     */
    function grief(
        bytes32 _dealId,
        uint256 _slashAmount,
        string calldata _reason
    ) external nonReentrant {
        StorageDeal storage deal = deals[_dealId];
        if (deal.createdAt == 0) revert DealNotFound();
        if (deal.client != msg.sender) revert NotDealParty();
        if (!deal.active) revert DealNotActive();

        // Calculate griefing ratio based on client stake
        uint256 griefingRatio = deal.clientStake > 0 
            ? registry.stakedClientGriefingRatio() 
            : registry.defaultGriefingRatio();

        // Calculate griefing cost
        uint256 cost = (_slashAmount * griefingRatio) / 10000;
        
        // Transfer cost from client to this contract (dealRegistry will pay when calling registry.grief)
        if (cost > 0) {
            stakingToken.safeTransferFrom(msg.sender, address(this), cost);
        }

        // Delegate to registry for griefing (dealRegistry will pay the cost as msg.sender)
        registry.grief(deal.relay, _slashAmount, _reason, griefingRatio, _dealId);
    }

    // ========================================== Discovery =========================================

    /**
     * @notice Get deals for a relay
     * @param _relay Relay address
     * @return Array of deal IDs
     */
    function getRelayDeals(address _relay) external view returns (bytes32[] memory) {
        return dealsByRelay[_relay];
    }

    /**
     * @notice Get deals for a client
     * @param _client Client address
     * @return Array of deal IDs
     */
    function getClientDeals(address _client) external view returns (bytes32[] memory) {
        return dealsByClient[_client];
    }

    /**
     * @notice Get deal info by ID
     * @param _dealId Deal identifier
     * @return StorageDeal struct
     */
    function getDeal(bytes32 _dealId) external view returns (StorageDeal memory) {
        if (deals[_dealId].createdAt == 0) revert DealNotFound();
        return deals[_dealId];
    }

    /**
     * @notice Get total number of deals
     * @return Total deals count
     */
    function getTotalDeals() external view returns (uint256) {
        return totalDeals;
    }

    // ========================================== Admin =============================================

    /**
     * @notice Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Emergency withdraw stuck tokens (should not happen in normal operation)
     * @param _token Token address
     * @param _amount Amount to withdraw
     */
    function emergencyWithdraw(address _token, uint256 _amount) external onlyOwner {
        IERC20(_token).safeTransfer(owner(), _amount);
    }
}

