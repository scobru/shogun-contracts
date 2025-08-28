// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title StorageVerifier
 * @dev Contratto per verificare che i relay mantengano effettivamente i file IPFS
 * caricati dagli utenti. Implementa un sistema di challenge-response con prove
 * criptografiche e reputazione dei relay.
 */
contract StorageVerifier is Ownable, ReentrancyGuard {
    // Riferimento al contratto RelayPaymentRouter
    address public relayPaymentRouter;

    // Struttura per rappresentare una prova di storage
    struct StorageProof {
        bytes32 fileHash; // Hash del file IPFS (CID)
        uint256 timestamp; // Timestamp della prova
        bytes32 proofHash; // Hash della prova criptografica
        bool verified; // Se la prova è stata verificata
        uint256 challengeCount; // Numero di sfide superate
        uint256 lastVerified; // Ultimo timestamp di verifica
    }

    // Struttura per rappresentare una sfida di storage
    struct StorageChallenge {
        bytes32 fileHash; // Hash del file da verificare
        uint256 challengeTime; // Timestamp della sfida
        uint256 responseDeadline; // Deadline per la risposta
        bool responded; // Se il relay ha risposto
        bool successful; // Se la risposta è stata valida
        address challenger; // Chi ha lanciato la sfida
        uint256 challengeId; // ID univoco della sfida
    }

    // Struttura per la reputazione del relay
    struct RelayReputation {
        uint256 score; // Punteggio di reputazione (0-1000)
        uint256 totalChallenges; // Numero totale di sfide
        uint256 successfulChallenges; // Sfide superate con successo
        uint256 failedChallenges; // Sfide fallite
        uint256 lastActivity; // Ultima attività
        bool isBlacklisted; // Se il relay è stato blacklistato
    }

    // Configurazione del sistema
    uint256 public constant CHALLENGE_TIMEOUT = 1 hours; // Timeout per rispondere
    uint256 public constant PROOF_VALIDITY_PERIOD = 24 hours; // Periodo di validità prova
    uint256 public constant MAX_CHALLENGES_PER_FILE = 10; // Max sfide per file
    uint256 public constant REPUTATION_PENALTY = 50; // Penalità per fallimento
    uint256 public constant REPUTATION_REWARD = 10; // Ricompensa per successo
    uint256 public constant MIN_REPUTATION_SCORE = 100; // Score minimo per essere attivo

    // Mappings per gestire i dati
    mapping(address => mapping(bytes32 => StorageProof)) public storageProofs;
    mapping(address => StorageChallenge[]) public activeChallenges;
    mapping(address => RelayReputation) public relayReputations;
    mapping(address => mapping(bytes32 => uint256)) public fileChallengeCount;
    mapping(uint256 => StorageChallenge) public challengesById;

    // Contatori e stati
    uint256 public totalChallengesIssued;
    uint256 public totalProofsSubmitted;
    mapping(address => uint256) public relayChallengeCount;

    // Eventi
    event StorageProofSubmitted(
        address indexed relay,
        bytes32 indexed fileHash,
        bytes32 proofHash,
        uint256 timestamp
    );

    event StorageChallengeIssued(
        uint256 indexed challengeId,
        address indexed relay,
        bytes32 indexed fileHash,
        address challenger,
        uint256 deadline
    );

    event StorageChallengeResponded(
        uint256 indexed challengeId,
        address indexed relay,
        bytes32 indexed fileHash,
        bool successful,
        bytes32 proofHash
    );

    event StorageChallengeFailed(
        uint256 indexed challengeId,
        address indexed relay,
        bytes32 indexed fileHash,
        string reason
    );

    event RelayReputationUpdated(
        address indexed relay,
        uint256 oldScore,
        uint256 newScore,
        bool isBlacklisted
    );

    event RelayBlacklisted(address indexed relay, string reason);
    event RelayWhitelisted(address indexed relay);

    // Modificatori
    modifier onlyRelayPaymentRouter() {
        require(
            msg.sender == relayPaymentRouter,
            "Only relay payment router can call this"
        );
        _;
    }

    modifier onlyActiveRelay(address relay) {
        require(!relayReputations[relay].isBlacklisted, "Relay is blacklisted");
        require(
            relayReputations[relay].score >= MIN_REPUTATION_SCORE,
            "Relay reputation too low"
        );
        _;
    }

    modifier challengeExists(uint256 challengeId) {
        require(
            challengesById[challengeId].challengeTime > 0,
            "Challenge does not exist"
        );
        _;
    }

    modifier challengeNotExpired(uint256 challengeId) {
        require(
            block.timestamp <= challengesById[challengeId].responseDeadline,
            "Challenge has expired"
        );
        _;
    }

    modifier challengeNotResponded(uint256 challengeId) {
        require(
            !challengesById[challengeId].responded,
            "Challenge already responded"
        );
        _;
    }

    /**
     * @dev Costruttore del contratto
     * @param _relayPaymentRouter Indirizzo del contratto RelayPaymentRouter
     */
    constructor(address _relayPaymentRouter) Ownable(msg.sender) {
        require(
            _relayPaymentRouter != address(0),
            "Invalid relay payment router address"
        );
        relayPaymentRouter = _relayPaymentRouter;
    }

    /**
     * @dev Inizializza la reputazione di un relay (chiamato dal RelayPaymentRouter)
     * @param relay Indirizzo del relay
     */
    function initializeRelayReputation(
        address relay
    ) external onlyRelayPaymentRouter {
        if (relayReputations[relay].lastActivity == 0) {
            relayReputations[relay] = RelayReputation({
                score: 500, // Score iniziale medio
                totalChallenges: 0,
                successfulChallenges: 0,
                failedChallenges: 0,
                lastActivity: block.timestamp,
                isBlacklisted: false
            });
        }
    }

    /**
     * @dev Permette a un relay di sottomettere una prova di storage
     * @param fileHash Hash del file IPFS (CID)
     * @param proofHash Hash della prova criptografica
     */
    function submitStorageProof(
        bytes32 fileHash,
        bytes32 proofHash
    ) external onlyActiveRelay(msg.sender) nonReentrant {
        require(fileHash != bytes32(0), "Invalid file hash");
        require(proofHash != bytes32(0), "Invalid proof hash");

        // Aggiorna o crea la prova di storage
        storageProofs[msg.sender][fileHash] = StorageProof({
            fileHash: fileHash,
            timestamp: block.timestamp,
            proofHash: proofHash,
            verified: true,
            challengeCount: storageProofs[msg.sender][fileHash].challengeCount,
            lastVerified: block.timestamp
        });

        // Aggiorna la reputazione
        _updateRelayReputation(msg.sender, REPUTATION_REWARD, true);

        totalProofsSubmitted++;

        emit StorageProofSubmitted(
            msg.sender,
            fileHash,
            proofHash,
            block.timestamp
        );
    }

    /**
     * @dev Permette a un utente di sfidare un relay a dimostrare la disponibilità di un file
     * @param relay Indirizzo del relay da sfidare
     * @param fileHash Hash del file da verificare
     */
    function challengeStorage(
        address relay,
        bytes32 fileHash
    ) external nonReentrant {
        require(relay != address(0), "Invalid relay address");
        require(fileHash != bytes32(0), "Invalid file hash");
        require(relay != msg.sender, "Cannot challenge yourself");

        // Verifica che il relay sia attivo
        require(!relayReputations[relay].isBlacklisted, "Relay is blacklisted");

        // Verifica che non ci siano troppe sfide per questo file
        require(
            fileChallengeCount[relay][fileHash] < MAX_CHALLENGES_PER_FILE,
            "Too many challenges for this file"
        );

        // Crea una nuova sfida
        uint256 challengeId = totalChallengesIssued + 1;
        StorageChallenge memory newChallenge = StorageChallenge({
            fileHash: fileHash,
            challengeTime: block.timestamp,
            responseDeadline: block.timestamp + CHALLENGE_TIMEOUT,
            responded: false,
            successful: false,
            challenger: msg.sender,
            challengeId: challengeId
        });

        // Salva la sfida
        activeChallenges[relay].push(newChallenge);
        challengesById[challengeId] = newChallenge;

        // Aggiorna i contatori
        totalChallengesIssued++;
        relayChallengeCount[relay]++;
        fileChallengeCount[relay][fileHash]++;

        emit StorageChallengeIssued(
            challengeId,
            relay,
            fileHash,
            msg.sender,
            newChallenge.responseDeadline
        );
    }

    /**
     * @dev Permette a un relay di rispondere a una sfida di storage
     * @param challengeId ID della sfida
     * @param proofHash Hash della prova di disponibilità del file
     */
    function respondToChallenge(
        uint256 challengeId,
        bytes32 proofHash
    )
        external
        challengeExists(challengeId)
        challengeNotExpired(challengeId)
        challengeNotResponded(challengeId)
        onlyActiveRelay(msg.sender)
        nonReentrant
    {
        StorageChallenge storage challenge = challengesById[challengeId];
        require(challenge.fileHash != bytes32(0), "Invalid challenge");

        // Verifica che il relay sia il destinatario della sfida
        // (troviamo la sfida nell'array activeChallenges)
        bool found = false;
        for (uint256 i = 0; i < activeChallenges[msg.sender].length; i++) {
            if (activeChallenges[msg.sender][i].challengeId == challengeId) {
                found = true;
                break;
            }
        }
        require(found, "Challenge not found for this relay");

        // Verifica la prova (implementazione semplificata)
        bool proofValid = _verifyStorageProof(challenge.fileHash, proofHash);

        // Aggiorna lo stato della sfida
        challenge.responded = true;
        challenge.successful = proofValid;

        // Aggiorna la reputazione del relay
        if (proofValid) {
            _updateRelayReputation(msg.sender, REPUTATION_REWARD, true);
            // Aggiorna la prova di storage
            storageProofs[msg.sender][challenge.fileHash].lastVerified = block
                .timestamp;
            storageProofs[msg.sender][challenge.fileHash].challengeCount++;
        } else {
            _updateRelayReputation(msg.sender, REPUTATION_PENALTY, false);
        }

        emit StorageChallengeResponded(
            challengeId,
            msg.sender,
            challenge.fileHash,
            proofValid,
            proofHash
        );
    }

    /**
     * @dev Verifica automatica delle sfide scadute
     * @param relay Indirizzo del relay
     * @param challengeIndexes Array degli indici delle sfide da verificare
     */
    function checkExpiredChallenges(
        address relay,
        uint256[] calldata challengeIndexes
    ) external nonReentrant {
        require(challengeIndexes.length > 0, "No challenges to check");

        for (uint256 i = 0; i < challengeIndexes.length; i++) {
            uint256 index = challengeIndexes[i];
            require(
                index < activeChallenges[relay].length,
                "Invalid challenge index"
            );

            StorageChallenge storage challenge = activeChallenges[relay][index];

            if (
                !challenge.responded &&
                block.timestamp > challenge.responseDeadline
            ) {
                // Sfida scaduta senza risposta
                challenge.responded = true;
                challenge.successful = false;

                // Penalizza il relay
                _updateRelayReputation(relay, REPUTATION_PENALTY * 2, false);

                emit StorageChallengeFailed(
                    challenge.challengeId,
                    relay,
                    challenge.fileHash,
                    "Challenge expired without response"
                );
            }
        }
    }

    /**
     * @dev Verifica se un relay ha una prova di storage valida per un file
     * @param relay Indirizzo del relay
     * @param fileHash Hash del file
     * @return bool True se il relay ha una prova valida
     */
    function hasValidStorageProof(
        address relay,
        bytes32 fileHash
    ) external view returns (bool) {
        StorageProof memory proof = storageProofs[relay][fileHash];
        return
            proof.verified &&
            (block.timestamp - proof.lastVerified) <= PROOF_VALIDITY_PERIOD;
    }

    /**
     * @dev Ottiene la reputazione di un relay
     * @param relay Indirizzo del relay
     * @return score Punteggio di reputazione
     * @return totalChallenges Numero totale di sfide
     * @return successfulChallenges Sfide superate
     * @return failedChallenges Sfide fallite
     * @return isBlacklisted Se il relay è blacklistato
     */
    function getRelayReputation(
        address relay
    )
        external
        view
        returns (
            uint256 score,
            uint256 totalChallenges,
            uint256 successfulChallenges,
            uint256 failedChallenges,
            bool isBlacklisted
        )
    {
        RelayReputation memory rep = relayReputations[relay];
        return (
            rep.score,
            rep.totalChallenges,
            rep.successfulChallenges,
            rep.failedChallenges,
            rep.isBlacklisted
        );
    }

    /**
     * @dev Ottiene le sfide attive di un relay
     * @param relay Indirizzo del relay
     * @return Array delle sfide attive
     */
    function getActiveChallenges(
        address relay
    ) external view returns (StorageChallenge[] memory) {
        return activeChallenges[relay];
    }

    /**
     * @dev Ottiene i dettagli di una sfida specifica
     * @param challengeId ID della sfida
     * @return Dettagli della sfida
     */
    function getChallenge(
        uint256 challengeId
    ) external view returns (StorageChallenge memory) {
        return challengesById[challengeId];
    }

    /**
     * @dev Funzione di amministrazione per blacklistare un relay
     * @param relay Indirizzo del relay
     * @param reason Motivo del blacklist
     */
    function blacklistRelay(
        address relay,
        string calldata reason
    ) external onlyOwner {
        require(relay != address(0), "Invalid relay address");
        require(
            !relayReputations[relay].isBlacklisted,
            "Relay already blacklisted"
        );

        relayReputations[relay].isBlacklisted = true;

        emit RelayBlacklisted(relay, reason);
        emit RelayReputationUpdated(
            relay,
            relayReputations[relay].score,
            0,
            true
        );
    }

    /**
     * @dev Funzione di amministrazione per rimuovere un relay dal blacklist
     * @param relay Indirizzo del relay
     */
    function whitelistRelay(address relay) external onlyOwner {
        require(relay != address(0), "Invalid relay address");
        require(relayReputations[relay].isBlacklisted, "Relay not blacklisted");

        relayReputations[relay].isBlacklisted = false;

        emit RelayWhitelisted(relay);
        emit RelayReputationUpdated(
            relay,
            0,
            relayReputations[relay].score,
            false
        );
    }

    /**
     * @dev Aggiorna l'indirizzo del RelayPaymentRouter (solo owner)
     * @param newRouter Nuovo indirizzo del router
     */
    function updateRelayPaymentRouter(address newRouter) external onlyOwner {
        require(newRouter != address(0), "Invalid router address");
        relayPaymentRouter = newRouter;
    }

    /**
     * @dev Funzione interna per verificare una prova di storage
     * @param fileHash Hash del file
     * @param proofHash Hash della prova
     * @return bool True se la prova è valida
     */
    function _verifyStorageProof(
        bytes32 fileHash,
        bytes32 proofHash
    ) internal pure returns (bool) {
        // Implementazione semplificata: verifica che la prova non sia vuota
        // In una implementazione reale, qui andrebbe la logica di verifica criptografica
        if (proofHash == bytes32(0)) {
            return false;
        }

        // Verifica che la prova sia correlata al file
        // Questo è un esempio semplificato - in realtà dovrebbe essere più complesso
        bytes32 expectedProof = keccak256(
            abi.encodePacked(fileHash, "storage_proof")
        );
        return proofHash == expectedProof;
    }

    /**
     * @dev Funzione interna per aggiornare la reputazione di un relay
     * @param relay Indirizzo del relay
     * @param points Punti da aggiungere/sottrarre
     * @param isPositive Se è una ricompensa (true) o penalità (false)
     */
    function _updateRelayReputation(
        address relay,
        uint256 points,
        bool isPositive
    ) internal {
        RelayReputation storage rep = relayReputations[relay];
        uint256 oldScore = rep.score;

        if (isPositive) {
            rep.score = rep.score + points > 1000 ? 1000 : rep.score + points;
            rep.successfulChallenges++;
        } else {
            rep.score = rep.score > points ? rep.score - points : 0;
            rep.failedChallenges++;
        }

        rep.totalChallenges++;
        rep.lastActivity = block.timestamp;

        emit RelayReputationUpdated(
            relay,
            oldScore,
            rep.score,
            rep.isBlacklisted
        );
    }
}
