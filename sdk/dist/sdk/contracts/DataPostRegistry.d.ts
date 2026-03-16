import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';
/**
 * Data Post Registry Contract
 * Manages data posts for sale
 */
export declare class DataPostRegistry extends BaseContract {
    constructor(provider: Provider, signer: Signer | undefined, chainId: number | string);
    /**
     * Publish a new data post
     */
    publishPost(proofHash: string, encryptedDataHash: string, description: string, category: string, priceUSDC: bigint): Promise<any>;
    /**
     * Get post information
     */
    getPost(postId: string): Promise<any>;
    /**
     * Get active posts
     */
    getActivePosts(): Promise<any>;
    /**
     * Get active post count
     */
    getActivePostCount(): Promise<bigint>;
    /**
     * Get posts by category
     */
    getPostsByCategory(category: string): Promise<any>;
    /**
     * Get posts by seller
     */
    getPostsBySeller(sellerAddress: string): Promise<any>;
    /**
     * Update post
     */
    updatePost(postId: string, newDescription: string, newPrice: bigint): Promise<any>;
    /**
     * Deactivate post
     */
    deactivatePost(postId: string): Promise<any>;
    /**
     * Get total posts count
     */
    totalPosts(): Promise<bigint>;
}
//# sourceMappingURL=DataPostRegistry.d.ts.map