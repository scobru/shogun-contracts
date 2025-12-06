import { Contract, Signer, Provider } from 'ethers';
import { getContractDeployment } from '../config.js';
import type { IContract } from '../types.js';

/**
 * Base contract class that all contract classes extend
 */
export class BaseContract implements IContract {
  protected contract: Contract;
  protected address: string;
  protected chainId: number | string;

  constructor(
    provider: Provider,
    signer: Signer | undefined,
    chainId: number | string,
    contractName: string
  ) {
    const deployment = getContractDeployment(chainId, contractName);
    
    if (!deployment) {
      throw new Error(
        `Contract ${contractName} not found on chain ${chainId}`
      );
    }

    this.address = deployment.address;
    this.chainId = chainId;
    this.contract = new Contract(
      deployment.address,
      deployment.abi,
      signer || provider
    );
  }

  /**
   * Get the contract instance
   */
  getContract(): Contract {
    return this.contract;
  }

  /**
   * Get the contract address
   */
  getAddress(): string {
    return this.address;
  }

  /**
   * Get the chain ID
   */
  getChainId(): number | string {
    return this.chainId;
  }
}

