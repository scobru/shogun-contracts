// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title DataPostRegistry
 * @notice Registry for data posts (similar to Erasure Posts)
 * @dev Allows users to publish available data for sale
 * 
 * Features:
 * - Publish data posts with proofhash
 * - Search/discover available data
 * - Track seller reputation
 */
contract DataPostRegistry is Ownable, Pausable {
    // =========================================== Types ===========================================

    /// @notice Data post information
    struct DataPost {
        bytes32 postId;              // Unique post identifier
        address seller;              // Seller address
        bytes32 proofHash;           // SHA256 hash of raw data (proof of existence)
        string encryptedDataHash;    // IPFS CID of encrypted data
        string description;          // Description of data
        string category;             // Category/tag for search
        uint256 priceUSDC;          // Price in USDC (6 decimals)
        uint256 createdAt;          // Creation timestamp
        bool active;                // Whether post is active
    }

    // =========================================== State ===========================================

    /// @notice Data posts by ID
    mapping(bytes32 => DataPost) public posts;

    /// @notice Posts by seller
    mapping(address => bytes32[]) public postsBySeller;

    /// @notice Posts by category (for discovery)
    mapping(string => bytes32[]) public postsByCategory;

    /// @notice All active post IDs (for discovery)
    bytes32[] public activePosts;

    /// @notice Index in activePosts array
    mapping(bytes32 => uint256) private activePostIndex;

    /// @notice Total posts counter
    uint256 public totalPosts;

    // =========================================== Events ==========================================

    event DataPostPublished(
        bytes32 indexed postId,
        address indexed seller,
        bytes32 proofHash,
        string encryptedDataHash,
        string description,
        string category,
        uint256 priceUSDC
    );

    event DataPostUpdated(
        bytes32 indexed postId,
        string newDescription,
        uint256 newPrice
    );

    event DataPostDeactivated(
        bytes32 indexed postId,
        address indexed seller
    );

    // =========================================== Errors ==========================================

    error PostNotFound();
    error PostAlreadyExists();
    error NotPostOwner();
    error InvalidPrice();
    error InvalidDescription();

    // ========================================= Constructor ========================================

    constructor() Ownable(msg.sender) {}

    // =========================================== Functions ========================================

    /**
     * @notice Publish a data post
     * @param _proofHash SHA256 hash of raw data (proof of existence)
     * @param _encryptedDataHash IPFS CID of encrypted data
     * @param _description Description of the data
     * @param _category Category/tag for search
     * @param _priceUSDC Price in USDC (6 decimals)
     * @return postId The created post ID
     */
    function publishPost(
        bytes32 _proofHash,
        string calldata _encryptedDataHash,
        string calldata _description,
        string calldata _category,
        uint256 _priceUSDC
    ) external whenNotPaused returns (bytes32) {
        if (bytes(_description).length == 0) revert InvalidDescription();
        if (_priceUSDC == 0) revert InvalidPrice();

        // Generate post ID
        totalPosts++;
        bytes32 postId = keccak256(abi.encodePacked(
            msg.sender,
            _proofHash,
            block.timestamp,
            totalPosts
        ));

        if (posts[postId].createdAt != 0) revert PostAlreadyExists();

        // Create post
        posts[postId] = DataPost({
            postId: postId,
            seller: msg.sender,
            proofHash: _proofHash,
            encryptedDataHash: _encryptedDataHash,
            description: _description,
            category: _category,
            priceUSDC: _priceUSDC,
            createdAt: block.timestamp,
            active: true
        });

        // Add to indexes
        postsBySeller[msg.sender].push(postId);
        postsByCategory[_category].push(postId);
        activePostIndex[postId] = activePosts.length;
        activePosts.push(postId);

        emit DataPostPublished(
            postId,
            msg.sender,
            _proofHash,
            _encryptedDataHash,
            _description,
            _category,
            _priceUSDC
        );

        return postId;
    }

    /**
     * @notice Update post description and/or price
     * @param _postId Post ID
     * @param _newDescription New description (empty to keep current)
     * @param _newPrice New price (0 to keep current)
     */
    function updatePost(
        bytes32 _postId,
        string calldata _newDescription,
        uint256 _newPrice
    ) external {
        DataPost storage post = posts[_postId];
        if (post.createdAt == 0) revert PostNotFound();
        if (post.seller != msg.sender) revert NotPostOwner();

        if (bytes(_newDescription).length > 0) {
            post.description = _newDescription;
        }
        if (_newPrice > 0) {
            post.priceUSDC = _newPrice;
        }

        emit DataPostUpdated(_postId, post.description, post.priceUSDC);
    }

    /**
     * @notice Deactivate a post (stop selling)
     * @param _postId Post ID
     */
    function deactivatePost(bytes32 _postId) external {
        DataPost storage post = posts[_postId];
        if (post.createdAt == 0) revert PostNotFound();
        if (post.seller != msg.sender) revert NotPostOwner();

        post.active = false;

        // Remove from active posts
        uint256 index = activePostIndex[_postId];
        uint256 lastIndex = activePosts.length - 1;

        if (index != lastIndex) {
            bytes32 lastPostId = activePosts[lastIndex];
            activePosts[index] = lastPostId;
            activePostIndex[lastPostId] = index;
        }

        activePosts.pop();
        delete activePostIndex[_postId];

        emit DataPostDeactivated(_postId, msg.sender);
    }

    // =========================================== Discovery ========================================

    /**
     * @notice Get post by ID
     * @param _postId Post ID
     * @return Post information
     */
    function getPost(bytes32 _postId) external view returns (DataPost memory) {
        return posts[_postId];
    }

    /**
     * @notice Get all active posts
     * @return Array of active post IDs
     */
    function getActivePosts() external view returns (bytes32[] memory) {
        return activePosts;
    }

    /**
     * @notice Get posts by seller
     * @param _seller Seller address
     * @return Array of post IDs
     */
    function getPostsBySeller(address _seller) external view returns (bytes32[] memory) {
        return postsBySeller[_seller];
    }

    /**
     * @notice Get posts by category
     * @param _category Category name
     * @return Array of post IDs
     */
    function getPostsByCategory(string calldata _category) external view returns (bytes32[] memory) {
        return postsByCategory[_category];
    }

    /**
     * @notice Get total number of active posts
     * @return Count of active posts
     */
    function getActivePostCount() external view returns (uint256) {
        return activePosts.length;
    }

    // =========================================== Admin ============================================

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}

