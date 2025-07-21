import { expect } from "chai";
import { ethers } from "hardhat";

describe("GunDBIntegrity", function () {
  let gunDBIntegrity: any;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const GunDBIntegrityFactory = await ethers.getContractFactory(
      "GunDBIntegrity"
    );
    gunDBIntegrity = await GunDBIntegrityFactory.deploy();
    await gunDBIntegrity.deployed();
  });

  describe("Registrazione dati", function () {
    it("Dovrebbe registrare un nuovo dato", async function () {
      const dataId = ethers.id("test-data-1");
      const dataHash = ethers.id("original-data-content");

      await expect(gunDBIntegrity.registerData(dataId, dataHash))
        .to.emit(gunDBIntegrity, "DataRegistered")
        .withArgs(dataId, dataHash);

      const storedHash = await gunDBIntegrity.dataHashes(dataId);
      expect(storedHash).to.equal(dataHash);
    });

    it("Non dovrebbe permettere la registrazione di un dato già esistente", async function () {
      const dataId = ethers.id("test-data-1");
      const dataHash = ethers.id("original-data-content");

      await gunDBIntegrity.registerData(dataId, dataHash);

      await expect(
        gunDBIntegrity.registerData(dataId, dataHash)
      ).to.be.revertedWith("Dato gia' registrato");
    });

    it("Non dovrebbe permettere la registrazione con hash zero", async function () {
      const dataId = ethers.id("test-data-1");
      const zeroHash = ethers.ZeroHash;

      await expect(
        gunDBIntegrity.registerData(dataId, zeroHash)
      ).to.be.revertedWith("Hash non valido");
    });
  });

  describe("Verifica integrità", function () {
    it("Dovrebbe verificare correttamente l'integrità di un dato intatto", async function () {
      const dataId = ethers.id("test-data-1");
      const dataHash = ethers.id("original-data-content");

      await gunDBIntegrity.registerData(dataId, dataHash);

      const isIntact = await gunDBIntegrity.verifyIntegrity(dataId, dataHash);
      expect(isIntact).to.be.true;
    });

    it("Dovrebbe rilevare un dato modificato", async function () {
      const dataId = ethers.id("test-data-1");
      const originalHash = ethers.id("original-data-content");
      const modifiedHash = ethers.id("modified-data-content");

      await gunDBIntegrity.registerData(dataId, originalHash);

      const isIntact = await gunDBIntegrity.verifyIntegrity(
        dataId,
        modifiedHash
      );
      expect(isIntact).to.be.false;
    });

    it("Dovrebbe gestire dati non registrati", async function () {
      const dataId = ethers.id("non-existent-data");
      const dataHash = ethers.id("any-data-content");

      const isIntact = await gunDBIntegrity.verifyIntegrity(dataId, dataHash);
      expect(isIntact).to.be.false;
    });
  });

  describe("Funzioni di utilità", function () {
    it("Dovrebbe calcolare correttamente l'hash", async function () {
      const data = "test-data-content";
      const expectedHash = ethers.id(data);

      const calculatedHash = await gunDBIntegrity.calculateHash(data);
      expect(calculatedHash).to.equal(expectedHash);
    });

    it("Dovrebbe verificare l'esistenza dei dati tramite mapping", async function () {
      const dataId = ethers.id("test-data-1");
      const dataHash = ethers.id("original-data-content");

      // Prima della registrazione
      const storedHashBefore = await gunDBIntegrity.dataHashes(dataId);
      expect(storedHashBefore).to.equal(ethers.ZeroHash);

      await gunDBIntegrity.registerData(dataId, dataHash);

      // Dopo la registrazione
      const storedHashAfter = await gunDBIntegrity.dataHashes(dataId);
      expect(storedHashAfter).to.equal(dataHash);
    });
  });
});
