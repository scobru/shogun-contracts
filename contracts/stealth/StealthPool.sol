// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
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
 * 4. Non richiede relayer - l'utente paga direttamente il gas
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

    /// @dev Indirizzo del gestore che può aggiornare la Merkle root
    address public merkleManager;

    // ======================================= Modifiers =======================================

    /// @dev Modifier per verificare che solo il merkleManager possa aggiornare la root
    modifier onlyMerkleManager() {
        require(
            msg.sender == merkleManager,
            "StealthPool: only merkle manager"
        );
        _;
    }

    // ======================================= Constructor =======================================

    /**
     * @dev Costruttore del contratto
     * @param _depositAmount L'importo fisso per ogni deposito
     * @param _merkleManager L'indirizzo del gestore della Merkle root
     */
    constructor(
        uint256 _depositAmount,
        address _merkleManager
    ) Ownable(msg.sender) {
        require(
            _depositAmount > 0,
            "StealthPool: deposit amount must be positive"
        );
        require(
            _merkleManager != address(0),
            "StealthPool: merkle manager cannot be zero"
        );

        depositAmount = _depositAmount;
        merkleManager = _merkleManager;
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

        // 1. Verifica che il commitment non sia già stato speso
        require(
            !spentCommitments[_commitment],
            "StealthPool: commitment already spent"
        );

        // 2. Verifica che il nonce non sia già stato utilizzato
        require(!usedNonces[_nonce], "StealthPool: nonce already used");

        // 3. Verifica la Merkle proof
        bool isValidProof = MerkleProof.verify(
            _merkleProof,
            merkleRoot,
            _commitment
        );
        require(isValidProof, "StealthPool: invalid Merkle proof");

        // 4. Marca il commitment come speso e il nonce come utilizzato
        spentCommitments[_commitment] = true;
        usedNonces[_nonce] = true;

        // 5. Invia i fondi al destinatario (importo completo)
        (bool success, ) = _recipient.call{value: depositAmount}("");
        require(success, "StealthPool: transfer failed");

        // 6. Emetti l'evento
        emit Withdrawal(
            _commitment,
            _recipient,
            depositAmount,
            block.timestamp
        );
    }

    /**
     * @notice Aggiorna la Merkle root (solo per il merkleManager)
     * @param _newRoot La nuova Merkle root
     */
    function updateMerkleRoot(bytes32 _newRoot) external onlyMerkleManager {
        bytes32 oldRoot = merkleRoot;
        merkleRoot = _newRoot;

        emit MerkleRootUpdated(oldRoot, _newRoot, block.timestamp);
    }

    /**
     * @notice Registra un nuovo deposito (solo per il merkleManager)
     * @param _commitment Il commitment del deposito
     */
    function registerDeposit(bytes32 _commitment) external onlyMerkleManager {
        totalDeposits++;
        emit DepositRegistered(_commitment, depositAmount, block.timestamp);
    }

    // ======================================= Management Functions =======================================

    /**
     * @notice Cambia il merkle manager (solo per il proprietario)
     * @param _newManager Il nuovo indirizzo del merkle manager
     */
    function setMerkleManager(address _newManager) external onlyOwner {
        require(
            _newManager != address(0),
            "StealthPool: new manager cannot be zero"
        );
        merkleManager = _newManager;
    }

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
     * @notice Ottiene il bilancio del contratto
     * @return Il bilancio in ETH
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
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
     * @dev Calcola il commitment da una chiave pubblica (per compatibilità)
     * @param _publicKey La chiave pubblica
     * @return Il commitment calcolato
     */
    function calculateCommitmentFromPublicKey(
        bytes calldata _publicKey
    ) external pure returns (bytes32) {
        return keccak256(_publicKey);
    }

    // ======================================= Receive Function =======================================

    /**
     * @dev Permette al contratto di ricevere ETH
     */
    receive() external payable {
        // Il contratto può ricevere ETH per i depositi
    }
}
