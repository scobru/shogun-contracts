// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OracleBridge = buildModule("OracleBridge", (m) => {

  // hardhat signer
  const oracle = m.contract("OracleBridge");

  return { oracle };
});

export default OracleBridge;
