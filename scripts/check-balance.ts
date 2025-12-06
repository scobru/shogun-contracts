import { ethers } from "hardhat";

/**
 * Check account balance before deployment
 * 
 * Usage:
 *   npx hardhat run scripts/check-balance.ts --network baseSepolia
 */

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("=".repeat(60));
  console.log("Account Balance Check");
  console.log("=".repeat(60));
  console.log(`Network: ${network.name} (chainId: ${network.chainId})`);
  console.log(`Account: ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  const balanceInEth = ethers.formatEther(balance);
  
  console.log(`Balance: ${balanceInEth} ETH`);
  console.log(`Balance: ${balance.toString()} wei`);
  
  // Check if balance is sufficient (at least 0.01 ETH recommended)
  const minBalance = ethers.parseEther("0.01");
  if (balance < minBalance) {
    console.log("\n⚠️  WARNING: Balance is low!");
    console.log(`   Recommended minimum: ${ethers.formatEther(minBalance)} ETH`);
    console.log(`   Current balance: ${balanceInEth} ETH`);
    console.log("\n   Please fund your account before deploying.");
  } else {
    console.log("\n✅ Balance is sufficient for deployment.");
  }
  
  // Get gas price
  try {
    const feeData = await ethers.provider.getFeeData();
    if (feeData.gasPrice) {
      console.log(`\nCurrent Gas Price: ${ethers.formatUnits(feeData.gasPrice, "gwei")} gwei`);
    }
  } catch (error) {
    console.log("\n⚠️  Could not fetch gas price");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

