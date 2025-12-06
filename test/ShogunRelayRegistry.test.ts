import { expect } from "chai";
import { ethers } from "hardhat";
import { ShogunRelayRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("ShogunRelayRegistry", function () {
  let registry: ShogunRelayRegistry;
  let mockUSDC: any;
  let owner: SignerWithAddress;
  let relay1: SignerWithAddress;
  let relay2: SignerWithAddress;
  let client: SignerWithAddress;
  let user1: SignerWithAddress;
  let slasher: SignerWithAddress;

  const MIN_STAKE = ethers.parseUnits("100", 6); // 100 USDC
  const UNSTAKING_DELAY = 7 * 24 * 60 * 60; // 7 days

  // Test encryption keys (bytes format, simulating GunDB SEA format)
  const PUBKEY = ethers.toUtf8Bytes('{"x":"0x1234","y":"0x5678"}'); // Simulated JSON
  const EPUB = ethers.toUtf8Bytes('{"x":"0xabcd","y":"0xefgh"}'); // Simulated JSON

  beforeEach(async function () {
    [owner, relay1, relay2, client, user1, slasher] = await ethers.getSigners();

    // Deploy mock USDC
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUSDC = await MockERC20.deploy("Mock USDC", "USDC", 6);
    await mockUSDC.waitForDeployment();

    // Deploy registry with treasury (using owner as treasury)
    const ShogunRelayRegistry = await ethers.getContractFactory("ShogunRelayRegistry");
    registry = await ShogunRelayRegistry.deploy(
      await mockUSDC.getAddress(),
      MIN_STAKE,
      UNSTAKING_DELAY,
      owner.address // treasury
    );
    await registry.waitForDeployment();

    // Mint USDC to participants for staking
    await mockUSDC.mint(relay1.address, ethers.parseUnits("1000", 6));
    await mockUSDC.mint(relay2.address, ethers.parseUnits("1000", 6));
    await mockUSDC.mint(client.address, ethers.parseUnits("1000", 6));
    await mockUSDC.mint(user1.address, ethers.parseUnits("1000", 6));

    // Approve registry to spend USDC
    await mockUSDC.connect(relay1).approve(await registry.getAddress(), ethers.MaxUint256);
    await mockUSDC.connect(relay2).approve(await registry.getAddress(), ethers.MaxUint256);
    await mockUSDC.connect(client).approve(await registry.getAddress(), ethers.MaxUint256);
    await mockUSDC.connect(user1).approve(await registry.getAddress(), ethers.MaxUint256);
  });

  describe("Relay Registration", function () {
    it("Should register a relay with valid stake", async function () {
      await registry.connect(relay1).registerRelay(
        "https://relay1.example.com",
        PUBKEY,
        EPUB,
        MIN_STAKE,
        0 // Use default griefing ratio
      );

      const info = await registry.getRelayInfo(relay1.address);
      expect(info.owner).to.equal(relay1.address);
      expect(info.endpoint).to.equal("https://relay1.example.com");
      expect(ethers.hexlify(info.pubkey)).to.equal(ethers.hexlify(PUBKEY));
      expect(ethers.hexlify(info.epub)).to.equal(ethers.hexlify(EPUB));
      expect(info.stakedAmount).to.equal(MIN_STAKE);
      expect(info.status).to.equal(1); // Active (ParticipantStatus.Active)
    });

    it("Should register with custom griefing ratio", async function () {
      const customRatio = 300; // 3% (300 basis points)
      await registry.connect(relay1).registerRelay(
        "https://relay1.example.com",
        PUBKEY,
        EPUB,
        MIN_STAKE,
        customRatio
      );

      const info = await registry.getRelayInfo(relay1.address);
      expect(info.griefingRatio).to.equal(customRatio);
    });

    it("Should fail with insufficient stake", async function () {
      const lowStake = ethers.parseUnits("50", 6); // Below minimum
      await expect(
        registry.connect(relay1).registerRelay("https://relay1.example.com", PUBKEY, EPUB, lowStake, 0)
      ).to.be.revertedWithCustomError(registry, "InsufficientStake");
    });

    it("Should fail with empty endpoint", async function () {
      await expect(
        registry.connect(relay1).registerRelay("", PUBKEY, EPUB, MIN_STAKE, 0)
      ).to.be.revertedWithCustomError(registry, "InvalidEndpoint");
    });

    it("Should fail if already registered", async function () {
      await registry.connect(relay1).registerRelay("https://relay1.example.com", PUBKEY, EPUB, MIN_STAKE, 0);
      
      await expect(
        registry.connect(relay1).registerRelay("https://relay1.example.com", PUBKEY, EPUB, MIN_STAKE, 0)
      ).to.be.revertedWithCustomError(registry, "RelayAlreadyRegistered");
    });

    it("Should add relay to active list", async function () {
      await registry.connect(relay1).registerRelay("https://relay1.example.com", PUBKEY, EPUB, MIN_STAKE, 0);
      await registry.connect(relay2).registerRelay("https://relay2.example.com", PUBKEY, EPUB, MIN_STAKE, 0);

      const activeRelays = await registry.getActiveRelays();
      expect(activeRelays.length).to.equal(2);
      expect(activeRelays).to.include(relay1.address);
      expect(activeRelays).to.include(relay2.address);
    });

    it("Should emit RelayRegistered event", async function () {
      await expect(
        registry.connect(relay1).registerRelay("https://relay1.example.com", PUBKEY, EPUB, MIN_STAKE, 0)
      )
        .to.emit(registry, "RelayRegistered")
        .withArgs(relay1.address, relay1.address, "https://relay1.example.com", MIN_STAKE);
    });
  });

  describe("Update Relay", function () {
    beforeEach(async function () {
      await registry.connect(relay1).registerRelay("https://relay1.example.com", PUBKEY, EPUB, MIN_STAKE, 0);
    });

    it("Should update endpoint", async function () {
      await registry.connect(relay1).updateRelay("https://newrelay.example.com");
      
      const info = await registry.getRelayInfo(relay1.address);
      expect(info.endpoint).to.equal("https://newrelay.example.com");
    });

    it("Should update encryption keys", async function () {
      const newPubkey = ethers.toUtf8Bytes('{"x":"0xnew","y":"0xkeys"}');
      const newEpub = ethers.toUtf8Bytes('{"x":"0xnewepub","y":"0xkeys"}');
      
      await registry.connect(relay1).updateRelayEncryptionKeys(newPubkey, newEpub);
      
      const info = await registry.getRelayInfo(relay1.address);
      expect(ethers.hexlify(info.pubkey)).to.equal(ethers.hexlify(newPubkey));
      expect(ethers.hexlify(info.epub)).to.equal(ethers.hexlify(newEpub));
    });

    it("Should fail if not active", async function () {
      await registry.connect(relay1).requestUnstake();
      
      await expect(
        registry.connect(relay1).updateRelay("https://new.example.com")
      ).to.be.revertedWithCustomError(registry, "RelayNotActive");
    });
  });

  describe("Staking", function () {
    beforeEach(async function () {
      await registry.connect(relay1).registerRelay("https://relay1.example.com", PUBKEY, EPUB, MIN_STAKE, 0);
    });

    it("Should increase stake", async function () {
      const additionalStake = ethers.parseUnits("50", 6);
      await registry.connect(relay1).increaseStake(additionalStake);

      const info = await registry.getRelayInfo(relay1.address);
      expect(info.stakedAmount).to.equal(MIN_STAKE + additionalStake);
    });

    it("Should request unstake", async function () {
      await registry.connect(relay1).requestUnstake();

      const info = await registry.getRelayInfo(relay1.address);
      expect(info.status).to.equal(2); // Unstaking (ParticipantStatus.Unstaking)
      expect(info.unstakeRequestedAt).to.be.gt(0);
    });

    it("Should remove from active relays on unstake request", async function () {
      await registry.connect(relay1).requestUnstake();

      const activeRelays = await registry.getActiveRelays();
      expect(activeRelays).to.not.include(relay1.address);
    });

    it("Should withdraw stake after delay", async function () {
      await registry.connect(relay1).requestUnstake();
      
      // Fast forward past unstaking delay
      await time.increase(UNSTAKING_DELAY + 1);

      const balanceBefore = await mockUSDC.balanceOf(relay1.address);
      await registry.connect(relay1).withdrawStake();
      const balanceAfter = await mockUSDC.balanceOf(relay1.address);

      expect(balanceAfter - balanceBefore).to.equal(MIN_STAKE);

      const info = await registry.getRelayInfo(relay1.address);
      expect(info.status).to.equal(0); // Inactive
      expect(info.stakedAmount).to.equal(0);
    });

    it("Should fail to withdraw before delay", async function () {
      await registry.connect(relay1).requestUnstake();

      await expect(
        registry.connect(relay1).withdrawStake()
      ).to.be.revertedWithCustomError(registry, "UnstakingDelayNotPassed");
    });
  });

  describe("Griefing (Decentralized Slashing)", function () {
    beforeEach(async function () {
      await registry.connect(relay1).registerRelay("https://relay1.example.com", PUBKEY, EPUB, MIN_STAKE, 0);
      
      // Approve for griefing costs
      await mockUSDC.connect(client).approve(await registry.getAddress(), ethers.MaxUint256);
    });

    it("Should grief relay with generic grief function", async function () {
      const stakeBeforeSlash = (await registry.getRelayInfo(relay1.address)).stakedAmount;
      const slashAmount = ethers.parseUnits("10", 6); // 10 USDC
      const defaultRatio = await registry.defaultGriefingRatio();
      const expectedCost = (slashAmount * BigInt(defaultRatio)) / 10000n;
      
      const clientBalanceBefore = await mockUSDC.balanceOf(client.address);
      const treasuryBalanceBefore = await mockUSDC.balanceOf(owner.address);
      
      await registry.connect(client).grief(
        relay1.address,
        slashAmount,
        "Failed to provide proof within timeout",
        0, // Use relay's default ratio
        ethers.ZeroHash // No deal ID
      );

      const stakeAfterSlash = (await registry.getRelayInfo(relay1.address)).stakedAmount;
      expect(stakeAfterSlash).to.equal(stakeBeforeSlash - slashAmount);
      
      // Verify client paid the cost
      const clientBalanceAfter = await mockUSDC.balanceOf(client.address);
      expect(clientBalanceBefore - clientBalanceAfter).to.equal(expectedCost);
      
      // Verify treasury received both slash and cost
      const treasuryBalanceAfter = await mockUSDC.balanceOf(owner.address);
      expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(slashAmount + expectedCost);
    });

    it("Should grief relay with custom griefing ratio", async function () {
      const slashAmount = ethers.parseUnits("5", 6);
      const customRatio = 1000; // 10% (1000 basis points)
      const expectedCost = (slashAmount * BigInt(customRatio)) / 10000n;
      
      const clientBalanceBefore = await mockUSDC.balanceOf(client.address);
      
      await registry.connect(client).grief(
        relay1.address,
        slashAmount,
        "Test reason",
        customRatio,
        ethers.ZeroHash
      );

      const clientBalanceAfter = await mockUSDC.balanceOf(client.address);
      expect(clientBalanceBefore - clientBalanceAfter).to.equal(expectedCost);
    });

    it("Should fail if relay not registered", async function () {
      await expect(
        registry.connect(client).grief(
          client.address, // Not a relay
          ethers.parseUnits("10", 6),
          "reason",
          0,
          ethers.ZeroHash
        )
      ).to.be.revertedWithCustomError(registry, "RelayNotRegistered");
    });

    it("Should fail if slash amount exceeds stake", async function () {
      const stake = (await registry.getRelayInfo(relay1.address)).stakedAmount;
      const excessiveSlash = stake + ethers.parseUnits("1", 6);
      
      await expect(
        registry.connect(client).grief(
          relay1.address,
          excessiveSlash,
          "reason",
          0,
          ethers.ZeroHash
        )
      ).to.be.revertedWithCustomError(registry, "InvalidSlashAmount");
    });

    it("Should deactivate relay if stake falls below minimum", async function () {
      // Increase stake to exactly 2x minimum
      await registry.connect(relay1).increaseStake(MIN_STAKE);
      
      let info = await registry.getRelayInfo(relay1.address);
      const initialStake = info.stakedAmount; // Should be 200 USDC
      expect(info.status).to.equal(1); // Active
      expect(initialStake).to.equal(MIN_STAKE * 2n);
      
      // Slash enough to bring below minimum (slash 110 USDC = below 100 USDC minimum)
      const slashAmount = MIN_STAKE + ethers.parseUnits("10", 6);
      const defaultRatio = await registry.defaultGriefingRatio();
      const cost = (slashAmount * BigInt(defaultRatio)) / 10000n;
      
      // Ensure client has enough for cost
      await mockUSDC.mint(client.address, cost);
      await mockUSDC.connect(client).approve(await registry.getAddress(), ethers.MaxUint256);
      
      await registry.connect(client).grief(
        relay1.address,
        slashAmount,
        "Stake below minimum",
        0,
        ethers.ZeroHash
      );

      info = await registry.getRelayInfo(relay1.address);
      expect(info.status).to.equal(3); // Slashed (ParticipantStatus.Slashed)
      expect(info.stakedAmount).to.be.lt(MIN_STAKE);
    });

    it("Should emit RelaySlashed event with cost", async function () {
      const slashAmount = ethers.parseUnits("10", 6);
      
      await expect(
        registry.connect(client).grief(relay1.address, slashAmount, "test reason", 0, ethers.ZeroHash)
      )
        .to.emit(registry, "RelaySlashed")
        .withArgs(
          (reportId: string) => reportId.length > 0,
          relay1.address,
          client.address,
          slashAmount,
          (cost: bigint) => cost > 0n,
          "test reason"
        );
    });
  });

  describe("User Management", function () {
    it("Should register a user with encryption keys", async function () {
      await registry.connect(user1).registerUser(PUBKEY, EPUB);

      const info = await registry.getUserInfo(user1.address);
      expect(info.owner).to.equal(user1.address);
      expect(info.endpoint).to.equal(""); // Users have no endpoint
      expect(ethers.hexlify(info.pubkey)).to.equal(ethers.hexlify(PUBKEY));
      expect(ethers.hexlify(info.epub)).to.equal(ethers.hexlify(EPUB));
      expect(info.status).to.equal(1); // Active
      expect(info.stakedAmount).to.equal(0); // No stake by default
    });

    it("Should fail if already registered as relay", async function () {
      await registry.connect(user1).registerRelay("https://relay.example.com", PUBKEY, EPUB, MIN_STAKE, 0);
      
      await expect(
        registry.connect(user1).registerUser(PUBKEY, EPUB)
      ).to.be.revertedWithCustomError(registry, "RelayAlreadyRegistered");
    });

    it("Should fail with empty pubkey", async function () {
      await expect(
        registry.connect(user1).registerUser("0x" as any, EPUB)
      ).to.be.revertedWithCustomError(registry, "InvalidPubkey");
    });

    it("Should deposit stake for user", async function () {
      await registry.connect(user1).registerUser(PUBKEY, EPUB);
      
      const stakeAmount = ethers.parseUnits("50", 6);
      await registry.connect(user1).depositUserStake(stakeAmount, 0);

      const info = await registry.getUserInfo(user1.address);
      expect(info.stakedAmount).to.equal(stakeAmount);
    });

    it("Should withdraw user stake", async function () {
      await registry.connect(user1).registerUser(PUBKEY, EPUB);
      
      const stakeAmount = ethers.parseUnits("50", 6);
      await registry.connect(user1).depositUserStake(stakeAmount, 0);
      
      const balanceBefore = await mockUSDC.balanceOf(user1.address);
      await registry.connect(user1).withdrawUserStake(stakeAmount);
      const balanceAfter = await mockUSDC.balanceOf(user1.address);

      expect(balanceAfter - balanceBefore).to.equal(stakeAmount);
      
      const info = await registry.getUserInfo(user1.address);
      expect(info.stakedAmount).to.equal(0);
    });

    it("Should grief user", async function () {
      await registry.connect(user1).registerUser(PUBKEY, EPUB);
      
      const stakeAmount = ethers.parseUnits("50", 6);
      await registry.connect(user1).depositUserStake(stakeAmount, 0);
      
      // Approve for griefing cost
      await mockUSDC.connect(client).approve(await registry.getAddress(), ethers.MaxUint256);
      
      const slashAmount = ethers.parseUnits("10", 6);
      const userInfoBefore = await registry.getUserInfo(user1.address);
      const defaultRatio = userInfoBefore.griefingRatio;
      const expectedCost = (slashAmount * BigInt(defaultRatio)) / 10000n;
      
      await registry.connect(client).griefUser(user1.address, slashAmount, "Bad behavior");

      const userInfoAfter = await registry.getUserInfo(user1.address);
      expect(userInfoAfter.stakedAmount).to.equal(stakeAmount - slashAmount);
      expect(userInfoAfter.totalSlashed).to.equal(slashAmount);
    });

    it("Should get active users", async function () {
      await registry.connect(user1).registerUser(PUBKEY, EPUB);
      
      // Register a relay (should not appear in active users)
      await registry.connect(relay1).registerRelay("https://relay1.example.com", PUBKEY, EPUB, MIN_STAKE, 0);
      
      const activeUsers = await registry.getActiveUsers();
      expect(activeUsers.length).to.equal(1);
      expect(activeUsers[0]).to.equal(user1.address);
      
      const activeUserCount = await registry.getActiveUserCount();
      expect(activeUserCount).to.equal(1);
    });
  });

  describe("Discovery", function () {
    beforeEach(async function () {
      await registry.connect(relay1).registerRelay("https://relay1.example.com", PUBKEY, EPUB, MIN_STAKE, 0);
      await registry.connect(relay2).registerRelay("https://relay2.example.com", PUBKEY, EPUB, MIN_STAKE, 0);
    });

    it("Should return correct active relay count", async function () {
      expect(await registry.getActiveRelayCount()).to.equal(2);
    });

    it("Should check if relay is active", async function () {
      expect(await registry.isActiveRelay(relay1.address)).to.be.true;
      expect(await registry.isActiveRelay(client.address)).to.be.false;
    });

    it("Should update active list on unstake", async function () {
      await registry.connect(relay1).requestUnstake();
      
      expect(await registry.getActiveRelayCount()).to.equal(1);
      expect(await registry.isActiveRelay(relay1.address)).to.be.false;
      expect(await registry.isActiveRelay(relay2.address)).to.be.true;
    });
  });

  describe("Admin Functions", function () {
    it("Should set min stake", async function () {
      const newMinStake = ethers.parseUnits("200", 6);
      await registry.connect(owner).setMinStake(newMinStake);
      expect(await registry.minStake()).to.equal(newMinStake);
    });

    it("Should set unstaking delay", async function () {
      const newDelay = 14 * 24 * 60 * 60; // 14 days
      await registry.connect(owner).setUnstakingDelay(newDelay);
      expect(await registry.unstakingDelay()).to.equal(newDelay);
    });

    it("Should set griefing ratios", async function () {
      await registry.connect(owner).setGriefingRatios(600, 150); // 6% default, 1.5% staked
      expect(await registry.defaultGriefingRatio()).to.equal(600);
      expect(await registry.stakedClientGriefingRatio()).to.equal(150);
    });

    it("Should set treasury address", async function () {
      const newTreasury = client.address;
      await registry.connect(owner).setTreasury(newTreasury);
      expect(await registry.treasury()).to.equal(newTreasury);
    });

    it("Should burn tokens when treasury is zero address (use burn address)", async function () {
      // Deploy new registry with zero treasury (burn mode)
      const BurnRegistry = await ethers.getContractFactory("ShogunRelayRegistry");
      const burnRegistry = await BurnRegistry.deploy(
        await mockUSDC.getAddress(),
        MIN_STAKE,
        UNSTAKING_DELAY,
        ethers.ZeroAddress // Zero address = burn
      );
      await burnRegistry.waitForDeployment();

      // Approve registry to spend USDC for relay registration
      await mockUSDC.connect(relay1).approve(await burnRegistry.getAddress(), ethers.MaxUint256);

      // Register relay
      await burnRegistry.connect(relay1).registerRelay(
        "https://relay1.example.com",
        PUBKEY,
        EPUB,
        MIN_STAKE,
        0
      );

      // Mint USDC to slasher for griefing cost
      await mockUSDC.mint(slasher.address, ethers.parseUnits("100", 6));
      await mockUSDC.connect(slasher).approve(await burnRegistry.getAddress(), ethers.MaxUint256);

      const slashAmount = ethers.parseUnits("10", 6);
      const defaultRatio = await burnRegistry.defaultGriefingRatio();
      const expectedCost = (slashAmount * BigInt(defaultRatio)) / 10000n;

      // Get burn address (0x000000000000000000000000000000000000dEaD)
      const BURN_ADDRESS = "0x000000000000000000000000000000000000dEaD";
      const burnBalanceBefore = await mockUSDC.balanceOf(BURN_ADDRESS);
      const totalSupplyBefore = await mockUSDC.totalSupply();

      // Grief relay (should send to burn address)
      await burnRegistry.connect(slasher).grief(
        relay1.address,
        slashAmount,
        "Test burn",
        0,
        ethers.ZeroHash
      );

      // Verify tokens were sent to burn address (not address(0))
      const burnBalanceAfter = await mockUSDC.balanceOf(BURN_ADDRESS);
      expect(burnBalanceAfter - burnBalanceBefore).to.equal(slashAmount + expectedCost);

      // Verify relay stake was slashed
      const relayInfo = await burnRegistry.getRelayInfo(relay1.address);
      expect(relayInfo.stakedAmount).to.equal(MIN_STAKE - slashAmount);
    });

    it("Should pause and unpause", async function () {
      await registry.connect(owner).pause();
      
      await expect(
        registry.connect(relay1).registerRelay("https://relay.com", PUBKEY, EPUB, MIN_STAKE, 0)
      ).to.be.revertedWithCustomError(registry, "EnforcedPause");

      await registry.connect(owner).unpause();
      
      await registry.connect(relay1).registerRelay("https://relay.com", PUBKEY, EPUB, MIN_STAKE, 0);
      expect(await registry.isActiveRelay(relay1.address)).to.be.true;
    });

    it("Should fail admin functions for non-owner", async function () {
      await expect(
        registry.connect(relay1).setMinStake(1000)
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });
  });
});
