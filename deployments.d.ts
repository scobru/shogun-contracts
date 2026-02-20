export declare const DEPLOYMENTS: {
    readonly "84532": {
        readonly "DataPostRegistry#DataPostRegistry": {
            readonly address: "0x609e5De69B764e7A62aa28C97eC0162BA8Fb6aF2";
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
            readonly address: "0xf5D5561C84B4Dc8676D4223AF3188d40DA42669B";
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
            readonly address: "0xa9a39816b4c6EF46434892AA49E760dcEBbC8d01";
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
        readonly "DeployProtocol#StorageDealRegistry": {
            readonly address: "0x25035812952B8a8Ca001B85f4E59919D7569566B";
            readonly abi: readonly [{
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_registry";
                    readonly type: "address";
                }];
                readonly stateMutability: "nonpayable";
                readonly type: "constructor";
            }, {
                readonly inputs: readonly [];
                readonly name: "ClientStakeStillLocked";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "DealAlreadyExists";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "DealAlreadyGriefed";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "DealNotActive";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "DealNotFound";
                readonly type: "error";
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
                readonly name: "InvalidAmount";
                readonly type: "error";
            }, {
                readonly inputs: readonly [];
                readonly name: "NotDealParty";
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
                readonly name: "RelayNotActive";
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
                    readonly internalType: "bytes32";
                    readonly name: "dealId";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "client";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }];
                readonly name: "ClientStakeDeposited";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "dealId";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "client";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }];
                readonly name: "ClientStakeWithdrawn";
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
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "dealId";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "relay";
                    readonly type: "address";
                }];
                readonly name: "StorageDealCompleted";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "dealId";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "relay";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "client";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "cid";
                    readonly type: "string";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "sizeMB";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "priceUSDC";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "expiresAt";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "clientStake";
                    readonly type: "uint256";
                }];
                readonly name: "StorageDealRegistered";
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
                    readonly internalType: "bytes32";
                    readonly name: "_dealId";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_amount";
                    readonly type: "uint256";
                }];
                readonly name: "addClientStake";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "_dealId";
                    readonly type: "bytes32";
                }];
                readonly name: "completeDeal";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly name: "deals";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "dealId";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "address";
                    readonly name: "relay";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "client";
                    readonly type: "address";
                }, {
                    readonly internalType: "string";
                    readonly name: "cid";
                    readonly type: "string";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "sizeMB";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "priceUSDC";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "createdAt";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "expiresAt";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bool";
                    readonly name: "active";
                    readonly type: "bool";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "clientStake";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bool";
                    readonly name: "griefed";
                    readonly type: "bool";
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
                readonly name: "dealsByClient";
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
                readonly name: "dealsByRelay";
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
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_client";
                    readonly type: "address";
                }];
                readonly name: "getClientDeals";
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
                    readonly name: "_dealId";
                    readonly type: "bytes32";
                }];
                readonly name: "getDeal";
                readonly outputs: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "bytes32";
                        readonly name: "dealId";
                        readonly type: "bytes32";
                    }, {
                        readonly internalType: "address";
                        readonly name: "relay";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "client";
                        readonly type: "address";
                    }, {
                        readonly internalType: "string";
                        readonly name: "cid";
                        readonly type: "string";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "sizeMB";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "priceUSDC";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "createdAt";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "expiresAt";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "active";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "clientStake";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "griefed";
                        readonly type: "bool";
                    }];
                    readonly internalType: "struct StorageDealRegistry.StorageDeal";
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
                }];
                readonly name: "getRelayDeals";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32[]";
                    readonly name: "";
                    readonly type: "bytes32[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "getTotalDeals";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "_dealId";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_slashAmount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "string";
                    readonly name: "_reason";
                    readonly type: "string";
                }];
                readonly name: "grief";
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
                    readonly name: "_dealId";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "address";
                    readonly name: "_client";
                    readonly type: "address";
                }, {
                    readonly internalType: "string";
                    readonly name: "_cid";
                    readonly type: "string";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_sizeMB";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_priceUSDC";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_durationDays";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_clientStake";
                    readonly type: "uint256";
                }];
                readonly name: "registerDeal";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "registry";
                readonly outputs: readonly [{
                    readonly internalType: "contract ShogunRelayRegistry";
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
                readonly name: "totalDeals";
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
                    readonly name: "_dealId";
                    readonly type: "bytes32";
                }];
                readonly name: "withdrawClientStake";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }];
        };
    };
    readonly sepolia: {
        readonly "Stealth#StealthPool": {
            readonly address: "0x23475B5BB8EDa9a8F88727e460E4C372E0E05767";
            readonly abi: readonly [{
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_minDepositAmount";
                    readonly type: "uint256";
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
                readonly inputs: readonly [];
                readonly name: "ReentrancyGuardReentrantCall";
                readonly type: "error";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "commitment";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "timestamp";
                    readonly type: "uint256";
                }];
                readonly name: "DepositRegistered";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "oldRoot";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "newRoot";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "timestamp";
                    readonly type: "uint256";
                }];
                readonly name: "MerkleRootUpdated";
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
                    readonly internalType: "bytes32";
                    readonly name: "commitment";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "recipient";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "timestamp";
                    readonly type: "uint256";
                }];
                readonly name: "Withdrawal";
                readonly type: "event";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "allCommitments";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes";
                    readonly name: "_publicKey";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_nonce";
                    readonly type: "bytes32";
                }];
                readonly name: "calculateCommitment";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly stateMutability: "pure";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_amount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "address payable";
                    readonly name: "_recipient";
                    readonly type: "address";
                }];
                readonly name: "emergencyWithdraw";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "_commitment";
                    readonly type: "bytes32";
                }];
                readonly name: "generateMerkleProof";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32[]";
                    readonly name: "proof";
                    readonly type: "bytes32[]";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "index";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "getAllCommitments";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32[]";
                    readonly name: "";
                    readonly type: "bytes32[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "getBalance";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "getCommitmentCount";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "_commitment";
                    readonly type: "bytes32";
                }];
                readonly name: "getRemainingAmount";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "_commitment";
                    readonly type: "bytes32";
                }];
                readonly name: "getTotalDepositAmount";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "_commitment";
                    readonly type: "bytes32";
                }];
                readonly name: "hasRemainingFunds";
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
                    readonly name: "_commitment";
                    readonly type: "bytes32";
                }];
                readonly name: "isCommitmentRegistered";
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
                    readonly name: "_nonce";
                    readonly type: "bytes32";
                }];
                readonly name: "isNonceUsed";
                readonly outputs: readonly [{
                    readonly internalType: "bool";
                    readonly name: "";
                    readonly type: "bool";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "merkleRoot";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "minDepositAmount";
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
                    readonly internalType: "bytes32";
                    readonly name: "_commitment";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_amount";
                    readonly type: "uint256";
                }];
                readonly name: "registerDeposit";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly name: "registeredCommitments";
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
                readonly name: "remainingAmounts";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
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
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly name: "totalDepositAmounts";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "totalDeposits";
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
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly name: "usedNonces";
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
                    readonly name: "_commitment";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "_nonce";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "address payable";
                    readonly name: "_recipient";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_amount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bytes32[]";
                    readonly name: "_merkleProof";
                    readonly type: "bytes32[]";
                }];
                readonly name: "withdraw";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly stateMutability: "payable";
                readonly type: "receive";
            }];
        };
        readonly "Recovery#PairRecovery": {
            readonly address: "0xd005b215275Eed5B48cCCD878E6FaecfD4F49218";
            readonly abi: readonly [{
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "user";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "timestamp";
                    readonly type: "uint256";
                }];
                readonly name: "PairDeleted";
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
                    readonly internalType: "string";
                    readonly name: "username";
                    readonly type: "string";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "timestamp";
                    readonly type: "uint256";
                }];
                readonly name: "PairRegistered";
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
                    readonly internalType: "string";
                    readonly name: "newUsername";
                    readonly type: "string";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "timestamp";
                    readonly type: "uint256";
                }];
                readonly name: "PairUpdated";
                readonly type: "event";
            }, {
                readonly inputs: readonly [];
                readonly name: "deletePair";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "username";
                    readonly type: "string";
                }];
                readonly name: "getAddressByUsername";
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
                    readonly name: "user";
                    readonly type: "address";
                }];
                readonly name: "getPair";
                readonly outputs: readonly [{
                    readonly internalType: "bytes";
                    readonly name: "encryptedPair";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "string";
                    readonly name: "username";
                    readonly type: "string";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "timestamp";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bool";
                    readonly name: "exists";
                    readonly type: "bool";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "username";
                    readonly type: "string";
                }];
                readonly name: "getPairByUsername";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "user";
                    readonly type: "address";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "encryptedPair";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "timestamp";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bool";
                    readonly name: "exists";
                    readonly type: "bool";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "user";
                    readonly type: "address";
                }];
                readonly name: "hasPair";
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
                    readonly name: "username";
                    readonly type: "string";
                }];
                readonly name: "isUsernameTaken";
                readonly outputs: readonly [{
                    readonly internalType: "bool";
                    readonly name: "";
                    readonly type: "bool";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes";
                    readonly name: "encryptedPair";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "string";
                    readonly name: "username";
                    readonly type: "string";
                }];
                readonly name: "registerPair";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes";
                    readonly name: "encryptedPair";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "string";
                    readonly name: "newUsername";
                    readonly type: "string";
                }];
                readonly name: "updatePair";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly name: "userPairs";
                readonly outputs: readonly [{
                    readonly internalType: "bytes";
                    readonly name: "encryptedPair";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "string";
                    readonly name: "username";
                    readonly type: "string";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "timestamp";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bool";
                    readonly name: "exists";
                    readonly type: "bool";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "";
                    readonly type: "string";
                }];
                readonly name: "usernameToAddress";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }];
        };
        readonly "Security#Integrity": {
            readonly address: "0x8D1d8C872564091f1E1666B110D35CE1b50f3EAE";
            readonly abi: readonly [{
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "dataId";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bytes32";
                    readonly name: "dataHash";
                    readonly type: "bytes32";
                }];
                readonly name: "DataRegistered";
                readonly type: "event";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes";
                    readonly name: "data";
                    readonly type: "bytes";
                }];
                readonly name: "calculateHash";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly stateMutability: "pure";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly name: "dataHashes";
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
                    readonly name: "dataId";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "dataHash";
                    readonly type: "bytes32";
                }];
                readonly name: "registerData";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "dataId";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "currentHash";
                    readonly type: "bytes32";
                }];
                readonly name: "verifyIntegrity";
                readonly outputs: readonly [{
                    readonly internalType: "bool";
                    readonly name: "";
                    readonly type: "bool";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }];
        };
        readonly "Stealth#PaymentForwarder": {
            readonly address: "0x4CF1F3B14B9652d47226d74dEA94eeb116840B94";
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
            readonly address: "0xA457657E730B212E5AbA997A3562A94552C40cA1";
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
        readonly "Relay#RelayPaymentRouter": {
            readonly address: "0x4B1F3B4D398068F48789285Ce7215B54eCf27d6a";
            readonly abi: readonly [{
                readonly inputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "constructor";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }];
                readonly name: "ContractFeeCollected";
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
                readonly name: "PaymentDistributed";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "relayAddress";
                    readonly type: "address";
                }];
                readonly name: "RelayDeactivated";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "relayAddress";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "url";
                    readonly type: "string";
                }];
                readonly name: "RelayRegistered";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "user";
                    readonly type: "address";
                }, {
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
                    readonly name: "mbAllocated";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "endTime";
                    readonly type: "uint256";
                }];
                readonly name: "SubscriptionCreated";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "user";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "relay";
                    readonly type: "address";
                }];
                readonly name: "SubscriptionExpired";
                readonly type: "event";
            }, {
                readonly inputs: readonly [];
                readonly name: "FEE_DENOMINATOR";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "MB_PER_GB";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "MIN_SUBSCRIPTION_AMOUNT";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "PRICE_PER_GB";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "SUBSCRIPTION_DURATION";
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
                    readonly name: "_relayAddress";
                    readonly type: "address";
                }];
                readonly name: "addMBToSubscription";
                readonly outputs: readonly [];
                readonly stateMutability: "payable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_mb";
                    readonly type: "uint256";
                }];
                readonly name: "calculateAmountFromMB";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "pure";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_amount";
                    readonly type: "uint256";
                }];
                readonly name: "calculateMBFromAmount";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "pure";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "contractFee";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "deactivateRelay";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "emergencyPause";
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
                    readonly name: "_user";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_relayAddress";
                    readonly type: "address";
                }];
                readonly name: "expireSubscription";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "_url";
                    readonly type: "string";
                }];
                readonly name: "findRelayByURL";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
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
                readonly name: "getActiveRelaysWithURLs";
                readonly outputs: readonly [{
                    readonly internalType: "address[]";
                    readonly name: "";
                    readonly type: "address[]";
                }, {
                    readonly internalType: "string[]";
                    readonly name: "";
                    readonly type: "string[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "getAllRelays";
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
                    readonly name: "_relayAddress";
                    readonly type: "address";
                }];
                readonly name: "getRelayDetails";
                readonly outputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "url";
                    readonly type: "string";
                }, {
                    readonly internalType: "address";
                    readonly name: "relayAddress";
                    readonly type: "address";
                }, {
                    readonly internalType: "bool";
                    readonly name: "isActive";
                    readonly type: "bool";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "registeredAt";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_relayAddress";
                    readonly type: "address";
                }];
                readonly name: "getRelaySubscribers";
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
                    readonly name: "_user";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_relayAddress";
                    readonly type: "address";
                }];
                readonly name: "getSubscriptionDetails";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "startTime";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "endTime";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "amountPaid";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "mbAllocated";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bool";
                    readonly name: "isActive";
                    readonly type: "bool";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_user";
                    readonly type: "address";
                }];
                readonly name: "getUserSubscriptions";
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
                    readonly name: "_relayAddress";
                    readonly type: "address";
                }];
                readonly name: "isRelayRegistered";
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
                    readonly name: "_user";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_relayAddress";
                    readonly type: "address";
                }];
                readonly name: "isSubscriptionActive";
                readonly outputs: readonly [{
                    readonly internalType: "bool";
                    readonly name: "";
                    readonly type: "bool";
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
                    readonly internalType: "string";
                    readonly name: "_url";
                    readonly type: "string";
                }];
                readonly name: "registerRelay";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "registeredRelays";
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
                readonly name: "relaySubscribers";
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
                readonly name: "relays";
                readonly outputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "url";
                    readonly type: "string";
                }, {
                    readonly internalType: "address payable";
                    readonly name: "relayAddress";
                    readonly type: "address";
                }, {
                    readonly internalType: "bool";
                    readonly name: "isActive";
                    readonly type: "bool";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "registeredAt";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_relayAddress";
                    readonly type: "address";
                }];
                readonly name: "subscribeToRelay";
                readonly outputs: readonly [];
                readonly stateMutability: "payable";
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
                readonly name: "subscriptions";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "user";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "relay";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "startTime";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "endTime";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "amountPaid";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "mbAllocated";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bool";
                    readonly name: "isActive";
                    readonly type: "bool";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "toggleEmergencyPause";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_newOwner";
                    readonly type: "address";
                }];
                readonly name: "transferOwnership";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_newFee";
                    readonly type: "uint256";
                }];
                readonly name: "updateContractFee";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
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
                readonly name: "userSubscriptions";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "withdrawFees";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }];
        };
        readonly "Bridge#BridgeDex": {
            readonly address: "0x39193a70f97e65Fcae575F31c8abd8A1A139E293";
            readonly abi: readonly [{
                readonly inputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "constructor";
            }, {
                readonly inputs: readonly [];
                readonly name: "ECDSAInvalidSignature";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "length";
                    readonly type: "uint256";
                }];
                readonly name: "ECDSAInvalidSignatureLength";
                readonly type: "error";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "s";
                    readonly type: "bytes32";
                }];
                readonly name: "ECDSAInvalidSignatureS";
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
                    readonly name: "id";
                    readonly type: "uint256";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "bridger";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "address";
                    readonly name: "tokenAContract";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint64";
                    readonly name: "date";
                    readonly type: "uint64";
                }];
                readonly name: "LockCreated";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "_amount";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "_deadline";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "_chainBId";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "_lockId";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "_requestId";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "address";
                    readonly name: "_bridger";
                    readonly type: "address";
                }];
                readonly name: "NewTicket";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "_lockId";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "_challengeIndex";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "_chainBId";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "_requestId";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bytes";
                    readonly name: "_signature";
                    readonly type: "bytes";
                }];
                readonly name: "NewWithdraw";
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
                    readonly name: "_bridger";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "_amount";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "_chainAId";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "_lockId";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "_requestId";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "address";
                    readonly name: "_tokenBContract";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "_deadline";
                    readonly type: "uint256";
                }];
                readonly name: "RequestPublished";
                readonly type: "event";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_amount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_lockId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_chainBId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_deadline";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_requestId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "address";
                    readonly name: "_bridger";
                    readonly type: "address";
                }];
                readonly name: "acceptBridger";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_lockId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_amount";
                    readonly type: "uint256";
                }];
                readonly name: "addLiquidity";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "bridgeNonce";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes";
                    readonly name: "_bridgerSignature";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_ticketIndex";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_lockId";
                    readonly type: "uint256";
                }];
                readonly name: "bridgerWithdraw";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_newFee";
                    readonly type: "uint256";
                }];
                readonly name: "changeProtocolFees";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_lockId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_ticketIndex";
                    readonly type: "uint256";
                }];
                readonly name: "deleteTicket";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256[]";
                    readonly name: "_lockIds";
                    readonly type: "uint256[]";
                }, {
                    readonly internalType: "address";
                    readonly name: "_bridger";
                    readonly type: "address";
                }];
                readonly name: "getAcceptedTickets";
                readonly outputs: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "chainBId";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "requestId";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "deadline";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "bytes";
                        readonly name: "signature";
                        readonly type: "bytes";
                    }, {
                        readonly internalType: "address";
                        readonly name: "bridger";
                        readonly type: "address";
                    }];
                    readonly internalType: "struct ProviderTicket[]";
                    readonly name: "";
                    readonly type: "tuple[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_lockId";
                    readonly type: "uint256";
                }];
                readonly name: "getLockTickets";
                readonly outputs: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "chainBId";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "requestId";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "deadline";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "bytes";
                        readonly name: "signature";
                        readonly type: "bytes";
                    }, {
                        readonly internalType: "address";
                        readonly name: "bridger";
                        readonly type: "address";
                    }];
                    readonly internalType: "struct ProviderTicket[]";
                    readonly name: "";
                    readonly type: "tuple[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_token";
                    readonly type: "address";
                }];
                readonly name: "getLocksForToken";
                readonly outputs: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "accepted";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "nonce";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256[]";
                        readonly name: "acceptedChains";
                        readonly type: "uint256[]";
                    }, {
                        readonly components: readonly [{
                            readonly internalType: "uint256";
                            readonly name: "amount";
                            readonly type: "uint256";
                        }, {
                            readonly internalType: "uint256";
                            readonly name: "chainBId";
                            readonly type: "uint256";
                        }, {
                            readonly internalType: "uint256";
                            readonly name: "requestId";
                            readonly type: "uint256";
                        }, {
                            readonly internalType: "uint256";
                            readonly name: "deadline";
                            readonly type: "uint256";
                        }, {
                            readonly internalType: "bytes";
                            readonly name: "signature";
                            readonly type: "bytes";
                        }, {
                            readonly internalType: "address";
                            readonly name: "bridger";
                            readonly type: "address";
                        }];
                        readonly internalType: "struct ProviderTicket[]";
                        readonly name: "tickets";
                        readonly type: "tuple[]";
                    }, {
                        readonly internalType: "address";
                        readonly name: "token";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "owner";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint16";
                        readonly name: "fees";
                        readonly type: "uint16";
                    }];
                    readonly internalType: "struct Lock[]";
                    readonly name: "";
                    readonly type: "tuple[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_owner";
                    readonly type: "address";
                }];
                readonly name: "getMyLocks";
                readonly outputs: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "accepted";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "nonce";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256[]";
                        readonly name: "acceptedChains";
                        readonly type: "uint256[]";
                    }, {
                        readonly components: readonly [{
                            readonly internalType: "uint256";
                            readonly name: "amount";
                            readonly type: "uint256";
                        }, {
                            readonly internalType: "uint256";
                            readonly name: "chainBId";
                            readonly type: "uint256";
                        }, {
                            readonly internalType: "uint256";
                            readonly name: "requestId";
                            readonly type: "uint256";
                        }, {
                            readonly internalType: "uint256";
                            readonly name: "deadline";
                            readonly type: "uint256";
                        }, {
                            readonly internalType: "bytes";
                            readonly name: "signature";
                            readonly type: "bytes";
                        }, {
                            readonly internalType: "address";
                            readonly name: "bridger";
                            readonly type: "address";
                        }];
                        readonly internalType: "struct ProviderTicket[]";
                        readonly name: "tickets";
                        readonly type: "tuple[]";
                    }, {
                        readonly internalType: "address";
                        readonly name: "token";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "owner";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint16";
                        readonly name: "fees";
                        readonly type: "uint16";
                    }];
                    readonly internalType: "struct Lock[]";
                    readonly name: "";
                    readonly type: "tuple[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_owner";
                    readonly type: "address";
                }];
                readonly name: "getMyRequests";
                readonly outputs: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "chainAId";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "lockId";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "requestId";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "address";
                        readonly name: "tokenBContract";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "sender";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "provider";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint64";
                        readonly name: "deadline";
                        readonly type: "uint64";
                    }];
                    readonly internalType: "struct Request[]";
                    readonly name: "";
                    readonly type: "tuple[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_token";
                    readonly type: "address";
                }];
                readonly name: "getRequestsForToken";
                readonly outputs: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "chainAId";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "lockId";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "requestId";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "address";
                        readonly name: "tokenBContract";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "sender";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "provider";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint64";
                        readonly name: "deadline";
                        readonly type: "uint64";
                    }];
                    readonly internalType: "struct Request[]";
                    readonly name: "";
                    readonly type: "tuple[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "idToLock";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "accepted";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "nonce";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "address";
                    readonly name: "token";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "owner";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint16";
                    readonly name: "fees";
                    readonly type: "uint16";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "idToRequest";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "chainAId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "lockId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "requestId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "address";
                    readonly name: "tokenBContract";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "sender";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "provider";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint64";
                    readonly name: "deadline";
                    readonly type: "uint64";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_amount";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "address";
                    readonly name: "_tokenAContract";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256[]";
                    readonly name: "_acceptedChains";
                    readonly type: "uint256[]";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_fees";
                    readonly type: "uint256";
                }];
                readonly name: "lock";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "lockNonce";
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
                }, {
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "myLocks";
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
                }, {
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "myRequests";
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
                readonly inputs: readonly [];
                readonly name: "protocolFees";
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
                    readonly name: "_chainAId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_lockId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_deadline";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "address";
                    readonly name: "_tokenBContract";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_provider";
                    readonly type: "address";
                }];
                readonly name: "publishRequest";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes";
                    readonly name: "_bridgerSignature";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_requestId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_lockId";
                    readonly type: "uint256";
                }];
                readonly name: "relockRequest";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_lockId";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_amount";
                    readonly type: "uint256";
                }];
                readonly name: "removeLiquidity";
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
                    readonly name: "";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "tokenContractToLockIds";
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
                }, {
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "tokenContractToRequestIds";
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
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_requestId";
                    readonly type: "uint256";
                }];
                readonly name: "withdrawChainBRequest";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "_lockId";
                    readonly type: "uint256";
                }];
                readonly name: "withdrawLock";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes";
                    readonly name: "_bridgerSignature";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "_requestId";
                    readonly type: "uint256";
                }];
                readonly name: "withdrawRequest";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }];
        };
        readonly "Database#Chain": {
            readonly address: "0xA888cA3c1495aBdbEc48AF7E20714ff49B4B39D9";
            readonly abi: readonly [{
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "initialOwner";
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
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: false;
                    readonly internalType: "bytes";
                    readonly name: "value";
                    readonly type: "bytes";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bytes";
                    readonly name: "soulReadable";
                    readonly type: "bytes";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bytes";
                    readonly name: "keyReadable";
                    readonly type: "bytes";
                }];
                readonly name: "NodeUpdated";
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
                readonly inputs: readonly [{
                    readonly internalType: "bytes";
                    readonly name: "soul";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "key";
                    readonly type: "bytes";
                }];
                readonly name: "get";
                readonly outputs: readonly [{
                    readonly internalType: "bytes";
                    readonly name: "";
                    readonly type: "bytes";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes";
                    readonly name: "soul";
                    readonly type: "bytes";
                }];
                readonly name: "nodeExists";
                readonly outputs: readonly [{
                    readonly internalType: "bool";
                    readonly name: "";
                    readonly type: "bool";
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
                    readonly internalType: "bytes";
                    readonly name: "soul";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "key";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "value";
                    readonly type: "bytes";
                }];
                readonly name: "put";
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
                    readonly name: "newOwner";
                    readonly type: "address";
                }];
                readonly name: "transferOwnership";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }];
        };
        readonly "IPFS#IPCMFactory": {
            readonly address: "0xc9228E17C3f19956235E6C01f2Aaffc73B09E5F0";
            readonly abi: readonly [{
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "owner";
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
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "instance";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "owner";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "index";
                    readonly type: "uint256";
                }];
                readonly name: "IPCMCreated";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "instance";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "index";
                    readonly type: "uint256";
                }];
                readonly name: "InstanceRemoved";
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
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "owner";
                    readonly type: "address";
                }];
                readonly name: "createIPCM";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "getAllInstances";
                readonly outputs: readonly [{
                    readonly internalType: "address[]";
                    readonly name: "";
                    readonly type: "address[]";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "index";
                    readonly type: "uint256";
                }];
                readonly name: "getInstance";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "getInstanceCount";
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
                    readonly name: "user";
                    readonly type: "address";
                }];
                readonly name: "getUserInstances";
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
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "ipcmInstances";
                readonly outputs: readonly [{
                    readonly internalType: "contract IPCM";
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
                    readonly name: "index";
                    readonly type: "uint256";
                }];
                readonly name: "removeInstance";
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
                    readonly name: "";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly name: "userInstances";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }];
        };
        readonly "IPFS#IPCM": {
            readonly address: "0x13CeaE49Dd0aF3cf74d208B11a366f4fc2e3Be33";
            readonly abi: readonly [{
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "owner";
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
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: false;
                    readonly internalType: "string";
                    readonly name: "value";
                    readonly type: "string";
                }];
                readonly name: "MappingUpdated";
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
                readonly name: "getMapping";
                readonly outputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "";
                    readonly type: "string";
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
                    readonly name: "newOwner";
                    readonly type: "address";
                }];
                readonly name: "transferOwnership";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "string";
                    readonly name: "value";
                    readonly type: "string";
                }];
                readonly name: "updateMapping";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }];
        };
        readonly "HashLayer#BalanceKeeper": {
            readonly address: "0x1D7E662FA5C7c4166E2740B590aC014458582302";
            readonly abi: readonly [{
                readonly inputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "constructor";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "miner";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }];
                readonly name: "BalanceAdded";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "miner";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }];
                readonly name: "BalanceWithdrawn";
                readonly type: "event";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "miner";
                    readonly type: "address";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }];
                readonly name: "addBalance";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly name: "balances";
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
                    readonly name: "miner";
                    readonly type: "address";
                }];
                readonly name: "getBalance";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "hashLayer";
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
                    readonly name: "amount";
                    readonly type: "uint256";
                }];
                readonly name: "withdraw";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }];
        };
        readonly "HashLayer#ChainState": {
            readonly address: "0x725745e36c553F9d3Ac934C12CDdad920141eD0F";
            readonly abi: readonly [{
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "initialDifficulty";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "genesisHash";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "initialReward";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "nonpayable";
                readonly type: "constructor";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "uint64";
                    readonly name: "height";
                    readonly type: "uint64";
                }, {
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "blockHash";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "difficulty";
                    readonly type: "uint256";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "reward";
                    readonly type: "uint256";
                }];
                readonly name: "ChainStateUpdated";
                readonly type: "event";
            }, {
                readonly inputs: readonly [];
                readonly name: "chainState";
                readonly outputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "difficulty";
                    readonly type: "uint256";
                }, {
                    readonly internalType: "uint64";
                    readonly name: "lastAdjustmentTime";
                    readonly type: "uint64";
                }, {
                    readonly components: readonly [{
                        readonly components: readonly [{
                            readonly internalType: "uint64";
                            readonly name: "height";
                            readonly type: "uint64";
                        }, {
                            readonly internalType: "bytes32";
                            readonly name: "previousHash";
                            readonly type: "bytes32";
                        }, {
                            readonly internalType: "uint64";
                            readonly name: "nonce";
                            readonly type: "uint64";
                        }, {
                            readonly internalType: "bytes";
                            readonly name: "data";
                            readonly type: "bytes";
                        }];
                        readonly internalType: "struct ChainState.BlockHeader";
                        readonly name: "header";
                        readonly type: "tuple";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "blockHash";
                        readonly type: "bytes32";
                    }];
                    readonly internalType: "struct ChainState.Block";
                    readonly name: "lastBlock";
                    readonly type: "tuple";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "reward";
                    readonly type: "uint256";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "getChainState";
                readonly outputs: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "difficulty";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint64";
                        readonly name: "lastAdjustmentTime";
                        readonly type: "uint64";
                    }, {
                        readonly components: readonly [{
                            readonly components: readonly [{
                                readonly internalType: "uint64";
                                readonly name: "height";
                                readonly type: "uint64";
                            }, {
                                readonly internalType: "bytes32";
                                readonly name: "previousHash";
                                readonly type: "bytes32";
                            }, {
                                readonly internalType: "uint64";
                                readonly name: "nonce";
                                readonly type: "uint64";
                            }, {
                                readonly internalType: "bytes";
                                readonly name: "data";
                                readonly type: "bytes";
                            }];
                            readonly internalType: "struct ChainState.BlockHeader";
                            readonly name: "header";
                            readonly type: "tuple";
                        }, {
                            readonly internalType: "bytes32";
                            readonly name: "blockHash";
                            readonly type: "bytes32";
                        }];
                        readonly internalType: "struct ChainState.Block";
                        readonly name: "lastBlock";
                        readonly type: "tuple";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "reward";
                        readonly type: "uint256";
                    }];
                    readonly internalType: "struct ChainState.ChainStateData";
                    readonly name: "";
                    readonly type: "tuple";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "hashLayer";
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
                    readonly name: "_hashLayer";
                    readonly type: "address";
                }];
                readonly name: "setHashLayer";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint256";
                    readonly name: "newDifficulty";
                    readonly type: "uint256";
                }, {
                    readonly components: readonly [{
                        readonly components: readonly [{
                            readonly internalType: "uint64";
                            readonly name: "height";
                            readonly type: "uint64";
                        }, {
                            readonly internalType: "bytes32";
                            readonly name: "previousHash";
                            readonly type: "bytes32";
                        }, {
                            readonly internalType: "uint64";
                            readonly name: "nonce";
                            readonly type: "uint64";
                        }, {
                            readonly internalType: "bytes";
                            readonly name: "data";
                            readonly type: "bytes";
                        }];
                        readonly internalType: "struct ChainState.BlockHeader";
                        readonly name: "header";
                        readonly type: "tuple";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "blockHash";
                        readonly type: "bytes32";
                    }];
                    readonly internalType: "struct ChainState.Block";
                    readonly name: "newBlock";
                    readonly type: "tuple";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "newReward";
                    readonly type: "uint256";
                }];
                readonly name: "updateChainState";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }];
        };
        readonly "HashLayer#HashLayer": {
            readonly address: "0xcdF351f077eEeb738D974AC60107Cc275541812a";
            readonly abi: readonly [{
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "_chainState";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "_balanceKeeper";
                    readonly type: "address";
                }];
                readonly stateMutability: "nonpayable";
                readonly type: "constructor";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "uint64";
                    readonly name: "height";
                    readonly type: "uint64";
                }, {
                    readonly indexed: true;
                    readonly internalType: "bytes32";
                    readonly name: "blockHash";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bytes32";
                    readonly name: "previousHash";
                    readonly type: "bytes32";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint64";
                    readonly name: "nonce";
                    readonly type: "uint64";
                }, {
                    readonly indexed: false;
                    readonly internalType: "bytes";
                    readonly name: "data";
                    readonly type: "bytes";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "miner";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "reward";
                    readonly type: "uint256";
                }];
                readonly name: "BlockCreated";
                readonly type: "event";
            }, {
                readonly anonymous: false;
                readonly inputs: readonly [{
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "controller";
                    readonly type: "address";
                }, {
                    readonly indexed: true;
                    readonly internalType: "address";
                    readonly name: "keeper";
                    readonly type: "address";
                }, {
                    readonly indexed: false;
                    readonly internalType: "uint256";
                    readonly name: "amount";
                    readonly type: "uint256";
                }];
                readonly name: "CoinsMinted";
                readonly type: "event";
            }, {
                readonly inputs: readonly [];
                readonly name: "balanceKeeper";
                readonly outputs: readonly [{
                    readonly internalType: "contract BalanceKeeper";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint64";
                    readonly name: "height";
                    readonly type: "uint64";
                }, {
                    readonly internalType: "bytes32";
                    readonly name: "previousHash";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "uint64";
                    readonly name: "nonce";
                    readonly type: "uint64";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "data";
                    readonly type: "bytes";
                }];
                readonly name: "calculateBlockHash";
                readonly outputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "";
                    readonly type: "bytes32";
                }];
                readonly stateMutability: "pure";
                readonly type: "function";
            }, {
                readonly inputs: readonly [];
                readonly name: "chainState";
                readonly outputs: readonly [{
                    readonly internalType: "contract ChainState";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "uint64";
                    readonly name: "nonce";
                    readonly type: "uint64";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "data";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "bytes";
                    readonly name: "imageUrl";
                    readonly type: "bytes";
                }, {
                    readonly internalType: "address";
                    readonly name: "chainId";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "keeper";
                    readonly type: "address";
                }];
                readonly name: "createBlock";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "chainId";
                    readonly type: "address";
                }];
                readonly name: "getChainObject";
                readonly outputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "";
                    readonly type: "address";
                }];
                readonly stateMutability: "pure";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "chainId";
                    readonly type: "address";
                }];
                readonly name: "getChainState";
                readonly outputs: readonly [{
                    readonly components: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "difficulty";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint64";
                        readonly name: "lastAdjustmentTime";
                        readonly type: "uint64";
                    }, {
                        readonly components: readonly [{
                            readonly components: readonly [{
                                readonly internalType: "uint64";
                                readonly name: "height";
                                readonly type: "uint64";
                            }, {
                                readonly internalType: "bytes32";
                                readonly name: "previousHash";
                                readonly type: "bytes32";
                            }, {
                                readonly internalType: "uint64";
                                readonly name: "nonce";
                                readonly type: "uint64";
                            }, {
                                readonly internalType: "bytes";
                                readonly name: "data";
                                readonly type: "bytes";
                            }];
                            readonly internalType: "struct ChainState.BlockHeader";
                            readonly name: "header";
                            readonly type: "tuple";
                        }, {
                            readonly internalType: "bytes32";
                            readonly name: "blockHash";
                            readonly type: "bytes32";
                        }];
                        readonly internalType: "struct ChainState.Block";
                        readonly name: "lastBlock";
                        readonly type: "tuple";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "reward";
                        readonly type: "uint256";
                    }];
                    readonly internalType: "struct ChainState.ChainStateData";
                    readonly name: "";
                    readonly type: "tuple";
                }];
                readonly stateMutability: "view";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "address";
                    readonly name: "controller";
                    readonly type: "address";
                }, {
                    readonly internalType: "address";
                    readonly name: "keeper";
                    readonly type: "address";
                }];
                readonly name: "mint";
                readonly outputs: readonly [];
                readonly stateMutability: "nonpayable";
                readonly type: "function";
            }, {
                readonly inputs: readonly [{
                    readonly internalType: "bytes32";
                    readonly name: "hash";
                    readonly type: "bytes32";
                }, {
                    readonly internalType: "uint256";
                    readonly name: "difficulty";
                    readonly type: "uint256";
                }];
                readonly name: "verifyProofOfWork";
                readonly outputs: readonly [{
                    readonly internalType: "bool";
                    readonly name: "";
                    readonly type: "bool";
                }];
                readonly stateMutability: "pure";
                readonly type: "function";
            }];
        };
    };
};
export type Deployments = typeof DEPLOYMENTS;
//# sourceMappingURL=deployments.d.ts.map