import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';

/**
 * Data Post Registry Contract
 * Manages data posts for sale
 */
export class DataPostRegistry extends BaseContract {
  constructor(provider: Provider, signer: Signer | undefined, chainId: number | string) {
    super(provider, signer, chainId, 'DataPostRegistry');
  }

  /**
   * Publish a new data post
   */
  async publishPost(
    proofHash: string,
    encryptedDataHash: string,
    description: string,
    category: string,
    priceUSDC: bigint
  ) {
    return await this.contract.publishPost(
      proofHash,
      encryptedDataHash,
      description,
      category,
      priceUSDC
    );
  }

  /**
   * Get post information
   */
  async getPost(postId: string) {
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
  async getActivePostCount(): Promise<bigint> {
    return await this.contract.getActivePostCount();
  }

  /**
   * Get posts by category
   */
  async getPostsByCategory(category: string) {
    return await this.contract.getPostsByCategory(category);
  }

  /**
   * Get posts by seller
   */
  async getPostsBySeller(sellerAddress: string) {
    return await this.contract.getPostsBySeller(sellerAddress);
  }

  /**
   * Update post
   */
  async updatePost(postId: string, newDescription: string, newPrice: bigint) {
    return await this.contract.updatePost(postId, newDescription, newPrice);
  }

  /**
   * Deactivate post
   */
  async deactivatePost(postId: string) {
    return await this.contract.deactivatePost(postId);
  }

  /**
   * Get total posts count
   */
  async totalPosts(): Promise<bigint> {
    return await this.contract.totalPosts();
  }
}

