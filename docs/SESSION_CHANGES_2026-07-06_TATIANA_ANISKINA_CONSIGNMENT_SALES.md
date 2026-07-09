# Tatiana Aniskina Nail Master — consignment sales (2026-07-06)

**Customer:** Tatiana Aniskina Nail Master (`603f398e-bd3d-11eb-0a80-00570009cb13`)  
**Agreement:** **00025**  
**Script:** `scripts/moysklad-create-tatiana-aniskina-commission-report-20260706.js --commit`

## Commission report

| Doc | Number | AED | Status |
|-----|--------|----:|--------|
| Полученный отчёт комиссионера | **01401** | 520.00 | **paid** |
| Payment in | **05895** | 520.00 | linked to 01401 |

- [Report 01401](https://online.moysklad.ru/app/#commissionreport/edit?id=357f9cab-7929-11f1-0a80-1a69007c55f0)
- [Payment in 05895](https://online.moysklad.ru/app/#paymentin/edit?id=211c3032-792b-11f1-0a80-1e23007e1623)

**Payment script:** `scripts/moysklad-create-tatiana-aniskina-paymentin-01401-20260706.js --commit`

## Sold lines (clinic prices)

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| 00191 | Multi Functional Anti-Wrinkle Serum 30ml | 1 | 165.00 | 165.00 |
| 54458 | Moisture Replenishing Hyaluron Cream 50g | 1 | 145.00 | 145.00 |
| 00123 | Multi Vita Radiance Cream 230g | 1 | 210.00 | 210.00 |
| | | | **Total** | **520.00** |

**Note:** User requested “Multi Vita cream 250g” — mapped to **`00123`** (230g jar in MoySklad). Hyaluron cream qty assumed **×1** (not specified in message).

**Product mapping:** User label “Anti-Wrinkle Serum 30ml” = **`00191`** Multi Functional Anti-Wrinkle Serum — **not** **`00027`** (legacy Anti-Wrinkle Serum).

PDF: `~/Desktop/orders/GENOSYS_Tatiana_Aniskina_Consignment_Sales_01401.pdf`

Report only — no consignment shipment (demand) posted.

---

## Consignment replenishment demand (2026-07-06)

**Script:** `scripts/moysklad-create-tatiana-aniskina-consignment-demand-20260706.js --commit`

| Doc | Number | AED | Status |
|-----|--------|----:|--------|
| Отгрузка (demand) | **06485** | 1,050.00 | Отгружено |

- [Demand 06485](https://online.moysklad.ru/app/#demand/edit?id=e5234723-7934-11f1-0a80-08c2007e4a02)

Replenishment after report **01401** (sold lines) + extra stock:

| Code | Product | Qty | Unit | Line |
|------|---------|----:|-----:|-----:|
| 00191 | Multi Functional Anti-Wrinkle Serum 30ml | 1 | 165.00 | 165.00 |
| 54458 | Moisture Replenishing Hyaluron Cream 50g | 1 | 145.00 | 145.00 |
| 00123 | Multi Vita Radiance Cream 230g | 1 | 210.00 | 210.00 |
| 54475 | BIO-MESO PDRN Homecare Ampoule 5000 | 1 | 150.00 | 150.00 |
| 54484 | CERABARRIER Biome Gel Cleanser 200ml | 2 | 190.00 | 380.00 |
| | | | **Total** | **1,050.00** |

PDF: `~/Desktop/orders/GENOSYS_Tatiana_Aniskina_Consignment_Stock_Note_06485.pdf`
