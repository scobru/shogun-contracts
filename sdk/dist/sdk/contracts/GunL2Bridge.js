import { keccak256, solidityPacked, getAddress } from 'ethers';
import { BaseContract } from './BaseContract.js';
/**
 * GunL2Bridge Contract
 * L2 Bridge for trustless deposits and withdrawals using Merkle proofs
 */
export class GunL2Bridge extends BaseContract {
    provider;
    signer;
    constructor(provider, signer, chainId) {
        super(provider, signer, chainId, 'GunL2Bridge');
        this.provider = provider;
        this.signer = signer;
    }
    /**
     * Deposit ETH to bridge to L2
     * @param amount Amount to deposit in wei (will be sent as msg.value)
     * @returns Transaction receipt
     */
    async deposit(amount) {
        if (!this.signer) {
            throw new Error('Signer required for deposit');
        }
        return await this.contract.deposit({ value: amount });
    }
    /**
     * Submit a new batch with updated state root (only sequencer or registered relay)
     * @param stateRoot Merkle root of the current L2 state
     * @param handledForceWithdrawals Array of force withdrawal hashes included in this batch
     * @returns Transaction receipt
     */
    async submitBatch(stateRoot, handledForceWithdrawals = []) {
        if (!this.signer) {
            throw new Error('Signer required for submitBatch');
        }
        return await this.contract.submitBatch(stateRoot, handledForceWithdrawals);
    }
    /**
     * Withdraw ETH from L2 to L1 using Merkle proof
     * @param amount Amount to withdraw in wei
     * @param nonce Unique nonce for this withdrawal (prevents replay)
     * @param batchId Batch ID the withdrawal belongs to
     * @param proof Merkle proof array (sibling hashes from leaf to root)
     * @returns Transaction receipt
     */
    async withdraw(amount, nonce, batchId, proof) {
        if (!this.signer) {
            throw new Error('Signer required for withdraw');
        }
        return await this.contract.withdraw(amount, nonce, batchId, proof);
    }
    /**
     * Get current state root (Merkle root of L2 state)
     */
    async getCurrentStateRoot() {
        return await this.contract.currentStateRoot();
    }
    /**
     * Get current batch ID
     */
    async getCurrentBatchId() {
        return await this.contract.currentBatchId();
    }
    /**
     * Get sequencer address (zero address means any registered relay can submit)
     */
    async getSequencer() {
        return await this.contract.sequencer();
    }
    /**
     * Get relay registry address
     */
    async getRelayRegistry() {
        return await this.contract.relayRegistry();
    }
    /**
     * Check if a withdrawal has been processed (anti-replay check)
     * @param user User address
     * @param amount Withdrawal amount
     * @param nonce Withdrawal nonce
     * @returns True if withdrawal has been processed
     */
    async isWithdrawalProcessed(user, amount, nonce) {
        // Compute leaf hash: keccak256(abi.encodePacked(user, amount, nonce))
        // solidityPacked is equivalent to abi.encodePacked in Solidity
        const normalizedUser = getAddress(user); // Normalize address
        const packed = solidityPacked(['address', 'uint256', 'uint256'], [normalizedUser, amount, nonce]);
        const leaf = keccak256(packed);
        return await this.contract.processedWithdrawals(leaf);
    }
    /**
     * Get contract balance (ETH locked in bridge)
     */
    async getBalance() {
        return await this.provider.getBalance(this.address);
    }
}
