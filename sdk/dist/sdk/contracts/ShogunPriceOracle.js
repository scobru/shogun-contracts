import { BaseContract } from './BaseContract.js';
/**
 * ShogunPriceOracle contract wrapper
 *
 * Example oracle consumer that stores and retrieves price data
 */
export class ShogunPriceOracle extends BaseContract {
    constructor(provider, signer, chainId) {
        super(provider, signer, chainId, 'ShogunPriceOracle');
    }
    /**
     * Update price from a signed oracle packet
     */
    async updatePrice(packet) {
        return await this.contract.updatePrice({
            v: packet.signature.v,
            r: packet.signature.r,
            s: packet.signature.s,
            feedId: packet.feedId,
            deadline: packet.deadline,
            payload: packet.payload,
        });
    }
    /**
     * Get price by feed name
     */
    async getPrice(feedName) {
        const [price, timestamp] = await this.contract.getPrice(feedName);
        return { price: BigInt(price), timestamp: Number(timestamp) };
    }
    /**
     * Get price by feed ID
     */
    async getPriceById(feedId) {
        const [price, timestamp] = await this.contract.getPriceById(feedId);
        return { price: BigInt(price), timestamp: Number(timestamp) };
    }
    /**
     * Update and get price in single call
     */
    async updateAndGetPrice(packet) {
        return await this.contract.updateAndGetPrice.staticCall({
            v: packet.signature.v,
            r: packet.signature.r,
            s: packet.signature.s,
            feedId: packet.feedId,
            deadline: packet.deadline,
            payload: packet.payload,
        });
    }
    /**
     * Verify a packet without storing
     */
    async verifyPacket(feedId, packet) {
        const [valid, price, signer] = await this.contract.verifyPacket(feedId, {
            v: packet.signature.v,
            r: packet.signature.r,
            s: packet.signature.s,
            feedId: packet.feedId,
            deadline: packet.deadline,
            payload: packet.payload,
        });
        return { valid, price: BigInt(price), signer };
    }
    /**
     * Get latest price for a feed
     */
    async latestPrices(feedId) {
        return BigInt(await this.contract.latestPrices(feedId));
    }
    /**
     * Get last update timestamp for a feed
     */
    async lastUpdated(feedId) {
        return Number(await this.contract.lastUpdated(feedId));
    }
    /**
     * Get last signer for a feed
     */
    async lastSigner(feedId) {
        return await this.contract.lastSigner(feedId);
    }
}
