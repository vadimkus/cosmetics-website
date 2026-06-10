# Session: Active consignment customers — Excel export

**Date:** 2026-06-09  
**Script:** `scripts/moysklad-export-active-consignment-customers-xlsx.js`

## Output

`/Users/vadimkus/Desktop/GENOSYS_Active_Consignment_Customers.xlsx`

- Column **A:** Customer name
- **63** unique customers
- Source: MoySklad **Commission** contracts with `applicable !== false` (**65** agreements; ARFI Barsha + Jumeirah are two separate counterparties)

## Re-run

```bash
node --import dotenv/config scripts/moysklad-export-active-consignment-customers-xlsx.js
```
