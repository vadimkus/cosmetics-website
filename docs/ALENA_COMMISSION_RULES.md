# Alena commission — how we count

Locked 2026-08-21. Use this for every Alena client order. Do not invent a new formula mid-chat.

## Who keeps what

- **Client** pays retail, or retail minus the discount Alena gave.
- **We (GENOSYS)** keep clinic price on products (~50% of retail, UAE clinic list, VAT included) **plus delivery**.
- **Alena** keeps the rest. That rest is her margin.

Delivery is always ours. She gets **0** on delivery.

## Discount

If Alena gives the client a discount (usually 10% on products):

- Discount is **from her margin**, not from ours.
- We still keep full clinic + delivery.
- Do not discount delivery unless Vadim says so.

Check:

```
her full margin     = retail products − clinic products
her discount AED    = retail products × discount %
her share           = client paid − (clinic products + delivery)
                    = full margin − discount AED
```

Both lines must match.

## Card vs cash

**Cash or bank transfer (no Stripe)**  
Pay her share as calculated. Do **not** take 5% or 3% again.  
Example: Miss Nadezhda 04956, cash/bank on the invoice.

**Card / Stripe**  
From **her share only** (not from the client total):

- tax 5%
- Stripe 3%

```
pay Alena = her share × (1 − 0.05 − 0.03) = her share × 0.92
```

Example: Miss Irina 04934, card, share 852 → pay 783.84.

## Table for Alena (WhatsApp)

Do **not** show our clinic column. Show:

| Product | Retail | After discount | Alena |
| Delivery | full | full | 0 |
| Totals | | client paid | her share |

Then the short settlement:

| | AED |
| Margin before discount | |
| Her discount | − |
| Her share | |
| Tax 5% | only if card |
| Stripe 3% | only if card |
| **Pay her** | |

## Clinic prices

Use `docs/GENOSYS_UAE_PriceList_Clinics_2026_normalized.csv`.  
If retail is exactly 2× clinic, clinic = retail / 2.

## Do not

- Do not tax her share on cash.
- Do not take Stripe from the full client total.
- Do not give her a cut of delivery.
- Do not apply the Al Ain partner −10% (that is Abeer, not Alena).
