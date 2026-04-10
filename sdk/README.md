# Shogun Contracts SDK

TypeScript SDK for interacting with Shogun Protocol smart contracts.

## Build

The SDK is automatically compiled before publication. To build manually:

```bash
npm run build:sdk
```

Compiled files are generated in `sdk/dist/`.

## Installation

```bash
npm install shogun-contracts
# or
yarn add shogun-contracts
```

## Usage

### Basic Configuration

```typescript
import { ShogunSDK } from "shogun-contracts/sdk";
import { JsonRpcProvider, Wallet } from "ethers";

// Provider without signer (read-only)
const provider = new JsonRpcProvider("https://sepolia.base.org");
const sdk = new ShogunSDK({
  provider,
  chainId: 84532, // Base Sepolia
});

// With signer (for transactions)
const wallet = new Wallet("PRIVATE_KEY", provider);
const sdkWithSigner = new ShogunSDK({
  provider,
  signer: wallet,
  chainId: 84532,
});
```

### Relay Registry

```typescript
const relayRegistry = sdk.getRelayRegistry();

// Get active relays
const activeRelays = await relayRegistry.getActiveRelays();

// Register a relay
await relayRegistry.registerRelay(
  "https://relay.example.com",
  "0x...", // Gun public key
  BigInt("100000000") // Stake amount (e.g., 100 USDC)
);
```

### Stealth Payments

```typescript
const paymentForwarder = sdk.getPaymentForwarder();
const stealthKeyRegistry = sdk.getStealthKeyRegistry();

// Register stealth keys
await stealthKeyRegistry.registerStealthKeys(
  "viewing_public_key",
  "spending_public_key"
);

// Send stealth payment
await paymentForwarder.send(
  "0x...", // stealth address
  BigInt("1000000000000000"), // toll
  "0x...", // ephemeral public key
  "0x..."  // encrypted data
);
```

### TuneCamp

```typescript
const tuneCampFactory = sdk.getTuneCampFactory();

// Deploy a new TuneCamp environment
const tx = await tuneCampFactory.createTuneCamp(
  "My Collection",
  "SYMBOL",
  "https://metadata.url/"
);
```

---

## API Reference

### ShogunSDK Methods

- `getRelayRegistry()`: Returns `RelayRegistry` instance
- `getDataPostRegistry()`: Returns `DataPostRegistry` instance
- `getDataSaleEscrowFactory()`: Returns `DataSaleEscrowFactory` instance
- `getStealthKeyRegistry()`: Returns `StealthKeyRegistry` instance
- `getPaymentForwarder()`: Returns `PaymentForwarder` instance
- `getTuneCampFactory()`: Returns `TuneCampFactory` instance
- `getTuneCampNFT()`: Returns `TuneCampNFT` instance
- `getTuneCampCheckout()`: Returns `TuneCampCheckout` instance

---

## Supported Chains

- **84532** (Base Sepolia)
- **8453** (Base Mainnet)

## License
MIT
