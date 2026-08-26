#!/usr/bin/env node
/**
 * Stock + YoY monthly demand + September order decision.
 * Sold qty from report/profit/byproduct (net). Cover from warehouse stock.
 *
 *   node --import dotenv/config scripts/moysklad-stock-forecast-sep-20260825.js
 */
const fs = require('fs')
const path = require('path')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')

const DO_NOT_REORDER = new Set(['00042', '00028'])
const LEAD_DAYS = 21
const TARGET_COVER = 90
const TODAY = new Date('2026-08-25T07:00:00.000Z')
const AUG_2026_DAYS = 25
const OUT_JSON = path.join(__dirname, '..', 'docs', 'STOCK_FORECAST_SEP_2026-08-25.json')

const MONTHS = []
for (const y of [2025, 2026]) {
  for (let m = 1; m <= 12; m++) {
    if (y === 2026 && m > 8) break
    MONTHS.push(`${y}-${String(m).padStart(2, '0')}`)
  }
}

function monthBounds(ym) {
  const [y, m] = ym.split('-').map(Number)
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate()
  const mm = String(m).padStart(2, '0')
  return {
    from: `${y}-${mm}-01 00:00:00`,
    to: `${y}-${mm}-${String(last).padStart(2, '0')} 23:59:59`,
  }
}

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr.slice(0, 120)} ${text.slice(0, 240)}`)
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
    await new Promise((r) => setTimeout(r, 200))
  }
  return rows
}

function isNoise(code, name) {
  const n = (name || '').toLowerCase()
  const c = code || ''
  if (DO_NOT_REORDER.has(c)) return true
  if (/sample|tester|leaflet|catalogue|catalog|non woven|nonwoven|trial kit|foc/i.test(n)) return true
  if (/^54462$/.test(c)) return true
  return false
}

function shortName(name) {
  return String(name || '')
    .replace(/^Genosys\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function main() {
  console.log('Fetching stock, archived, POs, monthly profit...')
  const [stockRows, archivedRows, pos] = await Promise.all([
    fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1'),
    fetchAll('/entity/product?filter=archived=true'),
    fetchAll('/entity/purchaseorder?order=moment,desc'),
  ])
  const archived = new Set(archivedRows.map((p) => p.code).filter(Boolean))
  const stock = new Map()
  for (const r of stockRows) {
    if (!r.code) continue
    stock.set(r.code, {
      code: r.code,
      name: r.name,
      stock: Number(r.stock || 0),
      reserve: Number(r.reserve || 0),
      inTransit: Number(r.inTransit || 0),
      available: Number(r.stock || 0) - Number(r.reserve || 0),
      salePrice: Number(r.salePrice || 0) / 100,
    })
  }

  const openPos = []
  for (const po of pos.slice(0, 40)) {
    const shipped = Number(po.shippedSum || 0)
    const sum = Number(po.sum || 0)
    const applicable = po.applicable !== false
    const name = po.name || ''
    if (!applicable) continue
    if (sum > 0 && shipped >= sum - 1) continue
    if (po.moment < '2026-01-01') continue
    openPos.push({
      name,
      moment: po.moment?.slice(0, 10),
      sumAed: sum / 100,
      shippedAed: shipped / 100,
      id: po.id,
    })
  }

  const monthly = {}
  for (const ym of MONTHS) {
    const { from, to } = monthBounds(ym)
    const rows = await fetchAll(
      `/report/profit/byproduct?momentFrom=${encodeURIComponent(from)}&momentTo=${encodeURIComponent(to)}`,
    )
    const map = {}
    let units = 0
    let sellAed = 0
    for (const r of rows) {
      const code = r.assortment?.code || r.code || ''
      const name = r.assortment?.name || r.name || ''
      const qty = Number(r.sellQuantity || r.quantity || 0)
      const sell = Number(r.sellSum || r.sellPrice || 0) / 100
      if (!code) continue
      map[code] = { name, qty, sell }
      units += qty
      sellAed += sell
    }
    monthly[ym] = { units, sellAed: Math.round(sellAed * 100) / 100, byCode: map }
    console.log(`  ${ym}  ${rows.length} SKUs  ${units.toFixed(0)} units  ${sellAed.toFixed(0)} AED`)
    await new Promise((r) => setTimeout(r, 250))
  }

  const codes = new Set([...stock.keys()])
  for (const ym of MONTHS) {
    for (const c of Object.keys(monthly[ym].byCode)) codes.add(c)
  }

  const yoyMonths = ['01', '02', '03', '04', '05', '06', '07']
  function sold(code, ym) {
    return monthly[ym]?.byCode?.[code]?.qty || 0
  }
  function nameOf(code) {
    return stock.get(code)?.name || MONTHS.map((ym) => monthly[ym].byCode[code]?.name).find(Boolean) || code
  }

  const sku = []
  for (const code of codes) {
    if (archived.has(code)) continue
    const name = nameOf(code)
    const st = stock.get(code) || { available: 0, stock: 0, reserve: 0, inTransit: 0, salePrice: 0 }
    const m2025 = {}
    const m2026 = {}
    for (let m = 1; m <= 12; m++) {
      const mm = String(m).padStart(2, '0')
      m2025[mm] = sold(code, `2025-${mm}`)
      if (m <= 8) m2026[mm] = sold(code, `2026-${mm}`)
    }
    const janJul25 = yoyMonths.reduce((s, mm) => s + (m2025[mm] || 0), 0)
    const janJul26 = yoyMonths.reduce((s, mm) => s + (m2026[mm] || 0), 0)
    const yoy = janJul25 > 0 ? janJul26 / janJul25 : janJul26 > 0 ? null : 1
    const aug26Run = (m2026['08'] || 0) * (31 / AUG_2026_DAYS)
    const recent3 = [m2026['06'] || 0, m2026['07'] || 0, aug26Run]
    const recentAvg = recent3.reduce((a, b) => a + b, 0) / 3
    const sep25 = m2025['09'] || 0
    const oct25 = m2025['10'] || 0
    const nov25 = m2025['11'] || 0
    const factor = yoy == null ? 1 : Math.min(2.2, Math.max(0.55, yoy))
    const sepF = Math.max(sep25 * factor, recentAvg)
    const octF = Math.max(oct25 * factor, recentAvg * 0.95)
    const novF = Math.max(nov25 * factor, recentAvg * 0.9)
    const daily = sepF / 30
    const cover = daily > 0 ? st.available / daily : Infinity
    const afterLead = st.available - daily * LEAD_DAYS
    const need90 = Math.max(0, Math.ceil(daily * TARGET_COVER - st.available - st.inTransit))
    const noise = isNoise(code, name)
    const active = !noise && (janJul26 + (m2026['08'] || 0) > 0 || daily > 0)
    let decision = 'OK'
    if (!noise && daily > 0 && st.available <= 0) decision = 'STOCKOUT'
    else if (!noise && cover < 30) decision = 'ORDER_NOW'
    else if (!noise && cover < 55) decision = 'ORDER_SEP'
    else if (!noise && cover < 75 && need90 >= 8) decision = 'WATCH'
    sku.push({
      code,
      name: shortName(name),
      available: st.available,
      stock: st.stock,
      inTransit: st.inTransit,
      m2025,
      m2026,
      janJul25,
      janJul26,
      yoy: yoy == null ? null : Math.round(yoy * 100) / 100,
      sep25,
      oct25,
      nov25,
      aug26Run: Math.round(aug26Run * 10) / 10,
      recentAvg: Math.round(recentAvg * 10) / 10,
      sepF: Math.round(sepF * 10) / 10,
      octF: Math.round(octF * 10) / 10,
      novF: Math.round(novF * 10) / 10,
      daily: Math.round(daily * 100) / 100,
      cover: cover === Infinity ? null : Math.round(cover),
      afterLead: Math.round(afterLead * 10) / 10,
      need90,
      decision,
      noise,
      active,
    })
  }

  sku.sort((a, b) => {
    const order = { STOCKOUT: 0, ORDER_NOW: 1, ORDER_SEP: 2, WATCH: 3, OK: 4 }
    const d = (order[a.decision] ?? 9) - (order[b.decision] ?? 9)
    if (d) return d
    return (a.cover ?? 9999) - (b.cover ?? 9999)
  })

  const company = MONTHS.map((ym) => ({
    ym,
    units: Math.round(monthly[ym].units),
    sellAed: monthly[ym].sellAed,
  }))

  const yoyCompany = yoyMonths.map((mm) => {
    const a = monthly[`2025-${mm}`].units
    const b = monthly[`2026-${mm}`].units
    return {
      month: mm,
      u2025: Math.round(a),
      u2026: Math.round(b),
      deltaPct: a ? Math.round(((b - a) / a) * 100) : null,
    }
  })
  const sum25 = yoyCompany.reduce((s, r) => s + r.u2025, 0)
  const sum26 = yoyCompany.reduce((s, r) => s + r.u2026, 0)
  const companyYoy = sum25 ? sum26 / sum25 : null

  const core = sku.filter((s) => !s.noise && s.active)
  const orderNow = core.filter((s) => s.decision === 'STOCKOUT' || s.decision === 'ORDER_NOW')
  const orderSep = core.filter((s) => s.decision === 'ORDER_SEP')
  const watch = core.filter((s) => s.decision === 'WATCH')
  const poUnits = [...orderNow, ...orderSep].reduce((s, r) => s + r.need90, 0)
  const poLines = [...orderNow, ...orderSep].filter((s) => s.need90 > 0)

  const verdict =
    orderNow.length >= 3 || poUnits >= 80
      ? 'YES_SEP_PO'
      : orderNow.length + orderSep.length >= 4
        ? 'SMALL_SEP_PO'
        : 'SKIP_SEP'

  const result = {
    generatedAt: new Date().toISOString(),
    asOf: '2026-08-25',
    method: {
      sold: 'MoySklad report/profit/byproduct sellQuantity, net of returns',
      cover: 'warehouse available / forecast Sep daily rate',
      sepForecast: 'max(Sep2025 × YoY Jan–Jul factor capped 0.55–2.2, avg(Jun,Jul,Aug-run-rate))',
      augAnnualized: `Aug 1–${AUG_2026_DAYS} × 31/${AUG_2026_DAYS}`,
      leadDays: LEAD_DAYS,
      targetCoverDays: TARGET_COVER,
      justArrived: 'DM GME 260810 received 24 Aug (beige 100, collagen 300, SPF/PDRN/masks small)',
    },
    company,
    yoyCompany,
    companyYoy: companyYoy ? Math.round(companyYoy * 100) / 100 : null,
    janJul25: sum25,
    janJul26: sum26,
    openPos,
    verdict,
    counts: {
      core: core.length,
      stockoutOrNow: orderNow.length,
      orderSep: orderSep.length,
      watch: watch.length,
      poUnits,
      poLines: poLines.length,
    },
    orderNow,
    orderSep,
    watch,
    poLines,
    core,
  }

  fs.writeFileSync(OUT_JSON, JSON.stringify(result, null, 2))
  console.log('\n=== COMPANY YOY UNITS Jan–Jul ===')
  for (const r of yoyCompany) {
    console.log(`  ${r.month}  2025 ${r.u2025}  2026 ${r.u2026}  ${r.deltaPct == null ? 'n/a' : r.deltaPct + '%'}`)
  }
  console.log(`  TOTAL  ${sum25} → ${sum26}  YoY ${result.companyYoy}x`)
  console.log('\n=== OPEN POs ===')
  for (const p of openPos) console.log(`  ${p.moment} ${p.name} ${p.shippedAed}/${p.sumAed}`)
  if (!openPos.length) console.log('  none open')
  console.log(`\nVERDICT ${verdict}  now=${orderNow.length} sep=${orderSep.length} watch=${watch.length} poUnits=${poUnits}`)
  console.log(`JSON ${OUT_JSON}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
