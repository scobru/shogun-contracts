import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';
/**
 * Stealth Pool Contract
 * Manages stealth address deposits and withdrawals
 */
export declare class StealthPool extends BaseContract {
    constructor(provider: Provider, signer: Signer | undefined, chainId: number | string);
    /**
     * Register a deposit
     */
    registerDeposit(commitment: string, amount: bigint): Promise<any>;
    /**
     * Withdraw from stealth pool
     */
    withdraw(commitment: string, nonce: string, recipient: string, amount: bigint, merkleProof: string[]): Promise<any>;
    /**
     * Calculate commitment
     */
    calculateCommitment(publicKey: string, nonce: string): Promise<string>;
    /**
     * Generate merkle proof
     */
    generateMerkleProof(commitment: string): Promise<any>;
    /**
     * Check if commitment is registered
     */
    isCommitmentRegistered(commitment: string): Promise<boolean>;
    /**
     * Get remaining amount for commitment
     */
    getRemainingAmount(commitment: string): Promise<bigint>;
    /**
     * Get total deposit amount for commitment
     */
    getTotalDepositAmount(commitment: string): Promise<bigint>;
    /**
     * Get all commitments
     */
    getAllCommitments(): Promise<any>;
    /**
     * Get balance
     */
    getBalance(): Promise<bigint>;
}
//# sourceMappingURL=StealthPool.d.ts.map