// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../registry/ShogunRelayRegistry.sol";

/**
 * @title ShogunOracle
 * @notice Trust-minimized oracle for accessing offchain data onchain
 * @dev Extends Trustus pattern with ShogunRelayRegistry integration
 *      Only registered active relays can sign valid oracle packets
 * 
 * Based on: https://github.com/ZeframLou/trustus
 */
abstract contract ShogunOracle {
    // =========================================== Structs ===========================================

    /// @notice Oracle packet with EIP-712 signature
    /// @param v Part of the ECDSA signature
    /// @param r Part of the ECDSA signature
    /// @param s Part of the ECDSA signature
    /// @param feedId Identifier for the data feed (keccak256 of feed name)
    /// @param deadline Unix timestamp after which packet should be rejected
    /// @param payload ABI-encoded data payload
    struct OraclePacket {
        uint8 v;
        bytes32 r;
        bytes32 s;
        bytes32 feedId;
        uint256 deadline;
        bytes payload;
    }

    // =========================================== Errors ===========================================

    error ShogunOracle__InvalidPacket();
    error ShogunOracle__PacketExpired();
    error ShogunOracle__SignerNotActiveRelay();

    // =========================================== Immutables ===========================================

    /// @notice The chain ID used by EIP-712
    uint256 internal immutable INITIAL_CHAIN_ID;

    /// @notice The domain separator used by EIP-712
    bytes32 internal immutable INITIAL_DOMAIN_SEPARATOR;

    /// @notice ShogunRelayRegistry for verifying signers
    ShogunRelayRegistry public immutable relayRegistry;

    // =========================================== Constants ===========================================

    /// @notice EIP-712 typehash for OraclePacket
    bytes32 public constant ORACLE_PACKET_TYPEHASH = keccak256(
        "OraclePacket(bytes32 feedId,uint256 deadline,bytes payload)"
    );

    // =========================================== Modifiers ===========================================

    /// @notice Verifies whether an oracle packet is valid
    /// @dev Checks deadline, signature, and that signer is an active relay
    /// @param feedId Expected feed identifier
    /// @param packet The oracle packet to verify
    modifier verifyOraclePacket(bytes32 feedId, OraclePacket calldata packet) {
        if (!_verifyPacket(feedId, packet)) revert ShogunOracle__InvalidPacket();
        _;
    }

    // =========================================== Constructor ===========================================

    /// @param _relayRegistry Address of ShogunRelayRegistry contract
    constructor(address _relayRegistry) {
        require(_relayRegistry != address(0), "ShogunOracle: Invalid registry");
        relayRegistry = ShogunRelayRegistry(_relayRegistry);
        INITIAL_CHAIN_ID = block.chainid;
        INITIAL_DOMAIN_SEPARATOR = _computeDomainSeparator();
    }

    // =========================================== Verification ===========================================

    /// @notice Verifies whether an oracle packet is valid
    /// @param feedId Expected feed identifier
    /// @param packet The oracle packet to verify
    /// @return success True if packet is valid
    function _verifyPacket(bytes32 feedId, OraclePacket calldata packet)
        internal
        view
        virtual
        returns (bool success)
    {
        // Verify deadline
        if (block.timestamp > packet.deadline) return false;

        // Verify feedId matches
        if (feedId != packet.feedId) return false;

        // Recover signer from signature
        address signer = ecrecover(
            keccak256(
                abi.encodePacked(
                    "\x19\x01",
                    DOMAIN_SEPARATOR(),
                    keccak256(
                        abi.encode(
                            ORACLE_PACKET_TYPEHASH,
                            packet.feedId,
                            packet.deadline,
                            keccak256(packet.payload)
                        )
                    )
                )
            ),
            packet.v,
            packet.r,
            packet.s
        );

        // Verify signer is valid and is an active relay
        return (signer != address(0)) && relayRegistry.isActiveRelay(signer);
    }

    /// @notice Get the signer of an oracle packet (without verification)
    /// @param packet The oracle packet
    /// @return signer The recovered signer address
    function getPacketSigner(OraclePacket calldata packet) 
        public 
        view 
        returns (address signer) 
    {
        signer = ecrecover(
            keccak256(
                abi.encodePacked(
                    "\x19\x01",
                    DOMAIN_SEPARATOR(),
                    keccak256(
                        abi.encode(
                            ORACLE_PACKET_TYPEHASH,
                            packet.feedId,
                            packet.deadline,
                            keccak256(packet.payload)
                        )
                    )
                )
            ),
            packet.v,
            packet.r,
            packet.s
        );
    }

    // =========================================== EIP-712 ===========================================

    /// @notice The domain separator used by EIP-712
    function DOMAIN_SEPARATOR() public view virtual returns (bytes32) {
        return block.chainid == INITIAL_CHAIN_ID
            ? INITIAL_DOMAIN_SEPARATOR
            : _computeDomainSeparator();
    }

    /// @notice Computes the domain separator used by EIP-712
    function _computeDomainSeparator() internal view virtual returns (bytes32) {
        return keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256("ShogunOracle"),
                keccak256("1"),
                block.chainid,
                address(this)
            )
        );
    }
}
