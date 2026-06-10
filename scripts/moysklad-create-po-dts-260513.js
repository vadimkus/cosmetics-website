#!/usr/bin/env node

/**
 * MoySklad purchase order — DTS MG commercial invoice **DM GME 260513** (2026-05-14).
 *
 * Source: ~/Desktop/14052026/DM GME 260513_Commercial Invoice.pdf
 * Scope: all paid commodity lines through **GMHR02** HR³ Matrix Scalp Brush (inclusive).
 * Excludes: catalogue, non-woven bags, sample boxes, GCHR21 30ml, FOC/support block.
 *
 * - GCMA02: 200 kits × 5 masks → **1000** pcs `00012` (Peptide Gel Mask 39g).
 * - GCCR07: 7 professional boxes → `00039` (Postcream box 12×20g).
 * - GCPS*: invoice unit "Box" → MoySklad vial SKUs (00018 / 00065 / 00069), qty as invoice.
 * - Prices: product **buyPrice** AED (reconcile vs supplier USD on receipt).
 *
 * Usage:
 *   node --import dotenv/config scripts/moysklad-create-po-dts-260513.js
 *   node --import dotenv/config scripts/moysklad-create-po-dts-260513.js --commit
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
  number: 'DM GME 260513',
  dateIssued: '2026-05-14',
  deliveryExpected: '2026-06-04',
  supplierId: '3a0a3f28-33cf-11ea-0a80-043f000b9859',
  orgId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
}

/** Paid lines through GMHR02 — order matches commercial invoice. */
const LINES = [
  { invCode: 'GRST025', msCode: '00074', msId: '5018be2f-563c-11ea-0a80-051300095bc7', name: 'Stamp 0.25mm', qty: 18 },
  { invCode: 'GRST050', msCode: '00130', msId: '8e67ce65-fcbd-11ea-0a80-0334000914a3', name: 'Stamp 0.50mm', qty: 10 },
  { invCode: 'GCMR02', msCode: '54461', msId: 'bcf432e7-ec44-11ee-0a80-077500174711', name: 'Skin Defender Lip & Eye Makeup Remover 200ml', qty: 5 },
  { invCode: 'GCCL01', msCode: '00021', msId: '429cb35d-3449-11ea-0a80-00e60001afc8', name: 'Snow O₂ Cleanser 180ml', qty: 50 },
  { invCode: 'GCTN03', msCode: '00145', msId: '86d64dba-29c8-11ed-0a80-07740006f514', name: 'Problem Control Toner 200ml', qty: 20 },
  { invCode: 'GCTN04', msCode: '00183', msId: '15867f00-43d2-11ed-0a80-0f42000e9bcc', name: 'Problem Control Toner 500ml', qty: 10 },
  { invCode: 'GCMA02', msCode: '00012', msId: '3068531d-3444-11ea-0a80-06a300016deb', name: 'Peptide Gel Mask 39g (200 kits × 5 pcs)', qty: 1000 },
  { invCode: 'GCMA05', msCode: '00013', msId: '806e9e52-3444-11ea-0a80-05dc00014e2d', name: 'Hydro Cool Modeling Mask 1kg', qty: 70 },
  { invCode: 'GCMA06', msCode: '00063', msId: '51e74608-45cb-11ea-0a80-01f80015bea2', name: 'Intensive Repair Collagen Mask 23g', qty: 500 },
  { invCode: 'GCMA11', msCode: '00189', msId: 'e24a7dad-bf05-11ed-0a80-00c300038093', name: 'Skin Rescue Overnight Cream Mask 100g', qty: 30 },
  { invCode: 'GCPS01', msCode: '00018', msId: '68872ebb-3447-11ea-0a80-03f90001c5cc', name: 'Power Solution AWS 1 Vial 2ml', qty: 10 },
  { invCode: 'GCPS03', msCode: '00065', msId: '8a43a8e9-45d4-11ea-0a80-048a00166b96', name: 'Power Solution PCS 1 Vial 2ml', qty: 10 },
  { invCode: 'GCPS05', msCode: '00069', msId: 'c4784fc1-45d5-11ea-0a80-02fd001636a2', name: 'Power Solution CTS 1 Vial 2ml', qty: 15 },
  { invCode: 'GCSE13', msCode: '00191', msId: 'abddb813-bf06-11ed-0a80-02f300040558', name: 'Multi Functional Anti-Wrinkle Serum 30ml', qty: 30 },
  { invCode: 'GCSE14', msCode: '00194', msId: '99d39c51-82f1-11ee-0a80-13cb0013bf3a', name: 'Multi Vita Radiance Serum 30ml', qty: 30 },
  { invCode: 'GCSE03', msCode: '00029', msId: '2f5d9cdb-344b-11ea-0a80-00e60001ca85', name: 'Problem Control Serum 30ml', qty: 20 },
  { invCode: 'GCSE17', msCode: '00195', msId: 'c8e39f4f-82f1-11ee-0a80-05410014a6ab', name: 'Moisture Replenishing Hyaluron Serum 30ml', qty: 20 },
  { invCode: 'GCSE05', msCode: '00030', msId: '54f31ab6-344b-11ea-0a80-00e60001cc8a', name: 'All For Sensitive Serum 30ml', qty: 10 },
  { invCode: 'GCCR01', msCode: '00031', msId: '1ebfde72-42b6-11ea-0a80-05c1000c3129', name: 'Intensive Hydro Soothing Cream 50g', qty: 10 },
  { invCode: 'GCCR33', msCode: '00190', msId: '6b2a342c-bf06-11ed-0a80-02f30003ffc8', name: 'Multi Functional Anti-Wrinkle Cream 50g', qty: 20 },
  { invCode: 'GCCR34', msCode: '00034', msId: '0cf0e298-42b7-11ea-0a80-0475000b95ca', name: 'Multi Functional Anti-Wrinkle Cream 250g', qty: 5 },
  { invCode: 'GCCR44', msCode: '00035', msId: '456e3fbd-42b7-11ea-0a80-0095000be27d', name: 'Intensive Problem Control Cream 50g', qty: 15 },
  { invCode: 'GCCR45', msCode: '00036', msId: '7f4736b3-42b7-11ea-0a80-0693000b9cb9', name: 'Intensive Problem Control Cream 250g', qty: 20 },
  { invCode: 'GCCR30', msCode: '00122', msId: 'd0fc1a8f-a96f-11ea-0a80-00d100134b49', name: 'Multi-Vita Radiance Cream 50g', qty: 50 },
  { invCode: 'GCCR31', msCode: '00123', msId: '727d6fd4-b0be-11ea-0a80-06d7001d9fa0', name: 'Multi-Vita Radiance Cream 230g', qty: 5 },
  { invCode: 'GCCR39', msCode: '54458', msId: 'be705c7d-9808-11ee-0a80-02460037622e', name: 'Moisture Replenishing Hyaluron Cream 50g', qty: 50 },
  { invCode: 'GCCR40', msCode: '54460', msId: '10963a8c-b541-11ee-0a80-15c60014ba73', name: 'Moisture Replenishing Hyaluron Cream 250g', qty: 5 },
  { invCode: 'GCCR09', msCode: '00041', msId: '60c64e56-42b9-11ea-0a80-01e3000bb41e', name: 'Multi Sun Cream SPF40/PA++ 40g', qty: 20 },
  { invCode: 'GCCR37', msCode: '54457', msId: '8f9e1d0b-8d10-11ee-0a80-00e10079b204', name: 'Ultra Shield Sun Cream SPF50/PA++++ 50g', qty: 20 },
  { invCode: 'GCCR08', msCode: '00040', msId: '1e0d0700-42b9-11ea-0a80-0096000bc0d0', name: 'Intensive Blemish Balm Cream 50g', qty: 20 },
  { invCode: 'GCCR46', msCode: '54472', msId: 'a71de556-07c8-11f1-0a80-03480002a6a8', name: 'Revita Glow BB Cream #01 Bright 50g', qty: 10 },
  { invCode: 'GCCR47', msCode: '54473', msId: '1d0adef0-07c9-11f1-0a80-1981000318de', name: 'Revita Glow BB Cream #02 Natural 50g', qty: 10 },
  { invCode: 'GCCR07', msCode: '00039', msId: 'ebb38e3d-42b8-11ea-0a80-0475000baa7d', name: 'Soothing Repair Postcream box (20g×12)', qty: 7 },
  { invCode: 'GCCR43', msCode: '54465', msId: 'c7a5e201-d28a-11ef-0a80-11b100116a32', name: 'Soothing Repair Post Cream 100g', qty: 15 },
  { invCode: 'GCMI02', msCode: '00188', msId: '8a087af0-8ab3-11ed-0a80-06c700c08673', name: 'Microbiome Energy Infusing Mist 80ml', qty: 30 },
  { invCode: 'GCEX01', msCode: '00129', msId: 'cd901a4e-e88b-11ea-0a80-05ae00007806', name: 'EPI Turnover Boosting Peeling Gel 100g', qty: 20 },
  { invCode: 'GCFO01', msCode: '00143', msId: '8e55b3ff-d092-11ec-0a80-022900a6db36', name: 'Skin Caring Blemish Balm Cushion #1 Ivory', qty: 20 },
  { invCode: 'GCFO02', msCode: '00144', msId: 'aca39b2a-d092-11ec-0a80-013600a5ed6d', name: 'Skin Caring Blemish Balm Cushion #2 Beige', qty: 50 },
  { invCode: 'GCFO03', msCode: '54464', msId: '374ebc0b-a7cd-11ef-0a80-07b3001b04d7', name: 'Skin Caring Blemish Balm Cushion #3 Camel', qty: 30 },
  { invCode: 'GCEC01', msCode: '00053', msId: '3e1bd611-42bd-11ea-0a80-01e3000bd9c2', name: 'EyeCell Eye Peptide Gel Patch (box)', qty: 30 },
  { invCode: 'GCEC02', msCode: '00054', msId: '6cb1b241-42bd-11ea-0a80-0693000bd6ca', name: 'EyeCell Eye Contour Serum 10ml', qty: 30 },
  { invCode: 'GCEC03', msCode: '00055', msId: '96d8a1a4-42bd-11ea-0a80-0693000bd7f8', name: 'EyeCell Eye Contour Cream 20ml', qty: 20 },
  { invCode: 'GCEC00', msCode: '00059', msId: '1bc5e51a-42bf-11ea-0a80-05c0000c5af5', name: 'EyeCell Eye Zone Care Kit (box)', qty: 5 },
  { invCode: 'GCHR13', msCode: '00050', msId: '85e2c7e3-42bc-11ea-0a80-0095000c187a', name: 'HR³ Matrix Scalp Peeling 100ml', qty: 5 },
  { invCode: 'GCHR12', msCode: '00051', msId: 'b4763e83-42bc-11ea-0a80-01e3000bd569', name: 'HR³ Matrix Hair Tonic 70ml', qty: 20 },
  { invCode: 'GCHR20', msCode: '00052', msId: 'f4009e02-42bc-11ea-0a80-05c1000c82b5', name: 'HR³ Matrix Scalp & Hair Shampoo 300ml', qty: 10 },
  { invCode: 'GMHR02', msCode: '54471', msId: '75051581-da57-11f0-0a80-048b00080569', name: 'HR³ Matrix Scalp Brush', qty: 10 },
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
  console.log('  MoySklad PO — DTS MG  DM GME 260513  (through Scalp Brush)')
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
      `  ${l.invCode} ${l.msCode} ${l.name.slice(0, 42).padEnd(42)} qty ${String(l.qty).padStart(5)}  ${lineAed.toFixed(2)} AED`
    )
    if (l.buyMinor === 0) console.log('       ⚠ buyPrice 0')
  }
  console.log()
  console.log(`  Lines: ${LINES.length}  |  units: ${totalQty}  |  sum (buy): ${totalAed.toFixed(2)} AED`)
  console.log(`  Supplier invoice USD (paid block through GMHR02): ~$14,472 (excl. samples/FOC/marketing)`)

  const payload = {
    name: INVOICE.number,
    moment: `${INVOICE.dateIssued} 00:00:00`,
    deliveryPlannedMoment: `${INVOICE.deliveryExpected} 00:00:00`,
    applicable: true,
    organization: href('organization', INVOICE.orgId),
    agent: href('counterparty', INVOICE.supplierId),
    store: href('store', INVOICE.storeId),
    description: [
      `Source: DM GME 260513_Commercial Invoice.pdf (2026-05-14, Desktop/14052026).`,
      `Scope: paid lines GRST025 → GMHR02 HR³ Matrix Scalp Brush only.`,
      `Excluded: GMBR15 catalogue, GMAC05 bags, GCHR21 30ml shampoo, sample boxes, FOC/support.`,
      `GCMA02: 200 Peptide Gel Mask kits → 1000 pcs × 00012 (5 pcs/kit).`,
      `GCCR07: 7× professional Postcream boxes → 00039.`,
      `GCPS*: invoice "Box" → vial SKUs 00018/00065/00069 at invoice qty.`,
      `Prices: MoySklad buyPrice AED — reconcile vs supplier USD on receipt.`,
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
