#!/usr/bin/env node

/**
 * Korea reorder PO — reconcile existing line qty to PI DM GME 260605 exactly.
 *
 * Updates qty where PO ≠ PI; removes 00038 (loose postcream not on PI — PI uses GCCR07 box only).
 *
 *   node --import dotenv/config scripts/moysklad-reconcile-korea-po-pi-qty-20260612.js
 *   node --import dotenv/config scripts/moysklad-reconcile-korea-po-pi-qty-20260612.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const PO_ID = '61767a0d-5f3a-11f1-0a80-191700184737'
const MARKER = `KOREA-PO-PI-260605-QTY-RECON-${uaeToday()}`

/** PI DM GME 260605 paid commodity — target qty per MoySklad code */
const PI_QTY = {
  '00004': 5,
  '00021': 100,
  '00022': 80,
  '00024': 20,
  '00034': 10,
  '00037': 30,
  '00039': 6,
  '00041': 20,
  '00050': 10,
  '00051': 150,
  '00052': 60,
  '00053': 150,
  '00063': 500,
  '00123': 10,
  '00129': 20,
  '00140': 600,
  '00143': 30,
  '00144': 100,
  '00188': 100,
  '00189': 20,
  '00190': 50,
  '00191': 50,
  '00194': 50,
  '54458': 30,
  '54464': 60,
  '54465': 5,
  '54470': 10,
  '54471': 5,
  '54472': 30,
  '54473': 30,
}

/** On PO but not on PI paid lines — remove */
const REMOVE_CODES = new Set(['00038'])

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
  return text ? JSON.parse(text) : null
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function main() {
  console.log('====================================================================')
  console.log('  Korea PO — reconcile qty to PI DM GME 260605')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const po = await api('GET', `/entity/purchaseorder/${PO_ID}`)
  console.log(`  PO sum before: ${money(po.sum)} AED`)

  const positions = await fetchAll(`/entity/purchaseorder/${PO_ID}/positions?expand=assortment`)
  const updates = []
  const removes = []
  const ok = []

  for (const p of positions) {
    const code = p.assortment?.code
    if (!code) continue

    if (REMOVE_CODES.has(code)) {
      removes.push({ code, id: p.id, qty: p.quantity, name: p.assortment?.name })
      continue
    }

    const target = PI_QTY[code]
    if (target === undefined) {
      console.log(`  WARN: ${code} on PO but not in PI map — left unchanged`)
      continue
    }

    if (p.quantity === target) {
      ok.push(code)
      continue
    }

    updates.push({
      id: p.id,
      code,
      name: (p.assortment?.name || '').slice(0, 50),
      from: p.quantity,
      to: target,
      price: p.price,
      meta: p.meta,
      assortment: p.assortment,
      vat: p.vat,
      vatEnabled: p.vatEnabled,
      discount: p.discount,
    })
  }

  console.log(`\n  Already match PI: ${ok.length} lines`)
  console.log('\n  Qty updates:')
  let deltaMinor = 0
  for (const u of updates) {
    const d = (u.to - u.from) * u.price
    deltaMinor += d
    console.log(`    ${u.code} ${u.from} → ${u.to}  (${d >= 0 ? '+' : ''}${money(d)} AED)`)
  }
  console.log('\n  Remove (not on PI):')
  for (const r of removes) {
    const d = -r.qty * (positions.find((p) => p.id === r.id)?.price || 0)
    deltaMinor += d
    console.log(`    ${r.code} ×${r.qty}  (${money(d)} AED)`)
  }
  console.log(`\n  Est. sum delta: ${money(deltaMinor)} AED`)
  console.log(`  Est. sum after : ${money((po.sum || 0) + deltaMinor)} AED`)

  if (!updates.length && !removes.length) {
    console.log('\n  Nothing to change.')
    return
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  if ((po.description || '').includes(MARKER)) {
    throw new Error(`Already reconciled (${MARKER})`)
  }

  for (const u of updates) {
    await api('PUT', `/entity/purchaseorder/${PO_ID}/positions/${u.id}`, {
      meta: u.meta,
      quantity: u.to,
      price: u.price,
      assortment: u.assortment,
      vat: u.vat,
      vatEnabled: u.vatEnabled,
      discount: u.discount || 0,
    })
  }

  for (const r of removes) {
    await api('DELETE', `/entity/purchaseorder/${PO_ID}/positions/${r.id}`)
  }

  const desc = [po.description || '', MARKER, `Qty recon to PI 260605: ${updates.map((u) => `${u.code} ${u.from}→${u.to}`).join('; ')}${removes.length ? `; removed ${removes.map((r) => r.code).join(',')}` : ''}.`].join('\n')
  await api('PUT', `/entity/purchaseorder/${PO_ID}`, { meta: po.meta, description: desc })

  const poAfter = await api('GET', `/entity/purchaseorder/${PO_ID}`)
  const posAfter = await fetchAll(`/entity/purchaseorder/${PO_ID}/positions?expand=assortment`)
  console.log(`\n  PO after: ${money(poAfter.sum)} AED | ${posAfter.length} lines`)
  console.log(`  https://online.moysklad.ru/app/#purchaseorder/edit?id=${PO_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
