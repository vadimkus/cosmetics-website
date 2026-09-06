#!/usr/bin/env node

/**
 * Kamshat Kadyrova — update retail address to Kingsgate Hotel Al Jadaf, apt 701.
 *
 *   node --import dotenv/config scripts/moysklad-update-kamshat-kadyrova-address-20260831.js
 *   node --import dotenv/config scripts/moysklad-update-kamshat-kadyrova-address-20260831.js --commit
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

const AGENT_ID = 'b88d7e4d-6d69-11f1-0a80-112d005fea02'
const COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae'
const STREET = 'Kingsgate Hotel Al Jadaf, apt 701'
const CITY = 'Dubai'
const EXPECTED_NAME = 'Kamshat Kadyrova'

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function addressFull() {
  return {
    country: href('country', COUNTRY_UAE_ID),
    city: CITY,
    street: STREET,
    addInfo: '',
  }
}

async function main() {
  const agent = await api('GET', `/entity/counterparty/${AGENT_ID}`)
  if (agent.name !== EXPECTED_NAME) throw new Error(`Unexpected agent ${agent.name}`)

  console.log('====================================================================')
  console.log('  Kamshat Kadyrova — address update')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Was: ${agent.actualAddress || agent.actualAddressFull?.addInfo || '—'}`)
  console.log(`  Now: UAE, ${CITY}, ${STREET}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const full = addressFull()
  const updated = await api('PUT', `/entity/counterparty/${AGENT_ID}`, {
    meta: agent.meta,
    name: agent.name,
    phone: agent.phone,
    email: agent.email,
    actualAddress: `UAE, ${CITY}, ${STREET}`,
    legalAddress: `UAE, ${CITY}, ${STREET}`,
    actualAddressFull: full,
    legalAddressFull: full,
  })

  console.log(`  actualAddress now: ${updated.actualAddress}`)
  console.log(`  street now: ${updated.actualAddressFull?.street || '—'}`)
  console.log(`  addInfo now: ${updated.actualAddressFull?.addInfo || '(empty)'}`)
  console.log(`  UI: https://online.moysklad.ru/app/#company/edit?id=${AGENT_ID}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
