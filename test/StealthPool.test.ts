import { expect } from "chai";
import { ethers } from "hardhat";
import { StealthPool } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

describe("StealthPool", function () {
  let stealthPool: StealthPool;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  const DEPOSIT_AMOUNT = ethers.parseEther("1.0");

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    const StealthPoolFactory = await ethers.getContractFactory("StealthPool");
    stealthPool = await StealthPoolFactory.deploy(DEPOSIT_AMOUNT);
    await stealthPool.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct deposit amount", async function () {
      expect(await stealthPool.depositAmount()).to.equal(DEPOSIT_AMOUNT);
    });

    it("Should set the correct owner", async function () {
      expect(await stealthPool.owner()).to.equal(owner.address);
    });

    it("Should start with zero deposits", async function () {
      expect(await stealthPool.getDepositCount()).to.equal(0);
      expect(await stealthPool.getBalance()).to.equal(0);
    });
  });

  describe("Deposit and Registration", function () {
    it("Should accept ETH deposits", async function () {
      const depositAmount = ethers.parseEther("0.5");

      await stealthPool
        .connect(user1)
        .registerDeposit(
          ethers.keccak256(ethers.toUtf8Bytes("test commitment 1"))
        );

      await expect(
        user1.sendTransaction({
          to: await stealthPool.getAddress(),
          value: depositAmount,
        })
      ).to.changeEtherBalance(stealthPool, depositAmount);
    });

    it("Should register commitments correctly", async function () {
      const commitment1 = ethers.keccak256(
        ethers.toUtf8Bytes("test commitment 1")
      );
      const commitment2 = ethers.keccak256(
        ethers.toUtf8Bytes("test commitment 2")
      );

      await stealthPool.connect(user1).registerDeposit(commitment1);
      await stealthPool.connect(user2).registerDeposit(commitment2);

      expect(await stealthPool.getDepositCount()).to.equal(2);
      expect(await stealthPool.isCommitmentRegistered(commitment1)).to.be.true;
      expect(await stealthPool.isCommitmentRegistered(commitment2)).to.be.true;
    });

    it("Should reject duplicate commitments", async function () {
      const commitment = ethers.keccak256(
        ethers.toUtf8Bytes("test commitment")
      );

      await stealthPool.connect(user1).registerDeposit(commitment);

      await expect(
        stealthPool.connect(user2).registerDeposit(commitment)
      ).to.be.revertedWith("StealthPool: commitment already registered");
    });

    it("Should reject zero commitments", async function () {
      await expect(
        stealthPool.connect(user1).registerDeposit(ethers.ZeroHash)
      ).to.be.revertedWith("StealthPool: commitment cannot be zero");
    });
  });

  describe("Merkle Tree Operations", function () {
    let commitments: string[];
    let merkleTree: MerkleTree;

    beforeEach(async function () {
      const commitment1 = ethers.keccak256(ethers.toUtf8Bytes("commitment 1"));
      const commitment2 = ethers.keccak256(ethers.toUtf8Bytes("commitment 2"));
      const commitment3 = ethers.keccak256(ethers.toUtf8Bytes("commitment 3"));

      commitments = [commitment1, commitment2, commitment3];

      await stealthPool.connect(user1).registerDeposit(commitment1);
      await stealthPool.connect(user2).registerDeposit(commitment2);
      await stealthPool.connect(user3).registerDeposit(commitment3);

      merkleTree = new MerkleTree(commitments, keccak256, {
        hashLeaves: false,
        sortPairs: true,
      });
      const merkleRoot = "0x" + merkleTree.getRoot().toString("hex");
      await stealthPool.connect(owner).updateMerkleRoot(merkleRoot);
    });

    it("Should have the correct Merkle root", async function () {
      const contractRoot = await stealthPool.merkleRoot();
      const expectedRoot = "0x" + merkleTree.getRoot().toString("hex");
      expect(contractRoot).to.equal(expectedRoot);
    });

    it("Should verify Merkle proof correctly", async function () {
      const leaf = commitments[0];
      const proof = merkleTree.getHexProof(leaf);

      const recipient = user2.address;
      const nonce = ethers.keccak256(ethers.toUtf8Bytes("test nonce"));

      await user1.sendTransaction({
        to: await stealthPool.getAddress(),
        value: DEPOSIT_AMOUNT,
      });

      const initialBalance = await ethers.provider.getBalance(recipient);

      await stealthPool
        .connect(user1)
        .withdraw(commitments[0], nonce, recipient, proof);

      const finalBalance = await ethers.provider.getBalance(recipient);
      expect(finalBalance - initialBalance).to.equal(DEPOSIT_AMOUNT);
    });
  });

  describe("Withdrawal", function () {
    let commitment: string;
    let nonce: string;
    let recipient: string;
    let merkleTree: MerkleTree;

    beforeEach(async function () {
      commitment = ethers.keccak256(ethers.toUtf8Bytes("test commitment"));
      nonce = ethers.keccak256(ethers.toUtf8Bytes("test nonce"));
      recipient = user2.address;

      await stealthPool.connect(user1).registerDeposit(commitment);

      const leaves = [commitment];
      merkleTree = new MerkleTree(leaves, keccak256, {
        hashLeaves: false,
        sortPairs: true,
      });
      const merkleRoot = "0x" + merkleTree.getRoot().toString("hex");
      await stealthPool.connect(owner).updateMerkleRoot(merkleRoot);

      await user1.sendTransaction({
        to: await stealthPool.getAddress(),
        value: DEPOSIT_AMOUNT,
      });
    });

    it("Should allow valid withdrawals", async function () {
      const leaf = commitment;
      const proof = merkleTree.getHexProof(leaf);
      const initialBalance = await ethers.provider.getBalance(recipient);

      await stealthPool
        .connect(user1)
        .withdraw(commitment, nonce, recipient, proof);

      const finalBalance = await ethers.provider.getBalance(recipient);
      expect(finalBalance - initialBalance).to.equal(DEPOSIT_AMOUNT);
    });

    it("Should mark commitment as spent after withdrawal", async function () {
      const leaf = commitment;
      const proof = merkleTree.getHexProof(leaf);

      await stealthPool
        .connect(user1)
        .withdraw(commitment, nonce, recipient, proof);

      expect(await stealthPool.isCommitmentSpent(commitment)).to.be.true;
    });

    it("Should mark nonce as used after withdrawal", async function () {
      const leaf = commitment;
      const proof = merkleTree.getHexProof(leaf);

      await stealthPool
        .connect(user1)
        .withdraw(commitment, nonce, recipient, proof);

      expect(await stealthPool.isNonceUsed(nonce)).to.be.true;
    });

    it("Should reject withdrawal with spent commitment", async function () {
      const leaf = commitment;
      const proof = merkleTree.getHexProof(leaf);

      await stealthPool
        .connect(user1)
        .withdraw(commitment, nonce, recipient, proof);

      const newNonce = ethers.keccak256(ethers.toUtf8Bytes("new nonce"));

      await expect(
        stealthPool
          .connect(user1)
          .withdraw(commitment, newNonce, recipient, proof)
      ).to.be.revertedWith("StealthPool: commitment already spent");
    });

    it("Should reject withdrawal with used nonce", async function () {
      const leaf = commitment;
      const proof = merkleTree.getHexProof(leaf);

      await stealthPool
        .connect(user1)
        .withdraw(commitment, nonce, recipient, proof);

      const newCommitment = ethers.keccak256(
        ethers.toUtf8Bytes("new commitment")
      );
      await stealthPool.connect(user2).registerDeposit(newCommitment);

      // This test is not perfect because the merkle root is not updated with the new commitment
      // but it is good enough to test the nonce logic
      await expect(
        stealthPool.connect(user2).withdraw(
          newCommitment,
          nonce, // Same nonce
          recipient,
          proof
        )
      ).to.be.revertedWith("StealthPool: nonce already used");
    });

    it("Should reject withdrawal with invalid Merkle proof", async function () {
      const invalidProof = [
        ethers.keccak256(ethers.toUtf8Bytes("wrong proof")),
      ];

      await expect(
        stealthPool
          .connect(user1)
          .withdraw(commitment, nonce, recipient, invalidProof)
      ).to.be.revertedWith("StealthPool: invalid Merkle proof");
    });

    it("Should reject withdrawal with zero recipient", async function () {
      const leaf = commitment;
      const proof = merkleTree.getHexProof(leaf);

      await expect(
        stealthPool
          .connect(user1)
          .withdraw(commitment, nonce, ethers.ZeroAddress, proof)
      ).to.be.revertedWith("StealthPool: recipient cannot be zero");
    });
  });

  describe("Emergency Functions", function () {
    beforeEach(async function () {
      await user1.sendTransaction({
        to: await stealthPool.getAddress(),
        value: ethers.parseEther("2.0"),
      });
    });

    it("Should allow owner to emergency withdraw", async function () {
      const withdrawAmount = ethers.parseEther("1.0");
      const initialBalance = await ethers.provider.getBalance(owner.address);

      const tx = await stealthPool
        .connect(owner)
        .emergencyWithdraw(withdrawAmount, owner.address);

      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice!;

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance - initialBalance + gasUsed).to.equal(withdrawAmount);
    });

    it("Should reject emergency withdrawal from non-owner", async function () {
      await expect(
        stealthPool
          .connect(user1)
          .emergencyWithdraw(ethers.parseEther("1.0"), user1.address)
      ).to.be.revertedWithCustomError(
        stealthPool,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should reject emergency withdrawal exceeding balance", async function () {
      await expect(
        stealthPool
          .connect(owner)
          .emergencyWithdraw(ethers.parseEther("10.0"), owner.address)
      ).to.be.revertedWith("StealthPool: insufficient balance");
    });
  });

  describe("Commitment Calculation", function () {
    it("Should calculate commitment correctly", async function () {
      const publicKey = ethers.toUtf8Bytes("test public key");
      const nonce = ethers.keccak256(ethers.toUtf8Bytes("test nonce"));

      const calculatedCommitment = await stealthPool.calculateCommitment(
        publicKey,
        nonce
      );

      const expectedCommitment = ethers.keccak256(
        ethers.solidityPacked(["bytes", "bytes32"], [publicKey, nonce])
      );

      expect(calculatedCommitment).to.equal(expectedCommitment);
    });
  });
});
