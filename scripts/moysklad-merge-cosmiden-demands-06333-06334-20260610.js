#!/usr/bin/env node

/**
 * Merge Cosmiden consignment demands 06333 + 06334 → single 06333 (agreement 15).
 * Excludes 00038 post cream. Deletes 06334 after merge.
 *
 *   node --import dotenv/config scripts/moysklad-merge-cosmiden-demands-06333-06334-20260610.js
 *   node --import dotenv/config scripts/moysklad-merge-cosmiden-demands-06333-06334-20260610.js --commit
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

const SURVIVE = {
  name: '06333',
  id: '028bedba-64c1-11f1-0a80-1120001c6c1b',
}
const REMOVE = {
  name: '06334',
  id: '92984271-64c2-11f1-0a80-1120001cd432',
}

const COMMON = {
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: 'd7b0a67f-d5a2-11ef-0a80-16cd0019b6b8',
  contractId: '69b01872-d7dd-11ef-0a80-0725003ffada',
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
}

const MARKER = 'Cosmiden merged demand 06333+06334 2026-06-10 (excl. 00038 post cream)'

/** Final lines: 16 SKUs, 54 pcs */
const MERGED_LINES = [
  ['00022', 1],
  ['00143', 1],
  ['00144', 1],
  ['00063', 20],
  ['00140', 20],
  ['00021', 1],
  ['00145', 1],
  ['00122', 1],
  ['00031', 1],
  ['00190', 1],
  ['54458', 1],
  ['00042', 1],
  ['54457', 1],
  ['00040', 1],
  ['00054', 1],
  ['00041', 1],
]

const EXPECTED_LINE_COUNT = MERGED_LINES.length
const EXPECTED_TOTAL_QTY = MERGED_LINES.reduce((s, [, q]) => s + q, 0)

