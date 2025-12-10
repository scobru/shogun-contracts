// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "../registry/ShogunRelayRegistry.sol";

/**
 * @title GunL2Bridge
 * @notice L2 Bridge contract for Shogun Protocol - Enables trustless deposits and withdrawals
 * @dev Uses Merkle Proofs for verifiable withdrawals from L2 (GunDB) to L1 (Ethereum)
 * 
 * Architecture:
 * - Deposits: Users send ETH to contract, emit Deposit event for GunDB nodes to credit L2 balance
 * - Batch Submission: Registered relays (or dedicated sequencer) submit Merkle Root of current L2 state
 * - Withdrawals: Users provide Merkle Proof to prove their withdrawal is included in the root
 * 
 * Security:
 * - Anti-replay protection via nonce-based leaf hashing
 * - Only registered relays (or dedicated sequencer) can submit batches
 * - Merkle proof verification ensures withdrawals are legitimate
 */
contract GunL2Bridge is Ownable, ReentrancyGuard, Pausable {
    // =========================================== Events ===========================================

    /// @notice Emitted when a user deposits ETH
    /// @param user Address of the depositor
    /// @param amount Amount deposited (in wei)
    /// @param timestamp Block timestamp
    event Deposit(address indexed user, uint256 amount, uint256 timestamp);

    /// @notice Emitted when sequencer submits a new batch (state root)
    /// @param batchId Sequential batch identifier
    /// @param stateRoot Merkle root of the current L2 state
    /// @notice Emitted when sequencer submits a new batch (state root)
    /// @param batchId Sequential batch identifier
    /// @param stateRoot Merkle root of the current L2 state
    event BatchSubmitted(uint256 indexed batchId, bytes32 stateRoot);

    /// @notice Emitted when a user successfully withdraws
    /// @param user Address of the withdrawer
    /// @param amount Amount withdrawn (in wei)
    /// @param nonce Unique nonce for this withdrawal
    event Withdrawal(address indexed user, uint256 amount, uint256 nonce);

    /// @notice Bridge frozen event (censorship proved)
    event BridgeFrozen(bytes32 indexed withdrawalHash, address indexed reporter);

    /// @notice Force withdrawal initiated
    event ForceWithdrawalInitiated(bytes32 indexed withdrawalHash, address indexed user, uint256 amount, uint256 deadline);

    /// @notice Batch finalized after challenge period
    event BatchFinalized(uint256 indexed batchId, bytes32 stateRoot);

    /// @notice Batch challenged and fraud proven
    event BatchChallenged(uint256 indexed batchId, address indexed challenger);
    
    /// @notice Challenger slashed for false challenge
    event ChallengerSlashed(uint256 indexed batchId, address indexed challenger);

    // =========================================== State ===========================================

    /// @notice ShogunRelayRegistry contract address
    ShogunRelayRegistry public relayRegistry;

    /// @notice Optional dedicated sequencer address (if set, only this address can submit batches)
    /// @dev If zero address, any registered relay can submit batches
    address public sequencer;

    /// @notice Current state root (Merkle root of L2 state)
    bytes32 public currentStateRoot;

    /// @notice Current batch ID (increments with each batch submission)
    uint256 public currentBatchId;

    /// @notice Mapping to prevent replay attacks (leaf hash => processed)
    /// @dev Leaf = keccak256(abi.encodePacked(user, amount, nonce))
    mapping(bytes32 => bool) public processedWithdrawals;

    /// @notice Historical batch roots (batchId => stateRoot)
    /// @dev Allows users to withdraw from previous batches even if new ones are submitted
    mapping(uint256 => bytes32) public batchRoots;

    /// @notice Pending force withdrawals (hash => deadline timestamp)
    mapping(bytes32 => uint256) public pendingForceWithdrawals;

    /// @notice Time window for sequencer to include force withdrawal (e.g., 24 hours)
    uint256 public constant FORCE_WITHDRAWAL_WINDOW = 24 hours;

    /// @notice Challenge period before batch is finalized (e.g., 1 day for MVP, 7 days for production)
    uint256 public constant CHALLENGE_PERIOD = 1 days;

    /// @notice Minimum stake required to challenge a batch
    uint256 public constant CHALLENGE_BOND = 0.1 ether;

    /// @notice Batch info for fraud proof tracking
    struct BatchInfo {
        bytes32 root;
        bytes32 dataHash;       // Hash of batch data for re-execution
        uint256 submittedAt;
        bool finalized;
        bool challenged;
        address challenger;
    }

    /// @notice Detailed batch info (for fraud proofs)
    mapping(uint256 => BatchInfo) public batchInfo;

    /// @notice Challenger bonds (batchId => challenger => bond)
    mapping(uint256 => mapping(address => uint256)) public challengerBonds;

    // =========================================== Modifiers ===========================================

    /// @notice Only sequencer or registered relay can submit batches
    modifier onlySequencerOrRelay() {
        // If sequencer is set (non-zero), only sequencer can submit
        if (sequencer != address(0)) {
            require(msg.sender == sequencer, "GunL2Bridge: Not sequencer");
        } else {
            // Otherwise, check if sender is a registered active relay
            require(
                relayRegistry.isActiveRelay(msg.sender),
                "GunL2Bridge: Not sequencer or registered relay"
            );
        }
        _;
    }

    // =========================================== Constructor ===========================================

    /**
     * @notice Initialize the bridge
     * @param _relayRegistry Address of ShogunRelayRegistry contract
     * @param _sequencer Optional dedicated sequencer address (zero address = any relay can submit)
     */
    constructor(address _relayRegistry, address _sequencer) Ownable(msg.sender) {
        require(_relayRegistry != address(0), "GunL2Bridge: Invalid relay registry");
        relayRegistry = ShogunRelayRegistry(_relayRegistry);
        sequencer = _sequencer; // Can be zero address to allow any relay
        currentBatchId = 0;
        // Initial state root is empty (no withdrawals yet)
        currentStateRoot = bytes32(0);
    }

    // =========================================== Deposit (L1 -> L2) ===========================================

    /**
     * @notice Deposit ETH to bridge to L2
     * @dev Emits Deposit event that GunDB nodes listen to for crediting L2 balance
     *      ETH is locked in the contract until withdrawn via Merkle proof
     */
    function deposit() external payable whenNotPaused {
        require(msg.value > 0, "GunL2Bridge: Must send ETH");
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    // =========================================== Force Withdrawal (Anti-Censorship) ===========================================

    /**
     * @notice Initiate a force withdrawal request
     * @param amount Amount to withdraw
     * @param nonce Nonce for the withdrawal
     * @dev This starts the timer. If sequencer doesn't include it in a batch within window, bridge can be frozen.
     */
    function initiateForceWithdrawal(uint256 amount, uint256 nonce) external whenNotPaused {
        require(amount > 0, "GunL2Bridge: Invalid amount");
        
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount, nonce));
        require(pendingForceWithdrawals[leaf] == 0, "GunL2Bridge: Already pending");
        require(!processedWithdrawals[leaf], "GunL2Bridge: Already processed");

        uint256 deadline = block.timestamp + FORCE_WITHDRAWAL_WINDOW;
        pendingForceWithdrawals[leaf] = deadline;

        emit ForceWithdrawalInitiated(leaf, msg.sender, amount, deadline);
    }

    /**
     * @notice Prove censorship and freeze the bridge
     * @param user User address
     * @param amount Amount
     * @param nonce Nonce
     * @dev If deadline passed and request still pending, sequencer is censoring.
     */
    function proveCensorship(address user, uint256 amount, uint256 nonce) external {
        bytes32 leaf = keccak256(abi.encodePacked(user, amount, nonce));
        uint256 deadline = pendingForceWithdrawals[leaf];

        require(deadline != 0, "GunL2Bridge: Not pending");
        require(block.timestamp > deadline, "GunL2Bridge: Deadline not passed");

        _pause(); // Freeze the bridge
        emit BridgeFrozen(leaf, msg.sender);
    }

    // =========================================== Batch Submission (Sequencer) ===========================================

    /**
     * @notice Submit a new batch with updated state root
     * @param _newRoot Merkle root of the current L2 state (includes all pending withdrawals)
     * @param _handledForceWithdrawals List of force withdrawal hashes included in this batch
     * @dev Only sequencer (if set) or registered relay can call this. 
     *      MUST acknowledge pending force withdrawals to avoid being accused of censorship.
     */
    function submitBatch(
        bytes32 _newRoot, 
        bytes32[] calldata _handledForceWithdrawals
    ) external onlySequencerOrRelay whenNotPaused {
        require(_newRoot != bytes32(0), "GunL2Bridge: Invalid root");
        
        // Clear handled force withdrawals
        for (uint256 i = 0; i < _handledForceWithdrawals.length; i++) {
            bytes32 leaf = _handledForceWithdrawals[i];
            if (pendingForceWithdrawals[leaf] != 0) {
                delete pendingForceWithdrawals[leaf];
            }
        }

        currentStateRoot = _newRoot;
        currentBatchId++;
        batchRoots[currentBatchId] = _newRoot;
        
        // Store batch info for fraud proof tracking
        batchInfo[currentBatchId] = BatchInfo({
            root: _newRoot,
            dataHash: keccak256(abi.encode(_handledForceWithdrawals)),
            submittedAt: block.timestamp,
            finalized: false,
            challenged: false,
            challenger: address(0)
        });
        
        emit BatchSubmitted(currentBatchId, _newRoot);
    }

    /**
     * @notice Finalize a batch after challenge period
     * @param batchId Batch to finalize
     * @dev Can only be called after CHALLENGE_PERIOD has passed without successful challenge
     */
    function finalizeBatch(uint256 batchId) external {
        BatchInfo storage batch = batchInfo[batchId];
        require(batch.root != bytes32(0), "GunL2Bridge: Invalid batch");
        require(!batch.finalized, "GunL2Bridge: Already finalized");
        require(!batch.challenged, "GunL2Bridge: Batch challenged");
        require(block.timestamp > batch.submittedAt + CHALLENGE_PERIOD, "GunL2Bridge: Challenge period active");
        
        batch.finalized = true;
        emit BatchFinalized(batchId, batch.root);
    }

    /**
     * @notice Challenge a batch (claim fraud)
     * @param batchId Batch to challenge
     * @dev Requires CHALLENGE_BOND stake. If fraud is proven, challenger gets reward.
     */
    function challengeBatch(uint256 batchId) external payable {
        require(msg.value >= CHALLENGE_BOND, "GunL2Bridge: Insufficient bond");
        
        BatchInfo storage batch = batchInfo[batchId];
        require(batch.root != bytes32(0), "GunL2Bridge: Invalid batch");
        require(!batch.finalized, "GunL2Bridge: Already finalized");
        require(!batch.challenged, "GunL2Bridge: Already challenged");
        require(block.timestamp <= batch.submittedAt + CHALLENGE_PERIOD, "GunL2Bridge: Challenge period ended");
        
        batch.challenged = true;
        batch.challenger = msg.sender;
        challengerBonds[batchId][msg.sender] = msg.value;
        
        emit BatchChallenged(batchId, msg.sender);
        
        // In a full implementation, this would trigger dispute resolution
        // For now, we pause the bridge to require manual intervention
        _pause();
    }

    /**
     * @notice Resolve a challenge (owner only for MVP)
     * @param batchId Batch ID
     * @param fraudProven True if fraud was proven, false if challenge was invalid
     */
    function resolveChallenge(uint256 batchId, bool fraudProven) external onlyOwner {
        BatchInfo storage batch = batchInfo[batchId];
        require(batch.challenged, "GunL2Bridge: Not challenged");
        
        address challenger = batch.challenger;
        uint256 bond = challengerBonds[batchId][challenger];
        
        if (fraudProven) {
            // Fraud proven: revert batch, reward challenger
            // Clear the batch root so it cannot be used for withdrawals
            batchRoots[batchId] = bytes32(0);
            batch.root = bytes32(0);
            
            // Return bond to challenger (+ reward from sequencer stake in future)
            (bool sent, ) = payable(challenger).call{value: bond}("");
            require(sent, "GunL2Bridge: Bond return failed");
        } else {
            // False challenge: slash challenger bond
            // Bond goes to sequencer or protocol treasury
            challengerBonds[batchId][challenger] = 0;
            emit ChallengerSlashed(batchId, challenger);
        }
        
        batch.challenged = false;
        _unpause();
    }

    // =========================================== Withdrawal (L2 -> L1) ===========================================

    /**
     * @notice Withdraw ETH from L2 to L1 using Merkle proof
     * @param amount Amount to withdraw (in wei)
     * @param nonce Unique nonce for this withdrawal (prevents replay)
     * @param proof Merkle proof array (sibling hashes from leaf to root)
     * @dev The leaf is computed as keccak256(abi.encodePacked(msg.sender, amount, nonce))
     *      The proof must verify against currentStateRoot
     */
    function withdraw(
        uint256 amount,
        uint256 nonce,
        uint256 batchId,
        bytes32[] calldata proof
    ) external nonReentrant whenNotPaused {
        require(amount > 0, "GunL2Bridge: Invalid amount");
        require(address(this).balance >= amount, "GunL2Bridge: Insufficient contract balance");

        // 1. Compute the leaf hash (user, amount, nonce)
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount, nonce));

        // 2. Check anti-replay: ensure this leaf hasn't been used before
        require(!processedWithdrawals[leaf], "GunL2Bridge: Withdrawal already processed");

        // 3. Verify Merkle proof: leaf must be part of the root for the specified batch
        bytes32 root = batchRoots[batchId];
        require(root != bytes32(0), "GunL2Bridge: Invalid batch ID");
        
        require(
            verifyProof(proof, root, leaf),
            "GunL2Bridge: Invalid Merkle proof"
        );

        // 4. Mark as processed (anti-replay)
        processedWithdrawals[leaf] = true;

        // 5. Transfer ETH to user
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "GunL2Bridge: ETH transfer failed");

        emit Withdrawal(msg.sender, amount, nonce);
    }

    // =========================================== Merkle Verification ===========================================

    /**
     * @notice Verify a Merkle proof
     * @param proof Array of sibling hashes from leaf to root
     * @param root The Merkle root to verify against
     * @param leaf The leaf hash to verify
     * @return True if proof is valid
     * @dev Uses standard Merkle tree verification (keccak256 pairs, sorted order)
     */
    function verifyProof(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) internal pure returns (bool) {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            // Sort hashes to ensure deterministic tree structure
            if (computedHash <= proofElement) {
                // Hash(current, sibling)
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                // Hash(sibling, current)
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }

        return computedHash == root;
    }

    // =========================================== Admin Functions ===========================================

    /**
     * @notice Update sequencer address
     * @param _newSequencer New sequencer address (zero address = allow any registered relay)
     * @dev If set to zero address, any registered relay can submit batches.
     *      If set to a specific address, only that address can submit batches.
     */
    function setSequencer(address _newSequencer) external onlyOwner {
        sequencer = _newSequencer; // Can be zero address
    }

    /**
     * @notice Update relay registry address
     * @param _newRelayRegistry New relay registry address
     */
    function setRelayRegistry(address _newRelayRegistry) external onlyOwner {
        require(_newRelayRegistry != address(0), "GunL2Bridge: Invalid relay registry");
        relayRegistry = ShogunRelayRegistry(_newRelayRegistry);
    }

    /**
     * @notice Pause the contract (emergency only)
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
     * @notice Emergency withdraw stuck ETH (owner only)
     * @param amount Amount to withdraw
     * @param to Recipient address
     */
    function emergencyWithdraw(uint256 amount, address payable to) external onlyOwner {
        require(to != address(0), "GunL2Bridge: Invalid recipient");
        require(address(this).balance >= amount, "GunL2Bridge: Insufficient balance");
        (bool sent, ) = to.call{value: amount}("");
        require(sent, "GunL2Bridge: ETH transfer failed");
    }

    // =========================================== View Functions ===========================================

    /**
     * @notice Check if a withdrawal has been processed (anti-replay check)
     * @param user User address
     * @param amount Withdrawal amount
     * @param nonce Withdrawal nonce
     * @return True if already processed
     */
    function isWithdrawalProcessed(
        address user,
        uint256 amount,
        uint256 nonce
    ) external view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(user, amount, nonce));
        return processedWithdrawals[leaf];
    }

    /**
     * @notice Get contract ETH balance
     * @return Balance in wei
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Receive ETH (for deposits)
     * @dev Respects pause state to prevent deposits during emergencies
     */
    receive() external payable whenNotPaused {
        if (msg.value > 0) {
            emit Deposit(msg.sender, msg.value, block.timestamp);
        }
    }
}

