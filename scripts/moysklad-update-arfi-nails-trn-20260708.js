#!/usr/bin/env node

/**
 * ARFI NAILS — update VAT TRN on both MoySklad counterparties (Face Room pattern).
 *
 * Face Room layout:
 *   email / fax = trade license number
 *   legalAddressFull.comment = VAT TRN
 *
 * Source: FTA VAT certificate — TRN 104933797300003 (effective 01/05/2025)
 *
 *   node --import dotenv/config scripts/moysklad-update-arfi-nails-trn-20260708.js
 *   node --import dotenv/config scripts/moysklad-update-arfi-nails-trn-20260708.js --commit
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

const TRN = '104933797300003'
const LICENSE_NO = '946792'

const LOCATIONS = [
  {
    id: '39a1aa83-a5a6-11f0-0a80-1cbc00050fea',
    label: 'Barsha',
    name: 'ARFI NAILS BEAUTY SALON',
  },
  {
    id: 'dc883e47-f051-11f0-0a80-0f7100059e21',
    label: 'Jumeirah',
    name: 'ARFI NAILS BEAUTY SALON 2',
  },
]

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

async function updateLocation(loc) {
  const cp = await api('GET', `/entity/counterparty/${loc.id}`)
  console.log(`\n  ${loc.label}: ${cp.name}`)
  console.log(`    email : ${cp.email || '—'}`)
  console.log(`    fax   : ${cp.fax || '—'}`)
  console.log(`    TRN   : ${cp.legalAddressFull?.comment || '—'}`)

  const legalAddressFull = {
    ...(cp.legalAddressFull || {}),
    comment: TRN,
  }

  const needsEmail = cp.email !== LICENSE_NO
  const needsFax = cp.fax !== LICENSE_NO
  const needsTrn = cp.legalAddressFull?.comment !== TRN

  if (!needsEmail && !needsFax && !needsTrn) {
    console.log('    Already correct — skip')
    return { updated: false, id: loc.id }
  }

  if (!COMMIT) {
    console.log('    Would set:')
    if (needsEmail) console.log(`      email → ${LICENSE_NO}`)
    if (needsFax) console.log(`      fax   → ${LICENSE_NO}`)
    if (needsTrn) console.log(`      TRN   → ${TRN}`)
    return { updated: false, id: loc.id, wouldUpdate: true }
  }

  const updated = await api('PUT', `/entity/counterparty/${loc.id}`, {
    meta: cp.meta,
    email: LICENSE_NO,
    fax: LICENSE_NO,
    legalAddressFull,
  })

  console.log('    Updated:')
  console.log(`      email : ${updated.email}`)
  console.log(`      fax   : ${updated.fax}`)
  console.log(`      TRN   : ${updated.legalAddressFull?.comment}`)
  console.log(`      UI: https://online.moysklad.ru/app/#company/edit?id=${loc.id}`)
  return { updated: true, id: loc.id }
}

async function main() {
  console.log('====================================================================')
  console.log('  ARFI Nails — VAT TRN update (Face Room pattern, both locations)')
  console.log('====================================================================')
  console.log(`  Mode    : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  TRN     : ${TRN}`)
  console.log(`  License : ${LICENSE_NO} → email + fax`)

  for (const loc of LOCATIONS) {
    await updateLocation(loc)
  }

  if (!COMMIT) console.log('\n  DRY RUN — re-run with --commit')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
