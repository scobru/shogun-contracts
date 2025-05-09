// scripts/subscribeUser.ts
// Hardhat script per sottoscrizione utente (subscribe)

import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  // Lettura delle variabili d'ambiente
  const membershipAddr = process.env.MEMBERSHIP_ADDR as string;
  const months = parseInt(process.env.SUBSCRIBE_MONTHS || "1");
  const pubKey = process.env.USER_PUBKEY as string || "0x";
  const privateKey = process.env.USER_PRIVATE_KEY as string;

  const signer = (await ethers.getSigners())[0];


 /*  if (!membershipAddr || !privateKey) {
    console.error("Impostare in .env: MEMBERSHIP_ADDR, USER_PRIVATE_KEY, SUBSCRIBE_MONTHS, USER_PUBKEY");
    process.exit(1);
  } */

  // Provider e signer
  const provider = ethers.provider;
  const wallet = signer || new ethers.Wallet(privateKey, provider);

  // Contract instance
  const membershipAbi = [
    "function pricePerMonth() view returns (uint256)",
    "function subscribe(uint256 months, bytes calldata pubKey) external payable"
  ];
  const membership = new ethers.Contract(membershipAddr, membershipAbi, wallet);

  // Calcola il valore da inviare
  const price: bigint = await membership.pricePerMonth();
  const total: bigint = price * BigInt(months);

  console.log(`Sottoscrizione per ${months} mese(i), totale: ${ethers.formatEther(total)} ETH`);
  const tx = await membership.subscribe(months, pubKey, { value: total });
  const receipt = await tx.wait();

  console.log("Subscribe eseguita, tx hash:", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});