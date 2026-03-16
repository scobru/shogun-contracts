/**
 * Common ABIs for Shogun Protocol
 *
 * Exports commonly used ABIs for ERC20 tokens and other contracts
 */
export declare const ERC20_ABI: readonly ["function approve(address spender, uint256 amount) returns (bool)", "function allowance(address owner, address spender) view returns (uint256)", "function balanceOf(address account) view returns (uint256)", "function decimals() view returns (uint8)", "function transfer(address to, uint256 amount) returns (bool)", "function transferFrom(address from, address to, uint256 amount) returns (bool)"];
export declare const USDC_EIP3009_ABI: readonly [{
    readonly inputs: readonly [{
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly name: "value";
        readonly type: "uint256";
    }, {
        readonly name: "validAfter";
        readonly type: "uint256";
    }, {
        readonly name: "validBefore";
        readonly type: "uint256";
    }, {
        readonly name: "nonce";
        readonly type: "bytes32";
    }, {
        readonly name: "v";
        readonly type: "uint8";
    }, {
        readonly name: "r";
        readonly type: "bytes32";
    }, {
        readonly name: "s";
        readonly type: "bytes32";
    }];
    readonly name: "transferWithAuthorization";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "balanceOf";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "decimals";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint8";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
//# sourceMappingURL=abis.d.ts.map