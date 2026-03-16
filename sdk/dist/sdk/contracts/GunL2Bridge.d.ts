import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';
/**
 * GunL2Bridge Contract
 * L2 Bridge for trustless deposits and withdrawals using Merkle proofs
 */
export declare class GunL2Bridge extends BaseContract {
    protected provider: Provider;
    protected signer?: Signer;
    constructor(provider: Provider, signer: Signer | undefined, chainId: number | string);
    /**
     * Deposit ETH to bridge to L2
     * @param amount Amount to deposit in wei (will be sent as msg.value)
     * @returns Transaction receipt
     */
    deposit(amount: bigint): Promise<any>;
    /**
     * Submit a new batch with updated state root (only sequencer or registered relay)
     * @param stateRoot Merkle root of the current L2 state
     * @param handledForceWithdrawals Array of force withdrawal hashes included in this batch
     * @returns Transaction receipt
     */
    submitBatch(stateRoot: string, handledForceWithdrawals?: string[]): Promise<any>;
    /**
     * Withdraw ETH from L2 to L1 using Merkle proof
     * @param amount Amount to withdraw in wei
     * @param nonce Unique nonce for this withdrawal (prevents replay)
     * @param batchId Batch ID the withdrawal belongs to
     * @param proof Merkle proof array (sibling hashes from leaf to root)
     * @returns Transaction receipt
     */
    withdraw(amount: bigint, nonce: bigint, batchId: bigint, proof: string[]): Promise<any>;
    /**
     * Get current state root (Merkle root of L2 state)
     */
    getCurrentStateRoot(): Promise<string>;
    /**
     * Get current batch ID
     */
    getCurrentBatchId(): Promise<bigint>;
    /**
     * Get sequencer address (zero address means any registered relay can submit)
     */
    getSequencer(): Promise<string>;
    /**
     * Get relay registry address
     */
    getRelayRegistry(): Promise<string>;
    /**
     * Check if a withdrawal has been processed (anti-replay check)
     * @param user User address
     * @param amount Withdrawal amount
     * @param nonce Withdrawal nonce
     * @returns True if withdrawal has been processed
     */
    isWithdrawalProcessed(user: string, amount: bigint, nonce: bigint): Promise<boolean>;
    /**
     * Get contract balance (ETH locked in bridge)
     */
    getBalance(): Promise<bigint>;
}
//# sourceMappingURL=GunL2Bridge.d.ts.map