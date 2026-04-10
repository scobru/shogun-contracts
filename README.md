# Shogun Contracts

A comprehensive smart contract system for decentralized relay management, stealth address functionality, and the TuneCamp ecosystem.

## Overview

Shogun Contracts provides the essential blockchain infrastructure for the Shogun Protocol, focusing on decentralized identity, private payments, and content monetization.

## Architecture

The project consists of three main contract categories:

### 1. Relay Registry (`/contracts/registry/`)
- **ShogunRelayRegistry.sol**: On-chain registry for relay discovery, staking, and decentralized network coordination.

### 2. Stealth System (`/contracts/stealth/`)
- **StealthKeyRegistry.sol**: Manages stealth key registration and metadata for privacy-focused payments.
- **PaymentForwarder.sol**: Handles stealth payments in ETH and ERC-20 tokens with anti-spam toll mechanisms.
- **IPaymentForwarderHookReceiver.sol**: Interface for building automated systems that respond to stealth payments.

### 3. TuneCamp Ecosystem (`/contracts/tunecamp/`)
- **TuneCampFactory.sol**: Central factory for deploying new TuneCamp release environments.
- **TuneCampNFT.sol**: ERC-721 implementation for music releases and digital collectibles.
- **TuneCampCheckout.sol**: Specialized escrow and payment contract for decentralized music sales.

---

## Smart Contracts

### ShogunRelayRegistry
The backbone of the Shogun relay network. Deployed on **Base Sepolia** and **Base Mainnet**.

- **Relay Registration**: Operators stake USDC and register endpoints.
- **Economic Security**: Minimum stake requirements to ensure network integrity.
- **Discovery**: Real-time discovery of active relays for client applications.

### Stealth System
Privacy-preserving payments using stealth address technology.

- **StealthKeyRegistry**: Allows users to publish their stealth viewing and spending keys.
- **PaymentForwarder**: Enables senders to generate one-time stealth addresses and announce payments on-chain.

### TuneCamp
A decentralized music distribution and monetization platform.

- **Factory**: Automates the deployment of collection and checkout contracts.
- **NFT**: Handles ownership and metadata for tracks and albums.
- **Checkout**: Facilitates secure purchases with support for various tokens and revenue splitting.

---

## Contract Addresses

| Contract | Base Sepolia (84532) | Base Mainnet (8453) |
|----------|----------------------|---------------------|
| **ShogunRelayRegistry** | `0x8B88258923bad2d634e533Cb6405d4022CfF320f` | TBD |
| **DataPostRegistry** | `0x0fcAB612E9DD123ECD4aC3E50F42da77da3cf421` | TBD |
| **DataSaleEscrowFactory** | `0xFB1cFB380772b4DEE0b71a9eBe21E9a873ED932D` | TBD |
| **StealthKeyRegistry** | `0xCF6429c227F1a2912Bcb98405CAa8b436c18Cb55` | `0x9aD8B62765C528c168d704b89e50069876a29F2C` |
| **PaymentForwarder** | `0xDF64fFB593AE0bEA06F35AD80d5097E18ee903B1` | `0x0bE89b593A6eF044B25802195C634559a7FcBbdF` |
| **TuneCampFactory** | TBD | `0xc9b5A11cF6E8D454f6C0d81c319DE59c4D29cAbd` |
| **TuneCampNFT** | TBD | `0x3059D4349B47FA57f1B6D0Ee92e695F4E86A826b` |
| **TuneCampCheckout** | TBD | `0xb2Ba5A8d07d52B49e98A19e763b8B329e485f564` |

---

## Deployment & Development

### Setup
1. Clone the repository and install dependencies:
```bash
yarn install
```
2. Configure `.env` (use `.env.example` as a template).

### Deployment with Hardhat Ignition
Deploy all core contracts to Base Sepolia:
```bash
npx hardhat ignition deploy ignition/modules/deployAll.ts --network baseSepolia
```

Deploy Stealth infrastructure to Base Mainnet:
```bash
npx hardhat ignition deploy ignition/modules/stealthAddress.ts --network base
```

### Post-Deployment
Always run the post-deployment script to synchronize addresses and ABIs with the frontend configurations:
```bash
yarn post-deployment
```

## Testing
```bash
npx hardhat test
```

## License
MIT
