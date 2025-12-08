import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * GunL2Bridge Deployment Module
 * 
 * Deploys the GunL2Bridge contract for trustless L2 bridge functionality.
 * The bridge allows deposits from L1 (Ethereum/Base) to L2 (GunDB) and
 * verifiable withdrawals using Merkle proofs.
 * 
 * Architecture:
 * - Requires ShogunRelayRegistry to verify registered relays
 * - Optional sequencer: if zero address, any registered relay can submit batches
 * - If sequencer is set, only that address can submit batches
 * 
 * Usage:
 * - Standalone with existing registry (REQUIRED): 
 *   npx hardhat ignition deploy ignition/modules/gunL2Bridge.ts --network baseSepolia --parameters '{"GunL2Bridge":{"relayRegistry":"0x..."}}'
 * - With module: Use in deployAll.ts or deployProtocol.ts (uses RelayRegistry from module)
 */

const GunL2BridgeModule = buildModule("GunL2Bridge", (m) => {
  // Parameter for the ShogunRelayRegistry address
  // Default: Base Sepolia deployed address (can be overridden via --parameters)
  // When used in deployAll/deployProtocol, the address is passed directly
  const relayRegistry = m.getParameter(
    "relayRegistry", 
    "0xf5D5561C84B4Dc8676D4223AF3188d40DA42669B" // Base Sepolia RelayRegistry (default, can be overridden)
  );

  // Optional sequencer address
  // If zero address (default), any registered relay can submit batches
  // If set to a specific address, only that address can submit batches
  const sequencer = m.getParameter("sequencer", "0xA6591dCDff5C7616110b4f84207184aef7835048");

  // Deploy the bridge
  const gunL2Bridge = m.contract("GunL2Bridge", [
    relayRegistry,
    sequencer,
  ]);

  return { gunL2Bridge };
});

export default GunL2BridgeModule;
