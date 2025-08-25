// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const Database = buildModule("Database", (m) => {
  // Deploy GunOnChain per la gestione del database distribuito
  const Chain = m.contract("Chain", [m.getAccount(0)]);

  // Return the main contract instance
  return {
    Chain,
  };
});

export default Database; 