// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./DataSaleEscrow.sol";

/**
 * @title DataSaleEscrowFactory
 * @notice Factory for creating DataSaleEscrow instances using EIP-1167 Minimal Proxy pattern
 * @dev Uses cloning to reduce gas costs significantly (from ~500k to ~45k gas per escrow)
 * 
 * EIP-1167 Minimal Proxy bytecode:
 * 0x363d3d373d3d3d363d73<implementation>5af43d82803e903d91602b57fd5bf3
 * 
 * Token Support:
 * - Current: Single payment token (immutable, set at deployment)
 * - Future: To support new tokens, deploy new factory with new token address
 * - Alternative: Deploy TokenRegistry and create new factory version that uses it
 */
contract DataSaleEscrowFactory {
    // =========================================== State ===========================================

    /// @notice Implementation contract (used for cloning)
    address public immutable implementation;
    
    /// @notice Template escrow contract (kept for backward compatibility)
    address public immutable template;

    /// @notice All created escrows (addresses of minimal proxies)
    address[] public escrows;

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
        // Deploy implementation contract (used for cloning)
        DataSaleEscrow implContract = new DataSaleEscrow(_paymentToken, _registry, _postRegistry);
        implementation = address(implContract);
        template = address(implContract); // Keep for backward compatibility
    }

    // =========================================== Functions ========================================

    /**
     * @notice Create a new escrow for a data sale using EIP-1167 Minimal Proxy
     * @param _postId DataPost ID
     * @param _seller Seller address
     * @param _countdownDuration Countdown duration in seconds (e.g., 7 days = 604800)
     * @return escrow Address of created escrow (minimal proxy)
     * @dev Uses EIP-1167 cloning pattern to reduce gas costs from ~500k to ~45k per escrow
     */
    function createEscrow(
        bytes32 _postId,
        address _seller,
        uint256 _countdownDuration
    ) external returns (address escrow) {
        // Get post to verify it exists
        DataPostRegistry postRegistry = DataSaleEscrow(implementation).postRegistry();
        DataPostRegistry.DataPost memory post = postRegistry.getPost(_postId);
        
        require(post.createdAt != 0, "Post not found");
        require(post.active, "Post not active");
        require(post.seller == _seller, "Invalid seller");

        // Create minimal proxy using EIP-1167
        bytes memory bytecode = _generateMinimalProxyBytecode(implementation);
        bytes32 salt = keccak256(abi.encodePacked(_postId, _seller, msg.sender, block.timestamp));
        
        assembly {
            escrow := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        
        require(escrow != address(0), "Failed to create proxy");

        // Initialize escrow
        DataSaleEscrow(escrow).initialize(_postId, _seller, msg.sender, _countdownDuration);

        escrows.push(escrow);
        escrowsByBuyer[msg.sender].push(escrow);
        escrowsBySeller[_seller].push(escrow);
        escrowsByPost[_postId].push(escrow);

        emit EscrowCreated(escrow, _postId, _seller, msg.sender, post.priceUSDC);

        return escrow;
    }

    /**
     * @notice Generate EIP-1167 Minimal Proxy bytecode
     * @param _implementation Address of implementation contract
     * @return bytecode Complete bytecode for minimal proxy
     * @dev EIP-1167 format: 0x363d3d373d3d3d363d73<20-byte-address>5af43d82803e903d91602b57fd5bf3
     */
    function _generateMinimalProxyBytecode(address _implementation) internal pure returns (bytes memory) {
        bytes20 implementationBytes = bytes20(_implementation);
        bytes memory bytecode = abi.encodePacked(
            hex"3d602d80600a3d3981f3363d3d373d3d3d363d73",
            implementationBytes,
            hex"5af43d82803e903d91602b57fd5bf3"
        );
        return bytecode;
    }

    /**
     * @notice Get all escrows
     * @return Array of escrow addresses (minimal proxy addresses)
     */
    function getAllEscrows() external view returns (address[] memory) {
        return escrows;
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

