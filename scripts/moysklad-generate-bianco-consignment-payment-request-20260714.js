#!/usr/bin/env node

/**
 * BIANCO locations only — consignment payment request letter(s).
 * Output: ~/Desktop/orders/GENOSYS_BIANCO_Consignment_Payment_Request_YYYY-MM-DD.md
 *
 *   node --import dotenv/config scripts/moysklad-generate-bianco-consignment-payment-request-20260714.js
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

const { uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const TODAY = uaeToday()

const BANK = {
  beneficiary: 'Genosys Middle East FZ-LLC',
  bank: 'Wio Bank',
  iban: 'AE110860000009833011607',
  email: 'sales@genosys.ae',
  signatory: 'Vadim Sagatdinov',
}

const BIANCO_CONTACT = 'Charisse Bianca / Bianco Management'
const BIANCO_EMAIL_TO = 'office@biancospa.ae'
const BIANCO_EMAIL_CC = 'charisse@biancospa.ae'
const BIANCO_EMAIL_SUBJECT =
  'Friendly reminder — payment for consignment items sold (Bianco locations)'

function fmt(n) {
  return Number(n).toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function addDays(isoDate, days) {
  const d = new Date(isoDate + 'T12:00:00+04:00')
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dubai' })
}

const PAYMENT_DEADLINE = '30 July 2026'

function daysPending(reportDate) {
  const a = new Date(reportDate + 'T12:00:00+04:00')
  const b = new Date(TODAY + 'T12:00:00+04:00')
  return Math.round((b - a) / 86400000)
}

function fmtDate(iso) {
  const [y, m, d] = iso.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${Number(d)} ${months[Number(m) - 1]} ${y}`
}

function isBianco(name) {
  return /bianco/i.test(name || '')
}

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
      signal: AbortSignal.timeout(60000),
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 800)}`)
    return text ? JSON.parse(text) : null
  } catch (e) {
    const retryable =
      e.cause?.code === 'ECONNRESET' ||
      e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' ||
      e.name === 'TimeoutError' ||
      e.message === 'fetch failed'
    if (attempt < 8 && retryable) {
      await new Promise((r) => setTimeout(r, 2000 * attempt))
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

const contractCache = new Map()
async function contractName(href) {
  const id = href.split('/').pop()
  if (contractCache.has(id)) return contractCache.get(id)
  const c = await api('GET', `/entity/contract/${id}`)
  contractCache.set(id, c.name)
  return c.name
}

async function loadBiancoOutstanding() {
  const reports = await fetchAll('/entity/commissionreportin?order=moment,desc')
  const groups = new Map()

  for (const r of reports) {
    const openMinor = (r.sum || 0) - (r.payedSum || 0)
    if (openMinor <= 0) continue

    const agentId = r.agent?.meta?.href?.split('/').pop()
    if (!agentId) continue

    const agent = await api('GET', `/entity/counterparty/${agentId}`)
    if (!isBianco(agent.name)) continue

    if (!groups.has(agentId)) {
      groups.set(agentId, {
        agentName: agent.name,
        phone: agent.phone || '',
        email: agent.email && !/^\d+$/.test(agent.email) ? agent.email : '',
        trn: agent.inn || '',
        address: [agent.actualAddressFull?.street, agent.actualAddressFull?.city].filter(Boolean).join(', '),
        contracts: new Set(),
        reports: [],
        total: 0,
      })
    }

    const g = groups.get(agentId)
    const contract = r.contract?.meta?.href ? await contractName(r.contract.meta.href) : '—'
    g.contracts.add(contract)
    g.total += openMinor / 100

    const pos = await fetchAll(`/entity/commissionreportin/${r.id}/positions?expand=assortment`)
    g.reports.push({
      num: r.name,
      date: r.moment.slice(0, 10),
      contract,
      sum: r.sum / 100,
      paid: (r.payedSum || 0) / 100,
      open: openMinor / 100,
      lines: pos.map((p) => ({
        code: p.assortment?.code || '—',
        name: (p.assortment?.name || '').replace(/^Genosys /i, ''),
        qty: p.quantity,
        price: (p.price || 0) / 100,
        line: (((p.price || 0) / 100) * p.quantity * (100 - (p.discount || 0))) / 100,
      })),
    })
  }

  return [...groups.values()]
    .map((g) => {
      const sorted = [...g.reports].sort((a, b) => a.date.localeCompare(b.date))
      const oldest = sorted[0]?.date
      const newest = sorted[sorted.length - 1]?.date
      return {
        ...g,
        contracts: [...g.contracts].sort(),
        reports: sorted,
        oldestDate: oldest,
        newestDate: newest,
        pendingDaysOldest: oldest ? daysPending(oldest) : 0,
      }
    })
    .sort((a, b) => b.total - a.total)
}

function linesTable(lines) {
  const rows = lines.map(
    (l) => `| ${l.code} | ${l.name} | ${l.qty} | ${fmt(l.price)} | ${fmt(l.line)} |`
  )
  return [
    '| Code | Product (sold) | Qty | Unit (AED) | Line (AED) |',
    '|------|----------------|----:|-----------:|-----------:|',
    ...rows,
  ].join('\n')
}

function locationSection(c) {
  const contractLabel =
    c.contracts.length === 1
      ? `Consignment Agreement No. **${c.contracts[0]}**`
      : `Consignment Agreements **${c.contracts.join(', ')}**`

  const reportBlocks = c.reports
    .map((r) => {
      const soldSummary = r.lines.map((l) => `${l.name} ×${l.qty}`).join('; ')
      const pending = daysPending(r.date)
      return `#### Report **${r.num}** — sold **${fmtDate(r.date)}** · payment pending **${pending} days**

These GENOSYS products were **sold from consignment stock** at **${c.agentName}** and recorded on our system on **${fmtDate(r.date)}**. **Payment has not been received** (${pending} days outstanding).

| | AED |
|---|---:|
| Report total | ${fmt(r.sum)} |
| Paid to date | ${fmt(r.paid)} |
| **Amount due** | **${fmt(r.open)}** |

${linesTable(r.lines)}

*Sold items:* ${soldSummary}.`
    })
    .join('\n\n')

  return `### ${c.agentName}

${c.address ? `**Address:** ${c.address}  \n` : ''}${contractLabel}

| | AED |
|---|---:|
| **Location subtotal due** | **${fmt(c.total)}** |

${reportBlocks}`
}

function buildDocument(groups) {
  const grandTotal = groups.reduce((s, g) => s + g.total, 0)
  const reportCount = groups.reduce((s, g) => s + g.reports.length, 0)
  const allReportNums = groups.flatMap((g) => g.reports.map((r) => r.num))

  const summaryRows = groups
    .map((g) => {
      const reportDates = g.reports.map((r) => `${r.num} (${fmtDate(r.date)})`).join('; ')
      return `| ${g.agentName} | ${g.contracts.join(', ')} | ${reportDates} | ${g.reports.length} | ${fmtDate(g.oldestDate)} (${g.pendingDaysOldest}d) | **${fmt(g.total)}** |`
    })
    .join('\n')

  return `# GENOSYS — BIANCO consignment payment request

**Generated:** ${TODAY} (MoySklad live data)  
**Scope:** BIANCO locations only  
**Script:** \`scripts/moysklad-generate-bianco-consignment-payment-request-20260714.js\`

---

## Internal summary (Genosys use)

| Location | Agreement | Unpaid report(s) + sold date | # | Pending since (oldest) | **Due (AED)** |
|----------|-----------|------------------------------|--:|----------------------|--------------:|
${summaryRows}
| | | | **${reportCount} reports** | **${fmt(grandTotal)}** |

**Nature of balance:** Amounts are for **consignment goods already sold** to clients at Bianco premises, documented on **commissioner reports**, where **payment in has not been posted** (or only partially received).

**Not included:** Stock still on shelves — only **sold items** on the reports below.

**Attach when sending:** PDF of each commissioner report from MoySklad (\`Genosys_Consignment_Sales\` template).

**Email (copy/paste):**

| | |
|---|---|
| **To** | ${BIANCO_EMAIL_TO} |
| **Cc** | ${BIANCO_EMAIL_CC} |
| **Subject** | ${BIANCO_EMAIL_SUBJECT} |
| **Attachment** | \`GENOSYS_BIANCO_Consignment_Payment_Request_${TODAY}.pdf\` (+ commissioner report PDFs) |

**Style reference:** GOCOSMO demand letter (\`~/Desktop/GOCOSMO_DEMAND_LETTER_2026-06-20.md\`) — official but friendly.

---

# Payment request letter — Bianco Group

**Date:** ${TODAY}  
**From:** ${BANK.beneficiary}  
**To:** ${BIANCO_EMAIL_TO}  
**Cc:** ${BIANCO_EMAIL_CC}  
**Subject:** ${BIANCO_EMAIL_SUBJECT}

---

Dear Charisse, dear Bianco team,

We hope you are well. Thank you for the continued partnership with **GENOSYS** across your Bianco locations.

This is a friendly reminder about our consignment accounts.

Our records show sold consignment items across ${groups.length} Bianco location${groups.length === 1 ? '' : 's'} for which payment is still outstanding:

| Location | Reports (sold date) | Pending since | **Due (AED)** |
|----------|---------------------|---------------|--------------:|
${groups
  .map(
    (g) =>
      `| ${g.agentName} | ${g.reports.map((r) => `${r.num} (${fmtDate(r.date)})`).join(', ')} | **${fmtDate(g.oldestDate)}** — ${g.pendingDaysOldest} days | **${fmt(g.total)}** |`
  )
  .join('\n')}
| | | |
| **Total outstanding** | **${reportCount} reports** | **${fmt(grandTotal)}** |

All amounts are in **UAE Dirhams (AED)**, VAT inclusive where applicable.

**Important:** This total of **AED ${fmt(grandTotal)}** represents **products already sold to your clients** — not stock still on your shelves. Each line below is taken from the official commissioner report in our system.

---

## Detail by location

${groups.map(locationSection).join('\n\n---\n\n')}

---

## Total amount due

| | AED |
|---|---:|
| **Grand total — all Bianco locations above** | **${fmt(grandTotal)}** |

We kindly ask you to settle these sold-goods reports so we can keep your consignment accounts in good standing and continue replenishment without interruption.

### How to pay

Please transfer **${fmt(grandTotal)} AED** (or per-location amounts if you prefer separate transfers) to:

| | |
|---|---|
| **Beneficiary** | ${BANK.beneficiary} |
| **Bank** | ${BANK.bank} |
| **IBAN** | ${BANK.iban} |
| **Reference** | Bianco — Consignment reports ${allReportNums.join(', ')} |

We would appreciate for the payment to be completed before the end of this month, please:

**${PAYMENT_DEADLINE}**

After payment, please send the **transfer receipt** to **${BANK.email}** so we can mark the relevant reports as paid in our system.

If you have already paid any of the above reports, please share the receipt and we will reconcile immediately — thank you.

We value our long-standing partnership with Bianco very much. Hope this could be quickly resolved. If you have any questions about report numbers or line items, please reply and we will clarify.

Warm regards,

**${BANK.signatory}**  
${BANK.beneficiary}  
${BANK.email}

---

*End of document — ${groups.length} Bianco locations · ${reportCount} unpaid reports · AED ${fmt(grandTotal)} total outstanding.*
`
}

async function main() {
  console.log('Fetching unpaid BIANCO consignment reports from MoySklad...')
  const groups = await loadBiancoOutstanding()
  if (!groups.length) {
    console.log('No outstanding BIANCO consignment reports — nothing to write.')
    return
  }

  const doc = buildDocument(groups)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const outPath = path.join(ORDERS_DIR, `GENOSYS_BIANCO_Consignment_Payment_Request_${TODAY}.md`)
  fs.writeFileSync(outPath, doc)

  const grand = groups.reduce((s, g) => s + g.total, 0)
  const reports = groups.reduce((s, g) => s + g.reports.length, 0)
  console.log(`\nWrote: ${outPath}`)
  console.log(`  ${groups.length} BIANCO locations · ${reports} unpaid reports · AED ${fmt(grand)} outstanding`)
  for (const g of groups) {
    console.log(`  - ${g.agentName}: AED ${fmt(g.total)} (${g.reports.map((r) => r.num).join(', ')})`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
