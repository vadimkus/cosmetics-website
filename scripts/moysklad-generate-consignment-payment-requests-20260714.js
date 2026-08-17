#!/usr/bin/env node

/**
 * Generate consignment payment-request letters for all unpaid commissioner reports.
 * Output: ~/Desktop/orders/GENOSYS_Consignment_Payment_Requests_YYYY-MM-DD.md
 *
 *   node --import dotenv/config scripts/moysklad-generate-consignment-payment-requests-20260714.js
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

function fmt(n) {
  return Number(n).toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function addDays(isoDate, days) {
  const d = new Date(isoDate + 'T12:00:00+04:00')
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dubai' })
}

const PAYMENT_DEADLINE = addDays(TODAY, 14)

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

async function loadOutstanding() {
  const reports = await fetchAll('/entity/commissionreportin?order=moment,desc')
  const groups = new Map()

  for (const r of reports) {
    const openMinor = (r.sum || 0) - (r.payedSum || 0)
    if (openMinor <= 0) continue

    const agentId = r.agent?.meta?.href?.split('/').pop()
    if (!agentId) continue

    if (!groups.has(agentId)) {
      const agent = await api('GET', `/entity/counterparty/${agentId}`)
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
    .map((g) => ({ ...g, contracts: [...g.contracts].sort() }))
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

function customerLetter(c) {
  const contractLabel =
    c.contracts.length === 1 ? `Consignment Agreement No. ${c.contracts[0]}` : `Consignment Agreements ${c.contracts.join(', ')}`

  const reportBlocks = c.reports
    .map((r) => {
      const soldSummary = r.lines.map((l) => `${l.name} ×${l.qty}`).join('; ')
      return `#### Commissioner report **${r.num}** — ${r.date} (${contractLabel})

These GENOSYS products were **sold from consignment stock** at your premises and recorded on our system. **Payment has not been received.**

| | AED |
|---|---:|
| Report total | ${fmt(r.sum)} |
| Paid to date | ${fmt(r.paid)} |
| **Amount due** | **${fmt(r.open)}** |

${linesTable(r.lines)}

*Sold items (summary):* ${soldSummary}.`
    })
    .join('\n\n')

  return `---

## Payment request — ${c.agentName}

**Date:** ${TODAY}  
**From:** ${BANK.beneficiary}  
**To:** ${c.agentName}  
**${contractLabel}**  
**Subject:** Friendly reminder — payment for consignment items sold

---

Dear Partner,

We hope you are well. This is a **friendly but official reminder** regarding your **GENOSYS consignment account**.

Under our **Goods on Consignment** agreement, products supplied remain Genosys property until **sold**. When items are sold at your salon/clinic, they must be **reported** on a commissioner report and **paid for within 14 days** at the agreed clinic list price.

Our records show the following **sold consignment items** for which **payment is still outstanding**:

${reportBlocks}

### Total amount due

| | AED |
|---|---:|
| **Total outstanding (all reports above)** | **${fmt(c.total)}** |

All amounts are in **UAE Dirhams (AED)**, VAT inclusive where applicable.

This balance represents **products already sold to your clients** — not stock still on your shelves. We kindly ask you to settle these sold-goods reports so we can keep your consignment account in good standing and continue replenishment without interruption.

### How to pay

Please transfer **${fmt(c.total)} AED** to:

| | |
|---|---|
| **Beneficiary** | ${BANK.beneficiary} |
| **Bank** | ${BANK.bank} |
| **IBAN** | ${BANK.iban} |
| **Reference** | ${c.agentName} — Consignment reports ${c.reports.map((r) => r.num).join(', ')} |

**Payment deadline:** **${PAYMENT_DEADLINE}** (14 days from this letter, UAE time).

After payment, please send the **transfer receipt** to **${BANK.email}**${c.phone ? ` or WhatsApp **${c.phone}**` : ''} so we can mark your account as paid in our system.

If you have already paid any of the above reports, please share the receipt and we will reconcile immediately — thank you.

We value our partnership and prefer to resolve this simply and promptly. If you have any questions about the line items or report numbers, reply to this letter and we will clarify.

Warm regards,

**${BANK.signatory}**  
${BANK.beneficiary}  
${BANK.email}

---`
}

function buildDocument(groups) {
  const grandTotal = groups.reduce((s, g) => s + g.total, 0)
  const reportCount = groups.reduce((s, g) => s + g.reports.length, 0)

  const summaryRows = groups
    .map(
      (g) =>
        `| ${g.agentName} | ${g.contracts.join(', ')} | ${g.reports.map((r) => r.num).join(', ')} | ${g.reports.length} | **${fmt(g.total)}** |`
    )
    .join('\n')

  const internal = `# GENOSYS — Outstanding consignment payment requests

**Generated:** ${TODAY} (MoySklad live data)  
**Source script:** \`scripts/moysklad-generate-consignment-payment-requests-20260714.js\`

---

## Internal summary (Genosys use)

| Customer | Agreement(s) | Unpaid report(s) | # | **Due (AED)** |
|----------|--------------|------------------|--:|--------------:|
${summaryRows}
| | | | **${reportCount} reports** | **${fmt(grandTotal)}** |

**Nature of balance:** All amounts above are for **consignment goods already sold** at partner premises, documented on **commissioner reports (полученный отчёт комиссионера)**, where **payment in has not been posted** or only partially received.

**Standard terms:** Consignment contract — report sales monthly; pay **100% of clinic list price within 14 days** (bank transfer or cash). Late payment may suspend further consignment replenishment.

**Bank details (all customers):**

- Beneficiary: ${BANK.beneficiary}
- Bank: ${BANK.bank}
- IBAN: ${BANK.iban}
- Receipts to: ${BANK.email}

**Suggested send:** Email + WhatsApp short note with PDF of relevant commissioner report(s) attached. Tone: official but friendly (see GOCOSMO demand letter precedent).

---

# Customer payment request letters

Copy each section below to email or WhatsApp. Attach the matching commissioner report PDF from MoySklad (\`Genosys_Consignment_Sales\` template).

${groups.map(customerLetter).join('\n\n')}

---

*End of document — ${groups.length} customers · ${reportCount} unpaid reports · AED ${fmt(grandTotal)} total outstanding.*
`

  return internal
}

async function main() {
  console.log('Fetching unpaid consignment reports from MoySklad...')
  const groups = await loadOutstanding()
  if (!groups.length) {
    console.log('No outstanding consignment reports — nothing to write.')
    return
  }

  const doc = buildDocument(groups)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const outPath = path.join(ORDERS_DIR, `GENOSYS_Consignment_Payment_Requests_${TODAY}.md`)
  fs.writeFileSync(outPath, doc)

  const grand = groups.reduce((s, g) => s + g.total, 0)
  const reports = groups.reduce((s, g) => s + g.reports.length, 0)
  console.log(`\nWrote: ${outPath}`)
  console.log(`  ${groups.length} customers · ${reports} unpaid reports · AED ${fmt(grand)} outstanding`)
  for (const g of groups) {
    console.log(`  - ${g.agentName}: AED ${fmt(g.total)} (${g.reports.map((r) => r.num).join(', ')})`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
