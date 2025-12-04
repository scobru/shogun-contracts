// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title ShogunRelayRegistry
 * @notice On-chain registry for Shogun storage relay nodes
 * @dev Manages relay registration, staking, storage deals, and slashing
 * 
 * Features:
 * - Relay registration with USDC stake
 * - Storage deal registration for dispute resolution
 * - Decentralized griefing-based slashing (no owner required)
 * - Discovery of active relays
 */
contract ShogunRelayRegistry is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // =========================================== Types ===========================================

    /// @notice Relay status enum
    enum RelayStatus {
        Inactive,       // Not registered or deactivated
        Active,         // Registered and operational
        Unstaking,      // In unstaking period
        Slashed         // Slashed and banned
    }

    /// @notice Relay information
    struct RelayInfo {
        address owner;              // Relay operator address
        string endpoint;            // HTTP/WebSocket endpoint URL
        string gunPubKey;           // GunDB public key for verification
        uint256 stakedAmount;       // USDC staked
        uint256 registeredAt;       // Registration timestamp
        uint256 unstakeRequestedAt; // Unstake request timestamp (0 if not unstaking)
        RelayStatus status;         // Current status
        uint256 totalDeals;         // Total deals processed
        uint256 totalSlashed;       // Total amount slashed
        uint256 griefingRatio;      // Cost to slash 1 USDC (in basis points, e.g., 100 = 0.01 USDC cost per 1 USDC slashed)
    }

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

    /// @notice Slash report
    struct SlashReport {
        bytes32 reportId;           // Unique report identifier
        address reporter;           // Who reported the violation
        address relay;              // Relay being reported
        bytes32 dealId;             // Related deal (if any)
        string reason;              // Reason for slash
        uint256 amount;             // Amount slashed from relay
        uint256 cost;               // Cost paid by reporter
        uint256 timestamp;          // When slash occurred
    }

    // =========================================== State ===========================================

    /// @notice USDC token contract (Base Sepolia)
    IERC20 public immutable stakingToken;

    /// @notice Minimum stake required to register as a relay
    uint256 public minStake;

    /// @notice Unstaking delay period (seconds)
    uint256 public unstakingDelay;

    /// @notice Default griefing ratio for clients without stake (basis points)
    /// e.g., 500 = 0.05 USDC cost to slash 1 USDC from relay
    uint256 public defaultGriefingRatio;

    /// @notice Griefing ratio for clients with stake (basis points, typically lower)
    uint256 public stakedClientGriefingRatio;

    /// @notice Slash percentage for missed proofs (basis points, 100 = 1%)
    uint256 public missedProofSlashBps;

    /// @notice Slash percentage for data loss (basis points)
    uint256 public dataLossSlashBps;

    /// @notice Registered relays
    mapping(address => RelayInfo) public relays;

    /// @notice Storage deals by ID
    mapping(bytes32 => StorageDeal) public deals;

    /// @notice Deals by relay
    mapping(address => bytes32[]) public dealsByRelay;

    /// @notice Deals by client
    mapping(address => bytes32[]) public dealsByClient;

    /// @notice Slash reports
    mapping(bytes32 => SlashReport) public slashReports;

    /// @notice Active relay addresses
    address[] public activeRelays;

    /// @notice Index in activeRelays array
    mapping(address => uint256) private activeRelayIndex;

    /// @notice Total reports counter
    uint256 public totalReports;

    /// @notice Treasury address (receives slashed amounts, can be zero address for burning)
    address public treasury;

    // =========================================== Events ==========================================

    event RelayRegistered(
        address indexed relay,
        address indexed owner,
        string endpoint,
        string gunPubKey,
        uint256 stakedAmount
    );

    event RelayUpdated(
        address indexed relay,
        string newEndpoint,
        string newGunPubKey
    );

    event StakeIncreased(
        address indexed relay,
        uint256 amount,
        uint256 newTotal
    );

    event UnstakeRequested(
        address indexed relay,
        uint256 amount,
        uint256 availableAt
    );

    event StakeWithdrawn(
        address indexed relay,
        uint256 amount
    );

    event RelayDeactivated(
        address indexed relay,
        string reason
    );

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

    event RelaySlashed(
        bytes32 indexed reportId,
        address indexed relay,
        address indexed reporter,
        uint256 amount,
        uint256 cost,
        string reason
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

    // =========================================== Errors ==========================================

    error InsufficientStake();
    error RelayAlreadyRegistered();
    error RelayNotRegistered();
    error RelayNotActive();
    error UnstakingNotRequested();
    error UnstakingDelayNotPassed();
    error InvalidEndpoint();
    error InvalidAmount();
    error DealNotFound();
    error DealAlreadyExists();
    error NotDealParty();
    error RelayAlreadySlashed();
    error InvalidSlashAmount();
    error InsufficientGriefingCost();
    error DealNotActive();
    error ClientStakeStillLocked();

    // ========================================= Constructor ========================================

    /**
     * @notice Initialize the registry
     * @param _stakingToken USDC token address on Base Sepolia
     * @param _minStake Minimum stake in USDC (6 decimals)
     * @param _unstakingDelay Delay before stake can be withdrawn (seconds)
     * @param _treasury Treasury address (zero address = burn slashed tokens)
     */
    constructor(
        address _stakingToken,
        uint256 _minStake,
        uint256 _unstakingDelay,
        address _treasury
    ) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
        minStake = _minStake;
        unstakingDelay = _unstakingDelay;
        treasury = _treasury;
        
        // Default griefing ratios (basis points)
        defaultGriefingRatio = 500;        // 0.05 USDC cost per 1 USDC slashed (5%)
        stakedClientGriefingRatio = 100;   // 0.01 USDC cost per 1 USDC slashed (1%) for staked clients
        
        // Slash percentages
        missedProofSlashBps = 100;    // 1%
        dataLossSlashBps = 1000;      // 10%
    }

    // ====================================== Relay Management =====================================

    /**
     * @notice Register as a relay operator
     * @param _endpoint HTTP/WebSocket endpoint URL
     * @param _gunPubKey GunDB public key for verification
     * @param _stakeAmount Amount of USDC to stake
     * @param _griefingRatio Custom griefing ratio (0 to use default)
     */
    function registerRelay(
        string calldata _endpoint,
        string calldata _gunPubKey,
        uint256 _stakeAmount,
        uint256 _griefingRatio
    ) external nonReentrant whenNotPaused {
        if (bytes(_endpoint).length == 0) revert InvalidEndpoint();
        if (_stakeAmount < minStake) revert InsufficientStake();
        if (relays[msg.sender].status != RelayStatus.Inactive) revert RelayAlreadyRegistered();

        // Transfer stake
        stakingToken.safeTransferFrom(msg.sender, address(this), _stakeAmount);

        // Use custom ratio or default
        uint256 griefingRatio = _griefingRatio > 0 ? _griefingRatio : defaultGriefingRatio;

        // Create relay info
        relays[msg.sender] = RelayInfo({
            owner: msg.sender,
            endpoint: _endpoint,
            gunPubKey: _gunPubKey,
            stakedAmount: _stakeAmount,
            registeredAt: block.timestamp,
            unstakeRequestedAt: 0,
            status: RelayStatus.Active,
            totalDeals: 0,
            totalSlashed: 0,
            griefingRatio: griefingRatio
        });

        // Add to active relays
        activeRelayIndex[msg.sender] = activeRelays.length;
        activeRelays.push(msg.sender);

        emit RelayRegistered(msg.sender, msg.sender, _endpoint, _gunPubKey, _stakeAmount);
    }

    /**
     * @notice Update relay endpoint and/or pubkey
     * @param _newEndpoint New endpoint URL (empty to keep current)
     * @param _newGunPubKey New GunDB public key (empty to keep current)
     */
    function updateRelay(
        string calldata _newEndpoint,
        string calldata _newGunPubKey
    ) external {
        RelayInfo storage relay = relays[msg.sender];
        if (relay.status != RelayStatus.Active) revert RelayNotActive();

        if (bytes(_newEndpoint).length > 0) {
            relay.endpoint = _newEndpoint;
        }
        if (bytes(_newGunPubKey).length > 0) {
            relay.gunPubKey = _newGunPubKey;
        }

        emit RelayUpdated(msg.sender, relay.endpoint, relay.gunPubKey);
    }

    /**
     * @notice Increase stake amount
     * @param _amount Additional USDC to stake
     */
    function increaseStake(uint256 _amount) external nonReentrant {
        if (_amount == 0) revert InvalidAmount();
        RelayInfo storage relay = relays[msg.sender];
        if (relay.status == RelayStatus.Inactive) revert RelayNotRegistered();
        if (relay.status == RelayStatus.Slashed) revert RelayAlreadySlashed();

        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        relay.stakedAmount += _amount;

        // If was unstaking, cancel unstaking and re-add to active list
        if (relay.status == RelayStatus.Unstaking) {
            relay.status = RelayStatus.Active;
            relay.unstakeRequestedAt = 0;
            // Re-add to active relays list
            activeRelayIndex[msg.sender] = activeRelays.length;
            activeRelays.push(msg.sender);
        }

        emit StakeIncreased(msg.sender, _amount, relay.stakedAmount);
    }

    /**
     * @notice Request to unstake and deactivate relay
     */
    function requestUnstake() external {
        RelayInfo storage relay = relays[msg.sender];
        if (relay.status != RelayStatus.Active) revert RelayNotActive();

        relay.status = RelayStatus.Unstaking;
        relay.unstakeRequestedAt = block.timestamp;

        // Remove from active relays
        _removeFromActiveRelays(msg.sender);

        emit UnstakeRequested(
            msg.sender,
            relay.stakedAmount,
            block.timestamp + unstakingDelay
        );
    }

    /**
     * @notice Withdraw stake after unstaking delay
     */
    function withdrawStake() external nonReentrant {
        RelayInfo storage relay = relays[msg.sender];
        if (relay.status != RelayStatus.Unstaking) revert UnstakingNotRequested();
        if (block.timestamp < relay.unstakeRequestedAt + unstakingDelay) {
            revert UnstakingDelayNotPassed();
        }

        uint256 amount = relay.stakedAmount;
        relay.stakedAmount = 0;
        relay.status = RelayStatus.Inactive;
        relay.unstakeRequestedAt = 0;

        stakingToken.safeTransfer(msg.sender, amount);

        emit StakeWithdrawn(msg.sender, amount);
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
     */
    function registerDeal(
        bytes32 _dealId,
        address _client,
        string calldata _cid,
        uint256 _sizeMB,
        uint256 _priceUSDC,
        uint256 _durationDays,
        uint256 _clientStake
    ) external {
        RelayInfo storage relay = relays[msg.sender];
        if (relay.status != RelayStatus.Active) revert RelayNotActive();
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
        relay.totalDeals++;

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

    // ========================================== Slashing ==========================================

    /**
     * @notice Client griefs relay for missed storage proof
     * @param _relay Relay address
     * @param _dealId Related deal ID (must be active deal with this client)
     * @param _evidence Description of evidence
     * @dev Client pays griefing cost to slash relay stake
     */
    function griefMissedProof(
        address _relay,
        bytes32 _dealId,
        string calldata _evidence
    ) external nonReentrant {
        StorageDeal storage deal = deals[_dealId];
        if (deal.createdAt == 0) revert DealNotFound();
        if (deal.client != msg.sender) revert NotDealParty();
        if (!deal.active) revert DealNotActive();
        if (deal.relay != _relay) revert NotDealParty();

        _griefRelay(_relay, missedProofSlashBps, _dealId, _evidence);
    }

    /**
     * @notice Client griefs relay for data loss
     * @param _relay Relay address
     * @param _dealId Related deal ID (must be active deal with this client)
     * @param _evidence Description of evidence
     * @dev Client pays griefing cost to slash relay stake
     */
    function griefDataLoss(
        address _relay,
        bytes32 _dealId,
        string calldata _evidence
    ) external nonReentrant {
        StorageDeal storage deal = deals[_dealId];
        if (deal.createdAt == 0) revert DealNotFound();
        if (deal.client != msg.sender) revert NotDealParty();
        if (!deal.active) revert DealNotActive();
        if (deal.relay != _relay) revert NotDealParty();

        _griefRelay(_relay, dataLossSlashBps, _dealId, _evidence);
    }

    /**
     * @notice Internal grief implementation (decentralized slashing)
     * @dev Implements Erasure-style griefing: reporter pays cost to slash relay
     */
    function _griefRelay(
        address _relay,
        uint256 _slashBps,
        bytes32 _dealId,
        string calldata _reason
    ) internal {
        RelayInfo storage relay = relays[_relay];
        if (relay.status == RelayStatus.Inactive) revert RelayNotRegistered();
        if (relay.status == RelayStatus.Slashed) revert RelayAlreadySlashed();

        // Calculate slash amount
        uint256 slashAmount = (relay.stakedAmount * _slashBps) / 10000;
        if (slashAmount == 0) revert InvalidSlashAmount();

        // Determine griefing ratio based on client stake
        StorageDeal storage deal = deals[_dealId];
        uint256 griefingRatio = deal.clientStake > 0 
            ? stakedClientGriefingRatio 
            : defaultGriefingRatio;

        // Calculate cost: griefingRatio basis points of slashAmount
        uint256 cost = (slashAmount * griefingRatio) / 10000;
        
        // Transfer cost from reporter
        stakingToken.safeTransferFrom(msg.sender, address(this), cost);

        // Slash relay stake
        relay.stakedAmount -= slashAmount;
        relay.totalSlashed += slashAmount;

        // Generate report ID
        totalReports++;
        bytes32 reportId = keccak256(abi.encodePacked(
            _relay,
            msg.sender,
            block.timestamp,
            totalReports
        ));

        slashReports[reportId] = SlashReport({
            reportId: reportId,
            reporter: msg.sender,
            relay: _relay,
            dealId: _dealId,
            reason: _reason,
            amount: slashAmount,
            cost: cost,
            timestamp: block.timestamp
        });

        // If stake falls below minimum, deactivate
        if (relay.stakedAmount < minStake) {
            if (relay.status == RelayStatus.Active) {
                _removeFromActiveRelays(_relay);
            }
            relay.status = RelayStatus.Slashed;
            emit RelayDeactivated(_relay, "Stake below minimum after slash");
        }

        // Transfer slashed amount to treasury (or burn if treasury is zero)
        if (treasury != address(0)) {
            stakingToken.safeTransfer(treasury, slashAmount);
        } else {
            // Burn by transferring to zero address (if token supports it)
            // Or keep in contract as burned
            stakingToken.safeTransfer(address(0), slashAmount);
        }

        // Cost is also sent to treasury (or burned)
        if (treasury != address(0)) {
            stakingToken.safeTransfer(treasury, cost);
        } else {
            stakingToken.safeTransfer(address(0), cost);
        }

        emit RelaySlashed(reportId, _relay, msg.sender, slashAmount, cost, _reason);
    }

    // ========================================== Discovery =========================================

    /**
     * @notice Get all active relays
     * @return Array of active relay addresses
     */
    function getActiveRelays() external view returns (address[] memory) {
        return activeRelays;
    }

    /**
     * @notice Get number of active relays
     * @return Count of active relays
     */
    function getActiveRelayCount() external view returns (uint256) {
        return activeRelays.length;
    }

    /**
     * @notice Get relay info by address
     * @param _relay Relay address
     * @return Relay information struct
     */
    function getRelayInfo(address _relay) external view returns (RelayInfo memory) {
        return relays[_relay];
    }

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
     * @notice Check if an address is a registered active relay
     * @param _relay Address to check
     * @return True if active relay
     */
    function isActiveRelay(address _relay) external view returns (bool) {
        return relays[_relay].status == RelayStatus.Active;
    }

    /**
     * @notice Calculate griefing cost for slashing a relay
     * @param _relay Relay address
     * @param _slashBps Slash percentage in basis points
     * @param _dealId Deal ID (to check client stake)
     * @return slashAmount Amount that would be slashed
     * @return cost Cost that reporter would pay
     */
    function calculateGriefingCost(
        address _relay,
        uint256 _slashBps,
        bytes32 _dealId
    ) external view returns (uint256 slashAmount, uint256 cost) {
        RelayInfo storage relay = relays[_relay];
        if (relay.status == RelayStatus.Inactive) {
            return (0, 0);
        }

        slashAmount = (relay.stakedAmount * _slashBps) / 10000;
        
        StorageDeal storage deal = deals[_dealId];
        uint256 griefingRatio = deal.clientStake > 0 
            ? stakedClientGriefingRatio 
            : defaultGriefingRatio;
        
        cost = (slashAmount * griefingRatio) / 10000;
    }

    // ========================================== Admin =============================================

    /**
     * @notice Set minimum stake requirement
     * @param _minStake New minimum stake (6 decimals for USDC)
     */
    function setMinStake(uint256 _minStake) external onlyOwner {
        minStake = _minStake;
    }

    /**
     * @notice Set unstaking delay
     * @param _delay New delay in seconds
     */
    function setUnstakingDelay(uint256 _delay) external onlyOwner {
        unstakingDelay = _delay;
    }

    /**
     * @notice Set slash percentages
     * @param _missedProofBps Slash for missed proofs (basis points)
     * @param _dataLossBps Slash for data loss (basis points)
     */
    function setSlashRates(uint256 _missedProofBps, uint256 _dataLossBps) external onlyOwner {
        missedProofSlashBps = _missedProofBps;
        dataLossSlashBps = _dataLossBps;
    }

    /**
     * @notice Set griefing ratios
     * @param _defaultRatio Default griefing ratio (basis points)
     * @param _stakedRatio Griefing ratio for staked clients (basis points)
     */
    function setGriefingRatios(uint256 _defaultRatio, uint256 _stakedRatio) external onlyOwner {
        defaultGriefingRatio = _defaultRatio;
        stakedClientGriefingRatio = _stakedRatio;
    }

    /**
     * @notice Set treasury address (zero address = burn)
     * @param _treasury New treasury address
     */
    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

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
     * @notice Emergency withdraw stuck tokens
     * @param _token Token address
     * @param _amount Amount to withdraw
     */
    function emergencyWithdraw(address _token, uint256 _amount) external onlyOwner {
        IERC20(_token).safeTransfer(owner(), _amount);
    }

    // ======================================== Internal ============================================

    /**
     * @notice Remove relay from active list
     */
    function _removeFromActiveRelays(address _relay) internal {
        uint256 index = activeRelayIndex[_relay];
        uint256 lastIndex = activeRelays.length - 1;

        if (index != lastIndex) {
            address lastRelay = activeRelays[lastIndex];
            activeRelays[index] = lastRelay;
            activeRelayIndex[lastRelay] = index;
        }

        activeRelays.pop();
        delete activeRelayIndex[_relay];
    }
}
