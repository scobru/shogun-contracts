// File generato automaticamente da post-deployment.ts
// Non modificare manualmente
export const DEPLOYMENTS = {
    "8453": {
        "TuneCampFactory#TuneCampCheckout": {
            "address": "0x2DBcce651aeeaF083d208cc8362B4fd7e72E380F",
            "abi": [
                {
                    "inputs": [],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [],
                    "name": "InvalidInitialization",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "NotInitializing",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnableInvalidOwner",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "OwnableUnauthorizedAccount",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "ReentrancyGuardReentrantCall",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        }
                    ],
                    "name": "SafeERC20FailedOperation",
                    "type": "error"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint64",
                            "name": "version",
                            "type": "uint64"
                        }
                    ],
                    "name": "Initialized",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "previousOwner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnershipTransferred",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "trackId",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "enum TuneCampNFT.TokenRole",
                            "name": "role",
                            "type": "uint8"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "newPriceUSDC",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "newPriceETH",
                            "type": "uint256"
                        }
                    ],
                    "name": "PriceUpdated",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "artist",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "bool",
                            "name": "isPro",
                            "type": "bool"
                        }
                    ],
                    "name": "ProStatusUpdated",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "buyer",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "trackId",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "enum TuneCampNFT.TokenRole",
                            "name": "role",
                            "type": "uint8"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "paymentToken",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "totalPaid",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "artistShare",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "platformShare",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "quantity",
                            "type": "uint256"
                        }
                    ],
                    "name": "Purchase",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "newTreasury",
                            "type": "address"
                        }
                    ],
                    "name": "TreasuryUpdated",
                    "type": "event"
                },
                {
                    "inputs": [],
                    "name": "BPS_DENOMINATOR",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "PLATFORM_FEE_BPS",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "admin",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_nft",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_usdc",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_treasury",
                            "type": "address"
                        }
                    ],
                    "name": "initialize",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "isProArtist",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "nft",
                    "outputs": [
                        {
                            "internalType": "contract TuneCampNFT",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "owner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "total",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "artist",
                            "type": "address"
                        }
                    ],
                    "name": "previewSplit",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "artistShare",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "platformShare",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "internalType": "enum TuneCampNFT.TokenRole",
                            "name": "",
                            "type": "uint8"
                        }
                    ],
                    "name": "priceETH",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "internalType": "enum TuneCampNFT.TokenRole",
                            "name": "",
                            "type": "uint8"
                        }
                    ],
                    "name": "priceUSDC",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "trackId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "enum TuneCampNFT.TokenRole",
                            "name": "role",
                            "type": "uint8"
                        },
                        {
                            "internalType": "uint256",
                            "name": "quantity",
                            "type": "uint256"
                        }
                    ],
                    "name": "purchaseWithETH",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "trackId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "enum TuneCampNFT.TokenRole",
                            "name": "role",
                            "type": "uint8"
                        },
                        {
                            "internalType": "uint256",
                            "name": "quantity",
                            "type": "uint256"
                        }
                    ],
                    "name": "purchaseWithUSDC",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "renounceOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "rescueERC20",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "trackId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "enum TuneCampNFT.TokenRole",
                            "name": "role",
                            "type": "uint8"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_priceUSDC",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_priceETH",
                            "type": "uint256"
                        }
                    ],
                    "name": "setPrice",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256[]",
                            "name": "trackIds",
                            "type": "uint256[]"
                        },
                        {
                            "internalType": "enum TuneCampNFT.TokenRole[]",
                            "name": "roles",
                            "type": "uint8[]"
                        },
                        {
                            "internalType": "uint256[]",
                            "name": "pricesUSDC",
                            "type": "uint256[]"
                        },
                        {
                            "internalType": "uint256[]",
                            "name": "pricesETH",
                            "type": "uint256[]"
                        }
                    ],
                    "name": "setPriceBatch",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "artist",
                            "type": "address"
                        },
                        {
                            "internalType": "bool",
                            "name": "status",
                            "type": "bool"
                        }
                    ],
                    "name": "setProArtist",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_treasury",
                            "type": "address"
                        }
                    ],
                    "name": "setTreasury",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "transferOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "treasury",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "usdc",
                    "outputs": [
                        {
                            "internalType": "contract IERC20",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "stateMutability": "payable",
                    "type": "receive"
                }
            ]
        },
        "TuneCampFactory#TuneCampNFT": {
            "address": "0x532B0fBEe4d2b259a89982753fFf0E79E468fBce",
            "abi": [
                {
                    "inputs": [],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [],
                    "name": "AccessControlBadConfirmation",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "neededRole",
                            "type": "bytes32"
                        }
                    ],
                    "name": "AccessControlUnauthorizedAccount",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "sender",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "balance",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "needed",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "ERC1155InsufficientBalance",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "approver",
                            "type": "address"
                        }
                    ],
                    "name": "ERC1155InvalidApprover",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "idsLength",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "valuesLength",
                            "type": "uint256"
                        }
                    ],
                    "name": "ERC1155InvalidArrayLength",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "operator",
                            "type": "address"
                        }
                    ],
                    "name": "ERC1155InvalidOperator",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address"
                        }
                    ],
                    "name": "ERC1155InvalidReceiver",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "sender",
                            "type": "address"
                        }
                    ],
                    "name": "ERC1155InvalidSender",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "operator",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "name": "ERC1155MissingApprovalForAll",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "InvalidInitialization",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "NotInitializing",
                    "type": "error"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "operator",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "bool",
                            "name": "approved",
                            "type": "bool"
                        }
                    ],
                    "name": "ApprovalForAll",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint64",
                            "name": "version",
                            "type": "uint64"
                        }
                    ],
                    "name": "Initialized",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "role",
                            "type": "bytes32"
                        },
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "previousAdminRole",
                            "type": "bytes32"
                        },
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "newAdminRole",
                            "type": "bytes32"
                        }
                    ],
                    "name": "RoleAdminChanged",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "role",
                            "type": "bytes32"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "sender",
                            "type": "address"
                        }
                    ],
                    "name": "RoleGranted",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "role",
                            "type": "bytes32"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "sender",
                            "type": "address"
                        }
                    ],
                    "name": "RoleRevoked",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "trackId",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "enum TuneCampNFT.TokenRole",
                            "name": "role",
                            "type": "uint8"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "TrackMinted",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "trackId",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "artist",
                            "type": "address"
                        }
                    ],
                    "name": "TrackRegistered",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "operator",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256[]",
                            "name": "ids",
                            "type": "uint256[]"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256[]",
                            "name": "values",
                            "type": "uint256[]"
                        }
                    ],
                    "name": "TransferBatch",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "operator",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "value",
                            "type": "uint256"
                        }
                    ],
                    "name": "TransferSingle",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "value",
                            "type": "string"
                        },
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "URI",
                    "type": "event"
                },
                {
                    "inputs": [],
                    "name": "ARTIST_ROLE",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "DEFAULT_ADMIN_ROLE",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "MINTER_ROLE",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "balanceOf",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address[]",
                            "name": "accounts",
                            "type": "address[]"
                        },
                        {
                            "internalType": "uint256[]",
                            "name": "ids",
                            "type": "uint256[]"
                        }
                    ],
                    "name": "balanceOfBatch",
                    "outputs": [
                        {
                            "internalType": "uint256[]",
                            "name": "",
                            "type": "uint256[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "decodeTokenId",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "trackId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "enum TuneCampNFT.TokenRole",
                            "name": "role",
                            "type": "uint8"
                        }
                    ],
                    "stateMutability": "pure",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "trackId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "enum TuneCampNFT.TokenRole",
                            "name": "role",
                            "type": "uint8"
                        }
                    ],
                    "name": "encodeTokenId",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "pure",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "role",
                            "type": "bytes32"
                        }
                    ],
                    "name": "getRoleAdmin",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "role",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "grantRole",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "role",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "hasRole",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "admin",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "baseMetadataURI_",
                            "type": "string"
                        }
                    ],
                    "name": "initialize",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "operator",
                            "type": "address"
                        }
                    ],
                    "name": "isApprovedForAll",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "internalType": "enum TuneCampNFT.TokenRole",
                            "name": "",
                            "type": "uint8"
                        }
                    ],
                    "name": "maxSupply",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "trackId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "enum TuneCampNFT.TokenRole",
                            "name": "role",
                            "type": "uint8"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "mint",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "internalType": "enum TuneCampNFT.TokenRole",
                            "name": "",
                            "type": "uint8"
                        }
                    ],
                    "name": "mintedSupply",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "trackId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "artist",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "maxLicense",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "maxOwnership",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "maxCollectible",
                            "type": "uint256"
                        }
                    ],
                    "name": "registerTrack",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "role",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "address",
                            "name": "callerConfirmation",
                            "type": "address"
                        }
                    ],
                    "name": "renounceRole",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "role",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "revokeRole",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256[]",
                            "name": "ids",
                            "type": "uint256[]"
                        },
                        {
                            "internalType": "uint256[]",
                            "name": "values",
                            "type": "uint256[]"
                        },
                        {
                            "internalType": "bytes",
                            "name": "data",
                            "type": "bytes"
                        }
                    ],
                    "name": "safeBatchTransferFrom",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "value",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bytes",
                            "name": "data",
                            "type": "bytes"
                        }
                    ],
                    "name": "safeTransferFrom",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "operator",
                            "type": "address"
                        },
                        {
                            "internalType": "bool",
                            "name": "approved",
                            "type": "bool"
                        }
                    ],
                    "name": "setApprovalForAll",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "newBaseURI",
                            "type": "string"
                        }
                    ],
                    "name": "setBaseURI",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "newURI",
                            "type": "string"
                        }
                    ],
                    "name": "setTokenURI",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes4",
                            "name": "interfaceId",
                            "type": "bytes4"
                        }
                    ],
                    "name": "supportsInterface",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "trackArtist",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "uri",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ]
        },
        "TuneCampFactory#TuneCampFactory": {
            "address": "0xC52DEa08b354b62033A683843af6FF550B3F8dED",
            "abi": [
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_usdc",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_nftLogic",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_checkoutLogic",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [],
                    "name": "FailedDeployment",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "balance",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "needed",
                            "type": "uint256"
                        }
                    ],
                    "name": "InsufficientBalance",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnableInvalidOwner",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "OwnableUnauthorizedAccount",
                    "type": "error"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "instanceId",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "admin",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "nft",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "checkout",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        }
                    ],
                    "name": "InstanceDeployed",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "previousOwner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnershipTransferred",
                    "type": "event"
                },
                {
                    "inputs": [],
                    "name": "checkoutImplementation",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "instanceName",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "baseMetadataURI",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "treasury",
                            "type": "address"
                        }
                    ],
                    "name": "deployInstance",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "nftAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "checkoutAddress",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "instanceId",
                            "type": "uint256"
                        }
                    ],
                    "name": "getInstance",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "address",
                                    "name": "admin",
                                    "type": "address"
                                },
                                {
                                    "internalType": "address",
                                    "name": "nft",
                                    "type": "address"
                                },
                                {
                                    "internalType": "address",
                                    "name": "checkout",
                                    "type": "address"
                                },
                                {
                                    "internalType": "string",
                                    "name": "name",
                                    "type": "string"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "deployedAt",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct TuneCampFactory.Instance",
                            "name": "",
                            "type": "tuple"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "nft",
                            "type": "address"
                        }
                    ],
                    "name": "getInstanceByNFT",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "address",
                                    "name": "admin",
                                    "type": "address"
                                },
                                {
                                    "internalType": "address",
                                    "name": "nft",
                                    "type": "address"
                                },
                                {
                                    "internalType": "address",
                                    "name": "checkout",
                                    "type": "address"
                                },
                                {
                                    "internalType": "string",
                                    "name": "name",
                                    "type": "string"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "deployedAt",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct TuneCampFactory.Instance",
                            "name": "",
                            "type": "tuple"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "instanceCount",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "instanceIndexByNFT",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "instances",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "admin",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "nft",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "checkout",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deployedAt",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "admin",
                            "type": "address"
                        }
                    ],
                    "name": "instancesOf",
                    "outputs": [
                        {
                            "internalType": "uint256[]",
                            "name": "",
                            "type": "uint256[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "nftImplementation",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "owner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "renounceOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_usdc",
                            "type": "address"
                        }
                    ],
                    "name": "setUSDC",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "transferOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "usdcAddress",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ]
        }
    },
    "84532": {
        "DataPostRegistry#DataPostRegistry": {
            "address": "0x0fcAB612E9DD123ECD4aC3E50F42da77da3cf421",
            "abi": [
                {
                    "inputs": [],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [],
                    "name": "EnforcedPause",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "ExpectedPause",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "InvalidDescription",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "InvalidPrice",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "NotPostOwner",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnableInvalidOwner",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "OwnableUnauthorizedAccount",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "PostAlreadyExists",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "PostNotFound",
                    "type": "error"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "postId",
                            "type": "bytes32"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "seller",
                            "type": "address"
                        }
                    ],
                    "name": "DataPostDeactivated",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "postId",
                            "type": "bytes32"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "seller",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "bytes32",
                            "name": "proofHash",
                            "type": "bytes32"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "encryptedDataHash",
                            "type": "string"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "category",
                            "type": "string"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "priceUSDC",
                            "type": "uint256"
                        }
                    ],
                    "name": "DataPostPublished",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "postId",
                            "type": "bytes32"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "newDescription",
                            "type": "string"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "newPrice",
                            "type": "uint256"
                        }
                    ],
                    "name": "DataPostUpdated",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "previousOwner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnershipTransferred",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "Paused",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "Unpaused",
                    "type": "event"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "activePosts",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "_postId",
                            "type": "bytes32"
                        }
                    ],
                    "name": "deactivatePost",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getActivePostCount",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getActivePosts",
                    "outputs": [
                        {
                            "internalType": "bytes32[]",
                            "name": "",
                            "type": "bytes32[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "_postId",
                            "type": "bytes32"
                        }
                    ],
                    "name": "getPost",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "bytes32",
                                    "name": "postId",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "address",
                                    "name": "seller",
                                    "type": "address"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "proofHash",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "string",
                                    "name": "encryptedDataHash",
                                    "type": "string"
                                },
                                {
                                    "internalType": "string",
                                    "name": "description",
                                    "type": "string"
                                },
                                {
                                    "internalType": "string",
                                    "name": "category",
                                    "type": "string"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "priceUSDC",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "createdAt",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "active",
                                    "type": "bool"
                                }
                            ],
                            "internalType": "struct DataPostRegistry.DataPost",
                            "name": "",
                            "type": "tuple"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_category",
                            "type": "string"
                        }
                    ],
                    "name": "getPostsByCategory",
                    "outputs": [
                        {
                            "internalType": "bytes32[]",
                            "name": "",
                            "type": "bytes32[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_seller",
                            "type": "address"
                        }
                    ],
                    "name": "getPostsBySeller",
                    "outputs": [
                        {
                            "internalType": "bytes32[]",
                            "name": "",
                            "type": "bytes32[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "owner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "pause",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "paused",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "name": "posts",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "postId",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "address",
                            "name": "seller",
                            "type": "address"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "proofHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "string",
                            "name": "encryptedDataHash",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "category",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "priceUSDC",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "createdAt",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "active",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "postsByCategory",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "postsBySeller",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "_proofHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "string",
                            "name": "_encryptedDataHash",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_description",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_category",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_priceUSDC",
                            "type": "uint256"
                        }
                    ],
                    "name": "publishPost",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "renounceOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "totalPosts",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "transferOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "unpause",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "_postId",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "string",
                            "name": "_newDescription",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_newPrice",
                            "type": "uint256"
                        }
                    ],
                    "name": "updatePost",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ]
        },
        "RelayRegistry#ShogunRelayRegistry": {
            "address": "0x8B88258923bad2d634e533Cb6405d4022CfF320f",
            "abi": [
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_stakingToken",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_minStake",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_unstakingDelay",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "_treasury",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [],
                    "name": "EnforcedPause",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "ExpectedPause",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "InsufficientGriefingCost",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "InsufficientStake",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "InvalidAmount",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "InvalidEndpoint",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "InvalidEpub",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "InvalidPubkey",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "InvalidSlashAmount",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnableInvalidOwner",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "OwnableUnauthorizedAccount",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "ReentrancyGuardReentrantCall",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "RelayAlreadyRegistered",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "RelayAlreadySlashed",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "RelayNotActive",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "RelayNotRegistered",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        }
                    ],
                    "name": "SafeERC20FailedOperation",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "UnstakingDelayNotPassed",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "UnstakingNotRequested",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "UserNotRegistered",
                    "type": "error"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "previousOwner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnershipTransferred",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "Paused",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "relay",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "reason",
                            "type": "string"
                        }
                    ],
                    "name": "RelayDeactivated",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "relay",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "bytes",
                            "name": "pubkey",
                            "type": "bytes"
                        },
                        {
                            "indexed": false,
                            "internalType": "bytes",
                            "name": "epub",
                            "type": "bytes"
                        }
                    ],
                    "name": "RelayEncryptionKeysUpdated",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "relay",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "endpoint",
                            "type": "string"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "stakedAmount",
                            "type": "uint256"
                        }
                    ],
                    "name": "RelayRegistered",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "reportId",
                            "type": "bytes32"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "relay",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "reporter",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "cost",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "reason",
                            "type": "string"
                        }
                    ],
                    "name": "RelaySlashed",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "relay",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "newEndpoint",
                            "type": "string"
                        }
                    ],
                    "name": "RelayUpdated",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "relay",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "newTotal",
                            "type": "uint256"
                        }
                    ],
                    "name": "StakeIncreased",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "relay",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "StakeWithdrawn",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "Unpaused",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "relay",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "availableAt",
                            "type": "uint256"
                        }
                    ],
                    "name": "UnstakeRequested",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "bytes",
                            "name": "pubkey",
                            "type": "bytes"
                        },
                        {
                            "indexed": false,
                            "internalType": "bytes",
                            "name": "epub",
                            "type": "bytes"
                        }
                    ],
                    "name": "UserKeysUpdated",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "bytes",
                            "name": "pubkey",
                            "type": "bytes"
                        },
                        {
                            "indexed": false,
                            "internalType": "bytes",
                            "name": "epub",
                            "type": "bytes"
                        }
                    ],
                    "name": "UserRegistered",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "reportId",
                            "type": "bytes32"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "reporter",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "cost",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "reason",
                            "type": "string"
                        }
                    ],
                    "name": "UserSlashed",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "totalStake",
                            "type": "uint256"
                        }
                    ],
                    "name": "UserStakeDeposited",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "remainingStake",
                            "type": "uint256"
                        }
                    ],
                    "name": "UserStakeWithdrawn",
                    "type": "event"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "activeParticipants",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "activeRelays",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "defaultGriefingRatio",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_griefingRatio",
                            "type": "uint256"
                        }
                    ],
                    "name": "depositUserStake",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_token",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "emergencyWithdraw",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getActiveRelayCount",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getActiveRelays",
                    "outputs": [
                        {
                            "internalType": "address[]",
                            "name": "",
                            "type": "address[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getActiveUserCount",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getActiveUsers",
                    "outputs": [
                        {
                            "internalType": "address[]",
                            "name": "",
                            "type": "address[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_relay",
                            "type": "address"
                        }
                    ],
                    "name": "getRelayInfo",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "address",
                                    "name": "owner",
                                    "type": "address"
                                },
                                {
                                    "internalType": "string",
                                    "name": "endpoint",
                                    "type": "string"
                                },
                                {
                                    "internalType": "bytes",
                                    "name": "pubkey",
                                    "type": "bytes"
                                },
                                {
                                    "internalType": "bytes",
                                    "name": "epub",
                                    "type": "bytes"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "stakedAmount",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "registeredAt",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "updatedAt",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "unstakeRequestedAt",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "enum ShogunRelayRegistry.ParticipantStatus",
                                    "name": "status",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "totalSlashed",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "griefingRatio",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct ShogunRelayRegistry.ParticipantInfo",
                            "name": "",
                            "type": "tuple"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_user",
                            "type": "address"
                        }
                    ],
                    "name": "getUserInfo",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "address",
                                    "name": "owner",
                                    "type": "address"
                                },
                                {
                                    "internalType": "string",
                                    "name": "endpoint",
                                    "type": "string"
                                },
                                {
                                    "internalType": "bytes",
                                    "name": "pubkey",
                                    "type": "bytes"
                                },
                                {
                                    "internalType": "bytes",
                                    "name": "epub",
                                    "type": "bytes"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "stakedAmount",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "registeredAt",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "updatedAt",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "unstakeRequestedAt",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "enum ShogunRelayRegistry.ParticipantStatus",
                                    "name": "status",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "totalSlashed",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "griefingRatio",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct ShogunRelayRegistry.ParticipantInfo",
                            "name": "",
                            "type": "tuple"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_relay",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_slashAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "_reason",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_griefingRatio",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "_dealId",
                            "type": "bytes32"
                        }
                    ],
                    "name": "grief",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_user",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_slashAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "_reason",
                            "type": "string"
                        }
                    ],
                    "name": "griefUser",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "increaseStake",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_relay",
                            "type": "address"
                        }
                    ],
                    "name": "isActiveRelay",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "minStake",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "owner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "participants",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "endpoint",
                            "type": "string"
                        },
                        {
                            "internalType": "bytes",
                            "name": "pubkey",
                            "type": "bytes"
                        },
                        {
                            "internalType": "bytes",
                            "name": "epub",
                            "type": "bytes"
                        },
                        {
                            "internalType": "uint256",
                            "name": "stakedAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "registeredAt",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "updatedAt",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "unstakeRequestedAt",
                            "type": "uint256"
                        },
                        {
                            "internalType": "enum ShogunRelayRegistry.ParticipantStatus",
                            "name": "status",
                            "type": "uint8"
                        },
                        {
                            "internalType": "uint256",
                            "name": "totalSlashed",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "griefingRatio",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "pause",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "paused",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_endpoint",
                            "type": "string"
                        },
                        {
                            "internalType": "bytes",
                            "name": "_pubkey",
                            "type": "bytes"
                        },
                        {
                            "internalType": "bytes",
                            "name": "_epub",
                            "type": "bytes"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_stakeAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_griefingRatio",
                            "type": "uint256"
                        }
                    ],
                    "name": "registerRelay",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes",
                            "name": "_pubkey",
                            "type": "bytes"
                        },
                        {
                            "internalType": "bytes",
                            "name": "_epub",
                            "type": "bytes"
                        }
                    ],
                    "name": "registerUser",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "renounceOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "requestUnstake",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_defaultRatio",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_stakedRatio",
                            "type": "uint256"
                        }
                    ],
                    "name": "setGriefingRatios",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_minStake",
                            "type": "uint256"
                        }
                    ],
                    "name": "setMinStake",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_tokenRegistry",
                            "type": "address"
                        }
                    ],
                    "name": "setTokenRegistry",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_treasury",
                            "type": "address"
                        }
                    ],
                    "name": "setTreasury",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_delay",
                            "type": "uint256"
                        }
                    ],
                    "name": "setUnstakingDelay",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "name": "slashReports",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "reportId",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "address",
                            "name": "reporter",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "relay",
                            "type": "address"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "dealId",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "string",
                            "name": "reason",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "cost",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "stakedClientGriefingRatio",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "stakingToken",
                    "outputs": [
                        {
                            "internalType": "contract IERC20",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "tokenRegistry",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "totalReports",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "transferOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "treasury",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "unpause",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "unstakingDelay",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_newEndpoint",
                            "type": "string"
                        }
                    ],
                    "name": "updateRelay",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes",
                            "name": "_pubkey",
                            "type": "bytes"
                        },
                        {
                            "internalType": "bytes",
                            "name": "_epub",
                            "type": "bytes"
                        }
                    ],
                    "name": "updateRelayEncryptionKeys",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes",
                            "name": "_pubkey",
                            "type": "bytes"
                        },
                        {
                            "internalType": "bytes",
                            "name": "_epub",
                            "type": "bytes"
                        }
                    ],
                    "name": "updateUserKeys",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "withdrawStake",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "withdrawUserStake",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ]
        },
        "DeployProtocol#DataSaleEscrowFactory": {
            "address": "0xFB1cFB380772b4DEE0b71a9eBe21E9a873ED932D",
            "abi": [
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_paymentToken",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_registry",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_postRegistry",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "escrow",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "postId",
                            "type": "bytes32"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "seller",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "buyer",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "priceUSDC",
                            "type": "uint256"
                        }
                    ],
                    "name": "EscrowCreated",
                    "type": "event"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "_postId",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "address",
                            "name": "_seller",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_countdownDuration",
                            "type": "uint256"
                        }
                    ],
                    "name": "createEscrow",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "escrow",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "escrows",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "escrowsByBuyer",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "escrowsByPost",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "escrowsBySeller",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getAllEscrows",
                    "outputs": [
                        {
                            "internalType": "address[]",
                            "name": "",
                            "type": "address[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getEscrowCount",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_buyer",
                            "type": "address"
                        }
                    ],
                    "name": "getEscrowsByBuyer",
                    "outputs": [
                        {
                            "internalType": "address[]",
                            "name": "",
                            "type": "address[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "_postId",
                            "type": "bytes32"
                        }
                    ],
                    "name": "getEscrowsByPost",
                    "outputs": [
                        {
                            "internalType": "address[]",
                            "name": "",
                            "type": "address[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_seller",
                            "type": "address"
                        }
                    ],
                    "name": "getEscrowsBySeller",
                    "outputs": [
                        {
                            "internalType": "address[]",
                            "name": "",
                            "type": "address[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "implementation",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "template",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ]
        },
        "DeployProtocol#StorageDealRegistry": {
            "address": "0x1D7E662FA5C7c4166E2740B590aC014458582302",
            "abi": [
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_registry",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [],
                    "name": "ClientStakeStillLocked",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "DealAlreadyExists",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "DealAlreadyGriefed",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "DealNotActive",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "DealNotFound",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "EnforcedPause",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "ExpectedPause",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "InvalidAmount",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "NotDealParty",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnableInvalidOwner",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "OwnableUnauthorizedAccount",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "ReentrancyGuardReentrantCall",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "RelayNotActive",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        }
                    ],
                    "name": "SafeERC20FailedOperation",
                    "type": "error"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "dealId",
                            "type": "bytes32"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "client",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "ClientStakeDeposited",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "dealId",
                            "type": "bytes32"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "client",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "ClientStakeWithdrawn",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "previousOwner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnershipTransferred",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "Paused",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "dealId",
                            "type": "bytes32"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "relay",
                            "type": "address"
                        }
                    ],
                    "name": "StorageDealCompleted",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "dealId",
                            "type": "bytes32"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "relay",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "client",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "cid",
                            "type": "string"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "sizeMB",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "priceUSDC",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "expiresAt",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "clientStake",
                            "type": "uint256"
                        }
                    ],
                    "name": "StorageDealRegistered",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "Unpaused",
                    "type": "event"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "_dealId",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "addClientStake",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "_dealId",
                            "type": "bytes32"
                        }
                    ],
                    "name": "completeDeal",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "name": "deals",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "dealId",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "address",
                            "name": "relay",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "client",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "cid",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "sizeMB",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "priceUSDC",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "createdAt",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "expiresAt",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "active",
                            "type": "bool"
                        },
                        {
                            "internalType": "uint256",
                            "name": "clientStake",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "griefed",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "dealsByClient",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "dealsByRelay",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_token",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "emergencyWithdraw",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_client",
                            "type": "address"
                        }
                    ],
                    "name": "getClientDeals",
                    "outputs": [
                        {
                            "internalType": "bytes32[]",
                            "name": "",
                            "type": "bytes32[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "_dealId",
                            "type": "bytes32"
                        }
                    ],
                    "name": "getDeal",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "bytes32",
                                    "name": "dealId",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "address",
                                    "name": "relay",
                                    "type": "address"
                                },
                                {
                                    "internalType": "address",
                                    "name": "client",
                                    "type": "address"
                                },
                                {
                                    "internalType": "string",
                                    "name": "cid",
                                    "type": "string"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "sizeMB",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "priceUSDC",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "createdAt",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "expiresAt",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "active",
                                    "type": "bool"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "clientStake",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "griefed",
                                    "type": "bool"
                                }
                            ],
                            "internalType": "struct StorageDealRegistry.StorageDeal",
                            "name": "",
                            "type": "tuple"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_relay",
                            "type": "address"
                        }
                    ],
                    "name": "getRelayDeals",
                    "outputs": [
                        {
                            "internalType": "bytes32[]",
                            "name": "",
                            "type": "bytes32[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getTotalDeals",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "_dealId",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_slashAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "_reason",
                            "type": "string"
                        }
                    ],
                    "name": "grief",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "owner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "pause",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "paused",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "_dealId",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "address",
                            "name": "_client",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "_cid",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_sizeMB",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_priceUSDC",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_durationDays",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_clientStake",
                            "type": "uint256"
                        }
                    ],
                    "name": "registerDeal",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "registry",
                    "outputs": [
                        {
                            "internalType": "contract ShogunRelayRegistry",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "renounceOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "stakingToken",
                    "outputs": [
                        {
                            "internalType": "contract IERC20",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "totalDeals",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "transferOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "unpause",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "_dealId",
                            "type": "bytes32"
                        }
                    ],
                    "name": "withdrawClientStake",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ]
        },
        "DeployProtocol#GunL2Bridge": {
            "address": "0x0F52c90C5704E2aB9cec56eE2C06dD86602988A0",
            "abi": [
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_relayRegistry",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_sequencer",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [],
                    "name": "EnforcedPause",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "ExpectedPause",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnableInvalidOwner",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "OwnableUnauthorizedAccount",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "ReentrancyGuardReentrantCall",
                    "type": "error"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "batchId",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "challenger",
                            "type": "address"
                        }
                    ],
                    "name": "BatchChallenged",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "batchId",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "bytes32",
                            "name": "stateRoot",
                            "type": "bytes32"
                        }
                    ],
                    "name": "BatchFinalized",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "batchId",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "bytes32",
                            "name": "stateRoot",
                            "type": "bytes32"
                        }
                    ],
                    "name": "BatchSubmitted",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "withdrawalHash",
                            "type": "bytes32"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "reporter",
                            "type": "address"
                        }
                    ],
                    "name": "BridgeFrozen",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "batchId",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "challenger",
                            "type": "address"
                        }
                    ],
                    "name": "ChallengerSlashed",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        }
                    ],
                    "name": "Deposit",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "withdrawalHash",
                            "type": "bytes32"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "ForceWithdrawalInitiated",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "previousOwner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnershipTransferred",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "Paused",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "Unpaused",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "nonce",
                            "type": "uint256"
                        }
                    ],
                    "name": "Withdrawal",
                    "type": "event"
                },
                {
                    "inputs": [],
                    "name": "CHALLENGE_BOND",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "CHALLENGE_PERIOD",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "FORCE_WITHDRAWAL_WINDOW",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "batchInfo",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "root",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "dataHash",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "uint256",
                            "name": "submittedAt",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "finalized",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "challenged",
                            "type": "bool"
                        },
                        {
                            "internalType": "address",
                            "name": "challenger",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "batchRoots",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "batchId",
                            "type": "uint256"
                        }
                    ],
                    "name": "challengeBatch",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "challengerBonds",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "currentBatchId",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "currentStateRoot",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "deposit",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address payable",
                            "name": "to",
                            "type": "address"
                        }
                    ],
                    "name": "emergencyWithdraw",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "batchId",
                            "type": "uint256"
                        }
                    ],
                    "name": "finalizeBatch",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getBalance",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "nonce",
                            "type": "uint256"
                        }
                    ],
                    "name": "initiateForceWithdrawal",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "nonce",
                            "type": "uint256"
                        }
                    ],
                    "name": "isWithdrawalProcessed",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "owner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "pause",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "paused",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "name": "pendingForceWithdrawals",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "name": "processedWithdrawals",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "nonce",
                            "type": "uint256"
                        }
                    ],
                    "name": "proveCensorship",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "relayRegistry",
                    "outputs": [
                        {
                            "internalType": "contract ShogunRelayRegistry",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "renounceOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "batchId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "fraudProven",
                            "type": "bool"
                        }
                    ],
                    "name": "resolveChallenge",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "sequencer",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_newRelayRegistry",
                            "type": "address"
                        }
                    ],
                    "name": "setRelayRegistry",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_newSequencer",
                            "type": "address"
                        }
                    ],
                    "name": "setSequencer",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "_newRoot",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "bytes32[]",
                            "name": "_handledForceWithdrawals",
                            "type": "bytes32[]"
                        }
                    ],
                    "name": "submitBatch",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "transferOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "unpause",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "nonce",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "batchId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bytes32[]",
                            "name": "proof",
                            "type": "bytes32[]"
                        }
                    ],
                    "name": "withdraw",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "stateMutability": "payable",
                    "type": "receive"
                }
            ]
        },
        "OracleFeedRegistry#OracleFeedRegistry": {
            "address": "0x0f3349A2A0d876e4e6bbf0B79ACBe59e65E0D9E4",
            "abi": [
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_relayRegistry",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [],
                    "name": "FeedAlreadyExists",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "FeedNotFound",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "InvalidName",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "NotActiveRelay",
                    "type": "error"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "relay",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "feedId",
                            "type": "bytes32"
                        }
                    ],
                    "name": "FeedDeactivated",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "relay",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "feedId",
                            "type": "bytes32"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "indexed": false,
                            "internalType": "enum OracleFeedRegistry.DataType",
                            "name": "dataType",
                            "type": "uint8"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        }
                    ],
                    "name": "FeedRegistered",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "relay",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "feedId",
                            "type": "bytes32"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "newPrice",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "bool",
                            "name": "active",
                            "type": "bool"
                        }
                    ],
                    "name": "FeedUpdated",
                    "type": "event"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "_feedId",
                            "type": "bytes32"
                        }
                    ],
                    "name": "deactivateFeed",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_relay",
                            "type": "address"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "_feedId",
                            "type": "bytes32"
                        }
                    ],
                    "name": "getFeed",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "string",
                                    "name": "name",
                                    "type": "string"
                                },
                                {
                                    "internalType": "enum OracleFeedRegistry.DataType",
                                    "name": "dataType",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "string",
                                    "name": "schema",
                                    "type": "string"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "priceAtomic",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "updateFreqSecs",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "createdAt",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "active",
                                    "type": "bool"
                                }
                            ],
                            "internalType": "struct OracleFeedRegistry.FeedInfo",
                            "name": "",
                            "type": "tuple"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_name",
                            "type": "string"
                        }
                    ],
                    "name": "getFeedId",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "pure",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_relay",
                            "type": "address"
                        }
                    ],
                    "name": "getRelayFeedCount",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_relay",
                            "type": "address"
                        }
                    ],
                    "name": "getRelayFeeds",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "string",
                                    "name": "name",
                                    "type": "string"
                                },
                                {
                                    "internalType": "enum OracleFeedRegistry.DataType",
                                    "name": "dataType",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "string",
                                    "name": "schema",
                                    "type": "string"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "priceAtomic",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "updateFreqSecs",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "createdAt",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "active",
                                    "type": "bool"
                                }
                            ],
                            "internalType": "struct OracleFeedRegistry.FeedInfo[]",
                            "name": "feeds",
                            "type": "tuple[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_relay",
                            "type": "address"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "_feedId",
                            "type": "bytes32"
                        }
                    ],
                    "name": "isFeedActive",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "exists",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "active",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_name",
                            "type": "string"
                        },
                        {
                            "internalType": "enum OracleFeedRegistry.DataType",
                            "name": "_dataType",
                            "type": "uint8"
                        },
                        {
                            "internalType": "string",
                            "name": "_schema",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_priceAtomic",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_updateFreqSecs",
                            "type": "uint256"
                        }
                    ],
                    "name": "registerFeed",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "relayFeedIds",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "name": "relayFeeds",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "enum OracleFeedRegistry.DataType",
                            "name": "dataType",
                            "type": "uint8"
                        },
                        {
                            "internalType": "string",
                            "name": "schema",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "priceAtomic",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "updateFreqSecs",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "createdAt",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "active",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "relayRegistry",
                    "outputs": [
                        {
                            "internalType": "contract ShogunRelayRegistry",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "totalFeeds",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "_feedId",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_newPrice",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "_active",
                            "type": "bool"
                        }
                    ],
                    "name": "updateFeed",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ]
        },
        "ShogunPriceOracle#ShogunPriceOracle": {
            "address": "0x5A656594f203F0e405B88898c7b3cF2e8EA522a6",
            "abi": [
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_relayRegistry",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_feedRegistry",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [],
                    "name": "ShogunOracle__InvalidPacket",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "ShogunOracle__PacketExpired",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "ShogunOracle__SignerNotActiveRelay",
                    "type": "error"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "feedId",
                            "type": "bytes32"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "signer",
                            "type": "address"
                        }
                    ],
                    "name": "PriceUpdated",
                    "type": "event"
                },
                {
                    "inputs": [],
                    "name": "DOMAIN_SEPARATOR",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "ORACLE_PACKET_TYPEHASH",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "feedRegistry",
                    "outputs": [
                        {
                            "internalType": "contract OracleFeedRegistry",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "components": [
                                {
                                    "internalType": "uint8",
                                    "name": "v",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "r",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "s",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "feedId",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "deadline",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bytes",
                                    "name": "payload",
                                    "type": "bytes"
                                }
                            ],
                            "internalType": "struct ShogunOracle.OraclePacket",
                            "name": "packet",
                            "type": "tuple"
                        }
                    ],
                    "name": "getPacketSigner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "signer",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "feedName",
                            "type": "string"
                        }
                    ],
                    "name": "getPrice",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "feedId",
                            "type": "bytes32"
                        }
                    ],
                    "name": "getPriceById",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "name": "lastSigner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "name": "lastUpdated",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "name": "latestPrices",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "relayRegistry",
                    "outputs": [
                        {
                            "internalType": "contract ShogunRelayRegistry",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "components": [
                                {
                                    "internalType": "uint8",
                                    "name": "v",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "r",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "s",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "feedId",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "deadline",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bytes",
                                    "name": "payload",
                                    "type": "bytes"
                                }
                            ],
                            "internalType": "struct ShogunOracle.OraclePacket",
                            "name": "packet",
                            "type": "tuple"
                        }
                    ],
                    "name": "updateAndGetPrice",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "components": [
                                {
                                    "internalType": "uint8",
                                    "name": "v",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "r",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "s",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "feedId",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "deadline",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bytes",
                                    "name": "payload",
                                    "type": "bytes"
                                }
                            ],
                            "internalType": "struct ShogunOracle.OraclePacket",
                            "name": "packet",
                            "type": "tuple"
                        }
                    ],
                    "name": "updatePrice",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "feedId",
                            "type": "bytes32"
                        },
                        {
                            "components": [
                                {
                                    "internalType": "uint8",
                                    "name": "v",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "r",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "s",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "feedId",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "deadline",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bytes",
                                    "name": "payload",
                                    "type": "bytes"
                                }
                            ],
                            "internalType": "struct ShogunOracle.OraclePacket",
                            "name": "packet",
                            "type": "tuple"
                        }
                    ],
                    "name": "verifyPacket",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "valid",
                            "type": "bool"
                        },
                        {
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "signer",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ]
        },
        "ShogunPaidOracle#ShogunPaidOracle": {
            "address": "0xAC00A7E9a49DD5F2b3733270F5254b9827145c82",
            "abi": [
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_relayRegistry",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_feedRegistry",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "required",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "provided",
                            "type": "uint256"
                        }
                    ],
                    "name": "InsufficientPayment",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "ShogunOracle__InvalidPacket",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "ShogunOracle__PacketExpired",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "ShogunOracle__SignerNotActiveRelay",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "feedId",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "uint256",
                            "name": "lastUpdate",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "packetDeadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "StalePacket",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "TransferFailed",
                    "type": "error"
                },
                {
                    "inputs": [],
                    "name": "Unauthorized",
                    "type": "error"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "feedId",
                            "type": "bytes32"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        }
                    ],
                    "name": "FeedPriceSet",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "relay",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "feedId",
                            "type": "bytes32"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        }
                    ],
                    "name": "PaymentReceived",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "bytes32",
                            "name": "feedId",
                            "type": "bytes32"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "signer",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "paymentAmount",
                            "type": "uint256"
                        }
                    ],
                    "name": "PriceUpdated",
                    "type": "event"
                },
                {
                    "inputs": [],
                    "name": "DOMAIN_SEPARATOR",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "ORACLE_PACKET_TYPEHASH",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "emergencyWithdraw",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "name": "feedPriceOverride",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "feedRegistry",
                    "outputs": [
                        {
                            "internalType": "contract OracleFeedRegistry",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "feedId",
                            "type": "bytes32"
                        }
                    ],
                    "name": "getFeedPrice",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "components": [
                                {
                                    "internalType": "uint8",
                                    "name": "v",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "r",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "s",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "feedId",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "deadline",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bytes",
                                    "name": "payload",
                                    "type": "bytes"
                                }
                            ],
                            "internalType": "struct ShogunOracle.OraclePacket",
                            "name": "packet",
                            "type": "tuple"
                        }
                    ],
                    "name": "getPacketSigner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "signer",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "feedName",
                            "type": "string"
                        }
                    ],
                    "name": "getPrice",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "feedId",
                            "type": "bytes32"
                        }
                    ],
                    "name": "getPriceById",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "feedId",
                            "type": "bytes32"
                        }
                    ],
                    "name": "getUpdateQuote",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "requiredPayment",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "name": "lastSigner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "name": "lastUpdated",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "name": "latestPrices",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "owner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "relayRegistry",
                    "outputs": [
                        {
                            "internalType": "contract ShogunRelayRegistry",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "relayRevenue",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "feedId",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        }
                    ],
                    "name": "setFeedPrice",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "feedName",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        }
                    ],
                    "name": "setFeedPriceByName",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "transferOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "components": [
                                {
                                    "internalType": "uint8",
                                    "name": "v",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "r",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "s",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "feedId",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "deadline",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bytes",
                                    "name": "payload",
                                    "type": "bytes"
                                }
                            ],
                            "internalType": "struct ShogunOracle.OraclePacket",
                            "name": "packet",
                            "type": "tuple"
                        }
                    ],
                    "name": "updateAndGetPrice",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "components": [
                                {
                                    "internalType": "uint8",
                                    "name": "v",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "r",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "s",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "feedId",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "deadline",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bytes",
                                    "name": "payload",
                                    "type": "bytes"
                                }
                            ],
                            "internalType": "struct ShogunOracle.OraclePacket",
                            "name": "packet",
                            "type": "tuple"
                        }
                    ],
                    "name": "updatePrice",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes32",
                            "name": "feedId",
                            "type": "bytes32"
                        },
                        {
                            "components": [
                                {
                                    "internalType": "uint8",
                                    "name": "v",
                                    "type": "uint8"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "r",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "s",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "bytes32",
                                    "name": "feedId",
                                    "type": "bytes32"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "deadline",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bytes",
                                    "name": "payload",
                                    "type": "bytes"
                                }
                            ],
                            "internalType": "struct ShogunOracle.OraclePacket",
                            "name": "packet",
                            "type": "tuple"
                        }
                    ],
                    "name": "verifyPacket",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "valid",
                            "type": "bool"
                        },
                        {
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "signer",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ]
        },
        "Stealth#PaymentForwarder": {
            "address": "0x512edE537cb53dcbFC29629B4999c3e8f18799Eb",
            "abi": [
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_toll",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "_tollCollector",
                            "type": "address"
                        },
                        {
                            "internalType": "address payable",
                            "name": "_tollReceiver",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnableInvalidOwner",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "account",
                            "type": "address"
                        }
                    ],
                    "name": "OwnableUnauthorizedAccount",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        }
                    ],
                    "name": "SafeERC20FailedOperation",
                    "type": "error"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "bytes32",
                            "name": "pkx",
                            "type": "bytes32"
                        },
                        {
                            "indexed": false,
                            "internalType": "bytes32",
                            "name": "ciphertext",
                            "type": "bytes32"
                        }
                    ],
                    "name": "Announcement",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "previousOwner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnershipTransferred",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "acceptor",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        }
                    ],
                    "name": "TokenWithdrawal",
                    "type": "event"
                },
                {
                    "inputs": [],
                    "name": "collectTolls",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "owner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "renounceOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address payable",
                            "name": "_receiver",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_tollCommitment",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "_pkx",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "_ciphertext",
                            "type": "bytes32"
                        }
                    ],
                    "name": "sendEth",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_receiver",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_tokenAddr",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "_pkx",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "_ciphertext",
                            "type": "bytes32"
                        }
                    ],
                    "name": "sendToken",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_newToll",
                            "type": "uint256"
                        }
                    ],
                    "name": "setToll",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_newTollCollector",
                            "type": "address"
                        }
                    ],
                    "name": "setTollCollector",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address payable",
                            "name": "_newTollReceiver",
                            "type": "address"
                        }
                    ],
                    "name": "setTollReceiver",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "tokenPayments",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "toll",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "tollCollector",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "tollReceiver",
                    "outputs": [
                        {
                            "internalType": "address payable",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "transferOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_acceptor",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_tokenAddr",
                            "type": "address"
                        }
                    ],
                    "name": "withdrawToken",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_acceptor",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_tokenAddr",
                            "type": "address"
                        },
                        {
                            "internalType": "contract IPaymentForwarderHookReceiver",
                            "name": "_hook",
                            "type": "address"
                        },
                        {
                            "internalType": "bytes",
                            "name": "_data",
                            "type": "bytes"
                        }
                    ],
                    "name": "withdrawTokenAndCall",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_stealthAddr",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_acceptor",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_tokenAddr",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_sponsor",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_sponsorFee",
                            "type": "uint256"
                        },
                        {
                            "internalType": "contract IPaymentForwarderHookReceiver",
                            "name": "_hook",
                            "type": "address"
                        },
                        {
                            "internalType": "bytes",
                            "name": "_data",
                            "type": "bytes"
                        },
                        {
                            "internalType": "uint8",
                            "name": "_v",
                            "type": "uint8"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "_r",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "_s",
                            "type": "bytes32"
                        }
                    ],
                    "name": "withdrawTokenAndCallOnBehalf",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_stealthAddr",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_acceptor",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_tokenAddr",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_sponsor",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_sponsorFee",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint8",
                            "name": "_v",
                            "type": "uint8"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "_r",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "_s",
                            "type": "bytes32"
                        }
                    ],
                    "name": "withdrawTokenOnBehalf",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ]
        },
        "Stealth#StealthKeyRegistry": {
            "address": "0x6038197D7eb76ee668b37c61021619542F757B63",
            "abi": [
                {
                    "inputs": [],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "registrant",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "viewingPublicKey",
                            "type": "string"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "spendingPublicKey",
                            "type": "string"
                        }
                    ],
                    "name": "StealthKeysRegistered",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "stealthAddress",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "sender",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "ephemeralPublicKey",
                            "type": "string"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "encryptedRandomNumber",
                            "type": "string"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "recipientPublicKey",
                            "type": "string"
                        }
                    ],
                    "name": "StealthMetadataRegistered",
                    "type": "event"
                },
                {
                    "inputs": [],
                    "name": "DOMAIN_SEPARATOR",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "STEALTHKEYS_TYPEHASH",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_registrant",
                            "type": "address"
                        }
                    ],
                    "name": "getStealthKeys",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "viewingPublicKey",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "spendingPublicKey",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_viewingPublicKey",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_spendingPublicKey",
                            "type": "string"
                        }
                    ],
                    "name": "registerStealthKeys",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_registrant",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "_viewingPublicKey",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_spendingPublicKey",
                            "type": "string"
                        },
                        {
                            "internalType": "uint8",
                            "name": "_v",
                            "type": "uint8"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "_r",
                            "type": "bytes32"
                        },
                        {
                            "internalType": "bytes32",
                            "name": "_s",
                            "type": "bytes32"
                        }
                    ],
                    "name": "registerStealthKeysOnBehalf",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_stealthAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "_ephemeralPublicKey",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_encryptedRandomNumber",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_recipientPublicKey",
                            "type": "string"
                        }
                    ],
                    "name": "registerStealthMetadata",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ]
        }
    }
};
