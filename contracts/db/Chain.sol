// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GunOnChain
 * @author Gemini
 * @notice Versione ottimizzata per il gas. Utilizza bytes32 per le chiavi (soul, key)
 * e bytes per i valori per ridurre significativamente i costi delle transazioni.
 * L'applicazione client DEVE calcolare l'hash (es. keccak256) delle chiavi prima di chiamare il contratto.
 */
contract Chain is Ownable {

    // Un Nodo nel nostro grafo.
    struct Node {
        // OTTIMIZZAZIONE: Usiamo bytes32 per le chiavi e bytes per i valori.
        mapping(bytes32 => bytes) fields;
        bool exists;
    }

    // OTTIMIZZAZIONE: Il mapping principale ora usa bytes32 per l'ID del nodo (soul).
    mapping(bytes32 => Node) private nodes;

    // OTTIMIZZAZIONE: L'evento riflette i nuovi tipi di dati.
    event NodeUpdated(
        bytes32 indexed soul, // L'ID del nodo aggiornato
        bytes32 indexed key,  // La chiave del campo aggiornato
        bytes value          // Il nuovo valore
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Scrive o aggiorna un campo all'interno di un nodo.
     * @dev Le chiavi (soul, key) devono essere pre-hashate off-chain (es. keccak256("my_soul")).
     * @param soul L'ID univoco del nodo (hash a 32 byte).
     * @param key La chiave del campo (hash a 32 byte).
     * @param value Il valore da assegnare al campo (in formato bytes).
     */
    function put(bytes32 soul, bytes32 key, bytes memory value) public onlyOwner {
        // Un controllo di base per evitare chiavi vuote.
        require(soul != bytes32(0), "Soul cannot be empty");
        require(key != bytes32(0), "Key cannot be empty");

        Node storage node = nodes[soul];
        node.fields[key] = value;
        
        if (!node.exists) {
            node.exists = true;
        }

        emit NodeUpdated(soul, key, value);
    }

    /**
     * @notice Legge il valore di un campo specifico da un nodo.
     * @param soul L'ID del nodo da cui leggere (hash a 32 byte).
     * @param key La chiave del campo da leggere (hash a 32 byte).
     * @return Il valore del campo in formato bytes.
     */
    function get(bytes32 soul, bytes32 key) public view returns (bytes memory) {
        require(nodes[soul].exists, "Node does not exist");
        return nodes[soul].fields[key];
    }
    
    /**
     * @notice Verifica se un nodo esiste nel grafo.
     * @param soul L'ID del nodo da verificare (hash a 32 byte).
     * @return true se il nodo esiste, false altrimenti.
     */
    function nodeExists(bytes32 soul) public view returns (bool) {
        return nodes[soul].exists;
    }
}
