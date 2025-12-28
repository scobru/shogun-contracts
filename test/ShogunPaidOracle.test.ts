import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { ShogunPaidOracle, OracleFeedRegistry, ShogunRelayRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ShogunPaidOracle", function () {
    let paidOracle: ShogunPaidOracle;
    let feedRegistry: OracleFeedRegistry;
    let relayRegistry: ShogunRelayRegistry;
    let mockUSDC: any;
    let owner: SignerWithAddress;
    let relay: SignerWithAddress;
    let user: SignerWithAddress;

    const MIN_STAKE = ethers.parseUnits("100", 6);
    const UNSTAKING_DELAY = 7 * 24 * 60 * 60;
    const PUBKEY = ethers.toUtf8Bytes('{"x":"0x1234","y":"0x5678"}');
    const EPUB = ethers.toUtf8Bytes('{"x":"0xabcd","y":"0xefgh"}');

    // EIP-712 typehash
    const ORACLE_PACKET_TYPEHASH = ethers.keccak256(
        ethers.toUtf8Bytes("OraclePacket(bytes32 feedId,uint256 deadline,bytes payload)")
    );

    function computeDomainSeparator(oracleAddress: string) {
        const domainTypeHash = ethers.keccak256(
            ethers.toUtf8Bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")
        );
        return ethers.keccak256(
            ethers.AbiCoder.defaultAbiCoder().encode(
                ["bytes32", "bytes32", "bytes32", "uint256", "address"],
                [
                    domainTypeHash,
                    ethers.keccak256(ethers.toUtf8Bytes("ShogunOracle")),
                    ethers.keccak256(ethers.toUtf8Bytes("1")),
                    31337,
                    oracleAddress,
                ]
            )
        );
    }

    const HARDHAT_PRIVATE_KEYS: Record<number, string> = {
        0: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        1: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
        2: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
    };

    async function signOraclePacket(
        signerIndex: number,
        oracleAddress: string,
        feedName: string,
        price: bigint,
        validitySecs: number = 600
    ) {
        const feedId = ethers.keccak256(ethers.toUtf8Bytes(feedName));
        const currentTime = await time.latest();
        const deadline = currentTime + validitySecs;
        const payload = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [price]);
        const payloadHash = ethers.keccak256(payload);

        const structHash = ethers.keccak256(
            ethers.AbiCoder.defaultAbiCoder().encode(
                ["bytes32", "bytes32", "uint256", "bytes32"],
                [ORACLE_PACKET_TYPEHASH, feedId, deadline, payloadHash]
            )
        );

        const domainSeparator = computeDomainSeparator(oracleAddress);
        const digest = ethers.keccak256(
            ethers.concat(["0x1901", domainSeparator, structHash])
        );

        const wallet = new ethers.Wallet(HARDHAT_PRIVATE_KEYS[signerIndex]);
        const sig = wallet.signingKey.sign(digest);

        return {
            v: sig.v,
            r: sig.r,
            s: sig.s,
            feedId,
            deadline,
            payload,
        };
    }

    beforeEach(async function () {
        [owner, relay, user] = await ethers.getSigners();

        // Deploy mock USDC
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        mockUSDC = await MockERC20.deploy("Mock USDC", "USDC", 6);
        await mockUSDC.waitForDeployment();

        // Deploy ShogunRelayRegistry
        const ShogunRelayRegistry = await ethers.getContractFactory("ShogunRelayRegistry");
        relayRegistry = await ShogunRelayRegistry.deploy(
            await mockUSDC.getAddress(),
            MIN_STAKE,
            UNSTAKING_DELAY,
            owner.address
        );
        await relayRegistry.waitForDeployment();

        // Deploy OracleFeedRegistry
        const OracleFeedRegistry = await ethers.getContractFactory("OracleFeedRegistry");
        feedRegistry = await OracleFeedRegistry.deploy(await relayRegistry.getAddress());
        await feedRegistry.waitForDeployment();

        // Deploy ShogunPaidOracle
        const ShogunPaidOracle = await ethers.getContractFactory("ShogunPaidOracle");
        paidOracle = await ShogunPaidOracle.deploy(
            await relayRegistry.getAddress(),
            await feedRegistry.getAddress()
        );
        await paidOracle.waitForDeployment();

        // Register relay
        await mockUSDC.mint(relay.address, ethers.parseUnits("1000", 6));
        await mockUSDC.connect(relay).approve(await relayRegistry.getAddress(), ethers.MaxUint256);
        await relayRegistry.connect(relay).registerRelay(
            "https://relay.example.com",
            PUBKEY,
            EPUB,
            MIN_STAKE,
            0
        );

        // Register a feed
        await feedRegistry.connect(relay).registerFeed(
            "ETH/USD",
            0, // PRICE
            "(uint256)",
            ethers.parseUnits("1", 6),
            60
        );
    });

    describe("Deployment", function () {
        it("Should set correct relay registry", async function () {
            expect(await paidOracle.relayRegistry()).to.equal(await relayRegistry.getAddress());
        });

        it("Should set correct feed registry", async function () {
            expect(await paidOracle.feedRegistry()).to.equal(await feedRegistry.getAddress());
        });

        it("Should set owner correctly", async function () {
            expect(await paidOracle.owner()).to.equal(owner.address);
        });
    });

    describe("Free Updates (no price set)", function () {
        it("Should update price without payment when feed is free", async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                1,
                await paidOracle.getAddress(),
                "ETH/USD",
                price
            );

            await paidOracle.connect(user).updatePrice(packet);

            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));
            expect(await paidOracle.latestPrices(feedId)).to.equal(price);
        });

        it("Should emit PriceUpdated with zero payment", async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                1,
                await paidOracle.getAddress(),
                "ETH/USD",
                price
            );

            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));
            await expect(paidOracle.connect(user).updatePrice(packet))
                .to.emit(paidOracle, "PriceUpdated")
                .withArgs(feedId, price, (ts: bigint) => ts > 0n, relay.address, 0n);
        });
    });

    describe("Paid Updates", function () {
        const FEED_PRICE = ethers.parseEther("0.001"); // 0.001 ETH

        beforeEach(async function () {
            // Set price for the feed
            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));
            await paidOracle.connect(owner).setFeedPrice(feedId, FEED_PRICE);
        });

        it("Should require payment when feed has price", async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                1,
                await paidOracle.getAddress(),
                "ETH/USD",
                price
            );

            await expect(paidOracle.connect(user).updatePrice(packet))
                .to.be.revertedWithCustomError(paidOracle, "InsufficientPayment")
                .withArgs(FEED_PRICE, 0n);
        });

        it("Should accept update with correct payment", async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                1,
                await paidOracle.getAddress(),
                "ETH/USD",
                price
            );

            await paidOracle.connect(user).updatePrice(packet, { value: FEED_PRICE });

            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));
            expect(await paidOracle.latestPrices(feedId)).to.equal(price);
        });

        it("Should transfer payment to relay signer", async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                1,
                await paidOracle.getAddress(),
                "ETH/USD",
                price
            );

            const relayBalanceBefore = await ethers.provider.getBalance(relay.address);

            await paidOracle.connect(user).updatePrice(packet, { value: FEED_PRICE });

            const relayBalanceAfter = await ethers.provider.getBalance(relay.address);
            expect(relayBalanceAfter - relayBalanceBefore).to.equal(FEED_PRICE);
        });

        it("Should track revenue per relay", async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                1,
                await paidOracle.getAddress(),
                "ETH/USD",
                price
            );

            await paidOracle.connect(user).updatePrice(packet, { value: FEED_PRICE });

            expect(await paidOracle.relayRevenue(relay.address)).to.equal(FEED_PRICE);
        });

        it("Should emit PaymentReceived event", async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                1,
                await paidOracle.getAddress(),
                "ETH/USD",
                price
            );

            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));
            await expect(paidOracle.connect(user).updatePrice(packet, { value: FEED_PRICE }))
                .to.emit(paidOracle, "PaymentReceived")
                .withArgs(relay.address, feedId, FEED_PRICE);
        });

        it("Should accept overpayment", async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                1,
                await paidOracle.getAddress(),
                "ETH/USD",
                price
            );

            const overpayment = ethers.parseEther("0.01");
            const relayBalanceBefore = await ethers.provider.getBalance(relay.address);

            await paidOracle.connect(user).updatePrice(packet, { value: overpayment });

            const relayBalanceAfter = await ethers.provider.getBalance(relay.address);
            expect(relayBalanceAfter - relayBalanceBefore).to.equal(overpayment);
        });
    });

    describe("updateAndGetPrice with payment", function () {
        const FEED_PRICE = ethers.parseEther("0.001");

        beforeEach(async function () {
            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));
            await paidOracle.connect(owner).setFeedPrice(feedId, FEED_PRICE);
        });

        it("Should return price and accept payment", async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                1,
                await paidOracle.getAddress(),
                "ETH/USD",
                price
            );

            const tx = await paidOracle.connect(user).updateAndGetPrice.staticCall(
                packet,
                { value: FEED_PRICE }
            );
            expect(tx).to.equal(price);
        });
    });

    describe("Admin Functions", function () {
        it("Should allow owner to set feed price", async function () {
            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));
            const newPrice = ethers.parseEther("0.002");

            await expect(paidOracle.connect(owner).setFeedPrice(feedId, newPrice))
                .to.emit(paidOracle, "FeedPriceSet")
                .withArgs(feedId, newPrice);

            expect(await paidOracle.feedPriceOverride(feedId)).to.equal(newPrice);
        });

        it("Should allow owner to set feed price by name", async function () {
            const newPrice = ethers.parseEther("0.003");
            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));

            await paidOracle.connect(owner).setFeedPriceByName("ETH/USD", newPrice);

            expect(await paidOracle.feedPriceOverride(feedId)).to.equal(newPrice);
        });

        it("Should reject non-owner setting price", async function () {
            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));

            await expect(paidOracle.connect(user).setFeedPrice(feedId, 1000))
                .to.be.revertedWithCustomError(paidOracle, "Unauthorized");
        });

        it("Should allow owner transfer", async function () {
            await paidOracle.connect(owner).transferOwnership(user.address);
            expect(await paidOracle.owner()).to.equal(user.address);
        });
    });

    describe("View Functions", function () {
        it("Should return correct quote for feed", async function () {
            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));
            const price = ethers.parseEther("0.005");

            await paidOracle.connect(owner).setFeedPrice(feedId, price);

            expect(await paidOracle.getUpdateQuote(feedId)).to.equal(price);
        });

        it("Should return zero quote for free feed", async function () {
            const feedId = ethers.keccak256(ethers.toUtf8Bytes("BTC/USD"));
            expect(await paidOracle.getUpdateQuote(feedId)).to.equal(0n);
        });
    });

    describe("Signature Verification", function () {
        it("Should reject packet from non-relay", async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                2, // user (non-relay)
                await paidOracle.getAddress(),
                "ETH/USD",
                price
            );

            await expect(paidOracle.connect(user).updatePrice(packet))
                .to.be.revertedWithCustomError(paidOracle, "ShogunOracle__InvalidPacket");
        });

        it("Should reject expired packet", async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                1,
                await paidOracle.getAddress(),
                "ETH/USD",
                price,
                1 // 1 second validity
            );

            // Wait for packet to expire
            await time.increase(10);

            await expect(paidOracle.connect(user).updatePrice(packet))
                .to.be.revertedWithCustomError(paidOracle, "ShogunOracle__InvalidPacket");
        });
    });
});
