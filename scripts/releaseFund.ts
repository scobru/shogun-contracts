// scripts/releaseFunds.ts
// Hardhat script per ritirare i fondi da RelayMembershipDynamic con Merkle proof

import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import WebSocket from "ws";
import * as dotenv from "dotenv";

dotenv.config();

async function pingRelay(wsUrl: string, timeout = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    const ws = new WebSocket(wsUrl);
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        ws.terminate();
        resolve(false);
      }
    }, timeout);

    ws.on("open", () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        ws.close();
        resolve(true);
      }
    });

    ws.on("error", () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(false);
      }
    });
  });
}

async function main() {
  // Env variables
  const membershipAddr = process.env.MEMBERSHIP_ADDR as string;
  const oracleAddr = process.env.ORACLE_ADDR as string;
  const privateKey = process.env.RELAY_PRIVATE_KEY as string;
  const epoch = parseInt(process.env.EPOCH_ID || "485228");

  const signer = (await ethers.getSigners())[2];


  /* if (!membershipAddr || !oracleAddr || !privateKey || epoch === 0) {
    console.error(
      "Impostare in .env: MEMBERSHIP_ADDR, ORACLE_ADDR, RELAY_PRIVATE_KEY, EPOCH_ID"
    );
    process.exit(1);
  } */

  // Provider and relay signer
  const provider = ethers.provider;
  const wallet = signer || new ethers.Wallet(privateKey, provider);
  const relayAddress = await wallet.getAddress();

  // Contract instances
  const membershipAbi = [
    "function getRelayCount() view returns (uint256)",
    "function getRelayAt(uint256) view returns (address)",
    "function relayUrl(address) view returns (string)"
  ];
  const membership = new ethers.Contract(
    membershipAddr,
    membershipAbi,
    wallet
  );
  const oracleAbi = [
    "function roots(uint256) view returns (bytes32)"
  ];
  const oracle = new ethers.Contract(oracleAddr, oracleAbi, provider);

  // Fetch all relays and their URLs
  const count: number = (await membership.getRelayCount());
  const aliveAddrs: string[] = [];

  for (let i = 0; i < count; i++) {
    const addr: string = await membership.getRelayAt(i);
    const url: string = await membership.relayUrl(addr);
    if (await pingRelay(url)) {
      aliveAddrs.push(addr);
    }
  }

  if (!aliveAddrs.includes(relayAddress)) {
    console.error("Relay non presente tra gli alive per epoch", epoch);
    process.exit(1);
  }

  // Build Merkle tree
  const leaves = aliveAddrs.map(a =>
    ethers.solidityPackedKeccak256(["address","uint256"], [a, epoch])
  );
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const leaf = ethers.solidityPackedKeccak256(
    ["address","uint256"],
    [relayAddress, epoch]
  );
  const proof = tree.getHexProof(leaf);

  // Call releaseWithProof
  const releaseAbi = [
    "function releaseWithProof(uint256, bytes32[]) external"
  ];
  const membershipRelay = new ethers.Contract(
    membershipAddr,
    releaseAbi,
    wallet
  );

  console.log(`Invocazione releaseWithProof(epoch=${epoch}) con proof length=${proof.length}`);
  const tx = await membershipRelay.releaseWithProof(epoch, proof);
  const receipt = await tx.wait();

  console.log("Release eseguita, tx hash:", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});