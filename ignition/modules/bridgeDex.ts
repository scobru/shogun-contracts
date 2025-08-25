// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const Bridge = buildModule("Bridge", (m) => {
  // Deploy BridgeDex per il bridge cross-chain trustless
  const bridgeDex = m.contract("BridgeDex");

  // Return the main contract instance
  return {
    bridgeDex,
  };
});

export default Bridge;
