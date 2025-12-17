import { expect } from "chai";
import { ethers } from "hardhat";
import { OracleFeedRegistry, ShogunRelayRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("OracleFeedRegistry", function () {
    let feedRegistry: OracleFeedRegistry;
    let relayRegistry: ShogunRelayRegistry;
    let mockUSDC: any;
    let owner: SignerWithAddress;
    let relay1: SignerWithAddress;
    let relay2: SignerWithAddress;
    let nonRelay: SignerWithAddress;

    const MIN_STAKE = ethers.parseUnits("100", 6); // 100 USDC
    const UNSTAKING_DELAY = 7 * 24 * 60 * 60; // 7 days

    // Test encryption keys
    const PUBKEY = ethers.toUtf8Bytes('{"x":"0x1234","y":"0x5678"}');
    const EPUB = ethers.toUtf8Bytes('{"x":"0xabcd","y":"0xefgh"}');

    // Data types enum (matches contract)
    enum DataType {
        PRICE = 0,
        STRING = 1,
        JSON = 2,
        BYTES = 3,
        CUSTOM = 4,
    }

    beforeEach(async function () {
        [owner, relay1, relay2, nonRelay] = await ethers.getSigners();

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

        // Mint USDC and register relays
        await mockUSDC.mint(relay1.address, ethers.parseUnits("1000", 6));
        await mockUSDC.mint(relay2.address, ethers.parseUnits("1000", 6));
        await mockUSDC.connect(relay1).approve(await relayRegistry.getAddress(), ethers.MaxUint256);
        await mockUSDC.connect(relay2).approve(await relayRegistry.getAddress(), ethers.MaxUint256);

        // Register relay1 as active relay
        await relayRegistry.connect(relay1).registerRelay(
            "https://relay1.example.com",
            PUBKEY,
            EPUB,
            MIN_STAKE,
            0
        );
    });

    describe("Deployment", function () {
        it("Should set correct relay registry", async function () {
            expect(await feedRegistry.relayRegistry()).to.equal(await relayRegistry.getAddress());
        });

        it("Should start with zero total feeds", async function () {
            expect(await feedRegistry.totalFeeds()).to.equal(0);
        });
    });

    describe("Feed Registration", function () {
        it("Should register a feed with valid parameters", async function () {
            const feedName = "ETH/USD";
            const schema = "(uint256)";
            const price = ethers.parseUnits("1", 6); // 1 USDC
            const updateFreq = 60; // 60 seconds

            await feedRegistry.connect(relay1).registerFeed(
                feedName,
                DataType.PRICE,
                schema,
                price,
                updateFreq
            );

            const feedId = ethers.keccak256(ethers.toUtf8Bytes(feedName));
            const feed = await feedRegistry.getFeed(relay1.address, feedId);

            expect(feed.name).to.equal(feedName);
            expect(feed.dataType).to.equal(DataType.PRICE);
            expect(feed.schema).to.equal(schema);
            expect(feed.priceAtomic).to.equal(price);
            expect(feed.updateFreqSecs).to.equal(updateFreq);
            expect(feed.active).to.be.true;
        });

        it("Should emit FeedRegistered event", async function () {
            const feedName = "BTC/USD";
            const feedId = ethers.keccak256(ethers.toUtf8Bytes(feedName));

            await expect(
                feedRegistry.connect(relay1).registerFeed(
                    feedName,
                    DataType.PRICE,
                    "(uint256)",
                    ethers.parseUnits("2", 6),
                    120
                )
            )
                .to.emit(feedRegistry, "FeedRegistered")
                .withArgs(relay1.address, feedId, feedName, DataType.PRICE, ethers.parseUnits("2", 6));
        });

        it("Should fail if caller is not active relay", async function () {
            await expect(
                feedRegistry.connect(nonRelay).registerFeed(
                    "TEST/FEED",
                    DataType.CUSTOM,
                    "bytes",
                    0,
                    60
                )
            ).to.be.revertedWithCustomError(feedRegistry, "NotActiveRelay");
        });

        it("Should fail with empty name", async function () {
            await expect(
                feedRegistry.connect(relay1).registerFeed(
                    "",
                    DataType.PRICE,
                    "(uint256)",
                    0,
                    60
                )
            ).to.be.revertedWithCustomError(feedRegistry, "InvalidName");
        });

        it("Should fail if feed already exists", async function () {
            await feedRegistry.connect(relay1).registerFeed(
                "ETH/USD",
                DataType.PRICE,
                "(uint256)",
                0,
                60
            );

            await expect(
                feedRegistry.connect(relay1).registerFeed(
                    "ETH/USD",
                    DataType.PRICE,
                    "(uint256)",
                    0,
                    60
                )
            ).to.be.revertedWithCustomError(feedRegistry, "FeedAlreadyExists");
        });

        it("Should increment total feeds", async function () {
            await feedRegistry.connect(relay1).registerFeed("FEED1", DataType.PRICE, "", 0, 60);
            expect(await feedRegistry.totalFeeds()).to.equal(1);

            await feedRegistry.connect(relay1).registerFeed("FEED2", DataType.STRING, "", 0, 60);
            expect(await feedRegistry.totalFeeds()).to.equal(2);
        });

        it("Should support different data types", async function () {
            await feedRegistry.connect(relay1).registerFeed("price/feed", DataType.PRICE, "(uint256)", 0, 60);
            await feedRegistry.connect(relay1).registerFeed("string/feed", DataType.STRING, "string", 0, 60);
            await feedRegistry.connect(relay1).registerFeed("json/feed", DataType.JSON, '{"temp": "number"}', 0, 60);
            await feedRegistry.connect(relay1).registerFeed("bytes/feed", DataType.BYTES, "bytes32", 0, 60);
            await feedRegistry.connect(relay1).registerFeed("custom/feed", DataType.CUSTOM, "(uint256,string,bool)", 0, 60);

            expect(await feedRegistry.getRelayFeedCount(relay1.address)).to.equal(5);
        });
    });

    describe("Feed Update", function () {
        beforeEach(async function () {
            await feedRegistry.connect(relay1).registerFeed(
                "ETH/USD",
                DataType.PRICE,
                "(uint256)",
                ethers.parseUnits("1", 6),
                60
            );
        });

        it("Should update feed price and status", async function () {
            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));
            const newPrice = ethers.parseUnits("2", 6);

            await feedRegistry.connect(relay1).updateFeed(feedId, newPrice, true);

            const feed = await feedRegistry.getFeed(relay1.address, feedId);
            expect(feed.priceAtomic).to.equal(newPrice);
            expect(feed.active).to.be.true;
        });

        it("Should deactivate feed", async function () {
            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));

            await feedRegistry.connect(relay1).updateFeed(feedId, 0, false);

            const feed = await feedRegistry.getFeed(relay1.address, feedId);
            expect(feed.active).to.be.false;
        });

        it("Should emit FeedUpdated event", async function () {
            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));
            const newPrice = ethers.parseUnits("5", 6);

            await expect(feedRegistry.connect(relay1).updateFeed(feedId, newPrice, true))
                .to.emit(feedRegistry, "FeedUpdated")
                .withArgs(relay1.address, feedId, newPrice, true);
        });

        it("Should fail if not active relay", async function () {
            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));

            await expect(
                feedRegistry.connect(nonRelay).updateFeed(feedId, 0, false)
            ).to.be.revertedWithCustomError(feedRegistry, "NotActiveRelay");
        });

        it("Should fail if feed not found", async function () {
            const nonExistentFeedId = ethers.keccak256(ethers.toUtf8Bytes("NONEXISTENT"));

            await expect(
                feedRegistry.connect(relay1).updateFeed(nonExistentFeedId, 0, false)
            ).to.be.revertedWithCustomError(feedRegistry, "FeedNotFound");
        });
    });

    describe("Feed Deactivation", function () {
        beforeEach(async function () {
            await feedRegistry.connect(relay1).registerFeed("ETH/USD", DataType.PRICE, "(uint256)", 0, 60);
        });

        it("Should deactivate feed", async function () {
            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));

            await feedRegistry.connect(relay1).deactivateFeed(feedId);

            const feed = await feedRegistry.getFeed(relay1.address, feedId);
            expect(feed.active).to.be.false;
        });

        it("Should emit FeedDeactivated event", async function () {
            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));

            await expect(feedRegistry.connect(relay1).deactivateFeed(feedId))
                .to.emit(feedRegistry, "FeedDeactivated")
                .withArgs(relay1.address, feedId);
        });

        it("Should fail if feed not found", async function () {
            const nonExistentFeedId = ethers.keccak256(ethers.toUtf8Bytes("NONEXISTENT"));

            await expect(
                feedRegistry.connect(relay1).deactivateFeed(nonExistentFeedId)
            ).to.be.revertedWithCustomError(feedRegistry, "FeedNotFound");
        });
    });

    describe("View Functions", function () {
        beforeEach(async function () {
            await feedRegistry.connect(relay1).registerFeed("ETH/USD", DataType.PRICE, "(uint256)", ethers.parseUnits("1", 6), 60);
            await feedRegistry.connect(relay1).registerFeed("BTC/USD", DataType.PRICE, "(uint256)", ethers.parseUnits("2", 6), 120);
            await feedRegistry.connect(relay1).registerFeed("weather/rome", DataType.JSON, '{"temp":"number"}', 0, 3600);
        });

        it("Should get relay feeds", async function () {
            const feeds = await feedRegistry.getRelayFeeds(relay1.address);

            expect(feeds.length).to.equal(3);
            expect(feeds[0].name).to.equal("ETH/USD");
            expect(feeds[1].name).to.equal("BTC/USD");
            expect(feeds[2].name).to.equal("weather/rome");
        });

        it("Should get relay feed count", async function () {
            expect(await feedRegistry.getRelayFeedCount(relay1.address)).to.equal(3);
            expect(await feedRegistry.getRelayFeedCount(relay2.address)).to.equal(0);
        });

        it("Should compute feedId correctly", async function () {
            const name = "ETH/USD";
            const expectedFeedId = ethers.keccak256(ethers.toUtf8Bytes(name));
            const computedFeedId = await feedRegistry.getFeedId(name);

            expect(computedFeedId).to.equal(expectedFeedId);
        });

        it("Should check if feed is active", async function () {
            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));

            const [exists, active] = await feedRegistry.isFeedActive(relay1.address, feedId);
            expect(exists).to.be.true;
            expect(active).to.be.true;

            // Deactivate and check again
            await feedRegistry.connect(relay1).deactivateFeed(feedId);
            const [exists2, active2] = await feedRegistry.isFeedActive(relay1.address, feedId);
            expect(exists2).to.be.true;
            expect(active2).to.be.false;
        });

        it("Should return false for non-existent feed", async function () {
            const nonExistentFeedId = ethers.keccak256(ethers.toUtf8Bytes("NONEXISTENT"));

            const [exists, active] = await feedRegistry.isFeedActive(relay1.address, nonExistentFeedId);
            expect(exists).to.be.false;
            expect(active).to.be.false;
        });
    });

    describe("Multiple Relays", function () {
        beforeEach(async function () {
            // Register relay2
            await relayRegistry.connect(relay2).registerRelay(
                "https://relay2.example.com",
                PUBKEY,
                EPUB,
                MIN_STAKE,
                0
            );
        });

        it("Should allow same feed name from different relays", async function () {
            await feedRegistry.connect(relay1).registerFeed("ETH/USD", DataType.PRICE, "(uint256)", ethers.parseUnits("1", 6), 60);
            await feedRegistry.connect(relay2).registerFeed("ETH/USD", DataType.PRICE, "(uint256)", ethers.parseUnits("1.5", 6), 30);

            const feedId = ethers.keccak256(ethers.toUtf8Bytes("ETH/USD"));

            const feed1 = await feedRegistry.getFeed(relay1.address, feedId);
            const feed2 = await feedRegistry.getFeed(relay2.address, feedId);

            expect(feed1.priceAtomic).to.equal(ethers.parseUnits("1", 6));
            expect(feed2.priceAtomic).to.equal(ethers.parseUnits("1.5", 6));
        });

        it("Should track feeds separately per relay", async function () {
            await feedRegistry.connect(relay1).registerFeed("FEED1", DataType.PRICE, "", 0, 60);
            await feedRegistry.connect(relay1).registerFeed("FEED2", DataType.STRING, "", 0, 60);
            await feedRegistry.connect(relay2).registerFeed("FEED3", DataType.JSON, "", 0, 60);

            expect(await feedRegistry.getRelayFeedCount(relay1.address)).to.equal(2);
            expect(await feedRegistry.getRelayFeedCount(relay2.address)).to.equal(1);
            expect(await feedRegistry.totalFeeds()).to.equal(3);
        });
    });
});
