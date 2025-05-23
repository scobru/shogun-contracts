# Shogun Relay System Documentation for LLMs

This document provides essential information about the Shogun Relay Protocol, deployment using Ignition, and subscription process.

## Relay System Architecture

The Shogun Relay Protocol consists of three primary smart contracts:

### 1. Registry Contract (`Registry.sol`)
- Central directory of all available relay services
- Enables relay discovery by URL or owner
- Handles registration and relay status management
- Key functions: `registerRelay()`, `findRelayByUrl()`, `isRegisteredRelay()`

### 2. Relay Contract (`Relay.sol`)
- Manages individual relay subscriptions and user public keys
- Handles subscription payments and authorization
- Supports SINGLE mode (standalone) and PROTOCOL mode (integrated)
- Key functions: `subscribe()`, `isSubscriptionActive()`, `isAuthorizedByPubKey()`

### 3. EntryPoint Contract (`EntryPoint.sol`)
- Unified interface for interacting with multiple relays
- Enables URL-based or direct relay subscriptions
- Supports batch operations across multiple relays
- Key functions: `subscribeViaUrl()`, `subscribeDirect()`, `batchSubscribe()`

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

## Ignition Deployment

The Shogun protocol uses Hardhat Ignition for deployments:

- Deployment modules in `ignition/modules/Network.ts`
- Deployment artifacts in `ignition/deployments/chain-{chainId}/`
- Command: `npx hardhat ignition deploy ./ignition/modules/Network.ts`
- Contract addresses stored in `deployed_addresses.json`

## Subscription Process

The subscription process involves:

### Via `subscribe.ts` Script
1. Generate cryptographic keys using GunDB/SEA
2. Convert GunDB public keys to contract-compatible format
3. Calculate subscription cost based on duration
4. Call `subscribe()` function with payment
5. Pre-authorize key with relay server
6. Store subscription data in GunDB

```javascript
// Key steps in subscribe.ts:
// 1. Generate keypair
let pair = await SEA.pair();
let pubKey = pair.pub;

// 2. Convert key format
const hexPubKey = gunPubKeyToHex(pubKey);
const pubkeyBytes = hexToBytes(hexPubKey);

// 3. Subscribe to relay
const tx = await individualRelayContract.subscribe(months, pubkeyBytes, {
  value: total,
});

// 4. Pre-authorize with relay server
authResult = await preAuthorizeKey(pubKey);

// 5. Store in GunDB
gun.user().get("subscription").put(subscriptionData);
```

## Common Issues and Solutions

### Deployment Issues
- Check network configuration and dependencies
- Verify deployer account has sufficient ETH
- Important: Fix references to contract names in deployment artifacts
  - The `subscribe.ts` script uses `Network#SimpleRelay` but it should use `Network#Relay`
  - This type of string key error commonly appears in TypeScript linting

### Subscription Failures
- Ensure relay contract address is correct
- Verify sufficient ETH for payment
- Check public key format conversion
- Confirm relay server is running

### Integration Problems
- Check contract ABI consistency
- Verify GunDB peer accessibility
- Ensure proper JWT token inclusion

## SDK Integration

```typescript
// Initialize contract instances
const registry = new Registry({
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

## Key Conversions

Converting between different key formats is crucial for the subscription process:

### GunDB Public Key to Contract Format
GunDB uses a URL-safe base64 format for public keys, but Ethereum contracts require hex or bytes format:

```javascript
function gunPubKeyToHex(pubKey: string): string {
  // Remove the ~ prefix if present
  if (pubKey.startsWith("~")) {
    pubKey = pubKey.substring(1);
  }

  // Remove anything after a . if present
  const dotIndex = pubKey.indexOf(".");
  if (dotIndex > 0) {
    pubKey = pubKey.substring(0, dotIndex);
  }

  // Convert from GunDB's URL-safe base64 to standard base64
  const base64Key = pubKey.replace(/-/g, "+").replace(/_/g, "/");

  // Add padding if needed
  const padded = base64Key.length % 4 === 0
    ? base64Key
    : base64Key.padEnd(base64Key.length + (4 - (base64Key.length % 4)), "=");

  // Convert to binary and then to hex
  const binaryData = Buffer.from(padded, "base64");
  const hexData = binaryData.toString("hex");

  return hexData;
}
```

### Hex to Bytes Conversion
After converting to hex, the data needs to be converted to bytes for the contract:

```javascript
function hexToBytes(hexString: string): Uint8Array {
  // Remove 0x prefix if present
  const hex = hexString.startsWith("0x") ? hexString.slice(2) : hexString;
  
  // Ensure even length
  const evenHex = hex.length % 2 === 0 ? hex : "0" + hex;

  const bytes = new Uint8Array(evenHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const byte = parseInt(evenHex.substr(i * 2, 2), 16);
    bytes[i] = byte;
  }

  return bytes;
}
```
