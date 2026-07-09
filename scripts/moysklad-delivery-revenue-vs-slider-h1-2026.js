#!/usr/bin/env node

/**
 * Delivery revenue (customer side) vs Slider cost (supplier side) — H1 2026.
 *
 * Sums all delivery-SERVICE line items across demands (shipments) 2026-01-01..06-14,
 * then compares to the Slider last-mile cost already booked (8,072.51 AED gross).
 *
 * Read-only. Run:
 *   node --import dotenv/config scripts/moysklad-delivery-revenue-vs-slider-h1-2026.js
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
if (!LOGIN || !PASSWORD) { console.error('Set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD'); process.exit(1) }
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const H = { Authorization: AUTH, Accept: 'application/json;charset=utf-8', 'Accept-Encoding': 'gzip' }

const DELIVERY = {
  '07b8307e-f64c-11ed-0a80-01c100114f88': 'Delivery Fedex',
  '212036af-814f-11ea-0a80-011700157c7d': 'Delivery Abu Dhabi',
  '41b80390-814f-11ea-0a80-03ae0014ec85': 'Delivery Al Ain',
  '52864050-59a7-11eb-0a80-022e00579624': 'Delivery Sharjah',
  '557d2277-814f-11ea-0a80-03ae0014ed65': 'Delivery Fujairah',
  '8c1f0ed2-f64b-11ed-0a80-07f200122b04': 'Delivery EMS',
  'a97cfeeb-814e-11ea-0a80-004a001516bd': 'Excellent Delivery Dubai',
  'a9d199bf-b909-11ea-0a80-03ec0015b2d7': 'Delivery RAK',
}

const FROM = '2026-01-01', TO = '2026-06-14'

async function api(url) {
  for (let a = 0; a < 4; a++) {
    const r = await fetch(url.startsWith('http') ? url : API + url, { headers: H })
    if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 600 * (a + 1))); continue }
    if (!r.ok) { console.error('HTTP', r.status, url.slice(0, 120)); return null }
    return r.json()
  }
  return null
}

async function fetchDemands() {
  let all = [], offset = 0
  const filter = `moment>=${FROM} 00:00:00;moment<=${TO} 23:59:59`
  while (true) {
    const d = await api(`/entity/demand?limit=1000&offset=${offset}&filter=${encodeURIComponent(filter)}&order=moment,asc`)
    if (!d) break
    all = all.concat(d.rows || [])
    if ((d.rows || []).length < 1000) break
    offset += 1000
  }
  return all
}

function monthKey(moment) { return (moment || '').slice(0, 7) }

async function main() {
  console.log('Pulling demands', FROM, '->', TO, '...')
  const demands = await fetchDemands()
  console.log('Demands:', demands.length)

  const byService = {}      // id -> {qty, gross}
  const byMonth = {}        // YYYY-MM -> {qty, gross}
  let totalQty = 0, totalGross = 0

  const BATCH = 25
  for (let i = 0; i < demands.length; i += BATCH) {
    const chunk = demands.slice(i, i + BATCH)
    await Promise.all(chunk.map(async (dem) => {
      const href = dem.positions?.meta?.href
      if (!href) return
      const data = await api(href + '?limit=1000&expand=assortment')
      if (!data) return
      for (const p of (data.rows || [])) {
        const aHref = p.assortment?.meta?.href || ''
        const id = aHref.split('/').pop()
        if (!DELIVERY[id]) continue
        const q = p.quantity || 0
        const line = ((p.price || 0) - (p.price || 0) * (p.discount || 0) / 100) * q / 100
        byService[id] = byService[id] || { qty: 0, gross: 0 }
        byService[id].qty += q; byService[id].gross += line
        const mk = monthKey(dem.moment)
        byMonth[mk] = byMonth[mk] || { qty: 0, gross: 0 }
        byMonth[mk].qty += q; byMonth[mk].gross += line
        totalQty += q; totalGross += line
      }
    }))
    process.stdout.write(`  positions ${Math.min(i + BATCH, demands.length)}/${demands.length}\r`)
  }
  console.log('')

  console.log('\n=== DELIVERY REVENUE by service (VAT-incl, net of discount) ===')
  Object.entries(byService).sort((a, b) => b[1].gross - a[1].gross).forEach(([id, v]) => {
    console.log(`  ${DELIVERY[id].padEnd(26)} qty ${String(v.qty).padStart(5)}  AED ${v.gross.toFixed(2).padStart(10)}`)
  })

  console.log('\n=== DELIVERY REVENUE by month ===')
  Object.keys(byMonth).sort().forEach(mk => {
    console.log(`  ${mk}  qty ${String(byMonth[mk].qty).padStart(5)}  AED ${byMonth[mk].gross.toFixed(2).padStart(10)}`)
  })

  // Slider cost booked (gross incl VAT + platform fee) and its VAT
  const SLIDER_GROSS = 8072.51, SLIDER_VAT = 384.54, SLIDER_NET = 6862.97
  const revVatIncl = totalGross
  const revNet = revVatIncl / 1.05
  const revOutputVat = revVatIncl - revNet

  console.log('\n=== DELIVERY P&L (H1 2026, all emirates) ===')
  console.log(`  Delivery revenue  : AED ${revVatIncl.toFixed(2)} VAT-incl  (qty ${totalQty})`)
  console.log(`    net             : AED ${revNet.toFixed(2)}`)
  console.log(`    output VAT       : AED ${revOutputVat.toFixed(2)}`)
  console.log(`  Slider cost       : AED ${SLIDER_GROSS.toFixed(2)} paid  (net ${SLIDER_NET.toFixed(2)} + VAT ${SLIDER_VAT.toFixed(2)})`)
  console.log(`  ---`)
  console.log(`  Gross margin (incl): AED ${(revVatIncl - SLIDER_GROSS).toFixed(2)}`)
  console.log(`  Gross margin (net) : AED ${(revNet - SLIDER_NET).toFixed(2)}   <-- true delivery profit`)
  console.log(`  Net VAT to FTA     : AED ${(revOutputVat - SLIDER_VAT).toFixed(2)} (output - input)`)
}

main().catch(e => { console.error('FATAL', e.message); process.exit(1) })
