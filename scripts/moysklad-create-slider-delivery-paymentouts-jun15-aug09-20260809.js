#!/usr/bin/env node

/**
 * Slider last-mile delivery — catch-up paymentouts Jun 15 → Aug 9 2026.
 *
 * Already booked (do NOT re-post): paymentouts 00614–00619 = 8,072.51 AED
 * for tax invoice #13171-20260614-2110 (2026-01-01 → 2026-06-14).
 *
 * New consolidated tax invoice #13171-20260809-1255 (2026-01-01 → 2026-08-09):
 *   473 orders · net 9,456.75 · VAT 514.24 · paid 10,795.99 AED
 *
 * Delta to book (invoice − already posted):
 *   122 orders · net 2,593.78 · VAT 129.70 · paid 2,723.48 AED
 *
 * Monthly split: allocate delta by Wio AED "Slider" card spend share
 * (Jun 15–30 / Jul / Aug 1–9). Invoice is authoritative for the total;
 * monthly PDFs were not supplied — allocation documented in each description.
 *
 *   node --import dotenv/config scripts/moysklad-create-slider-delivery-paymentouts-jun15-aug09-20260809.js
 *   node --import dotenv/config scripts/moysklad-create-slider-delivery-paymentouts-jun15-aug09-20260809.js --commit
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

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const AGENT_ID = '618d9654-6814-11f1-0a80-009900893877' // SLIDER DELIVERY SERVICE
const STATE_PAID_ID = 'e7020a99-d671-11ea-0a80-0216000f3623'
const EXPENSE_ITEM_ID = '08733615-6815-11f1-0a80-072500887d34' // Last-mile delivery
const EXPENSE_ITEM_NAME = 'Last-mile delivery'

const PREV_MARKERS = [
  'SLIDER-DELIV-2026-01',
  'SLIDER-DELIV-2026-02',
  'SLIDER-DELIV-2026-03',
  'SLIDER-DELIV-2026-04',
  'SLIDER-DELIV-2026-05',
  'SLIDER-DELIV-2026-06',
]
const PREV_PAID_EXPECT = 8072.51
const NEW_INV = '13171-20260809-1255'
const NEW_INV_PAID = 10795.99
const DELTA_PAID_EXPECT = 2723.48

/** Delta months only — markers must not collide with SLIDER-DELIV-2026-06 (1–14). */
const MONTHS = [
  {
    key: '2026-06b',
    label: 'Jun 2026 (15-30)',
    moment: '2026-06-30 12:00:00',
    orders: 60,
    net: 1244.66,
    vat: 62.24,
    paid: 1306.9,
    wio: 1223.74,
  },
  {
    key: '2026-07',
    label: 'Jul 2026',
    moment: '2026-07-31 12:00:00',
    orders: 49,
    net: 1069.69,
    vat: 53.49,
    paid: 1123.18,
    wio: 1051.71,
  },
  {
    key: '2026-08',
    label: 'Aug 2026 (1-9)',
    moment: '2026-08-09 12:00:00',
    orders: 13,
    net: 279.43,
    vat: 13.97,
    paid: 293.4,
    wio: 274.73,
  },
]

const minor = (aed) => Math.round(aed * 100)

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} - ${text.slice(0, 1400)}`)
  return text ? JSON.parse(text) : null
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function stateHref(stateId) {
  return {
    meta: {
      href: `${API}/entity/paymentout/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

async function fetchAllSliderPaymentouts() {
  const filter = `agent=${API}/entity/counterparty/${AGENT_ID}`
  const rows = []
  let offset = 0
  while (true) {
    const data = await api(
      'GET',
      `/entity/paymentout?filter=${encodeURIComponent(filter)}&limit=100&offset=${offset}&order=moment,asc`,
    )
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 100) break
    offset += 100
  }
  return rows
}

function findByMarker(rows, marker) {
  return rows.find((r) => (r.description || '').includes(marker))
}

