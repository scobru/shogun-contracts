// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PaymentRouter = buildModule("PaymentRouter", (m) => {
  // Deploy RelayPaymentRouter per la gestione dei relay e sottoscrizioni
  const relayPaymentRouter = m.contract("RelayPaymentRouter");

  // Registra un relay di test nel RelayPaymentRouter
  const registerTestRelay = m.call(
    relayPaymentRouter,
    "registerRelay",
    [
      "https://ruling-mastodon-improved.ngrok-free.app/gun", // URL del relay di test
    ],
    {
      from: m.getAccount(0), // Usa il secondo account come relay
    }
  );

  // Return the main contract instances
  return {
    relayPaymentRouter,
  };
});

export default PaymentRouter;
