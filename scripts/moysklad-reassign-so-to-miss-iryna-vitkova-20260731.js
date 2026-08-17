#!/usr/bin/env node

/**
 * Create Miss Iryna Vitkova + reassign SO GENCardM260731SHKA off Admin Shakirovna.
 * Clinic prices already on the order (1,725 AED). SO only — re-export PDF → ~/Desktop/orders/
 *
 *   Dubai Marina, Sparkle Towers 2, apt 608
 *   Phone: 0527447420
 *
 *   node --import dotenv/config scripts/moysklad-reassign-so-to-miss-iryna-vitkova-20260731.js
 *   node --import dotenv/config scripts/moysklad-reassign-so-to-miss-iryna-vitkova-20260731.js --commit
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

const { uaeToday, uaeShortDate } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const ORDER_ID = '4fb9ca08-8d05-11f1-0a80-15ef0024e490' // was Admin Shakirovna GENCardM260731SHKA
const ORDER_PROFORMA_TEMPLATE_ID = '80b38aad-4f55-4bd8-a4a4-d8ed5bf69d2f'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const CUSTOMER = {
  name: 'Miss Iryna Vitkova',
  phone: '0527447420',
  city: 'Dubai',
  // street only — do NOT also put the same text in addInfo (MoySklad concatenates both → duplicate)
  street: 'Sparkle Towers 2, apt 608, Dubai Marina',
}

const NEW_ORDER_NAME = `GENCardM${uaeShortDate()}7420`
const MARKER = `MISS-IRYNA-VITKOVA-CLINIC-SO-${uaeToday()}`
const EXPECTED_SUM_MINOR = 172500

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

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function shipmentAddress() {
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
    addInfo: '',
  }
}

async function findExisting() {
  for (const q of [CUSTOMER.phone, CUSTOMER.name, 'Vitkova']) {
    const d = await api('GET', `/entity/counterparty?search=${encodeURIComponent(q)}&limit=15`)
    const hit = (d.rows || []).find(
      (r) =>
        r.name === CUSTOMER.name ||
        String(r.phone || '').replace(/\D/g, '').endsWith('527447420') ||
        /vitkova/i.test(r.name || ''),
    )
    if (hit) return hit
  }
  return null
}

async function findOrCreateCounterparty() {
  const existing = await findExisting()
  if (existing) {
    console.log(`  Customer exists: ${existing.name} (${existing.id})`)
    if (COMMIT) {
      const addr = shipmentAddress()
      await api('PUT', `/entity/counterparty/${existing.id}`, {
        name: CUSTOMER.name,
        phone: CUSTOMER.phone,
        companyType: 'individual',
        actualAddress: CUSTOMER.street,
        legalAddress: CUSTOMER.street,
        actualAddressFull: addr,
        legalAddressFull: addr,
        description: `Retail / clinic — ${CUSTOMER.street}. Phone ${CUSTOMER.phone}.`,
      })
    }
    return existing
  }
  if (!COMMIT) {
    console.log(`  DRY RUN: would create ${CUSTOMER.name} | ${CUSTOMER.phone}`)
    return { id: 'DRY-RUN', name: CUSTOMER.name }
  }
  const addr = shipmentAddress()
  const created = await api('POST', '/entity/counterparty', {
    name: CUSTOMER.name,
    phone: CUSTOMER.phone,
    companyType: 'individual',
    actualAddress: CUSTOMER.street,
    legalAddress: CUSTOMER.street,
    actualAddressFull: addr,
    legalAddressFull: addr,
    description: `Retail / clinic — ${CUSTOMER.street}. Phone ${CUSTOMER.phone}. Created ${uaeToday()}.`,
  })
  console.log(`  Created customer: ${created.name} (${created.id})`)
  return created
}

async function exportOrderPdf(orderId, orderName) {
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const body = {
    template: {
      meta: {
        href: `${API}/entity/customerorder/metadata/customtemplate/${ORDER_PROFORMA_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/customerorder/${orderId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    throw new Error(`Export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  const out = path.join(ORDERS_DIR, `GENOSYS_Miss_Iryna_Vitkova_${orderName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

async function main() {
  console.log('====================================================================')
  console.log('  Miss Iryna Vitkova — create CP + reassign clinic SO')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const order = await api('GET', `/entity/customerorder/${ORDER_ID}?expand=agent`)
  console.log(`  Current SO: ${order.name} | ${money(order.sum)} | agent: ${order.agent?.name}`)
  console.log(`  New name  : ${NEW_ORDER_NAME}`)
  console.log(`  Ship to   : ${CUSTOMER.street}`)

  if ((order.sum || 0) !== EXPECTED_SUM_MINOR) {
    throw new Error(`Unexpected order sum ${money(order.sum)} (expected ${money(EXPECTED_SUM_MINOR)})`)
  }

  const agent = await findOrCreateCounterparty()

  if (!COMMIT) {
    console.log('\n  DRY RUN — would reassign SO to Miss Iryna Vitkova + re-export PDF')
    return
  }

  // Ensure new order name free (unless already this order)
  if (order.name !== NEW_ORDER_NAME) {
    const taken = await api(
      'GET',
      `/entity/customerorder?filter=name=${encodeURIComponent(NEW_ORDER_NAME)}&limit=1`,
    )
    if (taken?.rows?.length && taken.rows[0].id !== ORDER_ID) {
      throw new Error(`Order name taken: ${NEW_ORDER_NAME}`)
    }
  }

  const addr = shipmentAddress()
  const updated = await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: order.meta,
    name: NEW_ORDER_NAME,
    agent: href('counterparty', agent.id),
    shipmentAddressFull: addr,
    description: [
      MARKER,
      'Reassigned from Admin Shakirovna Salon — wrong customer.',
      `Miss Iryna Vitkova | ${CUSTOMER.phone} | ${CUSTOMER.street}.`,
      'Clinic list SO only — toner/serum problem control, ND Cell ×3, blemish balm ×4, SPF40 ×2, hyaluron serum ×1.',
      `Total ${money(EXPECTED_SUM_MINOR)} AED.`,
    ].join('\n'),
  })

  console.log(`\n  Updated SO: ${updated.name} | ${money(updated.sum)} AED`)
  console.log(`  Agent: Miss Iryna Vitkova (${agent.id})`)
  console.log(`  https://online.moysklad.ru/app/#customerorder/edit?id=${updated.id}`)

  const pdfPath = await exportOrderPdf(updated.id, updated.name)
  console.log(`  PDF: ${pdfPath}`)

  // Remove stale Admin-named PDF if present
  const stale = path.join(ORDERS_DIR, 'GENOSYS_Admin_Shakirovna_GENCardM260731SHKA.pdf')
  if (fs.existsSync(stale)) {
    fs.unlinkSync(stale)
    console.log(`  Removed stale: ${stale}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
