import { ethers, network } from "hardhat";

/**
 * Deploy Oracle contracts for Shogun Protocol
 * 
 * Usage:
 *   npx hardhat run scripts/deploy-oracle.ts --network baseSepolia
 * 
 * This script deploys:
 * 1. OracleFeedRegistry (references existing ShogunRelayRegistry)
 * 
 * Note: ShogunOracle is abstract and should be inherited by consumer contracts.
 * 
 * Prerequisites:
 * - ShogunRelayRegistry must already be deployed
 */

// Known ShogunRelayRegistry addresses per network
const RELAY_REGISTRY_ADDRESSES: { [chainId: number]: string } = {
    84532: "0x412D3Cf47907C231EE26D261714D2126eb3735e6", // Base Sepolia
    8453: "",  // Base Mainnet (TBD)
    31337: "", // Hardhat local (will be set during test)
};

interface OracleDeploymentInfo {
    network: string;
    chainId: number;
    deployer: string;
    contracts: {
        oracleFeedRegistry?: string;
    };
    dependencies: {
        relayRegistry: string;
    };
    deployedAt: string;
}

async function main() {
    const [deployer] = await ethers.getSigners();
    const chainId = Number((await ethers.provider.getNetwork()).chainId);

    console.log("=".repeat(60));
    console.log("Deploying Shogun Oracle Contracts");
    console.log("=".repeat(60));
    console.log(`Network: ${network.name} (chainId: ${chainId})`);
    console.log(`Deployer: ${deployer.address}`);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`Balance: ${ethers.formatEther(balance)} ETH`);

    // Get RelayRegistry address for this network
    let relayRegistryAddress = RELAY_REGISTRY_ADDRESSES[chainId];

    // Allow override via environment variable
    if (process.env.RELAY_REGISTRY_ADDRESS) {
        relayRegistryAddress = process.env.RELAY_REGISTRY_ADDRESS;
        console.log(`Using RELAY_REGISTRY_ADDRESS from environment: ${relayRegistryAddress}`);
    }

    if (!relayRegistryAddress) {
        throw new Error(`RelayRegistry address not configured for chainId ${chainId}. Set RELAY_REGISTRY_ADDRESS env var.`);
    }

    console.log(`RelayRegistry Address: ${relayRegistryAddress}`);
    console.log("-".repeat(60));

    const deploymentInfo: OracleDeploymentInfo = {
        network: network.name,
        chainId,
        deployer: deployer.address,
        contracts: {},
        dependencies: {
            relayRegistry: relayRegistryAddress,
        },
        deployedAt: new Date().toISOString(),
    };

    // Verify RelayRegistry exists
    console.log("\nVerifying RelayRegistry...");
    const relayRegistryCode = await ethers.provider.getCode(relayRegistryAddress);
    if (relayRegistryCode === "0x") {
        throw new Error(`No contract found at RelayRegistry address: ${relayRegistryAddress}`);
    }
    console.log("✅ RelayRegistry verified");

    // Step 1: Deploy OracleFeedRegistry
    console.log("\n[1/1] Deploying OracleFeedRegistry...");
    const OracleFeedRegistry = await ethers.getContractFactory("OracleFeedRegistry");
    const oracleFeedRegistry = await OracleFeedRegistry.deploy(relayRegistryAddress);
    await oracleFeedRegistry.waitForDeployment();
    const oracleFeedRegistryAddress = await oracleFeedRegistry.getAddress();
    deploymentInfo.contracts.oracleFeedRegistry = oracleFeedRegistryAddress;
    console.log(`✅ OracleFeedRegistry deployed to: ${oracleFeedRegistryAddress}`);

    // Print verification commands
    console.log("\n" + "=".repeat(60));
    console.log("Verification Commands:");
    console.log("=".repeat(60));
    console.log(`\n# OracleFeedRegistry:`);
    console.log(`npx hardhat verify --network ${network.name} ${oracleFeedRegistryAddress} ${relayRegistryAddress}`);

    // Print deployment summary
    console.log("\n" + "=".repeat(60));
    console.log("Deployment Summary:");
    console.log("=".repeat(60));
    console.log(JSON.stringify(deploymentInfo, null, 2));
    console.log("=".repeat(60));

    // Print usage info
    console.log("\n" + "=".repeat(60));
    console.log("Usage:");
    console.log("=".repeat(60));
    console.log(`
To register a feed (from a registered relay):

  const feedRegistry = await ethers.getContractAt("OracleFeedRegistry", "${oracleFeedRegistryAddress}");
  await feedRegistry.registerFeed(
    "ETH/USD",           // name
    0,                   // DataType.PRICE
    "(uint256)",         // schema
    1000000,             // 1 USDC (6 decimals)
    60                   // update every 60 seconds
  );

To use ShogunOracle in your contract:

  import "./oracle/ShogunOracle.sol";
  
  contract MyContract is ShogunOracle {
    constructor(address _registry) ShogunOracle(_registry) {}
    
    function useOracleData(OraclePacket calldata packet)
      external
      verifyOraclePacket(keccak256("ETH/USD"), packet)
    {
      uint256 price = abi.decode(packet.payload, (uint256));
      // Use price...
    }
  }
`);

    return deploymentInfo;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
