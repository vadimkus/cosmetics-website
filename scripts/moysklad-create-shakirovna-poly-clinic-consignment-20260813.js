#!/usr/bin/env node

/**
 * SHAKIROVNA POLY CLINIC L.L.C — ingest DET + VAT, create MoySklad legal
 * customer + commission consignment agreement. No opening demand.
 *
 * Source:
 *   ~/Desktop/Drive/Genosys/Contract_Customers/Shakirovna/
 *   - SHAKIROVNA PLOY CLINIC TRADE LICENSE .pdf  (filename misspells POLY)
 *   - SHAKIROVNA POLY CLINIC VAT  Registration Certificate.pdf
 *
 * Distinct from Shakirovna Marina / Elite Salon / Esthetic Clinic.
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-poly-clinic-consignment-20260813.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-poly-clinic-consignment-20260813.js --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentNow } = require('./lib/moysklad-uae-date')
const { exportConsignmentAgreementPdf } = require('./lib/export-consignment-agreement-pdf')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const CONTRACT_STATE_DEFERRED_ID = 'b5d800c6-80df-11ea-0a80-004a001360f2'

const CONTRACT_FOLDER = path.join(
  os.homedir(),
  'Desktop/Drive/Genosys/Contract_Customers/Shakirovna',
)
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const CSS_PATH = path.join(__dirname, '../docs/reference/consignment-agreement-pdf-2page.css')
const TODAY = uaeToday()
const MARKER = `SHAKIROVNA-POLY-CLINIC-CONSIGNMENT-${TODAY}`

const CUSTOMER = {
  name: 'SHAKIROVNA POLY CLINIC L.L.C',
  phone: '+971552466089', // VAT registered contact
  phoneAlt: '+971585506595', // DET mobile (also used by Elite / Esthetic — do not match on this)
  emailReal: 'shakirovnapolyclinic@gmail.com',
  inn: '105447137800003',
  tradeLicense: '1621373',
  tradeLicenseIssued: '2026-05-06',
  tradeLicenseExpires: '2027-05-05',
  commercialRegister: '2857522',
  dcci: '684312',
  vatEffective: '2026-08-01',
  owner: 'Kristina Maksakova',
  coManager: 'Elena Evtushenko',
  partner: 'Oleh Avramenko',
  city: 'Dubai',
  street: 'Wharf 1, Marina Promenade, Shop S8, Dubai Marina',
}

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
        'Accept-Encoding': 'gzip',
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
      err.status = res.status
      err.body = text
      throw err
    }
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function countryHref() {
  return href('country', COUNTRY_UAE_ID)
}

function contractStateHref(stateId) {
  return {
    meta: {
      href: `${API}/entity/contract/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function fmtHumanDate(iso) {
  const [y, m, d] = iso.split('-')
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  return `${Number(d)} ${months[Number(m) - 1]} ${y}`
}

function shipmentAddress() {
  return { country: countryHref(), city: CUSTOMER.city, street: CUSTOMER.street }
}

function isPolyClinic(r) {
  const name = (r.name || '').trim()
  const inn = String(r.inn || '').replace(/\D/g, '')
  const email = String(r.email || '')
  return (
    name === CUSTOMER.name ||
    inn === CUSTOMER.inn ||
    email === CUSTOMER.tradeLicense
  )
}

async function findCounterparty() {
  for (const q of [CUSTOMER.name, CUSTOMER.inn, CUSTOMER.tradeLicense, '552466089']) {
    const data = await api('GET', `/entity/counterparty?search=${encodeURIComponent(q)}&limit=15`)
    const hit = (data.rows || []).find(isPolyClinic)
    if (hit) return hit
  }
  return null
}

function customerPayload(includeInn) {
  const addr = shipmentAddress()
  const payload = {
    name: CUSTOMER.name,
    companyType: 'legal',
    phone: CUSTOMER.phone,
    email: CUSTOMER.tradeLicense,
    fax: CUSTOMER.tradeLicense,
    description: [
      MARKER,
      `Managers: ${CUSTOMER.owner} (50% partner) + ${CUSTOMER.coManager}. Partner: ${CUSTOMER.partner} (50%).`,
      `DET Trade License ${CUSTOMER.tradeLicense} (${CUSTOMER.tradeLicenseIssued} → ${CUSTOMER.tradeLicenseExpires}).`,
      `CR ${CUSTOMER.commercialRegister}. DCCI ${CUSTOMER.dcci}. VAT TRN ${CUSTOMER.inn} effective ${CUSTOMER.vatEffective}.`,
      `Clinic email ${CUSTOMER.emailReal}. Alt mobile ${CUSTOMER.phoneAlt} (shared Shakirovna group — not this card's unique id).`,
      'Poly clinic, Dubai Marina. Retail home-care consignment; pro consumables invoice only.',
      'Sources: Contract_Customers/Shakirovna DET license + VAT PDFs.',
    ].join(' '),
    legalAddress: `${CUSTOMER.street}, ${CUSTOMER.city}, UAE`,
    actualAddress: `${CUSTOMER.street}, ${CUSTOMER.city}, UAE`,
    legalAddressFull: { ...addr, addInfo: '', comment: CUSTOMER.inn },
    actualAddressFull: { ...addr, addInfo: '' },
  }
  if (includeInn) payload.inn = CUSTOMER.inn
  return payload
}

async function createCounterparty() {
  try {
    return await api('POST', '/entity/counterparty', customerPayload(true))
  } catch (e) {
    if (e.status === 412 || /inn/i.test(e.message)) {
      console.log('  inn rejected — retry without inn (TRN kept in comment/description)')
      return api('POST', '/entity/counterparty', customerPayload(false))
    }
    throw e
  }
}

async function findCommissionContract(agentId) {
  const filter = `agent=${API}/entity/counterparty/${agentId}`
  const rows = await fetchAll(`/entity/contract?filter=${encodeURIComponent(filter)}`)
  return rows.find((r) => r.contractType === 'Commission') || null
}

async function createCommissionContract(agentId) {
  return api('POST', '/entity/contract', {
    moment: uaeMomentNow(),
    applicable: true,
    contractType: 'Commission',
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    agent: href('counterparty', agentId),
    ownAgent: href('organization', ORG_ID),
    state: contractStateHref(CONTRACT_STATE_DEFERRED_ID),
    rate: { currency: href('currency', CURRENCY_ID) },
    description: [
      MARKER,
      `Commission consignment — ${CUSTOMER.name}.`,
      `Clinic: ${CUSTOMER.street}, Dubai. Payment term: 5 days after monthly report.`,
      `DET ${CUSTOMER.tradeLicense}; TRN ${CUSTOMER.inn}. Contact ${CUSTOMER.owner}.`,
    ].join('\n'),
  })
}

function buildAgreementMarkdown(agreementNo) {
  const effective = fmtHumanDate(TODAY)
  return `# CONSIGNMENT AGREEMENT

**Agreement No. ${agreementNo}** · **${effective}** · United Arab Emirates

**Parties.** **(1) Genosys Middle East FZ-LLC** (“Consignor”) — RAKEZ license **5023192**, TRN **104229886700003**, MBAM0014, Compass Coworking Centre, Al Shohada Road, Al Jazeera, Al Hamra, Ras Al Khaimah, UAE. **(2) ${CUSTOMER.name}** (“Consignee”) — clinic **${CUSTOMER.street}, Dubai**; tel. / WhatsApp **${CUSTOMER.phone}**; contact **${CUSTOMER.owner}**, Manager / Partner; Dubai DET Trade License **${CUSTOMER.tradeLicense}** (issued **${fmtHumanDate(CUSTOMER.tradeLicenseIssued)}**, expires **${fmtHumanDate(CUSTOMER.tradeLicenseExpires)}**); TRN **${CUSTOMER.inn}**.

Consignor is the authorised UAE distributor of GENOSYS® professional products (DTS MG Co., Ltd., Korea). Consignee will hold and sell **retail home-care Products** on consignment on the terms below. **Professional treatment-room consumables** (salon/pro sizes, ampoules, professional masks, and similar in-room use items) are supplied only on **paid invoice** and are **excluded** from consignment under this Agreement. **Consignment stock quantities and SKUs are documented in separate consignment stock notes and MoySklad shipment documents** (not attached to this Agreement).

**1. Appointment.** Non-exclusive consignment partner in the UAE for **retail home-care Products only**. Consignee acts as agent to sell consignment stock only; may not sub-consign, pledge, or encumber stock. No employment, franchise, or partnership is created.

**2. Delivery & custody.** Consignor delivers against consignment shipment documents under Agreement No. ${agreementNo}. Consignee inspects within **48 hours**, stores indoors per product label, and maintains accurate stock records.

**3. Title & pricing.** Title remains with Consignor until Products are **reported sold and paid for**. **Clinic List Price** = Consignor’s prevailing UAE clinic/professional price per SKU (incl. **5% VAT** unless stated), per price list, invoice, or MoySklad. Consignee may sell at or above Clinic List Price and retains its margin/discounts.

**4. Reporting & payment.** Each calendar month with any sales (or **nil sales**), Consignee sends a **Monthly Sales Report** and **stock reconciliation** to **sales@genosys.ae** during **days 1–5** of the following month (UAE time), with month, SKU, qty, sale date(s), Clinic List Price, and closing stock by SKU. Late/incomplete reporting is a material breach (replenishment may stop; unexplained shortages may be invoiced as sold). After each report, Consignor invoices Sold Products; Consignee pays **100%** of Clinic List Price (+ VAT if required) within **5 days** by bank transfer or cash. **No commission** is paid by Consignor. Late payment: **1%**/month interest; deliveries may suspend.

