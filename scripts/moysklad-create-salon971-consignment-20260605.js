#!/usr/bin/env node

/**
 * Salon 971 — create counterparty (if missing), commission agreement, opening demand.
 *
 *   node --import dotenv/config scripts/moysklad-create-salon971-consignment-20260605.js
 *   node --import dotenv/config scripts/moysklad-create-salon971-consignment-20260605.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentNow } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const CONTRACT_STATE_DEFERRED_ID = 'b5d800c6-80df-11ea-0a80-004a001360f2'
const DEMAND_STATE_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'

const CUSTOMER = {
  name: 'Salon 971',
  phone: '+97145796222',
  phoneDisplay: '04 579 6222',
  city: 'Dubai',
  street: 'Platinum One, Al Barsha South Third, Al Barsha South',
}

const MARKER = `Salon 971 consignment agreement opening demand ${uaeToday()}`

const LINES = [
  ['00144', 3], // Cushion #2 Beige
  ['54464', 3], // Cushion #3 Camel
  ['00053', 3], // Eye Peptide Gel Patch (box)
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1600)}`)
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

function countryHref() {
  return {
    meta: {
      href: `${API}/entity/country/${COUNTRY_UAE_ID}`,
      type: 'country',
      mediaType: 'application/json',
    },
  }
}

function contractStateHref(stateId) {
  return {
    meta: {
      href: `${API}/entity/contract/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function demandStateHref(stateId) {
  return {
    meta: {
      href: `${API}/entity/demand/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return (minor / 100).toFixed(2)
}

async function findCounterparty() {
  const byName = await api(
    'GET',
    `/entity/counterparty?filter=name=${encodeURIComponent(CUSTOMER.name)}&limit=5`
  )
  if (byName?.rows?.length) return byName.rows[0]

  const search = await api('GET', `/entity/counterparty?search=${encodeURIComponent('Salon 971')}&limit=10`)
  const exact = (search?.rows || []).find((r) => r.name === CUSTOMER.name)
  return exact || null
}

async function createCounterparty() {
  const addr = {
    country: countryHref(),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
  }
  return api('POST', '/entity/counterparty', {
    name: CUSTOMER.name,
    phone: CUSTOMER.phone,
    companyType: 'legal',
    description: [
      `Salon 971 — consignment customer (${uaeToday()}).`,
      `Tel: ${CUSTOMER.phoneDisplay}`,
      CUSTOMER.street,
    ].join(' '),
    actualAddressFull: addr,
    legalAddressFull: addr,
  })
}

async function findCommissionContract(agentId) {
  const filter = `agent=${API}/entity/counterparty/${agentId}`
  const rows = await fetchAll(`/entity/contract?filter=${encodeURIComponent(filter)}`)
  return (
    rows.find((r) => r.contractType === 'Commission') ||
    rows.find((r) => !r.contractType) ||
    null
  )
}

async function createCommissionContract(agentId) {
  return api('POST', '/entity/contract', {
    moment: uaeMomentNow(),
    applicable: true,
    contractType: 'Commission',
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    agent: href('counterparty', agentId),
    ownAgent: href('organization', ORG_ID),
    state: contractStateHref(CONTRACT_STATE_DEFERRED_ID),
    rate: { currency: href('currency', CURRENCY_ID) },
    description: [
      MARKER,
      `Commission consignment — ${CUSTOMER.name}.`,
      `Address: ${CUSTOMER.street}, ${CUSTOMER.city}.`,
      `Phone: ${CUSTOMER.phoneDisplay}`,
    ].join('\n'),
  })
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

function resolveLines(stock) {
  return LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient ${code}: need ${qty}, have ${item.available}`)
    }
    return { ...item, qty }
  })
}

async function ensureNoDuplicateDemand(agentId) {
  const date = uaeToday()
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${date} 00:00:00`,
    `moment<=${date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate demand today: ${dup.name} (${dup.id})`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Salon 971 — customer + commission agreement + demand')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  let agent = await findCounterparty()
  if (agent) {
    console.log(`  Customer exists: ${agent.name} (${agent.id})`)
  } else if (!COMMIT) {
    console.log(`  Would create customer: ${CUSTOMER.name}`)
    agent = { id: 'DRY-RUN' }
  } else {
    agent = await createCounterparty()
    console.log(`  Created customer: ${agent.name} (${agent.id})`)
  }

  let contract = agent.id !== 'DRY-RUN' ? await findCommissionContract(agent.id) : null
  if (contract) {
    console.log(`  Agreement exists: ${contract.name} (${contract.id})`)
  } else if (!COMMIT) {
    console.log('  Would create Commission agreement')
    contract = { id: 'DRY-RUN', name: '(new)' }
  } else {
    contract = await createCommissionContract(agent.id)
    console.log(`  Created agreement: ${contract.name} (${contract.id})`)
  }

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)
  let sumMinor = 0
  console.log('\n  Demand lines (list):')
  for (const line of resolved) {
    sumMinor += line.price * line.qty
    console.log(
      `    ${line.code} ${line.name.slice(0, 48)} x${line.qty} @ ${money(line.price)} → ${money(line.price * line.qty)}`
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  if (agent.id === 'DRY-RUN') throw new Error('Internal: agent not created')

  if (!contract?.id || contract.id === 'DRY-RUN') {
    contract = await findCommissionContract(agent.id)
    if (!contract) contract = await createCommissionContract(agent.id)
  }

  await ensureNoDuplicateDemand(agent.id)

  const demand = await api('POST', '/entity/demand', {
    moment: uaeMomentNow(),
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    contract: href('contract', contract.id),
    store: href('store', STORE_ID),
    state: demandStateHref(DEMAND_STATE_SHIPPED_ID),
    description: [
      MARKER,
      `Opening stock: Cushion Beige 00144 x3, Cushion Camel 54464 x3, Eye peptide patch 00053 x3.`,
      `Agreement ${contract.name}.`,
    ].join('\n'),
    positions: resolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })),
  })

  console.log(`\n  Demand: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
  console.log(`  Contract: https://online.moysklad.ru/app/#contract/edit?id=${contract.id}`)
  console.log(`  Customer: https://online.moysklad.ru/app/#company/edit?id=${agent.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
