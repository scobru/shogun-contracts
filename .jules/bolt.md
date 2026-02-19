## 2024-05-22 - Storage Packing Optimization
**Learning:** Significant gas savings (48k gas / ~17%) achieved by packing struct fields in `DataSaleEscrow`. Using `uint64` for timestamps and `uint32` for durations allows packing multiple variables into a single 32-byte storage slot.
**Action:** Always review struct layouts for packing opportunities, especially for contracts that are deployed frequently (like proxies).

## 2024-05-22 - ABI Compatibility with Storage Optimization
**Learning:** Optimizing storage layout by reordering struct fields breaks the ABI if the struct is exposed via a public variable.
**Action:** When optimizing storage layout for existing public structs:
1.  Rename the optimized struct (e.g., `StructStorage`).
2.  Keep the original struct definition (e.g., `Struct`) for the interface.
3.  Use `StructStorage` for state variables (`internal`).
4.  Implement a manual `view` function that returns the fields in the original order (or returns the original struct populated from storage).
