import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * TuneCamp Factory Deployment Module
 * 
 * Deploys the TuneCamp minimal proxy framework:
 * 1. TuneCampNFT (master logic)
 * 2. TuneCampCheckout (master logic)
 * 3. TuneCampFactory (depends on USDC, NFT Logic, Checkout Logic)
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

const TuneCampFactoryModule = buildModule("TuneCampFactory", (m) => {
  // Step 1: Deploy master logic contracts
  const nftLogic = m.contract("TuneCampNFT", []);
  const checkoutLogic = m.contract("TuneCampCheckout", []);
  
  // Step 2: Get USDC address - can be overridden via parameter
  const paymentToken = m.getParameter("paymentToken", USDC_ADDRESSES[84532]);
  
  // Step 3: Deploy Factory
  const tuneCampFactory = m.contract("TuneCampFactory", [
    paymentToken,
    nftLogic,
    checkoutLogic,
  ]);

  return {
    nftLogic,
    checkoutLogic,
    tuneCampFactory,
  };
});

export default TuneCampFactoryModule;
