// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./DataSaleEscrow.sol";

/**
 * @title DataSaleEscrowFactory
 * @notice Factory for creating DataSaleEscrow instances
 * @dev Creates new escrow contracts for each data sale
 */
contract DataSaleEscrowFactory {
    // =========================================== State ===========================================

    /// @notice Template escrow contract (for reference)
    address public immutable template;

    /// @notice All created escrows
    DataSaleEscrow[] public escrows;

    /// @notice Escrows by buyer
    mapping(address => address[]) public escrowsByBuyer;

    /// @notice Escrows by seller
    mapping(address => address[]) public escrowsBySeller;

    /// @notice Escrows by post ID
    mapping(bytes32 => address[]) public escrowsByPost;

    // =========================================== Events ==========================================

    event EscrowCreated(
        address indexed escrow,
        bytes32 indexed postId,
        address indexed seller,
        address buyer,
        uint256 priceUSDC
    );

    // ========================================= Constructor ========================================

    constructor(address _paymentToken, address _registry, address _postRegistry) {
        // Deploy template (not used for cloning in this simple version)
        DataSaleEscrow templateContract = new DataSaleEscrow(_paymentToken, _registry, _postRegistry);
        template = address(templateContract);
    }

    // =========================================== Functions ========================================

    /**
     * @notice Create a new escrow for a data sale
     * @param _postId DataPost ID
     * @param _seller Seller address
     * @param _countdownDuration Countdown duration in seconds (e.g., 7 days = 604800)
     * @return escrow Address of created escrow
     */
    function createEscrow(
        bytes32 _postId,
        address _seller,
        uint256 _countdownDuration
    ) external returns (address escrow) {
        // Get post to verify it exists
        DataPostRegistry postRegistry = DataSaleEscrow(template).postRegistry();
        DataPostRegistry.DataPost memory post = postRegistry.getPost(_postId);
        
        require(post.createdAt != 0, "Post not found");
        require(post.active, "Post not active");
        require(post.seller == _seller, "Invalid seller");

        // Create new escrow
        DataSaleEscrow newEscrow = new DataSaleEscrow(
            address(DataSaleEscrow(template).paymentToken()),
            address(DataSaleEscrow(template).registry()),
            address(postRegistry)
        );

        // Initialize escrow
        newEscrow.initialize(_postId, _seller, msg.sender, _countdownDuration);

        escrow = address(newEscrow);
        escrows.push(newEscrow);
        escrowsByBuyer[msg.sender].push(escrow);
        escrowsBySeller[_seller].push(escrow);
        escrowsByPost[_postId].push(escrow);

        emit EscrowCreated(escrow, _postId, _seller, msg.sender, post.priceUSDC);

        return escrow;
    }

    /**
     * @notice Get all escrows
     * @return Array of escrow addresses
     */
    function getAllEscrows() external view returns (address[] memory) {
        address[] memory addresses = new address[](escrows.length);
        for (uint256 i = 0; i < escrows.length; i++) {
            addresses[i] = address(escrows[i]);
        }
        return addresses;
    }

    /**
     * @notice Get escrows by buyer
     * @param _buyer Buyer address
     * @return Array of escrow addresses
     */
    function getEscrowsByBuyer(address _buyer) external view returns (address[] memory) {
        return escrowsByBuyer[_buyer];
    }

    /**
     * @notice Get escrows by seller
     * @param _seller Seller address
     * @return Array of escrow addresses
     */
    function getEscrowsBySeller(address _seller) external view returns (address[] memory) {
        return escrowsBySeller[_seller];
    }

    /**
     * @notice Get escrows by post ID
     * @param _postId Post ID
     * @return Array of escrow addresses
     */
    function getEscrowsByPost(bytes32 _postId) external view returns (address[] memory) {
        return escrowsByPost[_postId];
    }

    /**
     * @notice Get total number of escrows
     * @return Count of escrows
     */
    function getEscrowCount() external view returns (uint256) {
        return escrows.length;
    }
}

