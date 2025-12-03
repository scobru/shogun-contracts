# Shogun Contracts

A comprehensive smart contract system for decentralized relay management and stealth address functionality on Ethereum and Optimism networks.

## Overview

Shogun Contracts provides a comprehensive smart contract system for decentralized relay management, privacy-focused payments, and cross-chain functionality.

## Architecture

The project consists of five main contract categories:

### Relay Registry (`/contracts/registry/`)

- **ShogunRelayRegistry.sol**: On-chain registry for relay discovery, staking, storage deals, and slashing

### Stealth System (`/contracts/stealth/`)

- **StealthKeyRegistry.sol**: Manages stealth key registration and metadata
- **PaymentForwarder.sol**: Handles stealth payments with anti-spam measures
- **StealthPool.sol**: Privacy-focused mixing pool for stealth transactions with Merkle tree commitments
- **IPaymentForwarderHookReceiver.sol**: Interface for payment hook receivers

### Smart Wallet (`/contracts/wallet/`)

- **SmartWallet.sol**: Multi-sig wallet with social recovery and batch transactions
- **SmartWalletFactory.sol**: Factory contract for deploying SmartWallet instances

### Bridge (`/contracts/bridge/`)

- **BridgeDex.sol**: Decentralized cross-chain bridge for token transfers

### IPFS (`/contracts/ipfs/`)

- **IPCMFactory.sol**: Factory for managing IPCM (IPFS Content Management) instances
- **ipcm.sol**: Contract for managing encrypted data on IPFS

## Smart Contracts

### ShogunRelayRegistry

On-chain registry for the Shogun relay network. Deployed on **Base Sepolia** (testnet) and **Base** (mainnet).

**Key Features:**

- **Relay Registration**: Operators register with endpoint URL and GunDB public key
- **USDC Staking**: 100 USDC minimum stake (anti-spam, skin-in-the-game)
- **Storage Deals**: On-chain registration of storage deals for dispute resolution
- **Slashing**: Economic penalties for missed proofs (1%) and data loss (10%)
- **Discovery**: Query active relays directly from the blockchain

**Core Functions:**

- `registerRelay(endpoint, gunPubKey, stakeAmount)`: Register as a relay operator
- `updateRelay(newEndpoint, newGunPubKey)`: Update relay info
- `increaseStake(amount)`: Add more stake
- `requestUnstake()`: Begin 7-day unstaking period
- `withdrawStake()`: Withdraw after unstaking delay
- `registerDeal(dealId, client, cid, sizeMB, priceUSDC, durationDays)`: Register storage deal
- `reportMissedProof(relay, dealId, evidence)`: Report proof violation
- `reportDataLoss(relay, dealId, evidence)`: Report data loss
- `getActiveRelays()`: List all active relays
- `getRelayInfo(address)`: Get relay details

**Contract Addresses:**

| Network | Address | USDC |
|---------|---------|------|
| Base Sepolia | `0x5cd0b5d95E7eA0a358F944A201905aF07834e3fF` | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |
| Base Mainnet | TBD | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |

**Deployment:**

```bash
# Deploy to Base Sepolia
npx hardhat run scripts/deploy-relay-registry.ts --network baseSepolia

# Verify on BaseScan
npx hardhat verify --network baseSepolia <ADDRESS> <USDC> <MIN_STAKE> <DELAY>
```

---

### StealthKeyRegistry

Manages stealth key registration for privacy-focused transactions.

**Key Features:**

- EIP-712 compliant signature verification
- Viewing and spending public key management
- Stealth metadata registration
- On-behalf registration support

**Core Functions:**

- `registerStealthKeys(string viewingPublicKey, string spendingPublicKey)`: Register stealth keys
- `registerStealthKeysOnBehalf()`: Register keys for another address
- `registerStealthMetadata()`: Register stealth transaction metadata

### PaymentForwarder

Handles stealth payments with built-in anti-spam protection.

**Key Features:**

- ETH and ERC-20 token support
- Toll-based anti-spam mechanism
- Stealth payment announcements
- Secure fund withdrawal

**Core Functions:**

- `send()`: Send ETH to stealth address
- `sendToken()`: Send ERC-20 tokens to stealth address
- `withdraw()`: Withdraw funds from stealth address
- `collectTolls()`: Collect accumulated tolls

### StealthPool

Privacy-focused mixing pool for stealth transactions using cryptographic commitments.

**Key Features:**

- Merkle tree-based commitment system
- Nonce-based replay attack prevention
- Auto-generated Merkle roots
- Direct user payments (no relayer required)

**Core Functions:**

- `deposit()`: Deposit funds with cryptographic commitment
- `withdraw()`: Withdraw funds using Merkle proof
- `updateMerkleRoot()`: Update the Merkle root with new deposits

