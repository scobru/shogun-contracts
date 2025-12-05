# Data Sale Flow - Sistema di Vendita Dati Crittografati

## Panoramica

Sistema per la vendita di dati crittografati ispirato a Erasure Protocol, integrato con Shogun Registry.

## Flusso Completo

### Scenario: Alice cerca dati, Bob li possiede e li vende

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: BOB PUBBLICA I DATI DISPONIBILI                 │
│                                                         │
│ Bob ha dati "X" che vuole vendere:                     │
│   1. Bob prepara i dati                                │
│   2. Crea proofhash (hash dei dati + salt)              │
│   3. Upload dati CRIPTATI su IPFS                       │
│   4. Pubblica DataPost on-chain                        │
│                                                         │
│ DataPost contiene:                                      │
│   - proofhash (hash dei dati)                           │
│   - encryptedDataHash (CID IPFS dei dati criptati)      │
│   - description (descrizione dati)                      │
│   - price (prezzo in USDC)                              │
│   - seller (Bob address)                                │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 2: ALICE CERCA E TROVA I DATI                      │
│                                                         │
│ Alice:                                                  │
│   1. Cerca nel DataPostRegistry                        │
│   2. Filtra per categoria/descrizione                  │
│   3. Trova DataPost di Bob                             │
│   4. Vede:                                              │
│      - Descrizione dati                                │
│      - Prezzo: 10 USDC                                 │
│      - Seller: 0xBob...                                │
│      - Reputazione seller                              │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 3: ALICE CREA ESCROW PER COMPRARE                  │
│                                                         │
│ Alice:                                                  │
│   1. Ottiene pubkey/epub di Bob dal registry           │
│   2. Factory.createEscrow(                              │
│        postId,                                          │
│        seller: 0xBob,                                   │
│        price: 10 USDC                                   │
│      )                                                  │
│   3. Escrow creato e registrato                         │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 4: BOB ASSOCIA STAKE ALL'ESCROW                    │
│                                                         │
│ Bob (seller):                                           │
│   1. Ha già stake nel registry (1000 USDC)             │
│   2. Escrow usa lo stake esistente come backing         │
│   3. Escrow verifica Bob è registrato                   │
│                                                         │
│ Oppure Bob deposita stake specifico per questo escrow:  │
│   escrow.depositSellerStake(amount)                     │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 5: ALICE DEPOSITA PAGAMENTO                        │
│                                                         │
│ Alice:                                                  │
│   1. Approva USDC per escrow                           │
│   2. escrow.depositPayment(10 USDC)                    │
│   3. Fondi vanno in escrow                              │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 6: ALICE FINALIZZA ESCROW                          │
│                                                         │
│ Alice:                                                  │
│   1. escrow.finalize()                                 │
│   2. Crea griefing agreement                            │
│   3. Escrow passa a ACTIVE                              │
│   4. Inizia countdown per consegna                      │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 7: BOB CRITTOGRAFA DATI PER ALICE                  │
│                                                         │
│ Bob:                                                    │
│   1. Ottiene pubkey/epub di Alice dal registry         │
│      registry.getUserInfo(0xAlice...)                  │
│   2. Carica dati originali (non ancora pubblici)        │
│   3. Crittografa dati per Alice:                        │
│      - Crea chiave simmetrica SymKey                    │
│      - Encrypt dati con SymKey                          │
│      - Encrypt SymKey con pubkey di Alice               │
│   4. Upload su IPFS:                                    │
│      - encryptedData (crittografato con SymKey)         │
│      - encryptedSymKey (crittografato per Alice)        │
│   5. Invia encryptedSymKey ad escrow:                   │
│      escrow.submitData(encryptedSymKeyHash)             │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 8: ALICE RICEVE E DECRIPTA DATI                    │
│                                                         │
│ Alice:                                                  │
│   1. Escrow notifica: dati disponibili                  │
│   2. Alice recupera:                                    │
│      - encryptedSymKey da escrow                        │
│      - encryptedData da IPFS                            │
│   3. Alice decripta:                                    │
│      - SymKey = decrypt(encryptedSymKey, alice.privkey) │
│      - Data = decrypt(encryptedData, SymKey)            │
│   4. Alice verifica hash dati                           │
│   5. Se OK → completa escrow                            │
└─────────────────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
   ┌────────┐            ┌──────────────┐
   │  OK    │            │   PROBLEMA   │
   │        │            │              │
   │ Alice  │            │ Alice può    │
   │completa│            │ griefare Bob │
   │ escrow │            │              │
   │        │            │ escrow.grief │
   │ Fondi  │            │ (slashAmount)│
   │ a Bob  │            │              │
   └────────┘            └──────────────┘
```

## Dettagli Tecnici

### 1. DataPost (simile a Erasure Post)

```solidity
struct DataPost {
    bytes32 postId;              // ID univoco
    address seller;              // Chi vende (Bob)
    bytes32 proofHash;           // Hash dei dati originali (SHA256)
    string encryptedDataHash;    // CID IPFS dati crittografati
    string description;          // Descrizione dati
    uint256 priceUSDC;          // Prezzo
    uint256 createdAt;          // Quando pubblicato
    bool active;                // Se ancora disponibile
}
```

### 2. DataSaleEscrow

```solidity
struct EscrowState {
    bytes32 postId;             // DataPost correlato
    address seller;             // Bob
    address buyer;              // Alice
    uint256 priceUSDC;         // Prezzo
    bytes32 encryptedSymKeyHash; // Hash della chiave simmetrica criptata
    Status status;              // PENDING, ACTIVE, COMPLETED, DISPUTED
    uint256 countdownEnd;       // Fine countdown per consegna
}
```

### 3. Flusso di Crittografia

```
Bob prepara dati:
  rawData → SymKey.encrypt() → encryptedData → IPFS
  SymKey → Alice.pubkey.encrypt() → encryptedSymKey → Escrow

Alice riceve:
  encryptedSymKey (da escrow) → Alice.privkey.decrypt() → SymKey
  encryptedData (da IPFS) → SymKey.decrypt() → rawData
```

## Vantaggi

1. **Discovery on-chain**: Tutti possono cercare dati disponibili
2. **Trustless**: Escrow gestisce tutto on-chain
3. **Encrypted**: Dati crittografati end-to-end
4. **Griefing**: Alice può punire Bob se non consegna
5. **Integrazione**: Usa registry esistente per chiavi/stake

