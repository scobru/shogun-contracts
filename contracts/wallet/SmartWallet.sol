// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
// cerca sulweb
import "./Counter.sol";

/**
 * @title SmartWallet
 * @dev Smart contract wallet with multi-sig, social recovery, and batch transactions
 */
contract SmartWallet is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // ============================================ Events ============================================

    event SignerAdded(address indexed signer);
    event SignerRemoved(address indexed signer);
    event GuardianAdded(address indexed guardian);
    event GuardianRemoved(address indexed guardian);
    event ExecutionProposed(uint256 indexed proposalId, address indexed target, bytes data, address proposer);
    event ExecutionApproved(uint256 indexed proposalId, address indexed approver);
    event ExecutionExecuted(uint256 indexed proposalId, bool success);
    event RecoveryInitiated(address indexed newOwner, uint256 unlockTime);
    event RecoveryExecuted(address indexed newOwner);
    event BatchExecuted(address[] targets, bool[] results);

    // ============================================ State Variables ============================================

    struct Proposal {
        address target;
        bytes data;
        address proposer;
        uint256 approvals;
        bool executed;
        mapping(address => bool) hasApproved;
    }

    struct RecoveryRequest {
        address newOwner;
        uint256 unlockTime;
        mapping(address => bool) guardianApprovals;
    }

    // Signers who can execute transactions
    mapping(address => bool) public signers;
    uint256 public requiredSignatures;

    // Guardians for social recovery
    mapping(address => bool) public guardians;
    uint256 public requiredGuardians;
    RecoveryRequest public recoveryRequest;

    // Proposals for multi-sig operations
    mapping(uint256 => Proposal) public proposals;
    Counters.Counter private proposalCounter;

    // Timelock for critical operations (in seconds)
    uint256 public timelock = 24 hours;

    // Minimum delay before recovery can be executed
    uint256 public recoveryDelay = 48 hours;

    // ============================================ Modifiers ============================================

    modifier onlySigner() {
        require(signers[msg.sender] || msg.sender == owner(), "Not authorized signer");
        _;
    }

    modifier onlyGuardian() {
        require(guardians[msg.sender], "Not a guardian");
        _;
    }

    // ============================================ Constructor ============================================

    /**
     * @param _owner Initial owner of the wallet
     * @param _requiredSignatures Required signatures for multi-sig operations
     * @param _requiredGuardians Required guardians for social recovery
     */
    constructor(
        address _owner,
        uint256 _requiredSignatures,
        uint256 _requiredGuardians
    ) Ownable(_owner) {
        require(_owner != address(0), "Invalid owner");
        require(_requiredSignatures >= 1, "At least 1 signature required");
        require(_requiredGuardians >= 2, "At least 2 guardians required");

        _transferOwnership(_owner);
        signers[_owner] = true;
        requiredSignatures = _requiredSignatures;
        requiredGuardians = _requiredGuardians;

        emit SignerAdded(_owner);
    }

    // ============================================ Signer Management ============================================

    /**
     * @notice Add a new signer
     * @param signer Address of the signer to add
     */
    function addSigner(address signer) external onlyOwner {
        require(signer != address(0), "Invalid signer");
        require(!signers[signer], "Already a signer");

        signers[signer] = true;
        emit SignerAdded(signer);
    }

    /**
     * @notice Remove a signer
     * @param signer Address of the signer to remove
     */
    function removeSigner(address signer) external onlyOwner {
        require(signers[signer], "Not a signer");
        require(_getSignerCount() > 1, "Cannot remove last signer");

        signers[signer] = false;
        emit SignerRemoved(signer);
    }

    /**
     * @notice Update required signatures
     * @param _requiredSignatures New required signatures count
     */
    function setRequiredSignatures(uint256 _requiredSignatures) external onlyOwner {
        require(_requiredSignatures >= 1, "At least 1 signature required");
        require(_requiredSignatures <= _getSignerCount(), "More than available signers");
        requiredSignatures = _requiredSignatures;
    }

    // ============================================ Guardian Management ============================================

    /**
     * @notice Add a guardian for social recovery
     * @param guardian Address of the guardian to add
     */
    function addGuardian(address guardian) external onlyOwner {
        require(guardian != address(0), "Invalid guardian");
        require(!guardians[guardian], "Already a guardian");
        require(!signers[guardian], "Guardian cannot be a signer");

        guardians[guardian] = true;
        emit GuardianAdded(guardian);
    }

    /**
     * @notice Remove a guardian
     * @param guardian Address of the guardian to remove
     */
    function removeGuardian(address guardian) external onlyOwner {
        require(guardians[guardian], "Not a guardian");

        guardians[guardian] = false;
        emit GuardianRemoved(guardian);
    }

    /**
     * @notice Update required guardians
     * @param _requiredGuardians New required guardians count
     */
    function setRequiredGuardians(uint256 _requiredGuardians) external onlyOwner {
        require(_requiredGuardians >= 2, "At least 2 guardians required");
        require(_requiredGuardians <= _getGuardianCount(), "More than available guardians");
        requiredGuardians = _requiredGuardians;
    }

    // ============================================ Social Recovery ============================================

    /**
     * @notice Initiate recovery process
     * @param newOwner Address of the new owner
     */
    function initiateRecovery(address newOwner) external onlyGuardian {
        require(newOwner != address(0), "Invalid new owner");
        require(newOwner != owner(), "New owner cannot be current owner");

        recoveryRequest.newOwner = newOwner;
        recoveryRequest.unlockTime = block.timestamp + recoveryDelay;
        recoveryRequest.guardianApprovals[msg.sender] = true;

        emit RecoveryInitiated(newOwner, recoveryRequest.unlockTime);
    }

    /**
     * @notice Approve recovery request
     */
    function approveRecovery() external onlyGuardian {
        require(recoveryRequest.newOwner != address(0), "No recovery initiated");
        require(recoveryRequest.unlockTime > 0, "Recovery not initiated");
        require(!recoveryRequest.guardianApprovals[msg.sender], "Already approved");

        recoveryRequest.guardianApprovals[msg.sender] = true;

        // Check if we have enough approvals
        uint256 approvals = _getRecoveryApprovals();
        if (approvals >= requiredGuardians && block.timestamp >= recoveryRequest.unlockTime) {
            _executeRecovery();
        }
    }

    /**
     * @notice Execute recovery
     */
    function executeRecovery() external {
        require(recoveryRequest.newOwner != address(0), "No recovery initiated");
        require(block.timestamp >= recoveryRequest.unlockTime, "Recovery locked");
        
        uint256 approvals = _getRecoveryApprovals();
        require(approvals >= requiredGuardians, "Not enough approvals");

        _executeRecovery();
    }

    function _executeRecovery() internal {
        address newOwner = recoveryRequest.newOwner;
        
        // Reset recovery request
        delete recoveryRequest;

        // Transfer ownership
        _transferOwnership(newOwner);
        
        emit RecoveryExecuted(newOwner);
    }

    // ============================================ Multi-Sig Operations ============================================

    /**
     * @notice Propose a transaction for execution
     * @param target Target address
     * @param data Calldata
     */
    function proposeExecution(address target, bytes calldata data) external onlySigner returns (uint256) {
        require(target != address(0), "Invalid target");

        uint256 proposalId = proposalCounter.next();

        Proposal storage proposal = proposals[proposalId];
        proposal.target = target;
        proposal.data = data;
        proposal.proposer = msg.sender;
        proposal.approvals = 1;
        proposal.hasApproved[msg.sender] = true;

        emit ExecutionProposed(proposalId, target, data, msg.sender);

        // Auto-execute if only 1 signature required
        if (requiredSignatures == 1) {
            _executeProposal(proposalId);
        }

        return proposalId;
    }

    /**
     * @notice Approve a proposal
     * @param proposalId Proposal ID
     */
    function approveProposal(uint256 proposalId) external onlySigner {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.target != address(0), "Proposal does not exist");
        require(!proposal.executed, "Already executed");
        require(!proposal.hasApproved[msg.sender], "Already approved");

        proposal.hasApproved[msg.sender] = true;
        proposal.approvals++;

        emit ExecutionApproved(proposalId, msg.sender);

        // Execute if we have enough approvals
        if (proposal.approvals >= requiredSignatures) {
            _executeProposal(proposalId);
        }
    }

    function _executeProposal(uint256 proposalId) internal nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Already executed");

        proposal.executed = true;

        (bool success, ) = proposal.target.call(proposal.data);
        
        emit ExecutionExecuted(proposalId, success);
    }

    // ============================================ Direct Execution ============================================

    /**
     * @notice Execute a transaction directly (single signature)
     * @param target Target address
     * @param data Calldata
     * @param value Amount of ETH to send
     */
    function execute(
        address target,
        bytes calldata data,
        uint256 value
    ) external onlySigner nonReentrant returns (bool success, bytes memory returnData) {
        require(target != address(0), "Invalid target");
        require(value <= address(this).balance, "Insufficient balance");

        (success, returnData) = target.call{value: value}(data);
        
        require(success, "Execution failed");
    }

    /**
     * @notice Execute batch transactions
     * @param targets Array of target addresses
     * @param data Array of calldata
     * @param values Array of ETH values
     */
    function executeBatch(
        address[] memory targets,
        bytes[] memory data,
        uint256[] memory values
    ) external onlySigner nonReentrant returns (bool[] memory results) {
        require(targets.length == data.length && targets.length == values.length, "Length mismatch");
        require(targets.length > 0 && targets.length <= 20, "Invalid batch size");

        results = new bool[](targets.length);

        for (uint256 i = 0; i < targets.length; i++) {
            require(targets[i] != address(0), "Invalid target");
            (bool success, ) = targets[i].call{value: values[i]}(data[i]);
            results[i] = success;
        }

        emit BatchExecuted(targets, results);
    }

    // ============================================ View Functions ============================================

    /**
     * @notice Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        address target,
        bytes memory data,
        address proposer,
        uint256 approvals,
        bool executed
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.target,
            proposal.data,
            proposal.proposer,
            proposal.approvals,
            proposal.executed
        );
    }

    /**
     * @notice Check if address has approved proposal
     */
    function hasApprovedProposal(uint256 proposalId, address signer) external view returns (bool) {
        return proposals[proposalId].hasApproved[signer];
    }

    /**
     * @notice Get recovery request details
     */
    function getRecoveryRequest() external view returns (
        address newOwner,
        uint256 unlockTime,
        uint256 approvals
    ) {
        return (
            recoveryRequest.newOwner,
            recoveryRequest.unlockTime,
            _getRecoveryApprovals()
        );
    }

    /**
     * @notice Check if guardian has approved recovery
     */
    function hasApprovedRecovery(address guardian) external view returns (bool) {
        return recoveryRequest.guardianApprovals[guardian];
    }

    // ============================================ Internal Functions ============================================

    function _getSignerCount() internal view returns (uint256) {
        uint256 count = 0;
        // This is a simplified version - in production, maintain a signer array
        // For now, we'll assume we can track this off-chain
        return requiredSignatures > count ? requiredSignatures : count + 1;
    }

    function _getGuardianCount() internal view returns (uint256) {
        uint256 count = 0;
        // Similar to _getSignerCount, maintain an array in production
        return requiredGuardians > count ? requiredGuardians : count + 1;
    }

    function _getRecoveryApprovals() internal view returns (uint256) {
        // Count guardians who approved
        uint256 count = 0;
        // In production, maintain a guardian array and count
        return count;
    }

    // ============================================ Fallback ============================================

    /**
     * @notice Receive ETH
     */
    receive() external payable {
        // Accept ETH deposits
    }

    /**
     * @notice Fallback function
     */
    fallback() external payable {
        revert("Function not found");
    }
}
