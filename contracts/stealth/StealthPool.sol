// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StealthPool
 * @dev Sistema di mixing privato per transazioni stealth
 *
 * Questo contratto implementa un pool stealth che:
 * 1. Utilizza commitment criptografici per la privacy
 * 2. Utilizza nonce casuali per prevenire replay attacks
 * 3. Utilizza Merkle tree per l'efficienza
 * 4. Auto-genera la Merkle root dai depositi
 * 5. Non richiede relayer - l'utente paga direttamente il gas
 */
contract StealthPool is ReentrancyGuard, Ownable {
    // =========================================== Events ============================================

    /// @dev Event emesso quando viene aggiornata la Merkle root
    event MerkleRootUpdated(
        bytes32 indexed oldRoot,
        bytes32 indexed newRoot,
        uint256 timestamp
    );

    /// @dev Event emesso quando viene effettuato un prelievo
    event Withdrawal(
        bytes32 indexed commitment,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );

    /// @dev Event emesso quando viene registrato un nuovo deposito
    event DepositRegistered(
        bytes32 indexed commitment,
        uint256 amount,
        uint256 timestamp
    );

    // ======================================= State variables =======================================

    /// @dev La Merkle root corrente che rappresenta tutti i depositi
    bytes32 public merkleRoot;

    /// @dev L'importo fisso per ogni deposito
    uint256 public immutable depositAmount;

    /// @dev Mapping per tracciare i commitment già spesi
    mapping(bytes32 => bool) public spentCommitments;

    /// @dev Mapping per tracciare i nonce utilizzati (previene replay attacks)
    mapping(bytes32 => bool) public usedNonces;

    /// @dev Contatore dei depositi totali
    uint256 public totalDeposits;

    /// @dev Array di tutti i commitment registrati
    bytes32[] public allCommitments;

    /// @dev Mapping per verificare se un commitment è registrato
    mapping(bytes32 => bool) public registeredCommitments;

    // ======================================= Constructor =======================================

    /**
     * @dev Costruttore del contratto
     * @param _depositAmount L'importo fisso per ogni deposito
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
     * @notice Funzione per prelevare fondi utilizzando un commitment e un nonce
     * @param _commitment Il commitment del deposito
     * @param _nonce Il nonce casuale per prevenire replay attacks
     * @param _recipient L'indirizzo destinatario dei fondi
     * @param _merkleProof La prova Merkle per dimostrare l'inclusione del commitment
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

        // 1. Verifica che il commitment sia registrato
        require(
            registeredCommitments[_commitment],
            "StealthPool: commitment not registered"
        );

        // 2. Verifica che il commitment non sia già stato speso
        require(
            !spentCommitments[_commitment],
            "StealthPool: commitment already spent"
        );

        // 3. Verifica che il nonce non sia già stato utilizzato
        require(!usedNonces[_nonce], "StealthPool: nonce already used");

        // 4. Verifica la Merkle proof usando la nostra implementazione personalizzata
        bool isValidProof = verifyMerkleProof(_commitment, _merkleProof);
        require(isValidProof, "StealthPool: invalid Merkle proof");

        // 5. Marca il commitment come speso e il nonce come utilizzato
        spentCommitments[_commitment] = true;
        usedNonces[_nonce] = true;

        // 6. Invia i fondi al destinatario (importo completo)
        (bool success, ) = _recipient.call{value: depositAmount}("");
        require(success, "StealthPool: transfer failed");

        // 7. Emetti l'evento
        emit Withdrawal(
            _commitment,
            _recipient,
            depositAmount,
            block.timestamp
        );
    }

    /**
     * @notice Registra un nuovo deposito e aggiorna la Merkle root
     * @param _commitment Il commitment del deposito
     */
    function registerDeposit(bytes32 _commitment) external {
        require(
            _commitment != bytes32(0),
            "StealthPool: commitment cannot be zero"
        );
        require(
            !registeredCommitments[_commitment],
            "StealthPool: commitment already registered"
        );

        // Registra il commitment
        allCommitments.push(_commitment);
        registeredCommitments[_commitment] = true;
        totalDeposits++;

        // Calcola e aggiorna la Merkle root
        bytes32 oldRoot = merkleRoot;
        merkleRoot = calculateMerkleRoot(allCommitments);

        emit DepositRegistered(_commitment, depositAmount, block.timestamp);
        emit MerkleRootUpdated(oldRoot, merkleRoot, block.timestamp);
    }

    // ======================================= Management Functions =======================================

    /**
     * @notice Permette al proprietario di prelevare ETH dal contratto in caso di emergenza
     * @param _amount L'importo da prelevare
     * @param _recipient Il destinatario dei fondi
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
     * @notice Verifica se un commitment è stato speso
     * @param _commitment Il commitment da verificare
     * @return True se il commitment è stato speso
     */
    function isCommitmentSpent(
        bytes32 _commitment
    ) external view returns (bool) {
        return spentCommitments[_commitment];
    }

    /**
     * @notice Verifica se un nonce è stato utilizzato
     * @param _nonce Il nonce da verificare
     * @return True se il nonce è stato utilizzato
     */
    function isNonceUsed(bytes32 _nonce) external view returns (bool) {
        return usedNonces[_nonce];
    }

    /**
     * @notice Verifica se un commitment è registrato
     * @param _commitment Il commitment da verificare
     * @return True se il commitment è registrato
     */
    function isCommitmentRegistered(
        bytes32 _commitment
    ) external view returns (bool) {
        return registeredCommitments[_commitment];
    }

    /**
     * @notice Ottiene il bilancio del contratto
     * @return Il bilancio in ETH
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Ottiene tutti i commitment registrati
     * @return Array di tutti i commitment
     */
    function getAllCommitments() external view returns (bytes32[] memory) {
        return allCommitments;
    }

    /**
     * @notice Ottiene il numero totale di commitment
     * @return Il numero di commitment
     */
    function getCommitmentCount() external view returns (uint256) {
        return allCommitments.length;
    }

    // ======================================= Helper Functions =======================================

    /**
     * @dev Calcola il commitment da una chiave pubblica e un nonce
     * @param _publicKey La chiave pubblica
     * @param _nonce Il nonce casuale
     * @return Il commitment calcolato
     */
    function calculateCommitment(
        bytes calldata _publicKey,
        bytes32 _nonce
    ) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(_publicKey, _nonce));
    }

    /**
     * @dev Calcola la Merkle root da un array di commitment
     * @param _commitments Array di commitment
     * @return La Merkle root calcolata
     */
    function calculateMerkleRoot(
        bytes32[] memory _commitments
    ) internal pure returns (bytes32) {
        if (_commitments.length == 0) {
            return bytes32(0);
        }

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
     * @dev Genera una Merkle proof per un commitment specifico
     * @param _commitment Il commitment per cui generare la proof
     * @return proof La Merkle proof generata
     * @return index L'indice del commitment nell'array
     */
    function generateMerkleProof(
        bytes32 _commitment
    ) external view returns (bytes32[] memory proof, uint256 index) {
        require(
            registeredCommitments[_commitment],
            "StealthPool: commitment not registered"
        );

        // Trova l'indice del commitment
        index = type(uint256).max;
        for (uint256 i = 0; i < allCommitments.length; i++) {
            if (allCommitments[i] == _commitment) {
                index = i;
                break;
            }
        }

        require(
            index != type(uint256).max,
            "StealthPool: commitment not found"
        );

        // Genera la proof
        proof = _generateProofInternal(allCommitments, index);
    }

    /**
     * @dev Genera una Merkle proof per un indice specifico
     * @param _commitments Array di commitment
     * @param _index Indice del commitment per cui generare la proof
     * @return proof La Merkle proof generata
     */
    function _generateProofInternal(
        bytes32[] memory _commitments,
        uint256 _index
    ) internal pure returns (bytes32[] memory) {
        require(_index < _commitments.length, "StealthPool: invalid index");

        // Calcola la lunghezza della proof (altezza dell'albero - 1)
        uint256 proofLength = 0;
        uint256 tempLength = _commitments.length;
        while (tempLength > 1) {
            proofLength++;
            tempLength = (tempLength + 1) / 2;
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
                    proofIndex++;
                }
            } else {
                // Indice dispari: il sibling è a sinistra
                proof[proofIndex] = currentLevel[currentIndex - 1];
                proofIndex++;
            }

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

        // Ridimensiona l'array proof per rimuovere gli elementi vuoti
        bytes32[] memory finalProof = new bytes32[](proofIndex);
        for (uint256 i = 0; i < proofIndex; i++) {
            finalProof[i] = proof[i];
        }

        return finalProof;
    }

    /**
     * @dev Verifica una Merkle proof per un commitment specifico
     * @param _commitment Il commitment da verificare
     * @param _proof La Merkle proof da verificare
     * @return True se la proof è valida
     */
    function verifyMerkleProof(
        bytes32 _commitment,
        bytes32[] calldata _proof
    ) internal view returns (bool) {
        bytes32 computedHash = _commitment;
        uint256 proofIndex = 0;

        // Trova l'indice del commitment nell'array
        uint256 commitmentIndex = type(uint256).max;
        for (uint256 i = 0; i < allCommitments.length; i++) {
            if (allCommitments[i] == _commitment) {
                commitmentIndex = i;
                break;
            }
        }

        if (commitmentIndex == type(uint256).max) {
            return false;
        }

        // Calcola il percorso nell'albero
        uint256 currentIndex = commitmentIndex;
        bytes32[] memory currentLevel = allCommitments;

        while (currentLevel.length > 1) {
            if (currentIndex % 2 == 0) {
                // Indice pari: il sibling è a destra
                if (currentIndex + 1 < currentLevel.length) {
                    if (proofIndex >= _proof.length) {
                        return false;
                    }
                    computedHash = keccak256(
                        abi.encodePacked(computedHash, _proof[proofIndex])
                    );
                    proofIndex++;
                }
                // Se non c'è sibling a destra, non fare nulla (foglia singola)
            } else {
                // Indice dispari: il sibling è a sinistra
                if (proofIndex >= _proof.length) {
                    return false;
                }
                computedHash = keccak256(
                    abi.encodePacked(_proof[proofIndex], computedHash)
                );
                proofIndex++;
            }

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

        // Verifica che tutte le proof siano state utilizzate
        if (proofIndex != _proof.length) {
            return false;
        }

        return computedHash == merkleRoot;
    }

    // ======================================= Receive Function =======================================

    /**
     * @dev Permette al contratto di ricevere ETH
     */
    receive() external payable {
        // Il contratto può ricevere ETH per i depositi
    }
}
