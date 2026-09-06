#!/usr/bin/env node

/**
 * Shakirovna Marina — matching consignment demand for report 01440.
 * Same 6 lines / 20 pcs / 2,144 AED into agreement 00030.
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-marina-01440-matching-demand-20260902.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-marina-01440-matching-demand-20260902.js --commit
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
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const AGENT_ID = '93775ae5-d18d-11ea-0a80-02e00008417d'
const CONTRACT_ID = 'f5a1958d-c3ca-11eb-0a80-048e0027cbcb'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const REPORT_ID = '8c0a3995-a1e8-11f1-0a80-087b005afcb7'
const REPORT_NAME = '01440'
const MARKER = `SHAKIROVNA-MARINA-01440-MATCHING-DEMAND-${uaeToday()}`
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const EXPECTED_SUM_MINOR = 214400
const EXPECTED_QTY = 20

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
        'Accept-Encoding': 'gzip',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
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
    const data = await api('GET', `${pathStr}${sep}limit=100&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 100) break
    offset += 100
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

async function exportStockNote(demandId, demandName) {
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
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Stock note export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location, { headers: { Authorization: AUTH } })
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const out = path.join(ORDERS_DIR, `GENOSYS_Shakirovna_Marina_Consignment_Stock_Note_${demandName}.pdf`)
  fs.writeFileSync(out, Buffer.from(await pdfRes.arrayBuffer()))
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Marina — matching demand for 01440')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const report = await api(
    'GET',
    `/entity/commissionreportin/${REPORT_ID}?expand=agent,contract,state`,
  )
  if (report.name !== REPORT_NAME) throw new Error(`Expected ${REPORT_NAME}, got ${report.name}`)
  if (report.agent?.id !== AGENT_ID) throw new Error(`Unexpected agent: ${report.agent?.name}`)
  if (report.contract?.id !== CONTRACT_ID) throw new Error('Report not on agreement 00030')
  if (report.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Report sum ${money(report.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }

  const reportPos = await fetchAll(
    `/entity/commissionreportin/${REPORT_ID}/positions?expand=assortment`,
  )
  const lines = []
  let totalQty = 0
  for (const p of reportPos) {
    const code = p.assortment?.code
    const id = p.assortment?.id || p.assortment?.meta?.href?.split('/').pop()?.split('?')[0]
    const qty = Number(p.quantity)
    if (!code || !id) throw new Error('Position missing assortment')
    totalQty += qty
    lines.push({
      code,
      id,
      name: p.assortment?.name || code,
      qty,
      price: Number(p.price),
    })
  }
  if (totalQty !== EXPECTED_QTY) throw new Error(`Report qty ${totalQty} ≠ ${EXPECTED_QTY}`)

  console.log(`  Report: ${report.name} | ${money(report.sum)} AED | ${report.state?.name}`)
  console.log(`  Agreement: ${report.contract?.name}`)
  for (const l of lines) {
    console.log(`    ${l.code} ${l.name} x${l.qty} @ ${money(l.price)}`)
  }

  const existing = await fetchAll(
    `/entity/demand?filter=agent=${encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)};contract=${encodeURIComponent(`${API}/entity/contract/${CONTRACT_ID}`)}`,
  )
  const dup = existing.find(
    (d) =>
      (d.description || '').includes(MARKER) ||
      (d.description || '').includes('paired with report 01440') ||
      (d.description || '').includes('01440-MATCHING'),
  )
  if (dup) throw new Error(`Matching demand already exists: ${dup.name} (${dup.id})`)

  for (const l of lines) {
    const d = await api(
      'GET',
      `/entity/assortment?filter=code=${encodeURIComponent(l.code)}&limit=5&stockMode=all`,
    )
    const row = (d.rows || []).find((r) => r.code === l.code)
    const avail = Number(row?.stock || 0) - Number(row?.reserve || 0)
    if (avail < l.qty) {
      console.log(`  WARN stock ${l.code}: need ${l.qty}, have ${avail}`)
    } else {
      console.log(`    stock ${l.code}: ${avail}`)
    }
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const demand = await api('POST', '/entity/demand', {
    moment: uaeMomentNow(),
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    contract: href('contract', CONTRACT_ID),
    store: href('store', STORE_ID),
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    description: [
      MARKER,
      `Replenishment paired with report ${REPORT_NAME} — same ${lines.length} SKU / ${totalQty} pcs / ${money(EXPECTED_SUM_MINOR)} AED.`,
      'Agreement 00030. No SO / invoice / payment.',
    ].join('\n'),
    positions: lines.map((l) => ({
      quantity: l.qty,
      price: l.price,
      assortment: href('product', l.id),
      vat: 5,
      vatEnabled: true,
    })),
  })

  if (demand.customerOrder) throw new Error('Demand has customerOrder — expected agreement-only')
  if (demand.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Demand sum ${money(demand.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }
  const contractId = demand.contract?.meta?.href?.split('/').pop()?.split('?')[0]
  if (contractId && contractId !== CONTRACT_ID) {
    throw new Error(`Demand contract ${contractId} ≠ 00030`)
  }

  const pdfPath = await exportStockNote(demand.id, demand.name)
  console.log(`\n  Demand: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
