import { expect } from "chai";
import { ethers } from "hardhat";
import { StorageDealRegistry, ShogunRelayRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("StorageDealRegistry", function () {
  let dealRegistry: StorageDealRegistry;
  let relayRegistry: ShogunRelayRegistry;
  let mockUSDC: any;
  let owner: SignerWithAddress;
  let relay1: SignerWithAddress;
  let relay2: SignerWithAddress;
  let client: SignerWithAddress;

  const MIN_STAKE = ethers.parseUnits("100", 6); // 100 USDC
  const UNSTAKING_DELAY = 7 * 24 * 60 * 60; // 7 days

  // Test encryption keys (bytes format)
  const PUBKEY = ethers.toUtf8Bytes('{"x":"0x1234","y":"0x5678"}');
  const EPUB = ethers.toUtf8Bytes('{"x":"0xabcd","y":"0xefgh"}');

  beforeEach(async function () {
    [owner, relay1, relay2, client] = await ethers.getSigners();

    // Deploy mock USDC
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUSDC = await MockERC20.deploy("Mock USDC", "USDC", 6);
    await mockUSDC.waitForDeployment();

    // Deploy relay registry first
    const ShogunRelayRegistry = await ethers.getContractFactory("ShogunRelayRegistry");
    relayRegistry = await ShogunRelayRegistry.deploy(
      await mockUSDC.getAddress(),
      MIN_STAKE,
      UNSTAKING_DELAY,
      owner.address // treasury
    );
    await relayRegistry.waitForDeployment();

    // Deploy storage deal registry
    const StorageDealRegistry = await ethers.getContractFactory("StorageDealRegistry");
    dealRegistry = await StorageDealRegistry.deploy(await relayRegistry.getAddress());
    await dealRegistry.waitForDeployment();

    // Mint USDC to participants
    await mockUSDC.mint(relay1.address, ethers.parseUnits("1000", 6));
    await mockUSDC.mint(relay2.address, ethers.parseUnits("1000", 6));
    await mockUSDC.mint(client.address, ethers.parseUnits("1000", 6));

    // Approve registry to spend USDC
    await mockUSDC.connect(relay1).approve(await relayRegistry.getAddress(), ethers.MaxUint256);
    await mockUSDC.connect(relay2).approve(await relayRegistry.getAddress(), ethers.MaxUint256);
    await mockUSDC.connect(client).approve(await relayRegistry.getAddress(), ethers.MaxUint256);
    await mockUSDC.connect(client).approve(await dealRegistry.getAddress(), ethers.MaxUint256);

    // Register relay1
    await relayRegistry.connect(relay1).registerRelay(
      "https://relay1.example.com",
      PUBKEY,
      EPUB,
      MIN_STAKE,
      0 // default griefing ratio
    );
  });

  describe("Deal Registration", function () {
    it("Should register a storage deal without client stake", async function () {
      const dealId = ethers.id("deal-001");
      await dealRegistry.connect(relay1).registerDeal(
        dealId,
        client.address,
        "QmTestCid123",
        100, // 100 MB
        ethers.parseUnits("1", 6), // 1 USDC
        30, // 30 days
        0 // No client stake
      );

      const deal = await dealRegistry.deals(dealId);
      expect(deal.relay).to.equal(relay1.address);
      expect(deal.client).to.equal(client.address);
      expect(deal.cid).to.equal("QmTestCid123");
      expect(deal.sizeMB).to.equal(100);
      expect(deal.active).to.be.true;
      expect(deal.clientStake).to.equal(0);
      expect(deal.griefed).to.be.false; // Deal should not be griefed initially
    });

    it("Should register a storage deal with client stake", async function () {
      const dealId = ethers.id("deal-002");
      const clientStake = ethers.parseUnits("10", 6); // 10 USDC
      const dealPrice = ethers.parseUnits("1", 6); // 1 USDC
      const clientBalanceBefore = await mockUSDC.balanceOf(client.address);
      
      await dealRegistry.connect(relay1).registerDeal(
        dealId,
        client.address,
        "QmTestCid123",
        100,
        dealPrice,
        30,
        clientStake
      );

      const deal = await dealRegistry.deals(dealId);
      expect(deal.clientStake).to.equal(clientStake);
      
      const clientBalanceAfter = await mockUSDC.balanceOf(client.address);
      // Client pays: dealPrice (to relay) + clientStake (to contract)
      expect(clientBalanceBefore - clientBalanceAfter).to.equal(clientStake + dealPrice);
    });

    it("Should fail if relay not active", async function () {
      // Register relay2 but don't activate
      const dealId = ethers.id("deal-003");
      
      await expect(
        dealRegistry.connect(relay2).registerDeal(dealId, client.address, "QmCid", 100, 1000000, 30, 0)
      ).to.be.revertedWithCustomError(dealRegistry, "RelayNotActive");
    });

    it("Should fail if deal already exists", async function () {
      const dealId = ethers.id("deal-004");
      await dealRegistry.connect(relay1).registerDeal(dealId, client.address, "QmCid", 100, 1000000, 30, 0);

      await expect(
        dealRegistry.connect(relay1).registerDeal(dealId, client.address, "QmCid", 100, 1000000, 30, 0)
      ).to.be.revertedWithCustomError(dealRegistry, "DealAlreadyExists");
    });

    it("Should get deals by relay", async function () {
      const dealId1 = ethers.id("deal-005");
      const dealId2 = ethers.id("deal-006");
      
      await dealRegistry.connect(relay1).registerDeal(dealId1, client.address, "QmCid1", 100, 1000000, 30, 0);
      await dealRegistry.connect(relay1).registerDeal(dealId2, client.address, "QmCid2", 100, 1000000, 30, 0);

      const deals = await dealRegistry.getRelayDeals(relay1.address);
      expect(deals.length).to.equal(2);
      expect(deals).to.include(dealId1);
      expect(deals).to.include(dealId2);
    });

    it("Should get deals by client", async function () {
      const dealId = ethers.id("deal-007");
      await dealRegistry.connect(relay1).registerDeal(dealId, client.address, "QmCid", 100, 1000000, 30, 0);

      const deals = await dealRegistry.getClientDeals(client.address);
      expect(deals.length).to.equal(1);
      expect(deals[0]).to.equal(dealId);
    });

    it("Should emit StorageDealRegistered event", async function () {
      const dealId = ethers.id("deal-008");
      
      await expect(
        dealRegistry.connect(relay1).registerDeal(dealId, client.address, "QmCid", 100, 1000000, 30, 0)
      )
        .to.emit(dealRegistry, "StorageDealRegistered")
        .withArgs(
          dealId,
          relay1.address,
          client.address,
          "QmCid",
          100,
          1000000,
          (expiresAt: bigint) => expiresAt > 0n,
          0
        );
    });
  });

  describe("Client Stake Management", function () {
    let dealId: string;

    beforeEach(async function () {
      dealId = ethers.id("deal-stake-test");
      await dealRegistry.connect(relay1).registerDeal(dealId, client.address, "QmCid", 100, 1000000, 30, 0);
    });

    it("Should add client stake to existing deal", async function () {
      const additionalStake = ethers.parseUnits("5", 6);
      
      await dealRegistry.connect(client).addClientStake(dealId, additionalStake);

      const deal = await dealRegistry.deals(dealId);
      expect(deal.clientStake).to.equal(additionalStake);
    });

    it("Should fail to add stake if not deal client", async function () {
      const additionalStake = ethers.parseUnits("5", 6);
      
      await expect(
        dealRegistry.connect(relay1).addClientStake(dealId, additionalStake)
      ).to.be.revertedWithCustomError(dealRegistry, "NotDealParty");
    });

    it("Should withdraw client stake after deal completion", async function () {
      const clientStake = ethers.parseUnits("10", 6);
      await dealRegistry.connect(client).addClientStake(dealId, clientStake);
      
      // Complete the deal
      await dealRegistry.connect(relay1).completeDeal(dealId);
      
      const clientBalanceBefore = await mockUSDC.balanceOf(client.address);
      await dealRegistry.connect(client).withdrawClientStake(dealId);
      const clientBalanceAfter = await mockUSDC.balanceOf(client.address);

      expect(clientBalanceAfter - clientBalanceBefore).to.equal(clientStake);
      
      const deal = await dealRegistry.deals(dealId);
      expect(deal.clientStake).to.equal(0);
    });

    it("Should fail to withdraw client stake if deal still active", async function () {
      const clientStake = ethers.parseUnits("10", 6);
      await dealRegistry.connect(client).addClientStake(dealId, clientStake);
      
      await expect(
        dealRegistry.connect(client).withdrawClientStake(dealId)
      ).to.be.revertedWithCustomError(dealRegistry, "ClientStakeStillLocked");
    });

    it("Should allow withdrawal after deal expires", async function () {
      const clientStake = ethers.parseUnits("10", 6);
      const deal = await dealRegistry.deals(dealId);
      await dealRegistry.connect(client).addClientStake(dealId, clientStake);
      
      // Fast forward past expiration
      await time.increase(31 * 24 * 60 * 60); // 31 days (deal expires at 30)

      const clientBalanceBefore = await mockUSDC.balanceOf(client.address);
      await dealRegistry.connect(client).withdrawClientStake(dealId);
      const clientBalanceAfter = await mockUSDC.balanceOf(client.address);

      expect(clientBalanceAfter - clientBalanceBefore).to.equal(clientStake);
    });
  });

  describe("Deal Completion", function () {
    let dealId: string;

    beforeEach(async function () {
      dealId = ethers.id("deal-complete-test");
      await dealRegistry.connect(relay1).registerDeal(dealId, client.address, "QmCid", 100, 1000000, 30, 0);
    });

    it("Should complete a deal (by relay)", async function () {
      await dealRegistry.connect(relay1).completeDeal(dealId);

      const deal = await dealRegistry.deals(dealId);
      expect(deal.active).to.be.false;
    });

    it("Should complete a deal (by client)", async function () {
      await dealRegistry.connect(client).completeDeal(dealId);

      const deal = await dealRegistry.deals(dealId);
      expect(deal.active).to.be.false;
    });

    it("Should fail if not deal party", async function () {
      await expect(
        dealRegistry.connect(relay2).completeDeal(dealId)
      ).to.be.revertedWithCustomError(dealRegistry, "NotDealParty");
    });

    it("Should emit StorageDealCompleted event", async function () {
      await expect(
        dealRegistry.connect(relay1).completeDeal(dealId)
      )
        .to.emit(dealRegistry, "StorageDealCompleted")
        .withArgs(dealId, relay1.address);
    });
  });

  describe("Griefing", function () {
    let dealId: string;

    beforeEach(async function () {
      dealId = ethers.id("deal-grief-test");
      await dealRegistry.connect(relay1).registerDeal(dealId, client.address, "QmCid", 100, 1000000, 30, 0);
      
      // Approve for griefing costs (dealRegistry will transfer from client)
      await mockUSDC.connect(client).approve(await dealRegistry.getAddress(), ethers.MaxUint256);
    });

    it("Should grief relay for storage deal (without client stake)", async function () {
      const relayInfoBefore = await relayRegistry.getRelayInfo(relay1.address);
      const slashAmount = ethers.parseUnits("10", 6);
      const defaultRatio = await relayRegistry.defaultGriefingRatio();
      const expectedCost = (slashAmount * BigInt(defaultRatio)) / 10000n;
      
      const clientBalanceBefore = await mockUSDC.balanceOf(client.address);
      
      await dealRegistry.connect(client).grief(dealId, slashAmount, "Failed to provide proof");

      const relayInfoAfter = await relayRegistry.getRelayInfo(relay1.address);
      expect(relayInfoBefore.stakedAmount - relayInfoAfter.stakedAmount).to.equal(slashAmount);
      
      // Verify client paid the cost
      const clientBalanceAfter = await mockUSDC.balanceOf(client.address);
      expect(clientBalanceBefore - clientBalanceAfter).to.equal(expectedCost);
    });

    it("Should use staked client griefing ratio when client has stake", async function () {
      // Add client stake
      const clientStake = ethers.parseUnits("50", 6);
      await dealRegistry.connect(client).addClientStake(dealId, clientStake);
      
      const slashAmount = ethers.parseUnits("5", 6);
      const stakedRatio = await relayRegistry.stakedClientGriefingRatio();
      const expectedCost = (slashAmount * BigInt(stakedRatio)) / 10000n;
      
      const clientBalanceBefore = await mockUSDC.balanceOf(client.address);
      
      await dealRegistry.connect(client).grief(dealId, slashAmount, "Test reason");

      const clientBalanceAfter = await mockUSDC.balanceOf(client.address);
      expect(clientBalanceBefore - clientBalanceAfter).to.equal(expectedCost);
    });

    it("Should fail if not deal client", async function () {
      await expect(
        dealRegistry.connect(relay2).grief(dealId, ethers.parseUnits("10", 6), "reason")
      ).to.be.revertedWithCustomError(dealRegistry, "NotDealParty");
    });

    it("Should fail if deal not active", async function () {
      await dealRegistry.connect(relay1).completeDeal(dealId);
      
      await expect(
        dealRegistry.connect(client).grief(dealId, ethers.parseUnits("10", 6), "reason")
      ).to.be.revertedWithCustomError(dealRegistry, "DealNotActive");
    });

    it("Should fail if deal doesn't exist", async function () {
      const fakeDealId = ethers.id("fake-deal");
      
      await expect(
        dealRegistry.connect(client).grief(fakeDealId, ethers.parseUnits("10", 6), "reason")
      ).to.be.revertedWithCustomError(dealRegistry, "DealNotFound");
    });

    it("Should mark deal as griefed and deactivate after griefing", async function () {
      const dealBefore = await dealRegistry.deals(dealId);
      expect(dealBefore.active).to.be.true;
      expect(dealBefore.griefed).to.be.false;

      await dealRegistry.connect(client).grief(dealId, ethers.parseUnits("10", 6), "Test reason");

      const dealAfter = await dealRegistry.deals(dealId);
      expect(dealAfter.active).to.be.false; // Deal should be deactivated
      expect(dealAfter.griefed).to.be.true; // Deal should be marked as griefed
    });

    it("Should prevent multiple griefing for the same deal", async function () {
      const slashAmount = ethers.parseUnits("10", 6);
      
      // First griefing should succeed
      await dealRegistry.connect(client).grief(dealId, slashAmount, "First grief");

      // Second griefing should fail
      await expect(
        dealRegistry.connect(client).grief(dealId, ethers.parseUnits("5", 6), "Second grief")
      ).to.be.revertedWithCustomError(dealRegistry, "DealAlreadyGriefed");
    });

    it("Should fail to grief if deal already griefed", async function () {
      await dealRegistry.connect(client).grief(dealId, ethers.parseUnits("10", 6), "First grief");
      
      // Try to grief again - should fail
      await expect(
        dealRegistry.connect(client).grief(dealId, ethers.parseUnits("5", 6), "Second attempt")
      ).to.be.revertedWithCustomError(dealRegistry, "DealAlreadyGriefed");
    });
  });

  describe("Discovery", function () {
    it("Should get deal info by ID", async function () {
      const dealId = ethers.id("deal-info-test");
      await dealRegistry.connect(relay1).registerDeal(dealId, client.address, "QmCid", 100, 1000000, 30, 0);

      const deal = await dealRegistry.getDeal(dealId);
      expect(deal.dealId).to.equal(dealId);
      expect(deal.relay).to.equal(relay1.address);
      expect(deal.client).to.equal(client.address);
      expect(deal.cid).to.equal("QmCid");
    });

    it("Should fail to get deal if doesn't exist", async function () {
      const fakeDealId = ethers.id("fake-deal");
      
      await expect(
        dealRegistry.getDeal(fakeDealId)
      ).to.be.revertedWithCustomError(dealRegistry, "DealNotFound");
    });

    it("Should get total deals count", async function () {
      expect(await dealRegistry.getTotalDeals()).to.equal(0);
      
      await dealRegistry.connect(relay1).registerDeal(ethers.id("deal-1"), client.address, "QmCid", 100, 1000000, 30, 0);
      expect(await dealRegistry.getTotalDeals()).to.equal(1);
      
      await dealRegistry.connect(relay1).registerDeal(ethers.id("deal-2"), client.address, "QmCid", 100, 1000000, 30, 0);
      expect(await dealRegistry.getTotalDeals()).to.equal(2);
    });
  });

  describe("Admin Functions", function () {
    it("Should pause and unpause", async function () {
      await dealRegistry.connect(owner).pause();
      
      const dealId = ethers.id("deal-pause-test");
      await expect(
        dealRegistry.connect(relay1).registerDeal(dealId, client.address, "QmCid", 100, 1000000, 30, 0)
      ).to.be.revertedWithCustomError(dealRegistry, "EnforcedPause");

      await dealRegistry.connect(owner).unpause();
      
      await dealRegistry.connect(relay1).registerDeal(dealId, client.address, "QmCid", 100, 1000000, 30, 0);
      const deal = await dealRegistry.deals(dealId);
      expect(deal.active).to.be.true;
    });

    it("Should fail admin functions for non-owner", async function () {
      await expect(
        dealRegistry.connect(relay1).pause()
      ).to.be.revertedWithCustomError(dealRegistry, "OwnableUnauthorizedAccount");
    });
  });
});

