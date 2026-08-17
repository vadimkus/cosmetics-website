#!/usr/bin/env node

/**
 * MEDYUMED MEDICAL CLINIC L.L.C — consignment agreement PDF (Agreement No. 39).
 * Same layout as New You Star / CEIA → Contract_Customers/MedUmed/ + ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-export-medumed-consignment-agreement-pdf-20260810.js
 *   node --import dotenv/config scripts/moysklad-export-medumed-consignment-agreement-pdf-20260810.js --open
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync } = require('child_process')
const { exportConsignmentAgreementPdf } = require('./lib/export-consignment-agreement-pdf')

const AGREEMENT_NO = '39'
const EFFECTIVE = '10 August 2026'

const CUSTOMER = {
  name: 'MEDYUMED MEDICAL CLINIC L.L.C',
  phone: '+971554772214',
  owner: 'Yulia Shchekleina',
  street: 'R-10, Blue Waters Residential, Bluewaters Island, Dubai',
  tradeLicense: '1119644',
  tradeIssued: '6 March 2023',
  tradeExpires: '4 March 2027',
  trn: '104012765400003',
}

const CONTRACT_FOLDER = path.join(
  os.homedir(),
  'Desktop/Drive/Genosys/Contract_Customers/MedUmed',
)
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const BASE = `Genosys_Consignment_Agreement_MedUmed_${AGREEMENT_NO}`
const MD_PATH = path.join(CONTRACT_FOLDER, `${BASE}.md`)
const HTML_PATH = path.join(CONTRACT_FOLDER, `${BASE}.html`)
const PDF_CONTRACT = path.join(CONTRACT_FOLDER, `${BASE}.pdf`)
const PDF_ORDERS = path.join(ORDERS_DIR, `GENOSYS_MedUmed_Consignment_Agreement_${AGREEMENT_NO}.pdf`)
const HEADER_PATH = path.join(ORDERS_DIR, 'Header.png')
const STAMP_PATH = path.join(ORDERS_DIR, 'Stamp.png')
const CSS_PATH = path.join(__dirname, '../docs/reference/consignment-agreement-pdf-2page.css')
const OPEN = process.argv.includes('--open')

function buildAgreementMarkdown() {
  return `# CONSIGNMENT AGREEMENT

**Agreement No. ${AGREEMENT_NO}** · **${EFFECTIVE}** · United Arab Emirates

**Parties.** **(1) Genosys Middle East FZ-LLC** (“Consignor”) — RAKEZ license **5023192**, TRN **104229886700003**, MBAM0014, Compass Coworking Centre, Al Shohada Road, Al Jazeera, Al Hamra, Ras Al Khaimah, UAE. **(2) ${CUSTOMER.name}** (“Consignee”) — clinic **${CUSTOMER.street}**; tel. / WhatsApp **${CUSTOMER.phone}**; contact **${CUSTOMER.owner}**, Owner / Manager; Dubai DET Trade License **${CUSTOMER.tradeLicense}** (issued **${CUSTOMER.tradeIssued}**, expires **${CUSTOMER.tradeExpires}**); TRN **${CUSTOMER.trn}**.

Consignor is the authorised UAE distributor of GENOSYS® professional products (DTS MG Co., Ltd., Korea). Consignee will hold and sell **retail home-care Products** on consignment on the terms below. **Professional treatment-room consumables** (salon/pro sizes, ampoules, professional masks, and similar in-room use items) are supplied only on **paid invoice** and are **excluded** from consignment under this Agreement. **Consignment stock quantities and SKUs are documented in separate consignment stock notes and MoySklad shipment documents** (not attached to this Agreement).

**1. Appointment.** Non-exclusive consignment partner in the UAE for **retail home-care Products only**. Consignee acts as agent to sell consignment stock only; may not sub-consign, pledge, or encumber stock. No employment, franchise, or partnership is created.

**2. Delivery & custody.** Consignor delivers against consignment shipment documents under Agreement No. ${AGREEMENT_NO}. Consignee inspects within **48 hours**, stores indoors per product label, and maintains accurate stock records.

**3. Title & pricing.** Title remains with Consignor until Products are **reported sold and paid for**. **Clinic List Price** = Consignor’s prevailing UAE clinic/professional price per SKU (incl. **5% VAT** unless stated), per price list, invoice, or MoySklad. Consignee may sell at or above Clinic List Price and retains its margin/discounts.

**4. Reporting & payment.** Each calendar month with any sales (or **nil sales**), Consignee sends a **Monthly Sales Report** and **stock reconciliation** to **sales@genosys.ae** during **days 1–5** of the following month (UAE time), with month, SKU, qty, sale date(s), Clinic List Price, and closing stock by SKU. Late/incomplete reporting is a material breach (replenishment may stop; unexplained shortages may be invoiced as sold). After each report, Consignor invoices Sold Products; Consignee pays **100%** of Clinic List Price (+ VAT if required) within **5 days** by bank transfer or cash. **No commission** is paid by Consignor. Late payment: **1%**/month interest; deliveries may suspend.

