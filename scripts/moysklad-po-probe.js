#!/usr/bin/env node

/**
 * MoySklad PO Pre-flight probe
 *
 * Matches invoice GCXXXX codes to MoySklad products by fuzzy name,
 * finds the DTS MG supplier counterparty, and reports missing refs so we
 * can build a clean purchaseorder payload.
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
if (!LOGIN || !PASSWORD) {
  console.error('Missing MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')

const INVOICE_ITEMS = [
  { code: 'GCCL02', name: 'SNOW O2 CLEANSER 500ml', qty: 20, unitUsd: 16.3 },
  { code: 'GCMA02', name: 'PEPTIDE GEL MASK KIT', qty: 60, unitUsd: 12.6 },
  { code: 'GCCR44', name: 'PROBLEM CONTROL CREAM 50g', qty: 20, unitUsd: 8.7 },
  { code: 'GCCR39', name: 'MOISTURE REPLENISHING HYALURON CREAM 50g', qty: 60, unitUsd: 9.3 },
  { code: 'GCCR37', name: 'ULTRA SHIELD SUN CREAM SPF50+ PA++++ 50g', qty: 20, unitUsd: 9.3 },
  { code: 'GCFO02', name: 'Cushion + Refill #02 BEIGE', qty: 200, unitUsd: 14.0 },
  { code: 'GCEC01', name: 'EYE PEPTIDE GEL PATCH', qty: 50, unitUsd: 12.0 },
  { code: 'GCEC02', name: 'EYE CONTOUR SERUM 10ml', qty: 20, unitUsd: 12.0 },
  { code: 'GCEC03', name: 'EYE CONTOUR CREAM 20g', qty: 20, unitUsd: 13.1 },
  { code: 'GCEC00', name: 'EYECELL Kit', qty: 10, unitUsd: 36.0 },
  { code: 'GCHR12', name: 'HR3 MATRIX HAIR TONIC ALPHA 70ml', qty: 20, unitUsd: 9.8 },
  { code: 'GCHR20', name: 'HR3 MATRIX MEDI SCALP SHAMPOO 300ml', qty: 20, unitUsd: 10.9 },
]

async function api(path) {
  const res = await fetch(API + path, {
    headers: { Authorization: AUTH, 'Accept-Encoding': 'gzip' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${path} — ${await res.text()}`)
  return res.json()
}

function normalize(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

async function main() {
  console.log('1) Organizations')
  const orgs = await api('/entity/organization?limit=10')
  for (const o of orgs.rows) console.log(`   - ${o.name}  (id=${o.id})`)

  console.log('\n2) Stores (warehouses)')
  const stores = await api('/entity/store?limit=10')
  for (const s of stores.rows) console.log(`   - ${s.name}  (id=${s.id})`)

  console.log('\n3) Currencies')
  const ccy = await api('/entity/currency?limit=30')
  for (const c of ccy.rows) console.log(`   - ${c.name}  code=${c.code}  rate=${c.rate?.value}  iso=${c.isoCode || ''}  default=${c.default || false}`)

  console.log('\n4) Supplier counterparty search (DTS MG)')
  const cp1 = await api(`/entity/counterparty?search=${encodeURIComponent('DTS MG')}&limit=10`)
  for (const c of cp1.rows) console.log(`   - ${c.name}  (id=${c.id}, type=${c.companyType})`)
  const cp2 = await api(`/entity/counterparty?search=${encodeURIComponent('DTS')}&limit=10`)
  console.log(`   (broader "DTS" search → ${cp2.rows.length} hits)`)
  for (const c of cp2.rows.slice(0, 5)) console.log(`     · ${c.name}  (id=${c.id})`)

  console.log('\n5) Product matches for the 12 invoice lines')
  // Pull all products once, then fuzzy match
  const allProducts = []
  let offset = 0
  while (true) {
    const p = await api(`/entity/product?limit=1000&offset=${offset}`)
    allProducts.push(...p.rows)
    if (p.rows.length < 1000) break
    offset += 1000
  }
  console.log(`   (loaded ${allProducts.length} products from catalog)`)
  console.log()

  const unmatched = []
  for (const item of INVOICE_ITEMS) {
    // Try to find best match by normalized name
    const target = normalize(item.name)
    const scored = allProducts
      .map((p) => {
        const n = normalize(p.name)
        // Crude containment score
        let score = 0
        // Split target into tokens
        const tokens = item.name.toLowerCase().split(/\s+/).filter((t) => t.length > 2)
        for (const tok of tokens) {
          if (n.includes(normalize(tok))) score += 1
        }
        // Bonus for size digits match
        const sizeMatch = item.name.match(/(\d+)\s*(ml|g)/i)
        if (sizeMatch && n.includes(normalize(sizeMatch[0]))) score += 2
        return { p, score }
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    console.log(`   [${item.code}] ${item.name}`)
    if (!scored.length) {
      console.log('       × NO MATCH in catalog')
      unmatched.push(item)
    } else {
      for (const s of scored) {
        console.log(`       → ${s.p.name}  (code=${s.p.code || '—'}, id=${s.p.id})  score=${s.score}`)
      }
    }
  }

  if (unmatched.length) {
    console.log(`\n⚠️  ${unmatched.length} unmatched invoice line(s):`)
    for (const u of unmatched) console.log(`   ${u.code}  ${u.name}`)
  } else {
    console.log('\n✓ All 12 lines have a candidate match.')
  }
}

main().catch((e) => {
  console.error('Fatal:', e.message)
  process.exit(1)
})
