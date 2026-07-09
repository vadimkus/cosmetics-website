#!/usr/bin/env node

/**
 * Wellness at Samadhi - Yoga — 139 AED (Wio card, paid today).
 * Expense: Sundry operating expenses.
 *
 *   node --import dotenv/config scripts/moysklad-create-samadhi-yoga-paymentout-20260626.js
 *   node --import dotenv/config scripts/moysklad-create-samadhi-yoga-paymentout-20260626.js --commit
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
const EXPENSE_ITEM_ID = 'a55fd2c4-681d-11f1-0a80-082c008aa9d9' // Sundry operating expenses
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const AGENT_NAME = 'Wellness at Samadhi - Yoga'
const SUM_MINOR = 13900 // 139.00 AED
const DESCRIPTION = 'Wellness at Samadhi - Yoga session / membership'
const MARKER = `SAMADHI-YOGA-139-${uaeToday()}`

async function api(method, pathStr, body) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
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
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 900 * (attempt + 1)))
        continue
      }
      if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
      return text ? JSON.parse(text) : null
    } catch (e) {
      if (attempt === 5) throw e
      await new Promise((r) => setTimeout(r, 900 * (attempt + 1)))
    }
  }
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function stateHref(stateId) {
  return {
    meta: {
      href: `${API}/entity/paymentout/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function ensureCounterparty() {
  const byName = await api(
    'GET',
    `/entity/counterparty?filter=${encodeURIComponent(`name=${AGENT_NAME}`)}&limit=5`
  )
  const exact = (byName?.rows || []).find((r) => r.name === AGENT_NAME)
  if (exact) {
    console.log(`  Agent (existing): ${exact.name} (${exact.id})`)
    return exact
  }
  if (!COMMIT) {
    console.log(`  DRY RUN: would create counterparty "${AGENT_NAME}"`)
    return { id: 'DRY-RUN' }
  }
  const created = await api('POST', '/entity/counterparty', {
    name: AGENT_NAME,
    companyType: 'legal',
    description: 'Yoga / wellness vendor — Samadhi',
  })
  console.log(`  Agent (created): ${created.name} (${created.id})`)
  return created
}

async function ensureNoDuplicate() {
  const search = await api('GET', `/entity/paymentout?search=${encodeURIComponent(MARKER)}&limit=5`)
  if (search.rows?.length) {
    throw new Error(`Duplicate: ${search.rows[0].name} (${search.rows[0].id})`)
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Wellness at Samadhi - Yoga — paymentout 139 AED')
  console.log('====================================================================')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Date : ${uaeToday()} (${uaeMomentNow()})`)
  console.log(`  Sum  : ${money(SUM_MINOR)} AED`)

  const expense = await api('GET', `/entity/expenseitem/${EXPENSE_ITEM_ID}`)
  console.log(`  Expense: ${expense.name}`)

  const agent = await ensureCounterparty()

  if (COMMIT) await ensureNoDuplicate()

  const payload = {
    moment: uaeMomentNow(),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', agent.id),
    expenseItem: href('expenseitem', EXPENSE_ITEM_ID),
    state: stateHref(STATE_PAID_ID),
    sum: SUM_MINOR,
    paymentPurpose: `${DESCRIPTION} — ${money(SUM_MINOR)} AED [${MARKER}]`,
    description: `${DESCRIPTION}\n${MARKER}`,
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/paymentout', payload)
  console.log(`\n  Created: ${created.name} | ${money(created.sum)} AED | ${created.moment}`)
  console.log(`  https://online.moysklad.ru/app/#paymentout/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
