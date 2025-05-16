# Shogun Relay Protocol

A decentralized protocol for managing subscription-based relay services on Ethereum. The protocol allows relay service providers to register their services and users to subscribe to them using a streamlined subscription system.

## Protocol Architecture

The Shogun Relay Protocol consists of three primary smart contracts:

### 1. Registry Contract

The Registry serves as a directory of all available relay services. It enables:

- Registration of relay services
- Discovery of relays via URL or address
- Management of relay metadata
- Activation/deactivation of relay services

### 2. Relay Contract

Each relay is an instance of the Relay contract that:

- Provides subscription management for a specific relay service
- Handles public key registration for users
- Manages subscription expirations
- Offers configurable pricing and duration settings
- Supports two operating modes: SINGLE and PROTOCOL

### 3. EntryPoint Contract

The EntryPoint contract acts as a user-facing interface for the protocol, allowing:

- Subscription to relays either directly or via URL lookup
- Batch subscription to multiple relays in a single transaction
- Subscription verification and management
- Fee collection mechanism for protocol sustainability
- Cost calculation before subscription

## Operating Modes

The Relay contract supports two distinct operating modes:

### SINGLE Mode
- Default mode for standalone relay operation
- Direct payment handling with built-in validation
- No dependency on the EntryPoint or Registry contracts
- Suitable for independent relay operators

### PROTOCOL Mode
- Integrated mode for participation in the full Shogun Protocol
- Subscription requests must come through the EntryPoint contract
- Requires registration in the Registry contract
- Provides enhanced discoverability and standardized user experience

## Getting Started

### Prerequisites

- Node.js and Yarn
- Hardhat development environment

### Installation

```bash
git clone https://github.com/your-org/shogun-contracts.git
cd shogun-contracts
yarn install
```

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Deploy Contracts

The project uses Hardhat Ignition for deployment:

```bash
# Start a local Ethereum node
npx hardhat node

# Deploy the contracts
npx hardhat ignition deploy ./ignition/modules/Network.ts
```

## Using the Protocol

### For Relay Providers

1. **Deploy a Relay Contract**:
   
   ```javascript
   const relay = await Relay.deploy(
     ownerAddress,
     ethers.parseEther("0.005"), // Monthly subscription price
     30,                         // Days per month
     "https://your-relay-url.com"
   );
   ```

2. **Register Your Relay in the Registry**:

   ```javascript
   await registry.registerRelay(
     relay.address,
     "https://your-relay-url.com",
     JSON.stringify({
       name: "Your Relay Service",
       description: "Description of your relay service"
     })
   );
   ```

   Alternatively, you can set up your relay to register itself:

   ```javascript
   await relay.setRegistry(
     registryAddress,
     true, // autoRegister
     JSON.stringify({
       name: "Your Relay Service",
       description: "Description of your relay service"
     })
   );
   ```

3. **Configure Your Relay for Protocol Integration**:

   ```javascript
   // Set the EntryPoint and enable PROTOCOL mode
   await relay.setEntryPoint(
     entryPointAddress,
     true // enableProtocolMode
   );
   ```

4. **Configure Your Relay Settings**:

   ```javascript
   // Update pricing
   await relay.setPrice(ethers.parseEther("0.007"));
   
   // Update days per month calculation
   await relay.setDaysPerMonth(28);
   
   // Update relay URL
   await relay.updateRelayUrl("https://new-relay-url.com");
   ```

5. **Administrative Operations**:

   ```javascript
   // Withdraw funds from the relay
   await relay.withdrawFunds();
   
   // Execute custom transactions (owner only)
   await relay.execute(
     targetAddress,
     ethers.parseEther("0.1"), // value to send
     encodedCallData
   );
   
   // Decommission relay and withdraw all funds
   await relay.decommissionAndWithdrawAllFunds();
   ```

### For Users

