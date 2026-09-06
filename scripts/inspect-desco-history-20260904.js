#!/usr/bin/env node
const API = 'https://api.moysklad.ru/api/remap/1.2'
const AUTH = 'Basic ' + Buffer.from(`${process.env.MOYSKLAD_LOGIN}:${process.env.MOYSKLAD_PASSWORD}`).toString('base64')
const AGENT = 'dcc60826-fd26-11f0-0a80-0dd500123b1c'

async function api(pathStr) {
  const res = await fetch(API + pathStr, {
    headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8' },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${res.status} ${pathStr} ${text.slice(0, 400)}`)
  return JSON.parse(text)
}

;(async () => {
  const agent = await api(`/entity/counterparty/${AGENT}`)
  console.log('AGENT', agent.name, agent.phone, agent.legalAddress, agent.inn, agent.description)

  const filter = `agent=${API}/entity/counterparty/${AGENT}`
  const outs = await api(`/entity/paymentout?filter=${encodeURIComponent(filter)}&limit=50&order=moment,desc`)
  for (const r of outs.rows || []) {
    const expId = r.expenseItem?.meta?.href?.split('/').pop()
    const exp = expId ? await api(`/entity/expenseitem/${expId}`) : { name: '—' }
    console.log(
      r.name,
      r.moment,
      (r.sum / 100).toFixed(2),
      exp.name,
      (r.description || '').slice(0, 160),
    )
  }
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
