# SHAKIROVNA POLY CLINIC L.L.C — consignment onboarding — 2026-08-13

## Request

Ingest DET trade license + VAT certificate from `Contract_Customers/Shakirovna`, create a **new** MoySklad legal customer and a commission consignment agreement. Opening demand (same basket as MedUmed) posted as **06678**.

## Document ingest

Source: `~/Desktop/Drive/Genosys/Contract_Customers/Shakirovna/`

| File | Extracted |
|---|---|
| `SHAKIROVNA PLOY CLINIC TRADE LICENSE .pdf` | DET **1621373**, LLC, issued **06 May 2026**, expires **05 May 2027**. CR **2857522**, DCCI **684312**. Managers **Elena Evtushenko** + **Kristina Maksakova**. Partners Kristina 50% / Oleh Avramenko 50%. Shop **S8**, Marsa Dubai. Mobile **+971 58 550 6595**. Email **shakirovnapolyclinic@gmail.com**. |
| `SHAKIROVNA POLY CLINIC VAT  Registration Certificate.pdf` | TRN **105447137800003**, effective **01 Aug 2026**. Address **Wharf 1, Marina Promenade, Marsa, Dubai Marina**. Contact **+971 55 246 6089**. DET **1621373**. |

Ingest summary: `Shakirovna/INGEST_SUMMARY_2026-08-13.md`

This is **not** Shakirovna Marina, Elite Salon, or Esthetic Clinic. Those are separate cards. Elite/Esthetic share mobile `+971585506595`.

## MoySklad

| Field | Value |
|---|---|
| Customer | **SHAKIROVNA POLY CLINIC L.L.C** — `932f00c5-96e0-11f1-0a80-0d9b001a5a79` |
| Type | legal |
| Phone | +971552466089 |
| Email / fax | DET **1621373** (Face Room layout) |
| TRN | **105447137800003** |
| Address | Wharf 1, Marina Promenade, Shop S8, Dubai Marina, Dubai |
| Signatory | Kristina Maksakova (manager / 50% partner) |
| Agreement | **41** — `93cc0951-96e0-11f1-0a80-036000196a36` |
| Type | Commission · 0% reward · 5-day payment after monthly report |

[Open customer](https://online.moysklad.ru/app/#company/edit?id=932f00c5-96e0-11f1-0a80-0d9b001a5a79) · [Open contract](https://online.moysklad.ru/app/#contract/edit?id=93cc0951-96e0-11f1-0a80-036000196a36)

## Opening consignment demand

| Field | Value |
|---|---|
| Shipment | **06678** — `28517c2a-96e2-11f1-0a80-134b0019fa6b` |
| Into | Agreement **41** |
| Basket | Same 38 SKUs / **120 pcs** as MedUmed / New You 06544 |
| Sum | **13,124 AED** clinic list |
| Links | No SO, no invoice, no `customerOrder` |

Stock note: `~/Desktop/orders/GENOSYS_SHAKIROVNA_POLY_CLINIC_06678_Consignment_Stock_Note.pdf`

Demand script: `scripts/moysklad-create-shakirovna-poly-clinic-consignment-demand-20260813.js`

## PDFs

| Document | Path |
|---|---|
| Agreement (contract folder) | `~/Desktop/Drive/Genosys/Contract_Customers/Shakirovna/Genosys_Consignment_Agreement_SHAKIROVNA_POLY_CLINIC_41.pdf` |
| Agreement (orders) | `~/Desktop/orders/GENOSYS_SHAKIROVNA_POLY_CLINIC_Consignment_Agreement_41.pdf` |

Script: `scripts/moysklad-create-shakirovna-poly-clinic-consignment-20260813.js`
