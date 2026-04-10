/**
 * Shogun Protocol Contracts Configuration
 *
 * Centralized configuration file for all contract addresses across networks.
 * This file is automatically updated by the post-deployment script.
 *
 * Last updated: 2026-04-10
 */
export declare const CONTRACTS_CONFIG: {
    readonly baseSepolia: {
        readonly chainId: 84532;
        readonly relayRegistry: "0x8B88258923bad2d634e533Cb6405d4022CfF320f";
        readonly dataPostRegistry: "0x0fcAB612E9DD123ECD4aC3E50F42da77da3cf421";
        readonly dataSaleEscrowFactory: "0xFB1cFB380772b4DEE0b71a9eBe21E9a873ED932D";
        readonly paymentForwarder: "0xDF64fFB593AE0bEA06F35AD80d5097E18ee903B1";
        readonly stealthKeyRegistry: "0xCF6429c227F1a2912Bcb98405CAa8b436c18Cb55";
        readonly tuneCampCheckout: null;
        readonly tuneCampNFT: null;
        readonly tuneCampFactory: null;
        readonly usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
        readonly rpc: "https://sepolia.base.org";
        readonly explorer: "https://sepolia.basescan.org";
    };
    readonly base: {
        readonly chainId: 8453;
        readonly relayRegistry: null;
        readonly dataPostRegistry: null;
        readonly dataSaleEscrowFactory: null;
        readonly paymentForwarder: "0x0bE89b593A6eF044B25802195C634559a7FcBbdF";
        readonly stealthKeyRegistry: "0x9aD8B62765C528c168d704b89e50069876a29F2C";
        readonly tuneCampCheckout: "0xb2Ba5A8d07d52B49e98A19e763b8B329e485f564";
        readonly tuneCampNFT: "0x3059D4349B47FA57f1B6D0Ee92e695F4E86A826b";
        readonly tuneCampFactory: "0xc9b5A11cF6E8D454f6C0d81c319DE59c4D29cAbd";
        readonly usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
        readonly rpc: "https://mainnet.base.org";
        readonly explorer: "https://basescan.org";
    };
};
export declare function getConfigByChainId(chainId: number | string): {
    readonly chainId: 84532;
    readonly relayRegistry: "0x8B88258923bad2d634e533Cb6405d4022CfF320f";
    readonly dataPostRegistry: "0x0fcAB612E9DD123ECD4aC3E50F42da77da3cf421";
    readonly dataSaleEscrowFactory: "0xFB1cFB380772b4DEE0b71a9eBe21E9a873ED932D";
    readonly paymentForwarder: "0xDF64fFB593AE0bEA06F35AD80d5097E18ee903B1";
    readonly stealthKeyRegistry: "0xCF6429c227F1a2912Bcb98405CAa8b436c18Cb55";
    readonly tuneCampCheckout: null;
    readonly tuneCampNFT: null;
    readonly tuneCampFactory: null;
    readonly usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
    readonly rpc: "https://sepolia.base.org";
    readonly explorer: "https://sepolia.basescan.org";
} | {
    readonly chainId: 8453;
    readonly relayRegistry: null;
    readonly dataPostRegistry: null;
    readonly dataSaleEscrowFactory: null;
    readonly paymentForwarder: "0x0bE89b593A6eF044B25802195C634559a7FcBbdF";
    readonly stealthKeyRegistry: "0x9aD8B62765C528c168d704b89e50069876a29F2C";
    readonly tuneCampCheckout: "0xb2Ba5A8d07d52B49e98A19e763b8B329e485f564";
    readonly tuneCampNFT: "0x3059D4349B47FA57f1B6D0Ee92e695F4E86A826b";
    readonly tuneCampFactory: "0xc9b5A11cF6E8D454f6C0d81c319DE59c4D29cAbd";
    readonly usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
    readonly rpc: "https://mainnet.base.org";
    readonly explorer: "https://basescan.org";
} | null;
export declare function getConfigByNetwork(network: keyof typeof CONTRACTS_CONFIG): {
    readonly chainId: 84532;
    readonly relayRegistry: "0x8B88258923bad2d634e533Cb6405d4022CfF320f";
    readonly dataPostRegistry: "0x0fcAB612E9DD123ECD4aC3E50F42da77da3cf421";
    readonly dataSaleEscrowFactory: "0xFB1cFB380772b4DEE0b71a9eBe21E9a873ED932D";
    readonly paymentForwarder: "0xDF64fFB593AE0bEA06F35AD80d5097E18ee903B1";
    readonly stealthKeyRegistry: "0xCF6429c227F1a2912Bcb98405CAa8b436c18Cb55";
    readonly tuneCampCheckout: null;
    readonly tuneCampNFT: null;
    readonly tuneCampFactory: null;
    readonly usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
    readonly rpc: "https://sepolia.base.org";
    readonly explorer: "https://sepolia.basescan.org";
} | {
    readonly chainId: 8453;
    readonly relayRegistry: null;
    readonly dataPostRegistry: null;
    readonly dataSaleEscrowFactory: null;
    readonly paymentForwarder: "0x0bE89b593A6eF044B25802195C634559a7FcBbdF";
    readonly stealthKeyRegistry: "0x9aD8B62765C528c168d704b89e50069876a29F2C";
    readonly tuneCampCheckout: "0xb2Ba5A8d07d52B49e98A19e763b8B329e485f564";
    readonly tuneCampNFT: "0x3059D4349B47FA57f1B6D0Ee92e695F4E86A826b";
    readonly tuneCampFactory: "0xc9b5A11cF6E8D454f6C0d81c319DE59c4D29cAbd";
    readonly usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
    readonly rpc: "https://mainnet.base.org";
    readonly explorer: "https://basescan.org";
};
//# sourceMappingURL=contracts-config.d.ts.map