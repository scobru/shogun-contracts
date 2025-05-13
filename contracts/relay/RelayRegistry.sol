// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // For admin functions on the registry itself

// Interfaccia minima per interagire con IndividualRelay
interface IIndividualRelay {
    function isSubscriptionActive(address _user) external view returns (bool);
    function subscribe(uint256 _months, bytes calldata _pubKey) external payable;
    function pricePerMonth() external view returns (uint256);
}

contract RelayRegistry is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    struct RelayContractInfo {
        address owner; // Owner of the IndividualRelay contract (the EOA who deployed it)
        string url;
        // Future: uint256 registrationTimestamp;
    }

    mapping(address => RelayContractInfo) public relayContractDetails; // relay contract address => info
    EnumerableSet.AddressSet private relayContractSet;

    event RelayRegistered(address indexed relayContract, address indexed owner, string url);
    event RelayUnregistered(address indexed relayContract, address indexed owner);
    event RelayUrlUpdated(address indexed relayContract, address indexed owner, string newUrl);
    event SubscriptionMade(address indexed user, address indexed relayContract, uint256 months);

    constructor(address initialOwner) Ownable(initialOwner) {
        // The initialOwner is the administrator of this RelayRegistry contract
    }

    /**
     * @notice Called by an IndividualRelay contract during its deployment to register itself.
     * @param _relayOwner The EOA owner of the calling IndividualRelay contract.
     * @param _url The WebSocket URL of the relay.
     */
    function registerRelayContract(address _relayOwner, string calldata _url) external {
        require(_relayOwner != address(0), "RelayRegistry: Invalid relay owner");
        require(bytes(_url).length > 0, "RelayRegistry: URL cannot be empty");
        require(!relayContractSet.contains(msg.sender), "RelayRegistry: Relay contract already registered");

        relayContractDetails[msg.sender] = RelayContractInfo(_relayOwner, _url);
        relayContractSet.add(msg.sender);
        emit RelayRegistered(msg.sender, _relayOwner, _url);
    }

    /**
     * @notice Called by the EOA owner of an IndividualRelay contract to unregister it.
     * @param _relayContractAddress The address of the IndividualRelay contract to unregister.
     */
    function unregisterRelayContract(address _relayContractAddress) external {
        require(relayContractSet.contains(_relayContractAddress), "RelayRegistry: Relay contract not registered");
        RelayContractInfo storage info = relayContractDetails[_relayContractAddress];
        require(info.owner == msg.sender, "RelayRegistry: Caller is not the owner of the relay contract");

        delete relayContractDetails[_relayContractAddress];
        relayContractSet.remove(_relayContractAddress);
        emit RelayUnregistered(_relayContractAddress, msg.sender);
    }

    /**
     * @notice Called by the EOA owner of an IndividualRelay contract to update its URL.
     * @param _relayContractAddress The address of the IndividualRelay contract.
     * @param _newUrl The new WebSocket URL for the relay.
     */
    function updateRelayUrl(address _relayContractAddress, string calldata _newUrl) external {
        require(relayContractSet.contains(_relayContractAddress), "RelayRegistry: Relay contract not registered");
        RelayContractInfo storage info = relayContractDetails[_relayContractAddress];
        require(info.owner == msg.sender, "RelayRegistry: Caller is not the owner of the relay contract");
        require(bytes(_newUrl).length > 0, "RelayRegistry: New URL cannot be empty");

        info.url = _newUrl;
        emit RelayUrlUpdated(_relayContractAddress, msg.sender, _newUrl);
    }

    /**
     * @notice Get the details of a registered relay contract.
     * @param _relayContractAddress The address of the relay contract.
     * @return owner_ The EOA owner of the relay contract.
     * @return url_ The WebSocket URL of the relay.
     */
    function getRelayDetails(address _relayContractAddress) external view returns (address owner_, string memory url_) {
        require(relayContractSet.contains(_relayContractAddress), "RelayRegistry: Relay contract not registered");
        RelayContractInfo storage info = relayContractDetails[_relayContractAddress];
        return (info.owner, info.url);
    }

    /**
     * @notice Get a list of all registered relay contract addresses.
     * @return An array of relay contract addresses.
     */
    function getAllRelayContracts() external view returns (address[] memory) {
        return relayContractSet.values();
    }

    /**
     * @notice Get the total number of registered relay contracts.
     * @return The count of registered relays.
     */
    function getRelayCount() external view returns (uint256) {
        return relayContractSet.length();
    }

    /**
     * @notice Check if a contract address is a registered relay.
     * @param _relayContractAddress The address to check.
     * @return True if registered, false otherwise.
     */
    function isRegistered(address _relayContractAddress) external view returns (bool) {
        return relayContractSet.contains(_relayContractAddress);
    }

    // NUOVE FUNZIONI

    /**
     * @notice Verifica se un utente è attivamente iscritto a un relay specifico.
     * @param _relayContractAddress L'indirizzo del contratto relay da verificare.
     * @param _user L'indirizzo dell'utente da verificare.
     * @return True se l'utente ha una sottoscrizione attiva, false altrimenti.
     */
    function isUserSubscribedToRelay(address _relayContractAddress, address _user) external view returns (bool) {
        require(relayContractSet.contains(_relayContractAddress), "RelayRegistry: Relay contract not registered");
        return IIndividualRelay(_relayContractAddress).isSubscriptionActive(_user);
    }

    /**
     * @notice Permette a un utente di sottoscriversi a un relay direttamente attraverso il registro.
     * @param _relayContractAddress L'indirizzo del contratto relay a cui iscriversi.
     * @param _months Il numero di mesi da sottoscrivere.
     * @param _pubKey La chiave pubblica dell'utente (può essere vuota).
     */
    function subscribeToRelay(address _relayContractAddress, uint256 _months, bytes calldata _pubKey) external payable {
        require(relayContractSet.contains(_relayContractAddress), "RelayRegistry: Relay contract not registered");
        
        IIndividualRelay relay = IIndividualRelay(_relayContractAddress);
        uint256 price = relay.pricePerMonth();
        require(msg.value == _months * price, "RelayRegistry: Incorrect payment amount");
        
        // Inoltra la chiamata al contratto del relay
        relay.subscribe{value: msg.value}(_months, _pubKey);
        
        emit SubscriptionMade(msg.sender, _relayContractAddress, _months);
    }

    /**
     * @notice Ottiene il prezzo di sottoscrizione mensile per un relay specifico.
     * @param _relayContractAddress L'indirizzo del contratto relay.
     * @return Il prezzo in wei per un mese di sottoscrizione.
     */
    function getRelaySubscriptionPrice(address _relayContractAddress) external view returns (uint256) {
        require(relayContractSet.contains(_relayContractAddress), "RelayRegistry: Relay contract not registered");
        return IIndividualRelay(_relayContractAddress).pricePerMonth();
    }

    /**
     * @notice Verifica tutti i relay a cui un utente è attivamente iscritto.
     * @param _user L'indirizzo dell'utente da verificare.
     * @return Un array di indirizzi dei contratti relay a cui l'utente è iscritto.
     */
    function getUserActiveRelays(address _user) external view returns (address[] memory) {
        uint256 relayCount = relayContractSet.length();
        address[] memory activeRelays = new address[](relayCount); // Array temporaneo con dimensione massima
        uint256 activeCount = 0; 
        
        for (uint256 i = 0; i < relayCount; i++) {
            address relayAddress = relayContractSet.at(i);
            if (IIndividualRelay(relayAddress).isSubscriptionActive(_user)) {
                activeRelays[activeCount] = relayAddress;
                activeCount++;
            }
        }
        
        // Creiamo un array delle dimensioni giuste
        address[] memory result = new address[](activeCount);
        for (uint256 i = 0; i < activeCount; i++) {
            result[i] = activeRelays[i];
        }
        
        return result;
    }
} 