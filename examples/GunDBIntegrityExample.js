// Esempio di utilizzo del contratto GunDBIntegrity con GunDB
const { ethers } = require("ethers");

// Simulazione di un'applicazione GunDB
class GunDBIntegrityExample {
  constructor(contractAddress, provider) {
    this.contractAddress = contractAddress;
    this.provider = provider;
    this.contract = null; // Istanza del contratto
  }

  // Inizializza la connessione al contratto
  async init() {
    const abi = [
      "function registerData(bytes32 dataId, bytes32 dataHash) external",
      "function verifyIntegrity(bytes32 dataId, bytes32 currentHash) external view returns (bool)",
      "function calculateHash(bytes calldata data) external pure returns (bytes32)",
      "function dataHashes(bytes32) external view returns (bytes32)",
      "event DataRegistered(bytes32 indexed dataId, bytes32 dataHash)",
    ];

    this.contract = new ethers.Contract(
      this.contractAddress,
      abi,
      this.provider
    );
    console.log("✅ Connesso al contratto GunDBIntegrity");
  }

  // Registra un nodo GunDB per il monitoraggio dell'integrità
  async registerGunDBNode(nodeId, nodeData) {
    try {
      // Calcola l'hash del nodo
      const nodeHash = ethers.id(JSON.stringify(nodeData));

      // Registra l'hash nel contratto
      const tx = await this.contract.registerData(nodeId, nodeHash);
      await tx.wait();

      console.log(`📝 Nodo GunDB registrato: ${nodeId}`);
      console.log(`🔐 Hash registrato: ${nodeHash}`);

      return nodeHash;
    } catch (error) {
      console.error("❌ Errore nella registrazione:", error.message);
      throw error;
    }
  }

  // Verifica l'integrità di un nodo GunDB
  async verifyNodeIntegrity(nodeId, currentData) {
    try {
      // Calcola l'hash dei dati attuali
      const currentHash = ethers.id(JSON.stringify(currentData));

      // Verifica l'integrità tramite il contratto
      const isIntact = await this.contract.verifyIntegrity(nodeId, currentHash);

      if (isIntact) {
        console.log(`✅ Nodo ${nodeId}: integrità verificata`);
      } else {
        console.log(`⚠️  Nodo ${nodeId}: dati modificati o compromessi!`);
      }

      return isIntact;
    } catch (error) {
      console.error("❌ Errore nella verifica:", error.message);
      return false;
    }
  }

  // Monitora l'integrità di tutti i nodi registrati
  async monitorAllNodes(nodeRegistry) {
    console.log("🔍 Avvio monitoraggio integrità...");

    for (const [nodeId, nodeData] of Object.entries(nodeRegistry)) {
      await this.verifyNodeIntegrity(nodeId, nodeData);
    }
  }
}

// Esempio di utilizzo
async function main() {
  // Configurazione
  const contractAddress = "0x..."; // Indirizzo del contratto deployato
  const provider = new ethers.JsonRpcProvider("http://localhost:8545");

  // Crea l'istanza dell'esempio
  const integrityExample = new GunDBIntegrityExample(contractAddress, provider);
  await integrityExample.init();

  // Simula dati GunDB
  const gunDBNodes = {
    "user:alice": {
      name: "Alice",
      email: "alice@example.com",
      profile: { age: 25, city: "Roma" },
    },
    "post:123": {
      title: "Il mio primo post",
      content: "Contenuto del post...",
      author: "alice",
      timestamp: Date.now(),
    },
    "comment:456": {
      text: "Bel post!",
      author: "bob",
      postId: "123",
      timestamp: Date.now(),
    },
  };

  // Registra i nodi per il monitoraggio
  console.log("📋 Registrazione nodi GunDB...");
  for (const [nodeId, nodeData] of Object.entries(gunDBNodes)) {
    await integrityExample.registerGunDBNode(nodeId, nodeData);
  }

  // Simula una modifica malevola
  console.log("\n🔧 Simulazione modifica malevola...");
  const modifiedNode = {
    ...gunDBNodes["user:alice"],
    profile: { age: 30, city: "Milano" }, // Dati modificati
  };

  // Verifica l'integrità
  await integrityExample.verifyNodeIntegrity("user:alice", modifiedNode);

  // Verifica nodo intatto
  await integrityExample.verifyNodeIntegrity(
    "post:123",
    gunDBNodes["post:123"]
  );

  // Monitoraggio completo
  console.log("\n🔍 Monitoraggio completo:");
  await integrityExample.monitorAllNodes(gunDBNodes);
}

// Esempio di integrazione con GunDB reale
class GunDBWithIntegrity {
  constructor(gunDBInstance, integrityContract) {
    this.gun = gunDBInstance;
    this.integrity = integrityContract;
  }

  // Salva un dato con verifica di integrità
  async setWithIntegrity(path, data) {
    // Salva in GunDB
    await this.gun.get(path).put(data);

    // Registra l'hash per il monitoraggio
    const nodeId = ethers.id(path);
    const nodeHash = ethers.id(JSON.stringify(data));
    await this.integrity.registerData(nodeId, nodeHash);

    console.log(`💾 Dato salvato con integrità: ${path}`);
  }

  // Legge un dato e verifica l'integrità
  async getWithIntegrity(path) {
    // Legge da GunDB
    const data = await this.gun.get(path).then();

    // Verifica l'integrità
    const nodeId = ethers.id(path);
    const nodeHash = ethers.id(JSON.stringify(data));
    const isIntact = await this.integrity.verifyIntegrity(nodeId, nodeHash);

    if (!isIntact) {
      console.warn(`⚠️  Dato compromesso rilevato: ${path}`);
    }

    return { data, isIntact };
  }
}

// Esegui l'esempio
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { GunDBIntegrityExample, GunDBWithIntegrity };
