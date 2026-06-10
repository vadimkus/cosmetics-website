#!/usr/bin/env node

/**
 * Shakirovna Ladies Beauty Saloon — commission report + matching отгрузка (contract 00030).
 * Screenshot 2026-06-10: 18 SKU / 51 pcs.
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-ladies-salon-commission-demand-20260610.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-ladies-salon-commission-demand-20260610.js --commit
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
const CONTRACT_ID = 'f5a1958d-c3ca-11eb-0a80-048e0027cbcb'
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'

const CUSTOMER_EXACT_NAME = 'Shakirovna Ladies Beauty Saloon'
const MARKER = `SHAKIROVNA-LADIES-COMMISSION-DEMAND-SCREEN-${uaeToday()}`

/** Screenshot order — must total 51 pcs */
const LINES = [
  ['00041', 1, 'Multi Sun Cream SPF40 40ml'],
  ['00144', 1, 'Skin Caring Blemish Balm Cushion #02 Beige'],
  ['00189', 1, 'Skin Rescue Overnight Cream Mask 100g'],
  ['00029', 2, 'Problem Control Serum 30ml'],
  ['00035', 2, 'Intensive Problem Control Cream 50g'],
  ['00052', 1, 'HR³ Matrix Scalp & Hair Shampoo 300ml'],
  ['00122', 1, 'Multi Vita Radiance Cream 50g'],
  ['00038', 1, 'Soothing Repair Post Cream 20g'],
  ['00040', 2, 'Intensive Blemish Balm Cream 50g'],
  ['54467', 2, 'Skin Reboot PDRN mask Pack'],
  ['54457', 1, 'Ultra Shield Sun Cream SPF50/PA++++ 50g'],
  ['00140', 24, 'Soothing Bomb Sea Algae Mask 23g'],
  ['00053', 1, 'EyeCell Eye Peptide Gel Patch (box)'],
  ['00063', 3, 'Intensive Repair Collagen Mask 23g'],
  ['00188', 3, 'Microbiome Energy Infusing Mist 80ml'],
  ['00037', 1, 'Skin Barrier Protecting Cream 100ml'],
  ['00021', 2, 'Snow O₂ Cleanser 180ml'],
  ['00191', 2, 'Multi Functional Anti-Wrinkle Serum 30ml'],
]

const EXPECTED_TOTAL_QTY = LINES.reduce((s, [, q]) => s + q, 0)

const POST_CREAM_LOOSE = '00038'
const POST_CREAM_BOX = '00039'
const VIALS_PER_BOX = 12

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

