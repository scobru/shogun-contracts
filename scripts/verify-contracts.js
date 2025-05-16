// scripts/verify-contracts.js
// Script per verificare che gli indirizzi dei contratti nel deployed_addresses.json siano corretti
// e aggiornare il file .env con i valori corretti

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Carica il file .env
dotenv.config();

// Funzione per verificare se un indirizzo è un contratto
async function isContract(provider, address) {
  try {
    const code = await provider.getCode(address);
    return code !== "0x" && code.length > 2;
  } catch (error) {
    console.error(`Errore nel verificare l'indirizzo ${address}: ${error.message}`);
    return false;
  }
}

// Funzione per verificare se un contratto implementa un'interfaccia specifica
async function implementsInterface(provider, address, interfaceAbi) {
  try {
    const contract = new ethers.Contract(address, interfaceAbi, provider);
    
    // Prova una chiamata specifica per verificare se l'interfaccia è implementata
    for (const fragment of interfaceAbi) {
      if (fragment.startsWith("function")) {
        const functionName = fragment.split("function ")[1].split("(")[0].trim();
        try {
          // Prova a chiamare la funzione senza argomenti (solo per view/pure functions)
          await contract[functionName]();
          console.log(`✅ Il contratto all'indirizzo ${address} implementa il metodo ${functionName}`);
          return true;
        } catch (error) {
          // Se l'errore è dovuto a parametri mancanti, significa che il metodo esiste
          if (error.message.includes("missing argument") || 
              error.message.includes("invalid argument") ||
              error.message.includes("CALL_EXCEPTION")) {
            console.log(`✅ Il contratto all'indirizzo ${address} implementa il metodo ${functionName} (errore atteso sui parametri)`);
            return true;
          }
          console.log(`❌ Il contratto all'indirizzo ${address} non implementa il metodo ${functionName}: ${error.message}`);
        }
      }
    }
    return false;
  } catch (error) {
    console.error(`Errore nel verificare l'interfaccia del contratto ${address}: ${error.message}`);
    return false;
  }
}

