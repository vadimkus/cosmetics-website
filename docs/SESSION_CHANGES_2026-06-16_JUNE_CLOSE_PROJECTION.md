# June 2026 close projection (run rate to 30 Jun)

**As of:** 2026-06-16 (MoySklad)  
**Script:** `scripts/moysklad-ytd-profitability.js`

## June MTD (1–16 Jun)

| Metric | AED |
|---|---:|
| Revenue ex VAT | 113,602 |
| Gross profit ex VAT | 76,080 (67.0%) |
| Operating opex | 55,783 |
| Write-offs | 1,888 |
| **Net clean** | **+18,409** |

Already in opex: salary 25k, sales bonus 16k, rent 14.2k, mobile 505, DM import 70.

## May 2026 (full month benchmark)

| Metric | AED |
|---|---:|
| Revenue ex VAT | 150,881 |
| Gross profit ex VAT | 103,164 (68.4%) |
| Operating opex | 94,345 |
| Write-offs | 3,705 |
| **Net clean** | **+5,114** |

May opex not yet seen in June MTD: shipment cost ~23k, extra bonus ~19k, DEWA/MOFA ~1.8k.

## June 30 scenarios

| Scenario | Gross profit | Opex | Write-offs | **Net clean** |
|---|---:|---:|---:|---:|
| **Base (recommended)** — sales run-rate, May-like opex | 142,650 | 94,345 | 3,520 | **+44,785** |
| Conservative — run-rate sales + 7% higher opex | 142,650 | 100,949 | 3,705 | **+38,000** |
| Floor — sales only reach May level | 103,164 | 94,345 | 3,705 | **+5,100** |

Run-rate revenue ex VAT at 30 Jun: **~213k** (+41% vs May).

## YTD context (1 Jan – 16 Jun)

Net clean **−58,650** (Jan–May was **−77,059**; June MTD **+18,409** pulls YTD up). Books moved vs early-June snapshot after Slider/recon paymentouts were posted.

## Update 2026-06-18 (18 days elapsed)

| Metric | AED |
|---|---:|
| Revenue ex VAT | 125,306 |
| Gross profit ex VAT | 84,174 (67.2%) |
| Operating opex | 57,629 |
| Write-offs | 2,680 |
| **Net clean MTD** | **+23,864** |

vs Jun 16 snapshot (+18,409): **+5,455** from 2 extra days of sales + DEWA/DU booked.

**Still profitable in June — yes.** Pace is ahead of May on revenue (~125k ex VAT in 18d vs May full month 151k).

**YTD (1 Jan – 18 Jun):** net clean **−53,195** (June MTD profit pulling YTD up from −58,650 on 16 Jun).

**Watch before month-end:** ~~DTS shipment cost (~23–25k)~~ **superseded** — see correction 2026-06-23 (Korea **58.1k only**, no extra shipment opex). **No June sales bonus** (user confirmed) — the **16k** already in June opex is **May bonus paid in June** (00611 + 00626), not a forward liability.

## Revised June 30 (no June bonus)

| Item | AED |
|---|---:|
| Gross profit (run-rate, 30d) | ~140,300 |
| Opex — booked 18 Jun | 57,629 |
| Opex — shipment still expected | ~~**~25,000**~~ **0** (corrected 23 Jun — no separate DTS shipment PO) |
| Opex — June sales bonus | **0** |
| **Total opex est.** | **~82,600** |
| Write-offs (est.) | ~3,500 |
| **Net clean est.** | **~+54,000** |

Better than prior May-like opex case (+45k) because **~19k June bonus** is off the table.

- Cordoba rent booked in MoySklad but paid from owner personal account.
- Consignment-heavy sales can front-load margin; H2 Jun may be lighter than linear run-rate.

## Update 2026-06-21 (21 days elapsed)

Live MoySklad pull (`moysklad-ytd-profitability.js --from 2026-06-01 --to 2026-06-21`):

| Metric | AED |
|---|---:|
| Revenue ex VAT | 130,449 |
| Gross profit ex VAT | 87,754 (67.3%) |
| Operating opex | 57,629 |
| Write-offs | 2,813 |
| **Net clean MTD** | **+27,311** |

**Yes — profitable in June.** Already **+27k** net clean with 9 days left. May full month was only **+5,114**.

**Still to hit June books:** ~~DTS shipment cost **~23–25k**~~ **None** — Korea stock **58.1k** only (already paid as inventory). No June sales bonus (16k in opex = May bonus paid in June).

**Rough month-end net (if sales pace holds, shipment posts):** gross ~125–140k − opex ~83k − write-offs ~3.5k → **~+38k to +54k**.

**Cash note:** AED 58k stock purchase in June is inventory (excluded from P&L); cash net MTD **+43k** after all outflows.

## Update 2026-06-23 (23 days elapsed)

Live MoySklad pull (`moysklad-ytd-profitability.js --from 2026-06-01 --to 2026-06-23`):

| Metric | AED |
|---|---:|
| Revenue ex VAT | 141,944 |
| Gross profit ex VAT | 95,397 (67.2%) |
| Operating opex | 58,034 |
| Write-offs | 3,068 |
| **Net clean MTD** | **+34,296** |

**Yes — profitable in June.** **+34.3k** net clean with **7 days left** (May full month was **+5.1k**).

**Cash:** collected **169.6k**, paid **117.5k** (incl. **58.1k** inventory) → **+52.1k** cash net MTD.

