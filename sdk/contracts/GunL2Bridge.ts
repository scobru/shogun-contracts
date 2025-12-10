import { Provider, Signer, keccak256, solidityPacked, getAddress } from 'ethers';
import { BaseContract } from './BaseContract.js';

/**
 * GunL2Bridge Contract
 * L2 Bridge for trustless deposits and withdrawals using Merkle proofs
 */
export class GunL2Bridge extends BaseContract {
  protected provider: Provider;
  protected signer?: Signer;

  constructor(provider: Provider, signer: Signer | undefined, chainId: number | string) {
    super(provider, signer, chainId, 'GunL2Bridge');
    this.provider = provider;
    this.signer = signer;
  }

  /**
   * Deposit ETH to bridge to L2
   * @param amount Amount to deposit in wei (will be sent as msg.value)
   * @returns Transaction receipt
   */
  async deposit(amount: bigint) {
    if (!this.signer) {
      throw new Error('Signer required for deposit');
    }
    return await this.contract.deposit({ value: amount });
  }

  /**
   * Submit a new batch with updated state root (only sequencer or registered relay)
   * @param stateRoot Merkle root of the current L2 state
   * @returns Transaction receipt
   */
  async submitBatch(stateRoot: string) {
    if (!this.signer) {
      throw new Error('Signer required for submitBatch');
    }
    return await this.contract.submitBatch(stateRoot);
  }

  /**
   * Withdraw ETH from L2 to L1 using Merkle proof
   * @param amount Amount to withdraw in wei
   * @param nonce Unique nonce for this withdrawal (prevents replay)
   * @param batchId Batch ID the withdrawal belongs to
   * @param proof Merkle proof array (sibling hashes from leaf to root)
   * @returns Transaction receipt
   */
  async withdraw(amount: bigint, nonce: bigint, batchId: bigint, proof: string[]) {
    if (!this.signer) {
      throw new Error('Signer required for withdraw');
    }
    return await this.contract.withdraw(amount, nonce, batchId, proof);
  }

  /**
   * Get current state root (Merkle root of L2 state)
   */
  async getCurrentStateRoot(): Promise<string> {
    return await this.contract.currentStateRoot();
  }

  /**
   * Get current batch ID
   */
  async getCurrentBatchId(): Promise<bigint> {
    return await this.contract.currentBatchId();
  }

  /**
   * Get sequencer address (zero address means any registered relay can submit)
   */
  async getSequencer(): Promise<string> {
    return await this.contract.sequencer();
  }

  /**
   * Get relay registry address
   */
  async getRelayRegistry(): Promise<string> {
    return await this.contract.relayRegistry();
  }

  /**
   * Check if a withdrawal has been processed (anti-replay check)
   * @param user User address
   * @param amount Withdrawal amount
   * @param nonce Withdrawal nonce
   * @returns True if withdrawal has been processed
   */
  async isWithdrawalProcessed(user: string, amount: bigint, nonce: bigint): Promise<boolean> {
    // Compute leaf hash: keccak256(abi.encodePacked(user, amount, nonce))
    // solidityPacked is equivalent to abi.encodePacked in Solidity
    const normalizedUser = getAddress(user); // Normalize address
    const packed = solidityPacked(
      ['address', 'uint256', 'uint256'],
      [normalizedUser, amount, nonce]
    );
    const leaf = keccak256(packed);
    return await this.contract.processedWithdrawals(leaf);
  }

  /**
   * Get contract balance (ETH locked in bridge)
   */
  async getBalance(): Promise<bigint> {
    return await this.provider.getBalance(this.address);
  }
}

