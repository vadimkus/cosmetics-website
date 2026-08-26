#!/usr/bin/env node
/** Map DM GME 260810 value-invoice lines to MoySklad products + post-cream stock. */
const API = 'https://api.moysklad.ru/api/remap/1.2'
const AUTH = 'Basic ' + Buffer.from(`${process.env.MOYSKLAD_LOGIN}:${process.env.MOYSKLAD_PASSWORD}`).toString('base64')

async function api(pathStr, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  const res = await fetch(url, {
    headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8', 'Accept-Encoding': 'gzip' },
  })
  const text = await res.text()
  if ((res.status === 429 || res.status >= 500) && attempt < 8) {
    await new Promise((r) => setTimeout(r, 600 * attempt))
    return api(pathStr, attempt + 1)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr} ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : null
}

async function search(q) {
  const data = await api(`/entity/product?search=${encodeURIComponent(q)}&limit=20`)
  return data.rows || []
}

async function byCode(code) {
  const a = await api(`/entity/product?filter=code=${encodeURIComponent(code)}&limit=5`)
  if (a.rows?.[0]) return a.rows[0]
  const b = await api(`/entity/product?filter=code=${encodeURIComponent(code)};archived=true&limit=5`)
  return b.rows?.[0] || null
}

async function stockByStore(id) {
  const data = await api(`/report/stock/bystore?filter=product=${API}/entity/product/${id}`)
  return (data.rows || []).map((r) => ({
    name: r.name,
    code: r.code,
    stockByStore: (r.stockByStore || []).map((s) => ({
      store: s.meta?.href?.split('/').pop()?.slice(0, 8),
      storeName: s.name,
      stock: s.stock,
    })),
  }))
}

const KNOWN = {
  GRFS050: ['00001', '00002', '00003', '00004', '00005'],
  GCMA05: ['00013'],
  GCMA10: ['00140'],
  GCMA06: ['00063'],
  GCAP01: ['54475'],
  GCCR09: ['00041'],
  GCCR37: ['54457'],
  GCFO02: ['00144'],
  GCHR18: ['00048', '00045'],
  GMAC05: ['54486'],
  GCCL03: ['00111'],
  GCCR42: ['00112'],
  GCCR20: ['00114'],
  GCCR22: ['00116'],
  'GCSP-CB01': ['00118'],
  GCSE18: ['54478'],
  GCSE16: ['54489'],
  GCCR41: ['54479'],
  GCCR24: ['00120'],
  GCEX02: ['00135'],
  GCMA12: ['54476'],
  GCHR21: ['00121'],
  GMHR02: ['54471'],
  GCCR48: ['54487'],
  GCCR49: ['54488'],
}

const SEARCHES = [
  'GRFS050',
  '0.5mm',
  'DETACHABLE ROLLER',
  'GMBR09',
  'Facial Treatment Leaflet',
  'Eyecell Kit Leaflet',
  'HR3 MATRIX Leaflet',
  'CATALOGUE',
  'Roller Leaflet',
  'NEEDLE PEN-K',
  'HAIRGEN BOOSTER Leaflet',
  'HAIR GENTRON Leaflet',
  'TRIAL KIT',
  'GCCR10',
  '2gx100',
  '2g x100',
  'POSTCREAM -2g',
  'ULTRA SHEILD',
  'ULTRA SHIELD -4g',
  'REVITA GLOW BB CREAM #01',
  '8809392230529',
]

async function main() {
  const pos = await api(`/entity/purchaseorder?search=${encodeURIComponent('DM GME 260810')}&limit=10`)
  console.log('POs search 260810:', (pos.rows || []).map((r) => `${r.name} ${r.id} sum=${(r.sum || 0) / 100}`).join(' | ') || 'NONE')

  console.log('\n=== KNOWN CODES ===')
  for (const [inv, codes] of Object.entries(KNOWN)) {
    for (const c of codes) {
      const p = await byCode(c)
      if (!p) {
        console.log(`  ${inv} → ${c} MISSING`)
        continue
      }
      console.log(
        `  ${inv} → ${c} ${p.archived ? 'ARCHIVED' : 'ok'} | ${p.name} | buy ${(p.buyPrice?.value || 0) / 100} | id ${p.id}`,
      )
    }
  }

  console.log('\n=== SEARCH ===')
  const seen = new Set()
  for (const q of SEARCHES) {
    const rows = await search(q)
    const fresh = rows.filter((r) => !seen.has(r.id))
    for (const r of fresh) seen.add(r.id)
    if (!fresh.length) {
      console.log(`  [${q}] —`)
      continue
    }
    for (const r of fresh.slice(0, 8)) {
      console.log(`  [${q}] ${r.code} ${r.archived ? 'ARCH' : ''} ${r.name}`)
    }
  }

  console.log('\n=== POST CREAM 00038 / 00039 ===')
  for (const c of ['00038', '00039', '54465']) {
    const p = await byCode(c)
    if (!p) {
      console.log(c, 'missing')
      continue
    }
    const stock = await api(`/report/stock/all?filter=product=${API}/entity/product/${p.id}&stockMode=all&stockMoreThan=-1`)
    const row = (stock.rows || [])[0]
    console.log(
      `${c} ${p.name} stock=${row?.stock} reserve=${row?.reserve} inTransit=${row?.inTransit} qty=${row?.quantity}`,
    )
    const bys = await api(`/report/stock/bystore?filter=product=${API}/entity/product/${p.id}`)
    for (const r of bys.rows || []) {
      for (const s of r.stockByStore || []) {
        console.log(`    store ${s.name}: stock ${s.stock}`)
      }
    }
  }

  const highest = await api('/entity/product?order=code,desc&limit=15')
  console.log('\n=== HIGH CODES ===')
  for (const r of highest.rows || []) console.log(`  ${r.code} ${r.name}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
