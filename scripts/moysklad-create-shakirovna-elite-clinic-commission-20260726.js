#!/usr/bin/env node

/**
 * Shakirovna Business Bay — consignment sold 28.06.2026–25.07.2026.
 * ELITE SHAKIROVNA LADIES SALON (contract 21) + SHAKIROVNA ESTHETIC CLINIC (contract 26).
 *
 * Creates commissioner reports only (no matching demand — sold stock is already on shelves).
 * Exports Consignment Sales PDFs → ~/Desktop/orders/
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-commission-20260726.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-commission-20260726.js --commit
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-elite-clinic-commission-20260726.js --commit --report=elite
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

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

const ARG_REPORT = (() => {
  const a = process.argv.find((x) => x.startsWith('--report='))
  return a ? a.split('=')[1] : 'all'
})()

/** Invoice_Consignment_Sales_Genosys */
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

const COMMON = {
  date: uaeToday(),
  moment: uaeMomentNow(),
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  stateNotPaidId: '3203736c-c43b-11eb-0a80-093a002b59a6',
  commissionPeriodStart: '2026-06-28 00:00:00',
  commissionPeriodEnd: '2026-07-25 23:59:59',
}

const MARKER_BASE = 'Shakirovna ELITE+CLINIC consignment sold 2026-06-28 to 2026-07-25'

const FALLBACK = {
  elite: {
    agentId: null,
    contractId: 'c24b0b09-5e34-11f0-0a80-1b1c0008232a', // agreement 21
  },
  clinic: {
    agentId: 'a187255f-a9b6-11f0-0a80-09900022125b',
    contractId: 'd08f670e-b993-11f0-0a80-19750031f04a', // agreement 26
  },
}

