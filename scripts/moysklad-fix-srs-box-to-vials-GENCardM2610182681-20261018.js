#!/usr/bin/env node
/**
 * GENCardM2610182681 (Coute Coraline, app, paid 615 AED): the SRS line went to MoySklad as
 * "1 × SRS Box 405". SRS is stocked as vials, so replace it with 10 × SRS 1 Vial 2 ml at 40.50
 * in the sales order and invoice 05246. Totals stay 615. No shipment or payment exists yet.
 *
 * Usage: node scripts/moysklad-fix-srs-box-to-vials-GENCardM2610182681-20261018.js [--apply]
 */
require('dotenv').config({ path: '.env' })

const API = 'https://api.moysklad.ru/api/remap/1.2'
const AUTH = 'Basic ' + Buffer.from(`${process.env.MOYSKLAD_LOGIN}:${process.env.MOYSKLAD_PASSWORD}`).toString('base64')
const APPLY = process.argv.includes('--apply')

const SRS_BOX = '62225706-3445-11ea-0a80-05dc000156b3'
const SRS_VIAL = '249b01f4-3446-11ea-0a80-03f90001b3de'
const DOCS = [
  { type: 'customerorder', name: 'GENCardM2610182681' },
  { type: 'invoiceout', name: '05246' },
]

async function ms(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip', ...(opts.headers || {}) },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${opts.method || 'GET'} ${path} -> ${res.status} ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : null
}

async function main() {
  for (const d of DOCS) {
    const found = await ms(`/entity/${d.type}?filter=name=${encodeURIComponent(d.name)}`)
    const doc = found.rows[0]
    if (!doc) throw new Error(`${d.type} ${d.name} not found`)
    const pos = await ms(`/entity/${d.type}/${doc.id}/positions?expand=assortment`)
    const box = pos.rows.find((p) => p.assortment.id === SRS_BOX)
    console.log(`${d.type} ${d.name}: sum ${doc.sum / 100}, SRS box line: ${box ? `${box.quantity} x ${box.price / 100}` : 'none'}`)
    if (!box) continue
    if (box.quantity !== 1) throw new Error(`unexpected SRS box quantity ${box.quantity}`)
    const vialLine = {
      quantity: 10,
      price: Math.round(box.price / 10),
      discount: box.discount || 0,
      vat: box.vat,
      vatEnabled: box.vatEnabled,
      assortment: { meta: { href: `${API}/entity/product/${SRS_VIAL}`, type: 'product', mediaType: 'application/json' } },
    }
    console.log(`  -> 10 x SRS 1 Vial 2 ml at ${vialLine.price / 100}`)
    if (!APPLY) continue
    await ms(`/entity/${d.type}/${doc.id}/positions`, { method: 'POST', body: JSON.stringify([vialLine]) })
    await ms(`/entity/${d.type}/${doc.id}/positions/${box.id}`, { method: 'DELETE' })
    const after = await ms(`/entity/${d.type}/${doc.id}`)
    console.log(`  done, sum now ${after.sum / 100}`)
  }
  if (!APPLY) console.log('\nDry run. Re-run with --apply.')
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
