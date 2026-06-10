#!/usr/bin/env node

/**
 * Shakirovna — two Отгрузка (demand) в договор комиссии с теми же строками, что на счетах
 * consignment sales Invoice_Consignment_Sales_ELITE.pdf / _Clinic.pdf (отчёты 01351 / 01352).
 *
 * ELITE SHAKIROVNA LADIES SALON L.L.C — 54458×1, 00041×2, 00063×2, 00144×2, 00140×5
 * SHAKIROVNA ESTHETIC CLINIC L.L.C — 00035×1
 *
 * Цены — продажные из отчёта stock/all (как в других replenishment-скриптах).
 * Состояние: отгружен (как Melanta).
 *
 *   node scripts/moysklad-create-shakirovna-elite-clinic-shipments-invoice-lines-20260512.js
 *   node scripts/moysklad-create-shakirovna-elite-clinic-shipments-invoice-lines-20260512.js --commit
 *   node scripts/moysklad-create-shakirovna-elite-clinic-shipments-invoice-lines-20260512.js --commit --report=elite
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

const ARG_REPORT = (() => {
  const a = process.argv.find((x) => x.startsWith('--report='))
  return a ? a.split('=')[1] : 'all'
})()

const COMMON = {
  date: '2026-05-12',
  moment: '2026-05-12 16:00:00',
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  /** demand state = отгружен (same UUID as Melanta scripts) */
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
}

const SHIPMENTS = [
  {
    key: 'elite',
    title: 'ELITE SHAKIROVNA LADIES SALON L.L.C',
    exactName: 'ELITE SHAKIROVNA LADIES SALON L.L.C',
    commissionReportName: '01351',
    marker: 'Shakirovna ELITE replenishment shipment same lines as consignment invoice 01351 / PDF ELITE 2026-05-12',
    lines: [
      ['54458', 1],
      ['00041', 2],
      ['00063', 2],
      ['00144', 2],
      ['00140', 5],
    ],
  },
  {
    key: 'clinic',
    title: 'SHAKIROVNA ESTHETIC CLINIC L.L.C',
    exactName: 'SHAKIROVNA ESTHETIC CLINIC L.L.C',
    commissionReportName: '01352',
    marker: 'Shakirovna CLINIC replenishment shipment same lines as consignment invoice 01352 / PDF Clinic 2026-05-12',
    lines: [['00035', 1]],
  },
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  const limit = 1000
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=${limit}&offset=${offset}`)
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
  return (minor / 100).toFixed(2)
}

async function findCounterpartyByExactName(exactName) {
  const token = exactName.split(/\s+/)[0]
  const data = await api('GET', `/entity/counterparty?limit=100&search=${encodeURIComponent(token)}`)
  const rows = data?.rows || []
  const hit = rows.find((r) => r.name === exactName)
  if (!hit) {
    const names = rows.slice(0, 15).map((r) => r.name)
    throw new Error(
      `Counterparty not found exact "${exactName}". search="${token}" samples: ${names.join(' | ') || '(none)'}`
    )
  }
  return hit
}

function isCommissionContract(c) {
  const t = c.contractType || c.type
  return t === 'Commission' || String(t).toLowerCase() === 'commission'
}

async function findCommissionContractId(agentId) {
  const agentHref = `${API}/entity/counterparty/${agentId}`
  const filter = `agent=${agentHref}`
  const data = await api('GET', `/entity/contract?filter=${encodeURIComponent(filter)}&limit=100`)
  const rows = data?.rows || []
  const comm = rows.filter(isCommissionContract)
  const pick = (list) => {
    if (!list.length) return null
    if (list.length === 1) return list[0].id
    list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ru'))
    return list[0].id
  }
  if (comm.length) return pick(comm)
  if (rows.length > 1) {
    throw new Error(
      `Agent has several contracts but none marked Commission in API. Names: ${rows.map((r) => r.name).join('; ')}`
    )
  }
  const id = pick(rows)
  if (!id) throw new Error(`No contracts for agent ${agentId}`)
  return id
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
      stock: Number(row.stock || 0),
      reserve: Number(row.reserve || 0),
      available: Number(row.stock || 0) - Number(row.reserve || 0),
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function ensureNoDuplicateShipment(agentId, marker, date) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(marker))
  if (dup) {
    throw new Error(`Duplicate Отгрузка with this marker (${dup.name}, id=${dup.id})`)
  }
}

function resolveLines(stock, lineTuples) {
  return lineTuples.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item) throw new Error(`Unknown product code in stock report: ${code}`)
    if (!item.id) throw new Error(`Missing product id for code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty }
  })
}

function positionsFromResolved(resolved) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
  }))
}

const filtered =
  ARG_REPORT === 'all' ? SHIPMENTS : SHIPMENTS.filter((s) => s.key === ARG_REPORT)

if (!filtered.length) {
  console.error('Unknown --report= (elite|clinic|all)')
  process.exit(1)
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Elite + Clinic — Отгрузка в договор (строки как 01351/01352)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Shipments: ${filtered.map((f) => f.key).join(', ')}`)
  console.log(`  Shipment date: ${COMMON.date}`)

  const stock = await fetchStockByCode()

  for (const cfg of filtered) {
    console.log('\n--------------------------------------------------------------------')
    console.log(`  ${cfg.title}`)
    console.log('--------------------------------------------------------------------')

    const agent = await findCounterpartyByExactName(cfg.exactName)
    const contractId = await findCommissionContractId(agent.id)
    const contract = await api('GET', `/entity/contract/${contractId}`)
    console.log(`  Agent   : ${agent.name} (${agent.id})`)
    console.log(`  Contract: ${contract.name} (${contractId})`)

    const resolved = resolveLines(stock, cfg.lines)
    let sumMinor = 0
    for (const line of resolved) {
      sumMinor += line.price * line.qty
      console.log(
        `    ${line.code} ${line.name.slice(0, 55)}… x${line.qty} @ ${money(line.price)} → ${money(line.price * line.qty)} AED`
      )
    }
    console.log(`  List sum (VAT-incl.): ${money(sumMinor)} AED`)

    if (COMMIT) await ensureNoDuplicateShipment(agent.id, cfg.marker, COMMON.date)

    const payload = {
      moment: COMMON.moment,
      applicable: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', COMMON.organizationId),
      agent: href('counterparty', agent.id),
      contract: href('contract', contractId),
      store: href('store', COMMON.storeId),
      state: stateHref('demand', COMMON.stateShippedId),
      description: [
        cfg.marker,
        `Matches consignment sales invoice / commissioner report ${cfg.commissionReportName} lines (PDF).`,
      ].join('\n'),
      positions: positionsFromResolved(resolved),
    }

    if (!COMMIT) {
      console.log('  DRY RUN — add --commit to create')
      continue
    }

    const created = await api('POST', '/entity/demand', payload)
    const readback = await fetchAll(`/entity/demand/${created.id}/positions`)
    console.log(`  Created Отгрузка: ${created.name} | ${money(created.sum)} AED | positions=${readback.length}`)
    console.log(`  UI: https://online.moysklad.ru/app/#demand/edit?id=${created.id}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
