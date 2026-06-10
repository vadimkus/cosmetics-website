# The Hideaway For Women Salon — customer order (2026-05-07)

## Order

| Field | Value |
|--------|--------|
| **Name** | `GENCardM2605071059` |
| **ID** | `f243bc1a-4924-11f1-0a80-17ba003c5402` |
| **Total** | **1,845.00 AED** VAT-inclusive (MoySklad list prices) |
| **Counterparty** | The Hideaway For Women Salon (`a0b08c72-ad6a-11ef-0a80-0d890079985b`) |
| **UI** | https://online.moysklad.ru/app/#customerorder/edit?id=f243bc1a-4924-11f1-0a80-17ba003c5402 |

## Lines

| Code | Product | Qty |
|------|---------|-----|
| 00195 | Moisture Replenishing Hyaluron Serum 30ml | 1 |
| 00021 | Snow O₂ Cleanser 180ml | 2 |
| 00025 | Snow Booster Toner **1000ml** | 1 |
| 54457 | Ultra Shield Sun Cream SPF50/PA++++ 50g | 1 |
| 00069 | Power Solution CTS 1 Vial 2ml | 10 |
| 00067 | Power Solution CVS 1 Vial 2ml | 10 |
| 54467 | Skin Reboot PDRN mask Pack (30 sheets) | 2 |

## Mapping notes

1. **Snow Booster 500ml:** MoySklad has only **200ml** (`00022`) and **1000ml** (`00025`). The order uses **1000ml ×1** and the document description notes the mismatch. Switch to 200ml if the salon intended the smaller size.
2. **Multi Sun SPF 50+ PA++++:** Mapped to **Ultra Shield** `54457` (SPF50/PA++++). *Multi Sun SPF40* in the catalogue is a different SKU (`00041`).

## Script

`scripts/moysklad-create-hideaway-order-20260507.js`
