/**
 * Script per calcolare il genesis hash usando l'algoritmo CPU-friendly
 * Questo hash deve essere usato nel deployment del contratto ChainState
 */

import { ethers } from "ethers";

// Parametri dell'algoritmo (devono corrispondere al contratto e miner)
// Reduced for gas efficiency while maintaining GPU/ASIC resistance
const MEMORY_SIZE = 128; // 128 * 32 bytes = 4KB memory
const ROUNDS = 3; // Number of hash rounds

/**
 * CPU-friendly hash algorithm (CPUHash)
 * Deve corrispondere esattamente all'implementazione in HashLayer.sol
 */
function calculateCPUGensisHash(): string {
  // Valori del genesis block
  const height = 0;
  const previousHash = ethers.ZeroHash; // bytes32(0)
  const nonce = 0;
  const data = "0x"; // bytes vuoto

  // Step 1: Create initial hash from block data
  const packed = ethers.solidityPacked(
    ["uint64", "bytes32", "uint64", "bytes"],
    [height, previousHash, nonce, data]
  );
  
  let currentHash = ethers.getBytes(ethers.keccak256(packed));

  // Step 2: Allocate memory buffer (MEMORY_SIZE * 32 bytes)
  const memory = new Uint8Array(MEMORY_SIZE * 32);

  // Step 3: Fill memory buffer sequentially (memory-hard, sequential access)
  for (let i = 0; i < MEMORY_SIZE; i++) {
    // Each memory slot depends on previous hash + index
    // Convert to hex for ethers.keccak256
    const hashHex = ethers.hexlify(currentHash);
    
    // Add index as little-endian uint32 (4 bytes)
    const indexBytes = new Uint8Array(4);
    const view = new DataView(indexBytes.buffer);
    view.setUint32(0, Number(i), true); // little-endian
    const indexHex = ethers.hexlify(indexBytes);

    // Pack and hash: keccak256(hash + index)
    const mixData = ethers.concat([hashHex, indexHex]);
    const slotHash = ethers.getBytes(ethers.keccak256(mixData));
    
    memory.set(slotHash, i * 32);
    currentHash = slotHash;
  }

  // Step 4: Mix memory through multiple rounds (sequential dependencies)
  for (let round = 0; round < ROUNDS; round++) {
    for (let i = 0; i < MEMORY_SIZE; i++) {
      // Mix with previous slot (creates sequential dependency)
      const prevIdx = i > 0 ? i - 1 : MEMORY_SIZE - 1;
      const slot1 = ethers.hexlify(memory.slice(i * 32, (i + 1) * 32));
      const slot2 = ethers.hexlify(memory.slice(prevIdx * 32, (prevIdx + 1) * 32));
      const mixData = ethers.concat([slot1, slot2]);

      // Hash using keccak256 from ethers (matches Solidity)
      const mixedHash = ethers.getBytes(ethers.keccak256(mixData));
      
      memory.set(mixedHash, i * 32);
    }
  }

  // Step 5: Final hash from entire memory buffer
  // Pack all memory slots and hash
  const memoryHex = ethers.hexlify(memory);
  const genesisHash = ethers.keccak256(memoryHex);

  return genesisHash;
}

// Calcola e stampa il genesis hash
const genesisHash = calculateCPUGensisHash();
console.log("Genesis Hash (CPU-friendly algorithm):");
console.log(genesisHash);
console.log("\nUsa questo hash nel deployment del contratto ChainState.");

// Esporta per uso in altri script
export { calculateCPUGensisHash };

