// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title MerkleTreeManager
 * @dev Helper contract per gestire Merkle tree e generare proof
 *
 * Questo contratto fornisce funzioni per:
 * 1. Calcolare Merkle root da una lista di commitment
 * 2. Generare Merkle proof per un commitment specifico
 * 3. Verificare Merkle proof
 * 4. Gestire l'aggiunta di nuovi commitment all'albero
 */
contract MerkleTreeManager {
    // =========================================== Events ============================================

    /// @dev Event emesso quando viene calcolata una nuova Merkle root
    event MerkleRootCalculated(
        bytes32 indexed root,
        uint256 leafCount,
        uint256 timestamp
    );

    // ======================================= Core Functions =======================================

    /**
     * @notice Calcola la Merkle root da una lista di commitment
     * @param _commitments Array di commitment (foglie dell'albero)
     * @return La Merkle root calcolata
     */
    function calculateMerkleRoot(
        bytes32[] calldata _commitments
    ) external pure returns (bytes32) {
        require(
            _commitments.length > 0,
            "MerkleTreeManager: empty commitments array"
        );

        if (_commitments.length == 1) {
            return _commitments[0];
        }

        bytes32[] memory currentLevel = _commitments;

        while (currentLevel.length > 1) {
            bytes32[] memory nextLevel = new bytes32[](
                (currentLevel.length + 1) / 2
            );

            for (uint256 i = 0; i < currentLevel.length; i += 2) {
                if (i + 1 < currentLevel.length) {
                    // Coppia di foglie: calcola hash delle due foglie
                    nextLevel[i / 2] = keccak256(
                        abi.encodePacked(currentLevel[i], currentLevel[i + 1])
                    );
                } else {
                    // Foglia singola: usa la foglia stessa
                    nextLevel[i / 2] = currentLevel[i];
                }
            }

            currentLevel = nextLevel;
        }

        return currentLevel[0];
    }

    /**
     * @notice Genera una Merkle proof per un commitment specifico
     * @param _commitments Array di tutti i commitment nell'albero
     * @param _targetCommitment Il commitment per cui generare la proof
     * @return proof La Merkle proof generata
     * @return index L'indice del commitment nell'array
     */
    function generateMerkleProof(
        bytes32[] calldata _commitments,
        bytes32 _targetCommitment
    ) external pure returns (bytes32[] memory proof, uint256 index) {
        require(
            _commitments.length > 0,
            "MerkleTreeManager: empty commitments array"
        );

        // Trova l'indice del commitment target
        index = type(uint256).max;
        for (uint256 i = 0; i < _commitments.length; i++) {
            if (_commitments[i] == _targetCommitment) {
                index = i;
                break;
            }
        }

        require(
            index != type(uint256).max,
            "MerkleTreeManager: commitment not found"
        );

        // Genera la proof
        proof = _generateProofInternal(_commitments, index);
    }

    /**
     * @notice Verifica una Merkle proof
     * @param _proof La Merkle proof da verificare
     * @param _root La Merkle root
     * @param _leaf La foglia (commitment) da verificare
     * @return True se la proof è valida
     */
    function verifyMerkleProof(
        bytes32[] calldata _proof,
        bytes32 _root,
        bytes32 _leaf
    ) external pure returns (bool) {
        return MerkleProof.verify(_proof, _root, _leaf);
    }

    /**
     * @notice Calcola la Merkle root da una lista di chiavi pubbliche
     * @param _publicKeys Array di chiavi pubbliche
     * @return La Merkle root calcolata
     */
    function calculateMerkleRootFromPublicKeys(
        bytes[] calldata _publicKeys
    ) external pure returns (bytes32) {
        require(
            _publicKeys.length > 0,
            "MerkleTreeManager: empty public keys array"
        );

        bytes32[] memory commitments = new bytes32[](_publicKeys.length);

        for (uint256 i = 0; i < _publicKeys.length; i++) {
            commitments[i] = keccak256(_publicKeys[i]);
        }

        return _calculateMerkleRoot(commitments);
    }

    /**
     * @notice Genera una Merkle proof per una chiave pubblica specifica
     * @param _publicKeys Array di tutte le chiavi pubbliche
     * @param _targetPublicKey La chiave pubblica per cui generare la proof
     * @return proof La Merkle proof generata
     * @return index L'indice della chiave pubblica nell'array
     */
    function generateMerkleProofForPublicKey(
        bytes[] calldata _publicKeys,
        bytes calldata _targetPublicKey
    ) external pure returns (bytes32[] memory proof, uint256 index) {
        require(
            _publicKeys.length > 0,
            "MerkleTreeManager: empty public keys array"
        );

        bytes32 targetCommitment = keccak256(_targetPublicKey);

        // Trova l'indice della chiave pubblica target
        index = type(uint256).max;
        for (uint256 i = 0; i < _publicKeys.length; i++) {
            if (keccak256(_publicKeys[i]) == targetCommitment) {
                index = i;
                break;
            }
        }

        require(
            index != type(uint256).max,
            "MerkleTreeManager: public key not found"
        );

        // Genera la proof
        proof = _generateProofFromPublicKeys(_publicKeys, index);
    }

    // ======================================= Helper Functions =======================================

    /**
     * @dev Genera una Merkle proof per un indice specifico
     * @param _commitments Array di commitment
     * @param _index Indice del commitment per cui generare la proof
     * @return proof La Merkle proof generata
     */
    function _generateProof(
        bytes32[] calldata _commitments,
        uint256 _index
    ) internal pure returns (bytes32[] memory) {
        require(
            _index < _commitments.length,
            "MerkleTreeManager: invalid index"
        );

        uint256 proofLength = 0;
        uint256 tempIndex = _index;

        // Calcola la lunghezza della proof
        while (tempIndex > 0 || tempIndex < _commitments.length - 1) {
            proofLength++;
            tempIndex = tempIndex / 2;
        }

        bytes32[] memory proof = new bytes32[](proofLength);
        uint256 proofIndex = 0;
        uint256 currentIndex = _index;
        bytes32[] memory currentLevel = _commitments;

        while (currentLevel.length > 1) {
            if (currentIndex % 2 == 0) {
                // Indice pari: il sibling è a destra
                if (currentIndex + 1 < currentLevel.length) {
                    proof[proofIndex] = currentLevel[currentIndex + 1];
                }
            } else {
                // Indice dispari: il sibling è a sinistra
                proof[proofIndex] = currentLevel[currentIndex - 1];
            }

            proofIndex++;
            currentIndex = currentIndex / 2;

            // Calcola il livello successivo
            bytes32[] memory nextLevel = new bytes32[](
                (currentLevel.length + 1) / 2
            );
            for (uint256 i = 0; i < currentLevel.length; i += 2) {
                if (i + 1 < currentLevel.length) {
                    nextLevel[i / 2] = keccak256(
                        abi.encodePacked(currentLevel[i], currentLevel[i + 1])
                    );
                } else {
                    nextLevel[i / 2] = currentLevel[i];
                }
            }
            currentLevel = nextLevel;
        }

        return proof;
    }

    /**
     * @dev Genera una Merkle proof per una chiave pubblica specifica
     * @param _publicKeys Array di chiavi pubbliche
     * @param _index Indice della chiave pubblica per cui generare la proof
     * @return La Merkle proof
     */
    function _generateProofFromPublicKeys(
        bytes[] calldata _publicKeys,
        uint256 _index
    ) internal pure returns (bytes32[] memory) {
        require(
            _index < _publicKeys.length,
            "MerkleTreeManager: invalid index"
        );

        // Converti le chiavi pubbliche in commitment
        bytes32[] memory commitments = new bytes32[](_publicKeys.length);
        for (uint256 i = 0; i < _publicKeys.length; i++) {
            commitments[i] = keccak256(_publicKeys[i]);
        }

        return _generateProofInternal(commitments, _index);
    }

    /**
     * @dev Genera una Merkle proof per un indice specifico (versione interna con memory)
     * @param _commitments Array di commitment
     * @param _index Indice del commitment per cui generare la proof
     * @return proof La Merkle proof generata
     */
    function _generateProofInternal(
        bytes32[] memory _commitments,
        uint256 _index
    ) internal pure returns (bytes32[] memory) {
        require(
            _index < _commitments.length,
            "MerkleTreeManager: invalid index"
        );

        uint256 proofLength = 0;
        uint256 tempIndex = _index;

        // Calcola la lunghezza della proof
        while (tempIndex > 0 || tempIndex < _commitments.length - 1) {
            proofLength++;
            tempIndex = tempIndex / 2;
        }

        bytes32[] memory proof = new bytes32[](proofLength);
        uint256 proofIndex = 0;
        uint256 currentIndex = _index;
        bytes32[] memory currentLevel = _commitments;

        while (currentLevel.length > 1) {
            if (currentIndex % 2 == 0) {
                // Indice pari: il sibling è a destra
                if (currentIndex + 1 < currentLevel.length) {
                    proof[proofIndex] = currentLevel[currentIndex + 1];
                }
            } else {
                // Indice dispari: il sibling è a sinistra
                proof[proofIndex] = currentLevel[currentIndex - 1];
            }

            proofIndex++;
            currentIndex = currentIndex / 2;

            // Calcola il livello successivo
            bytes32[] memory nextLevel = new bytes32[](
                (currentLevel.length + 1) / 2
            );
            for (uint256 i = 0; i < currentLevel.length; i += 2) {
                if (i + 1 < currentLevel.length) {
                    nextLevel[i / 2] = keccak256(
                        abi.encodePacked(currentLevel[i], currentLevel[i + 1])
                    );
                } else {
                    nextLevel[i / 2] = currentLevel[i];
                }
            }
            currentLevel = nextLevel;
        }

        return proof;
    }

    /**
     * @notice Calcola il commitment da una chiave pubblica
     * @param _publicKey La chiave pubblica
     * @return commitment Il commitment calcolato
     */
    function calculateCommitment(
        bytes calldata _publicKey
    ) external pure returns (bytes32) {
        return keccak256(_publicKey);
    }

    /**
     * @notice Verifica se un commitment è presente in una lista
     * @param _commitments Array di commitment
     * @param _targetCommitment Il commitment da cercare
     * @return True se il commitment è presente
     */
    function isCommitmentInList(
        bytes32[] calldata _commitments,
        bytes32 _targetCommitment
    ) external pure returns (bool) {
        for (uint256 i = 0; i < _commitments.length; i++) {
            if (_commitments[i] == _targetCommitment) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Calcola la Merkle root da una lista di commitment (versione interna)
     * @param _commitments Array di commitment (foglie dell'albero)
     * @return La Merkle root calcolata
     */
    function _calculateMerkleRoot(
        bytes32[] memory _commitments
    ) internal pure returns (bytes32) {
        require(
            _commitments.length > 0,
            "MerkleTreeManager: empty commitments array"
        );

        if (_commitments.length == 1) {
            return _commitments[0];
        }

        bytes32[] memory currentLevel = _commitments;

        while (currentLevel.length > 1) {
            bytes32[] memory nextLevel = new bytes32[](
                (currentLevel.length + 1) / 2
            );

            for (uint256 i = 0; i < currentLevel.length; i += 2) {
                if (i + 1 < currentLevel.length) {
                    // Coppia di foglie: calcola hash delle due foglie
                    nextLevel[i / 2] = keccak256(
                        abi.encodePacked(currentLevel[i], currentLevel[i + 1])
                    );
                } else {
                    // Foglia singola: usa la foglia stessa
                    nextLevel[i / 2] = currentLevel[i];
                }
            }

            currentLevel = nextLevel;
        }

        return currentLevel[0];
    }
}
