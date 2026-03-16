import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';
/**
 * Storage Deal Registry Contract
 * Manages storage deals between clients and relays
 */
export declare class StorageDealRegistry extends BaseContract {
    constructor(provider: Provider, signer: Signer | undefined, chainId: number | string);
    /**
     * Register a new storage deal
     */
    registerDeal(dealId: string, client: string, cid: string, sizeMB: bigint, priceUSDC: bigint, durationDays: bigint, clientStake: bigint): Promise<any>;
    /**
     * Get deal information
     */
    getDeal(dealId: string): Promise<any>;
    /**
     * Get deals by client
     */
    getClientDeals(clientAddress: string): Promise<any>;
    /**
     * Get deals by relay
     */
    getRelayDeals(relayAddress: string): Promise<any>;
    /**
     * Complete a deal
     */
    completeDeal(dealId: string): Promise<any>;
    /**
     * Add client stake to a deal
     */
    addClientStake(dealId: string, amount: bigint): Promise<any>;
    /**
     * Withdraw client stake
     */
    withdrawClientStake(dealId: string): Promise<any>;
    /**
     * Grief a deal
     */
    grief(dealId: string, slashAmount: bigint, reason: string): Promise<any>;
    /**
     * Get total deals count
     */
    getTotalDeals(): Promise<bigint>;
}
//# sourceMappingURL=StorageDealRegistry.d.ts.map