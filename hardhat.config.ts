import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

// Ensure you have a .env file with your PRIVATE_KEY and SEPOLIA_API_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const SEPOLIA_API_KEY = process.env.SEPOLIA_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_API_KEY}`,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    optimismSepolia: {
      url: `https://opt-sepolia.g.alchemy.com/v2/${SEPOLIA_API_KEY}`,
      accounts: [PRIVATE_KEY],
      chainId: 11155420.,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
