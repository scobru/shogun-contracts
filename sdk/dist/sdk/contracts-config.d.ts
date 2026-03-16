/**
 * Shogun Protocol Contracts Configuration
 *
 * Centralized configuration file for all contract addresses across networks.
 * This file should be kept in sync with actual deployments.
 *
 * Last updated: 2025-12-10
 */
export declare const CONTRACTS_CONFIG: {
    baseSepolia: {
        chainId: number;
        relayRegistry: string;
        dataPostRegistry: string;
        dataSaleEscrowFactory: string;
        tuneCampCheckout: null;
        tuneCampNFT: null;
        tuneCampFactory: null;
        usdc: string;
        rpc: string;
        explorer: string;
    };
    base: {
        chainId: number;
        relayRegistry: null;
        dataPostRegistry: null;
        dataSaleEscrowFactory: null;
        tuneCampCheckout: string;
        tuneCampNFT: string;
        tuneCampFactory: string;
        usdc: string;
        rpc: string;
        explorer: string;
    };
};
/**
 * Helper function to get config by chainId
 */
export declare function getConfigByChainId(chainId: number | string): typeof CONTRACTS_CONFIG[keyof typeof CONTRACTS_CONFIG] | null;
/**
 * Helper function to get config by network name
 */
export declare function getConfigByNetwork(network: keyof typeof CONTRACTS_CONFIG): typeof CONTRACTS_CONFIG[keyof typeof CONTRACTS_CONFIG] | null;
//# sourceMappingURL=contracts-config.d.ts.map