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
    "relayRegistry": "0x8B88258923bad2d634e533Cb6405d4022CfF320f",
    "storageDealRegistry": "0x1D7E662FA5C7c4166E2740B590aC014458582302",
    "dataPostRegistry": "0x0fcAB612E9DD123ECD4aC3E50F42da77da3cf421",
    "dataSaleEscrowFactory": "0xFB1cFB380772b4DEE0b71a9eBe21E9a873ED932D",
    "gunL2Bridge": "0x0F52c90C5704E2aB9cec56eE2C06dD86602988A0",
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
