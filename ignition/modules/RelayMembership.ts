// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";

const RelayMembership = buildModule("RelayMembership", (m) => {
  const pricePerMonth = parseEther("0.01");
  const oracle = "0x95401dc811bb5740090279Ba06cfA8fcF6113778";

  // hardhat signer
  const membership = m.contract("RelayMembership", [pricePerMonth, oracle]);

  return { membership };
});

export default RelayMembership;
