#!/usr/bin/env node

/**
 * First Person Marina — unpost 2022+ sales returns (+4,486 AED settlement credit).
 * Follow-up to moysklad-fix-persona-marina-legacy-balance-20260626.js (2020–2021).
 *
 *   node --import dotenv/config scripts/moysklad-fix-persona-marina-returns-2022plus-20260626.js
 *   node --import dotenv/config scripts/moysklad-fix-persona-marina-returns-2022plus-20260626.js --commit
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
const MARKER = `LEGACY-VOID-PERSONA-MARINA-RETURNS-2022PLUS-${uaeToday()}`
const FROM_DATE = '2022-01-01'

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

async function fetchApplicableReturns() {
  const agentFilter = encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)
  const rows = []
  let offset = 0
  while (true) {
    const data = await api(
      'GET',
      `/entity/salesreturn?filter=agent=${agentFilter};applicable=true&limit=1000&offset=${offset}`
    )
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
    .filter((r) => (r.moment || '') >= FROM_DATE)
    .sort((a, b) => (a.moment || '').localeCompare(b.moment || ''))
}

async function voidReturn(ret) {
  const doc = await api('GET', `/entity/salesreturn/${ret.id}`)
  if (doc.applicable === false) {
    console.log(`  ✓ ${doc.name} already unposted — skip`)
    return { skipped: true, sum: 0 }
  }

  const note = `Consignment-era return credit cleared ${uaeToday()} — settlement zero`
  const desc = [doc.description || '', `[${MARKER}] ${note}`].filter(Boolean).join('\n')

  console.log(`  → ${doc.name}  ${(doc.moment || '').slice(0, 10)}  ${money(doc.sum)} AED`)

  if (!COMMIT) return { skipped: false, sum: doc.sum || 0 }

  await api('PUT', `/entity/salesreturn/${ret.id}`, {
    meta: doc.meta,
    applicable: false,
    description: desc,
  })
  console.log(`    ✓ applicable → false`)
  return { skipped: false, sum: doc.sum || 0 }
}

async function main() {
  console.log('====================================================================')
  console.log('  First Person Marina — void 2022+ sales returns (+4,486 AED)')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN (add --commit)'}`)
  console.log('====================================================================\n')

  const before = await settlementBalance(AGENT_ID)
  console.log(`Settlement balance before: ${money(before)} AED\n`)

  const returns = await fetchApplicableReturns()
  if (!returns.length) {
    console.log('No applicable returns from 2022+ — nothing to do.')
    return
  }

  let voidedSum = 0
  for (const ret of returns) {
    const r = await voidReturn(ret)
    if (!r.skipped) voidedSum += r.sum
  }

  console.log(`\nReturns to void: ${returns.length}  total ${money(voidedSum)} AED`)

  const after = COMMIT ? await settlementBalance(AGENT_ID) : before - voidedSum
  console.log(`Settlement balance after:  ${money(after)} AED`)

  if (!COMMIT) {
    console.log('\nDry run only. Re-run with --commit to apply.')
    return
  }

  if (Math.abs(after) > 100) {
    throw new Error(`Balance not zero after fix: ${money(after)} AED`)
  }
  console.log('\n✓ Settlement balance is zero.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
