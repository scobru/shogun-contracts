import { Contract, Signer, Provider } from 'ethers';
/**
 * Network configuration
 */
export interface NetworkConfig {
    chainId: number;
    relayRegistry?: string | null;
    storageDealRegistry?: string | null;
    dataPostRegistry?: string | null;
    dataSaleEscrowFactory?: string | null;
    gunL2Bridge?: string | null;
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
//# sourceMappingURL=types.d.ts.map