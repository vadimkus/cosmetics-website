#!/usr/bin/env node

/**
 * Serene Skin — reclassify recon "unreported sales" as WRITE-OFF (2026-07-03).
 *
 * Salon states they do not have these 6 units and will not pay for them.
 * So they are shrinkage, not sales:
 *   • delete commission report 01399 (435 AED) and 01400 (380 AED)
 *   • post salesreturn (contract 00060) for the 6 units  → consignment remainder unchanged
 *   • post loss at buyPrice → we absorb cost, salon owes nothing
 * (Same treatment as hyaluron 00195 earlier today: return 00302 + loss.)
 *
 *   node --import dotenv/config scripts/moysklad-serene-writeoff-instead-of-sales-20260703.js
 *   node --import dotenv/config scripts/moysklad-serene-writeoff-instead-of-sales-20260703.js --commit
 */

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
const AGENT_ID = '993395aa-8da2-11ec-0a80-006b0038cd99'
const CONTRACT_ID = 'dc5c469a-d943-11ed-0a80-05bd0013eb27'
const STATE_RETURN_ID = 'f793c585-01bb-11f1-0a80-1ac1000b5df5'

const MARKER = 'SERENE-SKIN-SHRINKAGE-WRITEOFF-2026-07-03'

const DELETE_REPORTS = [
  { name: '01399', id: '2aaa5ca5-76d4-11f1-0a80-078100199873' },
  { name: '01400', id: 'ad45b0b5-76de-11f1-0a80-08c2001c107a' },
]

/** [code, qty, label] — not on shelf, salon will not pay → shrinkage */
const LOST_LINES = [
  ['00021', 1, 'Snow O₂ Cleanser 180ml'],
  ['00035', 1, 'Intensive Problem Control Cream 50g'],
  ['00040', 1, 'Intensive Blemish Balm Cream 50g'],
  ['00041', 1, 'Multi Sun Cream SPF40/PA++ 40g'],
  ['00144', 1, 'Skin Caring Blemish Balm Cushion #2 Beige'],
  ['54457', 1, 'Ultra Shield Sun Cream SPF50/PA++++ 50g'],
]

