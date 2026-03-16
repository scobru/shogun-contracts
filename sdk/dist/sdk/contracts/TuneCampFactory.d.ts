import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';
export declare class TuneCampFactory extends BaseContract {
    constructor(provider: Provider, signer: Signer | undefined, chainId: number | string);
    /**
     * Deploy a new TuneCamp instance
     * @param instanceName Human-readable label (e.g. "MyMusicNode").
     * @param baseMetadataURI Base URI for NFT metadata (e.g. "https://mynode.xyz/meta/").
     * @param treasury Address that collects the 15% platform fee.
     */
    deployInstance(instanceName: string, baseMetadataURI: string, treasury: string): Promise<any>;
    /**
     * Get the total number of deployed instances
     */
    instanceCount(): Promise<bigint>;
    /**
     * Get instance details by ID
     */
    getInstance(instanceId: bigint | number): Promise<any>;
    /**
     * Get all instance IDs owned by an admin
     */
    instancesOf(admin: string): Promise<bigint[]>;
    /**
     * Get instance details by NFT address
     */
    getInstanceByNFT(nftAddress: string): Promise<any>;
    /**
     * Update the USDC address (Admin only)
     */
    setUSDC(usdcAddress: string): Promise<any>;
}
//# sourceMappingURL=TuneCampFactory.d.ts.map