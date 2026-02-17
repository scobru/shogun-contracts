import { expect } from "chai";
import { ethers } from "hardhat";
import { PayamentForwarder, MockERC20 } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PaymentForwarder", function () {
  let paymentForwarder: PayamentForwarder;
  let mockToken: MockERC20;
  let owner: SignerWithAddress;
  let sponsor: SignerWithAddress;
  let acceptor: SignerWithAddress;
  let other: SignerWithAddress;

  const TOLL = ethers.parseEther("0.01");

  beforeEach(async function () {
    [owner, sponsor, acceptor, other] = await ethers.getSigners();

    // Deploy MockERC20
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20Factory.deploy("Mock Token", "MOCK", 18);
    await mockToken.waitForDeployment();

    // Deploy PaymentForwarder
    const PaymentForwarderFactory = await ethers.getContractFactory("PayamentForwarder"); // Typo in contract name 'PayamentForwarder'
    paymentForwarder = await PaymentForwarderFactory.deploy(TOLL, owner.address, owner.address);
    await paymentForwarder.waitForDeployment();
  });

  it("Should prevent signature replay vulnerability with nonce", async function () {
    // 1. Create a stealth wallet (random key)
    const stealthWallet = ethers.Wallet.createRandom();
    const stealthAddr = stealthWallet.address;

    // 2. Send tokens to stealth address via PaymentForwarder
    const amount1 = ethers.parseUnits("100", 18);
    await mockToken.mint(owner.address, amount1);
    await mockToken.approve(await paymentForwarder.getAddress(), amount1);

    await paymentForwarder.sendToken(
      stealthAddr,
      await mockToken.getAddress(),
      amount1,
      ethers.ZeroHash,
      ethers.ZeroHash,
      { value: TOLL }
    );

    // 3. Generate signature to withdraw tokens
    // We sign: chainId, contract, acceptor, token, sponsor, fee, hook, data, NONCE
    const network = await ethers.provider.getNetwork();
    const chainId = network.chainId;
    const contractAddr = await paymentForwarder.getAddress();
    const tokenAddr = await mockToken.getAddress();
    const sponsorAddr = sponsor.address;
    const sponsorFee = ethers.parseUnits("1", 18);
    const hookAddr = ethers.ZeroAddress;
    const data = "0x";

    // Get current nonce (should be 0)
    const nonce1 = await paymentForwarder.nonces(stealthAddr);
    expect(nonce1).to.equal(0);

    // Hash the parameters (inner hash) including NONCE
    const innerHash1 = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "address", "address", "address", "address", "uint256", "address", "bytes", "uint256"],
        [chainId, contractAddr, acceptor.address, tokenAddr, sponsorAddr, sponsorFee, hookAddr, data, nonce1]
      )
    );

    // Sign the hash
    const signature1 = await stealthWallet.signMessage(ethers.getBytes(innerHash1));
    const sig1 = ethers.Signature.from(signature1);

    // 4. Withdraw tokens (first time)
    await paymentForwarder.connect(sponsor).withdrawTokenOnBehalf(
      stealthAddr,
      acceptor.address,
      tokenAddr,
      sponsorAddr,
      sponsorFee,
      sig1.v,
      sig1.r,
      sig1.s
    );

    // Verify withdrawal
    expect(await mockToken.balanceOf(acceptor.address)).to.equal(amount1 - sponsorFee);
    expect(await mockToken.balanceOf(sponsorAddr)).to.equal(sponsorFee);

    // Verify nonce incremented
    const nonce2 = await paymentForwarder.nonces(stealthAddr);
    expect(nonce2).to.equal(1);

    // 5. Send tokens AGAIN to the SAME stealth address
    const amount2 = ethers.parseUnits("50", 18);
    await mockToken.mint(owner.address, amount2);
    await mockToken.approve(await paymentForwarder.getAddress(), amount2);

    await paymentForwarder.sendToken(
      stealthAddr,
      await mockToken.getAddress(),
      amount2,
      ethers.ZeroHash,
      ethers.ZeroHash,
      { value: TOLL }
    );

    // 6. Attempt to withdraw AGAIN using the SAME signature (REPLAY)
    // This MUST FAIL now because the contract expects nonce 1, but signature signed nonce 0.

    await expect(
      paymentForwarder.connect(sponsor).withdrawTokenOnBehalf(
        stealthAddr,
        acceptor.address,
        tokenAddr,
        sponsorAddr,
        sponsorFee,
        sig1.v,
        sig1.r,
        sig1.s
      )
    ).to.be.revertedWith("PaymentForwarder: Invalid Signature");

    // 7. Verify we CAN withdraw with a new signature (using nonce 1)

    // Hash the parameters including new NONCE (nonce2 = 1)
    const innerHash2 = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "address", "address", "address", "address", "uint256", "address", "bytes", "uint256"],
        [chainId, contractAddr, acceptor.address, tokenAddr, sponsorAddr, sponsorFee, hookAddr, data, nonce2]
      )
    );

    // Sign the hash
    const signature2 = await stealthWallet.signMessage(ethers.getBytes(innerHash2));
    const sig2 = ethers.Signature.from(signature2);

    // Withdraw successfully
    await expect(
      paymentForwarder.connect(sponsor).withdrawTokenOnBehalf(
        stealthAddr,
        acceptor.address,
        tokenAddr,
        sponsorAddr,
        sponsorFee,
        sig2.v,
        sig2.r,
        sig2.s
      )
    ).to.not.be.reverted;

    // Verify balances
    const expectedAcceptorBalance = (amount1 - sponsorFee) + (amount2 - sponsorFee);
    expect(await mockToken.balanceOf(acceptor.address)).to.equal(expectedAcceptorBalance);
    expect(await mockToken.balanceOf(sponsorAddr)).to.equal(sponsorFee + sponsorFee);
  });
});
