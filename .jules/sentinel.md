## 2025-02-17 - Uninitialized Implementation Contract
**Vulnerability:** The DataSaleEscrow implementation contract could be initialized by anyone, potentially allowing them to claim ownership or misuse it (though impact was low due to no selfdestruct).
**Learning:** Locking implementation contracts (e.g. escrow.createdAt = 1 in constructor) breaks tests that deploy the implementation directly. Tests must be refactored to use the factory/clone pattern.
**Prevention:** Always disable initializers in implementation constructors and write tests against clones/proxies, not the implementation contract itself.
