// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";

const Network = buildModule("Network", (m) => {
  // Deploy the RelayRegistry with the updated parameters
  const relayRegistry = m.contract("RelayRegistry", [
    m.getAccount(0),             // initialOwner (first signer)
    parseEther("0.005"),         // initialPrice (0.005 ETH per month)
    10,                          // feePercentage (10%)
    parseEther("0.1")            // minStake (0.1 ETH)
  ]);
  
  // Deploy an IndividualRelay with updated parameters (no registry in constructor)
  const initialRelay = m.contract("IndividualRelay", [
    m.getAccount(0),             // initialOwner (first signer)
    parseEther("0.005"),         // initialPriceWei (0.005 ETH per month)
    30,                          // initialDaysPerMonth
    "http://localhost:8765/gun"  // url
  ]);

  // Additional steps to set up the relay with registry and stake
  const addStake = m.call(initialRelay, "addStake", [], { value: parseEther("0.2") });
  const setRegistry = m.call(initialRelay, "setRegistryAddress", [relayRegistry], { after: [addStake] });

  return { relayRegistry, initialRelay };
});

export default Network;
