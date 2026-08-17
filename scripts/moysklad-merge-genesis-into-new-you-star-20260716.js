#!/usr/bin/env node

/**
 * Merge Genesis Healthcare Center → NEW YOU STAR BEAUTY HEALTH CLINIC L.L.C
 *
 * 1) Face Room TRN on New You Star (legalAddressFull.comment)
 * 2) Reassign Genesis order / invoice / shipment → New You Star
 * 3) Delete Genesis counterparty
 *
 *   node --import dotenv/config scripts/moysklad-merge-genesis-into-new-you-star-20260716.js
 *   node --import dotenv/config scripts/moysklad-merge-genesis-into-new-you-star-20260716.js --commit
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

const GENESIS_ID = '4453a654-812b-11f1-0a80-0ca1002290e7'
const NYS_ID = '69e1db3e-7fa4-11f1-0a80-0283002585b0'
const TRN = '100619066200003'
const LICENSE_NO = '985526'

const DOCS = [
  { type: 'customerorder', id: '361f8c3d-8130-11f1-0a80-0dc40023a524', label: 'Order PARTW2607160539' },
  { type: 'invoiceout', id: '36623435-8130-11f1-0a80-04d100239d31', label: 'Invoice 04830' },
  { type: 'demand', id: '36efaf8c-8130-11f1-0a80-0bab00236329', label: 'Shipment 06555' },
]

function agentMeta(id) {
  return {
    meta: {
      href: `${API}/entity/counterparty/${id}`,
      type: 'counterparty',
      mediaType: 'application/json',
    },
  }
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
    if (attempt < 5 && (e.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || e.message === 'fetch failed')) {
      await new Promise((r) => setTimeout(r, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw e
  }
}

async function main() {
  console.log('====================================================================')
  console.log('  Merge Genesis → NEW YOU STAR + Face Room TRN + delete duplicate')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}\n`)

  const genesis = await api('GET', `/entity/counterparty/${GENESIS_ID}`)
  const nys = await api('GET', `/entity/counterparty/${NYS_ID}`)
  console.log(`  From: ${genesis.name} (${GENESIS_ID})`)
  console.log(`  To  : ${nys.name} (${NYS_ID})`)
  console.log(`  NYS email/fax/inn/comment: ${nys.email} / ${nys.fax} / ${nys.inn} / ${nys.legalAddressFull?.comment || '—'}\n`)

  // 1) Face Room TRN comment on New You Star
  const needsTrnComment = nys.legalAddressFull?.comment !== TRN
  const needsInn = nys.inn !== TRN
  const needsEmail = nys.email !== LICENSE_NO
  if (needsTrnComment || needsInn || needsEmail) {
    console.log('  New You Star Face Room fields:')
    if (needsEmail) console.log(`    email → ${LICENSE_NO}`)
    if (needsInn) console.log(`    inn   → ${TRN}`)
    if (needsTrnComment) console.log(`    legalAddressFull.comment → ${TRN}`)
    if (COMMIT) {
      const updated = await api('PUT', `/entity/counterparty/${NYS_ID}`, {
        meta: nys.meta,
        email: LICENSE_NO,
        inn: TRN,
        legalAddressFull: {
          ...(nys.legalAddressFull || {}),
          comment: TRN,
        },
      })
      console.log(`    updated comment=${updated.legalAddressFull?.comment} inn=${updated.inn} email=${updated.email}`)
    }
  } else {
    console.log('  New You Star Face Room fields already OK')
  }

  // 2) Reassign docs
  console.log('\n  Reassign documents:')
  for (const doc of DOCS) {
    const current = await api('GET', `/entity/${doc.type}/${doc.id}?expand=agent`)
    const agentId = current.agent?.meta?.href?.split('/').pop()?.split('?')[0]
    console.log(`  ${doc.label}: agent=${current.agent?.name || agentId}`)
    if (agentId === NYS_ID) {
      console.log('    already New You Star — skip')
      continue
    }
    if (!COMMIT) {
      console.log(`    would reassign → ${nys.name}`)
      continue
    }
    const updated = await api('PUT', `/entity/${doc.type}/${doc.id}`, {
      meta: current.meta,
      agent: agentMeta(NYS_ID),
    })
    console.log(`    updated → ${updated.agent?.name || updated.agent?.meta?.href}`)
  }

  // 3) Confirm Genesis has no remaining docs, then delete
  const agentHref = `${API}/entity/counterparty/${GENESIS_ID}`
  const leftover = []
  for (const entity of ['customerorder', 'demand', 'invoiceout', 'paymentin', 'salesreturn', 'commissionreportin']) {
    const d = await api('GET', `/entity/${entity}?filter=agent=${encodeURIComponent(agentHref)}&limit=50`)
    for (const r of d.rows || []) leftover.push(`${entity} ${r.name}`)
  }
  console.log(`\n  Genesis leftover docs: ${leftover.length ? leftover.join(', ') : 'none'}`)

  if (leftover.length) {
    if (COMMIT) {
      console.log('  ERROR: cannot delete Genesis while docs remain')
      process.exit(1)
    }
    console.log('  (after commit, leftovers should be empty before delete)')
  } else if (!COMMIT) {
    console.log(`  Would DELETE counterparty ${genesis.name}`)
  } else {
    await api('DELETE', `/entity/counterparty/${GENESIS_ID}`)
    console.log(`  DELETED Genesis Healthcare Center (${GENESIS_ID})`)
  }

  if (!COMMIT) console.log('\n  DRY RUN — re-run with --commit')
  else {
    console.log(`\n  NYS UI: https://online.moysklad.ru/app/#company/edit?id=${NYS_ID}`)
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
