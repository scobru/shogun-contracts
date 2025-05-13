// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract StealthKeyRegistry {
  // =========================================== Events ============================================

  /// @dev Event emitted when a user registers or updates their stealth keys
  event StealthKeysRegistered(
    address indexed registrant,
    string viewingPublicKey,
    string spendingPublicKey
  );
  
  /// @dev Event emitted when stealth metadata is registered
  event StealthMetadataRegistered(
    address indexed stealthAddress,
    address indexed sender,
    string ephemeralPublicKey,
    string encryptedRandomNumber,
    string recipientPublicKey
  );

  // ======================================= State variables =======================================

  /// @dev Mapping from user address to their viewing public key
  mapping(address => string) private viewingKeys;
  
  /// @dev Mapping from user address to their spending public key
  mapping(address => string) private spendingKeys;
  
  /// @dev Domain separator for EIP-712 signatures
  bytes32 public immutable DOMAIN_SEPARATOR;
  
  /// @dev The payload typehash used for EIP-712 signatures
  bytes32 public constant STEALTHKEYS_TYPEHASH =
    keccak256(
      "StealthKeys(string viewingPublicKey,string spendingPublicKey)"
    );

  /**
   * @dev Set the domain separator during deployment
   */
  constructor() {
    DOMAIN_SEPARATOR = keccak256(
      abi.encode(
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
        keccak256(bytes("Shogun Stealth Key Registry")),
        keccak256(bytes("1")),
        block.chainid,
        address(this)
      )
    );
  }

  // ======================================= Register Keys =======================================

  /**
   * @notice Sets stealth keys for the caller
   * @param _viewingPublicKey The public key for viewing/decrypting stealth data
   * @param _spendingPublicKey The public key for generating a stealth address
   */
  function registerStealthKeys(
    string calldata _viewingPublicKey,
    string calldata _spendingPublicKey
  ) external {
    _registerStealthKeys(msg.sender, _viewingPublicKey, _spendingPublicKey);
  }

  /**
   * @notice Sets stealth keys on behalf of another address with their signature
   * @param _registrant The address for which stealth keys are being registered
   * @param _viewingPublicKey The public key for viewing/decrypting stealth data
   * @param _spendingPublicKey The public key for generating a stealth address
   * @param _v ECDSA signature component: Parity of the `y` coordinate of point `R`
   * @param _r ECDSA signature component: x-coordinate of `R`
   * @param _s ECDSA signature component: `s` value of the signature
   */
  function registerStealthKeysOnBehalf(
    address _registrant,
    string calldata _viewingPublicKey,
    string calldata _spendingPublicKey,
    uint8 _v,
    bytes32 _r,
    bytes32 _s
  ) external {
    // Create EIP-712 digest
    bytes32 _digest = keccak256(
      abi.encodePacked(
        "\x19\x01",
        DOMAIN_SEPARATOR,
        keccak256(
          abi.encode(
            STEALTHKEYS_TYPEHASH,
            keccak256(bytes(_viewingPublicKey)),
            keccak256(bytes(_spendingPublicKey))
          )
        )
      )
    );

    // Recover the signing address and ensure it matches the registrant
    address _recovered = ecrecover(_digest, _v, _r, _s);
    require(_recovered == _registrant, "StealthKeyRegistry: Invalid Signature");

    // Register the keys
    _registerStealthKeys(_registrant, _viewingPublicKey, _spendingPublicKey);
  }

  /**
   * @dev Internal method to register stealth keys
   */
  function _registerStealthKeys(
    address _registrant,
    string calldata _viewingPublicKey,
    string calldata _spendingPublicKey
  ) internal {
    // Validate input - ensure keys are not empty
    require(
      bytes(_viewingPublicKey).length > 0 && bytes(_spendingPublicKey).length > 0,
      "StealthKeyRegistry: Keys cannot be empty"
    );

    // Store the keys
    viewingKeys[_registrant] = _viewingPublicKey;
    spendingKeys[_registrant] = _spendingPublicKey;

    // Emit the event
    emit StealthKeysRegistered(_registrant, _viewingPublicKey, _spendingPublicKey);
  }

  // ============================= Register Stealth Metadata =============================

  /**
   * @notice Register stealth transaction metadata
   * @param _stealthAddress The stealth address generated
   * @param _ephemeralPublicKey The ephemeral public key used
   * @param _encryptedRandomNumber Random number encrypted with viewing key
   * @param _recipientPublicKey The recipient's public key (spending)
   */
  function registerStealthMetadata(
    address _stealthAddress,
    string calldata _ephemeralPublicKey,
    string calldata _encryptedRandomNumber,
    string calldata _recipientPublicKey
  ) external {
    emit StealthMetadataRegistered(
      _stealthAddress,
      msg.sender,
      _ephemeralPublicKey,
      _encryptedRandomNumber,
      _recipientPublicKey
    );
  }

  // ======================================= Get Keys ===============================================

  /**
   * @notice Get the stealth keys for a given address
   * @param _registrant The address to lookup
   * @return viewingPublicKey The viewing public key
   * @return spendingPublicKey The spending public key
   */
  function getStealthKeys(address _registrant) 
    external 
    view 
    returns (
      string memory viewingPublicKey,
      string memory spendingPublicKey
    ) 
  {
    return (viewingKeys[_registrant], spendingKeys[_registrant]);
  }
}