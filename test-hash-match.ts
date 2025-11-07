import { ethers } from "ethers";
import hre from "hardhat";
import BSC from "../hash-layer-miner/src/BSC.js";

async function testHashMatch() {
  // Deploy contracts locally
  const HashLayer = await hre.ethers.getContractFactory("HashLayer");
  const ChainState = await hre.ethers.getContractFactory("ChainState");
  const BalanceKeeper = await hre.ethers.getContractFactory("BalanceKeeper");

  const chainState = await ChainState.deploy(
    8,
    "0x0188d20f561fe33fd44b0c3db6a0660247901cf70474d028b18db671e31edd3c",
    ethers.parseEther("1")
  );
  await chainState.waitForDeployment();

  const balanceKeeper = await BalanceKeeper.deploy("Hash Layer Token", "HASH");
  await balanceKeeper.waitForDeployment();

  const hashLayer = await HashLayer.deploy(
    await chainState.getAddress(),
    await balanceKeeper.getAddress()
  );
  await hashLayer.waitForDeployment();

  // Test with same values
  const height = 1n;
  const previousHash = ethers.getBytes("0x0188d20f561fe33fd44b0c3db6a0660247901cf70474d028b18db671e31edd3c");
  const nonce = 669527699508n;
  const data = new Uint8Array([]);

  console.log("Testing hash calculation:");
  console.log(`  height: ${height}`);
  console.log(`  previousHash: ${ethers.hexlify(previousHash)}`);
  console.log(`  nonce: ${nonce}`);
  console.log(`  data: ${ethers.hexlify(data)}`);
  console.log();

  // Miner calculation
  const bsc = new BSC();
  const minerHash = bsc.getHashBytes(height, previousHash, nonce, data);
  const minerHashHex = ethers.hexlify(minerHash);
  console.log("Miner hash:", minerHashHex);

  // Contract calculation
  const contractHash = await hashLayer.calculateBlockHash.staticCall(
    height,
    ethers.hexlify(previousHash),
    nonce,
    ethers.hexlify(data)
  );
  console.log("Contract hash:", contractHash);
  console.log();

  if (minerHashHex.toLowerCase() === contractHash.toLowerCase()) {
    console.log("✓ HASHES MATCH! Algorithm is correctly aligned.");
  } else {
    console.log("✗ HASHES DO NOT MATCH");
    console.log("  There is still a mismatch in the algorithm implementation.");
  }
}

testHashMatch().catch(console.error);

