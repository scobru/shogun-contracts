# Shogun Smart Wallet

Smart contract wallet con funzionalità multi-sig, social recovery e batch transactions.

## 📋 Caratteristiche

### ✨ Funzionalità Principali

1. **Multi-Signature**
   - Gestione di più signer
   - Configurabile: richiede N firme per eseguire transazioni
   - Proposte e approvazioni per operazioni critiche

2. **Social Recovery**
   - Sistema di guardian per recupero account
   - Timelock di 48 ore per sicurezza
   - Recupero multi-firma con guardian

3. **Batch Transactions**
   - Esegui multiple transazioni in una sola volta
   - Risparmia gas
   - Fino a 20 transazioni per batch

4. **Sicurezza**
   - Protection contro reentrancy
   - Solo signer autorizzati possono eseguire
   - Guardian separati dai signer

## 🚀 Quick Start

### Deploy Locale

```bash
# Avvia Hardhat node
yarn chain

# In un altro terminale, deploy il contratto
yarn deploy:smartWallet:local
```

### Deploy su Sepolia

```bash
# Deploy su Sepolia testnet
yarn deploy:smartWallet:sepolia
```

## 📖 Come Usare

### 1. Creare un Wallet

```solidity
// Usa la factory per creare un nuovo wallet
SmartWalletFactory factory = SmartWalletFactory(factoryAddress);

address wallet = factory.createWallet(
    owner,           // Indirizzo owner
    1,               // Required signatures (1 = single sig)
    3                // Required guardians per recovery
);
```

### 2. Eseguire una Transazione

```solidity
SmartWallet wallet = SmartWallet(walletAddress);

// Singola transazione
wallet.execute(
    targetAddress,
    callData,
    value
);

// Batch di transazioni
address[] memory targets = [addr1, addr2, addr3];
bytes[] memory data = [data1, data2, data3];
uint256[] memory values = [0, 0, 0];

wallet.executeBatch(targets, data, values);
```

### 3. Aggiungere Guardian

```solidity
// L'owner può aggiungere guardian per social recovery
wallet.addGuardian(guardianAddress);
```

### 4. Recovery Account

```solidity
// 1. Un guardian avvia la recovery
wallet.initiateRecovery(newOwnerAddress);

// 2. Gli altri guardian approvano
wallet.approveRecovery();

// 3. Dopo 48 ore, esegui la recovery
wallet.executeRecovery();
```

## 🔐 Contratti

### SmartWallet
Contratto wallet principale con tutte le funzionalità.

**Funzioni Principali:**
- `execute()` - Esegui una transazione
- `executeBatch()` - Esegui multiple transazioni
- `addSigner()` / `removeSigner()` - Gestione signer
- `addGuardian()` / `removeGuardian()` - Gestione guardian
- `proposeExecution()` / `approveProposal()` - Multi-sig workflow
- `initiateRecovery()` - Avvia recovery
- `executeRecovery()` - Esegui recovery

### SmartWalletFactory
Factory per creare nuovi wallet.

**Funzioni:**
- `createWallet()` - Crea wallet base
- `createWalletWithGuardians()` - Crea wallet con guardian
- `getOwnerWallets()` - Lista wallet di un owner
- `getWalletCount()` - Numero totale di wallet

## 💡 Use Cases

### Wallet Personale
```solidity
// Wallet con 1 firma richiesta (single sig normale)
factory.createWallet(owner, 1, 0);
```

### Wallet Aziendale
```solidity
// Wallet multi-sig: richiede 3 su 5 firme
wallet = factory.createWallet(owner, 3, 2);
// Aggiungi altri signer
wallet.addSigner(signer1);
wallet.addSigner(signer2);
wallet.addSigner(signer3);
wallet.addSigner(signer4);
wallet.setRequiredSignatures(3);
```

### DAO Wallet
```solidity
// Wallet con recovery via guardian
wallet = factory.createWalletWithGuardians(
    owner,
    [guardian1, guardian2, guardian3],
    2,  // 2 firme richieste
    2   // 2 guardian per recovery
);
```

## 🎯 Esempi

### Invio ETH
```solidity
// Prepara i dati per inviare ETH
bytes memory data = "";
uint256 amount = 1 ether;

wallet.execute{value: amount}(
    recipient,
    data,
    amount
);
```

### Approvare e Trasferire ERC20
```solidity
// Batch: Approva + Transfer
address[] memory targets = [
    erc20Token,
    erc20Token
];

bytes[] memory data = [
    abi.encodeWithSignature("approve(address,uint256)", recipient, amount),
    abi.encodeWithSignature("transfer(address,uint256)", recipient, amount)
];

uint256[] memory values = [0, 0];

wallet.executeBatch(targets, data, values);
```

## 🔒 Sicurezza

### Best Practices

1. **Imposta guardian fidati** per recovery
2. **Usa multi-sig** per wallet con molti fondi
3. **Testa sempre** recovery su testnet prima
4. **Mantieni signer separati** dai guardian
5. **Usa batch** per risparmiare gas su operazioni multiple

### Limitazioni

- Recovery ha timelock di 48 ore
- Massimo 20 transazioni per batch
- Guardian non possono essere signer
- Richiede almeno 1 signer e 2 guardian

## 📊 Gas Costs (stima)

| Operazione | Gas (circa) |
|------------|-------------|
| Deploy SmartWallet | ~2,500,000 |
| Execute | ~100,000 |
| ExecuteBatch (3 tx) | ~200,000 |
| Add Signer | ~70,000 |
| Initiate Recovery | ~80,000 |
| Execute Recovery | ~60,000 |

## 🧪 Testing

```bash
# Compila i contratti
npx hardhat compile

# Esegui i test
npx hardhat test

# Coverage
npx hardhat coverage
```

## 📄 License

MIT

## 🙏 Contributing

Contributions welcome! Apri una PR o issue.
