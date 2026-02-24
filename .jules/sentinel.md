## 2024-05-23 - Indefinite Fund Locking in Escrow
**Vulnerability:** Buyers could lock seller funds indefinitely by never calling `complete` or `grief` after data submission.
**Learning:** Escrow systems must always have a default action or timeout mechanism for every state transition to prevent indefinite stalling.
**Prevention:** Implement `claimPayment` (for seller) or `autoRefund` (for buyer) with time-locks for all intermediate states.
