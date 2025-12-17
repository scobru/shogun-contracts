import { Provider, Signer, keccak256, toUtf8Bytes, AbiCoder, Wallet, TypedDataDomain, TypedDataField } from 'ethers';
import { BaseContract } from './BaseContract.js';

/**
 * Data types for oracle feeds (matches OracleFeedRegistry.DataType enum)
 */
export enum OracleDataType {
    PRICE = 0,
    STRING = 1,
    JSON = 2,
    BYTES = 3,
    CUSTOM = 4,
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
export class OracleFeedRegistry extends BaseContract {
    constructor(
        provider: Provider,
        signer: Signer | undefined,
        chainId: number | string
    ) {
        super(provider, signer, chainId, 'OracleFeedRegistry');
    }

    /**
     * Compute feedId from feed name
     */
    static computeFeedId(feedName: string): string {
        return keccak256(toUtf8Bytes(feedName));
    }

    /**
     * Register a new feed (must be called by an active relay)
     */
    async registerFeed(
        name: string,
        dataType: OracleDataType,
        schema: string,
        priceAtomic: bigint,
        updateFreqSecs: number
    ) {
        return await this.contract.registerFeed(
            name,
            dataType,
            schema,
            priceAtomic,
            updateFreqSecs
        );
    }

    /**
     * Update feed pricing and status
     */
    async updateFeed(feedId: string, newPrice: bigint, active: boolean) {
        return await this.contract.updateFeed(feedId, newPrice, active);
    }

    /**
     * Deactivate a feed
     */
    async deactivateFeed(feedId: string) {
        return await this.contract.deactivateFeed(feedId);
    }

    /**
     * Get all feeds for a relay
     */
    async getRelayFeeds(relayAddress: string): Promise<OracleFeedInfo[]> {
        const feeds = await this.contract.getRelayFeeds(relayAddress);
        return feeds.map((feed: any) => ({
            name: feed.name,
            dataType: Number(feed.dataType),
            schema: feed.schema,
            priceAtomic: BigInt(feed.priceAtomic),
            updateFreqSecs: Number(feed.updateFreqSecs),
            createdAt: Number(feed.createdAt),
            active: feed.active,
        }));
    }

    /**
     * Get a specific feed
     */
    async getFeed(relayAddress: string, feedId: string): Promise<OracleFeedInfo> {
        const feed = await this.contract.getFeed(relayAddress, feedId);
        return {
            name: feed.name,
            dataType: Number(feed.dataType),
            schema: feed.schema,
            priceAtomic: BigInt(feed.priceAtomic),
            updateFreqSecs: Number(feed.updateFreqSecs),
            createdAt: Number(feed.createdAt),
            active: feed.active,
        };
    }

    /**
     * Check if a feed is active
     */
    async isFeedActive(relayAddress: string, feedId: string): Promise<{ exists: boolean; active: boolean }> {
        const [exists, active] = await this.contract.isFeedActive(relayAddress, feedId);
        return { exists, active };
    }

    /**
     * Get number of feeds for a relay
     */
    async getRelayFeedCount(relayAddress: string): Promise<number> {
        return Number(await this.contract.getRelayFeedCount(relayAddress));
    }

    /**
     * Get total feeds across all relays
     */
    async getTotalFeeds(): Promise<number> {
        return Number(await this.contract.totalFeeds());
    }
}

/**
 * Oracle packet signer utility
 * 
 * Used by relays to sign oracle data packets for on-chain verification
 */
export class OraclePacketSigner {
    private wallet: Wallet;
    private domain: TypedDataDomain;

    private static readonly TYPES: Record<string, TypedDataField[]> = {
        OraclePacket: [
            { name: 'feedId', type: 'bytes32' },
            { name: 'deadline', type: 'uint256' },
            { name: 'payload', type: 'bytes' },
        ],
    };

    constructor(privateKey: string, chainId: number, oracleContractAddress: string) {
        this.wallet = new Wallet(privateKey);
        this.domain = {
            name: 'ShogunOracle',
            version: '1',
            chainId: chainId,
            verifyingContract: oracleContractAddress,
        };
    }

    /**
     * Get signer address
     */
    getAddress(): string {
        return this.wallet.address;
    }

    /**
     * Encode payload based on schema
     */
    static encodePayload(value: any, schema: string): string {
        const abiCoder = AbiCoder.defaultAbiCoder();

        // Handle common types
        if (schema === '(uint256)' || schema === 'uint256') {
            return abiCoder.encode(['uint256'], [BigInt(value)]);
        }
        if (schema === '(int256)' || schema === 'int256') {
            return abiCoder.encode(['int256'], [BigInt(value)]);
        }
        if (schema === '(string)' || schema === 'string') {
            return abiCoder.encode(['string'], [String(value)]);
        }
        if (schema === '(bool)' || schema === 'bool') {
            return abiCoder.encode(['bool'], [Boolean(value)]);
        }
        if (schema === 'bytes32') {
            return abiCoder.encode(['bytes32'], [value]);
        }

        // Handle JSON
        if (schema.startsWith('{') || schema === 'json') {
            const jsonString = typeof value === 'string' ? value : JSON.stringify(value);
            return abiCoder.encode(['string'], [jsonString]);
        }

        // Handle tuple types
        if (schema.startsWith('(') && Array.isArray(value)) {
            return abiCoder.encode([schema], [value]);
        }

        // Default: encode as bytes
        return abiCoder.encode(['bytes'], [typeof value === 'string' ? value : JSON.stringify(value)]);
    }

    /**
     * Sign an oracle packet
     */
    async signPacket(
        feedName: string,
        value: any,
        schema: string,
        validitySecs: number = 600
    ): Promise<OraclePacket> {
        const feedId = OracleFeedRegistry.computeFeedId(feedName);
        const deadline = Math.floor(Date.now() / 1000) + validitySecs;
        const payload = OraclePacketSigner.encodePayload(value, schema);

        const message = {
            feedId,
            deadline: BigInt(deadline),
            payload,
        };

        const signature = await this.wallet.signTypedData(
            this.domain,
            OraclePacketSigner.TYPES,
            message
        );

        // Split signature
        const r = signature.slice(0, 66);
        const s = '0x' + signature.slice(66, 130);
        const v = parseInt(signature.slice(130, 132), 16);

        return {
            feedId,
            deadline,
            payload,
            signature: { v, r, s },
        };
    }
}
