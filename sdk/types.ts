import { Contract, Signer, Provider } from 'ethers';

/**
 * Network configuration
 */
export interface NetworkConfig {
  chainId: number;
  relayRegistry?: string;
  storageDealRegistry?: string;
  dataPostRegistry?: string;
  dataSaleEscrowFactory?: string;
  usdc?: string;
  rpc: string;
  explorer: string;
}

/**
 * SDK configuration options
 */
export interface SDKConfig {
  provider: Provider;
  signer?: Signer;
  chainId: number | string;
}

/**
 * Contract deployment info
 */
export interface ContractDeployment {
  address: string;
  abi: readonly any[];
}

/**
 * Base contract interface
 */
export interface IContract {
  getContract(): Contract;
  getAddress(): string;
}

