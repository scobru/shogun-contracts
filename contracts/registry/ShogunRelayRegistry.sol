// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title ShogunRelayRegistry
 * @notice On-chain registry for Shogun participants (relays and users)
 * @dev Manages participant registration, staking, and griefing-based slashing
 * 
 * Features:
 * - Participant registration (relays with endpoint, users without)
 * - Unified stake management for relays and users
 * - Decentralized griefing-based slashing (Erasure-style, no owner required)
 * - Discovery of active relays and users
 * - Encryption keys (pubkey/epub) for encrypted data exchange
 * 
 * Architecture:
 * - Relays: endpoint required, can unstake with delay
 * - Users: no endpoint, can deposit/withdraw stake freely
 * - Both can be griefed if they have stake
 * 
 * ENCRYPTION KEYS FORMAT:
 * - pubkey/epub are stored as bytes in the contract
 * - Off-chain, they are interpreted as extended JSON format
 * - Standard format: GunDB SEA format ("x.y" coordinates)
 * - Alternative: JWK (JSON Web Key) standard format
 */
contract ShogunRelayRegistry is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // =========================================== Types ===========================================

    /// @notice Participant status enum (unified for relay and users)
    enum ParticipantStatus {
        Inactive,       // Not registered or deactivated
        Active,         // Registered and operational
        Unstaking,      // In unstaking period (relays only)
        Slashed         // Slashed and banned
    }

    /// @notice Unified participant information (relay or user)
    /// @dev For users: endpoint is empty string, unstakeRequestedAt is 0
    struct ParticipantInfo {
        address owner;              // Participant address (relay operator or user)
        string endpoint;            // HTTP/WebSocket endpoint URL (empty "" for users = null)
        bytes pubkey;               // GunDB public key (ECDSA, JSON format: "x.y") for verification and encryption
        bytes epub;                 // Ephemeral encryption public key (ECDH, JSON format: "x.y")
        uint256 stakedAmount;       // USDC staked
        uint256 registeredAt;       // Registration timestamp
        uint256 updatedAt;          // Last update timestamp
        uint256 unstakeRequestedAt; // Unstake request timestamp (0 if not unstaking, 0 for users)
        ParticipantStatus status;   // Current status
        uint256 totalSlashed;       // Total amount slashed
        uint256 griefingRatio;      // Cost to slash 1 USDC (in basis points, e.g., 100 = 0.01 USDC cost per 1 USDC slashed)
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
    /// @dev Immutable for security. To support new tokens, deploy new registry version.
    ///      Future: Can integrate TokenRegistry for multi-token support via upgradeable pattern.
    IERC20 public immutable stakingToken;

    /// @notice Minimum stake required to register as a relay
    uint256 public minStake;
    
    /// @notice Optional TokenRegistry for future multi-token support
    /// @dev Can be set by owner to enable multi-token functionality in future versions
    ///      If set, allows using multiple tokens for staking (requires contract modifications)
    address public tokenRegistry;

    /// @notice Unstaking delay period (seconds)
    uint256 public unstakingDelay;

    /// @notice Default griefing ratio for clients without stake (basis points)
    /// e.g., 500 = 0.05 USDC cost to slash 1 USDC from relay
    uint256 public defaultGriefingRatio;

    /// @notice Griefing ratio for clients with stake (basis points, typically lower)
    uint256 public stakedClientGriefingRatio;

    /// @notice All participants (relays and users) - unified registry
    mapping(address => ParticipantInfo) public participants;

    /// @notice Slash reports
    mapping(bytes32 => SlashReport) public slashReports;

    /// @notice Active relay addresses (for discovery)
    address[] public activeRelays;

    /// @notice Index in activeRelays array
    mapping(address => uint256) private activeRelayIndex;

    /// @notice Active participant addresses (for discovery - includes relays and users)
    address[] public activeParticipants;

    /// @notice Index in activeParticipants array
    mapping(address => uint256) private activeParticipantIndex;

    /// @notice Total reports counter
    uint256 public totalReports;

    /// @notice Treasury address (receives slashed amounts, can be zero address for burning)
    address public treasury;

    /// @notice Burn address for tokens (when treasury is zero address)
    /// @dev Standard Ethereum burn address: 0x000000000000000000000000000000000000dEaD
    address private constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;

    // =========================================== Events ==========================================

    event RelayRegistered(
        address indexed relay,
        address indexed owner,
        string endpoint,
        uint256 stakedAmount
    );

    event RelayUpdated(
        address indexed relay,
        string newEndpoint
    );

    event RelayEncryptionKeysUpdated(
        address indexed relay,
        bytes pubkey,
        bytes epub
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

    event RelaySlashed(
        bytes32 indexed reportId,
        address indexed relay,
        address indexed reporter,
        uint256 amount,
        uint256 cost,
        string reason
    );

    event UserRegistered(
        address indexed user,
        bytes pubkey,
        bytes epub
    );

    event UserKeysUpdated(
        address indexed user,
        bytes pubkey,
        bytes epub
    );

    event UserStakeDeposited(
        address indexed user,
        uint256 amount,
        uint256 totalStake
    );

    event UserStakeWithdrawn(
        address indexed user,
        uint256 amount,
        uint256 remainingStake
    );

    event UserSlashed(
        bytes32 indexed reportId,
        address indexed user,
        address indexed reporter,
        uint256 amount,
        uint256 cost,
        string reason
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
    error RelayAlreadySlashed();
    error InvalidSlashAmount();
    error InsufficientGriefingCost();
    error InvalidPubkey();
    error InvalidEpub();
    error UserNotRegistered();

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
    }

    // ====================================== Relay Management =====================================

    /**
     * @notice Register as a relay operator
     * @param _endpoint HTTP/WebSocket endpoint URL
     * @param _pubkey GunDB public key (ECDSA, bytes, JSON format: "x.y") for verification and encryption
     * @param _epub Ephemeral encryption public key (ECDH, bytes, JSON format: "x.y")
     * @param _stakeAmount Amount of USDC to stake
     * @param _griefingRatio Custom griefing ratio (0 to use default)
     * @dev pubkey/epub stored as bytes, interpreted as extended JSON off-chain (GunDB SEA format)
     */
    function registerRelay(
        string calldata _endpoint,
        bytes calldata _pubkey,
        bytes calldata _epub,
        uint256 _stakeAmount,
        uint256 _griefingRatio
    ) external nonReentrant whenNotPaused {
        if (bytes(_endpoint).length == 0) revert InvalidEndpoint();
        if (_stakeAmount < minStake) revert InsufficientStake();
        if (participants[msg.sender].status != ParticipantStatus.Inactive) revert RelayAlreadyRegistered();

        // Transfer stake
        stakingToken.safeTransferFrom(msg.sender, address(this), _stakeAmount);

        // Use custom ratio or default
        uint256 griefingRatio = _griefingRatio > 0 ? _griefingRatio : defaultGriefingRatio;

        // Create participant info (relay)
        participants[msg.sender] = ParticipantInfo({
            owner: msg.sender,
            endpoint: _endpoint,
            pubkey: _pubkey,
            epub: _epub,
            stakedAmount: _stakeAmount,
            registeredAt: block.timestamp,
            updatedAt: block.timestamp,
            unstakeRequestedAt: 0,
            status: ParticipantStatus.Active,
            totalSlashed: 0,
            griefingRatio: griefingRatio
        });

        // Add to active relays
        activeRelayIndex[msg.sender] = activeRelays.length;
        activeRelays.push(msg.sender);

        emit RelayRegistered(msg.sender, msg.sender, _endpoint, _stakeAmount);
        if (_pubkey.length > 0 || _epub.length > 0) {
            emit RelayEncryptionKeysUpdated(msg.sender, _pubkey, _epub);
        }
    }

    /**
     * @notice Update relay endpoint
     * @param _newEndpoint New endpoint URL (empty to keep current)
     */
    function updateRelay(
        string calldata _newEndpoint
    ) external {
        ParticipantInfo storage participant = participants[msg.sender];
        if (participant.status != ParticipantStatus.Active) revert RelayNotActive();
        if (bytes(participant.endpoint).length == 0) revert RelayNotActive(); // Must be relay

        if (bytes(_newEndpoint).length > 0) {
            participant.endpoint = _newEndpoint;
            participant.updatedAt = block.timestamp;
        }

        emit RelayUpdated(msg.sender, participant.endpoint);
    }

    /**
     * @notice Update relay encryption keys
     * @param _pubkey New encryption public key (empty to keep current)
     * @param _epub New ephemeral encryption public key (empty to keep current)
     */
    function updateRelayEncryptionKeys(
        bytes calldata _pubkey,
        bytes calldata _epub
    ) external {
        ParticipantInfo storage participant = participants[msg.sender];
        if (participant.status != ParticipantStatus.Active) revert RelayNotActive();
        if (bytes(participant.endpoint).length == 0) revert RelayNotActive(); // Must be relay
        
        if (_pubkey.length > 0) {
            participant.pubkey = _pubkey;
        }
        if (_epub.length > 0) {
            participant.epub = _epub;
        }
        
        participant.updatedAt = block.timestamp;
        emit RelayEncryptionKeysUpdated(msg.sender, participant.pubkey, participant.epub);
    }

    /**
     * @notice Increase stake amount
     * @param _amount Additional USDC to stake
     */
    function increaseStake(uint256 _amount) external nonReentrant {
        if (_amount == 0) revert InvalidAmount();
        ParticipantInfo storage participant = participants[msg.sender];
        if (participant.status == ParticipantStatus.Inactive) revert RelayNotRegistered();
        if (participant.status == ParticipantStatus.Slashed) revert RelayAlreadySlashed();

        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        participant.stakedAmount += _amount;

        // If was unstaking, cancel unstaking and re-add to active list (relays only)
        if (participant.status == ParticipantStatus.Unstaking && bytes(participant.endpoint).length > 0) {
            participant.status = ParticipantStatus.Active;
            participant.unstakeRequestedAt = 0;
            // Re-add to active relays list
            activeRelayIndex[msg.sender] = activeRelays.length;
            activeRelays.push(msg.sender);
        }

        participant.updatedAt = block.timestamp;
        emit StakeIncreased(msg.sender, _amount, participant.stakedAmount);
    }

    /**
     * @notice Request to unstake and deactivate relay
     */
    function requestUnstake() external {
        ParticipantInfo storage participant = participants[msg.sender];
        if (participant.status != ParticipantStatus.Active) revert RelayNotActive();
        if (bytes(participant.endpoint).length == 0) revert RelayNotActive(); // Only relays can unstake

        participant.status = ParticipantStatus.Unstaking;
        participant.unstakeRequestedAt = block.timestamp;

        // Remove from active relays
        _removeFromActiveRelays(msg.sender);

        emit UnstakeRequested(
            msg.sender,
            participant.stakedAmount,
            block.timestamp + unstakingDelay
        );
    }

    /**
     * @notice Withdraw stake after unstaking delay
     */
    function withdrawStake() external nonReentrant {
        ParticipantInfo storage participant = participants[msg.sender];
        if (participant.status != ParticipantStatus.Unstaking) revert UnstakingNotRequested();
        if (bytes(participant.endpoint).length == 0) revert UnstakingNotRequested(); // Only relays can unstake
        if (block.timestamp < participant.unstakeRequestedAt + unstakingDelay) {
            revert UnstakingDelayNotPassed();
        }

        uint256 amount = participant.stakedAmount;
        participant.stakedAmount = 0;
        participant.status = ParticipantStatus.Inactive;
        participant.unstakeRequestedAt = 0;

        stakingToken.safeTransfer(msg.sender, amount);

        emit StakeWithdrawn(msg.sender, amount);
    }

    // ========================================== Slashing ==========================================

    /**
     * @notice Grief a relay (Erasure-style griefing)
     * @param _relay Relay address to grief
     * @param _slashAmount Amount to slash from relay stake (in USDC atomic units)
     * @param _reason Reason for griefing
     * @param _griefingRatio Optional griefing ratio (0 to use relay's default)
     * @param _dealId Optional deal ID for reference (can be bytes32(0))
     * @dev Reporter pays griefing cost proportional to slash amount
     *      Can be called by StorageDealRegistry or directly by clients
     */
    function grief(
        address _relay,
        uint256 _slashAmount,
        string calldata _reason,
        uint256 _griefingRatio,
        bytes32 _dealId
    ) external nonReentrant {
        ParticipantInfo storage participant = participants[_relay];
        if (participant.status == ParticipantStatus.Inactive) revert RelayNotRegistered();
        if (participant.status == ParticipantStatus.Slashed) revert RelayAlreadySlashed();
        if (bytes(participant.endpoint).length == 0) revert RelayNotRegistered(); // Must be relay
        
        // Validate slash amount
        if (_slashAmount == 0) revert InvalidSlashAmount();
        if (_slashAmount > participant.stakedAmount) revert InvalidSlashAmount();

        // Determine griefing ratio: use provided, relay's default, or global default
        uint256 griefingRatio = _griefingRatio > 0 
            ? _griefingRatio 
            : (participant.griefingRatio > 0 ? participant.griefingRatio : defaultGriefingRatio);

        // Calculate cost: griefingRatio basis points of slashAmount
        uint256 cost = (_slashAmount * griefingRatio) / 10000;
        
        // Transfer cost from reporter
        stakingToken.safeTransferFrom(msg.sender, address(this), cost);

        // Slash relay stake
        participant.stakedAmount -= _slashAmount;
        participant.totalSlashed += _slashAmount;

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
            amount: _slashAmount,
            cost: cost,
            timestamp: block.timestamp
        });

        // If stake falls below minimum, deactivate
        if (participant.stakedAmount < minStake) {
            if (participant.status == ParticipantStatus.Active) {
                _removeFromActiveRelays(_relay);
            }
            participant.status = ParticipantStatus.Slashed;
            emit RelayDeactivated(_relay, "Stake below minimum after slash");
        }

        // Transfer slashed amount and cost to treasury (or burn address)
        // Note: USDC doesn't support burn(), so we use a dedicated burn address
        address recipient = treasury != address(0) ? treasury : BURN_ADDRESS;
        
        stakingToken.safeTransfer(recipient, _slashAmount);
        stakingToken.safeTransfer(recipient, cost);

        emit RelaySlashed(reportId, _relay, msg.sender, _slashAmount, cost, _reason);
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
    function getRelayInfo(address _relay) external view returns (ParticipantInfo memory) {
        ParticipantInfo memory participant = participants[_relay];
        // Only return if it's actually a relay (has endpoint)
        if (bytes(participant.endpoint).length == 0 && participant.registeredAt == 0) {
            revert RelayNotRegistered();
        }
        return participant;
    }

    /**
     * @notice Check if an address is a registered active relay
     * @param _relay Address to check
     * @return True if active relay
     */
    function isActiveRelay(address _relay) external view returns (bool) {
        ParticipantInfo memory participant = participants[_relay];
        return participant.status == ParticipantStatus.Active && bytes(participant.endpoint).length > 0;
    }

    // ========================================== User Management ==========================================

    /**
     * @notice Register user for encrypted data exchange
     * @param _pubkey Encryption public key (bytes, JSON format: "x.y" or JWK)
     * @param _epub Ephemeral encryption public key (bytes, JSON format: "x.y" or JWK)
     * @dev Keys stored as bytes, interpreted as extended JSON off-chain
     *      Format follows GunDB SEA standard: "x.y" coordinates or JWK
     */
    function registerUser(
        bytes calldata _pubkey,
        bytes calldata _epub
    ) external {
        if (_pubkey.length == 0) revert InvalidPubkey();
        if (_epub.length == 0) revert InvalidEpub();
        
        // If user already exists, preserve stake and slashed amounts
        // Check if already registered as relay (has endpoint) - users can't have endpoint
        ParticipantInfo memory existing = participants[msg.sender];
        if (bytes(existing.endpoint).length > 0) revert RelayAlreadyRegistered(); // Already a relay
        
        bool isNewUser = existing.registeredAt == 0;
        
        participants[msg.sender] = ParticipantInfo({
            owner: msg.sender,
            endpoint: "", // Users don't have endpoint
            pubkey: _pubkey,
            epub: _epub,
            stakedAmount: isNewUser ? 0 : existing.stakedAmount,
            registeredAt: isNewUser ? block.timestamp : existing.registeredAt,
            updatedAt: block.timestamp,
            unstakeRequestedAt: 0, // Users don't unstake
            status: ParticipantStatus.Active,
            totalSlashed: isNewUser ? 0 : existing.totalSlashed,
            griefingRatio: (isNewUser || existing.griefingRatio == 0) ? defaultGriefingRatio : existing.griefingRatio
        });
        
        // Add to active participants list if new
        if (isNewUser) {
            activeParticipantIndex[msg.sender] = activeParticipants.length;
            activeParticipants.push(msg.sender);
        }
        
        emit UserRegistered(msg.sender, _pubkey, _epub);
    }

    /**
     * @notice Update user encryption keys
     * @param _pubkey New encryption public key (empty to keep current)
     * @param _epub New ephemeral encryption public key (empty to keep current)
     */
    function updateUserKeys(
        bytes calldata _pubkey,
        bytes calldata _epub
    ) external {
        ParticipantInfo storage participant = participants[msg.sender];
        if (participant.registeredAt == 0) revert UserNotRegistered();
        if (bytes(participant.endpoint).length > 0) revert RelayNotActive(); // Must be user (no endpoint)
        
        if (_pubkey.length > 0) {
            participant.pubkey = _pubkey;
        }
        if (_epub.length > 0) {
            participant.epub = _epub;
        }
        
        participant.updatedAt = block.timestamp;
        
        emit UserKeysUpdated(msg.sender, participant.pubkey, participant.epub);
    }

    /**
     * @notice Deposit stake for user (optional, for griefing protection)
     * @param _amount Amount of USDC to stake
     * @param _griefingRatio Custom griefing ratio (0 to use default)
     */
    function depositUserStake(uint256 _amount, uint256 _griefingRatio) external nonReentrant {
        if (_amount == 0) revert InvalidAmount();
        ParticipantInfo storage participant = participants[msg.sender];
        if (participant.registeredAt == 0) revert UserNotRegistered();
        if (bytes(participant.endpoint).length > 0) revert UserNotRegistered(); // Must be user (no endpoint)

        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        participant.stakedAmount += _amount;

        // Update griefing ratio if provided
        if (_griefingRatio > 0) {
            participant.griefingRatio = _griefingRatio;
        } else if (participant.griefingRatio == 0) {
            participant.griefingRatio = defaultGriefingRatio;
        }

        participant.updatedAt = block.timestamp;
        emit UserStakeDeposited(msg.sender, _amount, participant.stakedAmount);
    }

    /**
     * @notice Withdraw user stake
     * @param _amount Amount to withdraw
     */
    function withdrawUserStake(uint256 _amount) external nonReentrant {
        if (_amount == 0) revert InvalidAmount();
        ParticipantInfo storage participant = participants[msg.sender];
        if (participant.registeredAt == 0) revert UserNotRegistered();
        if (bytes(participant.endpoint).length > 0) revert UserNotRegistered(); // Must be user (no endpoint)
        if (participant.stakedAmount < _amount) revert InvalidAmount();

        participant.stakedAmount -= _amount;
        stakingToken.safeTransfer(msg.sender, _amount);

        participant.updatedAt = block.timestamp;
        emit UserStakeWithdrawn(msg.sender, _amount, participant.stakedAmount);
    }

    /**
     * @notice Grief a user (similar to relay griefing)
     * @param _user User address to grief
     * @param _slashAmount Amount to slash from user stake
     * @param _reason Reason for griefing
     * @dev Reporter pays griefing cost proportional to slash amount
     */
    function griefUser(
        address _user,
        uint256 _slashAmount,
        string calldata _reason
    ) external nonReentrant {
        ParticipantInfo storage participant = participants[_user];
        if (participant.registeredAt == 0) revert UserNotRegistered();
        if (bytes(participant.endpoint).length > 0) revert UserNotRegistered(); // Must be user (no endpoint)
        if (participant.status != ParticipantStatus.Active) revert UserNotRegistered();
        
        // Validate slash amount
        if (_slashAmount == 0) revert InvalidSlashAmount();
        if (_slashAmount > participant.stakedAmount) revert InvalidSlashAmount();

        // Calculate cost: griefingRatio basis points of slashAmount
        uint256 cost = (_slashAmount * participant.griefingRatio) / 10000;
        
        // Transfer cost from reporter
        stakingToken.safeTransferFrom(msg.sender, address(this), cost);

        // Slash user stake
        participant.stakedAmount -= _slashAmount;
        participant.totalSlashed += _slashAmount;

        // Generate report ID
        totalReports++;
        bytes32 reportId = keccak256(abi.encodePacked(
            _user,
            msg.sender,
            block.timestamp,
            totalReports
        ));

        slashReports[reportId] = SlashReport({
            reportId: reportId,
            reporter: msg.sender,
            relay: _user, // Reusing relay field for user address
            dealId: bytes32(0),
            reason: _reason,
            amount: _slashAmount,
            cost: cost,
            timestamp: block.timestamp
        });

        // Transfer slashed amount and cost to treasury (or burn address)
        // Note: USDC doesn't support burn(), so we use a dedicated burn address
        address recipient = treasury != address(0) ? treasury : BURN_ADDRESS;
        
        stakingToken.safeTransfer(recipient, _slashAmount);
        stakingToken.safeTransfer(recipient, cost);

        emit UserSlashed(reportId, _user, msg.sender, _slashAmount, cost, _reason);
    }

    /**
     * @notice Get user info by address
     * @param _user User address
     * @return User information struct
     */
    function getUserInfo(address _user) external view returns (ParticipantInfo memory) {
        ParticipantInfo memory participant = participants[_user];
        // Only return if it's actually a user (no endpoint)
        if (bytes(participant.endpoint).length > 0) {
            revert UserNotRegistered(); // This is a relay, not a user
        }
        return participant;
    }

    /**
     * @notice Get all active users (participants without endpoint)
     * @return Array of active user addresses
     */
    function getActiveUsers() external view returns (address[] memory) {
        uint256 userCount = 0;
        // First pass: count users
        for (uint256 i = 0; i < activeParticipants.length; i++) {
            ParticipantInfo memory p = participants[activeParticipants[i]];
            if (bytes(p.endpoint).length == 0 && p.status == ParticipantStatus.Active) {
                userCount++;
            }
        }
        
        // Second pass: collect user addresses
        address[] memory users = new address[](userCount);
        uint256 index = 0;
        for (uint256 i = 0; i < activeParticipants.length; i++) {
            ParticipantInfo memory p = participants[activeParticipants[i]];
            if (bytes(p.endpoint).length == 0 && p.status == ParticipantStatus.Active) {
                users[index] = activeParticipants[i];
                index++;
            }
        }
        return users;
    }

    /**
     * @notice Get number of active users
     * @return Count of active users
     */
    function getActiveUserCount() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < activeParticipants.length; i++) {
            ParticipantInfo memory p = participants[activeParticipants[i]];
            if (bytes(p.endpoint).length == 0 && p.status == ParticipantStatus.Active) {
                count++;
            }
        }
        return count;
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
     * @notice Set TokenRegistry address for future multi-token support
     * @param _tokenRegistry Address of TokenRegistry contract (can be zero to disable)
     * @dev This allows future integration with TokenRegistry for multi-token support
     *      Current implementation still uses immutable stakingToken, but this field
     *      can be used by upgraded contracts or new versions
     */
    function setTokenRegistry(address _tokenRegistry) external onlyOwner {
        tokenRegistry = _tokenRegistry;
        // Future: emit event when TokenRegistry integration is implemented
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
