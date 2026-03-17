import { DEPLOYMENTS } from './deployments.js';
import type { NetworkConfig, ContractDeployment } from './types.js';

/**
 * Get contract deployment by chain ID and contract name
 */
export function getContractDeployment(
  chainId: number | string,
  contractName: string
): ContractDeployment | null {
  const chainIdStr = String(chainId);
  const deployments = DEPLOYMENTS as unknown as Record<string, Record<string, { address: string; abi: readonly any[] }>>;
  const chainDeployments = deployments[chainIdStr];
  if (!chainDeployments) return null;

  // Try different naming patterns (in order of preference)
  const patterns = [
    `TuneCampFactory#${contractName}`, // TuneCamp factory module deployments
    `DeployProtocol#${contractName}`, // Preferred: from deployProtocol module
    `DeployAll#${contractName}`,      // Alternative: from deployAll module
    `Stealth#${contractName}`,        // Stealth module deployments
    `${contractName}#${contractName}`, // Direct deployment
    `RelayRegistry#${contractName}`,   // Legacy: if deployed via RelayRegistry module
    contractName                       // Fallback: direct name match
  ];

  for (const pattern of patterns) {
    const deployment = chainDeployments[pattern];
    if (deployment && deployment.address && deployment.abi) {
      return {
        address: deployment.address,
        abi: deployment.abi
      };
    }
  }

  return null;
}

/**
 * Get all available chain IDs
 */
export function getAvailableChainIds(): string[] {
  return Object.keys(DEPLOYMENTS as Record<string, unknown>);
}

/**
 * Check if chain ID is supported
 */
export function isChainSupported(chainId: number | string): boolean {
  return String(chainId) in (DEPLOYMENTS as Record<string, unknown>);
}
