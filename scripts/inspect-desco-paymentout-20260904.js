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

;(async () => {
  const queries = ['DESCO', 'Desco', 'Copy Centre', 'descoonline']
  for (const q of queries) {
    const d = await api(`/entity/counterparty?search=${encodeURIComponent(q)}&limit=25`)
    for (const r of d.rows || []) {
      console.log('AGENT', q, r.id, r.name, r.companyType, r.inn || r.legalTitle || '')
    }
  }

  const expenses = await fetchAll('/entity/expenseitem')
  console.log('\nEXPENSE ITEMS', expenses.length)
  for (const e of expenses) {
    console.log(`  ${e.id}  ${e.name}`)
  }
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
