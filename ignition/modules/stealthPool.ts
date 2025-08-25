// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";

const Stealth = buildModule("Stealth", (m) => {
  // Deploy MerkleTreeManager per gestire i Merkle tree e le proof (opzionale, ora integrato in StealthPool)

  // Deploy StealthPool con il nuovo costruttore semplificato
  // Ora auto-genera la Merkle root e non ha bisogno di merkleManager
  const stealthPool = m.contract("StealthPool", [
    parseEther("0.001"), // depositAmount: 0.001 ETH per deposito
  ]);

  // Return the main contract instances
  return {
    stealthPool,
  };
});

export default Stealth;
