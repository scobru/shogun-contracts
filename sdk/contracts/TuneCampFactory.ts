import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';

export class TuneCampFactory extends BaseContract {
  constructor(provider: Provider, signer: Signer | undefined, chainId: number | string) {
    super(provider, signer, chainId, 'TuneCampFactory');
  }

  /**
   * Deploy a new TuneCamp instance
   * @param instanceName Human-readable label (e.g. "MyMusicNode").
   * @param baseMetadataURI Base URI for NFT metadata (e.g. "https://mynode.xyz/meta/").
   * @param treasury Address that collects the 15% platform fee.
   */
  async deployInstance(instanceName: string, baseMetadataURI: string, treasury: string) {
    return await this.contract.deployInstance(instanceName, baseMetadataURI, treasury);
  }

  /**
   * Get the total number of deployed instances
   */
  async instanceCount(): Promise<bigint> {
    return await this.contract.instanceCount();
  }

  /**
   * Get instance details by ID
   */
  async getInstance(instanceId: bigint | number) {
    return await this.contract.getInstance(instanceId);
  }

  /**
   * Get all instance IDs owned by an admin
   */
  async instancesOf(admin: string): Promise<bigint[]> {
    return await this.contract.instancesOf(admin);
  }

  /**
   * Get instance details by NFT address
   */
  async getInstanceByNFT(nftAddress: string) {
    return await this.contract.getInstanceByNFT(nftAddress);
  }

  /**
   * Update the USDC address (Admin only)
   */
  async setUSDC(usdcAddress: string) {
    return await this.contract.setUSDC(usdcAddress);
  }
}
