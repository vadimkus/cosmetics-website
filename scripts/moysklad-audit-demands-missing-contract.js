#!/usr/bin/env node

/**
 * Audit Отгрузки (demand) missing commission agreement.
 *
 * Flags demands where the counterparty has a Commission contract in MoySklad
 * but the demand has no (or wrong) contract — same class of bug as Ulbossyn 06044.
 *
 *   node --import dotenv/config scripts/moysklad-audit-demands-missing-contract.js
 *   node --import dotenv/config scripts/moysklad-audit-demands-missing-contract.js --since 2024-01-01
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
const sinceArg = process.argv.find((a) => a.startsWith('--since='))
const SINCE = sinceArg ? sinceArg.split('=')[1] : '2023-01-01 00:00:00'

async function api(pathStr) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
    },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${pathStr} — ${text.slice(0, 400)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api(`${pathStr}${sep}limit=1000&offset=${offset}`)
    rows.push(...(data.rows || []))
    if ((data.rows || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function agentIdFromHref(href) {
  return href?.split('/').pop()?.split('?')[0] || null
}

function contractIdFromDoc(doc) {
  return doc.contract?.meta?.href ? agentIdFromHref(doc.contract.meta.href) : null
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function main() {
  console.log('Loading commission contracts…')
  const allContracts = await fetchAll('/entity/contract?limit=1000')
  const commissionContracts = allContracts.filter(
    (c) => c.contractType === 'Commission' || (!c.contractType && c.rewardType)
  )

  /** agentId -> [{ id, name }] */
  const contractsByAgent = new Map()
  for (const c of commissionContracts) {
    const agentId = agentIdFromHref(c.agent?.meta?.href)
    if (!agentId) continue
    if (!contractsByAgent.has(agentId)) contractsByAgent.set(agentId, [])
    contractsByAgent.get(agentId).push({ id: c.id, name: c.name, applicable: c.applicable })
  }

  console.log(`Commission contracts: ${commissionContracts.length} across ${contractsByAgent.size} agents`)

  /** agentId -> { name, withContract, withoutContract, reportsWithContract } */
  const agentStats = new Map()

  for (const [agentId, contracts] of contractsByAgent) {
    const agentHref = `${API}/entity/counterparty/${agentId}`
    const agent = await api(`/entity/counterparty/${agentId}`).catch(() => ({ name: agentId }))

    const demandFilter = [
      `agent=${agentHref}`,
      `moment>=${SINCE}`,
    ].join(';')
    const demands = await fetchAll(`/entity/demand?filter=${encodeURIComponent(demandFilter)}`)

    const reportFilter = [`agent=${agentHref}`, `moment>=${SINCE}`].join(';')
    const reports = await fetchAll(
      `/entity/commissionreportin?filter=${encodeURIComponent(reportFilter)}`
    )

    const withContract = demands.filter((d) => contractIdFromDoc(d))
    const withoutContract = demands.filter((d) => !contractIdFromDoc(d))
    const reportsOnContract = reports.filter((r) => contractIdFromDoc(r))

    if (demands.length === 0 && reportsOnContract.length === 0) continue

    agentStats.set(agentId, {
      name: agent.name,
      contracts,
      demandsTotal: demands.length,
      withContract: withContract.length,
      withoutContract,
      reportsOnContract: reportsOnContract.length,
    })
  }

  const flagged = []
  for (const [agentId, s] of agentStats) {
    const isConsignmentActive = s.withContract > 0 || s.reportsOnContract > 0
    if (!isConsignmentActive) continue
    if (s.withoutContract.length === 0) continue

    for (const d of s.withoutContract) {
      flagged.push({
        agentId,
        agentName: s.name,
        contracts: s.contracts.map((c) => c.name).join(', '),
        demandName: d.name,
        demandId: d.id,
        moment: d.moment?.slice(0, 10),
        sumAed: money(d.sum),
        description: (d.description || '').slice(0, 120),
        applicable: d.applicable,
      })
    }
  }

  flagged.sort((a, b) => b.moment.localeCompare(a.moment) || a.agentName.localeCompare(b.agentName))

  console.log('\n====================================================================')
  console.log(`  DEMANDS WITHOUT AGREEMENT (since ${SINCE.slice(0, 10)})`)
  console.log(`  Counterparty has Commission contract + consignment activity`)
  console.log('====================================================================\n')

  if (flagged.length === 0) {
    console.log('  No issues found in this window.')
  } else {
    let totalAed = 0
    for (const row of flagged) {
      totalAed += parseFloat(row.sumAed)
      console.log(
        `  ${row.moment}  ${row.demandName.padEnd(8)}  ${row.sumAed.padStart(10)} AED  ${row.agentName}`
      )
      console.log(`    Agreement(s): ${row.contracts}`)
      console.log(`    https://online.moysklad.ru/app/#demand/edit?id=${row.demandId}`)
      if (row.description) console.log(`    ${row.description}`)
      console.log()
    }
    console.log(`  Total flagged: ${flagged.length} demands | ${totalAed.toFixed(2)} AED off consignment books`)
  }

  // Agents with wrong contract (different from their only commission contract)
  console.log('\n--- Wrong agreement (demand contract ≠ agent commission contract) ---\n')
  const wrongContract = []
  for (const [agentId, s] of agentStats) {
    const validIds = new Set(s.contracts.map((c) => c.id))
    if (validIds.size === 0) continue
    const agentHref = `${API}/entity/counterparty/${agentId}`
    const demands = await fetchAll(
      `/entity/demand?filter=${encodeURIComponent(`agent=${agentHref};moment>=${SINCE}`)}`
    )
    for (const d of demands) {
      const cid = contractIdFromDoc(d)
      if (cid && !validIds.has(cid)) {
        wrongContract.push({
          moment: d.moment?.slice(0, 10),
          name: d.name,
          id: d.id,
          agentName: s.name,
          contractId: cid,
        })
      }
    }
  }
  if (wrongContract.length === 0) {
    console.log('  None found.')
  } else {
    for (const w of wrongContract) {
      console.log(`  ${w.moment} ${w.name} ${w.agentName} wrong contract ${w.contractId}`)
    }
  }

  const outPath = path.join(
    __dirname,
    '../docs/MOYSKLAD_DEMANDS_MISSING_AGREEMENT_AUDIT.txt'
  )
  const lines = [
    `MoySklad audit — demands missing commission agreement`,
    `Generated: ${new Date().toISOString()}`,
    `Since: ${SINCE}`,
    `Flagged: ${flagged.length}`,
    '',
    ...flagged.map(
      (r) =>
        `${r.moment}\t${r.demandName}\t${r.sumAed}\t${r.agentName}\t${r.contracts}\t${r.demandId}`
    ),
  ]
  fs.writeFileSync(outPath, lines.join('\n'))
  console.log(`\nSaved: ${outPath}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
