import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';
/**
 * Data types for oracle feeds (matches OracleFeedRegistry.DataType enum)
 */
export declare enum OracleDataType {
    PRICE = 0,
    STRING = 1,
    JSON = 2,
    BYTES = 3,
    CUSTOM = 4
}
/**
 * Feed information from the registry
 */
export interface OracleFeedInfo {
    name: string;
    dataType: OracleDataType;
    schema: string;
    priceAtomic: bigint;
    updateFreqSecs: number;
    createdAt: number;
    active: boolean;
}
/**
 * EIP-712 signed oracle packet
 */
export interface OraclePacket {
    feedId: string;
    deadline: number;
    payload: string;
    signature: {
        v: number;
        r: string;
        s: string;
    };
}
/**
 * OracleFeedRegistry contract wrapper
 *
 * Used by relays to register data feeds and by consumers to query available feeds
 */
export declare class OracleFeedRegistry extends BaseContract {
    constructor(provider: Provider, signer: Signer | undefined, chainId: number | string);
    /**
     * Compute feedId from feed name
     */
    static computeFeedId(feedName: string): string;
    /**
     * Register a new feed (must be called by an active relay)
     */
    registerFeed(name: string, dataType: OracleDataType, schema: string, priceAtomic: bigint, updateFreqSecs: number): Promise<any>;
    /**
     * Update feed pricing and status
     */
    updateFeed(feedId: string, newPrice: bigint, active: boolean): Promise<any>;
    /**
     * Deactivate a feed
     */
    deactivateFeed(feedId: string): Promise<any>;
    /**
     * Get all feeds for a relay
     */
    getRelayFeeds(relayAddress: string): Promise<OracleFeedInfo[]>;
    /**
     * Get a specific feed
     */
    getFeed(relayAddress: string, feedId: string): Promise<OracleFeedInfo>;
    /**
     * Check if a feed is active
     */
    isFeedActive(relayAddress: string, feedId: string): Promise<{
        exists: boolean;
        active: boolean;
    }>;
    /**
     * Get number of feeds for a relay
     */
    getRelayFeedCount(relayAddress: string): Promise<number>;
    /**
     * Get total feeds across all relays
     */
    getTotalFeeds(): Promise<number>;
}
/**
 * Oracle packet signer utility
 *
 * Used by relays to sign oracle data packets for on-chain verification
 */
export declare class OraclePacketSigner {
    private wallet;
    private domain;
    private static readonly TYPES;
    constructor(privateKey: string, chainId: number, oracleContractAddress: string);
    /**
     * Get signer address
     */
    getAddress(): string;
    /**
     * Encode payload based on schema
     */
    static encodePayload(value: any, schema: string): string;
    /**
     * Sign an oracle packet
     */
    signPacket(feedName: string, value: any, schema: string, validitySecs?: number): Promise<OraclePacket>;
}
//# sourceMappingURL=OracleFeedRegistry.d.ts.map