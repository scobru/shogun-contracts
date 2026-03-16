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
        "dataPostRegistry": "0x0fcAB612E9DD123ECD4aC3E50F42da77da3cf421",
        "dataSaleEscrowFactory": "0xFB1cFB380772b4DEE0b71a9eBe21E9a873ED932D",
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
        "tuneCampCheckout": "0x2DBcce651aeeaF083d208cc8362B4fd7e72E380F",
        "tuneCampNFT": "0x532B0fBEe4d2b259a89982753fFf0E79E468fBce",
        "tuneCampFactory": "0xC52DEa08b354b62033A683843af6FF550B3F8dED",
        "usdc": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        "rpc": "https://mainnet.base.org",
        "explorer": "https://basescan.org"
    }
};
/**
 * Helper function to get config by chainId
 */
export function getConfigByChainId(chainId) {
    const config = Object.values(CONTRACTS_CONFIG).find(c => c.chainId === chainId);
    return config || null;
}
/**
 * Helper function to get config by network name
 */
export function getConfigByNetwork(network) {
    return CONTRACTS_CONFIG[network] || null;
}
