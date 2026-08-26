#!/usr/bin/env node
const API = 'https://api.moysklad.ru/api/remap/1.2'
const AUTH = 'Basic ' + Buffer.from(`${process.env.MOYSKLAD_LOGIN}:${process.env.MOYSKLAD_PASSWORD}`).toString('base64')
const AGENT_ID = 'aac56118-2945-11ef-0a80-07b40031e6d1'
const CONTRACT_ID = '83eaec1b-2946-11ef-0a80-08f00030f7f3'
const WANT = ['00059', '00052', '00051', '00055', '00035', '00036', '00031', '00032', '00143', '00144']

async function api(pathStr) {
  const res = await fetch(API + pathStr, { headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8' } })
  const text = await res.text()
  if (!res.ok) throw new Error(`${res.status} ${pathStr} ${text.slice(0, 400)}`)
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

async function add(ledger, type, id, sign) {
  const pos = await fetchAll(`/entity/${type}/${id}/positions?expand=assortment`)
  for (const p of pos) {
    const code = p.assortment?.code
    if (!code) continue
    const cur = ledger.get(code) || { name: p.assortment.name, qty: 0 }
    cur.qty += Number(p.quantity) * sign
    cur.name = p.assortment.name
    ledger.set(code, cur)
  }
}

async function main() {
  const [agent, contract] = await Promise.all([
    api(`/entity/counterparty/${AGENT_ID}`),
    api(`/entity/contract/${CONTRACT_ID}`),
  ])
  console.log(`${agent.name} | agr ${contract.name}`)
  const agentHref = encodeURIComponent(`${API}/entity/counterparty/${AGENT_ID}`)
  const demands = (await fetchAll(`/entity/demand?filter=agent=${agentHref}`)).filter((d) =>
    d.contract?.meta?.href?.includes(CONTRACT_ID),
  )
  const reports = (await fetchAll(`/entity/commissionreportin?filter=agent=${agentHref}`)).filter((r) =>
    r.contract?.meta?.href?.includes(CONTRACT_ID),
  )
  const returns = (await fetchAll(`/entity/salesreturn?filter=agent=${agentHref}`)).filter((r) =>
    r.contract?.meta?.href?.includes(CONTRACT_ID),
  )
  console.log(`demands ${demands.length} reports ${reports.length} returns ${returns.length}`)
  const ledger = new Map()
  for (const d of demands) await add(ledger, 'demand', d.id, 1)
  for (const r of reports) await add(ledger, 'commissionreportin', r.id, -1)
  for (const r of returns) await add(ledger, 'salesreturn', r.id, -1)
  console.log('\nWanted SKUs:')
  for (const code of WANT) {
    const row = ledger.get(code)
    console.log(`  ${code} ${row ? `${row.qty}  ${row.name}` : 'NOT ON BOOKS'}`)
  }
  console.log('\nAll remainder > 0:')
  for (const [code, row] of [...ledger.entries()].filter(([, r]) => r.qty > 0).sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${code} ${row.qty}  ${row.name}`)
  }
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
