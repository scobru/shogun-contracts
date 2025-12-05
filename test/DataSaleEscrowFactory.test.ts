import { expect } from "chai";
import { ethers } from "hardhat";
import { DataSaleEscrowFactory, DataSaleEscrow, DataPostRegistry, ShogunRelayRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("DataSaleEscrowFactory", function () {
  let factory: DataSaleEscrowFactory;
  let postRegistry: DataPostRegistry;
  let relayRegistry: ShogunRelayRegistry;
  let mockUSDC: any;
  
  let owner: SignerWithAddress;
  let seller: SignerWithAddress;
  let buyer1: SignerWithAddress;
  let buyer2: SignerWithAddress;

  const PROOF_HASH = ethers.id("test-data-123");
  const ENCRYPTED_DATA_HASH = "QmTestCid123";
  const DESCRIPTION = "Market analysis Q4 2024 dataset";
  const CATEGORY = "analytics";
  const PRICE = ethers.parseUnits("10", 6); // 10 USDC
  const COUNTDOWN_DURATION = 7 * 24 * 60 * 60; // 7 days

  let postId: string;

  beforeEach(async function () {
    [owner, seller, buyer1, buyer2] = await ethers.getSigners();

    // Deploy mock USDC
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUSDC = await MockERC20.deploy("Mock USDC", "USDC", 6);
    await mockUSDC.waitForDeployment();

    // Deploy registry
    const MIN_STAKE = ethers.parseUnits("100", 6);
    const UNSTAKING_DELAY = 7 * 24 * 60 * 60;
    
    const ShogunRelayRegistry = await ethers.getContractFactory("ShogunRelayRegistry");
    relayRegistry = await ShogunRelayRegistry.deploy(
      await mockUSDC.getAddress(),
      MIN_STAKE,
      UNSTAKING_DELAY,
      owner.address
    );
    await relayRegistry.waitForDeployment();

    // Deploy DataPostRegistry
    const DataPostRegistry = await ethers.getContractFactory("DataPostRegistry");
    postRegistry = await DataPostRegistry.deploy(owner.address);
    await postRegistry.waitForDeployment();

    // Deploy Factory
    const DataSaleEscrowFactory = await ethers.getContractFactory("DataSaleEscrowFactory");
    factory = await DataSaleEscrowFactory.deploy(
      await mockUSDC.getAddress(),
      await relayRegistry.getAddress(),
      await postRegistry.getAddress()
    );
    await factory.waitForDeployment();

    // Publish a post
    const tx = await postRegistry.connect(seller).publishPost(
      PROOF_HASH,
      ENCRYPTED_DATA_HASH,
      DESCRIPTION,
      CATEGORY,
      PRICE
    );
    postId = await getPostIdFromEvent(tx);
  });

  describe("Factory Creation", function () {
    it("Should deploy factory with correct template", async function () {
      const template = await factory.template();
      expect(template).to.not.equal(ethers.ZeroAddress);

      // Verify template is a valid escrow contract
      const templateEscrow = await ethers.getContractAt("DataSaleEscrow", template);
      const paymentToken = await templateEscrow.paymentToken();
      expect(paymentToken).to.equal(await mockUSDC.getAddress());
    });
  });

  describe("Create Escrow", function () {
    it("Should create escrow for valid post", async function () {
      const tx = await factory.connect(buyer1).createEscrow(postId, seller.address, COUNTDOWN_DURATION);
      
      await expect(tx).to.emit(factory, "EscrowCreated");

      const escrows = await factory.getEscrowsByBuyer(buyer1.address);
      expect(escrows.length).to.equal(1);
      expect(escrows[0]).to.not.equal(ethers.ZeroAddress);
    });

    it("Should initialize escrow correctly", async function () {
      const tx = await factory.connect(buyer1).createEscrow(postId, seller.address, COUNTDOWN_DURATION);
      const escrowAddress = await getEscrowAddressFromEvent(tx);
      
      const escrow = await ethers.getContractAt("DataSaleEscrow", escrowAddress);
      const escrowInfo = await escrow.getEscrowInfo();

      expect(escrowInfo.postId).to.equal(postId);
      expect(escrowInfo.seller).to.equal(seller.address);
      expect(escrowInfo.buyer).to.equal(buyer1.address);
      expect(escrowInfo.priceUSDC).to.equal(PRICE);
      expect(escrowInfo.status).to.equal(0); // PENDING_PAYMENT
    });

    it("Should fail if post not found", async function () {
      const fakePostId = ethers.id("fake-post");
      
      await expect(
        factory.connect(buyer1).createEscrow(fakePostId, seller.address, COUNTDOWN_DURATION)
      ).to.be.revertedWith("Post not found");
    });

    it("Should fail if post not active", async function () {
      await postRegistry.connect(seller).deactivatePost(postId);

      await expect(
        factory.connect(buyer1).createEscrow(postId, seller.address, COUNTDOWN_DURATION)
      ).to.be.revertedWith("Post not active");
    });

    it("Should fail if seller address doesn't match post", async function () {
      await expect(
        factory.connect(buyer1).createEscrow(postId, buyer2.address, COUNTDOWN_DURATION)
      ).to.be.revertedWith("Invalid seller");
    });

    it("Should create multiple escrows for same post", async function () {
      await factory.connect(buyer1).createEscrow(postId, seller.address, COUNTDOWN_DURATION);
      await factory.connect(buyer2).createEscrow(postId, seller.address, COUNTDOWN_DURATION);

      const buyer1Escrows = await factory.getEscrowsByBuyer(buyer1.address);
      const buyer2Escrows = await factory.getEscrowsByBuyer(buyer2.address);
      const sellerEscrows = await factory.getEscrowsBySeller(seller.address);
      const postEscrows = await factory.getEscrowsByPost(postId);

      expect(buyer1Escrows.length).to.equal(1);
      expect(buyer2Escrows.length).to.equal(1);
      expect(sellerEscrows.length).to.equal(2);
      expect(postEscrows.length).to.equal(2);
    });
  });

  describe("Query Functions", function () {
    let escrow1Address: string;
    let escrow2Address: string;

    beforeEach(async function () {
      const tx1 = await factory.connect(buyer1).createEscrow(postId, seller.address, COUNTDOWN_DURATION);
      escrow1Address = await getEscrowAddressFromEvent(tx1);

      // Create another post and escrow
      const tx2 = await postRegistry.connect(seller).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH + "2",
        DESCRIPTION + " 2",
        CATEGORY,
        ethers.parseUnits("20", 6)
      );
      const postId2 = await getPostIdFromEvent(tx2);

      const tx3 = await factory.connect(buyer2).createEscrow(postId2, seller.address, COUNTDOWN_DURATION);
      escrow2Address = await getEscrowAddressFromEvent(tx3);
    });

    it("Should get escrows by buyer", async function () {
      const buyer1Escrows = await factory.getEscrowsByBuyer(buyer1.address);
      expect(buyer1Escrows.length).to.equal(1);
      expect(buyer1Escrows[0]).to.equal(escrow1Address);

      const buyer2Escrows = await factory.getEscrowsByBuyer(buyer2.address);
      expect(buyer2Escrows.length).to.equal(1);
      expect(buyer2Escrows[0]).to.equal(escrow2Address);
    });

    it("Should get escrows by seller", async function () {
      const sellerEscrows = await factory.getEscrowsBySeller(seller.address);
      expect(sellerEscrows.length).to.equal(2);
      expect(sellerEscrows).to.include(escrow1Address);
      expect(sellerEscrows).to.include(escrow2Address);
    });

    it("Should get escrows by post", async function () {
      const postEscrows = await factory.getEscrowsByPost(postId);
      expect(postEscrows.length).to.equal(1);
      expect(postEscrows[0]).to.equal(escrow1Address);
    });

    it("Should get all escrows", async function () {
      const allEscrows = await factory.getAllEscrows();
      expect(allEscrows.length).to.equal(2);
      expect(allEscrows).to.include(escrow1Address);
      expect(allEscrows).to.include(escrow2Address);
    });

    it("Should return correct escrow count", async function () {
      let count = await factory.getEscrowCount();
      expect(count).to.equal(2n);

      // Create another escrow
      const tx3 = await postRegistry.connect(seller).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH + "3",
        DESCRIPTION + " 3",
        CATEGORY,
        ethers.parseUnits("15", 6)
      );
      const postId3 = await getPostIdFromEvent(tx3);
      await factory.connect(buyer1).createEscrow(postId3, seller.address, COUNTDOWN_DURATION);

      count = await factory.getEscrowCount();
      expect(count).to.equal(3n);
    });
  });

  describe("Multiple Posts and Escrows", function () {
    it("Should handle multiple posts from same seller", async function () {
      // Create multiple posts
      const tx1 = await postRegistry.connect(seller).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH + "1",
        DESCRIPTION + " 1",
        CATEGORY,
        PRICE
      );
      const postId1 = await getPostIdFromEvent(tx1);

      const tx2 = await postRegistry.connect(seller).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH + "2",
        DESCRIPTION + " 2",
        CATEGORY,
        ethers.parseUnits("20", 6)
      );
      const postId2 = await getPostIdFromEvent(tx2);

      // Create escrows for each
      await factory.connect(buyer1).createEscrow(postId1, seller.address, COUNTDOWN_DURATION);
      await factory.connect(buyer2).createEscrow(postId2, seller.address, COUNTDOWN_DURATION);

      const sellerEscrows = await factory.getEscrowsBySeller(seller.address);
      expect(sellerEscrows.length).to.equal(2);

      const post1Escrows = await factory.getEscrowsByPost(postId1);
      expect(post1Escrows.length).to.equal(1);

      const post2Escrows = await factory.getEscrowsByPost(postId2);
      expect(post2Escrows.length).to.equal(1);
    });
  });

  // Helper functions
  async function getPostIdFromEvent(tx: any): Promise<string> {
    const receipt = await tx.wait();
    const eventSig = ethers.id("DataPostPublished(bytes32,address,bytes32,string,string,uint256)");
    const event = receipt.logs.find(
      (log: any) => log.topics[0] === eventSig
    );
    
    if (!event) {
      throw new Error("DataPostPublished event not found");
    }
    
    // postId is the first indexed parameter (bytes32), so it's in topics[1]
    return ethers.hexlify(event.topics[1]);
  }

  async function getEscrowAddressFromEvent(tx: any): Promise<string> {
    const receipt = await tx.wait();
    const event = receipt.logs.find(
      (log: any) => {
        try {
          const eventSig = ethers.id("EscrowCreated(address,bytes32,address,address,uint256)");
          return log.topics[0] === eventSig;
        } catch {
          return false;
        }
      }
    );
    
    if (!event) {
      throw new Error("EscrowCreated event not found");
    }
    
    // Escrow address is indexed, so it's in topics[1] (first indexed param)
    // topics[0] = event signature
    // topics[1] = escrow (address, indexed)
    // topics[2] = postId (bytes32, indexed)
    // topics[3] = seller (address, indexed)
    
    if (event.topics.length > 1) {
      // Address is in topics[1], need to pad to 32 bytes
      return ethers.getAddress(ethers.dataSlice(event.topics[1], 12, 32));
    }
    
    throw new Error("Could not extract escrow address from event");
  }
});

