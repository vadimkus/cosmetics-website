#!/usr/bin/env node

/**
 * Persona Marina — demand into agreement 00024 + stock note PDF.
 *
 *   00051 Hair tonic 70ml ×2 @ 145
 *   00035 Problem Control Cream 50g ×1 @ 145
 *   54457 Ultra Shield SPF50 ×1 @ 125
 *   54467 PDRN Mask Pack ×2 @ 200
 *   00144 Cushion Beige ×2 @ 150
 *   Total: 1,260 AED / 8 pcs
 *
 *   node --import dotenv/config scripts/moysklad-create-persona-marina-demand-20260904.js
 *   node --import dotenv/config scripts/moysklad-create-persona-marina-demand-20260904.js --commit
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
const AGENT_ID = 'af21a79a-63cd-11ea-0a80-02b2000e2aeb'
const CONTRACT_ID = '56ca0166-c388-11eb-0a80-093a001d1ee0'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const MARKER = `PERSONA-MARINA-TONIC-PC-SPF-PDRN-BEIGE-${uaeToday()}`
const LINES = [
  ['00051', 2, 145, 'HR³ Matrix Hair Tonic 70ml'],
  ['00035', 1, 145, 'Intensive Problem Control Cream 50g'],
  ['54457', 1, 125, 'Ultra Shield Sun Cream SPF50 50g'],
  ['54467', 2, 200, 'Skin Reboot PDRN Mask Pack'],
  ['00144', 2, 150, 'Skin Caring Blemish Balm Cushion #2 Beige'],
]
const EXPECTED_QTY = 8
const EXPECTED_SUM_MINOR = 126000

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function fetchAssortmentByCode(code) {
  const d = await api('GET', `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`)
  const row = (d.rows || []).find((r) => r.code === code && !r.archived)
  if (!row?.id) throw new Error(`Unknown code: ${code}`)
  return {
    id: row.id,
    name: row.name,
    available: Number(row.stock || 0) - Number(row.reserve || 0),
  }
}

async function ensureNoDuplicate() {
  const filter = [
    `agent=${API}/entity/counterparty/${AGENT_ID}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(MARKER))
  if (dup) throw new Error(`Duplicate demand today: ${dup.name}`)
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
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const out = path.join(ORDERS_DIR, `GENOSYS_Persona_Marina_Consignment_Stock_Note_${demandName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Persona Marina — replenishment into agr. 00024')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  if (!/marina/i.test(agent.name || '')) throw new Error(`Unexpected agent: ${agent.name}`)
  if (contract.name !== '00024') throw new Error(`Expected agreement 00024, got ${contract.name}`)
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)

  const positions = []
  let sumMinor = 0
  let qty = 0
  for (const [code, q, clinicAed, label] of LINES) {
    const item = await fetchAssortmentByCode(code)
    if (item.available < q) {
      throw new Error(`Insufficient ${code}: need ${q}, have ${item.available}`)
    }
    const priceMinor = Math.round(clinicAed * 100)
    sumMinor += priceMinor * q
    qty += q
    console.log(`    ${code} ${item.name} x${q} @ ${clinicAed} (avail ${item.available})`)
    positions.push({
      quantity: q,
      price: priceMinor,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${qty} pcs`)
  if (qty !== EXPECTED_QTY) throw new Error(`Qty ${qty} ≠ ${EXPECTED_QTY}`)
  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(sumMinor)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()
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
      'First Person Ladies Salon (Marina) / Persona Dubai Marina | Agreement 00024.',
      '00051 tonic x2 @145; 00035 PC cream 50g x1 @145; 54457 SPF50 x1 @125;',
      '54467 PDRN pack x2 @200; 00144 beige x2 @150. No SO / invoice / payment.',
    ].join('\n'),
    positions,
  })
  if (demand.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Posted sum ${money(demand.sum)} ≠ expected ${money(EXPECTED_SUM_MINOR)}`)
  }
  if (demand.customerOrder) throw new Error('Demand has customerOrder — consignment should be agreement-only')
  if (demand.invoicesOut?.length) throw new Error('Demand has invoicesOut — expected agreement-only')

  const pdfPath = await exportStockNotePdf(demand.id, demand.name)
  console.log(`\n  Demand ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
