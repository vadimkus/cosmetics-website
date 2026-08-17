#!/usr/bin/env node

/**
 * NOVA MEDICAL CENTER — update address + VAT TRN (Face Room pattern).
 *
 * Face Room layout:
 *   email + fax = trade licence #
 *   legalAddress / actualAddress / addInfo = street address
 *   legalAddressFull.comment = VAT TRN
 *
 *   node --import dotenv/config scripts/moysklad-update-nova-medical-center-address-trn-20260815.js
 *   node --import dotenv/config scripts/moysklad-update-nova-medical-center-address-trn-20260815.js --commit
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

const AGENT_ID = '02800064-9640-11f1-0a80-081e0029744b'
const ORDER_NAME = 'GENCardM260812NOVA'

const CUSTOMER = {
  name: 'NOVA MEDICAL CENTER',
  licenseNo: 'CN-1212562',
  trn: '100255565200003',
  address:
    'Al Noor Complex, Al Muwaiji, Saed Bin Tahnon Al Awal St, Al Ain, Abu Dhabi, United Arab Emirates',
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

async function main() {
  console.log('====================================================================')
  console.log('  NOVA MEDICAL CENTER — address + TRN (Face Room pattern)')
  console.log('====================================================================')
  console.log(`  Mode    : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Address : ${CUSTOMER.address}`)
  console.log(`  TRN     : ${CUSTOMER.trn} → legalAddressFull.comment`)
  console.log(`  License : ${CUSTOMER.licenseNo} → email + fax`)

  const cp = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  if (cp.name !== CUSTOMER.name) {
    throw new Error(`Unexpected name: ${cp.name}`)
  }

  console.log('\n  Before:')
  console.log(`    email   : ${cp.email || '—'}`)
  console.log(`    fax     : ${cp.fax || '—'}`)
  console.log(`    legal   : ${cp.legalAddress || '—'}`)
  console.log(`    actual  : ${cp.actualAddress || '—'}`)
  console.log(`    comment : ${cp.legalAddressFull?.comment || '—'}`)

  const payload = {
    meta: cp.meta,
    name: CUSTOMER.name,
    companyType: 'legal',
    phone: cp.phone,
    email: CUSTOMER.licenseNo,
    fax: CUSTOMER.licenseNo,
    legalAddress: CUSTOMER.address,
    actualAddress: CUSTOMER.address,
    legalAddressFull: {
      addInfo: CUSTOMER.address,
      comment: CUSTOMER.trn,
    },
    actualAddressFull: {
      addInfo: CUSTOMER.address,
    },
    description: [
      'Clinic customer — NOVA MEDICAL CENTER (Al Ain Establishment)',
      'Owner MUBARAK SALEM OWAIDA JABER ALKHYELI',
      `ADRA licence ${CUSTOMER.licenseNo}`,
      `VAT TRN ${CUSTOMER.trn}`,
      'Unified Reg 101-2021-100040598 | Unified Licence 501-2011-100087420',
      'Contact email aljaziraenterprise@yahoo.com',
      `Address updated ${uaeToday()}: Al Noor Complex, Al Muwaiji`,
      'Face Room layout: email+fax = trade licence #; legalAddressFull.comment = TRN.',
    ].join(' | '),
  }

  console.log('\n  After:')
  console.log(`    email   → ${CUSTOMER.licenseNo}`)
  console.log(`    fax     → ${CUSTOMER.licenseNo}`)
  console.log(`    address → ${CUSTOMER.address}`)
  console.log(`    TRN     → ${CUSTOMER.trn}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const updated = await api('PUT', `/entity/counterparty/${AGENT_ID}`, payload)
  console.log(`\n  Updated: ${updated.name} (${updated.id})`)
  console.log(`    email : ${updated.email}`)
  console.log(`    fax   : ${updated.fax}`)
  console.log(`    legal : ${updated.legalAddress}`)
  console.log(`    TRN   : ${updated.legalAddressFull?.comment}`)
  console.log(`  UI: https://online.moysklad.ru/app/#company/edit?id=${AGENT_ID}`)

  const orders = await api(
    'GET',
    `/entity/customerorder?filter=name=${encodeURIComponent(ORDER_NAME)}&limit=1`,
  )
  const order = orders?.rows?.[0]
  if (order) {
    await api('PUT', `/entity/customerorder/${order.id}`, {
      meta: order.meta,
      shipmentAddressFull: {
        addInfo: CUSTOMER.address,
        street: '',
        city: '',
      },
    })
    console.log(`  SO ${ORDER_NAME} shipment address updated`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
