#!/usr/bin/env node

/**
 * List active consignment customers with zero book stock.
 *   node --import dotenv/config scripts/moysklad-list-zero-consignment-stock-customers.js
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const SINCE = '2020-01-01 00:00:00'
const GAP_MS = 120

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function api(pathStr, retries = 6) {
  for (let i = 0; i <= retries; i++) {
    await sleep(GAP_MS)
    const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
        'Accept-Encoding': 'gzip',
      },
    })
    const text = await res.text()
    if ((res.status === 503 || res.status === 429) && i < retries) {
      await sleep(800 * (i + 1))
      continue
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${text.slice(0, 150)}`)
    return text ? JSON.parse(text) : null
  }
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api(`${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

async function sumPositions(docHref) {
  let total = 0
  let offset = 0
  while (true) {
    const data = await api(`${docHref}/positions?limit=1000&offset=${offset}`)
    for (const p of data.rows || []) total += Number(p.quantity || 0)
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return total
}

function idFromHref(href) {
  return href?.split('/').pop()?.split('?')[0] || null
}

async function agentNetQty(agentId, commIds) {
  const agentHref = `${API}/entity/counterparty/${agentId}`
  let net = 0

  for (const [entity, sign] of [
    ['demand', 1],
    ['commissionreportin', -1],
    ['salesreturn', -1],
  ]) {
    const filter = [`agent=${agentHref}`, `moment>=${SINCE}`].join(';')
    const docs = await fetchAll(`/entity/${entity}?filter=${encodeURIComponent(filter)}`)
    for (const doc of docs) {
      const contractId = idFromHref(doc.contract?.meta?.href)
      if (!contractId || !commIds.has(contractId)) continue
      net += sign * (await sumPositions(doc.meta.href))
    }
  }
  return net
}

async function main() {
  const contracts = (await fetchAll('/entity/contract')).filter(
    (c) =>
      (c.contractType === 'Commission' || (!c.contractType && c.rewardType)) &&
      c.applicable !== false
  )
  const commIds = new Set(contracts.map((c) => c.id))
  const agentIds = [...new Set(contracts.map((c) => idFromHref(c.agent?.meta?.href)).filter(Boolean))]

  const results = []
  for (let i = 0; i < agentIds.length; i++) {
    const agentId = agentIds[i]
    const cp = await api(`/entity/counterparty/${agentId}`)
    process.stderr.write(`[${i + 1}/${agentIds.length}] ${cp.name}\n`)
    const qty = await agentNetQty(agentId, commIds)
    results.push({ name: cp.name, qty })
  }

  results.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
  const zero = results.filter((r) => r.qty <= 0).map((r) => r.name)

  console.log(
    JSON.stringify(
      {
        asOf: new Date().toISOString(),
        method: 'demands − commission reports − returns (commission contracts since 2020)',
        totalCustomers: results.length,
        withStock: results.length - zero.length,
        zeroStock: zero.length,
        zero,
      },
      null,
      2
    )
  )
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
