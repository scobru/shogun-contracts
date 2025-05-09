import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

describe("RelayMembershipDynamic", function () {
  async function deployFixture() {
    const [admin, relay, user] = await ethers.getSigners();

    const Oracle = await ethers.getContractFactory("OracleBridge", admin);
    const oracle = await Oracle.deploy();
    await oracle.waitForDeployment()

    const priceWei = ethers.parseEther("0.1");
    const Membership = await ethers.getContractFactory(
      "RelayMembership",
      admin
    );
    const membership = await Membership.deploy(priceWei, oracle.address);
    await membership.waitForDeployment();

    return { admin, relay, user, oracle, membership, priceWei };
  }

  describe("Deployment", function () {
    it("should set admin, price and oracle correctly", async function () {
      const { admin, oracle, membership, priceWei } = await loadFixture(
        deployFixture
      );
      expect(await membership.admin()).to.equal(admin.address);
      expect(await membership.pricePerMonth()).to.equal(priceWei);
      expect(await membership.oracle()).to.equal(oracle.address);
    });
  });

  describe("Relay join", function () {
    it("allows relay to join with stake and URL", async function () {
      const { relay, membership } = await loadFixture(deployFixture);
      const stake = ethers.parseEther("1.0");
      const url = "ws://localhost:8765/gun";

      await expect(
        membership.connect(relay).join(url, { value: stake })
      )
        .to.emit(membership, "RelayJoined")
        .withArgs(relay.address, url);

      expect(await membership.relayUrl(relay.address)).to.equal(url);
      expect(await membership.getRelayCount()).to.equal(1);
      expect(await membership.getRelayAt(0)).to.equal(relay.address);
    });

    it("rejects join if stake is zero or relay already joined", async function () {
      const { relay, membership } = await loadFixture(deployFixture);
      await expect(
        membership.connect(relay).join("url", { value: 0 })
      ).to.be.revertedWith("stake>0");

      const stake = ethers.parseEther("0.5");
      await membership.connect(relay).join("url", { value: stake });
      await expect(
        membership.connect(relay).join("url2", { value: stake })
      ).to.be.revertedWith("already relay");
    });
  });

  describe("User subscribe", function () {
    it("allows user to subscribe and store public key", async function () {
      const { user, membership, priceWei } = await loadFixture(
        deployFixture
      );
      const months = 2;
      const amount = priceWei * months;
      const pubKey = ethers.hexlify(ethers.randomBytes(33));

      await expect(
        membership.connect(user).subscribe(months, pubKey, { value: amount })
      )
        .to.emit(membership, "Subscribed")
        .withArgs(user.address, months);

      const expiry = await membership.expires(user.address);
      expect(expiry).to.be.gt(0);
      expect(await membership.userPubKey(user.address)).to.equal(pubKey);
    });

    it("rejects subscribe with wrong value or invalid months", async function () {
      const { user, membership } = await loadFixture(deployFixture);
      await expect(
        membership.connect(user).subscribe(0, "0x", { value: 0 })
      ).to.be.revertedWith("months>0");
      const priceWei = await membership.pricePerMonth();
      await expect(
        membership.connect(user).subscribe(1, "0x", { value: priceWei.sub(1) })
      ).to.be.revertedWith("wrong value");
    });
  });

  describe("isActive / expiration", function () {
    it("returns correct active status before and after expiry", async function () {
      const { user, membership, priceWei } = await loadFixture(
        deployFixture
      );
      const months = 1;
      const amount = priceWei * months;
      await membership.connect(user).subscribe(months, "0x", { value: amount });
      expect(await membership.isActive(user.address)).to.be.true;

      // Fast-forward beyond expiry
      const expiry = await membership.expires(user.address);
      await time.increaseTo(expiry.add(1));
      expect(await membership.isActive(user.address)).to.be.false;
    });
  });

  describe("releaseWithProof", function () {
    it("reverts if no root is set or proof invalid", async function () {
      const { relay, membership } = await loadFixture(deployFixture);
      const epoch = 1;
      await expect(
        membership.connect(relay).releaseWithProof(epoch, [])
      ).to.be.revertedWith("root not set");

      // Join relay to allow release
      const stake = ethers.parseEther("1");
      await membership.connect(relay).join("url", { value: stake });
      // Root but for different epoch
      const otherEpoch = 2;
      const leaf2 = ethers.utils.solidityKeccak256(
        ["address", "uint256"],
        [relay.address, otherEpoch]
      );
      await (await membership.oracle()).publishRoot(otherEpoch, leaf2);
      await expect(
        membership.connect(relay).releaseWithProof(epoch, [])
      ).to.be.revertedWith("invalid proof");
    });

    it("allows relay to release full balance with valid proof", async function () {
      const { admin, relay, user, membership, oracle, priceWei } =
        await loadFixture(deployFixture);
      // Relay join and user subscribe
      const stake = ethers.parseEther("1");
      await membership.connect(relay).join("url", { value: stake });
      const months = 1;
      await membership.connect(user).subscribe(months, "0x", {
        value: priceWei * months,
      });

      // Setup epoch and merkle
      const epoch = 42;
      const leaf = ethers.utils.solidityKeccak256(
        ["address", "uint256"],
        [relay.address, epoch]
      );
      // Root = leaf, proof = []
      await oracle.connect(admin).publishRoot(epoch, leaf);

      await expect(
        membership.connect(relay).releaseWithProof(epoch, [])
      )
        .to.emit(membership, "Released")
        .withArgs(relay.address, anyValue, epoch);

      // Relay gets stake+subscription back
      const totalRecv = stake.add(priceWei);
      await expect(
        membership.connect(relay).releaseWithProof(epoch, [])
      ).to.be.revertedWith("nothing to release");
    });
  });

  describe("Admin functions", function () {
    it("only admin can set price", async function () {
      const { user, admin, membership } = await loadFixture(
        deployFixture
      );
      const newPrice = ethers.parseEther("0.5");
      await expect(
        membership.connect(user).setPrice(newPrice)
      ).to.be.revertedWith("only admin");
      await membership.connect(admin).setPrice(newPrice);
      expect(await membership.pricePerMonth()).to.equal(newPrice);
    });
  });
});