#!/usr/bin/env node

/**
 * MoySklad Loss (Списание) — подарки / безвозмездная выдача со склада.
 *
 * Full write-up: docs/SESSION_CHANGES_2026-05-06_GIFT_INVENTORY_LOSS_MOYSKLAD.md
 *
 * Стоимость строк: buyPrice из карточки товара (закупочная в AED, как в PO-скриптах).
 *
 * Маппинг позиций (уточни в МС, если что-то не то):
 * - PDRN x1 → Skin Reboot PDRN mask Pack (54467), не ампула Bio Meso
 * - Hair tonic — кол-во не указано → 1 шт. (00051)
 *
 * Dry-run:
 *   set -a; source .env; set +a
 *   node scripts/moysklad-create-gift-writeoff-20260506.js
 *
 * Проведение:
 *   node scripts/moysklad-create-gift-writeoff-20260506.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD env vars')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'

const DOC = {
  moment: '2026-05-06 14:00:00',
  marker: 'GIFT-WRITE-OFF-2026-05-06',
}

/** [code, qty, label] */
const LINES = [
  ['00052', 2, 'HR³ Matrix Scalp & Hair Shampoo 300ml'],
  ['00144', 1, 'Skin Caring BB Cushion #2 Beige'],
  ['00051', 1, 'HR³ Matrix Hair Tonic 70ml (qty assumed 1 — not specified)'],
  ['00022', 1, 'Snow Booster Toner 200ml'],
  ['00055', 1, 'EyeCell Eye Contour Cream 20ml'],
  ['54467', 1, 'Skin Reboot PDRN mask Pack — if ampoule was meant, fix in MoySklad'],
  ['00054', 1, 'EyeCell Eye Contour Serum 10ml'],
  ['00030', 1, 'All For Sensitive Serum 30ml'],
  ['00012', 10, 'Peptide Gel Mask 39g (single pcs)'],
  ['00063', 10, 'Intensive Repair Collagen Mask 23g'],
  ['00140', 20, 'Soothing Bomb Sea Algae Mask 23g'],
  ['54466', 2, 'Bio-Ferment Age Defying Powder Mask 300g'],
  ['00031', 1, 'Intensive Hydro Soothing Cream 50g'],
]

async function api(method, path, body) {
  const res = await fetch(path.startsWith('http') ? path : API + path, {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} — ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

function href(type, id) {
  return {
    meta: {
      href: `${API}/entity/${type}/${id}`,
      type,
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return (minor / 100).toFixed(2)
}

async function fetchAll(path) {
  const rows = []
  let offset = 0
  const limit = 1000
  while (true) {
    const sep = path.includes('?') ? '&' : '?'
    const data = await api('GET', `${path}${sep}limit=${limit}&offset=${offset}`)
    const batch = data?.rows || []
    rows.push(...batch)
    if (batch.length < limit) break
    offset += limit
  }
  return rows
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    const id = row.meta?.href?.split('/').pop()?.split('?')[0]
    stock.set(row.code, {
      id,
      code: row.code,
      name: row.name,
      available: Number(row.stock || 0) - Number(row.reserve || 0),
    })
  }
  return stock
}

async function ensureNoDuplicate() {
  const search = encodeURIComponent(DOC.marker)
  const existing = await api('GET', `/entity/loss?filter=description~${search}&limit=10`)
  const dup = (existing?.rows || []).find((r) => (r.description || '').includes(DOC.marker))
  if (dup) {
    throw new Error(
      `Duplicate: loss already exists (${dup.name}, id=${dup.id}). ` +
        `https://online.moysklad.ru/app/#loss/edit?id=${dup.id}`
    )
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  MoySklad LOSS — gift write-off @ product buyPrice (AED)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)
  console.log(`  Marker: ${DOC.marker}`)
  console.log()

  await ensureNoDuplicate()

  const stock = await fetchStockByCode()
  const positions = []
  let totalMinor = 0
  const warnings = []

  console.log('  Lines:')
  for (const [code, qty, label] of LINES) {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown product code in stock report: ${code}`)
    if (row.available < qty) {
      throw new Error(`Insufficient stock ${code} (${label}): need ${qty}, have ${row.available}`)
    }

    const p = await api('GET', `/entity/product/${row.id}`)
    const buyMinor = p.buyPrice?.value ?? 0
    if (buyMinor === 0) warnings.push(`${code} ${row.name}: buyPrice is 0 in catalog`)

    const lineMinor = buyMinor * qty
    totalMinor += lineMinor
    positions.push({
      quantity: qty,
      price: buyMinor,
      assortment: href('product', row.id),
      vat: 0,
      vatEnabled: false,
    })
    console.log(
      `    ${code} x${qty}  @ ${money(buyMinor)} AED  →  ${money(lineMinor)} AED  | ${row.name}`
    )
    if (label) console.log(`      (${label})`)
  }

  console.log()
  console.log(`  Total (buy cost): ${money(totalMinor)} AED`)
  if (warnings.length) {
    console.log()
    for (const w of warnings) console.log(`  ⚠︎  ${w}`)
  }

  if (!COMMIT) {
    console.log()
    console.log('  DRY RUN complete. Re-run with --commit to post the loss.')
    return
  }

  const payload = {
    applicable: true,
    moment: DOC.moment,
    description: [
      DOC.marker,
      'Подарки / безвозмездная выдача — списание по закупочной цене (buyPrice) из карточки товара.',
      'Если нужен другой SKU (напр. Bio Meso PDRN Ampoule вместо набора масок PDRN) — отмени документ и поправь скрипт.',
    ].join(' | '),
    organization: href('organization', ORG_ID),
    store: href('store', STORE_ID),
    positions,
  }

  const created = await api('POST', '/entity/loss', payload)
  console.log()
  console.log(`  Created loss: ${created.name} | sum=${money(created.sum || totalMinor)} AED`)
  console.log(`  ID: ${created.id}`)
  console.log(`  UI: https://online.moysklad.ru/app/#loss/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
