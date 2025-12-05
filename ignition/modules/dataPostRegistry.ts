import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * DataPostRegistry Deployment Module
 * 
 * Deploys the DataPostRegistry contract for managing data posts on-chain.
 * This registry allows sellers to publish, update, and manage their data listings.
 */

const DataPostRegistryModule = buildModule("DataPostRegistry", (m) => {
  // Deploy the registry (no constructor parameters)
  const dataPostRegistry = m.contract("DataPostRegistry");

  return { dataPostRegistry };
});

export default DataPostRegistryModule;

