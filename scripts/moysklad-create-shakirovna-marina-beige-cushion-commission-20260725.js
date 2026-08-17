#!/usr/bin/env node

/**
 * Shakirovna Ladies Beauty Saloon (Marina) — consignment sales report only.
 *   00144 Skin Caring Blemish Balm Cushion #2 Beige ×1 @ 150 clinic
 *   No replenishment demand.
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-marina-beige-cushion-commission-20260725.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-marina-beige-cushion-commission-20260725.js --commit
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
const AGENT_ID = '93775ae5-d18d-11ea-0a80-02e00008417d'
const CONTRACT_ID = 'f5a1958d-c3ca-11eb-0a80-048e0027cbcb' // 00030
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'

const MARKER = `SHAKIROVNA-MARINA-BEIGE-CUSHION-x1-SOLD-${uaeToday()}`
const PRODUCT_CODE = '00144'
const QTY = 1
const CLINIC_AED = 150
const EXPECTED_SUM_MINOR = CLINIC_AED * QTY * 100

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

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Marina — consignment sold (beige cushion ×1)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'} | no replenishment`)

  const [agent, contract, products] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    api('GET', `/entity/product?filter=code=${PRODUCT_CODE}&limit=1`),
  ])
  const product = products.rows?.[0]
  if (!product?.id) throw new Error(`Product ${PRODUCT_CODE} not found`)

  const priceMinor = CLINIC_AED * 100
  console.log(`  Agent   : ${agent.name}`)
  console.log(`  Contract: ${contract.name}`)
  console.log(`  Line    : ${PRODUCT_CODE} ${product.name} x${QTY} @ ${CLINIC_AED} → ${money(EXPECTED_SUM_MINOR)}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()

  const moment = uaeMomentNow()
  const report = await api('POST', '/entity/commissionreportin', {
    moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
    commissionPeriodStart: moment,
    commissionPeriodEnd: moment,
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'Shakirovna Ladies Beauty Saloon | Marina Wharf | Agreement 00030.',
      'Consignment sold: Cushion #2 Beige (00144) ×1 @ 150 AED. No replenishment.',
    ].join('\n'),
    positions: [
      {
        quantity: QTY,
        price: priceMinor,
        assortment: href('product', product.id),
        vat: 5,
        vatEnabled: true,
        reward: 0,
      },
    ],
  })

  if ((report.sum || 0) !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum mismatch: ${money(report.sum)} vs ${money(EXPECTED_SUM_MINOR)}`)
  }

  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
