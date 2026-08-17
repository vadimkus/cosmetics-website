# GENOSYS — turning distribution into a subscription machine

**Date:** 2026-07-10
**Thesis:** GENOSYS already has recurring revenue (consignment + reorders from 42+ clinics). It is **manual, rhythm-less, and un-locked**. Hardening it = converting ad-hoc reorderers into committed, automated replenishment plans. This is a painkiller (a clinic that runs out of ampoules loses treatment revenue), unlike selling SaaS to notebook-users.

> Note: customer names / clinic list / outreach letters are **not** in this repo (possible public git + PII). They live on Desktop: `~/Desktop/GENOSYS_Clinic_Subscription/`.

---

## What exists today (code audit)

| Capability | Status | Where |
|---|---|---|
| Retail e-commerce + one-time Stripe | ✅ | `lib/stripe.ts` (`mode: 'payment'`) |
| Retail loyalty (4 tiers, points) | ✅ | `lib/loyalty.ts`, `lib/membership.ts` |
| Clinic/VIP flag + % discount | ✅ | `User.discountType` (`CLINIC`/`VIP`), `lib/discountUtils.ts` |
| Price-on-request pro products | ✅ | `Product.isPriceOnRequest` |
| Consignment (commission contracts) | ✅ but 100% MoySklad + manual scripts | `scripts/moysklad-*consignment*.js`, `commissionreportin` |
| SOA / statement export per clinic | ✅ manual | `scripts/moysklad-export-*-soa*.js` |
| **Recurring billing (Stripe subscriptions)** | ❌ | stub only in webhook |
| **B2B self-service reorder portal** | ❌ | clinics order via WhatsApp → Vadim runs scripts |
| **Auto-replenishment / reorder reminders** | ❌ | nothing watches days-since-last-order |
| **RecurringОrder / ReplenishmentPlan model** | ❌ | not in `schema.prisma` |
| **Clinic price list in DB** | ❌ | clinic prices hardcoded in MoySklad salePrice |
| **User ↔ MoySklad counterparty link** | ❌ | no FK; separate records |

**Bottom line:** the customers and the recurring behavior already exist. The leak is that everything is manual, there is no committed cadence, and nothing prevents churn/stock-out.

---

## The product: "GENOSYS Partner Replenishment Plan"

Convert ad-hoc reordering into a **standing monthly plan**.

**Clinic commits to** a monthly minimum of their core consumables (ampoules, mesotherapy solutions, needles/derma-rollers, masks — whatever they burn per treatment).

**Clinic gets:**
- Locked **partner price** (better than ad-hoc one-offs)
- **Never run out** — guaranteed stock + priority during shortages
- Auto-reminder before depletion + priority delivery
- Monthly statement (already have the export)
- **"GENOSYS Partner Clinic"** status + listing on genosys.ae (find-a-clinic) + training/protocol support

**GENOSYS gets:** predictable recurring revenue, higher share-of-wallet, lock-in beyond price, visible (not invisible) churn.

**Why it's a painkiller:** running out of GENOSYS product mid-week = cancelled treatments = lost clinic revenue. Reliability is the pain; the plan sells reliability.

---

## Roadmap (ROI-ordered)

### Tier 1 — This week, zero/low code (commercial + process)
1. **Offer the plan to the existing 42 consignment clinics** (letters drafted on Desktop). No product build needed — it's a commercial agreement over the relationship that already exists.
2. **Reorder-due script**: query MoySklad for days-since-last-order per counterparty → output an "overdue for reorder" list → send WhatsApp reminder. This is the missing auto-replenishment trigger, achievable as a script first (reuse `lib/moyskladReports.ts`).
3. **Monthly statement cadence**: already have SOA export — schedule it monthly per active clinic.

### Tier 2 — The subscription machine in software (moderate code)
4. **Add `ReplenishmentPlan` + `PlanItem` models** (Prisma). Fields: clinic user, cadence (weekly/monthly), items+qty, next delivery date, status.
5. **Link `User.moyskladCounterpartyId`** — the missing bridge; enables auto-push of a clinic's reorder to MoySklad (reuse `findOrCreateCounterparty`, `createMoySkladOrder`).
6. **Clinic B2B portal** (reuse auth + `discountType='CLINIC'` + catalog): standing plan view, one-tap reorder, reorder history, next-delivery date. Make the blog's "Quick reordering" copy real.
7. **Billing**: either Stripe `mode:'subscription'` / card-on-file for pay-now plans, OR keep consignment terms and just automate invoice + reminder. Start with card-on-file monthly.

### Tier 3 — Lock-in (the "harder" part)
8. **Consumption-linked plans**: clinic enters treatments/month → system computes product plan → becomes embedded in their ops (high switching cost).
9. **Sell-through auto-replenish**: `commissionreportin` already tells you what a consignee sold → auto-generate the next demand.
10. **Partner tier / rebates / co-marketing / training** — raise switching cost beyond price. Volume rebate bands; "Partner Clinic" badge; listing; protocol support.

---

## Metric to watch
- **% of active clinics on a committed plan** (target: convert 42 ad-hoc → 25+ committed in 90 days)
- **Reorder-cycle variance** (committed plans should flatten it)
- **Revenue per clinic per month** (should rise with share-of-wallet)
- **Stock-out incidents** (should fall — the pain you're removing)

---

## Segments (offer differs) — see Desktop for names
- **Medical / aesthetic clinics** (injectables, meso — highest volume): standing monthly order + priority + protocol support.
- **Pharmacies / trading resellers**: wholesale standing order, volume rebate.
- **Beauty salons / spas** (mid): replenishment plan + partner price.
- **Solo cosmetologists / nail masters**: small consignment plan, low minimum, WhatsApp reorder.

---

## Sources
- Code audit of `cosmetics-website` (prisma schema, lib/stripe, lib/moysklad, lib/loyalty, scripts/moysklad-*)
- MoySklad consignment export (42 active clinics, 2026-07)
