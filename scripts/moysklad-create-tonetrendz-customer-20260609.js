#!/usr/bin/env node

/**
 * Create MoySklad counterparty: TONETRENDZ LADIES COSMETIC & PERSONAL CARE CENTER L.L.C
 * Field layout matches FACE ROOM BEAUTY SALON CO (license in email field).
 * Legal address = license; actual address = salon unit (JVC).
 * No TRN — not VAT registered yet.
 *
 *   node --import dotenv/config scripts/moysklad-create-tonetrendz-customer-20260609.js
 *   node --import dotenv/config scripts/moysklad-create-tonetrendz-customer-20260609.js --commit
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

const LEGAL_ADDRESS = 'Office 214, Gita Shaira Offices, Arjan, Dubai'
const ACTUAL_ADDRESS = 'JVC, Binghatti Azure, commercial unit, Dubai'

const CUSTOMER = {
  name: 'TONETRENDZ LADIES COSMETIC & PERSONAL CARE CENTER L.L.C',
  phone: '+971555512913',
  email: '1626587',
  licenseNo: '1626587',
  licenseIssued: '2026-06-01',
  licenseExpires: '2027-05-31',
  contact: 'Madalina Bogdan',
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
    `/entity/counterparty?search=${encodeURIComponent('TONETRENDZ')}&limit=10`
  )
  const match = (bySearch?.rows || []).find((r) => r.name?.includes('TONETRENDZ'))
  if (match) return { cp: match, reason: 'search' }

  return null
}

async function main() {
  console.log('====================================================================')
  console.log('  MoySklad — create counterparty TONETRENDZ')
  console.log('====================================================================')
  console.log(`  Mode   : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Name   : ${CUSTOMER.name}`)
  console.log(`  Phone  : ${CUSTOMER.phone}`)
  console.log(`  License: ${CUSTOMER.licenseNo} (email + fax fields — Face Room pattern)`)
  console.log(`  Legal  : ${LEGAL_ADDRESS}`)
  console.log(`  Actual : ${ACTUAL_ADDRESS}`)
  console.log(`  Note   : No TRN — not VAT registered`)

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
    fax: CUSTOMER.licenseNo, // License # on consignment stock note (contact.faxes — Face Room pattern)
    description: [
      `Contact: ${CUSTOMER.contact}. License ${CUSTOMER.licenseNo} (${CUSTOMER.licenseIssued} → ${CUSTOMER.licenseExpires}).`,
      'Setup: 2 cosmetologists; Hydra Beauty 14-in-1 Hydra Facial + Eximia.',
      'Rule: professional consumables = invoice only, never consignment. Retail home-care = consignment OK.',
    ].join(' '),
    legalAddress: LEGAL_ADDRESS,
    actualAddress: ACTUAL_ADDRESS,
    legalAddressFull: {
      addInfo: LEGAL_ADDRESS,
    },
    actualAddressFull: {
      addInfo: ACTUAL_ADDRESS,
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
