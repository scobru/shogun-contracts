import { BaseContract } from './BaseContract.js';
/**
 * Data Post Registry Contract
 * Manages data posts for sale
 */
export class DataPostRegistry extends BaseContract {
    constructor(provider, signer, chainId) {
        super(provider, signer, chainId, 'DataPostRegistry');
    }
    /**
     * Publish a new data post
     */
    async publishPost(proofHash, encryptedDataHash, description, category, priceUSDC) {
        return await this.contract.publishPost(proofHash, encryptedDataHash, description, category, priceUSDC);
    }
    /**
     * Get post information
     */
    async getPost(postId) {
        return await this.contract.getPost(postId);
    }
    /**
     * Get active posts
     */
    async getActivePosts() {
        return await this.contract.getActivePosts();
    }
    /**
     * Get active post count
     */
    async getActivePostCount() {
        return await this.contract.getActivePostCount();
    }
    /**
     * Get posts by category
     */
    async getPostsByCategory(category) {
        return await this.contract.getPostsByCategory(category);
    }
    /**
     * Get posts by seller
     */
    async getPostsBySeller(sellerAddress) {
        return await this.contract.getPostsBySeller(sellerAddress);
    }
    /**
     * Update post
     */
    async updatePost(postId, newDescription, newPrice) {
        return await this.contract.updatePost(postId, newDescription, newPrice);
    }
    /**
     * Deactivate post
     */
    async deactivatePost(postId) {
        return await this.contract.deactivatePost(postId);
    }
    /**
     * Get total posts count
     */
    async totalPosts() {
        return await this.contract.totalPosts();
    }
}
