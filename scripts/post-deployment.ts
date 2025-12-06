import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent for ES modules
// @ts-ignore - import.meta is available at runtime in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface DeploymentInfo {
  address: string;
  abi: any[];
}

interface ChainDeployments {
  [contractName: string]: DeploymentInfo;
}

interface DeploymentsFile {
  [chainId: string]: ChainDeployments;
}

// Mappa degli ID delle chain ai nomi per deployments.ts
const CHAIN_ID_TO_NAME: { [chainId: string]: string } = {
  "11155111": "sepolia",
  "11155420": "optimismSepolia",
  // Aggiungi altre chain qui se necessario
};

// Mappa degli ID delle chain ai nomi delle network per contracts-config.js
const CHAIN_ID_TO_NETWORK: { [chainId: string]: string } = {
  "84532": "baseSepolia",
  "8453": "base",
  "11155111": "sepolia",
  "11155420": "optimismSepolia",
  // Aggiungi altre chain qui se necessario
};

// Mappa dei nomi dei contratti deployati ai nomi nel contracts-config.js
const CONTRACT_NAME_MAP: { [deployedName: string]: string } = {
  "RelayRegistry#ShogunRelayRegistry": "relayRegistry",
  "DeployProtocol#StorageDealRegistry": "storageDealRegistry",
  "DataPostRegistry#DataPostRegistry": "dataPostRegistry",
  "DeployProtocol#DataSaleEscrowFactory": "dataSaleEscrowFactory",
};

function loadExistingDeployments(): DeploymentsFile {
  const deploymentsPath = join(__dirname, "..", "deployments.json");
  if (existsSync(deploymentsPath)) {
    try {
      return JSON.parse(readFileSync(deploymentsPath, "utf8"));
    } catch (error) {
      console.log(
        "Errore nel leggere deployments.json esistente, parto da zero"
      );
    }
  }
  return {};
}

function generateDeploymentsJson(): void {
  const ignitionDir = join(__dirname, "..", "ignition", "deployments");

  // Carica i deployment esistenti
  const existingDeployments = loadExistingDeployments();
  const deployments: DeploymentsFile = { ...existingDeployments };

  // Verifica che la directory deployments esista
  if (!existsSync(ignitionDir)) {
    console.log("Directory deployments non trovata");
    return;
  }

  // Leggi tutte le directory delle chain
  const chainDirs = readdirSync(ignitionDir, { withFileTypes: true })
    .filter(
      (dirent) => dirent.isDirectory() && dirent.name.startsWith("chain-")
    )
    .map((dirent) => dirent.name);

  for (const chainDir of chainDirs) {
    const chainId = chainDir.replace("chain-", "");
    const chainPath = join(ignitionDir, chainDir);

    // Leggi deployed_addresses.json
    const addressesPath = join(chainPath, "deployed_addresses.json");
    if (!existsSync(addressesPath)) {
      console.log(
        `File deployed_addresses.json non trovato per chain ${chainId}`
      );
      continue;
    }

    const addresses = JSON.parse(readFileSync(addressesPath, "utf8"));
    const artifactsPath = join(chainPath, "artifacts");

    if (!existsSync(artifactsPath)) {
      console.log(`Directory artifacts non trovata per chain ${chainId}`);
      continue;
    }

    // Inizializza la chain se non esiste
    if (!deployments[chainId]) {
      deployments[chainId] = {};
    }

    // Per ogni contratto deployato
    for (const [contractKey, address] of Object.entries(addresses)) {
      const artifactPath = join(artifactsPath, `${contractKey}.json`);

      if (existsSync(artifactPath)) {
        try {
          const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
          deployments[chainId][contractKey] = {
            address: address as string,
            abi: artifact.abi,
          };
          console.log(`Aggiornato/aggiunto: ${chainId} -> ${contractKey}`);
        } catch (error) {
          console.error(
            `Errore nel leggere l'artifact per ${contractKey}:`,
            error
          );
        }
      } else {
        console.log(`Artifact non trovato per ${contractKey}`);
      }
    }
  }

  // Scrivi il file deployments.json
  const outputPath = join(__dirname, "..", "deployments.json");
  writeFileSync(outputPath, JSON.stringify(deployments, null, 2));
  console.log(`File deployments.json aggiornato in: ${outputPath}`);
  console.log(`Chain totali: ${Object.keys(deployments).join(", ")}`);

  // Genera anche il file deployments.ts
  generateDeploymentsTs(deployments);
  
  // Aggiorna contracts-config.js
  updateContractsConfig(deployments);
}

