#!/usr/bin/env node

/**
 * Fix two settlement overpayments flagged 2026-06-11 audit:
 *
 * 1. Shakirovna Ladies — invoice 02184 / demand 02790
 *    Payment 02515 linked 692 AED vs doc sum 527 AED (+165). Lines already match — payment-only fix.
 *
 * 2. My Skin Story — commission report 01231
 *    Duplicate paymentin 05020 + 05021 both 840 AED on same report. Delete 05021 (keep 05020).
 *
 *   node --import dotenv/config scripts/moysklad-fix-overpayment-20260612.js
 *   node --import dotenv/config scripts/moysklad-fix-overpayment-20260612.js --commit
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
const GAP_MS = 80
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const SHAKIROVNA = {
  label: 'Shakirovna Ladies Beauty Saloon',
  agentId: '93775ae5-d18d-11ea-0a80-02e00008417d',
  invoiceId: 'ee24a66f-942a-11ee-0a80-1392000ffc94',
  invoiceName: '02184',
  demandId: 'cc816f8c-942b-11ee-0a80-109f000fe236',
  paymentId: '4ac9e6dd-9430-11ee-0a80-0b9c0011c97f',
  paymentName: '02515',
}

const MY_SKIN = {
  label: 'My Skin Story Perfumes and Cosmetics Trading LLC',
  agentId: 'c3576ba8-2fe7-11eb-0a80-0536000bc5a9',
  reportId: '69a28b37-f853-11f0-0a80-1095000e206a',
  reportName: '01231',
  keepPaymentId: '9a77b12f-f861-11f0-0a80-14ae00106089',
  keepPaymentName: '05020',
  removePaymentId: '9c0f3209-f861-11f0-0a80-0574001061a8',
  removePaymentName: '05021',
}

async function api(method, pathStr, body) {
  await sleep(GAP_MS)
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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function settlementBalance(agentId) {
  async function fetchAll(entityPath) {
    const rows = []
    let offset = 0
    while (true) {
      const sep = entityPath.includes('?') ? '&' : '?'
      const data = await api('GET', `${entityPath}${sep}limit=1000&offset=${offset}`)
      rows.push(...(data.rows || []))
      if ((data.rows || []).length < 1000) break
      offset += 1000
    }
    return rows
  }

  const agentFilter = encodeURIComponent(`${API}/entity/counterparty/${agentId}`)
  const [invoices, reports, returns] = await Promise.all([
    fetchAll(`/entity/invoiceout?filter=agent=${agentFilter};applicable=true`),
    fetchAll(`/entity/commissionreportin?filter=agent=${agentFilter};applicable=true`),
    fetchAll(`/entity/salesreturn?filter=agent=${agentFilter};applicable=true`),
  ])

  let balance = 0
  for (const inv of invoices) balance += (inv.payedSum || 0) - (inv.sum || 0)
  for (const rep of reports) balance += (rep.payedSum || 0) - (rep.sum || 0)
  for (const ret of returns) balance += (ret.sum || 0) - (ret.payedSum || 0)
  return balance
}

async function fixShakirovna() {
  console.log('\n' + '='.repeat(72))
  console.log(`  ${SHAKIROVNA.label} — invoice ${SHAKIROVNA.invoiceName}`)
  console.log('='.repeat(72))

  const inv = await api('GET', `/entity/invoiceout/${SHAKIROVNA.invoiceId}`)
  const dem = await api('GET', `/entity/demand/${SHAKIROVNA.demandId}`)
  const pay = await api('GET', `/entity/paymentin/${SHAKIROVNA.paymentId}?expand=operations`)

  const overMinor = (inv.payedSum || 0) - (inv.sum || 0)
  console.log(`  Invoice ${inv.name}: sum ${money(inv.sum)} | payedSum ${money(inv.payedSum)} | over ${money(overMinor)}`)
  console.log(`  Demand  ${dem.name}: sum ${money(dem.sum)} | payedSum ${money(dem.payedSum)}`)
  console.log(`  Payment ${pay.name}: sum ${money(pay.sum)} | linked ${money(pay.operations?.[0]?.linkedSum)}`)

  if (overMinor === 0 && pay.sum === inv.sum) {
    console.log('  ✓ Already balanced — skip')
    return
  }

  if (dem.sum !== inv.sum) {
    throw new Error(`Invoice/demand sum mismatch: ${money(inv.sum)} vs ${money(dem.sum)}`)
  }

  const targetMinor = inv.sum
  const demandHref = `${API}/entity/demand/${SHAKIROVNA.demandId}`
  const balanceBefore = await settlementBalance(SHAKIROVNA.agentId)

  console.log(`\n  Fix: payment ${pay.name} sum + linkedSum → ${money(targetMinor)} AED`)
  if (COMMIT) {
    await api('PUT', `/entity/paymentin/${SHAKIROVNA.paymentId}`, {
      sum: targetMinor,
      operations: [
        {
          meta: { href: demandHref, type: 'demand', mediaType: 'application/json' },
          linkedSum: targetMinor,
        },
      ],
    })
  }

  const invAfter = COMMIT ? await api('GET', `/entity/invoiceout/${SHAKIROVNA.invoiceId}`) : inv
  const demAfter = COMMIT ? await api('GET', `/entity/demand/${SHAKIROVNA.demandId}`) : dem
  const balanceAfter = COMMIT ? await settlementBalance(SHAKIROVNA.agentId) : balanceBefore - overMinor

  console.log('\n  Verification:')
  console.log(`    Invoice: ${money(invAfter.payedSum)} / ${money(invAfter.sum)}`)
  console.log(`    Demand:  ${money(demAfter.payedSum)} / ${money(demAfter.sum)}`)
  console.log(`    Balance: ${money(balanceBefore)} → ${money(balanceAfter)} AED`)
}

async function fixMySkinStory() {
  console.log('\n' + '='.repeat(72))
  console.log(`  ${MY_SKIN.label} — report ${MY_SKIN.reportName}`)
  console.log('='.repeat(72))

  const rep = await api('GET', `/entity/commissionreportin/${MY_SKIN.reportId}`)
  const keep = await api('GET', `/entity/paymentin/${MY_SKIN.keepPaymentId}?expand=operations`)
  let remove = null
  try {
    remove = await api('GET', `/entity/paymentin/${MY_SKIN.removePaymentId}?expand=operations`)
  } catch (e) {
    if (!String(e.message).includes('404')) throw e
  }

  const overMinor = (rep.payedSum || 0) - (rep.sum || 0)
  console.log(`  Report ${rep.name}: sum ${money(rep.sum)} | payedSum ${money(rep.payedSum)} | over ${money(overMinor)}`)
  console.log(`  Keep   ${keep.name}: ${money(keep.sum)} AED`)
  console.log(`  Remove ${MY_SKIN.removePaymentName}: ${remove ? money(remove.sum) + ' AED' : 'already deleted'}`)

  if (overMinor === 0) {
    console.log('  ✓ Already balanced — skip')
    return
  }

  const balanceBefore = await settlementBalance(MY_SKIN.agentId)
  console.log(`\n  Fix: delete duplicate payment ${MY_SKIN.removePaymentName} (keep ${MY_SKIN.keepPaymentName})`)

  if (COMMIT && remove) {
    if (remove.applicable !== false) {
      await api('PUT', `/entity/paymentin/${MY_SKIN.removePaymentId}`, {
        meta: remove.meta,
        applicable: false,
      })
      console.log(`    ${MY_SKIN.removePaymentName}: applicable → false`)
    }
    await api('DELETE', `/entity/paymentin/${MY_SKIN.removePaymentId}`)
    console.log(`    ${MY_SKIN.removePaymentName}: deleted`)
  }

  const repAfter = COMMIT ? await api('GET', `/entity/commissionreportin/${MY_SKIN.reportId}`) : rep
  const balanceAfter = COMMIT ? await settlementBalance(MY_SKIN.agentId) : balanceBefore - overMinor

  console.log('\n  Verification:')
  console.log(`    Report:  ${money(repAfter.payedSum)} / ${money(repAfter.sum)}`)
  console.log(`    Balance: ${money(balanceBefore)} → ${money(balanceAfter)} AED`)
}

async function main() {
  console.log(COMMIT ? 'MODE: COMMIT' : 'MODE: dry-run (add --commit to apply)')
  await fixShakirovna()
  await fixMySkinStory()
  if (!COMMIT) console.log('\n  Re-run with --commit to apply.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
