# Genesis → NEW YOU STAR merge (portal + MoySklad)

**Date:** 2026-07-16  
**Source:** FTA VAT certificate — TRN **100619066200003** (effective 01/08/2022)  
**Script:** `scripts/moysklad-merge-genesis-into-new-you-star-20260716.js --commit`

## Decision

Portal account **Genesis Healthcare Center** (`support@genesis-dubai.com`) is the same legal entity as **NEW YOU STAR BEAUTY HEALTH CLINIC L.L.C**. Keep a single MoySklad customer; delete Genesis duplicate.

## MoySklad

| Action | Detail |
|--------|--------|
| Keep | **NEW YOU STAR BEAUTY HEALTH CLINIC L.L.C** — `69e1db3e-7fa4-11f1-0a80-0283002585b0` |
| Face Room TRN | `legalAddressFull.comment` = **100619066200003** (license `email`/`inn` already set) |
| Reassigned | Order **PARTW2607160539**, invoice **04830**, shipment **06555** |
| Deleted | Genesis Healthcare Center — `4453a654-812b-11f1-0a80-0ca1002290e7` |

Contract **37** unchanged (`6a2aabf3-7fa4-11f1-0a80-0283002585c9`).

## Portal (`users`)

| Field | Before | After |
|-------|--------|-------|
| name | Genesis Healthcare Center | NEW YOU STAR BEAUTY HEALTH CLINIC L.L.C |
| email | support@genesis-dubai.com | *(unchanged — login)* |
| phone | 0505507029 | +971503359777 |
| address | Dubai Science Park… | The Mall, Shop 21, Umm Suqeim Third, Jumeirah St, Dubai |
| vatNumber | null | 100619066200003 |
| moyskladCounterpartyId | null | `69e1db3e-7fa4-11f1-0a80-0283002585b0` |
| moyskladContractId | null | `6a2aabf3-7fa4-11f1-0a80-0283002585c9` |
| consignmentActive | true | true |
| partnerPortalAccess | true | true |

Order **PARTW2607160539** customer snapshot renamed to match.

## Update 2026-07-17 — website reverted to Genesis

Portal only (MoySklad unchanged — still New You Star single customer):

| Field | Restored to |
|-------|-------------|
| name | Genesis Healthcare Center |
| phone | 0505507029 |
| address | Dubai Science Park Towers, North Tower 4th Floor. Al Barsha Dubai |
| vatNumber | null |
| moyskladCounterpartyId / ContractId | null |
| email | support@genesis-dubai.com (unchanged) |

Order **PARTW2607160539** snapshot restored to Genesis name/address/phone.

## Reference

Face Room pattern: license in `email`/`fax`, TRN in `legalAddressFull.comment`.
