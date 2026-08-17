#!/usr/bin/env node

/**
 * Fix 14 Saldo-flagged Q2 VAT invoices (delivery VAT / product VAT / free delivery display),
 * then re-export Genosys_Invoice_Legal_TAX PDFs to ~/Desktop/orders and Q2 VAT folders.
 *
 *   node --import dotenv/config scripts/moysklad-fix-vat-q2-saldo-flagged-invoices-20260710.js
 *   node --import dotenv/config scripts/moysklad-fix-vat-q2-saldo-flagged-invoices-20260710.js --commit
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

const INVOICE_LEGAL_TAX_TEMPLATE_ID = '5e56cd7d-ce85-4db5-8771-d7531f9ffd71'

const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const VAT_Q2_ROOT = path.join(
  os.homedir(),
  'Desktop/Drive/Genosys/Company_Legal/Tax/VAT/2026/Q2'
)

const MONTH_DIRS = {
  3: 'Invoices_April_2026',
  4: 'Invoices_May_2026',
  5: 'Invoices_June_2026',
}

/** Saldo expected VAT (AED) for post-fix verification */
const SALDO_VAT = {
  '04333': 15.0,
  '04348': 25.95,
  '04362': 16.43,
  '04382': 52.1,
  '04390': 17.86,
  '04436': 56.67,
  '04537': 13.62,
  '04562': 49.29,
  '04618': 33.19,
  '04671': 50.48,
  '04695': 75.24,
  '04728': 73.1,
  '04731': 86.67,
  '04732': 55.24,
}

