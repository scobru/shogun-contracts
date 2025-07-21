// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PairRecovery
 * @dev Contratto per registrare coppie SEA crittografate
 */
contract PairRecovery {
    // Struttura per memorizzare i dati del pair
    struct PairData {
        bytes encryptedPair; // Coppia SEA crittografata
        string username; // Alias dell'utente
        uint256 timestamp; // Timestamp della registrazione
        bool exists; // Flag per verificare esistenza
    }

    // Mapping: indirizzo utente -> dati del pair
    mapping(address => PairData) public userPairs;

    // Mapping: username -> indirizzo utente (per ricerca inversa)
    mapping(string => address) public usernameToAddress;

    // Eventi
    event PairRegistered(
        address indexed user,
        string username,
        uint256 timestamp
    );
    event PairUpdated(
        address indexed user,
        string newUsername,
        uint256 timestamp
    );
    event PairDeleted(address indexed user, uint256 timestamp);

    // Modificatori
    modifier pairExists(address user) {
        require(userPairs[user].exists, "Pair non trovato");
        _;
    }

    modifier pairNotExists(address user) {
        require(!userPairs[user].exists, "Pair gia' registrato");
        _;
    }

    modifier usernameNotTaken(string calldata username) {
        require(
            usernameToAddress[username] == address(0),
            "Username gia' in uso"
        );
        _;
    }

    /**
     * @dev Registra una nuova coppia SEA crittografata
     * @param encryptedPair Dati crittografati del pair SEA
     * @param username Alias dell'utente
     */
    function registerPair(
        bytes calldata encryptedPair,
        string calldata username
    ) external pairNotExists(msg.sender) usernameNotTaken(username) {
        require(encryptedPair.length > 0, "Dati crittografati non validi");
        require(bytes(username).length > 0, "Username non valido");

        userPairs[msg.sender] = PairData({
            encryptedPair: encryptedPair,
            username: username,
            timestamp: block.timestamp,
            exists: true
        });

        // Registra il mapping inverso
        usernameToAddress[username] = msg.sender;

        emit PairRegistered(msg.sender, username, block.timestamp);
    }

    /**
     * @dev Aggiorna i dati di un pair esistente
     * @param encryptedPair Nuovi dati crittografati del pair SEA
     * @param newUsername Nuovo username
     */
    function updatePair(
        bytes calldata encryptedPair,
        string calldata newUsername
    ) external pairExists(msg.sender) {
        require(encryptedPair.length > 0, "Dati crittografati non validi");
        require(bytes(newUsername).length > 0, "Username non valido");

        // Se l'username è diverso, verifica che non sia già in uso
        string memory oldUsername = userPairs[msg.sender].username;
        if (keccak256(bytes(oldUsername)) != keccak256(bytes(newUsername))) {
            require(
                usernameToAddress[newUsername] == address(0),
                "Username gia' in uso"
            );

            // Rimuovi il vecchio mapping
            delete usernameToAddress[oldUsername];
            // Aggiungi il nuovo mapping
            usernameToAddress[newUsername] = msg.sender;
        }

        userPairs[msg.sender].encryptedPair = encryptedPair;
        userPairs[msg.sender].username = newUsername;
        userPairs[msg.sender].timestamp = block.timestamp;

        emit PairUpdated(msg.sender, newUsername, block.timestamp);
    }

    /**
     * @dev Elimina il pair dell'utente
     */
    function deletePair() external pairExists(msg.sender) {
        // Rimuovi il mapping inverso
        delete usernameToAddress[userPairs[msg.sender].username];

        delete userPairs[msg.sender];

        emit PairDeleted(msg.sender, block.timestamp);
    }

    /**
     * @dev Ottiene i dati del pair di un utente tramite indirizzo
     * @param user Indirizzo dell'utente
     * @return encryptedPair Dati crittografati
     * @return username Alias dell'utente
     * @return timestamp Timestamp della registrazione
     * @return exists Se il pair esiste
     */
    function getPair(
        address user
    )
        external
        view
        returns (
            bytes memory encryptedPair,
            string memory username,
            uint256 timestamp,
            bool exists
        )
    {
        PairData memory data = userPairs[user];
        return (data.encryptedPair, data.username, data.timestamp, data.exists);
    }

    /**
     * @dev Ottiene i dati del pair di un utente tramite username
     * @param username Username dell'utente
     * @return user Indirizzo dell'utente
     * @return encryptedPair Dati crittografati
     * @return timestamp Timestamp della registrazione
     * @return exists Se il pair esiste
     */
    function getPairByUsername(
        string calldata username
    )
        external
        view
        returns (
            address user,
            bytes memory encryptedPair,
            uint256 timestamp,
            bool exists
        )
    {
        address userAddress = usernameToAddress[username];
        if (userAddress == address(0)) {
            return (address(0), "", 0, false);
        }

        PairData memory data = userPairs[userAddress];
        return (userAddress, data.encryptedPair, data.timestamp, data.exists);
    }

    /**
     * @dev Verifica se un utente ha registrato un pair tramite indirizzo
     * @param user Indirizzo dell'utente
     * @return True se il pair esiste
     */
    function hasPair(address user) external view returns (bool) {
        return userPairs[user].exists;
    }

    /**
     * @dev Verifica se un username è già registrato
     * @param username Username da verificare
     * @return True se l'username è già in uso
     */
    function isUsernameTaken(
        string calldata username
    ) external view returns (bool) {
        return usernameToAddress[username] != address(0);
    }

    /**
     * @dev Ottiene l'indirizzo associato a un username
     * @param username Username dell'utente
     * @return Indirizzo dell'utente (address(0) se non trovato)
     */
    function getAddressByUsername(
        string calldata username
    ) external view returns (address) {
        return usernameToAddress[username];
    }
}
