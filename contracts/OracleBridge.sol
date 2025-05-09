// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice OracleBridge: pubblica una Merkle root per ogni epoch di ping
contract OracleBridge {
    mapping(uint256 => bytes32) public roots;
    address public immutable admin;
    event RootPublished(uint256 indexed epochId, bytes32 root);

    constructor() {
        admin = msg.sender;
    }

    /// @notice Pubblica la radice Merkle per un epoch
    function publishRoot(uint256 epochId, bytes32 root) external {
        require(msg.sender == admin, "OracleBridge: only admin");
        roots[epochId] = root;
        emit RootPublished(epochId, root);
    }
}