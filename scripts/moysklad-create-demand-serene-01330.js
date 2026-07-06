#!/usr/bin/env node

/**
 * Create a MoySklad Отгрузка (demand / shipment) that mirrors Tax Invoice
 * No. 01330 dated 24.04.2026 issued to Serene Skin Beauty Salon LLC.
 *
 * - Currency: AED (MoySklad org default, no override)
 * - VAT: 5% UAE VAT, prices are VAT-inclusive (vatIncluded=true on the doc,
 *   vatEnabled=true on each position) — matches the web-order push path in
 *   lib/moysklad.ts so finance sees consistent numbers.
 * - Counterparty: resolved by phone → name fallback (idempotent lookup).
 * - Products: resolved by exact-name search against MoySklad. The script
 *   aborts if any line cannot be uniquely resolved — no silent mismatches.
 *
 * Usage:
 *   node scripts/moysklad-create-demand-serene-01330.js          # dry run
 *   node scripts/moysklad-create-demand-serene-01330.js --commit # post for real
 *
 * Env:
 *   MOYSKLAD_LOGIN, MOYSKLAD_PASSWORD must be set.
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

// ─── Invoice header ─────────────────────────────────────────────────────────
const INVOICE = {
  number: '01330',
  date: '2026-04-24',
  orgId: 'e18525a4-33c5-11ea-0a80-043f000b2738',   // Genosys Middle East FZ-LLC
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a', // Genosys Warehouse
}

const CUSTOMER = {
  name: 'Serene Skin Beauty Salon LLC',
  phone: '+971564715477',
  trn: '105207755700003',
  license: '1566518',
  address: 'Derby Residence 3, Shop 1',
}

// ─── Line items (from PDF invoice) ──────────────────────────────────────────
//   priceAed = unit price INCLUDING 5% VAT (as printed on the invoice)
const LINES = [
  { name: 'Genosys Snow O\u2082 Cleanser 180ml',                 qty: 1, priceAed: 165.00 },
  { name: 'Genosys EyeCell Eye Peptide Gel Patch (box)',         qty: 1, priceAed: 190.00 },
  { name: 'Genosys Intensive Repair Collagen Mask 23g',          qty: 6, priceAed:  18.00 },
  { name: 'Genosys Multi Functional Anti-Wrinkle Cream 50g',     qty: 2, priceAed: 145.00 },
  { name: 'Genosys EPI Turnover Boosting Peeling Gel 100g',      qty: 1, priceAed: 125.00 },
  { name: 'Genosys Multi-Vita Radiance Cream 50g',               qty: 2, priceAed: 145.00 },
  { name: 'Genosys Skin Rescue Overnight Cream Mask 100g',       qty: 1, priceAed: 170.00 },
  { name: 'Genosys Microbiome Energy Infusing Mist 80ml',        qty: 4, priceAed:  80.00 },
  { name: 'Genosys Soothing Bomb Sea Algae Mask 23g',            qty: 3, priceAed:  18.00 },
]

// ─── MoySklad API helpers ───────────────────────────────────────────────────
async function api(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: {
      Authorization: AUTH,
      'Accept-Encoding': 'gzip',
      Accept: 'application/json;charset=utf-8',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} — ${text.slice(0, 800)}`)
  return text ? JSON.parse(text) : null
}

function href(entityType, id) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/${id}`,
      type: entityType,
      mediaType: 'application/json',
    },
  }
}

// Find counterparty: phone first, then exact-name fallback.
async function resolveCounterparty() {
  const cleanPhone = CUSTOMER.phone.replace(/\s/g, '')
  const byPhone = await api(
    'GET',
    `/entity/counterparty?filter=phone=${encodeURIComponent(cleanPhone)}&limit=5`
  )
  if (byPhone?.rows?.length) return byPhone.rows[0]

  const byName = await api(
    'GET',
    `/entity/counterparty?filter=name=${encodeURIComponent(CUSTOMER.name)}&limit=5`
  )
  if (byName?.rows?.length) return byName.rows[0]

  // Loose search (name contains)
  const loose = await api(
    'GET',
    `/entity/counterparty?search=${encodeURIComponent('Serene Skin')}&limit=10`
  )
  if (loose?.rows?.length === 1) return loose.rows[0]
  if (loose?.rows?.length > 1) {
    console.error('  ✗ Multiple counterparties match "Serene Skin":')
    loose.rows.forEach((r) => console.error(`      ${r.id}  ${r.name}  ${r.phone || ''}`))
    throw new Error('Ambiguous counterparty — resolve manually or tighten search.')
  }

  throw new Error(
    `Counterparty not found: "${CUSTOMER.name}" / ${CUSTOMER.phone}. Create it in MoySklad first.`
  )
}

// Find a product by exact name, then fallback to loose search.
// Aborts if 0 or >1 matches — refuses to pick the wrong SKU.
async function resolveProduct(name) {
  const exact = await api(
    'GET',
    `/entity/product?filter=name=${encodeURIComponent(name)}&limit=5`
  )
  if (exact?.rows?.length === 1) return { product: exact.rows[0], matchedBy: 'exact' }
  if (exact?.rows?.length > 1) {
    return { product: null, matchedBy: 'ambiguous', candidates: exact.rows }
  }

  const loose = await api(
    'GET',
    `/entity/product?search=${encodeURIComponent(name)}&limit=10`
  )
  if (loose?.rows?.length === 1) return { product: loose.rows[0], matchedBy: 'search' }
  if (loose?.rows?.length > 1) {
    // Prefer exact case-insensitive match among candidates
    const exactCi = loose.rows.find((r) => r.name.trim().toLowerCase() === name.trim().toLowerCase())
    if (exactCi) return { product: exactCi, matchedBy: 'search-exact-ci' }
    return { product: null, matchedBy: 'ambiguous', candidates: loose.rows }
  }

  return { product: null, matchedBy: 'not-found' }
}

// ─── Main flow ──────────────────────────────────────────────────────────────
async function main() {
  console.log('════════════════════════════════════════════════════════════════════')
  console.log(`  MoySklad Отгрузка — Invoice ${INVOICE.number} (${INVOICE.date}) — ${CUSTOMER.name}`)
  console.log('════════════════════════════════════════════════════════════════════')
  console.log(`  Mode: ${COMMIT ? '★ COMMIT (live) ★' : 'DRY RUN'}`)
  console.log()

  // 1. Counterparty
  console.log('  Resolving counterparty...')
  const agent = await resolveCounterparty()
  console.log(`    ✓ ${agent.name}  (id=${agent.id})`)
  if (agent.phone && agent.phone.replace(/\s/g, '') !== CUSTOMER.phone.replace(/\s/g, '')) {
    console.log(`    ⚠︎  MoySklad phone "${agent.phone}" differs from invoice "${CUSTOMER.phone}"`)
  }

  // 2. Idempotency — MoySklad invoice numbers recycle across years, so scope
  //    the duplicate check to this customer + same calendar day as the invoice.
  const dayStart = `${INVOICE.date} 00:00:00`
  const dayEnd = `${INVOICE.date} 23:59:59`
  const existing = await api(
    'GET',
    `/entity/demand?filter=agent=${encodeURIComponent(
      `${API}/entity/counterparty/${agent.id}`
    )};moment>=${encodeURIComponent(dayStart)};moment<=${encodeURIComponent(dayEnd)}&limit=25`
  )
  const dup = existing?.rows?.find(
    (r) => r.name === INVOICE.number || (r.description || '').includes(`Invoice ${INVOICE.number}`)
  )
  if (dup) {
    console.log(`\n  ⚠︎  A demand referencing "${INVOICE.number}" for this customer on ${INVOICE.date} already exists (id=${dup.id}).`)
    console.log(`     https://online.moysklad.ru/app/#demand/edit?id=${dup.id}`)
    console.log('     Aborting to prevent duplicate. Delete/rename it in MoySklad if you want to re-run.')
    process.exit(2)
  }

  // 3. Resolve each line item
  console.log()
  console.log('  Resolving products...')
  const resolved = []
  let unresolved = 0
  for (const l of LINES) {
    const r = await resolveProduct(l.name)
    if (r.product) {
      resolved.push({ ...l, product: r.product, matchedBy: r.matchedBy })
      console.log(
        `    ✓ [${r.matchedBy.padEnd(16)}] ${l.name}`
      )
      console.log(`        → ${r.product.name}  (code=${r.product.code || '—'}, id=${r.product.id})`)
    } else {
      unresolved++
      if (r.matchedBy === 'ambiguous') {
        console.log(`    ✗ AMBIGUOUS: ${l.name}`)
        r.candidates.forEach((c) =>
          console.log(`        · ${c.name}  (code=${c.code || '—'}, id=${c.id})`)
        )
      } else {
        console.log(`    ✗ NOT FOUND: ${l.name}`)
      }
    }
  }
  if (unresolved > 0) {
    console.log()
    console.log(`  ✗ ${unresolved} line(s) could not be resolved. Fix names above and re-run.`)
    process.exit(3)
  }

  // 4. Build positions — prices are VAT-inclusive (match web order path)
  const positions = resolved.map((l) => ({
    quantity: l.qty,
    price: Math.round(l.priceAed * 100), // AED minor units (fils)
    assortment: href('product', l.product.id),
    vat: 5,
    vatEnabled: true,
  }))

  // 5. Payload
  //    MoySklad enforces global uniqueness on `name`, and the invoice numbering
  //    recycles across years (see the 2022 demand also named "01330"). We
  //    therefore omit `name` and let MoySklad auto-number the shipment; the
  //    invoice reference stays in the description for finance's audit trail.
  const moment = `${INVOICE.date} 12:00:00`
  const payload = {
    moment,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', INVOICE.orgId),
    agent: href('counterparty', agent.id),
    store: href('store', INVOICE.storeId),
    description: [
      `Invoice ${INVOICE.number} — consignment sales (${INVOICE.date})`,
      `Customer: ${CUSTOMER.name}`,
      `TRN: ${CUSTOMER.trn}  |  License: ${CUSTOMER.license}`,
      `Address: ${CUSTOMER.address}`,
      `Phone: ${CUSTOMER.phone}`,
    ].join('\n'),
    positions,
  }

  // 6. Pretty summary
  const nf = (n) => n.toFixed(2).padStart(10)
  console.log()
  console.log('  Line items (AED, VAT-inclusive as printed on invoice):')
  console.log('  ' + '─'.repeat(104))
  console.log(
    '  ' +
      [
        '#'.padEnd(3),
        'Product'.padEnd(58),
        'Qty'.padStart(5),
        'Unit'.padStart(10),
        'Line (incl VAT)'.padStart(18),
      ].join(' │ ')
  )
  console.log('  ' + '─'.repeat(104))
  let totalIncl = 0
  let totalQty = 0
  resolved.forEach((l, i) => {
    const line = l.qty * l.priceAed
    totalIncl += line
    totalQty += l.qty
    console.log(
      '  ' +
        [
          String(i + 1).padEnd(3),
          l.product.name.slice(0, 58).padEnd(58),
          String(l.qty).padStart(5),
          nf(l.priceAed),
          nf(line).padStart(18),
        ].join(' │ ')
    )
  })
  console.log('  ' + '─'.repeat(104))
  const netOfVat = totalIncl / 1.05
  const vat = totalIncl - netOfVat
  console.log(
    '  ' +
      [
        ''.padEnd(3),
        `${LINES.length} lines  (total qty ${totalQty})`.padEnd(58),
        ''.padStart(5),
        'Subtotal'.padStart(10),
        nf(netOfVat).padStart(18),
      ].join(' │ ')
  )
  console.log(
    '  ' +
      [''.padEnd(3), ''.padEnd(58), ''.padStart(5), 'VAT 5%'.padStart(10), nf(vat).padStart(18)].join(' │ ')
  )
  console.log(
    '  ' +
      [''.padEnd(3), ''.padEnd(58), ''.padStart(5), 'TOTAL'.padStart(10), nf(totalIncl).padStart(18)].join(
        ' │ '
      )
  )
  console.log()
  console.log(`  Expected (invoice): subtotal 1630.47 · VAT 81.53 · total 1712.00 AED`)

  if (!COMMIT) {
    console.log()
    console.log('  DRY RUN. Re-run with --commit to post the demand.')
    return
  }

  // 7. Commit
  console.log()
  console.log('  Posting demand to MoySklad...')
  const created = await api('POST', '/entity/demand', payload)
  console.log('  ✓ Demand (Отгрузка) created!')
  console.log(`    ID       : ${created.id}`)
  console.log(`    Name     : ${created.name}`)
  console.log(`    Sum      : ${(created.sum / 100).toFixed(2)} AED`)
  console.log(`    Open UI  : https://online.moysklad.ru/app/#demand/edit?id=${created.id}`)
}

main().catch((e) => {
  console.error('\nFATAL:', e.message)
  process.exit(1)
})
