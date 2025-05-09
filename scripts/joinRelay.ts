// scripts/joinRelay.ts
// Hardhat script per registrare un relay sul contratto (join)

import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  // Lettura delle variabili d'ambiente
  const membershipAddr = process.env.MEMBERSHIP_ADDR as string;
  const relayUrl =  process.env.RELAY_URL ||"http://localhost:8765/gun " //process.env.RELAY_URL as string;
  const stakeEth = process.env.RELAY_STAKE_ETH || "1.0";
  const privateKey = process.env.RELAY_PRIVATE_KEY as string;

  const signer = (await ethers.getSigners())[1];


  /* if (!membershipAddr || !relayUrl || !privateKey) {
    console.error("Impostare in .env: MEMBERSHIP_ADDR, RELAY_URL, RELAY_PRIVATE_KEY, RELAY_STAKE_ETH");
    process.exit(1);
  } */

  // Provider e signer
  const provider = ethers.provider;
  const wallet = signer  || new ethers.Wallet(privateKey, provider);

  // Contract instance
  const membershipAbi = [
    "function join(string calldata url) external payable"
  ];
  const membership = new ethers.Contract(membershipAddr, membershipAbi, wallet);

  // Esecuzione join
  const stakeWei = ethers.parseEther(stakeEth);
  console.log(`Invio join(${relayUrl}) con stake ${stakeEth} ETH...`);
  const tx = await membership.join(relayUrl, { value: stakeWei });
  const receipt = await tx.wait();

  console.log("Relay registrato, tx hash:", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});