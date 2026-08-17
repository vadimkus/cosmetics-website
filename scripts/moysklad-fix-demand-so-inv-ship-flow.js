#!/usr/bin/env node

/**
 * Relink demands that incorrectly have BOTH customerOrder + invoicesOut.
 * Correct retail flow: SO → Invoice → Shipment (demand linked to invoice only).
 * Paymentin/cashin should attach to the shipment (demand), not the SO.
 *
 *   node --import dotenv/config scripts/moysklad-fix-demand-so-inv-ship-flow.js
 *   node --import dotenv/config scripts/moysklad-fix-demand-so-inv-ship-flow.js --commit
 *   node --import dotenv/config scripts/moysklad-fix-demand-so-inv-ship-flow.js --commit --from=2026-07-01 --to=2026-08-05
 */

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

function arg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : fallback
}

const FROM = arg('from', '2026-01-01')
const TO = arg('to', new Date().toISOString().slice(0, 10))

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Content-Type': 'application/json',
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1500)}`)
  return text ? JSON.parse(text) : null
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

function money(m) {
  return ((m || 0) / 100).toFixed(2)
}

async function positions(demandId) {
  const data = await api('GET', `/entity/demand/${demandId}/positions?limit=100`)
  return (data.rows || []).map((p) => ({
    quantity: p.quantity,
    price: p.price,
    discount: p.discount || 0,
    assortment: p.assortment,
    vat: p.vat,
    vatEnabled: p.vatEnabled,
  }))
}

async function findPayments(demand) {
  if (!(demand.payedSum > 0)) return []
  const filter = `agent=${demand.agent.meta.href};moment>=${FROM} 00:00:00`
  const found = []
  for (const type of ['paymentin', 'cashin']) {
    const rows = await fetchAll(`/entity/${type}?filter=${encodeURIComponent(filter)}&expand=operations`)
    for (const row of rows) {
      if ((row.operations || []).some((op) => op.meta?.href?.includes(demand.id))) {
        found.push({ type, id: row.id, name: row.name, sum: row.sum })
      }
    }
  }
  return found
}

async function fixDemand(d) {
  const pays = await findPayments(d)
  console.log(
    `\n${d.name} | ${money(d.sum)} | payed ${money(d.payedSum)} | SO ${d.customerOrder?.name} | INV ${d.invoicesOut?.[0]?.name || '?'}`,
  )
  console.log(`  payments: ${pays.map((p) => `${p.type} ${p.name}`).join(', ') || 'none'}`)

  if (!COMMIT) {
    console.log('  DRY — would recreate without customerOrder')
    return
  }

  for (const pay of pays) {
    const full = await api('GET', `/entity/${pay.type}/${pay.id}`)
    const ops = (full.operations || []).filter((op) => !op.meta.href.includes(d.id))
    await api('PUT', `/entity/${pay.type}/${pay.id}`, { meta: full.meta, operations: ops })
    console.log(`  unlinked ${pay.type} ${pay.name}`)
  }

  const pos = await positions(d.id)
  const payload = {
    applicable: d.applicable,
    shared: d.shared,
    moment: d.moment,
    name: d.name,
    vatEnabled: d.vatEnabled,
    vatIncluded: d.vatIncluded,
    organization: { meta: d.organization.meta },
    agent: { meta: d.agent.meta },
    store: { meta: d.store.meta },
    state: d.state ? { meta: d.state.meta } : undefined,
    invoicesOut: [{ meta: d.invoicesOut[0].meta }],
    description: [d.description || '', 'Relinked flow: SO→INV→SHIP (removed direct SO link)']
      .filter(Boolean)
      .join(' | '),
    positions: pos,
  }

  await api('DELETE', `/entity/demand/${d.id}`)
  let created
  try {
    created = await api('POST', '/entity/demand', payload)
  } catch {
    delete payload.name
    created = await api('POST', '/entity/demand', payload)
  }

  for (const pay of pays) {
    const full = await api('GET', `/entity/${pay.type}/${pay.id}`)
    await api('PUT', `/entity/${pay.type}/${pay.id}`, {
      meta: full.meta,
      operations: [
        ...(full.operations || []),
        {
          meta: {
            href: `${API}/entity/demand/${created.id}`,
            type: 'demand',
            mediaType: 'application/json',
          },
          linkedSum: Math.min(full.sum, created.sum),
        },
      ],
    })
    console.log(`  relinked ${pay.type} ${pay.name} → ${created.name}`)
  }

  const v = await api('GET', `/entity/demand/${created.id}?expand=customerOrder,invoicesOut`)
  console.log(
    `  OK ${created.name} | SO=${v.customerOrder?.name || 'none'} | INV=${(v.invoicesOut || []).map((i) => i.name).join(',') || 'none'} | payed ${money(v.payedSum)}`,
  )
}

async function main() {
  console.log('====================================================================')
  console.log('  Fix demand links — SO→INV→SHIP (remove dual SO+INV on demand)')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Range: ${FROM} → ${TO}`)

  const filter = `moment>=${FROM} 00:00:00;moment<=${TO} 23:59:59`
  const demands = await fetchAll(
    `/entity/demand?filter=${encodeURIComponent(filter)}&order=moment,desc&expand=agent,organization,store,state,customerOrder,invoicesOut`,
  )
  const bad = demands.filter((d) => d.customerOrder && d.invoicesOut?.length)
  console.log(`  Scanned ${demands.length} | dual-link ${bad.length}`)

  for (const d of bad) await fixDemand(d)
  if (!bad.length) console.log('\n  Nothing to fix.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
