import { BaseContract } from './BaseContract.js';
/**
 * Storage Deal Registry Contract
 * Manages storage deals between clients and relays
 */
export class StorageDealRegistry extends BaseContract {
    constructor(provider, signer, chainId) {
        super(provider, signer, chainId, 'StorageDealRegistry');
    }
    /**
     * Register a new storage deal
     */
    async registerDeal(dealId, client, cid, sizeMB, priceUSDC, durationDays, clientStake) {
        return await this.contract.registerDeal(dealId, client, cid, sizeMB, priceUSDC, durationDays, clientStake);
    }
    /**
     * Get deal information
     */
    async getDeal(dealId) {
        return await this.contract.getDeal(dealId);
    }
    /**
     * Get deals by client
     */
    async getClientDeals(clientAddress) {
        return await this.contract.getClientDeals(clientAddress);
    }
    /**
     * Get deals by relay
     */
    async getRelayDeals(relayAddress) {
        return await this.contract.getRelayDeals(relayAddress);
    }
    /**
     * Complete a deal
     */
    async completeDeal(dealId) {
        return await this.contract.completeDeal(dealId);
    }
    /**
     * Add client stake to a deal
     */
    async addClientStake(dealId, amount) {
        return await this.contract.addClientStake(dealId, amount);
    }
    /**
     * Withdraw client stake
     */
    async withdrawClientStake(dealId) {
        return await this.contract.withdrawClientStake(dealId);
    }
    /**
     * Grief a deal
     */
    async grief(dealId, slashAmount, reason) {
        return await this.contract.grief(dealId, slashAmount, reason);
    }
    /**
     * Get total deals count
     */
    async getTotalDeals() {
        return await this.contract.getTotalDeals();
    }
}
