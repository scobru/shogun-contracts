import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * DataSaleEscrowFactory Deployment Module
 * 
 * Deploys the DataSaleEscrowFactory contract for creating escrow instances.
 * This factory creates new escrow contracts for each data sale transaction.
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

const DataSaleEscrowFactoryModule = buildModule("DataSaleEscrowFactory", (m) => {
  // Parameters with defaults
  const paymentToken = m.getParameter("paymentToken", USDC_ADDRESSES[84532]);
  const registry = m.getParameter("registry", "");
  const postRegistry = m.getParameter("postRegistry", "");

  // Deploy the factory
  // Note: If registry or postRegistry are empty, they should be provided via parameters
  // or the module should depend on other modules
  const dataSaleEscrowFactory = m.contract("DataSaleEscrowFactory", [
    paymentToken,
    registry,
    postRegistry,
  ]);

  return { dataSaleEscrowFactory };
});

export default DataSaleEscrowFactoryModule;

