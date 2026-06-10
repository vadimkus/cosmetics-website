#!/usr/bin/env node

/**
 * Melanta Poly Clinic L.L.C — commission replenishment Отгрузка (Eye gel patch ×2).
 *
 * Lines: EyeCell Eye Peptide Gel Patch box (00053) × 2
 * Contract: 14
 *
 * After --commit: PDF Genosys_Consignment_Stock_Note → Desktop → lp (macOS).
 *
 *   node scripts/moysklad-create-melanta-gel-patch-shipment-print-20260511.js
 *   node scripts/moysklad-create-melanta-gel-patch-shipment-print-20260511.js --commit
 *   node scripts/moysklad-create-melanta-gel-patch-shipment-print-20260511.js --commit --no-print
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync, spawnSync } = require('child_process')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD env vars')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')
const NO_PRINT = process.argv.includes('--no-print')

const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

const COMMON = {
  date: '2026-05-11',
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: 'c3908257-ccdd-11ef-0a80-11a10053430e',
  contractId: 'ca7a8aa6-ccdd-11ef-0a80-18080052ee1c',
}

const DEMAND = {
  moment: '2026-05-11 11:30:00',
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  marker: 'Melanta gel patch replenishment shipment 2026-05-11',
}

const LINES = [['00053', 2]] // EyeCell Eye Peptide Gel Patch (box)

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1000)}`)
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

async function ensureNoDuplicate(marker) {
  const filter = [
    `agent=${API}/entity/counterparty/${COMMON.agentId}`,
    `moment>=${COMMON.date} 00:00:00`,
    `moment<=${COMMON.date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((doc) => (doc.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate protection: demand already exists today (${dup.name}, id=${dup.id})`)
}

function resolveLines(stock) {
  return LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item) throw new Error(`Product code not found in stock report: ${code}`)
    if (!item.id) throw new Error(`Product ID missing for code: ${code}`)
    if (item.available < qty) {
      throw new Error(`Insufficient stock for ${code} ${item.name}: need ${qty}, available ${item.available}`)
    }
    return { ...item, qty }
  })
}

function printLines(resolved) {
  const totalMinor = resolved.reduce((sum, line) => sum + line.qty * line.price, 0)
  console.log()
  for (const line of resolved) {
    console.log(
      `  ${line.code} | ${line.name.slice(0, 60)} | qty ${line.qty} | ${money(line.price)} unit | ${money(line.price * line.qty)} line | avail ${line.available}`
    )
  }
  console.log(`  Total incl. VAT: ${money(totalMinor)} AED`)
}

function positions(resolved) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
  }))
}

async function createDemand(resolved) {
  const payload = {
    moment: DEMAND.moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', COMMON.organizationId),
    agent: href('counterparty', COMMON.agentId),
    contract: href('contract', COMMON.contractId),
    store: href('store', COMMON.storeId),
    state: stateHref('demand', DEMAND.stateShippedId),
    description: [
      DEMAND.marker,
      'Customer: Melanta Poly Clinic L.L.C',
      'Contract: 14',
      'Replenishment only (no paired commissioner sales report).',
      'EyeCell Eye Peptide Gel Patch box 00053 × 2.',
    ].join('\n'),
    positions: positions(resolved),
  }

  const created = await api('POST', '/entity/demand', payload)
  const readbackPositions = await fetchAll(`/entity/demand/${created.id}/positions`)
  return { ...created, positionsCount: readbackPositions.length }
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
    throw new Error(`Export expected 302/303, got ${res.status}: ${t.slice(0, 500)}`)
  }

  const location = res.headers.get('location')
  if (!location) throw new Error('Export response missing Location header')

  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

function defaultPdfPath(demandName) {
  const safe = String(demandName || 'demand').replace(/[^\w.-]+/g, '_')
  const desktop = path.join(os.homedir(), 'Desktop')
  if (fs.existsSync(desktop)) {
    return path.join(desktop, `GENOSYS_Melanta_${safe}_Consignment_Stock_Note.pdf`)
  }
  return path.join(os.tmpdir(), `GENOSYS_Melanta_${safe}_Consignment_Stock_Note.pdf`)
}

function sendPdfToPrint(pdfPath) {
  if (process.platform !== 'darwin') {
    console.log(`  PDF saved (non-macOS): open manually → ${pdfPath}`)
    return
  }

  const whichLp = spawnSync('which', ['lp'], { encoding: 'utf8' })
  if (whichLp.status === 0 && whichLp.stdout.trim()) {
    try {
      execFileSync('lp', [pdfPath], { stdio: 'inherit' })
      console.log('  Sent to default printer (lp).')
      return
    } catch (e) {
      console.warn('  lp failed, opening PDF:', e.message)
    }
  }

  execFileSync('open', [pdfPath], { stdio: 'inherit' })
  console.log('  Opened PDF in default app — use File → Print if needed.')
}

async function main() {
  console.log('====================================================================')
  console.log('  Melanta — Eye gel patch shipment + Consignment Stock Note print')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (live)' : 'DRY RUN'}`)
  if (COMMIT && !NO_PRINT) console.log('  After posting: PDF → Desktop (or TMP) → lp/open (macOS)')

  const agent = await api('GET', `/entity/counterparty/${COMMON.agentId}`)
  const contract = await api('GET', `/entity/contract/${COMMON.contractId}`)
  console.log(`  Counterparty: ${agent.name}`)
  console.log(`  Contract    : ${contract.name}`)

  await ensureNoDuplicate(DEMAND.marker)

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)
  printLines(resolved)

  if (!COMMIT) {
    console.log()
    console.log('  DRY RUN complete. Re-run with --commit to post shipment, export, print.')
    return
  }

  console.log()
  console.log('  Posting shipment (demand)...')
  const demand = await createDemand(resolved)
  console.log(`    Created: ${demand.name} | ${money(demand.sum)} AED | positions=${demand.positionsCount}`)
  console.log(`    UI: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  if (NO_PRINT) {
    console.log('  Skipping PDF (--no-print).')
    return
  }

  console.log()
  console.log('  Exporting Genosys_Consignment_Stock_Note PDF...')
  const pdfBuf = await exportStockNotePdf(demand.id)
  const outPath = defaultPdfPath(demand.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`    Saved: ${outPath} (${pdfBuf.length} bytes)`)

  sendPdfToPrint(outPath)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
