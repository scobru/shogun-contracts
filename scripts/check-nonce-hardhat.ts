
import { ethers, network } from "hardhat";

async function main() {
    const address = "0xa6591dcdff5c7616110b4f84207184aef7835048";
    const nonce = await network.provider.send("eth_getTransactionCount", [address, "latest"]);
    const pendingNonce = await network.provider.send("eth_getTransactionCount", [address, "pending"]);
    
    console.log("Network:", network.name);
    console.log("Address:", address);
    console.log("Latest Nonce:", parseInt(nonce, 16));
    console.log("Pending Nonce:", parseInt(pendingNonce, 16));

    const balance = await network.provider.send("eth_getBalance", [address, "latest"]);
    console.log("Balance:", ethers.formatEther(balance), "ETH");
}

main().catch(console.error);
