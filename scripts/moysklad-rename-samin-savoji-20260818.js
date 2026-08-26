#!/usr/bin/env node

/**
 * Rename counterparty "samin savoji" → "Samin Savoji" (title case).
 * Order GENCardW2608173711 uses this agent.
 *
 *   node --import dotenv/config scripts/moysklad-rename-samin-savoji-20260818.js
 *   node --import dotenv/config scripts/moysklad-rename-samin-savoji-20260818.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')
const NEW_NAME = 'Samin Savoji'

async function api(method, pathStr, body) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 800)}`)
  return text ? JSON.parse(text) : null
}

async function main() {
  console.log('====================================================================')
  console.log('  Rename samin savoji → Samin Savoji')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const search = await api('GET', `/entity/counterparty?search=${encodeURIComponent('samin savoji')}&limit=20`)
  const rows = search.rows || []
  if (!rows.length) throw new Error('No counterparty found for samin savoji')

  for (const r of rows) {
    console.log(`  Found: "${r.name}" ${r.id} phone=${r.phone || '—'}`)
  }

  const hit =
    rows.find((r) => r.name.trim().toLowerCase() === 'samin savoji') ||
    rows.find((r) => r.name.toLowerCase().includes('savoji'))
  if (!hit) throw new Error('Could not pick the Savoji card')

  if (hit.name === NEW_NAME) {
    console.log(`  Already "${NEW_NAME}"`)
    return
  }

  if (!COMMIT) {
    console.log(`  Would rename "${hit.name}" → "${NEW_NAME}"`)
    return
  }

  const updated = await api('PUT', `/entity/counterparty/${hit.id}`, {
    meta: hit.meta,
    name: NEW_NAME,
  })
  console.log(`  Renamed → "${updated.name}"`)
  console.log(`  https://online.moysklad.ru/app/#company/edit?id=${updated.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
