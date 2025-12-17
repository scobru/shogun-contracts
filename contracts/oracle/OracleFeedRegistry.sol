// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../registry/ShogunRelayRegistry.sol";

/**
 * @title OracleFeedRegistry
 * @notice Registry for oracle data feeds provided by Shogun relays
 * @dev Allows relays to register custom data feeds with pricing and schema information
 *      Separate contract to avoid redeploying ShogunRelayRegistry
 */
contract OracleFeedRegistry {
    // =========================================== Types ===========================================

    /// @notice Supported data types for feed payloads
    enum DataType {
        PRICE,      // Simple price value (uint256)
        STRING,     // String data
        JSON,       // JSON-encoded data
        BYTES,      // Raw bytes
        CUSTOM      // Custom ABI-encoded data
    }

    /// @notice Feed configuration
    struct FeedInfo {
        string name;              // Human-readable name (e.g., "ETH/USD", "weather/rome")
        DataType dataType;        // Type of data in payload
        string schema;            // ABI or JSON schema for decoding payload
        uint256 priceAtomic;      // Cost per request in USDC (6 decimals)
        uint256 updateFreqSecs;   // Expected update frequency
        uint256 createdAt;        // Registration timestamp
        bool active;              // Whether feed is active
    }

    // =========================================== State ===========================================

    /// @notice ShogunRelayRegistry for verifying active relays
    ShogunRelayRegistry public immutable relayRegistry;

    /// @notice Relay address => feedId => FeedInfo
    mapping(address => mapping(bytes32 => FeedInfo)) public relayFeeds;

    /// @notice Relay address => list of feedIds
    mapping(address => bytes32[]) public relayFeedIds;

    /// @notice Total number of registered feeds across all relays
    uint256 public totalFeeds;

    // =========================================== Events ===========================================

    event FeedRegistered(
        address indexed relay,
        bytes32 indexed feedId,
        string name,
        DataType dataType,
        uint256 price
    );

    event FeedUpdated(
        address indexed relay,
        bytes32 indexed feedId,
        uint256 newPrice,
        bool active
    );

    event FeedDeactivated(
        address indexed relay,
        bytes32 indexed feedId
    );

    // =========================================== Errors ===========================================

    error NotActiveRelay();
    error FeedAlreadyExists();
    error FeedNotFound();
    error InvalidName();

    // =========================================== Constructor ===========================================

    /// @param _relayRegistry Address of ShogunRelayRegistry contract
    constructor(address _relayRegistry) {
        require(_relayRegistry != address(0), "OracleFeedRegistry: Invalid registry");
        relayRegistry = ShogunRelayRegistry(_relayRegistry);
    }

    // =========================================== Feed Management ===========================================

    /// @notice Register a new data feed
    /// @param _name Feed name (used to compute feedId)
    /// @param _dataType Type of data in payload
    /// @param _schema ABI or JSON schema for decoding
    /// @param _priceAtomic Cost per request in USDC atomic units (6 decimals)
    /// @param _updateFreqSecs Expected update frequency in seconds
    function registerFeed(
        string calldata _name,
        DataType _dataType,
        string calldata _schema,
        uint256 _priceAtomic,
        uint256 _updateFreqSecs
    ) external {
        if (!relayRegistry.isActiveRelay(msg.sender)) revert NotActiveRelay();
        if (bytes(_name).length == 0) revert InvalidName();

        bytes32 feedId = keccak256(bytes(_name));
        
        // Check if feed already exists for this relay
        if (relayFeeds[msg.sender][feedId].createdAt != 0) revert FeedAlreadyExists();

        relayFeeds[msg.sender][feedId] = FeedInfo({
            name: _name,
            dataType: _dataType,
            schema: _schema,
            priceAtomic: _priceAtomic,
            updateFreqSecs: _updateFreqSecs,
            createdAt: block.timestamp,
            active: true
        });

        relayFeedIds[msg.sender].push(feedId);
        totalFeeds++;

        emit FeedRegistered(msg.sender, feedId, _name, _dataType, _priceAtomic);
    }

    /// @notice Update feed pricing and status
    /// @param _feedId Feed identifier
    /// @param _newPrice New price in USDC atomic units
    /// @param _active Whether feed should be active
    function updateFeed(
        bytes32 _feedId,
        uint256 _newPrice,
        bool _active
    ) external {
        if (!relayRegistry.isActiveRelay(msg.sender)) revert NotActiveRelay();
        if (relayFeeds[msg.sender][_feedId].createdAt == 0) revert FeedNotFound();

        relayFeeds[msg.sender][_feedId].priceAtomic = _newPrice;
        relayFeeds[msg.sender][_feedId].active = _active;

        emit FeedUpdated(msg.sender, _feedId, _newPrice, _active);
    }

    /// @notice Deactivate a feed
    /// @param _feedId Feed identifier
    function deactivateFeed(bytes32 _feedId) external {
        if (relayFeeds[msg.sender][_feedId].createdAt == 0) revert FeedNotFound();
        
        relayFeeds[msg.sender][_feedId].active = false;
        
        emit FeedDeactivated(msg.sender, _feedId);
    }

    // =========================================== View Functions ===========================================

    /// @notice Get all feeds for a relay
    /// @param _relay Relay address
    /// @return feeds Array of FeedInfo structs
    function getRelayFeeds(address _relay) external view returns (FeedInfo[] memory feeds) {
        bytes32[] memory feedIds = relayFeedIds[_relay];
        feeds = new FeedInfo[](feedIds.length);
        
        for (uint256 i = 0; i < feedIds.length; i++) {
            feeds[i] = relayFeeds[_relay][feedIds[i]];
        }
    }

    /// @notice Get feed info by relay and feedId
    /// @param _relay Relay address
    /// @param _feedId Feed identifier
    /// @return Feed information
    function getFeed(address _relay, bytes32 _feedId) external view returns (FeedInfo memory) {
        return relayFeeds[_relay][_feedId];
    }

    /// @notice Get feedId from name
    /// @param _name Feed name
    /// @return feedId Computed feed identifier
    function getFeedId(string calldata _name) external pure returns (bytes32) {
        return keccak256(bytes(_name));
    }

    /// @notice Get number of feeds for a relay
    /// @param _relay Relay address
    /// @return count Number of registered feeds
    function getRelayFeedCount(address _relay) external view returns (uint256) {
        return relayFeedIds[_relay].length;
    }

    /// @notice Check if a feed exists and is active
    /// @param _relay Relay address
    /// @param _feedId Feed identifier
    /// @return exists Whether feed exists
    /// @return active Whether feed is active
    function isFeedActive(address _relay, bytes32 _feedId) 
        external 
        view 
        returns (bool exists, bool active) 
    {
        FeedInfo memory feed = relayFeeds[_relay][_feedId];
        exists = feed.createdAt != 0;
        active = feed.active;
    }
}
