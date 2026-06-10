#!/usr/bin/env node

/**
 * Create MoySklad counterparty: ARAK SALE OF COSMETICS L.L.C (Korean House, Ajman).
 * Field layout matches FACE ROOM BEAUTY SALON CO (license in email, TRN in legalAddressFull.comment).
 *
 *   node --import dotenv/config scripts/moysklad-create-arak-sale-cosmetics-customer-20260608.js
 *   node --import dotenv/config scripts/moysklad-create-arak-sale-cosmetics-customer-20260608.js --commit
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

const ADDRESS = 'Shop No. 17, Rashideya 3, Ajman'

const CUSTOMER = {
  name: 'ARAK SALE OF COSMETICS L.L.C',
  phone: '+971561311927',
  email: '124922',
  trn: '105038274400001',
  licenseNo: '124922',
  registerNo: '201828563',
  brand: 'Korean House',
  website: 'www.arakskincare.com',
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
    `/entity/counterparty?search=${encodeURIComponent('ARAK SALE')}&limit=10`
  )
  const arak = (bySearch?.rows || []).find(
    (r) => r.name?.includes('ARAK') && r.name?.includes('COSMETICS')
  )
  if (arak) return { cp: arak, reason: 'search' }

  return null
}

async function main() {
  console.log('====================================================================')
  console.log('  MoySklad — create counterparty ARAK SALE OF COSMETICS L.L.C')
  console.log('====================================================================')
  console.log(`  Mode   : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Name   : ${CUSTOMER.name}`)
  console.log(`  Phone  : ${CUSTOMER.phone}`)
  console.log(`  License: ${CUSTOMER.licenseNo} (email field)`)
  console.log(`  TRN    : ${CUSTOMER.trn} (legalAddressFull.comment)`)
  console.log(`  Address: ${ADDRESS}`)

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
      comment: CUSTOMER.trn,
    },
    actualAddressFull: {
      addInfo: ADDRESS,
    },
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN payload:')
    console.log(JSON.stringify(payload, null, 2))
    console.log('\n  DRY RUN — would create counterparty. Re-run with --commit.')
    return
  }

  const created = await api('POST', '/entity/counterparty', payload)

  console.log(`\n  Created: ${created.name}`)
  console.log(`  ID     : ${created.id}`)
  console.log(`  Phone  : ${created.phone || CUSTOMER.phone}`)
  console.log(`  Email  : ${created.email || CUSTOMER.email}`)
  console.log(`  TRN    : ${created.legalAddressFull?.comment || CUSTOMER.trn}`)
  console.log(`  UI     : https://online.moysklad.ru/app/#company/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
