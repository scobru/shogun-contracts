import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying GunDBIntegrity contract...");

  // Ottieni il deployer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Deploy del contratto GunDBIntegrity
  const GunDBIntegrity = await ethers.getContractFactory("GunDBIntegrity");
  const gunDBIntegrity = await GunDBIntegrity.deploy();
  await gunDBIntegrity.deployed();

  console.log("✅ GunDBIntegrity deployed to:", gunDBIntegrity.address);

  // Verifica del contratto (opzionale)
  console.log("🔍 Verifying contract...");
  
  try {
    await gunDBIntegrity.deployTransaction.wait(6); // Aspetta 6 blocchi
    
    await hre.run("verify:verify", {
      address: gunDBIntegrity.address,
      constructorArguments: [],
    });
    
    console.log("✅ Contract verified successfully!");
  } catch (error) {
    console.log("⚠️  Contract verification failed:", error);
  }

  console.log("🎉 Deployment completed!");
  console.log("📋 Contract address:", gunDBIntegrity.address);
  
  // Esempio di utilizzo
  console.log("\n📖 Esempio di utilizzo:");
  console.log("1. Registra un dato:");
  console.log(`   await gunDBIntegrity.registerData("0x...", "0x...");`);
  console.log("2. Verifica integrità:");
  console.log(`   const isIntact = await gunDBIntegrity.verifyIntegrity("0x...", "0x...");`);
  console.log("3. Calcola hash:");
  console.log(`   const hash = await gunDBIntegrity.calculateHash("dati...");`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 