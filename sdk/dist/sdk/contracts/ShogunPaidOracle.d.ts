import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';
import { OraclePacket } from './OracleFeedRegistry.js';
/**
 * ShogunPaidOracle contract wrapper
 *
 * Oracle consumer with on-chain payment to relay operators
 */
export declare class ShogunPaidOracle extends BaseContract {
    constructor(provider: Provider, signer: Signer | undefined, chainId: number | string);
    /**
     * Update price from a signed oracle packet (with payment)
     * @param packet Signed oracle packet
     * @param paymentWei Amount to pay in wei (query getUpdateQuote first)
     */
    updatePrice(packet: OraclePacket, paymentWei?: bigint): Promise<any>;
    /**
     * Update and get price in single call (with payment)
     */
    updateAndGetPrice(packet: OraclePacket, paymentWei?: bigint): Promise<bigint>;
    /**
     * Get price by feed name
     */
    getPrice(feedName: string): Promise<{
        price: bigint;
        timestamp: number;
    }>;
    /**
     * Get price by feed ID
     */
    getPriceById(feedId: string): Promise<{
        price: bigint;
        timestamp: number;
    }>;
    /**
     * Get required payment for a feed
     */
    getUpdateQuote(feedId: string): Promise<bigint>;
    /**
     * Get feed price override
     */
    feedPriceOverride(feedId: string): Promise<bigint>;
    /**
     * Get relay revenue
     */
    relayRevenue(relayAddress: string): Promise<bigint>;
    /**
     * Verify a packet without storing
     */
    verifyPacket(feedId: string, packet: OraclePacket): Promise<{
        valid: boolean;
        price: bigint;
        signer: string;
    }>;
    /**
     * Set price for a feed (owner only)
     */
    setFeedPrice(feedId: string, priceWei: bigint): Promise<any>;
    /**
     * Set price by feed name (owner only)
     */
    setFeedPriceByName(feedName: string, priceWei: bigint): Promise<any>;
    /**
     * Transfer ownership (owner only)
     */
    transferOwnership(newOwner: string): Promise<any>;
    /**
     * Get current owner
     */
    owner(): Promise<string>;
}
//# sourceMappingURL=ShogunPaidOracle.d.ts.map