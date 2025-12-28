import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';
import { OraclePacket } from './OracleFeedRegistry.js';

/**
 * ShogunPaidOracle contract wrapper
 * 
 * Oracle consumer with on-chain payment to relay operators
 */
export class ShogunPaidOracle extends BaseContract {
    constructor(
        provider: Provider,
        signer: Signer | undefined,
        chainId: number | string
    ) {
        super(provider, signer, chainId, 'ShogunPaidOracle');
    }

    /**
     * Update price from a signed oracle packet (with payment)
     * @param packet Signed oracle packet
     * @param paymentWei Amount to pay in wei (query getUpdateQuote first)
     */
    async updatePrice(packet: OraclePacket, paymentWei: bigint = 0n) {
        return await this.contract.updatePrice(
            {
                v: packet.signature.v,
                r: packet.signature.r,
                s: packet.signature.s,
                feedId: packet.feedId,
                deadline: packet.deadline,
                payload: packet.payload,
            },
            { value: paymentWei }
        );
    }

    /**
     * Update and get price in single call (with payment)
     */
    async updateAndGetPrice(packet: OraclePacket, paymentWei: bigint = 0n): Promise<bigint> {
        return await this.contract.updateAndGetPrice.staticCall(
            {
                v: packet.signature.v,
                r: packet.signature.r,
                s: packet.signature.s,
                feedId: packet.feedId,
                deadline: packet.deadline,
                payload: packet.payload,
            },
            { value: paymentWei }
        );
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
     * Get required payment for a feed
     */
    async getUpdateQuote(feedId: string): Promise<bigint> {
        return BigInt(await this.contract.getUpdateQuote(feedId));
    }

    /**
     * Get feed price override
     */
    async feedPriceOverride(feedId: string): Promise<bigint> {
        return BigInt(await this.contract.feedPriceOverride(feedId));
    }

    /**
     * Get relay revenue
     */
    async relayRevenue(relayAddress: string): Promise<bigint> {
        return BigInt(await this.contract.relayRevenue(relayAddress));
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

    // ===== Admin Functions =====

    /**
     * Set price for a feed (owner only)
     */
    async setFeedPrice(feedId: string, priceWei: bigint) {
        return await this.contract.setFeedPrice(feedId, priceWei);
    }

    /**
     * Set price by feed name (owner only)
     */
    async setFeedPriceByName(feedName: string, priceWei: bigint) {
        return await this.contract.setFeedPriceByName(feedName, priceWei);
    }

    /**
     * Transfer ownership (owner only)
     */
    async transferOwnership(newOwner: string) {
        return await this.contract.transferOwnership(newOwner);
    }

    /**
     * Get current owner
     */
    async owner(): Promise<string> {
        return await this.contract.owner();
    }
}
