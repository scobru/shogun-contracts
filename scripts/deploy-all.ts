import { ethers, network } from "hardhat";

/**
 * Deploy all Shogun contracts to the specified network
 * 
 * Usage:
 *   npx hardhat run scripts/deploy-all.ts --network baseSepolia
 * 
 * This script deploys contracts in the following order:
 * 1. ShogunRelayRegistry
 * 2. DataPostRegistry
 * 3. DataSaleEscrowFactory
 * 4. StorageDealRegistry
 * 5. SmartWalletFactory
 * 6. StealthKeyRegistry + PayamentForwarder
 * 
 * Verify commands are printed after deployment.
 */

// USDC addresses per network
const USDC_ADDRESSES: { [chainId: number]: string } = {
  84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia
  8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",  // Base Mainnet
  31337: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Hardhat (use Base Sepolia for testing)
};

// Configuration for RelayRegistry
const MIN_STAKE = ethers.parseUnits("100", 6); // 100 USDC (6 decimals)
const UNSTAKING_DELAY = 7 * 24 * 60 * 60; // 7 days in seconds
const TREASURY = "0xA6591dCDff5C7616110b4f84207184aef7835048"; // Treasury address (or zero for burn)

// Configuration for PayamentForwarder
const TOLL = ethers.parseEther("0.001"); // 0.001 ETH per transaction

interface DeploymentInfo {
  network: string;
  chainId: number;
  deployer: string;
  contracts: {
    relayRegistry?: string;
    dataPostRegistry?: string;
    dataSaleEscrowFactory?: string;
    storageDealRegistry?: string;
    smartWalletFactory?: string;
    stealthKeyRegistry?: string;
    paymentForwarder?: string;
  };
  deployedAt: string;
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const chainId = Number((await ethers.provider.getNetwork()).chainId);
  
  console.log("=".repeat(60));
  console.log("Deploying All Shogun Contracts");
  console.log("=".repeat(60));
  console.log(`Network: ${network.name} (chainId: ${chainId})`);
  console.log(`Deployer: ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Balance: ${ethers.formatEther(balance)} ETH`);

  // Get USDC address for this network
  const usdcAddress = USDC_ADDRESSES[chainId];
  if (!usdcAddress) {
    throw new Error(`USDC address not configured for chainId ${chainId}`);
  }
  console.log(`USDC Address: ${usdcAddress}`);
  console.log("-".repeat(60));

  const deploymentInfo: DeploymentInfo = {
    network: network.name,
    chainId,
    deployer: deployer.address,
    contracts: {},
    deployedAt: new Date().toISOString(),
  };

  // Step 1: Deploy ShogunRelayRegistry
  console.log("\n[1/6] Deploying ShogunRelayRegistry...");
  const ShogunRelayRegistry = await ethers.getContractFactory("ShogunRelayRegistry");
  const relayRegistry = await ShogunRelayRegistry.deploy(
    usdcAddress,
    MIN_STAKE,
    UNSTAKING_DELAY,
    TREASURY
  );
  await relayRegistry.waitForDeployment();
  const relayRegistryAddress = await relayRegistry.getAddress();
  deploymentInfo.contracts.relayRegistry = relayRegistryAddress;
  console.log(`✅ ShogunRelayRegistry deployed to: ${relayRegistryAddress}`);

  // Step 2: Deploy DataPostRegistry
  console.log("\n[2/6] Deploying DataPostRegistry...");
  const DataPostRegistry = await ethers.getContractFactory("DataPostRegistry");
  const dataPostRegistry = await DataPostRegistry.deploy();
  await dataPostRegistry.waitForDeployment();
  const dataPostRegistryAddress = await dataPostRegistry.getAddress();
  deploymentInfo.contracts.dataPostRegistry = dataPostRegistryAddress;
  console.log(`✅ DataPostRegistry deployed to: ${dataPostRegistryAddress}`);

  // Step 3: Deploy DataSaleEscrowFactory
  console.log("\n[3/6] Deploying DataSaleEscrowFactory...");
  const DataSaleEscrowFactory = await ethers.getContractFactory("DataSaleEscrowFactory");
  const dataSaleEscrowFactory = await DataSaleEscrowFactory.deploy(
    usdcAddress,
    relayRegistryAddress,
    dataPostRegistryAddress
  );
  await dataSaleEscrowFactory.waitForDeployment();
  const dataSaleEscrowFactoryAddress = await dataSaleEscrowFactory.getAddress();
  deploymentInfo.contracts.dataSaleEscrowFactory = dataSaleEscrowFactoryAddress;
  console.log(`✅ DataSaleEscrowFactory deployed to: ${dataSaleEscrowFactoryAddress}`);