const SITES = [
  {
    key: 'elite',
    label: 'Elite_Salon',
    title: 'ELITE SHAKIROVNA LADIES SALON L.L.C',
    exactName: 'ELITE SHAKIROVNA LADIES SALON L.L.C',
    marker: `${MARKER_BASE} — ELITE SALON`,
    lines: [
      ['00195', 1], // Moisture Replenishing Hyaluron Serum 30ml
      ['54457', 1], // Ultra Shield Sun Cream SPF50 50g
      ['00029', 1], // Problem Control Serum 30ml
      ['54472', 1], // Revita Glow BB Cream #01 Bright 50g
      ['00053', 1], // EyeCell Eye Peptide Gel Patch (box)
      ['00122', 1], // Multi-Vita Radiance Cream 50g
      ['00144', 1], // Skin Caring Blemish Balm Cushion #2 Beige
      ['00063', 3], // Intensive Repair Collagen Mask 23g
      ['00140', 6], // Soothing Bomb Sea Algae Mask 25g
      ['54458', 1], // Moisture Replenishing Hyaluron Cream 50g
      ['00012', 4], // Peptide Gel Mask 39g (sheet 38g)
    ],
  },
  {
    key: 'clinic',
    label: 'Esthetic_Clinic',
    title: 'SHAKIROVNA ESTHETIC CLINIC L.L.C',
    exactName: 'SHAKIROVNA ESTHETIC CLINIC L.L.C',
    marker: `${MARKER_BASE} — ESTHETIC CLINIC`,
    lines: [
      ['00041', 1], // Multi Sun Cream SPF40 40g
      ['00122', 2], // Multi-Vita Radiance Cream 50g
      ['54464', 2], // Skin Caring Blemish Balm Cushion #3 Camel
      ['00144', 1], // Skin Caring Blemish Balm Cushion #2 Beige
      ['00063', 2], // Intensive Repair Collagen Mask 23g
      ['00140', 1], // Soothing Bomb Sea Algae Mask 25g
    ],
  },
]

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
    if (attempt < 5 && (e.cause?.code === 'ECONNRESET' || e.message === 'fetch failed')) {
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

function stateHref(entityType, stateId) {
  return {
    meta: {
      href: `${API}/entity/${entityType}/metadata/states/${stateId}`,
      type: 'state',
      mediaType: 'application/json',
    },
  }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function findCounterpartyByExactName(exactName) {
  const token = exactName.split(/\s+/)[0]
  const data = await api('GET', `/entity/counterparty?limit=100&search=${encodeURIComponent(token)}`)
  const hit = (data?.rows || []).find((r) => r.name === exactName)
  if (!hit) throw new Error(`Counterparty not found: "${exactName}"`)
  return hit
}

function isCommissionContract(c) {
  const t = c.contractType || c.type
  return t === 'Commission' || String(t).toLowerCase() === 'commission'
}

async function findCommissionContractId(agentId) {
  const filter = `agent=${API}/entity/counterparty/${agentId}`
  const data = await api('GET', `/entity/contract?filter=${encodeURIComponent(filter)}&limit=100`)
  const rows = data?.rows || []
  const comm = rows.filter(isCommissionContract)
  const pick = (list) => {
    if (!list.length) return null
    if (list.length === 1) return list[0].id
    list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ru'))
    return list[0].id
  }
  return pick(comm.length ? comm : rows)
}

async function resolveAgentAndContract(cfg) {
  const fb = FALLBACK[cfg.key]
  const agent = fb?.agentId ? { id: fb.agentId } : await findCounterpartyByExactName(cfg.exactName)
  const contractId = fb?.contractId || (await findCommissionContractId(agent.id))
  if (!contractId) throw new Error(`No commission contract for ${cfg.exactName}`)
  return { agentId: agent.id, contractId }
}

async function fetchStockByCode() {
  const rows = await fetchAll('/report/stock/all?stockMode=all&stockMoreThan=-1')
  const stock = new Map()
  for (const row of rows) {
    if (!row.code) continue
    stock.set(row.code, {
      id: row.meta?.href?.split('/').pop()?.split('?')[0],
      code: row.code,
      name: row.name,
      price: Number(row.salePrice || 0),
    })
  }
  return stock
}

async function ensureNoDuplicate(agentId, marker) {
  const filter = [
    `agent=${API}/entity/counterparty/${agentId}`,
    `moment>=${COMMON.date} 00:00:00`,
    `moment<=${COMMON.date} 23:59:59`,
  ].join(';')
  const docs = await fetchAll(`/entity/commissionreportin?filter=${encodeURIComponent(filter)}`)
  const dup = docs.find((d) => (d.description || '').includes(marker))
  if (dup) throw new Error(`Duplicate commissionreportin (${dup.name}, id=${dup.id})`)
}

function resolveLines(stock, lineTuples) {
  return lineTuples.map(([code, qty]) => {
    const item = stock.get(code)
    if (!item?.id) throw new Error(`Unknown code: ${code}`)
    if (!item.price) throw new Error(`No salePrice for ${code}`)
    return { ...item, qty }
  })
}

function printLines(resolved) {
  let sumMinor = 0
  let totalQty = 0
  for (const line of resolved) {
    sumMinor += line.qty * line.price
    totalQty += line.qty
    console.log(
      `    ${line.code} ${line.name.slice(0, 58)} x${line.qty} @ ${money(line.price)} = ${money(line.qty * line.price)} AED`
    )
  }
  console.log(`  Total: ${money(sumMinor)} AED | ${totalQty} units | ${resolved.length} lines`)
  return sumMinor
}

function reportPositions(resolved) {
  return resolved.map((line) => ({
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.id),
    vat: 5,
    vatEnabled: true,
    reward: 0,
  }))
}

async function exportSalesPdf(reportId, reportName, label) {
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const body = {
    template: {
      meta: {
        href: `${API}/entity/commissionreportin/metadata/customtemplate/${CONSIGNMENT_SALES_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/commissionreportin/${reportId}/export`, {
    method: 'POST',
    headers: {
      Authorization: AUTH,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Export ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  const out = path.join(ORDERS_DIR, `GENOSYS_Shakirovna_${label}_Consignment_Sales_${reportName}.pdf`)
  fs.writeFileSync(out, buf)
  return out
}

const filtered = ARG_REPORT === 'all' ? SITES : SITES.filter((s) => s.key === ARG_REPORT)

if (!filtered.length) {
  console.error(`Unknown --report=${ARG_REPORT} (elite|clinic|all)`)
  process.exit(1)
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Elite + Clinic — consignment 28.06–25.07.2026')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT (report only + PDF)' : 'DRY RUN'}`)
  console.log(`  Period: ${COMMON.commissionPeriodStart} → ${COMMON.commissionPeriodEnd}`)

  const stock = await fetchStockByCode()
  const results = []

  for (const cfg of filtered) {
    console.log('\n--------------------------------------------------------------------')
    console.log(`  ${cfg.title}`)
    console.log('--------------------------------------------------------------------')

    const { agentId, contractId } = await resolveAgentAndContract(cfg)
    const [agent, contract] = await Promise.all([
      api('GET', `/entity/counterparty/${agentId}`),
      api('GET', `/entity/contract/${contractId}`),
    ])
    console.log(`  Customer: ${agent.name}`)
    console.log(`  Contract: ${contract.name} (${contractId})`)

    const resolved = resolveLines(stock, cfg.lines)
    const expectedSum = printLines(resolved)

    if (!COMMIT) {
      console.log('  DRY RUN — add --commit to post report + export PDF')
      continue
    }

    await ensureNoDuplicate(agentId, cfg.marker)

    const report = await api('POST', '/entity/commissionreportin', {
      moment: COMMON.moment,
      applicable: true,
      vatEnabled: true,
      vatIncluded: true,
      organization: href('organization', COMMON.organizationId),
      agent: href('counterparty', agentId),
      contract: href('contract', contractId),
      state: stateHref('commissionreportin', COMMON.stateNotPaidId),
      commissionPeriodStart: COMMON.commissionPeriodStart,
      commissionPeriodEnd: COMMON.commissionPeriodEnd,
      rewardType: 'PercentOfSales',
      rewardPercent: 0,
      description: [
        cfg.marker,
        `Sold table 28.06.2026–25.07.2026 Business Bay — ${cfg.title}.`,
        'Report only (no matching demand). PDF → Desktop/orders.',
      ].join('\n'),
      positions: reportPositions(resolved),
    })

    if ((report.sum || 0) !== expectedSum) {
      throw new Error(`Sum mismatch ${cfg.key}: got ${money(report.sum)} vs ${money(expectedSum)}`)
    }

    const pdfPath = await exportSalesPdf(report.id, report.name, cfg.label)
    console.log(`  Report ${report.name}: ${money(report.sum)} AED`)
    console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${report.id}`)
    console.log(`  PDF: ${pdfPath}`)

    results.push({
      site: cfg.key,
      reportName: report.name,
      reportId: report.id,
      reportSum: money(report.sum),
      pdfPath,
      lines: cfg.lines.length,
      units: cfg.lines.reduce((s, [, q]) => s + q, 0),
    })
  }

  if (COMMIT && results.length) {
    console.log('\n=== SUMMARY ===')
    for (const r of results) {
      console.log(`${r.site}: report ${r.reportName} (${r.reportSum} AED) — ${r.units} pcs`)
    }
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
