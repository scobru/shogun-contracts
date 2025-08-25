// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title GunDBIntegrity
 * @dev Contratto minimale per verificare l'integrità dei dati GunDB
 */
contract Integrity {
    // Mapping: ID del dato -> hash originale
    mapping(bytes32 => bytes32) public dataHashes;

    // Eventi
    event DataRegistered(bytes32 indexed dataId, bytes32 dataHash);

    /**
     * @dev Registra l'hash di un dato
     * @param dataId ID univoco del dato
     * @param dataHash Hash del dato originale
     */
    function registerData(bytes32 dataId, bytes32 dataHash) external {
        require(dataHash != bytes32(0), "Hash non valido");
        require(dataHashes[dataId] == bytes32(0), "Dato gia' registrato");

        dataHashes[dataId] = dataHash;
        emit DataRegistered(dataId, dataHash);
    }

    /**
     * @dev Verifica l'integrità di un dato
     * @param dataId ID del dato
     * @param currentHash Hash attuale del dato
     * @return True se l'hash corrisponde
     */
    function verifyIntegrity(
        bytes32 dataId,
        bytes32 currentHash
    ) external view returns (bool) {
        return dataHashes[dataId] == currentHash;
    }

    /**
     * @dev Calcola l'hash di un dato
     * @param data Dati da hasciare
     * @return Hash dei dati
     */
    function calculateHash(
        bytes calldata data
    ) external pure returns (bytes32) {
        return keccak256(data);
    }
}
