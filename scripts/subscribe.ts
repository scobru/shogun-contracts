// scripts/subscribeUser.ts
// Hardhat script per sottoscrizione utente (subscribe)

import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import Gun from "gun";
import SEA from "gun/sea";

dotenv.config();

// Define GunDB callback types
interface GunAck {
  err?: string;
  ok?: any;
  [key: string]: any;
}

/**
 * Convert Gun SEA public key to hex format needed for the contract
 * @param pubKey Gun SEA format public key
 * @returns Hex string (without 0x prefix)
 */
function gunPubKeyToHex(pubKey: string): string {
  try {
    // Remove the ~ prefix if present
    if (pubKey.startsWith('~')) {
      pubKey = pubKey.substring(1);
    }

    // Remove anything after a . if present (often used in GunDB for separating pub and epub)
    const dotIndex = pubKey.indexOf('.');
    if (dotIndex > 0) {
      pubKey = pubKey.substring(0, dotIndex);
    }

    // Convert from GunDB's URL-safe base64 to standard base64
    const base64Key = pubKey
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if needed
    const padded = base64Key.length % 4 === 0
      ? base64Key
      : base64Key.padEnd(base64Key.length + (4 - (base64Key.length % 4)), '=');
    
    // Convert to binary and then to hex
    const binaryData = Buffer.from(padded, 'base64');
    const hexData = binaryData.toString('hex');
    
    return hexData;
  } catch (error) {
    console.error('Error converting GunDB public key to hex:', error);
    return '';
  }
}

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
  const privateKey = process.env.USER_PRIVATE_KEY as string;

  const gun = Gun({peers: ["http://localhost:8765/gun"], localStorage: false, radisk: false});

  console.log("Generazione coppia di chiavi GunDB...");
  let pair = await SEA.pair();
  let pubKey = pair.pub;
  console.log(`Coppia di chiavi generata. Chiave pubblica: ${pubKey}`);

  if (!membershipAddr || !privateKey) {
    console.error("Impostare in .env: MEMBERSHIP_ADDR, USER_PRIVATE_KEY, SUBSCRIBE_MONTHS");
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

    // Converti la pubKey di Gun in formato hex per il contratto
    console.log("Conversione della chiave pubblica per il contratto...");
    const hexPubKey = gunPubKeyToHex(pubKey);
    console.log(`Chiave pubblica convertita: 0x${hexPubKey.substring(0, 20)}...`);
    
    // Converte da hex a bytes per il contratto
    const pubkeyBytes = hexToBytes(hexPubKey);
    console.log(`Inviando chiave pubblica di ${pubkeyBytes.length} bytes al contratto`);

    const tx = await membership.subscribe(months, pubkeyBytes, { value: total });
    const receipt = await tx.wait();

    console.log("Subscribe eseguita, tx hash:", receipt.hash);
  } catch (error) {
    console.error("Errore durante l'interazione con il contratto:");
    console.error(error);
    process.exit(1);
  }

  // Adesso aggiungiamo l'autenticazione a Gun in modo corretto
  console.log("Autenticazione in Gun...");
  try {
    // Prima eseguiamo la creazione utente se non esiste già
    try {
      await new Promise((resolve, reject) => {
        gun.user().create(pair.pub, pair.priv, (ack: GunAck) => {
          if (ack.err && !ack.err.includes('already created')) {
            console.warn("Errore nella creazione utente:", ack.err);
          }
          resolve(ack);
        });
      });
    } catch (err) {
      console.log("Utente probabilmente già esistente, procediamo con login");
    }

    // Eseguiamo la login includendo il pair completo
    await new Promise((resolve, reject) => {
      gun.user().auth(pair, (ack: GunAck) => {
        if (ack.err) {
          reject(new Error(`Errore login: ${ack.err}`));
        } else {
          console.log("Login a Gun effettuato con successo");
          resolve(ack);
        }
      });
    });

    // Salvare i dati in Gun
    await new Promise((resolve, reject) => {
      // Includi il timestamp per rendere più chiaro quando è avvenuta la sottoscrizione
      const subscriptionData = {
        data: "test",
        timestamp: Date.now(),
        address: wallet.address,
        months: months
      };

      gun.user().get('subscription').put(subscriptionData, (ack: GunAck) => {
        if (ack.err) {
          reject(new Error(`Errore salvataggio dati: ${ack.err}`));
        } else {
          console.log("Subscription saved in gun");
          resolve(ack);
        }
      });
    });

    console.log("Sincronizzazione dati completata");
  } catch (error) {
    console.error("Errore durante l'interazione con Gun:");
    console.error(error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});