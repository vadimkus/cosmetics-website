#!/usr/bin/env node

/**
 * Read-only probe: understand how consignment returns vs отгрузки post to
 * MoySklad взаиморасчёты, so we can choose the right lever to clear «мы должны».
 *
 * Checks:
 *   1. Marina returns 00002 / 00006 (the residual 882 cash flag) — contract, demand link, paid state
 *   2. A sample of Marina's other returns (with contract 00024) for comparison
 *   3. Marina отгрузки — do they carry sum/payedSum that posts as debt?
 *   4. Native counterparty settlement balance from MoySklad report endpoint (if available)
 *
 *   node --import dotenv/config scripts/moysklad-investigate-consignment-settlement-20260626.js
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const GAP_MS = 90
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const AGENT_ID = 'af21a79a-63cd-11ea-0a80-02b2000e2aeb'

const SAMPLE_RETURNS = [
  { name: '00002', id: '2956a655-893a-11ea-0a80-036200053c11' },
  { name: '00006', id: '65a9e444-6333-11ec-0a80-00c4002cedf1' },
  { name: '00007', id: '986fa2c9-7234-11ec-0a80-00c4011b72b3' },
  { name: '00194', id: '32ee02cc-f5df-11ef-0a80-0e1e00247248' },
]

async function api(method, pathStr, body, retries = 5) {
  for (let i = 0; i <= retries; i++) {
    await sleep(GAP_MS)
    let res
    try {
      res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
        method,
        headers: {
          Authorization: AUTH,
          Accept: 'application/json;charset=utf-8',
          'Accept-Encoding': 'gzip',
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      })
    } catch (err) {
      if (i < retries) {
        await sleep(800 * (i + 1))
        continue
      }
      throw err
    }
    const text = await res.text()
    if ((res.status === 429 || res.status === 503) && i < retries) {
      await sleep(600 * (i + 1))
      continue
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 600)}`)
    return text ? JSON.parse(text) : null
  }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function tail(href) {
  return href ? href.split('/').pop().split('?')[0] : null
}

async function main() {
  console.log('=== Consignment settlement probe — First Person Marina ===\n')

  // Contracts on this counterparty
  const agentFilter = encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)
  const contracts = await api('GET', `/entity/contract?filter=agent=${agentFilter}`)
  console.log('Contracts:')
  for (const c of contracts.rows || []) {
    console.log(`  ${c.name}  type=${c.contractType}  id=${c.id}`)
  }
  console.log('')

  // Sample returns
  console.log('Sample returns (contract / demand link / paid state):')
  for (const s of SAMPLE_RETURNS) {
    const d = await api('GET', `/entity/salesreturn/${s.id}?expand=contract,demand`)
    const contractName = d.contract?.name || '—'
    const demandName = d.demand?.name || '—'
    console.log(
      `  ${d.name}  ${(d.moment || '').slice(0, 10)}  sum=${money(d.sum)} paid=${money(d.payedSum)}  ` +
        `applicable=${d.applicable}  contract=${contractName}  demand=${demandName}`
    )
  }
  console.log('')

  // Demands (отгрузки) — do they post debt?
  const demands = await api(
    'GET',
    `/entity/demand?filter=agent=${agentFilter};applicable=true&limit=5&order=moment,desc&expand=contract`
  )
  console.log('Recent отгрузки (sum / payedSum / contract):')
  for (const d of demands.rows || []) {
    console.log(
      `  ${d.name}  ${(d.moment || '').slice(0, 10)}  sum=${money(d.sum)} paid=${money(d.payedSum)}  contract=${d.contract?.name || '—'}`
    )
  }
  console.log('')

  // Native settlement balance via report endpoint
  try {
    const rep = await api('GET', `/report/counterparty/${AGENT_ID}`)
    console.log('MoySklad report/counterparty:')
    console.log(`  balance      = ${money(rep.balance)} AED  (>0 they owe us, <0 we owe them — MoySklad sign)`)
    console.log(`  profit       = ${money(rep.profit)}`)
    console.log(`  salesAmount  = ${money(rep.salesAmount)}`)
  } catch (e) {
    console.log(`report/counterparty unavailable: ${e.message}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