  // Step 4: Deploy StorageDealRegistry
  console.log("\n[4/6] Deploying StorageDealRegistry...");
  const StorageDealRegistry = await ethers.getContractFactory("StorageDealRegistry");
  const storageDealRegistry = await StorageDealRegistry.deploy(relayRegistryAddress);
  await storageDealRegistry.waitForDeployment();
  const storageDealRegistryAddress = await storageDealRegistry.getAddress();
  deploymentInfo.contracts.storageDealRegistry = storageDealRegistryAddress;
  console.log(`✅ StorageDealRegistry deployed to: ${storageDealRegistryAddress}`);

  // Step 5: Deploy SmartWalletFactory
  console.log("\n[5/6] Deploying SmartWalletFactory...");
  const SmartWalletFactory = await ethers.getContractFactory("SmartWalletFactory");
  const smartWalletFactory = await SmartWalletFactory.deploy();
  await smartWalletFactory.waitForDeployment();
  const smartWalletFactoryAddress = await smartWalletFactory.getAddress();
  deploymentInfo.contracts.smartWalletFactory = smartWalletFactoryAddress;
  console.log(`✅ SmartWalletFactory deployed to: ${smartWalletFactoryAddress}`);

  // Step 6: Deploy StealthKeyRegistry and PayamentForwarder
  console.log("\n[6/6] Deploying StealthKeyRegistry and PayamentForwarder...");
  const StealthKeyRegistry = await ethers.getContractFactory("StealthKeyRegistry");
  const stealthKeyRegistry = await StealthKeyRegistry.deploy();
  await stealthKeyRegistry.waitForDeployment();
  const stealthKeyRegistryAddress = await stealthKeyRegistry.getAddress();
  deploymentInfo.contracts.stealthKeyRegistry = stealthKeyRegistryAddress;
  console.log(`✅ StealthKeyRegistry deployed to: ${stealthKeyRegistryAddress}`);

  const PayamentForwarder = await ethers.getContractFactory("PayamentForwarder");
  const paymentForwarder = await PayamentForwarder.deploy(
    TOLL,
    deployer.address, // tollCollector
    deployer.address  // tollReceiver
  );
  await paymentForwarder.waitForDeployment();
  const paymentForwarderAddress = await paymentForwarder.getAddress();
  deploymentInfo.contracts.paymentForwarder = paymentForwarderAddress;
  console.log(`✅ PayamentForwarder deployed to: ${paymentForwarderAddress}`);

  // Configure PayamentForwarder
  await paymentForwarder.setTollCollector(deployer.address);
  await paymentForwarder.setTollReceiver(deployer.address);
  console.log(`✅ PayamentForwarder configured`);


  // Print verification commands
  console.log("\n" + "=".repeat(60));
  console.log("Verification Commands:");
  console.log("=".repeat(60));
  console.log(`\n# ShogunRelayRegistry:`);
  console.log(`npx hardhat verify --network ${network.name} ${relayRegistryAddress} ${usdcAddress} ${MIN_STAKE.toString()} ${UNSTAKING_DELAY} ${TREASURY}`);
  
  console.log(`\n# DataPostRegistry:`);
  console.log(`npx hardhat verify --network ${network.name} ${dataPostRegistryAddress}`);
  
  console.log(`\n# DataSaleEscrowFactory:`);
  console.log(`npx hardhat verify --network ${network.name} ${dataSaleEscrowFactoryAddress} ${usdcAddress} ${relayRegistryAddress} ${dataPostRegistryAddress}`);
  
  console.log(`\n# StorageDealRegistry:`);
  console.log(`npx hardhat verify --network ${network.name} ${storageDealRegistryAddress} ${relayRegistryAddress}`);
  
  console.log(`\n# SmartWalletFactory:`);
  console.log(`npx hardhat verify --network ${network.name} ${smartWalletFactoryAddress}`);
  
  console.log(`\n# StealthKeyRegistry:`);
  console.log(`npx hardhat verify --network ${network.name} ${stealthKeyRegistryAddress}`);
  
  console.log(`\n# PayamentForwarder:`);
  console.log(`npx hardhat verify --network ${network.name} ${paymentForwarderAddress} ${TOLL.toString()} ${deployer.address} ${deployer.address}`);


  // Print deployment summary
  console.log("\n" + "=".repeat(60));
  console.log("Deployment Summary:");
  console.log("=".repeat(60));
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log("=".repeat(60));

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

