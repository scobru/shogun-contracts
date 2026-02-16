import { expect } from "chai";
import { ethers } from "hardhat";
import { DataSaleEscrow, DataPostRegistry, ShogunRelayRegistry, DataSaleEscrowFactory } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("DataSaleEscrow", function () {
  let escrow: DataSaleEscrow;
  let factory: DataSaleEscrowFactory;
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
    postId = await getPostIdFromEvent(tx, postRegistry);

    // Deploy factory
    const DataSaleEscrowFactory = await ethers.getContractFactory("DataSaleEscrowFactory");
    factory = await DataSaleEscrowFactory.deploy(
      await mockUSDC.getAddress(),
      await relayRegistry.getAddress(),
      await postRegistry.getAddress()
    );
    await factory.waitForDeployment();

    // Create escrow via factory
    const txEscrow = await factory.connect(buyer).createEscrow(postId, seller.address, COUNTDOWN_DURATION);
    const receipt = await txEscrow.wait();
    if (!receipt) throw new Error("Transaction receipt not found");

    const event = receipt.logs
      .map((log: any) => {
        try {
          return factory.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((parsed: any) => parsed && parsed.name === "EscrowCreated");

    if (!event) throw new Error("EscrowCreated event not found");

    escrow = await ethers.getContractAt("DataSaleEscrow", event.args.escrow);

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
      await expect(
        factory.connect(buyer).createEscrow(ethers.id("fake-post"), seller.address, COUNTDOWN_DURATION)
      ).to.be.revertedWith("Post not found");
    });

    it("Should fail if post is not active", async function () {
      // Deactivate post
      await postRegistry.connect(seller).deactivatePost(postId);

      await expect(
        factory.connect(buyer).createEscrow(postId, seller.address, COUNTDOWN_DURATION)
      ).to.be.revertedWith("Post not active");

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
      const newPostId = await getPostIdFromEvent(tx, postRegistry);

      const txEscrow = await factory.connect(buyer).createEscrow(newPostId, seller.address, COUNTDOWN_DURATION);
      const receipt = await txEscrow.wait();
      if (!receipt) throw new Error("Receipt not found");
      const event = receipt.logs
        .map((log: any) => {
          try { return factory.interface.parseLog(log); } catch { return null; }
        })
        .find((parsed: any) => parsed && parsed.name === "EscrowCreated");

      const newEscrow = await ethers.getContractAt("DataSaleEscrow", event.args.escrow);

      await expect(
        newEscrow.connect(seller).submitData(encryptedSymKeyHash)
      ).to.be.revertedWithCustomError(newEscrow, "EscrowNotActive");
    });

    it("Should fail if countdown expired (seller cannot submit after deadline)", async function () {
      const encryptedSymKeyHash = ethers.id("encrypted-key-123");
      
      // Get countdown end time
      const escrowInfo = await escrow.getEscrowInfo();
      const countdownEnd = Number(escrowInfo.countdownEnd);
      
      // Fast forward time past countdown deadline
      await time.increase(COUNTDOWN_DURATION + 1);
      
      // Verify countdown is expired
      const isExpired = await escrow.isCountdownExpired();
      expect(isExpired).to.be.true;
      
      // Seller should not be able to submit data after countdown expired
      await expect(
        escrow.connect(seller).submitData(encryptedSymKeyHash)
      ).to.be.revertedWithCustomError(escrow, "CountdownExpired");
    });

    it("Should allow seller to submit data before countdown expires", async function () {
      const encryptedSymKeyHash = ethers.id("encrypted-key-123");
      
      // Fast forward time but not past deadline (e.g., 1 day before)
      await time.increase(COUNTDOWN_DURATION - (1 * 24 * 60 * 60));
      
      // Verify countdown is not expired
      const isExpired = await escrow.isCountdownExpired();
      expect(isExpired).to.be.false;
      
      // Seller should be able to submit data before deadline
      await expect(
        escrow.connect(seller).submitData(encryptedSymKeyHash)
      ).to.emit(escrow, "DataSubmitted").withArgs(encryptedSymKeyHash);
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
      const newPostId = await getPostIdFromEvent(tx, postRegistry);

      const txEscrow = await factory.connect(buyer).createEscrow(newPostId, seller.address, COUNTDOWN_DURATION);
      const receipt = await txEscrow.wait();
      if (!receipt) throw new Error("Receipt not found");
      const event = receipt.logs
        .map((log: any) => {
          try { return factory.interface.parseLog(log); } catch { return null; }
        })
        .find((parsed: any) => parsed && parsed.name === "EscrowCreated");

      const newEscrow = await ethers.getContractAt("DataSaleEscrow", event.args.escrow);

      await mockUSDC.connect(buyer).approve(await newEscrow.getAddress(), ethers.MaxUint256);
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
      ).to.be.revertedWithCustomError(escrow, "EscrowNotActive");
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
      relayPostId = await getPostIdFromEvent(tx, postRegistry);

      // Create escrow with relay seller via factory
      const txEscrow = await factory.connect(buyer).createEscrow(relayPostId, relaySeller.address, COUNTDOWN_DURATION);
      const receipt = await txEscrow.wait();
      if (!receipt) throw new Error("Receipt not found");
      const event = receipt.logs
        .map((log: any) => {
          try { return factory.interface.parseLog(log); } catch { return null; }
        })
        .find((parsed: any) => parsed && parsed.name === "EscrowCreated");

      relayEscrow = await ethers.getContractAt("DataSaleEscrow", event.args.escrow);

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
      const testPostId = await getPostIdFromEvent(tx, postRegistry);

      // Create new escrow
      const txEscrow = await factory.connect(buyer).createEscrow(testPostId, relaySeller.address, COUNTDOWN_DURATION);
      const receipt = await txEscrow.wait();
      if (!receipt) throw new Error("Receipt not found");
      const event = receipt.logs
        .map((log: any) => {
          try { return factory.interface.parseLog(log); } catch { return null; }
        })
        .find((parsed: any) => parsed && parsed.name === "EscrowCreated");

      const testEscrow = await ethers.getContractAt("DataSaleEscrow", event.args.escrow);
      
      // Approve escrow to spend USDC
      await mockUSDC.connect(buyer).approve(await testEscrow.getAddress(), ethers.MaxUint256);
      
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
      userPostId = await getPostIdFromEvent(tx, postRegistry);

      // Create escrow with user seller via factory
      const txEscrow = await factory.connect(buyer).createEscrow(userPostId, userSeller.address, COUNTDOWN_DURATION);
      const receipt = await txEscrow.wait();
      if (!receipt) throw new Error("Receipt not found");
      const event = receipt.logs
        .map((log: any) => {
          try { return factory.interface.parseLog(log); } catch { return null; }
        })
        .find((parsed: any) => parsed && parsed.name === "EscrowCreated");

      userEscrow = await ethers.getContractAt("DataSaleEscrow", event.args.escrow);

      // Mint and approve USDC for buyer (enough for payment + griefing cost)
      await mockUSDC.mint(buyer.address, ethers.parseUnits("1000", 6));
      await mockUSDC.connect(buyer).approve(await userEscrow.getAddress(), ethers.MaxUint256);
      await mockUSDC.connect(buyer).approve(await relayRegistry.getAddress(), ethers.MaxUint256);
      await userEscrow.connect(buyer).depositPayment();
      
      // Note: buyerBalanceBefore is after payment deposit, so it's initialBalance - PRICE
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

      // Check buyer refunded - buyer gets full refund, then pays griefing cost
      // So final balance = initial balance - payment + refund - griefing cost = initial balance - griefing cost
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
      const newPostId = await getPostIdFromEvent(tx, postRegistry);

      // Create escrow
      const txEscrow = await factory.connect(buyer).createEscrow(newPostId, newUser.address, COUNTDOWN_DURATION);
      const receipt = await txEscrow.wait();
      if (!receipt) throw new Error("Receipt not found");
      const event = receipt.logs
        .map((log: any) => {
          try { return factory.interface.parseLog(log); } catch { return null; }
        })
        .find((parsed: any) => parsed && parsed.name === "EscrowCreated");

      const newEscrow = await ethers.getContractAt("DataSaleEscrow", event.args.escrow);

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

      // Fast forward time - use COUNTDOWN_DURATION directly (already a number)
      await time.increase(COUNTDOWN_DURATION + 1);

      const expiredAfter = await escrow.isCountdownExpired();
      expect(expiredAfter).to.be.true;
    });
  });

  // Helper function
  async function getPostIdFromEvent(tx: any, registry: DataPostRegistry): Promise<string> {
    const receipt = await tx.wait();
    if (!receipt) {
      throw new Error("Transaction receipt not found");
    }
    
    // Parse events from the contract
    const events = receipt.logs
      .map((log: any) => {
        try {
          return registry.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .filter((parsed: any) => parsed !== null && parsed.name === "DataPostPublished");
    
    if (events.length === 0) {
      throw new Error("DataPostPublished event not found");
    }
    
    const event = events[0];
    return event.args.postId;
  }
});