**Stock funding (user):**
- **58.1k** Korea reorder (3 Jun) — **already paid** (PO fully paid/received).
- **55.4k** **`DM GME 260616 ship`** (Jul air) — **upcoming**; fund from **~34k net clean + ~21k owner cash** when T/T due. P&L = inventory, not opex.

## Correction 2026-06-23 — funding the **55.4k** shipping PO (not extra shipment opex)

**Obsolete:** prior notes on **~23–25k DTS shipment cost** as a separate June opex line.

**PO picture (MoySklad supplier orders):**

| PO | Sum AED | Paid | Received | Status |
|---|---:|---:|---:|---|
| **DM GME 260616 ship** (23 Jun) | **55,453.23** | 0 | 0 | **Upcoming** — July air shipment; T/T when due |
| Korea reorder PI 260605 (3 Jun) | **58,129.35** | **58,129.35** | **58,129.35** | **Done** — already paid & received |

**Funding plan (user):** when **55.4k** PO is paid → **June net clean (~34k) + owner cash (~21k)**.

- **58.1k** — already settled (inventory in / payment posted).
- **55.4k** — **not yet paid**; this is the one to fund from profit + personal money when Korea invoices/T/T.
- Old partial proforma **`DM GME 260616`** — deleted; authoritative PO is **`DM GME 260616 ship`** only.

**June P&L impact:** the **55.4k** will hit books as **stock purchase** (inventory), **not operating opex** — same as 58.1k. Net clean **+34.3k** MTD is **not** reduced by stock payments on the P&L line; cash will drop when T/T posts.

**Month-end net clean (7 days left):** still **~+42k to +45k** on operations — no hidden **−25k opex**; the **55k** is a **future cash/inventory** event, not a missing June expense accrual.

## Update 2026-06-25 (25 days elapsed) — sales pace slowed

Live MoySklad pull (`moysklad-ytd-profitability.js --from 2026-06-01 --to 2026-06-25`):

| Metric | AED |
|---|---:|
| Revenue ex VAT | 144,245 |
| Gross profit ex VAT | 96,950 (67.2%) |
| Operating opex | 58,034 |
| Write-offs | 3,068 |
| **Net clean MTD** | **+35,848** |
| **Cash net MTD** | **+60,007** |

**Still profitable in June — yes.** Fixed opex (salary 25k, May bonus 16k, rent 14.2k) already on books; **+35.8k net clean with 5 days left** → month-end **~+42k to +48k** if pace holds.

### Sales drop (recent)

| Window | Rev ex VAT | Days | **Daily rate** | Net clean |
|---|---:|---:|---:|---:|
| Jun 1–17 | 120,151 | 17 | **7,068/day** | +23,015 |
| Jun 18–25 | 24,095 | 8 | **3,012/day** | +12,833* |
| May (full) | 150,881 | 31 | 4,867/day | ~0** |

\* Jun 18–25 net looks good because almost no new opex landed that week (opex front-loaded early month).  
\** May net clean ~0 on live pull (expense timing); structurally similar gross, tighter after opex.

**Revenue run-rate down ~57%** vs early-June daily pace — user observation confirmed. Margin unchanged (~67%); this is **volume**, not pricing/mix collapse.

### YTD (1 Jan – 25 Jun)

| Net clean | **−46,281** |
| Cash net | **−64,742** |

June **+35.8k** is pulling YTD up (was **−53k** on 18 Jun). **H1 still net-negative on books**; need Jul–Aug at June-like levels to flip YTD.

## Update 2026-06-28 (28 days elapsed)

Live MoySklad pull (`moysklad-ytd-profitability.js --from 2026-06-01 --to 2026-06-28`):

| Metric | AED |
|---|---:|
| Revenue ex VAT | 155,531 |
| Gross profit ex VAT | 104,151 (67.0%) |
| Operating opex | 61,473 |
| Write-offs | 3,068 |
| **Net clean MTD** | **+39,611** |
| **Cash net MTD** | **+65,883** |

**Yes — profitable in June.** Already **+39.6k** net clean with **2–3 days left** → month-end likely **~+40k to +45k** if no large surprise opex.

vs May full month: revenue **155.5k vs 150.9k** (June wins); May net clean on live pull **−270** (expense timing).

**YTD (1 Jan – 28 Jun):** net clean **−42,106**; cash net **−58,866**. June is the month pulling H1 toward breakeven.

Opex note: Sales Bonus bucket now **19.3k** in June (was 16k on 25 Jun snapshot) — likely additional bonus payment posted.

### Cash / stock (unchanged)

- **58.1k** Korea stock — paid (inventory, not opex).
- **55.4k** `DM GME 260616 ship` — upcoming T/T; fund from **~36k June profit + ~19k owner cash**.

## Update 2026-06-30 (month closed)

Live MoySklad pull (`moysklad-ytd-profitability.js --from 2026-06-01 --to 2026-06-30`):

| Metric | AED |
|---|---:|
| Revenue ex VAT | 164,962 |
| Gross profit ex VAT | 110,279 (66.9%) |
| Operating opex | 70,473 |
| Write-offs | 3,994 |
| **Net clean** | **+35,811** |
| **Cash net** | **+77,288** |

**Yes — June closed profitable.** **+35.8k** net clean (May full month was **~+5k** on comparable basis). Revenue **165k ex VAT** vs May **151k**.

**YTD (1 Jan – 30 Jun):** run `moysklad-ytd-profitability.js --from 2026-01-01 --to 2026-06-30` for H1 close — June profit pulls YTD toward breakeven (was **−42k** through 28 Jun).