async function verifyPrevious(rows) {
  console.log('\n  --- Previous Slider booking check (no double-book) ---')
  let prevSum = 0
  let ok = true
  for (const marker of PREV_MARKERS) {
    const hit = findByMarker(rows, marker)
    if (!hit) {
      console.log(`  MISSING ${marker}`)
      ok = false
      continue
    }
    const aed = (hit.sum || 0) / 100
    prevSum += aed
    console.log(`  OK ${marker} → ${hit.name} ${aed.toFixed(2)} AED`)
  }
  console.log(`  Previous Σ paid: ${prevSum.toFixed(2)} (expect ${PREV_PAID_EXPECT.toFixed(2)})`)
  if (Math.abs(prevSum - PREV_PAID_EXPECT) > 0.02) {
    throw new Error(`Previous Slider total ${prevSum.toFixed(2)} ≠ ${PREV_PAID_EXPECT}`)
  }
  if (!ok) throw new Error('Previous Slider markers incomplete — abort')

  const newMarkers = MONTHS.map((m) => `SLIDER-DELIV-${m.key}`)
  for (const marker of newMarkers) {
    const hit = findByMarker(rows, marker)
    if (hit) {
      console.log(`  ALREADY NEW ${marker} → ${hit.name} ${(hit.sum / 100).toFixed(2)} (idempotent skip later)`)
    }
  }

  const allSliderSum = rows.reduce((s, r) => s + (r.sum || 0) / 100, 0)
  console.log(`  All Slider paymentouts now: ${rows.length} docs / ${allSliderSum.toFixed(2)} AED`)
  console.log(
    `  After this post expect: ${(PREV_PAID_EXPECT + DELTA_PAID_EXPECT).toFixed(2)} (= new inv ${NEW_INV_PAID})`,
  )
}

async function main() {
  console.log('====================================================================')
  console.log('  Slider — catch-up last-mile paymentouts (Jun 15 → Aug 9 2026)')
  console.log('====================================================================')
  console.log(`  Mode : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Inv  : #${NEW_INV}  paid ${NEW_INV_PAID.toFixed(2)}`)
  console.log(`  Prior: #13171-20260614-2110 paid ${PREV_PAID_EXPECT.toFixed(2)} (00614–00619)`)
  console.log(`  Delta: ${DELTA_PAID_EXPECT.toFixed(2)} AED to post`)

  const rows = await fetchAllSliderPaymentouts()
  await verifyPrevious(rows)

  const deltaPaid = MONTHS.reduce((s, m) => s + m.paid, 0)
  const deltaVat = MONTHS.reduce((s, m) => s + m.vat, 0)
  if (Math.abs(deltaPaid - DELTA_PAID_EXPECT) > 0.02) {
    throw new Error(`Month paid sum ${deltaPaid} ≠ delta ${DELTA_PAID_EXPECT}`)
  }

  console.log(`\n  New months: ${MONTHS.length}`)
  console.log(`  Σ Paid : ${deltaPaid.toFixed(2)} AED`)
  console.log(`  Σ VAT  : ${deltaVat.toFixed(2)} AED (recoverable input VAT)\n`)

  for (const m of MONTHS) {
    const marker = `SLIDER-DELIV-${m.key}`
    const desc = [
      `Slider last-mile delivery — ${m.label}`,
      `${m.orders} orders (alloc); net ${m.net.toFixed(2)} + VAT ${m.vat.toFixed(2)} = paid ${m.paid.toFixed(2)} AED`,
      `Wio Slider card in period: ${m.wio.toFixed(2)} AED (allocation key)`,
      `Tax invoice #${NEW_INV} (catch-up vs #13171-20260614-2110 already booked)`,
      marker,
    ].join('\n')

    const existing = findByMarker(rows, marker)
    if (existing) {
      console.log(
        `  ${m.label.padEnd(18)} SKIP — already posted (${existing.name}, ${(existing.sum / 100).toFixed(2)})`,
      )
      continue
    }

    const payload = {
      moment: m.moment,
      applicable: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', AGENT_ID),
      state: stateHref(STATE_PAID_ID),
      sum: minor(m.paid),
      description: desc,
      expenseItem: href('expenseitem', EXPENSE_ITEM_ID),
    }

    if (!COMMIT) {
      console.log(
        `  ${m.label.padEnd(18)} ${m.paid.toFixed(2)} AED  (${m.moment})  ${marker}`,
      )
      continue
    }

    const created = await api('POST', '/entity/paymentout', payload)
    console.log(
      `  ${m.label.padEnd(18)} ${m.paid.toFixed(2)} AED  -> ${created.name} (id=${created.id})`,
    )
  }

  if (!COMMIT) console.log('\n  DRY RUN — re-run with --commit.')
  else {
    const after = await fetchAllSliderPaymentouts()
    const sum = after.reduce((s, r) => s + (r.sum || 0) / 100, 0)
    console.log(`\n  DONE. Slider paymentouts: ${after.length} / Σ ${sum.toFixed(2)} AED`)
    if (Math.abs(sum - NEW_INV_PAID) > 0.05) {
      console.warn(`  WARN: total ${sum.toFixed(2)} ≠ new invoice paid ${NEW_INV_PAID}`)
    } else {
      console.log(`  Reconciles to new tax invoice paid ${NEW_INV_PAID.toFixed(2)} AED.`)
    }
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
