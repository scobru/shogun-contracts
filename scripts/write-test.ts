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


async function main() {
  // Lettura delle variabili d'ambiente

  const gun = Gun({
    peers: ["http://localhost:8765/gun?token=thisIsTheTokenForReals"], 
    localStorage: false, 
    radisk: false
  });
  console.log("Generazione coppia di chiavi GunDB...");
  let pair = await SEA.pair();
  let pubKey = pair.pub;
  console.log(`Coppia di chiavi generata. Chiave pubblica: ${pubKey}`);


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
        data: "biscottone4"
      };

      gun.user().get('subscription').put(subscriptionData, (ack: GunAck) => {
        if (ack.err) {
          reject(new Error(`Errore salvataggio dati: ${ack.err}`));
        } else {
          console.log(ack)
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