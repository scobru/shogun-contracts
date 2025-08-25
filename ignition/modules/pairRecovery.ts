// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const Recovery = buildModule("Recovery", (m) => {
  // Deploy PairRecovery per la gestione delle coppie SEA crittografate
  const pairRecovery = m.contract("PairRecovery");

  // Return the main contract instance
  return {
    pairRecovery,
  };
});

export default Recovery;