function generateDeploymentsTs(deployments: DeploymentsFile): void {
  const deploymentsWithNames: { [chainName: string]: ChainDeployments } = {};

  // Converti gli ID delle chain in nomi
  for (const [chainId, chainDeployments] of Object.entries(deployments)) {
    const chainName = CHAIN_ID_TO_NAME[chainId];
    if (chainName) {
      deploymentsWithNames[chainName] = chainDeployments;
    } else {
      console.log(
        `Nome chain non trovato per ID ${chainId}, uso l'ID come fallback`
      );
      deploymentsWithNames[chainId] = chainDeployments;
    }
  }

  // Genera il contenuto del file TypeScript
  const tsContent = `// File generato automaticamente da post-deployment.ts
// Non modificare manualmente

export const DEPLOYMENTS = ${JSON.stringify(
    deploymentsWithNames,
    null,
    2
  )} as const;

export type Deployments = typeof DEPLOYMENTS;
`;

  const tsOutputPath = join(__dirname, "..", "deployments.ts");
  writeFileSync(tsOutputPath, tsContent);
  console.log(`File deployments.ts aggiornato in: ${tsOutputPath}`);

  // Genera anche il file JavaScript
  const jsContent = `// File generato automaticamente da post-deployment.ts
// Non modificare manualmente

const DEPLOYMENTS = ${JSON.stringify(deploymentsWithNames, null, 2)};

module.exports = { DEPLOYMENTS };
`;

  const jsOutputPath = join(__dirname, "..", "deployments.js");
  writeFileSync(jsOutputPath, jsContent);
  console.log(`File deployments.js aggiornato in: ${jsOutputPath}`);

  console.log(
    `Chain con nomi: ${Object.keys(deploymentsWithNames).join(", ")}`
  );
}

interface ContractsConfig {
  [networkName: string]: {
    chainId: number;
    relayRegistry: string | null;
    storageDealRegistry: string | null;
    dataPostRegistry: string | null;
    dataSaleEscrowFactory: string | null;
    usdc: string;
    rpc: string;
    explorer: string;
  };
}

function loadExistingContractsConfig(): ContractsConfig | null {
  const configPath = join(__dirname, "..", "contracts-config.js");
  if (!existsSync(configPath)) {
    console.log("File contracts-config.js non trovato");
    return null;
  }

  try {
    const content = readFileSync(configPath, "utf8");
    
    // Estrai l'oggetto CONTRACTS_CONFIG usando una regex più robusta
    const match = content.match(/export const CONTRACTS_CONFIG\s*=\s*({[\s\S]*?});/);
    if (!match) {
      console.error("Impossibile trovare CONTRACTS_CONFIG nel file");
      return null;
    }

    const configStr = match[1];
    
    // Converti l'oggetto JavaScript in JSON valido
    // Sostituisci le chiavi non quotate con chiavi quotate
    let jsonStr = configStr
      .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":') // Aggiungi virgolette alle chiavi
      .replace(/'([^']*)'/g, '"$1"') // Sostituisci singoli apici con doppi
      .replace(/null/g, 'null') // Mantieni null
      .replace(/,\s*}/g, '}') // Rimuovi virgole finali prima di }
      .replace(/,\s*]/g, ']'); // Rimuovi virgole finali prima di ]
    
    // Gestisci i numeri (chainId)
    jsonStr = jsonStr.replace(/:\s*(\d+)/g, ': $1');
    
    const config = JSON.parse(jsonStr);
    return config as ContractsConfig;
  } catch (error) {
    console.error("Errore nel leggere contracts-config.js:", error);
    // Fallback: prova a importare dinamicamente (solo se siamo in un contesto che lo supporta)
    try {
      // Questo approccio funziona solo se il file è un ES module valido
      // Per ora, restituiamo null e useremo i valori di default
      console.log("⚠️  Usando approccio fallback per contracts-config.js");
    } catch (fallbackError) {
      console.error("Errore anche nel fallback:", fallbackError);
    }
  }
  
  return null;
}

