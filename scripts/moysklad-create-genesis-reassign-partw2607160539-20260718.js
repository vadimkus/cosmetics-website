#!/usr/bin/env node

/**
 * Recreate Genesis Healthcare Center counterparty (website contact data)
 * and reassign PARTW2607160539 order / invoice / demand away from New You Star.
 *
 *   node --import dotenv/config scripts/moysklad-create-genesis-reassign-partw2607160539-20260718.js
 *   node --import dotenv/config scripts/moysklad-create-genesis-reassign-partw2607160539-20260718.js --commit
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
const NYS_ID = '69e1db3e-7fa4-11f1-0a80-0283002585b0'

/** From genesis-dubai.com/contact-us + portal account */
const CUSTOMER = {
  name: 'Genesis Healthcare Center',
  companyType: 'legal',
  phone: '+97145776500',
  phoneAlt: '+971505507029',
  email: 'info@genesis-dubai.com',
  emailAlt: 'support@genesis-dubai.com',
  website: 'https://www.genesis-dubai.com',
  instagram: 'https://www.instagram.com/genesis_dubai/',
  city: 'Dubai',
  street: 'Dubai Science Park Towers, North Tower 3rd & 4th Floor, Dubai Science Park, Al Barsha South, Dubai, UAE',
  shipmentLine: 'UAE, Dubai, Dubai Science Park Towers, North Tower 4th Floor. Al Barsha Dubai.',
  description:
    'Genesis Healthcare Center FZ-LLC — multi-specialty clinic (aesthetics/derm). ' +
    'Website genesis-dubai.com · Mon–Sat 08:00–17:00 · Tel +971 4 577 6500 · ' +
    'info@genesis-dubai.com / support@genesis-dubai.com · Instagram @genesis_dubai. ' +
    'Also Genesis Paediatrics & Developmental Center — South Tower 1st Floor. ' +
    'Created 2026-07-18 from website; separate from NEW YOU STAR BEAUTY HEALTH CLINIC L.L.C.',
}

const DOCS = [
  { type: 'customerorder', id: '361f8c3d-8130-11f1-0a80-0dc40023a524', label: 'Order PARTW2607160539' },
  { type: 'invoiceout', id: '36623435-8130-11f1-0a80-04d100239d31', label: 'Invoice 04830' },
  { type: 'demand', id: '36efaf8c-8130-11f1-0a80-0bab00236329', label: 'Shipment 06555' },
]

function agentMeta(id) {
  return {
    meta: {
      href: `${API}/entity/counterparty/${id}`,
      type: 'counterparty',
      mediaType: 'application/json',
    },
  }
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

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: AUTH,
        Accept: 'application/json;charset=utf-8',
        'Accept-Encoding': 'gzip',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(60000),
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    const retryable =
      e.cause?.code === 'ECONNRESET' ||
      e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' ||
      e.name === 'TimeoutError' ||
      e.message === 'fetch failed'
    if (attempt < 8 && retryable) {
      await new Promise((r) => setTimeout(r, 2000 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

async function findGenesis() {
  for (const q of [CUSTOMER.name, 'Genesis Healthcare', CUSTOMER.phone, CUSTOMER.email, CUSTOMER.emailAlt]) {
    const data = await api('GET', `/entity/counterparty?search=${encodeURIComponent(q)}&limit=25`)
    const hit = (data.rows || []).find((r) => {
      const n = (r.name || '').toLowerCase()
      return (
        n === CUSTOMER.name.toLowerCase() ||
        n.includes('genesis healthcare') ||
        r.phone === CUSTOMER.phone ||
        r.email === CUSTOMER.email ||
        r.email === CUSTOMER.emailAlt
      )
    })
    if (hit) return hit
  }
  return null
}

async function createGenesis() {
  const addr = {
    country: countryHref(),
    city: CUSTOMER.city,
    street: CUSTOMER.street,
  }
  return api('POST', '/entity/counterparty', {
    name: CUSTOMER.name,
    companyType: CUSTOMER.companyType,
    phone: CUSTOMER.phone,
    email: CUSTOMER.email,
    fax: CUSTOMER.phoneAlt,
    description: CUSTOMER.description,
    legalAddressFull: addr,
    actualAddressFull: addr,
  })
}

async function main() {
  console.log('====================================================================')
  console.log('  Create Genesis Healthcare Center + reassign PARTW2607160539')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  let genesis = await findGenesis()
  if (genesis) {
    console.log(`  Found existing: ${genesis.name} (${genesis.id})`)
    console.log(`    phone=${genesis.phone || '—'} email=${genesis.email || '—'}`)
  } else if (!COMMIT) {
    console.log('  Would CREATE counterparty:')
    console.log(`    name: ${CUSTOMER.name}`)
    console.log(`    phone: ${CUSTOMER.phone} / alt ${CUSTOMER.phoneAlt}`)
    console.log(`    email: ${CUSTOMER.email}`)
    console.log(`    address: ${CUSTOMER.street}`)
    console.log(`    web: ${CUSTOMER.website}`)
  } else {
    genesis = await createGenesis()
    console.log(`  CREATED: ${genesis.name} (${genesis.id})`)
    console.log(`    phone=${genesis.phone} email=${genesis.email}`)
  }

  console.log('\n  Documents:')
  for (const doc of DOCS) {
    const current = await api('GET', `/entity/${doc.type}/${doc.id}?expand=agent`)
    const agentId = current.agent?.meta?.href?.split('/').pop()?.split('?')[0]
    console.log(`  ${doc.label}: agent=${current.agent?.name || agentId} sum=${(current.sum || 0) / 100}`)

    if (!COMMIT) {
      if (genesis && agentId === genesis.id) console.log('    already Genesis — skip')
      else console.log(`    would reassign → ${CUSTOMER.name}`)
      continue
    }

    if (!genesis) throw new Error('Genesis counterparty missing after create')

    if (agentId === genesis.id) {
      console.log('    already Genesis — skip')
      continue
    }

    const payload = {
      meta: current.meta,
      agent: agentMeta(genesis.id),
    }
    // Keep shipment address on order aligned with Genesis site
    if (doc.type === 'customerorder') {
      payload.shipmentAddress = CUSTOMER.shipmentLine
    }

    const updated = await api('PUT', `/entity/${doc.type}/${doc.id}`, payload)
    const newAgent = updated.agent?.meta?.href?.split('/').pop()?.split('?')[0]
    console.log(`    updated → agent=${newAgent}`)
  }

  // Confirm New You Star balance / Genesis balance after
  if (COMMIT && genesis) {
    const nys = await api('GET', `/entity/counterparty/${NYS_ID}`)
    const g = await api('GET', `/entity/counterparty/${genesis.id}`)
    console.log(`\n  New You Star balance: ${(nys.balance || 0) / 100} AED`)
    console.log(`  Genesis balance: ${(g.balance || 0) / 100} AED`)
    console.log(`  Genesis UI: https://online.moysklad.ru/app/#company/edit?id=${genesis.id}`)
    console.log(`  Order UI:   https://online.moysklad.ru/app/#customerorder/edit?id=${DOCS[0].id}`)
  } else if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
