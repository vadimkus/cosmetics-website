#!/usr/bin/env node

/**
 * Fix MoySklad address duplication: street + addInfo with the same text
 * (UI concatenates both → address prints twice).
 *
 * Clears addInfo when it duplicates street; refreshes actual/legal address strings.
 * Also fixes open customerorder shipmentAddressFull with the same pattern.
 *
 *   node --import dotenv/config scripts/moysklad-fix-address-street-addinfo-duplicates-20260731.js
 *   node --import dotenv/config scripts/moysklad-fix-address-street-addinfo-duplicates-20260731.js --commit
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

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
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
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function norm(s) {
  return String(s || '')
    .trim()
    .replace(/\s+/g, ' ')
}

/** True when street and addInfo would print the same location twice. */
function needsFix(full) {
  if (!full) return false
  const street = norm(full.street)
  const addInfo = norm(full.addInfo)
  if (!street || !addInfo) return false
  if (street === addInfo) return true
  if (street.includes(addInfo) || addInfo.includes(street)) return true
  return false
}

/**
 * Prefer the longer/more complete line as street; clear addInfo.
 * Keep country/city/other fields.
 */
function cleanedAddressFull(full) {
  const street = norm(full.street)
  const addInfo = norm(full.addInfo)
  let keep = street
  if (addInfo && addInfo.length > street.length) keep = addInfo
  if (street && addInfo && street !== addInfo) {
    // if one fully contains the other, keep the longer
    if (street.includes(addInfo)) keep = street
    else if (addInfo.includes(street)) keep = addInfo
  }
  const out = {
    ...full,
    street: keep,
    addInfo: '',
  }
  // drop empty comment noise
  if (out.comment === undefined || out.comment === null) delete out.comment
  return out
}

function composedFromFull(full) {
  const city = norm(full.city)
  const street = norm(full.street)
  const bits = ['UAE']
  if (city) bits.push(city)
  if (street) bits.push(street)
  return bits.join(', ')
}

async function fixCounterparty(cp) {
  const actualNeeds = needsFix(cp.actualAddressFull)
  const legalNeeds = needsFix(cp.legalAddressFull)
  if (!actualNeeds && !legalNeeds) return null

  const payload = { meta: cp.meta, name: cp.name }
  if (actualNeeds) {
    const cleaned = cleanedAddressFull(cp.actualAddressFull)
    payload.actualAddressFull = cleaned
    payload.actualAddress = composedFromFull(cleaned)
  }
  if (legalNeeds) {
    const cleaned = cleanedAddressFull(cp.legalAddressFull)
    payload.legalAddressFull = cleaned
    payload.legalAddress = composedFromFull(cleaned)
  }

  console.log(`\n  CP: ${cp.name}`)
  if (actualNeeds) {
    console.log(`    actual was: ${cp.actualAddress}`)
    console.log(`    → street=${JSON.stringify(payload.actualAddressFull.street)} addInfo=""`)
    console.log(`    → ${payload.actualAddress}`)
  }
  if (legalNeeds) {
    console.log(`    legal was: ${cp.legalAddress}`)
    console.log(`    → street=${JSON.stringify(payload.legalAddressFull.street)} addInfo=""`)
  }

  if (COMMIT) {
    await api('PUT', `/entity/counterparty/${cp.id}`, payload)
  }
  return { id: cp.id, name: cp.name }
}

async function fixOrder(order) {
  if (!needsFix(order.shipmentAddressFull)) return null
  const cleaned = cleanedAddressFull(order.shipmentAddressFull)
  console.log(`\n  SO: ${order.name}`)
  console.log(`    ship was: ${order.shipmentAddress}`)
  console.log(`    → street=${JSON.stringify(cleaned.street)} addInfo=""`)

  if (COMMIT) {
    await api('PUT', `/entity/customerorder/${order.id}`, {
      meta: order.meta,
      shipmentAddressFull: cleaned,
    })
  }
  return { id: order.id, name: order.name }
}

async function main() {
  console.log('====================================================================')
  console.log('  Fix street/addInfo address duplicates')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('====================================================================')

  const cps = await fetchAll('/entity/counterparty?filter=archived=false')
  const fixedCp = []
  for (const cp of cps) {
    const r = await fixCounterparty(cp)
    if (r) fixedCp.push(r)
  }

  console.log(`\n  Counterparties to fix: ${fixedCp.length}`)

  // Open / recent orders (last 180 days) — catch SO ship address dups even if CP already fixed
  const since = new Date(Date.now() - 180 * 24 * 3600 * 1000)
  const yyyy = since.toISOString().slice(0, 10)
  const orders = await fetchAll(
    `/entity/customerorder?filter=${encodeURIComponent(`moment>=${yyyy} 00:00:00`)}`,
  )
  const fixedOrders = []
  for (const order of orders) {
    const r = await fixOrder(order)
    if (r) fixedOrders.push(r)
  }
  console.log(`  Customer orders to fix: ${fixedOrders.length}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  console.log(`\n  Done. Fixed ${fixedCp.length} counterparties, ${fixedOrders.length} orders.`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
