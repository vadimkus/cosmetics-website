#!/usr/bin/env node

/**
 * Delete mistaken commission report 01397 (Refresh) and close the gap:
 *   01398 → 01397 (ARFI Barsha)
 *   01399 → 01398 (ARFI Jumeirah)
 * Re-export ARFI consignment sales PDFs; patch demand descriptions.
 *
 *   node --import dotenv/config scripts/moysklad-fix-delete-01397-renumber-arfi-reports-20260703.js
 *   node --import dotenv/config scripts/moysklad-fix-delete-01397-renumber-arfi-reports-20260703.js --commit
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
const COMMIT = process.argv.includes('--commit')

const REPORT_DELETE = { name: '01397', id: '64758b44-76a4-11f1-0a80-1dbb0003d191' }
const REPORT_BARSHA = { oldName: '01398', newName: '01397', id: 'fb12bb06-76a6-11f1-0a80-1c6d000ec946' }
const REPORT_JBR = { oldName: '01399', newName: '01398', id: '511f797b-76a7-11f1-0a80-1c6d000ed67c' }
const DEMAND_BARSHA = { id: 'fb88fbef-76a6-11f1-0a80-1a69000e981d', name: '06462' }
const DEMAND_JBR = { id: '5184f28d-76a7-11f1-0a80-08c2000e1979', name: '06463' }

const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MARKER = `DELETE-01397-RENUMBER-ARFI-${uaeToday()}`

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

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function fetchReport(name, id) {
  const doc = await api('GET', `/entity/commissionreportin/${id}?expand=agent`)
  if (doc.name !== name) {
    throw new Error(`Report ${id} name is ${doc.name}, expected ${name}`)
  }
  return doc
}

async function renameReport(report, newName) {
  console.log(`  Rename report ${report.name} → ${newName} (${report.agent?.name || '—'})`)
  if (!COMMIT) return
  await api('PUT', `/entity/commissionreportin/${report.id}`, {
    meta: report.meta,
    name: newName,
  })
}

async function patchDemandDesc(demandId, oldReportName, newReportName) {
  const doc = await api('GET', `/entity/demand/${demandId}`)
  const desc = doc.description || ''
  if (!desc.includes(`report ${oldReportName}`)) {
    console.log(`  Demand ${doc.name}: no ref to report ${oldReportName} — skip desc patch`)
    return
  }
  const updated = desc.replace(`report ${oldReportName}`, `report ${newReportName}`)
  console.log(`  Demand ${doc.name}: patch report ref ${oldReportName} → ${newReportName}`)
  if (!COMMIT) return
  await api('PUT', `/entity/demand/${demandId}`, {
    meta: doc.meta,
    description: updated.includes(MARKER) ? updated : `${updated}\n${MARKER}`,
  })
}

async function exportReportPdf(reportId, reportName, label) {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/commissionreportin/metadata/customtemplate/${CONSIGNMENT_SALES_TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const res = await fetch(`${API}/entity/commissionreportin/${reportId}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (res.status === 412) return null
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Export ${reportName}: ${res.status} ${t.slice(0, 400)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')
  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  const buf = Buffer.from(await pdfRes.arrayBuffer())
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const outPath = path.join(ORDERS_DIR, `${label}_${reportName}.pdf`)
  fs.writeFileSync(outPath, buf)
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Delete report 01397 + renumber ARFI 01398/01399')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const [del, barsha, jbr] = await Promise.all([
    fetchReport(REPORT_DELETE.name, REPORT_DELETE.id),
    fetchReport(REPORT_BARSHA.oldName, REPORT_BARSHA.id),
    fetchReport(REPORT_JBR.oldName, REPORT_JBR.id),
  ])

  console.log(`\n  Delete: ${del.name} | ${del.agent?.name} | ${money(del.sum)} AED`)
  console.log(`  Renumber: ${barsha.name} → ${REPORT_BARSHA.newName} | ${barsha.agent?.name}`)
  console.log(`  Renumber: ${jbr.name} → ${REPORT_JBR.newName} | ${jbr.agent?.name}`)

  if (del.agent?.name !== 'REFRESH BIOHACKING CLINIC L.L.C') {
    throw new Error(`01397 agent is ${del.agent?.name}, expected REFRESH — abort`)
  }

  console.log('\n  Step 1: delete 01397 (Refresh)')
  if (COMMIT) {
    await api('DELETE', `/entity/commissionreportin/${REPORT_DELETE.id}`)
  }

  console.log('  Step 2: renumber reports')
  await renameReport(barsha, REPORT_BARSHA.newName)
  await renameReport(jbr, REPORT_JBR.newName)

  console.log('  Step 3: patch demand descriptions')
  await patchDemandDesc(DEMAND_BARSHA.id, REPORT_BARSHA.oldName, REPORT_BARSHA.newName)
  await patchDemandDesc(DEMAND_JBR.id, REPORT_JBR.oldName, REPORT_JBR.newName)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  console.log('\n  Step 4: verify')
  const barshaAfter = await api('GET', `/entity/commissionreportin/${REPORT_BARSHA.id}`)
  const jbrAfter = await api('GET', `/entity/commissionreportin/${REPORT_JBR.id}`)
  if (barshaAfter.name !== '01397' || jbrAfter.name !== '01398') {
    throw new Error(`Renumber failed: got ${barshaAfter.name}, ${jbrAfter.name}`)
  }
  console.log(`    Barsha report: ${barshaAfter.name} | ${money(barshaAfter.sum)} AED`)
  console.log(`    JBR report: ${jbrAfter.name} | ${money(jbrAfter.sum)} AED`)

  console.log('\n  Step 5: re-export sales PDFs')
  const pdfBarsha = await exportReportPdf(
    REPORT_BARSHA.id,
    '01397',
    'GENOSYS_ARFI_Nails_Barsha_Consignment_Sales'
  )
  const pdfJbr = await exportReportPdf(
    REPORT_JBR.id,
    '01398',
    'GENOSYS_ARFI_Nails_Jumeirah_Consignment_Sales'
  )
  if (pdfBarsha) console.log(`    ${pdfBarsha}`)
  if (pdfJbr) console.log(`    ${pdfJbr}`)

  console.log(`\n  Barsha report: https://online.moysklad.ru/app/#commissionreport/edit?id=${REPORT_BARSHA.id}`)
  console.log(`  JBR report:    https://online.moysklad.ru/app/#commissionreport/edit?id=${REPORT_JBR.id}`)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