async function api(method, pathStr, body) {
  const res = await fetch(pathStr.startsWith('http') ? pathStr : API + pathStr, {
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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} - ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

async function fetchAll(pathStr) {
  const rows = []
  let offset = 0
  while (true) {
    const sep = pathStr.includes('?') ? '&' : '?'
    const data = await api('GET', `${pathStr}${sep}limit=1000&offset=${offset}`)
    const batch = data?.rows || []
    rows.push(...batch)
    if (batch.length < 1000) break
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
  return (minor / 100).toFixed(2)
}

async function loadDemandPositions(demandId) {
  return fetchAll(`/entity/demand/${demandId}/positions?expand=assortment`)
}

function buildPriceMap(posRows) {
  const map = new Map()
  for (const p of posRows) {
    const code = p.assortment?.code
    if (!code) continue
    map.set(code, {
      price: p.price,
      productId: p.assortment?.meta?.href?.split('/').pop()?.split('?')[0],
      name: p.assortment?.name,
    })
  }
  return map
}

async function fetchProductByCode(code) {
  const data = await api('GET', `/entity/product?filter=code=${encodeURIComponent(code)}&limit=1`)
  const row = data?.rows?.[0]
  if (!row) return null
  return {
    productId: row.id,
    name: row.name,
    price: Number(row.salePrices?.[0]?.value || 0),
  }
}

async function resolveMerged(priceMap) {
  const resolved = []
  let totalQty = 0
  let sumMinor = 0
  for (const [code, qty] of MERGED_LINES) {
    let hit = priceMap.get(code)
    if (!hit?.productId || !hit?.price) {
      const p = await fetchProductByCode(code)
      if (!p?.productId || !p.price) throw new Error(`Cannot resolve ${code}: missing product or salePrice`)
      hit = { price: p.price, productId: p.productId, name: p.name }
    }
    totalQty += qty
    sumMinor += hit.price * qty
    resolved.push({ code, qty, price: hit.price, productId: hit.productId, name: hit.name })
  }
  if (resolved.length !== EXPECTED_LINE_COUNT || totalQty !== EXPECTED_TOTAL_QTY) {
    throw new Error(`Merge spec mismatch: ${resolved.length} lines / ${totalQty} pcs`)
  }
  return { resolved, sumMinor, totalQty }
}

function positionPayload(line) {
  return {
    quantity: line.qty,
    price: line.price,
    assortment: href('product', line.productId),
    vat: 5,
    vatEnabled: true,
  }
}

async function verifySurvivingDemand(demandId, resolved) {
  const demand = await api('GET', `/entity/demand/${demandId}`)
  const pos = await loadDemandPositions(demandId)
  const byCode = new Map(resolved.map((l) => [l.code, l]))
  if (pos.length !== EXPECTED_LINE_COUNT) {
    throw new Error(`Verify: ${pos.length} lines ≠ ${EXPECTED_LINE_COUNT}`)
  }
  for (const p of pos) {
    const code = p.assortment?.code
    const exp = byCode.get(code)
    if (!exp || exp.qty !== Number(p.quantity) || exp.price !== p.price) {
      throw new Error(`Verify mismatch on ${code}`)
    }
  }
  if (pHasCode(pos, '00038')) throw new Error('Verify: 00038 still present')
  return demand
}

function pHasCode(pos, code) {
  return pos.some((p) => p.assortment?.code === code)
}

async function syncSurviveDemand(resolved) {
  let demand = await api('GET', `/entity/demand/${SURVIVE.id}?expand=contract,agent`)
  const wasApplicable = demand.applicable

  if (wasApplicable) {
    demand = await api('PUT', `/entity/demand/${SURVIVE.id}`, { meta: demand.meta, applicable: false })
    console.log('    06333: applicable → false (position sync)')
  }

  let rows = await loadDemandPositions(SURVIVE.id)
  for (const p of rows) {
    await api('DELETE', `/entity/demand/${SURVIVE.id}/positions/${p.id}`)
    console.log(`    06333: deleted ${p.assortment?.code}`)
  }

  for (const line of resolved) {
    await api('POST', `/entity/demand/${SURVIVE.id}/positions`, positionPayload(line))
    console.log(`    06333: added ${line.code} x${line.qty} @ ${money(line.price)}`)
  }

  demand = await api('GET', `/entity/demand/${SURVIVE.id}`)
  await api('PUT', `/entity/demand/${SURVIVE.id}`, {
    meta: demand.meta,
    applicable: true,
    vatEnabled: true,
    vatIncluded: true,
    organization: href('organization', COMMON.organizationId),
    agent: href('counterparty', COMMON.agentId),
    contract: href('contract', COMMON.contractId),
    store: href('store', COMMON.storeId),
    state: stateHref('demand', COMMON.stateShippedId),
    description: [
      MARKER,
      'Single consignment отгрузка for COSMIDEN MEDICAL CENTER L.L.C under agreement 15.',
      'Merged former 06333 (restock/masks, excl. post cream 00038) + former 06334 (zero-fill sheet lines).',
      '16 lines, 54 pcs. Demand 06334 removed after merge.',
    ].join('\n'),
  })
}

async function removeDuplicateDemand() {
  let dup = null
  try {
    dup = await api('GET', `/entity/demand/${REMOVE.id}`)
  } catch (e) {
    if (String(e.message).includes('404')) {
      console.log('    06334: already deleted')
      return
    }
    throw e
  }

  if (dup.applicable) {
    await api('PUT', `/entity/demand/${REMOVE.id}`, { meta: dup.meta, applicable: false })
    console.log('    06334: applicable → false before delete')
  }

  await api('DELETE', `/entity/demand/${REMOVE.id}`)
  console.log(`    06334: deleted ${REMOVE.name}`)
}

async function main() {
  console.log('====================================================================')
  console.log('  Cosmiden — merge demands 06333 + 06334 → 06333')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Target: ${EXPECTED_LINE_COUNT} lines / ${EXPECTED_TOTAL_QTY} pcs (no 00038)`)

  const surviveDoc = await api('GET', `/entity/demand/${SURVIVE.id}?expand=contract,agent,state`)
  let removeDoc = null
  try {
    removeDoc = await api('GET', `/entity/demand/${REMOVE.id}?expand=contract`)
  } catch (e) {
    if (!String(e.message).includes('404')) throw e
  }

  console.log(`  Survive: ${surviveDoc.name} | ${money(surviveDoc.sum)} AED | ${surviveDoc.state?.name || '—'}`)
  if (removeDoc) console.log(`  Remove : ${removeDoc.name} | ${money(removeDoc.sum)} AED`)
  else console.log('  Remove : 06334 not found (may be already merged)')

  if ((surviveDoc.description || '').includes(MARKER)) {
    console.log('\n  Idempotent: merge marker already on 06333 — verifying…')
    const pos = await loadDemandPositions(SURVIVE.id)
    const priceMap = buildPriceMap(pos)
    const { resolved, sumMinor } = await resolveMerged(priceMap)
    await verifySurvivingDemand(SURVIVE.id, resolved)
    const d = await api('GET', `/entity/demand/${SURVIVE.id}`)
    console.log(`  OK: ${d.name} | ${money(d.sum)} AED | ${pos.length} lines | expected ~${money(sumMinor)}`)
    return
  }

  const pos33 = await loadDemandPositions(SURVIVE.id)
  const pos34 = removeDoc ? await loadDemandPositions(REMOVE.id) : []
  const priceMap = buildPriceMap([...pos33, ...pos34])

  console.log('\n  Current 06333 positions:')
  for (const p of pos33.sort((a, b) => (a.assortment?.code || '').localeCompare(b.assortment?.code || ''))) {
    console.log(`    ${p.assortment?.code} x${p.quantity}`)
  }
  if (removeDoc) {
    console.log('\n  Current 06334 positions:')
    for (const p of pos34.sort((a, b) => (a.assortment?.code || '').localeCompare(b.assortment?.code || ''))) {
      console.log(`    ${p.assortment?.code} x${p.quantity}`)
    }
  }

  const { resolved, sumMinor, totalQty } = await resolveMerged(priceMap)

  console.log('\n  Merged lines (clinic prices from source demands):')
  for (const line of resolved) {
    console.log(`    ${line.code} ${(line.name || '').slice(0, 48)} x${line.qty} @ ${money(line.price)}`)
  }
  console.log(`\n  Expected sum: ${money(sumMinor)} AED | ${totalQty} pcs`)

  if (!COMMIT) {
    console.log('\n  DRY RUN complete. Re-run with --commit.')
    return
  }

  if (!removeDoc) {
    const pos = await loadDemandPositions(SURVIVE.id)
    if (pos.length === EXPECTED_LINE_COUNT && !pHasCode(pos, '00038')) {
      console.log('\n  06334 gone; 06333 already has merged line count — updating description only if needed')
    } else {
      throw new Error('06334 missing but 06333 not in merged state — abort')
    }
  }

  console.log('\n  Commit: sync 06333…')
  await syncSurviveDemand(resolved)

  if (removeDoc) {
    console.log('\n  Commit: delete 06334…')
    await removeDuplicateDemand()
  }

  const final = await verifySurvivingDemand(SURVIVE.id, resolved)
  console.log(`\n  Done: ${final.name} | ${money(final.sum)} AED | ${EXPECTED_LINE_COUNT} lines | ${EXPECTED_TOTAL_QTY} pcs`)
  console.log(`  UI: https://online.moysklad.ru/app/#demand/edit?id=${SURVIVE.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
