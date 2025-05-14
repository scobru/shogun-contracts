// scripts/test-relay-auth.ts
// Script to test relay authorization with debug info

import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import Gun from "gun";
import SEA from "gun/sea";

dotenv.config();

// Force relay settings
process.env.RELAY_ENABLED = "true";
process.env.ONCHAIN_MEMBERSHIP_ENABLED = "true";

// Define GunDB callback types
interface GunAck {
  err?: string;
  ok?: any;
  [key: string]: any;
}

async function main() {
  console.log("=== RELAY AUTHORIZATION TEST ===");
  
  // Check environment variables
  console.log("Environment check:");
  console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`- RELAY_ENABLED: ${process.env.RELAY_ENABLED || 'not set'}`);
  console.log(`- ONCHAIN_MEMBERSHIP_ENABLED: ${process.env.ONCHAIN_MEMBERSHIP_ENABLED || 'not set'}`);
  console.log(`- RELAY_REGISTRY_CONTRACT: ${process.env.RELAY_REGISTRY_CONTRACT || 'not set'}`);
  console.log(`- ETHEREUM_PROVIDER_URL: ${process.env.ETHEREUM_PROVIDER_URL || 'not set'}`);
  
  // Connect to Gun explicitly without token
  console.log("\nConnecting to Gun without admin token...");
  const gun = Gun({
    peers: ["http://localhost:8765/gun"], 
    localStorage: false, 
    radisk: false,
    // Add debug option to trace operations
    debug: true
  });
  
  // Generate a new keypair
  console.log("\nGenerating new GunDB keypair...");
  let pair = await SEA.pair();
  let pubKey = pair.pub;
  console.log(`Public key: ${pubKey}`);
  
  try {
    // Create user with this keypair
    console.log("\nCreating Gun user...");
    await new Promise((resolve, reject) => {
      gun.user().create(pair.pub, pair.priv, (ack: GunAck) => {
        if (ack.err && !ack.err.includes('already created')) {
          console.warn("User creation error:", ack.err);
        } else {
          console.log("User created or already exists");
        }
        resolve(ack);
      });
    });

    // Authenticate
    console.log("\nAuthenticating with Gun...");
    await new Promise((resolve, reject) => {
      gun.user().auth(pair, (ack: GunAck) => {
        if (ack.err) {
          reject(new Error(`Login error: ${ack.err}`));
        } else {
          console.log("Login successful");
          resolve(ack);
        }
      });
    });

    // Test write operation - should fail if relay auth is working correctly
    console.log("\nAttempting to write data (should fail if relay auth is active)...");
    const testData = {
      test: "relay-auth-test",
      timestamp: Date.now()
    };
    console.log("Writing data:", testData);
    
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.log("Write operation timed out - this may indicate the server blocked the request");
        resolve(null);
      }, 5000);
      
      console.log("Sending write request to path: user/test");
      gun.user().get('test').put(testData, (ack: GunAck) => {
        clearTimeout(timeout);
        
        console.log("Server response:", ack);
        if (ack.err) {
          console.log("Write REJECTED - relay auth appears to be working");
          console.log("Error message:", ack.err);
          reject(new Error(`Data write rejected: ${ack.err}`));
        } else {
          console.log("Write SUCCEEDED - relay auth might not be active");
          resolve(ack);
        }
      });
    }).catch(err => {
      console.log("Write operation error:", err.message);
    });
    
    // Attempt to read the data back to verify if it was saved
    console.log("\nAttempting to read data back...");
    await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.log("Read timed out");
        resolve(null);
      }, 3000);
      
      gun.user().get('test').once((data: any) => {
        clearTimeout(timeout);
        console.log("Data retrieved:", data);
        
        if (data && data.test === testData.test) {
          console.log("Data was successfully stored - relay auth is NOT blocking writes");
        } else {
          console.log("Data not found or different - relay auth MAY be blocking writes");
        }
        
        resolve(data);
      });
    });
    
    console.log("\n=== TEST COMPLETE ===");
    console.log("If relay auth is properly configured and active:");
    console.log("1. The write operation should fail or be silently blocked");
    console.log("2. The data read back should be null or different from what we tried to write");
    
  } catch (error) {
    console.error("\nTest failed with error:");
    console.error(error);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
}); 