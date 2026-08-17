#!/usr/bin/env node

/**
 * Bianco Spa FZCO (Cedre / Silicon Oasis) — consignment sales return + PDF.
 *
 * From photo:
 *   00183 Problem Control Toner 500ml ×2 @ 245
 *   00025 Snow Booster Toner 1000ml ×1 @ 245
 *   00026 Biphasic Makeup Remover 200ml ×2 @ 145
 *   00050 HR³ Matrix Scalp Peeling 100ml ×1 @ 145
 *   00029 Problem Control Serum 30ml ×2 @ 165
 *   Total: 1,500.00 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-bianco-cedre-sales-return-pct-sbt-bmr-20260721.js
 *   node --import dotenv/config scripts/moysklad-create-bianco-cedre-sales-return-pct-sbt-bmr-20260721.js --commit
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
const AGENT_ID = '4c134860-9a4e-11ee-0a80-09ea0005ef84' // Bianco Spa FZCO (Cedre Center)
const CONTRACT_ID = '34d5fa5e-9ce3-11ee-0a80-10c7001247d8' // Agreement 00073
const STATE_RETURN_ID = 'f793c585-01bb-11f1-0a80-1ac1000b5df5'
const RETURN_TEMPLATE_ID = '47dc3b12-0d37-4361-98b9-804f12a10a9b' // Invoice_Return_Genosys

const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `BIANCO-CEDRE-RETURN-PCT-SBT-BMR-CSP-PCS-${uaeToday()}`

/** [code, qty, clinicAed] */
const LINES = [
  ['00183', 2, 245], // PCT 500ml
  ['00025', 1, 245], // Snow Booster 1000ml
  ['00026', 2, 145], // BMR 200ml
  ['00050', 1, 145], // Scalp Peeling 100ml
  ['00029', 2, 165], // PCS 30ml
]

const EXPECTED_SUM_MINOR = 150000

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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
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

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    stock.set(row.code, {
      id: row.meta?.href?.split('/').pop()?.split('?')[0],
      code: row.code,
      name: row.name,
    })
  }
  return stock
}

async function ensureNoDuplicate() {
  const data = await api('GET', `/entity/salesreturn?search=${encodeURIComponent(MARKER)}&limit=5`)
  if ((data.rows || []).some((r) => (r.description || '').includes(MARKER))) {
    throw new Error(`Duplicate return marker: ${MARKER}`)
  }
}

async function exportReturnPdf(returnId, returnName) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/salesreturn/metadata/customtemplate/${RETURN_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/salesreturn/${returnId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Return export ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(returnName).replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Bianco_Cedre_Return_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Bianco Cedre — return PCT/SBT/BMR/CSP/PCS')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract, stock] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
    fetchStockByCode(),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)

  const positions = []
  let sumMinor = 0
  console.log('\n  Lines:')
  for (const [code, qty, unitAed] of LINES) {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    const priceMinor = Math.round(unitAed * 100)
    const lineMinor = priceMinor * qty
    sumMinor += lineMinor
    positions.push({
      quantity: qty,
      price: priceMinor,
      assortment: href('product', item.id),
      vat: 5,
      vatEnabled: true,
    })
    console.log(`    ${code} ${item.name} x${qty} @ ${money(priceMinor)} → ${money(lineMinor)}`)
  }
  console.log(`  Total: ${money(sumMinor)} AED`)

  if (sumMinor !== EXPECTED_SUM_MINOR) {
    throw new Error(`Total mismatch: ${money(sumMinor)} vs ${money(EXPECTED_SUM_MINOR)}`)
  }

  if (COMMIT) await ensureNoDuplicate()

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/salesreturn', {
    moment: uaeMomentNow(),
    applicable: true,
    shared: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    store: href('store', STORE_ID),
    contract: href('contract', CONTRACT_ID),
    state: stateHref('salesreturn', STATE_RETURN_ID),
    description: [
      MARKER,
      'Bianco Silicon Oasis / Cedre — consignment return (photo).',
      '00183 PCT500 x2; 00025 SBT1000 x1; 00026 BMR x2; 00050 CSP x1; 00029 PCS x2.',
    ].join(' | '),
    positions,
  })

  console.log(`\n  Return: ${created.name} | ${money(created.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#salesreturn/edit?id=${created.id}`)

  const pdfPath = await exportReturnPdf(created.id, created.name)
  if (pdfPath) console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
