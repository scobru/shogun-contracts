// scripts/check-registry.ts
// Script to check the RelayRegistry status in detail

import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import localDeployments from "../ignition/deployments/chain-31337/deployed_addresses.json";

dotenv.config();

async function main() {
  try {
    // Load addresses
    const individualRelayAddress = localDeployments["Network#IndividualRelay"];
    const relayRegistryAddress = localDeployments["Network#RelayRegistry"];

    console.log(`IndividualRelay: ${individualRelayAddress}`);
    console.log(`RelayRegistry: ${relayRegistryAddress}`);

    // Set up signer
    const provider = ethers.provider;
    const [signer] = await ethers.getSigners();
    console.log(`Using signer: ${await signer.getAddress()}`);

    // Define ABIs
    const relayRegistryAbi = [
      "function getAllRelayContracts() external view returns (address[])",
      "function isRegistered(address _relayContractAddress) external view returns (bool)",
      "function getRelayDetails(address _relayContractAddress) external view returns (address owner_, string memory url_, uint256 subscribers_, uint256 pendingRewards_, uint256 stake_, uint256 stakePercentage_)",
      "function owner() external view returns (address)"
    ];

    const individualRelayAbi = [
      "function getOwner() external view returns (address)",
      "function relayUrl() external view returns (string)",
      "function ownerStake() external view returns (uint256)",
      "function relayRegistry() external view returns (address)"
    ];
    
    // Create contract instances
    const relayRegistry = new ethers.Contract(relayRegistryAddress, relayRegistryAbi, signer);
    const individualRelay = new ethers.Contract(individualRelayAddress, individualRelayAbi, signer);

    // 1. Check Registry Owner
    console.log("Registry owner:", await relayRegistry.owner());
    
    // 2. Check all registered relays
    const registeredRelays = await relayRegistry.getAllRelayContracts();
    console.log(`\nRegistered relays (${registeredRelays.length}):`);
    
    for (const relayAddress of registeredRelays) {
      console.log(`Relay: ${relayAddress}`);
      
      try {
        // Check if it's a contract 
        const code = await provider.getCode(relayAddress);
        console.log(`  Is contract: ${code !== "0x"}`);
        
        // Get relay details
        const relayIsRegistered = await relayRegistry.isRegistered(relayAddress);
        console.log(`  Registered (according to isRegistered): ${relayIsRegistered}`);
        
        try {
          const details = await relayRegistry.getRelayDetails(relayAddress);
          console.log(`  Owner: ${details.owner_}`);
          console.log(`  URL: ${details.url_}`);
          console.log(`  Subscribers: ${details.subscribers_}`);
          console.log(`  Stake: ${ethers.formatEther(details.stake_)} ETH`);
        } catch (error) {
          console.log(`  Error getting relay details: ${error.message}`);
        }
      } catch (error) {
        console.log(`  Error checking relay: ${error.message}`);
      }
    }
    
    // 3. Check IndividualRelay status
    console.log("\nIndividualRelay status:");
    console.log(`  Address: ${individualRelayAddress}`);
    
    try {
      const code = await provider.getCode(individualRelayAddress);
      console.log(`  Is contract: ${code !== "0x"}`);
      
      const owner = await individualRelay.getOwner();
      console.log(`  Owner: ${owner}`);
      
      const url = await individualRelay.relayUrl();
      console.log(`  URL: ${url}`);
      
      const stake = await individualRelay.ownerStake();
      console.log(`  Stake: ${ethers.formatEther(stake)} ETH`);
      
      const registryAddress = await individualRelay.relayRegistry();
      console.log(`  Registry address set in relay: ${registryAddress}`);
      console.log(`  Registry address matches: ${registryAddress.toLowerCase() === relayRegistryAddress.toLowerCase()}`);
      
      const isRegistered = await relayRegistry.isRegistered(individualRelayAddress);
      console.log(`  Registered in registry (isRegistered): ${isRegistered}`);
      
      try {
        const details = await relayRegistry.getRelayDetails(individualRelayAddress);
        console.log(`  Found in registry with details:`);
        console.log(`    Owner: ${details.owner_}`);
        console.log(`    URL: ${details.url_}`);
        console.log(`    Subscribers: ${details.subscribers_}`);
        console.log(`    Stake: ${ethers.formatEther(details.stake_)} ETH`);
      } catch (error) {
        console.log(`  Not found in registry details: ${error.message}`);
      }
    } catch (error) {
      console.log(`  Error checking IndividualRelay: ${error.message}`);
    }
    
    // 4. Check if addresses are case-sensitive matches
    console.log("\nCase-sensitivity check:");
    console.log(`IndividualRelay lowercase: ${individualRelayAddress.toLowerCase()}`);
    
    for (const relay of registeredRelays) {
      console.log(`Registered relay lowercase: ${relay.toLowerCase()}`);
      console.log(`Matches IndividualRelay: ${relay.toLowerCase() === individualRelayAddress.toLowerCase()}`);
    }

  } catch (error) {
    console.error("Script execution error:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 