#!/usr/bin/env node
/**
 * Quick targeted checks to explain the revenue gap and COGS source.
 *  A) Demand sum classified by sum=0 (free/promo) vs sum>0 (paid)
 *  B) Purchase invoices total 2025 (invoiceIn) — proxy for COGS via inventory equation
 *  C) Opening inventory snapshot at 31.12.2024 (to enable: COGS = OpenInv + Purchases - CloseInv)
 *  D) Demands grouped by project name
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const login = process.env.MOYSKLAD_LOGIN
const password = process.env.MOYSKLAD_PASSWORD
const AUTH = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64')

async function api(url) {
  for (let a = 0; a < 4; a++) {
    try {
      const r = await fetch(url, { headers: { Authorization: AUTH, 'Accept-Encoding': 'gzip', 'Accept': 'application/json;charset=utf-8' } })
      if (r.status >= 500 || r.status === 429) { await new Promise(x => setTimeout(x, 600 * (a + 1))); continue }
      if (!r.ok) { console.error(`HTTP ${r.status} ${url.slice(0, 140)}`); return null }
      return r.json()
    } catch (e) { if (a === 3) return null; await new Promise(x => setTimeout(x, 600 * (a + 1))) }
  }
}

async function fetchRange(endpoint, from, to, expand) {
  let all = [], offset = 0
  const filter = `moment>=${from} 00:00:00;moment<=${to} 23:59:59`
  const exp = expand ? `&expand=${expand}` : ''
  while (true) {
    const url = `${API}${endpoint}?limit=1000&offset=${offset}&filter=${encodeURIComponent(filter)}&order=moment,asc${exp}`
    const d = await api(url); if (!d) break
    all = all.concat(d.rows || [])
    if ((d.rows || []).length < 1000) break
    offset += 1000
    await new Promise(r => setTimeout(r, 250))
  }
  return all
}

async function inventoryAt(dateISO) {
  let all = [], offset = 0
  while (true) {
    const url = `${API}/report/stock/all?limit=1000&offset=${offset}&moment=${encodeURIComponent(dateISO)}&stockType=stock`
    const d = await api(url); if (!d) break
    all = all.concat(d.rows || [])
    if ((d.rows || []).length < 1000) break
    offset += 1000
    await new Promise(r => setTimeout(r, 250))
  }
  let v = 0, q = 0, withCost = 0, zeroCost = 0
  for (const r of all) {
    v += (r.stock || 0) * (r.price || 0) / 100
    q += (r.stock || 0)
    if ((r.price || 0) > 0) withCost++; else if ((r.stock || 0) > 0) zeroCost++
  }
  return { value: v / 100, qty: q, lines: all.length, withCost, zeroCost }
}

async function main() {
  const fmt = n => Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 })

  console.log('━━━ DEEP VALIDATION CHECKS ━━━\n')

  // === A) Demand split paid vs free ===
  console.log('A) Demand 2025 split: paid (sum>0) vs free (sum=0)')
  const demands25 = await fetchRange('/entity/demand', '2025-01-01', '2025-12-31')
  let paidSum = 0, paidCount = 0, freeCount = 0
  const projectAgg = new Map()
  for (const d of demands25) {
    const sum = (d.sum || 0) / 100
    if (sum > 0) { paidSum += sum; paidCount++ } else freeCount++
    const projName = d.project?.meta?.uuidHref || '(no project)'
    const cur = projectAgg.get(projName) || { sum: 0, count: 0 }
    cur.sum += sum; cur.count++
    projectAgg.set(projName, cur)
  }
  console.log(`   Paid demands : count=${paidCount}, sum=AED ${fmt(paidSum)}`)
  console.log(`   Free demands : count=${freeCount}`)
  console.log(`   Total demand sum (paid only) : AED ${fmt(paidSum)}`)
  console.log(`   PDF revenue                  : AED 1,365,229`)
  console.log(`   diff (paid - PDF)            : AED ${fmt(paidSum - 1365229)}`)

  console.log('\n   By project (top 10 by sum):')
  const sorted = [...projectAgg.entries()].sort((a, b) => b[1].sum - a[1].sum).slice(0, 10)
  for (const [name, v] of sorted) {
    console.log(`     ${name.padEnd(35)} count=${String(v.count).padStart(5)}  sum=AED ${fmt(v.sum)}`)
  }

  // === B) Purchases 2025 (invoiceIn) ===
  console.log('\nB) Purchase invoices 2025 (invoiceIn) — proxy for COGS via inventory equation')
  const invIn25 = await fetchRange('/entity/invoicein', '2025-01-01', '2025-12-31')
  let invInSum = 0
  for (const r of invIn25) invInSum += (r.sum || 0)
  invInSum /= 100
  console.log(`   invoiceIn count=${invIn25.length}, sum=AED ${fmt(invInSum)}`)

  // === C) Opening + closing inventory ===
  console.log('\nC) Inventory @ 31.12.2024 (opening) and @ 31.12.2025 (closing)')
  const open = await inventoryAt('2024-12-31 23:59:59')
  const close = await inventoryAt('2025-12-31 23:59:59')
  console.log(`   Opening 31.12.2024 : value=AED ${fmt(open.value)}, qty=${open.qty}, lines=${open.lines}, withCost=${open.withCost}, zeroCostButHasStock=${open.zeroCost}`)
  console.log(`   Closing 31.12.2025 : value=AED ${fmt(close.value)}, qty=${close.qty}, lines=${close.lines}, withCost=${close.withCost}, zeroCostButHasStock=${close.zeroCost}`)
  const cogsByEquation = open.value + invInSum - close.value
  console.log(`   COGS = OpenInv + Purchases - CloseInv = ${fmt(open.value)} + ${fmt(invInSum)} - ${fmt(close.value)} = AED ${fmt(cogsByEquation)}`)
  console.log(`   PDF COGS = AED 415,366  | diff = AED ${fmt(cogsByEquation - 415366)} (${((cogsByEquation - 415366) / 415366 * 100).toFixed(1)}%)`)

  console.log('\n━━━ DONE ━━━')
}

main().catch(e => { console.error(e); process.exit(1) })
