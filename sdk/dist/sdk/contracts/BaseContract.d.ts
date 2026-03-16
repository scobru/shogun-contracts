import { Contract, Signer, Provider } from 'ethers';
import type { IContract } from '../types.js';
/**
 * Base contract class that all contract classes extend
 */
export declare class BaseContract implements IContract {
    protected contract: Contract;
    protected address: string;
    protected chainId: number | string;
    constructor(provider: Provider, signer: Signer | undefined, chainId: number | string, contractName: string);
    /**
     * Get the contract instance
     */
    getContract(): Contract;
    /**
     * Get the contract address
     */
    getAddress(): string;
    /**
     * Get the chain ID
     */
    getChainId(): number | string;
}
//# sourceMappingURL=BaseContract.d.ts.map