1. **Check Subscription Costs Before Subscribing**:

   ```javascript
   // Calculate cost for a direct subscription
   const { subscriptionCost, fee, totalCost } = await entryPoint.calculateSubscriptionCost(
     relayAddress,
     3 // months
   );
   console.log(`Subscription: ${ethers.formatEther(subscriptionCost)} ETH`);
   console.log(`EntryPoint Fee: ${ethers.formatEther(fee)} ETH`);
   console.log(`Total Cost: ${ethers.formatEther(totalCost)} ETH`);
   
   // Calculate cost using relay URL
   const { relayAddress, subscriptionCost, fee, totalCost } = 
     await entryPoint.calculateSubscriptionCostByUrl(
       "https://relay-service.com",
       3 // months
     );
   
   // Calculate cost for batch subscription to multiple relays
   const { totalSubscriptionCost, totalFee, totalCost, costs } = 
     await entryPoint.calculateBatchSubscriptionCost(
       [relay1Address, relay2Address],
       3 // months
     );
   console.log(`Total Cost for all relays: ${ethers.formatEther(totalCost)} ETH`);
   console.log(`Individual relay costs: ${costs.map(c => ethers.formatEther(c))}`);
   ```

2. **Subscribe to a Relay Directly**:

   ```javascript
   // Subscribe for 3 months with your public key
   await entryPoint.subscribeDirect(
     relayAddress,
     3, // months
     publicKeyBytes,
     { value: requiredPayment }
   );
   ```

3. **Subscribe via URL**:

   ```javascript
   // Find and subscribe to a relay by its URL
   await entryPoint.subscribeViaUrl(
     "https://relay-service.com",
     3, // months
     publicKeyBytes,
     { value: requiredPayment }
   );
   ```

4. **Batch Subscribe to Multiple Relays**:

   ```javascript
   await entryPoint.batchSubscribe(
     [relay1Address, relay2Address],
     3, // months
     [publicKey1Bytes, publicKey2Bytes],
     { value: totalRequiredPayment }
   );
   ```

5. **Check Subscription Status**:

   ```javascript
   // Check if subscription is active
   const isActive = await entryPoint.checkSubscription(userAddress, relayAddress);
   
   // Check if a public key is registered
   const hasPubKey = await entryPoint.hasRegisteredPubKey(userAddress, relayAddress);
   
   // Check if a specific public key is subscribed
   const isSubscribed = await entryPoint.isPubKeySubscribed(relayAddress, publicKeyBytes);
   
   // Batch check public keys across multiple relays
   const subscriptionStatuses = await entryPoint.batchCheckPubKeySubscription(
     [relay1Address, relay2Address],
     [publicKey1Bytes, publicKey2Bytes]
   );
   ```

## Key Features

### Subscription Cost Calculation

The EntryPoint provides several methods to calculate subscription costs before committing to a subscription:

```javascript
// Get the cost for a single relay subscription
const { subscriptionCost, fee, totalCost } = await entryPoint.calculateSubscriptionCost(
  relayAddress,
  3 // months
);

// Get the cost using relay URL (also returns the relay address)
const { relayAddress, subscriptionCost, fee, totalCost } = 
  await entryPoint.calculateSubscriptionCostByUrl(
    "https://relay-service.com",
    3 // months
  );

// Calculate cost for multiple relays at once
const { totalSubscriptionCost, totalFee, totalCost, costs } = 
  await entryPoint.calculateBatchSubscriptionCost(
    [relay1Address, relay2Address],
    3 // months
  );
```

These functions are view functions, meaning they don't consume gas when called externally (outside of transactions). They help users understand the exact cost before subscribing, including both the relay subscription cost and the EntryPoint service fee.

### Public Key Management

Users can register their public keys with relays, enabling secure communication:

```javascript
// Register a public key during subscription
await relay.subscribe(3, publicKeyBytes, { value: subscriptionCost });

// Check if a public key is authorized
const isAuthorized = await relay.isAuthorizedByPubKey(publicKeyBytes);

// Check specifically if a key is subscribed (alias for above)
const isSubscribed = await relay.isSubscribed(publicKeyBytes);
```

