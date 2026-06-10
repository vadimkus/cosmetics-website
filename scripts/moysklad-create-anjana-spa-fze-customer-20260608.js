#!/usr/bin/env node

/**
 * Create MoySklad counterparty: ANJANA SPA - FZE (Palm Jumeirah, Dubai).
 * Field layout matches FACE ROOM BEAUTY SALON CO (license in email field).
 * No TRN on trade license — legalAddressFull has addInfo only.
 *
 *   node --import dotenv/config scripts/moysklad-create-anjana-spa-fze-customer-20260608.js
 *   node --import dotenv/config scripts/moysklad-create-anjana-spa-fze-customer-20260608.js --commit
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

const ADDRESS = 'Anjana Spa at Rixos Premium Saadiyat Island, Abu Dhabi'

const CUSTOMER = {
  name: 'ANJANA SPA - FZE',
  phone: '+971507558090',
  email: '3249', // PCFC Trakhees license no. (Face Room pattern)
  licenseNo: '3249',
  manager: 'ANNA FERLEGER',
  activity: 'Ladies Massage & Relaxation Center',
  licenseExpiry: '2026-09-05',
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} — ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
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

  const bySearch = await api(
    'GET',
    `/entity/counterparty?search=${encodeURIComponent('ANJANA SPA')}&limit=10`
  )
  const match = (bySearch?.rows || []).find((r) => r.name?.includes('ANJANA SPA'))
  if (match) return { cp: match, reason: 'search' }

  return null
}

async function main() {
  console.log('====================================================================')
  console.log('  MoySklad — create counterparty ANJANA SPA - FZE')
  console.log('====================================================================')
  console.log(`  Mode   : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Name   : ${CUSTOMER.name}`)
  console.log(`  Phone  : ${CUSTOMER.phone}`)
  console.log(`  License: ${CUSTOMER.licenseNo} (email field)`)
  console.log(`  Address: ${ADDRESS}`)
  console.log(`  Note   : No TRN on license — comment field omitted`)

  const existing = await findExisting()
  if (existing) {
    console.log(`\n  Already exists (${existing.reason}): ${existing.cp.name} (${existing.cp.id})`)
    console.log(`  https://online.moysklad.ru/app/#company/edit?id=${existing.cp.id}`)
    return
  }

  const payload = {
    name: CUSTOMER.name,
    companyType: 'legal',
    phone: CUSTOMER.phone,
    email: CUSTOMER.email,
    legalAddress: ADDRESS,
    actualAddress: ADDRESS,
    legalAddressFull: {
      addInfo: ADDRESS,
    },
    actualAddressFull: {
      addInfo: ADDRESS,
    },
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN payload:')
    console.log(JSON.stringify(payload, null, 2))
    console.log('\n  DRY RUN — re-run with --commit.')
    return
  }

  const created = await api('POST', '/entity/counterparty', payload)

  console.log(`\n  Created: ${created.name}`)
  console.log(`  ID     : ${created.id}`)
  console.log(`  Phone  : ${created.phone || CUSTOMER.phone}`)
  console.log(`  Email  : ${created.email || CUSTOMER.email}`)
  console.log(`  UI     : https://online.moysklad.ru/app/#company/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
