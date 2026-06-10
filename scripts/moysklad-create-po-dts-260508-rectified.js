#!/usr/bin/env node

/**
 * MoySklad заказ поставщику — DTS MG **rectified** line list only (28 positions).
 * Based on user screenshot 2026-05-08; excludes samples, FOC, shampoo 30ml, etc.
 *
 * GCMA02: invoice qty **100** = Peptide Gel Mask **kits/boxes** → **500** pcs of `00012` (5 masks/box).
 *
 * Usage:
 *   node scripts/moysklad-create-po-dts-260508-rectified.js
 *   node scripts/moysklad-create-po-dts-260508-rectified.js --commit
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
  number: 'DM GME 260508',
  dateIssued: '2026-05-08',
  deliveryExpected: '2026-05-29',
  supplierId: '3a0a3f28-33cf-11ea-0a80-043f000b9859',
  orgId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
}

const LINES = [
  { invCode: 'GCCL01', msCode: '00021', msId: '429cb35d-3449-11ea-0a80-00e60001afc8', name: 'Snow O₂ Cleanser 180ml', qty: 70 },
  { invCode: 'GCMA01', msCode: '00011', msId: 'f34ed25a-343f-11ea-0a80-05dc0001110e', name: 'EZ CO₂ MASK Professional Box', qty: 30 },
  { invCode: 'GCMA02', msCode: '00012', msId: '3068531d-3444-11ea-0a80-06a300016deb', name: 'Peptide Gel Mask 39g (100 kits × 5 pcs)', qty: 500 },
  { invCode: 'GCMA11', msCode: '00189', msId: 'e24a7dad-bf05-11ed-0a80-00c300038093', name: 'Skin Rescue Overnight Cream Mask 100g', qty: 40 },
  { invCode: 'GCSE13', msCode: '00191', msId: 'abddb813-bf06-11ed-0a80-02f300040558', name: 'Multi Functional Anti-Wrinkle Serum 30ml', qty: 30 },
  { invCode: 'GCSE14', msCode: '00194', msId: '99d39c51-82f1-11ee-0a80-13cb0013bf3a', name: 'Multi Vita Radiance Serum 30ml', qty: 60 },
  { invCode: 'GCSE03', msCode: '00029', msId: '2f5d9cdb-344b-11ea-0a80-00e60001ca85', name: 'Problem Control Serum 30ml', qty: 20 },
  { invCode: 'GCSE17', msCode: '00195', msId: 'c8e39f4f-82f1-11ee-0a80-05410014a6ab', name: 'Moisture Replenishing Hyaluron Serum 30ml', qty: 20 },
  { invCode: 'GCSE05', msCode: '00030', msId: '54f31ab6-344b-11ea-0a80-00e60001cc8a', name: 'All For Sensitive Serum 30ml', qty: 10 },
  { invCode: 'GCCR01', msCode: '00031', msId: '1ebfde72-42b6-11ea-0a80-05c1000c3129', name: 'Intensive Hydro Soothing Cream 50g', qty: 20 },
  { invCode: 'GCCR33', msCode: '00190', msId: '6b2a342c-bf06-11ed-0a80-02f30003ffc8', name: 'Multi Functional Anti-Wrinkle Cream 50g', qty: 40 },
  { invCode: 'GCCR30', msCode: '00122', msId: 'd0fc1a8f-a96f-11ea-0a80-00d100134b49', name: 'Multi-Vita Radiance Cream 50g', qty: 50 },
  { invCode: 'GCCR39', msCode: '54458', msId: 'be705c7d-9808-11ee-0a80-02460037622e', name: 'Moisture Replenishing Hyaluron Cream 50g', qty: 50 },
  { invCode: 'GCCR09', msCode: '00041', msId: '60c64e56-42b9-11ea-0a80-01e3000bb41e', name: 'Multi Sun Cream SPF40/PA++ 40g', qty: 100 },
  { invCode: 'GCCR37', msCode: '54457', msId: '8f9e1d0b-8d10-11ee-0a80-00e10079b204', name: 'Ultra Shield Sun Cream SPF50/PA++++ 50g', qty: 100 },
  { invCode: 'GCCR08', msCode: '00040', msId: '1e0d0700-42b9-11ea-0a80-0096000bc0d0', name: 'Intensive Blemish Balm Cream 50g', qty: 50 },
  { invCode: 'GCCR46', msCode: '54472', msId: 'a71de556-07c8-11f1-0a80-03480002a6a8', name: 'Revita Glow BB Cream #01 Bright 50g', qty: 10 },
  { invCode: 'GCCR47', msCode: '54473', msId: '1d0adef0-07c9-11f1-0a80-1981000318de', name: 'Revita Glow BB Cream #02 Natural 50g', qty: 10 },
  { invCode: 'GCCR43', msCode: '54465', msId: 'c7a5e201-d28a-11ef-0a80-11b100116a32', name: 'Soothing Repair Post Cream 100g', qty: 10 },
  { invCode: 'GCMI02', msCode: '00188', msId: '8a087af0-8ab3-11ed-0a80-06c700c08673', name: 'Microbiome Energy Infusing Mist 80ml', qty: 100 },
  { invCode: 'GCEX01', msCode: '00129', msId: 'cd901a4e-e88b-11ea-0a80-05ae00007806', name: 'EPI Turnover Boosting Peeling Gel 100g', qty: 50 },
  { invCode: 'GCFO02', msCode: '00144', msId: 'aca39b2a-d092-11ec-0a80-013600a5ed6d', name: 'Skin Caring Blemish Balm Cushion #2 Beige', qty: 100 },
  { invCode: 'GCEC01', msCode: '00053', msId: '3e1bd611-42bd-11ea-0a80-01e3000bd9c2', name: 'EyeCell Eye Peptide Gel Patch (box)', qty: 20 },
  { invCode: 'GCEC02', msCode: '00054', msId: '6cb1b241-42bd-11ea-0a80-0693000bd6ca', name: 'EyeCell Eye Contour Serum 10ml', qty: 30 },
  { invCode: 'GCEC03', msCode: '00055', msId: '96d8a1a4-42bd-11ea-0a80-0693000bd7f8', name: 'EyeCell Eye Contour Cream 20ml', qty: 20 },
  { invCode: 'GCHR12', msCode: '00051', msId: 'b4763e83-42bc-11ea-0a80-01e3000bd569', name: 'HR³ Matrix Hair Tonic 70ml', qty: 30 },
  { invCode: 'GCHR20', msCode: '00052', msId: 'f4009e02-42bc-11ea-0a80-05c1000c82b5', name: 'HR³ Matrix Scalp & Hair Shampoo 300ml', qty: 20 },
  { invCode: 'GMHR02', msCode: '54471', msId: '75051581-da57-11f0-0a80-048b00080569', name: 'HR3 Matrix Scalp Brush', qty: 10 },
]

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
  console.log('════════════════════════════════════════════════════════════════════')
  console.log('  MoySklad PO — DTS MG rectified 28 lines (DM GME 260508)')
  console.log('════════════════════════════════════════════════════════════════════')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const existing = await api('GET', `/entity/purchaseorder?search=${encodeURIComponent(INVOICE.number)}&limit=5`)
  const dup = existing.rows.find((r) => r.name === INVOICE.number)
  if (dup) {
    console.log(`  PO "${INVOICE.number}" already exists id=${dup.id}`)
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
  for (const l of enriched) {
    const lineAed = l.qty * l.buyAed
    totalAed += lineAed
    totalQty += l.qty
    console.log(
      `  ${l.invCode} ${l.msCode} ${l.name.slice(0, 40).padEnd(40)} qty ${String(l.qty).padStart(4)}  ${lineAed.toFixed(2)} AED`
    )
    if (l.buyMinor === 0) console.log('       ⚠ buyPrice 0')
  }
  console.log()
  console.log(`  Lines: ${LINES.length}  |  units: ${totalQty}  |  sum (buy): ${totalAed.toFixed(2)} AED`)

  const payload = {
    name: INVOICE.number,
    moment: `${INVOICE.dateIssued} 00:00:00`,
    deliveryPlannedMoment: `${INVOICE.deliveryExpected} 00:00:00`,
    applicable: true,
    organization: href('organization', INVOICE.orgId),
    agent: href('counterparty', INVOICE.supplierId),
    store: href('store', INVOICE.storeId),
    description: [
      `DTS MG — rectified commodity list only (28 items, screenshot 2026-05-08).`,
      `No sample boxes, no FOC block, no 30ml shampoo line.`,
      `GCMA02: 100 Peptide Gel Mask kits → 500 pcs × 00012 (5 pcs/box).`,
      `Prices: product buyPrice AED (reconcile vs supplier invoice).`,
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
