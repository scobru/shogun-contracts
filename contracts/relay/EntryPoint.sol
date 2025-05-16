// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";



/**
 * @title IRegistry
 * @dev Interfaccia minima del Registry per l'EntryPoint
 */
interface IRegistry {
    function isRegisteredRelay(
        address _relayAddress
    ) external view returns (bool);
    function isRelayActive(address _relayAddress) external view returns (bool);
    function findRelayByUrl(
        string calldata _url
    ) external view returns (address);
    function getRelayInfo(
        address _relayAddress
    )
        external
        view
        returns (
            address owner,
            string memory url,
            string memory metadata,
            uint256 registrationTime,
            bool active
        );
}

/**
 * @title IRelay
 * @dev Interfaccia minima del Relay per l'EntryPoint
 */
interface IRelay {
    function subscribe(
        uint256 _months,
        bytes calldata _pubKey
    ) external payable;
    function isSubscriptionActive(address _user) external view returns (bool);
    function getUserSubscriptionInfo(
        address _user
    ) external view returns (uint256 expires, bytes memory pubKey);
    function pricePerMonth() external view returns (uint256);
    function isSubscribed(bytes calldata _pubKey) external view returns (bool);
}

/**
 * @title EntryPoint
 * @dev Contratto che permette di iscriversi a più relay in modo semplificato
 */
