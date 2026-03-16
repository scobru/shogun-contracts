import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';
/**
 * Shogun Relay Registry Contract
 * Manages relay registration, staking, and slashing
 */
export declare class RelayRegistry extends BaseContract {
    constructor(provider: Provider, signer: Signer | undefined, chainId: number | string);
    /**
     * Register a new relay
     */
    registerRelay(endpoint: string, pubkey: string, epub: string, stakeAmount: bigint, griefingRatio: bigint): Promise<any>;
    /**
     * Get relay information
     */
    getRelayInfo(relayAddress: string): Promise<any>;
    /**
     * Get all active relays
     */
    getActiveRelays(): Promise<any>;
    /**
     * Check if relay is active
     */
    isActiveRelay(relayAddress: string): Promise<boolean>;
    /**
     * Increase stake
     */
    increaseStake(amount: bigint): Promise<any>;
    /**
     * Request unstake
     */
    requestUnstake(): Promise<any>;
    /**
     * Withdraw stake
     */
    withdrawStake(): Promise<any>;
    /**
     * Update relay endpoint
     */
    updateRelay(newEndpoint: string): Promise<any>;
    /**
     * Update relay encryption keys
     */
    updateRelayEncryptionKeys(pubkey: string, epub: string): Promise<any>;
    /**
     * Register user
     */
    registerUser(pubkey: string, epub: string): Promise<any>;
    /**
     * Get user info
     */
    getUserInfo(userAddress: string): Promise<any>;
    /**
     * Deposit user stake
     */
    depositUserStake(amount: bigint, griefingRatio: bigint): Promise<any>;
    /**
     * Withdraw user stake
     */
    withdrawUserStake(amount: bigint): Promise<any>;
    /**
     * Grief a relay
     */
    grief(relay: string, slashAmount: bigint, reason: string, griefingRatio: bigint, dealId: string): Promise<any>;
}
//# sourceMappingURL=RelayRegistry.d.ts.map