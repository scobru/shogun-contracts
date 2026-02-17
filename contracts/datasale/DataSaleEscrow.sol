// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../registry/ShogunRelayRegistry.sol";
import "./DataPostRegistry.sol";

/**
 * @title DataSaleEscrow
 * @notice Escrow contract for encrypted data sales (inspired by Erasure Protocol)
 * @dev Manages encrypted data exchange between seller and buyer
 * 
 * Flow:
 * 1. Seller publishes DataPost
 * 2. Buyer creates escrow for the post
 * 3. Buyer deposits payment
 * 4. Seller encrypts data for buyer
 * 5. Seller submits encrypted key to escrow
 * 6. Buyer retrieves and decrypts data
 * 7. Buyer completes or disputes
 */
contract DataSaleEscrow is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // =========================================== Types ===========================================

    enum EscrowStatus {
        PENDING_PAYMENT,    // Waiting for buyer payment
        ACTIVE,             // Payment deposited, waiting for seller to submit data
        DATA_SUBMITTED,     // Seller submitted encrypted key, buyer can retrieve
        COMPLETED,          // Buyer completed, funds released to seller
        DISPUTED,           // Griefing started
        CANCELLED           // Cancelled by buyer
    }

    struct EscrowInfo {
        bytes32 postId;                 // DataPost ID
        address seller;                 // Seller address (Bob)
        address buyer;                  // Buyer address (Alice)
        uint256 priceUSDC;             // Sale price
        bytes32 proofHash;              // Expected proof hash of data
        string encryptedDataHash;       // IPFS CID of encrypted data
        bytes32 encryptedSymKeyHash;    // Hash of encrypted symmetric key
        EscrowStatus status;            // Current status
        uint256 createdAt;              // Creation timestamp
        uint256 countdownEnd;           // Countdown end (for delivery deadline)
        uint256 countdownDuration;      // Countdown duration (seconds)
    }

    // =========================================== State ===========================================

    /// @notice Payment token (USDC)
    IERC20 public immutable paymentToken;

    /// @notice Registry contract (for relay/user keys and griefing)
    ShogunRelayRegistry public immutable registry;

    /// @notice DataPost registry
    DataPostRegistry public immutable postRegistry;

    /// @notice Escrow information
    EscrowInfo public escrow;

    /// @notice Whether seller is a relay (checked during initialization)
    bool public sellerIsRelay;

    /// @notice Whether seller is a registered user (checked during initialization)
    bool public sellerIsUser;

    // =========================================== Events ==========================================

    event EscrowCreated(
        bytes32 indexed postId,
        address indexed seller,
        address indexed buyer,
        uint256 priceUSDC
    );

    event PaymentDeposited(
        address indexed buyer,
        uint256 amount
    );

    event DataSubmitted(
        bytes32 indexed encryptedSymKeyHash
    );

    event EscrowCompleted(
        address indexed buyer,
        address indexed seller,
        uint256 amountReleased
    );

    event EscrowDisputed(
        address indexed buyer,
        uint256 slashAmount,
        string reason
    );

    event EscrowCancelled(
        address indexed buyer,
        uint256 refundAmount
    );

    // =========================================== Errors ==========================================

    error EscrowNotPending();
    error EscrowNotActive();
    error NotBuyer();
    error NotSeller();
    error NotParties();
    error InvalidAmount();
    error DataPostNotFound();
    error DataPostNotActive();
    error CountdownNotExpired(); // Legacy error name (kept for compatibility)
    error CountdownExpired(); // Countdown has expired, seller can no longer submit data
    error InvalidProofHash();
    error AlreadyInitialized();

    // ========================================= Constructor ========================================

    constructor(
        address _paymentToken,
        address _registry,
        address _postRegistry
    ) {
        paymentToken = IERC20(_paymentToken);
        registry = ShogunRelayRegistry(_registry);
        postRegistry = DataPostRegistry(_postRegistry);
    }

    // =========================================== Initialization ==================================

    /**
     * @notice Initialize escrow (called by factory)
     * @param _postId DataPost ID
     * @param _seller Seller address
     * @param _buyer Buyer address
     * @param _countdownDuration Countdown duration in seconds (e.g., 7 days)
     * @dev If seller is a relay, automatically registers a deal in registry for griefing
     */
    function initialize(
        bytes32 _postId,
        address _seller,
        address _buyer,
        uint256 _countdownDuration
    ) external {
        // Can only initialize once
        if (escrow.createdAt != 0) revert AlreadyInitialized();

        // Get post info
        DataPostRegistry.DataPost memory post = postRegistry.getPost(_postId);
        if (post.createdAt == 0) revert DataPostNotFound();
        if (!post.active) revert DataPostNotActive();
        if (post.seller != _seller) revert NotSeller();

        // Check if seller is a relay or user (for griefing mechanism)
        sellerIsRelay = registry.isActiveRelay(_seller);
        // Only check if user if not already a relay (relays can't be users)
        if (!sellerIsRelay) {
            // Try to get user info - if it reverts (user not registered), sellerIsUser stays false
            try registry.getUserInfo(_seller) returns (ShogunRelayRegistry.ParticipantInfo memory userInfo) {
                sellerIsUser = userInfo.registeredAt > 0;
            } catch {
                sellerIsUser = false;
            }
        } else {
            sellerIsUser = false;
        }

        // Initialize escrow
        escrow = EscrowInfo({
            postId: _postId,
            seller: _seller,
            buyer: _buyer,
            priceUSDC: post.priceUSDC,
            proofHash: post.proofHash,
            encryptedDataHash: post.encryptedDataHash,
            encryptedSymKeyHash: bytes32(0),
            status: EscrowStatus.PENDING_PAYMENT,
            createdAt: block.timestamp,
            countdownEnd: 0,
            countdownDuration: _countdownDuration
        });

        emit EscrowCreated(_postId, _seller, _buyer, post.priceUSDC);
    }

    // =========================================== Buyer Functions =================================

    /**
     * @notice Deposit payment to escrow
     * @dev Only buyer can call, must match exact price
     */
    function depositPayment() external nonReentrant {
        if (msg.sender != escrow.buyer) revert NotBuyer();
        if (escrow.status != EscrowStatus.PENDING_PAYMENT) revert EscrowNotPending();

        uint256 amount = escrow.priceUSDC;
        paymentToken.safeTransferFrom(msg.sender, address(this), amount);
        escrow.status = EscrowStatus.ACTIVE;
        unchecked {
            escrow.countdownEnd = block.timestamp + escrow.countdownDuration;
        }

        emit PaymentDeposited(msg.sender, amount);
    }

    /**
     * @notice Cancel escrow and refund payment (before data submission)
     * @dev Only buyer can cancel if seller hasn't submitted data yet
     */
    function cancel() external nonReentrant {
        if (msg.sender != escrow.buyer) revert NotBuyer();
        if (escrow.status != EscrowStatus.ACTIVE) revert EscrowNotActive();
        if (escrow.encryptedSymKeyHash != bytes32(0)) revert EscrowNotPending(); // Data already submitted

        uint256 refund = escrow.priceUSDC;
        escrow.status = EscrowStatus.CANCELLED;

        paymentToken.safeTransfer(escrow.buyer, refund);

        emit EscrowCancelled(escrow.buyer, refund);
    }

    /**
     * @notice Complete escrow after receiving and verifying data
     * @dev Buyer confirms data is correct and releases payment
     */
    function complete() external nonReentrant {
        if (msg.sender != escrow.buyer) revert NotBuyer();
        if (escrow.status != EscrowStatus.DATA_SUBMITTED) revert EscrowNotActive();
        if (escrow.encryptedSymKeyHash == bytes32(0)) revert EscrowNotActive();

        uint256 amount = escrow.priceUSDC;
        escrow.status = EscrowStatus.COMPLETED;

        paymentToken.safeTransfer(escrow.seller, amount);

        emit EscrowCompleted(escrow.buyer, escrow.seller, amount);
    }

    /**
     * @notice Buyer griefs seller (Erasure-style)
     * @param _slashAmount Amount to slash from seller stake (only used if seller is relay and deal exists)
     * @param _dealId Deal ID in registry (use postId if seller registered deal with same ID, or bytes32(0) to skip relay griefing)
     * @param _reason Reason for griefing
     * @dev Always refunds buyer. If seller is relay and deal exists, also griefs relay via registry
     */
    function grief(
        uint256 _slashAmount,
        bytes32 _dealId,
        string calldata _reason
    ) external nonReentrant {
        if (msg.sender != escrow.buyer) revert NotBuyer();
        if (escrow.status == EscrowStatus.COMPLETED || escrow.status == EscrowStatus.CANCELLED) {
            revert EscrowNotActive();
        }

        EscrowStatus previousStatus = escrow.status;

        // Mark escrow as disputed
        escrow.status = EscrowStatus.DISPUTED;

        // Calculate griefing cost if needed (before refunding)
        uint256 griefingCost = 0;
        if (_slashAmount > 0) {
            if (sellerIsRelay) {
                uint256 griefingRatio = registry.defaultGriefingRatio();
                griefingCost = (_slashAmount * griefingRatio) / 10000;
            } else if (sellerIsUser) {
                // Get user info to calculate cost
                try registry.getUserInfo(escrow.seller) returns (ShogunRelayRegistry.ParticipantInfo memory userInfo) {
                    griefingCost = (_slashAmount * userInfo.griefingRatio) / 10000;
                } catch {
                    // User not registered or error - no cost
                    griefingCost = 0;
                }
            }
        }

        // Refund buyer payment (full amount - buyer will pay griefing cost separately)
        uint256 refundAmount = 0;
        if (previousStatus == EscrowStatus.ACTIVE || previousStatus == EscrowStatus.DATA_SUBMITTED) {
            refundAmount = escrow.priceUSDC;
        }

        if (refundAmount > 0) {
            paymentToken.safeTransfer(escrow.buyer, refundAmount);
        }

        // Grief seller if they have stake (relay or user)
        // Buyer must pay griefing cost - they need to approve escrow to transfer it
        if (_slashAmount > 0 && griefingCost > 0) {
            // Transfer griefing cost from buyer to this contract (will be forwarded to registry)
            // Buyer must have approved escrow for griefing cost
            paymentToken.safeTransferFrom(escrow.buyer, address(this), griefingCost);
            
            if (sellerIsRelay) {
                // Grief relay via registry
                bytes32 dealIdToUse = _dealId == bytes32(0) ? escrow.postId : _dealId;
                uint256 griefingRatio = registry.defaultGriefingRatio();
                
                // Approve registry to spend griefing cost from escrow
                paymentToken.approve(address(registry), griefingCost);
                
                try registry.grief(escrow.seller, _slashAmount, _reason, griefingRatio, dealIdToUse) {
                    // Griefing successful
                } catch {
                    // Griefing failed - refund cost to buyer
                    paymentToken.safeTransfer(escrow.buyer, griefingCost);
                }
                
                paymentToken.approve(address(registry), 0);
            } else if (sellerIsUser) {
                // Grief user directly
                paymentToken.approve(address(registry), griefingCost);
                
                try registry.griefUser(escrow.seller, _slashAmount, _reason) {
                    // Griefing successful
                } catch {
                    // Griefing failed - refund cost to buyer
                    paymentToken.safeTransfer(escrow.buyer, griefingCost);
                }
                
                paymentToken.approve(address(registry), 0);
            }
        }

        emit EscrowDisputed(escrow.buyer, _slashAmount, _reason);
    }

    // =========================================== Seller Functions =================================

    /**
     * @notice Seller submits encrypted symmetric key
     * @param _encryptedSymKeyHash Hash of encrypted symmetric key (IPFS CID or hash)
     * @dev Seller encrypts SymKey with buyer's public key and submits hash
     *      Seller must submit before countdown expires
     */
    function submitData(
        bytes32 _encryptedSymKeyHash
    ) external {
        if (msg.sender != escrow.seller) revert NotSeller();
        if (escrow.status != EscrowStatus.ACTIVE) revert EscrowNotActive();
        // Seller must submit data BEFORE countdown expires
        if (escrow.countdownEnd > 0 && block.timestamp > escrow.countdownEnd) {
            revert CountdownExpired(); // Countdown expired, too late to submit
        }

        escrow.encryptedSymKeyHash = _encryptedSymKeyHash;
        escrow.status = EscrowStatus.DATA_SUBMITTED;

        emit DataSubmitted(_encryptedSymKeyHash);
    }

    // =========================================== View Functions ==================================

    /**
     * @notice Get escrow information
     * @return Escrow information struct
     */
    function getEscrowInfo() external view returns (EscrowInfo memory) {
        return escrow;
    }

    /**
     * @notice Check if countdown has expired
     * @return True if countdown expired
     */
    function isCountdownExpired() external view returns (bool) {
        return block.timestamp > escrow.countdownEnd && escrow.countdownEnd > 0;
    }

    /**
     * @notice Get buyer payment deposited
     * @return Amount deposited
     */
    function buyerPayment() external view returns (uint256) {
        if (escrow.status == EscrowStatus.ACTIVE || escrow.status == EscrowStatus.DATA_SUBMITTED) {
            return escrow.priceUSDC;
        }
        return 0;
    }
}

