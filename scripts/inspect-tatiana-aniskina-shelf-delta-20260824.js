#!/usr/bin/env node

/**
 * Read-only: Aniskina book vs 24 Aug shelf photos (after report 01437).
 *   node --import dotenv/config scripts/inspect-tatiana-aniskina-shelf-delta-20260824.js
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const AUTH = 'Basic ' + Buffer.from(`${process.env.MOYSKLAD_LOGIN}:${process.env.MOYSKLAD_PASSWORD}`).toString('base64')
const AGENT = '603f398e-bd3d-11eb-0a80-00570009cb13'
const CONTRACT = 'f68e2d8d-c3c5-11eb-0a80-05f500276179'

async function api(pathStr, attempt = 1) {
  const res = await fetch(API + pathStr, {
    headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8', 'Accept-Encoding': 'gzip' },
  })
  const text = await res.text()
  if ((res.status === 429 || res.status >= 500) && attempt < 8) {
    await new Promise((r) => setTimeout(r, 600 * attempt))
    return api(pathStr, attempt + 1)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api(`${pathStr}${sep}limit=100&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 100) break
    offset += 100
  }
  return rows
}

function cid(doc) {
  return (doc.contract?.meta?.href || '').split('/').pop() || ''
}

async function add(ledger, type, id, sign) {
  const pos = await fetchAll(`/entity/${type}/${id}/positions?expand=assortment`)
  for (const p of pos) {
    const code = p.assortment?.code
    if (!code) continue
    const cur = ledger.get(code) || { name: p.assortment.name, qty: 0 }
    cur.qty += Number(p.quantity) * sign
    cur.name = p.assortment.name
    ledger.set(code, cur)
  }
}

/** Physical from 24 Aug photos. Codes we can read off the packs. */
const SHELF = [
  ['00143', 1, 'Ivory cushion'],
  ['00144', 3, 'Beige cushion'],
  ['54464', 3, 'Camel cushion'],
  ['00052', 2, 'Hair shampoo 300ml'],
  ['00055', 1, 'Eye Contour Cream'],
  ['00195', 3, 'Hyaluron Serum 30ml'],
  ['00030', 2, 'All For Sensitive Serum'],
  ['00191', 1, 'Anti-Wrinkle Serum 30ml'],
  ['00122', 2, 'Radiance Cream 50g (boxed)'],
  ['00123', 1, 'Radiance Cream 230g (loose tube)'],
  ['00041', 3, 'Multi Sun SPF40'],
  ['00035', 1, 'Problem Control Cream 50g'],
  ['54458', 1, 'Hyaluron Cream 50g'],
  ['54457', 2, 'Ultra Shield SPF50'],
  ['00031', 2, 'HSC 50g'],
  ['00190', 1, 'Anti-Wrinkle Cream 50g'],
  ['00145', 1, 'Problem Control Toner 200'],
  ['00037', 1, 'Skin Barrier 100g'],
  ['00040', 1, 'BB cream 50g'],
  ['00042', 1, 'EGF Oxymask'],
  ['54475', 1, 'PDRN 5000'],
  ['54484', 1, 'CERABARRIER 200'],
  ['00021', 1, 'Snow O₂ 180ml'],
  ['00025', 1, 'Snow Booster 1000ml'],
  ['54461', 1, 'Defender 200ml'],
  ['00129', 1, 'EPI peeling gel'],
  ['00189', 2, 'Overnight cream mask'],
]

const CLINIC = {
  '00001': 95,
  '00030': 165,
  '00034': 210,
  '00040': 125,
  '00053': 145,
  '00056': 230,
  '00057': 370,
  '00063': 18,
  '00122': 145,
  '00123': 210,
  '00140': 18,
  '00143': 150,
  '00144': 150,
  '00188': 80,
  '00190': 145,
  '54458': 145,
  '54464': 150,
  '54484': 190,
}

async function main() {
  const filter = encodeURIComponent(`agent=${API}/entity/counterparty/${AGENT}`)
  const [demands, reports, returns] = await Promise.all([
    fetchAll(`/entity/demand?filter=${filter}&expand=contract`),
    fetchAll(`/entity/commissionreportin?filter=${filter}&expand=contract`),
    fetchAll(`/entity/salesreturn?filter=${filter}&expand=contract`),
  ])
  const ledger = new Map()
  for (const d of demands.filter((x) => cid(x) === CONTRACT)) await add(ledger, 'demand', d.id, 1)
  for (const r of reports.filter((x) => cid(x) === CONTRACT)) await add(ledger, 'commissionreportin', r.id, -1)
  for (const r of returns.filter((x) => cid(x) === CONTRACT)) await add(ledger, 'salesreturn', r.id, -1)

  const shelfMap = new Map(SHELF.map(([c, q, n]) => [c, { qty: q, name: n }]))
  const codes = new Set([...ledger.keys(), ...shelfMap.keys()])
  const rows = []
  for (const code of [...codes].sort()) {
    const book = ledger.get(code)?.qty || 0
    const phys = shelfMap.get(code)?.qty || 0
    const name = ledger.get(code)?.name || shelfMap.get(code)?.name || code
    const delta = phys - book
    if (book === 0 && phys === 0) continue
    rows.push({ code, name, book, phys, delta })
  }

  console.log('code | book | shelf | delta | name')
  let miss = 0
  let extra = 0
  let missAed = 0
  let extraAed = 0
  for (const r of rows) {
    const mark = r.delta === 0 ? 'OK' : r.delta < 0 ? 'SOLD/MISSING' : 'SURPLUS'
    console.log(`${r.code} | ${r.book} | ${r.phys} | ${r.delta} | ${mark} | ${r.name}`)
    if (r.delta < 0) {
      miss += -r.delta
      missAed += -r.delta * (CLINIC[r.code] || 0)
    }
    if (r.delta > 0) {
      extra += r.delta
      extraAed += r.delta * (CLINIC[r.code] || 0)
    }
  }
  console.log(`\nMissing vs book: ${miss} pcs`)
  console.log(`Surplus vs book: ${extra} pcs`)
  console.log(`If missing = sold @ clinic (known prices only): ${missAed} AED`)
  console.log(`Surplus @ clinic (known prices only): ${extraAed} AED`)
  console.log('\nSOLD LINES (book > shelf):')
  for (const r of rows.filter((x) => x.delta < 0)) {
    const px = CLINIC[r.code]
    console.log(`  ${r.code} x${-r.delta} ${px ? '@ ' + px + ' = ' + -r.delta * px : '(price?)'}  ${r.name}`)
  }
  console.log('\nSURPLUS (shelf > book):')
  for (const r of rows.filter((x) => x.delta > 0)) {
    console.log(`  ${r.code} x${r.delta}  ${r.name}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
