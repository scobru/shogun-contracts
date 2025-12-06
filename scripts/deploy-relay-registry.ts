import { ethers, network } from "hardhat";

/**
 * Deploy ShogunRelayRegistry to Base Sepolia
 * 
 * Usage:
 *   npx hardhat run scripts/deploy-relay-registry.ts --network baseSepolia
 * 
 * Verify:
 *   npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS> <USDC_ADDRESS> <MIN_STAKE> <UNSTAKING_DELAY>
 */

// USDC addresses per network
const USDC_ADDRESSES: { [chainId: number]: string } = {
  84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia
  8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",  // Base Mainnet
  31337: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Hardhat (use Base Sepolia for testing)
};

// Configuration
const MIN_STAKE = ethers.parseUnits("100", 6); // 100 USDC (6 decimals)
const UNSTAKING_DELAY = 7 * 24 * 60 * 60; // 7 days in seconds
const TREASURY = "0xA6591dCDff5C7616110b4f84207184aef7835048"; // Treasury address (use ethers.ZeroAddress for burn)

async function main() {
  const [deployer] = await ethers.getSigners();
  const chainId = Number((await ethers.provider.getNetwork()).chainId);
  
  console.log("=".repeat(60));
  console.log("Deploying ShogunRelayRegistry");
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
  console.log(`Min Stake: ${ethers.formatUnits(MIN_STAKE, 6)} USDC`);
  console.log(`Unstaking Delay: ${UNSTAKING_DELAY / 86400} days`);
  console.log("-".repeat(60));

  // Deploy
  console.log("\nDeploying contract...");
  const ShogunRelayRegistry = await ethers.getContractFactory("ShogunRelayRegistry");
  const registry = await ShogunRelayRegistry.deploy(
    usdcAddress,
    MIN_STAKE,
    UNSTAKING_DELAY,
    TREASURY
  );

  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();

  console.log(`\n✅ ShogunRelayRegistry deployed to: ${registryAddress}`);
  
  // Log verification command
  console.log("\n" + "-".repeat(60));
  console.log("To verify on BaseScan:");
  console.log(`npx hardhat verify --network ${network.name} ${registryAddress} ${usdcAddress} ${MIN_STAKE.toString()} ${UNSTAKING_DELAY} ${TREASURY}`);
  
  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId,
    address: registryAddress,
    deployer: deployer.address,
    stakingToken: usdcAddress,
    minStake: MIN_STAKE.toString(),
    unstakingDelay: UNSTAKING_DELAY,
    treasury: TREASURY,
    deployedAt: new Date().toISOString(),
    txHash: registry.deploymentTransaction()?.hash,
  };

  console.log("\n" + "=".repeat(60));
  console.log("Deployment Info:");
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

