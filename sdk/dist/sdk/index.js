import { RelayRegistry } from './contracts/RelayRegistry.js';
import { DataPostRegistry } from './contracts/DataPostRegistry.js';
import { DataSaleEscrowFactory } from './contracts/DataSaleEscrowFactory.js';
import { StealthKeyRegistry } from './contracts/StealthKeyRegistry.js';
import { PaymentForwarder } from './contracts/PaymentForwarder.js';
import { TuneCampFactory } from './contracts/TuneCampFactory.js';
import { TuneCampNFT } from './contracts/TuneCampNFT.js';
import { TuneCampCheckout } from './contracts/TuneCampCheckout.js';
import { getContractDeployment, isChainSupported } from './config.js';
/**
 * Shogun Contracts SDK
 *
 * Main SDK class for interacting with Shogun Protocol smart contracts
 */
export class ShogunSDK {
    provider;
    signer;
    chainId;
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
    constructor(config) {
        this.provider = config.provider;
        this.signer = config.signer;
        this.chainId = config.chainId;
        if (!isChainSupported(this.chainId)) {
            throw new Error(`Chain ${this.chainId} is not supported`);
        }
    }
    /**
     * Get Relay Registry contract instance
     */
    getRelayRegistry() {
        return new RelayRegistry(this.provider, this.signer, this.chainId);
    }
    /**
     * Get Data Post Registry contract instance
     */
    getDataPostRegistry() {
        return new DataPostRegistry(this.provider, this.signer, this.chainId);
    }
    /**
     * Get Data Sale Escrow Factory contract instance
     */
    getDataSaleEscrowFactory() {
        return new DataSaleEscrowFactory(this.provider, this.signer, this.chainId);
    }
    /**
     * Get Stealth Key Registry contract instance
     */
    getStealthKeyRegistry() {
        return new StealthKeyRegistry(this.provider, this.signer, this.chainId);
    }
    /**
     * Get Payment Forwarder contract instance
     */
    getPaymentForwarder() {
        return new PaymentForwarder(this.provider, this.signer, this.chainId);
    }
    /**
     * Get TuneCamp Factory contract instance
     */
    getTuneCampFactory() {
        return new TuneCampFactory(this.provider, this.signer, this.chainId);
    }
    /**
     * Get TuneCamp NFT contract instance (unattached to specific proxy)
     */
    getTuneCampNFT() {
        return new TuneCampNFT(this.provider, this.signer, this.chainId);
    }
    /**
     * Get TuneCamp Checkout contract instance (unattached to specific proxy)
     */
    getTuneCampCheckout() {
        return new TuneCampCheckout(this.provider, this.signer, this.chainId);
    }
    /**
     * Get contract deployment info
     */
    getContractDeployment(contractName) {
        return getContractDeployment(this.chainId, contractName);
    }
    /**
     * Get current chain ID
     */
    getChainId() {
        return this.chainId;
    }
    /**
     * Get provider
     */
    getProvider() {
        return this.provider;
    }
    /**
     * Get signer (if available)
     */
    getSigner() {
        return this.signer;
    }
    /**
     * Update signer
     */
    setSigner(signer) {
        this.signer = signer;
    }
}
// Export all contract classes
export * from './contracts/index.js';
// Export types
export * from './types.js';
// Export config utilities
export { getContractDeployment, getAvailableChainIds, isChainSupported } from './config.js';
// Export deployments
export { DEPLOYMENTS } from './deployments.js';
// Export contracts configuration
export { CONTRACTS_CONFIG, getConfigByChainId, getConfigByNetwork } from './contracts-config.js';
// Export common ABIs
export { ERC20_ABI, USDC_EIP3009_ABI } from './abis.js';
