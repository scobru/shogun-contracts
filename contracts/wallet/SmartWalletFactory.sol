// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./SmartWallet.sol";

/**
 * @title SmartWalletFactory
 * @dev Factory contract for creating smart wallets
 */
contract SmartWalletFactory {
    // ============================================ Events ============================================

    event WalletCreated(
        address indexed wallet,
        address indexed owner,
        uint256 indexed walletIndex
    );

    // ============================================ State Variables ============================================

    SmartWallet[] public wallets;
    mapping(address => uint256[]) public ownerWallets;
    mapping(address => address) public walletToOwner;

    // ============================================ Functions ============================================

    /**
     * @notice Create a new smart wallet
     * @param owner Owner address
     * @param requiredSignatures Required signatures for multi-sig
     * @param requiredGuardians Required guardians for recovery
     * @return wallet Address of the created wallet
     */
    function createWallet(
        address owner,
        uint256 requiredSignatures,
        uint256 requiredGuardians
    ) external returns (address wallet) {
        SmartWallet newWallet = new SmartWallet(
            owner,
            requiredSignatures,
            requiredGuardians
        );

        wallet = address(newWallet);
        wallets.push(newWallet);
        ownerWallets[owner].push(wallets.length - 1);
        walletToOwner[wallet] = owner;

        emit WalletCreated(wallet, owner, wallets.length - 1);

        return wallet;
    }

    /**
     * @notice Create a wallet with guardians
     * @param owner Owner address
     * @param guardians Array of guardian addresses
     * @param requiredSignatures Required signatures for multi-sig
     * @param requiredGuardians Required guardians for recovery
     * @return wallet Address of the created wallet
     */
    function createWalletWithGuardians(
        address owner,
        address[] memory guardians,
        uint256 requiredSignatures,
        uint256 requiredGuardians
    ) external returns (address wallet) {
        SmartWallet newWallet = new SmartWallet(
            owner,
            requiredSignatures,
            requiredGuardians
        );

        wallet = address(newWallet);

        // Add guardians
        for (uint256 i = 0; i < guardians.length; i++) {
            newWallet.addGuardian(guardians[i]);
        }

        wallets.push(newWallet);
        ownerWallets[owner].push(wallets.length - 1);
        walletToOwner[wallet] = owner;

        emit WalletCreated(wallet, owner, wallets.length - 1);

        return wallet;
    }

    /**
     * @notice Get total number of wallets created
     */
    function getWalletCount() external view returns (uint256) {
        return wallets.length;
    }

    /**
     * @notice Get all wallets owned by an address
     */
    function getOwnerWallets(address owner) external view returns (address[] memory) {
        uint256[] memory indices = ownerWallets[owner];
        address[] memory ownerWalletsList = new address[](indices.length);

        for (uint256 i = 0; i < indices.length; i++) {
            ownerWalletsList[i] = address(wallets[indices[i]]);
        }

        return ownerWalletsList;
    }

    /**
     * @notice Check if an address owns a wallet
     */
    function isWalletOwner(address wallet, address owner) external view returns (bool) {
        return walletToOwner[wallet] == owner;
    }

    /**
     * @notice Get wallet by index
     */
    function getWallet(uint256 index) external view returns (address) {
        require(index < wallets.length, "Index out of bounds");
        return address(wallets[index]);
    }
}
