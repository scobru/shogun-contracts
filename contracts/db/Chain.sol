// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GunOnChain
 * @author Gemini
 * @notice Versione ottimizzata per il gas. Utilizza bytes per le chiavi (soul, key)
 * e bytes per i valori per ridurre significativamente i costi delle transazioni.
 * L'applicazione client può passare stringhe leggibili direttamente.
 */
contract Chain is Ownable {
    // Un Nodo nel nostro grafo.
    struct Node {
        // OTTIMIZZAZIONE: Usiamo bytes per le chiavi e bytes per i valori.
        mapping(bytes => bytes) fields;
        bool exists;
    }

    // OTTIMIZZAZIONE: Il mapping principale ora usa bytes per l'ID del nodo (soul).
    mapping(bytes => Node) private nodes;

    // OTTIMIZZAZIONE: L'evento riflette i nuovi tipi di dati.
    event NodeUpdated(
        bytes value, // Il valore
        bytes soulReadable, // Soul in chiaro per decodifica
        bytes keyReadable // Key in chiaro per decodifica
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Scrive o aggiorna un campo all'interno di un nodo.
     * @dev Le chiavi (soul, key) possono essere stringhe leggibili.
     * @param soul L'ID univoco del nodo (stringa leggibile).
     * @param key La chiave del campo (stringa leggibile).
     * @param value Il valore da assegnare al campo (in formato bytes).
     */
    function put(
        bytes memory soul,
        bytes memory key,
        bytes memory value
    ) public onlyOwner {
        // Un controllo di base per evitare chiavi vuote.
        require(soul.length > 0, "Soul cannot be empty");
        require(key.length > 0, "Key cannot be empty");

        Node storage node = nodes[soul];
        node.fields[key] = value;

        if (!node.exists) {
            node.exists = true;
        }

        emit NodeUpdated(value, soul, key);
    }

    /**
     * @notice Legge il valore di un campo specifico da un nodo.
     * @param soul L'ID del nodo da cui leggere (stringa leggibile).
     * @param key La chiave del campo da leggere (stringa leggibile).
     * @return Il valore del campo in formato bytes.
     */
    function get(
        bytes memory soul,
        bytes memory key
    ) public view returns (bytes memory) {
        require(nodes[soul].exists, "Node does not exist");
        return nodes[soul].fields[key];
    }

    /**
     * @notice Verifica se un nodo esiste nel grafo.
     * @param soul L'ID del nodo da verificare (stringa leggibile).
     * @return true se il nodo esiste, false altrimenti.
     */
    function nodeExists(bytes memory soul) public view returns (bool) {
        return nodes[soul].exists;
    }
}