async function findCounterpartyByExactName(exactName) {
  const token = exactName.split(/\s+/)[0]
  const data = await api('GET', `/entity/counterparty?limit=100&search=${encodeURIComponent(token)}`)
  const hit = (data?.rows || []).find((r) => r.name === exactName)
  if (!hit) throw new Error(`Counterparty "${exactName}" not found`)
  return hit
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

async function fetchProductByCode(code) {
  const data = await api('GET', `/entity/product?filter=${encodeURIComponent(`code=${code}`)}&limit=1`)
  const product = data?.rows?.[0]
  if (!product) return null
  return {
    id: product.id,
    code: product.code,
    name: product.name,
    available: 0,
    price: Number(product.salePrices?.[0]?.value || 0),
  }
}

async function resolveProduct(code, stock) {
  const hit = stock.get(code)
  if (hit?.id) {
    if (!hit.price) {
      const product = await fetchProductByCode(code)
      if (product?.price) hit.price = product.price
    }
    return hit
  }
  const product = await fetchProductByCode(code)
  if (!product?.id) throw new Error(`Unknown product code: ${code}`)
  return product
}

async function loadPostCreamPrepFromToday(stock) {
  const filter = [
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const enters = await fetchAll(`/entity/enter?filter=${encodeURIComponent(filter)}`)
  const prep = enters.find((d) => (d.description || '').includes(MARKER))
  if (!prep) return 0

  const positions = await fetchAll(`/entity/enter/${prep.id}/positions?expand=assortment`)
  const line = positions.find((p) => p.assortment?.code === POST_CREAM_LOOSE)
  const qty = Number(line?.quantity || 0)
  if (qty > 0) {
    let loose = stock.get(POST_CREAM_LOOSE)
    if (!loose?.id) loose = await resolveProduct(POST_CREAM_LOOSE, stock)
    loose.available = Math.max(loose.available, qty)
    stock.set(POST_CREAM_LOOSE, loose)
    console.log(`  Stock prep already done today: enter ${prep.name} → ${qty}×${POST_CREAM_LOOSE}`)
  }
  return qty
}

async function ensurePostCreamStock(stock, needed) {
  const loose = stock.get(POST_CREAM_LOOSE)
  if (!loose?.id) throw new Error(`Missing ${POST_CREAM_LOOSE}`)
  if (loose.available >= needed) return

  const prepQty = await loadPostCreamPrepFromToday(stock)
  if (prepQty > 0 && stock.get(POST_CREAM_LOOSE).available >= needed) return

  const shortage = needed - loose.available
  const box = stock.get(POST_CREAM_BOX)
  if (!box?.id) throw new Error(`Missing ${POST_CREAM_BOX} for unpack`)
  const boxesNeeded = Math.ceil(shortage / VIALS_PER_BOX)
  if (box.available < boxesNeeded) {
    throw new Error(
      `Insufficient post cream 20g: need ${needed}×${POST_CREAM_LOOSE}, have ${loose.available} loose + ${box.available} boxes (${POST_CREAM_BOX})`
    )
  }

  console.log(
    `\n  Stock prep: unpack ${boxesNeeded}×${POST_CREAM_BOX} → enter ${shortage}×${POST_CREAM_LOOSE} (have ${loose.available} loose)`
  )

  const moment = uaeMomentNow()
  const loss = await api('POST', '/entity/loss', {
    moment,
    applicable: true,
    organization: href('organization', ORG_ID),
    store: href('store', STORE_ID),
    description: `${MARKER} — unpack ${boxesNeeded}× post cream box → ${shortage}×20g`,
    positions: [{ quantity: boxesNeeded, assortment: href('product', box.id) }],
  })
  console.log(`  Stock: loss ${loss.name} (${boxesNeeded}× box ${POST_CREAM_BOX})`)

  const looseProduct = await api('GET', `/entity/product/${loose.id}`)
  const enter = await api('POST', '/entity/enter', {
    moment,
    applicable: true,
    organization: href('organization', ORG_ID),
    store: href('store', STORE_ID),
    description: `${MARKER} — enter ${shortage}× post cream 20g from box unpack`,
    positions: [
      {
        quantity: shortage,
        price: looseProduct.buyPrice?.value || 1866,
        assortment: href('product', loose.id),
      },
    ],
  })
  console.log(`  Stock: enter ${enter.name} (${shortage}× ${POST_CREAM_LOOSE})`)

  loose.available += shortage
  box.available -= boxesNeeded
}

async function ensureNoDuplicate(agentId, entity, marker) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/${entity}?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate ${entity} (${dup.name}, id=${dup.id})`)
}

async function resolveLines(stock, { requireWarehouseStock }) {
  const resolved = []
  let totalQty = 0
  let totalMinor = 0
  const stockWarnings = []
  for (const [code, qty, label] of LINES) {
    const item = await resolveProduct(code, stock)
    if (item.available < qty) {
      const msg = `${code} (${label}): need ${qty}, warehouse have ${item.available}`
      if (requireWarehouseStock) {
        throw new Error(`Insufficient warehouse stock ${msg}`)
      }
      stockWarnings.push(msg)
    }
    if (!item.price) throw new Error(`No clinic salePrice for ${code}`)
    totalQty += qty
    totalMinor += item.price * qty
    resolved.push({ ...item, qty, label })
  }
  if (totalQty !== EXPECTED_TOTAL_QTY) {
    throw new Error(`Qty mismatch: expected ${EXPECTED_TOTAL_QTY}, got ${totalQty}`)
  }
  return { resolved, totalQty, totalMinor, stockWarnings }
}

function buildPositions(resolved, forReport) {
  return resolved.map((line) => {
    const pos = {
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    }
    if (forReport) {
      pos.reward = 0
    }
    return pos
  })
}

function verifyDocPositions(docPositions, resolved, docLabel) {
  if (docPositions.length !== resolved.length) {
    throw new Error(`${docLabel}: position count ${docPositions.length} ≠ ${resolved.length}`)
  }
  const byCode = new Map()
  for (const line of resolved) byCode.set(line.code, line.qty)
  for (const p of docPositions) {
    const code = p.assortment?.code
    const qty = Number(p.quantity)
    if (!byCode.has(code)) throw new Error(`${docLabel}: unexpected code ${code}`)
    if (byCode.get(code) !== qty) {
      throw new Error(`${docLabel}: qty mismatch on ${code} — expected ${byCode.get(code)}, got ${qty}`)
    }
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Ladies — commission report + отгрузка (18 SKU / 51 pcs)')
  console.log('====================================================================')
  console.log(`  Mode   : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker : ${MARKER}`)
  console.log(`  Expected total qty: ${EXPECTED_TOTAL_QTY}`)

  const agent = await findCounterpartyByExactName(CUSTOMER_EXACT_NAME)
  const contract = await api('GET', `/entity/contract/${CONTRACT_ID}`)
  console.log(`  Agent   : ${agent.name} (${agent.id})`)
  console.log(`  Contract: ${contract.name} (${CONTRACT_ID})`)

  const stock = await fetchStockByCode()
  const { resolved, totalQty, totalMinor, stockWarnings } = await resolveLines(stock, {
    requireWarehouseStock: false,
  })

  if (stockWarnings.length) {
    console.log('\n  Warehouse stock warnings (report still includes all lines):')
    for (const w of stockWarnings) console.log(`    ⚠ ${w}`)
  }

  console.log('\n  Lines (clinic salePrice, VAT incl.):')
  for (const line of resolved) {
    console.log(
      `    ${line.code} ${line.label} x${line.qty} @ ${money(line.price)} → ${money(line.price * line.qty)}`
    )
  }
  console.log(`  Total: ${totalQty} pcs | ${money(totalMinor)} AED`)

  const postCreamNeed = LINES.find(([code]) => code === POST_CREAM_LOOSE)?.[1] || 0
  if (postCreamNeed > 0) {
    const loose = stock.get(POST_CREAM_LOOSE) || (await resolveProduct(POST_CREAM_LOOSE, stock))
    if (!stock.has(POST_CREAM_LOOSE)) stock.set(POST_CREAM_LOOSE, loose)
    if (loose.available < postCreamNeed) {
      const box = stock.get(POST_CREAM_BOX)
      const boxesNeeded = Math.ceil((postCreamNeed - loose.available) / VIALS_PER_BOX)
      console.log(
        `\n  Post cream 20g (${POST_CREAM_LOOSE}): need ${postCreamNeed}, loose ${loose.available}` +
          (box ? `, boxes ${box.available} (${POST_CREAM_BOX})` : `, no ${POST_CREAM_BOX} in stock report`)
      )
      if (!COMMIT) {
        if (box && box.available >= boxesNeeded) {
          console.log(`  DRY RUN — would unpack ${boxesNeeded}×${POST_CREAM_BOX} before commit`)
        } else {
          console.log('  BLOCKED — insufficient loose + box stock for post cream 20g')
        }
      }
    }
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    if (stockWarnings.length) {
      console.log('  NOTE: flagged SKUs will be resolved via stock prep or block commit.')
    }
    return
  }

  await ensureNoDuplicate(agent.id, 'commissionreportin', MARKER)
  await ensureNoDuplicate(agent.id, 'demand', MARKER)

  // Atomic: stock prep + full warehouse check BEFORE any documents.
  // Stock report omits zero-qty SKUs; after box-unpack enter, use in-memory map (lips-for-kiss pattern).
  if (postCreamNeed > 0) {
    await ensurePostCreamStock(stock, postCreamNeed)
  } else {
    await loadPostCreamPrepFromToday(stock)
  }
  const { resolved: commitResolved } = await resolveLines(stock, { requireWarehouseStock: true })

  const tReport = uaeMomentNow()
  const tDemand = uaeMomentAddMinutes(3)
  const positionsReport = buildPositions(commitResolved, true)
  const positionsDemand = buildPositions(commitResolved, false)

  const report = await api('POST', '/entity/commissionreportin', {
    moment: tReport,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
    commissionPeriodStart: tReport,
    commissionPeriodEnd: tReport,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'Screenshot 2026-06-10: 18 product rows / 51 pcs sold on consignment.',
      'Sea Algae screen 25g → sku 00140 (23g). Medi Scalp → 00052 HR³ shampoo 300ml.',
    ].join('\n'),
    positions: positionsReport,
  })

  const reportPos = await fetchAll(
    `/entity/commissionreportin/${report.id}/positions?expand=assortment`
  )
  verifyDocPositions(reportPos, commitResolved, 'Commission report')
  console.log(`\n  1) Report: ${report.name} | ${money(report.sum)} AED | ${reportPos.length} lines`)
  console.log(`     https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)

  const demand = await api('POST', '/entity/demand', {
    moment: tDemand,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    description: [
      MARKER,
      `Replenishment отгрузка paired with report ${report.name} — same 18 SKU / 51 pcs.`,
    ].join('\n'),
    positions: positionsDemand,
  })

  const demandPos = await fetchAll(`/entity/demand/${demand.id}/positions?expand=assortment`)
  verifyDocPositions(demandPos, commitResolved, 'Demand')
  console.log(`  2) Demand: ${demand.name} | ${money(demand.sum)} AED | ${demandPos.length} lines`)
  console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  if (money(report.sum) !== money(demand.sum)) {
    throw new Error(`Sum mismatch: report ${money(report.sum)} vs demand ${money(demand.sum)}`)
  }
  console.log('\n  Verification OK — report and demand match (lines, qty, sum).')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
