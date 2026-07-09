#!/usr/bin/env node

/**
 * First Person Marina — tag legacy returns 00002 / 00006 to consignment contract 00024.
 *
 * Why: these two returns (740 + 142 = 882 AED) were posted WITHOUT a contract, so the
 * balance audit counts them as a retail cash credit ("we owe customer 882"). They are
 * consignment stock returns just like every other Marina return (which carry 00024).
 * Setting the contract makes them consistent and removes the only real cash «мы должны»
 * flag in the corrected audit. No cash moves; goods already physically returned.
 *
 *   node --import dotenv/config scripts/moysklad-fix-persona-marina-legacy-returns-contract-20260626.js
 *   node --import dotenv/config scripts/moysklad-fix-persona-marina-legacy-returns-contract-20260626.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')
const GAP_MS = 90
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const MARKER = `MARINA-LEGACY-RETURNS-CONTRACT-${uaeToday()}`
const CONTRACT_ID = '56ca0166-c388-11eb-0a80-093a001d1ee0' // 00024 (Commission)
const CONTRACT_META = {
  meta: {
    href: `${API}/entity/contract/${CONTRACT_ID}`,
    type: 'contract',
    mediaType: 'application/json',
  },
}

const RETURNS = [
  { name: '00002', id: '2956a655-893a-11ea-0a80-036200053c11' },
  { name: '00006', id: '65a9e444-6333-11ec-0a80-00c4002cedf1' },
]

async function api(method, pathStr, body, retries = 5) {
  for (let i = 0; i <= retries; i++) {
    await sleep(GAP_MS)
    let res
    try {
      res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
        method,
        headers: {
          Authorization: AUTH,
          Accept: 'application/json;charset=utf-8',
          'Accept-Encoding': 'gzip',
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      })
    } catch (err) {
      if (i < retries) {
        await sleep(800 * (i + 1))
        continue
      }
      throw err
    }
    const text = await res.text()
    if ((res.status === 429 || res.status === 503) && i < retries) {
      await sleep(600 * (i + 1))
      continue
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 800)}`)
    return text ? JSON.parse(text) : null
  }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function main() {
  console.log('====================================================================')
  console.log('  Marina — tag legacy returns 00002 / 00006 to contract 00024')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN (add --commit)'}`)
  console.log('====================================================================\n')

  for (const r of RETURNS) {
    const doc = await api('GET', `/entity/salesreturn/${r.id}?expand=contract`)
    if (doc.name !== r.name) throw new Error(`ID/name mismatch: expected ${r.name}, got ${doc.name}`)

    const current = doc.contract?.name || '—'
    console.log(`  ${doc.name}  ${(doc.moment || '').slice(0, 10)}  ${money(doc.sum)} AED  contract=${current}`)

    if (doc.contract?.meta?.href?.includes(CONTRACT_ID)) {
      console.log('    ✓ already on 00024 — skip')
      continue
    }

    if (!COMMIT) {
      console.log('    → would set contract = 00024')
      continue
    }

    const desc = [doc.description || '', `[${MARKER}] consignment return — tagged to 00024`]
      .filter(Boolean)
      .join('\n')

    await api('PUT', `/entity/salesreturn/${r.id}`, {
      meta: doc.meta,
      contract: CONTRACT_META,
      description: desc,
    })
    console.log('    ✓ contract → 00024')
  }

  if (!COMMIT) {
    console.log('\nDry run only. Re-run with --commit to apply.')
    return
  }

  console.log('\n✓ Done. Re-run the balance audit — Marina cash «мы должны» should be 0.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
