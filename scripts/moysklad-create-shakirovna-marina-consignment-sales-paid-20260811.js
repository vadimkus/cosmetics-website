#!/usr/bin/env node

/**
 * Shakirovna Ladies Beauty Saloon (Marina) — consignment sales + paymentin + Paid.
 *   00021 Snow O₂ Cleanser 180ml ×1
 *   00144 Skin Caring Blemish Balm Cushion #2 Beige ×1
 *   Clinic salePrice from stock. No replenishment.
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-marina-consignment-sales-paid-20260811.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-marina-consignment-sales-paid-20260811.js --commit
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
const AGENT_ID = '93775ae5-d18d-11ea-0a80-02e00008417d' // Shakirovna Ladies Beauty Saloon (Marina)
const CONTRACT_ID = 'f5a1958d-c3ca-11eb-0a80-048e0027cbcb' // 00030
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const STATE_REPORT_PAID_ID = 'fd15289c-c3c4-11eb-0a80-065200268290'

const MARKER = `SHAKIROVNA-MARINA-CLEANSER180-BEIGE-PAID-${uaeToday()}`

/** [code, qty] */
const LINES = [
  ['00021', 1], // Snow O₂ Cleanser 180ml
  ['00144', 1], // Cushion #2 Beige
]

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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
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

function orgAccountHref(id) {
  return {
    meta: {
      href: `${API}/entity/organization/${ORG_ID}/accounts/${id}`,
      type: 'account',
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
  return ((minor || 0) / 100).toFixed(2)
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
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const reports = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = reports.find((r) => (r.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate report marker (${dup.name}, id=${dup.id})`)
}

function resolveLines(stock) {
  const resolved = []
  let totalMinor = 0
  for (const [code, qty] of LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Product code ${code} not found in stock report`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    const lineMinor = item.price * qty
    totalMinor += lineMinor
    resolved.push({ ...item, qty })
    console.log(`    ${code} ${item.name.slice(0, 55)} x${qty} @ ${money(item.price)} → ${money(lineMinor)}`)
  }
  console.log(`  Total: ${money(totalMinor)} AED`)
  return { resolved, totalMinor }
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Marina — consignment sales + paymentin (Paid)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'} | cleanser 180 ×1 + beige ×1`)

  const [agent, contract, stock] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    fetchStockByCode(),
  ])
  console.log(`  Agent   : ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)
  console.log('\n  Report lines (clinic salePrice, VAT incl.):')
  const { resolved, totalMinor } = resolveLines(stock)

  // Sanity: cleanser ~165, beige ~150 → ~315
  if (totalMinor < 20000 || totalMinor > 40000) {
    throw new Error(`Unexpected total ${money(totalMinor)} — check clinic prices`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()

  const t0 = uaeMomentNow()
  const t1 = uaeMomentAddMinutes(2)

  const report = await api('POST', '/entity/commissionreportin', {
    moment: t0,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
    commissionPeriodStart: t0,
    commissionPeriodEnd: t0,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'Shakirovna Ladies Beauty Saloon | Marina Wharf | Agreement 00030.',
      'Consignment sold: Snow O₂ Cleanser 180ml (00021) ×1 + Cushion #2 Beige (00144) ×1. Paid in full. No replenishment.',
    ].join('\n'),
    positions: resolved.map((line) => ({
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
      reward: 0,
    })),
  })

  if ((report.sum || 0) !== totalMinor) {
    throw new Error(`Report sum mismatch: ${money(report.sum)} vs ${money(totalMinor)}`)
  }

  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)

  const paymentIn = await api('POST', '/entity/paymentin', {
    moment: t1,
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
    description: `Incoming payment for commissioner report ${report.name} | ${MARKER}`,
    sum: totalMinor,
    operations: [
      {
        meta: {
          href: `${API}/entity/commissionreportin/${report.id}`,
          type: 'commissionreportin',
          mediaType: 'application/json',
        },
        linkedSum: totalMinor,
      },
    ],
  })

  console.log(`  Payment: ${paymentIn.name} | ${money(paymentIn.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)

  await api('PUT', `/entity/commissionreportin/${report.id}`, {
    state: stateHref('commissionreportin', STATE_REPORT_PAID_ID),
  })

  const final = await api('GET', `/entity/commissionreportin/${report.id}?expand=state`)
  console.log('\n  Verification:')
  console.log(`    payedSum: ${money(final.payedSum)} / ${money(final.sum)}`)
  console.log(`    state   : ${final.state?.name || '?'}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
