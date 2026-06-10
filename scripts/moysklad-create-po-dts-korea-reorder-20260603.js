#!/usr/bin/env node

/**
 * MoySklad purchase order — Korea restock **Tier 1 + Tier 2** (2026-06-03).
 *
 * Source: live restock analysis + docs/SESSION_CHANGES_2026-06-03_KOREA_REORDER_RECHECK.md
 * Supplier: DTS MG (same as DM GME invoices). Replace PO name when supplier invoice number is known.
 *
 * Tier 1 — ship immediately (~1,150 units)
 * Tier 2 — same shipment if budget allows (~330 units)
 *
 * Usage:
 *   node --import dotenv/config scripts/moysklad-create-po-dts-korea-reorder-20260603.js
 *   node --import dotenv/config scripts/moysklad-create-po-dts-korea-reorder-20260603.js --commit
 *   node --import dotenv/config scripts/moysklad-create-po-dts-korea-reorder-20260603.js --tier1-only
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')
const TIER1_ONLY = process.argv.includes('--tier1-only')

const PO = {
  number: 'Korea reorder 2026-06-03 T1+T2',
  dateIssued: '2026-06-03',
  deliveryExpected: '2026-08-01',
  supplierId: '3a0a3f28-33cf-11ea-0a80-043f000b9859',
  orgId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
}

const TIER1 = [
  { msCode: '00051', msId: 'b4763e83-42bc-11ea-0a80-01e3000bd569', name: 'HR³ Matrix Hair Tonic 70ml', qty: 150 },
  { msCode: '00038', msId: 'bc185527-42b8-11ea-0a80-0095000bf07a', name: 'Soothing Repair Post Cream 20g', qty: 50 },
  { msCode: '00140', msId: '9d634465-2690-11ec-0a80-0767000c229e', name: 'Soothing Bomb Sea Algae Mask 23g', qty: 600 },
  { msCode: '00037', msId: '3805fbad-42b8-11ea-0a80-03cf000bfaef', name: 'Skin Barrier Protecting Cream 100g', qty: 30 },
  { msCode: '00022', msId: '70f536c1-3449-11ea-0a80-05dc0001878d', name: 'Snow Booster Toner 200ml', qty: 80 },
  { msCode: '00053', msId: '3e1bd611-42bd-11ea-0a80-01e3000bd9c2', name: 'EyeCell Eye Peptide Gel Patch (box)', qty: 120 },
  { msCode: '00052', msId: 'f4009e02-42bc-11ea-0a80-05c1000c82b5', name: 'HR³ Scalp & Hair Shampoo 300ml', qty: 60 },
  { msCode: '54464', msId: '374ebc0b-a7cd-11ef-0a80-07b3001b04d7', name: 'BB Cushion #3 Camel', qty: 60 },
]

/** Same shipment if budget allows — ~330 units */
const TIER2 = [
  { msCode: '00021', msId: '429cb35d-3449-11ea-0a80-00e60001afc8', name: 'Snow O₂ Cleanser 180ml', qty: 100 },
  { msCode: '00188', msId: '8a087af0-8ab3-11ed-0a80-06c700c08673', name: 'Microbiome Energy Infusing Mist 80ml', qty: 80 },
  { msCode: '00190', msId: '6b2a342c-bf06-11ed-0a80-02f30003ffc8', name: 'Multi Functional Anti-Wrinkle Cream 50g', qty: 40 },
  { msCode: '00194', msId: '99d39c51-82f1-11ee-0a80-13cb0013bf3a', name: 'Multi Vita Radiance Serum 30ml', qty: 50 },
  { msCode: '00191', msId: 'abddb813-bf06-11ed-0a80-02f300040558', name: 'Multi Functional Anti-Wrinkle Serum 30ml', qty: 30 },
  { msCode: '00024', msId: '0a27b901-344a-11ea-0a80-021700017918', name: 'Snow O₂ Cleanser 500ml', qty: 15 },
  { msCode: '54470', msId: '89b90c39-da54-11f0-0a80-166700076a14', name: 'BIO-MESO PDRN Expert Ampoule 60000', qty: 10 },
  { msCode: '00004', msId: 'c83c9cf9-343b-11ea-0a80-05dc0000f00e', name: 'Standard Detachable Manual Roller 1.5mm', qty: 5 },
]

