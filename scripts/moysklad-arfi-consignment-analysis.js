#!/usr/bin/env node

/**
 * Read-only MoySklad analysis for ARFI consignment recommendations.
 *
 * Usage:
 *   set -a; source .env; set +a
 *   node scripts/moysklad-arfi-consignment-analysis.js
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
const SINCE = '2023-01-01 00:00:00'
const NOW = new Date()
const TO = NOW.toISOString().replace('T', ' ').slice(0, 19)

const TARGETS = [
  'ARFI NAILS BEAUTY SALON',
  'ARFI NAILS BEAUTY SALON 2',
]

const DO_NOT_REORDER_CODES = new Set(['00042'])

async function api(pathname) {
  const url = pathname.startsWith('http') ? pathname : `${API}${pathname}`
  const res = await fetch(url, {
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
    },
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} on ${url.slice(0, 160)} — ${text.slice(0, 300)}`)
  }
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathname) {
  const rows = []
  let offset = 0
  const limit = 1000
  while (true) {
    const sep = pathname.includes('?') ? '&' : '?'
    const page = await api(`${pathname}${sep}limit=${limit}&offset=${offset}`)
    const batch = page?.rows || []
    rows.push(...batch)
    if (batch.length < limit) break
    offset += limit
  }
  return rows
}

async function fetchPositions(docMetaHref) {
  return fetchAll(`${docMetaHref}/positions`)
}

const assortmentCache = new Map()
async function resolveAssortment(assortmentRef) {
  const href = assortmentRef?.meta?.href
  if (!href) return assortmentRef || {}
  if (!assortmentCache.has(href)) {
    assortmentCache.set(href, api(href).catch(() => assortmentRef || {}))
  }
  return assortmentCache.get(href)
}

function cleanNumber(n) {
  const value = Number(n || 0)
  return Number.isFinite(value) ? value : 0
}

function normalizeName(name) {
  return String(name || '')
    .replace(/\s+/g, ' ')
    .trim()
}

function keyForAssortment(assortment) {
  const href = assortment?.meta?.href || ''
  const id = href.split('/').pop() || ''
  return id || assortment?.code || assortment?.name || ''
}

function isGenosysProduct(name) {
  const n = String(name || '').toLowerCase()
  return (
    n.includes('genosys') ||
    n.includes('power solution') ||
    n.includes('skin caring') ||
    n.includes('revita glow') ||
    n.includes('eyecell') ||
    n.includes('hr3') ||
    n.includes('hr³') ||
    n.includes('bio meso') ||
    n.includes('needle pen') ||
    n.includes('microbiome') ||
    n.includes('peptide gel mask') ||
    n.includes('hydro cool')
  )
}

async function resolveCounterparties() {
  const out = []
  for (const target of TARGETS) {
    const exact = await fetchAll(`/entity/counterparty?filter=name=${encodeURIComponent(target)}`)
    const rows = exact.length
      ? exact
      : await fetchAll(`/entity/counterparty?search=${encodeURIComponent(target)}`)
    out.push({
      target,
      matches: rows.map((r) => ({
        id: r.id,
        name: r.name,
        phone: r.phone || '',
        email: r.email || '',
        companyType: r.companyType || '',
        metaHref: r.meta?.href,
      })),
    })
  }
  return out
}

async function fetchDocsForAgent(entity, agentHref) {
  const filter = [
    `agent=${agentHref}`,
    `moment>=${SINCE}`,
    `moment<=${TO}`,
  ].join(';')
  return fetchAll(`/entity/${entity}?filter=${encodeURIComponent(filter)}&order=moment,asc`)
}

async function fetchStockAll() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  const unique = []
  for (const r of rows) {
    const key = r.meta?.href?.split('/').pop() || r.id || r.code || r.name
    if (!key) continue
    const item = {
      id: key,
      code: r.code || '',
      name: r.name || '',
      stock: cleanNumber(r.stock),
      reserve: cleanNumber(r.reserve),
      inTransit: cleanNumber(r.inTransit),
      available: cleanNumber(r.stock) - cleanNumber(r.reserve),
      salePriceAed: cleanNumber(r.salePrice) / 100,
    }
    unique.push(item)
    stock.set(key, item)
    if (item.code) stock.set(item.code, item)
    if (item.name) stock.set(item.name, item)
  }
  stock.rows = unique
  return stock
}

async function fetchTurnover(days) {
  const from = new Date(NOW.getTime() - days * 24 * 3600 * 1000)
    .toISOString()
    .replace('T', ' ')
    .slice(0, 19)
  const rows = await fetchAll(
    `/report/turnover/all?momentFrom=${encodeURIComponent(from)}&momentTo=${encodeURIComponent(TO)}`
  )
  const out = new Map()
  for (const r of rows) {
    const a = r.assortment || {}
    const key = a.meta?.href?.split('/').pop() || a.code || a.name
    if (!key) continue
    out.set(key, {
      id: key,
      name: a.name || '',
      code: a.code || '',
      outcome: cleanNumber(r.outcome?.quantity),
      income: cleanNumber(r.income?.quantity),
    })
  }
  return out
}

async function buildLedgerForAgent(agent) {
  const [demands, returns, customerOrders, invoices] = await Promise.all([
    fetchDocsForAgent('demand', agent.metaHref),
    fetchDocsForAgent('salesreturn', agent.metaHref),
    fetchDocsForAgent('customerorder', agent.metaHref),
    fetchDocsForAgent('invoiceout', agent.metaHref),
  ])

  const ledger = new Map()
  const docs = []

  async function applyDoc(doc, type, sign) {
    const positions = await fetchPositions(doc.meta.href)
    let totalQty = 0
    for (const p of positions) {
      const a = await resolveAssortment(p.assortment)
      const name = normalizeName(a.name)
      if (!isGenosysProduct(name)) continue
      const id = keyForAssortment(a)
      if (!id) continue
      const qty = cleanNumber(p.quantity)
      totalQty += qty
      const existing = ledger.get(id) || {
        id,
        code: a.code || '',
        name,
        shipped: 0,
        returned: 0,
        ordered: 0,
        invoiced: 0,
        shipped90: 0,
        shipped180: 0,
        revenueAed: 0,
        lastMoment: null,
        docs: [],
      }
      if (type === 'demand') {
        existing.shipped += qty
        const ageDays = (NOW.getTime() - new Date(doc.moment).getTime()) / (24 * 3600 * 1000)
        if (ageDays <= 90) existing.shipped90 += qty
        if (ageDays <= 180) existing.shipped180 += qty
        existing.revenueAed += (cleanNumber(p.price) * qty) / 100
      } else if (type === 'salesreturn') {
        existing.returned += qty
      } else if (type === 'customerorder') {
        existing.ordered += qty
      } else if (type === 'invoiceout') {
        existing.invoiced += qty
      }
      existing.lastMoment = !existing.lastMoment || doc.moment > existing.lastMoment ? doc.moment : existing.lastMoment
      existing.docs.push({ type, name: doc.name, moment: doc.moment, qty: sign * qty })
      ledger.set(id, existing)
    }
    docs.push({
      type,
      id: doc.id,
      name: doc.name,
      moment: doc.moment,
      sumAed: cleanNumber(doc.sum) / 100,
      description: doc.description || '',
      positions: positions.length,
      genosysQty: totalQty,
    })
  }

  for (const d of demands) await applyDoc(d, 'demand', 1)
  for (const r of returns) await applyDoc(r, 'salesreturn', -1)
  for (const o of customerOrders) await applyDoc(o, 'customerorder', 0)
  for (const inv of invoices) await applyDoc(inv, 'invoiceout', 0)

  const items = Array.from(ledger.values()).map((r) => ({
    ...r,
    netConsignmentQty: r.shipped - r.returned,
    docCount: r.docs.length,
  }))

  items.sort((a, b) => {
    const n = b.netConsignmentQty - a.netConsignmentQty
    if (n) return n
    return b.revenueAed - a.revenueAed
  })

  docs.sort((a, b) => String(b.moment).localeCompare(String(a.moment)))
  return { docs, items }
}

function classifyProduct(name) {
  const n = String(name || '').toLowerCase()
  if (n.includes('sun') || n.includes('spf')) return 'Sun protection'
  if (n.includes('bb') || n.includes('cushion') || n.includes('blemish balm')) return 'BB / tone-up'
  if (n.includes('cleanser') || n.includes('remover')) return 'Cleanser / remover'
  if (n.includes('cream') || n.includes('mask')) return 'Cream / mask'
  if (n.includes('serum') || n.includes('tonic') || n.includes('mist')) return 'Serum / tonic'
  if (n.includes('hair') || n.includes('scalp') || n.includes('hr')) return 'Hair / scalp'
  if (n.includes('solution') || n.includes('peeling') || n.includes('pdrn') || n.includes('bio meso')) return 'Professional'
  return 'Other'
}

function recommendForAgent(agentResult, stock, turnover30, turnover90, peerItems) {
  const existingIds = new Set(agentResult.items.filter((i) => i.netConsignmentQty > 0).map((i) => i.id))
  const historyIds = new Set(agentResult.items.map((i) => i.id))
  const recommendations = []

  for (const item of agentResult.items) {
    const s = stock.get(item.id) || stock.get(item.code) || stock.get(item.name)
    if (!s || s.available <= 0 || DO_NOT_REORDER_CODES.has(s.code)) continue
    const t30 = turnover30.get(item.id)?.outcome || 0
    const t90 = turnover90.get(item.id)?.outcome || 0
    const globalScore = t30 * 2 + t90
    const recentBranchQty = item.shipped90 || 0
    const semiRecentBranchQty = item.shipped180 || 0
    const qty =
      recentBranchQty >= 8 ? 4 :
      recentBranchQty >= 4 ? 3 :
      recentBranchQty > 0 ? 2 :
      semiRecentBranchQty >= 4 && globalScore >= 20 ? 2 :
      0
    if (qty <= 0) continue
    const boundedQty = Math.max(0, Math.min(qty, Math.floor(s.available * 0.25), 6))
    if (boundedQty <= 0) continue
    recommendations.push({
      salonAction: 'Top up existing',
      id: item.id,
      code: s.code,
      name: s.name || item.name,
      category: classifyProduct(s.name || item.name),
      currentAtSalon: item.netConsignmentQty,
      recentBranchQty90d: recentBranchQty,
      recommendedQty: boundedQty,
      warehouseAvailable: s.available,
      global30dSold: t30,
      global90dSold: t90,
      reason: `Already moving at this branch (${recentBranchQty} units shipped in last 90d); add a controlled top-up from available warehouse stock.`,
    })
  }

  const candidateMap = new Map()
  for (const s of stock.rows || []) {
    const id = s.id
    if (existingIds.has(id) || DO_NOT_REORDER_CODES.has(s.code)) continue
    if (!isGenosysProduct(s.name) || s.available <= 2) continue
    const t30 = turnover30.get(id)?.outcome || 0
    const t90 = turnover90.get(id)?.outcome || 0
    const inPeer = peerItems.some((p) => (p.id === id || p.code === s.code) && (p.shipped90 > 0 || p.netConsignmentQty > 0))
    const score = t30 * 2 + t90 + (inPeer ? 15 : 0) + (historyIds.has(id) ? 8 : 0)
    if (score <= 8) continue
    const qty = Math.min(score >= 80 ? 4 : score >= 35 ? 3 : 2, Math.floor(s.available * 0.2), 5)
    if (qty <= 0) continue
    candidateMap.set(id, {
      salonAction: historyIds.has(id) ? 'Reintroduce' : 'Add new',
      id,
      code: s.code,
      name: s.name,
      category: classifyProduct(s.name),
      currentAtSalon: 0,
      recentBranchQty90d: 0,
      recommendedQty: qty,
      warehouseAvailable: s.available,
      global30dSold: t30,
      global90dSold: t90,
      reason: inPeer
        ? 'Carried by the other ARFI branch and has broader GENOSYS sell-through.'
        : 'Not currently at this branch; selected from live warehouse stock and recent GENOSYS sell-through.',
      score,
    })
  }

  recommendations.push(
    ...Array.from(candidateMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(({ score, ...r }) => r)
  )

  const priority = {
    'Top up existing': 0,
    Reintroduce: 1,
    'Add new': 2,
  }

  return recommendations
    .sort((a, b) => {
      const d = priority[a.salonAction] - priority[b.salonAction]
      if (d) return d
      return b.global30dSold * 2 + b.global90dSold - (a.global30dSold * 2 + a.global90dSold)
    })
    .slice(0, 14)
}

async function main() {
  console.log('Resolving ARFI counterparties...')
  const counterpartyGroups = await resolveCounterparties()

  const selected = counterpartyGroups.map((group) => {
    const exact = group.matches.find((m) => m.name === group.target)
    return exact || group.matches[0]
  })

  if (selected.some((x) => !x)) {
    console.log(JSON.stringify(counterpartyGroups, null, 2))
    throw new Error('Could not resolve both ARFI counterparties.')
  }

  console.log('Fetching warehouse stock and global turnover...')
  const [stock, turnover30, turnover90] = await Promise.all([
    fetchStockAll(),
    fetchTurnover(30),
    fetchTurnover(90),
  ])

  const salonResults = []
  for (const agent of selected) {
    console.log(`Fetching documents for ${agent.name}...`)
    const ledger = await buildLedgerForAgent(agent)
    salonResults.push({ agent, ...ledger })
  }

  for (const result of salonResults) {
    const peerItems = salonResults
      .filter((r) => r.agent.id !== result.agent.id)
      .flatMap((r) => r.items)
    result.recommendations = recommendForAgent(result, stock, turnover30, turnover90, peerItems)
  }

  const summary = {
    generatedAt: NOW.toISOString(),
    periodSince: SINCE,
    periodTo: TO,
    counterpartiesSearched: counterpartyGroups,
    salons: salonResults.map((r) => ({
      agent: r.agent,
      docs: r.docs,
      currentConsignment: r.items.map((i) => {
        const s = stock.get(i.id)
        const t30 = turnover30.get(i.id)
        const t90 = turnover90.get(i.id)
        return {
          id: i.id,
          code: i.code || s?.code || '',
          name: i.name || s?.name || '',
          shipped: i.shipped,
          returned: i.returned,
          netConsignmentQty: i.netConsignmentQty,
          shipped90: i.shipped90,
          shipped180: i.shipped180,
          orderedQty: i.ordered,
          invoicedQty: i.invoiced,
          revenueAed: Number(i.revenueAed.toFixed(2)),
          lastMoment: i.lastMoment,
          warehouseAvailable: s?.available || 0,
          global30dSold: t30?.outcome || 0,
          global90dSold: t90?.outcome || 0,
        }
      }),
      recommendations: r.recommendations,
    })),
  }

  const outputPath = path.join(process.cwd(), 'tmp', 'moysklad-arfi-consignment-analysis.json')
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2), 'utf8')

  console.log(`Wrote ${outputPath}`)
  for (const salon of summary.salons) {
    console.log()
    console.log(`${salon.agent.name}:`)
    console.log(`  documents: ${salon.docs.length}`)
    console.log(`  current consignment SKUs: ${salon.currentConsignment.filter((i) => i.netConsignmentQty > 0).length}`)
    console.log(`  recommendation lines: ${salon.recommendations.length}`)
    for (const r of salon.recommendations.slice(0, 8)) {
      console.log(`  + ${r.recommendedQty} × ${r.name} (${r.salonAction}; stock ${r.warehouseAvailable})`)
    }
  }
}

main().catch((error) => {
  console.error('Fatal:', error.message)
  process.exit(1)
})
