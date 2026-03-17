import { DEPLOYMENTS } from './deployments.js';
/**
 * Get contract deployment by chain ID and contract name
 */
export function getContractDeployment(chainId, contractName) {
    const chainIdStr = String(chainId);
    const deployments = DEPLOYMENTS;
    const chainDeployments = deployments[chainIdStr];
    if (!chainDeployments)
        return null;
    // Try different naming patterns (in order of preference)
    const patterns = [
        `TuneCampFactory#${contractName}`, // TuneCamp factory module deployments
        `DeployProtocol#${contractName}`, // Preferred: from deployProtocol module
        `DeployAll#${contractName}`, // Alternative: from deployAll module
        `Stealth#${contractName}`, // Stealth module deployments
        `${contractName}#${contractName}`, // Direct deployment
        `RelayRegistry#${contractName}`, // Legacy: if deployed via RelayRegistry module
        contractName // Fallback: direct name match
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
export function getAvailableChainIds() {
    return Object.keys(DEPLOYMENTS);
}
/**
 * Check if chain ID is supported
 */
export function isChainSupported(chainId) {
    return String(chainId) in DEPLOYMENTS;
}
