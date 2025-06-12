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
        bool isActive;
    }
    
    // Durata fissa della sottoscrizione (30 giorni)
    uint256 public constant SUBSCRIPTION_DURATION = 30 days;
    
    // Prezzo della sottoscrizione (1 ETH)
    uint256 public constant SUBSCRIPTION_PRICE = 1 ether;
    
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
    event SubscriptionCreated(address indexed user, address indexed relay, uint256 amount, uint256 endTime);
    event SubscriptionExpired(address indexed user, address indexed relay);
    event PaymentDistributed(address indexed relay, uint256 amount);
    event ContractFeeCollected(uint256 amount);
    
    // Modificatori
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyActiveRelay() {
        require(relays[msg.sender].isActive, "Only active relays can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Registra un nuovo relay
     * @param _url URL del relay
     */
    function registerRelay(string memory _url) external {
        require(bytes(_url).length > 0, "URL cannot be empty");
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
    function deactivateRelay() external {
        require(relays[msg.sender].isActive, "Relay not active");
        relays[msg.sender].isActive = false;
    }
    
    /**
     * @dev Sottoscrivi a un relay
     * @param _relayAddress Indirizzo del relay
     */
    function subscribeToRelay(address _relayAddress) external payable {
        require(msg.value == SUBSCRIPTION_PRICE, "Incorrect payment amount");
        require(relays[_relayAddress].isActive, "Relay not active");
        require(!isSubscriptionActive(msg.sender, _relayAddress), "Already subscribed");
        
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + SUBSCRIPTION_DURATION;
        
        // Crea la sottoscrizione
        subscriptions[msg.sender][_relayAddress] = Subscription({
            user: msg.sender,
            relay: _relayAddress,
            startTime: startTime,
            endTime: endTime,
            amountPaid: msg.value,
            isActive: true
        });
        
        // Aggiorna i mapping
        userSubscriptions[msg.sender].push(_relayAddress);
        relaySubscribers[_relayAddress].push(msg.sender);
        
        // Calcola e distribuisci i pagamenti
        uint256 contractFeeAmount = (msg.value * contractFee) / FEE_DENOMINATOR;
        uint256 relayAmount = msg.value - contractFeeAmount;
        
        // Trasferisci il pagamento al relay
        relays[_relayAddress].relayAddress.transfer(relayAmount);
        
        emit SubscriptionCreated(msg.sender, _relayAddress, msg.value, endTime);
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
    function isSubscriptionActive(address _user, address _relayAddress) public view returns (bool) {
        Subscription memory sub = subscriptions[_user][_relayAddress];
        return sub.isActive && block.timestamp <= sub.endTime;
    }
    
    /**
     * @dev Funzione per i relay per verificare se un utente è sottoscritto
     * @param _user Indirizzo dell'utente da verificare
     * @return bool True se l'utente è sottoscritto a questo relay
     */
    function checkUserSubscription(address _user) external view returns (bool) {
        return isSubscriptionActive(_user, msg.sender);
    }
    
    /**
     * @dev Ottieni i dettagli di una sottoscrizione
     * @param _user Indirizzo dell'utente
     * @param _relayAddress Indirizzo del relay
     */
    function getSubscriptionDetails(address _user, address _relayAddress) 
        external view returns (
            uint256 startTime,
            uint256 endTime,
            uint256 amountPaid,
            bool isActive
        ) {
        Subscription memory sub = subscriptions[_user][_relayAddress];
        return (sub.startTime, sub.endTime, sub.amountPaid, isSubscriptionActive(_user, _relayAddress));
    }
    
    /**
     * @dev Ottieni tutti i relay a cui un utente è sottoscritto
     * @param _user Indirizzo dell'utente
     */
    function getUserSubscriptions(address _user) external view returns (address[] memory) {
        return userSubscriptions[_user];
    }
    
    /**
     * @dev Ottieni tutti gli utenti sottoscritti a un relay
     * @param _relayAddress Indirizzo del relay
     */
    function getRelaySubscribers(address _relayAddress) external view returns (address[] memory) {
        return relaySubscribers[_relayAddress];
    }
    
    /**
     * @dev Ottieni i dettagli di un relay
     * @param _relayAddress Indirizzo del relay
     */
    function getRelayDetails(address _relayAddress) 
        external view returns (
            string memory url,
            address relayAddress,
            bool isActive,
            uint256 registeredAt
        ) {
        Relay memory relay = relays[_relayAddress];
        return (relay.url, relay.relayAddress, relay.isActive, relay.registeredAt);
    }
    
    /**
     * @dev Ottieni tutti i relay registrati
     */
    function getAllRelays() external view returns (address[] memory) {
        return registeredRelays;
    }
    
    /**
     * @dev Permette di scadere manualmente una sottoscrizione (per pulizia)
     * @param _user Indirizzo dell'utente
     * @param _relayAddress Indirizzo del relay
     */
    function expireSubscription(address _user, address _relayAddress) external {
        require(
            msg.sender == _user || msg.sender == _relayAddress || msg.sender == owner,
            "Not authorized to expire subscription"
        );
        require(subscriptions[_user][_relayAddress].isActive, "Subscription not active");
        require(block.timestamp > subscriptions[_user][_relayAddress].endTime, "Subscription not expired yet");
        
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
    
    // Modificatore per controllare la pausa di emergenza
    modifier notPaused() {
        require(!emergencyPause, "Contract is paused");
        _;
    }
}