import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';

/**
 * Stealth Pool Contract
 * Manages stealth address deposits and withdrawals
 */
export class StealthPool extends BaseContract {
  constructor(provider: Provider, signer: Signer | undefined, chainId: number | string) {
    super(provider, signer, chainId, 'StealthPool');
  }

  /**
   * Register a deposit
   */
  async registerDeposit(commitment: string, amount: bigint) {
    return await this.contract.registerDeposit(commitment, amount);
  }

  /**
   * Withdraw from stealth pool
   */
  async withdraw(
    commitment: string,
    nonce: string,
    recipient: string,
    amount: bigint,
    merkleProof: string[]
  ) {
    return await this.contract.withdraw(commitment, nonce, recipient, amount, merkleProof);
  }

  /**
   * Calculate commitment
   */
  async calculateCommitment(publicKey: string, nonce: string): Promise<string> {
    return await this.contract.calculateCommitment(publicKey, nonce);
  }

  /**
   * Generate merkle proof
   */
  async generateMerkleProof(commitment: string) {
    return await this.contract.generateMerkleProof(commitment);
  }

  /**
   * Check if commitment is registered
   */
  async isCommitmentRegistered(commitment: string): Promise<boolean> {
    return await this.contract.isCommitmentRegistered(commitment);
  }

  /**
   * Get remaining amount for commitment
   */
  async getRemainingAmount(commitment: string): Promise<bigint> {
    return await this.contract.getRemainingAmount(commitment);
  }

  /**
   * Get total deposit amount for commitment
   */
  async getTotalDepositAmount(commitment: string): Promise<bigint> {
    return await this.contract.getTotalDepositAmount(commitment);
  }

  /**
   * Get all commitments
   */
  async getAllCommitments() {
    return await this.contract.getAllCommitments();
  }

  /**
   * Get balance
   */
  async getBalance(): Promise<bigint> {
    return await this.contract.getBalance();
  }
}

