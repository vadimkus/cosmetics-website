#!/usr/bin/env node

/**
 * Patch MoySklad document dates only — never changes name / invoice numbers.
 *
 * Fixes May-21 moments on docs that should be May-22 (UAE).
 *
 *   node --import dotenv/config scripts/moysklad-fix-document-moments-20260522.js
 *   node --import dotenv/config scripts/moysklad-fix-document-moments-20260522.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD env vars')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

/** entity path segment, id, expected name, target moment (name unchanged on PUT) */
const FIXES = [
  {
    label: 'Aryna order',
    entity: 'customerorder',
    id: 'a2c235cf-55f0-11f1-0a80-1699001ff754',
    name: 'GENCardM2605215210',
    moment: '2026-05-22 18:10:00',
  },
  {
    label: 'Hortman order',
    entity: 'customerorder',
    id: '0c4e6cda-55a9-11f1-0a80-1949000f3b25',
    name: 'CODM2605216482',
    moment: '2026-05-22 15:00:00',
    description:
      'Payment 90 days: 22/05/2026 | Hortman Clinics 2 peptide gel mask 00012 x100 2026-05-22 | Peptide Gel Mask 39g x100',
  },
  {
    label: 'Hortman invoice',
    entity: 'invoiceout',
    id: '0c90f876-55a9-11f1-0a80-1815000e5532',
    name: '04557',
    moment: '2026-05-22 15:00:00',
    description:
      'Invoice for CODM2605216482 | Hortman Clinics 2 peptide gel mask 00012 x100 2026-05-22',
  },
  {
    label: 'Anishyna commission report',
    entity: 'commissionreportin',
    id: '01d8b904-55f0-11f1-0a80-1adf00206841',
    name: '01360',
    moment: '2026-05-22 16:00:00',
  },
  {
    label: 'Anishyna demand',
    entity: 'demand',
    id: '0238f69e-55f0-11f1-0a80-0b37001ffd2f',
    name: '06211',
    moment: '2026-05-22 16:05:00',
  },
]

/** Already correct — verify only */
const SKIP_OK = [
  {
    label: 'Aryna invoice (user fixed)',
    entity: 'invoiceout',
    id: 'a3459727-55f0-11f1-0a80-19490020a4a1',
    name: '04559',
    momentPrefix: '2026-05-22',
  },
]

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

function momentDate(m) {
  return (m || '').slice(0, 10)
}

async function main() {
  console.log('====================================================================')
  console.log('  MoySklad moment fix (names / invoice numbers unchanged)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  for (const s of SKIP_OK) {
    const doc = await api('GET', `/entity/${s.entity}/${s.id}`)
    const ok = doc.name === s.name && doc.moment.startsWith(s.momentPrefix)
    console.log(
      `  ${ok ? 'OK' : 'CHECK'} ${s.label}: ${s.name} moment=${doc.moment}${ok ? '' : ' (expected ' + s.momentPrefix + '*)'}`
    )
  }

  console.log()

  for (const fix of FIXES) {
    const doc = await api('GET', `/entity/${fix.entity}/${fix.id}`)
    if (doc.name !== fix.name) {
      throw new Error(`${fix.label}: name mismatch got ${doc.name} expected ${fix.name} — abort`)
    }

    const before = doc.moment
    if (momentDate(before) === momentDate(fix.moment)) {
      console.log(`  SKIP ${fix.label}: ${fix.name} already ${before}`)
      continue
    }

    console.log(`  FIX  ${fix.label}: ${fix.name}`)
    console.log(`       ${before} → ${fix.moment}`)

    if (!COMMIT) continue

    const payload = { meta: doc.meta, moment: fix.moment }
    if (fix.description) payload.description = fix.description

    const updated = await api('PUT', `/entity/${fix.entity}/${fix.id}`, payload)
    if (updated.name !== fix.name) {
      throw new Error(`${fix.label}: name changed after PUT — ${updated.name}`)
    }
    console.log(`       ✓ updated, name still ${updated.name}, moment=${updated.moment}`)
  }

  if (!COMMIT) console.log('\n  DRY RUN complete. Re-run with --commit.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