**5. Audit, loss & returns.** Consignor may count/audit stock on **≥2 business days’** notice. Shortages, negligent damage, improper storage, or expiry in Consignee’s custody are charged at Clinic List Price unless insured loss is proved. Returns only with prior written approval and return note; opened/expired items not returnable unless manufacturing defect.

**6. Brand & compliance.** Approved GENOSYS branding/claims only; no relabelling or repackaging; no sales outside UAE without consent; comply with UAE cosmetics, advertising, and VAT rules. Each Party keeps the other’s non-public terms confidential.

**7. Term & termination.** Effective **${effective}** until terminated (**30 days’** written notice). Consignor may terminate immediately for payment **30+ days** overdue, **two consecutive** missed monthly reports, insolvency, or brand/product harm. On termination: final reconciliation within **7 days**; pay unsettled sales; return remaining stock within **14 days** at Consignee’s cost (title until received).

**8. General.** Liability limited to value of affected Products; no indirect/consequential loss (except fraud). Force majeure applies. **UAE law**; **Dubai courts** exclusive. Entire agreement; amendments in writing signed by both Parties; Consignee may not assign. Notices by email/courier — Consignor: **sales@genosys.ae**; Consignee: **${CUSTOMER.emailReal}** / **${CUSTOMER.phone}** (WhatsApp acceptable). Counterparts and electronic signatures permitted.

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
Title: Manager / Partner / Authorised Signatory  
Signature: _________________________  
Date: _________________________  
Stamp (if any): _________________________

