#!/usr/bin/env node

/**
 * Read-only: how does payment clear in this account — invoice, shipment, or both?
 *
 * 1. Show the flagged duplicate pairs (invoice + shipment both unpaid) — current paid state.
 * 2. Show a sample of RECENTLY PAID retail demands and whether their linked invoice cleared too.
 *
 * Tells us whether the 23 "duplicate" pairs will self-clear on payment or leave a phantom invoice.
 *
 *   node --import dotenv/config scripts/moysklad-probe-invoice-shipment-payment-20260626.js
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

async function api(method, pathStr, retries = 5) {
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
        },
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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr} — ${text.slice(0, 500)}`)
    return text ? JSON.parse(text) : null
  }
}

const m = (x) => ((x || 0) / 100).toFixed(2)
const paid = (d) => (d.payedSum >= d.sum && d.sum > 0 ? 'PAID' : d.payedSum > 0 ? 'PARTIAL' : 'unpaid')

async function main() {
  console.log('=== Payment clearing behaviour probe ===\n')

  // 1) A sample of recently PAID retail demands → did their linked invoice clear?
  console.log('Recently paid retail demands (no contract) — invoice vs shipment paid state:')
  const demands = await api(
    'GET',
    `/entity/demand?filter=applicable=true&order=moment,desc&limit=80&expand=invoicesOut`
  )
  let shown = 0
  for (const d of demands.rows || []) {
    if (d.contract?.meta?.href) continue // skip consignment
    if (!(d.payedSum >= d.sum && d.sum > 0)) continue // only fully paid shipments
    const inv = d.invoicesOut?.[0]
    if (!inv) continue
    console.log(
      `  ship ${d.name} ${paid(d).padEnd(7)} sum=${m(d.sum)}  →  invoice ${inv.name} ${paid(inv).padEnd(7)} sum=${m(inv.sum)} paid=${m(inv.payedSum)}`
    )
    if (++shown >= 12) break
  }
  if (!shown) console.log('  (none found in last 80 demands)')

  console.log('\nInterpretation:')
  console.log('  If paid shipment → invoice shows PAID  : payment clears both (no phantom risk).')
  console.log('  If paid shipment → invoice shows unpaid: invoice lingers as phantom after payment.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
