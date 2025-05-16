# Shogun Relay System Documentation for LLMs

This document provides essential information for LLMs to understand and assist with the Shogun Relay Protocol, its deployment using Ignition, and the subscription process.

## Relay System Architecture

The Shogun Relay Protocol consists of three primary smart contracts:

### 1. Registry Contract (`Registry.sol`)

The Registry serves as a central directory of all available relay services:
- Stores information about registered relays (address, URL, metadata)
- Allows users to discover relays by URL or owner
- Provides functions to register, update, activate, and deactivate relays
- Maintains a mapping between relay URLs and addresses

```solidity
// Key functions:
function registerRelay(address _relayAddress, string calldata _url, string calldata _metadata) external;
function findRelayByUrl(string calldata _url) external view returns (address);
function isRegisteredRelay(address _relayAddress) external view returns (bool);
function getRelayInfo(address _relayAddress) external view returns (address owner, string memory url, string memory metadata, uint256 registrationTime, bool active);
```

### 2. Relay Contract (`Relay.sol`)

Individual relay contracts that manage subscriptions and user public keys:
- Handles subscription payments and duration
- Stores user public keys for authorized access
- Supports both standalone operation and protocol integration
- Configurable pricing and subscription parameters

```solidity
// Key functions:
function subscribe(uint256 _months, bytes calldata _pubKey) external payable;
function isSubscriptionActive(address _user) external view returns (bool);
function isAuthorizedByPubKey(bytes calldata _pubKey) external view returns (bool);
function getUserSubscriptionInfo(address _user) external view returns (uint256 expires, bytes memory pubKey);
```

### 3. EntryPoint Contract (`EntryPoint.sol`)

The EntryPoint provides a unified interface for interacting with multiple relays:
- Allows subscriptions via URL lookup or direct relay address
- Supports batch operations across multiple relays
- Calculates subscription costs including service fees
- Manages protocol-wide settings and standards

```solidity
// Key functions:
function subscribeViaUrl(string calldata _relayUrl, uint256 _months, bytes calldata _pubKey) external payable;
function subscribeDirect(address _relayAddress, uint256 _months, bytes calldata _pubKey) external payable;
function batchSubscribe(address[] calldata _relayAddresses, uint256 _months, bytes[] calldata _pubKeys) external payable;
function checkSubscription(address _user, address _relayAddress) external view returns (bool);
```

## Operating Modes

Each Relay contract can operate in two distinct modes:

### SINGLE Mode
- Default standalone mode
- Users interact directly with the relay contract
- No dependency on Registry or EntryPoint
- Suitable for independent relay services

### PROTOCOL Mode
- Integrated with the Shogun Protocol ecosystem
- Only accepts subscription calls from the EntryPoint
- Registered in the Registry for discovery
- Provides standardized user experience across relays

## Ignition Deployment System

Shogun uses Hardhat Ignition for structured contract deployment:

### Deployment Structure
- Located in `shogun-contracts/ignition/modules/`
- Main deployment file: `Network.ts`
- Creates and links Registry, Relay, and EntryPoint contracts
- Configures initial settings and relationships

### Deployment Process
1. Compile contracts: `npx hardhat compile`
2. Start local network: `npx hardhat node`
3. Deploy using Ignition: `npx hardhat ignition deploy ./ignition/modules/Network.ts`
4. Verification (optional): `npx hardhat ignition verify ./ignition/modules/Network.ts`

### Deployment Artifacts
- Located in `shogun-contracts/ignition/deployments/chain-{chainId}/`
- Contains contract addresses in `deployed_addresses.json`
- Stores ABIs and deployment transactions
- Used by scripts and applications to interact with deployed contracts

## Subscription Process

The subscription process involves several steps:

### Using the `subscribe.ts` Script

The script in `shogun-contracts/scripts/subscribe.ts` demonstrates how to:
1. Generate cryptographic keys using GunDB/SEA
2. Convert GunDB public keys to the format expected by the contract
3. Calculate subscription costs
4. Subscribe to a relay by calling the contract
5. Pre-authorize the key with the relay server
6. Save subscription data to the GunDB database

### Key Components of `subscribe.ts`:

1. **Key Generation and Conversion**:
   - Creates GunDB keypair using SEA.pair()
   - Converts GunDB's base64 public key to hex format
   - Transforms hex string to bytes for contract submission

2. **Contract Interaction**:
   - Reads relay contract address from Ignition deployment artifacts
   - Calculates subscription cost based on price and duration
   - Calls `subscribe()` function with the public key and payment

3. **Relay Server Communication**:
   - Pre-authorizes the public key with the relay server
   - Attempts to obtain a JWT token for authenticated communication
   - Falls back to legacy authorization if token acquisition fails

4. **GunDB Integration**:
   - Authenticates to GunDB using the generated keypair
   - Stores subscription details in the user's space
   - Includes JWT token in requests for authorized access

### Running the Subscription Script

```bash
# Set up environment variables in .env file:
# USER_PRIVATE_KEY=<ethereum_private_key>
# SUBSCRIBE_MONTHS=<number_of_months>

# Run the script
npx hardhat run scripts/subscribe.ts --network localhost
```

## Common Issues and Solutions

When assisting users with the Shogun Relay system, be aware of these common issues:

1. **Deployment Errors**:
   - Ensure correct dependencies are installed
   - Verify network configuration in hardhat.config.ts
   - Check for sufficient ETH in deployer account

2. **Subscription Failures**:
   - Verify relay contract address is correct
   - Ensure sufficient ETH is provided for subscription
   - Check public key format and conversion
   - Validate that the relay server is running

3. **GunDB Integration Issues**:
   - Confirm GunDB peer URL is accessible
   - Ensure proper authentication with valid keypair
   - Verify JWT token is being correctly included in requests

4. **Contract Interaction Problems**:
   - Check ABI consistency with deployed contracts
   - Verify correct contract addresses are being used
   - Ensure proper value calculation for subscription payments

## SDK Integration

The Shogun Core SDK provides TypeScript interfaces for the relay system:

```typescript
import { 
  Registry, 
  SimpleRelay, 
  EntryPoint,
  RelayOperatingMode
} from "shogun-core/contracts";

// Initialize contract instances
const registry = new Registry({
  registryAddress: "0x1234...",
  providerUrl: "https://ethereum-rpc-url.com"
});

const relay = new SimpleRelay({
  relayAddress: "0x7890...",
  registryAddress: "0x1234...",
  providerUrl: "https://ethereum-rpc-url.com"
});

// Subscribe to a relay
const tx = await entryPoint.subscribeDirect(
  relayAddress,
  6, // 6 months
  publicKeyHex,
  { value: totalCost }
);
```
