/**
 * Shogun Protocol Contracts Configuration
 * 
 * Centralized configuration file for all contract addresses across networks.
 * This file should be kept in sync with actual deployments.
 * 
 * Last updated: 2025-12-10
 */

export const CONTRACTS_CONFIG = {
  "baseSepolia": {
    "chainId": 84532,
    "relayRegistry": "0xFE0e1936BAE4bE1C77876fe1d28fF05A79319961",
    "storageDealRegistry": "0xEE1916C6A173874A7BAA6f3ABBF6dDc855F5b855",
    "dataPostRegistry": "0x60B3C53a384A86432FeEeB15bA93aE36DF54fEC7",
    "dataSaleEscrowFactory": "0x602dF7C4dc72Dd90A2102db63E0e7b5E22eCD0D2",
    "gunL2Bridge": "0x6cB101859275427F78D09d47201Fea5FB71CE173",
    "usdc": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    "rpc": "https://sepolia.base.org",
    "explorer": "https://sepolia.basescan.org"
  },
  "base": {
    "chainId": 8453,
    "relayRegistry": null,
    "storageDealRegistry": null,
    "dataPostRegistry": null,
    "dataSaleEscrowFactory": null,
    "gunL2Bridge": null,
    "usdc": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "rpc": "https://mainnet.base.org",
    "explorer": "https://basescan.org"
  }
};

/**
 * Helper function to get config by chainId
 */
export function getConfigByChainId(chainId: number | string): typeof CONTRACTS_CONFIG[keyof typeof CONTRACTS_CONFIG] | null {
  const config = Object.values(CONTRACTS_CONFIG).find(c => c.chainId === chainId);
  return config || null;
}

/**
 * Helper function to get config by network name
 */
export function getConfigByNetwork(network: keyof typeof CONTRACTS_CONFIG): typeof CONTRACTS_CONFIG[keyof typeof CONTRACTS_CONFIG] | null {
  return CONTRACTS_CONFIG[network] || null;
}
