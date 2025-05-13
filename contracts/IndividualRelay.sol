// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// Rimosso import OracleBridge

// Interface for RelayRegistry
interface IRelayRegistry {
    function registerRelayContract(address _relayOwner, string calldata _url) external;
    // unregisterRelayContract is called by EOA owner directly on RelayRegistry
    // updateRelayUrl is called by EOA owner directly on RelayRegistry
    function isRegistered(address _relayContractAddress) external view returns (bool);
}

contract IndividualRelay is Ownable {
    // Using EnumerableSet for AddressSet was removed as it's not strictly necessary for user management here.
    // PubKey mapping and direct user info should suffice.

    // Constants and Configurable Parameters
    uint256 public constant DAY = 1 days;
    uint256 public daysPerMonth; // Set by owner
    uint256 public pricePerMonth; // Set by owner, in wei
    uint256 public minRequiredStake; // Minimum stake this relay must maintain, set at deployment
    uint256 public minPayoutAmountToOwner; // Min payout to owner from subscriptions
    // Removed rootFreezeTime variable

    string public relayUrl;
    uint256 public currentStakeAmount; // Stake provided by the owner for this relay
    uint256 public lastWithdrawalTimestamp; // Timestamp of last withdrawal to limit withdrawal frequency

    // User subscription info
    struct UserInfo {
        uint256 expires;
        bytes pubKey; // User's public key
    }
    mapping(address => UserInfo) public userInfoByAddress;
    mapping(bytes => address) public userAddressByPubKey; // For pubKey to user address lookup

    // Registry (removed Oracle)
    IRelayRegistry public relayRegistry;

    // Events
    event Subscribed(address indexed user, bytes pubKey, uint256 months, uint256 newExpiryTimestamp);
    event PayoutToOwner(address indexed owner, uint256 amount);
    event PriceChanged(uint256 oldPrice, uint256 newPrice);
    event DaysPerMonthChanged(uint256 oldDays, uint256 newDays);
    event MinPayoutAmountToOwnerChanged(uint256 oldAmount, uint256 newAmount);
    // Removed RootFreezeTimeChanged event
    // Removed OracleUpdated event
    event RegistryUpdated(address indexed oldRegistry, address indexed newRegistry);
    event RelayUrlUpdated(string oldUrl, string newUrl);
    event StakeDeposited(address indexed staker, uint256 amount, uint256 newTotalStake);
    event StakeWithdrawn(address indexed staker, uint256 amount, uint256 newTotalStake);
    event PubKeySet(address indexed user, bytes pubKey, bytes oldPubKey);
    event PubKeyRemoved(address indexed user, bytes pubKey);
    event Decommissioned(address indexed owner, uint256 withdrawnAmount);
    event WithdrawalCooldownSet(uint256 oldCooldown, uint256 newCooldown);

    // Added withdrawal cooldown period (default 1 day)
    uint256 public withdrawalCooldown = 1 days;

    constructor(
        address _initialOwner,
        uint256 _initialPriceWei,
        uint256 _initialDaysPerMonth,
        string memory _url,
        uint256 _deploymentMinRequiredStake,
        uint256 _initialMinPayoutToOwner,
        uint256 _initialWithdrawalCooldown,
        address _registryAddress
    ) payable Ownable(_initialOwner) {
        require(_initialOwner != address(0), "IR: Invalid owner");
        require(_registryAddress != address(0), "IR: Invalid registry");
        require(bytes(_url).length > 0, "IR: URL cannot be empty");
        require(_initialDaysPerMonth > 0 && _initialDaysPerMonth <= 31, "IR: Invalid days per month");
        require(_deploymentMinRequiredStake > 0, "IR: Min required stake must be positive");
        require(msg.value >= _deploymentMinRequiredStake, "IR: Initial stake too low");

        pricePerMonth = _initialPriceWei;
        daysPerMonth = _initialDaysPerMonth;
        relayUrl = _url;
        minRequiredStake = _deploymentMinRequiredStake;
        minPayoutAmountToOwner = _initialMinPayoutToOwner;
        withdrawalCooldown = _initialWithdrawalCooldown;
        
        // Removed oracle
        relayRegistry = IRelayRegistry(_registryAddress);

        currentStakeAmount = msg.value;
        emit StakeDeposited(_initialOwner, msg.value, currentStakeAmount);

        relayRegistry.registerRelayContract(_initialOwner, _url);
    }

    // --- Subscription Management ---
    function subscribe(uint256 _months, bytes calldata _pubKey) external payable {
        require(_months > 0, "IR: Months must be positive");
        require(pricePerMonth > 0, "IR: Price not set or relay decommissioned");
        require(msg.value == _months * pricePerMonth, "IR: Incorrect payment value");
        
        if (_pubKey.length > 0) {
            require(_pubKey.length >= 32 && _pubKey.length <= 128, "IR: Invalid pubKey length");
        }
        
        UserInfo storage user = userInfoByAddress[msg.sender];
        uint256 baseTimestamp = block.timestamp > user.expires ? block.timestamp : user.expires;
        uint256 newExpiryTimestamp = baseTimestamp + _months * daysPerMonth * DAY;
        user.expires = newExpiryTimestamp;

        emit Subscribed(msg.sender, _pubKey, _months, newExpiryTimestamp);

        if (_pubKey.length != 0) {
            bytes memory oldPubKey = user.pubKey;
            // If new pubkey is different from old one, or if old one was empty
            if (keccak256(oldPubKey) != keccak256(_pubKey)) {
                // Remove old pubkey mapping if it existed for this user
                if (oldPubKey.length > 0 && userAddressByPubKey[oldPubKey] == msg.sender) {
                    delete userAddressByPubKey[oldPubKey];
                    emit PubKeyRemoved(msg.sender, oldPubKey);
                }
                
                // Check if new pubkey is already in use by an active, different user
                address existingUserWithNewPubKey = userAddressByPubKey[_pubKey];
                if (existingUserWithNewPubKey != address(0) && existingUserWithNewPubKey != msg.sender) {
                    require(userInfoByAddress[existingUserWithNewPubKey].expires < block.timestamp, "IR: PubKey already in use by an active user");
                    // If the existing user is expired, their old mapping can be overwritten
                    delete userAddressByPubKey[_pubKey]; 
                }
                
                user.pubKey = _pubKey;
                userAddressByPubKey[_pubKey] = msg.sender;
                emit PubKeySet(msg.sender, _pubKey, oldPubKey);
            }
        } else { // If an empty pubkey is provided, ensure any existing one for this user is cleared
            bytes memory oldPubKey = user.pubKey;
            if (oldPubKey.length > 0 && userAddressByPubKey[oldPubKey] == msg.sender) {
                delete userAddressByPubKey[oldPubKey];
                user.pubKey = ""; // Clear it in UserInfo as well
                emit PubKeyRemoved(msg.sender, oldPubKey);
            }
        }
    }

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

    // --- Simplified Payout Logic for Relay Owner ---
    // Sostituita la funzione releasePaymentToOwner con una più semplice
    function withdrawSubscriptionFunds() external onlyOwner {
        require(currentStakeAmount >= minRequiredStake, "IR: Insufficient stake to operate");
        require(pricePerMonth > 0, "IR: Relay decommissioned");
        
        // Implement a cooldown period to prevent excessive withdrawals
        require(block.timestamp >= lastWithdrawalTimestamp + withdrawalCooldown, "IR: Withdrawal cooldown period not elapsed");
        
        uint256 contractBalance = address(this).balance;
        require(contractBalance > currentStakeAmount, "IR: No subscription funds above stake");
        uint256 availableForPayout = contractBalance - currentStakeAmount;
        
        require(availableForPayout > 0, "IR: No funds available for payout");
        require(availableForPayout >= minPayoutAmountToOwner, "IR: Payout amount too small");
        
        lastWithdrawalTimestamp = block.timestamp;
        emit PayoutToOwner(owner(), availableForPayout);
        Address.sendValue(payable(owner()), availableForPayout);
    }

    // --- Owner Admin Functions ---
    function setPrice(uint256 _newPrice) external onlyOwner {
        require(pricePerMonth > 0, "IR: Relay decommissioned");
        uint256 oldPrice = pricePerMonth;
        pricePerMonth = _newPrice;
        emit PriceChanged(oldPrice, _newPrice);
    }

    function setDaysPerMonth(uint256 _days) external onlyOwner {
        require(pricePerMonth > 0, "IR: Relay decommissioned");
        require(_days > 0 && _days <= 31, "IR: Invalid days");
        uint256 oldDays = daysPerMonth;
        daysPerMonth = _days;
        emit DaysPerMonthChanged(oldDays, _days);
    }

    function setMinPayoutAmountToOwner(uint256 _amount) external onlyOwner {
        require(pricePerMonth > 0, "IR: Relay decommissioned");
        uint256 oldAmount = minPayoutAmountToOwner;
        minPayoutAmountToOwner = _amount;
        emit MinPayoutAmountToOwnerChanged(oldAmount, _amount);
    }
    
    // Nuova funzione per impostare il cooldown dei prelievi
    function setWithdrawalCooldown(uint256 _cooldownPeriod) external onlyOwner {
        require(pricePerMonth > 0, "IR: Relay decommissioned");
        uint256 oldCooldown = withdrawalCooldown;
        withdrawalCooldown = _cooldownPeriod;
        emit WithdrawalCooldownSet(oldCooldown, _cooldownPeriod);
    }
    
    // Removed setRootFreezeTime function
    // Removed updateOracleAddress function

    function updateRegistryAddress(address _newRegistry) external onlyOwner {
        // Allow updating registry even if decommissioned, in case of error/migration
        require(_newRegistry != address(0), "IR: Invalid registry address");
        address oldRegistry = address(relayRegistry);
        relayRegistry = IRelayRegistry(_newRegistry);
        emit RegistryUpdated(oldRegistry, _newRegistry);
    }
    
    function updateRelayUrl(string calldata _newUrl) external onlyOwner {
        require(pricePerMonth > 0, "IR: Relay decommissioned");
        require(bytes(_newUrl).length > 0, "IR: URL cannot be empty");
        string memory oldUrl = relayUrl;
        relayUrl = _newUrl;
        // Owner should call RelayRegistry.updateRelayUrl separately to keep concerns separate.
        emit RelayUrlUpdated(oldUrl, _newUrl);
    }

    // --- Stake Management by Owner ---
    function depositStake() external payable onlyOwner {
        require(pricePerMonth > 0, "IR: Relay decommissioned");
        currentStakeAmount += msg.value;
        emit StakeDeposited(owner(), msg.value, currentStakeAmount);
    }

    function withdrawStake(uint256 _amount) external onlyOwner {
        require(pricePerMonth > 0, "IR: Relay decommissioned");
        require(_amount > 0, "IR: Amount must be positive");
        require(currentStakeAmount - _amount >= minRequiredStake, "IR: Withdrawal below min stake");
        currentStakeAmount -= _amount;
        emit StakeWithdrawn(owner(), _amount, currentStakeAmount);
        Address.sendValue(payable(owner()), _amount);
    }

    // --- Decommissioning ---
    function decommissionAndWithdrawAllFunds() external onlyOwner {
        // 1. Owner should first call RelayRegistry.unregisterRelayContract(address(this))
        // We can add a check here if the registry supports it e.g. !relayRegistry.isRegistered(address(this))
        // require(!relayRegistry.isRegistered(address(this)), "IR: Must unregister from Registry first");

        // 2. Set price to 0 to prevent new subscriptions and signal decommissioning
        pricePerMonth = 0; 

        uint256 balanceToWithdraw = address(this).balance;
        require(balanceToWithdraw > 0, "IR: No funds to withdraw");

        uint256 stakeBeingWithdrawn = currentStakeAmount;
        currentStakeAmount = 0; // Clear stake amount

        emit Decommissioned(owner(), balanceToWithdraw);
        if (stakeBeingWithdrawn > 0) {
            emit StakeWithdrawn(owner(), stakeBeingWithdrawn, 0);
        }
        
        Address.sendValue(payable(owner()), balanceToWithdraw);
    }

    // --- Fallback ---
    receive() external payable {
        // Can be used for additional stake deposits by owner, or direct payments if designed.
        // For simplicity, this just accepts ETH. Could add logic to attribute to stake if msg.sender == owner().
    }

    // --- View functions ---
    function getOwner() external view returns (address) {
        return owner();
    }

    function getRelayOperationalConfig() external view returns (
        string memory _url,
        uint256 _price,
        uint256 _daysInMonth,
        uint256 _actualStake,
        uint256 _minimumStake,
        uint256 _withdrawalCooldown
    ) {
        return (relayUrl, pricePerMonth, daysPerMonth, currentStakeAmount, minRequiredStake, withdrawalCooldown);
    }

    function getAvailableFundsForWithdrawal() external view returns (uint256 availableFunds, bool cooldownElapsed) {
        uint256 contractBalance = address(this).balance;
        
        // Se il saldo del contratto è inferiore allo stake, non ci sono fondi disponibili
        if (contractBalance <= currentStakeAmount) {
            return (0, false);
        }
        
        availableFunds = contractBalance - currentStakeAmount;
        cooldownElapsed = block.timestamp >= lastWithdrawalTimestamp + withdrawalCooldown;
        
        return (availableFunds, cooldownElapsed);
    }
} 