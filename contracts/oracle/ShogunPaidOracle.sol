// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ShogunOracle.sol";
import "./OracleFeedRegistry.sol";

/**
 * @title ShogunPaidOracle
 * @notice Oracle consumer with on-chain payment to relay operators
 * @dev Each price update requires payment that goes to the relay signer
 * 
 * Revenue model:
 * - updatePrice() requires msg.value >= feed price
 * - Payment goes to the relay that signed the data
 * - This enables revenue from contract-to-contract calls (not just API)
 */
contract ShogunPaidOracle is ShogunOracle {
    // =========================================== State ===========================================

    /// @notice Feed registry for querying prices
    OracleFeedRegistry public immutable feedRegistry;

    /// @notice Latest price per feed
    mapping(bytes32 => uint256) public latestPrices;

    /// @notice Latest update timestamp per feed
    mapping(bytes32 => uint256) public lastUpdated;

    /// @notice Signer of the latest price update per feed
    mapping(bytes32 => address) public lastSigner;

    /// @notice Custom price override per feed (0 = use registry price)
    mapping(bytes32 => uint256) public feedPriceOverride;

    /// @notice Total revenue collected per relay
    mapping(address => uint256) public relayRevenue;

    /// @notice Owner for admin functions
    address public owner;

    // =========================================== Errors ===========================================

    error InsufficientPayment(uint256 required, uint256 provided);
    error StalePacket(bytes32 feedId, uint256 lastUpdate, uint256 packetDeadline);
    error TransferFailed(address to, uint256 amount);
    error Unauthorized();

    // =========================================== Events ===========================================

    event PriceUpdated(
        bytes32 indexed feedId,
        uint256 price,
        uint256 timestamp,
        address indexed signer,
        uint256 paymentAmount
    );

    event PaymentReceived(
        address indexed relay,
        bytes32 indexed feedId,
        uint256 amount
    );

    event FeedPriceSet(bytes32 indexed feedId, uint256 price);

    // =========================================== Modifiers ===========================================

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    // =========================================== Constructor ===========================================

    /// @param _relayRegistry Address of ShogunRelayRegistry
    /// @param _feedRegistry Address of OracleFeedRegistry
    constructor(
        address _relayRegistry,
        address _feedRegistry
    ) ShogunOracle(_relayRegistry) {
        require(_feedRegistry != address(0), "ShogunPaidOracle: Invalid feed registry");
        feedRegistry = OracleFeedRegistry(_feedRegistry);
        owner = msg.sender;
    }

    // =========================================== External Functions ===========================================

    /**
     * @notice Update price from a signed oracle packet (with payment)
     * @param packet Signed oracle packet from a relay
     * @dev Payment goes directly to the relay (signer)
     */
    function updatePrice(OraclePacket calldata packet) 
        external 
        payable
        verifyOraclePacket(packet.feedId, packet) 
    {
        // Get required price
        uint256 requiredPrice = getFeedPrice(packet.feedId);
        
        // Check payment
        if (msg.value < requiredPrice) {
            revert InsufficientPayment(requiredPrice, msg.value);
        }

        // Decode price from payload (expects uint256)
        uint256 price = abi.decode(packet.payload, (uint256));
        
        // Get signer for payment
        address signer = getPacketSigner(packet);
        
        // Only update if newer than current (prevent replay with old data)
        if (packet.deadline <= lastUpdated[packet.feedId]) {
            revert StalePacket(packet.feedId, lastUpdated[packet.feedId], packet.deadline);
        }

        // Store price
        latestPrices[packet.feedId] = price;
        lastUpdated[packet.feedId] = block.timestamp;
        lastSigner[packet.feedId] = signer;

        // Track revenue
        relayRevenue[signer] += msg.value;

        // Transfer payment to relay
        if (msg.value > 0) {
            (bool success, ) = payable(signer).call{value: msg.value}("");
            if (!success) revert TransferFailed(signer, msg.value);
            emit PaymentReceived(signer, packet.feedId, msg.value);
        }

        emit PriceUpdated(packet.feedId, price, block.timestamp, signer, msg.value);
    }

    /**
     * @notice Update and get price in single call (with payment)
     * @param packet Signed oracle packet
     * @return price The price from the packet
     */
    function updateAndGetPrice(OraclePacket calldata packet)
        external
        payable
        verifyOraclePacket(packet.feedId, packet)
        returns (uint256 price)
    {
        uint256 requiredPrice = getFeedPrice(packet.feedId);
        if (msg.value < requiredPrice) {
            revert InsufficientPayment(requiredPrice, msg.value);
        }

        price = abi.decode(packet.payload, (uint256));
        address signer = getPacketSigner(packet);
        
        latestPrices[packet.feedId] = price;
        lastUpdated[packet.feedId] = block.timestamp;
        lastSigner[packet.feedId] = signer;
        relayRevenue[signer] += msg.value;

        if (msg.value > 0) {
            (bool success, ) = payable(signer).call{value: msg.value}("");
            if (!success) revert TransferFailed(signer, msg.value);
            emit PaymentReceived(signer, packet.feedId, msg.value);
        }

        emit PriceUpdated(packet.feedId, price, block.timestamp, signer, msg.value);
    }

    // =========================================== View Functions ===========================================

    /**
     * @notice Get current price for a feed
     * @param feedName Human-readable feed name (e.g., "ETH/USD")
     */
    function getPrice(string calldata feedName) 
        external 
        view 
        returns (uint256 price, uint256 timestamp) 
    {
        bytes32 feedId = keccak256(bytes(feedName));
        return (latestPrices[feedId], lastUpdated[feedId]);
    }

    /**
     * @notice Get current price by feed ID
     */
    function getPriceById(bytes32 feedId) 
        external 
        view 
        returns (uint256 price, uint256 timestamp) 
    {
        return (latestPrices[feedId], lastUpdated[feedId]);
    }

    /**
     * @notice Get required payment for a feed
     * @param feedId Feed identifier
     * @return price Price in wei
     */
    function getFeedPrice(bytes32 feedId) public view returns (uint256) {
        // Check for override first
        if (feedPriceOverride[feedId] > 0) {
            return feedPriceOverride[feedId];
        }
        // Otherwise query registry (note: registry stores in USDC atomic, not ETH)
        // For simplicity, we use a fixed conversion or just use override
        return 0; // Free by default, owner can set prices
    }

    /**
     * @notice Verify a packet without storing (view)
     */
    function verifyPacket(bytes32 feedId, OraclePacket calldata packet)
        external
        view
        returns (bool valid, uint256 price, address signer)
    {
        valid = _verifyPacket(feedId, packet);
        if (valid) {
            price = abi.decode(packet.payload, (uint256));
            signer = getPacketSigner(packet);
        }
    }

    /**
     * @notice Get quote for updating a feed
     * @param feedId Feed to update
     * @return requiredPayment Amount of ETH required
     */
    function getUpdateQuote(bytes32 feedId) external view returns (uint256 requiredPayment) {
        return getFeedPrice(feedId);
    }

    // =========================================== Admin Functions ===========================================

    /**
     * @notice Set price for a specific feed
     * @param feedId Feed identifier
     * @param price Price in wei (0 = free)
     */
    function setFeedPrice(bytes32 feedId, uint256 price) external onlyOwner {
        feedPriceOverride[feedId] = price;
        emit FeedPriceSet(feedId, price);
    }

    /**
     * @notice Set price by feed name
     * @param feedName Human-readable name
     * @param price Price in wei
     */
    function setFeedPriceByName(string calldata feedName, uint256 price) external onlyOwner {
        bytes32 feedId = keccak256(bytes(feedName));
        feedPriceOverride[feedId] = price;
        emit FeedPriceSet(feedId, price);
    }

    /**
     * @notice Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        owner = newOwner;
    }

    /**
     * @notice Withdraw any stuck ETH (emergency)
     */
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = payable(owner).call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }
}
