# SDK Build Instructions

## Compilazione

L'SDK TypeScript viene compilato in JavaScript per essere utilizzato in progetti Node.js.

### Build manuale

```bash
npm run build:sdk
```

I file compilati vengono generati in `sdk/dist/`.

### Build automatica

La build viene eseguita automaticamente prima della pubblicazione del package tramite lo script `prepublishOnly`.

## Struttura dei file compilati

```
sdk/dist/
├── index.js              # Entry point principale
├── index.d.ts            # Type definitions
├── config.js             # Configurazione
├── deployments.js        # Wrapper per deployments
├── types.js              # Tipi TypeScript
└── contracts/            # Classi dei contratti
    ├── BaseContract.js
    ├── RelayRegistry.js
    ├── StorageDealRegistry.js
    └── ...
```

## Import

Dopo la compilazione, l'SDK può essere importato come:

```javascript
import { ShogunSDK } from 'shogun-contracts/sdk';
```

Il package.json esporta automaticamente i file compilati da `sdk/dist/`.

