#!/usr/bin/env node

/**
 * Rise UP — create MoySklad commission (consignment) agreement.
 *
 *   node --import dotenv/config scripts/moysklad-create-rise-up-consignment-contract-20260601.js
 *   node --import dotenv/config scripts/moysklad-create-rise-up-consignment-contract-20260601.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentNow } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'
const AGENT_ID = 'b83e0d80-5d8f-11f1-0a80-065d0075240c' // Rise UP
const CONTRACT_STATE_DEFERRED_ID = 'b5d800c6-80df-11ea-0a80-004a001360f2' // Retail>>deferred payment

const CONTRACT = {
  moment: uaeMomentNow(),
  marker: `Rise UP consignment agreement ${uaeToday()}`,
}

async function api(method, path, body) {
  const res = await fetch(path.startsWith('http') ? path : API + path, {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} - ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

function href(type, id) {
  return {
    meta: {
      href: `${API}/entity/${type}/${id}`,
      type,
      mediaType: 'application/json',
    },
  }
}

function stateHref(stateId) {
  return {
    meta: {
      href: `${API}/entity/contract/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

async function findExistingContract() {
  const filter = `agent=${API}/entity/counterparty/${AGENT_ID}`
  const data = await api('GET', `/entity/contract?filter=${encodeURIComponent(filter)}&limit=10`)
  const commission = (data?.rows || []).filter((row) => {
    return row.contractType === 'Commission' || !row.contractType
  })
  return commission[0] || null
}

async function main() {
  console.log('====================================================================')
  console.log('  Rise UP — commission (consignment) agreement')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`  Customer: ${agent.name} (${agent.id})`)
  console.log(`  Phone   : ${agent.phone || '—'}`)
  const addr = agent.actualAddressFull
  if (addr?.street) console.log(`  Address : ${addr.street}, ${addr.city || 'Dubai'}`)

  const existing = await findExistingContract()
  if (existing) {
    console.log(`\n  Commission agreement already exists: ${existing.name} (${existing.id})`)
    console.log(`  https://online.moysklad.ru/app/#contract/edit?id=${existing.id}`)
    return
  }

  const payload = {
    moment: CONTRACT.moment,
    applicable: true,
    contractType: 'Commission',
    rewardType: 'PercentOfSales',
    rewardPercent: 0,
    agent: href('counterparty', AGENT_ID),
    ownAgent: href('organization', ORG_ID),
    state: stateHref(CONTRACT_STATE_DEFERRED_ID),
    rate: { currency: href('currency', CURRENCY_ID) },
    description: [
      CONTRACT.marker,
      'Commission consignment agreement for Rise UP, Business Bay.',
      'Genosys Middle East FZ-LLC ↔ Rise UP.',
    ].join('\n'),
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — would create Commission contract (auto-number, likely 34).')
    console.log('  Re-run with --commit.')
    return
  }

  const created = await api('POST', '/entity/contract', payload)
  console.log(`\n  Created agreement: ${created.name}`)
  console.log(`  ID               : ${created.id}`)
  console.log(`  Type             : ${created.contractType}`)
  console.log(`  Reward           : ${created.rewardType} @ ${created.rewardPercent}%`)
  console.log(`  UI               : https://online.moysklad.ru/app/#contract/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
