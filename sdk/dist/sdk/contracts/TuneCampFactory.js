import { BaseContract } from './BaseContract.js';
export class TuneCampFactory extends BaseContract {
    constructor(provider, signer, chainId) {
        super(provider, signer, chainId, 'TuneCampFactory');
    }
    /**
     * Deploy a new TuneCamp instance
     * @param instanceName Human-readable label (e.g. "MyMusicNode").
     * @param baseMetadataURI Base URI for NFT metadata (e.g. "https://mynode.xyz/meta/").
     * @param treasury Address that collects the 15% platform fee.
     */
    async deployInstance(instanceName, baseMetadataURI, treasury) {
        return await this.contract.deployInstance(instanceName, baseMetadataURI, treasury);
    }
    /**
     * Get the total number of deployed instances
     */
    async instanceCount() {
        return await this.contract.instanceCount();
    }
    /**
     * Get instance details by ID
     */
    async getInstance(instanceId) {
        return await this.contract.getInstance(instanceId);
    }
    /**
     * Get all instance IDs owned by an admin
     */
    async instancesOf(admin) {
        return await this.contract.instancesOf(admin);
    }
    /**
     * Get instance details by NFT address
     */
    async getInstanceByNFT(nftAddress) {
        return await this.contract.getInstanceByNFT(nftAddress);
    }
    /**
     * Update the USDC address (Admin only)
     */
    async setUSDC(usdcAddress) {
        return await this.contract.setUSDC(usdcAddress);
    }
}
