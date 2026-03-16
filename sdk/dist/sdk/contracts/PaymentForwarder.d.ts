import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';
/**
 * Shogun Payment Forwarder Contract
 * Handles ETH and ERC20 payments to stealth addresses with toll management
 */
export declare class PaymentForwarder extends BaseContract {
    constructor(provider: Provider, signer: Signer | undefined, chainId: number | string);
    /**
     * Send ETH and announce it to a stealth address
     */
    sendEth(receiver: string, tollCommitment: bigint, pkx: string, ciphertext: string, value: bigint): Promise<any>;
    /**
     * Send ERC20 tokens and announce it to a stealth address
     */
    sendToken(receiver: string, tokenAddr: string, amount: bigint, pkx: string, ciphertext: string, tollValue: bigint): Promise<any>;
    /**
     * Get the current toll amount
     */
    getToll(): Promise<bigint>;
    /**
     * Get token payment amount for a receiver
     */
    getTokenPayment(receiver: string, tokenAddr: string): Promise<bigint>;
    /**
     * Withdraw tokens from a stealth address (requires being the stealth address owner)
     */
    withdrawToken(acceptor: string, tokenAddr: string): Promise<any>;
}
//# sourceMappingURL=PaymentForwarder.d.ts.map