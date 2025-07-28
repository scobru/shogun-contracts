// File generato automaticamente da post-deployment.ts
// Non modificare manualmente

export const DEPLOYMENTS = {
  "sepolia": {
    "Stealth#StealthPool": {
      "address": "0xEcC63BE2EA5Fb72Ca63c758bC9Fd41630230b56e",
      "abi": [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_depositAmount",
              "type": "uint256"
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
          "inputs": [],
          "name": "ReentrancyGuardReentrantCall",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "commitment",
              "type": "bytes32"
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
          "name": "DepositRegistered",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "oldRoot",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "newRoot",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "name": "MerkleRootUpdated",
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
              "internalType": "bytes32",
              "name": "commitment",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "recipient",
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
          "name": "Withdrawal",
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
          "name": "allCommitments",
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
              "internalType": "bytes",
              "name": "_publicKey",
              "type": "bytes"
            },
            {
              "internalType": "bytes32",
              "name": "_nonce",
              "type": "bytes32"
            }
          ],
          "name": "calculateCommitment",
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
          "inputs": [],
          "name": "depositAmount",
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
              "internalType": "address payable",
              "name": "_recipient",
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
              "internalType": "bytes32",
              "name": "_commitment",
              "type": "bytes32"
            }
          ],
          "name": "generateMerkleProof",
          "outputs": [
            {
              "internalType": "bytes32[]",
              "name": "proof",
              "type": "bytes32[]"
            },
            {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllCommitments",
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
          "inputs": [],
          "name": "getCommitmentCount",
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
              "name": "_commitment",
              "type": "bytes32"
            }
          ],
          "name": "isCommitmentRegistered",
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
              "name": "_commitment",
              "type": "bytes32"
            }
          ],
          "name": "isCommitmentSpent",
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
              "name": "_nonce",
              "type": "bytes32"
            }
          ],
          "name": "isNonceUsed",
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
          "name": "merkleRoot",
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
              "internalType": "bytes32",
              "name": "_commitment",
              "type": "bytes32"
            }
          ],
          "name": "registerDeposit",
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
          "name": "registeredCommitments",
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
          "name": "renounceOwnership",
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
          "name": "spentCommitments",
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
          "name": "totalDeposits",
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
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "name": "usedNonces",
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
              "name": "_commitment",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "_nonce",
              "type": "bytes32"
            },
            {
              "internalType": "address payable",
              "name": "_recipient",
              "type": "address"
            },
            {
              "internalType": "bytes32[]",
              "name": "_merkleProof",
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
    "Recovery#PairRecovery": {
      "address": "0xa1970aa00c97B7d87E4bE8516125A2A239F416B2",
      "abi": [
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
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "name": "PairDeleted",
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
              "internalType": "string",
              "name": "username",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "name": "PairRegistered",
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
              "internalType": "string",
              "name": "newUsername",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "name": "PairUpdated",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "deletePair",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "username",
              "type": "string"
            }
          ],
          "name": "getAddressByUsername",
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
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getPair",
          "outputs": [
            {
              "internalType": "bytes",
              "name": "encryptedPair",
              "type": "bytes"
            },
            {
              "internalType": "string",
              "name": "username",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "exists",
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
              "name": "username",
              "type": "string"
            }
          ],
          "name": "getPairByUsername",
          "outputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "encryptedPair",
              "type": "bytes"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "exists",
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
            }
          ],
          "name": "hasPair",
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
              "name": "username",
              "type": "string"
            }
          ],
          "name": "isUsernameTaken",
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
              "internalType": "bytes",
              "name": "encryptedPair",
              "type": "bytes"
            },
            {
              "internalType": "string",
              "name": "username",
              "type": "string"
            }
          ],
          "name": "registerPair",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes",
              "name": "encryptedPair",
              "type": "bytes"
            },
            {
              "internalType": "string",
              "name": "newUsername",
              "type": "string"
            }
          ],
          "name": "updatePair",
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
          "name": "userPairs",
          "outputs": [
            {
              "internalType": "bytes",
              "name": "encryptedPair",
              "type": "bytes"
            },
            {
              "internalType": "string",
              "name": "username",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "exists",
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
            }
          ],
          "name": "usernameToAddress",
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
    "Security#Integrity": {
      "address": "0xf792bF76212C7aAFDf8A9239d5478Cd03386D24C",
      "abi": [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "dataId",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "internalType": "bytes32",
              "name": "dataHash",
              "type": "bytes32"
            }
          ],
          "name": "DataRegistered",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "name": "calculateHash",
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
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "name": "dataHashes",
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
              "name": "dataId",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "dataHash",
              "type": "bytes32"
            }
          ],
          "name": "registerData",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "dataId",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "currentHash",
              "type": "bytes32"
            }
          ],
          "name": "verifyIntegrity",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
    },
    "Stealth#PayamentForwarder": {
      "address": "0xc9D383bD540Ade3bcfe7868b50aa2D2d21b2C44e",
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
      "address": "0x4E37B3cB9099B47c1e9c922ea8c1a49e14C65528",
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
    },
    "Relay#RelayPaymentRouter": {
      "address": "0x5215d5B4F967d96E5F22350EDfFC2f20773b6F13",
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
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "ContractFeeCollected",
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
          "name": "PaymentDistributed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "relayAddress",
              "type": "address"
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
              "name": "relayAddress",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "url",
              "type": "string"
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
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
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
              "name": "mbAllocated",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            }
          ],
          "name": "SubscriptionCreated",
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
              "indexed": true,
              "internalType": "address",
              "name": "relay",
              "type": "address"
            }
          ],
          "name": "SubscriptionExpired",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "FEE_DENOMINATOR",
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
          "name": "MB_PER_GB",
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
          "name": "MIN_SUBSCRIPTION_AMOUNT",
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
          "name": "PRICE_PER_GB",
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
          "name": "SUBSCRIPTION_DURATION",
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
              "name": "_relayAddress",
              "type": "address"
            }
          ],
          "name": "addMBToSubscription",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_mb",
              "type": "uint256"
            }
          ],
          "name": "calculateAmountFromMB",
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
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
            }
          ],
          "name": "calculateMBFromAmount",
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
          "inputs": [],
          "name": "contractFee",
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
          "name": "deactivateRelay",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "emergencyPause",
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
              "name": "_user",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_relayAddress",
              "type": "address"
            }
          ],
          "name": "expireSubscription",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_url",
              "type": "string"
            }
          ],
          "name": "findRelayByURL",
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
          "name": "getActiveRelaysWithURLs",
          "outputs": [
            {
              "internalType": "address[]",
              "name": "",
              "type": "address[]"
            },
            {
              "internalType": "string[]",
              "name": "",
              "type": "string[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllRelays",
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
              "name": "_relayAddress",
              "type": "address"
            }
          ],
          "name": "getRelayDetails",
          "outputs": [
            {
              "internalType": "string",
              "name": "url",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "relayAddress",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "registeredAt",
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
              "name": "_relayAddress",
              "type": "address"
            }
          ],
          "name": "getRelaySubscribers",
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
              "name": "_user",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_relayAddress",
              "type": "address"
            }
          ],
          "name": "getSubscriptionDetails",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amountPaid",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "mbAllocated",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
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
              "name": "_user",
              "type": "address"
            }
          ],
          "name": "getUserSubscriptions",
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
              "name": "_relayAddress",
              "type": "address"
            }
          ],
          "name": "isRelayRegistered",
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
              "name": "_user",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_relayAddress",
              "type": "address"
            }
          ],
          "name": "isSubscriptionActive",
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
          "inputs": [
            {
              "internalType": "string",
              "name": "_url",
              "type": "string"
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
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "registeredRelays",
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
          "name": "relaySubscribers",
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
          "name": "relays",
          "outputs": [
            {
              "internalType": "string",
              "name": "url",
              "type": "string"
            },
            {
              "internalType": "address payable",
              "name": "relayAddress",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "registeredAt",
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
              "name": "_relayAddress",
              "type": "address"
            }
          ],
          "name": "subscribeToRelay",
          "outputs": [],
          "stateMutability": "payable",
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
          "name": "subscriptions",
          "outputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "relay",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amountPaid",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "mbAllocated",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "toggleEmergencyPause",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_newOwner",
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
              "internalType": "uint256",
              "name": "_newFee",
              "type": "uint256"
            }
          ],
          "name": "updateContractFee",
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
          "name": "userSubscriptions",
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
          "name": "withdrawFees",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
    },
    "Bridge#BridgeDex": {
      "address": "0x36e3cA55FD43ee0896568690C18D2C154F61AB46",
      "abi": [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "ECDSAInvalidSignature",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "length",
              "type": "uint256"
            }
          ],
          "name": "ECDSAInvalidSignatureLength",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
            }
          ],
          "name": "ECDSAInvalidSignatureS",
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
              "name": "id",
              "type": "uint256"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "bridger",
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
              "internalType": "address",
              "name": "tokenAContract",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint64",
              "name": "date",
              "type": "uint64"
            }
          ],
          "name": "LockCreated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_deadline",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_chainBId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_lockId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_requestId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "_bridger",
              "type": "address"
            }
          ],
          "name": "NewTicket",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_lockId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_challengeIndex",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_chainBId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_requestId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "bytes",
              "name": "_signature",
              "type": "bytes"
            }
          ],
          "name": "NewWithdraw",
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
              "name": "_bridger",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_chainAId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_lockId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_requestId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "_tokenBContract",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_deadline",
              "type": "uint256"
            }
          ],
          "name": "RequestPublished",
          "type": "event"
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
              "name": "_lockId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_chainBId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_deadline",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_requestId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "_bridger",
              "type": "address"
            }
          ],
          "name": "acceptBridger",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_lockId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
            }
          ],
          "name": "addLiquidity",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "bridgeNonce",
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
              "internalType": "bytes",
              "name": "_bridgerSignature",
              "type": "bytes"
            },
            {
              "internalType": "uint256",
              "name": "_ticketIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_lockId",
              "type": "uint256"
            }
          ],
          "name": "bridgerWithdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_newFee",
              "type": "uint256"
            }
          ],
          "name": "changeProtocolFees",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_lockId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_ticketIndex",
              "type": "uint256"
            }
          ],
          "name": "deleteTicket",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256[]",
              "name": "_lockIds",
              "type": "uint256[]"
            },
            {
              "internalType": "address",
              "name": "_bridger",
              "type": "address"
            }
          ],
          "name": "getAcceptedTickets",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "chainBId",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "requestId",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "deadline",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "signature",
                  "type": "bytes"
                },
                {
                  "internalType": "address",
                  "name": "bridger",
                  "type": "address"
                }
              ],
              "internalType": "struct ProviderTicket[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_lockId",
              "type": "uint256"
            }
          ],
          "name": "getLockTickets",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "chainBId",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "requestId",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "deadline",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "signature",
                  "type": "bytes"
                },
                {
                  "internalType": "address",
                  "name": "bridger",
                  "type": "address"
                }
              ],
              "internalType": "struct ProviderTicket[]",
              "name": "",
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
              "name": "_token",
              "type": "address"
            }
          ],
          "name": "getLocksForToken",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "accepted",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "nonce",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256[]",
                  "name": "acceptedChains",
                  "type": "uint256[]"
                },
                {
                  "components": [
                    {
                      "internalType": "uint256",
                      "name": "amount",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "chainBId",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "requestId",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "deadline",
                      "type": "uint256"
                    },
                    {
                      "internalType": "bytes",
                      "name": "signature",
                      "type": "bytes"
                    },
                    {
                      "internalType": "address",
                      "name": "bridger",
                      "type": "address"
                    }
                  ],
                  "internalType": "struct ProviderTicket[]",
                  "name": "tickets",
                  "type": "tuple[]"
                },
                {
                  "internalType": "address",
                  "name": "token",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "internalType": "uint16",
                  "name": "fees",
                  "type": "uint16"
                }
              ],
              "internalType": "struct Lock[]",
              "name": "",
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
              "name": "_owner",
              "type": "address"
            }
          ],
          "name": "getMyLocks",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "accepted",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "nonce",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256[]",
                  "name": "acceptedChains",
                  "type": "uint256[]"
                },
                {
                  "components": [
                    {
                      "internalType": "uint256",
                      "name": "amount",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "chainBId",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "requestId",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "deadline",
                      "type": "uint256"
                    },
                    {
                      "internalType": "bytes",
                      "name": "signature",
                      "type": "bytes"
                    },
                    {
                      "internalType": "address",
                      "name": "bridger",
                      "type": "address"
                    }
                  ],
                  "internalType": "struct ProviderTicket[]",
                  "name": "tickets",
                  "type": "tuple[]"
                },
                {
                  "internalType": "address",
                  "name": "token",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "internalType": "uint16",
                  "name": "fees",
                  "type": "uint16"
                }
              ],
              "internalType": "struct Lock[]",
              "name": "",
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
              "name": "_owner",
              "type": "address"
            }
          ],
          "name": "getMyRequests",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "chainAId",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "lockId",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "requestId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "tokenBContract",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "sender",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "provider",
                  "type": "address"
                },
                {
                  "internalType": "uint64",
                  "name": "deadline",
                  "type": "uint64"
                }
              ],
              "internalType": "struct Request[]",
              "name": "",
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
              "name": "_token",
              "type": "address"
            }
          ],
          "name": "getRequestsForToken",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "chainAId",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "lockId",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "requestId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "tokenBContract",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "sender",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "provider",
                  "type": "address"
                },
                {
                  "internalType": "uint64",
                  "name": "deadline",
                  "type": "uint64"
                }
              ],
              "internalType": "struct Request[]",
              "name": "",
              "type": "tuple[]"
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
          "name": "idToLock",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "accepted",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "nonce",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint16",
              "name": "fees",
              "type": "uint16"
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
          "name": "idToRequest",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "chainAId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lockId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "requestId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "tokenBContract",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "provider",
              "type": "address"
            },
            {
              "internalType": "uint64",
              "name": "deadline",
              "type": "uint64"
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
              "internalType": "address",
              "name": "_tokenAContract",
              "type": "address"
            },
            {
              "internalType": "uint256[]",
              "name": "_acceptedChains",
              "type": "uint256[]"
            },
            {
              "internalType": "uint256",
              "name": "_fees",
              "type": "uint256"
            }
          ],
          "name": "lock",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "lockNonce",
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
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "myLocks",
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
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "myRequests",
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
          "name": "protocolFees",
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
              "name": "_chainAId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_lockId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_deadline",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "_tokenBContract",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_provider",
              "type": "address"
            }
          ],
          "name": "publishRequest",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes",
              "name": "_bridgerSignature",
              "type": "bytes"
            },
            {
              "internalType": "uint256",
              "name": "_requestId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_lockId",
              "type": "uint256"
            }
          ],
          "name": "relockRequest",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_lockId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
            }
          ],
          "name": "removeLiquidity",
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
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "tokenContractToLockIds",
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
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "tokenContractToRequestIds",
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
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_requestId",
              "type": "uint256"
            }
          ],
          "name": "withdrawChainBRequest",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_lockId",
              "type": "uint256"
            }
          ],
          "name": "withdrawLock",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes",
              "name": "_bridgerSignature",
              "type": "bytes"
            },
            {
              "internalType": "uint256",
              "name": "_requestId",
              "type": "uint256"
            }
          ],
          "name": "withdrawRequest",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
    },
    "Database#Chain": {
      "address": "0xb35E9100B9DDDf1902598404c46f10E20D91e358",
      "abi": [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "initialOwner",
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
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "soul",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "key",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "internalType": "bytes",
              "name": "value",
              "type": "bytes"
            }
          ],
          "name": "NodeUpdated",
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
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "soul",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "key",
              "type": "bytes32"
            }
          ],
          "name": "get",
          "outputs": [
            {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "soul",
              "type": "bytes32"
            }
          ],
          "name": "nodeExists",
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
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "soul",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "key",
              "type": "bytes32"
            },
            {
              "internalType": "bytes",
              "name": "value",
              "type": "bytes"
            }
          ],
          "name": "put",
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
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
    },
    "IPFS#IPCMFactory": {
      "address": "0x8Ca8CD2122473FB2A66F346648883A699881BEd7",
      "abi": [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
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
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "instance",
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
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "name": "IPCMCreated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "instance",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "name": "InstanceRemoved",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "name": "createIPCM",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllInstances",
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
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "name": "getInstance",
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
          "name": "getInstanceCount",
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
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getUserInstances",
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
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "ipcmInstances",
          "outputs": [
            {
              "internalType": "contract IPCM",
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
              "name": "index",
              "type": "uint256"
            }
          ],
          "name": "removeInstance",
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
              "name": "",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "userInstances",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
    }
  }
} as const;

export type Deployments = typeof DEPLOYMENTS;
