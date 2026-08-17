#!/usr/bin/env node

/**
 * Create MoySklad counterparty: CEIA CLINIC L.L.C
 * Field layout matches FACE ROOM BEAUTY SALON CO:
 *   email + fax = trade license #
 *   legalAddressFull.comment = VAT TRN
 *
 * Source docs:
 *   ~/Desktop/Drive/Genosys/Contract_Customers/CEIA/
 *   - CEIA CLINIC L.L.C VAT CERTIFICATE.pdf
 *   - CEIA CLINIC DHA 2026.pdf
 *
 *   node --import dotenv/config scripts/moysklad-create-ceia-clinic-customer-20260731.js
 *   node --import dotenv/config scripts/moysklad-create-ceia-clinic-customer-20260731.js --commit
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

const ADDRESS = 'Villa No. 2, Al Manara, Dubai, United Arab Emirates'

const CUSTOMER = {
  name: 'CEIA CLINIC L.L.C',
  phone: '+971561149495',
  licenseNo: '655053', // Dubai Economy and Tourism (DED) — also on DHA license
  dhaLicense: '7761447',
  trn: '105454133700003',
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
    `/entity/counterparty?filter=phone=${encodeURIComponent(CUSTOMER.phone)}&limit=5`,
  )
  if (byPhone?.rows?.length) return { cp: byPhone.rows[0], reason: 'phone' }

  const byName = await api(
    'GET',
    `/entity/counterparty?filter=${encodeURIComponent(`name=${CUSTOMER.name}`)}&limit=5`,
  )
  const exact = (byName?.rows || []).find((r) => r.name === CUSTOMER.name)
  if (exact) return { cp: exact, reason: 'name' }

  const bySearch = await api('GET', `/entity/counterparty?search=${encodeURIComponent('CEIA')}&limit=15`)
  const hit = (bySearch?.rows || []).find((r) => /CEIA/i.test(r.name || ''))
  if (hit) return { cp: hit, reason: 'search' }

  return null
}

async function main() {
  console.log('====================================================================')
  console.log('  MoySklad — create counterparty CEIA CLINIC L.L.C')
  console.log('====================================================================')
  console.log(`  Mode    : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Name    : ${CUSTOMER.name}`)
  console.log(`  Phone   : ${CUSTOMER.phone}`)
  console.log(`  License : ${CUSTOMER.licenseNo} (email + fax)`)
  console.log(`  DHA     : ${CUSTOMER.dhaLicense}`)
  console.log(`  TRN     : ${CUSTOMER.trn} (legalAddressFull.comment)`)
  console.log(`  Address : ${ADDRESS}`)
  console.log('  Pattern : Face Room (license email/fax, TRN in comment)')

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
    email: CUSTOMER.licenseNo,
    fax: CUSTOMER.licenseNo,
    legalAddress: ADDRESS,
    actualAddress: ADDRESS,
    legalAddressFull: {
      addInfo: ADDRESS,
      comment: CUSTOMER.trn,
    },
    actualAddressFull: {
      addInfo: ADDRESS,
    },
    description: [
      'Clinic customer — CEIA CLINIC L.L.C',
      `DED license ${CUSTOMER.licenseNo} | DHA ${CUSTOMER.dhaLicense}`,
      `VAT TRN ${CUSTOMER.trn} (effective 01/01/2026)`,
      'Sources: Contract_Customers/CEIA VAT + DHA 2026 PDFs',
      'Face Room field layout: email+fax = trade license #; legalAddressFull.comment = TRN.',
    ].join(' | '),
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN payload:')
    console.log(JSON.stringify(payload, null, 2))
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const created = await api('POST', '/entity/counterparty', payload)

  console.log(`\n  Created: ${created.name}`)
  console.log(`  ID     : ${created.id}`)
  console.log(`  Phone  : ${created.phone || CUSTOMER.phone}`)
  console.log(`  Email  : ${created.email || CUSTOMER.licenseNo}`)
  console.log(`  Fax    : ${created.fax || CUSTOMER.licenseNo}`)
  console.log(`  TRN    : ${created.legalAddressFull?.comment || CUSTOMER.trn}`)
  console.log(`  UI     : https://online.moysklad.ru/app/#company/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
