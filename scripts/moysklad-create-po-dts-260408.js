#!/usr/bin/env node

/**
 * Create MoySklad purchaseorder for DTS MG invoice #DM GME 260408 (2026-04-08).
 *
 * - Currency: AED (MoySklad default) — no USD override
 * - Prices: pulled automatically from each product's stored buyPrice
 * - Quantities: as per invoice, with Peptide Gel Mask expanded to 300 individual pcs (60 boxes × 5)
 *
 * Usage:
 *   node scripts/moysklad-create-po-dts-260408.js          # dry run
 *   node scripts/moysklad-create-po-dts-260408.js --commit  # post
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

const INVOICE = {
  number: 'DM GME 260408',
  dateIssued: '2026-04-08',
  deliveryExpected: '2026-04-21',
  supplierId: '3a0a3f28-33cf-11ea-0a80-043f000b9859',  // DTSMG Genosys
  orgId: 'e18525a4-33c5-11ea-0a80-043f000b2738',        // Genosys Middle East FZ-LLC
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',      // Genosys Warehouse
}

// Peptide Gel Mask: 60 boxes × 5pcs = 300 individual pcs → track in MoySklad as 00012 (single tube)
const LINES = [
  { invCode: 'GCCL02', msCode: '00024', msId: '0a27b901-344a-11ea-0a80-021700017918', name: 'Snow O₂ Cleanser 500ml',                   qty: 20 },
  { invCode: 'GCMA02', msCode: '00012', msId: '3068531d-3444-11ea-0a80-06a300016deb', name: 'Peptide Gel Mask 39g (60 boxes × 5 pcs)',  qty: 300 },
  { invCode: 'GCCR44', msCode: '00035', msId: '456e3fbd-42b7-11ea-0a80-0095000be27d', name: 'Intensive Problem Control Cream 50g',      qty: 20 },
  { invCode: 'GCCR39', msCode: '54458', msId: 'be705c7d-9808-11ee-0a80-02460037622e', name: 'Moisture Replenishing Hyaluron Cream 50g', qty: 60 },
  { invCode: 'GCCR37', msCode: '54457', msId: '8f9e1d0b-8d10-11ee-0a80-00e10079b204', name: 'Ultra Shield Sun Cream SPF50/PA++++ 50g',  qty: 20 },
  { invCode: 'GCFO02', msCode: '00144', msId: 'aca39b2a-d092-11ec-0a80-013600a5ed6d', name: 'Skin Caring Blemish Balm Cushion #2 Beige',qty: 200 },
  { invCode: 'GCEC01', msCode: '00053', msId: '3e1bd611-42bd-11ea-0a80-01e3000bd9c2', name: 'EyeCell Eye Peptide Gel Patch (box)',      qty: 50 },
  { invCode: 'GCEC02', msCode: '00054', msId: '6cb1b241-42bd-11ea-0a80-0693000bd6ca', name: 'EyeCell Eye Contour Serum 10ml',           qty: 20 },
  { invCode: 'GCEC03', msCode: '00055', msId: '96d8a1a4-42bd-11ea-0a80-0693000bd7f8', name: 'EyeCell Eye Contour Cream 20ml',           qty: 20 },
  { invCode: 'GCEC00', msCode: '00059', msId: '1bc5e51a-42bf-11ea-0a80-05c0000c5af5', name: 'EyeCell Eye Zone Care Kit (box)',          qty: 10 },
  { invCode: 'GCHR12', msCode: '00051', msId: 'b4763e83-42bc-11ea-0a80-01e3000bd569', name: 'HR³ Matrix Hair Tonic 70ml',               qty: 20 },
  { invCode: 'GCHR20', msCode: '00052', msId: 'f4009e02-42bc-11ea-0a80-05c1000c82b5', name: 'HR³ Matrix Scalp & Hair Shampoo 300ml',    qty: 20 },
]

async function api(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: {
      Authorization: AUTH,
      'Accept-Encoding': 'gzip',
      'Accept': 'application/json;charset=utf-8',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} — ${text.slice(0, 500)}`)
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
  console.log('════════════════════════════════════════════════════════════════════')
  console.log('  MoySklad Purchase Order — DTS MG Invoice DM GME 260408  (AED)')
  console.log('════════════════════════════════════════════════════════════════════')
  console.log(`  Mode: ${COMMIT ? '★ COMMIT (live) ★' : 'DRY RUN'}`)
  console.log()

  // 1. Fetch buyPrice for every line (AED, stored in minor units internally)
  console.log('  Fetching current buy prices from each product...')
  const enriched = []
  for (const l of LINES) {
    const p = await api('GET', `/entity/product/${l.msId}`)
    const buyMinor = p.buyPrice?.value ?? 0
    const currencyIso = '...' // resolved below
    enriched.push({ ...l, buyMinor, buyAed: buyMinor / 100, buyMeta: p.buyPrice })
  }

  // 2. Idempotency
  const existing = await api('GET', `/entity/purchaseorder?search=${encodeURIComponent(INVOICE.number)}&limit=5`)
  const dup = existing.rows.find((r) => r.name === INVOICE.number)
  if (dup) {
    console.log(`\n  ⚠︎  A PO named "${INVOICE.number}" already exists (id=${dup.id}). Aborting to prevent duplicate.`)
    process.exit(2)
  }

  // 3. Build positions — price auto-populated from product's stored buyPrice (AED)
  const positions = enriched.map((l) => ({
    quantity: l.qty,
    price: l.buyMinor,           // AED minor units, pulled from product
    assortment: href('product', l.msId),
    vat: 0,
    vatEnabled: false,
  }))

  // 4. Payload — no currency override (uses org default = AED)
  const moment = `${INVOICE.dateIssued} 00:00:00`
  const deliveryPlannedMoment = `${INVOICE.deliveryExpected} 00:00:00`
  const payload = {
    name: INVOICE.number,
    moment,
    deliveryPlannedMoment,
    applicable: true,
    organization: href('organization', INVOICE.orgId),
    agent: href('counterparty', INVOICE.supplierId),
    store: href('store', INVOICE.storeId),
    description: [
      `Supplier invoice: ${INVOICE.number} (2026-04-08)`,
      `Delivery ETA: ${INVOICE.deliveryExpected}`,
      `Incoterms: FOB Incheon  |  Payment: T/T in advance`,
      `Origin: Republic of Korea  |  HS Code: 3304.99.1000`,
      ``,
      `Note: GCMA02 "Peptide Gel Mask Kit" booked as 300 individual 39g masks (60 boxes × 5 pcs).`,
      `Note: Prices auto-populated from each product's stored buyPrice in AED.`,
      `      Supplier's USD unit prices may differ — reconcile on goods receipt.`,
    ].join('\n'),
    positions,
  }

  // 5. Summary table
  console.log()
  console.log('  Line items  (prices in AED from product catalog):')
  console.log('  ' + '─'.repeat(100))
  console.log(
    '  ' +
      [
        'Inv'.padEnd(7),
        'MS'.padEnd(6),
        'Product'.padEnd(45),
        'Qty'.padStart(6),
        'AED/u'.padStart(10),
        'Line AED'.padStart(14),
      ].join(' │ ')
  )
  console.log('  ' + '─'.repeat(100))
  let totalAed = 0
  let totalQty = 0
  for (const l of enriched) {
    const lineAed = l.qty * l.buyAed
    totalAed += lineAed
    totalQty += l.qty
    console.log(
      '  ' +
        [
          l.invCode.padEnd(7),
          l.msCode.padEnd(6),
          l.name.slice(0, 45).padEnd(45),
          String(l.qty).padStart(6),
          l.buyAed.toFixed(2).padStart(10),
          lineAed.toFixed(2).padStart(14),
        ].join(' │ ')
    )
    if (l.buyMinor === 0) console.log(`         ⚠︎  buyPrice is 0 — will need to set manually in MoySklad`)
  }
  console.log('  ' + '─'.repeat(100))
  console.log(
    '  ' +
      [
        'TOTAL'.padEnd(7),
        ''.padEnd(6),
        `${LINES.length} lines`.padEnd(45),
        String(totalQty).padStart(6),
        ''.padStart(10),
        totalAed.toFixed(2).padStart(14),
      ].join(' │ ')
  )
  console.log()
  console.log(`  Reference: Invoice USD total was $6,676.00 (inc. Peptide Gel Mask $756 = 60 boxes).`)
  console.log(`             At 3.67 AED/USD: ~24,500 AED.  Compare vs total above for sanity.`)
  console.log()

  if (!COMMIT) {
    console.log('  DRY RUN. Re-run with --commit to post.')
    return
  }

  const created = await api('POST', '/entity/purchaseorder', payload)
  console.log('  ✓ Purchase order created!')
  console.log(`    ID       : ${created.id}`)
  console.log(`    Name     : ${created.name}`)
  console.log(`    Sum      : ${(created.sum / 100).toFixed(2)} AED`)
  console.log(`    Open UI  : https://online.moysklad.ru/app/#purchaseorder/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('\nFATAL:', e.message)
  process.exit(1)
})
