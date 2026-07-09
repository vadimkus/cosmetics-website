#!/usr/bin/env node

/**
 * Korea reorder PO — add PI (DM GME 260605) lines missing from MoySklad PO.
 *
 * PO: Korea reorder 2026-06-03 T1+T2
 * Source: PI page 1 paid commodity lines; maps from moysklad-create-po-dts-260513.js
 * Skips: samples/FOC, GCAP01 (no MoySklad SKU), GCMA09 bulk (covered by 00140×600 on PO).
 *
 *   node --import dotenv/config scripts/moysklad-update-korea-po-pi-missing-lines-20260612.js
 *   node --import dotenv/config scripts/moysklad-update-korea-po-pi-missing-lines-20260612.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const PO_ID = '61767a0d-5f3a-11f1-0a80-191700184737'
const PO_NAME = 'Korea reorder 2026-06-03 T1+T2'
const MARKER = `KOREA-PO-PI-260605-MISSING-LINES-${uaeToday()}`

/** PI invCode → [msCode, qty, note] — only lines NOT already on PO */
const PI_MISSING = [
  ['GCMA06', '00063', 500, 'Collagen mask 23g'],
  ['GCMA11', '00189', 20, 'Overnight cream mask 100g'],
  ['GCCR34', '00034', 10, 'Anti-wrinkle cream 250g'],
  ['GCCR31', '00123', 10, 'Multi-Vita radiance cream 230g'],
  ['GCCR39', '54458', 30, 'Hyaluron cream 50g'],
  ['GCCR09', '00041', 20, 'Multi Sun SPF40 40g'],
  ['GCCR07', '00039', 6, 'Postcream pro box 12×20g'],
  ['GCCR43', '54465', 5, 'Postcream 100g'],
  ['GCEX01', '00129', 20, 'EPI peeling gel 100g'],
  ['GCFO01', '00143', 30, 'Cushion Ivory'],
  ['GCFO02', '00144', 100, 'Cushion Beige'],
  ['GCHR13', '00050', 10, 'HR³ scalp peeling 100ml'],
  ['GMHR02', '54471', 5, 'HR³ scalp brush'],
]

/** PI lines skipped — no MoySklad product */
const PI_IGNORED = [
  ['GCAP01', 'BIO-MESO PDRN Homecare Ampoule 5000 ×5 — no MoySklad SKU'],
  ['GCCL03', 'Snow O₂ sample box — sample/FOC'],
  ['GCCR42', 'Blemish balm sample box — sample'],
  ['GCCR20', 'Hydro soothing sample box — sample'],
  ['GCCR22', 'Problem control sample box — sample'],
  ['GCCL05', 'Cerabarrier cleanser sample — registration'],
  ['GCCL06', 'Cerabarrier cleanser sample — registration'],
]

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
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
    })
  }
  return stock
}

async function existingPoCodes(poId) {
  const positions = await fetchAll(`/entity/purchaseorder/${poId}/positions?expand=assortment`)
  const codes = new Map()
  for (const p of positions) {
    const code = p.assortment?.code
    if (code) codes.set(code, (codes.get(code) || 0) + p.quantity)
  }
  return codes
}

async function main() {
  console.log('====================================================================')
  console.log('  Korea PO — add PI missing lines (DM GME 260605)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  PO  : ${PO_NAME}`)

  const po = await api('GET', `/entity/purchaseorder/${PO_ID}`)
  console.log(`  Current sum: ${money(po.sum)} AED`)

  const onPo = await existingPoCodes(PO_ID)
  console.log(`  Lines on PO: ${onPo.size}`)

  const stock = await fetchStockByCode()
  const toAdd = []
  const alreadyOnPo = []

  for (const [invCode, msCode, qty, note] of PI_MISSING) {
    if (onPo.has(msCode)) {
      alreadyOnPo.push({ invCode, msCode, poQty: onPo.get(msCode), piQty: qty, note })
      continue
    }
    const item = stock.get(msCode)
    if (!item?.id) {
      console.log(`  SKIP ${invCode} → ${msCode}: not in MoySklad catalog`)
      continue
    }
    const product = await api('GET', `/entity/product/${item.id}`)
    const buyMinor = product.buyPrice?.value ?? 0
    if (buyMinor === 0) console.log(`  ⚠ ${msCode} buyPrice 0`)
    toAdd.push({ invCode, msCode, qty, note, id: item.id, name: product.name, buyMinor })
  }

  console.log('\n  Already on PO (PI also lists — qty may differ):')
  for (const r of alreadyOnPo) {
    console.log(`    ${r.msCode} PO=${r.poQty} PI=${r.piQty} — ${r.note}`)
  }

  console.log('\n  PI ignored (no product / sample):')
  for (const [code, reason] of PI_IGNORED) console.log(`    ${code}: ${reason}`)

  console.log('\n  To ADD:')
  let addSum = 0
  let addQty = 0
  for (const l of toAdd) {
    const line = l.qty * l.buyMinor
    addSum += line
    addQty += l.qty
    console.log(
      `    ${l.invCode} ${l.msCode} ${l.name.slice(0, 42).padEnd(42)} ×${String(l.qty).padStart(4)} @ ${money(l.buyMinor)} = ${money(line)}`
    )
  }
  console.log(`\n  Add total: ${money(addSum)} AED | ${addQty} units | ${toAdd.length} new lines`)
  console.log(`  PO after : ${money((po.sum || 0) + addSum)} AED (est.)`)

  if (!toAdd.length) {
    console.log('\n  Nothing to add.')
    return
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  if ((po.description || '').includes(MARKER)) {
    throw new Error(`Marker already on PO — likely applied (${MARKER})`)
  }

  for (const l of toAdd) {
    await api('POST', `/entity/purchaseorder/${PO_ID}/positions`, {
      quantity: l.qty,
      price: l.buyMinor,
      assortment: href('product', l.id),
      vat: 0,
      vatEnabled: false,
    })
  }

  const desc = [
    po.description || '',
    MARKER,
    `Added ${toAdd.length} PI lines from DM GME 260605 (${uaeToday()}): ${toAdd.map((l) => `${l.msCode}×${l.qty}`).join(', ')}.`,
  ].join('\n')
  await api('PUT', `/entity/purchaseorder/${PO_ID}`, { meta: po.meta, description: desc })

  const poAfter = await api('GET', `/entity/purchaseorder/${PO_ID}`)
  const posAfter = await fetchAll(`/entity/purchaseorder/${PO_ID}/positions?expand=assortment`)
  console.log(`\n  Updated PO: ${poAfter.name} | ${money(poAfter.sum)} AED | ${posAfter.length} lines`)
  console.log(`  https://online.moysklad.ru/app/#purchaseorder/edit?id=${PO_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
