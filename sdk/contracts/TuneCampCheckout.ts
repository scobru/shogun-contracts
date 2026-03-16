import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';
import { TokenRole } from './TuneCampNFT.js';

export class TuneCampCheckout extends BaseContract {
  constructor(provider: Provider, signer: Signer | undefined, chainId: number | string) {
    super(provider, signer, chainId, 'TuneCampCheckout');
  }

  /**
   * Get the actual ethers.Contract with a specific proxy address
   */
  attach(address: string) {
    const ContractFactory = Object.getPrototypeOf(this.contract).constructor;
    this.contract = new ContractFactory(address, this.contract.interface, this.contract.runner);
    this.address = address;
    return this;
  }

  /**
   * Purchase NFT with USDC
   */
  async purchaseWithUSDC(trackId: bigint | number, role: TokenRole, quantity: bigint | number) {
    return await this.contract.purchaseWithUSDC(trackId, role, quantity);
  }

  /**
   * Purchase NFT with ETH
   */
  async purchaseWithETH(trackId: bigint | number, role: TokenRole, quantity: bigint | number, value: bigint) {
    return await this.contract.purchaseWithETH(trackId, role, quantity, { value });
  }

  /**
   * Set price for a specific track and role (Admin only)
   */
  async setPrice(trackId: bigint | number, role: TokenRole, priceUSDC: bigint, priceETH: bigint) {
    return await this.contract.setPrice(trackId, role, priceUSDC, priceETH);
  }

  /**
   * Batch set prices (Admin only)
   */
  async setPriceBatch(trackIds: (bigint | number)[], roles: TokenRole[], pricesUSDC: bigint[], pricesETH: bigint[]) {
    return await this.contract.setPriceBatch(trackIds, roles, pricesUSDC, pricesETH);
  }

  /**
   * Set Pro artist status (Admin only)
   */
  async setProArtist(artist: string, status: boolean) {
    return await this.contract.setProArtist(artist, status);
  }

  /**
   * Update treasury address (Admin only)
   */
  async setTreasury(treasury: string) {
    return await this.contract.setTreasury(treasury);
  }

  /**
   * Preview split for a purchase
   */
  async previewSplit(total: bigint, artist: string): Promise<[bigint, bigint]> {
    return await this.contract.previewSplit(total, artist);
  }

  /**
   * Check if artist is Pro
   */
  async isProArtist(artist: string): Promise<boolean> {
    return await this.contract.isProArtist(artist);
  }
}