/** Full physical count (authoritative). */
const TARGET = {
  '00021': 3,
  '00035': 2,
  '00040': 1,
  '00041': 1,
  '00144': 2,
  '00195': 0,
  '54457': 1,
  '54461': 3,
  '00188': 5,
  '00140': 10,
  '54472': 3,
  '54473': 3,
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

const money = (minor) => (minor / 100).toFixed(2)

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    stock.set(row.code, {
      id: row.meta?.href?.split('/').pop()?.split('?')[0],
      code: row.code,
      name: row.name,
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function resolveLostLines(stock) {
  const resolved = []
  for (const [code, qty, label] of LOST_LINES) {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code}`)
    if (!row.price) throw new Error(`No salePrice for ${code}`)
    const p = await api('GET', `/entity/product/${row.id}`)
    const buyMinor = p.buyPrice?.value ?? 0
    resolved.push({ ...row, qty, label, buyMinor })
  }
  return resolved
}

async function ensureNoDuplicate(entity) {
  const filter = [
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/${entity}?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate ${entity} ${dup.name} already posted today`)
}

/** Full ledger: Σ demands − Σ reports − Σ returns per code. */
async function verifyBalances() {
  const agentHref = `${API}/entity/counterparty/${AGENT_ID}`
  const contractHref = `${API}/entity/contract/${CONTRACT_ID}`
  const filter = encodeURIComponent(`agent=${agentHref};contract=${contractHref}`)

  const demands = await fetchAll(`/entity/demand?filter=${filter}`)
  const reports = await fetchAll(`/entity/commissionreportin?filter=${filter}`)
  const returns = await fetchAll(`/entity/salesreturn?filter=${encodeURIComponent(`agent=${agentHref}`)}`)

  const cache = new Map()
  async function assortment(ref) {
    const h = ref?.meta?.href
    if (!h) return {}
    if (!cache.has(h)) cache.set(h, api('GET', h.replace(API, '')))
    return cache.get(h)
  }

  const map = new Map()
  async function addFrom(entity, id, field) {
    const pos = await fetchAll(`/entity/${entity}/${id}/positions`)
    for (const p of pos) {
      const a = await assortment(p.assortment)
      if (!a.code || !(a.code in TARGET)) continue
      if (!map.has(a.code)) map.set(a.code, { in: 0, sold: 0, ret: 0 })
      map.get(a.code)[field] += Number(p.quantity)
    }
  }

  for (const d of demands) await addFrom('demand', d.id, 'in')
  for (const r of reports) await addFrom('commissionreportin', r.id, 'sold')
  for (const r of returns) await addFrom('salesreturn', r.id, 'ret')

  console.log('\n  Balance check (full ledger vs physical):')
  let ok = true
  for (const [code, target] of Object.entries(TARGET)) {
    const r = map.get(code) || { in: 0, sold: 0, ret: 0 }
    const book = r.in - r.sold - r.ret
    const match = book === target
    if (!match) ok = false
    console.log(`    ${code} book ${book} target ${target} ${match ? 'OK' : 'MISMATCH'}`)
  }
  if (!ok) throw new Error('Post-commit balance check failed')
}

async function main() {
  console.log('====================================================================')
  console.log('  Serene Skin — shrinkage write-off (salon will not pay)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker: ${MARKER}`)

  for (const r of DELETE_REPORTS) {
    const doc = await api('GET', `/entity/commissionreportin/${r.id}?expand=agent`)
    if (doc.name !== r.name) throw new Error(`report ${r.id} name is ${doc.name}, expected ${r.name}`)
    if (doc.agent?.name !== 'Serene Skin Beauty Salon LLC') {
      throw new Error(`report ${r.name} wrong agent: ${doc.agent?.name}`)
    }
    console.log(`\n  Delete report ${doc.name} | ${money(doc.sum)} AED`)
  }

  const stock = await fetchStockByCode()
  const lost = await resolveLostLines(stock)

  console.log('\n  Shrinkage (return @ sale price + loss @ buy price):')
  let retMinor = 0
  let buyMinor = 0
  for (const l of lost) {
    retMinor += l.price * l.qty
    buyMinor += l.buyMinor * l.qty
    console.log(`    ${l.code} x${l.qty} return ${money(l.price)} | buy ${money(l.buyMinor)}  ${l.label}`)
  }
  console.log(`    Return total: ${money(retMinor)} AED | Loss @ cost: ${money(buyMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate('salesreturn')
  await ensureNoDuplicate('loss')

  console.log('\n  Step 1: delete commission reports 01399 + 01400')
  for (const r of DELETE_REPORTS) await api('DELETE', `/entity/commissionreportin/${r.id}`)

  console.log('  Step 2: consignment return (6 units off consignment)')
  const salesReturn = await api('POST', '/entity/salesreturn', {
    applicable: true,
    moment: uaeMomentNow(),
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('salesreturn', STATE_RETURN_ID),
    description: [
      MARKER,
      'Physical recon Jul 2026 — units not on shelf; salon disputes selling them, will not pay.',
      'Reclassified from commission reports 01399/01400 to shrinkage.',
    ].join('\n'),
    positions: lost.map((l) => ({
      quantity: l.qty,
      price: l.price,
      assortment: href('product', l.id),
      vat: 5,
      vatEnabled: true,
    })),
  })
  console.log(`    Return ${salesReturn.name} | ${money(salesReturn.sum)} AED`)

  console.log('  Step 3: loss @ buy price (we absorb cost)')
  const lossDoc = await api('POST', '/entity/loss', {
    applicable: true,
    moment: uaeMomentAddMinutes(2),
    organization: href('organization', ORG_ID),
    store: href('store', STORE_ID),
    description: [
      MARKER,
      'Consignment shrinkage Serene Skin — 6 units @ buyPrice. Not billed to salon.',
    ].join('\n'),
    positions: lost.map((l) => ({
      quantity: l.qty,
      price: l.buyMinor,
      assortment: href('product', l.id),
      vat: 0,
      vatEnabled: false,
    })),
  })
  console.log(`    Loss ${lossDoc.name} | ${money(lossDoc.sum || 0)} AED`)

  await verifyBalances()
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
