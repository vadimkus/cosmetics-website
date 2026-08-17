#!/usr/bin/env node

/**
 * Shakirovna Ladies — fix consignment note 06051 misdelivery:
 *   Billed Hyaluron Serum 00195 ×1, physically received Hyaluron Cream 54458 ×1.
 *
 *   1) salesreturn 00195 ×1 @ clinic list (remove wrong SKU from 00030 books)
 *   2) demand 54458 ×1 @ clinic list (place correct SKU on 00030 books)
 *   Optional stock-note PDF for the cream shipment → ~/Desktop/orders/
 *
 * No loss write-off — misdelivery swap, not lost stock.
 *
 *   node --import dotenv/config scripts/moysklad-fix-shakirovna-06051-serum-cream-swap-20260722.js
 *   node --import dotenv/config scripts/moysklad-fix-shakirovna-06051-serum-cream-swap-20260722.js --commit
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

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = '93775ae5-d18d-11ea-0a80-02e00008417d'
const CONTRACT_ID = 'f5a1958d-c3ca-11eb-0a80-048e0027cbcb' // 00030
const STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STATE_RETURN_ID = 'f793c585-01bb-11f1-0a80-1ac1000b5df5'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const MARKER = `SHAKIROVNA-06051-SERUM-TO-CREAM-SWAP-${uaeToday()}`
const SERUM_CODE = '00195'
const CREAM_CODE = '54458'
const QTY = 1

const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'ECONNRESET' || e.message === 'fetch failed')) {
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

function stateHref(entityType, stateId) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
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
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function ensureNoDuplicate(entity) {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/${entity}?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate ${entity}: ${dup.name}`)
}

async function exportStockNotePdf(demandId, demandName) {
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
  if (res.status !== 302 && res.status !== 303) {
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 400)}`)
  }
  const pdfRes = await fetch(res.headers.get('location'))
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const out = path.join(
    ORDERS_DIR,
    `GENOSYS_Shakirovna_Marina_Consignment_Stock_Note_${demandName}.pdf`
  )
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna — 06051 serum→cream misdelivery fix')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker: ${MARKER}`)

  const [agent, contract, stock] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    fetchStockByCode(),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)

  const serum = stock.get(SERUM_CODE)
  const cream = stock.get(CREAM_CODE)
  if (!serum?.id) throw new Error(`Missing ${SERUM_CODE}`)
  if (!cream?.id) throw new Error(`Missing ${CREAM_CODE}`)
  if (!serum.price || !cream.price) throw new Error('Missing clinic salePrice')
  if (cream.available < QTY) {
    throw new Error(`Insufficient cream stock: need ${QTY}, have ${cream.available}`)
  }

  console.log('\n  Fix:')
  console.log(
    `    RETURN  ${SERUM_CODE} ${serum.name} x${QTY} @ ${money(serum.price)} → ${money(serum.price * QTY)}`
  )
  console.log(
    `    SHIP    ${CREAM_CODE} ${cream.name} x${QTY} @ ${money(cream.price)} → ${money(cream.price * QTY)}`
  )
  console.log(
    `    Net book delta at salon: −${money(serum.price)} serum / +${money(cream.price)} cream`
  )

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate('salesreturn')
  await ensureNoDuplicate('demand')

  const t0 = uaeMomentNow()
  const t1 = uaeMomentAddMinutes(3)

  const ret = await api('POST', '/entity/salesreturn', {
    moment: t0,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('salesreturn', STATE_RETURN_ID),
    description: [
      MARKER,
      'Fix note 06051: billed Hyaluron Serum 00195 but salon received Hyaluron Cream 54458.',
      'Virtual return of serum (no physical goods). Pairs with cream отгрузка.',
    ].join('\n'),
    positions: [
      {
        quantity: QTY,
        price: serum.price,
        assortment: href('product', serum.id),
        vat: 5,
        vatEnabled: true,
      },
    ],
  })
  console.log(`\n  1) Return: ${ret.name} | ${money(ret.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#salesreturn/edit?id=${ret.id}`)

  const demand = await api('POST', '/entity/demand', {
    moment: t1,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('demand', STATE_SHIPPED_ID),
    description: [
      MARKER,
      'Fix note 06051: place Hyaluron Cream 54458 that was physically delivered instead of serum.',
      'Pairs with serum salesreturn. Contract 00030.',
    ].join('\n'),
    positions: [
      {
        quantity: QTY,
        price: cream.price,
        assortment: href('product', cream.id),
        vat: 5,
        vatEnabled: true,
      },
    ],
  })
  console.log(`  2) Shipment: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  const pdf = await exportStockNotePdf(demand.id, demand.name)
  console.log(`  PDF: ${pdf}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
