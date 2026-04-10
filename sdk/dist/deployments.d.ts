export declare const DEPLOYMENTS: {
    readonly "8453": {
        readonly "TuneCampFactory#TuneCampCheckout": {
            readonly address: "0xb2Ba5A8d07d52B49e98A19e763b8B329e485f564";
            readonly abi: readonly [{
                readonly inputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "constructor";
            }, {
                readonly inputs: readonly [];
                readonly name: "InvalidInitialization";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "NotInitializing";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "owner";
                    readonly type: "address";
                }];
                readonly name: "OwnableInvalidOwner";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }];
                readonly name: "OwnableUnauthorizedAccount";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "ReentrancyGuardReentrantCall";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "token";
                    readonly type: "address";
                }];
                readonly name: "SafeERC20FailedOperation";
                readonly type: "error";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: false;
                    readonly internalType: "uint64";
                    readonly name: "version";
                    readonly type: "uint64";
                }];
                readonly name: "Initialized";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "previousOwner";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "newOwner";
                    readonly type: "address";
                }];
                readonly name: "OwnershipTransferred";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "uint256";
                    readonly name: "trackId";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "enum TuneCampNFT.TokenRole";
                    readonly name: "role";
                    readonly type: "uint8";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "newPriceUSDC";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "newPriceETH";
                    readonly type: "uint256";
                }];
                readonly name: "PriceUpdated";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "artist";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bool";
                    readonly name: "isPro";
                    readonly type: "bool";
                }];
                readonly name: "ProStatusUpdated";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "buyer";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "uint256";
                    readonly name: "trackId";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "enum TuneCampNFT.TokenRole";
                    readonly name: "role";
                    readonly type: "uint8";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "paymentToken";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "totalPaid";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "artistShare";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "platformShare";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "quantity";
                    readonly type: "uint256";
                }];
                readonly name: "Purchase";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "newTreasury";
                    readonly type: "address";
                }];
                readonly name: "TreasuryUpdated";
                readonly type: "event";
            }, {
                readonly inputs: readonly [];
                readonly name: "BPS_DENOMINATOR";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "PLATFORM_FEE_BPS";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "admin";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_nft";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_usdc";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_treasury";
                    readonly type: "address";
                }];
                readonly name: "initialize";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly name: "isProArtist";
                readonly outputs: readonly [{
                    readonly internalType: "bool";
                    readonly name: "";
                    readonly type: "bool";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "nft";
                readonly outputs: readonly [{
                    readonly internalType: "contract TuneCampNFT";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "owner";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "total";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "address";
                    readonly name: "artist";
                    readonly type: "address";
                }];
                readonly name: "previewSplit";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "artistShare";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "platformShare";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "enum TuneCampNFT.TokenRole";
                    readonly name: "";
                    readonly type: "uint8";
                }];
                readonly name: "priceETH";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "enum TuneCampNFT.TokenRole";
                    readonly name: "";
                    readonly type: "uint8";
                }];
                readonly name: "priceUSDC";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "trackId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "enum TuneCampNFT.TokenRole";
                    readonly name: "role";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "quantity";
                    readonly type: "uint256";
                }];
                readonly name: "purchaseWithETH";
                readonly outputs: readonly [];
                readonly stateMutability: "payable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "trackId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "enum TuneCampNFT.TokenRole";
                    readonly name: "role";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "quantity";
                    readonly type: "uint256";
                }];
                readonly name: "purchaseWithUSDC";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "renounceOwnership";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "token";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }];
                readonly name: "rescueERC20";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "trackId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "enum TuneCampNFT.TokenRole";
                    readonly name: "role";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_priceUSDC";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_priceETH";
                    readonly type: "uint256";
                }];
                readonly name: "setPrice";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256[]";
                    readonly name: "trackIds";
                    readonly type: "uint256[]";
                }, {
                    readonly internalType: "enum TuneCampNFT.TokenRole[]";
                    readonly name: "roles";
                    readonly type: "uint8[]";
                }, {
                    readonly internalType: "uint256[]";
                    readonly name: "pricesUSDC";
                    readonly type: "uint256[]";
                }, {
                    readonly internalType: "uint256[]";
                    readonly name: "pricesETH";
                    readonly type: "uint256[]";
                }];
                readonly name: "setPriceBatch";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "artist";
                    readonly type: "address";
                }, {
                    readonly internalType: "bool";
                    readonly name: "status";
                    readonly type: "bool";
                }];
                readonly name: "setProArtist";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_treasury";
                    readonly type: "address";
                }];
                readonly name: "setTreasury";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "newOwner";
                    readonly type: "address";
                }];
                readonly name: "transferOwnership";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "treasury";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "usdc";
                readonly outputs: readonly [{
                    readonly internalType: "contract IERC20";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly stateMutability: "payable";
                readonly type: "receive";
            }];
        };
        readonly "TuneCampFactory#TuneCampNFT": {
            readonly address: "0x3059D4349B47FA57f1B6D0Ee92e695F4E86A826b";
            readonly abi: readonly [{
                readonly inputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "constructor";
            }, {
                readonly inputs: readonly [];
                readonly name: "AccessControlBadConfirmation";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "neededRole";
                    readonly type: "bytes32";
                }];
                readonly name: "AccessControlUnauthorizedAccount";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "sender";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "balance";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "needed";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "tokenId";
                    readonly type: "uint256";
                }];
                readonly name: "ERC1155InsufficientBalance";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "approver";
                    readonly type: "address";
                }];
                readonly name: "ERC1155InvalidApprover";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "idsLength";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "valuesLength";
                    readonly type: "uint256";
                }];
                readonly name: "ERC1155InvalidArrayLength";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "operator";
                    readonly type: "address";
                }];
                readonly name: "ERC1155InvalidOperator";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "receiver";
                    readonly type: "address";
                }];
                readonly name: "ERC1155InvalidReceiver";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "sender";
                    readonly type: "address";
                }];
                readonly name: "ERC1155InvalidSender";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "operator";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "owner";
                    readonly type: "address";
                }];
                readonly name: "ERC1155MissingApprovalForAll";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "InvalidInitialization";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "NotInitializing";
                readonly type: "error";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "operator";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bool";
                    readonly name: "approved";
                    readonly type: "bool";
                }];
                readonly name: "ApprovalForAll";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: false;
                    readonly internalType: "uint64";
                    readonly name: "version";
                    readonly type: "uint64";
                }];
                readonly name: "Initialized";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "role";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "previousAdminRole";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "newAdminRole";
                    readonly type: "bytes32";
                }];
                readonly name: "RoleAdminChanged";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "role";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "sender";
                    readonly type: "address";
                }];
                readonly name: "RoleGranted";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "role";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "sender";
                    readonly type: "address";
                }];
                readonly name: "RoleRevoked";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "to";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "uint256";
                    readonly name: "trackId";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "enum TuneCampNFT.TokenRole";
                    readonly name: "role";
                    readonly type: "uint8";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "tokenId";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }];
                readonly name: "TrackMinted";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "uint256";
                    readonly name: "trackId";
                    readonly type: "uint256";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "artist";
                    readonly type: "address";
                }];
                readonly name: "TrackRegistered";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "operator";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "from";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "to";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256[]";
                    readonly name: "ids";
                    readonly type: "uint256[]";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256[]";
                    readonly name: "values";
                    readonly type: "uint256[]";
                }];
                readonly name: "TransferBatch";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "operator";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "from";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "to";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "id";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "value";
                    readonly type: "uint256";
                }];
                readonly name: "TransferSingle";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "value";
                    readonly type: "string";
                }, {
                    readonly indexed: true;
                    readonly internalType: "uint256";
                    readonly name: "id";
                    readonly type: "uint256";
                }];
                readonly name: "URI";
                readonly type: "event";
            }, {
                readonly inputs: readonly [];
                readonly name: "ARTIST_ROLE";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "DEFAULT_ADMIN_ROLE";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "MINTER_ROLE";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "id";
                    readonly type: "uint256";
                }];
                readonly name: "balanceOf";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address[]";
                    readonly name: "accounts";
                    readonly type: "address[]";
                }, {
                    readonly internalType: "uint256[]";
                    readonly name: "ids";
                    readonly type: "uint256[]";
                }];
                readonly name: "balanceOfBatch";
                readonly outputs: readonly [{
                    readonly internalType: "uint256[]";
                    readonly name: "";
                    readonly type: "uint256[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "tokenId";
                    readonly type: "uint256";
                }];
                readonly name: "decodeTokenId";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "trackId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "enum TuneCampNFT.TokenRole";
                    readonly name: "role";
                    readonly type: "uint8";
                }];
                readonly stateMutability: "pure";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "trackId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "enum TuneCampNFT.TokenRole";
                    readonly name: "role";
                    readonly type: "uint8";
                }];
                readonly name: "encodeTokenId";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "pure";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "role";
                    readonly type: "bytes32";
                }];
                readonly name: "getRoleAdmin";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "role";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }];
                readonly name: "grantRole";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "role";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }];
                readonly name: "hasRole";
                readonly outputs: readonly [{
                    readonly internalType: "bool";
                    readonly name: "";
                    readonly type: "bool";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "admin";
                    readonly type: "address";
                }, {
                    readonly internalType: "string";
                    readonly name: "baseMetadataURI_";
                    readonly type: "string";
                }];
                readonly name: "initialize";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "operator";
                    readonly type: "address";
                }];
                readonly name: "isApprovedForAll";
                readonly outputs: readonly [{
                    readonly internalType: "bool";
                    readonly name: "";
                    readonly type: "bool";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "enum TuneCampNFT.TokenRole";
                    readonly name: "";
                    readonly type: "uint8";
                }];
                readonly name: "maxSupply";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "to";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "trackId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "enum TuneCampNFT.TokenRole";
                    readonly name: "role";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }];
                readonly name: "mint";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "enum TuneCampNFT.TokenRole";
                    readonly name: "";
                    readonly type: "uint8";
                }];
                readonly name: "mintedSupply";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "trackId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "address";
                    readonly name: "artist";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "maxLicense";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "maxOwnership";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "maxCollectible";
                    readonly type: "uint256";
                }];
                readonly name: "registerTrack";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "role";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "address";
                    readonly name: "callerConfirmation";
                    readonly type: "address";
                }];
                readonly name: "renounceRole";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "role";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }];
                readonly name: "revokeRole";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "from";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "to";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256[]";
                    readonly name: "ids";
                    readonly type: "uint256[]";
                }, {
                    readonly internalType: "uint256[]";
                    readonly name: "values";
                    readonly type: "uint256[]";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "data";
                    readonly type: "bytes";
                }];
                readonly name: "safeBatchTransferFrom";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "from";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "to";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "id";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "value";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "data";
                    readonly type: "bytes";
                }];
                readonly name: "safeTransferFrom";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "operator";
                    readonly type: "address";
                }, {
                    readonly internalType: "bool";
                    readonly name: "approved";
                    readonly type: "bool";
                }];
                readonly name: "setApprovalForAll";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "newBaseURI";
                    readonly type: "string";
                }];
                readonly name: "setBaseURI";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "tokenId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "string";
                    readonly name: "newURI";
                    readonly type: "string";
                }];
                readonly name: "setTokenURI";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes4";
                    readonly name: "interfaceId";
                    readonly type: "bytes4";
                }];
                readonly name: "supportsInterface";
                readonly outputs: readonly [{
                    readonly internalType: "bool";
                    readonly name: "";
                    readonly type: "bool";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "trackArtist";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "tokenId";
                    readonly type: "uint256";
                }];
                readonly name: "uri";
                readonly outputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "";
                    readonly type: "string";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }];
        };
        readonly "TuneCampFactory#TuneCampFactory": {
            readonly address: "0xc9b5A11cF6E8D454f6C0d81c319DE59c4D29cAbd";
            readonly abi: readonly [{
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_usdc";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_nftLogic";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_checkoutLogic";
                    readonly type: "address";
                }];
                readonly stateMutability: "nonpayable";
                readonly type: "constructor";
            }, {
                readonly inputs: readonly [];
                readonly name: "FailedDeployment";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "balance";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "needed";
                    readonly type: "uint256";
                }];
                readonly name: "InsufficientBalance";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "owner";
                    readonly type: "address";
                }];
                readonly name: "OwnableInvalidOwner";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }];
                readonly name: "OwnableUnauthorizedAccount";
                readonly type: "error";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "uint256";
                    readonly name: "instanceId";
                    readonly type: "uint256";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "admin";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "address";
                    readonly name: "nft";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "address";
                    readonly name: "checkout";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "name";
                    readonly type: "string";
                }];
                readonly name: "InstanceDeployed";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "previousOwner";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "newOwner";
                    readonly type: "address";
                }];
                readonly name: "OwnershipTransferred";
                readonly type: "event";
            }, {
                readonly inputs: readonly [];
                readonly name: "checkoutImplementation";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "instanceName";
                    readonly type: "string";
                }, {
                    readonly internalType: "string";
                    readonly name: "baseMetadataURI";
                    readonly type: "string";
                }, {
                    readonly internalType: "address";
                    readonly name: "treasury";
                    readonly type: "address";
                }];
                readonly name: "deployInstance";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "nftAddress";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "checkoutAddress";
                    readonly type: "address";
                }];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "instanceId";
                    readonly type: "uint256";
                }];
                readonly name: "getInstance";
                readonly outputs: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "address";
                        readonly name: "admin";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "nft";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "checkout";
                        readonly type: "address";
                    }, {
                        readonly internalType: "string";
                        readonly name: "name";
                        readonly type: "string";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "deployedAt";
                        readonly type: "uint256";
                    }];
                    readonly internalType: "struct TuneCampFactory.Instance";
                    readonly name: "";
                    readonly type: "tuple";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "nft";
                    readonly type: "address";
                }];
                readonly name: "getInstanceByNFT";
                readonly outputs: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "address";
                        readonly name: "admin";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "nft";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "checkout";
                        readonly type: "address";
                    }, {
                        readonly internalType: "string";
                        readonly name: "name";
                        readonly type: "string";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "deployedAt";
                        readonly type: "uint256";
                    }];
                    readonly internalType: "struct TuneCampFactory.Instance";
                    readonly name: "";
                    readonly type: "tuple";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "instanceCount";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly name: "instanceIndexByNFT";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "instances";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "admin";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "nft";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "checkout";
                    readonly type: "address";
                }, {
                    readonly internalType: "string";
                    readonly name: "name";
                    readonly type: "string";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "deployedAt";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "admin";
                    readonly type: "address";
                }];
                readonly name: "instancesOf";
                readonly outputs: readonly [{
                    readonly internalType: "uint256[]";
                    readonly name: "";
                    readonly type: "uint256[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "nftImplementation";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "owner";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "renounceOwnership";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_usdc";
                    readonly type: "address";
                }];
                readonly name: "setUSDC";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "newOwner";
                    readonly type: "address";
                }];
                readonly name: "transferOwnership";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "usdcAddress";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }];
        };
        readonly "Stealth#PaymentForwarder": {
            readonly address: "0x0bE89b593A6eF044B25802195C634559a7FcBbdF";
            readonly abi: readonly [{
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_toll";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "address";
                    readonly name: "_tollCollector";
                    readonly type: "address";
                }, {
                    readonly internalType: "address payable";
                    readonly name: "_tollReceiver";
                    readonly type: "address";
                }];
                readonly stateMutability: "nonpayable";
                readonly type: "constructor";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "owner";
                    readonly type: "address";
                }];
                readonly name: "OwnableInvalidOwner";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }];
                readonly name: "OwnableUnauthorizedAccount";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "token";
                    readonly type: "address";
                }];
                readonly name: "SafeERC20FailedOperation";
                readonly type: "error";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "receiver";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "token";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bytes32";
                    readonly name: "pkx";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bytes32";
                    readonly name: "ciphertext";
                    readonly type: "bytes32";
                }];
                readonly name: "Announcement";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "previousOwner";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "newOwner";
                    readonly type: "address";
                }];
                readonly name: "OwnershipTransferred";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "receiver";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "acceptor";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "token";
                    readonly type: "address";
                }];
                readonly name: "TokenWithdrawal";
                readonly type: "event";
            }, {
                readonly inputs: readonly [];
                readonly name: "collectTolls";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "owner";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "renounceOwnership";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address payable";
                    readonly name: "_receiver";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_tollCommitment";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_pkx";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_ciphertext";
                    readonly type: "bytes32";
                }];
                readonly name: "sendEth";
                readonly outputs: readonly [];
                readonly stateMutability: "payable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_receiver";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_tokenAddr";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_amount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_pkx";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_ciphertext";
                    readonly type: "bytes32";
                }];
                readonly name: "sendToken";
                readonly outputs: readonly [];
                readonly stateMutability: "payable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_newToll";
                    readonly type: "uint256";
                }];
                readonly name: "setToll";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_newTollCollector";
                    readonly type: "address";
                }];
                readonly name: "setTollCollector";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address payable";
                    readonly name: "_newTollReceiver";
                    readonly type: "address";
                }];
                readonly name: "setTollReceiver";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly name: "tokenPayments";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "toll";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "tollCollector";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "tollReceiver";
                readonly outputs: readonly [{
                    readonly internalType: "address payable";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "newOwner";
                    readonly type: "address";
                }];
                readonly name: "transferOwnership";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_acceptor";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_tokenAddr";
                    readonly type: "address";
                }];
                readonly name: "withdrawToken";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_acceptor";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_tokenAddr";
                    readonly type: "address";
                }, {
                    readonly internalType: "contract IPaymentForwarderHookReceiver";
                    readonly name: "_hook";
                    readonly type: "address";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "_data";
                    readonly type: "bytes";
                }];
                readonly name: "withdrawTokenAndCall";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_stealthAddr";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_acceptor";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_tokenAddr";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_sponsor";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_sponsorFee";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "contract IPaymentForwarderHookReceiver";
                    readonly name: "_hook";
                    readonly type: "address";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "_data";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "uint8";
                    readonly name: "_v";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_r";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_s";
                    readonly type: "bytes32";
                }];
                readonly name: "withdrawTokenAndCallOnBehalf";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_stealthAddr";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_acceptor";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_tokenAddr";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_sponsor";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_sponsorFee";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint8";
                    readonly name: "_v";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_r";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_s";
                    readonly type: "bytes32";
                }];
                readonly name: "withdrawTokenOnBehalf";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }];
        };
        readonly "Stealth#StealthKeyRegistry": {
            readonly address: "0x9aD8B62765C528c168d704b89e50069876a29F2C";
            readonly abi: readonly [{
                readonly inputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "constructor";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "registrant";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "viewingPublicKey";
                    readonly type: "string";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "spendingPublicKey";
                    readonly type: "string";
                }];
                readonly name: "StealthKeysRegistered";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "stealthAddress";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "sender";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "ephemeralPublicKey";
                    readonly type: "string";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "encryptedRandomNumber";
                    readonly type: "string";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "recipientPublicKey";
                    readonly type: "string";
                }];
                readonly name: "StealthMetadataRegistered";
                readonly type: "event";
            }, {
                readonly inputs: readonly [];
                readonly name: "DOMAIN_SEPARATOR";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "STEALTHKEYS_TYPEHASH";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_registrant";
                    readonly type: "address";
                }];
                readonly name: "getStealthKeys";
                readonly outputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "viewingPublicKey";
                    readonly type: "string";
                }, {
                    readonly internalType: "string";
                    readonly name: "spendingPublicKey";
                    readonly type: "string";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly name: "nonces";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "_viewingPublicKey";
                    readonly type: "string";
                }, {
                    readonly internalType: "string";
                    readonly name: "_spendingPublicKey";
                    readonly type: "string";
                }];
                readonly name: "registerStealthKeys";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_registrant";
                    readonly type: "address";
                }, {
                    readonly internalType: "string";
                    readonly name: "_viewingPublicKey";
                    readonly type: "string";
                }, {
                    readonly internalType: "string";
                    readonly name: "_spendingPublicKey";
                    readonly type: "string";
                }, {
                    readonly internalType: "uint8";
                    readonly name: "_v";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_r";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_s";
                    readonly type: "bytes32";
                }];
                readonly name: "registerStealthKeysOnBehalf";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_stealthAddress";
                    readonly type: "address";
                }, {
                    readonly internalType: "string";
                    readonly name: "_ephemeralPublicKey";
                    readonly type: "string";
                }, {
                    readonly internalType: "string";
                    readonly name: "_encryptedRandomNumber";
                    readonly type: "string";
                }, {
                    readonly internalType: "string";
                    readonly name: "_recipientPublicKey";
                    readonly type: "string";
                }];
                readonly name: "registerStealthMetadata";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }];
        };
    };
    readonly "84532": {
        readonly "DataPostRegistry#DataPostRegistry": {
            readonly address: "0x0fcAB612E9DD123ECD4aC3E50F42da77da3cf421";
            readonly abi: readonly [{
                readonly inputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "constructor";
            }, {
                readonly inputs: readonly [];
                readonly name: "EnforcedPause";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "ExpectedPause";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "InvalidDescription";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "InvalidPrice";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "NotPostOwner";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "owner";
                    readonly type: "address";
                }];
                readonly name: "OwnableInvalidOwner";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }];
                readonly name: "OwnableUnauthorizedAccount";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "PostAlreadyExists";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "PostNotFound";
                readonly type: "error";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "postId";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "seller";
                    readonly type: "address";
                }];
                readonly name: "DataPostDeactivated";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "postId";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "seller";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bytes32";
                    readonly name: "proofHash";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "encryptedDataHash";
                    readonly type: "string";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "description";
                    readonly type: "string";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "category";
                    readonly type: "string";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "priceUSDC";
                    readonly type: "uint256";
                }];
                readonly name: "DataPostPublished";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "postId";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "newDescription";
                    readonly type: "string";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "newPrice";
                    readonly type: "uint256";
                }];
                readonly name: "DataPostUpdated";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "previousOwner";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "newOwner";
                    readonly type: "address";
                }];
                readonly name: "OwnershipTransferred";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: false;
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }];
                readonly name: "Paused";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: false;
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }];
                readonly name: "Unpaused";
                readonly type: "event";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "activePosts";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "_postId";
                    readonly type: "bytes32";
                }];
                readonly name: "deactivatePost";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "getActivePostCount";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "getActivePosts";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32[]";
                    readonly name: "";
                    readonly type: "bytes32[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "_postId";
                    readonly type: "bytes32";
                }];
                readonly name: "getPost";
                readonly outputs: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "bytes32";
                        readonly name: "postId";
                        readonly type: "bytes32";
                    }, {
                        readonly internalType: "address";
                        readonly name: "seller";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "proofHash";
                        readonly type: "bytes32";
                    }, {
                        readonly internalType: "string";
                        readonly name: "encryptedDataHash";
                        readonly type: "string";
                    }, {
                        readonly internalType: "string";
                        readonly name: "description";
                        readonly type: "string";
                    }, {
                        readonly internalType: "string";
                        readonly name: "category";
                        readonly type: "string";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "priceUSDC";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "createdAt";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "active";
                        readonly type: "bool";
                    }];
                    readonly internalType: "struct DataPostRegistry.DataPost";
                    readonly name: "";
                    readonly type: "tuple";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "_category";
                    readonly type: "string";
                }];
                readonly name: "getPostsByCategory";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32[]";
                    readonly name: "";
                    readonly type: "bytes32[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_seller";
                    readonly type: "address";
                }];
                readonly name: "getPostsBySeller";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32[]";
                    readonly name: "";
                    readonly type: "bytes32[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "owner";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "pause";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "paused";
                readonly outputs: readonly [{
                    readonly internalType: "bool";
                    readonly name: "";
                    readonly type: "bool";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly name: "posts";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "postId";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "address";
                    readonly name: "seller";
                    readonly type: "address";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "proofHash";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "string";
                    readonly name: "encryptedDataHash";
                    readonly type: "string";
                }, {
                    readonly internalType: "string";
                    readonly name: "description";
                    readonly type: "string";
                }, {
                    readonly internalType: "string";
                    readonly name: "category";
                    readonly type: "string";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "priceUSDC";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "createdAt";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bool";
                    readonly name: "active";
                    readonly type: "bool";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "";
                    readonly type: "string";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "postsByCategory";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "postsBySeller";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "_proofHash";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "string";
                    readonly name: "_encryptedDataHash";
                    readonly type: "string";
                }, {
                    readonly internalType: "string";
                    readonly name: "_description";
                    readonly type: "string";
                }, {
                    readonly internalType: "string";
                    readonly name: "_category";
                    readonly type: "string";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_priceUSDC";
                    readonly type: "uint256";
                }];
                readonly name: "publishPost";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "renounceOwnership";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "totalPosts";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "newOwner";
                    readonly type: "address";
                }];
                readonly name: "transferOwnership";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "unpause";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "_postId";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "string";
                    readonly name: "_newDescription";
                    readonly type: "string";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_newPrice";
                    readonly type: "uint256";
                }];
                readonly name: "updatePost";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }];
        };
        readonly "RelayRegistry#ShogunRelayRegistry": {
            readonly address: "0x8B88258923bad2d634e533Cb6405d4022CfF320f";
            readonly abi: readonly [{
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_stakingToken";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_minStake";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_unstakingDelay";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "address";
                    readonly name: "_treasury";
                    readonly type: "address";
                }];
                readonly stateMutability: "nonpayable";
                readonly type: "constructor";
            }, {
                readonly inputs: readonly [];
                readonly name: "EnforcedPause";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "ExpectedPause";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "InsufficientGriefingCost";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "InsufficientStake";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "InvalidAmount";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "InvalidEndpoint";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "InvalidEpub";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "InvalidPubkey";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "InvalidSlashAmount";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "owner";
                    readonly type: "address";
                }];
                readonly name: "OwnableInvalidOwner";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }];
                readonly name: "OwnableUnauthorizedAccount";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "ReentrancyGuardReentrantCall";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "RelayAlreadyRegistered";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "RelayAlreadySlashed";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "RelayNotActive";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "RelayNotRegistered";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "token";
                    readonly type: "address";
                }];
                readonly name: "SafeERC20FailedOperation";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "UnstakingDelayNotPassed";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "UnstakingNotRequested";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "UserNotRegistered";
                readonly type: "error";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "previousOwner";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "newOwner";
                    readonly type: "address";
                }];
                readonly name: "OwnershipTransferred";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: false;
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }];
                readonly name: "Paused";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "relay";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "reason";
                    readonly type: "string";
                }];
                readonly name: "RelayDeactivated";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "relay";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bytes";
                    readonly name: "pubkey";
                    readonly type: "bytes";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bytes";
                    readonly name: "epub";
                    readonly type: "bytes";
                }];
                readonly name: "RelayEncryptionKeysUpdated";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "relay";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "owner";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "endpoint";
                    readonly type: "string";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "stakedAmount";
                    readonly type: "uint256";
                }];
                readonly name: "RelayRegistered";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "reportId";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "relay";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "reporter";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "cost";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "reason";
                    readonly type: "string";
                }];
                readonly name: "RelaySlashed";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "relay";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "newEndpoint";
                    readonly type: "string";
                }];
                readonly name: "RelayUpdated";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "relay";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "newTotal";
                    readonly type: "uint256";
                }];
                readonly name: "StakeIncreased";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "relay";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }];
                readonly name: "StakeWithdrawn";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: false;
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }];
                readonly name: "Unpaused";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "relay";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "availableAt";
                    readonly type: "uint256";
                }];
                readonly name: "UnstakeRequested";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "user";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bytes";
                    readonly name: "pubkey";
                    readonly type: "bytes";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bytes";
                    readonly name: "epub";
                    readonly type: "bytes";
                }];
                readonly name: "UserKeysUpdated";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "user";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bytes";
                    readonly name: "pubkey";
                    readonly type: "bytes";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bytes";
                    readonly name: "epub";
                    readonly type: "bytes";
                }];
                readonly name: "UserRegistered";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "reportId";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "user";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "reporter";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "cost";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "reason";
                    readonly type: "string";
                }];
                readonly name: "UserSlashed";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "user";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "totalStake";
                    readonly type: "uint256";
                }];
                readonly name: "UserStakeDeposited";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "user";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "remainingStake";
                    readonly type: "uint256";
                }];
                readonly name: "UserStakeWithdrawn";
                readonly type: "event";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "activeParticipants";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "activeRelays";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "defaultGriefingRatio";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_amount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_griefingRatio";
                    readonly type: "uint256";
                }];
                readonly name: "depositUserStake";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_token";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_amount";
                    readonly type: "uint256";
                }];
                readonly name: "emergencyWithdraw";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "getActiveRelayCount";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "getActiveRelays";
                readonly outputs: readonly [{
                    readonly internalType: "address[]";
                    readonly name: "";
                    readonly type: "address[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "getActiveUserCount";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "getActiveUsers";
                readonly outputs: readonly [{
                    readonly internalType: "address[]";
                    readonly name: "";
                    readonly type: "address[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_relay";
                    readonly type: "address";
                }];
                readonly name: "getRelayInfo";
                readonly outputs: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "address";
                        readonly name: "owner";
                        readonly type: "address";
                    }, {
                        readonly internalType: "string";
                        readonly name: "endpoint";
                        readonly type: "string";
                    }, {
                        readonly internalType: "bytes";
                        readonly name: "pubkey";
                        readonly type: "bytes";
                    }, {
                        readonly internalType: "bytes";
                        readonly name: "epub";
                        readonly type: "bytes";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "stakedAmount";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "registeredAt";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "updatedAt";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "unstakeRequestedAt";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "enum ShogunRelayRegistry.ParticipantStatus";
                        readonly name: "status";
                        readonly type: "uint8";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "totalSlashed";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "griefingRatio";
                        readonly type: "uint256";
                    }];
                    readonly internalType: "struct ShogunRelayRegistry.ParticipantInfo";
                    readonly name: "";
                    readonly type: "tuple";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_user";
                    readonly type: "address";
                }];
                readonly name: "getUserInfo";
                readonly outputs: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "address";
                        readonly name: "owner";
                        readonly type: "address";
                    }, {
                        readonly internalType: "string";
                        readonly name: "endpoint";
                        readonly type: "string";
                    }, {
                        readonly internalType: "bytes";
                        readonly name: "pubkey";
                        readonly type: "bytes";
                    }, {
                        readonly internalType: "bytes";
                        readonly name: "epub";
                        readonly type: "bytes";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "stakedAmount";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "registeredAt";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "updatedAt";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "unstakeRequestedAt";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "enum ShogunRelayRegistry.ParticipantStatus";
                        readonly name: "status";
                        readonly type: "uint8";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "totalSlashed";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "griefingRatio";
                        readonly type: "uint256";
                    }];
                    readonly internalType: "struct ShogunRelayRegistry.ParticipantInfo";
                    readonly name: "";
                    readonly type: "tuple";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_relay";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_slashAmount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "string";
                    readonly name: "_reason";
                    readonly type: "string";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_griefingRatio";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_dealId";
                    readonly type: "bytes32";
                }];
                readonly name: "grief";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_user";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_slashAmount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "string";
                    readonly name: "_reason";
                    readonly type: "string";
                }];
                readonly name: "griefUser";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_amount";
                    readonly type: "uint256";
                }];
                readonly name: "increaseStake";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_relay";
                    readonly type: "address";
                }];
                readonly name: "isActiveRelay";
                readonly outputs: readonly [{
                    readonly internalType: "bool";
                    readonly name: "";
                    readonly type: "bool";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "minStake";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "owner";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly name: "participants";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "owner";
                    readonly type: "address";
                }, {
                    readonly internalType: "string";
                    readonly name: "endpoint";
                    readonly type: "string";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "pubkey";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "epub";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "stakedAmount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "registeredAt";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "updatedAt";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "unstakeRequestedAt";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "enum ShogunRelayRegistry.ParticipantStatus";
                    readonly name: "status";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "totalSlashed";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "griefingRatio";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "pause";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "paused";
                readonly outputs: readonly [{
                    readonly internalType: "bool";
                    readonly name: "";
                    readonly type: "bool";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "_endpoint";
                    readonly type: "string";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "_pubkey";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "_epub";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_stakeAmount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_griefingRatio";
                    readonly type: "uint256";
                }];
                readonly name: "registerRelay";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes";
                    readonly name: "_pubkey";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "_epub";
                    readonly type: "bytes";
                }];
                readonly name: "registerUser";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "renounceOwnership";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "requestUnstake";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_defaultRatio";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_stakedRatio";
                    readonly type: "uint256";
                }];
                readonly name: "setGriefingRatios";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_minStake";
                    readonly type: "uint256";
                }];
                readonly name: "setMinStake";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_tokenRegistry";
                    readonly type: "address";
                }];
                readonly name: "setTokenRegistry";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_treasury";
                    readonly type: "address";
                }];
                readonly name: "setTreasury";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_delay";
                    readonly type: "uint256";
                }];
                readonly name: "setUnstakingDelay";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly name: "slashReports";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "reportId";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "address";
                    readonly name: "reporter";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "relay";
                    readonly type: "address";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "dealId";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "string";
                    readonly name: "reason";
                    readonly type: "string";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "cost";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "timestamp";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "stakedClientGriefingRatio";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "stakingToken";
                readonly outputs: readonly [{
                    readonly internalType: "contract IERC20";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "tokenRegistry";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "totalReports";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "newOwner";
                    readonly type: "address";
                }];
                readonly name: "transferOwnership";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "treasury";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "unpause";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "unstakingDelay";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "_newEndpoint";
                    readonly type: "string";
                }];
                readonly name: "updateRelay";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes";
                    readonly name: "_pubkey";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "_epub";
                    readonly type: "bytes";
                }];
                readonly name: "updateRelayEncryptionKeys";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes";
                    readonly name: "_pubkey";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "_epub";
                    readonly type: "bytes";
                }];
                readonly name: "updateUserKeys";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "withdrawStake";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_amount";
                    readonly type: "uint256";
                }];
                readonly name: "withdrawUserStake";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }];
        };
        readonly "DeployProtocol#DataSaleEscrowFactory": {
            readonly address: "0xFB1cFB380772b4DEE0b71a9eBe21E9a873ED932D";
            readonly abi: readonly [{
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_paymentToken";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_registry";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_postRegistry";
                    readonly type: "address";
                }];
                readonly stateMutability: "nonpayable";
                readonly type: "constructor";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "escrow";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "postId";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "seller";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "address";
                    readonly name: "buyer";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "priceUSDC";
                    readonly type: "uint256";
                }];
                readonly name: "EscrowCreated";
                readonly type: "event";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "_postId";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "address";
                    readonly name: "_seller";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_countdownDuration";
                    readonly type: "uint256";
                }];
                readonly name: "createEscrow";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "escrow";
                    readonly type: "address";
                }];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "escrows";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "escrowsByBuyer";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "escrowsByPost";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "escrowsBySeller";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "getAllEscrows";
                readonly outputs: readonly [{
                    readonly internalType: "address[]";
                    readonly name: "";
                    readonly type: "address[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "getEscrowCount";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_buyer";
                    readonly type: "address";
                }];
                readonly name: "getEscrowsByBuyer";
                readonly outputs: readonly [{
                    readonly internalType: "address[]";
                    readonly name: "";
                    readonly type: "address[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "_postId";
                    readonly type: "bytes32";
                }];
                readonly name: "getEscrowsByPost";
                readonly outputs: readonly [{
                    readonly internalType: "address[]";
                    readonly name: "";
                    readonly type: "address[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_seller";
                    readonly type: "address";
                }];
                readonly name: "getEscrowsBySeller";
                readonly outputs: readonly [{
                    readonly internalType: "address[]";
                    readonly name: "";
                    readonly type: "address[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "implementation";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "template";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }];
        };
        readonly "Stealth#PaymentForwarder": {
            readonly address: "0xDF64fFB593AE0bEA06F35AD80d5097E18ee903B1";
            readonly abi: readonly [{
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_toll";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "address";
                    readonly name: "_tollCollector";
                    readonly type: "address";
                }, {
                    readonly internalType: "address payable";
                    readonly name: "_tollReceiver";
                    readonly type: "address";
                }];
                readonly stateMutability: "nonpayable";
                readonly type: "constructor";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "owner";
                    readonly type: "address";
                }];
                readonly name: "OwnableInvalidOwner";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "account";
                    readonly type: "address";
                }];
                readonly name: "OwnableUnauthorizedAccount";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "token";
                    readonly type: "address";
                }];
                readonly name: "SafeERC20FailedOperation";
                readonly type: "error";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "receiver";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "token";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bytes32";
                    readonly name: "pkx";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bytes32";
                    readonly name: "ciphertext";
                    readonly type: "bytes32";
                }];
                readonly name: "Announcement";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "previousOwner";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "newOwner";
                    readonly type: "address";
                }];
                readonly name: "OwnershipTransferred";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "receiver";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "acceptor";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "token";
                    readonly type: "address";
                }];
                readonly name: "TokenWithdrawal";
                readonly type: "event";
            }, {
                readonly inputs: readonly [];
                readonly name: "collectTolls";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "owner";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "renounceOwnership";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address payable";
                    readonly name: "_receiver";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_tollCommitment";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_pkx";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_ciphertext";
                    readonly type: "bytes32";
                }];
                readonly name: "sendEth";
                readonly outputs: readonly [];
                readonly stateMutability: "payable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_receiver";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_tokenAddr";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_amount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_pkx";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_ciphertext";
                    readonly type: "bytes32";
                }];
                readonly name: "sendToken";
                readonly outputs: readonly [];
                readonly stateMutability: "payable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_newToll";
                    readonly type: "uint256";
                }];
                readonly name: "setToll";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_newTollCollector";
                    readonly type: "address";
                }];
                readonly name: "setTollCollector";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address payable";
                    readonly name: "_newTollReceiver";
                    readonly type: "address";
                }];
                readonly name: "setTollReceiver";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly name: "tokenPayments";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "toll";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "tollCollector";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "tollReceiver";
                readonly outputs: readonly [{
                    readonly internalType: "address payable";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "newOwner";
                    readonly type: "address";
                }];
                readonly name: "transferOwnership";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_acceptor";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_tokenAddr";
                    readonly type: "address";
                }];
                readonly name: "withdrawToken";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_acceptor";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_tokenAddr";
                    readonly type: "address";
                }, {
                    readonly internalType: "contract IPaymentForwarderHookReceiver";
                    readonly name: "_hook";
                    readonly type: "address";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "_data";
                    readonly type: "bytes";
                }];
                readonly name: "withdrawTokenAndCall";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_stealthAddr";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_acceptor";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_tokenAddr";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_sponsor";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_sponsorFee";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "contract IPaymentForwarderHookReceiver";
                    readonly name: "_hook";
                    readonly type: "address";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "_data";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "uint8";
                    readonly name: "_v";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_r";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_s";
                    readonly type: "bytes32";
                }];
                readonly name: "withdrawTokenAndCallOnBehalf";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_stealthAddr";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_acceptor";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_tokenAddr";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_sponsor";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_sponsorFee";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint8";
                    readonly name: "_v";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_r";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_s";
                    readonly type: "bytes32";
                }];
                readonly name: "withdrawTokenOnBehalf";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }];
        };
        readonly "Stealth#StealthKeyRegistry": {
            readonly address: "0xCF6429c227F1a2912Bcb98405CAa8b436c18Cb55";
            readonly abi: readonly [{
                readonly inputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "constructor";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "registrant";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "viewingPublicKey";
                    readonly type: "string";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "spendingPublicKey";
                    readonly type: "string";
                }];
                readonly name: "StealthKeysRegistered";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "stealthAddress";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "sender";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "ephemeralPublicKey";
                    readonly type: "string";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "encryptedRandomNumber";
                    readonly type: "string";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "recipientPublicKey";
                    readonly type: "string";
                }];
                readonly name: "StealthMetadataRegistered";
                readonly type: "event";
            }, {
                readonly inputs: readonly [];
                readonly name: "DOMAIN_SEPARATOR";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "STEALTHKEYS_TYPEHASH";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_registrant";
                    readonly type: "address";
                }];
                readonly name: "getStealthKeys";
                readonly outputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "viewingPublicKey";
                    readonly type: "string";
                }, {
                    readonly internalType: "string";
                    readonly name: "spendingPublicKey";
                    readonly type: "string";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly name: "nonces";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "_viewingPublicKey";
                    readonly type: "string";
                }, {
                    readonly internalType: "string";
                    readonly name: "_spendingPublicKey";
                    readonly type: "string";
                }];
                readonly name: "registerStealthKeys";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_registrant";
                    readonly type: "address";
                }, {
                    readonly internalType: "string";
                    readonly name: "_viewingPublicKey";
                    readonly type: "string";
                }, {
                    readonly internalType: "string";
                    readonly name: "_spendingPublicKey";
                    readonly type: "string";
                }, {
                    readonly internalType: "uint8";
                    readonly name: "_v";
                    readonly type: "uint8";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_r";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_s";
                    readonly type: "bytes32";
                }];
                readonly name: "registerStealthKeysOnBehalf";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_stealthAddress";
                    readonly type: "address";
                }, {
                    readonly internalType: "string";
                    readonly name: "_ephemeralPublicKey";
                    readonly type: "string";
                }, {
                    readonly internalType: "string";
                    readonly name: "_encryptedRandomNumber";
                    readonly type: "string";
                }, {
                    readonly internalType: "string";
                    readonly name: "_recipientPublicKey";
                    readonly type: "string";
                }];
                readonly name: "registerStealthMetadata";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }];
        };
    };
};
export type Deployments = typeof DEPLOYMENTS;
//# sourceMappingURL=deployments.d.ts.map