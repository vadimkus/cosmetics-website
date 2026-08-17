#!/usr/bin/env node

/**
 * Viktoria Cosmetologist (Dubai Hills) — consignment sales report + PDF.
 * Creates Commission agreement if missing.
 *
 *   54484 CERABARRIER Biome Gel Cleanser 200ml ×1 @ 190
 *   54457 Ultra Shield SPF50 ×1 @ 125
 *   00195 Moisture Replenishing Hyaluron Serum ×1 @ 165
 *   00053 Eye Peptide Gel Patch (box) ×1 @ 190
 *   Total: 670 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-viktoria-cosmetologist-commission-sales-20260803.js
 *   node --import dotenv/config scripts/moysklad-create-viktoria-cosmetologist-commission-sales-20260803.js --commit
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

const { uaeToday, uaeMomentNow } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const AGENT_ID = 'bab8fec5-8bb5-11ef-0a80-018f0013a957' // Viktoria Cosmetologist (Dubai Hills)
const CONTRACT_STATE_DEFERRED_ID = 'b5d800c6-80df-11ea-0a80-004a001360f2'
const STATE_REPORT_NOT_PAID_ID = '3203736c-c43b-11eb-0a80-093a002b59a6'
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const MARKER = `Viktoria Cosmetologist consignment sold ${uaeToday()}`
const EXPECTED_SUM_MINOR = 67000 // 190+125+165+190

/** [code, qty, label] */
const LINES = [
  ['54484', 1, 'CERABARRIER Biome Gel Cleanser 200ml'],
  ['54457', 1, 'Ultra Shield Sun Cream SPF50/PA++++ 50g'],
  ['00195', 1, 'Moisture Replenishing Hyaluron Serum 30ml'],
  ['00053', 1, 'EyeCell Eye Peptide Gel Patch (box)'],
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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
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

function contractStateHref(stateId) {
  return {
    meta: {
      href: `${API}/entity/contract/metadata/states/${stateId}`,
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
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function findCommissionContract(agentId) {
  const filter = `agent=${API}/entity/counterparty/${agentId}`
  const rows = await fetchAll(`/entity/contract?filter=${encodeURIComponent(filter)}`)
  return rows.find((r) => r.contractType === 'Commission') || null
}

async function createCommissionContract(agent) {
  return api('POST', '/entity/contract', {
    moment: uaeMomentNow(),
    applicable: true,
    contractType: 'Commission',
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    agent: href('counterparty', agent.id),
    ownAgent: href('organization', ORG_ID),
    state: contractStateHref(CONTRACT_STATE_DEFERRED_ID),
    rate: { currency: href('currency', CURRENCY_ID) },
    description: [
      `Viktoria Cosmetologist (Dubai Hills) consignment agreement ${uaeToday()}`,
      'Commission consignment — clinic list.',
      `Phone ${agent.phone || '0502428114'}. Payment within 5 days after monthly sales report.`,
    ].join('\n'),
  })
}

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const reports = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = reports.find((r) => (r.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate report (${dup.name}, id=${dup.id})`)
}

async function exportSalesPdf(reportId, reportName) {
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const body = {
    template: {
      meta: {
        href: `${API}/entity/commissionreportin/metadata/customtemplate/${CONSIGNMENT_SALES_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/commissionreportin/${reportId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  const out = path.join(ORDERS_DIR, `GENOSYS_Viktoria_Cosmetologist_Consignment_Sales_${reportName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Viktoria Cosmetologist — consignment sales')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, stock] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    fetchStockByCode(),
  ])
  console.log(`  Customer: ${agent.name} | ${agent.phone || ''}`)

  let contract = await findCommissionContract(AGENT_ID)
  if (contract) {
    console.log(`  Agreement: ${contract.name} (existing)`)
  } else {
    console.log('  Agreement: none — will create Commission contract')
  }

  const resolved = []
  let sumMinor = 0
  for (const [code, qty, label] of LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code} (${label})`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    sumMinor += item.price * qty
    resolved.push({ ...item, qty, label })
    console.log(
      `    ${code} ${label} x${qty} @ ${money(item.price)} = ${money(item.price * qty)}`,
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED`)

  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  if (!contract) {
    contract = await createCommissionContract(agent)
    console.log(`  Created agreement: ${contract.name} (${contract.id})`)
  }

  await ensureNoDuplicate()

  const report = await api('POST', '/entity/commissionreportin', {
    moment: uaeMomentNow(),
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', contract.id),
    state: stateHref('commissionreportin', STATE_REPORT_NOT_PAID_ID),
    commissionPeriodStart: '2026-07-01 00:00:00',
    commissionPeriodEnd: '2026-07-31 23:59:59',
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    description: [
      MARKER,
      'Viktoria Cosmetologist (Dubai Hills) | Telegram list.',
      'Cerabarrier 200 ×1; Ultra Shield SPF50 ×1; Hyaluron serum ×1; Eye patch ×1.',
      'Consignment sales report only — unpaid.',
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

  if ((report.sum || 0) !== EXPECTED_SUM_MINOR) {
    throw new Error(`Report sum ${money(report.sum)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  const pdfPath = await exportSalesPdf(report.id, report.name)
  console.log(`\n  Report: ${report.name} | ${money(report.sum)} AED`)
  console.log(`  Agreement: ${contract.name}`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
