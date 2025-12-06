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

  // Try different naming patterns
  const patterns = [
    `${contractName}#${contractName}`,
    `RelayRegistry#${contractName}`,
    `DeployProtocol#${contractName}`,
    `Stealth#${contractName}`,
    `Recovery#${contractName}`,
    `Security#${contractName}`,
    `Relay#${contractName}`,
    `Bridge#${contractName}`,
    `Database#${contractName}`,
    `IPFS#${contractName}`,
    `HashLayer#${contractName}`,
    contractName
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

