#!/usr/bin/env node

/**
 * Serene Skin Beauty Salon LLC — add VAT TRN (Face Room pattern).
 *
 * Face Room layout:
 *   - License number → email (+ fax for stock note License #)
 *   - TRN → legalAddressFull.comment
 *
 * Source: FTA VAT registration certificate (effective 2026-07-01)
 *
 *   node --import dotenv/config scripts/moysklad-update-serene-skin-trn-20260629.js
 *   node --import dotenv/config scripts/moysklad-update-serene-skin-trn-20260629.js --commit
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

const AGENT_ID = '993395aa-8da2-11ec-0a80-006b0038cd99' // Serene Skin Beauty Salon LLC

const CUSTOMER = {
  name: 'Serene Skin Beauty Salon LLC',
  phone: '+971564715477',
  licenseNo: '1566518',
  trn: '105207755700003',
  address: 'Shop-1, The Derby Residence 3, Nad Al Shiba First, Dubai',
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
    if (res.status === 429 && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Serene Skin — VAT TRN update (Face Room pattern)')
  console.log('====================================================================')
  console.log(`  Mode    : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  TRN     : ${CUSTOMER.trn}`)
  console.log(`  License : ${CUSTOMER.licenseNo} → email + fax`)

  const cp = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  console.log(`\n  Customer: ${cp.name}`)
  console.log(`  Current email : ${cp.email || '—'}`)
  console.log(`  Current fax   : ${cp.fax || '—'}`)
  console.log(`  Current TRN   : ${cp.legalAddressFull?.comment || '—'}`)

  const legalAddressFull = {
    ...(cp.legalAddressFull || {}),
    addInfo: cp.legalAddressFull?.addInfo || CUSTOMER.address,
    comment: CUSTOMER.trn,
  }

  const needsEmail = cp.email !== CUSTOMER.licenseNo
  const needsFax = cp.fax !== CUSTOMER.licenseNo
  const needsTrn = cp.legalAddressFull?.comment !== CUSTOMER.trn

  if (!needsEmail && !needsFax && !needsTrn) {
    console.log('\n  Already set — no update needed.')
    console.log(`  UI: https://online.moysklad.ru/app/#company/edit?id=${AGENT_ID}`)
    return
  }

  if (!COMMIT) {
    console.log('\n  Would set:')
    if (needsEmail) console.log(`    email → ${CUSTOMER.licenseNo}`)
    if (needsFax) console.log(`    fax   → ${CUSTOMER.licenseNo}`)
    if (needsTrn) console.log(`    legalAddressFull.comment → ${CUSTOMER.trn}`)
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const updated = await api('PUT', `/entity/counterparty/${AGENT_ID}`, {
    meta: cp.meta,
    email: CUSTOMER.licenseNo,
    fax: CUSTOMER.licenseNo,
    legalAddressFull,
  })

  console.log('\n  Updated:')
  console.log(`    email : ${updated.email}`)
  console.log(`    fax   : ${updated.fax}`)
  console.log(`    TRN   : ${updated.legalAddressFull?.comment}`)
  console.log(`  UI: https://online.moysklad.ru/app/#company/edit?id=${AGENT_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
