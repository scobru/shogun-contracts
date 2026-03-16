import { BaseContract } from './BaseContract.js';
/**
 * Stealth Pool Contract
 * Manages stealth address deposits and withdrawals
 */
export class StealthPool extends BaseContract {
    constructor(provider, signer, chainId) {
        super(provider, signer, chainId, 'StealthPool');
    }
    /**
     * Register a deposit
     */
    async registerDeposit(commitment, amount) {
        return await this.contract.registerDeposit(commitment, amount);
    }
    /**
     * Withdraw from stealth pool
     */
    async withdraw(commitment, nonce, recipient, amount, merkleProof) {
        return await this.contract.withdraw(commitment, nonce, recipient, amount, merkleProof);
    }
    /**
     * Calculate commitment
     */
    async calculateCommitment(publicKey, nonce) {
        return await this.contract.calculateCommitment(publicKey, nonce);
    }
    /**
     * Generate merkle proof
     */
    async generateMerkleProof(commitment) {
        return await this.contract.generateMerkleProof(commitment);
    }
    /**
     * Check if commitment is registered
     */
    async isCommitmentRegistered(commitment) {
        return await this.contract.isCommitmentRegistered(commitment);
    }
    /**
     * Get remaining amount for commitment
     */
    async getRemainingAmount(commitment) {
        return await this.contract.getRemainingAmount(commitment);
    }
    /**
     * Get total deposit amount for commitment
     */
    async getTotalDepositAmount(commitment) {
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
    async getBalance() {
        return await this.contract.getBalance();
    }
}
