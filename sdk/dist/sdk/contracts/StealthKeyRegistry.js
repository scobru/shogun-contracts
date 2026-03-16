import { BaseContract } from './BaseContract.js';
/**
 * Shogun Stealth Key Registry Contract
 * Manages registration of stealth viewing and spending keys
 */
export class StealthKeyRegistry extends BaseContract {
    constructor(provider, signer, chainId) {
        super(provider, signer, chainId, 'StealthKeyRegistry');
    }
    /**
     * Register stealth keys for the caller
     */
    async registerStealthKeys(viewingPublicKey, spendingPublicKey) {
        return await this.contract.registerStealthKeys(viewingPublicKey, spendingPublicKey);
    }
    /**
     * Get stealth keys for a registrant
     */
    async getStealthKeys(registrant) {
        return await this.contract.getStealthKeys(registrant);
    }
    /**
     * Register stealth metadata for a transaction
     */
    async registerStealthMetadata(stealthAddress, ephemeralPublicKey, encryptedRandomNumber, recipientPublicKey) {
        return await this.contract.registerStealthMetadata(stealthAddress, ephemeralPublicKey, encryptedRandomNumber, recipientPublicKey);
    }
}
