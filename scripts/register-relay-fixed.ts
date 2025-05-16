// scripts/register-relay-fixed.ts
// Script per registrare correttamente il relay usando le nuove funzioni

import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import localDeployments from "../ignition/deployments/chain-31337/deployed_addresses.json";

dotenv.config();

async function main() {
  try {
    // Carica gli indirizzi dei contratti
    const individualRelayAddress = localDeployments["Network#IndividualRelay"];
    const relayRegistryAddress = localDeployments["Network#RelayRegistry"];

    console.log(`IndividualRelay: ${individualRelayAddress}`);
    console.log(`RelayRegistry: ${relayRegistryAddress}`);

    if (!individualRelayAddress || !relayRegistryAddress) {
      console.error("Indirizzi dei contratti non trovati");
      process.exit(1);
    }

    // Ottieni il signer
    const [signer] = await ethers.getSigners();
    console.log(`Utilizzo l'account: ${await signer.getAddress()}`);

    // Interfacce ABI
    const relayRegistryAbi = [
      "function unregisterRelayContract(address _relayContractAddress) external",
      "function registerRelayContractAdmin(address _relayContract, address _relayOwner, string calldata _url, uint256 _stake) external",
      "function getAllRelayContracts() external view returns (address[] memory)",
      "function isRegistered(address _relayContractAddress) external view returns (bool)",
      "function getRelayDetails(address _relayContractAddress) external view returns (address, string memory, uint256, uint256, uint256, uint256)"
    ];

    const individualRelayAbi = [
      "function setRegistryAddress(address _registryAddress) external",
      "function registerWithRegistry() external",
      "function relayUrl() external view returns (string memory)",
      "function ownerStake() external view returns (uint256)",
      "function getOwner() external view returns (address)",
      "function checkRegistration() external view returns (bool)"
    ];

    // Connetti ai contratti
    const registry = new ethers.Contract(relayRegistryAddress, relayRegistryAbi, signer);
    const relay = new ethers.Contract(individualRelayAddress, individualRelayAbi, signer);

    // 1. Verifica i relay registrati
    console.log("Verifico i relay registrati...");
    const registeredRelays = await registry.getAllRelayContracts();
    console.log(`Relay attualmente registrati: ${registeredRelays.length}`);
    
    for (const relayAddr of registeredRelays) {
      console.log(`- ${relayAddr}`);
      
      // Verifica se è un contratto
      const code = await ethers.provider.getCode(relayAddr);
      if (code === "0x") {
        console.log(`ATTENZIONE: ${relayAddr} non è un contratto ma è registrato nel RelayRegistry!`);
        
        try {
          console.log("Rimuovo l'indirizzo EOA dal registro...");
          const tx = await registry.unregisterRelayContract(relayAddr);
          await tx.wait();
          console.log("Indirizzo rimosso con successo.");
        } catch (error) {
          console.error("Errore durante la rimozione:", error.message);
        }
      }
    }

    // 2. Imposta l'indirizzo del registry nel relay
    console.log("Imposto l'indirizzo del registry nel relay...");
    let setRegistryTx = await relay.setRegistryAddress(relayRegistryAddress);
    await setRegistryTx.wait();
    console.log("Indirizzo registry impostato nel relay.");

    // 3. Ottieni le informazioni necessarie dal relay
    const relayUrl = await relay.relayUrl();
    const relayOwner = await relay.getOwner();
    const relayStake = await relay.ownerStake();
    
    console.log(`URL del relay: ${relayUrl}`);
    console.log(`Proprietario del relay: ${relayOwner}`);
    console.log(`Stake attuale: ${relayStake.toString() / 1e18} ETH`);

    // 4. Registra il relay usando il metodo del relay
    console.log("Registrazione del relay usando registerWithRegistry()...");
    try {
      const registerTx = await relay.registerWithRegistry();
      await registerTx.wait();
      console.log("Relay registrato con successo tramite IndividualRelay.registerWithRegistry()");
    } catch (error) {
      console.error("Errore durante la registrazione tramite relay:", error.message);
      
      // 5. Se fallisce, prova a registrare tramite il registry direttamente
      console.log("Provo la registrazione tramite il registry direttamente...");
      try {
        const adminRegisterTx = await registry.registerRelayContractAdmin(
          individualRelayAddress,
          relayOwner,
          relayUrl,
          relayStake
        );
        await adminRegisterTx.wait();
        console.log("Relay registrato con successo tramite RelayRegistry.registerRelayContractAdmin()");
      } catch (error) {
        console.error("Errore durante la registrazione tramite registry:", error.message);
      }
    }

    // 6. Verifica finale
    const isRegistered = await registry.isRegistered(individualRelayAddress);
    console.log(`Verifico registrazione: ${isRegistered ? "✅ Successo" : "❌ Fallimento"}`);

    if (isRegistered) {
      // Ottieni dettagli dal registro se registrato
      const details = await registry.getRelayDetails(individualRelayAddress);
      console.log("Dettagli dal registry:");
      console.log(`- Owner: ${details[0]}`);
      console.log(`- URL: ${details[1]}`);
      console.log(`- Subscribers: ${details[2].toString()}`);
      console.log(`- Pending rewards: ${details[3].toString() / 1e18} ETH`);
      console.log(`- Stake: ${details[4].toString() / 1e18} ETH`);
      console.log(`- Stake percentage: ${details[5].toString() / 100}%`);
    }

    // 7. Verifica tramite la funzione di controllo del relay
    const relayCheckRegistration = await relay.checkRegistration();
    console.log(`Verifica dal relay: ${relayCheckRegistration ? "✅ Successo" : "❌ Fallimento"}`);

  } catch (error) {
    console.error("Errore durante l'esecuzione dello script:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 