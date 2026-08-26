#!/usr/bin/env node
/** Read-only TONETRENDZ agreement-36 book vs Square Aug SKUs. */
const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const AGENT = '74aa75cb-63db-11f1-0a80-111d001bbe72'
const CONTRACT = '7a5e3023-63dc-11f1-0a80-1ba4001ce87b'
const NEED = {
  '00144': 2,
  '00195': 1,
  '00021': 1,
  '00194': 1,
  '00143': 1,
  '00122': 1,
  '00012': 1,
}

async function api(pathStr, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  const res = await fetch(url, {
    headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8', 'Accept-Encoding': 'gzip' },
  })
  const text = await res.text()
  if ((res.status === 429 || res.status >= 500) && attempt < 8) {
    await new Promise((r) => setTimeout(r, 700 * attempt))
    return api(pathStr, attempt + 1)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr} ${text.slice(0, 400)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api(`${pathStr}${sep}limit=100&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 100) break
    offset += 100
  }
  return rows
}

function cid(doc) {
  return (doc.contract?.meta?.href || '').split('/').pop()?.split('?')[0] || ''
}

async function add(ledger, type, id, sign) {
  const pos = await fetchAll(`/entity/${type}/${id}/positions?expand=assortment`)
  for (const p of pos) {
    const code = p.assortment?.code
    if (!code) continue
    const cur = ledger.get(code) || { name: p.assortment.name, qty: 0, inn: 0, sold: 0 }
    cur.qty += Number(p.quantity) * sign
    if (sign > 0) cur.inn += Number(p.quantity)
    if (type === 'commissionreportin') cur.sold += Number(p.quantity)
    cur.name = p.assortment.name
    ledger.set(code, cur)
  }
}

async function main() {
  const filter = encodeURIComponent(`agent=${API}/entity/counterparty/${AGENT}`)
  const [agent, contract, demands, reports, returns] = await Promise.all([
    api(`/entity/counterparty/${AGENT}`),
    api(`/entity/contract/${CONTRACT}`),
    fetchAll(`/entity/demand?filter=${filter}&expand=contract`),
    fetchAll(`/entity/commissionreportin?filter=${filter}&expand=contract,state`),
    fetchAll(`/entity/salesreturn?filter=${filter}&expand=contract`),
  ])
  console.log(`${agent.name} | agr ${contract.name}`)
  const onC = (d) => cid(d) === CONTRACT
  console.log(
    `demands on=${demands.filter(onC).length}  reports on=${reports.filter(onC).length}  returns on=${returns.filter(onC).length}`,
  )
  console.log('\nREPORTS:')
  for (const r of reports.sort((a, b) => a.moment.localeCompare(b.moment))) {
    console.log(
      `  ${r.name} ${r.moment.slice(0, 10)} ${(r.sum / 100).toFixed(2)} paid ${((r.payedSum || 0) / 100).toFixed(2)} ${onC(r) ? 'ON' : 'OFF'} ${r.state?.name || ''}`,
    )
  }

  const ledger = new Map()
  for (const d of demands.filter(onC)) await add(ledger, 'demand', d.id, 1)
  for (const r of reports.filter(onC)) await add(ledger, 'commissionreportin', r.id, -1)
  for (const r of returns.filter(onC)) await add(ledger, 'salesreturn', r.id, -1)

  console.log('\nNEEDED vs BOOK:')
  for (const [code, qty] of Object.entries(NEED)) {
    const row = ledger.get(code)
    const book = row?.qty || 0
    const ok = book >= qty ? 'OK' : 'SHORT'
    console.log(`  ${ok} ${code} need ${qty} book ${book}  ${row?.name || '?'}`)
  }

  console.log('\nFULL BOOK >0:')
  for (const [code, row] of [...ledger.entries()].filter(([, r]) => r.qty > 0).sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${code}  ${row.qty}  ${row.name}`)
  }
  const neg = [...ledger.entries()].filter(([, r]) => r.qty < 0)
  if (neg.length) {
    console.log('NEGATIVE:')
    for (const [code, row] of neg) console.log(`  ${code}  ${row.qty}  ${row.name}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
