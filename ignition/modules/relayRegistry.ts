import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

/**
 * Shogun Relay Registry Deployment Module
 * 
 * Deploys the ShogunRelayRegistry contract for on-chain relay discovery,
 * staking, and slashing.
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

// Default configuration
const DEFAULT_MIN_STAKE = ethers.parseUnits("0.01", 6); // 0.01 USDC (6 decimals)
const DEFAULT_UNSTAKING_DELAY = 7 * 24 * 60 * 60; // 7 days in seconds
const DEFAULT_TREASURY = "0xA6591dCDff5C7616110b4f84207184aef7835048"; // Treasury address (use "0x0000000000000000000000000000000000000000" for burn)

const RelayRegistryModule = buildModule("RelayRegistry", (m) => {
  // Parameters with defaults
  const stakingToken = m.getParameter("stakingToken", USDC_ADDRESSES[84532]);
  const minStake = m.getParameter("minStake", DEFAULT_MIN_STAKE);
  const unstakingDelay = m.getParameter("unstakingDelay", DEFAULT_UNSTAKING_DELAY);
  const treasury = m.getParameter("treasury", DEFAULT_TREASURY);

  // Deploy the registry
  const relayRegistry = m.contract("ShogunRelayRegistry", [
    stakingToken,
    minStake,
    unstakingDelay,
    treasury,
  ]);

  return { relayRegistry };
});

export default RelayRegistryModule;

