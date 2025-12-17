import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * OracleFeedRegistry Deployment Module
 * 
 * Deploys the OracleFeedRegistry contract for managing oracle data feeds.
 * Relays can register data feeds with pricing and schema information.
 * 
 * Prerequisites:
 * - ShogunRelayRegistry must be deployed first
 * 
 * Usage:
 *   npx hardhat ignition deploy ignition/modules/oracleFeedRegistry.ts --network baseSepolia
 */

// Known ShogunRelayRegistry addresses per network
const RELAY_REGISTRY_ADDRESSES: { [chainId: number]: string } = {
    84532: "0x8B88258923bad2d634e533Cb6405d4022CfF320f", // Base Sepolia
    8453: "",  // Base Mainnet (TBD)
};

const OracleFeedRegistryModule = buildModule("OracleFeedRegistry", (m) => {
    // Get relay registry address from environment or use known address
    const relayRegistryAddress = m.getParameter(
        "relayRegistry",
        process.env.RELAY_REGISTRY_ADDRESS || RELAY_REGISTRY_ADDRESSES[84532]
    );

    // Deploy OracleFeedRegistry with relay registry dependency
    const oracleFeedRegistry = m.contract("OracleFeedRegistry", [relayRegistryAddress]);

    return { oracleFeedRegistry };
});

export default OracleFeedRegistryModule;
