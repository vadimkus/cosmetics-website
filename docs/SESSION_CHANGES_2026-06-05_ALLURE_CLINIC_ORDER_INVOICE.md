# Session — Allure clinic sales order + invoice (2026-06-05)

## Context

User requested sales order + invoice for **clinic customer** with:

| Item | Qty | Code |
|------|-----|------|
| Skin barrier protecting cream | 1 | `00037` |
| Multi vita radiance serum | 1 | `00194` |
| All for sensitive serum | 1 | `00030` |
| Eye cream | 1 | `00055` |
| Cushion beige | 1 | `00144` |

**Counterparty assumed:** **Allure** (`9e0a2de1-b31e-11ec-0a80-05e20009d062`) — immediate prior thread context (consignment demand same day). If another clinic was intended, say which name and we can re-post.

## Created (MoySklad)

| Document | Number | Sum (AED) | ID |
|----------|--------|-----------|-----|
| Customer order | `GENCardM260604ALLURE` | 890.00 | `9c948006-5ffe-11f1-0a80-10ee001826fb` |
| Invoice out | **04612** | 890.00 | `9cf58afd-5ffe-11f1-0a80-070e00190bf3` |

Pricing: clinic **оптовая** (`salePrice` from stock report), VAT included.

## Script

`scripts/moysklad-create-allure-order-invoice-20260605.js`

```bash
node --import dotenv/config scripts/moysklad-create-allure-order-invoice-20260605.js --commit
```

## Note vs consignment

Same day **consignment demand 06283** under agreement `00045` included skin barrier + eye cream only. This order is a **separate B2B sale** (5 SKUs, 890 AED), not linked to the commission contract.
