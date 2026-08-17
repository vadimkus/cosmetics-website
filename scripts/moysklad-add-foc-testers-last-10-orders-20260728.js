#!/usr/bin/env node

/**
 * Last 10 retail orders — add FOC tester mix on SO + invoice + demand.
 * Always includes 00121 shampoo tester; 2 extra sample SKUs matched/rotated.
 * Paid totals unchanged (100% discount). Document moments restored after amend.
 *
 *   node --import dotenv/config scripts/moysklad-add-foc-testers-last-10-orders-20260728.js
 *   node --import dotenv/config scripts/moysklad-add-foc-testers-last-10-orders-20260728.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')
const MARKER = `FOC-TESTERS-MIX-LAST10-${uaeToday()}`

/** Display list AED @ 100% discount (sum unchanged). */
const FOC_LIST_AED = 18

const PRODUCTS = {
  '00121': { id: 'ba0fc745-a96e-11ea-0a80-055800131348', name: 'HR³ shampoo tester 30ml' },
  '00116': { id: 'a09a0186-a96d-11ea-0a80-05570013dcbc', name: 'Samples Problem Control Cream' },
  '00120': { id: '7d36feba-a96e-11ea-0a80-02b3001280dc', name: 'Samples Skin Barrier 2g×100' },
  '00135': { id: 'fd3a60d5-54fc-11eb-0a80-022e0000acc1', name: 'Samples EPI Peeling Gel' },
  '54476': { id: 'ce3e9804-6ae8-11f1-0a80-112a003a38ee', name: 'Samples Overnight Mask 2g×50' },
  '54479': { id: 'cdf198bf-6ae8-11f1-0a80-1a5a003a0b40', name: 'Samples Hyaluron Cream 2g×100' },
  '54489': { id: '463e822d-6ed1-11f1-0a80-1beb00a2f3b7', name: 'Samples Multi Vita Radiance Serum 2ml×100' },
}

/**
 * Per order: always 00121 + 2 sample SKUs (cheaper boxes / piece testers).
 * [orderName, sampleCodes[]]
 */
