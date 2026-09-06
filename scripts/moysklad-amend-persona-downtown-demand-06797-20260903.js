#!/usr/bin/env node

/**
 * Persona Downtown demand 06797 — add peptide ×10 + beige ×2. Patches ×5 stay.
 *
 *   node --import dotenv/config scripts/moysklad-amend-persona-downtown-demand-06797-20260903.js
 *   node --import dotenv/config scripts/moysklad-amend-persona-downtown-demand-06797-20260903.js --commit
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

const DEMAND_ID = '1579bc9e-a75e-11f1-0a80-17d5001a4ffe'
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = 'PERSONA-DT-06797-ADD-PEPTIDE-BEIGE-2026-09-03'
const EXPECTED_SUM_MINOR = 163000

const ADD = [
  ['00012', 10, 38, 'Peptide Gel Mask 39g'],
  ['00144', 2, 150, 'Skin Caring Blemish Balm Cushion #2 Beige'],
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

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function exportPdf(demandName) {
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
  const res = await fetch(`${API}/entity/demand/${DEMAND_ID}/export`, {
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
  const out = path.join(ORDERS_DIR, `GENOSYS_Persona_Downtown_Consignment_Stock_Note_${demandName}.pdf`)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  fs.writeFileSync(out, Buffer.from(await pdfRes.arrayBuffer()))
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Persona Downtown 06797 — add peptide ×10 + beige ×2')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const demand = await api('GET', `/entity/demand/${DEMAND_ID}`)
  if (demand.name !== '06797') throw new Error(`Expected 06797, got ${demand.name}`)
  if ((demand.description || '').includes(MARKER)) throw new Error('Already applied')
  if (demand.sum !== 95000) throw new Error(`Expected current 950, got ${money(demand.sum)}`)

  const pos = await api('GET', `/entity/demand/${DEMAND_ID}/positions?expand=assortment&limit=20`)
  const rows = pos.rows || []
  const patch = rows.find((r) => r.assortment?.code === '00053')
  if (!patch || Number(patch.quantity) !== 5) {
    throw new Error(`Expected patches x5, got ${patch?.quantity}`)
  }
  for (const [code] of ADD) {
    if (rows.find((r) => r.assortment?.code === code)) {
      throw new Error(`${code} already on demand`)
    }
  }

  console.log(`  Demand ${demand.name}: ${money(demand.sum)} → ${money(EXPECTED_SUM_MINOR)}`)
  console.log('  Keep: 00053 patches x5 @ 190 = 950')

  const resolved = []
  for (const [code, qty, unitAed, label] of ADD) {
    const data = await api(
      'GET',
      `/entity/assortment?filter=code=${encodeURIComponent(code)}&limit=5&stockMode=all`,
    )
    const item = (data.rows || []).find((r) => r.code === code)
    if (!item?.id) throw new Error(`Unknown ${code}`)
    const avail = Number(item.stock || 0) - Number(item.reserve || 0)
    if (avail < qty) throw new Error(`Stock ${code}: need ${qty}, have ${avail}`)
    const price = Math.round(unitAed * 100)
    resolved.push({ code, qty, price, label, id: item.id })
    console.log(`  Add: ${code} ${label} x${qty} @ ${money(price)} = ${money(price * qty)}  stock=${avail}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  for (const line of resolved) {
    await api('POST', `/entity/demand/${DEMAND_ID}/positions`, {
      quantity: line.qty,
      price: line.price,
      assortment: href('product', line.id),
      vat: 5,
      vatEnabled: true,
    })
  }

  const updated = await api('PUT', `/entity/demand/${DEMAND_ID}`, {
    meta: demand.meta,
    description: [
      demand.description || '',
      MARKER,
      'Added 00012 peptide x10 @ 38 + 00144 beige x2 @ 150. Patches x5 stay. EGF still skipped.',
    ].join('\n'),
  })

  if (updated.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Demand sum ${money(updated.sum)} ≠ ${money(EXPECTED_SUM_MINOR)}`)
  }
  if (updated.customerOrder) throw new Error('Demand has customerOrder')

  const pdf = await exportPdf(updated.name)
  console.log(`\n  Demand: ${updated.name} | ${money(updated.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${DEMAND_ID}`)
  console.log(`  Stock PDF: ${pdf}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
