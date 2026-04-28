#!/usr/bin/env node

/**
 * Add missing GENOSYS 50g creams + serums to the ARFI shipment documents.
 *
 * Dry-run:
 *   set -a; source .env; set +a
 *   node scripts/moysklad-add-arfi-missing-creams-serums.js
 *
 * Commit:
 *   node scripts/moysklad-add-arfi-missing-creams-serums.js --commit
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

const SALONS = [
  {
    name: 'ARFI NAILS BEAUTY SALON',
    counterpartyId: '39a1aa83-a5a6-11f0-0a80-1cbc00050fea',
    demandId: '585544cb-4221-11f1-0a80-09740075fe2c', // 06036
  },
  {
    name: 'ARFI NAILS BEAUTY SALON 2',
    counterpartyId: 'dc883e47-f051-11f0-0a80-0f7100059e21',
    demandId: '5942f4ee-4221-11f1-0a80-03b50076c1d4', // 06037
  },
]

const TARGET_CODES = [
  // All GENOSYS creams exactly 50g
  '00040', // Intensive Blemish Balm Cream 50g
  '00031', // Intensive Hydro Soothing Cream 50g
  '00035', // Intensive Problem Control Cream 50g
  '54458', // Moisture Replenishing Hyaluron Cream 50g
  '00190', // Multi Functional Anti-Wrinkle Cream 50g
  '00122', // Multi-Vita Radiance Cream 50g
  '54472', // Revita Glow BB Cream #01 Bright 50g
  '54473', // Revita Glow BB Cream #02 Natural 50g
  '54457', // Ultra Shield Sun Cream SPF50 50g

  // All GENOSYS serums
  '00030', // All For Sensitive Serum 30ml
  '00027', // Anti-Wrinkle Serum 30ml
  '00054', // EyeCell Eye Contour Serum 10ml
  '00195', // Moisture Replenishing Hyaluron Serum 30ml
  '00191', // Multi Functional Anti-Wrinkle Serum 30ml
  '00194', // Multi Vita Radiance Serum 30ml
  '00029', // Problem Control Serum 30ml
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} — ${text.slice(0, 800)}`)
  return text ? JSON.parse(text) : null
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
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

const productCache = new Map()
async function resolveProductByHref(hrefValue) {
  if (!productCache.has(hrefValue)) productCache.set(hrefValue, api('GET', hrefValue))
  return productCache.get(hrefValue)
}

async function fetchHaveCodes(counterpartyId) {
  const filter = [
    `agent=${API}/entity/counterparty/${counterpartyId}`,
    'moment>=2023-01-01 00:00:00',
    'moment<=2026-04-27 23:59:59',
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}&order=moment,asc`)
  const have = new Set()
  for (const doc of docs) {
    const positions = await fetchAll(`${doc.meta.href}/positions`)
    for (const position of positions) {
      const product = await resolveProductByHref(position.assortment.meta.href)
      if (product.code) have.add(product.code)
    }
  }
  return have
}

async function fetchDemandPositionCodes(demandId) {
  const positions = await fetchAll(`/entity/demand/${demandId}/positions`)
  const codes = new Set()
  for (const position of positions) {
    const product = await resolveProductByHref(position.assortment.meta.href)
    if (product.code) codes.add(product.code)
  }
  return codes
}

async function main() {
  console.log('════════════════════════════════════════════════════════════════════')
  console.log('  Add missing ARFI 50g creams + serums')
  console.log('════════════════════════════════════════════════════════════════════')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)

  const stock = await fetchStockByCode()
  const aggregateNeeded = new Map()
  const salonPlans = []

  for (const salon of SALONS) {
    const have = await fetchHaveCodes(salon.counterpartyId)
    const demandCodes = await fetchDemandPositionCodes(salon.demandId)
    const missing = TARGET_CODES
      .filter((code) => !have.has(code))
      .filter((code) => !demandCodes.has(code))

    const lines = missing.map((code) => {
      const product = stock.get(code)
      if (!product) throw new Error(`Product code not found in stock report: ${code}`)
      return { ...product, qty: 2 }
    })

    for (const line of lines) {
      aggregateNeeded.set(line.code, (aggregateNeeded.get(line.code) || 0) + line.qty)
    }

    salonPlans.push({ salon, lines })
  }

  for (const [code, qty] of aggregateNeeded.entries()) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Product ID missing for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock for ${code} ${item.name}: need ${qty}, available ${item.available}`)
    }
  }

  for (const plan of salonPlans) {
    console.log()
    console.log(`${plan.salon.name} — add to demand ${plan.salon.demandId}`)
    if (!plan.lines.length) {
      console.log('  Nothing to add; salon already has all target creams/serums.')
      continue
    }
    console.log('  ' + '─'.repeat(100))
    console.log(`  ${'Code'.padEnd(6)} │ ${'Product'.padEnd(58)} │ ${'Qty'.padStart(4)} │ ${'Unit'.padStart(9)} │ ${'Line'.padStart(10)}`)
    console.log('  ' + '─'.repeat(100))
    for (const line of plan.lines) {
      console.log(
        `  ${line.code.padEnd(6)} │ ${line.name.slice(0, 58).padEnd(58)} │ ${String(line.qty).padStart(4)} │ ${money(line.price).padStart(9)} │ ${money(line.price * line.qty).padStart(10)}`
      )
    }
    const total = plan.lines.reduce((sum, line) => sum + line.price * line.qty, 0)
    console.log('  ' + '─'.repeat(100))
    console.log(`  Add qty: ${plan.lines.reduce((sum, line) => sum + line.qty, 0)} | Add value incl. VAT: ${money(total)} AED`)

    if (COMMIT) {
      for (const line of plan.lines) {
        await api('POST', `/entity/demand/${plan.salon.demandId}/positions`, {
          quantity: line.qty,
          price: line.price,
          assortment: href('product', line.id),
          vat: 5,
          vatEnabled: true,
        })
      }
      const updated = await api('GET', `/entity/demand/${plan.salon.demandId}`)
      const positions = await fetchAll(`/entity/demand/${plan.salon.demandId}/positions`)
      console.log(`  Updated demand ${updated.name}: ${positions.length} lines | ${money(updated.sum)} AED`)
    }
  }

  if (!COMMIT) {
    console.log()
    console.log('DRY RUN complete. Re-run with --commit to add positions to live demands.')
  }
}

main().catch((error) => {
  console.error('FATAL:', error.message)
  process.exit(1)
})
