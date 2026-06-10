#!/usr/bin/env node

/**
 * Melanta Poly Clinic L.L.C — пополнение по договору комиссии 14 (Отгрузка only).
 *
 * Lines:
 *   - EyeCell Eye Contour Serum 10ml (00054) × 2
 *   - Snow O₂ Cleanser 180ml (00021) × 2
 *   - Ultra Shield Sun Cream SPF50/PA++++ 50g (54457) × 2  ← «SPF 50»
 *
 * Dry-run:
 *   set -a && source .env && set +a
 *   node scripts/moysklad-create-melanta-replenishment-shipment-serum-cleanser-spf50.js
 *
 * Commit + Consignment Stock Note PDF + print (macOS):
 *   node scripts/moysklad-create-melanta-replenishment-shipment-serum-cleanser-spf50.js --commit
 *
 *   node scripts/moysklad-create-melanta-replenishment-shipment-serum-cleanser-spf50.js --commit --no-print
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

const RUN_DATE = new Date().toISOString().slice(0, 10)
const RUN_MOMENT = `${RUN_DATE} 16:30:00`

const COMMON = {
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: 'c3908257-ccdd-11ef-0a80-11a10053430e',
  contractId: 'ca7a8aa6-ccdd-11ef-0a80-18080052ee1c',
}

const DEMAND = {
  moment: RUN_MOMENT,
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
  marker: `Melanta contract14 replenishment eye serum snow cleanser spf50 ${RUN_DATE}`,
}

const LINES = [
  ['00054', 2],
  ['00021', 2],
  ['54457', 2],
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
    `moment>=${RUN_DATE} 00:00:00`,
    `moment<=${RUN_DATE} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/demand?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((doc) => (doc.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate: отгрузка уже есть (${dup.name}, id=${dup.id})`)
}

function resolveLines(stock) {
  return LINES.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item) throw new Error(`Код не найден в stock report: ${code}`)
    if (!item.id) throw new Error(`Нет product id для кода: ${code}`)
    if (item.available < qty) {
      throw new Error(`Недостаточно ${code} ${item.name}: нужно ${qty}, доступно ${item.available}`)
    }
    return { ...item, qty }
  })
}

function printLines(resolved) {
  const totalMinor = resolved.reduce((sum, line) => sum + line.qty * line.price, 0)
  console.log()
  for (const line of resolved) {
    console.log(
      `  ${line.code} | ${line.name.slice(0, 58)} | ×${line.qty} | ${money(line.price)} | line ${money(line.price * line.qty)} | avail ${line.available}`
    )
  }
  console.log(`  Итого с НДС: ${money(totalMinor)} AED`)
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
      'Contract: 14 (commission replenishment).',
      'Lines: EyeCell serum 10ml ×2, Snow O2 cleanser 180ml ×2, Ultra Shield SPF50 50g ×2.',
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
  if (!location) throw new Error('Export missing Location')

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
    console.log(`  PDF: ${pdfPath}`)
    return
  }
  const whichLp = spawnSync('which', ['lp'], { encoding: 'utf8' })
  if (whichLp.status === 0 && whichLp.stdout.trim()) {
    try {
      execFileSync('lp', [pdfPath], { stdio: 'inherit' })
      console.log('  Отправлено на принтер (lp).')
      return
    } catch (e) {
      console.warn('  lp не удалось, открываю PDF:', e.message)
    }
  }
  execFileSync('open', [pdfPath], { stdio: 'inherit' })
}

async function main() {
  console.log('====================================================================')
  console.log('  Melanta — отгрузка: серум + Snow O2 + SPF50 (договор 14)')
  console.log('====================================================================')
  console.log(`  Дата документа: ${RUN_DATE}`)
  console.log(`  Режим: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${COMMON.agentId}`)
  const contract = await api('GET', `/entity/contract/${COMMON.contractId}`)
  console.log(`  Контрагент: ${agent.name}`)
  console.log(`  Договор   : ${contract.name}`)

  await ensureNoDuplicate(DEMAND.marker)

  const stock = await fetchStockByCode()
  const resolved = resolveLines(stock)
  printLines(resolved)

  if (!COMMIT) {
    console.log('\n  DRY RUN. Повторите с --commit.')
    return
  }

  console.log('\n  Создание отгрузки...')
  const demand = await createDemand(resolved)
  console.log(`  Создано: ${demand.name} | ${money(demand.sum)} AED | позиций ${demand.positionsCount}`)
  console.log(`  UI: https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  if (NO_PRINT) {
    console.log('  PDF пропущен (--no-print).')
    return
  }

  console.log('\n  Экспорт Consignment Stock Note...')
  const pdfBuf = await exportStockNotePdf(demand.id)
  const outPath = defaultPdfPath(demand.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`  Файл: ${outPath}`)
  sendPdfToPrint(outPath)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
