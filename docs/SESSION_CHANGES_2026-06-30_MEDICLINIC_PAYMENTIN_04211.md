# Mediclinic — paymentin for invoice 04211 (2026-06-30)

**Customer:** Mediclinic Clinics Investment LLC  
**Script:** `scripts/moysklad-create-mediclinic-paymentin-04211-20260630.js --commit`

## Remittance (Mediclinic Clinics Invest → Genosys)

| Field | Value |
|-------|-------|
| Payment date | **30/06/2026** |
| Amount | **760.00 AED** |
| Customer ref | **2026SCLT03160** |
| UTR | **SE99992606303561** |
| SCB ref | **AE08476Q0248957** |
| Bank | WIO (account …1607) |

## Documents settled

| Type | # | Date | Amount | ID |
|------|---|------|-------:|-----|
| Invoice | **04211** | 2026-03-02 10:35 | 760.00 | `620d2211-160a-11f1-0a80-147400311a97` |
| Shipment | **05753** | 2026-03-02 10:37 | 760.00 | `ac20a269-160a-11f1-0a80-046b002feca0` |
| **Payment in** | **05836** | **2026-06-30 12:00** | **760.00** | `2b00455e-7431-11f1-0a80-0130000f27f6` |
| Customer order | **GENCardW2602283407** | 2026-03-02 | 760.00 | `5f7aa476-160a-11f1-0a80-07be00315b98` |

- [Customer order GENCardW2602283407](https://online.moysklad.ru/app/#customerorder/edit?id=5f7aa476-160a-11f1-0a80-07be00315b98)
- [Invoice 04211](https://online.moysklad.ru/app/#invoice/edit?id=620d2211-160a-11f1-0a80-147400311a97)
- [Shipment 05753](https://online.moysklad.ru/app/#demand/edit?id=ac20a269-160a-11f1-0a80-046b002feca0)
- [Payment in 05836](https://online.moysklad.ru/app/#paymentin/edit?id=2b00455e-7431-11f1-0a80-0130000f27f6)

Payment linked to **shipment 05753**; moment is **after** shipment (30 Jun vs 2 Mar). Invoice 04211 shows fully paid via shipment link.

## Sequence

1. Invoice **04211** — 2026-03-02 10:35  
2. Shipment **05753** — 2026-03-02 10:37  
3. Payment in **05836** — 2026-06-30 12:00 ✓  
4. Order **GENCardW2602283407** — status **Доставлен** (was «Доставлен - Ждем оплату») ✓
