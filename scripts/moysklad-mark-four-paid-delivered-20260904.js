#!/usr/bin/env node

/**
 * 4 Sep — mark four paid SOs Доставлен in MoySklad only (website unchanged).
 *
 *   Alesya Sokolenko     GENCardM2609040629 — 575.00
 *   Valentina Strakhova  GENCardW2609043069 — 635.00
 *   Mansur F.            GENCardW2609032967 — 1,115.30
 *   GÜLDEN GÜNGÖR        GENCardW2609021398 — 1,181.50
 *
 *   node --import dotenv/config scripts/moysklad-mark-four-paid-delivered-20260904.js
 *   node --import dotenv/config scripts/moysklad-mark-four-paid-delivered-20260904.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const PAID_AWAITING_ID = '909556cd-8f70-11ea-0a80-016b00219616'
const DELIVERED_STATE_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'

const ORDERS = [
  {
    name: 'GENCardM2609040629',
    customer: 'Alesya Sokolenko',
    id: '99f4582c-a82d-11f1-0a80-182d005516ad',
    expectedMinor: 57500,
  },
  {
    name: 'GENCardW2609043069',
    customer: 'Valentina Strakhova',
    id: '2f0fd41c-a829-11f1-0a80-15f20053206c',
    expectedMinor: 63500,
  },
  {
    name: 'GENCardW2609032967',
    customer: 'Mansur F.',
    id: 'cb20e7d3-a76e-11f1-0a80-19ad00214105',
    expectedMinor: 111530,
  },
  {
    name: 'GENCardW2609021398',
    customer: 'GÜLDEN GÜNGÖR',
    id: '723d1d65-a707-11f1-0a80-058300034065',
    expectedMinor: 118150,
  },
]

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function stateId(order) {
  return order.state?.meta?.href?.split('/').pop() || ''
}

async function main() {
  console.log('====================================================================')
  console.log('  Mark 4 paid SOs Доставлен — MoySklad only')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  for (const cfg of ORDERS) {
    const order = await api('GET', `/entity/customerorder/${cfg.id}?expand=state,agent`)
    if (order.name !== cfg.name) throw new Error(`${cfg.customer}: expected ${cfg.name}, got ${order.name}`)
    if (order.agent?.name !== cfg.customer) throw new Error(`${cfg.name}: unexpected agent ${order.agent?.name}`)
    if (order.sum !== cfg.expectedMinor) {
      throw new Error(`${cfg.name}: expected ${money(cfg.expectedMinor)}, got ${money(order.sum)}`)
    }
    if ((order.payedSum || 0) !== order.sum) throw new Error(`${cfg.name}: not fully paid`)
    if ((order.shippedSum || 0) !== order.sum) throw new Error(`${cfg.name}: not fully shipped`)
    const sid = stateId(order)
    if (sid !== PAID_AWAITING_ID && sid !== DELIVERED_STATE_ID) {
      throw new Error(`${cfg.name}: unexpected state ${order.state?.name}`)
    }
    console.log(`  ${cfg.name} | ${cfg.customer} | ${money(order.sum)} | ${order.state?.name}`)

    if (!COMMIT) continue
    if (sid === DELIVERED_STATE_ID) {
      console.log('    already Доставлен')
      continue
    }
    await api('PUT', `/entity/customerorder/${cfg.id}`, {
      meta: order.meta,
      state: {
        meta: {
          href: `${API}/entity/customerorder/metadata/states/${DELIVERED_STATE_ID}`,
          type: 'state',
          mediaType: 'application/json',
        },
      },
    })
    const after = await api('GET', `/entity/customerorder/${cfg.id}?expand=state`)
    console.log(`    → ${after.state?.name}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
