#!/usr/bin/env node

/**
 * ARFI Nails — paymentin on unpaid Aug consignment reports.
 * Mashreq 033IPP403940330 / 1,619 AED (1030 Barsha + 589 Jumeirah).
 * Link reports only. Demands stay unpaid.
 *
 *   node --import dotenv/config scripts/moysklad-create-arfi-aug-cons-paymentins-20260905.js
 *   node --import dotenv/config scripts/moysklad-create-arfi-aug-cons-paymentins-20260905.js --commit
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
const BANK_REF = '033IPP403940330'
const MOMENT = '2026-09-05 11:40:03'
const MARKER = `ARFI-AUG-CONS-PAYMENTINS-${BANK_REF}`
const EXPECTED_TOTAL_MINOR = 161900

const REPORTS = [
  {
    label: 'ARFI Barsha',
    agentMatch: /^ARFI NAILS BEAUTY SALON$/i,
    reportName: '01453',
    reportId: '343eb3eb-a6cc-11f1-0a80-08a90037e017',
    agentId: '39a1aa83-a5a6-11f0-0a80-1cbc00050fea',
    contractId: '739936aa-a809-11f0-0a80-07ba002a8e67',
    contractName: '25',
    demandName: '06788',
    demandId: '881a1efa-a6cc-11f1-0a80-08a900380cd0',
    expectedMinor: 103000,
  },
  {
    label: 'ARFI Jumeirah',
    agentMatch: /ARFI NAILS BEAUTY SALON 2/i,
    reportName: '01452',
    reportId: '7239664d-a6cb-11f1-0a80-1b380035bc2a',
    agentId: 'dc883e47-f051-11f0-0a80-0f7100059e21',
    contractId: '383ebfbb-f052-11f0-0a80-0035000650e3',
    contractName: '30',
    demandName: '06787',
    demandId: '730ea7b1-a6cb-11f1-0a80-1e9300346e0d',
    expectedMinor: 58900,
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
  console.log('  ARFI Barsha + Jumeirah — paymentin on Aug cons sales')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Bank: Mashreq ${BANK_REF} | 1,619.00 | ${MOMENT}`)

  const planned = []
  for (const row of REPORTS) {
    const [agent, contract, report, demand] = await Promise.all([
      api('GET', `/entity/counterparty/${row.agentId}`),
      api('GET', `/entity/contract/${row.contractId}`),
      api('GET', `/entity/commissionreportin/${row.reportId}?expand=state`),
      api('GET', `/entity/demand/${row.demandId}`),
    ])
    if (!row.agentMatch.test(agent.name || '')) {
      throw new Error(`${row.label}: unexpected agent ${agent.name}`)
    }
    if (contract.name !== row.contractName) {
      throw new Error(`${row.label}: expected agr ${row.contractName}, got ${contract.name}`)
    }
    if (report.name !== row.reportName) {
      throw new Error(`${row.label}: expected report ${row.reportName}, got ${report.name}`)
    }
    if (demand.name !== row.demandName) {
      throw new Error(`${row.label}: expected demand ${row.demandName}, got ${demand.name}`)
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

    planned.push({ ...row, agentName: agent.name, report, demand, openMinor })
    console.log(
      `  ${row.label} ${agent.name} | ${report.name} agr ${contract.name}: ${money(openMinor)} | ${report.state?.name}`,
    )
    console.log(`    demand ${demand.name} ${money(demand.sum)} payed ${money(demand.payedSum)} (leave unpaid)`)
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
      moment: i === 0 ? MOMENT : uaeMomentAddMinutes(i, new Date('2026-09-05T07:40:03+04:00')),
      applicable: true,
      organization: href('organization', ORG_ID),
      agent: href('counterparty', row.agentId),
      contract: href('contract', row.contractId),
      organizationAccount: orgAccountHref(BANK_ACCOUNT_ID),
      description: [
        `Incoming payment commissioner report ${row.reportName} | ${MARKER}-${row.reportName}`,
        `${row.label} — consignment sales ${money(row.openMinor)} AED — paid in full.`,
        `Mashreq ${BANK_REF} 05/09/2026 1,619 (1030+589).`,
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

    const [final, demandAfter] = await Promise.all([
      api('GET', `/entity/commissionreportin/${row.reportId}?expand=state`),
      api('GET', `/entity/demand/${row.demandId}`),
    ])
    if ((demandAfter.payedSum || 0) !== 0) {
      throw new Error(`${row.label}: demand ${demandAfter.name} got paid — should stay 0`)
    }

    posted.push({
      label: row.label,
      pay: paymentIn.name,
      payId: paymentIn.id,
      sum: paymentIn.sum,
      report: final.name,
      state: final.state?.name,
    })
    console.log(
      `  ${row.label}: paymentin ${paymentIn.name} ${money(paymentIn.sum)} | report ${final.name} ${final.state?.name}`,
    )
    console.log(`  https://online.moysklad.ru/app/#paymentin/edit?id=${paymentIn.id}`)
  }

  console.log(`\n  Posted ${posted.length} | ${money(posted.reduce((s, p) => s + p.sum, 0))} AED`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
