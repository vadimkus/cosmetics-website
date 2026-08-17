#!/usr/bin/env node

/**
 * NEW YOU STAR BEAUTY HEALTH CLINIC L.L.C — full consignment onboarding:
 *   1) MoySklad counterparty (from ingested license docs)
 *   2) Commission consignment agreement
 *   3) 1-page agreement PDF (payment within 5 days)
 *   4) Opening consignment demand (retail bestsellers ×2) + stock note PDF → ~/Desktop/orders/
 *
 * Source docs: ~/Desktop/Drive/Genosys/Contract_Customers/New_YOU_STAR/
 *
 *   node --import dotenv/config scripts/moysklad-create-new-you-star-consignment-onboarding-20260714.js
 *   node --import dotenv/config scripts/moysklad-create-new-you-star-consignment-onboarding-20260714.js --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync } = require('child_process')

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
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const CONTRACT_STATE_DEFERRED_ID = 'b5d800c6-80df-11ea-0a80-004a001360f2'
const DEMAND_STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const CONTRACT_FOLDER = path.join(
  os.homedir(),
  'Desktop/Drive/Genosys/Contract_Customers/New_YOU_STAR'
)
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const CSS_PATH = path.join(__dirname, '../docs/reference/consignment-agreement-pdf-2page.css')
const TODAY = uaeToday()
const MARKER = `NEW-YOU-STAR-CONSIGNMENT-ONBOARDING-${TODAY}`

/** Ingested from Trade License / VAT / DHA / Corporate Tax PDFs (2026-07-14) */
const CUSTOMER = {
  name: 'NEW YOU STAR BEAUTY HEALTH CLINIC L.L.C',
  phone: '+971503359777',
  phoneAlt: '+971505040272',
  email: '985526',
  fax: '5938656',
  inn: '100619066200003',
  tradeLicense: '985526',
  tradeLicenseIssued: '2021-09-23',
  tradeLicenseExpires: '2026-09-22',
  dhaLicense: '5938656',
  dhaIssued: '2025-09-29',
  dhaExpires: '2026-09-07',
  dcci: '399324',
  commercialRegister: '2569354',
  owner: 'Tetiana Boiko',
  medicalDirector: 'Madina Budakova',
  city: 'Dubai',
  street: 'The Mall, Shop 21, Umm Suqeim Third, Jumeirah St, Dubai',
  facilityNote: 'Polyclinic — DHA licensed health clinic, Umm Suqeim 3',
}

