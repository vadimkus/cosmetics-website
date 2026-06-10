#!/usr/bin/env node

/**
 * Link commission agreement on 7 consignment-like отгрузки
 * (no payment, no invoice — true consignment replenishment).
 *
 *   node --import dotenv/config scripts/moysklad-fix-consignment-demands-link-contract-20260606.js
 *   node --import dotenv/config scripts/moysklad-fix-consignment-demands-link-contract-20260606.js --commit
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
const FIX_MARKER = `CONSIGNMENT-LINK-CONTRACT-${uaeToday()}`

/** demand name → demand id (from payment re-classification audit) */
const DEMAND_IDS = [
  '70e716bc-2677-11f0-0a80-109b001d103d', // 04553 Palm Jumeirah
  '1fc61824-76a8-11f0-0a80-0cd30030c0fc', // 04858 Serene
  '9cc62188-4f8b-11f1-0a80-105d000f3682', // 06152 ARFI
  '3802efe8-f95c-11ee-0a80-09f8001b6c91', // 03247 X Consulting
  'a17907cc-d025-11f0-0a80-070b00095d44', // 05320 Persona Marina
  'eae8d963-e2e9-11ee-0a80-01bc00143327', // 03159 Tatiana
  '6f150580-6009-11f1-0a80-0cbf000d8ecb', // 06287 Eclatant
]

async function api(method, pathStr, body) {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function isCommissionContract(c) {
  const t = c.contractType || c.type
  return t === 'Commission' || String(t).toLowerCase() === 'commission'
}

async function findCommissionContractId(agentId) {
  const agentHref = `${API}/entity/counterparty/${agentId}`
  const data = await api('GET', `/entity/contract?filter=${encodeURIComponent(`agent=${agentHref}`)}&limit=100`)
  const comm = (data.rows || []).filter(isCommissionContract)
  if (comm.length === 1) return comm[0]
  if (comm.length > 1) {
    comm.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ru'))
    return comm[0]
  }
  const rows = data.rows || []
  if (rows.length === 1) return rows[0]
  throw new Error(`No commission contract for agent ${agentId}`)
}

function isConsignmentLike(demand) {
  const payed = demand.payedSum || 0
  const sum = demand.sum || 0
  const hasInv = (demand.invoicesOut || []).length > 0
  const hasPay = payed > 0
  const fullyPaid = sum > 0 && payed >= sum - 1
  return !hasInv && !hasPay && !fullyPaid
}

async function main() {
  console.log('====================================================================')
  console.log('  Link commission agreement — 7 consignment отгрузки')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const results = []

  for (const demandId of DEMAND_IDS) {
    const demand = await api(
      'GET',
      `/entity/demand/${demandId}?expand=agent,invoicesOut,contract`
    )
    const agentName = demand.agent?.name || demand.agent?.meta?.href
    const existing = demand.contract?.meta?.href?.split('/').pop()

    if (existing) {
      console.log(`  SKIP ${demand.name} — already has contract ${demand.contract.name}`)
      results.push({ demand: demand.name, status: 'skip_has_contract', contract: demand.contract.name })
      continue
    }

    if (!isConsignmentLike(demand)) {
      console.log(`  SKIP ${demand.name} — not consignment-like (paid or invoiced)`)
      results.push({ demand: demand.name, status: 'skip_not_consignment' })
      continue
    }

    const agentId = demand.agent?.meta?.href?.split('/').pop()?.split('?')[0]
    const contract = await findCommissionContractId(agentId)

    console.log(
      `  ${demand.moment?.slice(0, 10)}  ${demand.name}  ${money(demand.sum)} AED  ${agentName}`
    )
    console.log(`    → contract ${contract.name} (${contract.id})`)

    if (COMMIT) {
      const updated = await api('PUT', `/entity/demand/${demandId}`, {
        meta: demand.meta,
        contract: href('contract', contract.id),
        description: [demand.description || '', FIX_MARKER, `Linked contract ${contract.name}`]
          .filter(Boolean)
          .join('\n'),
      })
      const verify = updated.contract?.name || updated.contract?.meta?.href?.split('/').pop()
      console.log(`    ✓ linked: ${verify}`)
      results.push({ demand: demand.name, status: 'linked', contract: contract.name, id: demandId })
    } else {
      results.push({ demand: demand.name, status: 'would_link', contract: contract.name, id: demandId })
    }
    console.log(`    https://online.moysklad.ru/app/#demand/edit?id=${demandId}\n`)
  }

  const linked = results.filter((r) => r.status === 'linked' || r.status === 'would_link')
  console.log('====================================================================')
  console.log(`  ${COMMIT ? 'Linked' : 'Would link'}: ${linked.length} / ${DEMAND_IDS.length}`)
  if (!COMMIT) console.log('\n  Re-run with --commit to apply.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
