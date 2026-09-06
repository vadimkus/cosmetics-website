#!/usr/bin/env node

/**
 * Live warehouse + 30/90d out + open POs. Focus: Power Solutions, promo SKUs, tight cover.
 *   node --import dotenv/config scripts/inspect-stock-promo-sep-order-20260901.js
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')

const WATCH = [
  // Power Solutions vials
  '00018', '00020', '00065', '00069', '00067', '00071',
  // Power Solution / SRS boxes
  '00017', '00019', '00064', '00068', '00066', '00070', '00014',
  // SRS vials
  '00015',
  // Promo
  '00183', '00145', '54472', '54473',
  // Aug 25 tight list
  '54475', '00037', '00122', '00059', '00030', '00032', '00038', '00039',
  '00143', '54458', '00054', '00055',
  // other frequent movers
  '00012', '00063', '00140', '00144', '54457', '00041', '00021', '00024',
  '00022', '00025', '00129', '00013', '00011', '54467', '54470', '00188',
  '00084', '00195', '54460', '00031', '00034', '00190', '00189', '00051',
  '00052', '00050', '00053',
]

async function apiGet(pathStr, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  const res = await fetch(url, {
    headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8', 'Accept-Encoding': 'gzip' },
  })
  const text = await res.text()
  if ((res.status === 429 || res.status >= 500) && attempt < 10) {
    await new Promise((r) => setTimeout(r, 700 * attempt))
    return apiGet(pathStr, attempt + 1)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr.slice(0, 140)} ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await apiGet(`${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function fmt(d) {
  return d.toISOString().replace('T', ' ').slice(0, 19)
}

async function fetchTurnover(from, to) {
  const out = new Map()
  let offset = 0
  while (true) {
    const url = `/report/turnover/all?momentFrom=${encodeURIComponent(from)}&momentTo=${encodeURIComponent(to)}&limit=1000&offset=${offset}`
    const data = await apiGet(url)
    for (const r of data.rows || []) {
      const code = r.assortment?.code
      if (!code) continue
      out.set(code, Number(r.outcome?.quantity || 0))
    }
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return out
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function short(name) {
  return String(name || '')
    .replace(/^Genosys\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 52)
}

function rowLine(s) {
  const cover = s.daily > 0 ? Math.round(s.avail / s.daily) : '—'
  const need90 = s.daily > 0 ? Math.max(0, Math.ceil(s.daily * 90 - s.avail - s.inTransit)) : 0
  return [
    s.code.padEnd(6),
    String(s.avail).padStart(5),
    String(s.inTransit).padStart(4),
    String(s.o30).padStart(5),
    String(s.o90).padStart(5),
    String(s.daily.toFixed(2)).padStart(6),
    String(cover).padStart(5),
    String(need90).padStart(5),
    short(s.name),
  ].join(' ')
}

async function main() {
  const now = new Date()
  console.log('Fetching stock, turnover, POs...')
  const [stockRows, pos, t30, t90] = await Promise.all([
    fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1'),
    fetchAll('/entity/purchaseorder?order=moment,desc&filter=moment>=2026-01-01 00:00:00'),
    fetchTurnover(fmt(new Date(now - 30 * 864e5)), fmt(now)),
    fetchTurnover(fmt(new Date(now - 90 * 864e5)), fmt(now)),
  ])

  const stock = new Map()
  for (const r of stockRows) {
    if (!r.code) continue
    stock.set(r.code, {
      code: r.code,
      name: r.name,
      stock: Number(r.stock || 0),
      reserve: Number(r.reserve || 0),
      inTransit: Number(r.inTransit || 0),
      avail: Number(r.stock || 0) - Number(r.reserve || 0),
    })
  }

  function pack(code) {
    const s = stock.get(code) || { code, name: 'MISSING', stock: 0, reserve: 0, inTransit: 0, avail: 0 }
    const o30 = t30.get(code) || 0
    const o90 = t90.get(code) || 0
    const daily = Math.max(o30 / 30, (o90 / 90) * 0.7)
    return { ...s, o30, o90, daily }
  }

  console.log('\n========== OPEN / RECENT KOREA POs ==========')
  for (const po of pos.slice(0, 12)) {
    const shipped = Number(po.shippedSum || 0)
    const sum = Number(po.sum || 0)
    const open = sum > 0 && shipped < sum - 1
    console.log(
      `${open ? 'OPEN ' : 'done '} ${po.name} ${money(sum)} shipped ${money(shipped)} moment ${po.moment} ${po.applicable === false ? 'NOT APPLICABLE' : ''}`,
    )
  }

  const po810 = pos.find((p) => /260810/i.test(p.name || ''))
  if (po810) {
    const lines = await fetchAll(`/entity/purchaseorder/${po810.id}/positions?expand=assortment`)
    console.log(`\n--- ${po810.name} lines (shippedQty / qty) ---`)
    for (const p of lines) {
      console.log(
        `  ${(p.assortment?.code || '').padEnd(6)} qty ${String(p.quantity).padStart(5)} shipped ${String(p.shipped || 0).padStart(5)} ${short(p.assortment?.name)}`,
      )
    }
  }

  const groups = [
    ['POWER SOLUTION VIALS', ['00018', '00020', '00065', '00069', '00067', '00071']],
    ['POWER SOLUTION / SRS BOXES', ['00017', '00019', '00064', '00068', '00066', '00070', '00014']],
    ['SRS VIALS', ['00015']],
    ['PROMO: TONER 500 / 200 + REVITA', ['00183', '00145', '54472', '54473']],
    ['AUG-25 TIGHT LIST', ['54475', '00037', '00122', '00059', '00030', '00032', '00038', '00039', '00143', '54458', '00054', '00055']],
  ]

  const header = [
    'code'.padEnd(6),
    'avail'.padStart(5),
    'trn'.padStart(4),
    '30d'.padStart(5),
    '90d'.padStart(5),
    'd/day'.padStart(6),
    'cover'.padStart(5),
    'n90'.padStart(5),
    'name',
  ].join(' ')

  for (const [title, codes] of groups) {
    console.log(`\n========== ${title} ==========`)
    console.log(header)
    for (const code of codes) console.log(rowLine(pack(code)))
  }

  const all = []
  for (const [code, s] of stock) {
    const name = s.name || ''
    if (/sample|tester|leaflet|catalogue|catalog|non woven|nonwoven|trial kit|foc|delivery|shipping/i.test(name)) continue
    if (/^5449[0-9]$|^54500$|^54469$|^54486$/.test(code)) continue
    all.push(pack(code))
  }

  const tight = all
    .filter((s) => s.daily >= 0.08 && s.avail + s.inTransit < s.daily * 55)
    .sort((a, b) => {
      const ca = a.daily > 0 ? (a.avail + a.inTransit) / a.daily : 999
      const cb = b.daily > 0 ? (b.avail + b.inTransit) / b.daily : 999
      return ca - cb
    })

  console.log('\n========== TIGHT COVER <55d (live, daily>=0.08) ==========')
  console.log(header)
  for (const s of tight) console.log(rowLine(s))

  console.log('\n========== WATCH EXTRA ==========')
  console.log(header)
  for (const code of WATCH.filter((c) => !groups.flatMap((g) => g[1]).includes(c))) {
    console.log(rowLine(pack(code)))
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
