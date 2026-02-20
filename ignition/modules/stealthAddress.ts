import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";

const Stealth = buildModule("Stealth", (m) => {
  const deployer = m.getAccount(0);

  // Deploy StealthKeyRegistry (senza argomenti)
  const stealthKeyRegistry = m.contract("StealthKeyRegistry");

  // Deploy PaymentForwarder (imposta tutto nel costruttore)
  const paymentForwarder = m.contract("PaymentForwarder", [
    parseEther("0.001"), // toll
    deployer,            // tollCollector
    deployer,            // tollReceiver
  ]);

  return {
    stealthKeyRegistry,
    paymentForwarder,
  };
});

export default Stealth;