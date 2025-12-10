import { expect } from "chai";
import { ethers } from "hardhat";
import { GunL2Bridge, ShogunRelayRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

/**
 * Merkle Tree utilities for testing
 * These match the contract's verifyProof logic
 */
function computeLeaf(user: string, amount: bigint, nonce: bigint): string {
  const encoded = ethers.solidityPacked(
    ["address", "uint256", "uint256"],
    [user, amount, nonce]
  );
  return ethers.keccak256(encoded);
}

function buildMerkleTree(leaves: string[]): { root: string; proofs: Map<string, string[]> } {
  if (leaves.length === 0) {
    throw new Error("Cannot build tree with empty leaves");
  }

  // Sort leaves for deterministic tree
  const sortedLeaves = [...leaves].sort();
  const tree: string[][] = [sortedLeaves];
  const proofs = new Map<string, string[]>();

  // Build tree bottom-up
  let currentLevel = sortedLeaves;
  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : currentLevel[i];
      const [first, second] = left <= right ? [left, right] : [right, left];
      const hash = ethers.keccak256(ethers.solidityPacked(["bytes32", "bytes32"], [first, second]));
      nextLevel.push(hash);
    }
    tree.push(nextLevel);
    currentLevel = nextLevel;
  }

  const root = currentLevel[0];

  // Generate proofs for all leaves
  for (let i = 0; i < sortedLeaves.length; i++) {
    const proof: string[] = [];
    let index = i;

    for (let level = 0; level < tree.length - 1; level++) {
      const currentLevel = tree[level];
      const siblingIndex = index % 2 === 0 ? index + 1 : index - 1;

      if (siblingIndex < currentLevel.length) {
        proof.push(currentLevel[siblingIndex]);
      } else {
        proof.push(currentLevel[index]);
      }

      index = Math.floor(index / 2);
    }

    proofs.set(sortedLeaves[i], proof);
  }

  return { root, proofs };
}

