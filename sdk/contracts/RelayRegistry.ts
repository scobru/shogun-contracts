import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';

/**
 * Shogun Relay Registry Contract
 * Manages relay registration, staking, and slashing
 */
export class RelayRegistry extends BaseContract {
  constructor(provider: Provider, signer: Signer | undefined, chainId: number | string) {
    super(provider, signer, chainId, 'ShogunRelayRegistry');
  }

  /**
   * Register a new relay
   */
  async registerRelay(
    endpoint: string,
    pubkey: string,
    epub: string,
    stakeAmount: bigint,
    griefingRatio: bigint
  ) {
    return await this.contract.registerRelay(
      endpoint,
      pubkey,
      epub,
      stakeAmount,
      griefingRatio
    );
  }

  /**
   * Get relay information
   */
  async getRelayInfo(relayAddress: string) {
    return await this.contract.getRelayInfo(relayAddress);
  }

  /**
   * Get all active relays
   */
  async getActiveRelays() {
    return await this.contract.getActiveRelays();
  }

  /**
   * Check if relay is active
   */
  async isActiveRelay(relayAddress: string): Promise<boolean> {
    return await this.contract.isActiveRelay(relayAddress);
  }

  /**
   * Increase stake
   */
  async increaseStake(amount: bigint) {
    return await this.contract.increaseStake(amount);
  }

  /**
   * Request unstake
   */
  async requestUnstake() {
    return await this.contract.requestUnstake();
  }

  /**
   * Withdraw stake
   */
  async withdrawStake() {
    return await this.contract.withdrawStake();
  }

  /**
   * Update relay endpoint
   */
  async updateRelay(newEndpoint: string) {
    return await this.contract.updateRelay(newEndpoint);
  }

  /**
   * Update relay encryption keys
   */
  async updateRelayEncryptionKeys(pubkey: string, epub: string) {
    return await this.contract.updateRelayEncryptionKeys(pubkey, epub);
  }

  /**
   * Register user
   */
  async registerUser(pubkey: string, epub: string) {
    return await this.contract.registerUser(pubkey, epub);
  }

  /**
   * Get user info
   */
  async getUserInfo(userAddress: string) {
    return await this.contract.getUserInfo(userAddress);
  }

  /**
   * Deposit user stake
   */
  async depositUserStake(amount: bigint, griefingRatio: bigint) {
    return await this.contract.depositUserStake(amount, griefingRatio);
  }

  /**
   * Withdraw user stake
   */
  async withdrawUserStake(amount: bigint) {
    return await this.contract.withdrawUserStake(amount);
  }

  /**
   * Grief a relay
   */
  async grief(
    relay: string,
    slashAmount: bigint,
    reason: string,
    griefingRatio: bigint,
    dealId: string
  ) {
    return await this.contract.grief(relay, slashAmount, reason, griefingRatio, dealId);
  }
}