The protocol handles public key updates and replacements:
- If a user registers a new public key, the old one is automatically removed
- Public keys are unique across active users (expired subscriptions' keys can be reused)
- Keys must meet length requirements (between 32 and 128 bytes)

### Fee System

The EntryPoint contract includes a fee mechanism:

- Service fee percentage configurable by the protocol owner (up to 10%)
- Fees are collected when users subscribe through the EntryPoint
- Collected fees can be withdrawn by the EntryPoint owner:
  ```javascript
  await entryPoint.withdrawFees();
  ```

### Relay Discovery

Find relays through different methods:

```javascript
// Find by URL
const relayAddress = await registry.findRelayByUrl("https://relay-service.com");

// Get all relays by owner
const relays = await registry.getRelaysByOwner(ownerAddress, 0, 10);

// Get all active relays
const activeRelays = await registry.getAllRelays(true, 0, 10);
```

### Monitoring Protocol Events

The protocol emits various events that can be monitored:

#### Registry Events
- `RelayRegistered(address indexed relayAddress, address indexed owner, string url)`
- `RelayUpdated(address indexed relayAddress, string newUrl, string newMetadata)`
- `RelayDeactivated(address indexed relayAddress)`
- `RelayReactivated(address indexed relayAddress)`

#### Relay Events
- `Subscribed(address indexed user, bytes pubKey, uint256 months, uint256 newExpiryTimestamp)`
- `PubKeySet(address indexed user, bytes pubKey, bytes oldPubKey)`
- `PubKeyRemoved(address indexed user, bytes pubKey)`
- `PayoutToOwner(address indexed owner, uint256 amount)`
- `RelayUrlUpdated(string oldUrl, string newUrl)`
- `RegisteredInRegistry(address indexed registryAddress)`
- `OperatingModeChanged(OperatingMode newMode)`

#### EntryPoint Events
- `SubscriptionProcessed(address indexed user, address indexed relay, uint256 months, uint256 amount, uint256 fee)`
- `BatchSubscriptionProcessed(address indexed user, address[] relays, uint256 months, uint256 totalAmount, uint256 totalFee)`
- `FeesWithdrawn(address indexed to, uint256 amount)`
- `ServiceFeeUpdated(uint256 oldFee, uint256 newFee)`
- `RegistryUpdated(address indexed oldRegistry, address indexed newRegistry)`

Example of listening for events:

```javascript
// Listen for subscription events
relay.on("Subscribed", (user, pubKey, months, expiry) => {
  console.log(`User ${user} subscribed for ${months} months with pubKey ${pubKey}`);
});

// Listen for batch subscription events
entryPoint.on("BatchSubscriptionProcessed", (user, relays, months, amount, fee) => {
  console.log(`User ${user} subscribed to ${relays.length} relays for ${months} months`);
});

// Listen for fee changes
entryPoint.on("ServiceFeeUpdated", (oldFee, newFee) => {
  console.log(`Service fee changed from ${oldFee/100}% to ${newFee/100}%`);
});
```

## Contract SDK

Shogun Core provides a complete TypeScript SDK for interacting with the Shogun Protocol smart contracts. This enables your application to work with relay services, manage subscriptions, and verify memberships on the Ethereum blockchain.

### Main Components

The Contract SDK consists of three primary classes:

1. **Registry** - Directory of available relay services
2. **SimpleRelay** - Subscription management for relay services
3. **EntryPoint** - User-facing interface for protocol interaction

Each class provides type-safe methods to interact with their respective smart contracts.

### Setup and Initialization

```typescript
import { 
  Registry, 
  SimpleRelay, 
  EntryPoint,
  RelayOperatingMode
} from "shogun-core/contracts";

// Initialize contract instances
const registry = new Registry({
  registryAddress: "0x1234...",  // Address of the Registry contract
  providerUrl: "https://ethereum-rpc-url.com"  // Optional, or use a provider
});

const entryPoint = new EntryPoint({
  entryPointAddress: "0xabcd...",  // Address of the EntryPoint contract
  registryAddress: "0x1234...",
  providerUrl: "https://ethereum-rpc-url.com"
});

const relay = new SimpleRelay({
  relayAddress: "0x7890...",  // Address of a specific Relay contract
  registryAddress: "0x1234...",
  providerUrl: "https://ethereum-rpc-url.com"
});

// Configure with a signer for transactions
import { ethers } from "ethers";
const signer = new ethers.Wallet(privateKey, provider);
registry.setSigner(signer);
entryPoint.setSigner(signer);
relay.setSigner(signer);
```

### Discovering Relay Services

```typescript
// Get active relays from the registry
const activeRelays = await registry.getAllRelays(true, 0, 10);
console.log(`Found ${activeRelays.relays.length} active relays`);

// Find relay by URL
const relayAddress = await registry.findRelayByUrl("https://your-relay.com");
if (relayAddress && relayAddress !== ethers.ZeroAddress) {
  console.log(`Found relay at address: ${relayAddress}`);
}

// Get detailed relay information
if (relayAddress) {
  const relayInfo = await registry.getRelayInfo(relayAddress);
  console.log(`Relay URL: ${relayInfo.url}`);
  console.log(`Relay owner: ${relayInfo.owner}`);
  console.log(`Active: ${relayInfo.active}`);
}

// Find relays by owner
const ownerRelays = await registry.getRelaysByOwner(ownerAddress, 0, 10);
console.log(`Owner has ${ownerRelays.total} relays`);
```

### Subscription Management

```typescript
// Check subscription status
const isActive = await entryPoint.checkSubscription(userAddress, relayAddress);
console.log(`Subscription active: ${isActive}`);

// Check if public key is registered
const hasPubKey = await entryPoint.hasRegisteredPubKey(userAddress, relayAddress);
console.log(`Public key registered: ${hasPubKey}`);

// Get detailed subscription information
const details = await entryPoint.getSubscriptionDetails(userAddress, relayAddress);
if (details) {
  console.log(`Subscription expires: ${new Date(Number(details.expires) * 1000)}`);
  console.log(`Public key: ${details.pubKey}`);
}

// Calculate subscription cost before subscribing
const { subscriptionCost, fee, totalCost } = 
  await entryPoint.calculateSubscriptionCost(relayAddress, 3); // 3 months
console.log(`Subscription: ${ethers.formatEther(subscriptionCost)} ETH`);
console.log(`Fee: ${ethers.formatEther(fee)} ETH`);
console.log(`Total: ${ethers.formatEther(totalCost)} ETH`);

// Subscribe to a relay
const tx = await entryPoint.subscribeDirect(
  relayAddress,
  6, // 6 months
  publicKeyHex,
  { value: totalCost }
);
await tx.wait();
console.log(`Subscribed successfully: ${tx.hash}`);

// Subscribe using relay URL
const urlTx = await entryPoint.subscribeViaUrl(
  "https://your-relay.com",
  3, // 3 months
  publicKeyHex,
  { value: ethers.parseEther("0.05") } // Ensure sufficient value
);
await urlTx.wait();
```

### Batch Operations

```typescript
// Check multiple subscriptions at once
const relayAddresses = ["0x1234...", "0x5678...", "0x9abc..."];
const subscriptionStatuses = await entryPoint.batchCheckSubscriptions(
  userAddress,
  relayAddresses
);
console.log("Subscription statuses:", subscriptionStatuses);

// Batch subscribe to multiple relays
const pubKeys = [publicKey1, publicKey2, publicKey3]; // Public keys for each relay
const batchTx = await entryPoint.batchSubscribe(
  relayAddresses,
  6, // 6 months for all
  pubKeys,
  { value: totalBatchCost }
);
await batchTx.wait();
```

### Relay Operating Modes

The Relay contract supports two operating modes:

#### SINGLE Mode Operations

```typescript
// Check operating mode
const mode = await relay.getOperatingMode();
if (mode === RelayOperatingMode.SINGLE) {
  console.log("Relay is in SINGLE mode");
  
  // Direct subscription (bypasses EntryPoint)
  const directTx = await relay.subscribe(
    3, // 3 months
    publicKeyHex,
    { value: ethers.parseEther("0.03") }
  );
  await directTx.wait();
  
  // Check subscription directly on relay
  const isSubscribed = await relay.isSubscriptionActive(userAddress);
  console.log(`Direct subscription active: ${isSubscribed}`);
  
  // Get subscription info
  const subInfo = await relay.getUserSubscriptionInfo(userAddress);
  console.log("Subscription info:", subInfo);
}
```

#### PROTOCOL Mode Operations

```typescript
// Set relay to PROTOCOL mode (relay owner only)
const setModeTx = await relay.setOperatingMode(RelayOperatingMode.PROTOCOL);
await setModeTx.wait();

// For relays in PROTOCOL mode, configure registry and entrypoint
const setRegistryTx = await relay.setRegistry(
  registryAddress,
  true, // autoRegister
  JSON.stringify({ name: "My Relay Service", description: "..." })
);
await setRegistryTx.wait();

const setEntryPointTx = await relay.setEntryPoint(
  entryPointAddress,
  true // enableProtocolMode
);
await setEntryPointTx.wait();

// Verify Protocol configuration
const relayMode = await relay.getRelayMode();
console.log(`Mode: ${relayMode.mode === 1 ? 'PROTOCOL' : 'SINGLE'}`);
console.log(`Registry: ${relayMode.registryAddress}`);
console.log(`EntryPoint: ${relayMode.entryPointAddress}`);
console.log(`Registered: ${relayMode.isRegistered}`);
```

### Relay Management (For Relay Operators)

```typescript
// Register a new relay in the registry (relay owner)
const registerTx = await registry.registerRelay(
  relayAddress,
  "https://your-relay-url.com",
  JSON.stringify({
    name: "Your Relay Service",
    description: "Description of your relay service"
  })
);
await registerTx.wait();

// Update relay information
const updateTx = await registry.updateRelay(
  relayAddress,
  "https://new-url.com",
  JSON.stringify({
    name: "Updated Relay Service",
    description: "New description"
  })
);
await updateTx.wait();

// Update relay URL directly on the relay contract
await relay.updateRelayUrl("https://new-relay-url.com");

// Configure relay pricing
await relay.setPrice(ethers.parseEther("0.007")); // New monthly price
await relay.setDaysPerMonth(28); // Update days per month calculation

// Withdraw funds from relay
const withdrawTx = await relay.withdrawFunds();
await withdrawTx.wait();

// Decommission relay and withdraw all funds
const decommissionTx = await relay.decommissionAndWithdrawAllFunds();
await decommissionTx.wait();
```

### Public Key Management

```typescript
// Check if a specific public key is authorized
const isAuthorized = await relay.isAuthorizedByPubKey(publicKeyHex);
console.log(`Public key authorized: ${isAuthorized}`);

// Alternative method
const isSubscribed = await relay.isSubscribed(publicKeyHex);
console.log(`Public key subscribed: ${isSubscribed}`);

// Check multiple public keys across relays
const pubKeyStatuses = await entryPoint.batchCheckPubKeySubscription(
  relayAddresses,
  publicKeys
);
console.log("Public key statuses:", pubKeyStatuses);
```

### Utility Functions

```typescript
import {
  getRelayUrls,
  getRegisteredPubKeys,
  getSubscriptionHistory,
  getRelayPerformance,
  getNetworkSummary,
  subscribeToRelayEvents,
  RelayEventType
} from "shogun-core/contracts";

// Get all relay URLs from the registry
const relayUrls = await getRelayUrls(registry);
console.log("Available relays:", relayUrls);

// Find all registered public keys
const pubKeys = await getRegisteredPubKeys(registry, entryPoint);
console.log("Registered public keys:", pubKeys);

// Get subscription activity history
const history = await getSubscriptionHistory(entryPoint, 'month');
console.log("Subscription history:", history);

// Check relay performance
const performance = await getRelayPerformance(registry, relayAddress);
console.log(`Uptime: ${performance.uptime}%`);
console.log(`Response time: ${performance.responseTime}ms`);

// Get network summary statistics
const summary = await getNetworkSummary(registry, entryPoint);
console.log(`Active relays: ${summary.activeRelays}`);
console.log(`Total subscriptions: ${summary.totalSubscriptions}`);
console.log(`Average price: ${summary.averagePrice} ETH`);

// Subscribe to relay events
const unsubscribe = subscribeToRelayEvents(registry, (event) => {
  console.log(`Event: ${event.type}`);
  console.log(`Time: ${new Date(event.timestamp)}`);
  
  if (event.type === RelayEventType.NEW_SUBSCRIPTION) {
    console.log(`User: ${event.userAddress}`);
    console.log(`Relay: ${event.relayAddress}`);
  }
});

// Later, unsubscribe from events
unsubscribe();
```

### Relay Membership Verification

For applications that need to verify if users are authorized relay members:

```typescript
import { RelayMembershipVerifier } from "shogun-core/contracts";

// Create a verifier instance
const verifier = new RelayMembershipVerifier({
  contractAddress: relayAddress,
  providerUrl: "https://ethereum-rpc-url.com"
});

// Verify if an address is authorized
const isAuthorized = await verifier.isAddressAuthorized(userAddress);
console.log(`User is ${isAuthorized ? 'authorized' : 'unauthorized'}`);

// Verify if a public key is authorized
const isPubKeyAuthorized = await verifier.isPublicKeyAuthorized(publicKeyHex);
console.log(`Public key is ${isPubKeyAuthorized ? 'authorized' : 'unauthorized'}`);

// Get detailed user information
const userInfo = await verifier.getUserInfo(userAddress);
if (userInfo) {
  console.log(`Subscription expires: ${new Date(Number(userInfo.expires) * 1000)}`);
  console.log(`Public key: ${userInfo.pubKey}`);
}
```

This comprehensive API allows your application to fully integrate with the Shogun Protocol ecosystem, enabling secure, decentralized communication and verification.

## Integration with Stealth Payment System

The Shogun Protocol can be integrated with the Stealth Payment system for enhanced privacy:

```javascript
// Set up a payment forwarder hook for the relay
const paymentForwarder = await PaymentForwarder.deploy(
  relayAddress,
  hookReceiverAddress
);

// Payments can now be forwarded through the stealth payment system
// This requires the StealthKeyRegistry to be properly configured
```

For more details on the Stealth Payment integration, refer to the StealthKeyRegistry and PaymentForwarder documentation.

## Security Considerations

When using the Shogun Relay Protocol, be aware of these security considerations:

1. **Public Key Management**
   - Store public keys securely and never reuse them across different services
   - Validate key length and format before submission (32-128 bytes)

2. **Contract Interactions**
   - Always verify relay status before subscription
   - Double-check subscription costs by calling calculation functions
   - Ensure sufficient funds for subscription plus fees
   - Always calculate costs before sending transactions to avoid overpaying or transaction failures

3. **Relay Operation**
   - When running a relay in PROTOCOL mode, only accept calls from the EntryPoint
   - Regularly update relay metadata to maintain accurate information
   - Consider implementing a security audit before deployment

## Contract Addresses

| Network | Registry | EntryPoint |
|---------|----------|------------|
| Mainnet | TBD      | TBD        |
| Goerli  | TBD      | TBD        |
| Sepolia | TBD      | TBD        |
| Polygon | TBD      | TBD        |

## Development Commands

```shell
# Get help
npx hardhat help

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Start local Ethereum node
npx hardhat node

# Deploy contracts
npx hardhat ignition deploy ./ignition/modules/Network.ts
```

## Advanced Architecture

### Contract Interaction Flow

1. **Registry Setup**: Deploy the Registry contract to serve as the central directory
2. **Relay Deployment**: Deploy Relay contracts with appropriate configuration
3. **EntryPoint Configuration**: Deploy the EntryPoint and connect it to the Registry
4. **Protocol Integration**: Relays connect to the Registry and EntryPoint
5. **User Subscription**: Users subscribe through the EntryPoint for streamlined experience

This architecture ensures standardized relay services while maintaining decentralization and flexibility for relay operators.

### EntryPoint Service Fees

The EntryPoint contract charges a service fee for each subscription processed through it. This fee is:
- Configurable by the EntryPoint owner (up to 10%)
- Calculated as a percentage of the subscription cost
- Added to the total amount required for subscription
- Collected in the EntryPoint contract balance
- Withdrawable by the contract owner

Fees serve multiple purposes:
1. Sustaining protocol development and maintenance
2. Preventing spam and abuse of the protocol
3. Motivating relay owners to integrate with the protocol

The current fee can be checked by calling `serviceFeePercentage()` on the EntryPoint contract. The value is expressed in basis points (e.g., 250 = 2.5%).

## Troubleshooting

### Common Issues

1. **Insufficient Funds**
   - Always calculate the total cost (including fees) before subscribing
   - Use the calculation functions (`calculateSubscriptionCost`, etc.) to get the exact amount needed

2. **Invalid Relay Address**
   - When subscribing via URL, verify the relay address is correct and active
   - Use `registry.findRelayByUrl()` to validate URLs before subscription

3. **Relay Not in Protocol Mode**
   - If subscribing through EntryPoint, ensure the relay is in PROTOCOL mode
   - Relay owners must call `setEntryPoint` with `enableProtocolMode = true`

4. **Transaction Failures**
   - Check gas limits and prices
   - Verify relay registration status with `registry.isRegisteredRelay()`
   - Ensure public keys meet the length requirements (32-128 bytes)

### Support Resources

For additional assistance, refer to:
- GitHub Issues: [Issues](https://github.com/your-org/shogun-contracts/issues)
- Documentation: [Docs](https://your-org.github.io/shogun-contracts/)
- Community Forum: [Discourse](https://community.your-org.com)