const MIXES = [
  ['GENCardM2607261121', ['00121', '54476', '00135']], // Anastasiya cushion
  ['GENCardM2607269771', ['00121', '54476', '00135']], // Arina PDRN
  ['GENCardM260726CIEL', ['00121', '00120', '54479']], // Le Ciel cushions
  ['GENCardM2607260406', ['00121', '54489', '00135']], // Kseniya Revita/mist
  ['GENCardM2607261687', ['00121', '54489', '00116']], // Sara radiance/hair
  ['GENCardM260726SABA2', ['00121', '54479', '00120']], // Saba snow/hyaluron
  ['GENCardM2607258835', ['00121', '00116', '54476']], // Olga snow/toner
  ['GENCardM2607246931', ['00121', '00120', '00135']], // Milena snow/sensitive
  ['GENCardW2607246301', ['00121', '54476', '54489']], // Mariia mist
  ['GENCardM2607234104', ['00121', '54489', '00116']], // Sara radiance/problem/hair
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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1400)}`)
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function idFromHref(h) {
  return h.split('/').pop().split('?')[0]
}

function buildPos(code) {
  const p = PRODUCTS[code]
  if (!p) throw new Error(`Unknown sample code ${code}`)
  return {
    quantity: 1,
    price: Math.round(FOC_LIST_AED * 100),
    discount: 100,
    assortment: href('product', p.id),
    vat: 5,
    vatEnabled: true,
  }
}

async function resolveChain(orderName) {
  const o = (
    await api('GET', `/entity/customerorder?filter=name=${encodeURIComponent(orderName)}&expand=invoicesOut,agent&limit=1`)
  ).rows?.[0]
  if (!o) throw new Error(`Order not found: ${orderName}`)
  if (!o.invoicesOut?.length) throw new Error(`${orderName}: no invoice`)
  const inv = await api('GET', `/entity/invoiceout/${idFromHref(o.invoicesOut[0].meta.href)}?expand=demands`)
  if (!inv.demands?.length) throw new Error(`${orderName}: no demand on invoice ${inv.name}`)
  const dem = await api('GET', `/entity/demand/${idFromHref(inv.demands[0].meta.href)}`)
  return {
    order: o,
    invoice: inv,
    demand: dem,
    expectedSum: o.sum,
  }
}

async function addFocLines(entityType, docId, label, codes) {
  const rows = await fetchAll(`/entity/${entityType}/${docId}/positions?expand=assortment`)
  const have = new Set(rows.map((p) => p.assortment?.code).filter(Boolean))
  for (const code of codes) {
    if (have.has(code)) {
      const existing = rows.find((p) => p.assortment?.code === code)
      if (Number(existing?.discount || 0) === 100) {
        console.log(`    ${label}: ${code} already FOC — skip`)
        continue
      }
      throw new Error(`${label}: ${code} present but not 100% off`)
    }
    const payload = buildPos(code)
    console.log(`    ${label}: + ${code} x1 @ ${FOC_LIST_AED} AED, 100% off (${PRODUCTS[code].name})`)
    if (COMMIT) await api('POST', `/entity/${entityType}/${docId}/positions`, payload)
  }
}

async function restoreMoment(entityType, docId, moment, label) {
  const doc = await api('GET', `/entity/${entityType}/${docId}`)
  if (doc.moment === moment) {
    console.log(`    ${label}: moment ok ${moment}`)
    return
  }
  console.log(`    ${label}: restore moment ${doc.moment} → ${moment}`)
  if (COMMIT) {
    await api('PUT', `/entity/${entityType}/${docId}`, { moment })
    const again = await api('GET', `/entity/${entityType}/${docId}`)
    if (again.moment !== moment) throw new Error(`${label}: moment restore failed (${again.moment})`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  FOC tester mix — last 10 orders (SO / invoice / demand)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker: ${MARKER}`)

  const stockRows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const r of stockRows) {
    if (!r.code) continue
    stock.set(r.code, Number(r.stock || 0) - Number(r.reserve || 0))
  }

  const need = new Map()
  for (const [, codes] of MIXES) {
    for (const c of codes) need.set(c, (need.get(c) || 0) + 1)
  }
  console.log('\n  Stock check (need / avail):')
  for (const [code, qty] of [...need.entries()].sort()) {
    const avail = stock.get(code) ?? 0
    const ok = avail >= qty ? 'OK' : 'SHORT'
    console.log(`    ${code}: need ${qty}, avail ${avail} ${ok} — ${PRODUCTS[code]?.name || ''}`)
    if (avail < qty) throw new Error(`Insufficient stock ${code}`)
  }

  const results = []
  for (const [orderName, codes] of MIXES) {
    console.log(`\n  —— ${orderName} ——`)
    console.log(`  Mix: ${codes.join(' + ')}`)
    const chain = await resolveChain(orderName)
    const { order, invoice, demand, expectedSum } = chain
    console.log(
      `  ${order.agent?.name || '?'} | paid ${money(expectedSum)} | inv ${invoice.name} | ship ${demand.name}`,
    )
    console.log(
      `  moments: SO ${order.moment} | INV ${invoice.moment} | DEM ${demand.moment}`,
    )

    if ((order.description || '').includes('FOC-TESTERS-MIX-LAST10-')) {
      console.log('  Already marked — skip order')
      results.push({ orderName, skipped: true })
      continue
    }

    await addFocLines('customerorder', order.id, 'Order', codes)
    await addFocLines('invoiceout', invoice.id, 'Invoice', codes)
    await addFocLines('demand', demand.id, 'Shipment', codes)

    if (COMMIT) {
      const meta = await api('GET', `/entity/customerorder/${order.id}`)
      await api('PUT', `/entity/customerorder/${order.id}`, {
        description: [
          meta.description || '',
          MARKER,
          `FOC testers: ${codes.join(', ')} @ ${FOC_LIST_AED} AED list 100% off.`,
        ]
          .filter(Boolean)
          .join(' | '),
      })

      await restoreMoment('customerorder', order.id, order.moment, 'Order')
      await restoreMoment('invoiceout', invoice.id, invoice.moment, 'Invoice')
      await restoreMoment('demand', demand.id, demand.moment, 'Shipment')

      const [o2, i2, d2] = await Promise.all([
        api('GET', `/entity/customerorder/${order.id}`),
        api('GET', `/entity/invoiceout/${invoice.id}`),
        api('GET', `/entity/demand/${demand.id}`),
      ])
      console.log(`  After: SO ${money(o2.sum)} | INV ${money(i2.sum)} | DEM ${money(d2.sum)}`)
      if (o2.sum !== expectedSum || i2.sum !== expectedSum || d2.sum !== expectedSum) {
        throw new Error(`${orderName}: sum changed — expected ${money(expectedSum)}`)
      }
      if (o2.moment !== order.moment || i2.moment !== invoice.moment || d2.moment !== demand.moment) {
        throw new Error(`${orderName}: moment drift after restore`)
      }
    }

    results.push({ orderName, codes, expectedSum, skipped: false })
  }

  console.log('\n====================================================================')
  console.log(`  ${COMMIT ? 'DONE' : 'DRY RUN OK'} — ${results.filter((r) => !r.skipped).length} orders`)
  if (!COMMIT) console.log('  Re-run with --commit to post FOC lines + restore moments')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
