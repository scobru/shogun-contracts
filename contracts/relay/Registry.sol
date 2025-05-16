// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Registry
 * @dev Contratto per la registrazione e gestione dei relay
 */
contract Registry is Ownable, ReentrancyGuard {
    // Struttura per i dati di un relay
    struct RelayInfo {
        address owner;            // Proprietario del relay
        string url;               // URL del relay
        string metadata;          // Metadati aggiuntivi (formato JSON)
        uint256 registrationTime; // Timestamp di registrazione
        bool active;              // Stato di attività
    }

    // Struttura per il paginatore di ricerca
    struct RelayPage {
        address[] relays;
        uint256 total;
        uint256 offset;
        uint256 limit;
    }

    // Mappature
    mapping(address => RelayInfo) public relays;           // Relays registrati
    mapping(address => bool) public isRegisteredRelay;     // Verifica rapida se un relay è registrato
    mapping(address => address[]) public ownerRelays;      // Relays per proprietario
    address[] public allRelays;                            // Array di tutti i relay
    mapping(string => address) public relaysByUrl;         // Relays per URL

    // Parametri di configurazione
    bool public registrationOpen;                          // Se è possibile registrare nuovi relay
    
    // Eventi
    event RelayRegistered(address indexed relayAddress, address indexed owner, string url);
    event RelayUpdated(address indexed relayAddress, string newUrl, string newMetadata);
    event RelayDeactivated(address indexed relayAddress);
    event RelayReactivated(address indexed relayAddress);
    event RegistrationStatusChanged(bool isOpen);

    /**
     * @dev Costruttore
     * @param _initialOwner Proprietario iniziale del registro
     * @param _registrationOpen Se la registrazione è aperta all'inizio
     */
    constructor(
        address _initialOwner,
        bool _registrationOpen
    ) Ownable(_initialOwner) {
        require(_initialOwner != address(0), "Registry: Invalid owner");
        registrationOpen = _registrationOpen;
    }

    /**
     * @dev Modifica lo stato di apertura della registrazione
     * @param _isOpen Nuovo stato
     */
    function setRegistrationOpen(bool _isOpen) external onlyOwner {
        registrationOpen = _isOpen;
        emit RegistrationStatusChanged(_isOpen);
    }

    /**
     * @dev Registra un nuovo relay
     * @param _relayAddress Indirizzo del contratto relay
     * @param _url URL del relay
     * @param _metadata Metadati JSON del relay
     */
    function registerRelay(
        address _relayAddress,
        string calldata _url,
        string calldata _metadata
    ) external nonReentrant {
        // Verifiche
        require(registrationOpen, "Registry: Registration closed");
        require(_relayAddress != address(0), "Registry: Invalid relay address");
        require(Address.isContract(_relayAddress), "Registry: Address must be a contract");
        require(bytes(_url).length > 0, "Registry: URL cannot be empty");
        require(!isRegisteredRelay[_relayAddress], "Registry: Relay already registered");
        require(relaysByUrl[_url] == address(0), "Registry: URL already in use");

        // Registrazione
        RelayInfo storage newRelay = relays[_relayAddress];
        newRelay.owner = msg.sender;
        newRelay.url = _url;
        newRelay.metadata = _metadata;
        newRelay.registrationTime = block.timestamp;
        newRelay.active = true;

        // Aggiornamento indici
        isRegisteredRelay[_relayAddress] = true;
        ownerRelays[msg.sender].push(_relayAddress);
        allRelays.push(_relayAddress);
        relaysByUrl[_url] = _relayAddress;

        // Emissione evento
        emit RelayRegistered(_relayAddress, msg.sender, _url);
    }

    /**
     * @dev Aggiorna i metadati di un relay
     * @param _relayAddress Indirizzo del relay
     * @param _newUrl Nuovo URL (passare stringa vuota per non modificare)
     * @param _newMetadata Nuovi metadati (passare stringa vuota per non modificare)
     */
    function updateRelay(
        address _relayAddress,
        string calldata _newUrl,
        string calldata _newMetadata
    ) external nonReentrant {
        require(isRegisteredRelay[_relayAddress], "Registry: Relay not registered");
        require(relays[_relayAddress].owner == msg.sender, "Registry: Not relay owner");
        require(relays[_relayAddress].active, "Registry: Relay is deactivated");

        RelayInfo storage relay = relays[_relayAddress];

        // Aggiornamento URL se specificato
        if (bytes(_newUrl).length > 0 && keccak256(bytes(relay.url)) != keccak256(bytes(_newUrl))) {
            require(relaysByUrl[_newUrl] == address(0), "Registry: URL already in use");
            
            // Rimuovi vecchio mapping URL
            delete relaysByUrl[relay.url];
            
            // Imposta nuovo URL
            relay.url = _newUrl;
            relaysByUrl[_newUrl] = _relayAddress;
        }

        // Aggiornamento metadati se specificati
        if (bytes(_newMetadata).length > 0) {
            relay.metadata = _newMetadata;
        }

        emit RelayUpdated(_relayAddress, relay.url, relay.metadata);
    }

    /**
     * @dev Disattiva un relay
     * @param _relayAddress Indirizzo del relay
     */
    function deactivateRelay(address _relayAddress) external {
        require(isRegisteredRelay[_relayAddress], "Registry: Relay not registered");
        require(
            relays[_relayAddress].owner == msg.sender || msg.sender == owner(),
            "Registry: Not authorized"
        );
        require(relays[_relayAddress].active, "Registry: Already deactivated");

        relays[_relayAddress].active = false;
        
        // Manteniamo la registrazione URL per evitare che qualcuno registri lo stesso URL
        
        emit RelayDeactivated(_relayAddress);
    }

    /**
     * @dev Riattiva un relay (solo proprietario del relay)
     * @param _relayAddress Indirizzo del relay
     */
    function reactivateRelay(address _relayAddress) external {
        require(isRegisteredRelay[_relayAddress], "Registry: Relay not registered");
        require(relays[_relayAddress].owner == msg.sender, "Registry: Not relay owner");
        require(!relays[_relayAddress].active, "Registry: Already active");

        relays[_relayAddress].active = true;
        emit RelayReactivated(_relayAddress);
    }

    /**
     * @dev Ottieni informazioni complete su un relay
     * @param _relayAddress Indirizzo del relay
     */
    function getRelayInfo(address _relayAddress) external view returns (
        address owner,
        string memory url,
        string memory metadata,
        uint256 registrationTime,
        bool active
    ) {
        require(isRegisteredRelay[_relayAddress], "Registry: Relay not registered");
        RelayInfo storage relay = relays[_relayAddress];
        
        return (
            relay.owner,
            relay.url,
            relay.metadata,
            relay.registrationTime,
            relay.active
        );
    }

    /**
     * @dev Conta i relay di un proprietario
     * @param _owner Indirizzo del proprietario
     */
    function getRelayCountByOwner(address _owner) external view returns (uint256) {
        return ownerRelays[_owner].length;
    }

    /**
     * @dev Ottieni tutti i relay di un proprietario con paginazione
     * @param _owner Indirizzo del proprietario
     * @param _offset Offset per la paginazione
     * @param _limit Limite per la paginazione
     */
    function getRelaysByOwner(
        address _owner,
        uint256 _offset,
        uint256 _limit
    ) external view returns (RelayPage memory) {
        uint256 total = ownerRelays[_owner].length;
        
        // Limita l'offset
        if (_offset >= total) {
            return RelayPage({
                relays: new address[](0),
                total: total,
                offset: _offset,
                limit: _limit
            });
        }
        
        // Calcola quanti elementi restituire
        uint256 limit = _limit;
        if (_offset + limit > total) {
            limit = total - _offset;
        }
        
        // Prepara l'array di risultati
        address[] memory result = new address[](limit);
        for (uint256 i = 0; i < limit; i++) {
            result[i] = ownerRelays[_owner][_offset + i];
        }
        
        return RelayPage({
            relays: result,
            total: total,
            offset: _offset,
            limit: limit
        });
    }

    /**
     * @dev Ottieni tutti i relay con paginazione
     * @param _onlyActive Se true, restituisce solo i relay attivi
     * @param _offset Offset per la paginazione
     * @param _limit Limite per la paginazione
     */
    function getAllRelays(
        bool _onlyActive,
        uint256 _offset,
        uint256 _limit
    ) external view returns (RelayPage memory) {
        uint256 total = allRelays.length;
        
        // Limita l'offset
        if (_offset >= total) {
            return RelayPage({
                relays: new address[](0),
                total: total,
                offset: _offset,
                limit: _limit
            });
        }
        
        // Se vogliamo solo i relay attivi, dobbiamo prima contarli
        if (_onlyActive) {
            // Prima conta quanti sono attivi
            uint256 activeCount = 0;
            for (uint256 i = 0; i < total; i++) {
                if (relays[allRelays[i]].active) {
                    activeCount++;
                }
            }
            
            // Prepara l'array di risultati solo con i relay attivi
            uint256 limit = _limit;
            if (limit > activeCount) {
                limit = activeCount;
            }
            
            address[] memory result = new address[](limit);
            uint256 added = 0;
            uint256 skipped = 0;
            
            for (uint256 i = 0; i < total && added < limit; i++) {
                address relayAddr = allRelays[i];
                if (relays[relayAddr].active) {
                    if (skipped >= _offset) {
                        result[added] = relayAddr;
                        added++;
                    } else {
                        skipped++;
                    }
                }
            }
            
            return RelayPage({
                relays: result,
                total: activeCount,
                offset: _offset,
                limit: added
            });
        } else {
            // Restituisci tutti i relay con paginazione
            uint256 limit = _limit;
            if (_offset + limit > total) {
                limit = total - _offset;
            }
            
            address[] memory result = new address[](limit);
            for (uint256 i = 0; i < limit; i++) {
                result[i] = allRelays[_offset + i];
            }
            
            return RelayPage({
                relays: result,
                total: total,
                offset: _offset,
                limit: limit
            });
        }
    }

    /**
     * @dev Trova un relay per URL
     * @param _url URL del relay
     */
    function findRelayByUrl(string calldata _url) external view returns (address) {
        return relaysByUrl[_url];
    }

    /**
     * @dev Verifica se un relay è attivo
     * @param _relayAddress Indirizzo del relay
     */
    function isRelayActive(address _relayAddress) external view returns (bool) {
        if (!isRegisteredRelay[_relayAddress]) {
            return false;
        }
        return relays[_relayAddress].active;
    }

    /**
     * @dev Fallback per accettare ETH
     */
    receive() external payable {
        // Accetta ETH
    }
}
