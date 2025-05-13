// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title DID Registry
/// @notice A simple registry for storing Decentralized Identifiers (DIDs) with their controllers
contract DIDRegistry {
    // Mapping from DID to its controller
    mapping(string => string) private controllers;

    // Event emitted when a DID is registered or updated
    event DIDRegistered(string indexed did, string controller);

    /// @notice Register or update a DID with a controller
    /// @param did The decentralized identifier to register
    /// @param controller The controller associated with the DID
    /// @return success True if the registration succeeded
    function registerDID(string memory did, string memory controller) public returns (bool success) {
        require(bytes(did).length > 0, "DID cannot be empty");
        require(bytes(controller).length > 0, "Controller cannot be empty");

        controllers[did] = controller;
        emit DIDRegistered(did, controller);

        return true;
    }

    /// @notice Fetches the controller of a given DID
    /// @param did The decentralized identifier to query
    /// @return controller The controller associated with the DID
    function getController(string memory did) public view returns (string memory controller) {
        require(bytes(did).length > 0, "DID cannot be empty");
        return controllers[did];
    }
    
}
