import { BaseContract } from './BaseContract.js';
export var TokenRole;
(function (TokenRole) {
    TokenRole[TokenRole["LICENSE"] = 0] = "LICENSE";
    TokenRole[TokenRole["OWNERSHIP"] = 1] = "OWNERSHIP";
    TokenRole[TokenRole["COLLECTIBLE"] = 2] = "COLLECTIBLE";
})(TokenRole || (TokenRole = {}));
export class TuneCampNFT extends BaseContract {
    constructor(provider, signer, chainId) {
        // Note: The TuneCampNFT needs to be instantiated with its proxy address, not the logic address.
        // BaseContract fetches address from config (which holds the logic), but usually users will connect
        // to a specific proxy via `attach(proxyAddress)`.
        super(provider, signer, chainId, 'TuneCampNFT');
    }
    /**
     * Get the actual ethers.Contract with a specific proxy address
     */
    attach(address) {
        const ContractFactory = Object.getPrototypeOf(this.contract).constructor;
        this.contract = new ContractFactory(address, this.contract.interface, this.contract.runner);
        this.address = address;
        return this;
    }
    /**
     * Register a new track (Admin only)
     */
    async registerTrack(trackId, artist, maxLicense, maxOwnership, maxCollectible) {
        return await this.contract.registerTrack(trackId, artist, maxLicense, maxOwnership, maxCollectible);
    }
    /**
     * Mint tokens (Minter only, usually Checkout contract)
     */
    async mint(to, trackId, role, amount) {
        return await this.contract.mint(to, trackId, role, amount);
    }
    /**
     * Get the artist of a track
     */
    async trackArtist(trackId) {
        return await this.contract.trackArtist(trackId);
    }
    /**
     * Encode track ID and role into a single token ID
     */
    async encodeTokenId(trackId, role) {
        return await this.contract.encodeTokenId(trackId, role);
    }
    /**
     * Decode a token ID into track ID and role
     */
    async decodeTokenId(tokenId) {
        return await this.contract.decodeTokenId(tokenId);
    }
    /**
     * Get token URI
     */
    async uri(tokenId) {
        return await this.contract.uri(tokenId);
    }
    /**
     * Set custom URI for a token (Admin only)
     */
    async setTokenURI(tokenId, newURI) {
        return await this.contract.setTokenURI(tokenId, newURI);
    }
    /**
     * Set base URI (Admin only)
     */
    async setBaseURI(newBaseURI) {
        return await this.contract.setBaseURI(newBaseURI);
    }
}
