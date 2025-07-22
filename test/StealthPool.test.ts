import { expect } from "chai";
import { ethers } from "hardhat";
import { StealthPool } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

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
      expect(await stealthPool.totalDeposits()).to.equal(0);
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
      ).to.changeEtherBalance(user1, -depositAmount);
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

      expect(await stealthPool.totalDeposits()).to.equal(2);
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
    let commitment1: string;
    let commitment2: string;
    let commitment3: string;

    beforeEach(async function () {
      commitment1 = ethers.keccak256(ethers.toUtf8Bytes("commitment 1"));
      commitment2 = ethers.keccak256(ethers.toUtf8Bytes("commitment 2"));
      commitment3 = ethers.keccak256(ethers.toUtf8Bytes("commitment 3"));

      await stealthPool.connect(user1).registerDeposit(commitment1);
      await stealthPool.connect(user2).registerDeposit(commitment2);
      await stealthPool.connect(user3).registerDeposit(commitment3);
    });

    it("Should calculate Merkle root correctly", async function () {
      const merkleRoot = await stealthPool.merkleRoot();
      expect(merkleRoot).to.not.equal(ethers.ZeroHash);
    });

    it("Should generate valid Merkle proofs", async function () {
      const [proof, index] = await stealthPool.generateMerkleProof(commitment1);

      expect(index).to.equal(0);
      expect(proof.length).to.be.greaterThan(0);

      // Verify the proof manually by checking if the proof is not empty
      // The actual verification happens in the contract during withdrawal
      expect(proof.length).to.be.greaterThan(0);

      // Also verify that the proof contains valid hex strings
      for (const proofElement of proof) {
        expect(proofElement).to.match(/^0x[a-fA-F0-9]{64}$/);
      }
    });

    it("Should reject proof generation for unregistered commitment", async function () {
      const unregisteredCommitment = ethers.keccak256(
        ethers.toUtf8Bytes("unregistered")
      );

      await expect(
        stealthPool.generateMerkleProof(unregisteredCommitment)
      ).to.be.revertedWith("StealthPool: commitment not registered");
    });

    it("Should return all commitments", async function () {
      const allCommitments = await stealthPool.getAllCommitments();
      expect(allCommitments.length).to.equal(3);
      expect(allCommitments[0]).to.equal(commitment1);
      expect(allCommitments[1]).to.equal(commitment2);
      expect(allCommitments[2]).to.equal(commitment3);
    });
  });

  describe("Withdrawal", function () {
    let commitment: string;
    let nonce: string;
    let recipient: string;

    beforeEach(async function () {
      commitment = ethers.keccak256(ethers.toUtf8Bytes("test commitment"));
      nonce = ethers.keccak256(ethers.toUtf8Bytes("test nonce"));
      recipient = user2.address;

      await stealthPool.connect(user1).registerDeposit(commitment);

      // Send ETH to the contract
      await user1.sendTransaction({
        to: await stealthPool.getAddress(),
        value: DEPOSIT_AMOUNT,
      });
    });

    it("Should allow valid withdrawals", async function () {
      const [proof] = await stealthPool.generateMerkleProof(commitment);

      const initialBalance = await ethers.provider.getBalance(recipient);

      await stealthPool
        .connect(user1)
        .withdraw(commitment, nonce, recipient, proof);

      const finalBalance = await ethers.provider.getBalance(recipient);
      expect(finalBalance - initialBalance).to.equal(DEPOSIT_AMOUNT);
    });

    it("Should mark commitment as spent after withdrawal", async function () {
      const [proof] = await stealthPool.generateMerkleProof(commitment);

      await stealthPool
        .connect(user1)
        .withdraw(commitment, nonce, recipient, proof);

      expect(await stealthPool.isCommitmentSpent(commitment)).to.be.true;
    });

    it("Should mark nonce as used after withdrawal", async function () {
      const [proof] = await stealthPool.generateMerkleProof(commitment);

      await stealthPool
        .connect(user1)
        .withdraw(commitment, nonce, recipient, proof);

      expect(await stealthPool.isNonceUsed(nonce)).to.be.true;
    });

    it("Should reject withdrawal with spent commitment", async function () {
      const [proof] = await stealthPool.generateMerkleProof(commitment);

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
      const [proof] = await stealthPool.generateMerkleProof(commitment);

      await stealthPool
        .connect(user1)
        .withdraw(commitment, nonce, recipient, proof);

      const newCommitment = ethers.keccak256(
        ethers.toUtf8Bytes("new commitment")
      );
      await stealthPool.connect(user2).registerDeposit(newCommitment);

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
      const invalidProof = [ethers.keccak256(ethers.toUtf8Bytes("invalid"))];

      await expect(
        stealthPool
          .connect(user1)
          .withdraw(commitment, nonce, recipient, invalidProof)
      ).to.be.revertedWith("StealthPool: invalid Merkle proof");
    });

    it("Should reject withdrawal with zero recipient", async function () {
      const [proof] = await stealthPool.generateMerkleProof(commitment);

      await expect(
        stealthPool
          .connect(user1)
          .withdraw(commitment, nonce, ethers.ZeroAddress, proof)
      ).to.be.revertedWith("StealthPool: recipient cannot be zero");
    });
  });

  describe("Emergency Functions", function () {
    beforeEach(async function () {
      // Add some ETH to the contract
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

  describe("Integration Test", function () {
    it("Should handle complete deposit and withdrawal flow", async function () {
      console.log("=== Starting Integration Test ===");

      // 1. Calculate commitment
      const publicKey = ethers.toUtf8Bytes("user public key");
      const nonce = ethers.keccak256(ethers.toUtf8Bytes("user nonce"));
      const commitment = await stealthPool.calculateCommitment(
        publicKey,
        nonce
      );
      console.log("Calculated commitment:", commitment);

      // 2. Register deposit
      console.log("Registering deposit...");
      await stealthPool.connect(user1).registerDeposit(commitment);
      expect(await stealthPool.isCommitmentRegistered(commitment)).to.be.true;
      console.log("Deposit registered successfully");

      // 3. Send ETH to contract
      console.log("Sending ETH to contract...");
      await user1.sendTransaction({
        to: await stealthPool.getAddress(),
        value: DEPOSIT_AMOUNT,
      });

      // Verify contract has the ETH
      const contractBalance = await stealthPool.getBalance();
      console.log(
        "Contract balance after ETH transfer:",
        ethers.formatEther(contractBalance)
      );
      expect(contractBalance).to.equal(DEPOSIT_AMOUNT);

      // 4. Generate Merkle proof
      console.log("Generating Merkle proof...");
      const [proof, index] = await stealthPool.generateMerkleProof(commitment);
      console.log(
        "Proof generated, index:",
        index,
        "proof length:",
        proof.length
      );
      expect(index).to.equal(0);

      // For a single commitment, the proof can be empty (length 0)
      // This is correct behavior for Merkle trees with only one leaf
      console.log("Proof array:", proof);

      // Verify that the proof contains valid hex strings (if not empty)
      for (const proofElement of proof) {
        expect(proofElement).to.match(/^0x[a-fA-F0-9]{64}$/);
      }

      // 5. Perform withdrawal
      const recipient = user2.address;
      const initialBalance = await ethers.provider.getBalance(recipient);
      console.log(
        "Initial recipient balance:",
        ethers.formatEther(initialBalance)
      );
      console.log(
        "Contract balance before withdrawal:",
        ethers.formatEther(await stealthPool.getBalance())
      );

      console.log("Performing withdrawal...");
      const tx = await stealthPool
        .connect(user1)
        .withdraw(commitment, nonce, recipient, proof);

      console.log("Withdrawal transaction sent, waiting for confirmation...");
      const receipt = await tx.wait();
      console.log("Withdrawal transaction confirmed, hash:", receipt?.hash);

      // Wait a bit for the transaction to be processed
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const finalBalance = await ethers.provider.getBalance(recipient);
      const finalContractBalance = await stealthPool.getBalance();

      console.log("Final recipient balance:", ethers.formatEther(finalBalance));
      console.log(
        "Final contract balance:",
        ethers.formatEther(finalContractBalance)
      );
      console.log(
        "Balance difference:",
        ethers.formatEther(finalBalance - initialBalance)
      );

      // Check that the recipient received the funds
      console.log("Checking balance difference...");
      expect(finalBalance - initialBalance).to.equal(DEPOSIT_AMOUNT);

      // 6. Verify commitment is spent
      console.log("Verifying commitment is spent...");
      expect(await stealthPool.isCommitmentSpent(commitment)).to.be.true;
      expect(await stealthPool.isNonceUsed(nonce)).to.be.true;

      // 7. Verify contract balance decreased
      console.log("Verifying contract balance decreased...");
      expect(finalContractBalance).to.equal(0);

      console.log("=== Integration Test Completed Successfully ===");
    });
  });
});
