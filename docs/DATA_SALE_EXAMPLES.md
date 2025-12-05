# Data Sale Flow - Esempi Pratici

## Scenario Completo: Alice compra dati da Bob

### STEP 1: BOB PREPARA E PUBBLICA I DATI

Bob ha dei dati "X" che vuole vendere (es. dataset di ricerca, analisi, etc.)

#### 1.1 Bob prepara i dati

```javascript
// Bob ha i dati originali
const rawData = {
    dataset: "Market analysis Q4 2024",
    data: [...], // Dati reali
    metadata: {...}
};

// Bob crea proofhash (hash dei dati + salt)
const salt = "bob-secret-salt-123";
const dataString = JSON.stringify(rawData);
const proofHash = ethers.solidityPackedKeccak256(
    ["string", "address", "string"],
    [dataString, bobAddress, salt]
);
// proofHash = 0x1234...

// Bob crittografa i dati con una chiave simmetrica
const symKey = await generateSymmetricKey();
const encryptedData = await encrypt(rawData, symKey);

// Upload dati crittografati su IPFS
const { cid: encryptedDataHash } = await ipfs.add(encryptedData);
// encryptedDataHash = "QmYyyy..."
```

#### 1.2 Bob pubblica il DataPost on-chain

```solidity
// Bob chiama:
postId = postRegistry.publishPost(
    proofHash,                          // 0x1234...
    "QmYyyy...",                        // IPFS CID dati crittografati
    "Market analysis Q4 2024 dataset",  // Descrizione
    "analytics",                        // Categoria
    10 * 10^6                           // 10 USDC (6 decimals)
)
```

**Risultato:**
```
DataPost pubblicato:
  - PostId: 0xABCD...
  - Seller: 0xBob...
  - Price: 10 USDC
  - Descrizione: "Market analysis Q4 2024 dataset"
  - Categoria: "analytics"
  - ProofHash: 0x1234...
  - EncryptedDataHash: "QmYyyy..."
```

---

### STEP 2: ALICE CERCA I DATI

Alice cerca dati di analisi di mercato.

#### 2.1 Alice cerca nella categoria

```solidity
// Alice chiama:
posts = postRegistry.getPostsByCategory("analytics")
// Returns: [0xABCD..., 0xEFGH..., ...]

// Per ogni post, Alice ottiene info:
post = postRegistry.getPost(0xABCD...)
// Returns:
// {
//   seller: 0xBob...,
//   description: "Market analysis Q4 2024 dataset",
//   price: 10 USDC,
//   proofHash: 0x1234...,
//   encryptedDataHash: "QmYyyy..."
// }
```

#### 2.2 Alice verifica la reputazione del seller

```solidity
// Alice verifica se Bob è un relay registrato:
bobRelayInfo = registry.getRelayInfo(0xBob...)
if (bobRelayInfo.status == Active) {
    // Bob è relay registrato con stake!
    // Alta fiducia
} else {
    // Bob è solo un user normale
    // Meno fiducia
}
```

#### 2.3 Alice decide di comprare

Alice sceglie di comprare i dati di Bob perché:
- Prezzo ragionevole (10 USDC)
- Bob è relay registrato (ha stake)
- Descrizione interessante

---

### STEP 3: ALICE CREA L'ESCROW

#### 3.1 Alice ottiene le chiavi pubbliche di Bob

```solidity
// Alice recupera pubkey/epub di Bob:
bobInfo = registry.getRelayInfo(0xBob...)
// bobInfo.pubkey = "123456789.0987654321" (bytes)
// bobInfo.epub = "987654321.1234567890" (bytes)
```

#### 3.2 Alice crea l'escrow

```solidity
// Alice chiama:
escrowAddress = factory.createEscrow(
    0xABCD...,    // PostId
    0xBob...,     // Seller
    604800        // 7 giorni countdown
)

// Escrow creato e inizializzato:
// {
//   postId: 0xABCD...,
//   seller: 0xBob...,
//   buyer: 0xAlice...,
//   price: 10 USDC,
//   status: PENDING_PAYMENT,
//   countdownDuration: 7 days
// }
```

