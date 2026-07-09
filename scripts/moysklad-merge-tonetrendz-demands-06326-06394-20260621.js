#!/usr/bin/env node

/**
 * Merge TONETRENDZ consignment demands 06326 + 06394 → single 06326 (agreement 36).
 * Deletes 06394 after merge. Regenerates Consignment Stock Note PDF.
 *
 *   node --import dotenv/config scripts/moysklad-merge-tonetrendz-demands-06326-06394-20260621.js
 *   node --import dotenv/config scripts/moysklad-merge-tonetrendz-demands-06326-06394-20260621.js --commit
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

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const SURVIVE = {
  name: '06326',
  id: '7b63d1d7-63dc-11f1-0a80-0d66001d1a9f',
}
const REMOVE = {
  name: '06394',
  id: '7341ace5-6d59-11f1-0a80-1511005c5ae1',
}

const COMMON = {
  organizationId: 'e18525a4-33c5-11ea-0a80-043f000b2738',
  storeId: 'e186d449-33c5-11ea-0a80-043f000b273a',
  agentId: '74aa75cb-63db-11f1-0a80-111d001bbe72',
  contractId: '7a5e3023-63dc-11f1-0a80-1ba4001ce87b',
  stateShippedId: '50d70717-4582-11ea-0a80-05e3001273a2',
}

const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'
const MARKER = 'TONETRENDZ merged consignment demand 06326+06394 2026-06-21'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
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

function mergePositions(posRows) {
  const byCode = new Map()
  for (const p of posRows) {
    const code = p.assortment?.code
    if (!code) continue
    const qty = Number(p.quantity)
    const hit = byCode.get(code)
    if (hit) {
      if (hit.price !== p.price) {
        throw new Error(`Price mismatch on ${code}: ${money(hit.price)} vs ${money(p.price)}`)
      }
      hit.qty += qty
    } else {
      byCode.set(code, {
        code,
        qty,
        price: p.price,
        productId: p.assortment?.meta?.href?.split('/').pop()?.split('?')[0],
        name: p.assortment?.name,
      })
    }
  }
  return [...byCode.values()].sort((a, b) => a.code.localeCompare(b.code))
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
  if (pos.length !== resolved.length) {
    throw new Error(`Verify: ${pos.length} lines ≠ ${resolved.length}`)
  }
  for (const p of pos) {
    const code = p.assortment?.code
    const exp = byCode.get(code)
    if (!exp || exp.qty !== Number(p.quantity) || exp.price !== p.price) {
      throw new Error(`Verify mismatch on ${code}`)
    }
  }
  return demand
}

async function syncSurviveDemand(resolved) {
  let demand = await api('GET', `/entity/demand/${SURVIVE.id}?expand=contract,agent`)

  if (demand.applicable) {
    demand = await api('PUT', `/entity/demand/${SURVIVE.id}`, { meta: demand.meta, applicable: false })
    console.log('    06326: applicable → false (position sync)')
  }

  const rows = await loadDemandPositions(SURVIVE.id)
  for (const p of rows) {
    await api('DELETE', `/entity/demand/${SURVIVE.id}/positions/${p.id}`)
    console.log(`    06326: deleted ${p.assortment?.code}`)
  }

  for (const line of resolved) {
    await api('POST', `/entity/demand/${SURVIVE.id}/positions`, positionPayload(line))
    console.log(`    06326: added ${line.code} x${line.qty} @ ${money(line.price)}`)
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
      'Single retail consignment отгрузка for TONETRENDZ under agreement 36.',
      'Merged former 06326 (opening stock) + former 06394 (Camel×3, hyaluron serum×2, peptide mask×5).',
      `${resolved.length} lines, ${resolved.reduce((s, l) => s + l.qty, 0)} pcs. Demand 06394 removed after merge.`,
      'Deliver: JVC Binghatti Azure.',
    ].join('\n'),
  })
}

async function removeDuplicateDemand() {
  let dup = null
  try {
    dup = await api('GET', `/entity/demand/${REMOVE.id}`)
  } catch (e) {
    if (String(e.message).includes('404')) {
      console.log('    06394: already deleted')
      return
    }
    throw e
  }

  if (dup.applicable) {
    await api('PUT', `/entity/demand/${REMOVE.id}`, { meta: dup.meta, applicable: false })
    console.log('    06394: applicable → false before delete')
  }

  await api('DELETE', `/entity/demand/${REMOVE.id}`)
  console.log(`    06394: deleted ${REMOVE.name}`)
}

async function exportStockNotePdf(demandId) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/demand/metadata/customtemplate/${STOCK_NOTE_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/demand/${demandId}/export`, {
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
    throw new Error(`Stock note export ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

async function main() {
  console.log('====================================================================')
  console.log('  TONETRENDZ — merge demands 06326 + 06394 → 06326')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const surviveDoc = await api('GET', `/entity/demand/${SURVIVE.id}?expand=contract,agent,state`)
  let removeDoc = null
  try {
    removeDoc = await api('GET', `/entity/demand/${REMOVE.id}?expand=contract`)
  } catch (e) {
    if (!String(e.message).includes('404')) throw e
  }

  console.log(`  Survive: ${surviveDoc.name} | ${money(surviveDoc.sum)} AED`)
  if (removeDoc) console.log(`  Remove : ${removeDoc.name} | ${money(removeDoc.sum)} AED`)
  else console.log('  Remove : 06394 not found (may be already merged)')

  if ((surviveDoc.description || '').includes(MARKER)) {
    console.log('\n  Idempotent: merge marker already on 06326 — verifying…')
    const pos = await loadDemandPositions(SURVIVE.id)
    const resolved = mergePositions(pos)
    await verifySurvivingDemand(SURVIVE.id, resolved)
    const d = await api('GET', `/entity/demand/${SURVIVE.id}`)
    console.log(`  OK: ${d.name} | ${money(d.sum)} AED | ${pos.length} lines`)
    return
  }

  const pos26 = await loadDemandPositions(SURVIVE.id)
  const pos94 = removeDoc ? await loadDemandPositions(REMOVE.id) : []
  const resolved = mergePositions([...pos26, ...pos94])
  const totalQty = resolved.reduce((s, l) => s + l.qty, 0)
  const sumMinor = resolved.reduce((s, l) => s + l.price * l.qty, 0)

  console.log('\n  Current 06326 positions:')
  for (const p of pos26.sort((a, b) => (a.assortment?.code || '').localeCompare(b.assortment?.code || ''))) {
    console.log(`    ${p.assortment?.code} x${p.quantity}`)
  }
  if (removeDoc) {
    console.log('\n  Current 06394 positions:')
    for (const p of pos94.sort((a, b) => (a.assortment?.code || '').localeCompare(b.assortment?.code || ''))) {
      console.log(`    ${p.assortment?.code} x${p.quantity}`)
    }
  }

  console.log('\n  Merged lines:')
  for (const line of resolved) {
    console.log(`    ${line.code} ${(line.name || '').slice(0, 48)} x${line.qty} @ ${money(line.price)}`)
  }
  console.log(`\n  Expected sum: ${money(sumMinor)} AED | ${totalQty} pcs | ${resolved.length} lines`)

  if (!COMMIT) {
    console.log('\n  DRY RUN complete. Re-run with --commit.')
    return
  }

  console.log('\n  Commit: sync 06326…')
  await syncSurviveDemand(resolved)

  if (removeDoc) {
    console.log('\n  Commit: delete 06394…')
    await removeDuplicateDemand()
  }

  const final = await verifySurvivingDemand(SURVIVE.id, resolved)
  console.log(`\n  Done: ${final.name} | ${money(final.sum)} AED | ${resolved.length} lines | ${totalQty} pcs`)
  console.log(`  UI: https://online.moysklad.ru/app/#demand/edit?id=${SURVIVE.id}`)

  console.log('  Exporting Consignment Stock Note PDF…')
  const pdfBuf = await exportStockNotePdf(SURVIVE.id)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const outPath = path.join(ORDERS_DIR, `GENOSYS_TONETRENDZ_06326_Consignment_Stock_Note.pdf`)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`  PDF: ${outPath} (${pdfBuf.length} bytes)`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
