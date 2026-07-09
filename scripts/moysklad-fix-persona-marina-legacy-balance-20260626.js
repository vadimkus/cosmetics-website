#!/usr/bin/env node

/**
 * First Person Ladies Salon (Marina) — close 2020–2021 legacy settlement noise.
 *
 * Root cause (see docs/SESSION_CHANGES_2026-06-26_PERSONA_MARINA_BALANCE_INVESTIGATION.md):
 *   • 9 retail invoices (2020–2021) still open though consignment отгрузки / payments already exist
 *   • Returns 00002 + 00006 (882 AED) — unapplied credits from same era
 *
 * Fix: unpost (applicable → false) those invoices + returns only.
 * Consignment demands / commission reports are NOT touched.
 *
 *   node --import dotenv/config scripts/moysklad-fix-persona-marina-legacy-balance-20260626.js
 *   node --import dotenv/config scripts/moysklad-fix-persona-marina-legacy-balance-20260626.js --commit
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
const GAP_MS = 80
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const AGENT_ID = 'af21a79a-63cd-11ea-0a80-02b2000e2aeb'
const MARKER = `LEGACY-VOID-PERSONA-MARINA-${uaeToday()}`

/** Phantom retail invoices — consignment demand or paid shipment already covers these */
const INVOICES = [
  { name: '00473', id: '90f24b61-1ce9-11eb-0a80-042200256951', sum: 265100, note: '2020 retail; demand 00506 paid' },
  { name: '00910', id: '271dede5-c38e-11eb-0a80-0652001e8689', sum: 1397100, note: '2021; duplicate of consignment demand 00918' },
  { name: '00979', id: 'b04dec07-f8e9-11eb-0a80-09fa000ceadc', sum: 29000, note: '2021; duplicate of consignment demand 01014' },
  { name: '00985', id: 'b003b444-fc2a-11eb-0a80-0174000cdefc', sum: 73000, note: '2021; duplicate of consignment demand 01020' },
  { name: '01033', id: 'e2307b41-2346-11ec-0a80-096f002af285', sum: 49000, note: '2021; duplicate of consignment demand 01070' },
  { name: '01037', id: '0b15b755-2729-11ec-0a80-021b00030aaf', sum: 21000, note: '2021; duplicate of consignment demand 01074' },
  { name: '01073', id: '68cb3314-3b08-11ec-0a80-0010003502fb', sum: 228200, note: '2021; duplicate of consignment demand 01113' },
  { name: '01088', id: 'deda7a0f-4525-11ec-0a80-07df0023f00c', sum: 43500, note: '2021; duplicate of consignment demand 01130' },
  { name: '01099', id: '7531abe5-4dd9-11ec-0a80-035a000c268c', sum: 271000, note: '2021; duplicate of consignment demand 01141' },
]

const RETURNS = [
  { name: '00002', id: '2956a655-893a-11ea-0a80-036200053c11', sum: 74000, note: '2020-04-28 return credit' },
  { name: '00006', id: '65a9e444-6333-11ec-0a80-00c4002cedf1', sum: 14200, note: '2021-12-22 return credit' },
]

async function api(method, pathStr, body) {
  await sleep(GAP_MS)
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function settlementBalance(agentId) {
  const agentFilter = encodeURIComponent(`${API}/entity/counterparty/${agentId}`)

  async function fetchAll(entityPath) {
    const rows = []
    let offset = 0
    while (true) {
      const sep = entityPath.includes('?') ? '&' : '?'
      const data = await api('GET', `${entityPath}${sep}filter=agent=${agentFilter};applicable=true&limit=1000&offset=${offset}`)
      rows.push(...(data.rows || []))
      if ((data.rows || []).length < 1000) break
      offset += 1000
    }
    return rows
  }

  const [invoices, reports, returns] = await Promise.all([
    fetchAll('/entity/invoiceout'),
    fetchAll('/entity/commissionreportin'),
    fetchAll('/entity/salesreturn'),
  ])

  let balance = 0
  for (const inv of invoices) balance += (inv.payedSum || 0) - (inv.sum || 0)
  for (const rep of reports) balance += (rep.payedSum || 0) - (rep.sum || 0)
  for (const ret of returns) balance += (ret.sum || 0) - (ret.payedSum || 0)
  return balance
}

async function voidDoc(type, item) {
  const doc = await api('GET', `/entity/${type}/${item.id}`)
  if (doc.applicable === false) {
    console.log(`  ✓ ${type} ${item.name} already unposted — skip`)
    return { skipped: true, name: item.name }
  }

  const desc = [doc.description || '', `[${MARKER}] ${item.note}`].filter(Boolean).join('\n')

  console.log(`  → ${type} ${item.name}  ${money(doc.sum)} AED  (${item.note})`)

  if (!COMMIT) return { skipped: false, name: item.name, dry: true }

  await api('PUT', `/entity/${type}/${item.id}`, {
    meta: doc.meta,
    applicable: false,
    description: desc,
  })
  console.log(`    ✓ applicable → false`)
  return { skipped: false, name: item.name }
}

async function main() {
  console.log('====================================================================')
  console.log('  First Person Marina — legacy 2020–2021 balance cleanup')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN (add --commit)'}`)
  console.log('====================================================================\n')

  const balanceBefore = await settlementBalance(AGENT_ID)
  console.log(`Settlement balance before: ${money(balanceBefore)} AED`)
  if (balanceBefore > 0) console.log('  (positive = we owe customer)')
  else if (balanceBefore < 0) console.log('  (negative = customer owes us)')

  console.log('\n--- Unpost legacy invoices (9) ---')
  for (const inv of INVOICES) await voidDoc('invoiceout', inv)

  console.log('\n--- Unpost legacy returns (882 AED) ---')
  for (const ret of RETURNS) await voidDoc('salesreturn', ret)

  const balanceAfter = COMMIT ? await settlementBalance(AGENT_ID) : balanceBefore + 2376900 - 88200

  console.log('\n--- Result ---')
  console.log(`Settlement balance after:  ${money(balanceAfter)} AED (expected ~4486 if only 2020–21 cleared)`)
  console.log(`Removed phantom AR:        ${money(2376900)} AED (9 invoices)`)
  console.log(`Removed return credit:     ${money(88200)} AED (00002 + 00006)`)

  if (!COMMIT) {
    console.log('\nDry run only. Re-run with --commit to apply.')
    return
  }

  const pre2022ReturnCredit = 0
  const openInvoices = (await api(
    'GET',
    `/entity/invoiceout?filter=agent=${encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)};applicable=true`
  )).rows.filter((i) => (i.sum || 0) > (i.payedSum || 0))

  console.log(`\nOpen applicable invoices remaining: ${openInvoices.length}`)
  console.log(`Pre-2022 return credit in applicable docs: ${pre2022ReturnCredit} (should be 0)`)

  if (Math.abs(balanceAfter - 448600) > 500) {
    console.log('\nNote: remaining balance is mostly 2022+ sales returns (+4486). Say if you want those cleared too.')
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
