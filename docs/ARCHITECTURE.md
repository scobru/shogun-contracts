# Architettura Modulare - Shogun Contracts

## Panoramica

L'architettura è stata separata in moduli distinti per responsabilità chiare:

1. **ShogunRelayRegistry** - Registro centrale per relays e users
2. **StorageDealRegistry** - Gestione storage deals
3. **DataPostRegistry** - Pubblicazione e discovery di data posts
4. **DataSaleEscrow** (+ Factory) - Escrow per vendita dati criptati

## 1. ShogunRelayRegistry

**Responsabilità:**
- Registrazione relays (con endpoint) e users (senza endpoint)
- Gestione stake per relays e users
- Griefing generale (senza contesto deal)
- Chiavi di crittografia (pubkey/epub) per tutti i partecipanti

**Caratteristiche:**
- Struttura unificata `ParticipantInfo` per relays e users
- Endpoint vuoto ("") = user, endpoint presente = relay
- Griefing per users: `griefUser()`
- Griefing generico per relays: può essere chiamato da contratti esterni

## 2. StorageDealRegistry

**Responsabilità:**
- Registrazione storage deals (solo relays attivi)
- Gestione client stake per migliorare griefing ratio
- Lifecycle dei deals (completed, expired)
- Griefing per storage deals (con contesto deal)

**Integrazione con Registry:**
- Verifica relay attivo via `registry.isActiveRelay()`
- Per griefing: chiama `registry.grief()` che gestisce slashing

**Deal Structure:**
```solidity
struct StorageDeal {
    bytes32 dealId;
    address relay;
    address client;
    string cid;           // IPFS CID
    uint256 sizeMB;
    uint256 priceUSDC;
    uint256 createdAt;
    uint256 expiresAt;
    bool active;
    uint256 clientStake;  // Per migliorare griefing ratio
}
```

## 3. DataPostRegistry

**Responsabilità:**
- Pubblicazione data posts per vendita
- Discovery per categoria/seller
- Metadati: description, category, price

**Integrazione:**
- Usato da `DataSaleEscrow` per recuperare info post
- Indipendente dai storage deals (dati venduti, non storage)

## 4. DataSaleEscrow (+ Factory)

**Responsabilità:**
- Escrow per vendita dati criptati
- Integrazione con registry per verificare seller (relay o user)
- Griefing del seller se problema

**Flow:**
1. Buyer crea escrow per DataPost
2. Buyer deposita pagamento
3. Seller crittografa dati per buyer e invia encryptedSymKey
4. Buyer verifica e completa, oppure griefs

## Flusso di Griefing

### Per Storage Deals:
```
Client → StorageDealRegistry.grief(dealId, slashAmount, reason)
    → Verifica deal attivo, client corretto
    → Calcola griefing ratio (basato su client stake)
    → Registry.grief(relay, slashAmount, reason, griefingRatio, dealId)
        → Verifica relay attivo
        → Slash relay stake
        → Genera report
```

### Per Users (Data Sale):
```
Buyer → DataSaleEscrow.grief(slashAmount, dealId, reason)
    → Refund buyer
    → Se seller è relay: Registry.grief(...)
    → Se seller è user: Registry.griefUser(...)
```

## Vantaggi della Separazione

1. **Ruoli Chiari**: Ogni contratto ha una responsabilità specifica
2. **Manutenibilità**: Modifiche isolate per modulo
3. **Testabilità**: Test separati per ogni modulo
4. **Upgradeability**: Possibilità di aggiornare moduli indipendentemente
5. **Gas Efficiency**: Solo il necessario per ogni operazione

## Dipendenze

```
StorageDealRegistry
    └──> ShogunRelayRegistry (verifica relay attivo, griefing)

DataSaleEscrow
    └──> ShogunRelayRegistry (verifica seller, griefing)
    └──> DataPostRegistry (recupera info post)

DataPostRegistry
    └──> (indipendente)
```

## Prossimi Passi

- [ ] Rimuovere logica storage deals da ShogunRelayRegistry
- [ ] Creare interfaccia per griefing cross-contract
- [ ] Aggiornare test per nuova architettura
- [ ] Documentare migrazione da vecchia a nuova struttura

