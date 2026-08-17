#!/usr/bin/env node

/**
 * Delete duplicate Lips for Kiss 7,620 chain + close invoice/demand number gaps.
 *
 * Delete:
 *   SO GENCardM260805LFK1 / invoice 04894 / demand 06640 (7,620 AED)
 *
 * Renumber keepers:
 *   invoice 04895 → 04894 (7,095 order1)
 *   invoice 04896 → 04895 (1,520 order2)
 *   demand  06641 → 06640
 *   demand  06642 → 06641
 *
 * Re-export Legal TAX invoice PDFs → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-delete-lips-for-kiss-7620-renumber-20260805.js
 *   node --import dotenv/config scripts/moysklad-delete-lips-for-kiss-7620-renumber-20260805.js --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const DELETE = {
  order: { id: 'dea1d88e-90db-11f1-0a80-115e0020859d', name: 'GENCardM260805LFK1', sum: 762000 },
  invoice: { id: 'dee78c97-90db-11f1-0a80-195000202dc4', name: '04894', sum: 762000 },
  demand: { id: 'dfbe6ce9-90db-11f1-0a80-1d24001fbb70', name: '06640', sum: 762000 },
}

const RENUMBER_INVOICES = [
  { id: '3a1f9db1-90dc-11f1-0a80-1f52002078dd', oldName: '04895', newName: '04894', sum: 709500 },
  { id: '7952037a-90dc-11f1-0a80-0fd500203023', oldName: '04896', newName: '04895', sum: 152000 },
]

const RENUMBER_DEMANDS = [
  { id: '3af147d6-90dc-11f1-0a80-0b6300215289', oldName: '06641', newName: '06640', sum: 709500 },
  { id: '79fb902c-90dc-11f1-0a80-14400020f5f7', oldName: '06642', newName: '06641', sum: 152000 },
]

const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

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
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function exportInvoicePdf(invoiceId, invoiceName) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/customtemplate/${INVOICE_LEGAL_TAX_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/invoiceout/${invoiceId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Export ${invoiceName}: ${res.status} ${(await res.text()).slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Lips_for_Kiss_${invoiceName}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function assertDoc(entity, { id, name, sum }) {
  const doc = await api('GET', `/entity/${entity}/${id}`)
  if (doc.name !== name) throw new Error(`${entity} ${id}: name ${doc.name} ≠ ${name}`)
  if (doc.sum !== sum) throw new Error(`${entity} ${name}: sum ${money(doc.sum)} ≠ ${money(sum)}`)
  return doc
}

async function main() {
  console.log('====================================================================')
  console.log('  Delete LFK 7620 chain + renumber invoices/demands')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const delDemand = await assertDoc('demand', DELETE.demand)
  const delInvoice = await assertDoc('invoiceout', DELETE.invoice)
  const delOrder = await assertDoc('customerorder', DELETE.order)

  console.log('\n  DELETE chain:')
  console.log(`    SO ${delOrder.name} | ${money(delOrder.sum)} AED`)
  console.log(`    Invoice ${delInvoice.name} | ${money(delInvoice.sum)} AED`)
  console.log(`    Demand ${delDemand.name} | ${money(delDemand.sum)} AED`)

  console.log('\n  RENUMBER invoices:')
  for (const r of RENUMBER_INVOICES) {
    const doc = await assertDoc('invoiceout', { id: r.id, name: r.oldName, sum: r.sum })
    console.log(`    ${doc.name} → ${r.newName} | ${money(doc.sum)} AED`)
  }

  console.log('\n  RENUMBER demands:')
  for (const r of RENUMBER_DEMANDS) {
    const doc = await assertDoc('demand', { id: r.id, name: r.oldName, sum: r.sum })
    console.log(`    ${doc.name} → ${r.newName} | ${money(doc.sum)} AED`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  console.log('\n  Step 1: delete demand → invoice → SO')
  await api('DELETE', `/entity/demand/${DELETE.demand.id}`)
  console.log(`    deleted demand ${DELETE.demand.name}`)
  await api('DELETE', `/entity/invoiceout/${DELETE.invoice.id}`)
  console.log(`    deleted invoice ${DELETE.invoice.name}`)
  await api('DELETE', `/entity/customerorder/${DELETE.order.id}`)
  console.log(`    deleted SO ${DELETE.order.name}`)

  console.log('\n  Step 2: renumber invoices (high → low via temp to avoid clash)')
  // 04896 → temp, 04895 → 04894, temp → 04895
  const inv1520 = await api('GET', `/entity/invoiceout/${RENUMBER_INVOICES[1].id}`)
  const inv7095 = await api('GET', `/entity/invoiceout/${RENUMBER_INVOICES[0].id}`)
  await api('PUT', `/entity/invoiceout/${inv1520.id}`, { meta: inv1520.meta, name: 'TMP-LFK-INV' })
  await api('PUT', `/entity/invoiceout/${inv7095.id}`, { meta: inv7095.meta, name: '04894' })
  const inv1520b = await api('GET', `/entity/invoiceout/${inv1520.id}`)
  await api('PUT', `/entity/invoiceout/${inv1520.id}`, { meta: inv1520b.meta, name: '04895' })
  console.log('    04895 → 04894 (7095), 04896 → 04895 (1520)')

  console.log('\n  Step 3: renumber demands')
  const dem1520 = await api('GET', `/entity/demand/${RENUMBER_DEMANDS[1].id}`)
  const dem7095 = await api('GET', `/entity/demand/${RENUMBER_DEMANDS[0].id}`)
  await api('PUT', `/entity/demand/${dem1520.id}`, { meta: dem1520.meta, name: 'TMP-LFK-DEM' })
  await api('PUT', `/entity/demand/${dem7095.id}`, { meta: dem7095.meta, name: '06640' })
  const dem1520b = await api('GET', `/entity/demand/${dem1520.id}`)
  await api('PUT', `/entity/demand/${dem1520.id}`, { meta: dem1520b.meta, name: '06641' })
  console.log('    06641 → 06640 (7095), 06642 → 06641 (1520)')

  console.log('\n  Step 4: verify')
  for (const n of ['04894', '04895', '04896']) {
    const d = await api('GET', `/entity/invoiceout?filter=name=${n}&limit=1`)
    const row = d.rows?.[0]
    console.log(`    invoice ${n}: ${row ? `${money(row.sum)} AED` : 'FREE'}`)
  }
  for (const n of ['06640', '06641', '06642']) {
    const d = await api('GET', `/entity/demand?filter=name=${n}&limit=1`)
    const row = d.rows?.[0]
    console.log(`    demand ${n}: ${row ? `${money(row.sum)} AED` : 'FREE'}`)
  }

  const inv94 = await api('GET', `/entity/invoiceout/${RENUMBER_INVOICES[0].id}`)
  const inv95 = await api('GET', `/entity/invoiceout/${RENUMBER_INVOICES[1].id}`)
  if (inv94.name !== '04894' || inv94.sum !== 709500) throw new Error('04894 verify failed')
  if (inv95.name !== '04895' || inv95.sum !== 152000) throw new Error('04895 verify failed')

  const gone = await api('GET', `/entity/customerorder?filter=name=GENCardM260805LFK1&limit=1`)
  if (gone.rows?.length) throw new Error('LFK1 still exists')

  console.log('\n  Step 5: re-export invoice PDFs')
  const pdf94 = await exportInvoicePdf(inv94.id, '04894')
  const pdf95 = await exportInvoicePdf(inv95.id, '04895')
  console.log(`    ${pdf94}`)
  console.log(`    ${pdf95}`)

  const stale96 = path.join(ORDERS_DIR, 'GENOSYS_Lips_for_Kiss_04896.pdf')
  if (fs.existsSync(stale96)) {
    fs.unlinkSync(stale96)
    console.log(`    removed stale ${stale96}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
