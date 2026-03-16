import { BaseContract } from './BaseContract.js';
/**
 * Shogun Payment Forwarder Contract
 * Handles ETH and ERC20 payments to stealth addresses with toll management
 */
export class PaymentForwarder extends BaseContract {
    constructor(provider, signer, chainId) {
        super(provider, signer, chainId, 'PaymentForwarder');
    }
    /**
     * Send ETH and announce it to a stealth address
     */
    async sendEth(receiver, tollCommitment, pkx, ciphertext, value) {
        return await this.contract.sendEth(receiver, tollCommitment, pkx, ciphertext, { value });
    }
    /**
     * Send ERC20 tokens and announce it to a stealth address
     */
    async sendToken(receiver, tokenAddr, amount, pkx, ciphertext, tollValue) {
        return await this.contract.sendToken(receiver, tokenAddr, amount, pkx, ciphertext, { value: tollValue });
    }
    /**
     * Get the current toll amount
     */
    async getToll() {
        return await this.contract.toll();
    }
    /**
     * Get token payment amount for a receiver
     */
    async getTokenPayment(receiver, tokenAddr) {
        return await this.contract.tokenPayments(receiver, tokenAddr);
    }
    /**
     * Withdraw tokens from a stealth address (requires being the stealth address owner)
     */
    async withdrawToken(acceptor, tokenAddr) {
        return await this.contract.withdrawToken(acceptor, tokenAddr);
    }
}
