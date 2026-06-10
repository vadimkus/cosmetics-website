#!/usr/bin/env node

/**
 * Patch MoySklad counterparty Rise UP — contact Irina Kovalenko.
 *
 *   node --import dotenv/config scripts/moysklad-update-rise-up-contact-20260603.js
 *   node --import dotenv/config scripts/moysklad-update-rise-up-contact-20260603.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

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
  street: 'Office 906, The Metropolis Tower, Business Bay',
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

async function main() {
  console.log('====================================================================')
  console.log('  MoySklad — patch Rise UP contact')
  console.log('====================================================================')
  console.log(`  Mode   : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  ID     : ${CUSTOMER.id}`)
  console.log(`  Email  : ${CUSTOMER.email}`)
  console.log(`  Contact: ${CUSTOMER.contactName} ${CUSTOMER.contactPhone}`)

  const current = await api('GET', `/entity/counterparty/${CUSTOMER.id}`)
  console.log('\n  Current:')
  console.log(`    phone      : ${current.phone || '—'}`)
  console.log(`    email      : ${current.email || '—'}`)
  console.log(`    description: ${(current.description || '—').slice(0, 120)}`)
  console.log(
    `    address    : ${current.actualAddressFull?.street || current.legalAddressFull?.street || '—'}`
  )

  const addr = {
    country: countryHref(),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
  }

  const payload = {
    phone: CUSTOMER.phone,
    email: CUSTOMER.email,
    description: `Rise UP Business Bay; contact: ${CUSTOMER.contactName} ${CUSTOMER.contactPhone}`,
    actualAddressFull: addr,
    legalAddressFull: addr,
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — would PATCH counterparty. Re-run with --commit.')
    return
  }

  const updated = await api('PUT', `/entity/counterparty/${CUSTOMER.id}`, payload)
  console.log('\n  Updated:')
  console.log(`    phone      : ${updated.phone}`)
  console.log(`    email      : ${updated.email}`)
  console.log(`    description: ${updated.description}`)
  console.log(`    UI         : https://online.moysklad.ru/app/#company/edit?id=${updated.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
