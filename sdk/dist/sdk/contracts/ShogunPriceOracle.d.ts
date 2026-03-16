import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';
import { OraclePacket } from './OracleFeedRegistry.js';
/**
 * ShogunPriceOracle contract wrapper
 *
 * Example oracle consumer that stores and retrieves price data
 */
export declare class ShogunPriceOracle extends BaseContract {
    constructor(provider: Provider, signer: Signer | undefined, chainId: number | string);
    /**
     * Update price from a signed oracle packet
     */
    updatePrice(packet: OraclePacket): Promise<any>;
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
     * Update and get price in single call
     */
    updateAndGetPrice(packet: OraclePacket): Promise<bigint>;
    /**
     * Verify a packet without storing
     */
    verifyPacket(feedId: string, packet: OraclePacket): Promise<{
        valid: boolean;
        price: bigint;
        signer: string;
    }>;
    /**
     * Get latest price for a feed
     */
    latestPrices(feedId: string): Promise<bigint>;
    /**
     * Get last update timestamp for a feed
     */
    lastUpdated(feedId: string): Promise<number>;
    /**
     * Get last signer for a feed
     */
    lastSigner(feedId: string): Promise<string>;
}
//# sourceMappingURL=ShogunPriceOracle.d.ts.map