</div>

</div>

*Genosys Middle East FZ-LLC · License 5023192 · TRN 104229886700003 · sales@genosys.ae · www.genosys.ae*
`
}

function writeAgreementPdf(agreementNo) {
  fs.mkdirSync(CONTRACT_FOLDER, { recursive: true })
  fs.mkdirSync(ORDERS_DIR, { recursive: true })

  const base = `Genosys_Consignment_Agreement_SHAKIROVNA_POLY_CLINIC_${agreementNo}`
  const mdContract = path.join(CONTRACT_FOLDER, `${base}.md`)
  const htmlContract = path.join(CONTRACT_FOLDER, `${base}.html`)
  const pdfContract = path.join(CONTRACT_FOLDER, `${base}.pdf`)
  const pdfOrders = path.join(ORDERS_DIR, `GENOSYS_SHAKIROVNA_POLY_CLINIC_Consignment_Agreement_${agreementNo}.pdf`)

  fs.writeFileSync(mdContract, buildAgreementMarkdown(agreementNo))
  exportConsignmentAgreementPdf({
    mdPath: mdContract,
    htmlPath: htmlContract,
    pdfPaths: [pdfContract, pdfOrders],
    headerPath: path.join(ORDERS_DIR, 'Header.png'),
    stampPath: path.join(ORDERS_DIR, 'Stamp.png'),
    cssPath: CSS_PATH,
  })
  return { mdContract, pdfContract, pdfOrders }
}

function writeIngestSummary() {
  const text = `# SHAKIROVNA POLY CLINIC L.L.C — document ingest (${TODAY})