/** Retail home-care bestsellers — 2 pcs each for opening shipment */
const LINES = [
  ['00144', 2], // BB Cushion #2 Beige
  ['54464', 2], // BB Cushion #3 Camel
  ['00188', 2], // Microbiome Mist 80ml
  ['54458', 2], // Hyaluron Cream 50g
  ['00194', 2], // Multi Vita Radiance Serum 30ml
  ['54467', 2], // PDRN mask Pack
  ['54473', 2], // Revita Glow BB #02 Natural
  ['54457', 2], // Ultra Shield SPF50 50g
]

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
      signal: AbortSignal.timeout(60000),
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    const retryable =
      e.cause?.code === 'ECONNRESET' ||
      e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' ||
      e.name === 'TimeoutError' ||
      e.message === 'fetch failed'
    if (attempt < 8 && retryable) {
      await new Promise((r) => setTimeout(r, 2000 * attempt))
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

function demandStateHref(stateId) {
  return {
    meta: {
      href: `${API}/entity/demand/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return (minor / 100).toFixed(2)
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

async function findCounterparty() {
  for (const q of [CUSTOMER.phone, CUSTOMER.inn, 'NEW YOU STAR']) {
    const data = await api('GET', `/entity/counterparty?search=${encodeURIComponent(q)}&limit=10`)
    const hit = (data.rows || []).find(
      (r) => r.name === CUSTOMER.name || r.inn === CUSTOMER.inn || r.phone === CUSTOMER.phone
    )
    if (hit) return hit
  }
  const byName = await api(
    'GET',
    `/entity/counterparty?filter=${encodeURIComponent(`name=${CUSTOMER.name}`)}&limit=5`
  )
  return (byName.rows || []).find((r) => r.name === CUSTOMER.name) || null
}

async function createCounterparty() {
  const addr = shipmentAddress()
  return api('POST', '/entity/counterparty', {
    name: CUSTOMER.name,
    companyType: 'legal',
    phone: CUSTOMER.phone,
    email: CUSTOMER.email,
    fax: CUSTOMER.fax,
    inn: CUSTOMER.inn,
    description: [
      `${MARKER}`,
      `Owner/Manager: ${CUSTOMER.owner}. Medical Director: ${CUSTOMER.medicalDirector}.`,
      `Trade License ${CUSTOMER.tradeLicense} (${CUSTOMER.tradeLicenseIssued} → ${CUSTOMER.tradeLicenseExpires}).`,
      `DHA ${CUSTOMER.dhaLicense} (${CUSTOMER.dhaIssued} → ${CUSTOMER.dhaExpires}). TRN ${CUSTOMER.inn}.`,
      `${CUSTOMER.facilityNote}. Retail home-care consignment; pro consumables invoice only.`,
    ].join(' '),
    legalAddress: CUSTOMER.street,
    actualAddress: CUSTOMER.street,
    // street only — do not mirror into addInfo (MoySklad concatenates both)
    legalAddressFull: { ...addr, addInfo: '' },
    actualAddressFull: { ...addr, addInfo: '' },
  })
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
      `Clinic: ${CUSTOMER.street}. Payment term: 5 days after monthly report.`,
      `Trade License ${CUSTOMER.tradeLicense}; DHA ${CUSTOMER.dhaLicense}; TRN ${CUSTOMER.inn}.`,
    ].join('\n'),
  })
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    stock.set(row.code, {
      id: row.meta?.href?.split('/').pop()?.split('?')[0],
      code: row.code,
      name: row.name,
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

function resolveLines(stock) {
  return LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code} ${item.name}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty }
  })
}

function buildAgreementMarkdown(agreementNo) {
  const effective = fmtHumanDate(TODAY)
  return `# CONSIGNMENT AGREEMENT

**Agreement No. ${agreementNo}** · **${effective}** · United Arab Emirates

**Parties.** **(1) Genosys Middle East FZ-LLC** (“Consignor”) — RAKEZ license **5023192**, TRN **104229886700003**, MBAM0014, Compass Coworking Centre, Al Shohada Road, Al Jazeera, Al Hamra, Ras Al Khaimah, UAE. **(2) ${CUSTOMER.name}** (“Consignee”) — clinic **${CUSTOMER.street}**; tel. / WhatsApp **${CUSTOMER.phone}**; contact **${CUSTOMER.owner}**, Owner / Manager; Dubai DET Trade License **${CUSTOMER.tradeLicense}** (issued **${fmtHumanDate(CUSTOMER.tradeLicenseIssued)}**, expires **${fmtHumanDate(CUSTOMER.tradeLicenseExpires)}**); DHA Health Facility License **${CUSTOMER.dhaLicense}** (expires **${fmtHumanDate(CUSTOMER.dhaExpires)}**); TRN **${CUSTOMER.inn}**.

Consignor is the authorised UAE distributor of GENOSYS® professional products (DTS MG Co., Ltd., Korea). Consignee will hold and sell **retail home-care Products** on consignment on the terms below. **Professional treatment-room consumables** (salon/pro sizes, ampoules, professional masks, and similar in-room use items) are supplied only on **paid invoice** and are **excluded** from consignment under this Agreement. **Consignment stock quantities and SKUs are documented in separate consignment stock notes and MoySklad shipment documents** (not attached to this Agreement).

**1. Appointment.** Non-exclusive consignment partner in the UAE for **retail home-care Products only**. Consignee acts as agent to sell consignment stock only; may not sub-consign, pledge, or encumber stock. No employment, franchise, or partnership is created.

**2. Delivery & custody.** Consignor delivers against consignment shipment documents under Agreement No. ${agreementNo}. Consignee inspects within **48 hours**, stores indoors per product label, and maintains accurate stock records.

**3. Title & pricing.** Title remains with Consignor until Products are **reported sold and paid for**. **Clinic List Price** = Consignor’s prevailing UAE clinic/professional price per SKU (incl. **5% VAT** unless stated), per price list, invoice, or MoySklad. Consignee may sell at or above Clinic List Price and retains its margin/discounts.

**4. Reporting & payment.** Each calendar month with any sales (or **nil sales**), Consignee sends a **Monthly Sales Report** and **stock reconciliation** to **sales@genosys.ae** during **days 1–5** of the following month (UAE time), with month, SKU, qty, sale date(s), Clinic List Price, and closing stock by SKU. Late/incomplete reporting is a material breach (replenishment may stop; unexplained shortages may be invoiced as sold). After each report, Consignor invoices Sold Products; Consignee pays **100%** of Clinic List Price (+ VAT if required) within **5 days** by bank transfer or cash. **No commission** is paid by Consignor. Late payment: **1%**/month interest; deliveries may suspend.

**5. Audit, loss & returns.** Consignor may count/audit stock on **≥2 business days’** notice. Shortages, negligent damage, improper storage, or expiry in Consignee’s custody are charged at Clinic List Price unless insured loss is proved. Returns only with prior written approval and return note; opened/expired items not returnable unless manufacturing defect.

**6. Brand & compliance.** Approved GENOSYS branding/claims only; no relabelling or repackaging; no sales outside UAE without consent; comply with UAE cosmetics, advertising, and VAT rules. Each Party keeps the other’s non-public terms confidential.

**7. Term & termination.** Effective **${effective}** until terminated (**30 days’** written notice). Consignor may terminate immediately for payment **30+ days** overdue, **two consecutive** missed monthly reports, insolvency, or brand/product harm. On termination: final reconciliation within **7 days**; pay unsettled sales; return remaining stock within **14 days** at Consignee’s cost (title until received).

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

function writeAgreementPdf(agreementNo) {
  fs.mkdirSync(CONTRACT_FOLDER, { recursive: true })
  fs.mkdirSync(ORDERS_DIR, { recursive: true })

  const base = `Genosys_Consignment_Agreement_NEW_YOU_STAR_${agreementNo}`
  const mdContract = path.join(CONTRACT_FOLDER, `${base}.md`)
  const htmlContract = path.join(CONTRACT_FOLDER, `${base}.html`)
  const pdfContract = path.join(CONTRACT_FOLDER, `${base}.pdf`)
  const pdfOrders = path.join(ORDERS_DIR, `GENOSYS_NEW_YOU_STAR_Consignment_Agreement_${agreementNo}.pdf`)

  const md = buildAgreementMarkdown(agreementNo)
  fs.writeFileSync(mdContract, md)

  exportConsignmentAgreementPdf({
    mdPath: mdContract,
    htmlPath: htmlContract,
    pdfPaths: [pdfContract, pdfOrders],
    headerPath: path.join(ORDERS_DIR, 'Header.png'),
    stampPath: path.join(ORDERS_DIR, 'Stamp.png'),
    cssPath: CSS_PATH,
  })

  return { mdContract, htmlContract, pdfContract, pdfOrders }
}

function writeIngestSummary() {
  const text = `# NEW YOU STAR — document ingest (${TODAY})

## Source folder
\`${CONTRACT_FOLDER}\`

| File | Extracted |
|---|---|
| Trade License -2026-New You sta.pdf | License **985526**, LLC-SO, Poly Clinic, expires **22 Sep 2026**, Shop 21 The Mall Umm Suqeim 3 |
| VAT Registration Certificate | TRN **100619066200003**, reg. **01 Aug 2022** |
| DHA License 2025.pdf | DHA **5938656**, Polyclinic, expires **07 Sep 2026**, Shop 21 The Mall |
| Corporate Tax Registration Certificate | Corporate tax registered (supporting doc) |

## Customer (MoySklad)
- **${CUSTOMER.name}**
- **${CUSTOMER.owner}** — Owner / Manager
- **${CUSTOMER.medicalDirector}** — Medical Director
- Phone: **${CUSTOMER.phone}** (alt **${CUSTOMER.phoneAlt}**)
- Address: **${CUSTOMER.street}**
- TRN: **${CUSTOMER.inn}**

## Agreement terms
- Payment within **5 days** after monthly sales report (not 14)
- Retail home-care consignment only; pro consumables = paid invoice

## Opening shipment
Retail bestsellers × **2 pcs** each: ${LINES.map(([c, q]) => `${c}×${q}`).join(', ')}
`
  const ingestPath = path.join(CONTRACT_FOLDER, `INGEST_SUMMARY_${TODAY}.md`)
  fs.writeFileSync(ingestPath, text)
  return ingestPath
}

async function ensureNoDuplicateDemand(agentId) {
  const date = TODAY
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate demand today: ${dup.name} (${dup.id})`)
}

async function exportStockNotePdf(demandId) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/demand/metadata/customtemplate/${STOCK_NOTE_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/demand/${demandId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Stock note export ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function main() {
  console.log('====================================================================')
  console.log('  NEW YOU STAR — customer + agreement + opening consignment')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const ingestPath = writeIngestSummary()
  console.log(`  Ingest summary: ${ingestPath}`)

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

  let contract =
    agent.id !== 'DRY-RUN' ? await findCommissionContract(agent.id) : null
  if (contract) {
    console.log(`  Agreement exists: ${contract.name} (${contract.id})`)
  } else if (!COMMIT) {
    console.log('  Would create Commission agreement (auto-number)')
    contract = { id: 'DRY-RUN', name: 'TBD' }
  } else {
    contract = await createCommissionContract(agent.id)
    console.log(`  Created agreement: ${contract.name} (${contract.id})`)
  }

  const agreementNo = contract.name === 'TBD' ? '(new)' : contract.name
  if (COMMIT && contract.id !== 'DRY-RUN') {
    const pdfs = writeAgreementPdf(contract.name)
    console.log(`  Agreement PDF (contract): ${pdfs.pdfContract}`)
    console.log(`  Agreement PDF (orders)  : ${pdfs.pdfOrders}`)
  } else if (!COMMIT) {
    console.log(`  Would generate 1-page agreement PDF (payment term 5 days)`)
  }

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)
  let sumMinor = 0
  let totalQty = 0
  console.log('\n  Opening shipment (retail ×2):')
  for (const line of resolved) {
    sumMinor += line.price * line.qty
    totalQty += line.qty
    console.log(
      `    ${line.code} ${line.name.slice(0, 46)} x${line.qty} @ ${money(line.price)} → ${money(line.price * line.qty)}`
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} units | ${resolved.length} SKUs`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  if (agent.id === 'DRY-RUN') throw new Error('Internal: agent not created')
  if (!contract?.id || contract.id === 'DRY-RUN') {
    contract = (await findCommissionContract(agent.id)) || (await createCommissionContract(agent.id))
    writeAgreementPdf(contract.name)
  }

  await ensureNoDuplicateDemand(agent.id)

  const demand = await api('POST', '/entity/demand', {
    moment: uaeMomentNow(),
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    contract: href('contract', contract.id),
    store: href('store', STORE_ID),
    state: demandStateHref(DEMAND_STATE_SHIPPED_ID),
    shipmentAddressFull: shipmentAddress(),
    description: [
      MARKER,
      'Opening retail consignment — bestsellers x2 each.',
      LINES.map(([c, q]) => `${c}x${q}`).join(', '),
      `Agreement ${contract.name}. Ship to: ${CUSTOMER.street}.`,
    ].join(' | '),
    positions: resolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })

  console.log(`\n  Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
  console.log(`  Customer: https://online.moysklad.ru/app/#company/edit?id=${agent.id}`)
  console.log(`  Contract: https://online.moysklad.ru/app/#contract/edit?id=${contract.id}`)

  const pdfBuf = await exportStockNotePdf(demand.id)
  const stockPdf = path.join(
    ORDERS_DIR,
    `GENOSYS_NEW_YOU_STAR_${demand.name}_Consignment_Stock_Note.pdf`
  )
  fs.writeFileSync(stockPdf, pdfBuf)
  console.log(`  Stock note PDF: ${stockPdf} (${pdfBuf.length} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
