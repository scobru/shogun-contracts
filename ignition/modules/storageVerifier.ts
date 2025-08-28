// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const StorageVerifier = buildModule("StorageVerifier", (m) => {
  // Deploy StorageVerifier con l'indirizzo del RelayPaymentRouter
  // L'indirizzo del RelayPaymentRouter deve essere fornito come parametro di deployment
  const storageVerifier = m.contract("StorageVerifier", [
    "0x4B1F3B4D398068F48789285Ce7215B54eCf27d6a", // relayPaymentRouter address - da aggiornare con l'indirizzo reale
  ]);

  // Return the main contract instances
  return {
    storageVerifier,
  };
});

export default StorageVerifier;
