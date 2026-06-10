#!/usr/bin/env node

/**
 * Create MoySklad counterparty: Rise UP (Business Bay, Dubai).
 *
 *   node --import dotenv/config scripts/moysklad-create-rise-up-customer-20260601.js
 *   node --import dotenv/config scripts/moysklad-create-rise-up-customer-20260601.js --commit
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

const CUSTOMER = {
  id: 'b83e0d80-5d8f-11f1-0a80-065d0075240c',
  name: 'Rise UP',
  phone: '+971585309320',
  email: 'Irina_01-01@mail.ru',
  contactName: 'Irina Kovalenko',
  contactPhone: '+971501025360',
  city: 'Dubai',
  street:
    'Office 906, The Metropolis Tower, Business Bay',
  marker: `Rise UP customer Business Bay ${uaeToday()}`,
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} - ${text.slice(0, 1200)}`)
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
    `/entity/counterparty?filter=phone=${encodeURIComponent(CUSTOMER.phone)}&limit=5`
  )
  if (byPhone?.rows?.length) return { cp: byPhone.rows[0], reason: 'phone' }

  const byName = await api(
    'GET',
    `/entity/counterparty?filter=${encodeURIComponent(`name=${CUSTOMER.name}`)}&limit=5`
  )
  const exact = (byName?.rows || []).find((r) => r.name === CUSTOMER.name)
  if (exact) return { cp: exact, reason: 'name' }

  return null
}

async function main() {
  console.log('====================================================================')
  console.log('  MoySklad — create counterparty Rise UP')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Name   : ${CUSTOMER.name}`)
  console.log(`  Phone  : ${CUSTOMER.phone}`)
  console.log(`  Address: ${CUSTOMER.street}, ${CUSTOMER.city}`)

  const existing = await findExisting()
  if (existing) {
    console.log(`\n  Already exists (${existing.reason}): ${existing.cp.name} (${existing.cp.id})`)
    console.log(`  https://online.moysklad.ru/app/#company/edit?id=${existing.cp.id}`)
    return
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — would create counterparty. Re-run with --commit.')
    return
  }

  const addr = {
    country: countryHref(),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
  }

  const created = await api('POST', '/entity/counterparty', {
    name: CUSTOMER.name,
    phone: CUSTOMER.phone,
    email: CUSTOMER.email,
    companyType: 'legal',
    description: `${CUSTOMER.marker}; contact: ${CUSTOMER.contactName} ${CUSTOMER.contactPhone}`,
    actualAddressFull: addr,
    legalAddressFull: addr,
  })

  console.log(`\n  Created: ${created.name}`)
  console.log(`  ID     : ${created.id}`)
  console.log(`  Phone  : ${created.phone || CUSTOMER.phone}`)
  console.log(`  UI     : https://online.moysklad.ru/app/#company/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
