#!/usr/bin/env node

/**
 * 1) Remove EGF 00042 from Eclatant demand 06622
 * 2) Write off ALL remaining EGF Repair Oxymask Cream (discontinued)
 * 3) Re-export stock note PDF → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-fix-eclatant-remove-egf-writeoff-20260803.js
 *   node --import dotenv/config scripts/moysklad-fix-eclatant-remove-egf-writeoff-20260803.js --commit
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
const DEMAND_ID = '6abfb5d4-8f28-11f1-0a80-0fc50078c2df' // 06622
const EGF_CODE = '00042'
const EGF_PRODUCT_ID = 'e5c9eca4-42b9-11ea-0a80-0475000bb675'
const EGF_POS_ID = '6abfda07-8f28-11f1-0a80-0fc50078c2ec'
const EXPECTED_DEMAND_AFTER = 255600 // 2701 - 145
const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const WRITEOFF_MARKER = `EGF-OXYMASK-DISCONTINUED-WRITEOFF-${uaeToday()}`

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

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
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

async function getEgfAvailable() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const row = rows.find((r) => r.code === EGF_CODE)
  if (!row) throw new Error('EGF 00042 not found in stock report')
  return {
    stock: Number(row.stock || 0),
    reserve: Number(row.reserve || 0),
    available: Number(row.stock || 0) - Number(row.reserve || 0),
  }
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
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const out = path.join(ORDERS_DIR, `GENOSYS_Eclatant_Consignment_Stock_Note_${demandName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Remove EGF from demand 06622 + write off all EGF (discontinued)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [demand, pos, egfStock, product] = await Promise.all([
    api('GET', `/entity/demand/${DEMAND_ID}`),
    api('GET', `/entity/demand/${DEMAND_ID}/positions?limit=100`),
    getEgfAvailable(),
    api('GET', `/entity/product/${EGF_PRODUCT_ID}`),
  ])

  const egfPos = (pos.rows || []).find((p) => p.id === EGF_POS_ID)
  const buyMinor = product.buyPrice?.value ?? 0

  console.log(`  Demand: ${demand.name} | ${money(demand.sum)} AED`)
  console.log(`  EGF on demand: ${egfPos ? `qty ${egfPos.quantity}` : 'NOT FOUND'}`)
  console.log(
    `  EGF warehouse: stock ${egfStock.stock} reserve ${egfStock.reserve} avail ${egfStock.available}`,
  )
  console.log(`  EGF buyPrice: ${money(buyMinor)} AED`)

  // After removing demand line, write-off qty = current stock (all physical)
  const writeOffQty = egfStock.stock
  if (writeOffQty <= 0 && !egfPos) {
    console.log('\n  Nothing to do — no EGF on demand and zero stock.')
    return
  }

  const writeOffMinor = buyMinor * writeOffQty
  console.log(`\n  Plan:`)
  if (egfPos) {
    console.log(`    1) DELETE EGF line from demand → expected sum ${money(EXPECTED_DEMAND_AFTER)}`)
  }
  console.log(`    2) Write off ${writeOffQty} pcs EGF @ buyPrice → ${money(writeOffMinor)} AED`)
  console.log(`    3) Re-export stock note PDF`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  // 1) Remove from demand
  if (egfPos) {
    await api('DELETE', `/entity/demand/${DEMAND_ID}/positions/${EGF_POS_ID}`)
    const demandAfter = await api('GET', `/entity/demand/${DEMAND_ID}`)
    await api('PUT', `/entity/demand/${DEMAND_ID}`, {
      meta: demandAfter.meta,
      description: [
        demandAfter.description || '',
        `[${uaeToday()}] EGF 00042 removed — discontinued, not replenished.`,
      ]
        .filter(Boolean)
        .join('\n'),
    })
    const finalDem = await api('GET', `/entity/demand/${DEMAND_ID}`)
    console.log(`\n  Demand ${finalDem.name}: ${money(finalDem.sum)} AED`)
    if (finalDem.sum !== EXPECTED_DEMAND_AFTER) {
      throw new Error(`Demand sum ${money(finalDem.sum)} ≠ expected ${money(EXPECTED_DEMAND_AFTER)}`)
    }
  }

  // Re-read stock after demand release
  const stockAfter = await getEgfAvailable()
  const qty = stockAfter.stock
  if (qty <= 0) {
    console.log('  No EGF stock left to write off.')
  } else {
    const dup = await api('GET', `/entity/loss?search=${encodeURIComponent(WRITEOFF_MARKER)}&limit=5`)
    if ((dup.rows || []).some((r) => (r.description || '').includes(WRITEOFF_MARKER))) {
      throw new Error(`Duplicate write-off marker: ${WRITEOFF_MARKER}`)
    }
    const p2 = await api('GET', `/entity/product/${EGF_PRODUCT_ID}`)
    const buy = p2.buyPrice?.value ?? 0
    const loss = await api('POST', '/entity/loss', {
      applicable: true,
      moment: uaeMomentNow(),
      description: [
        WRITEOFF_MARKER,
        'EGF Repair Oxymask Cream 50ml — discontinued. Full warehouse write-off @ buyPrice.',
        `Qty ${qty} pcs.`,
      ].join(' | '),
      organization: href('organization', ORG_ID),
      store: href('store', STORE_ID),
      positions: [
        {
          quantity: qty,
          price: buy,
          assortment: href('product', EGF_PRODUCT_ID),
          vat: 0,
          vatEnabled: false,
        },
      ],
    })
    console.log(`  Loss: ${loss.name} | ${money(loss.sum)} AED | ${qty} pcs EGF`)
    console.log(`  https://online.moysklad.ru/app/#loss/edit?id=${loss.id}`)
  }

  const dem = await api('GET', `/entity/demand/${DEMAND_ID}`)
  const pdf = await exportStockNote(DEMAND_ID, dem.name)
  console.log(`  PDF: ${pdf}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
