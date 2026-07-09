#!/usr/bin/env node

/**
 * Create MoySklad counterparty (supplier): SLIDER DELIVERY SERVICE.
 *
 * Source: Slider tax invoice #13171-20260614-2110 (range 2026-01-01 .. 2026-06-14).
 *   From : SLIDER DELIVERY SERVICE, UAE, TRN 105010526900003, phone 026665512,
 *          accounting@slider-app.com
 *   To   : Genosys Middle East FZ-LLC, TRN 104229886700003
 *
 * Purpose: last-mile delivery supplier. Monthly delivery expense (paymentout)
 * will be booked against this counterparty going forward; input VAT (5%)
 * recoverable from Slider tax invoices.
 *
 * TRN is written to the `inn` field (MoySklad tax-id) AND the description.
 * If `inn` validation rejects the 15-digit UAE TRN, the script retries
 * without `inn` (TRN still preserved in description).
 *
 *   node --import dotenv/config scripts/moysklad-create-slider-supplier-20260614.js
 *   node --import dotenv/config scripts/moysklad-create-slider-supplier-20260614.js --commit
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

const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'

const SUPPLIER = {
  name: 'SLIDER DELIVERY SERVICE',
  phone: '+97126665512',
  email: 'accounting@slider-app.com',
  trn: '105010526900003',
  city: 'Abu Dhabi',
  marker: `Slider last-mile delivery supplier; TRN 105010526900003; per tax invoice #13171-20260614-2110 (${uaeToday()})`,
}

async function api(method, path, body) {
  const res = await fetch(path.startsWith('http') ? path : API + path, {
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
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${method} ${path} - ${text.slice(0, 1200)}`)
    err.status = res.status
    err.body = text
    throw err
  }
  return text ? JSON.parse(text) : null
}

function countryHref() {
  return {
    meta: {
      href: `${API}/entity/country/${COUNTRY_UAE_ID}`,
      type: 'country',
      mediaType: 'application/json',
    },
  }
}

async function findExisting() {
  const byPhone = await api(
    'GET',
    `/entity/counterparty?filter=phone=${encodeURIComponent(SUPPLIER.phone)}&limit=5`
  )
  if (byPhone?.rows?.length) return { cp: byPhone.rows[0], reason: 'phone' }

  const byName = await api(
    'GET',
    `/entity/counterparty?filter=${encodeURIComponent(`name=${SUPPLIER.name}`)}&limit=5`
  )
  const exact = (byName?.rows || []).find((r) => r.name === SUPPLIER.name)
  if (exact) return { cp: exact, reason: 'name' }

  const bySearch = await api('GET', `/entity/counterparty?search=Slider&limit=10`)
  const match = (bySearch?.rows || []).find((r) => /slider/i.test(r.name || ''))
  if (match) return { cp: match, reason: 'search' }

  return null
}

async function main() {
  console.log('====================================================================')
  console.log('  MoySklad — create supplier SLIDER DELIVERY SERVICE')
  console.log('====================================================================')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Name : ${SUPPLIER.name}`)
  console.log(`  Phone: ${SUPPLIER.phone}`)
  console.log(`  Email: ${SUPPLIER.email}`)
  console.log(`  TRN  : ${SUPPLIER.trn}`)
  console.log(`  City : ${SUPPLIER.city}`)

  const existing = await findExisting()
  if (existing) {
    console.log(`\n  Already exists (${existing.reason}): ${existing.cp.name} (${existing.cp.id})`)
    console.log(`  inn on record: ${JSON.stringify(existing.cp.inn)}`)
    console.log(`  https://online.moysklad.ru/app/#company/edit?id=${existing.cp.id}`)
    return
  }

  const addr = {
    country: countryHref(),
    city: SUPPLIER.city,
  }

  const base = {
    name: SUPPLIER.name,
    companyType: 'legal',
    phone: SUPPLIER.phone,
    email: SUPPLIER.email,
    legalTitle: SUPPLIER.name,
    description: SUPPLIER.marker,
    actualAddressFull: addr,
    legalAddressFull: addr,
  }
  const withInn = { ...base, inn: SUPPLIER.trn }

  if (!COMMIT) {
    console.log('\n  DRY RUN payload (TRN in inn + description):')
    console.log(JSON.stringify(withInn, null, 2))
    console.log('\n  DRY RUN — re-run with --commit.')
    return
  }

  let created
  try {
    created = await api('POST', '/entity/counterparty', withInn)
    console.log('\n  Created WITH inn=TRN.')
  } catch (e) {
    if (e.status === 400 && /inn/i.test(e.body || '')) {
      console.log('\n  inn field rejected the 15-digit TRN — retrying without inn (TRN kept in description).')
      created = await api('POST', '/entity/counterparty', base)
    } else {
      throw e
    }
  }

  console.log(`\n  Created: ${created.name}`)
  console.log(`  ID     : ${created.id}`)
  console.log(`  inn    : ${JSON.stringify(created.inn)}`)
  console.log(`  Phone  : ${created.phone || SUPPLIER.phone}`)
  console.log(`  Email  : ${created.email || SUPPLIER.email}`)
  console.log(`  UI     : https://online.moysklad.ru/app/#company/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
