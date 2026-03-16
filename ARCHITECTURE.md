# 🏗️ Shogun Contracts Architecture

Shogun Contracts provides the on-chain infrastructure for the Shogun relay network, decentralized data sales, and privacy-focused payments.

## Core Modules

### 1. Relay Registry (`/contracts/registry/`)

The **ShogunRelayRegistry** is the backbone of the discovery layer.

- **Staking**: Relays must stake USDC to be active.
- **Registration**: Relays register their endpoint and GunDB public key.
- **Discovery**: Clients query active relays to find service providers.
- **Slashing**: Economic penalties for missed proofs or data loss.

### 2. Data Sale & Escrow (`/contracts/datasale/`)

Handles the trustless exchange of data for tokens.

- **DataPostRegistry**: Registry for data availability proofs.
- **DataSaleEscrowFactory**: Deploys escrow contracts that hold funds until data delivery is verified.

### 3. Storage Deal Registry (`/contracts/storage/`)

Manages on-chain storage commitments.

- **StorageDealRegistry**: Records storage deals between clients and relays, ensuring data integrity via periodic proofs.

### 4. Stealth System (`/contracts/stealth/`)

Provides on-chain hooks for privacy-preserving payments.

- **StealthKeyRegistry**: An on-chain registry for those who want to publish their stealth meta-address (optional, as Shogun primarily uses GunDB for this).
- **PaymentForwarder**: Handles the movement of funds to stealth addresses with anti-spam tolls.

## Security Model

- **Anti-Spam**: The `PaymentForwarder` requires a small "toll" (e.g., 0.001 ETH) for every stealth payment.
- **EIP-712**: Signature verification for key registration and oracle data follows the EIP-712 standard for improved security and UX.
- **Social Recovery**: Smart wallets (to be deployed) support guardian-based recovery.

## Deployment Strategy

The system is designed for **L2 Optimistic Rollups** (Base, Optimism) to ensure low fees for high-frequency operations like relay updates and small payments.

- Primary Network: **Base Sepolia** (Testing)
- Production Network: **Base** (Upcoming)
