
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DataSaleEscrow Implementation Security", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MockERC20");
    const token = await Token.deploy("USDC", "USDC", 6);
    const tokenAddress = await token.getAddress();

    const Registry = await ethers.getContractFactory("ShogunRelayRegistry");
    const registry = await Registry.deploy(tokenAddress, 1000, 86400, owner.address);
    const registryAddress = await registry.getAddress();

    const PostRegistry = await ethers.getContractFactory("DataPostRegistry");
    const postRegistry = await PostRegistry.deploy();
    const postRegistryAddress = await postRegistry.getAddress();

    // Deploy implementation directly
    const DataSaleEscrow = await ethers.getContractFactory("DataSaleEscrow");
    const implementation = await DataSaleEscrow.deploy(
      tokenAddress,
      registryAddress,
      postRegistryAddress
    );
    await implementation.waitForDeployment();

    return { implementation, owner, otherAccount, postRegistry };
  }

  it("Should NOT allow initializing the implementation contract", async function () {
    const { implementation, owner, postRegistry } = await loadFixture(deployFixture);

    // Create a dummy post
    const tx = await postRegistry.publishPost(
      ethers.keccak256(ethers.toUtf8Bytes("data")),
      "QmHash",
      "Description",
      "Category",
      100
    );
    const receipt = await tx.wait();

    // Find the event
    const event = receipt!.logs
      .map((log: any) => {
        try {
          return postRegistry.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((parsed: any) => parsed && parsed.name === "DataPostPublished");

    const postId = event!.args.postId;

    // Try to initialize the implementation contract
    await expect(
      implementation.initialize(postId, owner.address, owner.address, 3600)
    ).to.be.revertedWith("Already initialized");
  });
});
