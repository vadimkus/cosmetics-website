#!/usr/bin/env node

/**
 * Korea reorder PO — add missing PI line GCAP01 / 54475 PDRN Homecare ×5 (DM GME 260605).
 * Skipped on 2026-06-12 because SKU did not exist; product 54475 created on PO 260616.
 *
 *   node --import dotenv/config scripts/moysklad-add-korea-po-54475-gcap01-20260622.js
 *   node --import dotenv/config scripts/moysklad-add-korea-po-54475-gcap01-20260622.js --commit
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
const PO_NAME = 'Korea reorder 2026-06-03 T1+T2'
const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const SUPPLIER_ID = '3a0a3f28-33cf-11ea-0a80-043f000b9859'

const PRODUCT_ID = '3706b193-6ae8-11f1-0a80-16e5003a85d3'
const PRODUCT_CODE = '54475'
const INV_CODE = 'GCAP01'
const QTY = 5
const BUY_MINOR = 3415 // USD 9.30 × 3.6725
const SUPPLY_MOMENT = '2026-06-17 14:55:00' // after main receive 00184 @ 14:54
const MARKER = `KOREA-PO-PI-260605-GCAP01-54475-${uaeToday()}`

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

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function main() {
  console.log('====================================================================')
  console.log('  Korea PO — add GCAP01 / 54475 PDRN Homecare ×5')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  PO   : ${PO_NAME}`)
  console.log(`  PI   : DM GME 260605 — ${INV_CODE} ×${QTY} pcs`)

  const po = await api('GET', `/entity/purchaseorder/${PO_ID}`)
  const positions = await api(
    'GET',
    `/entity/purchaseorder/${PO_ID}/positions?expand=assortment&limit=100`
  )
  const existing = (positions.rows || []).find((p) => p.assortment?.code === PRODUCT_CODE)
  if (existing) {
    console.log(`\n  ${PRODUCT_CODE} already on PO: qty ${existing.quantity}, shipped ${existing.shipped ?? 0}`)
    if (existing.quantity === QTY && (existing.shipped ?? 0) >= QTY) {
      console.log('  Nothing to do.')
      return
    }
  }

  const lineSum = QTY * BUY_MINOR
  console.log(`\n  Add PO line: ${PRODUCT_CODE} ×${QTY} @ ${money(BUY_MINOR)} = ${money(lineSum)} AED`)
  console.log(`  PO sum   : ${money(po.sum)} → ${money(po.sum + lineSum)} AED (est.)`)
  console.log(`  Supply   : ×${QTY} @ ${SUPPLY_MOMENT} (PI 260605 landing, after supply 00184)`)

  if ((po.description || '').includes(MARKER)) {
    throw new Error(`Marker already on PO (${MARKER})`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  if (!existing) {
    await api('POST', `/entity/purchaseorder/${PO_ID}/positions`, {
      quantity: QTY,
      price: BUY_MINOR,
      assortment: href('product', PRODUCT_ID),
      vat: 0,
      vatEnabled: false,
    })
  }

  const supplyMarker = `${MARKER}-SUPPLY`
  const supplyFilter = encodeURIComponent(
    `description~${supplyMarker};moment>=2026-06-01;moment<=2026-06-30`
  )
  const priorSupplies = await api('GET', `/entity/supply?filter=${supplyFilter}&limit=5`)
  let supply = priorSupplies.rows?.[0]

  if (!supply) {
    supply = await api('POST', '/entity/supply', {
      moment: SUPPLY_MOMENT,
      applicable: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', SUPPLIER_ID),
      store: href('store', STORE_ID),
      purchaseOrder: href('purchaseorder', PO_ID),
      description: `${supplyMarker} | ${INV_CODE} ${PRODUCT_CODE} ×${QTY} missing from supply 00184 / PI DM GME 260605`,
      vatEnabled: true,
      positions: [
        {
          quantity: QTY,
          price: BUY_MINOR,
          assortment: href('product', PRODUCT_ID),
          vat: 5,
          vatEnabled: true,
        },
      ],
    })
    console.log(`\n  Supply created: ${supply.name} | ${money(supply.sum)} AED`)
  } else {
    console.log(`\n  Supply exists: ${supply.name}`)
  }

  const desc = [
    po.description || '',
    MARKER,
    `Added ${INV_CODE} ${PRODUCT_CODE} ×${QTY} from PI DM GME 260605 (was skipped — no SKU on 2026-06-12).`,
    supply ? `Received via supply ${supply.name}.` : '',
  ]
    .filter(Boolean)
    .join('\n')

  await api('PUT', `/entity/purchaseorder/${PO_ID}`, { meta: po.meta, description: desc })

  const poAfter = await api('GET', `/entity/purchaseorder/${PO_ID}`)
  const posAfter = await api(
    'GET',
    `/entity/purchaseorder/${PO_ID}/positions?expand=assortment&limit=100`
  )
  const line54475 = (posAfter.rows || []).find((p) => p.assortment?.code === PRODUCT_CODE)

  console.log('\n  Verification:')
  console.log(`  PO sum     : ${money(poAfter.sum)} AED`)
  console.log(
    `  ${PRODUCT_CODE} on PO: qty ${line54475?.quantity}, shipped ${line54475?.shipped ?? 0}`
  )
  if (!line54475 || line54475.quantity !== QTY) {
    throw new Error(`${PRODUCT_CODE} qty mismatch on PO`)
  }
  if ((line54475.shipped ?? 0) < QTY) {
    throw new Error(`${PRODUCT_CODE} not fully received: shipped ${line54475.shipped ?? 0}/${QTY}`)
  }

  console.log(`  https://online.moysklad.ru/app/#purchaseorder/edit?id=${PO_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