contract EntryPoint is Ownable, ReentrancyGuard {
    // Riferimento al Registry
    IRegistry public registry;

    // Fee opzionale per il servizio offerto dall'EntryPoint (in percentuale, base 10000)
    uint256 public serviceFeePercentage; // es. 250 = 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000;

    // Mappa degli utenti che hanno utilizzato l'EntryPoint
    mapping(address => bool) public users;
    uint256 public userCount;

    // Contatori per statistiche
    uint256 public totalSubscriptions;
    uint256 public totalSubscriptionsViaUrl;
    uint256 public totalSubscriptionsViaDirect;
    uint256 public totalAmountProcessed;
    uint256 public totalFeesCollected;

    // Eventi
    event RegistryUpdated(
        address indexed oldRegistry,
        address indexed newRegistry
    );
    event ServiceFeeUpdated(uint256 oldFee, uint256 newFee);
    event SubscriptionProcessed(
        address indexed user,
        address indexed relay,
        uint256 months,
        uint256 amount,
        uint256 fee
    );
    event BatchSubscriptionProcessed(
        address indexed user,
        address[] relays,
        uint256 months,
        uint256 totalAmount,
        uint256 totalFee
    );
    event FeesWithdrawn(address indexed to, uint256 amount);

    /**
     * @dev Costruttore
     * @param _registry Indirizzo del contratto Registry
     * @param _initialOwner Proprietario iniziale dell'EntryPoint
     * @param _initialFeePercentage Percentuale di commissione iniziale (base 10000)
     */
    constructor(
        address _registry,
        address _initialOwner,
        uint256 _initialFeePercentage
    ) Ownable(_initialOwner) {
        require(
            _registry != address(0),
            "EntryPoint: Invalid registry address"
        );
        require(
            _initialOwner != address(0),
            "EntryPoint: Invalid owner address"
        );
        require(
            _initialFeePercentage <= 1000,
            "EntryPoint: Fee percentage too high (max 10%)"
        );

        registry = IRegistry(_registry);
        serviceFeePercentage = _initialFeePercentage;
    }

    /**
     * @dev Aggiorna l'indirizzo del Registry
     * @param _newRegistry Nuovo indirizzo del Registry
     */
    function updateRegistry(address _newRegistry) external onlyOwner {
        require(
            _newRegistry != address(0),
            "EntryPoint: Invalid registry address"
        );
        address oldRegistry = address(registry);
        registry = IRegistry(_newRegistry);
        emit RegistryUpdated(oldRegistry, _newRegistry);
    }

    /**
     * @dev Aggiorna la percentuale di commissione del servizio
     * @param _newFeePercentage Nuova percentuale di commissione (base 10000)
     */
    function updateServiceFee(uint256 _newFeePercentage) external onlyOwner {
        require(
            _newFeePercentage <= 1000,
            "EntryPoint: Fee percentage too high (max 10%)"
        );
        uint256 oldFee = serviceFeePercentage;
        serviceFeePercentage = _newFeePercentage;
        emit ServiceFeeUpdated(oldFee, _newFeePercentage);
    }

    /**
     * @dev Calcola l'importo della commissione
     * @param _amount Importo base
     * @return Importo della commissione
     */
    function calculateFee(uint256 _amount) public view returns (uint256) {
        return (_amount * serviceFeePercentage) / FEE_DENOMINATOR;
    }

    /**
     * @dev Calcola il costo totale di iscrizione a un relay
     * @param _relayAddress Indirizzo del relay
     * @param _months Durata dell'iscrizione in mesi
     * @return subscriptionCost Costo base dell'iscrizione
     * @return fee Commissione applicata dall'EntryPoint
     * @return totalCost Costo totale (iscrizione + commissione)
     */
    function calculateSubscriptionCost(
        address _relayAddress,
        uint256 _months
    ) 
        external 
        view 
        returns (
            uint256 subscriptionCost, 
            uint256 fee, 
            uint256 totalCost
        ) 
    {
        require(
            _relayAddress != address(0),
            "EntryPoint: Invalid relay address"
        );
        require(_months > 0, "EntryPoint: Months must be positive");
        
        uint256 size;
        assembly {
            size := extcodesize(_relayAddress)
        }
        require(size > 0, "EntryPoint: Address is not a contract");
        
        // Ottieni il prezzo mensile dal relay
        uint256 pricePerMonth = IRelay(_relayAddress).pricePerMonth();
        subscriptionCost = pricePerMonth * _months;
        fee = calculateFee(subscriptionCost);
        totalCost = subscriptionCost + fee;
        
        return (subscriptionCost, fee, totalCost);
    }

    /**
     * @dev Calcola il costo totale di iscrizione a un relay tramite URL
     * @param _relayUrl URL del relay
     * @param _months Durata dell'iscrizione in mesi
     * @return relayAddress Indirizzo del relay trovato
     * @return subscriptionCost Costo base dell'iscrizione
     * @return fee Commissione applicata dall'EntryPoint
     * @return totalCost Costo totale (iscrizione + commissione)
     */
    function calculateSubscriptionCostByUrl(
        string calldata _relayUrl,
        uint256 _months
    ) 
        external 
        view 
        returns (
            address relayAddress,
            uint256 subscriptionCost, 
            uint256 fee, 
            uint256 totalCost
        ) 
    {
        require(bytes(_relayUrl).length > 0, "EntryPoint: Empty URL");
        require(_months > 0, "EntryPoint: Months must be positive");

        // Trova l'indirizzo del relay tramite URL
        relayAddress = registry.findRelayByUrl(_relayUrl);
        require(
            relayAddress != address(0),
            "EntryPoint: Relay not found for URL"
        );
        require(
            registry.isRelayActive(relayAddress),
            "EntryPoint: Relay is not active"
        );
        
        // Ottieni il prezzo mensile dal relay
        uint256 pricePerMonth = IRelay(relayAddress).pricePerMonth();
        subscriptionCost = pricePerMonth * _months;
        fee = calculateFee(subscriptionCost);
        totalCost = subscriptionCost + fee;
        
        return (relayAddress, subscriptionCost, fee, totalCost);
    }

    /**
     * @dev Calcola il costo totale di iscrizione a più relay contemporaneamente
     * @param _relayAddresses Array di indirizzi di relay
     * @param _months Durata dell'iscrizione in mesi
     * @return totalSubscriptionCost Costo base totale per tutte le iscrizioni
     * @return totalFee Commissione totale applicata dall'EntryPoint
     * @return totalCost Costo totale complessivo
     * @return costs Array di costi individuali per relay (solo sottoscrizioni, senza fee)
     */
    function calculateBatchSubscriptionCost(
        address[] calldata _relayAddresses,
        uint256 _months
    ) 
        external 
        view 
        returns (
            uint256 totalSubscriptionCost,
            uint256 totalFee,
            uint256 totalCost,
            uint256[] memory costs
        ) 
    {
        require(
            _relayAddresses.length > 0,
            "EntryPoint: Empty relay addresses array"
        );
        require(_months > 0, "EntryPoint: Months must be positive");

        totalSubscriptionCost = 0;
        totalFee = 0;
        costs = new uint256[](_relayAddresses.length);

        // Calcola il costo totale per tutte le iscrizioni
        for (uint256 i = 0; i < _relayAddresses.length; i++) {
            address relayAddress = _relayAddresses[i];
            require(
                relayAddress != address(0),
                "EntryPoint: Invalid relay address"
            );

            // Verifica che il relay sia un contratto
            uint256 size;
            assembly {
                size := extcodesize(relayAddress)
            }
            require(size > 0, "EntryPoint: Address is not a contract");

            // Ottieni il prezzo mensile dal relay
            uint256 pricePerMonth = IRelay(relayAddress).pricePerMonth();
            uint256 subscriptionCost = pricePerMonth * _months;
            uint256 fee = calculateFee(subscriptionCost);

            costs[i] = subscriptionCost;
            totalSubscriptionCost += subscriptionCost;
            totalFee += fee;
        }

        totalCost = totalSubscriptionCost + totalFee;
        return (totalSubscriptionCost, totalFee, totalCost, costs);
    }

    /**
     * @dev Iscriviti a un relay tramite URL
     * @param _relayUrl URL del relay
     * @param _months Durata dell'iscrizione in mesi
     * @param _pubKey Chiave pubblica dell'utente
     */
    function subscribeViaUrl(
        string calldata _relayUrl,
        uint256 _months,
        bytes calldata _pubKey
    ) external payable nonReentrant {
        require(bytes(_relayUrl).length > 0, "EntryPoint: Empty URL");
        require(_months > 0, "EntryPoint: Months must be positive");

        // Trova l'indirizzo del relay tramite URL
        address relayAddress = registry.findRelayByUrl(_relayUrl);
        require(
            relayAddress != address(0),
            "EntryPoint: Relay not found for URL"
        );
        require(
            registry.isRelayActive(relayAddress),
            "EntryPoint: Relay is not active"
        );

        // Esegui l'iscrizione
        _processSubscription(relayAddress, _months, _pubKey);

        // Aggiorna statistiche
        totalSubscriptionsViaUrl++;
    }

    /**
     * @dev Iscriviti direttamente a un relay specifico
     * @param _relayAddress Indirizzo del relay
     * @param _months Durata dell'iscrizione in mesi
     * @param _pubKey Chiave pubblica dell'utente
     */
    function subscribeDirect(
        address _relayAddress,
        uint256 _months,
        bytes calldata _pubKey
    ) external payable nonReentrant {
        require(
            _relayAddress != address(0),
            "EntryPoint: Invalid relay address"
        );
        require(_months > 0, "EntryPoint: Months must be positive");

        // Verifica che il relay sia registrato e attivo
        bool isRegistered = registry.isRegisteredRelay(_relayAddress);

        // Se il relay è registrato, verifica che sia attivo
        if (isRegistered) {
            require(
                registry.isRelayActive(_relayAddress),
                "EntryPoint: Relay is not active"
            );
        } else {
            // Se non è registrato, permetti comunque l'iscrizione ma verifica che sia un contratto
            uint256 size;
            assembly {
                size := extcodesize(_relayAddress)
            }
            require(size > 0, "EntryPoint: Address is not a contract");
        }

        // Esegui l'iscrizione
        _processSubscription(_relayAddress, _months, _pubKey);

        // Aggiorna statistiche
        totalSubscriptionsViaDirect++;
    }

    /**
     * @dev Iscriviti a più relay contemporaneamente
     * @param _relayAddresses Array di indirizzi di relay
     * @param _months Durata dell'iscrizione in mesi (uguale per tutti)
     * @param _pubKeys Array di chiavi pubbliche dell'utente (una per relay)
     */
    function batchSubscribe(
        address[] calldata _relayAddresses,
        uint256 _months,
        bytes[] calldata _pubKeys
    ) external payable nonReentrant {
        require(
            _relayAddresses.length > 0,
            "EntryPoint: Empty relay addresses array"
        );
        require(
            _relayAddresses.length == _pubKeys.length,
            "EntryPoint: Arrays must have same length"
        );
        require(_months > 0, "EntryPoint: Months must be positive");

        uint256 totalCost = 0;
        uint256 totalFee = 0;

        // Prima calcola il costo totale per tutte le iscrizioni
        for (uint256 i = 0; i < _relayAddresses.length; i++) {
            address relayAddress = _relayAddresses[i];
            require(
                relayAddress != address(0),
                "EntryPoint: Invalid relay address"
            );

            // Verifica che il relay sia registrato e attivo o almeno sia un contratto
            bool isRegistered = registry.isRegisteredRelay(relayAddress);
            if (isRegistered) {
                require(
                    registry.isRelayActive(relayAddress),
                    "EntryPoint: Relay is not active"
                );
            } else {
                uint256 size;
                assembly {
                    size := extcodesize(relayAddress)
                }
                require(size > 0, "EntryPoint: Address is not a contract");
            }

            // Ottieni il prezzo mensile dal relay
            uint256 pricePerMonth = IRelay(relayAddress).pricePerMonth();
            uint256 subscriptionCost = pricePerMonth * _months;
            uint256 fee = calculateFee(subscriptionCost);

            totalCost += subscriptionCost;
            totalFee += fee;
        }

        // Verifica che il valore inviato sia sufficiente
        uint256 totalAmount = totalCost + totalFee;
        require(
            msg.value >= totalAmount,
            "EntryPoint: Insufficient funds sent"
        );

        // Esegui tutte le iscrizioni
        for (uint256 i = 0; i < _relayAddresses.length; i++) {
            address relayAddress = _relayAddresses[i];
            bytes calldata pubKey = _pubKeys[i];

            // Ottieni il prezzo mensile dal relay
            uint256 pricePerMonth = IRelay(relayAddress).pricePerMonth();
            uint256 subscriptionCost = pricePerMonth * _months;

            // Esegui l'iscrizione al relay
            IRelay(relayAddress).subscribe{value: subscriptionCost}(
                _months,
                pubKey
            );
        }

        // Restituzione di eventuali fondi in eccesso
        uint256 excessAmount = msg.value - totalAmount;
        if (excessAmount > 0) {
            Address.sendValue(payable(msg.sender), excessAmount);
        }

        // Registra l'utente se è la prima volta
        if (!users[msg.sender]) {
            users[msg.sender] = true;
            userCount++;
        }

        // Aggiorna statistiche
        totalSubscriptions += _relayAddresses.length;
        totalAmountProcessed += totalCost;
        totalFeesCollected += totalFee;

        emit BatchSubscriptionProcessed(
            msg.sender,
            _relayAddresses,
            _months,
            totalCost,
            totalFee
        );
    }

    /**
     * @dev Funzione interna per processare l'iscrizione a un singolo relay
     * @param _relayAddress Indirizzo del relay
     * @param _months Durata dell'iscrizione in mesi
     * @param _pubKey Chiave pubblica dell'utente
     */
    function _processSubscription(
        address _relayAddress,
        uint256 _months,
        bytes calldata _pubKey
    ) internal {
        // Ottieni il prezzo mensile dal relay
        uint256 pricePerMonth = IRelay(_relayAddress).pricePerMonth();
        uint256 subscriptionCost = pricePerMonth * _months;
        uint256 fee = calculateFee(subscriptionCost);

        // Verifica che il valore inviato sia sufficiente
        uint256 totalAmount = subscriptionCost + fee;
        require(
            msg.value >= totalAmount,
            "EntryPoint: Insufficient funds sent"
        );

        // Esegui l'iscrizione al relay
        IRelay(_relayAddress).subscribe{value: subscriptionCost}(
            _months,
            _pubKey
        );

        // Restituzione di eventuali fondi in eccesso
        uint256 excessAmount = msg.value - totalAmount;
        if (excessAmount > 0) {
            Address.sendValue(payable(msg.sender), excessAmount);
        }

        // Registra l'utente se è la prima volta
        if (!users[msg.sender]) {
            users[msg.sender] = true;
            userCount++;
        }

        // Aggiorna statistiche
        totalSubscriptions++;
        totalAmountProcessed += subscriptionCost;
        totalFeesCollected += fee;

        emit SubscriptionProcessed(
            msg.sender,
            _relayAddress,
            _months,
            subscriptionCost,
            fee
        );
    }

    /**
     * @dev Verifica stato di abbonamento di un utente su un relay specifico
     * @param _user Indirizzo dell'utente
     * @param _relayAddress Indirizzo del relay
     * @return true se l'utente ha un abbonamento attivo
     */
    function checkSubscription(
        address _user,
        address _relayAddress
    ) external view returns (bool) {
        require(
            _relayAddress != address(0),
            "EntryPoint: Invalid relay address"
        );
        require(_user != address(0), "EntryPoint: Invalid user address");

        return IRelay(_relayAddress).isSubscriptionActive(_user);
    }

    /**
     * @dev Verifica se un utente ha una chiave pubblica registrata in un relay
     * @param _user Indirizzo dell'utente
     * @param _relayAddress Indirizzo del relay
     * @return true se l'utente ha una chiave pubblica registrata, false altrimenti
     */
    function hasRegisteredPubKey(
        address _user,
        address _relayAddress
    ) external view returns (bool) {
        require(
            _relayAddress != address(0),
            "EntryPoint: Invalid relay address"
        );
        require(_user != address(0), "EntryPoint: Invalid user address");

        // Ottieni le informazioni dell'utente dal relay
        (, bytes memory pubKey) = IRelay(_relayAddress)
            .getUserSubscriptionInfo(_user);

        // Verifica se la chiave pubblica è stata registrata (non vuota)
        return pubKey.length > 0;
    }

    /**
     * @dev Verifica se una specifica chiave pubblica è autorizzata in un relay
     * @param _relayAddress Indirizzo del relay
     * @param _pubKey Chiave pubblica da verificare
     * @return true se la chiave pubblica è autorizzata, false altrimenti
     */
    function isPubKeySubscribed(
        address _relayAddress,
        bytes calldata _pubKey
    ) external view returns (bool) {
        require(
            _relayAddress != address(0),
            "EntryPoint: Invalid relay address"
        );
        require(_pubKey.length > 0, "EntryPoint: Empty public key");

        // Usa direttamente la funzione isSubscribed del relay
        return IRelay(_relayAddress).isSubscribed(_pubKey);
    }

    /**
     * @dev Verifica se specifiche chiavi pubbliche sono autorizzate su più relay
     * @param _relayAddresses Array di indirizzi di relay
     * @param _pubKeys Array di chiavi pubbliche da verificare
     * @return results Array di risultati della verifica
     */
    function batchCheckPubKeySubscription(
        address[] calldata _relayAddresses,
        bytes[] calldata _pubKeys
    ) external view returns (bool[] memory) {
        require(
            _relayAddresses.length > 0,
            "EntryPoint: Empty relay addresses array"
        );
        require(
            _relayAddresses.length == _pubKeys.length,
            "EntryPoint: Arrays must have same length"
        );

        bool[] memory results = new bool[](_relayAddresses.length);

        for (uint256 i = 0; i < _relayAddresses.length; i++) {
            address relayAddress = _relayAddresses[i];
            bytes calldata pubKey = _pubKeys[i];

            if (relayAddress != address(0) && pubKey.length > 0) {
                // Usa direttamente la funzione isSubscribed del relay
                results[i] = IRelay(relayAddress).isSubscribed(pubKey);
            } else {
                results[i] = false;
            }
        }

        return results;
    }

    /**
     * @dev Ottieni informazioni dettagliate sull'abbonamento di un utente
     * @param _user Indirizzo dell'utente
     * @param _relayAddress Indirizzo del relay
     * @return expires Data di scadenza dell'abbonamento
     * @return pubKey Chiave pubblica dell'utente
     */
    function getSubscriptionDetails(
        address _user,
        address _relayAddress
    ) external view returns (uint256 expires, bytes memory pubKey) {
        require(
            _relayAddress != address(0),
            "EntryPoint: Invalid relay address"
        );
        require(_user != address(0), "EntryPoint: Invalid user address");

        return IRelay(_relayAddress).getUserSubscriptionInfo(_user);
    }

    /**
     * @dev Verifica abbonamenti su più relay contemporaneamente
     * @param _user Indirizzo dell'utente
     * @param _relayAddresses Array di indirizzi di relay
     * @return results Array di stati di abbonamento
     */
    function batchCheckSubscriptions(
        address _user,
        address[] calldata _relayAddresses
    ) external view returns (bool[] memory) {
        require(_user != address(0), "EntryPoint: Invalid user address");
        require(
            _relayAddresses.length > 0,
            "EntryPoint: Empty relay addresses array"
        );

        bool[] memory results = new bool[](_relayAddresses.length);

        for (uint256 i = 0; i < _relayAddresses.length; i++) {
            address relayAddress = _relayAddresses[i];
            if (relayAddress != address(0)) {
                results[i] = IRelay(relayAddress).isSubscriptionActive(_user);
            } else {
                results[i] = false;
            }
        }

        return results;
    }

    /**
     * @dev Verifica la registrazione di chiavi pubbliche su più relay contemporaneamente
     * @param _user Indirizzo dell'utente
     * @param _relayAddresses Array di indirizzi di relay
     * @return results Array di stati delle chiavi pubbliche (true se registrata)
     */
    function batchCheckPubKeys(
        address _user,
        address[] calldata _relayAddresses
    ) external view returns (bool[] memory) {
        require(_user != address(0), "EntryPoint: Invalid user address");
        require(
            _relayAddresses.length > 0,
            "EntryPoint: Empty relay addresses array"
        );

        bool[] memory results = new bool[](_relayAddresses.length);

        for (uint256 i = 0; i < _relayAddresses.length; i++) {
            address relayAddress = _relayAddresses[i];
            if (relayAddress != address(0)) {
                (, bytes memory pubKey) = IRelay(relayAddress)
                    .getUserSubscriptionInfo(_user);
                results[i] = pubKey.length > 0;
            } else {
                results[i] = false;
            }
        }

        return results;
    }

    /**
     * @dev Preleva le commissioni accumulate
     */
    function withdrawFees() external onlyOwner nonReentrant {
        uint256 amount = address(this).balance;
        require(amount > 0, "EntryPoint: No fees to withdraw");

        emit FeesWithdrawn(owner(), amount);
        Address.sendValue(payable(owner()), amount);
    }

    /**
     * @dev Ottieni statistiche del contratto
     */
    function getStatistics()
        external
        view
        returns (
            uint256 _userCount,
            uint256 _totalSubscriptions,
            uint256 _totalViaUrl,
            uint256 _totalViaDirect,
            uint256 _totalAmountProcessed,
            uint256 _totalFeesCollected,
            uint256 _currentBalance
        )
    {
        return (
            userCount,
            totalSubscriptions,
            totalSubscriptionsViaUrl,
            totalSubscriptionsViaDirect,
            totalAmountProcessed,
            totalFeesCollected,
            address(this).balance
        );
    }

    /**
     * @dev Fallback per accettare ETH
     */
    receive() external payable {
        // Accept ETH
    }
}
