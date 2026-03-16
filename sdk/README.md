# Shogun Contracts SDK

SDK TypeScript per interagire con i contratti smart contract del protocollo Shogun.

## Build

L'SDK viene compilato automaticamente prima della pubblicazione del package. Per compilarlo manualmente:

```bash
npm run build:sdk
```

I file compilati vengono generati in `sdk/dist/`.

## Installazione

```bash
npm install shogun-contracts
# oppure
yarn add shogun-contracts
```

## Utilizzo

### Configurazione base

```typescript
import { ShogunSDK } from "shogun-contracts/sdk";
import { JsonRpcProvider, Wallet } from "ethers";

// Provider senza signer (solo lettura)
const provider = new JsonRpcProvider("https://sepolia.base.org");
const sdk = new ShogunSDK({
  provider,
  chainId: 84532, // Base Sepolia
});

// Con signer (per transazioni)
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

// Registrare un relay
await relayRegistry.registerRelay(
  "https://relay.example.com",
  "0x...", // pubkey
  "0x...", // epub
  BigInt("1000000000000000000"), // stake amount
  BigInt("1000"), // griefing ratio
);

// Ottenere informazioni su un relay
const relayInfo = await relayRegistry.getRelayInfo("0x...");

// Ottenere tutti i relay attivi
const activeRelays = await relayRegistry.getActiveRelays();
```

### Storage Deal Registry

```typescript
const storageDeal = sdk.getStorageDealRegistry();

// Registrare un nuovo deal
await storageDeal.registerDeal(
  "0x...", // dealId
  "0x...", // client address
  "Qm...", // CID
  BigInt(100), // sizeMB
  BigInt("1000000"), // priceUSDC (6 decimals)
  BigInt(30), // durationDays
  BigInt("500000"), // clientStake
);

// Ottenere informazioni su un deal
const deal = await storageDeal.getDeal("0x...");

// Completare un deal
await storageDeal.completeDeal("0x...");
```

### Data Post Registry

```typescript
const dataPost = sdk.getDataPostRegistry();

// Pubblicare un nuovo post
const tx = await dataPost.publishPost(
  "0x...", // proofHash
  "Qm...", // encryptedDataHash
  "Description of the data",
  "category",
  BigInt("1000000"), // priceUSDC
);

// Ottenere tutti i post attivi
const activePosts = await dataPost.getActivePosts();

// Ottenere post per categoria
const posts = await dataPost.getPostsByCategory("category");
```

### Data Sale Escrow Factory

```typescript
const escrowFactory = sdk.getDataSaleEscrowFactory();

// Creare un nuovo escrow
const escrowAddress = await escrowFactory.createEscrow(
  "0x...", // postId
  "0x...", // seller address
  BigInt(3600), // countdownDuration (seconds)
);

// Ottenere escrow per buyer
const buyerEscrows = await escrowFactory.getEscrowsByBuyer("0x...");
```

### Stealth Pool

```typescript
const stealthPool = sdk.getStealthPool();

// Registrare un deposito
await stealthPool.registerDeposit(
  "0x...", // commitment
  BigInt("1000000000000000000"), // amount
);

// Prelevare
const merkleProof = await stealthPool.generateMerkleProof("0x...");
await stealthPool.withdraw(
  "0x...", // commitment
  "0x...", // nonce
  "0x...", // recipient
  BigInt("1000000000000000000"), // amount
  merkleProof[0], // merkle proof
);
```

## API Reference

### ShogunSDK

Classe principale per interagire con i contratti.

#### Metodi

- `getRelayRegistry()`: Restituisce un'istanza di `RelayRegistry`
- `getStorageDealRegistry()`: Restituisce un'istanza di `StorageDealRegistry`
- `getDataPostRegistry()`: Restituisce un'istanza di `DataPostRegistry`
- `getDataSaleEscrowFactory()`: Restituisce un'istanza di `DataSaleEscrowFactory`
- `getStealthPool()`: Restituisce un'istanza di `StealthPool`
- `getStealthKeyRegistry()`: Restituisce un'istanza di `StealthKeyRegistry`
- `getPaymentForwarder()`: Restituisce un'istanza di `PaymentForwarder`
- `getOracleFeedRegistry()`: Restituisce un'istanza di `OracleFeedRegistry`
- `getShogunPriceOracle()`: Restituisce un'istanza di `ShogunPriceOracle`
- `getShogunPaidOracle()`: Restituisce un'istanza di `ShogunPaidOracle`
- `getContractDeployment(contractName)`: Ottiene informazioni sul deployment di un contratto
- `getChainId()`: Restituisce il chain ID corrente
- `getProvider()`: Restituisce il provider
- `getSigner()`: Restituisce il signer (se disponibile)
- `setSigner(signer)`: Imposta un nuovo signer

### Oracle Feed Registry

```typescript
import {
  OracleFeedRegistry,
  OraclePacketSigner,
  OracleDataType,
} from "shogun-contracts/sdk";

const oracleRegistry = sdk.getOracleFeedRegistry();

// Registrare un feed (da un relay attivo)
await oracleRegistry.registerFeed(
  "ETH/USD",
  OracleDataType.PRICE,
  "(uint256)",
  BigInt("1000000"), // 1 USDC
  60, // update ogni 60 secondi
);

// Ottenere i feed di un relay
const feeds = await oracleRegistry.getRelayFeeds("0x...");

// Firmare un pacchetto oracle (lato relay)
const signer = new OraclePacketSigner(
  "PRIVATE_KEY",
  84532, // chainId
  "0x...", // oracle contract address
);

const packet = await signer.signPacket("ETH/USD", 3500_00000000n, "(uint256)");
```

### Utility Functions

```typescript
import {
  getContractDeployment,
  getAvailableChainIds,
  isChainSupported,
} from "shogun-contracts/sdk";

// Verificare se una chain è supportata
if (isChainSupported(84532)) {
  console.log("Chain supported!");
}

// Ottenere deployment info
const deployment = getContractDeployment(84532, "ShogunRelayRegistry");

// Ottenere tutte le chain disponibili
const chains = getAvailableChainIds();
```

## Chain Supportate

- **84532** (Base Sepolia)
- **11155111** (Sepolia)

## Note

- Tutti gli import utilizzano estensioni `.js` anche per file TypeScript (richiesto per ESM)
- Le quantità devono essere passate come `bigint`
- Gli indirizzi devono essere stringhe valide (0x...)

## Esempi Completi

Vedi la cartella `examples/` per esempi più dettagliati.
