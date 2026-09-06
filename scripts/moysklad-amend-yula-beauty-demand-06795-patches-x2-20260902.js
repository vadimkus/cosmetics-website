#!/usr/bin/env node

/**
 * Yula Beauty demand 06795 — patches 00053: 1 → 2. Report 01456 stays 1+1.
 *
 *   node --import dotenv/config scripts/moysklad-amend-yula-beauty-demand-06795-patches-x2-20260902.js
 *   node --import dotenv/config scripts/moysklad-amend-yula-beauty-demand-06795-patches-x2-20260902.js --commit
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

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const DEMAND_ID = 'bef36b9d-a6fd-11f1-0a80-18280000e80e'
const REPORT_ID = 'be94ba2a-a6fd-11f1-0a80-06d70000d78b'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = 'YULA-06795-PATCHES-1-TO-2-2026-09-02'
const EXPECTED_DEMAND_SUM_MINOR = 52500

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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function exportPdf(entityId, outPath) {
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
  const res = await fetch(`${API}/entity/demand/${entityId}/export`, {
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
  const pdfRes = await fetch(location, { headers: { Authorization: AUTH } })
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, Buffer.from(await pdfRes.arrayBuffer()))
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Yula Beauty 06795 — patches 1 → 2 (report 01456 unchanged)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [demand, report, pos, stock] = await Promise.all([
    api('GET', `/entity/demand/${DEMAND_ID}`),
    api('GET', `/entity/commissionreportin/${REPORT_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}/positions?expand=assortment&limit=20`),
    api('GET', `/entity/assortment?filter=code=00053&limit=5&stockMode=all`),
  ])

  if ((demand.description || '').includes(MARKER)) {
    throw new Error(`Already applied on ${demand.name}`)
  }
  if (demand.name !== '06795') throw new Error(`Expected demand 06795, got ${demand.name}`)
  if (report.name !== '01456') throw new Error(`Expected report 01456, got ${report.name}`)
  if (report.sum !== 33500) throw new Error(`Report sum ${money(report.sum)} — leave 01456 at 335`)

  const rows = pos.rows || []
  const tonic = rows.find((r) => r.assortment?.code === '00051')
  const patch = rows.find((r) => r.assortment?.code === '00053')
  if (!tonic || Number(tonic.quantity) !== 1 || tonic.price !== 14500) {
    throw new Error(`Tonic line unexpected: ${tonic?.quantity} @ ${tonic?.price}`)
  }
  if (!patch || Number(patch.quantity) !== 1 || patch.price !== 19000) {
    throw new Error(`Patch line unexpected: ${patch?.quantity} @ ${patch?.price}`)
  }

  const item = (stock.rows || []).find((r) => r.code === '00053')
  const avail = Number(item?.stock || 0) - Number(item?.reserve || 0)
  if (avail < 1) throw new Error(`Need +1 patch, stock available ${avail}`)

  console.log(`  Report ${report.name}: ${money(report.sum)} AED (unchanged, tonic 1 + patch 1)`)
  console.log(`  Demand ${demand.name}: ${money(demand.sum)} → ${money(EXPECTED_DEMAND_SUM_MINOR)}`)
  console.log(`  00051 tonic x1 @ 145`)
  console.log(`  00053 patches x1 → x2 @ 190  stock=${avail}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await api('PUT', `/entity/demand/${DEMAND_ID}/positions/${patch.id}`, {
    quantity: 2,
    price: 19000,
    vat: 5,
    vatEnabled: true,
  })

  const updated = await api('PUT', `/entity/demand/${DEMAND_ID}`, {
    meta: demand.meta,
    description: [
      demand.description || '',
      MARKER,
      '00053 patches x1 → x2. Demand 3 pcs / 525 AED. Report 01456 stays 2 pcs / 335 AED.',
    ].join('\n'),
  })

  if (updated.sum !== EXPECTED_DEMAND_SUM_MINOR) {
    throw new Error(`Demand sum ${money(updated.sum)} ≠ ${money(EXPECTED_DEMAND_SUM_MINOR)}`)
  }
  if (updated.customerOrder) throw new Error('Demand has customerOrder — expected agreement-only')

  const stockPdf = await exportPdf(
    DEMAND_ID,
    path.join(ORDERS_DIR, `GENOSYS_Yula_Beauty_Consignment_Stock_Note_${updated.name}.pdf`),
  )

  console.log(`\n  Demand: ${updated.name} | ${money(updated.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${DEMAND_ID}`)
  console.log(`  Stock PDF: ${stockPdf}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
