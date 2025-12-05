# Deployment Modules

This directory contains Hardhat Ignition modules for deploying Shogun contracts.

## Available Modules

### Individual Modules

1. **relayRegistry.ts** - Deploys `ShogunRelayRegistry`
   - Parameters: `stakingToken`, `minStake`, `unstakingDelay`, `treasury`

2. **dataPostRegistry.ts** - Deploys `DataPostRegistry`
   - No parameters required

3. **dataSaleEscrowFactory.ts** - Deploys `DataSaleEscrowFactory`
   - Parameters: `paymentToken`, `registry`, `postRegistry`

4. **storageDealRegistry.ts** - Deploys `StorageDealRegistry`
   - Parameters: `registry` (ShogunRelayRegistry address)

5. **deployProtocol.ts** - Orchestrates deployment of core protocol contracts only
   - Deploys only the core Shogun protocol contracts
   - Includes: RelayRegistry, DataPostRegistry, DataSaleEscrowFactory, StorageDealRegistry
   - Excludes: BridgeDex, SmartWallet, StealthAddress

6. **deployAll.ts** - Orchestrates deployment of all contracts
   - Deploys all contracts in the correct order with dependencies
   - Includes: RelayRegistry, DataPostRegistry, DataSaleEscrowFactory, StorageDealRegistry, SmartWalletFactory, StealthKeyRegistry, PayamentForwarder, BridgeDex

### Other Modules

- **smartWallet.ts** - Deploys `SmartWalletFactory`
- **stealthAddress.ts** - Deploys `StealthKeyRegistry` and `PaymentForwarder`
- **bridgeDex.ts** - Deploys `BridgeDex`

## Usage

### Using Hardhat Ignition

Deploy all contracts:
```bash
npx hardhat ignition deploy ignition/modules/deployAll.ts --network baseSepolia
```

Deploy only core protocol contracts:
```bash
npx hardhat ignition deploy ignition/modules/deployProtocol.ts --network baseSepolia
```

Deploy individual modules:
```bash
npx hardhat ignition deploy ignition/modules/relayRegistry.ts --network baseSepolia
npx hardhat ignition deploy ignition/modules/dataPostRegistry.ts --network baseSepolia
```

### Using Deployment Scripts

Deploy all contracts using the script:
```bash
npx hardhat run scripts/deploy-all.ts --network baseSepolia
```

Deploy only core protocol contracts:
```bash
npx hardhat run scripts/deploy-protocol.ts --network baseSepolia
```

Deploy individual contracts:
```bash
npx hardhat run scripts/deploy-relay-registry.ts --network baseSepolia
```

## Deployment Order

When deploying manually, follow this order:

1. **ShogunRelayRegistry** (no dependencies)
2. **DataPostRegistry** (no dependencies)
3. **DataSaleEscrowFactory** (depends on RelayRegistry and DataPostRegistry)
4. **StorageDealRegistry** (depends on RelayRegistry)
5. **SmartWalletFactory** (no dependencies)
6. **StealthKeyRegistry** (no dependencies)
7. **PayamentForwarder** (no dependencies, but should be configured after deployment)
8. **BridgeDex** (no dependencies)

## Configuration

### USDC Addresses

- Base Sepolia: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- Base Mainnet: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

### Default Parameters

- **Min Stake**: 100 USDC (6 decimals = `100000000`)
- **Unstaking Delay**: 7 days (604800 seconds)
- **Treasury**: `0xA6591dCDff5C7616110b4f84207184aef7835048` (or zero address to burn)

## Verification

After deployment, verify contracts on BaseScan:

```bash
# ShogunRelayRegistry
npx hardhat verify --network baseSepolia <ADDRESS> <USDC_ADDRESS> <MIN_STAKE> <UNSTAKING_DELAY> <TREASURY>

# DataPostRegistry
npx hardhat verify --network baseSepolia <ADDRESS>

# DataSaleEscrowFactory
npx hardhat verify --network baseSepolia <ADDRESS> <USDC_ADDRESS> <RELAY_REGISTRY> <POST_REGISTRY>

# StorageDealRegistry
npx hardhat verify --network baseSepolia <ADDRESS> <RELAY_REGISTRY>

# SmartWalletFactory
npx hardhat verify --network baseSepolia <ADDRESS>

# StealthKeyRegistry
npx hardhat verify --network baseSepolia <ADDRESS>

# PayamentForwarder
npx hardhat verify --network baseSepolia <ADDRESS> <TOLL> <TOLL_COLLECTOR> <TOLL_RECEIVER>

# BridgeDex
npx hardhat verify --network baseSepolia <ADDRESS>
```

The `deploy-all.ts` script automatically prints verification commands after deployment.