// Funzione per verificare e aggiornare i contratti
async function verifyAndFixContracts() {
  try {
    // Provider Ethereum
    const providerUrl = process.env.ETHEREUM_PROVIDER_URL || "http://localhost:8545";
    const provider = new ethers.JsonRpcProvider(providerUrl);
    console.log(`Connesso al provider: ${providerUrl}`);

    // Carica gli indirizzi dei contratti
    const deploymentsPath = path.join(__dirname, "../ignition/deployments/chain-31337/deployed_addresses.json");
    if (!fs.existsSync(deploymentsPath)) {
      console.error(`File deployed_addresses.json non trovato in ${deploymentsPath}`);
      return;
    }

    const deployedAddresses = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));
    console.log("Indirizzi dei contratti trovati:", deployedAddresses);

    // Verifica gli indirizzi
    const individualRelayAddress = deployedAddresses["Network#IndividualRelay"];
    const relayRegistryAddress = deployedAddresses["Network#RelayRegistry"];

    // Definisci le interfacce ABI per verificare i contratti
    const individualRelayAbi = [
      "function getOwner() view returns (address)",
      "function pricePerMonth() view returns (uint256)"
    ];

    const relayRegistryAbi = [
      "function getAllRelayContracts() view returns (address[])",
      "function isRegistered(address _relayContractAddress) view returns (bool)"
    ];

    // Verifica IndividualRelay
    console.log("\n==== Verifica IndividualRelay ====");
    if (individualRelayAddress) {
      console.log(`Indirizzo IndividualRelay: ${individualRelayAddress}`);
      
      const isIndividualRelayContract = await isContract(provider, individualRelayAddress);
      if (isIndividualRelayContract) {
        console.log(`✅ L'indirizzo ${individualRelayAddress} è un contratto`);
        
        const implementsIndividualRelayInterface = await implementsInterface(
          provider,
          individualRelayAddress,
          individualRelayAbi
        );
        
        if (implementsIndividualRelayInterface) {
          console.log(`✅ Il contratto all'indirizzo ${individualRelayAddress} implementa l'interfaccia IndividualRelay`);
        } else {
          console.error(`❌ Il contratto all'indirizzo ${individualRelayAddress} NON implementa l'interfaccia IndividualRelay`);
        }
      } else {
        console.error(`❌ L'indirizzo ${individualRelayAddress} NON è un contratto`);
      }
    } else {
      console.warn("⚠️ Indirizzo IndividualRelay non trovato nel file deployed_addresses.json");
    }

    // Verifica RelayRegistry
    console.log("\n==== Verifica RelayRegistry ====");
    if (relayRegistryAddress) {
      console.log(`Indirizzo RelayRegistry: ${relayRegistryAddress}`);
      
      const isRelayRegistryContract = await isContract(provider, relayRegistryAddress);
      if (isRelayRegistryContract) {
        console.log(`✅ L'indirizzo ${relayRegistryAddress} è un contratto`);
        
        const implementsRelayRegistryInterface = await implementsInterface(
          provider,
          relayRegistryAddress,
          relayRegistryAbi
        );
        
        if (implementsRelayRegistryInterface) {
          console.log(`✅ Il contratto all'indirizzo ${relayRegistryAddress} implementa l'interfaccia RelayRegistry`);
          
          // Controlla i relay registrati
          try {
            const contract = new ethers.Contract(relayRegistryAddress, relayRegistryAbi, provider);
            const relays = await contract.getAllRelayContracts();
            console.log(`Relay registrati (${relays.length}):`, relays);
            
            // Verifica ogni relay
            for (const relay of relays) {
              const isRelayContract = await isContract(provider, relay);
              console.log(`Relay ${relay}: ${isRelayContract ? "✅ è un contratto" : "❌ NON è un contratto"}`);
              
              if (isRelayContract) {
                // Controlla se il relay è registrato
                const isRegistered = await contract.isRegistered(relay);
                console.log(`Relay ${relay}: ${isRegistered ? "✅ è registrato" : "❌ NON è registrato"}`);
              }
            }
          } catch (error) {
            console.error(`Errore nel verificare i relay: ${error.message}`);
          }
        } else {
          console.error(`❌ Il contratto all'indirizzo ${relayRegistryAddress} NON implementa l'interfaccia RelayRegistry`);
        }
      } else {
        console.error(`❌ L'indirizzo ${relayRegistryAddress} NON è un contratto`);
      }
    } else {
      console.warn("⚠️ Indirizzo RelayRegistry non trovato nel file deployed_addresses.json");
    }
    
    // Verifica il file .env
    console.log("\n==== Verifica .env ====");
    const envPath = path.join(__dirname, "../.env");
    let envContent = "";
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8");
    }
    
    // Verifica/aggiorna INDIVIDUAL_RELAY
    if (individualRelayAddress) {
      const individualRelayRegex = /INDIVIDUAL_RELAY=(.+)/;
      const hasIndividualRelay = individualRelayRegex.test(envContent);
      
      if (hasIndividualRelay) {
        envContent = envContent.replace(individualRelayRegex, `INDIVIDUAL_RELAY=${individualRelayAddress}`);
        console.log(`✅ INDIVIDUAL_RELAY aggiornato nel file .env`);
      } else {
        envContent += `\nINDIVIDUAL_RELAY=${individualRelayAddress}`;
        console.log(`✅ INDIVIDUAL_RELAY aggiunto al file .env`);
      }
    }
    
    // Verifica/aggiorna RELAY_REGISTRY_CONTRACT
    if (relayRegistryAddress) {
      const relayRegistryRegex = /RELAY_REGISTRY_CONTRACT=(.+)/;
      const hasRelayRegistry = relayRegistryRegex.test(envContent);
      
      if (hasRelayRegistry) {
        envContent = envContent.replace(relayRegistryRegex, `RELAY_REGISTRY_CONTRACT=${relayRegistryAddress}`);
        console.log(`✅ RELAY_REGISTRY_CONTRACT aggiornato nel file .env`);
      } else {
        envContent += `\nRELAY_REGISTRY_CONTRACT=${relayRegistryAddress}`;
        console.log(`✅ RELAY_REGISTRY_CONTRACT aggiunto al file .env`);
      }
    }
    
    // Salva il file .env aggiornato
    fs.writeFileSync(envPath, envContent);
    console.log(`✅ File .env aggiornato correttamente`);
    
    console.log("\n✅ Verifica completata!");
  } catch (error) {
    console.error("Errore durante la verifica dei contratti:", error);
  }
}

// Esegui lo script
verifyAndFixContracts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 