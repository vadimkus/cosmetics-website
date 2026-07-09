#!/usr/bin/env node
/**
 * Fix 3 H1-2026 AED bank ↔ MoySklad reconciliation items (backdated):
 *   2) paymentout 00588 booked AED 0.00 → set to 304.41 (MOFA Invoices Attestation)
 *   3) Qatar Airways AED 29,570 (2026-01-05) unbooked → create Business Travel paymentout
 *   4) Small operational card spend → monthly aggregate paymentouts (Jan–May 2026),
 *      excluding Slider (already 00614–00619), Wio fees, bonuses, rent, Qatar, MOFA.
 *
 * Idempotent: re-running will not duplicate. Pass --commit to write (default dry-run).
 */
const fs = require('fs')
const API = 'https://api.moysklad.ru/api/remap/1.2'
const AUTH = 'Basic ' + Buffer.from(process.env.MOYSKLAD_LOGIN + ':' + process.env.MOYSKLAD_PASSWORD).toString('base64')
const H = { Authorization: AUTH, Accept: 'application/json;charset=utf-8', 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip' }
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738' // GENOSYS
const MOFA_PO_ID = '2c22dc70-43a5-11f1-0a80-0fb40007aaa2' // paymentout 00588
const QATAR_AGENT = '3c7aae78-e6ca-11f0-0a80-15ae00577181'
const EI_TRAVEL = '14596467-8b1a-11eb-0a80-02a70030d88e' // Business Travel (conference)

const meta = (entity, id) => ({ meta: { href: `${API}/entity/${entity}/${id}`, type: entity === 'expenseitem' ? 'expenseitem' : entity, mediaType: 'application/json' } })

async function api(method, url, body) {
  const r = await fetch(API + url, { method, headers: H, body: body ? JSON.stringify(body) : undefined })
  const txt = await r.text()
  if (!r.ok) throw new Error(`HTTP ${r.status} ${method} ${url} :: ${txt}`)
  return txt ? JSON.parse(txt) : null
}

async function ensureExpenseItem(name) {
  const got = await api('GET', `/entity/expenseitem?filter=${encodeURIComponent('name=' + name)}&limit=5`)
  const hit = (got?.rows || []).find(e => e.name === name)
  if (hit) { console.log(`  expenseItem "${name}" exists`); return hit }
  if (!COMMIT) { console.log(`  [dry] would CREATE expenseItem "${name}"`); return { id: 'DRY' } }
  const created = await api('POST', '/entity/expenseitem', { name })
  console.log(`  created expenseItem "${name}" -> ${created.id}`)
  return created
}

async function ensureCounterparty(name, marker) {
  const got = await api('GET', `/entity/counterparty?filter=${encodeURIComponent('name=' + name)}&limit=5`)
  const hit = (got?.rows || []).find(c => c.name === name)
  if (hit) { console.log(`  counterparty "${name}" exists`); return hit }
  if (!COMMIT) { console.log(`  [dry] would CREATE counterparty "${name}"`); return { id: 'DRY' } }
  const created = await api('POST', '/entity/counterparty', { name, companyType: 'legal', description: marker })
  console.log(`  created counterparty "${name}" -> ${created.id}`)
  return created
}

async function poExistsByPurpose(marker) {
  const got = await api('GET', `/entity/paymentout?filter=${encodeURIComponent('paymentPurpose~' + marker)}&limit=5`)
  return (got?.rows || []).length > 0
}

async function main() {
  console.log(COMMIT ? '=== COMMIT MODE ===' : '=== DRY RUN (pass --commit to write) ===')

  // ---- (2) Fix 00588 MOFA 0.00 -> 304.41 ----
  console.log('\n[2] Fix paymentout 00588 (MOFA Invoices Attestation)')
  const po = await api('GET', `/entity/paymentout/${MOFA_PO_ID}`)
  console.log(`  current: ${po.name} ${po.moment} sum(minor)=${po.sum}`)
  if (po.sum === 30441) {
    console.log('  already 304.41 — skip')
  } else if (!COMMIT) {
    console.log('  [dry] would PUT sum 0 -> 30441 (304.41 AED)')
  } else {
    await api('PUT', `/entity/paymentout/${MOFA_PO_ID}`, { sum: 30441 })
    console.log('  PUT done: sum -> 30441 (304.41 AED)')
  }

  // ---- (3) Qatar Airways 29,570 on 2026-01-05 ----
  console.log('\n[3] Qatar Airways AED 29,570 (2026-01-05) — Business Travel')
  const QPURPOSE = 'Qatar Airways flight — H1 2026 business travel [RECON-QATAR-20260105]'
  const qExists = await poExistsByPurpose('RECON-QATAR-20260105')
  if (qExists) {
    console.log('  already booked (marker found) — skip')
  } else if (!COMMIT) {
    console.log('  [dry] would CREATE paymentout: agent Qatar Airways, 29,570.00 AED, 2026-01-05, Business Travel')
  } else {
    const body = {
      organization: meta('organization', ORG_ID),
      agent: meta('counterparty', QATAR_AGENT),
      expenseItem: meta('expenseitem', EI_TRAVEL),
      sum: 2957000,
      moment: '2026-01-05 12:00:00',
      paymentPurpose: QPURPOSE,
    }
    const c = await api('POST', '/entity/paymentout', body)
    console.log(`  created ${c.name} — 29,570.00 AED — ${c.moment}`)
  }

  // ---- (4) Monthly operational small-card aggregates ----
  console.log('\n[4] Monthly operational card-spend aggregates (excl Slider/Wio/bonus/MOFA/Qatar)')
  const ei = await ensureExpenseItem('Sundry operating expenses')
  const cp = await ensureCounterparty('Sundry Card Expenses (Wio AED)', 'Catch-all for small Wio-card operational spend: Uber, Careem, Talabat, Quiqup, Dubai Municipality, Smart Dubai Government, Twilio, Tamm, DU, etc.')

  const J = JSON.parse(fs.readFileSync('data/wio-statements-2026-h1/reconciliation-aed-vs-moysklad-h1-2026.json', 'utf8'))
  const WHITELIST = ['uber', 'careem', 'talabat', 'quiqup', 'dubai municipality', 'smart dubai government', 'twilio', 'tamm', 'du apple', 'samadhi']
  const ops = J.outflowMatch.bankUnmatched.filter(r => {
    const d = r.desc.toLowerCase()
    if (d.includes('slider')) return false
    if (r.type === 'Transfers') return false
    if (d.includes('subscription fee')) return false
    if (d.includes('foreign exchange')) return false
    if (d.includes('ministry of foreign')) return false
    if (d.includes('qatar')) return false
    return WHITELIST.some(w => d.includes(w))
  })
  const byMonth = {}
  for (const r of ops) {
    const m = r.date.slice(0, 7)
    if (!byMonth[m]) byMonth[m] = { items: [], total: 0, vendors: {} }
    byMonth[m].items.push(r)
    byMonth[m].total += Math.abs(r.amt)
    const v = r.desc.replace(/ trip help uber co| Apple Pay| inc/i, '').trim()
    byMonth[m].vendors[v] = (byMonth[m].vendors[v] || 0) + Math.abs(r.amt)
  }
  const monthEnd = { '2026-01': '2026-01-31', '2026-02': '2026-02-28', '2026-03': '2026-03-31', '2026-04': '2026-04-30', '2026-05': '2026-05-31', '2026-06': '2026-06-14' }

  for (const m of Object.keys(byMonth).sort()) {
    const b = byMonth[m]
    const minor = Math.round(b.total * 100)
    const vsum = Object.entries(b.vendors).sort((a, c) => c[1] - a[1]).map(([k, v]) => `${k} ${v.toFixed(2)}`).join('; ')
    const marker = `RECON-SUNDRY-${m}`
    const purpose = `Sundry operational card spend ${m} — ${b.items.length} items: ${vsum} [${marker}]`
    const exists = await poExistsByPurpose(marker)
    if (exists) { console.log(`  ${m}: already booked — skip (AED ${b.total.toFixed(2)})`); continue }
    if (!COMMIT) { console.log(`  ${m}: [dry] would CREATE AED ${b.total.toFixed(2)} (${b.items.length} items) @ ${monthEnd[m]}`); console.log(`        ${vsum}`); continue }
    const body = {
      organization: meta('organization', ORG_ID),
      agent: meta('counterparty', cp.id),
      expenseItem: meta('expenseitem', ei.id),
      sum: minor,
      moment: `${monthEnd[m]} 12:00:00`,
      paymentPurpose: purpose,
    }
    const c = await api('POST', '/entity/paymentout', body)
    console.log(`  ${m}: created ${c.name} — AED ${b.total.toFixed(2)} (${b.items.length} items)`)
  }
  console.log('\nDone.')
}
main().catch(e => { console.error('ERR', e.message); process.exit(1) })
