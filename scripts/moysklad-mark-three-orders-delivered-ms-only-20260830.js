#!/usr/bin/env node

/**
 * Mark three paid website orders Доставлен in MoySklad only.
 * Does not touch genosys.ae / loyalty.
 *
 *   node --import dotenv/config scripts/moysklad-mark-three-orders-delivered-ms-only-20260830.js
 *   node --import dotenv/config scripts/moysklad-mark-three-orders-delivered-ms-only-20260830.js --commit
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
    name: 'GENCardM2608290879',
    customer: 'Nacim Nik',
    id: '93c33043-a3e7-11f1-0a80-1372007ae985',
    expectedMinor: 69500,
  },
  {
    name: 'GENCardM2608293394',
    customer: 'Denise McQuinn',
    id: 'dbf856b7-a3d6-11f1-0a80-1fbd00789d0f',
    expectedMinor: 58500,
  },
  {
    name: 'GENCardW2608291200',
    customer: 'Svetlana Moldasheva',
    id: '8e48b82d-a3d3-11f1-0a80-13720076d421',
    expectedMinor: 73000,
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
  console.log('  Mark 3 orders Доставлен — MoySklad only')
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

  if (!COMMIT) console.log('\n  DRY RUN — re-run with --commit')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
