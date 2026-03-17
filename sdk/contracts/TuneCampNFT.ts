import { Provider, Signer } from 'ethers';
import { BaseContract } from './BaseContract.js';

export enum TokenRole {
  LICENSE = 0,
  OWNERSHIP = 1,
  COLLECTIBLE = 2
}

export class TuneCampNFT extends BaseContract {
  constructor(provider: Provider, signer: Signer | undefined, chainId: number | string) {
    // Note: The TuneCampNFT needs to be instantiated with its proxy address, not the logic address.
    // BaseContract fetches address from config (which holds the logic), but usually users will connect
    // to a specific proxy via `attach(proxyAddress)`.
    super(provider, signer, chainId, 'TuneCampNFT');
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
   * Register a new track (Artist/Admin)
   */
  async registerTrack(
    trackId: bigint | number,
    artist: string,
    maxLicense: bigint | number,
    maxOwnership: bigint | number,
    maxCollectible: bigint | number
  ) {
    return await this.contract.registerTrack(trackId, artist, maxLicense, maxOwnership, maxCollectible);
  }

  /**
   * Mint tokens (Minter only, usually Checkout contract)
   */
  async mint(to: string, trackId: bigint | number, role: TokenRole, amount: bigint | number) {
    return await this.contract.mint(to, trackId, role, amount);
  }

  /**
   * Get the artist of a track
   */
  async trackArtist(trackId: bigint | number): Promise<string> {
    return await this.contract.trackArtist(trackId);
  }

  /**
   * Encode track ID and role into a single token ID
   */
  async encodeTokenId(trackId: bigint | number, role: TokenRole): Promise<bigint> {
    return await this.contract.encodeTokenId(trackId, role);
  }

  /**
   * Decode a token ID into track ID and role
   */
  async decodeTokenId(tokenId: bigint | number): Promise<[bigint, TokenRole]> {
    return await this.contract.decodeTokenId(tokenId);
  }

  /**
   * Get token URI
   */
  async uri(tokenId: bigint | number): Promise<string> {
    return await this.contract.uri(tokenId);
  }

  /**
   * Set custom URI for a token (Admin only)
   */
  async setTokenURI(tokenId: bigint | number, newURI: string) {
    return await this.contract.setTokenURI(tokenId, newURI);
  }

  /**
   * Set base URI (Admin only)
   */
  async setBaseURI(newBaseURI: string) {
    return await this.contract.setBaseURI(newBaseURI);
  }
}
