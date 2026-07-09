#!/usr/bin/env node
/** Read-only: resolve Borscheva order items to code / clinic salePrice / available. */
const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD
if (!LOGIN || !PASSWORD) { console.error('set creds'); process.exit(1) }
const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function api(p, retries = 5) {
  for (let i = 0; i <= retries; i++) {
    await sleep(80)
    let res
    try {
      res = await fetch(p.startsWith('http') ? p : API + p, {
        headers: { Authorization: AUTH, Accept: 'application/json;charset=utf-8', 'Accept-Encoding': 'gzip' },
      })
    } catch (e) { if (i < retries) { await sleep(800 * (i + 1)); continue } throw e }
    const t = await res.text()
    if ((res.status === 429 || res.status === 503) && i < retries) { await sleep(600 * (i + 1)); continue }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${p} — ${t.slice(0, 300)}`)
    return t ? JSON.parse(t) : null
  }
}
async function fetchAll(p) {
  const rows = []; let o = 0
  while (true) {
    const sep = p.includes('?') ? '&' : '?'
    const d = await api(`${p}${sep}limit=1000&offset=${o}`)
    rows.push(...(d.rows || [])); if ((d.rows || []).length < 1000) break; o += 1000
  }
  return rows
}
const m = (x) => ((x || 0) / 100).toFixed(2)

const KEYS = [
  'SPF 50', 'SPF50', 'CUSHION', 'PDRN MASK', 'EYE ZONE', 'SENSITIVE',
  'OVERNIGHT', 'ANTI-WRINKLE CREAM', 'ANTI WRINKLE CREAM', 'SEA ALGAE', 'COLLAGEN',
]

async function main() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const seen = new Set()
  for (const key of KEYS) {
    console.log(`\n# match: "${key}"`)
    for (const r of rows) {
      if (!r.code || !r.name) continue
      if (!r.name.toUpperCase().includes(key.toUpperCase())) continue
      const id = r.code + '|' + r.name
      if (seen.has(id + key)) continue
      seen.add(id + key)
      const avail = Number(r.stock || 0) - Number(r.reserve || 0)
      console.log(`  ${r.code.padEnd(7)} ${String(r.name).slice(0, 52).padEnd(52)} clinic=${m(r.salePrice).padStart(8)}  avail=${avail}`)
    }
  }
}
main().catch((e) => { console.error('FATAL:', e.message); process.exit(1) })