describe("GunL2Bridge", function () {
  let bridge: GunL2Bridge;
  let relayRegistry: ShogunRelayRegistry;
  let mockUSDC: any;
  let owner: SignerWithAddress;
  let sequencer: SignerWithAddress;
  let relay1: SignerWithAddress;
  let relay2: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let attacker: SignerWithAddress;

  const DEPOSIT_AMOUNT = ethers.parseEther("1.0");
  const WITHDRAW_AMOUNT = ethers.parseEther("0.5");
  const MIN_STAKE = ethers.parseUnits("100", 6); // 100 USDC
  const UNSTAKING_DELAY = 7 * 24 * 60 * 60; // 7 days

  // Test encryption keys
  const PUBKEY = ethers.toUtf8Bytes('{"x":"0x1234","y":"0x5678"}');
  const EPUB = ethers.toUtf8Bytes('{"x":"0xabcd","y":"0xefgh"}');

  beforeEach(async function () {
    [owner, sequencer, relay1, relay2, user1, user2, attacker] = await ethers.getSigners();

    // Deploy mock USDC
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUSDC = await MockERC20.deploy("Mock USDC", "USDC", 6);
    await mockUSDC.waitForDeployment();

    // Deploy relay registry
    const ShogunRelayRegistry = await ethers.getContractFactory("ShogunRelayRegistry");
    relayRegistry = await ShogunRelayRegistry.deploy(
      await mockUSDC.getAddress(),
      MIN_STAKE,
      UNSTAKING_DELAY,
      owner.address // treasury
    );
    await relayRegistry.waitForDeployment();

    // Mint USDC to relays for staking
    await mockUSDC.mint(relay1.address, ethers.parseUnits("1000", 6));
    await mockUSDC.mint(relay2.address, ethers.parseUnits("1000", 6));
    await mockUSDC.approve(await relayRegistry.getAddress(), ethers.MaxUint256);
    await mockUSDC.connect(relay1).approve(await relayRegistry.getAddress(), ethers.MaxUint256);
    await mockUSDC.connect(relay2).approve(await relayRegistry.getAddress(), ethers.MaxUint256);

    // Register relay1
    await relayRegistry.connect(relay1).registerRelay(
      "https://relay1.example.com",
      PUBKEY,
      EPUB,
      MIN_STAKE,
      0 // default griefing ratio
    );

    // Deploy bridge with relay registry and optional sequencer (zero = any relay can submit)
    const GunL2Bridge = await ethers.getContractFactory("GunL2Bridge");
    bridge = await GunL2Bridge.deploy(await relayRegistry.getAddress(), ethers.ZeroAddress);
    await bridge.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct relay registry", async function () {
      expect(await bridge.relayRegistry()).to.equal(await relayRegistry.getAddress());
    });

    it("Should initialize with zero sequencer (any relay can submit)", async function () {
      expect(await bridge.sequencer()).to.equal(ethers.ZeroAddress);
    });

    it("Should initialize with zero batch ID", async function () {
      expect(await bridge.currentBatchId()).to.equal(0);
    });

    it("Should initialize with zero state root", async function () {
      expect(await bridge.currentStateRoot()).to.equal(ethers.ZeroHash);
    });

    it("Should reject zero address relay registry", async function () {
      const GunL2Bridge = await ethers.getContractFactory("GunL2Bridge");
      await expect(
        GunL2Bridge.deploy(ethers.ZeroAddress, ethers.ZeroAddress)
      ).to.be.revertedWith("GunL2Bridge: Invalid relay registry");
    });

    it("Should allow deployment with dedicated sequencer", async function () {
      const GunL2Bridge = await ethers.getContractFactory("GunL2Bridge");
      const bridgeWithSequencer = await GunL2Bridge.deploy(
        await relayRegistry.getAddress(),
        sequencer.address
      );
      await bridgeWithSequencer.waitForDeployment();

      const stateRoot = ethers.keccak256(ethers.toUtf8Bytes("test-root"));
      expect(await bridgeWithSequencer.sequencer()).to.equal(sequencer.address);
    });
  });

  describe("Deposits", function () {
    it("Should accept ETH deposits", async function () {
      const tx = await bridge.connect(user1).deposit({ value: DEPOSIT_AMOUNT });
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt?.blockNumber || 0);

      await expect(tx)
        .to.emit(bridge, "Deposit")
        .withArgs(user1.address, DEPOSIT_AMOUNT, block?.timestamp || 0);

      expect(await ethers.provider.getBalance(await bridge.getAddress())).to.equal(DEPOSIT_AMOUNT);
    });

    it("Should reject zero amount deposits", async function () {
      await expect(
        bridge.connect(user1).deposit({ value: 0 })
      ).to.be.revertedWith("GunL2Bridge: Must send ETH");
    });

    it("Should accept deposits via receive()", async function () {
      await expect(
        user1.sendTransaction({
          to: await bridge.getAddress(),
          value: DEPOSIT_AMOUNT,
        })
      ).to.emit(bridge, "Deposit");

      expect(await ethers.provider.getBalance(await bridge.getAddress())).to.equal(DEPOSIT_AMOUNT);
    });

    it("Should emit Deposit event with correct parameters", async function () {
      const tx = await bridge.connect(user1).deposit({ value: DEPOSIT_AMOUNT });
      const receipt = await tx.wait();

      const depositEvent = receipt?.logs.find(
        (log) => bridge.interface.parseLog(log as any)?.name === "Deposit"
      );

      expect(depositEvent).to.not.be.undefined;
      if (depositEvent) {
        const parsed = bridge.interface.parseLog(depositEvent as any);
        expect(parsed?.args[0]).to.equal(user1.address);
        expect(parsed?.args[1]).to.equal(DEPOSIT_AMOUNT);
      }
    });

    it("Should handle multiple deposits", async function () {
      await bridge.connect(user1).deposit({ value: DEPOSIT_AMOUNT });
      await bridge.connect(user2).deposit({ value: DEPOSIT_AMOUNT });

      expect(await ethers.provider.getBalance(await bridge.getAddress())).to.equal(
        DEPOSIT_AMOUNT * 2n
      );
    });
  });

  describe("Batch Submission", function () {
    it("Should allow registered relay to submit batch when sequencer is zero", async function () {
      const stateRoot = ethers.keccak256(ethers.toUtf8Bytes("test-root"));




      await expect(
        bridge.connect(relay1).submitBatch(stateRoot, [])
      ).to.emit(bridge, "BatchSubmitted")
        .withArgs(1, stateRoot);

      expect(await bridge.currentStateRoot()).to.equal(stateRoot);
      expect(await bridge.currentBatchId()).to.equal(1);
    });

    it("Should reject batch submission from non-registered address", async function () {
      const stateRoot = ethers.keccak256(ethers.toUtf8Bytes("test-root"));


      await expect(
        bridge.connect(user1).submitBatch(stateRoot, [])
      ).to.be.revertedWith("GunL2Bridge: Not sequencer or registered relay");
    });

    it("Should allow multiple registered relays to submit batches", async function () {
      // Register relay2
      await relayRegistry.connect(relay2).registerRelay(
        "https://relay2.example.com",
        PUBKEY,
        EPUB,
        MIN_STAKE,
        0
      );

      const root1 = ethers.keccak256(ethers.toUtf8Bytes("root1"));
      const root2 = ethers.keccak256(ethers.toUtf8Bytes("root2"));





      await bridge.connect(relay1).submitBatch(root1, []);
      expect(await bridge.currentBatchId()).to.equal(1);

      await bridge.connect(relay2).submitBatch(root2, []);
      expect(await bridge.currentBatchId()).to.equal(2);
      expect(await bridge.currentStateRoot()).to.equal(root2);
    });

    it("Should allow dedicated sequencer to submit when set", async function () {
      // Deploy bridge with dedicated sequencer
      const GunL2Bridge = await ethers.getContractFactory("GunL2Bridge");
      const bridgeWithSequencer = await GunL2Bridge.deploy(
        await relayRegistry.getAddress(),
        sequencer.address
      );
      await bridgeWithSequencer.waitForDeployment();

      const stateRoot = ethers.keccak256(ethers.toUtf8Bytes("test-root"));





      await expect(
        bridgeWithSequencer.connect(sequencer).submitBatch(stateRoot, [])
      ).to.emit(bridgeWithSequencer, "BatchSubmitted");

      // Registered relay should NOT be able to submit when sequencer is set
      await expect(
        bridgeWithSequencer.connect(relay1).submitBatch(stateRoot, [])
      ).to.be.revertedWith("GunL2Bridge: Not sequencer");
    });

    it("Should allow owner to switch from relay-based to dedicated sequencer", async function () {
      // Initially any relay can submit
      const root1 = ethers.keccak256(ethers.toUtf8Bytes("root1"));
      await bridge.connect(relay1).submitBatch(root1, []);

      // Set dedicated sequencer
      await bridge.connect(owner).setSequencer(sequencer.address);

      // Now only sequencer can submit
      const root2 = ethers.keccak256(ethers.toUtf8Bytes("root2"));
      await bridge.connect(sequencer).submitBatch(root2, []);

      // Relay should be rejected
      await expect(
        bridge.connect(relay1).submitBatch(root2, [])
      ).to.be.revertedWith("GunL2Bridge: Not sequencer");
    });

    it("Should allow owner to switch from dedicated sequencer to relay-based", async function () {
      // Deploy with dedicated sequencer
      const GunL2Bridge = await ethers.getContractFactory("GunL2Bridge");
      const bridgeWithSequencer = await GunL2Bridge.deploy(
        await relayRegistry.getAddress(),
        sequencer.address
      );
      await bridgeWithSequencer.waitForDeployment();

      const stateRoot = ethers.keccak256(ethers.toUtf8Bytes("test-root"));

      // Set sequencer to zero (allow any relay)
      await bridgeWithSequencer.connect(owner).setSequencer(ethers.ZeroAddress);

      // Now relay can submit


      await expect(
        bridgeWithSequencer.connect(relay1).submitBatch(stateRoot, [])
      ).to.emit(bridgeWithSequencer, "BatchSubmitted");
    });

    it("Should reject zero root", async function () {
      await expect(
        bridge.connect(relay1).submitBatch(ethers.ZeroHash, [])
      ).to.be.revertedWith("GunL2Bridge: Invalid root");
    });

    it("Should increment batch ID on each submission", async function () {
      const root1 = ethers.keccak256(ethers.toUtf8Bytes("root1"));
      const root2 = ethers.keccak256(ethers.toUtf8Bytes("root2"));

      await bridge.connect(relay1).submitBatch(root1, []);
      expect(await bridge.currentBatchId()).to.equal(1);

      await bridge.connect(relay1).submitBatch(root2, []);
      expect(await bridge.currentBatchId()).to.equal(2);
      expect(await bridge.currentStateRoot()).to.equal(root2);
    });

    it("Should be paused when contract is paused", async function () {
      await bridge.connect(owner).pause();
      const stateRoot = ethers.keccak256(ethers.toUtf8Bytes("test-root"));


      await expect(
        bridge.connect(relay1).submitBatch(stateRoot, [])
      ).to.be.revertedWithCustomError(bridge, "EnforcedPause");
    });
  });

  describe("Withdrawals", function () {
    let withdrawal1: { user: string; amount: bigint; nonce: bigint };
    let withdrawal2: { user: string; amount: bigint; nonce: bigint };
    let merkleRoot: string;
    let proof1: string[];
    let proof2: string[];

    beforeEach(async function () {
      // Setup: Deposit ETH first
      await bridge.connect(user1).deposit({ value: DEPOSIT_AMOUNT });
      await bridge.connect(user2).deposit({ value: DEPOSIT_AMOUNT });

      // Create withdrawal data
      withdrawal1 = {
        user: user1.address,
        amount: WITHDRAW_AMOUNT,
        nonce: 1n,
      };

      withdrawal2 = {
        user: user2.address,
        amount: WITHDRAW_AMOUNT,
        nonce: 1n,
      };

      // Build Merkle tree
      const leaf1 = computeLeaf(withdrawal1.user, withdrawal1.amount, withdrawal1.nonce);
      const leaf2 = computeLeaf(withdrawal2.user, withdrawal2.amount, withdrawal2.nonce);
      const { root, proofs } = buildMerkleTree([leaf1, leaf2]);

      merkleRoot = root;
      proof1 = proofs.get(leaf1) || [];
      proof2 = proofs.get(leaf2) || [];

      // Submit batch (using registered relay)
      await bridge.connect(relay1).submitBatch(merkleRoot, []);
    });

    it("Should allow valid withdrawal with Merkle proof", async function () {
      const balanceBefore = await ethers.provider.getBalance(user1.address);

      const tx = await bridge.connect(user1).withdraw(
        withdrawal1.amount,
        withdrawal1.nonce,
        1,
        proof1
      );
      const receipt = await tx.wait();
      const gasUsed = receipt?.gasUsed || 0n;
      const gasPrice = receipt?.gasPrice || 0n;
      const gasCost = gasUsed * gasPrice;

      await expect(tx)
        .to.emit(bridge, "Withdrawal")
        .withArgs(user1.address, withdrawal1.amount, withdrawal1.nonce);

      const balanceAfter = await ethers.provider.getBalance(user1.address);
      expect(balanceAfter - balanceBefore).to.equal(withdrawal1.amount - gasCost);
    });

    it("Should reject withdrawal with invalid proof", async function () {
      const invalidProof = [ethers.keccak256(ethers.toUtf8Bytes("invalid"))];

      await expect(
        bridge.connect(user1).withdraw(withdrawal1.amount, withdrawal1.nonce, 1, invalidProof)
      ).to.be.revertedWith("GunL2Bridge: Invalid Merkle proof");
    });

    it("Should reject withdrawal with wrong amount", async function () {
      const wrongAmount = WITHDRAW_AMOUNT * 2n;
      const wrongLeaf = computeLeaf(user1.address, wrongAmount, withdrawal1.nonce);
      const { proofs } = buildMerkleTree([wrongLeaf]);
      const wrongProof = proofs.get(wrongLeaf) || [];

      await expect(
        bridge.connect(user1).withdraw(wrongAmount, withdrawal1.nonce, 1, wrongProof)
      ).to.be.revertedWith("GunL2Bridge: Invalid Merkle proof");
    });

    it("Should reject withdrawal with wrong nonce", async function () {
      const wrongNonce = 999n;
      const wrongLeaf = computeLeaf(user1.address, withdrawal1.amount, wrongNonce);
      const { proofs } = buildMerkleTree([wrongLeaf]);
      const wrongProof = proofs.get(wrongLeaf) || [];

      await expect(
        bridge.connect(user1).withdraw(withdrawal1.amount, wrongNonce, 1, wrongProof)
      ).to.be.revertedWith("GunL2Bridge: Invalid Merkle proof");
    });

    it("Should reject withdrawal from wrong user", async function () {
      // User2 tries to withdraw user1's withdrawal
      await expect(
        bridge.connect(user2).withdraw(withdrawal1.amount, withdrawal1.nonce, 1, proof1)
      ).to.be.revertedWith("GunL2Bridge: Invalid Merkle proof");
    });

    it("Should prevent replay attack (double withdrawal)", async function () {
      // First withdrawal succeeds
      await bridge.connect(user1).withdraw(withdrawal1.amount, withdrawal1.nonce, 1, proof1);

      // Second attempt with same proof should fail
      await expect(
        bridge.connect(user1).withdraw(withdrawal1.amount, withdrawal1.nonce, 1, proof1)
      ).to.be.revertedWith("GunL2Bridge: Withdrawal already processed");
    });

    it("Should allow multiple different withdrawals", async function () {
      await bridge.connect(user1).withdraw(withdrawal1.amount, withdrawal1.nonce, 1, proof1);
      await bridge.connect(user2).withdraw(withdrawal2.amount, withdrawal2.nonce, 1, proof2);

      const contractBalance = await ethers.provider.getBalance(await bridge.getAddress());
      expect(contractBalance).to.equal(
        DEPOSIT_AMOUNT * 2n - withdrawal1.amount - withdrawal2.amount
      );
    });

    it("Should reject withdrawal with insufficient contract balance", async function () {
      // First, deposit some ETH
      await bridge.connect(user1).deposit({ value: DEPOSIT_AMOUNT });

      // Get current balance
      const currentBalance = await ethers.provider.getBalance(await bridge.getAddress());

      // Create a withdrawal for more than available
      const largeWithdrawal = {
        user: user1.address,
        amount: currentBalance + 1n, // More than available
        nonce: 2n,
      };

      const largeLeaf = computeLeaf(largeWithdrawal.user, largeWithdrawal.amount, largeWithdrawal.nonce);
      const { root: newRoot, proofs } = buildMerkleTree([largeLeaf]);
      const largeProof = proofs.get(largeLeaf) || [];

      await bridge.connect(relay1).submitBatch(newRoot, []);

      await expect(
        bridge.connect(user1).withdraw(largeWithdrawal.amount, largeWithdrawal.nonce, 2, largeProof)
      ).to.be.revertedWith("GunL2Bridge: Insufficient contract balance");
    });

    it("Should reject zero amount withdrawal", async function () {
      await expect(
        bridge.connect(user1).withdraw(0, withdrawal1.nonce, 1, proof1)
      ).to.be.revertedWith("GunL2Bridge: Invalid amount");
    });

    it("Should check isWithdrawalProcessed correctly", async function () {
      expect(
        await bridge.isWithdrawalProcessed(user1.address, withdrawal1.amount, withdrawal1.nonce)
      ).to.be.false;

      await bridge.connect(user1).withdraw(withdrawal1.amount, withdrawal1.nonce, 1, proof1);

      expect(
        await bridge.isWithdrawalProcessed(user1.address, withdrawal1.amount, withdrawal1.nonce)
      ).to.be.true;
    });

    it("Should be paused when contract is paused", async function () {
      await bridge.connect(owner).pause();
      const stateRoot = ethers.keccak256(ethers.toUtf8Bytes("test-root"));

      await expect(
        bridge.connect(user1).withdraw(withdrawal1.amount, withdrawal1.nonce, 1, proof1)
      ).to.be.revertedWithCustomError(bridge, "EnforcedPause");
    });
  });

  describe("Merkle Proof Verification", function () {
    it("Should verify proof for single withdrawal", async function () {
      await bridge.connect(user1).deposit({ value: DEPOSIT_AMOUNT });

      const withdrawal = {
        user: user1.address,
        amount: WITHDRAW_AMOUNT,
        nonce: 1n,
      };

      const leaf = computeLeaf(withdrawal.user, withdrawal.amount, withdrawal.nonce);
      const { root, proofs } = buildMerkleTree([leaf]);
      const proof = proofs.get(leaf) || [];

      await bridge.connect(relay1).submitBatch(root, []);

      await expect(
        bridge.connect(user1).withdraw(withdrawal.amount, withdrawal.nonce, 1, proof)
      ).to.emit(bridge, "Withdrawal");
    });

    it("Should verify proof for multiple withdrawals", async function () {
      await bridge.connect(user1).deposit({ value: DEPOSIT_AMOUNT });
      await bridge.connect(user2).deposit({ value: DEPOSIT_AMOUNT });

      const withdrawals = [
        { user: user1.address, amount: WITHDRAW_AMOUNT, nonce: 1n },
        { user: user2.address, amount: WITHDRAW_AMOUNT, nonce: 1n },
        { user: user1.address, amount: ethers.parseEther("0.1"), nonce: 2n },
      ];

      const leaves = withdrawals.map((w) => computeLeaf(w.user, w.amount, w.nonce));
      const { root, proofs } = buildMerkleTree(leaves);

      await bridge.connect(relay1).submitBatch(root, []);

      // Verify all withdrawals
      for (const withdrawal of withdrawals) {
        const leaf = computeLeaf(withdrawal.user, withdrawal.amount, withdrawal.nonce);
        const proof = proofs.get(leaf) || [];

        await expect(
          bridge.connect(await ethers.getSigner(withdrawal.user)).withdraw(
            withdrawal.amount,
            withdrawal.nonce,
            1,
            proof
          )
        ).to.emit(bridge, "Withdrawal");
      }
    });

    it("Should handle odd number of leaves", async function () {
      await bridge.connect(user1).deposit({ value: DEPOSIT_AMOUNT });

      const withdrawal = {
        user: user1.address,
        amount: WITHDRAW_AMOUNT,
        nonce: 1n,
      };

      const leaf = computeLeaf(withdrawal.user, withdrawal.amount, withdrawal.nonce);
      const { root, proofs } = buildMerkleTree([leaf]);
      const proof = proofs.get(leaf) || [];

      await bridge.connect(relay1).submitBatch(root, []);

      await expect(
        bridge.connect(user1).withdraw(withdrawal.amount, withdrawal.nonce, 1, proof)
      ).to.emit(bridge, "Withdrawal");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update sequencer", async function () {
      await bridge.connect(owner).setSequencer(user1.address);
      expect(await bridge.sequencer()).to.equal(user1.address);
    });

    it("Should reject sequencer update from non-owner", async function () {
      await expect(
        bridge.connect(user1).setSequencer(user1.address)
      ).to.be.revertedWithCustomError(bridge, "OwnableUnauthorizedAccount");
    });

    it("Should allow setting sequencer to zero address (enable relay-based)", async function () {
      // Set a dedicated sequencer first
      await bridge.connect(owner).setSequencer(sequencer.address);
      expect(await bridge.sequencer()).to.equal(sequencer.address);

      // Set back to zero (allow any relay)
      await bridge.connect(owner).setSequencer(ethers.ZeroAddress);
      expect(await bridge.sequencer()).to.equal(ethers.ZeroAddress);

      // Now relay can submit
      const stateRoot = ethers.keccak256(ethers.toUtf8Bytes("test-root"));

      await expect(
        bridge.connect(relay1).submitBatch(stateRoot, [])
      ).to.emit(bridge, "BatchSubmitted");
    });

    it("Should allow owner to update relay registry", async function () {
      // Deploy new registry
      const ShogunRelayRegistry = await ethers.getContractFactory("ShogunRelayRegistry");
      const newRegistry = await ShogunRelayRegistry.deploy(
        await mockUSDC.getAddress(),
        MIN_STAKE,
        UNSTAKING_DELAY,
        owner.address
      );
      await newRegistry.waitForDeployment();

      await bridge.connect(owner).setRelayRegistry(await newRegistry.getAddress());
      expect(await bridge.relayRegistry()).to.equal(await newRegistry.getAddress());
    });

    it("Should reject relay registry update from non-owner", async function () {
      const ShogunRelayRegistry = await ethers.getContractFactory("ShogunRelayRegistry");
      const newRegistry = await ShogunRelayRegistry.deploy(
        await mockUSDC.getAddress(),
        MIN_STAKE,
        UNSTAKING_DELAY,
        owner.address
      );
      await newRegistry.waitForDeployment();

      await expect(
        bridge.connect(user1).setRelayRegistry(await newRegistry.getAddress())
      ).to.be.revertedWithCustomError(bridge, "OwnableUnauthorizedAccount");
    });

    it("Should reject zero address relay registry update", async function () {
      await expect(
        bridge.connect(owner).setRelayRegistry(ethers.ZeroAddress)
      ).to.be.revertedWith("GunL2Bridge: Invalid relay registry");
    });

    it("Should allow owner to pause", async function () {
      await bridge.connect(owner).pause();
      expect(await bridge.paused()).to.be.true;
    });

    it("Should allow owner to unpause", async function () {
      await bridge.connect(owner).pause();
      await bridge.connect(owner).unpause();
      expect(await bridge.paused()).to.be.false;
    });

    it("Should allow owner to emergency withdraw", async function () {
      await bridge.connect(user1).deposit({ value: DEPOSIT_AMOUNT });

      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
      const tx = await bridge.connect(owner).emergencyWithdraw(DEPOSIT_AMOUNT, owner.address);
      const receipt = await tx.wait();
      const gasUsed = receipt?.gasUsed || 0n;
      const gasPrice = receipt?.gasPrice || 0n;
      const gasCost = gasUsed * gasPrice;

      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      expect(ownerBalanceAfter - ownerBalanceBefore).to.equal(DEPOSIT_AMOUNT - gasCost);
    });

    it("Should reject emergency withdraw from non-owner", async function () {
      await expect(
        bridge.connect(user1).emergencyWithdraw(DEPOSIT_AMOUNT, user1.address)
      ).to.be.revertedWithCustomError(bridge, "OwnableUnauthorizedAccount");
    });

    it("Should reject emergency withdraw to zero address", async function () {
      await bridge.connect(user1).deposit({ value: DEPOSIT_AMOUNT });

      await expect(
        bridge.connect(owner).emergencyWithdraw(DEPOSIT_AMOUNT, ethers.ZeroAddress)
      ).to.be.revertedWith("GunL2Bridge: Invalid recipient");
    });

    it("Should reject emergency withdraw exceeding balance", async function () {
      await expect(
        bridge.connect(owner).emergencyWithdraw(DEPOSIT_AMOUNT, owner.address)
      ).to.be.revertedWith("GunL2Bridge: Insufficient balance");
    });
  });

  describe("View Functions", function () {
    it("Should return correct contract balance", async function () {
      expect(await bridge.getBalance()).to.equal(0);

      await bridge.connect(user1).deposit({ value: DEPOSIT_AMOUNT });
      expect(await bridge.getBalance()).to.equal(DEPOSIT_AMOUNT);

      await bridge.connect(user2).deposit({ value: DEPOSIT_AMOUNT });
      expect(await bridge.getBalance()).to.equal(DEPOSIT_AMOUNT * 2n);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle very large withdrawal amounts", async function () {
      const largeAmount = ethers.parseEther("1000");
      await bridge.connect(user1).deposit({ value: largeAmount });

      const withdrawal = {
        user: user1.address,
        amount: largeAmount,
        nonce: 1n,
      };

      const leaf = computeLeaf(withdrawal.user, withdrawal.amount, withdrawal.nonce);
      const { root, proofs } = buildMerkleTree([leaf]);
      const proof = proofs.get(leaf) || [];

      await bridge.connect(relay1).submitBatch(root, []);

      await expect(
        bridge.connect(user1).withdraw(withdrawal.amount, withdrawal.nonce, 1, proof)
      ).to.emit(bridge, "Withdrawal");
    });

    it("Should handle very large nonce values", async function () {
      await bridge.connect(user1).deposit({ value: DEPOSIT_AMOUNT });

      const largeNonce = ethers.MaxUint256;
      const withdrawal = {
        user: user1.address,
        amount: WITHDRAW_AMOUNT,
        nonce: largeNonce,
      };

      const leaf = computeLeaf(withdrawal.user, withdrawal.amount, withdrawal.nonce);
      const { root, proofs } = buildMerkleTree([leaf]);
      const proof = proofs.get(leaf) || [];

      await bridge.connect(relay1).submitBatch(root, []);

      await expect(
        bridge.connect(user1).withdraw(withdrawal.amount, withdrawal.nonce, 1, proof)
      ).to.emit(bridge, "Withdrawal");
    });

    it("Should handle many withdrawals in a single batch", async function () {
      const numWithdrawals = 10;
      const depositPerUser = ethers.parseEther("1.0");
      const withdrawPerUser = ethers.parseEther("0.5");

      // Deposit from multiple users
      const users = await ethers.getSigners();
      for (let i = 0; i < numWithdrawals; i++) {
        await bridge.connect(users[i]).deposit({ value: depositPerUser });
      }

      // Create withdrawals
      const withdrawals = [];
      for (let i = 0; i < numWithdrawals; i++) {
        withdrawals.push({
          user: users[i].address,
          amount: withdrawPerUser,
          nonce: 1n,
        });
      }

      // Build Merkle tree
      const leaves = withdrawals.map((w) => computeLeaf(w.user, w.amount, w.nonce));
      const { root, proofs } = buildMerkleTree(leaves);

      await bridge.connect(relay1).submitBatch(root, []);

      // Verify all withdrawals work
      for (const withdrawal of withdrawals) {
        const leaf = computeLeaf(withdrawal.user, withdrawal.amount, withdrawal.nonce);
        const proof = proofs.get(leaf) || [];

        await expect(
          bridge.connect(await ethers.getSigner(withdrawal.user)).withdraw(
            withdrawal.amount,
            withdrawal.nonce,
            1,
            proof
          )
        ).to.emit(bridge, "Withdrawal");
      }
    });
    it("Should allow withdrawals from previous batches (regression test)", async function () {
      // 1. Setup batch 1
      await bridge.connect(user1).deposit({ value: DEPOSIT_AMOUNT });
      const withdrawal1 = { user: user1.address, amount: WITHDRAW_AMOUNT, nonce: 1n };
      const leaf1 = computeLeaf(withdrawal1.user, withdrawal1.amount, withdrawal1.nonce);
      const { root: root1, proofs: proofs1 } = buildMerkleTree([leaf1]);
      await bridge.connect(relay1).submitBatch(root1, []);
      const proof1 = proofs1.get(leaf1) || [];

      expect(await bridge.currentBatchId()).to.equal(1);

      // 2. Setup batch 2 (new state)
      await bridge.connect(user2).deposit({ value: DEPOSIT_AMOUNT });
      const withdrawal2 = { user: user2.address, amount: WITHDRAW_AMOUNT, nonce: 1n };
      const leaf2 = computeLeaf(withdrawal2.user, withdrawal2.amount, withdrawal2.nonce);
      // Let's say batch 2 contains BOTH withdrawal1 (unclaimed) and withdrawal2?
      // Or just withdrawal2?
      // In a real rollup, the state root *accumulates*. But our bridge verifyProof just checks inclusion in THAT root.
      // If we submit a NEW root, it might essentially fork the history if not careful.
      // But here we are testing the ability to withdraw against an OLD root.
      const { root: root2, proofs: proofs2 } = buildMerkleTree([leaf2]);
      await bridge.connect(relay1).submitBatch(root2, []);
      const proof2 = proofs2.get(leaf2) || [];

      expect(await bridge.currentBatchId()).to.equal(2);

      // 3. Withdraw from Batch 1 (Historical)
      // This would fail in the old contract because currentStateRoot would be root2
      await expect(
        bridge.connect(user1).withdraw(withdrawal1.amount, withdrawal1.nonce, 1, proof1)
      ).to.emit(bridge, "Withdrawal");

      // 4. Withdraw from Batch 2
      await expect(
        bridge.connect(user2).withdraw(withdrawal2.amount, withdrawal2.nonce, 2, proof2)
      ).to.emit(bridge, "Withdrawal");
    });
  });

  describe("Force Withdrawals (Anti-Censorship)", function () {
    it("Should allow user to initiate force withdrawal", async function () {
      const tx = await bridge.connect(user1).initiateForceWithdrawal(WITHDRAW_AMOUNT, 1);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt?.blockNumber || 0);
      const deadline = BigInt(block?.timestamp || 0) + 24n * 3600n;

      const leaf = computeLeaf(user1.address, WITHDRAW_AMOUNT, 1n);

      await expect(tx)
        .to.emit(bridge, "ForceWithdrawalInitiated")
        .withArgs(leaf, user1.address, WITHDRAW_AMOUNT, deadline);

      expect(await bridge.pendingForceWithdrawals(leaf)).to.equal(deadline);
    });

    it("Should reject duplicate force withdrawal initiation", async function () {
      await bridge.connect(user1).initiateForceWithdrawal(WITHDRAW_AMOUNT, 1);
      await expect(
        bridge.connect(user1).initiateForceWithdrawal(WITHDRAW_AMOUNT, 1)
      ).to.be.revertedWith("GunL2Bridge: Already pending");
    });

    it("Should allow sequencer to clear force withdrawal in batch", async function () {
      // 1. Initiate
      await bridge.connect(user1).initiateForceWithdrawal(WITHDRAW_AMOUNT, 1);
      const leaf = computeLeaf(user1.address, WITHDRAW_AMOUNT, 1n);

      // 2. Submit batch acknowledging it
      const root = ethers.keccak256(ethers.toUtf8Bytes("rootsie"));
      await bridge.connect(relay1).submitBatch(root, [leaf]);

      // 3. Verify cleared
      expect(await bridge.pendingForceWithdrawals(leaf)).to.equal(0);
    });

    it("Should allow proving censorship (freezing bridge) after timeout", async function () {
      // 1. Initiate
      await bridge.connect(user1).initiateForceWithdrawal(WITHDRAW_AMOUNT, 1);

      // 2. Advance time past deadline (24 hours + 1 second)
      await time.increase(24 * 3600 + 1);

      // 3. Prove censorship
      await expect(
        bridge.connect(user1).proveCensorship(user1.address, WITHDRAW_AMOUNT, 1)
      ).to.emit(bridge, "BridgeFrozen");

      // 4. Verify paused
      expect(await bridge.paused()).to.be.true;
    });

    it("Should reject proving censorship before timeout", async function () {
      await bridge.connect(user1).initiateForceWithdrawal(WITHDRAW_AMOUNT, 1);

      // Advance time only partially
      await time.increase(23 * 3600);

      await expect(
        bridge.connect(user1).proveCensorship(user1.address, WITHDRAW_AMOUNT, 1)
      ).to.be.revertedWith("GunL2Bridge: Deadline not passed");
    });

    it("Should reject proving censorship if not pending", async function () {
      await expect(
        bridge.connect(user1).proveCensorship(user1.address, WITHDRAW_AMOUNT, 1)
      ).to.be.revertedWith("GunL2Bridge: Not pending");
    });
  });
});

