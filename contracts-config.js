/**
 * Shogun Protocol Contracts Configuration
 * 
 * Centralized configuration file for all contract addresses across networks.
 * This file should be kept in sync with actual deployments.
 * 
 * Last updated: 2025-12-06
 */

export const CONTRACTS_CONFIG = {
  "baseSepolia": {
    "chainId": 84532,
    "relayRegistry": "0xf5D5561C84B4Dc8676D4223AF3188d40DA42669B",
    "storageDealRegistry": "0x25035812952B8a8Ca001B85f4E59919D7569566B",
    "dataPostRegistry": "0x609e5De69B764e7A62aa28C97eC0162BA8Fb6aF2",
    "dataSaleEscrowFactory": "0xa9a39816b4c6EF46434892AA49E760dcEBbC8d01",
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

// Helper function to get config by chainId
export function getConfigByChainId(chainId) {
  const config = Object.values(CONTRACTS_CONFIG).find(c => c.chainId === chainId);
  return config || null;
}

// Helper function to get config by network name
export function getConfigByNetwork(network) {
  return CONTRACTS_CONFIG[network] || null;
}
