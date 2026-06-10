# Rise UP — New MoySklad Customer

**Date:** 2026-06-01 (UAE)

## Request

Create new counterparty **Rise UP** with Business Bay office address and phone (per consignment stock note **06255**).

## Customer

| Field | Value |
|--------|--------|
| Name | **Rise UP** |
| ID | `b83e0d80-5d8f-11f1-0a80-065d0075240c` |
| Phone (office) | +971585309320 |
| Contact | **Irina Kovalenko** — Irina_01-01@mail.ru — +971501025360 |
| Type | Legal entity |
| City | Dubai |
| Address | Office 906, The Metropolis Tower, Business Bay |

[Open in MoySklad](https://online.moysklad.ru/app/#company/edit?id=b83e0d80-5d8f-11f1-0a80-065d0075240c)

## Script

`scripts/moysklad-create-rise-up-customer-20260601.js`

```bash
node --import dotenv/config scripts/moysklad-create-rise-up-customer-20260601.js --commit
```

## Related

- [Consignment agreement 34](./SESSION_CHANGES_2026-06-01_RISE_UP_CONSIGNMENT_CONTRACT.md)
- Contact patch: `scripts/moysklad-update-rise-up-contact-20260603.js` (Irina Kovalenko)
