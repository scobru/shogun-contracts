// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleRelay is Ownable {
    // Constants and Configurable Parameters
    uint256 public constant DAY = 1 days;
    uint256 public daysPerMonth; // Set by owner
    uint256 public pricePerMonth; // Set by owner, in wei
    string public relayUrl;

    // User subscription info
    struct UserInfo {
        uint256 expires;
        bytes pubKey; // User's public key
    }
    mapping(address => UserInfo) public userInfoByAddress;
    mapping(bytes => address) public userAddressByPubKey; // For pubKey to user address lookup

    // Events
    event Subscribed(address indexed user, bytes pubKey, uint256 months, uint256 newExpiryTimestamp);
    event PayoutToOwner(address indexed owner, uint256 amount);
    event PriceChanged(uint256 oldPrice, uint256 newPrice);
    event DaysPerMonthChanged(uint256 oldDays, uint256 newDays);
    event RelayUrlUpdated(string oldUrl, string newUrl);
    event PubKeySet(address indexed user, bytes pubKey, bytes oldPubKey);
    event PubKeyRemoved(address indexed user, bytes pubKey);
    event Decommissioned(address indexed owner, uint256 withdrawnAmount);
    event GenericTransactionSent(address indexed to, uint256 value, bytes data, bool success);

    constructor(
        address _initialOwner,
        uint256 _initialPriceWei,
        uint256 _initialDaysPerMonth,
        string memory _url
    ) Ownable(_initialOwner) {
        require(_initialOwner != address(0), "SR: Invalid owner");
        require(bytes(_url).length > 0, "SR: URL cannot be empty");
        require(_initialDaysPerMonth > 0 && _initialDaysPerMonth <= 31, "SR: Invalid days per month");

        pricePerMonth = _initialPriceWei;
        daysPerMonth = _initialDaysPerMonth;
        relayUrl = _url;
    }

    // --- Subscription Management ---
    function subscribe(uint256 _months, bytes calldata _pubKey) external payable {
        require(_months > 0, "SR: Months must be positive");
        require(pricePerMonth > 0, "SR: Price not set or relay decommissioned");
        require(msg.value == _months * pricePerMonth, "SR: Incorrect payment value");
        
        if (_pubKey.length > 0) {
            require(_pubKey.length >= 32 && _pubKey.length <= 128, "SR: Invalid pubKey length");
        }
        
        _recordSubscription(msg.sender, _months, _pubKey);
    }

    // Internal function to record subscription
    function _recordSubscription(address _user, uint256 _months, bytes calldata _pubKey) internal {
        UserInfo storage user = userInfoByAddress[_user];
        uint256 baseTimestamp = block.timestamp > user.expires ? block.timestamp : user.expires;
        uint256 newExpiryTimestamp = baseTimestamp + _months * daysPerMonth * DAY;
        user.expires = newExpiryTimestamp;

        emit Subscribed(_user, _pubKey, _months, newExpiryTimestamp);

        if (_pubKey.length != 0) {
            bytes memory oldPubKey = user.pubKey;
            // If new pubkey is different from old one, or if old one was empty
            if (keccak256(oldPubKey) != keccak256(_pubKey)) {
                // Remove old pubkey mapping if it existed for this user
                if (oldPubKey.length > 0 && userAddressByPubKey[oldPubKey] == _user) {
                    delete userAddressByPubKey[oldPubKey];
                    emit PubKeyRemoved(_user, oldPubKey);
                }
                
                // Check if new pubkey is already in use by an active, different user
                address existingUserWithNewPubKey = userAddressByPubKey[_pubKey];
                if (existingUserWithNewPubKey != address(0) && existingUserWithNewPubKey != _user) {
                    require(userInfoByAddress[existingUserWithNewPubKey].expires < block.timestamp, "SR: PubKey already in use by an active user");
                    // If the existing user is expired, their old mapping can be overwritten
                    delete userAddressByPubKey[_pubKey]; 
                }
                
                user.pubKey = _pubKey;
                userAddressByPubKey[_pubKey] = _user;
                emit PubKeySet(_user, _pubKey, oldPubKey);
            }
        } else { // If an empty pubkey is provided, ensure any existing one for this user is cleared
            bytes memory oldPubKey = user.pubKey;
            if (oldPubKey.length > 0 && userAddressByPubKey[oldPubKey] == _user) {
                delete userAddressByPubKey[oldPubKey];
                user.pubKey = ""; // Clear it in UserInfo as well
                emit PubKeyRemoved(_user, oldPubKey);
            }
        }
    }

    // --- Subscription Management Functions ---
    function isSubscriptionActive(address _user) external view returns (bool) {
        return userInfoByAddress[_user].expires > block.timestamp;
    }

    function getUserSubscriptionInfo(address _user) external view returns (uint256 expires, bytes memory pubKey) {
        return (userInfoByAddress[_user].expires, userInfoByAddress[_user].pubKey);
    }

    function isAuthorizedByPubKey(bytes calldata _pubKey) external view returns (bool) {
        if (_pubKey.length == 0) return false;
        address userAddr = userAddressByPubKey[_pubKey];
        if (userAddr == address(0)) {
            return false;
        }
        return userInfoByAddress[userAddr].expires > block.timestamp;
    }

    /**
     * @notice Verifica se una chiave pubblica è autorizzata (alias per isAuthorizedByPubKey)
     * @param _pubKey Chiave pubblica da verificare
     * @return true se la chiave è autorizzata, false altrimenti
     */
    function isSubscribed(bytes calldata _pubKey) external view returns (bool) {
        return this.isAuthorizedByPubKey(_pubKey);
    }

    /**
     * @notice Invia una transazione generica a un contratto o un indirizzo
     * @dev Solo il proprietario può chiamare questa funzione
     * @param _to Indirizzo di destinazione della transazione
     * @param _value Quantità di ETH da inviare (in wei)
     * @param _data Dati da inviare con la transazione (calldata)
     * @return success True se la transazione ha avuto successo, False altrimenti
     * @return result Dati restituiti dalla chiamata (se presenti)
     */
    function execute(
        address _to, 
        uint256 _value, 
        bytes calldata _data
    ) external onlyOwner returns (bool success, bytes memory result) {
        require(_to != address(0), "SR: Cannot send to zero address");
        require(address(this).balance >= _value, "SR: Insufficient balance");

        (success, result) = _to.call{value: _value}(_data);
        
        emit GenericTransactionSent(_to, _value, _data, success);
        
        return (success, result);
    }

    // --- Simplified Payout for Relay Owner ---
    function withdrawFunds() external onlyOwner {
        require(pricePerMonth > 0, "SR: Relay decommissioned");
        
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "SR: No funds available for payout");
        
        emit PayoutToOwner(owner(), contractBalance);
        Address.sendValue(payable(owner()), contractBalance);
    }

    // --- Owner Admin Functions ---
    function setPrice(uint256 _newPrice) external onlyOwner {
        require(pricePerMonth > 0, "SR: Relay decommissioned");
        
        uint256 oldPrice = pricePerMonth;
        pricePerMonth = _newPrice;
        emit PriceChanged(oldPrice, _newPrice);
    }

    function setDaysPerMonth(uint256 _days) external onlyOwner {
        require(pricePerMonth > 0, "SR: Relay decommissioned");
        require(_days > 0 && _days <= 31, "SR: Invalid days");
        uint256 oldDays = daysPerMonth;
        daysPerMonth = _days;
        emit DaysPerMonthChanged(oldDays, _days);
    }
    
    function updateRelayUrl(string calldata _newUrl) external onlyOwner {
        require(pricePerMonth > 0, "SR: Relay decommissioned");
        require(bytes(_newUrl).length > 0, "SR: URL cannot be empty");
        string memory oldUrl = relayUrl;
        relayUrl = _newUrl;
        emit RelayUrlUpdated(oldUrl, _newUrl);
    }

    // --- Decommissioning ---
    function decommissionAndWithdrawAllFunds() external onlyOwner {
        // Set price to 0 to prevent new subscriptions and signal decommissioning
        pricePerMonth = 0; 

        uint256 balanceToWithdraw = address(this).balance;
        require(balanceToWithdraw > 0, "SR: No funds to withdraw");

        emit Decommissioned(owner(), balanceToWithdraw);
        Address.sendValue(payable(owner()), balanceToWithdraw);
    }

    // --- Fallback ---
    receive() external payable {
        // Accept ETH payments
    }

    // --- View functions ---
    function getRelayOperationalConfig() external view returns (
        string memory _url,
        uint256 _price,
        uint256 _daysInMonth
    ) {
        return (relayUrl, pricePerMonth, daysPerMonth);
    }
}
