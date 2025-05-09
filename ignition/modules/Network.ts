// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";

const Network = buildModule("Network", (m) => {
  // hardhat signer
  const oracle = m.contract("OracleBridge");
  // hardhat signer
  const membership = m.contract("RelayMembership", [parseEther("0.01"), oracle]);

  return { oracle, membership };
});

export default Network;
