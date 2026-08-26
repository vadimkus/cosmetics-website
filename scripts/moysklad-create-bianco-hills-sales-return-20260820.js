#!/usr/bin/env node

/**
 * Bianco Beauty Salon SPA (Dubai Hills) — consignment sales return + PDF.
 * Agreement 00079. Removes pictured stock from consignment remainder.
 *
 *   00059 EyeCell Eye Zone Care Kit ×1 @ 490
 *   00052 HR³ Scalp & Hair Shampoo 300ml ×1 @ 170
 *   00051 HR³ Hair Tonic 70ml ×1 @ 145
 *   00055 EyeCell Eye Contour Cream 20ml ×1 @ 185
 *   00035 Problem Control Cream 50g ×1 @ 145
 *   00031 Hydro Soothing Cream 50g ×1 @ 145
 *   00143 Cushion Ivory ×2 @ 150
 *   00144 Cushion Beige ×1 @ 150
 *   Total: 1,730.00 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-bianco-hills-sales-return-20260820.js
 *   node --import dotenv/config scripts/moysklad-create-bianco-hills-sales-return-20260820.js --commit
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
const AGENT_ID = 'aac56118-2945-11ef-0a80-07b40031e6d1'
const CONTRACT_ID = '83eaec1b-2946-11ef-0a80-08f00030f7f3'
const STATE_RETURN_ID = 'f793c585-01bb-11f1-0a80-1ac1000b5df5'
const RETURN_TEMPLATE_ID = '47dc3b12-0d37-4361-98b9-804f12a10a9b'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `BIANCO-HILLS-RETURN-PHOTO-${uaeToday()}`

/** [code, qty, clinicAed] */
const LINES = [
  ['00059', 1, 490],
  ['00052', 1, 170],
  ['00051', 1, 145],
  ['00055', 1, 185],
  ['00035', 1, 145],
  ['00031', 1, 145],
  ['00143', 2, 150],
  ['00144', 1, 150],
]

const EXPECTED_SUM_MINOR = 173000

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

async function fetchAssortmentByCode(code) {
  const d = await api('GET', `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5`)
  const row = (d.rows || []).find((r) => r.code === code && !r.archived)
  if (!row?.id) throw new Error(`Unknown code: ${code}`)
  return { id: row.id, name: row.name }
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
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Return export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(returnName).replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Bianco_Dubai_Hills_Return_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Bianco Dubai Hills — consignment return (photo)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [agent, contract] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/contract/${CONTRACT_ID}`),
  ])
  console.log(`  Customer: ${agent.name}`)
  console.log(`  Agreement: ${contract.name}`)

  const positions = []
  let sumMinor = 0
  for (const [code, qty, unitAed] of LINES) {
    const item = await fetchAssortmentByCode(code)
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

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await ensureNoDuplicate()
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
      'Bianco Dubai Hills consignment return from photo.',
      '00059 kit x1; 00052 shampoo x1; 00051 tonic x1; 00055 eye cream x1;',
      '00035 PC cream 50g x1; 00031 hydro 50g x1; 00143 ivory x2; 00144 beige x1.',
      'Eye kit carton marked expired 2024-06-06 — returned off consignment.',
    ].join(' | '),
    positions,
  })

  console.log(`\n  Return: ${created.name} | ${money(created.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#salesreturn/edit?id=${created.id}`)

  const pdfPath = await exportReturnPdf(created.id, created.name)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
