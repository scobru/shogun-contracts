import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';
/**
 * Data Sale Escrow Factory Contract
 * Creates escrow contracts for data sales
 */
export declare class DataSaleEscrowFactory extends BaseContract {
    constructor(provider: Provider, signer: Signer | undefined, chainId: number | string);
    /**
     * Create a new escrow
     */
    createEscrow(postId: string, seller: string, countdownDuration: bigint): Promise<any>;
    /**
     * Get all escrows
     */
    getAllEscrows(): Promise<any>;
    /**
     * Get escrow count
     */
    getEscrowCount(): Promise<bigint>;
    /**
     * Get escrows by buyer
     */
    getEscrowsByBuyer(buyerAddress: string): Promise<any>;
    /**
     * Get escrows by seller
     */
    getEscrowsBySeller(sellerAddress: string): Promise<any>;
    /**
     * Get escrows by post
     */
    getEscrowsByPost(postId: string): Promise<any>;
}
//# sourceMappingURL=DataSaleEscrowFactory.d.ts.map