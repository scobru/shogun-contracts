import type { ContractDeployment } from './types.js';
/**
 * Get contract deployment by chain ID and contract name
 */
export declare function getContractDeployment(chainId: number | string, contractName: string): ContractDeployment | null;
/**
 * Get all available chain IDs
 */
export declare function getAvailableChainIds(): string[];
/**
 * Check if chain ID is supported
 */
export declare function isChainSupported(chainId: number | string): boolean;
//# sourceMappingURL=config.d.ts.map