#!/usr/bin/env node

/**
 * Restore First Person Marina sales returns unposted during settlement cleanup.
 * Re-conducts (applicable → true) returns voided by:
 *   moysklad-fix-persona-marina-legacy-balance-20260626.js (00002, 00006)
 *   moysklad-fix-persona-marina-returns-2022plus-20260626.js (19 returns)
 *
 *   node --import dotenv/config scripts/moysklad-restore-persona-marina-returns-20260626.js
 *   node --import dotenv/config scripts/moysklad-restore-persona-marina-returns-20260626.js --commit
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
const RESTORE_MARKER = `RESTORED-PERSONA-MARINA-RETURNS-${uaeToday()}`

/** All returns we voided — ids from API audit 2026-06-26 */
const RETURN_IDS = [
  { name: '00002', id: '2956a655-893a-11ea-0a80-036200053c11' },
  { name: '00006', id: '65a9e444-6333-11ec-0a80-00c4002cedf1' },
  { name: '00007', id: '986fa2c9-7234-11ec-0a80-00c4011b72b3' },
  { name: '00008', id: 'fbb426af-80df-11ec-0a80-09a40029a8d5' },
  { name: '00010', id: 'c12f4e30-80ed-11ec-0a80-0172002bc600' },
  { name: '00036', id: '8290905b-ba69-11ec-0a80-0b28000f70a3' },
  { name: '00044', id: 'f2fcce5d-d67d-11ec-0a80-0c7b001959ca' },
  { name: '00045', id: '255d2360-e7d8-11ec-0a80-07a60009fba4' },
  { name: '00055', id: 'abf8d4b0-7af1-11ed-0a80-03dc0015d5d4' },
  { name: '00056', id: '3e241863-7b80-11ed-0a80-058d001fcaca' },
  { name: '00066', id: '924d0954-8824-11ed-0a80-004000ae73b4' },
  { name: '00075', id: 'b77df5ad-a0a2-11ed-0a80-03c5003ec6ef' },
  { name: '00079', id: 'fb545d7b-1bbc-11ee-0a80-08b1001a2ceb' },
  { name: '00084', id: '946e3ea9-22ed-11ee-0a80-112e00185aa2' },
  { name: '00085', id: 'b81071cf-22f8-11ee-0a80-105600198a9e' },
  { name: '00110', id: 'efa89998-5152-11ee-0a80-01bd000a26d1' },
  { name: '00143', id: '05345032-ab9f-11ee-0a80-08ce0044b9e0' },
  { name: '00165', id: 'c78c981e-3f98-11ef-0a80-07a5001757b5' },
  { name: '00167', id: 'a11df03a-516a-11ef-0a80-01e50036fc41' },
  { name: '00193', id: '803197df-ed23-11ef-0a80-1169002fe102' },
  { name: '00194', id: '32ee02cc-f5df-11ef-0a80-0e1e00247248' },
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
      const data = await api(
        'GET',
        `${entityPath}${sep}filter=agent=${agentFilter};applicable=true&limit=1000&offset=${offset}`
      )
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

async function restoreReturn(item) {
  const doc = await api('GET', `/entity/salesreturn/${item.id}`)
  if (doc.name !== item.name) {
    throw new Error(`ID/name mismatch: expected ${item.name}, got ${doc.name}`)
  }
  if (doc.applicable !== false) {
    console.log(`  ✓ ${doc.name} already conducted — skip`)
    return { skipped: true, sum: doc.sum || 0 }
  }

  const desc = [doc.description || '', `[${RESTORE_MARKER}] Re-conducted — consignment stock return`]
    .filter(Boolean)
    .join('\n')

  console.log(`  → ${doc.name}  ${(doc.moment || '').slice(0, 10)}  ${money(doc.sum)} AED`)

  if (!COMMIT) return { skipped: false, sum: doc.sum || 0 }

  await api('PUT', `/entity/salesreturn/${item.id}`, {
    meta: doc.meta,
    applicable: true,
    description: desc,
  })
  console.log(`    ✓ applicable → true`)
  return { skipped: false, sum: doc.sum || 0 }
}

async function main() {
  console.log('====================================================================')
  console.log('  First Person Marina — restore voided sales returns (21)')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN (add --commit)'}`)
  console.log('====================================================================\n')

  const before = await settlementBalance(AGENT_ID)
  console.log(`Settlement balance before: ${money(before)} AED\n`)

  let restoredSum = 0
  let restoredCount = 0
  for (const item of RETURN_IDS) {
    const r = await restoreReturn(item)
    if (!r.skipped) {
      restoredSum += r.sum
      restoredCount += 1
    }
  }

  console.log(`\nTo restore: ${restoredCount} returns  ${money(restoredSum)} AED credit`)

  const after = COMMIT ? await settlementBalance(AGENT_ID) : before + restoredSum
  console.log(`Settlement balance after:  ${money(after)} AED`)
  console.log('  (positive = return credits in Взаиморасчеты — expected; consignment stock uses these docs)')

  if (!COMMIT) {
    console.log('\nDry run only. Re-run with --commit to apply.')
    return
  }

  const applicableReturns = (
    await api(
      'GET',
      `/entity/salesreturn?filter=agent=${encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)};applicable=true`
    )
  ).rows.length

  console.log(`\n✓ Applicable returns for Marina: ${applicableReturns}`)
  console.log('✓ Legacy invoices stay voided (9 docs) — phantom AR only.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
