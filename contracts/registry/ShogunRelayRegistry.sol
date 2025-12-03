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
 * - Slashing mechanism for misbehavior
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
    }

    /// @notice Slash report
    struct SlashReport {
        bytes32 reportId;           // Unique report identifier
        address reporter;           // Who reported the violation
        address relay;              // Relay being reported
        bytes32 dealId;             // Related deal (if any)
        string reason;              // Reason for slash
        uint256 amount;             // Amount slashed
        uint256 timestamp;          // When slash occurred
    }

    // =========================================== State ===========================================

    /// @notice USDC token contract (Base Sepolia)
    IERC20 public immutable stakingToken;

    /// @notice Minimum stake required to register as a relay
    uint256 public minStake;

    /// @notice Unstaking delay period (seconds)
    uint256 public unstakingDelay;

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

    /// @notice Authorized slashers (can report violations)
    mapping(address => bool) public authorizedSlashers;

    /// @notice Total reports counter
    uint256 public totalReports;

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
        uint256 expiresAt
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
        string reason
    );

    event SlasherAuthorized(address indexed slasher, bool authorized);

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
    error NotAuthorizedSlasher();
    error RelayAlreadySlashed();
    error InvalidSlashAmount();

    // ========================================= Constructor ========================================

    /**
     * @notice Initialize the registry
     * @param _stakingToken USDC token address on Base Sepolia
     * @param _minStake Minimum stake in USDC (6 decimals)
     * @param _unstakingDelay Delay before stake can be withdrawn (seconds)
     */
    constructor(
        address _stakingToken,
        uint256 _minStake,
        uint256 _unstakingDelay
    ) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
        minStake = _minStake;
        unstakingDelay = _unstakingDelay;
        missedProofSlashBps = 100;    // 1%
        dataLossSlashBps = 1000;      // 10%
    }

    // ====================================== Relay Management =====================================

    /**
     * @notice Register as a relay operator
     * @param _endpoint HTTP/WebSocket endpoint URL
     * @param _gunPubKey GunDB public key for verification
     * @param _stakeAmount Amount of USDC to stake
     */
    function registerRelay(
        string calldata _endpoint,
        string calldata _gunPubKey,
        uint256 _stakeAmount
    ) external nonReentrant whenNotPaused {
        if (bytes(_endpoint).length == 0) revert InvalidEndpoint();
        if (_stakeAmount < minStake) revert InsufficientStake();
        if (relays[msg.sender].status != RelayStatus.Inactive) revert RelayAlreadyRegistered();

        // Transfer stake
        stakingToken.safeTransferFrom(msg.sender, address(this), _stakeAmount);

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
            totalSlashed: 0
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
     */
    function registerDeal(
        bytes32 _dealId,
        address _client,
        string calldata _cid,
        uint256 _sizeMB,
        uint256 _priceUSDC,
        uint256 _durationDays
    ) external {
        RelayInfo storage relay = relays[msg.sender];
        if (relay.status != RelayStatus.Active) revert RelayNotActive();
        if (deals[_dealId].createdAt != 0) revert DealAlreadyExists();

        uint256 expiresAt = block.timestamp + (_durationDays * 1 days);

        deals[_dealId] = StorageDeal({
            dealId: _dealId,
            relay: msg.sender,
            client: _client,
            cid: _cid,
            sizeMB: _sizeMB,
            priceUSDC: _priceUSDC,
            createdAt: block.timestamp,
            expiresAt: expiresAt,
            active: true
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
            expiresAt
        );
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
     * @notice Report a relay for missed storage proof
     * @param _relay Relay address
     * @param _dealId Related deal ID (optional, bytes32(0) if none)
     * @param _evidence Description of evidence
     */
    function reportMissedProof(
        address _relay,
        bytes32 _dealId,
        string calldata _evidence
    ) external {
        if (!authorizedSlashers[msg.sender] && msg.sender != owner()) {
            revert NotAuthorizedSlasher();
        }

        _slashRelay(_relay, missedProofSlashBps, _dealId, _evidence);
    }

    /**
     * @notice Report a relay for data loss
     * @param _relay Relay address
     * @param _dealId Related deal ID
     * @param _evidence Description of evidence
     */
    function reportDataLoss(
        address _relay,
        bytes32 _dealId,
        string calldata _evidence
    ) external {
        if (!authorizedSlashers[msg.sender] && msg.sender != owner()) {
            revert NotAuthorizedSlasher();
        }

        // Verify deal exists and involves this relay
        StorageDeal storage deal = deals[_dealId];
        if (deal.createdAt == 0) revert DealNotFound();
        if (deal.relay != _relay) revert NotDealParty();

        _slashRelay(_relay, dataLossSlashBps, _dealId, _evidence);
    }

    /**
     * @notice Internal slash implementation
     */
    function _slashRelay(
        address _relay,
        uint256 _slashBps,
        bytes32 _dealId,
        string calldata _reason
    ) internal {
        RelayInfo storage relay = relays[_relay];
        if (relay.status == RelayStatus.Inactive) revert RelayNotRegistered();
        if (relay.status == RelayStatus.Slashed) revert RelayAlreadySlashed();

        uint256 slashAmount = (relay.stakedAmount * _slashBps) / 10000;
        if (slashAmount == 0) revert InvalidSlashAmount();

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
            timestamp: block.timestamp
        });

        // If stake falls below minimum, deactivate
        if (relay.stakedAmount < minStake) {
            // Only remove from active list if currently Active (Unstaking already removed)
            if (relay.status == RelayStatus.Active) {
                _removeFromActiveRelays(_relay);
            }
            relay.status = RelayStatus.Slashed;
            emit RelayDeactivated(_relay, "Stake below minimum after slash");
        }

        // Transfer slashed amount to treasury (owner)
        stakingToken.safeTransfer(owner(), slashAmount);

        emit RelaySlashed(reportId, _relay, msg.sender, slashAmount, _reason);
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
     * @notice Authorize or revoke a slasher
     * @param _slasher Address to authorize/revoke
     * @param _authorized Whether to authorize
     */
    function setAuthorizedSlasher(address _slasher, bool _authorized) external onlyOwner {
        authorizedSlashers[_slasher] = _authorized;
        emit SlasherAuthorized(_slasher, _authorized);
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