## Source folder
\`${CONTRACT_FOLDER}\`

| File | Extracted |
|---|---|
| SHAKIROVNA PLOY CLINIC TRADE LICENSE .pdf | DET **1621373**, LLC, issued **06 May 2026**, expires **05 May 2027**. CR **2857522**, DCCI **684312**. Managers **Elena Evtushenko** + **Kristina Maksakova**. Partners Kristina 50% / Oleh Avramenko 50%. Shop **S8**, Marsa Dubai. Mobile **+971 58 550 6595**. Email **shakirovnapolyclinic@gmail.com**. Parcel **392-401**. |
| SHAKIROVNA POLY CLINIC VAT  Registration Certificate.pdf | TRN **105447137800003**, effective **01 Aug 2026**. Registered address **Wharf 1, Marina Promenade, Marsa, Dubai Marina**. Contact **+971 55 246 6089**. DET license listed **1621373**. |

## Not the same card
- **Shakirovna Marina** (individual commissioner) — existing consignment partner
- **ELITE SHAKIROVNA LADIES SALON L.L.C** / **SHAKIROVNA ESTHETIC CLINIC L.L.C** share mobile +971585506595 — different legal entities

## Customer (MoySklad)
- **${CUSTOMER.name}**
- Contact: **${CUSTOMER.owner}** (manager / 50% partner)
- Co-manager: **${CUSTOMER.coManager}**
- Phone: **${CUSTOMER.phone}**
- Address: **${CUSTOMER.street}, Dubai**
- TRN: **${CUSTOMER.inn}**
- DET: **${CUSTOMER.tradeLicense}**

## Agreement terms
- Payment within **5 days** after monthly sales report
- Retail home-care consignment only; pro consumables = paid invoice
- No opening consignment demand in this ingest
`
  const ingestPath = path.join(CONTRACT_FOLDER, `INGEST_SUMMARY_${TODAY}.md`)
  fs.writeFileSync(ingestPath, text)
  return ingestPath
}

async function main() {
  console.log('====================================================================')
  console.log('  SHAKIROVNA POLY CLINIC — customer + consignment agreement')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const ingestPath = writeIngestSummary()
  console.log(`  Ingest: ${ingestPath}`)
  console.log(`  Name  : ${CUSTOMER.name}`)
  console.log(`  Phone : ${CUSTOMER.phone}`)
  console.log(`  DET   : ${CUSTOMER.tradeLicense}`)
  console.log(`  TRN   : ${CUSTOMER.inn}`)
  console.log(`  Addr  : ${CUSTOMER.street}, ${CUSTOMER.city}`)
  console.log(`  Sign  : ${CUSTOMER.owner}`)

  let agent = await findCounterparty()
  if (agent) {
    console.log(`  Customer exists: ${agent.name} (${agent.id})`)
  } else if (!COMMIT) {
    console.log(`  Would create: ${CUSTOMER.name}`)
    agent = { id: 'DRY-RUN', name: CUSTOMER.name }
  } else {
    agent = await createCounterparty()
    console.log(`  Created customer: ${agent.name} (${agent.id})`)
  }

  let contract = agent.id !== 'DRY-RUN' ? await findCommissionContract(agent.id) : null
  if (contract) {
    console.log(`  Agreement exists: ${contract.name} (${contract.id})`)
  } else if (!COMMIT) {
    console.log('  Would create Commission agreement (auto-number)')
    contract = { id: 'DRY-RUN', name: 'TBD' }
  } else {
    contract = await createCommissionContract(agent.id)
    console.log(`  Created agreement: ${contract.name} (${contract.id})`)
  }

  if (COMMIT && contract.id !== 'DRY-RUN') {
    const pdfs = writeAgreementPdf(contract.name)
    console.log(`  Agreement PDF (folder): ${pdfs.pdfContract}`)
    console.log(`  Agreement PDF (orders): ${pdfs.pdfOrders}`)
    console.log(`  Customer: https://online.moysklad.ru/app/#company/edit?id=${agent.id}`)
    console.log(`  Contract: https://online.moysklad.ru/app/#contract/edit?id=${contract.id}`)
  } else {
    console.log('\n  DRY RUN — re-run with --commit')
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
