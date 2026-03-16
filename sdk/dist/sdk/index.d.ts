import { Provider, Signer } from 'ethers';
import { RelayRegistry } from './contracts/RelayRegistry.js';
import { DataPostRegistry } from './contracts/DataPostRegistry.js';
import { DataSaleEscrowFactory } from './contracts/DataSaleEscrowFactory.js';
import { StealthKeyRegistry } from './contracts/StealthKeyRegistry.js';
import { PaymentForwarder } from './contracts/PaymentForwarder.js';
import { TuneCampFactory } from './contracts/TuneCampFactory.js';
import { TuneCampNFT } from './contracts/TuneCampNFT.js';
import { TuneCampCheckout } from './contracts/TuneCampCheckout.js';
import type { SDKConfig } from './types.js';
/**
 * Shogun Contracts SDK
 *
 * Main SDK class for interacting with Shogun Protocol smart contracts
 */
export declare class ShogunSDK {
    private provider;
    private signer?;
    private chainId;
    /**
     * Create a new ShogunSDK instance
     *
     * @param config SDK configuration
     * @example
     * ```typescript
     * import { ShogunSDK } from 'shogun-contracts-sdk';
     * import { JsonRpcProvider } from 'ethers';
     *
     * const provider = new JsonRpcProvider('https://sepolia.base.org');
     * const sdk = new ShogunSDK({
     *   provider,
     *   chainId: 84532
     * });
     * ```
     */
    constructor(config: SDKConfig);
    /**
     * Get Relay Registry contract instance
     */
    getRelayRegistry(): RelayRegistry;
    /**
     * Get Data Post Registry contract instance
     */
    getDataPostRegistry(): DataPostRegistry;
    /**
     * Get Data Sale Escrow Factory contract instance
     */
    getDataSaleEscrowFactory(): DataSaleEscrowFactory;
    /**
     * Get Stealth Key Registry contract instance
     */
    getStealthKeyRegistry(): StealthKeyRegistry;
    /**
     * Get Payment Forwarder contract instance
     */
    getPaymentForwarder(): PaymentForwarder;
    /**
     * Get TuneCamp Factory contract instance
     */
    getTuneCampFactory(): TuneCampFactory;
    /**
     * Get TuneCamp NFT contract instance (unattached to specific proxy)
     */
    getTuneCampNFT(): TuneCampNFT;
    /**
     * Get TuneCamp Checkout contract instance (unattached to specific proxy)
     */
    getTuneCampCheckout(): TuneCampCheckout;
    /**
     * Get contract deployment info
     */
    getContractDeployment(contractName: string): import("./types.js").ContractDeployment | null;
    /**
     * Get current chain ID
     */
    getChainId(): number | string;
    /**
     * Get provider
     */
    getProvider(): Provider;
    /**
     * Get signer (if available)
     */
    getSigner(): Signer | undefined;
    /**
     * Update signer
     */
    setSigner(signer: Signer): void;
}
export * from './contracts/index.js';
export * from './types.js';
export { getContractDeployment, getAvailableChainIds, isChainSupported } from './config.js';
export { DEPLOYMENTS } from './deployments.js';
export { CONTRACTS_CONFIG, getConfigByChainId, getConfigByNetwork } from './contracts-config.js';
export { ERC20_ABI, USDC_EIP3009_ABI } from './abis.js';
//# sourceMappingURL=index.d.ts.map