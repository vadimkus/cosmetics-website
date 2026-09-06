#!/usr/bin/env node

/**
 * Shakirovna — paymentin on all unpaid consignment sales reports + mark Paid.
 *   Marina 01440 / 2,144
 *   Poly   01441 / 280
 *   Elite  01442 / 784
 *   Clinic 01443 / 650
 *
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-cons-sales-paymentins-20260902.js
 *   node --import dotenv/config scripts/moysklad-create-shakirovna-cons-sales-paymentins-20260902.js --commit
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const { uaeToday, uaeMomentAddMinutes } = require('./lib/moysklad-uae-date')

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const ORG_ID = 'e18525a4-33c5-11ea-0a80-043f000b2738'
const BANK_ACCOUNT_ID = 'e1852e1c-33c5-11ea-0a80-043f000b2739'
const STATE_REPORT_PAID_ID = 'fd15289c-c3c4-11eb-0a80-065200268290'
const MARKER = `SHAKIROVNA-CONS-SALES-PAYMENTINS-${uaeToday()}`
const EXPECTED_TOTAL_MINOR = 385800

const REPORTS = [
  {
    label: 'Marina Salon',
    reportName: '01440',
    reportId: '8c0a3995-a1e8-11f1-0a80-087b005afcb7',
    agentId: '93775ae5-d18d-11ea-0a80-02e00008417d',
    contractId: 'f5a1958d-c3ca-11eb-0a80-048e0027cbcb',
    contractName: '00030',
    expectedMinor: 214400,
  },
  {
    label: 'Poly Clinic',
    reportName: '01441',
    reportId: '01999f25-a1e9-11f1-0a80-0e41005c67df',
    agentId: '932f00c5-96e0-11f1-0a80-0d9b001a5a79',
    contractId: '93cc0951-96e0-11f1-0a80-036000196a36',
    contractName: '41',
    expectedMinor: 28000,
  },
  {
    label: 'Elite Salon',
    reportName: '01442',
    reportId: '82a6365a-a1ec-11f1-0a80-1a71005dab34',
    agentId: '57430e6e-5e30-11f0-0a80-165f0007780c',
    contractId: 'c24b0b09-5e34-11f0-0a80-1b1c0008232a',
    contractName: '21',
    expectedMinor: 78400,
  },
  {
    label: 'Esthetic Clinic',
    reportName: '01443',
    reportId: '874530a0-a1ec-11f1-0a80-15d9005d6589',
    agentId: 'a187255f-a9b6-11f0-0a80-09900022125b',
    contractId: 'd08f670e-b993-11f0-0a80-19750031f04a',
    contractName: '26',
    expectedMinor: 65000,
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

function orgAccountHref(id) {
  return {
    meta: {
      href: `${API}/entity/organization/${ORG_ID}/accounts/${id}`,
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
  console.log('  Shakirovna — paymentin on all unpaid cons sales')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const planned = []
  for (const row of REPORTS) {
    const [agent, contract, report] = await Promise.all([
      api('GET', `/entity/counterparty/${row.agentId}`),
      api('GET', `/entity/contract/${row.contractId}`),
      api('GET', `/entity/commissionreportin/${row.reportId}?expand=state`),
    ])
    if (contract.name !== row.contractName) {
      throw new Error(`${row.label}: expected agr ${row.contractName}, got ${contract.name}`)
    }
    if (report.name !== row.reportName) {
      throw new Error(`${row.label}: expected report ${row.reportName}, got ${report.name}`)
    }
    if (report.sum !== row.expectedMinor) {
      throw new Error(`${row.label}: sum ${money(report.sum)} ≠ ${money(row.expectedMinor)}`)
    }
    const openMinor = (report.sum || 0) - (report.payedSum || 0)
    if (openMinor <= 0) {
      console.log(`  SKIP ${row.label} ${report.name} already paid`)
      continue
    }
    if (openMinor !== row.expectedMinor) {
      throw new Error(`${row.label}: open ${money(openMinor)} ≠ ${money(row.expectedMinor)}`)
    }
    const filter = [
      `agent=${API}/entity/counterparty/${row.agentId}`,
      `moment>=${uaeToday()} 00:00:00`,
      `moment<=${uaeToday()} 23:59:59`,
    ].join(';')
    const todayPays = await fetchAll(`/entity/paymentin?filter=${encodeURIComponent(filter)}`)
    const dup = todayPays.find((d) => (d.description || '').includes(`${MARKER}-${row.reportName}`))
    if (dup) throw new Error(`Duplicate ${row.reportName} (${dup.name})`)

    planned.push({ ...row, agentName: agent.name, report, openMinor })
    console.log(
      `  ${row.label} ${report.name} agr ${contract.name}: ${money(openMinor)} AED | ${report.state?.name}`,
    )
  }

  const total = planned.reduce((s, r) => s + r.openMinor, 0)
  console.log(`  Total: ${money(total)} AED | ${planned.length} payments`)
  if (total !== EXPECTED_TOTAL_MINOR) {
    throw new Error(`Total ${money(total)} ≠ ${money(EXPECTED_TOTAL_MINOR)}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  const posted = []
  for (let i = 0; i < planned.length; i++) {
    const row = planned[i]
    const paymentIn = await api('POST', '/entity/paymentin', {
      moment: uaeMomentAddMinutes(i),
      applicable: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', row.agentId),
      contract: href('contract', row.contractId),
      organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
      description: [
        `Incoming payment commissioner report ${row.reportName} | ${MARKER}-${row.reportName}`,
        `${row.label} — consignment sales ${money(row.openMinor)} AED — paid in full.`,
      ].join(' | '),
      sum: row.openMinor,
      operations: [
        {
          meta: {
            href: `${API}/entity/commissionreportin/${row.reportId}`,
            type: 'commissionreportin',
            mediaType: 'application/json',
          },
          linkedSum: row.openMinor,
        },
      ],
    })

    await api('PUT', `/entity/commissionreportin/${row.reportId}`, {
      meta: row.report.meta,
      state: stateHref('commissionreportin', STATE_REPORT_PAID_ID),
    })

    const final = await api('GET', `/entity/commissionreportin/${row.reportId}?expand=state`)
    posted.push({
      label: row.label,
      report: final.name,
      pay: paymentIn.name,
      payId: paymentIn.id,
      sum: paymentIn.sum,
      state: final.state?.name,
    })
    console.log(
      `  ${row.label}: paymentin ${paymentIn.name} ${money(paymentIn.sum)} | report ${final.name} ${final.state?.name}`,
    )
  }

  console.log(`\n  Posted ${posted.length} | ${money(posted.reduce((s, p) => s + p.sum, 0))} AED`)
  for (const p of posted) {
    console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${p.payId}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
