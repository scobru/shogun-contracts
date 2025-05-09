// scripts/subscribeUser.ts
// Hardhat script per sottoscrizione utente (subscribe)

import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

// Funzione per convertire stringa hex in bytes
function hexToBytes(hexString: string): Uint8Array {
  // Se è già nel formato 0x, rimuovi il prefisso
  const hex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
  // Se è una stringa vuota o solo "0x", restituisci un array vuoto
  if (hex === '') return new Uint8Array(0);
  
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const byte = parseInt(hex.substr(i * 2, 2), 16);
    bytes[i] = byte;
  }
  return bytes;
}

async function main() {
  // Lettura delle variabili d'ambiente
  const membershipAddr = process.env.MEMBERSHIP_ADDR as string;
  const months = parseInt(process.env.SUBSCRIBE_MONTHS || "1");
  const pubKey = process.env.USER_PUBKEY as string || "0x";
  const privateKey = process.env.USER_PRIVATE_KEY as string;

  if (!membershipAddr || !privateKey) {
    console.error("Impostare in .env: MEMBERSHIP_ADDR, USER_PRIVATE_KEY, SUBSCRIBE_MONTHS, USER_PUBKEY");
    process.exit(1);
  }

  console.log(`Usando contratto all'indirizzo: ${membershipAddr}`);

  // Provider e signer
  const provider = ethers.provider;
  const wallet = new ethers.Wallet(privateKey, provider);


  // Contract instance
  const membershipAbi = [
    "function pricePerMonth() view returns (uint256)",
    "function subscribe(uint256 months, bytes calldata pubKey) external payable"
  ];
  const membership = new ethers.Contract(membershipAddr, membershipAbi, wallet);

  try {
    // Calcola il valore da inviare
    console.log("Tentativo di lettura del prezzo per mese...");
    const price: bigint = await membership.pricePerMonth();
    const total: bigint = price * BigInt(months);

    console.log(`Sottoscrizione per ${months} mese(i), totale: ${ethers.formatEther(total)} ETH`);

    const pubkeyBytes = hexToBytes(pubKey);
    const tx = await membership.subscribe(months, pubkeyBytes, { value: total });
    const receipt = await tx.wait();

    console.log("Subscribe eseguita, tx hash:", receipt.hash);
  } catch (error) {
    console.error("Errore durante l'interazione con il contratto:");
    console.error(error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});