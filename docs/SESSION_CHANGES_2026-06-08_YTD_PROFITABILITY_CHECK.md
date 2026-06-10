# YTD Profitability Check — 2026-01-01 to 2026-06-07

Date checked: 2026-06-08 (data through 2026-06-07 23:59:59 UAE)

Source: MoySklad read-only API — `report/profit/bycounterparty`, `paymentout`/`cashout`, `paymentin`/`cashin`, `loss`.

Script: `scripts/moysklad-ytd-profitability.js`

Methodology: same as [May 16 financial check](./SESSION_CHANGES_2026-05-16_MONTH_TO_DATE_FINANCIAL_CHECK.md) — gross profit ex VAT from profit report; operating opex = all payment-outs minus stock purchases (expense item «Закупка товаров» / Goods purchase) minus tax remittances; net = gross profit − operating opex − write-offs.

## YTD 2026 (Jan 1 – Jun 7)

| Metric | AED |
|---|---:|
| Revenue incl. VAT | 821,714 |
| Revenue excl. VAT | 782,585 |
| COGS | 252,892 |
| **Gross profit excl. VAT** | **529,692** |
| Gross margin excl. VAT | 67.7% |
| Units sold | 8,073 |
| Total payment-outs | 905,993 |
| Stock purchases (excluded) | 320,951 |
| VAT/tax remittances (excluded) | 44,005 |
| Operating opex | 541,036 |
| Write-offs/losses | 20,082 |
| **Net clean money** | **-31,426** |
| Cash in | 863,645 |
| Cash out | 905,993 |
| Cash net | -42,348 |

## Answer

- **Gross level:** Yes — AED 529.7k gross profit, ~67.7% margin.
- **Net / EBITDA-like:** No — AED -31.4k after operating opex and write-offs (bonuses/payroll ~344k YTD dominate opex).
- **Cash:** Negative — AED -42.3k net (stock purchases AED 321k are inventory, not P&L).

## Trend vs May 16 YTD snapshot

May 16 doc (Jan 1 – May 16): gross profit AED 454,205, net clean **-73,935**.

Recalculated May 16 window with same script: gross AED 456,226, net **-35,801** (small revenue delta vs doc; stock-exclusion bucket differs from manual May pull).

Jun 7 vs script May 16 baseline:

| | May 16 | Jun 7 | Change |
|---|---:|---:|---:|
| Revenue ex VAT | 673,846 | 782,585 | +16% |
| Gross profit ex VAT | 456,226 | 529,692 | +16% |
| Operating opex | 474,082 | 541,036 | +14% |
| Net clean | -35,801 | -31,426 | +4,375 |

Net loss is narrowing; gross margin stable ~68%. Still not net-profitable YTD because bonus/payroll + rent + logistics exceed the gap between gross profit and opex growth.
