/**
 * One-off: match website partner accounts (discountType CLINIC/VIP) to
 * MoySklad counterparties + active Commission (consignment) contracts.
 *
 * Match keys: phone (any number in the counterparty phone field, compared on
 * the last 9 digits) and email (case-insensitive). Ambiguous matches are
 * reported, never written.
 *
 * Writes (only with --commit):
 *   - user.moyskladCounterpartyId  (every matched partner)
 *   - user.moyskladContractId + consignmentActive=true (partners whose
 *     counterparty has an active Commission contract)
 *
 * Dry-run:  node scripts/moysklad-match-consignment-partners.js
 * Commit:   node scripts/moysklad-match-consignment-partners.js --commit
 */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const { PrismaClient } = require('@prisma/client')

const COMMIT = process.argv.includes('--commit')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) { console.error('No DATABASE_URL'); process.exit(1) }
let prisma
if (databaseUrl.startsWith('prisma+')) {
  prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })
} else {
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')
  prisma = new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString: databaseUrl })), log: ['error'] })
}

async function api(pathStr) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  const res = await fetch(url, {
    headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8' },
  })
  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 2000))
    return api(pathStr)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} GET ${pathStr} — ${(await res.text()).slice(0, 400)}`)
  return res.json()
}

async function fetchAll(entityPath) {
  const rows = []
  let offset = 0
  for (;;) {
    const page = await api(`${entityPath}${entityPath.includes('?') ? '&' : '?'}limit=1000&offset=${offset}`)
    rows.push(...(page.rows || []))
    if (!page.rows || page.rows.length < 1000) break
    offset += 1000
  }
  return rows
}

// Extract every phone-like digit run; keys are the last 9 digits (UAE mobile).
const phoneKeys = (raw) => {
  const s = String(raw || '')
  const runs = s.replace(/[^0-9+]/g, ' ').match(/[0-9][0-9 ]{5,}[0-9]|[0-9]{6,}/g) || []
  const keys = new Set()
  for (const run of runs) {
    const digits = run.replace(/\D/g, '')
    if (digits.length >= 8) keys.add(digits.slice(-9))
  }
  return [...keys]
}
const emailKey = (raw) => String(raw || '').trim().toLowerCase() || null

async function main() {
  console.log(`Mode: ${COMMIT ? 'COMMIT' : 'DRY-RUN'}\n`)

  // 1) MoySklad data
  const [counterparties, contracts] = await Promise.all([
    fetchAll('/entity/counterparty'),
    fetchAll('/entity/contract'),
  ])
  console.log(`MoySklad: ${counterparties.length} counterparties, ${contracts.length} contracts`)

  const activeCommission = contracts.filter(
    (c) => String(c.contractType || '') === 'Commission' && c.archived !== true
  )
  console.log(`Active Commission (consignment) contracts: ${activeCommission.length}`)
  const contractByAgentId = new Map()
  for (const c of activeCommission) {
    const agentId = c.agent?.meta?.href?.split('/').pop()
    if (agentId && !contractByAgentId.has(agentId)) contractByAgentId.set(agentId, c)
  }

  // Index counterparties by phone key and email
  const cpByPhone = new Map() // key -> [cp]
  const cpByEmail = new Map()
  for (const cp of counterparties) {
    for (const k of phoneKeys(cp.phone)) {
      if (!cpByPhone.has(k)) cpByPhone.set(k, [])
      cpByPhone.get(k).push(cp)
    }
    const e = emailKey(cp.email)
    if (e) {
      if (!cpByEmail.has(e)) cpByEmail.set(e, [])
      cpByEmail.get(e).push(cp)
    }
  }

  // 2) Website partner accounts
  const partners = await prisma.user.findMany({
    where: { discountType: { in: ['CLINIC', 'VIP'] } },
    select: {
      id: true, email: true, name: true, phone: true, discountType: true,
      discountPercentage: true, consignmentActive: true, moyskladCounterpartyId: true,
    },
    orderBy: { name: 'asc' },
  })
  console.log(`Website partner accounts (CLINIC/VIP): ${partners.length}\n`)

  const results = { consignment: [], matchedOnly: [], ambiguous: [], unmatched: [] }

  for (const u of partners) {
    const candidates = new Map() // cpId -> { cp, via }
    for (const k of phoneKeys(u.phone)) {
      for (const cp of cpByPhone.get(k) || []) candidates.set(cp.id, { cp, via: `phone …${k.slice(-6)}` })
    }
    const e = emailKey(u.email)
    if (e) for (const cp of cpByEmail.get(e) || []) if (!candidates.has(cp.id)) candidates.set(cp.id, { cp, via: 'email' })

    if (candidates.size === 0) {
      results.unmatched.push(u)
      continue
    }
    if (candidates.size > 1) {
      // Prefer a candidate that has a Commission contract; if exactly one does, take it.
      const withContract = [...candidates.values()].filter((c) => contractByAgentId.has(c.cp.id))
      if (withContract.length !== 1) {
        results.ambiguous.push({ u, candidates: [...candidates.values()] })
        continue
      }
      candidates.clear()
      candidates.set(withContract[0].cp.id, withContract[0])
    }

    const { cp, via } = [...candidates.values()][0]
    const contract = contractByAgentId.get(cp.id) || null
    const row = { u, cp, via, contract }
    if (contract) results.consignment.push(row)
    else results.matchedOnly.push(row)
  }

  const fmtUser = (u) => `${u.name} <${u.email}> ${u.discountType}${u.discountPercentage ? ` −${u.discountPercentage}%` : ''}`

  console.log(`── CONSIGNMENT (active Commission contract) — ${results.consignment.length} ──`)
  for (const r of results.consignment) {
    console.log(`  ✓ ${fmtUser(r.u)}\n      ↔ ${r.cp.name} [${r.via}] · contract "${r.contract.name}"${r.u.consignmentActive ? ' (already active)' : ''}`)
  }
  console.log(`\n── MATCHED, no consignment contract — ${results.matchedOnly.length} ──`)
  for (const r of results.matchedOnly) {
    console.log(`  • ${fmtUser(r.u)}\n      ↔ ${r.cp.name} [${r.via}]`)
  }
  console.log(`\n── AMBIGUOUS (manual review) — ${results.ambiguous.length} ──`)
  for (const r of results.ambiguous) {
    console.log(`  ? ${fmtUser(r.u)}`)
    for (const c of r.candidates) console.log(`      candidate: ${c.cp.name} [${c.via}]${contractByAgentId.has(c.cp.id) ? ' (has Commission contract)' : ''}`)
  }
  console.log(`\n── UNMATCHED website partners — ${results.unmatched.length} ──`)
  for (const u of results.unmatched) console.log(`  ✗ ${fmtUser(u)} phone="${u.phone || '—'}"`)

  // Also report Commission counterparties with no website account (they order via WhatsApp)
  const matchedCpIds = new Set([...results.consignment, ...results.matchedOnly].map((r) => r.cp.id))
  const orphanConsign = activeCommission.filter((c) => {
    const agentId = c.agent?.meta?.href?.split('/').pop()
    return agentId && !matchedCpIds.has(agentId)
  })
  if (orphanConsign.length) {
    console.log(`\n── Consignment contracts with NO website partner account — ${orphanConsign.length} ──`)
    for (const c of orphanConsign) {
      const agentId = c.agent?.meta?.href?.split('/').pop()
      const cp = counterparties.find((x) => x.id === agentId)
      console.log(`  ! ${cp?.name || agentId} · contract "${c.name}"`)
    }
  }

  if (!COMMIT) {
    console.log('\nDry-run only. Re-run with --commit to write.')
    return
  }

  console.log('\nWriting…')
  let written = 0
  for (const r of results.consignment) {
    await prisma.user.update({
      where: { id: r.u.id },
      data: {
        consignmentActive: true,
        moyskladCounterpartyId: r.cp.id,
        moyskladContractId: r.contract.id,
        updatedAt: new Date(),
      },
    })
    written += 1
    console.log(`  ✓ consignmentActive=true → ${r.u.email}`)
  }
  for (const r of results.matchedOnly) {
    await prisma.user.update({
      where: { id: r.u.id },
      data: { moyskladCounterpartyId: r.cp.id, updatedAt: new Date() },
    })
    written += 1
  }
  console.log(`\nDone. ${written} users updated.`)
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1 })
  .finally(() => prisma.$disconnect())
