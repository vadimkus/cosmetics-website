# Warehouse write-off — expired Power Solution SWS vials (00020)

**Date:** 2026-07-13  
**Script:** `scripts/moysklad-create-sws-expired-writeoff-20260713.js --commit`

## Context

All expired SWS ampoules in Genosys Warehouse — user ordered replacement stock from Korea.

## Stock before

| Code | Product | Genosys Warehouse |
|------|---------|-------------------|
| `00020` | Power Solution SWS 1 Vial 2ml | **66 vials** |

No SWS box stock (`00019`).

## Loss posted

| Type | Number | ID | Qty | buyPrice | Total |
|------|--------|----|-----|----------|-------|
| Списание (loss) | **00008-00470** | `1e20b877-7e97-11f1-0a80-0b8b00768a40` | **66** | 8.22 | **542.52 AED** |

Description: expired SWS vials — replaced by new Korea order.

## Link

- [Loss 00008-00470](https://online.moysklad.ru/app/#loss/edit?id=1e20b877-7e97-11f1-0a80-0b8b00768a40)

## Prior SWS write-offs (reference)

| Loss | Date | SWS qty |
|------|------|---------|
| 00008-00465 | 2026-07-08 | 10 (mixed promo) |
| 00008-00451 | 2026-06-28 | 20 (expired batch) |
| 00008-00445 | 2026-06-15 | 15 (expired gifts) |

## Verified (2026-07-13)

User confirmed in MoySklad UI: **00020** and **00019** both show **0** stock on Genosys Warehouse after loss **00470** was conducted.
