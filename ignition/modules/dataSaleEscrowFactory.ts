import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * DataSaleEscrowFactory Deployment Module
 * 
 * Deploys the DataSaleEscrowFactory contract for creating escrow instances.
 * This factory uses EIP-1167 Minimal Proxy pattern to reduce gas costs.
 * 
 * NOTE: This module is typically used via deployProtocol.ts or deployAll.ts
 * which provide the required dependencies. If used standalone, you must provide
 * registry and postRegistry parameters.
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
  // WARNING: registry and postRegistry default to empty string - must be provided via parameters
  // when using this module standalone. Use deployProtocol.ts or deployAll.ts for automatic dependency resolution.
  const paymentToken = m.getParameter("paymentToken", USDC_ADDRESSES[84532]);
  const registry = m.getParameter("registry", "");
  const postRegistry = m.getParameter("postRegistry", "");

  if (!registry || !postRegistry) {
    throw new Error(
      "DataSaleEscrowFactory requires registry and postRegistry parameters. " +
      "Use deployProtocol.ts or deployAll.ts for automatic dependency resolution."
    );
  }

  // Deploy the factory (uses EIP-1167 cloning pattern internally)
  const dataSaleEscrowFactory = m.contract("DataSaleEscrowFactory", [
    paymentToken,
    registry,
    postRegistry,
  ]);

  return { dataSaleEscrowFactory };
});

export default DataSaleEscrowFactoryModule;