/** Revita Glow — summer base order (added 2026-06-04) */
const REVITA = [
  { msCode: '54472', msId: 'a71de556-07c8-11f1-0a80-03480002a6a8', name: 'Revita Glow BB #01 Bright 50g', qty: 40 },
  { msCode: '54473', msId: '1d0adef0-07c9-11f1-0a80-1981000318de', name: 'Revita Glow BB #02 Natural 50g', qty: 60 },
]

const LINES = TIER1_ONLY ? TIER1 : [...TIER1, ...TIER2, ...REVITA]

async function api(method, path, body) {
  const res = await fetch(API + path, {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} — ${text.slice(0, 700)}`)
  return text ? JSON.parse(text) : null
}

function href(entityType, id) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/${id}`,
      type: entityType,
      mediaType: 'application/json',
    },
  }
}

async function main() {
  const poLabel = TIER1_ONLY ? 'Korea reorder 2026-06-03 T1' : PO.number
  console.log('════════════════════════════════════════════════════════════════════')
  console.log(`  MoySklad PO — DTS MG  ${poLabel}`)
  console.log('════════════════════════════════════════════════════════════════════')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)
  console.log(`  Lines: Tier 1 (${TIER1.length})${TIER1_ONLY ? '' : ` + Tier 2 (${TIER2.length})`}`)

  const existing = await api('GET', `/entity/purchaseorder?search=${encodeURIComponent(poLabel)}&limit=5`)
  const dup = existing.rows.find((r) => r.name === poLabel)
  if (dup) {
    console.log(`  PO "${poLabel}" already exists id=${dup.id}`)
    process.exit(2)
  }

  const enriched = []
  for (const l of LINES) {
    const p = await api('GET', `/entity/product/${l.msId}`)
    const buyMinor = p.buyPrice?.value ?? 0
    enriched.push({ ...l, buyMinor, buyAed: buyMinor / 100 })
  }

  const positions = enriched.map((l) => ({
    quantity: l.qty,
    price: l.buyMinor,
    assortment: href('product', l.msId),
    vat: 0,
    vatEnabled: false,
  }))

  let totalAed = 0
  let totalQty = 0
  console.log()
  if (!TIER1_ONLY) {
    console.log('  --- Tier 1 ---')
  }
  for (let i = 0; i < enriched.length; i++) {
    if (!TIER1_ONLY && i === TIER1.length) console.log('  --- Tier 2 (same shipment if budget allows) ---')
    const l = enriched[i]
    const lineAed = l.qty * l.buyAed
    totalAed += lineAed
    totalQty += l.qty
    console.log(
      `  ${l.msCode} ${l.name.slice(0, 42).padEnd(42)} qty ${String(l.qty).padStart(5)}  ${lineAed.toFixed(2)} AED`
    )
    if (l.buyMinor === 0) console.log('       ⚠ buyPrice 0')
  }
  console.log()
  console.log(`  Lines: ${LINES.length}  |  units: ${totalQty}  |  sum (buy): ${totalAed.toFixed(2)} AED`)

  const payload = {
    name: poLabel,
    moment: `${PO.dateIssued} 00:00:00`,
    deliveryPlannedMoment: `${PO.deliveryExpected} 00:00:00`,
    applicable: true,
    organization: href('organization', PO.orgId),
    agent: href('counterparty', PO.supplierId),
    store: href('store', PO.storeId),
    description: [
      'Korea restock from MoySklad analysis 2026-06-03 (horizon 90d, target 120d cover).',
      'Tier 1: critical/urgent — hair tonic, post cream 20g, sea algae, skin barrier, snow booster, eyepatch, shampoo, cushion Camel.',
      TIER1_ONLY
        ? 'Tier 2 omitted (--tier1-only).'
        : 'Tier 2 (same shipment): 00021×100, 00188×80, 00190×40, 00194×50, 00191×30, 00024×15, 54470×10, 00004×5 (~330 units).',
      'Excluded: peptide/collagen/SPF (overstock), 00042/00028 discontinued.',
      'Rename PO when DTS supplier invoice (DM GME xxxxx) is issued; reconcile buyPrice vs USD on receipt.',
    ].join('\n'),
    positions,
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/purchaseorder', payload)
  console.log(`\n  Created: ${created.name} | ${(created.sum / 100).toFixed(2)} AED`)
  console.log(`  id=${created.id}`)
  console.log(`  https://online.moysklad.ru/app/#purchaseorder/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
