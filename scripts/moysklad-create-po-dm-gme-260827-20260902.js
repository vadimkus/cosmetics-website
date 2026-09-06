#!/usr/bin/env node

/**
 * MoySklad — DM GME 260827 purchase order only (no receive).
 *
 * DTS MG proforma 2026-08-27:
 *   GMPS05 GENO-LED IR II ×1 @ $630
 *   Hair Gentron ×1 @ $200
 *   Total USD 830.00 | FOB Incheon | T/T in advance | est. dispatch 1-Sep-26
 *
 *   node --import dotenv/config scripts/moysklad-create-po-dm-gme-260827-20260902.js
 *   node --import dotenv/config scripts/moysklad-create-po-dm-gme-260827-20260902.js --commit
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

const FX = 3.6725
const CURRENCY_ID = 'e1870630-33c5-11ea-0a80-043f000b273f'

const INVOICE = {
  number: 'DM GME 260827',
  dateIssued: '2026-08-27',
  deliveryExpected: '2026-09-01',
  supplierId: '3a0a3f28-33cf-11ea-0a80-043f000b9859',
  orgId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  usdTotal: 830.0,
}

const MARKER = `DM-GME-260827-PO-${uaeToday()}`

const PO_LINES = [
  { invCode: 'GMPS05', msCode: '00077', qty: 1, usd: 630 },
  { invCode: 'HGHY01', msCode: '00078', qty: 1, usd: 200 },
]

function usdToMinor(usd) {
  return Math.round(usd * FX * 100)
}

function money(minor) {
  return (minor / 100).toFixed(2)
}

function href(entityType, id) {
  return { meta: { href: `${API}/entity/${entityType}/${id}`, type: entityType, mediaType: 'application/json' } }
}

function currencyRef() {
  return { meta: href('currency', CURRENCY_ID).meta }
}

async function api(method, pathStr, body, attempt = 0) {
  while (true) {
    try {
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
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 900 * (attempt + 1)))
        attempt += 1
        if (attempt > 7) throw new Error(`HTTP ${res.status} ${pathStr}`)
        continue
      }
      if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
      return text ? JSON.parse(text) : null
    } catch (e) {
      if (attempt >= 5) throw e
      await new Promise((r) => setTimeout(r, 900 * (attempt + 1)))
      attempt += 1
    }
  }
}

async function getProductByCode(code) {
  const data = await api('GET', `/entity/product?filter=code=${encodeURIComponent(code)}&limit=1`)
  return data?.rows?.[0] || null
}

async function ensureNoDuplicatePo() {
  const existing = await api('GET', `/entity/purchaseorder?search=${encodeURIComponent(INVOICE.number)}&limit=20`)
  const dup = (existing.rows || []).find((r) => r.name === INVOICE.number)
  if (dup) {
    throw new Error(
      `PO "${INVOICE.number}" already exists (${dup.id}) https://online.moysklad.ru/app/#purchaseorder/edit?id=${dup.id}`,
    )
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  MoySklad — DM GME 260827 devices PO (no receive)')
  console.log('====================================================================')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  FX   : 1 USD = ${FX} AED`)
  console.log(`  ETA  : ${INVOICE.deliveryExpected} (est. dispatch on PI)`)

  await ensureNoDuplicatePo()

  const resolved = []
  let totalMinor = 0
  let paidUsd = 0

  console.log('\n  Lines:')
  for (const line of PO_LINES) {
    const p = await getProductByCode(line.msCode)
    if (!p) throw new Error(`Missing product ${line.msCode}`)
    const priceMinor = usdToMinor(line.usd)
    const lineMinor = priceMinor * line.qty
    totalMinor += lineMinor
    paidUsd += line.usd * line.qty
    const oldBuy = p.buyPrice?.value ?? 0
    console.log(
      `    ${line.invCode} ${line.msCode} ${p.name} x${line.qty} @ $${line.usd} = ${money(lineMinor)} AED  (buy was ${money(oldBuy)})`,
    )
    resolved.push({ ...line, product: p, priceMinor, lineMinor })
  }

  const usdDiff = Math.abs(paidUsd - INVOICE.usdTotal)
  console.log(`\n  Invoice USD: $${INVOICE.usdTotal.toFixed(2)} | calc $${paidUsd.toFixed(2)} | ${money(totalMinor)} AED`)
  if (usdDiff > 0.01) throw new Error(`USD mismatch: expected ${INVOICE.usdTotal}, got ${paidUsd}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit. No receive. No paymentout.')
    return
  }

  for (const l of resolved) {
    if (l.product.buyPrice?.value === l.priceMinor) continue
    await api('PUT', `/entity/product/${l.product.id}`, {
      meta: l.product.meta,
      buyPrice: { value: l.priceMinor, currency: currencyRef() },
    })
    console.log(`  buyPrice ${l.msCode} → ${money(l.priceMinor)} AED`)
  }

  const created = await api('POST', '/entity/purchaseorder', {
    name: INVOICE.number,
    moment: `${INVOICE.dateIssued} 00:00:00`,
    deliveryPlannedMoment: `${INVOICE.deliveryExpected} 00:00:00`,
    applicable: true,
    organization: href('organization', INVOICE.orgId),
    agent: href('counterparty', INVOICE.supplierId),
    store: href('store', INVOICE.storeId),
    description: [
      `Proforma ${INVOICE.number} dated ${INVOICE.dateIssued} — DTS MG → Genosys Middle East FZ-LLC`,
      `FOB Incheon | T/T in advance | est. dispatch ${INVOICE.deliveryExpected}`,
      `GMPS05 GENO-LED IR II ×1 @ $630; HGHY01 Hair Gentron ×1 @ $200`,
      `Invoice USD $${INVOICE.usdTotal.toFixed(2)} | buy AED = USD × ${FX}`,
      `PO only — do not receive until cargo arrives. No paymentout in this script.`,
      MARKER,
    ].join('\n'),
    positions: resolved.map((l) => ({
      quantity: l.qty,
      price: l.priceMinor,
      assortment: href('product', l.product.id),
      vat: 0,
      vatEnabled: false,
      inTransit: l.qty,
    })),
  })

  const verify = await api('GET', `/entity/purchaseorder/${created.id}`)
  if (verify.sum !== totalMinor) {
    throw new Error(`Posted PO AED ${money(verify.sum)} != calc ${money(totalMinor)}`)
  }
  console.log(`\n  Created PO: ${verify.name} | ${money(verify.sum)} AED`)
  console.log(`  https://online.moysklad.ru/app/#purchaseorder/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
