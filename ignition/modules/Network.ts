// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";

const Network = buildModule("Network", (m) => {
  // Deploy the Registry
  const registry = m.contract("Registry", [
    m.getAccount(0),             // initialOwner (first signer)
    true                         // registrationOpen (start with open registration)
  ]);
  
  // Deploy a Relay
  const relay = m.contract("Relay", [
    m.getAccount(0),             // initialOwner (first signer)
    parseEther("0.005"),         // initialPriceWei (0.005 ETH per month)
    30,                          // initialDaysPerMonth
    "http://localhost:8765/gun"  // url
  ]);

  // Deploy EntryPoint that connects the Registry with Relays
  const entryPoint = m.contract("EntryPoint", [
    registry,                    // registry address
    m.getAccount(0),             // initialOwner (first signer)
    250                          // initialFeePercentage (2.5% = 250 in base 10000)
  ]);

  // Register the relay in the registry
  const registerRelay = m.call(registry, "registerRelay", [
    relay,                       // relay address
    "http://localhost:8765/gun", // url
    "{\"name\":\"Local Test Relay\",\"description\":\"A local relay for testing\"}" // metadata
  ]);

  // Configure the relay to use the Registry
  const setRegistryInRelay = m.call(relay, "setRegistry", [
    registry,                    // registry address
    false,                       // autoRegister (we already registered it manually)
    ""                           // no additional metadata needed
  ]);

  // Configure the relay with EntryPoint and enable PROTOCOL mode
  const setEntryPointInRelay = m.call(relay, "setEntryPoint", [
    entryPoint,                  // entryPoint address
    true                         // enableProtocolMode
  ]);
  
  // Optional: Update relay configuration for better UX
  const setDaysPerMonth = m.call(relay, "setDaysPerMonth", [
    28                           // 28 days per month (more consistent across months)
  ]);
  
  // Return the main contract instances
  return { registry, relay, entryPoint };
});

export default Network;
