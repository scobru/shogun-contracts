/**
 * Shogun Protocol Contracts Configuration
 * 
 * Centralized configuration file for all contract addresses across networks.
 * This file should be kept in sync with actual deployments.
 * 
 * Last updated: 2026-04-10
 */

export const CONTRACTS_CONFIG = {
  "baseSepolia": {
    "chainId": 84532,
    "relayRegistry": "0x8B88258923bad2d634e533Cb6405d4022CfF320f",
    "dataPostRegistry": "0x0fcAB612E9DD123ECD4aC3E50F42da77da3cf421",
    "dataSaleEscrowFactory": "0xFB1cFB380772b4DEE0b71a9eBe21E9a873ED932D",
    "paymentForwarder": "0xDF64fFB593AE0bEA06F35AD80d5097E18ee903B1",
    "stealthKeyRegistry": "0xCF6429c227F1a2912Bcb98405CAa8b436c18Cb55",
    "tuneCampCheckout": null,
    "tuneCampNFT": null,
    "tuneCampFactory": null,
    "usdc": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    "rpc": "https://sepolia.base.org",
    "explorer": "https://sepolia.basescan.org"
  },
  "base": {
    "chainId": 8453,
    "relayRegistry": null,
    "dataPostRegistry": null,
    "dataSaleEscrowFactory": null,
    "paymentForwarder": "0x0bE89b593A6eF044B25802195C634559a7FcBbdF",
    "stealthKeyRegistry": "0x9aD8B62765C528c168d704b89e50069876a29F2C",
    "tuneCampCheckout": "0xb2Ba5A8d07d52B49e98A19e763b8B329e485f564",
    "tuneCampNFT": "0x3059D4349B47FA57f1B6D0Ee92e695F4E86A826b",
    "tuneCampFactory": "0xc9b5A11cF6E8D454f6C0d81c319DE59c4D29cAbd",
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
