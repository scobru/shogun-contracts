import { expect } from "chai";
import { ethers } from "hardhat";
import { StealthKeyRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("StealthKeyRegistry Replay Attack", function () {
  let registry: StealthKeyRegistry;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let relayer: SignerWithAddress;

  beforeEach(async function () {
    [owner, user, relayer] = await ethers.getSigners();

    const StealthKeyRegistry = await ethers.getContractFactory("StealthKeyRegistry");
    registry = await StealthKeyRegistry.deploy();
    await registry.waitForDeployment();
  });

  it("Should prevent replay of registerStealthKeysOnBehalf", async function () {
    // 1. User signs keys A and B with nonce 0
    const viewingKey1 = "viewingKey1";
    const spendingKey1 = "spendingKey1";
    const nonce1 = 0;

    const chainId = (await ethers.provider.getNetwork()).chainId;
    const domain = {
      name: "Shogun Stealth Key Registry",
      version: "1",
      chainId: chainId,
      verifyingContract: await registry.getAddress(),
    };

    const types = {
      StealthKeys: [
        { name: "viewingPublicKey", type: "string" },
        { name: "spendingPublicKey", type: "string" },
        { name: "nonce", type: "uint256" },
      ],
    };

    const value1 = {
      viewingPublicKey: viewingKey1,
      spendingPublicKey: spendingKey1,
      nonce: nonce1,
    };

    const signature1 = await user.signTypedData(domain, types, value1);
    const sig1 = ethers.Signature.from(signature1);

    // 2. Relayer submits
    await registry.connect(relayer).registerStealthKeysOnBehalf(
      user.address,
      viewingKey1,
      spendingKey1,
      sig1.v,
      sig1.r,
      sig1.s
    );

    let keys = await registry.getStealthKeys(user.address);
    expect(keys.viewingPublicKey).to.equal(viewingKey1);
    expect(keys.spendingPublicKey).to.equal(spendingKey1);
    expect(await registry.nonces(user.address)).to.equal(1);

    // 3. User updates keys to C and D with nonce 1
    const viewingKey2 = "viewingKey2";
    const spendingKey2 = "spendingKey2";
    const nonce2 = 1;

    const value2 = {
      viewingPublicKey: viewingKey2,
      spendingPublicKey: spendingKey2,
      nonce: nonce2,
    };

    const signature2 = await user.signTypedData(domain, types, value2);
    const sig2 = ethers.Signature.from(signature2);

    await registry.connect(relayer).registerStealthKeysOnBehalf(
      user.address,
      viewingKey2,
      spendingKey2,
      sig2.v,
      sig2.r,
      sig2.s
    );

    keys = await registry.getStealthKeys(user.address);
    expect(keys.viewingPublicKey).to.equal(viewingKey2);
    expect(keys.spendingPublicKey).to.equal(spendingKey2);
    expect(await registry.nonces(user.address)).to.equal(2);

    // 4. Attacker uses FIRST signature to replay (nonce 0)
    // The contract expects nonce 2, but the signature is for nonce 0.
    // The contract uses current nonce (2) to build digest.
    // Recovered address will be random != user.
    await expect(
        registry.connect(relayer).registerStealthKeysOnBehalf(
            user.address,
            viewingKey1,
            spendingKey1,
            sig1.v,
            sig1.r,
            sig1.s
        )
    ).to.be.revertedWith("StealthKeyRegistry: Invalid Signature");

    // 5. Verify keys are NOT reverted
    keys = await registry.getStealthKeys(user.address);
    expect(keys.viewingPublicKey).to.equal(viewingKey2);
    expect(keys.spendingPublicKey).to.equal(spendingKey2);

    console.log("Replay attack successfully prevented");
  });
});
