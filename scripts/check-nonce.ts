
import { ethers } from "ethers";
import "dotenv/config";

async function main() {
    const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
    const provider = new ethers.JsonRpcProvider(`https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`);
    const address = "0xa6591dcdff5c7616110b4f84207184aef7835048";

    const nonce = await provider.getTransactionCount(address, "latest");
    const pendingNonce = await provider.getTransactionCount(address, "pending");
    
    console.log("Address:", address);
    console.log("Latest Nonce:", nonce);
    console.log("Pending Nonce:", pendingNonce);

    const balance = await provider.getBalance(address);
    console.log("Balance:", ethers.formatEther(balance), "ETH");

    const feeData = await provider.getFeeData();
    console.log("Max Fee Per Gas:", feeData.maxFeePerGas?.toString());
    console.log("Max Priority Fee Per Gas:", feeData.maxPriorityFeePerGas?.toString());
}

main().catch(console.error);