### SmartWallet

Multi-signature wallet with advanced features for secure asset management.

**Key Features:**

- Multi-sig support with configurable threshold
- Social recovery via guardians
- Batch transaction execution
- Proposal-based execution system

**Core Functions:**

- `addSigner()`: Add a new signer
- `proposeExecution()`: Propose a transaction
- `approveExecution()`: Approve a proposed transaction
- `executeProposal()`: Execute an approved proposal
- `initiateRecovery()`: Start social recovery process

### BridgeDex

Decentralized cross-chain bridge for trustless token transfers.

**Key Features:**

- Cross-chain token transfers
- Provider-based liquidity system
- Protocol fee management
- Ticket-based bridging mechanism

**Core Functions:**

- `lock()`: Lock tokens for cross-chain transfer
- `unlock()`: Unlock tokens on destination chain
- `acceptRequest()`: Accept a bridge request
- `withdraw()`: Withdraw bridged tokens

### IPCMFactory

Factory contract for managing IPFS Content Management instances.

**Key Features:**

- Deploy IPCM instances
- Manage encrypted data on IPFS
- Owner-controlled access

## Technology Stack

- **Solidity**: ^0.8.28
- **Hardhat**: ^2.22.19
- **OpenZeppelin**: ^5.3.0
- **TypeScript**: >=4.5.0
- **Ethers.js**: ^6.4.0

## Quick Start

### NPM Installation

```bash
npm install shogun-contracts
```

### Development Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd shogun-contracts
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Fill in the required environment variables:

- `PRIVATE_KEY`: Your deployment private key
- `ALCHEMY_API_KEY`: Alchemy API key for network access
- `ETHERSCAN_API_KEY`: Etherscan API key for contract verification

## Configuration

The project supports multiple networks:

- **Sepolia**: Ethereum testnet
- **Optimism Sepolia**: Optimism testnet
- **Base Sepolia**: Base testnet (for ShogunRelayRegistry)
- **Base**: Base mainnet (for ShogunRelayRegistry)
- **Localhost**: Local development network

Network configuration is handled in `hardhat.config.ts`.

**Required Environment Variables:**

```bash
PRIVATE_KEY=0x...               # Deployment wallet private key
ALCHEMY_API_KEY=...             # Alchemy API key
BASESCAN_API_KEY=...            # BaseScan API key (for verification)
BASE_SEPOLIA_RPC_URL=...        # Optional: custom RPC URL
```

## Deployment

### Local Development

1. Start local blockchain:

```bash
yarn chain
```

2. Deploy contracts locally:

```bash
yarn deploy:local
```

### Testnet Deployment

Deploy to Optimism Sepolia with verification:

```bash
yarn deploy:optimismSepolia
```

## Deployment Modules

### Payment Router Module

Deploys the relay payment system with test relay registration.

### Stealth Address Module

Deploys the stealth address infrastructure with:

- StealthKeyRegistry
- PaymentForwarder (with 0.001 ETH toll)

## Testing

Run the test suite:

```bash
npx hardhat test
```

Test files include:

- Tests for all deployed contracts

## Usage Examples

### Relay Registration

```solidity
// Register a new relay with staking
shogunRelayRegistry.registerRelay(
    "https://my-relay.com/gun",
    gunPubKey,
    stakeAmount
);
```

### Stealth Key Registration

```solidity
// Register stealth keys
stealthKeyRegistry.registerStealthKeys(
    "viewing_public_key",
    "spending_public_key"
);
```

### Stealth Payment

```solidity
// Send ETH to stealth address
paymentForwarder.send{value: amount + toll}(
    stealthAddress,
    toll,
    ephemeralPublicKey,
    encryptedData
);
```

### Stealth Pool Deposit

```solidity
// Deposit to stealth pool with commitment
stealthPool.deposit{value: amount}(commitment, nonce);
```

### Smart Wallet Multi-sig

```solidity
// Propose and execute transaction
uint256 proposalId = smartWallet.proposeExecution(target, data);
smartWallet.approveExecution(proposalId);
smartWallet.executeProposal(proposalId);
```

### Cross-chain Bridge

```solidity
// Lock tokens for cross-chain transfer
bridgeDex.lock(tokenAddress, amount, destinationChainId);
```

## Security Features

- **Access Control**: Owner-only functions for critical operations
- **Emergency Pause**: Ability to pause contract operations
- **Anti-Spam**: Toll-based protection in stealth payments
- **Signature Verification**: EIP-712 compliant signatures
- **Safe Math**: OpenZeppelin's SafeERC20 for token operations

## Gas Optimization

- Solidity optimizer enabled (200 runs)
- ViaIR compilation for complex contracts
- Efficient data structures and mappings
- Minimal storage operations

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Support

For questions and support, please open an issue on the repository.
