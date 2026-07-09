#!/usr/bin/env node
/**
 * Scan H1 2026 Wio AED statements for outflows that were later offset by an inflow
 * (refund / reversal / chargeback / returned payment) — so expenses are not overstated.
 *
 * Two signals:
 *   A) MERCHANT match  — an inflow whose merchant matches an earlier outflow merchant.
 *   B) AMOUNT match    — an inflow within ±2% (and within 90 days) of an earlier outflow,
 *                        even if the merchant string differs (e.g. "Qatar Airways" vs "Qatar air").
 */
const fs = require('fs')
const path = require('path')
const DIR = 'data/wio-statements-2026-h1'

function parseCSV(txt) {
  const rows = []
  let row = [], cur = '', q = false
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i]
    if (q) {
      if (c === '"' && txt[i + 1] === '"') { cur += '"'; i++ }
      else if (c === '"') q = false
      else cur += c
    } else {
      if (c === '"') q = true
      else if (c === ',') { row.push(cur); cur = '' }
      else if (c === '\n' || c === '\r') { if (cur !== '' || row.length) { row.push(cur); rows.push(row); row = []; cur = '' } }
      else cur += c
    }
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row) }
  return rows
}

const norm = (s) => (s || '').toLowerCase().replace(/llc|inc|fz-?llc|ltd|co\b|\bthe\b/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
const tokens = (s) => new Set(norm(s).split(' ').filter(w => w.length >= 3))
function nameMatch(a, b) {
  const ta = tokens(a), tb = tokens(b)
  if (!ta.size || !tb.size) return false
  let shared = 0
  for (const t of ta) if (tb.has(t)) shared++
  return shared >= 1 && (shared / Math.min(ta.size, tb.size)) >= 0.5
}

const all = []
for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith('.csv')) continue
  const rows = parseCSV(fs.readFileSync(path.join(DIR, f), 'utf8'))
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    if (r.length < 11) continue
    const type = r[6], date = r[7], ref = r[8], desc = r[9], amt = parseFloat(r[10])
    if (!date || isNaN(amt)) continue
    all.push({ type, date, ref, desc, amt })
  }
}
all.sort((a, b) => a.date.localeCompare(b.date))

const outs = all.filter(t => t.amt < 0)
const ins = all.filter(t => t.amt > 0)
const days = (a, b) => Math.abs((new Date(b) - new Date(a)) / 86400000)

// Skip categories that are NOT expenses being refunded (sweeps, owner transfers, sales inflows)
const isSweepy = (t) => /currency exchange|wio|own account|saving|treasury|interest/i.test(t.desc)
const isSalesIn = (t) => /network international|stripe|tabby|tamara|pos-/i.test(t.desc + ' ' + (t.notes || ''))

const flagged = []
for (const o of outs) {
  if (isSweepy(o)) continue
  for (const inn of ins) {
    if (inn.date < o.date) continue
    if (days(o.date, inn.date) > 90) continue
    if (isSweepy(inn) || isSalesIn(inn)) continue
    const aOut = Math.abs(o.amt), aIn = inn.amt
    const nameHit = nameMatch(o.desc, inn.desc)
    const amtHit = Math.abs(aIn - aOut) / aOut <= 0.02 && aIn <= aOut * 1.001
    if (nameHit || amtHit) {
      flagged.push({
        merchant_out: o.desc, charge: -aOut, charge_date: o.date, charge_ref: o.ref,
        merchant_in: inn.desc, refund: aIn, refund_date: inn.date, refund_ref: inn.ref,
        net: +(aIn - aOut).toFixed(2), signal: [nameHit && 'NAME', amtHit && 'AMOUNT'].filter(Boolean).join('+'),
      })
    }
  }
}

// de-dupe: keep best refund per charge ref (closest amount)
const byCharge = {}
for (const f of flagged) {
  const k = f.charge_ref
  if (!byCharge[k] || Math.abs(f.refund + f.charge) < Math.abs(byCharge[k].refund + byCharge[k].charge)) byCharge[k] = f
}
const result = Object.values(byCharge).sort((a, b) => Math.abs(b.charge) - Math.abs(a.charge))

console.log(`Scanned ${all.length} txns (${outs.length} outflows, ${ins.length} inflows).`)
console.log(`Potential refund/reversal pairs: ${result.length}\n`)
for (const r of result) {
  console.log(`[${r.signal}] CHARGE ${r.charge_date} ${r.merchant_out}  AED ${r.charge.toFixed(2)} (ref ${r.charge_ref})`)
  console.log(`         REFUND ${r.refund_date} ${r.merchant_in}  AED +${r.refund.toFixed(2)} (ref ${r.refund_ref})  => NET ${r.net.toFixed(2)}`)
}
fs.writeFileSync(path.join(DIR, 'refund-scan-h1-2026.json'), JSON.stringify(result, null, 2))
console.log(`\nSaved -> ${DIR}/refund-scan-h1-2026.json`)
