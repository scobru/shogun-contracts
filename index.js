/**
 * Shogun Contracts Package
 * 
 * Centralized exports for contract addresses, ABIs, and configuration.
 */

export { CONTRACTS_CONFIG, getConfigByChainId, getConfigByNetwork } from './contracts-config.js';

// Import deployments to extract ABIs
import { DEPLOYMENTS } from './deployments.js';

/**
 * Get contract ABI by chain ID and contract name
 * @param {number} chainId - Chain ID
 * @param {string} contractName - Contract name (e.g., "ShogunRelayRegistry", "StorageDealRegistry")
 * @returns {Array|null} Contract ABI or null if not found
 */
export function getContractABI(chainId, contractName) {
  const chainDeployments = DEPLOYMENTS[String(chainId)];
  if (!chainDeployments) return null;

  // Try different naming patterns
  const patterns = [
    `${contractName}#${contractName}`,
    `RelayRegistry#${contractName}`,
    `DeployProtocol#${contractName}`,
    contractName
  ];

  for (const pattern of patterns) {
    const deployment = chainDeployments[pattern];
    if (deployment && deployment.abi) {
      return deployment.abi;
    }
  }

  return null;
}

/**
 * Get contract address by chain ID and contract name
 * @param {number} chainId - Chain ID
 * @param {string} contractName - Contract name
 * @returns {string|null} Contract address or null if not found
 */
export function getContractAddress(chainId, contractName) {
  const chainDeployments = DEPLOYMENTS[String(chainId)];
  if (!chainDeployments) return null;

  const patterns = [
    `${contractName}#${contractName}`,
    `RelayRegistry#${contractName}`,
    `DeployProtocol#${contractName}`,
    contractName
  ];

  for (const pattern of patterns) {
    const deployment = chainDeployments[pattern];
    if (deployment && deployment.address) {
      return deployment.address;
    }
  }

  return null;
}

// Export commonly used ABIs as convenience functions
export function getShogunRelayRegistryABI(chainId) {
  return getContractABI(chainId, 'ShogunRelayRegistry');
}

export function getStorageDealRegistryABI(chainId) {
  return getContractABI(chainId, 'StorageDealRegistry');
}

export function getDataPostRegistryABI(chainId) {
  return getContractABI(chainId, 'DataPostRegistry');
}

export function getDataSaleEscrowFactoryABI(chainId) {
  return getContractABI(chainId, 'DataSaleEscrowFactory');
}

// Export minimal ERC20 ABI (commonly used for USDC)
export const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
];

// Export USDC EIP-3009 ABI (for transferWithAuthorization)
export const USDC_EIP3009_ABI = [
  {
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'validAfter', type: 'uint256' },
      { name: 'validBefore', type: 'uint256' },
      { name: 'nonce', type: 'bytes32' },
      { name: 'v', type: 'uint8' },
      { name: 'r', type: 'bytes32' },
      { name: 's', type: 'bytes32' },
    ],
    name: 'transferWithAuthorization',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
];

// Export all deployments for advanced usage
export { DEPLOYMENTS };

