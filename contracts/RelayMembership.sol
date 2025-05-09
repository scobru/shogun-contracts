/// @notice RelayMembershipDynamic: subscription fee + dynamic stake-based payout
///         con verifica Merkle-proof di uptime per ogni epoch
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./OracleBridge.sol";

contract RelayMembership {
    uint256 public constant MONTH = 30 days;
    uint256 public pricePerMonth;

    struct UserInfo {
        uint256 expires;
        bytes pubKey;
    }

    mapping(address => UserInfo) public userInfoByAddress;
    mapping(bytes => address) public userInfoByPubKey;

    event PubKeySet(address indexed user, bytes pubKey);

    /// @notice Conserva la URL WebSocket Gun di ciascun relay
    mapping(address => string) public relayUrl;
    event RelayJoined(address indexed relay, string url);

    struct RelayInfo {
        uint96 stake; // stake in wei
        uint256 released; // amount already paid out
    }

    mapping(address => RelayInfo) public relays;
    address[] public relayIndex;
    uint256 public totalStake;
    uint256 private totalReleased;

    OracleBridge public oracle;
    address public immutable admin;

    event Subscribed(address indexed user, bytes pubKey, uint256 months);
    event Released(address indexed relay, uint256 amount, uint256 epochId);

    constructor(uint256 _priceWei, address _oracle) payable {
        require(_oracle != address(0), "invalid oracle");
        admin = msg.sender;
        pricePerMonth = _priceWei;
        oracle = OracleBridge(_oracle);
    }

    function getEpochId() external view returns (uint256) {
        return oracle.getEpochId();
    }

    /// @notice Solo admin può aggiornare l'oracle
    function updateOracle(address _oracle) external {
        require(msg.sender == admin, "only admin");
        oracle = OracleBridge(_oracle);
    }

    /// @notice Utente paga l'abbonamento e fornisce la propria public key
    function subscribe(uint256 months, bytes calldata pubKey) external payable {
        require(months > 0, "months>0");
        require(msg.value == months * pricePerMonth, "wrong value");
        uint256 base = block.timestamp > userInfoByAddress[msg.sender].expires
            ? block.timestamp
            : userInfoByAddress[msg.sender].expires;
        userInfoByAddress[msg.sender].expires = base + months * MONTH;
        emit Subscribed(msg.sender, pubKey, months);

        // salva/aggiorna la public key se fornita
        if (pubKey.length != 0) {
            userInfoByAddress[msg.sender].pubKey = pubKey;
            userInfoByPubKey[pubKey] = msg.sender;
            emit PubKeySet(msg.sender, pubKey);
        }
    }

    /// @notice Controlla se l'utente ha subscription ancora valida
    function isActive(address user) external view returns (bool) {
        return userInfoByAddress[user].expires > block.timestamp;
    }

    /// @notice Relay si registra bloccando stake e fornendo la propria URL WebSocket Gun
    function join(string calldata url) external payable {
        require(relays[msg.sender].stake == 0, "already relay");
        require(msg.value > 0, "stake>0");
        relays[msg.sender].stake = uint96(msg.value);
        totalStake += msg.value;
        relayUrl[msg.sender] = url;
        relayIndex.push(msg.sender);
        emit RelayJoined(msg.sender, url);
    }

    // @notice Relay lascia fa unstake e diventa inatttivo
    function leave() external {
        uint256 stake = relays[msg.sender].stake;
        require(stake > 0, "no stake");

        // Update state before transfer to prevent reentrancy
        relays[msg.sender].stake = 0;
        totalStake -= stake;

        // Rimuovi il relay dall'array relayIndex usando swap-and-pop
        uint256 index = findRelayIndex(msg.sender);
        if (index < relayIndex.length) {
            // Sostituzione con l'ultimo elemento e pop
            address lastRelay = relayIndex[relayIndex.length - 1];
            relayIndex[index] = lastRelay;
            relayIndex.pop();
        }

        // Transfer stake back to relay
        (bool ok, ) = msg.sender.call{value: stake}("");
        require(ok, "transfer failed");
    }

    /// @notice Funzione di utilità per trovare l'indice di un relay nell'array
    /// @param relay Indirizzo del relay da cercare
    /// @return L'indice del relay nell'array o relayIndex.length se non trovato
    function findRelayIndex(address relay) internal view returns (uint256) {
        for (uint256 i = 0; i < relayIndex.length; i++) {
            if (relayIndex[i] == relay) {
                return i;
            }
        }
        return relayIndex.length;
    }

    /// @notice Rilascia payout per un epoch solo se il relay è incluso nella Merkle-root
    function releaseWithProof(
        uint256 epochId,
        bytes32[] calldata proof
    ) external {
        RelayInfo storage R = relays[msg.sender];
        require(R.stake > 0, "not relay");

        // Verifica esistenza della root
        bytes32 root = oracle.roots(epochId);
        require(root != bytes32(0), "root not set");

        // Verifica inclusion tramite Merkle-proof
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, epochId));
        require(MerkleProof.verify(proof, root, leaf), "invalid proof");

        // Calcolo pagamento proporzionale allo stake ma escludendo gli stake stessi dal totale
        // Consideriamo solo i fondi da sottoscrizione, non gli stake
        uint256 payableFunds = address(this).balance - totalStake;
        uint256 releasableFunds = payableFunds + totalReleased;

        // Se non ci sono fondi distribuibili, esci
        require(releasableFunds > 0, "no funds to distribute");

        // Calcola la proporzione in base allo stake
        uint256 payment = (releasableFunds * R.stake) / totalStake - R.released;
        require(payment > 0, "nothing to release");

        // Limita il pagamento ai fondi disponibili (esclusi gli stake)
        payment = payment > payableFunds ? payableFunds : payment;

        // Aggiorna stato e trasferisce
        R.released += payment;
        totalReleased += payment;
        (bool ok, ) = msg.sender.call{value: payment}("");
        require(ok, "transfer failed");

        emit Released(msg.sender, payment, epochId);
    }

    /// @notice Solo admin può aggiornare il prezzo
    function setPrice(uint256 newPrice) external {
        require(msg.sender == admin, "only admin");
        pricePerMonth = newPrice;
    }

    /// @notice Riceve i pagamenti dalle subscribe
    receive() external payable {}

    /// @notice Numero di relay registrati
    function getRelayCount() external view returns (uint256) {
        return relayIndex.length;
    }

    /// @notice Indirizzo del relay all'indice i
    function getRelayAt(uint256 i) external view returns (address) {
        require(i < relayIndex.length, "index out of bounds");
        return relayIndex[i];
    }

    function getUserInfo(
        address user
    ) external view returns (uint256 expires, bytes memory pubKey) {
        return (
            userInfoByAddress[user].expires,
            userInfoByAddress[user].pubKey
        );
    }

    function authorizedAddress(address user) external view returns (bool) {
        if (userInfoByAddress[user].expires == 0) {
            return false;
        }
        return userInfoByAddress[user].expires > block.timestamp;
    }

    function isAuthorized(bytes calldata pubKey) external view returns (bool) {
        if (userInfoByPubKey[pubKey] == address(0)) {
            return false;
        }
        address addr = userInfoByPubKey[pubKey];
        return userInfoByAddress[addr].expires > block.timestamp;
    }
}
