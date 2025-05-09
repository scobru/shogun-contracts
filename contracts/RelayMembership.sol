/// @notice RelayMembershipDynamic: subscription fee + dynamic stake-based payout
///         con verifica Merkle-proof di uptime per ogni epoch
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./OracleBridge.sol";

contract RelayMembership {
    uint256 public constant MONTH = 30 days;
    uint256 public pricePerMonth;
    mapping(address => uint256) public expires;

    /// @notice Conserva la public key dell'utente
    mapping(address => bytes) public userPubKey;
    event PubKeySet(address indexed user, bytes pubKey);

    /// @notice Conserva la URL WebSocket Gun di ciascun relay
    mapping(address => string) public relayUrl;
    event RelayJoined(address indexed relay, string url);

    struct RelayInfo {
        uint96 stake;       // stake in wei
        uint256 released;   // amount already paid out
    }
    mapping(address => RelayInfo) public relays;
    address[] public relayIndex;
    uint256 public totalStake;
    uint256 private totalReleased;

    OracleBridge public immutable oracle;
    address public immutable admin;

    event Subscribed(address indexed user, bytes pubKey, uint256 months);
    event Released(address indexed relay, uint256 amount, uint256 epochId);

    constructor(uint256 _priceWei, address _oracle) payable {
        require(_oracle != address(0), "invalid oracle");
        admin = msg.sender;
        pricePerMonth = _priceWei;
        oracle = OracleBridge(_oracle);
    }

    /// @notice Utente paga l'abbonamento e fornisce la propria public key
    function subscribe(uint256 months, bytes calldata pubKey) external payable {
        require(months > 0, "months>0");
        require(msg.value == months * pricePerMonth, "wrong value");
        uint256 base = block.timestamp > expires[msg.sender]
            ? block.timestamp
            : expires[msg.sender];
        expires[msg.sender] = base + months * MONTH;
        emit Subscribed(msg.sender, pubKey, months);

        // salva/aggiorna la public key se fornita
        if (pubKey.length != 0) {
            userPubKey[msg.sender] = pubKey;
            emit PubKeySet(msg.sender, pubKey);
        }
    }

    /// @notice Controlla se l'utente ha subscription ancora valida
    function isActive(address user) external view returns (bool) {
        return expires[user] > block.timestamp;
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

    /// @notice Rilascia payout per un epoch solo se il relay è incluso nella Merkle-root
    function releaseWithProof(uint256 epochId, bytes32[] calldata proof) external {
        RelayInfo storage R = relays[msg.sender];
        require(R.stake > 0, "not relay");

        // Verifica esistenza della root
        bytes32 root = oracle.roots(epochId);
        require(root != bytes32(0), "root not set");

        // Verifica inclusion tramite Merkle-proof
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, epochId));
        require(
            MerkleProof.verify(proof, root, leaf),
            "invalid proof"
        );

        // Calcolo pagamento proporzionale allo stake
        uint256 contractBalance = address(this).balance;
        uint256 totalRecv = contractBalance + totalReleased;
        uint256 payment = (totalRecv * R.stake) / totalStake - R.released;
        require(payment > 0, "nothing to release");

        payment = payment > contractBalance ? contractBalance : payment;

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
        return relayIndex[i];
    }
}
