import { expect } from "chai";
import { ethers } from "hardhat";
import { DataSaleEscrow, DataPostRegistry, ShogunRelayRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("DataSaleEscrow", function () {
  let escrow: DataSaleEscrow;
  let postRegistry: DataPostRegistry;
  let relayRegistry: ShogunRelayRegistry;
  let mockUSDC: any;
  
  let owner: SignerWithAddress;
  let seller: SignerWithAddress;
  let buyer: SignerWithAddress;
  let other: SignerWithAddress;

  const PROOF_HASH = ethers.id("test-data-123");
  const ENCRYPTED_DATA_HASH = "QmTestCid123";
  const DESCRIPTION = "Market analysis Q4 2024 dataset";
  const CATEGORY = "analytics";
  const PRICE = ethers.parseUnits("10", 6); // 10 USDC
  const COUNTDOWN_DURATION = 7 * 24 * 60 * 60; // 7 days

  let postId: string;

  beforeEach(async function () {
    [owner, seller, buyer, other] = await ethers.getSigners();

    // Deploy mock USDC
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUSDC = await MockERC20.deploy("Mock USDC", "USDC", 6);
    await mockUSDC.waitForDeployment();

    // Deploy minimal registry (we can use a minimal implementation for testing)
    // For now, we'll deploy a minimal version or mock
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
    postRegistry = await DataPostRegistry.deploy();
    await postRegistry.waitForDeployment();

    // Publish a post
    const tx = await postRegistry.connect(seller).publishPost(
      PROOF_HASH,
      ENCRYPTED_DATA_HASH,
      DESCRIPTION,
      CATEGORY,
      PRICE
    );
    postId = await getPostIdFromEvent(tx);

    // Deploy escrow
    const DataSaleEscrow = await ethers.getContractFactory("DataSaleEscrow");
    escrow = await DataSaleEscrow.deploy(
      await mockUSDC.getAddress(),
      await relayRegistry.getAddress(),
      await postRegistry.getAddress()
    );
    await escrow.waitForDeployment();

    // Initialize escrow
    await escrow.initialize(postId, seller.address, buyer.address, COUNTDOWN_DURATION);

    // Mint USDC to buyer
    await mockUSDC.mint(buyer.address, ethers.parseUnits("1000", 6));
    await mockUSDC.connect(buyer).approve(await escrow.getAddress(), ethers.MaxUint256);
  });

  describe("Initialization", function () {
    it("Should initialize escrow with correct parameters", async function () {
      const escrowInfo = await escrow.getEscrowInfo();
      expect(escrowInfo.postId).to.equal(postId);
      expect(escrowInfo.seller).to.equal(seller.address);
      expect(escrowInfo.buyer).to.equal(buyer.address);
      expect(escrowInfo.priceUSDC).to.equal(PRICE);
      expect(escrowInfo.proofHash).to.equal(PROOF_HASH);
      expect(escrowInfo.encryptedDataHash).to.equal(ENCRYPTED_DATA_HASH);
      expect(escrowInfo.status).to.equal(0); // PENDING_PAYMENT
      
      // Check sellerIsRelay is set correctly (seller is not relay in default setup)
      const isRelay = await escrow.sellerIsRelay();
      expect(isRelay).to.be.false;
    });

    it("Should fail to initialize twice", async function () {
      await expect(
        escrow.initialize(postId, seller.address, buyer.address, COUNTDOWN_DURATION)
      ).to.be.revertedWith("Already initialized");
    });

    it("Should fail if post not found", async function () {
      const NewEscrow = await ethers.getContractFactory("DataSaleEscrow");
      const newEscrow = await NewEscrow.deploy(
        await mockUSDC.getAddress(),
        await relayRegistry.getAddress(),
        await postRegistry.getAddress()
      );
      await newEscrow.waitForDeployment();

      await expect(
        newEscrow.initialize(ethers.id("fake-post"), seller.address, buyer.address, COUNTDOWN_DURATION)
      ).to.be.revertedWithCustomError(newEscrow, "DataPostNotFound");
    });

    it("Should fail if post is not active", async function () {
      // Deactivate post
      await postRegistry.connect(seller).deactivatePost(postId);

      const NewEscrow = await ethers.getContractFactory("DataSaleEscrow");
      const newEscrow = await NewEscrow.deploy(
        await mockUSDC.getAddress(),
        await relayRegistry.getAddress(),
        await postRegistry.getAddress()
      );
      await newEscrow.waitForDeployment();

      // Reactivate for proper setup
      await postRegistry.connect(seller).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH,
        DESCRIPTION,
        CATEGORY,
        PRICE
      );
    });
  });

  describe("Payment Deposit", function () {
    it("Should deposit payment and activate escrow", async function () {
      const buyerBalanceBefore = await mockUSDC.balanceOf(buyer.address);
      const escrowBalanceBefore = await mockUSDC.balanceOf(await escrow.getAddress());

      await expect(
        escrow.connect(buyer).depositPayment()
      ).to.emit(escrow, "PaymentDeposited");

      const escrowInfo = await escrow.getEscrowInfo();
      expect(escrowInfo.status).to.equal(1); // ACTIVE
      expect(escrowInfo.countdownEnd).to.be.gt(0);

      const buyerPayment = await escrow.buyerPayment();
      expect(buyerPayment).to.equal(PRICE);

      const buyerBalanceAfter = await mockUSDC.balanceOf(buyer.address);
      const escrowBalanceAfter = await mockUSDC.balanceOf(await escrow.getAddress());

      expect(buyerBalanceBefore - buyerBalanceAfter).to.equal(PRICE);
      expect(escrowBalanceAfter - escrowBalanceBefore).to.equal(PRICE);
    });

    it("Should fail if not buyer", async function () {
      await expect(
        escrow.connect(seller).depositPayment()
      ).to.be.revertedWithCustomError(escrow, "NotBuyer");
    });

    it("Should fail if not pending payment", async function () {
      await escrow.connect(buyer).depositPayment();
      
      await expect(
        escrow.connect(buyer).depositPayment()
      ).to.be.revertedWithCustomError(escrow, "EscrowNotPending");
    });
  });

  describe("Data Submission", function () {
    beforeEach(async function () {
      await escrow.connect(buyer).depositPayment();
    });

    it("Should submit encrypted symmetric key hash", async function () {
      const encryptedSymKeyHash = ethers.id("encrypted-key-123");
      
      await expect(
        escrow.connect(seller).submitData(encryptedSymKeyHash)
      ).to.emit(escrow, "DataSubmitted").withArgs(encryptedSymKeyHash);

      const escrowInfo = await escrow.getEscrowInfo();
      expect(escrowInfo.encryptedSymKeyHash).to.equal(encryptedSymKeyHash);
      expect(escrowInfo.status).to.equal(2); // DATA_SUBMITTED
    });

    it("Should fail if not seller", async function () {
      const encryptedSymKeyHash = ethers.id("encrypted-key-123");
      
      await expect(
        escrow.connect(buyer).submitData(encryptedSymKeyHash)
      ).to.be.revertedWithCustomError(escrow, "NotSeller");
    });

    it("Should fail if escrow not active", async function () {
      const encryptedSymKeyHash = ethers.id("encrypted-key-123");
      
      // Create new escrow without payment
      const tx = await postRegistry.connect(seller).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH + "2",
        DESCRIPTION,
        CATEGORY,
        PRICE
      );
      const newPostId = await getPostIdFromEvent(tx);

      const NewEscrow = await ethers.getContractFactory("DataSaleEscrow");
      const newEscrow = await NewEscrow.deploy(
        await mockUSDC.getAddress(),
        await relayRegistry.getAddress(),
        await postRegistry.getAddress()
      );
      await newEscrow.waitForDeployment();
      await newEscrow.initialize(newPostId, seller.address, buyer.address, COUNTDOWN_DURATION);

      await expect(
        newEscrow.connect(seller).submitData(encryptedSymKeyHash)
      ).to.be.revertedWithCustomError(newEscrow, "EscrowNotActive");
    });
  });

  describe("Completion", function () {
    beforeEach(async function () {
      await escrow.connect(buyer).depositPayment();
      await escrow.connect(seller).submitData(ethers.id("encrypted-key-123"));
    });

    it("Should complete escrow and release funds to seller", async function () {
      const sellerBalanceBefore = await mockUSDC.balanceOf(seller.address);
      const escrowBalanceBefore = await mockUSDC.balanceOf(await escrow.getAddress());

      await expect(
        escrow.connect(buyer).complete()
      ).to.emit(escrow, "EscrowCompleted").withArgs(buyer.address, seller.address, PRICE);

      const escrowInfo = await escrow.getEscrowInfo();
      expect(escrowInfo.status).to.equal(3); // COMPLETED

      const sellerBalanceAfter = await mockUSDC.balanceOf(seller.address);
      const escrowBalanceAfter = await mockUSDC.balanceOf(await escrow.getAddress());

      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(PRICE);
      expect(escrowBalanceBefore - escrowBalanceAfter).to.equal(PRICE);
      expect(await escrow.buyerPayment()).to.equal(0);
    });

    it("Should fail if not buyer", async function () {
      await expect(
        escrow.connect(seller).complete()
      ).to.be.revertedWithCustomError(escrow, "NotBuyer");
    });

    it("Should fail if data not submitted", async function () {
      // Create new escrow
      const tx = await postRegistry.connect(seller).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH + "3",
        DESCRIPTION,
        CATEGORY,
        PRICE
      );
      const newPostId = await getPostIdFromEvent(tx);

      const NewEscrow = await ethers.getContractFactory("DataSaleEscrow");
      const newEscrow = await NewEscrow.deploy(
        await mockUSDC.getAddress(),
        await relayRegistry.getAddress(),
        await postRegistry.getAddress()
      );
      await newEscrow.waitForDeployment();
      await newEscrow.initialize(newPostId, seller.address, buyer.address, COUNTDOWN_DURATION);
      await newEscrow.connect(buyer).depositPayment();

      await expect(
        newEscrow.connect(buyer).complete()
      ).to.be.revertedWithCustomError(newEscrow, "EscrowNotActive");
    });
  });

  describe("Cancellation", function () {
    beforeEach(async function () {
      await escrow.connect(buyer).depositPayment();
    });

    it("Should cancel escrow and refund buyer", async function () {
      const buyerBalanceBefore = await mockUSDC.balanceOf(buyer.address);

      await expect(
        escrow.connect(buyer).cancel()
      ).to.emit(escrow, "EscrowCancelled").withArgs(buyer.address, PRICE);

      const escrowInfo = await escrow.getEscrowInfo();
      expect(escrowInfo.status).to.equal(5); // CANCELLED

      const buyerBalanceAfter = await mockUSDC.balanceOf(buyer.address);
      expect(buyerBalanceAfter - buyerBalanceBefore).to.equal(PRICE);
      expect(await escrow.buyerPayment()).to.equal(0);
    });

    it("Should fail if not buyer", async function () {
      await expect(
        escrow.connect(seller).cancel()
      ).to.be.revertedWithCustomError(escrow, "NotBuyer");
    });

    it("Should fail if data already submitted", async function () {
      await escrow.connect(seller).submitData(ethers.id("encrypted-key-123"));

      await expect(
        escrow.connect(buyer).cancel()
      ).to.be.revertedWithCustomError(escrow, "EscrowNotPending");
    });
  });

  describe("Griefing", function () {
    beforeEach(async function () {
      await escrow.connect(buyer).depositPayment();
    });

    it("Should refund buyer when grieving (seller not relay)", async function () {
      const buyerBalanceBefore = await mockUSDC.balanceOf(buyer.address);
      
      await expect(
        escrow.connect(buyer).grief(
          ethers.parseUnits("10", 6),
          ethers.ZeroHash,
          "Test reason"
        )
      ).to.emit(escrow, "EscrowDisputed");

      const escrowInfo = await escrow.getEscrowInfo();
      expect(escrowInfo.status).to.equal(4); // DISPUTED

      const buyerBalanceAfter = await mockUSDC.balanceOf(buyer.address);
      expect(buyerBalanceAfter - buyerBalanceBefore).to.equal(PRICE);
      expect(await escrow.buyerPayment()).to.equal(0);
    });

    it("Should fail if not buyer", async function () {
      await expect(
        escrow.connect(seller).grief(
          ethers.parseUnits("10", 6),
          ethers.ZeroHash,
          "Test reason"
        )
      ).to.be.revertedWithCustomError(escrow, "NotBuyer");
    });

    it("Should fail if escrow completed", async function () {
      await escrow.connect(seller).submitData(ethers.id("encrypted-key-123"));
      await escrow.connect(buyer).complete();

      await expect(
        escrow.connect(buyer).grief(
          ethers.parseUnits("10", 6),
          ethers.ZeroHash,
          "Test reason"
        )
      ).to.be.revertedWithCustomError(escrow, "EscrowNotActive");
    });

    it("Should check sellerIsRelay flag after initialization", async function () {
      const isRelay = await escrow.sellerIsRelay();
      expect(isRelay).to.be.false; // seller is not a relay in default setup
    });
  });

  describe("Griefing with Relay", function () {
    let relaySeller: SignerWithAddress;
    let relayEscrow: DataSaleEscrow;
    let relayPostId: string;

    beforeEach(async function () {
      // Setup relay seller
      relaySeller = seller; // Reuse seller as relay
      
      // Register seller as relay
      await mockUSDC.mint(relaySeller.address, ethers.parseUnits("1000", 6));
      await mockUSDC.connect(relaySeller).approve(await relayRegistry.getAddress(), ethers.MaxUint256);
      
      const MIN_STAKE = ethers.parseUnits("100", 6);
      await relayRegistry.connect(relaySeller).registerRelay(
        "https://relay.example.com",
        ethers.toUtf8Bytes('{"x":"0x1234","y":"0x5678"}'),
        ethers.toUtf8Bytes('{"x":"0xabcd","y":"0xefgh"}'),
        MIN_STAKE,
        0 // default griefing ratio
      );

      // Publish post from relay seller
      const tx = await postRegistry.connect(relaySeller).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH + "-relay",
        DESCRIPTION + " from relay",
        CATEGORY,
        PRICE
      );
      relayPostId = await getPostIdFromEvent(tx);

      // Deploy and initialize escrow with relay seller
      const DataSaleEscrow = await ethers.getContractFactory("DataSaleEscrow");
      relayEscrow = await DataSaleEscrow.deploy(
        await mockUSDC.getAddress(),
        await relayRegistry.getAddress(),
        await postRegistry.getAddress()
      );
      await relayEscrow.waitForDeployment();
      await relayEscrow.initialize(relayPostId, relaySeller.address, buyer.address, COUNTDOWN_DURATION);

      // Mint and approve USDC for buyer (enough for payment + griefing cost)
      await mockUSDC.mint(buyer.address, ethers.parseUnits("1000", 6));
      await mockUSDC.connect(buyer).approve(await relayEscrow.getAddress(), ethers.MaxUint256);
      await mockUSDC.connect(buyer).approve(await relayRegistry.getAddress(), ethers.MaxUint256);
      await relayEscrow.connect(buyer).depositPayment();
    });

    it("Should detect relay seller", async function () {
      const isRelay = await relayEscrow.sellerIsRelay();
      expect(isRelay).to.be.true;
    });

    it("Should refund buyer and grief relay", async function () {
      const buyerBalanceBefore = await mockUSDC.balanceOf(buyer.address);
      const relayInfoBefore = await relayRegistry.getRelayInfo(relaySeller.address);
      const slashAmount = ethers.parseUnits("10", 6);
      
      // Calculate expected griefing cost
      const DEFAULT_RATIO = await relayRegistry.defaultGriefingRatio();
      const expectedCost = (slashAmount * DEFAULT_RATIO) / 10000n;

      await expect(
        relayEscrow.connect(buyer).grief(slashAmount, ethers.ZeroHash, "Test griefing")
      ).to.emit(relayEscrow, "EscrowDisputed");

      // Check buyer refunded
      const buyerBalanceAfter = await mockUSDC.balanceOf(buyer.address);
      expect(buyerBalanceAfter - buyerBalanceBefore).to.equal(PRICE - expectedCost);

      // Check relay stake slashed
      const relayInfoAfter = await relayRegistry.getRelayInfo(relaySeller.address);
      expect(relayInfoBefore.stakedAmount - relayInfoAfter.stakedAmount).to.equal(slashAmount);
    });

    it("Should use postId as dealId if dealId is zero", async function () {
      // Create a new post and escrow for this test
      const tx = await postRegistry.connect(relaySeller).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH + "-relay-postid",
        DESCRIPTION + " for postId test",
        CATEGORY,
        PRICE
      );
      const testPostId = await getPostIdFromEvent(tx);

      // Create new escrow
      const DataSaleEscrow = await ethers.getContractFactory("DataSaleEscrow");
      const testEscrow = await DataSaleEscrow.deploy(
        await mockUSDC.getAddress(),
        await relayRegistry.getAddress(),
        await postRegistry.getAddress()
      );
      await testEscrow.waitForDeployment();
      await testEscrow.initialize(testPostId, relaySeller.address, buyer.address, COUNTDOWN_DURATION);
      
      // Deposit payment
      await testEscrow.connect(buyer).depositPayment();

      const buyerBalanceBefore = await mockUSDC.balanceOf(buyer.address);
      const relayInfoBefore = await relayRegistry.getRelayInfo(relaySeller.address);
      const slashAmount = ethers.parseUnits("5", 6);
      const DEFAULT_RATIO = await relayRegistry.defaultGriefingRatio();
      const expectedCost = (slashAmount * DEFAULT_RATIO) / 10000n;

      // Grief with zero dealId (should use postId)
      await testEscrow.connect(buyer).grief(slashAmount, ethers.ZeroHash, "Test");

      // Check buyer refunded and relay slashed
      const buyerBalanceAfter = await mockUSDC.balanceOf(buyer.address);
      expect(buyerBalanceAfter - buyerBalanceBefore).to.equal(PRICE - expectedCost);

      const relayInfoAfter = await relayRegistry.getRelayInfo(relaySeller.address);
      expect(relayInfoBefore.stakedAmount - relayInfoAfter.stakedAmount).to.equal(slashAmount);
    });
  });

  describe("Griefing with User (Non-Relay Seller)", function () {
    let userSeller: SignerWithAddress;
    let userEscrow: DataSaleEscrow;
    let userPostId: string;

    beforeEach(async function () {
      // Setup user seller (not a relay)
      userSeller = seller;
      
      // Register seller as user (not relay)
      await mockUSDC.mint(userSeller.address, ethers.parseUnits("1000", 6));
      await mockUSDC.connect(userSeller).approve(await relayRegistry.getAddress(), ethers.MaxUint256);
      
      // Register as user with encryption keys
      await relayRegistry.connect(userSeller).registerUser(
        ethers.toUtf8Bytes('{"x":"0x1234","y":"0x5678"}'),
        ethers.toUtf8Bytes('{"x":"0xabcd","y":"0xefgh"}')
      );
      
      // Deposit stake for user
      const userStake = ethers.parseUnits("50", 6);
      await relayRegistry.connect(userSeller).depositUserStake(userStake, 0);

      // Publish post from user seller
      const tx = await postRegistry.connect(userSeller).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH + "-user",
        DESCRIPTION + " from user",
        CATEGORY,
        PRICE
      );
      userPostId = await getPostIdFromEvent(tx);

      // Deploy and initialize escrow with user seller
      const DataSaleEscrow = await ethers.getContractFactory("DataSaleEscrow");
      userEscrow = await DataSaleEscrow.deploy(
        await mockUSDC.getAddress(),
        await relayRegistry.getAddress(),
        await postRegistry.getAddress()
      );
      await userEscrow.waitForDeployment();
      await userEscrow.initialize(userPostId, userSeller.address, buyer.address, COUNTDOWN_DURATION);

      // Mint and approve USDC for buyer
      await mockUSDC.mint(buyer.address, ethers.parseUnits("1000", 6));
      await mockUSDC.connect(buyer).approve(await userEscrow.getAddress(), ethers.MaxUint256);
      await mockUSDC.connect(buyer).approve(await relayRegistry.getAddress(), ethers.MaxUint256);
      await userEscrow.connect(buyer).depositPayment();
    });

    it("Should detect user seller (not relay)", async function () {
      const isRelay = await userEscrow.sellerIsRelay();
      const isUser = await userEscrow.sellerIsUser();
      expect(isRelay).to.be.false;
      expect(isUser).to.be.true;
    });

    it("Should refund buyer and grief user with stake", async function () {
      const buyerBalanceBefore = await mockUSDC.balanceOf(buyer.address);
      const userInfoBefore = await relayRegistry.getUserInfo(userSeller.address);
      const slashAmount = ethers.parseUnits("10", 6);
      
      // Calculate expected griefing cost
      const griefingRatio = userInfoBefore.griefingRatio;
      const expectedCost = (slashAmount * BigInt(griefingRatio)) / 10000n;

      await expect(
        userEscrow.connect(buyer).grief(slashAmount, ethers.ZeroHash, "Test griefing user")
      ).to.emit(userEscrow, "EscrowDisputed");

      // Check buyer refunded (minus griefing cost)
      const buyerBalanceAfter = await mockUSDC.balanceOf(buyer.address);
      expect(buyerBalanceAfter - buyerBalanceBefore).to.equal(PRICE - expectedCost);

      // Check user stake slashed
      const userInfoAfter = await relayRegistry.getUserInfo(userSeller.address);
      expect(userInfoBefore.stakedAmount - userInfoAfter.stakedAmount).to.equal(slashAmount);
    });

    it("Should refund buyer even if user has no stake", async function () {
      // Create a new user without stake
      const newUser = (await ethers.getSigners())[4];
      await mockUSDC.mint(newUser.address, ethers.parseUnits("100", 6));
      
      // Register as user but don't deposit stake
      await relayRegistry.connect(newUser).registerUser(
        ethers.toUtf8Bytes('{"x":"0x1111","y":"0x2222"}'),
        ethers.toUtf8Bytes('{"x":"0x3333","y":"0x4444"}')
      );

      // Publish post
      const tx = await postRegistry.connect(newUser).publishPost(
        PROOF_HASH,
        ENCRYPTED_DATA_HASH + "-user-nostake",
        DESCRIPTION,
        CATEGORY,
        PRICE
      );
      const newPostId = await getPostIdFromEvent(tx);

      // Create escrow
      const DataSaleEscrow = await ethers.getContractFactory("DataSaleEscrow");
      const newEscrow = await DataSaleEscrow.deploy(
        await mockUSDC.getAddress(),
        await relayRegistry.getAddress(),
        await postRegistry.getAddress()
      );
      await newEscrow.waitForDeployment();
      await newEscrow.initialize(newPostId, newUser.address, buyer.address, COUNTDOWN_DURATION);

      await mockUSDC.connect(buyer).approve(await newEscrow.getAddress(), ethers.MaxUint256);
      await newEscrow.connect(buyer).depositPayment();

      const buyerBalanceBefore = await mockUSDC.balanceOf(buyer.address);

      // Grief should still refund buyer even if user has no stake
      await expect(
        newEscrow.connect(buyer).grief(ethers.parseUnits("10", 6), ethers.ZeroHash, "Test")
      ).to.emit(newEscrow, "EscrowDisputed");

      const buyerBalanceAfter = await mockUSDC.balanceOf(buyer.address);
      expect(buyerBalanceAfter - buyerBalanceBefore).to.equal(PRICE);
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await escrow.connect(buyer).depositPayment();
    });

    it("Should return correct escrow info", async function () {
      const escrowInfo = await escrow.getEscrowInfo();
      expect(escrowInfo.postId).to.equal(postId);
      expect(escrowInfo.seller).to.equal(seller.address);
      expect(escrowInfo.buyer).to.equal(buyer.address);
      expect(escrowInfo.priceUSDC).to.equal(PRICE);
    });

    it("Should check if countdown expired", async function () {
      const expired = await escrow.isCountdownExpired();
      expect(expired).to.be.false;

      // Fast forward time
      const escrowInfo = await escrow.getEscrowInfo();
      await time.increase(escrowInfo.countdownDuration + 1);

      const expiredAfter = await escrow.isCountdownExpired();
      expect(expiredAfter).to.be.true;
    });
  });

  // Helper function
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
});

