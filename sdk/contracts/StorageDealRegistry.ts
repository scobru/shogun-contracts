import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';

/**
 * Storage Deal Registry Contract
 * Manages storage deals between clients and relays
 */
export class StorageDealRegistry extends BaseContract {
  constructor(provider: Provider, signer: Signer | undefined, chainId: number | string) {
    super(provider, signer, chainId, 'StorageDealRegistry');
  }

  /**
   * Register a new storage deal
   */
  async registerDeal(
    dealId: string,
    client: string,
    cid: string,
    sizeMB: bigint,
    priceUSDC: bigint,
    durationDays: bigint,
    clientStake: bigint
  ) {
    return await this.contract.registerDeal(
      dealId,
      client,
      cid,
      sizeMB,
      priceUSDC,
      durationDays,
      clientStake
    );
  }

  /**
   * Get deal information
   */
  async getDeal(dealId: string) {
    return await this.contract.getDeal(dealId);
  }

  /**
   * Get deals by client
   */
  async getClientDeals(clientAddress: string) {
    return await this.contract.getClientDeals(clientAddress);
  }

  /**
   * Get deals by relay
   */
  async getRelayDeals(relayAddress: string) {
    return await this.contract.getRelayDeals(relayAddress);
  }

  /**
   * Complete a deal
   */
  async completeDeal(dealId: string) {
    return await this.contract.completeDeal(dealId);
  }

  /**
   * Add client stake to a deal
   */
  async addClientStake(dealId: string, amount: bigint) {
    return await this.contract.addClientStake(dealId, amount);
  }

  /**
   * Withdraw client stake
   */
  async withdrawClientStake(dealId: string) {
    return await this.contract.withdrawClientStake(dealId);
  }

  /**
   * Grief a deal
   */
  async grief(dealId: string, slashAmount: bigint, reason: string) {
    return await this.contract.grief(dealId, slashAmount, reason);
  }

  /**
   * Get total deals count
   */
  async getTotalDeals(): Promise<bigint> {
    return await this.contract.getTotalDeals();
  }
}

