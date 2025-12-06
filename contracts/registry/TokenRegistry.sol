// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title TokenRegistry
 * @notice Registry for supported ERC20 tokens in the Shogun protocol
 * @dev Allows adding new tokens in the future without redeploying core contracts
 * 
 * This registry enables:
 * - Multi-token support for staking and payments
 * - Per-token configuration (minStake, decimals, etc.)
 * - Token enable/disable functionality
 * - Future extensibility without contract upgrades
 */
contract TokenRegistry is Ownable, Pausable {
    // =========================================== Types ===========================================

    /// @notice Token configuration
    struct TokenConfig {
        address tokenAddress;      // ERC20 token address
        uint256 minStake;          // Minimum stake for this token
        uint8 decimals;            // Token decimals
        bool enabled;              // Whether token is enabled
        uint256 addedAt;           // When token was added
    }

    // =========================================== State ===========================================

    /// @notice Supported tokens by address
    mapping(address => TokenConfig) public tokens;

    /// @notice List of all registered token addresses
    address[] public tokenList;

    /// @notice Index in tokenList array
    mapping(address => uint256) private tokenIndex;

    /// @notice Default token (for backward compatibility)
    address public defaultToken;

    /// @notice Total registered tokens
    uint256 public totalTokens;

    // =========================================== Events ==========================================

    event TokenAdded(
        address indexed token,
        uint256 minStake,
        uint8 decimals,
        bool isDefault
    );

    event TokenUpdated(
        address indexed token,
        uint256 newMinStake,
        bool enabled
    );

    event TokenRemoved(
        address indexed token
    );

    event DefaultTokenChanged(
        address indexed oldToken,
        address indexed newToken
    );

    // =========================================== Errors ==========================================

    error TokenNotFound();
    error TokenAlreadyRegistered();
    error InvalidTokenAddress();
    error InvalidMinStake();
    error CannotRemoveDefaultToken();
    error TokenDisabled();

    // ========================================= Constructor ========================================

    constructor(address _defaultToken, uint256 _defaultMinStake, uint8 _defaultDecimals) Ownable(msg.sender) {
        if (_defaultToken == address(0)) revert InvalidTokenAddress();
        
        defaultToken = _defaultToken;
        tokens[_defaultToken] = TokenConfig({
            tokenAddress: _defaultToken,
            minStake: _defaultMinStake,
            decimals: _defaultDecimals,
            enabled: true,
            addedAt: block.timestamp
        });
        
        tokenList.push(_defaultToken);
        tokenIndex[_defaultToken] = 0;
        totalTokens = 1;

        emit TokenAdded(_defaultToken, _defaultMinStake, _defaultDecimals, true);
    }

    // =========================================== Functions ========================================

    /**
     * @notice Add a new supported token
     * @param _token Token address
     * @param _minStake Minimum stake for this token
     * @param _decimals Token decimals
     * @param _setAsDefault Whether to set as new default token
     */
    function addToken(
        address _token,
        uint256 _minStake,
        uint8 _decimals,
        bool _setAsDefault
    ) external onlyOwner {
        if (_token == address(0)) revert InvalidTokenAddress();
        if (tokens[_token].addedAt > 0) revert TokenAlreadyRegistered();
        if (_minStake == 0) revert InvalidMinStake();

        tokens[_token] = TokenConfig({
            tokenAddress: _token,
            minStake: _minStake,
            decimals: _decimals,
            enabled: true,
            addedAt: block.timestamp
        });

        tokenIndex[_token] = tokenList.length;
        tokenList.push(_token);
        totalTokens++;

        if (_setAsDefault) {
            address oldDefault = defaultToken;
            defaultToken = _token;
            emit DefaultTokenChanged(oldDefault, _token);
        }

        emit TokenAdded(_token, _minStake, _decimals, _setAsDefault);
    }

    /**
     * @notice Update token configuration
     * @param _token Token address
     * @param _newMinStake New minimum stake (0 to keep current)
     * @param _enabled Whether token is enabled
     */
    function updateToken(
        address _token,
        uint256 _newMinStake,
        bool _enabled
    ) external onlyOwner {
        if (tokens[_token].addedAt == 0) revert TokenNotFound();
        if (_newMinStake > 0 && _newMinStake != tokens[_token].minStake) {
            if (_newMinStake == 0) revert InvalidMinStake();
            tokens[_token].minStake = _newMinStake;
        }
        
        tokens[_token].enabled = _enabled;

        emit TokenUpdated(_token, tokens[_token].minStake, _enabled);
    }

    /**
     * @notice Remove a token (cannot remove default token)
     * @param _token Token address
     */
    function removeToken(address _token) external onlyOwner {
        if (tokens[_token].addedAt == 0) revert TokenNotFound();
        if (_token == defaultToken) revert CannotRemoveDefaultToken();

        // Remove from list
        uint256 index = tokenIndex[_token];
        uint256 lastIndex = tokenList.length - 1;

        if (index != lastIndex) {
            address lastToken = tokenList[lastIndex];
            tokenList[index] = lastToken;
            tokenIndex[lastToken] = index;
        }

        tokenList.pop();
        delete tokenIndex[_token];
        delete tokens[_token];
        totalTokens--;

        emit TokenRemoved(_token);
    }

    /**
     * @notice Set a new default token
     * @param _token New default token address
     */
    function setDefaultToken(address _token) external onlyOwner {
        if (tokens[_token].addedAt == 0) revert TokenNotFound();
        if (!tokens[_token].enabled) revert TokenDisabled();

        address oldDefault = defaultToken;
        defaultToken = _token;

        emit DefaultTokenChanged(oldDefault, _token);
    }

    // =========================================== View Functions ====================================

    /**
     * @notice Check if a token is supported and enabled
     * @param _token Token address
     * @return True if token is supported and enabled
     */
    function isTokenSupported(address _token) external view returns (bool) {
        return tokens[_token].addedAt > 0 && tokens[_token].enabled;
    }

    /**
     * @notice Get token configuration
     * @param _token Token address
     * @return Token configuration
     */
    function getTokenConfig(address _token) external view returns (TokenConfig memory) {
        if (tokens[_token].addedAt == 0) revert TokenNotFound();
        return tokens[_token];
    }

    /**
     * @notice Get minimum stake for a token
     * @param _token Token address
     * @return Minimum stake amount
     */
    function getMinStake(address _token) external view returns (uint256) {
        if (tokens[_token].addedAt == 0) revert TokenNotFound();
        return tokens[_token].minStake;
    }

    /**
     * @notice Get all supported tokens
     * @return Array of token addresses
     */
    function getAllTokens() external view returns (address[] memory) {
        return tokenList;
    }

    /**
     * @notice Get enabled tokens only
     * @return Array of enabled token addresses
     */
    function getEnabledTokens() external view returns (address[] memory) {
        uint256 enabledCount = 0;
        
        // Count enabled tokens
        for (uint256 i = 0; i < tokenList.length; i++) {
            if (tokens[tokenList[i]].enabled) {
                enabledCount++;
            }
        }

        // Collect enabled tokens
        address[] memory enabled = new address[](enabledCount);
        uint256 index = 0;
        for (uint256 i = 0; i < tokenList.length; i++) {
            if (tokens[tokenList[i]].enabled) {
                enabled[index] = tokenList[i];
                index++;
            }
        }

        return enabled;
    }

    // =========================================== Admin =============================================

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}

