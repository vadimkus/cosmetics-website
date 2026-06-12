# GENOSYS 2025 Full Audit & EmaraTax Submission Prep — 2026-06-12

## Context

Final pre-submission audit of the 2025 financial statements (Corporate Tax, SBR election) ahead of the 30 September 2026 EmaraTax deadline. Follows the May 2026 sessions where the AED 100,919 cash overstatement was found and corrected (Option C: Cash 166,953 → 66,034; Partners' CA 121,728 → 20,809).

## Audit result: CLEARED FOR SUBMISSION — 16/16 checks PASS

### Section 1 — Bank reconciliation (24 monthly Wio CSVs, 2024+2025, both accounts)
- 2024 closing cash AED 1,548.95 = 2024 BS line 1,549 ✓
- 2025 opening = 2024 closing (continuity) ✓
- 2025 closing: Wio AED 54,281.84 + USD 3,200.00 (≈ AED 11,752 @ 3.6725) = **AED 66,034** = corrected BS Cash ✓

### Section 2 — VAT / FTA payments (all matched to bank outflows to the fils)
| Quarter | Amount | Paid | FTA ref |
|---|---|---|---|
| Q4 2024 | 10,942.49 | 14.01.2025 | n/a |
| Q1 2025 | 15,172.53 | 17.04.2025 | 557239 |
| Q2 2025 | 15,813.16 | 21.07.2025 | 890345 |
| Q3 2025 | 11,578.89 | 08.10.2025 | 200954 |
| Q4 2025 | 14,230.63 | 15.01.2026 | 965723 (= BS VAT Payable 14,231) |
| Q1 2026 | 29,744.83 | 16.04.2026 | 804955 |

### Section 3 — MoySklad live re-pull (12.06.2026)
- Losses 2025: 91 docs, AED 25,193.66 = P&L Inventory Write-offs 25,194 ✓ EXACT
- Demands 2025: 1,300 docs, gross AED 1,584,439 (context only; P&L revenue 1,365,229 is accountant-ledger basis, both « AED 3M SBR threshold)

### Section 4 — Internal arithmetic
- P&L: GP 949,863, Op Profit 11,757 recomputed exact ✓
- BS: TA 169,063 = E+L 169,063 ✓
- RE rollforward: 16,497 + 11,757 = 28,254 ✓

### Signed scans verified visually
- `Doc1.pdf` (07.05.2026) = signed+stamped Balance Sheet, matches corrected figures exactly
- `Doc2.pdf` (07.05.2026) = signed+stamped P&L, matches exactly

## Known reconciling items (disclosed in memo, no action required)
1. **Revenue** 1,365,229 vs MoySklad gross demand 1,584,439 — ledger basis (VAT-exclusive, net of 63,503 returns). No SBR impact.
2. **Owner comp accrual** AED 49,267 unpaid at year-end — confirmed caught up via Q1 2026 bonus payouts (AED 205,904 Jan–Mar 2026).
3. **Korea prepayment** ~AED 161K paid to DTS MG above invoiced purchases — 2026 goods in transit; absorbed in Partners' CA correction.

## Deliverables
- `~/Desktop/Drive/Genosys/Company_Legal/Tax/Corp_Tax/2025/Genosys_Audit_Report_2025.pdf` (2 pages: 16-check table, signed-docs verification, reconciling items, EmaraTax step-by-step checklist, evidence inventory)
- Audit script: `/tmp/genosys-statements-2025/audit_2025.py` (re-runnable)

## EmaraTax filing summary
- TRN 104229886700003, period 01/01/2025–31/12/2025
- Election: **Small Business Relief** → Tax payable **AED 0**
- Revenue to declare: **AED 1,365,229**
- Upload if requested: Doc1.pdf + Doc2.pdf (signed statements)
- Deadline: **30 September 2026**

## Files reference
- Statements: `Genosys_Profit_Loss_2025.pdf`, `Genosys_Balance_Sheet_2025.pdf`, `Genosys_Filing_Memo_2025.pdf` (Corp_Tax/2025 + Books/12)
- Prior session docs: `SESSION_CHANGES_2026-05-06_GIFT_INVENTORY_LOSS_MOYSKLAD.md`
