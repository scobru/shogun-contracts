// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title StealthPool
 * @dev Private mixing system for stealth transactions
 *
 * This contract implements a stealth pool that:
 * 1. Uses cryptographic commitments for privacy
 * 2. Uses random nonces to prevent replay attacks
 * 3. Uses Merkle trees for efficiency
 * 4. Merkle root is managed off-chain and updated by the owner
 * 5. Does not require a relayer - the user pays for gas directly
 */
contract StealthPool is ReentrancyGuard, Ownable {
    // =========================================== Events ============================================

    /// @dev Event emitted when the Merkle root is updated
    event MerkleRootUpdated(
        bytes32 indexed newRoot,
        uint256 timestamp
    );

    /// @dev Event emitted when a withdrawal is made
    event Withdrawal(
        bytes32 indexed commitment,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );

    /// @dev Event emitted when a new deposit is registered
    event DepositRegistered(
        bytes32 indexed commitment,
        uint256 index,
        uint256 timestamp
    );

    // ======================================= State variables =======================================

    /// @dev The current Merkle root representing all deposits
    bytes32 public merkleRoot;

    /// @dev The fixed amount for each deposit
    uint256 public immutable depositAmount;

    /// @dev Mapping to track already spent commitments
    mapping(bytes32 => bool) public spentCommitments;

    /// @dev Mapping to track used nonces (prevents replay attacks)
    mapping(bytes32 => bool) public usedNonces;

    /// @dev Counter for total deposits
    uint256 public totalDeposits;

    /// @dev Mapping from commitment to its index in the Merkle tree
    mapping(bytes32 => uint256) public commitmentIndexes;

    // ======================================= Constructor =======================================

    /**
     * @dev Contract constructor
     * @param _depositAmount The fixed amount for each deposit
     */
    constructor(uint256 _depositAmount) Ownable(msg.sender) {
        require(
            _depositAmount > 0,
            "StealthPool: deposit amount must be positive"
        );

        depositAmount = _depositAmount;
    }

    // ======================================= Core Functions =======================================

    /**
     * @notice Function to withdraw funds using a commitment and a nonce
     * @param _commitment The deposit commitment
     * @param _nonce The random nonce to prevent replay attacks
     * @param _recipient The recipient address for the funds
     * @param _merkleProof The Merkle proof to demonstrate the inclusion of the commitment
     */
    function withdraw(
        bytes32 _commitment,
        bytes32 _nonce,
        address payable _recipient,
        bytes32[] calldata _merkleProof
    ) external nonReentrant {
        require(
            _recipient != address(0),
            "StealthPool: recipient cannot be zero"
        );
        require(
            _commitment != bytes32(0),
            "StealthPool: commitment cannot be zero"
        );
        require(_nonce != bytes32(0), "StealthPool: nonce cannot be zero");

        // 1. Verify that the commitment is registered
        require(
            isCommitmentRegistered(_commitment),
            "StealthPool: commitment not registered"
        );

        // 2. Verify that the commitment has not already been spent
        require(
            !spentCommitments[_commitment],
            "StealthPool: commitment already spent"
        );

        // 3. Verify that the nonce has not already been used
        require(!usedNonces[_nonce], "StealthPool: nonce already used");

        // 4. Verify the Merkle proof using OpenZeppelin's MerkleProof library
        bool isValidProof = MerkleProof.verify(_merkleProof, merkleRoot, _commitment);
        require(isValidProof, "StealthPool: invalid Merkle proof");

        // 5. Mark the commitment as spent and the nonce as used
        spentCommitments[_commitment] = true;
        usedNonces[_nonce] = true;

        // 6. Send the funds to the recipient (full amount)
        (bool success, ) = _recipient.call{value: depositAmount}("");
        require(success, "StealthPool: transfer failed");

        // 7. Emit the event
        emit Withdrawal(
            _commitment,
            _recipient,
            depositAmount,
            block.timestamp
        );
    }

    /**
     * @notice Register a new deposit
     * @param _commitment The deposit commitment
     */
    function registerDeposit(bytes32 _commitment) external {
        require(
            _commitment != bytes32(0),
            "StealthPool: commitment cannot be zero"
        );
        require(
            !isCommitmentRegistered(_commitment),
            "StealthPool: commitment already registered"
        );

        // Register the commitment
        uint256 index = totalDeposits;
        commitmentIndexes[_commitment] = index + 1; // Use 1-based indexing to distinguish from non-existent entries
        totalDeposits++;

        emit DepositRegistered(_commitment, index, block.timestamp);
    }

    // ======================================= Management Functions =======================================

    /**
     * @notice Allows the owner to update the Merkle root
     * @param _newMerkleRoot The new Merkle root
     */
    function updateMerkleRoot(bytes32 _newMerkleRoot) external onlyOwner {
        merkleRoot = _newMerkleRoot;
        emit MerkleRootUpdated(_newMerkleRoot, block.timestamp);
    }

    /**
     * @notice Allows the owner to withdraw ETH from the contract in case of emergency
     * @param _amount The amount to withdraw
     * @param _recipient The recipient of the funds
     */
    function emergencyWithdraw(
        uint256 _amount,
        address payable _recipient
    ) external onlyOwner {
        require(
            _recipient != address(0),
            "StealthPool: recipient cannot be zero"
        );
        require(
            _amount <= address(this).balance,
            "StealthPool: insufficient balance"
        );

        (bool success, ) = _recipient.call{value: _amount}("");
        require(success, "StealthPool: emergency withdrawal failed");
    }

    // ======================================= View Functions =======================================

    /**
     * @notice Checks if a commitment has been spent
     * @param _commitment The commitment to check
     * @return True if the commitment has been spent
     */
    function isCommitmentSpent(
        bytes32 _commitment
    ) external view returns (bool) {
        return spentCommitments[_commitment];
    }

    /**
     * @notice Checks if a nonce has been used
     * @param _nonce The nonce to check
     * @return True if the nonce has been used
     */
    function isNonceUsed(bytes32 _nonce) external view returns (bool) {
        return usedNonces[_nonce];
    }

    /**
     * @notice Checks if a commitment is registered
     * @param _commitment The commitment to check
     * @return True if the commitment is registered
     */
    function isCommitmentRegistered(
        bytes32 _commitment
    ) public view returns (bool) {
        return commitmentIndexes[_commitment] > 0;
    }

    /**
     * @notice Gets the contract balance
     * @return The balance in ETH
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Gets the total number of deposits
     * @return The number of deposits
     */
    function getDepositCount() external view returns (uint256) {
        return totalDeposits;
    }

    // ======================================= Helper Functions =======================================

    /**
     * @dev Calculates the commitment from a public key and a nonce
     * @param _publicKey The public key
     * @param _nonce The random nonce
     * @return The calculated commitment
     */
    function calculateCommitment(
        bytes calldata _publicKey,
        bytes32 _nonce
    ) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(_publicKey, _nonce));
    }

    // ======================================= Receive Function =======================================

    /**
     * @dev Allows the contract to receive ETH
     */
    receive() external payable {
        // The contract can receive ETH for deposits
    }
}
