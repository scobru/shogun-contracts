/**
 * Shogun Protocol Contracts Configuration
 * 
 * Centralized configuration file for all contract addresses across networks.
 * This file should be kept in sync with actual deployments.
 * 
 * Last updated: 2025-12-05
 */

export const CONTRACTS_CONFIG = {
  baseSepolia: {
    chainId: 84532,
    relayRegistry: "0xa1970aa00c97B7d87E4bE8516125A2A239F416B2",
    storageDealRegistry: "0xc9D383bD540Ade3bcfe7868b50aa2D2d21b2C44e",
    dataPostRegistry: "0xf792bF76212C7aAFDf8A9239d5478Cd03386D24C",
    dataSaleEscrowFactory: "0xEcC63BE2EA5Fb72Ca63c758bC9Fd41630230b56e",
    usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    rpc: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org"
  },
  base: {
    chainId: 8453,
    relayRegistry: null,
    storageDealRegistry: null,
    dataPostRegistry: null,
    dataSaleEscrowFactory: null,
    usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    rpc: "https://mainnet.base.org",
    explorer: "https://basescan.org"
  }
};

// Helper function to get config by chainId
export function getConfigByChainId(chainId) {
  const config = Object.values(CONTRACTS_CONFIG).find(c => c.chainId === chainId);
  return config || null;
}

// Helper function to get config by network name
export function getConfigByNetwork(network) {
  return CONTRACTS_CONFIG[network] || null;
}