const INVOICE_NAMES = Object.keys(SALDO_VAT)

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
      await sleep(600 * attempt)
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 4 && (e.cause?.code === 'ECONNRESET' || e.message === 'fetch failed')) {
      await sleep(1200 * attempt)
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
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

function isDelivery(p) {
  return /delivery/i.test(p.assortment?.name || '')
}

function positionPayload(p, patch) {
  return {
    quantity: patch.quantity ?? p.quantity,
    price: patch.price ?? p.price,
    discount: patch.discount ?? p.discount ?? 0,
    vat: patch.vat ?? p.vat ?? 5,
    vatEnabled: patch.vatEnabled ?? p.vatEnabled,
    assortment: p.assortment,
  }
}

function matchPosition(a, b) {
  const aId = a.assortment?.meta?.href || ''
  const bId = b.assortment?.meta?.href || ''
  if (aId && bId && aId === bId) {
    return Math.abs(a.price - b.price) < 2 && Math.abs((a.discount || 0) - (b.discount || 0)) < 0.01
  }
  return (a.assortment?.name || '') === (b.assortment?.name || '')
}

async function getInvoiceBundle(name) {
  const data = await api(
    'GET',
    `/entity/invoiceout?filter=${encodeURIComponent(`name=${name}`)}&limit=1&expand=customerOrder,demands`
  )
  const invoice = data.rows?.[0]
  if (!invoice) throw new Error(`Invoice ${name} not found`)

  const orderId = invoice.customerOrder?.meta?.href?.split('/').pop()
  const demandId = invoice.demands?.[0]?.meta?.href?.split('/').pop()

  const invoicePositions = await fetchAll(`/entity/invoiceout/${invoice.id}/positions?expand=assortment`)
  let orderPositions = []
  let demandPositions = []
  if (orderId) orderPositions = await fetchAll(`/entity/customerorder/${orderId}/positions?expand=assortment`)
  if (demandId) demandPositions = await fetchAll(`/entity/demand/${demandId}/positions?expand=assortment`)

  return { invoice, orderId, demandId, invoicePositions, orderPositions, demandPositions }
}

function planFixes(name, positions) {
  const actions = []

  for (const p of positions) {
    if (isDelivery(p)) {
      if (p.vatEnabled === false) {
        actions.push({
          label: `delivery VAT on ${p.assortment?.name}`,
          match: (x) => isDelivery(x),
          patch: { vatEnabled: true, vat: 5 },
        })
      } else if (p.discount === 100 && p.price > 0) {
        actions.push({
          label: `free delivery → price 0 (${p.assortment?.name})`,
          match: (x) => isDelivery(x),
          patch: { price: 0, discount: 0, vatEnabled: true, vat: 5 },
        })
      }
      continue
    }

    if (name === '04333' && p.vatEnabled === false) {
      actions.push({
        label: `enable VAT on ${(p.assortment?.name || '').slice(0, 40)}`,
        match: (x) => !isDelivery(x) && x.vatEnabled === false && x.price === p.price,
        patch: { vatEnabled: true, vat: 5 },
      })
    }
  }

  return actions
}

async function applyActions(entityType, entityId, positions, actions, label) {
  if (!entityId || !actions.length) return

  for (const action of actions) {
    const pos = positions.find(action.match)
    if (!pos) {
      console.warn(`    ⚠ ${label}: position not found — ${action.label}`)
      continue
    }

    const next = positionPayload(pos, action.patch)
    const same =
      next.price === pos.price &&
      next.discount === (pos.discount || 0) &&
      next.vatEnabled === pos.vatEnabled &&
      next.vat === (pos.vat || 0)

    if (same) {
      console.log(`    · ${label}: already OK — ${action.label}`)
      continue
    }

    console.log(
      `    → ${label}: ${action.label} | price ${money(pos.price)}→${money(next.price)} disc ${pos.discount || 0}→${next.discount} vatEn ${pos.vatEnabled}→${next.vatEnabled}`
    )

    if (COMMIT) {
      await api('PUT', `/entity/${entityType}/${entityId}/positions/${pos.id}`, next)
    }
  }
}

async function exportInvoicePdf(invoiceId, invoiceName, moment) {
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
  if (res.status === 412) return []
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Export ${invoiceName} ${res.status}: ${t.slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())

  const saved = []
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const ordersPath = path.join(ORDERS_DIR, `GENOSYS_VAT_FIX_${invoiceName}.pdf`)
  fs.writeFileSync(ordersPath, buf)
  saved.push(ordersPath)

  const month = new Date(moment).getMonth()
  const monthDir = MONTH_DIRS[month]
  if (monthDir) {
    const folder = path.join(VAT_Q2_ROOT, monthDir)
    if (fs.existsSync(folder)) {
      const batches = fs.readdirSync(folder).filter((n) => n.startsWith('Genosys_Invoice_Legal_TAX-'))
      const batchDir = batches.length
        ? path.join(folder, batches[0])
        : path.join(folder, `Genosys_Invoice_Legal_TAX-${LOGIN}-revised-${Date.now()}`)
      fs.mkdirSync(batchDir, { recursive: true })
      const vatPath = path.join(batchDir, `Genosys_Invoice_Legal_TAX-${invoiceName}.pdf`)
      fs.writeFileSync(vatPath, buf)
      saved.push(vatPath)
    }
  }

  return saved
}

async function fixOne(name) {
  console.log(`\n── ${name} ──`)
  let bundle = await getInvoiceBundle(name)
  const actions = planFixes(name, bundle.invoicePositions)

  if (!actions.length) {
    console.log('  No MoySklad data changes planned (rounding-only / PDF refresh)')
  }

  await applyActions('customerorder', bundle.orderId, bundle.orderPositions, actions, 'Order')
  await applyActions('invoiceout', bundle.invoice.id, bundle.invoicePositions, actions, 'Invoice')
  await applyActions('demand', bundle.demandId, bundle.demandPositions, actions, 'Shipment')

  if (COMMIT && actions.length) {
    await sleep(400)
    bundle = await getInvoiceBundle(name)
  }

  const inv = COMMIT && actions.length
    ? (await api('GET', `/entity/invoiceout/${bundle.invoice.id}`))
    : bundle.invoice
  const vatSum = (inv.vatSum || 0) / 100
  const sum = inv.sum / 100
  const target = SALDO_VAT[name]
  const vatOk = Math.abs(vatSum - target) <= 0.03

  console.log(`  After: total ${money(inv.sum)} AED | vatSum ${vatSum.toFixed(2)} (Saldo ${target.toFixed(2)}) ${vatOk ? '✅' : '⚠️'}`)

  if (!COMMIT) return { name, vatOk, pdfPaths: [] }

  const pdfPaths = await exportInvoicePdf(bundle.invoice.id, name, inv.moment)
  for (const p of pdfPaths) console.log(`  PDF → ${p}`)
  return { name, vatOk, pdfPaths }
}

async function main() {
  console.log('====================================================================')
  console.log('  Q2 Saldo VAT — fix 14 flagged invoices + re-export PDFs')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Orders folder: ${ORDERS_DIR}`)
  console.log(`  VAT Q2 folder: ${VAT_Q2_ROOT}`)

  const results = []
  for (const name of INVOICE_NAMES) {
    results.push(await fixOne(name))
    await sleep(300)
  }

  console.log('\n====================================================================')
  console.log('  Summary')
  console.log('====================================================================')
  for (const r of results) {
    console.log(`  ${r.name}: VAT ${r.vatOk ? 'OK' : 'CHECK'} | PDFs ${r.pdfPaths?.length || 0}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit to apply and export PDFs')
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
