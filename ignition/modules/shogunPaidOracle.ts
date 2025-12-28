import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * ShogunPaidOracle Deployment Module
 * 
 * Deploys the ShogunPaidOracle contract - oracle with on-chain payment.
 * 
 * Prerequisites:
 * - ShogunRelayRegistry must be deployed
 * - OracleFeedRegistry must be deployed
 * 
 * Usage:
 *   npx hardhat ignition deploy ignition/modules/shogunPaidOracle.ts --network baseSepolia
 */

// Known contract addresses per network
const ADDRESSES: { [chainId: number]: { relayRegistry: string; feedRegistry: string } } = {
    84532: {
        relayRegistry: "0x412D3Cf47907C231EE26D261714D2126eb3735e6",
        feedRegistry: "0x0f3349A2A0d876e4e6bbf0B79ACBe59e65E0D9E4",
    },
    8453: {
        relayRegistry: "",
        feedRegistry: "",
    },
};

const ShogunPaidOracleModule = buildModule("ShogunPaidOracle", (m) => {
    // Get addresses from parameters or use known addresses
    const relayRegistry = m.getParameter(
        "relayRegistry",
        process.env.RELAY_REGISTRY_ADDRESS || ADDRESSES[84532].relayRegistry
    );

    const feedRegistry = m.getParameter(
        "feedRegistry",
        process.env.ORACLE_FEED_REGISTRY_ADDRESS || ADDRESSES[84532].feedRegistry
    );

    // Deploy ShogunPaidOracle
    const shogunPaidOracle = m.contract("ShogunPaidOracle", [relayRegistry, feedRegistry]);

    return { shogunPaidOracle };
});

export default ShogunPaidOracleModule;
