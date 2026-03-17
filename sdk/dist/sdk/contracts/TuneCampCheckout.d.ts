import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';
import { TokenRole } from './TuneCampNFT.js';
export declare class TuneCampCheckout extends BaseContract {
    constructor(provider: Provider, signer: Signer | undefined, chainId: number | string);
    /**
     * Get the actual ethers.Contract with a specific proxy address
     */
    attach(address: string): this;
    /**
     * Purchase NFT with USDC
     */
    purchaseWithUSDC(trackId: bigint | number, role: TokenRole, quantity: bigint | number): Promise<any>;
    /**
     * Purchase NFT with ETH
     */
    purchaseWithETH(trackId: bigint | number, role: TokenRole, quantity: bigint | number, value: bigint): Promise<any>;
    /**
     * Set price for a specific track and role (Artist/Admin)
     */
    setPrice(trackId: bigint | number, role: TokenRole, priceUSDC: bigint, priceETH: bigint): Promise<any>;
    /**
     * Batch set prices (Artist/Admin)
     */
    setPriceBatch(trackIds: (bigint | number)[], roles: TokenRole[], pricesUSDC: bigint[], pricesETH: bigint[]): Promise<any>;
    /**
     * Set Pro artist status (Admin only)
     */
    setProArtist(artist: string, status: boolean): Promise<any>;
    /**
     * Update treasury address (Admin only)
     */
    setTreasury(treasury: string): Promise<any>;
    /**
     * Preview split for a purchase
     */
    previewSplit(total: bigint, artist: string): Promise<[bigint, bigint]>;
    /**
     * Check if artist is Pro
     */
    isProArtist(artist: string): Promise<boolean>;
}
//# sourceMappingURL=TuneCampCheckout.d.ts.map