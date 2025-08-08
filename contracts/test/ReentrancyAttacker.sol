// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../relay/RelayPaymentRouter.sol";

// This contract is designed to be the owner of RelayPaymentRouter
// to test for reentrancy vulnerabilities in owner-only functions.
contract OwnerAttacker {
    RelayPaymentRouter public router;
    uint256 public callCount = 0;

    constructor(address payable _routerAddress) {
        router = RelayPaymentRouter(_routerAddress);
    }

    // The main attack vector: start the withdrawal process.
    function attack() external {
        router.withdrawFees();
    }

    // The receive function is triggered when the router transfers fees.
    // It attempts to re-enter the withdrawFees function, draining the contract.
    receive() external payable {
        callCount++;
        // Directly attempt to re-enter. This should be blocked by the guard.
        router.withdrawFees();
    }
}
