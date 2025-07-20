// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";

const StealthAddress = buildModule("StealthAddress", (m) => {
  // Deploy StealthKeyRegistry per la gestione delle chiavi stealth
  const stealthKeyRegistry = m.contract("StealthKeyRegistry");

  const paymentForwarder = m.contract("PayamentForwarder", [
    parseEther("0.001"), // toll (0.001 ETH per transazione)
    m.getAccount(0), // tollCollector (primo signer)
    m.getAccount(0), // tollReceiver (primo signer)
  ]);

  // Configura il toll collector nel PaymentForwarder
  const setTollCollector = m.call(paymentForwarder, "setTollCollector", [
    m.getAccount(0), // Imposta il primo account come toll collector
  ]);

  // Configura il toll receiver nel PaymentForwarder
  const setTollReceiver = m.call(paymentForwarder, "setTollReceiver", [
    m.getAccount(0), // Imposta il primo account come toll receiver
  ]);

  // Return the main contract instances
  return {
     stealthKeyRegistry,
     paymentForwarder,
  };
});

export default StealthAddress;
