/**
 * Rename MoySklad product 00140 "Genosys Soothing Bomb Sea Algae Mask 23g"
 * → "...25g". The sheet mask weight is 25g (per pack: 25g x 10ea) — the 23g
 * in the catalog name was wrong.
 *
 * Dry-run:  node scripts/moysklad-rename-sea-algae-mask-25g-20260711.js
 * Commit:   node scripts/moysklad-rename-sea-algae-mask-25g-20260711.js --commit
 */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const COMMIT = process.argv.includes('--commit')
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const BASE = 'https://api.moysklad.ru/api/remap/1.2'
const PRODUCT_ID = '9d634465-2690-11ec-0a80-0767000c229e' // SOOTHING BOMB SEA ALGAE MASK (00140)

async function ms(pathname, options = {}) {
  const res = await fetch(`${BASE}${pathname}`, {
    ...options,
    headers: {
      Authorization: AUTH,
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip',
      ...(options.headers || {}),
    },
  })
  if (!res.ok) throw new Error(`${options.method || 'GET'} ${pathname} → ${res.status}: ${await res.text()}`)
  return res.json()
}

async function main() {
  const product = await ms(`/entity/product/${PRODUCT_ID}`)
  console.log('Current name:', product.name, '| code:', product.code, '| article:', product.article || '—')

  if (!/23\s?g/i.test(product.name)) {
    console.log('Name has no "23g" — nothing to do.')
    return
  }
  const newName = product.name.replace(/23(\s?)g/gi, '25$1g')
  console.log('New name:    ', newName)

  if (!COMMIT) {
    console.log('\nDRY-RUN only. Re-run with --commit to write.')
    return
  }

  const updated = await ms(`/entity/product/${PRODUCT_ID}`, {
    method: 'PUT',
    body: JSON.stringify({ name: newName }),
  })
  console.log('✅ Renamed to:', updated.name)
}

main().catch((e) => { console.error('❌', e); process.exit(1) })
