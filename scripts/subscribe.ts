// scripts/subscribeUser.ts
// Hardhat script per sottoscrizione utente (subscribe)

import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import Gun from "gun";
import SEA from "gun/sea";
import axios from "axios";

import localDeployments from "../ignition/deployments/chain-11155420/deployed_addresses.json";

// Define the type for deployment addresses to avoid implicit any errors
interface DeploymentAddresses {
  "Protocol#Registry": string;
  "Protocol#Relay": string;
  "Protocol#EntryPoint": string;
  [key: string]: string; // Allow for additional contract names
}

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
    if (pubKey.startsWith("~")) {
      pubKey = pubKey.substring(1);
    }

    // Remove anything after a . if present (often used in GunDB for separating pub and epub)
    const dotIndex = pubKey.indexOf(".");
    if (dotIndex > 0) {
      pubKey = pubKey.substring(0, dotIndex);
    }

    // Log originale per debug
    console.log(`Chiave pubblica ripulita: ${pubKey}`);

    // Convert from GunDB's URL-safe base64 to standard base64
    const base64Key = pubKey.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding if needed
    const padded =
      base64Key.length % 4 === 0
        ? base64Key
        : base64Key.padEnd(
            base64Key.length + (4 - (base64Key.length % 4)),
            "="
          );

    console.log(`Chiave base64 padded: ${padded}`);

    // Convert to binary and then to hex
    const binaryData = Buffer.from(padded, "base64");
    const hexData = binaryData.toString("hex");

    // Log per debug
    console.log(`Lunghezza buffer binario: ${binaryData.length} bytes`);
    console.log(`Lunghezza hex risultante: ${hexData.length} caratteri`);

    return hexData;
  } catch (error) {
    console.error("Error converting GunDB public key to hex:", error);
    return "";
  }
}

// Funzione per convertire stringa hex in bytes
function hexToBytes(hexString: string): Uint8Array {
  // Se è già nel formato 0x, rimuovi il prefisso
  const hex = hexString.startsWith("0x") ? hexString.slice(2) : hexString;
  // Se è una stringa vuota o solo "0x", restituisci un array vuoto
  if (hex === "") return new Uint8Array(0);

  // Assicurati che la lunghezza sia pari (ogni byte sono 2 caratteri hex)
  const evenHex = hex.length % 2 === 0 ? hex : "0" + hex;

  const bytes = new Uint8Array(evenHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const byte = parseInt(evenHex.substr(i * 2, 2), 16);
    bytes[i] = byte;
  }

  // Log per debug
  console.log(`Lunghezza bytes: ${bytes.length}`);
  if (bytes.length > 0) {
    console.log(`Primo byte: ${bytes[0]}, Ultimo byte: ${bytes[bytes.length - 1]}`);
  }

  return bytes;
}

/**
 * Pre-authorize a public key with the relay server
 * @param pubKey The Gun public key to authorize
 * @returns {Promise<boolean>} True if authorization was successful
 */
