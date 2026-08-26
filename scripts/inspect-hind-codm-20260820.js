#!/usr/bin/env node

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')

async function api(method, pathStr) {
  const res = await fetch(API + pathStr, {
    method,
    headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8' },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${res.status} ${pathStr} ${text.slice(0, 400)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=100&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 100) break
    offset += 100
  }
  return rows
}

async function main() {
  const so = await api('GET', `/entity/customerorder?filter=name=${encodeURIComponent('CODM2608193118')}&expand=state,agent,invoicesOut,demands`)
  const row = (so.rows || [])[0]
  if (!row) throw new Error('SO not found')
  console.log(JSON.stringify({
    id: row.id,
    name: row.name,
    sum: row.sum,
    payedSum: row.payedSum,
    state: row.state?.name,
    agent: row.agent?.name,
    agentId: row.agent?.meta?.href?.split('/').pop(),
    invoices: (row.invoicesOut || []).map((x) => x.meta?.href),
    demands: (row.demands || []).map((x) => x.meta?.href),
  }, null, 2))
  const positions = await fetchAll(`/entity/customerorder/${row.id}/positions?expand=assortment`)
  for (const p of positions) {
    console.log(`  ${p.assortment?.code} x${p.quantity} @ ${p.price} disc=${p.discount} ${p.assortment?.name}`)
  }

  const inv = await api('GET', `/entity/invoiceout?filter=customerOrder=${encodeURIComponent(row.meta.href)}&limit=10`)
  console.log('invoices by SO filter:', (inv.rows || []).map((r) => `${r.name} ${r.id} ${r.sum}`))
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
