#!/usr/bin/env node
const API = 'https://api.moysklad.ru/api/remap/1.2'
const AUTH = 'Basic ' + Buffer.from(`${process.env.MOYSKLAD_LOGIN}:${process.env.MOYSKLAD_PASSWORD}`).toString('base64')

async function api(pathStr) {
  const res = await fetch(API + pathStr, {
    headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8' },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${res.status} ${pathStr} ${text.slice(0, 400)}`)
  return JSON.parse(text)
}

function digits(v) {
  return String(v || '').replace(/\D/g, '')
}

;(async () => {
  const inv = await api('/entity/invoiceout?filter=name=04525&limit=5')
  for (const row of inv.rows || []) {
    const agent = await api('/entity/counterparty/' + row.agent.meta.href.split('/').pop())
    console.log('INV 04525', row.id, money(row.sum), row.moment)
    console.log('  agent', agent.id, agent.name, agent.phone, agent.companyType)
    console.log('  ship', JSON.stringify(row.shipmentAddressFull || row.shipmentAddress))
  }

  const queries = ['Tatsiuk', 'Tatsyuk', 'Katerina Tatsiuk', '0504511721', '504511721', '050 451 17 21']
  for (const q of queries) {
    const d = await api(`/entity/counterparty?search=${encodeURIComponent(q)}&limit=20`)
    for (const r of d.rows || []) {
      console.log('HIT', q, r.id, r.name, r.phone, r.companyType)
    }
  }

  const byPhone = await api('/entity/counterparty?limit=100&search=4511721')
  for (const r of byPhone.rows || []) {
    const p = digits(r.phone)
    if (p.endsWith('504511721') || p.endsWith('4511721')) {
      console.log('PHONE', r.id, r.name, r.phone)
    }
  }
})().catch((e) => {
  console.error(e)
  process.exit(1)
})

function money(n) {
  return ((n || 0) / 100).toFixed(2)
}
