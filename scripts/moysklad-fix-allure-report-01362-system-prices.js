#!/usr/bin/env node

/**
 * Fix Allure commission report 01362 — merge MVita cream lines, use MoySklad list prices.
 *
 *   node --import dotenv/config scripts/moysklad-fix-allure-report-01362-system-prices.js
 *   node --import dotenv/config scripts/moysklad-fix-allure-report-01362-system-prices.js --commit
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

const REPORT_ID = 'cf973978-5a5a-11f1-0a80-0fa6000f799f'
const REPORT_NAME = '01362'

/** Target lines after fix: code → qty (price from list at runtime) */
const TARGET_QTY = {
  '00190': 1,
  '00144': 1,
  '00122': 3,
  '00129': 1,
  '54457': 2,
  '00194': 1,
  '00041': 2,
}

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

function money(minor) {
  return (minor / 100).toFixed(2)
}

async function fetchListPrices() {
  const res = await api('GET', '/report/stock/all?stockMode=all&limit=1000')
  const prices = new Map()
  for (const row of res.rows || []) {
    if (row.code) prices.set(row.code, Number(row.salePrice || 0))
  }
  return prices
}

async function main() {
  const rep = await api('GET', `/entity/commissionreportin/${REPORT_ID}`)
  if (rep.name !== REPORT_NAME) throw new Error(`Expected ${REPORT_NAME}, got ${rep.name}`)

  console.log(`Report ${rep.name} | current sum ${money(rep.sum)} AED`)

  const pos = await api(
    'GET',
    `/entity/commissionreportin/${rep.id}/positions?limit=100&expand=assortment`
  )
  const rows = pos.rows || []

  const listPrices = await fetchListPrices()
  let expectedMinor = 0
  console.log('\nTarget (MoySklad list):')
  for (const [code, qty] of Object.entries(TARGET_QTY)) {
    const price = listPrices.get(code)
    if (!price) throw new Error(`No list price for ${code}`)
    expectedMinor += price * qty
    console.log(`  ${code} x${qty} @ ${money(price)} AED`)
  }
  console.log(`Expected total: ${money(expectedMinor)} AED`)

  const byCode = new Map()
  for (const p of rows) {
    const code = p.assortment?.code
    if (!code) throw new Error(`Position without code: ${p.id}`)
    if (!byCode.has(code)) byCode.set(code, [])
    byCode.get(code).push(p)
  }

  if (!COMMIT) {
    console.log('\nDRY RUN. Current positions:')
    for (const p of rows) {
      console.log(`  ${p.assortment.code} qty ${p.quantity} @ ${money(p.price)}`)
    }
    console.log('\nRe-run with --commit.')
    return
  }

  for (const [code, qty] of Object.entries(TARGET_QTY)) {
    const listPrice = listPrices.get(code)
    const positions = byCode.get(code) || []
    if (!positions.length) throw new Error(`Missing position for ${code}`)

    const [keep, ...extra] = positions
    await api('PUT', `/entity/commissionreportin/${rep.id}/positions/${keep.id}`, {
      meta: keep.meta,
      quantity: qty,
      price: listPrice,
      assortment: keep.assortment,
      vat: keep.vat,
      vatEnabled: keep.vatEnabled,
      reward: keep.reward ?? 0,
    })

    for (const dup of extra) {
      await api('DELETE', `/entity/commissionreportin/${rep.id}/positions/${dup.id}`)
    }
  }

  const desc = [
    'Allure consignment sold 06-25 May 2026 calc 2026-05-28',
    'Customer: Allure | Agreement 00045 | Prices: MoySklad list (salePrice).',
    'Sales 06.05: AW cream, cushion #2, MVita cream, peeling, SPF50, MVita serum.',
    '19.05 MVita cream | 21.05 SPF50 | 25.05 SPF40 x2 + MVita cream.',
  ].join('\n')

  await api('PUT', `/entity/commissionreportin/${rep.id}`, {
    meta: rep.meta,
    description: desc,
  })

  const rep2 = await api('GET', `/entity/commissionreportin/${rep.id}`)
  const pos2 = await api('GET', `/entity/commissionreportin/${rep.id}/positions?expand=assortment`)
  console.log(`\nDone. ${rep2.name} | ${money(rep2.sum)} AED | ${pos2.rows?.length} lines`)
  console.log(`UI: https://online.moysklad.ru/app/#commissionreport/edit?id=${rep.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
