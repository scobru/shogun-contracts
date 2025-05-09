import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying OracleBridge with account:", deployer.address);

  const OracleBridge = await ethers.getContractFactory("OracleBridge");
  const oracle = await OracleBridge.deploy();
  await oracle.deployed();

  console.log("OracleBridge deployed to:", oracle.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});