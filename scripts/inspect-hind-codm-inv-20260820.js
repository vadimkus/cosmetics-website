#!/usr/bin/env node

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')

const ORDER_ID = '45ceef4f-9c02-11f1-0a80-00600002b283'
const INVOICE_ID = '46274c4f-9c02-11f1-0a80-084e0001f70f'

async function api(method, pathStr) {
  const res = await fetch(API + pathStr, {
    method,
    headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8' },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${res.status} ${pathStr} ${text.slice(0, 500)}`)
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
  const [order, invoice] = await Promise.all([
    api('GET', `/entity/customerorder/${ORDER_ID}?expand=state,agent`),
    api('GET', `/entity/invoiceout/${INVOICE_ID}?expand=demands,agent,state`),
  ])
  console.log(`SO ${order.name} ${order.sum} ${order.state?.name} agent=${order.agent?.name} ${order.agent?.id}`)
  console.log(`INV ${invoice.name} ${invoice.sum} payed=${invoice.payedSum} demands=${(invoice.demands || []).length}`)
  const invPos = await fetchAll(`/entity/invoiceout/${INVOICE_ID}/positions?expand=assortment`)
  for (const p of invPos) {
    console.log(`  INV ${p.assortment?.code} x${p.quantity} @ ${p.price} disc=${p.discount}`)
  }
  for (const d of invoice.demands || []) {
    const id = d.meta.href.split('/').pop()
    const demand = await api('GET', `/entity/demand/${id}?expand=invoicesOut`)
    console.log(`SHIP ${demand.name} ${demand.sum} SO-link=${!!demand.customerOrder}`)
  }
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
