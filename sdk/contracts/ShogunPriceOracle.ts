import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';
import { OraclePacket, OracleFeedRegistry } from './OracleFeedRegistry.js';

/**
 * ShogunPriceOracle contract wrapper
 * 
 * Example oracle consumer that stores and retrieves price data
 */
export class ShogunPriceOracle extends BaseContract {
    constructor(
        provider: Provider,
        signer: Signer | undefined,
        chainId: number | string
    ) {
        super(provider, signer, chainId, 'ShogunPriceOracle');
    }

    /**
     * Update price from a signed oracle packet
     */
    async updatePrice(packet: OraclePacket) {
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
    async getPrice(feedName: string): Promise<{ price: bigint; timestamp: number }> {
        const [price, timestamp] = await this.contract.getPrice(feedName);
        return { price: BigInt(price), timestamp: Number(timestamp) };
    }

    /**
     * Get price by feed ID
     */
    async getPriceById(feedId: string): Promise<{ price: bigint; timestamp: number }> {
        const [price, timestamp] = await this.contract.getPriceById(feedId);
        return { price: BigInt(price), timestamp: Number(timestamp) };
    }

    /**
     * Update and get price in single call
     */
    async updateAndGetPrice(packet: OraclePacket): Promise<bigint> {
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
    async verifyPacket(
        feedId: string,
        packet: OraclePacket
    ): Promise<{ valid: boolean; price: bigint; signer: string }> {
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
    async latestPrices(feedId: string): Promise<bigint> {
        return BigInt(await this.contract.latestPrices(feedId));
    }

    /**
     * Get last update timestamp for a feed
     */
    async lastUpdated(feedId: string): Promise<number> {
        return Number(await this.contract.lastUpdated(feedId));
    }

    /**
     * Get last signer for a feed
     */
    async lastSigner(feedId: string): Promise<string> {
        return await this.contract.lastSigner(feedId);
    }
}
