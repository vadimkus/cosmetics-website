#!/usr/bin/env node

/**
 * Miss Laura Abizova — paymentin @ 04769 / 06480 + order delivered + retail PDF print.
 *
 *   node --import dotenv/config scripts/moysklad-create-laura-abizova-paymentin-reprint-04769-20260705.js
 *   node --import dotenv/config scripts/moysklad-create-laura-abizova-paymentin-reprint-04769-20260705.js --commit
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync } = require('child_process')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentNow, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const AGENT_ID = 'a90bd5e1-7580-11ef-0a80-18b7002017fc'
const STATE_ORDER_DELIVERED_ID = 'e1a0ae5f-33c5-11ea-0a80-043f000b275e'
const INVOICE_RETAIL_PRINT_TEMPLATE_ID = 'b2cde0a1-ec18-4ea5-ac56-813a26308f10'

const MARKER = `LAURA-ABIZOVA-PAYMENTIN-04769-${uaeToday()}`

const PAYMENT = {
  amountMinor: 131000,
  note: 'INV 04769 GENOSYS',
  invoiceName: '04769',
  invoiceId: '96c78c35-786f-11f1-0a80-04b6005ab0c1',
  shipmentName: '06480',
  shipmentId: '97664408-786f-11f1-0a80-0b5500592da3',
  orderName: 'GENCardM2607059596',
  orderId: '968fa8d2-786f-11f1-0a80-1148005d1576',
}

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
    if (res.status === 429 && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'ECONNRESET' || e.message === 'fetch failed')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function orgAccountHref(id) {
  return { meta: { href: `${API}/entity/account/${id}`, type: 'account', mediaType: 'application/json' } }
}

function stateHref(entityType, stateId) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function exportInvoicePdf(invoiceId, invoiceName) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/invoiceout/metadata/customtemplate/${INVOICE_RETAIL_PRINT_TEMPLATE_ID}`,
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
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Invoice export ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  const ordersDir = path.join(os.homedir(), 'Desktop', 'orders')
  fs.mkdirSync(ordersDir, { recursive: true })
  const safe = String(invoiceName).replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ordersDir, `GENOSYS_Laura_Abizova_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function printPdf(pdfPath) {
  try {
    execFileSync('lp', [pdfPath], { stdio: 'inherit' })
    console.log('    Sent to printer via lp')
  } catch (e) {
    console.warn('    lp failed, opening PDF:', e.message)
    execFileSync('open', [pdfPath], { stdio: 'inherit' })
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Miss Laura Abizova — paymentin @ 04769 + retail invoice print')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const [invoice, demand, order] = await Promise.all([
    api('GET', `/entity/invoiceout/${PAYMENT.invoiceId}?expand=agent`),
    api('GET', `/entity/demand/${PAYMENT.shipmentId}?expand=agent,invoicesOut`),
    api('GET', `/entity/customerorder/${PAYMENT.orderId}?expand=state,agent`),
  ])

  console.log(`  Customer: ${order.agent?.name}`)
  console.log(`  Order: ${order.name} | state: ${order.state?.name || '?'}`)
  console.log(`  Invoice ${invoice.name}: ${money(invoice.sum)} AED (paid ${money(invoice.payedSum)})`)
  console.log(`  Shipment ${demand.name}: ${money(demand.sum)} AED (paid ${money(demand.payedSum)})`)
  console.log(`  Payment: ${money(PAYMENT.amountMinor)} AED`)

  if (invoice.agent?.meta?.href?.split('/').pop() !== AGENT_ID) {
    throw new Error(`Invoice agent mismatch: ${invoice.agent?.name}`)
  }
  if (invoice.sum !== PAYMENT.amountMinor || demand.sum !== PAYMENT.amountMinor) {
    throw new Error(`Amount mismatch — expected ${money(PAYMENT.amountMinor)}`)
  }
  if (!(demand.invoicesOut || []).some((x) => x.meta.href.includes(PAYMENT.invoiceId))) {
    throw new Error(`${PAYMENT.shipmentName} not linked to invoice ${PAYMENT.invoiceName}`)
  }

  const dup = await api('GET', `/entity/paymentin?search=${encodeURIComponent(MARKER)}&limit=10`)
  if ((dup.rows || []).some((r) => (r.description || '').includes(MARKER))) {
    console.log('\n  SKIP payment — already booked for this invoice')
  } else if (demand.payedSum >= demand.sum) {
    console.log('\n  Shipment already paid')
  } else {
    const paymentMoment =
      new Date(uaeMomentNow()) > new Date(demand.moment)
        ? uaeMomentNow()
        : uaeMomentAddMinutes(1, new Date(demand.moment))

    if (!COMMIT) {
      console.log(`\n  Would post paymentin ${money(PAYMENT.amountMinor)} AED @ ${paymentMoment}`)
    } else {
      const created = await api('POST', '/entity/paymentin', {
        applicable: true,
        moment: paymentMoment,
        organization: href('organization', ORG_ID),
        agent: href('counterparty', AGENT_ID),
        organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
        sum: PAYMENT.amountMinor,
        description: [
          MARKER,
          PAYMENT.note,
          `Invoice ${PAYMENT.invoiceName} / shipment ${PAYMENT.shipmentName}`,
          `Order ${PAYMENT.orderName}`,
        ].join(' | '),
        operations: [
          {
            meta: {
              href: `${API}/entity/demand/${PAYMENT.shipmentId}`,
              type: 'demand',
              mediaType: 'application/json',
            },
            linkedSum: PAYMENT.amountMinor,
          },
        ],
      })

      const [invAfter, demAfter] = await Promise.all([
        api('GET', `/entity/invoiceout/${PAYMENT.invoiceId}`),
        api('GET', `/entity/demand/${PAYMENT.shipmentId}`),
      ])

      console.log(`\n  Paymentin: ${created.name} | ${money(created.sum)} AED`)
      console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${created.id}`)
      console.log(`  Invoice paid: ${money(invAfter.payedSum)} / ${money(invAfter.sum)} AED`)
      console.log(`  Shipment paid: ${money(demAfter.payedSum)} / ${money(demAfter.sum)} AED`)
    }
  }

  if (COMMIT && order.state?.meta?.href?.split('/').pop() !== STATE_ORDER_DELIVERED_ID) {
    await api('PUT', `/entity/customerorder/${PAYMENT.orderId}`, {
      meta: order.meta,
      state: stateHref('customerorder', STATE_ORDER_DELIVERED_ID),
    })
    const orderAfter = await api('GET', `/entity/customerorder/${PAYMENT.orderId}?expand=state`)
    console.log(`  Order ${orderAfter.name}: ${orderAfter.state?.name}`)
  }

  if (!COMMIT) {
    console.log('\n  Would export retail PDF + send to printer')
    console.log('  DRY RUN — re-run with --commit')
    return
  }

  console.log('\n  Exporting retail invoice PDF...')
  const pdfPath = await exportInvoicePdf(PAYMENT.invoiceId, PAYMENT.invoiceName)
  if (pdfPath) {
    console.log(`    Saved: ${pdfPath}`)
    await printPdf(pdfPath)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
