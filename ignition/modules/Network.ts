// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";

const Network = buildModule("Network", (m) => {
  // Deploy the RelayRegistry with the same owner as other contracts
  const relayRegistry = m.contract("RelayRegistry", [m.getAccount(0)]);
  
  // Deploy an IndividualRelay with parameters
  // Parameters: owner, price, daysPerMonth, url, registryAddress
  const initialRelay = m.contract("IndividualRelay", [
    m.getAccount(0),             // initialOwner (first signer)
    parseEther("0.005"),         // initialPriceWei (0.005 ETH per month)
    30,                          // initialDaysPerMonth
    "http://localhost:8765/gun", // url
    relayRegistry                // registry address
  ]);

  return { relayRegistry, initialRelay };
});

export default Network;
