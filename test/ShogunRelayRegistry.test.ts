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
  let slasher: SignerWithAddress;

  const MIN_STAKE = ethers.parseUnits("100", 6); // 100 USDC
  const UNSTAKING_DELAY = 7 * 24 * 60 * 60; // 7 days

  beforeEach(async function () {
    [owner, relay1, relay2, client, slasher] = await ethers.getSigners();

    // Deploy mock USDC
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUSDC = await MockERC20.deploy("Mock USDC", "USDC", 6);
    await mockUSDC.waitForDeployment();

    // Deploy registry
    const ShogunRelayRegistry = await ethers.getContractFactory("ShogunRelayRegistry");
    registry = await ShogunRelayRegistry.deploy(
      await mockUSDC.getAddress(),
      MIN_STAKE,
      UNSTAKING_DELAY
    );
    await registry.waitForDeployment();

    // Mint USDC to relays for staking
    await mockUSDC.mint(relay1.address, ethers.parseUnits("1000", 6));
    await mockUSDC.mint(relay2.address, ethers.parseUnits("1000", 6));

    // Approve registry to spend USDC
    await mockUSDC.connect(relay1).approve(await registry.getAddress(), ethers.MaxUint256);
    await mockUSDC.connect(relay2).approve(await registry.getAddress(), ethers.MaxUint256);
  });

  describe("Registration", function () {
    it("Should register a relay with valid stake", async function () {
      await registry.connect(relay1).registerRelay(
        "https://relay1.example.com",
        "gunpubkey123",
        MIN_STAKE
      );

      const info = await registry.getRelayInfo(relay1.address);
      expect(info.owner).to.equal(relay1.address);
      expect(info.endpoint).to.equal("https://relay1.example.com");
      expect(info.gunPubKey).to.equal("gunpubkey123");
      expect(info.stakedAmount).to.equal(MIN_STAKE);
      expect(info.status).to.equal(1); // Active
    });

    it("Should fail with insufficient stake", async function () {
      const lowStake = ethers.parseUnits("50", 6); // Below minimum
      await expect(
        registry.connect(relay1).registerRelay("https://relay1.example.com", "pubkey", lowStake)
      ).to.be.revertedWithCustomError(registry, "InsufficientStake");
    });

    it("Should fail with empty endpoint", async function () {
      await expect(
        registry.connect(relay1).registerRelay("", "pubkey", MIN_STAKE)
      ).to.be.revertedWithCustomError(registry, "InvalidEndpoint");
    });

    it("Should fail if already registered", async function () {
      await registry.connect(relay1).registerRelay("https://relay1.example.com", "pubkey", MIN_STAKE);
      
      await expect(
        registry.connect(relay1).registerRelay("https://relay1.example.com", "pubkey", MIN_STAKE)
      ).to.be.revertedWithCustomError(registry, "RelayAlreadyRegistered");
    });

    it("Should add relay to active list", async function () {
      await registry.connect(relay1).registerRelay("https://relay1.example.com", "pubkey1", MIN_STAKE);
      await registry.connect(relay2).registerRelay("https://relay2.example.com", "pubkey2", MIN_STAKE);

      const activeRelays = await registry.getActiveRelays();
      expect(activeRelays.length).to.equal(2);
      expect(activeRelays).to.include(relay1.address);
      expect(activeRelays).to.include(relay2.address);
    });

    it("Should emit RelayRegistered event", async function () {
      await expect(
        registry.connect(relay1).registerRelay("https://relay1.example.com", "pubkey", MIN_STAKE)
      )
        .to.emit(registry, "RelayRegistered")
        .withArgs(relay1.address, relay1.address, "https://relay1.example.com", "pubkey", MIN_STAKE);
    });
  });

  describe("Update Relay", function () {
    beforeEach(async function () {
      await registry.connect(relay1).registerRelay("https://relay1.example.com", "pubkey1", MIN_STAKE);
    });

    it("Should update endpoint", async function () {
      await registry.connect(relay1).updateRelay("https://newrelay.example.com", "");
      
      const info = await registry.getRelayInfo(relay1.address);
      expect(info.endpoint).to.equal("https://newrelay.example.com");
      expect(info.gunPubKey).to.equal("pubkey1"); // Unchanged
    });

    it("Should update pubkey", async function () {
      await registry.connect(relay1).updateRelay("", "newpubkey");
      
      const info = await registry.getRelayInfo(relay1.address);
      expect(info.endpoint).to.equal("https://relay1.example.com"); // Unchanged
      expect(info.gunPubKey).to.equal("newpubkey");
    });

    it("Should fail if not active", async function () {
      await registry.connect(relay1).requestUnstake();
      
      await expect(
        registry.connect(relay1).updateRelay("https://new.example.com", "")
      ).to.be.revertedWithCustomError(registry, "RelayNotActive");
    });
  });

  describe("Staking", function () {
    beforeEach(async function () {
      await registry.connect(relay1).registerRelay("https://relay1.example.com", "pubkey", MIN_STAKE);
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
      expect(info.status).to.equal(2); // Unstaking
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

  describe("Storage Deals", function () {
    const dealId = ethers.id("deal-001");

    beforeEach(async function () {
      await registry.connect(relay1).registerRelay("https://relay1.example.com", "pubkey", MIN_STAKE);
    });

    it("Should register a storage deal", async function () {
      await registry.connect(relay1).registerDeal(
        dealId,
        client.address,
        "QmTestCid123",
        100, // 100 MB
        ethers.parseUnits("1", 6), // 1 USDC
        30 // 30 days
      );

      const deal = await registry.deals(dealId);
      expect(deal.relay).to.equal(relay1.address);
      expect(deal.client).to.equal(client.address);
      expect(deal.cid).to.equal("QmTestCid123");
      expect(deal.sizeMB).to.equal(100);
      expect(deal.active).to.be.true;
    });

    it("Should fail if relay not active", async function () {
      await registry.connect(relay1).requestUnstake();

      await expect(
        registry.connect(relay1).registerDeal(dealId, client.address, "QmCid", 100, 1000000, 30)
      ).to.be.revertedWithCustomError(registry, "RelayNotActive");
    });

    it("Should get deals by relay", async function () {
      await registry.connect(relay1).registerDeal(dealId, client.address, "QmCid", 100, 1000000, 30);

      const deals = await registry.getRelayDeals(relay1.address);
      expect(deals.length).to.equal(1);
      expect(deals[0]).to.equal(dealId);
    });

    it("Should get deals by client", async function () {
      await registry.connect(relay1).registerDeal(dealId, client.address, "QmCid", 100, 1000000, 30);

      const deals = await registry.getClientDeals(client.address);
      expect(deals.length).to.equal(1);
      expect(deals[0]).to.equal(dealId);
    });

    it("Should complete a deal", async function () {
      await registry.connect(relay1).registerDeal(dealId, client.address, "QmCid", 100, 1000000, 30);
      await registry.connect(relay1).completeDeal(dealId);

      const deal = await registry.deals(dealId);
      expect(deal.active).to.be.false;
    });
  });

  describe("Slashing", function () {
    const dealId = ethers.id("deal-001");

    beforeEach(async function () {
      await registry.connect(relay1).registerRelay("https://relay1.example.com", "pubkey", MIN_STAKE);
      await registry.connect(relay1).registerDeal(dealId, client.address, "QmCid", 100, 1000000, 30);
      
      // Authorize slasher
      await registry.connect(owner).setAuthorizedSlasher(slasher.address, true);
    });

    it("Should slash for missed proof", async function () {
      const stakeBeforeSlash = (await registry.getRelayInfo(relay1.address)).stakedAmount;
      
      await registry.connect(slasher).reportMissedProof(
        relay1.address,
        ethers.ZeroHash,
        "Failed to provide proof within timeout"
      );

      const stakeAfterSlash = (await registry.getRelayInfo(relay1.address)).stakedAmount;
      const slashAmount = stakeBeforeSlash * 100n / 10000n; // 1%
      
      expect(stakeAfterSlash).to.equal(stakeBeforeSlash - slashAmount);
    });

    it("Should slash for data loss", async function () {
      const stakeBeforeSlash = (await registry.getRelayInfo(relay1.address)).stakedAmount;
      
      await registry.connect(slasher).reportDataLoss(
        relay1.address,
        dealId,
        "Data unavailable for active deal"
      );

      const stakeAfterSlash = (await registry.getRelayInfo(relay1.address)).stakedAmount;
      const slashAmount = stakeBeforeSlash * 1000n / 10000n; // 10%
      
      expect(stakeAfterSlash).to.equal(stakeBeforeSlash - slashAmount);
    });

    it("Should fail if not authorized slasher", async function () {
      await expect(
        registry.connect(client).reportMissedProof(relay1.address, ethers.ZeroHash, "reason")
      ).to.be.revertedWithCustomError(registry, "NotAuthorizedSlasher");
    });

    it("Should deactivate relay if stake falls below minimum", async function () {
      // Slash multiple times to bring below minimum
      for (let i = 0; i < 15; i++) {
        const info = await registry.getRelayInfo(relay1.address);
        if (info.status === 3n) break; // Already slashed
        await registry.connect(slasher).reportMissedProof(relay1.address, ethers.ZeroHash, "reason");
      }

      const info = await registry.getRelayInfo(relay1.address);
      expect(info.status).to.equal(3); // Slashed
    });

    it("Should emit RelaySlashed event", async function () {
      await expect(
        registry.connect(slasher).reportMissedProof(relay1.address, ethers.ZeroHash, "test reason")
      ).to.emit(registry, "RelaySlashed");
    });
  });

  describe("Discovery", function () {
    beforeEach(async function () {
      await registry.connect(relay1).registerRelay("https://relay1.example.com", "pubkey1", MIN_STAKE);
      await registry.connect(relay2).registerRelay("https://relay2.example.com", "pubkey2", MIN_STAKE);
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

    it("Should set slash rates", async function () {
      await registry.connect(owner).setSlashRates(200, 2000); // 2% and 20%
      expect(await registry.missedProofSlashBps()).to.equal(200);
      expect(await registry.dataLossSlashBps()).to.equal(2000);
    });

    it("Should pause and unpause", async function () {
      await registry.connect(owner).pause();
      
      await expect(
        registry.connect(relay1).registerRelay("https://relay.com", "pubkey", MIN_STAKE)
      ).to.be.revertedWithCustomError(registry, "EnforcedPause");

      await registry.connect(owner).unpause();
      
      await registry.connect(relay1).registerRelay("https://relay.com", "pubkey", MIN_STAKE);
      expect(await registry.isActiveRelay(relay1.address)).to.be.true;
    });

    it("Should fail admin functions for non-owner", async function () {
      await expect(
        registry.connect(relay1).setMinStake(1000)
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });
  });
});

// Mock ERC20 for testing
const MockERC20Artifact = {
  abi: [
    "function mint(address to, uint256 amount) external",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
  ],
};

