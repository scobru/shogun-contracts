// scripts/publishHeartbeatRoot.ts
// Hardhat task: leggi i relay dal contratto, ping GunDB, build Merkle tree e pubblica la root

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
  const signer = (await ethers.getSigners())[0];

  const membershipAddr = process.env.MEMBERSHIP_ADDR as string;
  const membershipAbi = [
    "function getRelayCount() view returns (uint256)",
    "function getRelayAt(uint256) view returns (address)",
    "function relayUrl(address) view returns (string)",
    "function publishRoot(uint256, bytes32)"
  ];
  const oracleAddr = process.env.ORACLE_ADDR as string;

  // Contratti
  const membership = new ethers.Contract(membershipAddr, membershipAbi, signer);
  const oracle = new ethers.Contract(
    oracleAddr,
    [
      "function publishRoot(uint256, bytes32)", 
      "function roots(uint256) view returns (bytes32)",
      "function rootTimestamps(uint256) view returns (uint256)"
    ],
    signer
  );

  // Calcola epoch (ore da epoch)
  const epoch = Math.floor(Date.now() / 1000 / 3600);

  // Leggi lista relay dal contratto
  const count: number = (await membership.getRelayCount());
  const alive: string[] = [];
  const urls: string[] = [];
  const leavesInfo: {addr: string; url: string}[] = [];

  for (let i = 0; i < count; i++) {
    const addr: string = await membership.getRelayAt(i);
    const url: string = await membership.relayUrl(addr);
    const ok = await pingRelay(url);
    if (ok) {
      alive.push(addr);
      leavesInfo.push({addr, url});
      urls.push(url);
    }
  }

  console.log(urls);
  console.log(leavesInfo);

  if (alive.length === 0) {
    console.error(`No relays online for epoch ${epoch}`);
    return;
  }

  // Costruisci Merkle tree su keccak(address||epoch)
  const leaves = alive.map(a =>
    ethers.solidityPackedKeccak256(["address","uint256"], [a, epoch])
  );
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const root = tree.getHexRoot();

  // Pubblica on-chain
  const tx = await oracle.publishRoot(epoch, root);
  console.log(`Publishing root for epoch ${epoch}: ${root}`);
  await tx.wait();
  console.log("Root published in tx", tx.hash);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});