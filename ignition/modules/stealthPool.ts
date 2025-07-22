// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";

const StealthPool = buildModule("StealthPool", (m) => {
  // Deploy MerkleTreeManager per gestire i Merkle tree e le proof
  const merkleTreeManager = m.contract("MerkleTreeManager");

  // Deploy StealthPool con parametri configurabili
  const stealthPool = m.contract("StealthPool", [
    parseEther("1.0"), // depositAmount: 1 ETH per deposito
    m.getAccount(0), // merkleManager: primo signer come merkle manager
  ]);

  // Configura il merkle manager nel StealthPool (opzionale, già fatto nel costruttore)
  // m.call(stealthPool, "setMerkleManager", [m.getAccount(0)]);

  // Return the main contract instances
  return {
    merkleTreeManager,
    stealthPool,
  };
});

export default StealthPool;
