// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RelayPaymentRouter {
    // Struttura per rappresentare un relay
    struct Relay {
        string url;
        address payable relayAddress;
        bool isActive;
        uint256 registeredAt;
    }

    // Struttura per rappresentare una sottoscrizione
    struct Subscription {
        address user;
        address relay;
        uint256 startTime;
        uint256 endTime;
        uint256 amountPaid;
        uint256 mbAllocated; // MB allocati per questo mese
        bool isActive;
    }

    // Durata fissa della sottoscrizione (30 giorni)
    uint256 public constant SUBSCRIPTION_DURATION = 30 days;

    // Prezzo base per 1 GB (1000 MB) - 0.001 ETH per GB
    uint256 public constant PRICE_PER_GB = 0.001 ether;
    uint256 public constant MB_PER_GB = 1000;

    // Prezzo minimo per sottoscrizione (1 MB)
    uint256 public constant MIN_SUBSCRIPTION_AMOUNT = PRICE_PER_GB / MB_PER_GB;

    // Owner del contratto
    address public owner;

    // Fee per il contratto (2%)
    uint256 public contractFee = 200; // 200 = 2% (su base 10000)
    uint256 public constant FEE_DENOMINATOR = 10000;

    // Mappings
    mapping(address => Relay) public relays;
    mapping(address => address[]) public userSubscriptions; // user => relay addresses
    mapping(address => mapping(address => Subscription)) public subscriptions; // user => relay => subscription
    mapping(address => address[]) public relaySubscribers; // relay => user addresses

    // Array per tenere traccia di tutti i relay registrati
    address[] public registeredRelays;

    // Eventi
    event RelayRegistered(address indexed relayAddress, string url);
    event RelayDeactivated(address indexed relayAddress);
    event SubscriptionCreated(
        address indexed user,
        address indexed relay,
        uint256 amount,
        uint256 mbAllocated,
        uint256 endTime
    );
    event SubscriptionExpired(address indexed user, address indexed relay);
    event PaymentDistributed(address indexed relay, uint256 amount);
    event ContractFeeCollected(uint256 amount);

    // Modificatori
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyActiveRelay() {
        require(
            relays[msg.sender].isActive,
            "Only active relays can call this function"
        );
        _;
    }

    modifier notPaused() {
        require(!emergencyPause, "Contract is paused");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Registra un nuovo relay
     * @param _url URL del relay
     */
    function registerRelay(string memory _url) external notPaused {
        require(bytes(_url).length > 0, "URL cannot be empty");
        require(bytes(_url).length <= 200, "URL too long"); // Limite ragionevole
        require(!relays[msg.sender].isActive, "Relay already registered");

        relays[msg.sender] = Relay({
            url: _url,
            relayAddress: payable(msg.sender),
            isActive: true,
            registeredAt: block.timestamp
        });

        registeredRelays.push(msg.sender);

        emit RelayRegistered(msg.sender, _url);
    }

    /**
     * @dev Disattiva un relay (solo il proprietario del relay)
     */
    function deactivateRelay() external notPaused {
        require(relays[msg.sender].isActive, "Relay not active");
        relays[msg.sender].isActive = false;
        emit RelayDeactivated(msg.sender);
    }

    /**
     * @dev Verifica se un relay è registrato e attivo
     * @param _relayAddress Indirizzo del relay
     * @return bool True se il relay è registrato e attivo
     */
    function isRelayRegistered(
        address _relayAddress
    ) public view returns (bool) {
        return relays[_relayAddress].isActive;
    }

    /**
     * @dev Ottieni tutti i relay attivi
     * @return address[] Array degli indirizzi dei relay attivi
     */
    function getActiveRelays() external view returns (address[] memory) {
        address[] memory activeRelays = new address[](registeredRelays.length);
        uint256 activeCount = 0;

        for (uint256 i = 0; i < registeredRelays.length; i++) {
            if (relays[registeredRelays[i]].isActive) {
                activeRelays[activeCount] = registeredRelays[i];
                activeCount++;
            }
        }

        // Ridimensiona l'array al numero effettivo di relay attivi
        assembly {
            mstore(activeRelays, activeCount)
        }

        return activeRelays;
    }

    /**
     * @dev Calcola i MB allocati in base all'importo versato
     * @param _amount Importo in wei
     * @return uint256 MB allocati
     */
    function calculateMBFromAmount(
        uint256 _amount
    ) public pure returns (uint256) {
        // Calcola i MB: (amount * MB_PER_GB) / PRICE_PER_GB
        return (_amount * MB_PER_GB) / PRICE_PER_GB;
    }

    /**
     * @dev Calcola l'importo necessario per un numero di MB
     * @param _mb Numero di MB desiderati
     * @return uint256 Importo in wei
     */
    function calculateAmountFromMB(uint256 _mb) public pure returns (uint256) {
        // Calcola l'importo: (mb * PRICE_PER_GB) / MB_PER_GB
        return (_mb * PRICE_PER_GB) / MB_PER_GB;
    }

    /**
     * @dev Sottoscrivi a un relay
     * @param _relayAddress Indirizzo del relay
     */
    function subscribeToRelay(
        address _relayAddress
    ) external payable notPaused {
        require(
            msg.value >= MIN_SUBSCRIPTION_AMOUNT,
            "Amount too low - minimum 1 MB required"
        );
        require(relays[_relayAddress].isActive, "Relay not active");
        require(
            !isSubscriptionActive(msg.sender, _relayAddress),
            "Already subscribed to this relay"
        );

        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + SUBSCRIPTION_DURATION;

        // Calcola le fee e l'importo netto per il relay
        uint256 contractFeeAmount = (msg.value * contractFee) / FEE_DENOMINATOR;
        uint256 relayAmount = msg.value - contractFeeAmount;

        // Calcola i MB basandosi su quanto riceve effettivamente il relay
        uint256 mbAllocated = calculateMBFromAmount(relayAmount);

        // Crea la sottoscrizione
        Subscription memory newSubscription = Subscription({
            user: msg.sender,
            relay: _relayAddress,
            startTime: startTime,
            endTime: endTime,
            amountPaid: msg.value,
            mbAllocated: mbAllocated,
            isActive: true
        });

        // Salva la sottoscrizione
        subscriptions[msg.sender][_relayAddress] = newSubscription;

        // Aggiorna i mapping
        userSubscriptions[msg.sender].push(_relayAddress);
        relaySubscribers[_relayAddress].push(msg.sender);

        // Trasferisci il pagamento al relay
        relays[_relayAddress].relayAddress.transfer(relayAmount);

        emit SubscriptionCreated(
            msg.sender,
            _relayAddress,
            msg.value,
            mbAllocated,
            endTime
        );
        emit PaymentDistributed(_relayAddress, relayAmount);

        if (contractFeeAmount > 0) {
            emit ContractFeeCollected(contractFeeAmount);
        }
    }

    /**
     * @dev Aggiunge MB a una sottoscrizione esistente
     * @param _relayAddress Indirizzo del relay
     */
    function addMBToSubscription(
        address _relayAddress
    ) external payable notPaused {
        require(
            msg.value >= MIN_SUBSCRIPTION_AMOUNT,
            "Amount too low - minimum 1 MB required"
        );
        require(relays[_relayAddress].isActive, "Relay not active");
        require(
            isSubscriptionActive(msg.sender, _relayAddress),
            "No active subscription found"
        );

        // Calcola le fee e l'importo netto per il relay
        uint256 contractFeeAmount = (msg.value * contractFee) / FEE_DENOMINATOR;
        uint256 relayAmount = msg.value - contractFeeAmount;

        // Calcola i MB basandosi su quanto riceve effettivamente il relay
        uint256 additionalMB = calculateMBFromAmount(relayAmount);

        // Aggiorna la sottoscrizione esistente
        Subscription storage sub = subscriptions[msg.sender][_relayAddress];
        sub.amountPaid += msg.value;
        sub.mbAllocated += additionalMB;

        // Trasferisci il pagamento al relay
        relays[_relayAddress].relayAddress.transfer(relayAmount);

        emit SubscriptionCreated(
            msg.sender,
            _relayAddress,
            msg.value,
            additionalMB,
            sub.endTime
        );
        emit PaymentDistributed(_relayAddress, relayAmount);

        if (contractFeeAmount > 0) {
            emit ContractFeeCollected(contractFeeAmount);
        }
    }

    /**
     * @dev Controlla se un utente ha una sottoscrizione attiva con un relay
     * @param _user Indirizzo dell'utente
     * @param _relayAddress Indirizzo del relay
     * @return bool True se la sottoscrizione è attiva
     */
    function isSubscriptionActive(
        address _user,
        address _relayAddress
    ) public view returns (bool) {
        Subscription memory sub = subscriptions[_user][_relayAddress];
        return sub.isActive && block.timestamp <= sub.endTime;
    }

    /**
     * @dev Ottieni i dettagli di una sottoscrizione
     * @param _user Indirizzo dell'utente
     * @param _relayAddress Indirizzo del relay
     */
    function getSubscriptionDetails(
        address _user,
        address _relayAddress
    )
        external
        view
        returns (
            uint256 startTime,
            uint256 endTime,
            uint256 amountPaid,
            uint256 mbAllocated,
            bool isActive
        )
    {
        Subscription memory sub = subscriptions[_user][_relayAddress];
        return (
            sub.startTime,
            sub.endTime,
            sub.amountPaid,
            sub.mbAllocated,
            isSubscriptionActive(_user, _relayAddress)
        );
    }

    /**
     * @dev Ottieni tutti i relay a cui un utente è sottoscritto
     * @param _user Indirizzo dell'utente
     */
    function getUserSubscriptions(
        address _user
    ) external view returns (address[] memory) {
        return userSubscriptions[_user];
    }

    /**
     * @dev Ottieni tutti gli utenti sottoscritti a un relay
     * @param _relayAddress Indirizzo del relay
     */
    function getRelaySubscribers(
        address _relayAddress
    ) external view returns (address[] memory) {
        return relaySubscribers[_relayAddress];
    }

    /**
     * @dev Ottieni i dettagli di un relay
     * @param _relayAddress Indirizzo del relay
     */
    function getRelayDetails(
        address _relayAddress
    )
        external
        view
        returns (
            string memory url,
            address relayAddress,
            bool isActive,
            uint256 registeredAt
        )
    {
        Relay memory relay = relays[_relayAddress];
        return (
            relay.url,
            relay.relayAddress,
            relay.isActive,
            relay.registeredAt
        );
    }

    /**
     * @dev Ottieni tutti i relay registrati
     */
    function getAllRelays() external view returns (address[] memory) {
        return registeredRelays;
    }

    /**
     * @dev Trova l'indirizzo di un relay basandosi sull'URL
     * @param _url URL del relay da cercare
     * @return address Indirizzo del relay se trovato, altrimenti address(0)
     */
    function findRelayByURL(
        string memory _url
    ) external view returns (address) {
        for (uint256 i = 0; i < registeredRelays.length; i++) {
            address relayAddress = registeredRelays[i];
            Relay memory relay = relays[relayAddress];
            if (
                relay.isActive &&
                keccak256(bytes(relay.url)) == keccak256(bytes(_url))
            ) {
                return relayAddress;
            }
        }
        return address(0);
    }

    /**
     * @dev Ottieni tutti i relay attivi con i loro URL
     * @return address[] Indirizzi dei relay attivi
     * @return string[] URL dei relay attivi
     */
    function getActiveRelaysWithURLs()
        external
        view
        returns (address[] memory, string[] memory)
    {
        address[] memory activeAddresses = new address[](
            registeredRelays.length
        );
        string[] memory activeURLs = new string[](registeredRelays.length);
        uint256 activeCount = 0;

        for (uint256 i = 0; i < registeredRelays.length; i++) {
            address relayAddress = registeredRelays[i];
            Relay memory relay = relays[relayAddress];
            if (relay.isActive) {
                activeAddresses[activeCount] = relayAddress;
                activeURLs[activeCount] = relay.url;
                activeCount++;
            }
        }

        // Ridimensiona gli array al numero effettivo di relay attivi
        assembly {
            mstore(activeAddresses, activeCount)
            mstore(activeURLs, activeCount)
        }

        return (activeAddresses, activeURLs);
    }

    /**
     * @dev Permette di scadere manualmente una sottoscrizione (per pulizia)
     * @param _user Indirizzo dell'utente
     * @param _relayAddress Indirizzo del relay
     */
    function expireSubscription(address _user, address _relayAddress) external {
        require(
            msg.sender == _user ||
                msg.sender == _relayAddress ||
                msg.sender == owner,
            "Not authorized to expire subscription"
        );
        require(
            subscriptions[_user][_relayAddress].isActive,
            "Subscription not active"
        );
        require(
            block.timestamp > subscriptions[_user][_relayAddress].endTime,
            "Subscription not expired yet"
        );

        subscriptions[_user][_relayAddress].isActive = false;

        emit SubscriptionExpired(_user, _relayAddress);
    }

    /**
     * @dev Modifica la fee del contratto (solo owner)
     * @param _newFee Nuova fee (in basis points, es. 200 = 2%)
     */
    function updateContractFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee cannot exceed 10%"); // Max 10%
        contractFee = _newFee;
    }

    /**
     * @dev Ritira le fee accumulate (solo owner)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");

        payable(owner).transfer(balance);
    }

    /**
     * @dev Trasferisce la proprietà del contratto
     * @param _newOwner Nuovo proprietario
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        owner = _newOwner;
    }

    /**
     * @dev Funzione di emergency per pausare nuove sottoscrizioni
     */
    bool public emergencyPause = false;

    function toggleEmergencyPause() external onlyOwner {
        emergencyPause = !emergencyPause;
    }
}