**5. Audit, loss & returns.** Consignor may count/audit stock on **≥2 business days’** notice. Shortages, negligent damage, improper storage, or expiry in Consignee’s custody are charged at Clinic List Price unless insured loss is proved. Returns only with prior written approval and return note; opened/expired items not returnable unless manufacturing defect.

**6. Brand & compliance.** Approved GENOSYS branding/claims only; no relabelling or repackaging; no sales outside UAE without consent; comply with UAE cosmetics, advertising, and VAT rules. Each Party keeps the other’s non-public terms confidential.

**7. Term & termination.** Effective **${EFFECTIVE}** until terminated (**30 days’** written notice). Consignor may terminate immediately for payment **30+ days** overdue, **two consecutive** missed monthly reports, insolvency, or brand/product harm. On termination: final reconciliation within **7 days**; pay unsettled sales; return remaining stock within **14 days** at Consignee’s cost (title until received).

**8. General.** Liability limited to value of affected Products; no indirect/consequential loss (except fraud). Force majeure applies. **UAE law**; **Dubai courts** exclusive. Entire agreement; amendments in writing signed by both Parties; Consignee may not assign. Notices by email/courier — Consignor: **sales@genosys.ae**; Consignee: **${CUSTOMER.phone}** (WhatsApp acceptable). Counterparts and electronic signatures permitted.

<div class="signatures">

<div class="sigcol">

**Consignor — Genosys Middle East FZ-LLC**

Name: **Vadim Sagatdinov**  
Title: General Manager / Authorised Signatory  
Signature: _________________________  
Date: _________________________

</div>

<div class="sigcol">

**Consignee — ${CUSTOMER.name}**

Name: **${CUSTOMER.owner}**  
Title: Owner / Manager / Authorised Signatory  
Signature: _________________________  
Date: _________________________  
Stamp (if any): _________________________

</div>

</div>

*Genosys Middle East FZ-LLC · License 5023192 · TRN 104229886700003 · sales@genosys.ae · www.genosys.ae*
`
}

function writeIngestSummary() {
  const text = `# MEDYUMED MEDICAL CLINIC — document ingest (2026-08-10)

## Source folder
\`${CONTRACT_FOLDER}\`

| File | Extracted |
|---|---|
| MEDYMED MAIN LICENSE UPDATED (1).pdf | DET **${CUSTOMER.tradeLicense}**, LLC-SO, Dermatology Clinic / Laser Cosmetic Center, issued **${CUSTOMER.tradeIssued}**, expires **${CUSTOMER.tradeExpires}**, Owner/Manager **${CUSTOMER.owner}** |
| VAT Registration Certificate.pdf | TRN **${CUSTOMER.trn}**, legal name **${CUSTOMER.name}**, address **${CUSTOMER.street}**, phone **${CUSTOMER.phone}**, VAT effective **01 Jan 2023** |

## Notes
- DHA license omitted from agreement (not required for this issue).

## Customer (to create in MoySklad)
- **${CUSTOMER.name}**
- Contact: **${CUSTOMER.owner}**
- Phone: **${CUSTOMER.phone}**
- Address: **${CUSTOMER.street}**
- TRN: **${CUSTOMER.trn}**
- Agreement **${AGREEMENT_NO}**

## Agreement terms
- Payment within **5 days** after monthly sales report
- Retail home-care consignment only; pro consumables = paid invoice
`
  const ingestPath = path.join(CONTRACT_FOLDER, 'INGEST_SUMMARY_2026-08-10.md')
  fs.writeFileSync(ingestPath, text)
  return ingestPath
}

function main() {
  if (!fs.existsSync(HEADER_PATH)) throw new Error(`Missing header: ${HEADER_PATH}`)
  if (!fs.existsSync(STAMP_PATH)) throw new Error(`Missing stamp: ${STAMP_PATH}`)

  fs.mkdirSync(CONTRACT_FOLDER, { recursive: true })
  fs.mkdirSync(ORDERS_DIR, { recursive: true })

  const md = buildAgreementMarkdown()
  fs.writeFileSync(MD_PATH, md)
  console.log(`MD: ${MD_PATH}`)

  const ingestPath = writeIngestSummary()
  console.log(`Ingest: ${ingestPath}`)

  const result = exportConsignmentAgreementPdf({
    mdPath: MD_PATH,
    htmlPath: HTML_PATH,
    pdfPaths: [PDF_CONTRACT, PDF_ORDERS],
    headerPath: HEADER_PATH,
    stampPath: STAMP_PATH,
    cssPath: CSS_PATH,
  })

  for (const pdf of result.pdfPaths) {
    console.log(`PDF: ${pdf} (${fs.statSync(pdf).size} bytes)`)
  }
  console.log(`HTML: ${result.htmlPath}`)
  console.log(`Header: ${result.headerUsed ? 'yes' : 'no'} | Stamp: ${result.stampUsed ? 'yes' : 'no'}`)

  if (OPEN && process.platform === 'darwin') {
    execFileSync('open', [PDF_CONTRACT], { stdio: 'inherit' })
  }
}

main()
