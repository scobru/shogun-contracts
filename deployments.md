============================================================
Deploying Shogun Protocol Contracts
============================================================
Network: baseSepolia (chainId: 84532)
Deployer: 0xA6591dCDff5C7616110b4f84207184aef7835048
Balance: 0.049973192808360647 ETH
USDC Address: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
------------------------------------------------------------

[1/4] Deploying ShogunRelayRegistry...
✅ ShogunRelayRegistry deployed to: 0x644EA4f01fE1b444E4Dfe2Bc06A0FE916D1ffD28

[2/4] Deploying DataPostRegistry...
✅ DataPostRegistry deployed to: 0xf397c0fDFDc28788834dEa317469261bE5B1CdC8

[3/4] Deploying DataSaleEscrowFactory...
✅ DataSaleEscrowFactory deployed to: 0x953a5445a454130dB900F71031885163C0d251D3

[4/4] Deploying StorageDealRegistry...
✅ StorageDealRegistry deployed to: 0x7E0C8c90EF384622dff9CF836125E20D76F003d1

============================================================
Verification Commands:
============================================================

# ShogunRelayRegistry:
npx hardhat verify --network baseSepolia 0x644EA4f01fE1b444E4Dfe2Bc06A0FE916D1ffD28 0x036CbD53842c5426634e7929541eC2318f3dCF7e 10000 604800 0xA6591dCDff5C7616110b4f84207184aef7835048

# DataPostRegistry:
npx hardhat verify --network baseSepolia 0xf397c0fDFDc28788834dEa317469261bE5B1CdC8

# DataSaleEscrowFactory:
npx hardhat verify --network baseSepolia 0x953a5445a454130dB900F71031885163C0d251D3 0x036CbD53842c5426634e7929541eC2318f3dCF7e 0x644EA4f01fE1b444E4Dfe2Bc06A0FE916D1ffD28 0xf397c0fDFDc28788834dEa317469261bE5B1CdC8

# StorageDealRegistry:
npx hardhat verify --network baseSepolia 0x7E0C8c90EF384622dff9CF836125E20D76F003d1 0x644EA4f01fE1b444E4Dfe2Bc06A0FE916D1ffD28

============================================================
Deployment Summary:
============================================================
{
  "network": "baseSepolia",
  "chainId": 84532,
  "deployer": "0xA6591dCDff5C7616110b4f84207184aef7835048",
  "contracts": {
    "relayRegistry": "0x644EA4f01fE1b444E4Dfe2Bc06A0FE916D1ffD28",
    "dataPostRegistry": "0xf397c0fDFDc28788834dEa317469261bE5B1CdC8",
    "dataSaleEscrowFactory": "0x953a5445a454130dB900F71031885163C0d251D3",
    "storageDealRegistry": "0x7E0C8c90EF384622dff9CF836125E20D76F003d1"
  },
  "deployedAt": "2025-12-05T17:47:03.914Z"
}
============================================================
PS D:\shogun-2\shogun-contracts>