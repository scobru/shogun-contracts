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

4. **stealthAddress.ts** - Deploys `StealthKeyRegistry` and `PaymentForwarder`
   - Deploys the stealth address infrastructure.

5. **tuneCampFactory.ts** - Deploys `TuneCampFactory`, `TuneCampNFT`, and `TuneCampCheckout`
   - Deploys the TuneCamp ecosystem.

### Orchestration Modules

1. **deployProtocol.ts** - Orchestrates deployment of core protocol contracts.
   - Includes: RelayRegistry, DataPostRegistry, DataSaleEscrowFactory.

2. **deployAll.ts** - Orchestrates deployment of all contracts in correct order.
   - Includes: RelayRegistry, DataPostRegistry, DataSaleEscrowFactory, Stealth contracts.

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

## Configuration

### USDC Addresses

- Base Sepolia: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- Base Mainnet: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
