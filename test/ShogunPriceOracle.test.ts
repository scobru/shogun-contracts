import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { ShogunPriceOracle, OracleFeedRegistry, ShogunRelayRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ShogunPriceOracle", function () {
    let priceOracle: ShogunPriceOracle;
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

    // EIP-712 typehash (must match contract constant)
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
                    31337, // Hardhat chainId
                    oracleAddress,
                ]
            )
        );
    }

    // Hardhat default private keys for testing
    const HARDHAT_PRIVATE_KEYS: Record<number, string> = {
        0: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // owner
        1: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", // relay
        2: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a", // user
    };

    async function signOraclePacket(
        signerIndex: number,
        oracleAddress: string,
        feedName: string,
        price: bigint,
        validitySecs: number = 600
    ) {
        const feedId = ethers.keccak256(ethers.toUtf8Bytes(feedName));
        // Use blockchain timestamp instead of Date.now() to avoid drift after other tests
        const currentTime = await time.latest();
        const deadline = currentTime + validitySecs;
        const payload = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [price]);
        const payloadHash = ethers.keccak256(payload);

        // Compute struct hash matching Solidity: keccak256(abi.encode(TYPEHASH, feedId, deadline, keccak256(payload)))
        const structHash = ethers.keccak256(
            ethers.AbiCoder.defaultAbiCoder().encode(
                ["bytes32", "bytes32", "uint256", "bytes32"],
                [ORACLE_PACKET_TYPEHASH, feedId, deadline, payloadHash]
            )
        );

        // Compute domain separator
        const domainSeparator = computeDomainSeparator(oracleAddress);

        // Compute final EIP-712 digest: keccak256("\x19\x01" + domainSeparator + structHash)
        const digest = ethers.keccak256(
            ethers.concat([
                "0x1901",
                domainSeparator,
                structHash
            ])
        );

        // Create wallet from private key and sign directly
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

        // Deploy ShogunPriceOracle
        const ShogunPriceOracle = await ethers.getContractFactory("ShogunPriceOracle");
        priceOracle = await ShogunPriceOracle.deploy(
            await relayRegistry.getAddress(),
            await feedRegistry.getAddress()
        );
        await priceOracle.waitForDeployment();

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
            expect(await priceOracle.relayRegistry()).to.equal(await relayRegistry.getAddress());
        });

        it("Should set correct feed registry", async function () {
            expect(await priceOracle.feedRegistry()).to.equal(await feedRegistry.getAddress());
        });
    });

    describe("Price Updates", function () {
        it("Should update price with valid signed packet", async function () {
            const price = ethers.parseUnits("3500", 8); // $3500.00000000
            const packet = await signOraclePacket(
                1, // relay
                await priceOracle.getAddress(),
                "ETH/USD",
                price
            );

            await priceOracle.connect(user).updatePrice(packet);

            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));
            expect(await priceOracle.latestPrices(feedId)).to.equal(price);
        });

        it("Should emit PriceUpdated event", async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                1, // relay
                await priceOracle.getAddress(),
                "ETH/USD",
                price
            );

            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));
            await expect(priceOracle.connect(user).updatePrice(packet))
                .to.emit(priceOracle, "PriceUpdated")
                .withArgs(feedId, price, (timestamp: bigint) => timestamp > 0n, relay.address);
        });

        it("Should reject packet from non-relay", async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                2, // user (non-relay signer)
                await priceOracle.getAddress(),
                "ETH/USD",
                price
            );

            await expect(priceOracle.connect(user).updatePrice(packet))
                .to.be.revertedWithCustomError(priceOracle, "ShogunOracle__InvalidPacket");
        });

        it("Should reject expired packet", async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                1, // relay
                await priceOracle.getAddress(),
                "ETH/USD",
                price,
                -100 // Already expired
            );

            await expect(priceOracle.connect(user).updatePrice(packet))
                .to.be.revertedWithCustomError(priceOracle, "ShogunOracle__InvalidPacket");
        });
    });

    describe("Price Reading", function () {
        beforeEach(async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                1, // relay
                await priceOracle.getAddress(),
                "ETH/USD",
                price
            );
            await priceOracle.connect(user).updatePrice(packet);
        });

        it("Should get price by name", async function () {
            const [price, timestamp] = await priceOracle.getPrice("ETH/USD");
            expect(price).to.equal(ethers.parseUnits("3500", 8));
            expect(timestamp).to.be.gt(0);
        });

        it("Should get price by ID", async function () {
            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));
            const [price, timestamp] = await priceOracle.getPriceById(feedId);
            expect(price).to.equal(ethers.parseUnits("3500", 8));
            expect(timestamp).to.be.gt(0);
        });

        it("Should return zero for unknown feed", async function () {
            const [price, timestamp] = await priceOracle.getPrice("UNKNOWN/FEED");
            expect(price).to.equal(0);
            expect(timestamp).to.equal(0);
        });
    });

    describe("Packet Verification", function () {
        it("Should verify valid packet", async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                1, // relay
                await priceOracle.getAddress(),
                "ETH/USD",
                price
            );

            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));
            const [valid, returnedPrice, signer] = await priceOracle.verifyPacket(feedId, packet);

            expect(valid).to.be.true;
            expect(returnedPrice).to.equal(price);
            expect(signer).to.equal(relay.address);
        });

        it("Should return invalid for wrong feed ID", async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                1, // relay
                await priceOracle.getAddress(),
                "ETH/USD",
                price
            );

            const wrongFeedId = ethers.keccak256(ethers.toUtf8Bytes("BTC/USD"));
            const [valid, ,] = await priceOracle.verifyPacket(wrongFeedId, packet);

            expect(valid).to.be.false;
        });
    });

    describe("Update and Get Price", function () {
        it("Should update and return price in single call", async function () {
            const price = ethers.parseUnits("3500", 8);
            const packet = await signOraclePacket(
                1, // relay
                await priceOracle.getAddress(),
                "ETH/USD",
                price
            );

            const returnedPrice = await priceOracle.connect(user).updateAndGetPrice.staticCall(packet);
            expect(returnedPrice).to.equal(price);
        });
    });
});
