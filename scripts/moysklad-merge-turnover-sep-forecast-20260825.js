#!/usr/bin/env node
/** Blend warehouse 30/90d turnover into the Sep forecast JSON. */
const fs = require('fs')
const path = require('path')
const API = 'https://api.moysklad.ru/api/remap/1.2'
const AUTH = 'Basic ' + Buffer.from(`${process.env.MOYSKLAD_LOGIN}:${process.env.MOYSKLAD_PASSWORD}`).toString('base64')
const SRC = path.join(__dirname, '..', 'docs', 'STOCK_FORECAST_SEP_2026-08-25.json')
const SKIP = /delivery|shipping|excellent|led lamp|geno-led|nd cell|sample|tester|leaflet|catalogue|catalog|non woven|nonwoven|trial kit/i

async function fetchTurnover(from, to, label) {
  const out = new Map()
  let offset = 0
  while (true) {
    const url = `${API}/report/turnover/all?momentFrom=${encodeURIComponent(from)}&momentTo=${encodeURIComponent(to)}&limit=1000&offset=${offset}`
    const res = await fetch(url, {
      headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8', 'Accept-Encoding': 'gzip' },
    })
    const data = await res.json()
    for (const r of data.rows || []) {
      const code = r.assortment?.code
      if (!code) continue
      out.set(code, Number(r.outcome?.quantity || 0))
    }
    console.log(`  [${label}] ${out.size}`)
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return out
}

function fmt(d) {
  return d.toISOString().replace('T', ' ').slice(0, 19)
}

async function main() {
  const now = new Date()
  const t30 = await fetchTurnover(fmt(new Date(now - 30 * 864e5)), fmt(now), '30d')
  const t90 = await fetchTurnover(fmt(new Date(now - 90 * 864e5)), fmt(now), '90d')
  const d = JSON.parse(fs.readFileSync(SRC, 'utf8'))
  const skip = (s) => SKIP.test(s.name || '') || SKIP.test(s.code || '')
  for (const s of d.core) {
    const o30 = t30.get(s.code) || 0
    const o90 = t90.get(s.code) || 0
    const rate = Math.max(o30 / 30, (o90 / 90) * 0.7)
    const profitDaily = s.daily || 0
    const blend = Math.max(profitDaily, rate)
    s.outcome30 = o30
    s.outcome90 = o90
    s.whDaily = Math.round(rate * 100) / 100
    s.blendDaily = Math.round(blend * 100) / 100
    s.coverBlend = blend > 0 ? Math.round(s.available / blend) : null
    s.need90Blend = Math.max(0, Math.ceil(blend * 90 - s.available - (s.inTransit || 0)))
    let decision = 'OK'
    if (!skip(s) && blend > 0 && s.available <= 0) decision = 'STOCKOUT'
    else if (!skip(s) && s.coverBlend != null && s.coverBlend < 30) decision = 'ORDER_NOW'
    else if (!skip(s) && s.coverBlend != null && s.coverBlend < 55) decision = 'ORDER_SEP'
    else if (!skip(s) && s.coverBlend != null && s.coverBlend < 75 && s.need90Blend >= 8) decision = 'WATCH'
    s.decisionBlend = skip(s) ? 'SKIP' : decision
  }
  const real = d.core.filter((s) => s.decisionBlend && s.decisionBlend !== 'SKIP' && s.decisionBlend !== 'OK')
  d.blend = {
    orderNow: d.core.filter((s) => s.decisionBlend === 'STOCKOUT' || s.decisionBlend === 'ORDER_NOW'),
    orderSep: d.core.filter((s) => s.decisionBlend === 'ORDER_SEP'),
    watch: d.core.filter((s) => s.decisionBlend === 'WATCH'),
  }
  d.blend.poUnits = [...d.blend.orderNow, ...d.blend.orderSep].reduce((a, s) => a + s.need90Blend, 0)
  const urgent = d.blend.orderNow.length + d.blend.orderSep.length
  d.blend.verdict = d.blend.orderNow.length >= 2 || d.blend.poUnits >= 60 ? 'SMALL_SEP_PO' : urgent ? 'SMALL_SEP_PO' : 'SKIP_SEP'
  fs.writeFileSync(SRC, JSON.stringify(d, null, 2))
  console.log('\nBLEND NOW')
  for (const s of d.blend.orderNow) console.log(s.code, s.coverBlend + 'd', 'av' + s.available, 'need' + s.need90Blend, 'wh' + s.whDaily, s.name)
  console.log('BLEND SEP')
  for (const s of d.blend.orderSep) console.log(s.code, s.coverBlend + 'd', 'av' + s.available, 'need' + s.need90Blend, 'wh' + s.whDaily, s.name)
  console.log('BLEND WATCH')
  for (const s of d.blend.watch) console.log(s.code, s.coverBlend + 'd', 'av' + s.available, 'need' + s.need90Blend, 'wh' + s.whDaily, s.name)
  console.log('VERDICT', d.blend.verdict, 'poUnits', d.blend.poUnits)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
