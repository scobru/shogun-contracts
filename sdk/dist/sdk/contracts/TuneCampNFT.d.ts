import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';
export declare enum TokenRole {
    LICENSE = 0,
    OWNERSHIP = 1,
    COLLECTIBLE = 2
}
export declare class TuneCampNFT extends BaseContract {
    constructor(provider: Provider, signer: Signer | undefined, chainId: number | string);
    /**
     * Get the actual ethers.Contract with a specific proxy address
     */
    attach(address: string): this;
    /**
     * Register a new track (Admin only)
     */
    registerTrack(trackId: bigint | number, artist: string, maxLicense: bigint | number, maxOwnership: bigint | number, maxCollectible: bigint | number): Promise<any>;
    /**
     * Mint tokens (Minter only, usually Checkout contract)
     */
    mint(to: string, trackId: bigint | number, role: TokenRole, amount: bigint | number): Promise<any>;
    /**
     * Get the artist of a track
     */
    trackArtist(trackId: bigint | number): Promise<string>;
    /**
     * Encode track ID and role into a single token ID
     */
    encodeTokenId(trackId: bigint | number, role: TokenRole): Promise<bigint>;
    /**
     * Decode a token ID into track ID and role
     */
    decodeTokenId(tokenId: bigint | number): Promise<[bigint, TokenRole]>;
    /**
     * Get token URI
     */
    uri(tokenId: bigint | number): Promise<string>;
    /**
     * Set custom URI for a token (Admin only)
     */
    setTokenURI(tokenId: bigint | number, newURI: string): Promise<any>;
    /**
     * Set base URI (Admin only)
     */
    setBaseURI(newBaseURI: string): Promise<any>;
}
//# sourceMappingURL=TuneCampNFT.d.ts.map