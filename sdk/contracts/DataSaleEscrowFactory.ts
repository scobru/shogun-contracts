import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';

/**
 * Data Sale Escrow Factory Contract
 * Creates escrow contracts for data sales
 */
export class DataSaleEscrowFactory extends BaseContract {
  constructor(provider: Provider, signer: Signer | undefined, chainId: number | string) {
    super(provider, signer, chainId, 'DataSaleEscrowFactory');
  }

  /**
   * Create a new escrow
   */
  async createEscrow(
    postId: string,
    seller: string,
    countdownDuration: bigint
  ) {
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
  async getEscrowCount(): Promise<bigint> {
    return await this.contract.getEscrowCount();
  }

  /**
   * Get escrows by buyer
   */
  async getEscrowsByBuyer(buyerAddress: string) {
    return await this.contract.getEscrowsByBuyer(buyerAddress);
  }

  /**
   * Get escrows by seller
   */
  async getEscrowsBySeller(sellerAddress: string) {
    return await this.contract.getEscrowsBySeller(sellerAddress);
  }

  /**
   * Get escrows by post
   */
  async getEscrowsByPost(postId: string) {
    return await this.contract.getEscrowsByPost(postId);
  }
}

