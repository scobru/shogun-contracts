// scripts/leaveRelay.ts
// Hardhat script per permettere a un relay di uscire dal contratto (leave)

import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  // Lettura delle variabili d'ambiente
  const membershipAddr = process.env.MEMBERSHIP_ADDR as string;
  const privateKey = process.env.RELAY_PRIVATE_KEY as string;

  if (!membershipAddr || !privateKey) {
    console.error("Impostare in .env: MEMBERSHIP_ADDR, RELAY_PRIVATE_KEY");
    process.exit(1);
  }

  // Provider e signer
  const provider = ethers.provider;
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log(`Indirizzo relay: ${wallet.address}`);
  console.log(`Contratto membership: ${membershipAddr}`);
  
  // Verifica del saldo di ETH
  const balance = await provider.getBalance(wallet.address);
  console.log(`Saldo del wallet: ${ethers.formatEther(balance)} ETH`);
  
  // Verifica del saldo del contratto
  const contractBalance = await provider.getBalance(membershipAddr);
  console.log(`Saldo del contratto: ${ethers.formatEther(contractBalance)} ETH`);

  // Contract instance
  const membershipAbi = [
    "function leave() external",
    "function relays(address) view returns (uint96 stake, uint256 released)"
  ];
  const membership = new ethers.Contract(membershipAddr, membershipAbi, wallet);

  try {
    // Verifica dello stake attuale
    const relayInfo = await membership.relays(wallet.address);
    console.log(`Stake attuale: ${ethers.formatEther(relayInfo.stake)} ETH`);
    
    if (relayInfo.stake <= 0) {
      console.error("Errore: questo indirizzo non risulta essere un relay attivo");
      process.exit(1);
    }

    // Controlla se il contratto ha abbastanza ETH per restituire lo stake
    if (contractBalance < relayInfo.stake) {
      console.error(`Errore: il contratto ha solo ${ethers.formatEther(contractBalance)} ETH ma deve restituire ${ethers.formatEther(relayInfo.stake)} ETH`);
      process.exit(1);
    }

    // Esecuzione leave con gas limit esplicito
    console.log("Esecuzione leave() in corso...");
    const gasEstimate = await membership.leave.estimateGas();
    console.log(`Gas stimato: ${gasEstimate.toString()}`);
    
    // Aumenta il gas limit del 50% per sicurezza
    const gasLimit = gasEstimate * 150n / 100n;
    
    const tx = await membership.leave({
      gasLimit: gasLimit
    });
    
    console.log(`Transazione inviata: ${tx.hash}`);
    const receipt = await tx.wait();

    console.log("Relay rimosso con successo, tx hash:", receipt.hash);
    console.log("Lo stake è stato restituito all'indirizzo del relay.");
    
    // Verifica finale
    const newBalance = await provider.getBalance(wallet.address);
    console.log(`Nuovo saldo del wallet: ${ethers.formatEther(newBalance)} ETH`);
  } catch (error) {
    console.error("Errore durante l'esecuzione della leave:");
    console.error(error);
    
    // Suggerimenti per risolvere
    console.log("\nSuggerimenti per risolvere questo problema:");
    console.log("1. Verifica che il nodo Hardhat locale sia in esecuzione");
    console.log("2. Prova ad avviare un nuovo nodo Hardhat con 'npx hardhat node'");
    console.log("3. Controlla che il contratto sia stato deployato correttamente");
    console.log("4. Se stai eseguendo su Hardhat, potrebbe essere un problema di configurazione");
    
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