---

### STEP 4: ALICE DEPOSITA IL PAGAMENTO

```solidity
// Alice approva USDC:
usdc.approve(escrowAddress, 10 * 10^6)

// Alice deposita:
escrow.depositPayment()

// Risultato:
// - buyerPayment: 10 USDC (bloccato in escrow)
// - status: ACTIVE
// - countdownEnd: now + 7 days
```

---

### STEP 5: BOB CRITTOGRAFA I DATI PER ALICE

#### 5.1 Bob ottiene le chiavi pubbliche di Alice

```solidity
// Bob chiama:
aliceInfo = registry.getUserInfo(0xAlice...)
// aliceInfo.pubkey = "111222333.444555666" (bytes)
// aliceInfo.epub = "999888777.666555444" (bytes)
```

#### 5.2 Bob crittografa la chiave simmetrica per Alice

```javascript
// Bob converte bytes → string
const alicePubkey = ethers.toUtf8String(aliceInfo.pubkey);
const aliceEpub = ethers.toUtf8String(aliceInfo.epub);

// Bob crea il pair del destinatario (Alice)
const alicePair = {
    pub: alicePubkey,
    epub: aliceEpub
};

// Bob crittografa la chiave simmetrica per Alice
const encryptedSymKey = await SEA.encrypt(symKey, alicePair);

// Upload su IPFS
const { cid: encryptedSymKeyHash } = await ipfs.add(encryptedSymKey);
// encryptedSymKeyHash = "QmZzzz..."
```

#### 5.3 Bob invia la chiave criptata all'escrow

```solidity
// Bob chiama:
escrow.submitData(ethers.id("QmZzzz..."))
// o meglio: submitData(ipfsHashToBytes32("QmZzzz..."))

// Risultato:
// - encryptedSymKeyHash: 0xZZZZ...
// - status: DATA_SUBMITTED
```

**Nota:** Il hash della chiave viene salvato on-chain, ma i dati veri sono su IPFS.

---

### STEP 6: ALICE RICEVE E DECRIPTA I DATI

#### 6.1 Alice recupera la chiave criptata dall'escrow

```solidity
// Alice chiama:
escrowInfo = escrow.getEscrowInfo()
// escrowInfo.encryptedSymKeyHash = 0xZZZZ...
// escrowInfo.encryptedDataHash = "QmYyyy..."
// escrowInfo.status = DATA_SUBMITTED
```

#### 6.2 Alice scarica e decripta

```javascript
// Alice converte hash → CID IPFS
const encryptedSymKeyCID = bytes32ToIPFSCID(escrowInfo.encryptedSymKeyHash);
// "QmZzzz..."

// Alice scarica da IPFS:
const encryptedSymKey = await ipfs.cat(encryptedSymKeyCID);
const encryptedData = await ipfs.cat(escrowInfo.encryptedDataHash);

// Alice decripta:
const alicePair = { pub: alicePubkey, epub: aliceEpub, ... };
const symKey = await SEA.decrypt(encryptedSymKey, alicePair);
const rawData = await decrypt(encryptedData, symKey);
```

#### 6.3 Alice verifica il proofhash

```javascript
// Alice verifica che i dati siano corretti:
const salt = "bob-secret-salt-123"; // Bob deve rivelare il salt dopo la vendita
const dataString = JSON.stringify(rawData);
const computedProofHash = ethers.solidityPackedKeccak256(
    ["string", "address", "string"],
    [dataString, bobAddress, salt]
);

if (computedProofHash === escrowInfo.proofHash) {
    // ✅ Dati corretti!
    // Alice completa l'escrow
} else {
    // ❌ Dati non corrispondono
    // Alice può griefare
}
```

#### 6.4 Alice completa l'escrow

```solidity
// Se tutto OK:
escrow.complete()

// Risultato:
// - status: COMPLETED
// - Fondi (10 USDC) rilasciati a Bob
// - Alice ha i dati decriptati
```