function updateContractsConfig(deployments: DeploymentsFile): void {
  const configPath = join(__dirname, "..", "contracts-config.js");
  const existingConfig = loadExistingContractsConfig();
  
  if (!existingConfig) {
    console.log("⚠️  Non posso aggiornare contracts-config.js: file non trovato o formato non valido");
    return;
  }

  let updated = false;
  const updatedConfig = { ...existingConfig };

  // Per ogni chain deployata
  for (const [chainId, chainDeployments] of Object.entries(deployments)) {
    const networkName = CHAIN_ID_TO_NETWORK[chainId];
    
    if (!networkName) {
      console.log(`⚠️  Network name non trovato per chain ID ${chainId}, salto`);
      continue;
    }

    if (!updatedConfig[networkName]) {
      console.log(`⚠️  Network ${networkName} non trovata in contracts-config.js, salto`);
      continue;
    }

    // Aggiorna gli indirizzi dei contratti deployati
    for (const [contractKey, contractInfo] of Object.entries(chainDeployments)) {
      const configKey = CONTRACT_NAME_MAP[contractKey];
      
      if (configKey && updatedConfig[networkName]) {
        const networkConfig = updatedConfig[networkName];
        const oldAddress = (networkConfig as any)[configKey];
        const newAddress = contractInfo.address;
        
        if (oldAddress !== newAddress) {
          (networkConfig as any)[configKey] = newAddress;
          console.log(`✅ Aggiornato ${networkName}.${configKey}: ${oldAddress || 'null'} -> ${newAddress}`);
          updated = true;
        } else {
          console.log(`ℹ️  ${networkName}.${configKey} già aggiornato: ${newAddress}`);
        }
      } else if (contractKey && !CONTRACT_NAME_MAP[contractKey]) {
        console.log(`⚠️  Contratto ${contractKey} non mappato in CONTRACT_NAME_MAP`);
      }
    }
  }

  if (!updated) {
    console.log("ℹ️  Nessun aggiornamento necessario in contracts-config.js");
    return;
  }

  // Genera il nuovo contenuto del file
  // Formatta l'oggetto con indentazione corretta e null come null (non stringa)
  const configJson = JSON.stringify(updatedConfig, null, 2)
    .replace(/"/g, '"') // Usa doppi apici
    .replace(/:\s*null/g, ': null'); // Assicura che null sia scritto correttamente
  
  const configContent = `/**
 * Shogun Protocol Contracts Configuration
 * 
 * Centralized configuration file for all contract addresses across networks.
 * This file should be kept in sync with actual deployments.
 * 
 * Last updated: ${new Date().toISOString().split('T')[0]}
 */

export const CONTRACTS_CONFIG = ${configJson};

// Helper function to get config by chainId
export function getConfigByChainId(chainId) {
  const config = Object.values(CONTRACTS_CONFIG).find(c => c.chainId === chainId);
  return config || null;
}

// Helper function to get config by network name
export function getConfigByNetwork(network) {
  return CONTRACTS_CONFIG[network] || null;
}
`;

  writeFileSync(configPath, configContent);
  console.log(`✅ File contracts-config.js aggiornato in: ${configPath}`);
}

// Esegui lo script
generateDeploymentsJson();
