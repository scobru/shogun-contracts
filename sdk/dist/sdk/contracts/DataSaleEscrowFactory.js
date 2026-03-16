import { BaseContract } from './BaseContract.js';
/**
 * Data Sale Escrow Factory Contract
 * Creates escrow contracts for data sales
 */
export class DataSaleEscrowFactory extends BaseContract {
    constructor(provider, signer, chainId) {
        super(provider, signer, chainId, 'DataSaleEscrowFactory');
    }
    /**
     * Create a new escrow
     */
    async createEscrow(postId, seller, countdownDuration) {
        return await this.contract.createEscrow(postId, seller, countdownDuration);
    }
    /**
     * Get all escrows
     */
    async getAllEscrows() {
        return await this.contract.getAllEscrows();
    }
    /**
     * Get escrow count
     */
    async getEscrowCount() {
        return await this.contract.getEscrowCount();
    }
    /**
     * Get escrows by buyer
     */
    async getEscrowsByBuyer(buyerAddress) {
        return await this.contract.getEscrowsByBuyer(buyerAddress);
    }
    /**
     * Get escrows by seller
     */
    async getEscrowsBySeller(sellerAddress) {
        return await this.contract.getEscrowsBySeller(sellerAddress);
    }
    /**
     * Get escrows by post
     */
    async getEscrowsByPost(postId) {
        return await this.contract.getEscrowsByPost(postId);
    }
}
