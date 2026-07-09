#!/usr/bin/env node

/**
 * CP World LLC — freight invoice V11180 (DM GME 260616 Korea air, AWB 607-54108224).
 * Total: 12,074.05 AED (29-Jun-2026).
 *
 *   node --import dotenv/config scripts/moysklad-create-cp-world-paymentout-20260702.js
 *   node --import dotenv/config scripts/moysklad-create-cp-world-paymentout-20260702.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeMomentNow } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const AGENT_ID = '65bd4e87-4b2c-11ef-0a80-03900021d381' // CP World LLC
const EXPENSE_ITEM_ID = 'c8b72a7e-834a-11ea-0a80-004a00283a9e' // Shipment Cost
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'

const INVOICE_NO = 'V11180'
const INVOICE_DATE = '2026-06-29'
const JOB_NO = 'AIGN-V00239'
const AWB = '607-54108224'
const SHIPMENT = 'DM GME 260616'
const SUM_MINOR = 1207405 // 12,074.05 AED
const MARKER = `CP-WORLD-${INVOICE_NO}`

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
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
    if (res.status === 429 && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
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

async function ensureNoDuplicate() {
  const search = await api('GET', `/entity/paymentout?search=${encodeURIComponent(MARKER)}&limit=5`)
  if (search.rows?.length) {
    throw new Error(`Duplicate: ${search.rows[0].name} (${search.rows[0].id})`)
  }

  const byInv = await api('GET', `/entity/paymentout?search=${encodeURIComponent(INVOICE_NO)}&limit=10`)
  const hit = (byInv.rows || []).find(
    (r) =>
      r.agent?.meta?.href?.includes(AGENT_ID) &&
      r.sum === SUM_MINOR &&
      ((r.description || '') + (r.paymentPurpose || '')).includes(INVOICE_NO)
  )
  if (hit) throw new Error(`Duplicate invoice payment: ${hit.name} (${hit.id})`)
}

async function main() {
  console.log('====================================================================')
  console.log('  CP World LLC — freight invoice V11180 (paymentout)')
  console.log('====================================================================')
  console.log(`  Mode    : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Invoice : ${INVOICE_NO} dated ${INVOICE_DATE}`)
  console.log(`  Job     : ${JOB_NO}`)
  console.log(`  Shipment: ${SHIPMENT} | AWB ${AWB}`)
  console.log(`  Sum     : ${money(SUM_MINOR)} AED`)

  const [agent, expense] = await Promise.all([
    api('GET', `/entity/counterparty/${AGENT_ID}`),
    api('GET', `/entity/expenseitem/${EXPENSE_ITEM_ID}`),
  ])
  console.log(`  Agent   : ${agent.name}`)
  console.log(`  Expense : ${expense.name}`)

  console.log('\n  Breakdown (from invoice):')
  console.log('    Air freight 1,814.17 USD @ 3.685 = 6,685.22 AED')
  console.log('    Ex works 245.00 USD @ 3.685 = 902.83 AED')
  console.log('    Dubai local charges = 1,435.00 AED')
  console.log('    Customs duty = 3,051.00 AED')
  console.log(`    Total = ${money(SUM_MINOR)} AED`)

  if (COMMIT) await ensureNoDuplicate()

  const purpose = [
    `CP World invoice ${INVOICE_NO} (${INVOICE_DATE}) — ${money(SUM_MINOR)} AED`,
    `Job ${JOB_NO} | ${SHIPMENT} Korea air | AWB ${AWB}`,
    'Air 6685.22 + ExWorks 902.83 + Local 1435 + Duty 3051',
    MARKER,
  ].join(' | ')

  const payload = {
    moment: uaeMomentNow(),
    applicable: true,
    organization: href('organization', ORG_ID),
    agent: href('counterparty', AGENT_ID),
    expenseItem: href('expenseitem', EXPENSE_ITEM_ID),
    state: stateHref(STATE_PAID_ID),
    sum: SUM_MINOR,
    paymentPurpose: purpose,
    description: purpose,
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
