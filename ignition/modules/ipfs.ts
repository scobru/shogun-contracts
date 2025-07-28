// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const IPFS = buildModule("IPFS", (m) => {
  // Deploy IPCMFactory per la gestione delle istanze IPCM
  const IPCMFactory = m.contract("IPCMFactory", [m.getAccount(0)]);

  // Return the main contract instance
  return {
    IPCMFactory,
  };
});

export default IPFS; 