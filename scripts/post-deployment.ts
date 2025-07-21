import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

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

// Mappa degli ID delle chain ai nomi
const CHAIN_ID_TO_NAME: { [chainId: string]: string } = {
  "11155111": "sepolia",
  "11155420": "optimismSepolia",
  // Aggiungi altre chain qui se necessario
};

function generateDeploymentsJson(): void {
  const ignitionDir = join(__dirname, "..", "ignition", "deployments");
  const deployments: DeploymentsFile = {};

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

    deployments[chainId] = {};

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
  console.log(`File deployments.json generato in: ${outputPath}`);
  console.log(`Chain trovate: ${Object.keys(deployments).join(", ")}`);

  // Genera anche il file deployments.ts
  generateDeploymentsTs(deployments);
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

  // Genera il contenuto del file JavaScript
  const jsContent = `// File generato automaticamente da post-deployment.ts
// Non modificare manualmente

const DEPLOYMENTS = ${JSON.stringify(deploymentsWithNames, null, 2)};

module.exports = { DEPLOYMENTS };
`;

  const outputPath = join(__dirname, "..", "deployments.js");
  writeFileSync(outputPath, jsContent);
  console.log(`File deployments.js generato in: ${outputPath}`);
  console.log(
    `Chain con nomi: ${Object.keys(deploymentsWithNames).join(", ")}`
  );
}

// Esegui lo script
generateDeploymentsJson();
