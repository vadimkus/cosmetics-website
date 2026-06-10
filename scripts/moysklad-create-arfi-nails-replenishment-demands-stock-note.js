#!/usr/bin/env node

/**
 * ARFI Nails — two Отгрузка under commission contract (same SKU/qty as commissioner reports 01355 / 01356),
 * then Genosys Consignment Stock Note PDF → Desktop → lp (macOS).
 *
 *   node --import dotenv/config scripts/moysklad-create-arfi-nails-replenishment-demands-stock-note.js
 *   node --import dotenv/config scripts/moysklad-create-arfi-nails-replenishment-demands-stock-note.js --commit
 *   node --import dotenv/config scripts/moysklad-create-arfi-nails-replenishment-demands-stock-note.js --commit --no-print
 *   node --import dotenv/config scripts/moysklad-create-arfi-nails-replenishment-demands-stock-note.js --commit --date=2026-05-14
 *   node --import dotenv/config scripts/moysklad-create-arfi-nails-replenishment-demands-stock-note.js --only=jumeirah --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync, spawnSync } = require('child_process')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')
const NO_PRINT = process.argv.includes('--no-print')

const ARG_DATE = (() => {
  const a = process.argv.find((x) => x.startsWith('--date='))
  return a ? a.split('=')[1] : new Date().toISOString().slice(0, 10)
})()

/** Genosys_Consignment_Stock_Note (GET …/entity/demand/metadata/customtemplate) */
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const COMMON = {
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
}

const ONLY = (() => {
  const a = process.argv.find((x) => x.startsWith('--only='))
  return a ? a.split('=')[1].toLowerCase() : null
})()

const SHIPMENTS_ALL = [
  {
    label: 'Barsha',
    exactAgentName: 'ARFI NAILS BEAUTY SALON',
    commissionReportRef: '01355',
    moment: `${ARG_DATE} 16:10:00`,
    marker: `ARFI Barsha replenishment Отгрузка commission contract same lines as commissioner report 01355 ${ARG_DATE}`,
    lines: [
      ['00194', 1],
      ['54464', 1],
      ['00140', 4],
      ['00144', 3],
      ['00190', 2],
    ],
  },
  {
    label: 'Jumeirah',
    exactAgentName: 'ARFI NAILS BEAUTY SALON 2',
    commissionReportRef: '01356',
    moment: `${ARG_DATE} 16:15:00`,
    marker: `ARFI Jumeirah replenishment Отгрузка commission contract same lines as commissioner report 01356 ${ARG_DATE}`,
    lines: [
      ['00041', 1],
      ['00191', 1],
      ['54464', 1],
      ['00190', 1],
    ],
  },
]

const SHIPMENTS =
  ONLY === 'barsha'
    ? SHIPMENTS_ALL.filter((s) => s.label.toLowerCase() === 'barsha')
    : ONLY === 'jumeirah'
      ? SHIPMENTS_ALL.filter((s) => s.label.toLowerCase() === 'jumeirah')
      : ONLY
        ? (() => {
            throw new Error(`Unknown --only=${ONLY} (barsha|jumeirah)`)
          })()
        : SHIPMENTS_ALL

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
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
    throw new Error(
      `Counterparty "${exactName}" not found. Samples: ${rows
        .slice(0, 12)
        .map((r) => r.name)
        .join(' | ')}`
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
  const data = await api('GET', `/entity/contract?filter=${encodeURIComponent(`agent=${agentHref}`)}&limit=100`)
  const rows = data?.rows || []
  const comm = rows.filter(isCommissionContract)
  const pick = (list) => {
    if (!list.length) return null
    if (list.length === 1) return list[0].id
    list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ru'))
    return list[0].id
  }
  if (comm.length) return pick(comm)
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
  if (dup) throw new Error(`Duplicate Отгрузка (${dup.name}, id=${dup.id})`)
}

function resolveLines(stock, lineTuples) {
  return lineTuples.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown product code in stock report: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock ${code} ${item.name}: need ${qty}, have ${item.available}`)
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

async function exportStockNotePdf(demandId) {
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
    headers: {
      Authorization: AUTH,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Stock note export ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

function desktopStockNotePath(label, demandName) {
  const safe = String(demandName || 'demand').replace(/[^\w.-]+/g, '_')
  const desktop = path.join(os.homedir(), 'Desktop')
  const dir = fs.existsSync(desktop) ? desktop : os.tmpdir()
  return path.join(dir, `GENOSYS_ARFI_Nails_${label}_${safe}_Consignment_Stock_Note.pdf`)
}

function sendPdfToPrint(pdfPath) {
  if (process.platform !== 'darwin') {
    console.log(`  PDF: ${pdfPath}`)
    return
  }
  const whichLp = spawnSync('which', ['lp'], { encoding: 'utf8' })
  if (whichLp.status === 0 && whichLp.stdout.trim()) {
    try {
      execFileSync('lp', [pdfPath], { stdio: 'inherit' })
      console.log('    Sent to default printer (lp).')
      return
    } catch (e) {
      console.warn('    lp failed:', e.message)
    }
  }
  execFileSync('open', [pdfPath], { stdio: 'inherit' })
}

async function main() {
  console.log('====================================================================')
  console.log('  ARFI — Отгрузка (commission) + Consignment Stock Note PDF')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Shipment date: ${ARG_DATE}`)
  if (ONLY) console.log(`  Filter: --only=${ONLY}`)

  const stock = await fetchStockByCode()

  for (const cfg of SHIPMENTS) {
    console.log('\n────────────────────────────────────────────────────────────────────')
    console.log(`  ${cfg.label} — ${cfg.exactAgentName}`)
    console.log(`  Paired commissioner report: ${cfg.commissionReportRef}`)

    const agent = await findCounterpartyByExactName(cfg.exactAgentName)
    const contractId = await findCommissionContractId(agent.id)
    const contract = await api('GET', `/entity/contract/${contractId}`)
    console.log(`  Contract: ${contract.name} (${contractId})`)

    const resolved = resolveLines(stock, cfg.lines)
    let sumMinor = 0
    for (const line of resolved) {
      sumMinor += line.price * line.qty
      console.log(
        `    ${line.code} ×${line.qty}  ${line.name.slice(0, 50)}  @ ${money(line.price)} → ${money(line.price * line.qty)}`
      )
    }
    console.log(`  Total (list VAT incl.): ${money(sumMinor)} AED`)

    if (COMMIT) await ensureNoDuplicateShipment(agent.id, cfg.marker, ARG_DATE)

    const payload = {
      moment: cfg.moment,
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
        `Replenishment shipment: same SKU/qty as commissioner report ${cfg.commissionReportRef} (consignment sold).`,
      ].join('\n'),
      positions: positionsFromResolved(resolved),
    }

    if (!COMMIT) {
      console.log('  DRY RUN — add --commit')
      continue
    }

    const demand = await api('POST', '/entity/demand', payload)
    console.log(`  Created Отгрузка: ${demand.name} | ${money(demand.sum)} AED`)
    console.log(`    UI: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

    if (NO_PRINT) continue

    console.log('  Exporting Consignment Stock Note...')
    const pdfBuf = await exportStockNotePdf(demand.id)
    const outPath = desktopStockNotePath(cfg.label, demand.name)
    fs.writeFileSync(outPath, pdfBuf)
    console.log(`    Saved: ${outPath} (${pdfBuf.length} bytes)`)
    sendPdfToPrint(outPath)
  }

  if (!COMMIT) console.log('\nDRY RUN done. Use --commit to post demands + PDF + print.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
