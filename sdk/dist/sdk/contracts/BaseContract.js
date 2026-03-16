import { Contract } from 'ethers';
import { getContractDeployment } from '../config.js';
/**
 * Base contract class that all contract classes extend
 */
export class BaseContract {
    contract;
    address;
    chainId;
    constructor(provider, signer, chainId, contractName) {
        const deployment = getContractDeployment(chainId, contractName);
        if (!deployment) {
            throw new Error(`Contract ${contractName} not found on chain ${chainId}`);
        }
        this.address = deployment.address;
        this.chainId = chainId;
        this.contract = new Contract(deployment.address, deployment.abi, signer || provider);
    }
    /**
     * Get the contract instance
     */
    getContract() {
        return this.contract;
    }
    /**
     * Get the contract address
     */
    getAddress() {
        return this.address;
    }
    /**
     * Get the chain ID
     */
    getChainId() {
        return this.chainId;
    }
}