async function preAuthorizeKey(pubKey: string): Promise<{success: boolean, token?: string}> {
  try {
    console.log(`Pre-authorizing key with relay server: ${pubKey}`);

    // Prima richiesta per ottenere un token JWT con verifica blockchain
    try {
      console.log("Attempting to obtain a JWT token with blockchain verification...");
      
      // Utilizziamo il nuovo endpoint che combina pre-autorizzazione e generazione token
      const response = await axios.get(
        `http://localhost:8765/api/relay/pre-authorize-with-token/${pubKey}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        }
      );

      if (response.data && response.data.success && response.data.token) {
        console.log(`JWT token obtained successfully`);
        return {
          success: true,
          token: response.data.token
        };
      }
    } catch (tokenError: any) {
      console.log("JWT token creation failed, falling back to pre-authorization...");
      console.error(
        "Error details:",
        tokenError.response?.data || tokenError.message
      );
    }

    // Fallback al metodo precedente se necessario
    console.log("Falling back to legacy pre-authorization...");
    const forceResponse = await axios.get(
      `http://localhost:8765/api/relay/pre-authorize/${pubKey}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (forceResponse.data && forceResponse.data.success) {
      console.log(
        `Legacy pre-authorization successful: ${forceResponse.data.message}`
      );
      return {
        success: true
      };
    } else {
      console.error(
        "Legacy pre-authorization failed:",
        forceResponse.data.error
      );
      return {
        success: false
      };
    }
  } catch (error: any) {
    console.error("Error during authorization:", error.message);
    if (error.response) {
      console.error("Server response:", error.response.data);
    }
    return {
      success: false
    };
  }
}
async function main() {
  // Cast the deployments to the correct type
  const deployments = localDeployments as unknown as DeploymentAddresses;
  
  // Get both relay and entry point addresses
  const relayAddress = deployments["Protocol#Relay"];
  const entryPointAddress = deployments["Protocol#EntryPoint"];
  
  if (!relayAddress || !entryPointAddress) {
    console.error("Relay or EntryPoint contract addresses not found in deployments");
    console.log("Available contracts:", Object.keys(deployments).join(", "));
    process.exit(1);
  }
  
  console.log(`Relay address: ${relayAddress}`);
  console.log(`EntryPoint address: ${entryPointAddress}`);
  
  const months = parseInt(process.env.SUBSCRIBE_MONTHS || "1");
  const privateKey = process.env.PRIVATE_KEY as string;

  const gun = Gun({
    peers: ["http://localhost:8765/gun"],
    localStorage: false,
    radisk: false,
  });

  let authResult = null;

  console.log("Generazione coppia di chiavi GunDB...");
  let pair = await SEA.pair();
  let pubKey = pair.pub;
  console.log(`Coppia di chiavi generata. Chiave pubblica: ${pubKey}`);

  if (!privateKey) {
    console.error("Impostare in .env: PRIVATE_KEY");
    process.exit(1);
  }

  // Provider e signer
  const provider = ethers.provider;
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log(`Utilizzo wallet con indirizzo: ${wallet.address}`);

  // Get price from Relay contract first
  const relayAbi = [
    "function pricePerMonth() view returns (uint256)",
    "function subscribe(uint256 _months, bytes calldata _pubKey) external payable",
    "function isSubscriptionActive(address _user) external view returns (bool)"
  ];
  const relayContract = new ethers.Contract(relayAddress, relayAbi, wallet);

  // EntryPoint contract instance with enhanced ABI
  const entryPointAbi = [
    "function subscribeDirect(address _relayAddress, uint256 _months, bytes calldata _pubKey) external payable",
    "function calculateSubscriptionCost(address _relayAddress, uint256 _months) external view returns (uint256 subscriptionCost, uint256 fee, uint256 totalCost)",
    "function serviceFeePercentage() external view returns (uint256)",
    "function checkSubscription(address _user, address _relayAddress) external view returns (bool)"
  ];
  const entryPointContract = new ethers.Contract(entryPointAddress, entryPointAbi, wallet);

  try {
    // Calcola il valore da inviare
    /* console.log("Tentativo di lettura del prezzo per mese dal Relay contract...");
    const price: bigint = await relayContract.pricePerMonth();
    const total: bigint = price * BigInt(months);

    console.log(
      `Sottoscrizione per ${months} mese(i), totale: ${ethers.formatEther(
        total
      )} ETH`
    );

    // Calcola il costo tramite EntryPoint (include fee)
    console.log("Calcolo del costo totale tramite EntryPoint (include commissioni)...");
    const [subscriptionCost, fee, totalCost] = await entryPointContract.calculateSubscriptionCost(
      relayAddress,
      months
    );
    
    console.log(`Costi calcolati da EntryPoint:`);
    console.log(`- Subscription cost: ${ethers.formatEther(subscriptionCost)} ETH`);
    console.log(`- Fee: ${ethers.formatEther(fee)} ETH`);
    console.log(`- Total cost: ${ethers.formatEther(totalCost)} ETH`);
    
    // Aggiorna l'importo totale con quello calcolato dall'EntryPoint
    const finalTotal = totalCost;

    // Converti la pubKey di Gun in formato hex per il contratto
    console.log("Conversione della chiave pubblica per il contratto...");
    const hexPubKey = gunPubKeyToHex(pubKey);
    
    // Prepara i dati per il contratto - è importante usare il formato corretto per bytes in ethers v6
    const pubKeyForContract = `0x${hexPubKey}`;
    console.log(`Chiave pubblica convertita per il contratto: ${pubKeyForContract.substring(0, 42)}...`);
    
    // Debug dei parametri di chiamata
    console.log("Parametri per EntryPoint.subscribeDirect:");
    console.log(`- Relay address: ${relayAddress}`);
    console.log(`- Months: ${months}`);
    console.log(`- PubKey (${(pubKeyForContract.length-2)/2} bytes): ${pubKeyForContract.substring(0, 42)}...`);
    console.log(`- Value: ${ethers.formatEther(finalTotal)} ETH`);
    
    try {
      // Try a static call first to check if the call would succeed
      console.log("Esecuzione di static call per verificare i parametri...");
      await entryPointContract.subscribeDirect.staticCall(
        relayAddress,
        months,
        pubKeyForContract,
        { value: finalTotal }
      );
      console.log("Static call successful, proceeding with transaction");
    } catch (staticError: any) {
      console.warn("Static call failed, but proceeding anyway:", staticError.reason || staticError.message);
      // Continue anyway - the static call might fail for reasons that don't affect the actual transaction
    }

    // Execute the transaction
    console.log("Chiamando EntryPoint.subscribeDirect() con relay address:", relayAddress);
    const tx = await entryPointContract.subscribeDirect(
      relayAddress,
      months,
      pubKeyForContract,
      { value: finalTotal }
    );
    
    console.log(`Transazione inviata: ${tx.hash}`);
    console.log("In attesa di conferma...");
    
    const receipt = await tx.wait();
    console.log("Subscription completata con successo!");
    console.log(`- Transaction hash: ${receipt.hash}`);
    console.log(`- Block: ${receipt.blockNumber}`);
    console.log(`- Gas used: ${receipt.gasUsed.toString()}`); */

    // Pre-authorize this key with the relay and get a JWT token if possible
    authResult = await preAuthorizeKey(pubKey);
    if (!authResult.success) {
      console.error(
        "Failed to authorize key with relay. Gun writes may fail."
      );
      // Continue anyway and try
    }
  } catch (error: any) {
    console.error("Errore durante l'interazione con il contratto:");
    
    // Log dettagliato dell'errore per il debug
    if (error.receipt) {
      console.error("Transaction failed with receipt:", {
        txHash: error.receipt.hash,
        blockNumber: error.receipt.blockNumber,
        status: error.receipt.status,
        gasUsed: error.receipt.gasUsed.toString()
      });
    }
    
    if (error.reason) {
      console.error("Revert reason:", error.reason);
    } else if (error.data) {
      console.error("Error data:", error.data);
    } else {
      // Try to decode a custom error from the transaction
      console.error("Unknown error:", error.message);
    }
    
    console.error("Full error:", error);
    process.exit(1);
  }

  // Adesso aggiungiamo l'autenticazione a Gun in modo corretto
  console.log("Autenticazione in Gun...");
  try {
    // Prima eseguiamo la creazione utente se non esiste già
    try {
      await new Promise((resolve, reject) => {
        gun.user().create(pair.pub, pair.priv, (ack: GunAck) => {
          if (ack.err && !ack.err.includes("already created")) {
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
        months: months,
      };

      console.log(subscriptionData);

      gun.on("out", function (ctx) {
        var to = this.to;
        // Adds headers for put
        ctx.headers = {
          // Usa il JWT token se disponibile, altrimenti fallback al token di sistema
          Authorization: authResult?.token ? `Bearer ${authResult.token}` : undefined
        };
        to.next(ctx); // pass to next middleware
      });

      gun
        .user()
        .get("subscription")
        .put(subscriptionData, (ack: GunAck) => {
          console.log(ack);
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
