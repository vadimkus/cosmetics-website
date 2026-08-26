#!/usr/bin/env node

/**
 * Shakirovna Business Bay — 2 consignment demands into agreements.
 *
 *   Clinic (26) — 54475 Meso PDRN 5000 ×2 @ 150
 *   Salon / Elite (21) — 54475 Meso PDRN 5000 ×2 @ 150
 *
 *   Stock notes → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-bb-pdrn5000-demands-20260819.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-bb-pdrn5000-demands-20260819.js --commit
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

const { uaeToday, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const STATE_DEMAND_SHIPPED_ID = '50d70717-4582-11ea-0a80-05e3001273a2'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const CODE = '54475'
const QTY = 2
const CLINIC_AED = 150
const EXPECTED_EACH_MINOR = 30000

const SITES = [
  {
    key: 'clinic',
    label: 'Esthetic Clinic',
    exactName: 'SHAKIROVNA ESTHETIC CLINIC L.L.C',
    agentId: 'a187255f-a9b6-11f0-0a80-09900022125b',
    contractId: 'd08f670e-b993-11f0-0a80-19750031f04a',
    pdfTag: 'Esthetic_Clinic',
    marker: `SHAKIROVNA-BB-CLINIC-PDRN5000-X2-${uaeToday()}`,
  },
  {
    key: 'salon',
    label: 'Elite Salon',
    exactName: 'ELITE SHAKIROVNA LADIES SALON L.L.C',
    agentId: null,
    contractId: 'c24b0b09-5e34-11f0-0a80-1b1c0008232a',
    pdfTag: 'Elite_Salon',
    marker: `SHAKIROVNA-BB-SALON-PDRN5000-X2-${uaeToday()}`,
  },
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function findCounterpartyByExactName(exactName) {
  const token = exactName.split(/\s+/)[0]
  const data = await api('GET', `/entity/counterparty?limit=100&search=${encodeURIComponent(token)}`)
  const hit = (data?.rows || []).find((r) => r.name === exactName)
  if (!hit) throw new Error(`Counterparty not found: "${exactName}"`)
  return hit
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

async function ensureNoDuplicate(agentId, marker) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${uaeToday()} 00:00:00`,
    `moment<=${uaeToday()} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate demand today: ${dup.name}`)
}

async function exportStockNotePdf(demandId, demandName, pdfTag) {
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
  const out = path.join(ORDERS_DIR, `GENOSYS_Shakirovna_${pdfTag}_Consignment_Stock_Note_${demandName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function resolveSite(site) {
  const agent = site.agentId
    ? await api('GET', `/entity/counterparty/${site.agentId}`)
    : await findCounterpartyByExactName(site.exactName)
  if (agent.name !== site.exactName) throw new Error(`Unexpected agent ${agent.name}`)
  const contract = await api('GET', `/entity/contract/${site.contractId}`)
  return { agent, contract }
}

async function postDemand(site, agent, item, idx) {
  const demand = await api('POST', '/entity/demand', {
    moment: uaeMomentAddMinutes(idx * 2),
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    contract: href('contract', site.contractId),
    store: href('store', STORE_ID),
    state: stateHref('demand', STATE_DEMAND_SHIPPED_ID),
    description: [
      site.marker,
      `Shakirovna Business Bay — ${site.label}.`,
      `Replenishment: ${CODE} Meso PDRN 5000 x${QTY} @ ${CLINIC_AED}.`,
    ].join('\n'),
    positions: [
      {
        quantity: QTY,
        price: Math.round(CLINIC_AED * 100),
        assortment: href('product', item.id),
        vat: 5,
        vatEnabled: true,
      },
    ],
  })
  if (demand.sum !== EXPECTED_EACH_MINOR) {
    throw new Error(`${site.label} sum ${money(demand.sum)} ≠ ${money(EXPECTED_EACH_MINOR)}`)
  }
  if (demand.customerOrder) throw new Error(`${site.label} demand has customerOrder`)
  const pdf = await exportStockNotePdf(demand.id, demand.name, site.pdfTag)
  return { demand, pdf }
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna BB — clinic + salon Meso PDRN 5000 ×2 each')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const item = await fetchAssortmentByCode(CODE)
  const need = QTY * SITES.length
  console.log(`  ${CODE} ${item.name} avail ${item.available} (need ${need})`)
  if (item.available < need) {
    console.log(`  WARN stock: need ${need}, have ${item.available} — posting anyway`)
  }

  const results = []
  for (let i = 0; i < SITES.length; i++) {
    const site = SITES[i]
    const { agent, contract } = await resolveSite(site)
    console.log(`\n  ${site.label}: ${agent.name}`)
    console.log(`    Agreement: ${contract.name}`)
    console.log(`    ${CODE} x${QTY} @ ${CLINIC_AED} = ${money(EXPECTED_EACH_MINOR)}`)
    if (!COMMIT) {
      results.push({ site, agent, contract })
      continue
    }
    await ensureNoDuplicate(agent.id, site.marker)
    const posted = await postDemand(site, agent, item, i)
    console.log(`    Demand ${posted.demand.name} | ${money(posted.demand.sum)} AED`)
    console.log(`    ${posted.pdf}`)
    results.push({ site, ...posted })
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
