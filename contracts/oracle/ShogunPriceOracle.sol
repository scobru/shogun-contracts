// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ShogunOracle.sol";
import "./OracleFeedRegistry.sol";

/**
 * @title ShogunPriceOracle
 * @notice Example deployable oracle consumer contract
 * @dev Demonstrates how to use ShogunOracle for on-chain price feeds
 * 
 * Relays sign price data off-chain, users submit signed packets
 * to this contract which verifies the signature and stores/uses the price.
 */
contract ShogunPriceOracle is ShogunOracle {
    // =========================================== State ===========================================

    /// @notice Feed registry for querying available feeds
    OracleFeedRegistry public immutable feedRegistry;

    /// @notice Latest price per feed
    mapping(bytes32 => uint256) public latestPrices;

    /// @notice Latest update timestamp per feed
    mapping(bytes32 => uint256) public lastUpdated;

    /// @notice Signer of the latest price update per feed
    mapping(bytes32 => address) public lastSigner;

    // =========================================== Events ===========================================

    event PriceUpdated(
        bytes32 indexed feedId,
        uint256 price,
        uint256 timestamp,
        address indexed signer
    );

    // =========================================== Constructor ===========================================

    /// @param _relayRegistry Address of ShogunRelayRegistry
    /// @param _feedRegistry Address of OracleFeedRegistry
    constructor(
        address _relayRegistry,
        address _feedRegistry
    ) ShogunOracle(_relayRegistry) {
        require(_feedRegistry != address(0), "ShogunPriceOracle: Invalid feed registry");
        feedRegistry = OracleFeedRegistry(_feedRegistry);
    }

    // =========================================== External Functions ===========================================

    /**
     * @notice Update price from a signed oracle packet
     * @param packet Signed oracle packet from a relay
     * @dev Anyone can submit a valid packet, the price will be stored
     */
    function updatePrice(OraclePacket calldata packet) 
        external 
        verifyOraclePacket(packet.feedId, packet) 
    {
        // Decode price from payload (expects uint256)
        uint256 price = abi.decode(packet.payload, (uint256));
        
        // Get signer for event
        address signer = getPacketSigner(packet);
        
        // Only update if newer than current (prevent replay with old data)
        require(
            packet.deadline > lastUpdated[packet.feedId],
            "ShogunPriceOracle: Stale packet"
        );

        // Store price
        latestPrices[packet.feedId] = price;
        lastUpdated[packet.feedId] = block.timestamp;
        lastSigner[packet.feedId] = signer;

        emit PriceUpdated(packet.feedId, price, block.timestamp, signer);
    }

    /**
     * @notice Get price for a feed by name
     * @param feedName Human-readable feed name (e.g., "ETH/USD")
     * @return price Latest price
     * @return timestamp When the price was last updated
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
     * @notice Get price for a feed by ID
     * @param feedId Feed identifier (keccak256 of feed name)
     * @return price Latest price
     * @return timestamp When the price was last updated
     */
    function getPriceById(bytes32 feedId) 
        external 
        view 
        returns (uint256 price, uint256 timestamp) 
    {
        return (latestPrices[feedId], lastUpdated[feedId]);
    }

    /**
     * @notice Use price in a single call (update + read)
     * @param packet Signed oracle packet
     * @return price The price from the packet
     * @dev Useful for DeFi integrations that need fresh prices
     */
    function updateAndGetPrice(OraclePacket calldata packet)
        external
        verifyOraclePacket(packet.feedId, packet)
        returns (uint256 price)
    {
        price = abi.decode(packet.payload, (uint256));
        
        address signer = getPacketSigner(packet);
        
        latestPrices[packet.feedId] = price;
        lastUpdated[packet.feedId] = block.timestamp;
        lastSigner[packet.feedId] = signer;

        emit PriceUpdated(packet.feedId, price, block.timestamp, signer);
    }

    /**
     * @notice Verify a packet without storing (view function)
     * @param feedId Expected feed ID
     * @param packet Signed oracle packet
     * @return valid Whether the packet is valid
     * @return price The price in the packet (if valid)
     * @return signer The signer address
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
}
