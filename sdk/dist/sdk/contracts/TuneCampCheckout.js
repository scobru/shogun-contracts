import { BaseContract } from './BaseContract.js';
export class TuneCampCheckout extends BaseContract {
    constructor(provider, signer, chainId) {
        super(provider, signer, chainId, 'TuneCampCheckout');
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
     * Purchase NFT with USDC
     */
    async purchaseWithUSDC(trackId, role, quantity) {
        return await this.contract.purchaseWithUSDC(trackId, role, quantity);
    }
    /**
     * Purchase NFT with ETH
     */
    async purchaseWithETH(trackId, role, quantity, value) {
        return await this.contract.purchaseWithETH(trackId, role, quantity, { value });
    }
    /**
     * Set price for a specific track and role (Admin only)
     */
    async setPrice(trackId, role, priceUSDC, priceETH) {
        return await this.contract.setPrice(trackId, role, priceUSDC, priceETH);
    }
    /**
     * Batch set prices (Admin only)
     */
    async setPriceBatch(trackIds, roles, pricesUSDC, pricesETH) {
        return await this.contract.setPriceBatch(trackIds, roles, pricesUSDC, pricesETH);
    }
    /**
     * Set Pro artist status (Admin only)
     */
    async setProArtist(artist, status) {
        return await this.contract.setProArtist(artist, status);
    }
    /**
     * Update treasury address (Admin only)
     */
    async setTreasury(treasury) {
        return await this.contract.setTreasury(treasury);
    }
    /**
     * Preview split for a purchase
     */
    async previewSplit(total, artist) {
        return await this.contract.previewSplit(total, artist);
    }
    /**
     * Check if artist is Pro
     */
    async isProArtist(artist) {
        return await this.contract.isProArtist(artist);
    }
}
