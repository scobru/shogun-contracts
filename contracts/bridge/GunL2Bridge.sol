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
    event BatchSubmitted(uint256 indexed batchId, bytes32 stateRoot);

    /// @notice Emitted when a user successfully withdraws
    /// @param user Address of the withdrawer
    /// @param amount Amount withdrawn (in wei)
    /// @param nonce Unique nonce for this withdrawal
    event Withdrawal(address indexed user, uint256 amount, uint256 nonce);

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

    // =========================================== Batch Submission (Sequencer) ===========================================

    /**
     * @notice Submit a new batch with updated state root
     * @param _newRoot Merkle root of the current L2 state (includes all pending withdrawals)
     * @dev Only sequencer (if set) or registered relay can call this. The root represents the state
     *      after processing all L2 transactions (including withdrawal requests) since the last batch.
     */
    function submitBatch(bytes32 _newRoot) external onlySequencerOrRelay whenNotPaused {
        require(_newRoot != bytes32(0), "GunL2Bridge: Invalid root");
        currentStateRoot = _newRoot;
        currentBatchId++;
        batchRoots[currentBatchId] = _newRoot;
        emit BatchSubmitted(currentBatchId, _newRoot);
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

