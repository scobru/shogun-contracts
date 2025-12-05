import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * StorageDealRegistry Deployment Module
 * 
 * Deploys the StorageDealRegistry contract for managing storage deals
 * between clients and relays. This registry tracks storage agreements
 * and handles griefing for storage-related disputes.
 */

const StorageDealRegistryModule = buildModule("StorageDealRegistry", (m) => {
  // Parameter for the ShogunRelayRegistry address
  // If empty, should be provided via parameters or module dependency
  const registry = m.getParameter("registry", "");

  // Deploy the storage deal registry
  const storageDealRegistry = m.contract("StorageDealRegistry", [
    registry,
  ]);

  return { storageDealRegistry };
});

export default StorageDealRegistryModule;

