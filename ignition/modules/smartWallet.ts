// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SmartWalletModule = buildModule("SmartWallet", (m) => {
  // Deploy SmartWalletFactory
  const smartWalletFactory = m.contract("SmartWalletFactory");

  // Return the main contract instance
  return {
    smartWalletFactory,
  };
});

export default SmartWalletModule;
