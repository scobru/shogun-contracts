import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import RelayRegistryModule from "./relayRegistry";
import DataPostRegistryModule from "./dataPostRegistry";
import GunL2BridgeModule from "./gunL2Bridge";

/**
 * Protocol Deployment Module
 * 
 * Deploys only the core Shogun protocol contracts (excluding bridge, wallet, and stealth).
 * 
 * Deployment Order:
 * 1. ShogunRelayRegistry (required by others)
 * 2. DataPostRegistry (required by DataSaleEscrowFactory)
 * 3. DataSaleEscrowFactory (depends on RelayRegistry and DataPostRegistry)
 * 4. StorageDealRegistry (depends on RelayRegistry)
 * 5. GunL2Bridge (depends on RelayRegistry)
 * 
 * USDC Addresses:
 * - Base Sepolia: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
 * - Base Mainnet: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
 */

// USDC Contract Addresses
const USDC_ADDRESSES: { [chainId: number]: string } = {
  84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia
  8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",  // Base Mainnet
};

const DeployProtocolModule = buildModule("DeployProtocol", (m) => {
  // Step 1: Deploy RelayRegistry
  const relayRegistry = m.useModule(RelayRegistryModule);
  
  // Step 2: Deploy DataPostRegistry (no dependencies)
  const dataPostRegistry = m.useModule(DataPostRegistryModule);
  
  // Step 3: Deploy DataSaleEscrowFactory (depends on RelayRegistry and DataPostRegistry)
  // Get USDC address - can be overridden via parameter
  const paymentToken = m.getParameter("paymentToken", USDC_ADDRESSES[84532]);
  
  const dataSaleEscrowFactory = m.contract("DataSaleEscrowFactory", [
    paymentToken,
    relayRegistry.relayRegistry,
    dataPostRegistry.dataPostRegistry,
  ]);
  
  // Step 4: Deploy StorageDealRegistry (depends on RelayRegistry)
  const storageDealRegistry = m.contract("StorageDealRegistry", [
    relayRegistry.relayRegistry,
  ]);

  // Step 5: Deploy GunL2Bridge (depends on RelayRegistry)
  // Use the relay registry from step 1
  const gunL2Bridge = m.contract("GunL2Bridge", [
    relayRegistry.relayRegistry, // Use the deployed RelayRegistry
    "0x0000000000000000000000000000000000000000", // Zero address = any relay can submit batches
  ]);

  return {
    relayRegistry: relayRegistry.relayRegistry,
    dataPostRegistry: dataPostRegistry.dataPostRegistry,
    dataSaleEscrowFactory,
    storageDealRegistry,
    gunL2Bridge,
  };
});

export default DeployProtocolModule;

