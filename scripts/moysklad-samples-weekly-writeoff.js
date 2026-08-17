#!/usr/bin/env node

/**
 * Weekly batch write-off for free samples/testers logged in docs/samples/SAMPLES_OUT_LOG.csv
 *
 * Reads rows with status=pending, posts one MoySklad loss @ buyPrice, marks rows done.
 *
 *   node --import dotenv/config scripts/moysklad-samples-weekly-writeoff.js
 *   node --import dotenv/config scripts/moysklad-samples-weekly-writeoff.js --commit
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

const { uaeToday, uaeMomentNow } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const STORE_ID = 'e186d449-33c5-11ea-0a80-043f000b273a'
const LOG_PATH = path.join(__dirname, '..', 'docs', 'samples', 'SAMPLES_OUT_LOG.csv')

async function api(method, pathStr, body, attempt = 1) {
  const url = pathStr.startsWith('http') ? pathStr : API + pathStr
  try {
    const res = await fetch(url, {
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
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    if (attempt < 5 && (e.message === 'fetch failed' || e.cause?.code === 'ECONNRESET')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim())
  if (!lines.length) return { header: [], rows: [] }
  const header = lines[0].split(',').map((h) => h.trim())
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i])
    if (!cols.length || cols.every((c) => !c.trim())) continue
    const obj = {}
    header.forEach((h, idx) => {
      obj[h] = (cols[idx] || '').trim()
    })
    rows.push(obj)
  }
  return { header, rows }
}

/** Minimal CSV split (supports quoted fields). */
function splitCsvLine(line) {
  const out = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"'
        i++
      } else inQ = !inQ
      continue
    }
    if (ch === ',' && !inQ) {
      out.push(cur)
      cur = ''
      continue
    }
    cur += ch
  }
  out.push(cur)
  return out
}

function escapeCsv(val) {
  const s = String(val ?? '')
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function writeCsv(header, rows) {
  const lines = [header.join(',')]
  for (const r of rows) {
    lines.push(header.map((h) => escapeCsv(r[h] ?? '')).join(','))
  }
  fs.writeFileSync(LOG_PATH, lines.join('\n') + '\n', 'utf8')
}

async function main() {
  console.log('====================================================================')
  console.log('  Samples out — weekly batch write-off')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Log : ${LOG_PATH}`)

  if (!fs.existsSync(LOG_PATH)) {
    throw new Error(`Log not found: ${LOG_PATH}`)
  }

  const { header, rows } = parseCsv(fs.readFileSync(LOG_PATH, 'utf8'))
  const required = ['date', 'code', 'qty', 'customer', 'note', 'status', 'writeoff_doc']
  for (const h of required) {
    if (!header.includes(h)) throw new Error(`Log missing column: ${h}`)
  }

  const pendingIdx = []
  const pending = []
  rows.forEach((r, idx) => {
    if ((r.status || '').toLowerCase() === 'pending') {
      pendingIdx.push(idx)
      pending.push(r)
    }
  })

  if (!pending.length) {
    console.log('\n  No pending rows — nothing to write off.')
    return
  }

  console.log(`\n  Pending rows: ${pending.length}`)
  const byCode = new Map()
  for (const r of pending) {
    const qty = Number(r.qty)
    if (!r.code || !Number.isFinite(qty) || qty <= 0) {
      throw new Error(`Bad row: ${JSON.stringify(r)}`)
    }
    byCode.set(r.code, (byCode.get(r.code) || 0) + qty)
    console.log(
      `    ${r.date} ${r.code} x${qty} → ${r.customer || '(no customer)'} | ${r.note || ''}`,
    )
  }

  const stockRows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of stockRows) {
    if (!row.code) continue
    stock.set(row.code, {
      id: row.meta?.href?.split('/').pop()?.split('?')[0],
      name: row.name,
      available: Number(row.stock || 0) - Number(row.reserve || 0),
    })
  }

  const positions = []
  let totalMinor = 0
  let totalQty = 0
  console.log('\n  Aggregated write-off lines:')
  for (const [code, qty] of [...byCode.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const row = stock.get(code)
    if (!row?.id) throw new Error(`Unknown code: ${code}`)
    if (row.available < qty) {
      throw new Error(`Insufficient ${code}: need ${qty}, have ${row.available}`)
    }
    const p = await api('GET', `/entity/product/${row.id}`)
    const buyMinor = p.buyPrice?.value ?? 0
    totalMinor += buyMinor * qty
    totalQty += qty
    positions.push({
      quantity: qty,
      price: buyMinor,
      assortment: href('product', row.id),
      vat: 0,
      vatEnabled: false,
    })
    console.log(
      `    ${code} x${qty} @ ${money(buyMinor)} → ${money(buyMinor * qty)} | avail ${row.available} | ${row.name.slice(0, 50)}`,
    )
  }
  console.log(`\n  Total buy cost: ${money(totalMinor)} AED | ${totalQty} pcs`)

  const marker = `SAMPLES-OUT-WEEKLY-${uaeToday()}`
  const customers = [...new Set(pending.map((r) => r.customer).filter(Boolean))].join(', ')

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit to post write-off + update log')
    return
  }

  const dup = await api('GET', `/entity/loss?search=${encodeURIComponent(marker)}&limit=5`)
  if ((dup.rows || []).some((r) => (r.description || '').includes(marker))) {
    throw new Error(`Duplicate write-off marker today: ${marker}`)
  }

  const created = await api('POST', '/entity/loss', {
    applicable: true,
    moment: uaeMomentNow(),
    description: [
      marker,
      'Reason: Samples/testers given free (weekly batch from SAMPLES_OUT_LOG).',
      customers ? `Customers: ${customers}` : 'See log rows.',
      `${pending.length} log lines → ${byCode.size} SKUs.`,
    ].join(' | '),
    organization: href('organization', ORG_ID),
    store: href('store', STORE_ID),
    positions,
  })

  for (const idx of pendingIdx) {
    rows[idx].status = 'done'
    rows[idx].writeoff_doc = created.name
  }
  writeCsv(header, rows)

  console.log(`\n  Write-off: ${created.name} | ${money(created.sum || totalMinor)} AED`)
  console.log(`  https://online.moysklad.ru/app/#loss/edit?id=${created.id}`)
  console.log(`  Log updated: ${pendingIdx.length} rows → status=done`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
