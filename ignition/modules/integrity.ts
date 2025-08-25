// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const Security = buildModule("Security", (m) => {
  // Deploy GunDBIntegrity per la verifica dell'integrità dei dati GunDB
  const Integrity = m.contract("Integrity");

  // Return the main contract instance
  return {
    Integrity,
  };
});

export default Security;
