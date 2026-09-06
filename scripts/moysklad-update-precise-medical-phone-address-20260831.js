#!/usr/bin/env node

/**
 * PRECISE MEDICAL CENTER L.L.C — add phone + Sharjah address.
 * Updates CP + SO shipment. Reissues proforma. addInfo stays empty.
 *
 *   node --import dotenv/config scripts/moysklad-update-precise-medical-phone-address-20260831.js
 *   node --import dotenv/config scripts/moysklad-update-precise-medical-phone-address-20260831.js --commit
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

const AGENT_ID = '958a6535-a533-11f1-0a80-0fb500d3e92c'
const ORDER_ID = '9a08c3b9-a533-11f1-0a80-1ecb00d00a73'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const ORDER_PROFORMA_TEMPLATE_ID = '80b38aad-4f55-4bd8-a4a4-d8ed5bf69d2f'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const EXPECTED_NAME = 'PRECISE MEDICAL CENTER L.L.C'
const PHONE = '+971506684025'
const CITY = 'Sharjah'
const STREET = '8F35+Q32 - Muwaileh Commercial - Industrial Area'

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
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

function addressFull() {
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: CITY,
    street: STREET,
    addInfo: '',
  }
}

async function exportOrderPdf(orderId, orderName) {
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
    throw new Error(`SO export ${res.status}: ${(await res.text()).slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location, { headers: { Authorization: AUTH } })
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const safe = String(orderName || 'SO').replace(/[^\w.-]+/g, '_')
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Precise_Medical_Center_${safe}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  const order = await api('GET', `/entity/customerorder/${ORDER_ID}?expand=agent`)
  if (agent.name !== EXPECTED_NAME) throw new Error(`Unexpected agent ${agent.name}`)
  if (order.name !== 'GENCardM260831PMC') throw new Error(`Unexpected SO ${order.name}`)
  if (!/precise medical/i.test(order.agent?.name || '')) {
    throw new Error(`SO agent ${order.agent?.name}`)
  }
  if ((order.invoicesOut?.meta?.size || 0) > 0 || (order.demands?.meta?.size || 0) > 0) {
    throw new Error('SO has invoice/shipment — stop, this is SO-only')
  }

  const full = addressFull()
  console.log('====================================================================')
  console.log('  Precise Medical Center — phone + Sharjah address')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Phone was: ${agent.phone || '—'}`)
  console.log(`  Addr  was: ${agent.actualAddress || agent.actualAddressFull?.street || '—'}`)
  console.log(`  Phone now: ${PHONE}`)
  console.log(`  Addr  now: UAE, ${CITY}, ${STREET}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const updated = await api('PUT', `/entity/counterparty/${AGENT_ID}`, {
    meta: agent.meta,
    name: agent.name,
    email: agent.email || '922438',
    phone: PHONE,
    companyType: 'legal',
    actualAddress: `UAE, ${CITY}, ${STREET}`,
    legalAddress: `UAE, ${CITY}, ${STREET}`,
    actualAddressFull: full,
    legalAddressFull: full,
    description: [
      'Clinic. DET trade license 922438. Registration 917026.',
      'Arabic: مركز المتقن الطبي ذ.م.م. Issued 18-08-2025. Expiry on license 18-08-2026.',
      `Phone ${PHONE}. Sharjah: ${STREET}.`,
      'Face Room pattern: license in email field. No street in addInfo. TRN TBC.',
    ].join(' '),
  })

  await api('PUT', `/entity/customerorder/${ORDER_ID}`, {
    meta: order.meta,
    shipmentAddressFull: full,
  })

  const pdfPath = await exportOrderPdf(ORDER_ID, order.name)
  console.log(`  Phone now: ${updated.phone}`)
  console.log(`  Street now: ${updated.actualAddressFull?.street || '—'}`)
  console.log(`  City now: ${updated.actualAddressFull?.city || '—'}`)
  console.log(`  PDF: ${pdfPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