---

### STEP 7: GRIEFING (se qualcosa va male)

Scenario: Alice riceve i dati ma non sono quelli promessi.

#### 7.1 Alice verifica e trova problemi

```javascript
// Alice decripta i dati
const rawData = await decrypt(...);

// Verifica proofhash
const computedHash = hashData(rawData);
if (computedHash !== escrowInfo.proofHash) {
    // ❌ Dati non corrispondono!
    // Alice decide di punire Bob
}
```

#### 7.2 Alice griefa Bob

```solidity
// Alice decide di slasheare 50 USDC dello stake di Bob:
escrow.grief(
    50 * 10^6,                              // 50 USDC
    "Dati non corrispondono al proofhash"
)

// Calcolo costo (se Bob è relay):
// Bob ratio: 50 (0.5%)
// Costo = 50 USDC * 50 / 10000 = 0.25 USDC

// Risultato:
// - Bob perde: 50 USDC (dallo stake)
// - Alice paga: 0.25 USDC (costo griefing)
// - Fondi in escrow: restituiti ad Alice o gestiti in base alla logica
```

---

## Flusso Completo in Diagramma

```
┌─────────────────────────────────────────────────────────────┐
│ BOB PUBBLICA DATI                                           │
│                                                             │
│ 1. Prepara dati + proofhash                                 │
│ 2. Crittografa dati → IPFS                                  │
│ 3. Pubblica DataPost on-chain                               │
│                                                             │
│ Result: Dati disponibili per la vendita                    │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ ALICE CERCA E TROVA                                         │
│                                                             │
│ 1. postRegistry.getPostsByCategory("analytics")            │
│ 2. Verifica reputazione seller                              │
│ 3. Sceglie Bob's post                                       │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ ALICE CREA ESCROW                                           │
│                                                             │
│ 1. factory.createEscrow(postId, seller, 7 days)            │
│ 2. Escrow creato → PENDING_PAYMENT                          │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ ALICE PAGA                                                  │
│                                                             │
│ 1. escrow.depositPayment(10 USDC)                          │
│ 2. Escrow → ACTIVE                                          │
│ 3. Countdown inizia (7 giorni)                              │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ BOB CRITTOGRAFA PER ALICE                                   │
│                                                             │
│ 1. registry.getUserInfo(Alice) → pubkey/epub               │
│ 2. Crittografa SymKey con pubkey di Alice                  │
│ 3. Upload su IPFS                                           │
│ 4. escrow.submitData(encryptedSymKeyHash)                  │
│                                                             │
│ Result: Escrow → DATA_SUBMITTED                             │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ ALICE RICEVE E DECRIPTA                                     │
│                                                             │
│ 1. Scarica encryptedSymKey da IPFS                          │
│ 2. Scarica encryptedData da IPFS                            │
│ 3. Decripta: SymKey → Data                                  │
│ 4. Verifica proofhash                                       │
└─────────────────────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
   ┌────────┐            ┌──────────────┐
   │  OK    │            │   PROBLEMA   │
   │        │            │              │
   │ escrow │            │ escrow.grief │
   │.complete│           │              │
   │        │            │ Punish Bob   │
   │ Fondi  │            │              │
   │ a Bob  │            │ Refund Alice │
   └────────┘            └──────────────┘
```

## Vantaggi del Sistema

1. **Discovery On-Chain**: Tutti possono cercare dati disponibili
2. **Trustless Escrow**: Fondi gestiti on-chain, nessun trust
3. **Encrypted End-to-End**: Solo Alice può decriptare
4. **Griefing Flessibile**: Alice decide quanto punire
5. **Integrazione**: Usa registry esistente per chiavi/stake

## Note Importanti

- Il salt per il proofhash può essere rivelato da Bob dopo la vendita per permettere verifica
- I dati crittografati sono già su IPFS prima della vendita (proofhash)
- La chiave simmetrica viene crittografata specificamente per Alice
- Se Bob non consegna in tempo, Alice può griefare o annullare

