#!/usr/bin/env node

/**
 * Shakirovna — paymentin for 3 consignment reports (all locations paid).
 *   Elite 01411  → 1,524 AED (agreement 21)
 *   Clinic 01412 →   899 AED (agreement 26)
 *   Marina 01414 → 2,047 AED (agreement 00030)
 *   Total: 4,470 AED
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-01411-01412-01414-paymentins-20260730.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-01411-01412-01414-paymentins-20260730.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeMomentNow, uaeMomentAddMinutes, uaeToday } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const STATE_REPORT_PAID_ID = 'fd15289c-c3c4-11eb-0a80-065200268290'
const MARKER = `SHAKIROVNA-3LOC-PAYMENTIN-${uaeToday()}`

const REPORTS = [
  {
    label: 'Elite',
    reportName: '01411',
    reportId: '4c249c8e-88c4-11f1-0a80-1e1d0053e896',
    agentId: '57430e6e-5e30-11f0-0a80-165f0007780c',
    contractId: 'c24b0b09-5e34-11f0-0a80-1b1c0008232a',
    expectedMinor: 152400,
  },
  {
    label: 'Clinic',
    reportName: '01412',
    reportId: '4f8b7c2a-88c4-11f1-0a80-0d4f0054a1a6',
    agentId: 'a187255f-a9b6-11f0-0a80-09900022125b',
    contractId: 'd08f670e-b993-11f0-0a80-19750031f04a',
    expectedMinor: 89900,
  },
  {
    label: 'Marina',
    reportName: '01414',
    reportId: '8bc4f56e-8a6f-11f1-0a80-1ae2001a6e66',
    agentId: '93775ae5-d18d-11ea-0a80-02e00008417d',
    contractId: 'f5a1958d-c3ca-11eb-0a80-048e0027cbcb',
    expectedMinor: 204700,
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
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const text = await res.text()
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      await new Promise((r) => setTimeout(r, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1600)}`)
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
    const data = await api('GET', `${pathStr}${sep}limit=100&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 100) break
    offset += 100
  }
  return rows
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function orgAccountHref(accountId) {
  return {
    meta: {
      href: `${API}/entity/organization/${ORG_ID}/accounts/${accountId}`,
      type: 'account',
      mediaType: 'application/json',
    },
  }
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

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna — paymentin ×3 (Elite / Clinic / Marina)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Marker: ${MARKER}\n`)

  const prepared = []
  let totalMinor = 0

  for (const cfg of REPORTS) {
    const report = await api(
      'GET',
      `/entity/commissionreportin/${cfg.reportId}?expand=state,agent`,
    )
    if (report.name !== cfg.reportName) {
      throw new Error(`Expected ${cfg.reportName}, got ${report.name}`)
    }
    if ((report.sum || 0) !== cfg.expectedMinor) {
      throw new Error(
        `${cfg.reportName}: sum ${money(report.sum)} ≠ ${money(cfg.expectedMinor)}`,
      )
    }
    if ((report.payedSum || 0) >= cfg.expectedMinor) {
      throw new Error(`${cfg.reportName} already paid: ${money(report.payedSum)}`)
    }

    const siteMarker = `${MARKER} — report ${cfg.reportName}`
    const agentHref = `${API}/entity/counterparty/${cfg.agentId}`
    const pays = await fetchAll(
      `/entity/paymentin?filter=agent=${encodeURIComponent(agentHref)};moment>=${uaeToday()} 00:00:00`,
    )
    const dup = pays.find(
      (p) =>
        (p.description || '').includes(siteMarker) ||
        (p.description || '').includes(`report ${cfg.reportName}`),
    )
    if (dup) throw new Error(`${cfg.label}: paymentin already exists ${dup.name}`)

    totalMinor += cfg.expectedMinor
    prepared.push({ cfg, report, siteMarker })
    console.log(
      `  ${cfg.label}: report ${report.name} | ${money(report.sum)} AED | ${report.state?.name} | ${report.agent?.name}`,
    )
  }
  console.log(`\n  Total: ${money(totalMinor)} AED`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const results = []
  for (let i = 0; i < prepared.length; i++) {
    const { cfg, report, siteMarker } = prepared[i]
    const moment = uaeMomentAddMinutes(i * 2)

    const paymentIn = await api('POST', '/entity/paymentin', {
      moment,
      applicable: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', cfg.agentId),
      contract: href('contract', cfg.contractId),
      organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
      description: [
        `Incoming payment commissioner report ${cfg.reportName} | ${siteMarker}`,
        `Shakirovna ${cfg.label} consignment — ${money(cfg.expectedMinor)} AED paid in full.`,
      ].join(' | '),
      sum: cfg.expectedMinor,
      operations: [
        {
          meta: {
            href: `${API}/entity/commissionreportin/${cfg.reportId}`,
            type: 'commissionreportin',
            mediaType: 'application/json',
          },
          linkedSum: cfg.expectedMinor,
        },
      ],
    })

    await api('PUT', `/entity/commissionreportin/${cfg.reportId}`, {
      meta: report.meta,
      state: stateHref('commissionreportin', STATE_REPORT_PAID_ID),
    })

    const final = await api('GET', `/entity/commissionreportin/${cfg.reportId}?expand=state`)
    results.push({
      label: cfg.label,
      report: cfg.reportName,
      paymentin: paymentIn.name,
      paymentinId: paymentIn.id,
      sum: money(paymentIn.sum),
      state: final.state?.name,
      payed: money(final.payedSum),
    })

    console.log(
      `\n  ✓ ${cfg.label}: paymentin ${paymentIn.name} | ${money(paymentIn.sum)} AED → report ${final.name} ${final.state?.name}`,
    )
    console.log(`    https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)
  }

  console.log('\n====================================================================')
  console.log('  Summary')
  console.log('====================================================================')
  for (const r of results) {
    console.log(
      `  ${r.label}: report ${r.report} → pay ${r.paymentin} | ${r.sum} AED | ${r.state} (${r.payed})`,
    )
  }
  console.log(`  Total paid: ${money(totalMinor)} AED`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
