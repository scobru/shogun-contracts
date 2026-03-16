import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';
/**
 * Shogun Stealth Key Registry Contract
 * Manages registration of stealth viewing and spending keys
 */
export declare class StealthKeyRegistry extends BaseContract {
    constructor(provider: Provider, signer: Signer | undefined, chainId: number | string);
    /**
     * Register stealth keys for the caller
     */
    registerStealthKeys(viewingPublicKey: string, spendingPublicKey: string): Promise<any>;
    /**
     * Get stealth keys for a registrant
     */
    getStealthKeys(registrant: string): Promise<any>;
    /**
     * Register stealth metadata for a transaction
     */
    registerStealthMetadata(stealthAddress: string, ephemeralPublicKey: string, encryptedRandomNumber: string, recipientPublicKey: string): Promise<any>;
}
//# sourceMappingURL=StealthKeyRegistry.d.ts.map