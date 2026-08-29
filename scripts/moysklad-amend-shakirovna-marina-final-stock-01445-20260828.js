#!/usr/bin/env node

/**
 * Amend Shakirovna Marina final physical stock report 01445 from salon count.
 *
 *   54458 Moisture Cream: 6 -> 5
 *   00195 Moisture Serum: 0 -> 1
 *   54464 Cushion #3 Camel: 2 -> 1
 *   00144 Cushion #2 Beige: stays 5
 *   00041 SPF40: 5 -> 4
 *   00040 Intensive Blemish: 9 -> 10
 *
 *   node --import dotenv/config scripts/moysklad-amend-shakirovna-marina-final-stock-01445-20260828.js
 *   node --import dotenv/config scripts/moysklad-amend-shakirovna-marina-final-stock-01445-20260828.js --commit
 */

const fs = require('fs')
const os = require('os')
const path = require('path')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const REPORT = {
  id: '5323fe95-a218-11f1-0a80-0f55002bc10b',
  name: '01445',
}
const AGENT_ID = '93775ae5-d18d-11ea-0a80-02e00008417d'
const CONTRACT_ID = 'f5a1958d-c3ca-11eb-0a80-048e0027cbcb'
const TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const EXPECTED_SUM_MINOR = 2358600

const TARGET = {
  '54458': 5,
  '00195': 1,
  '54464': 1,
  '00144': 5,
  '00041': 4,
  '00040': 10,
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
      await new Promise((resolve) => setTimeout(resolve, 800 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 1200)}`)
    return text ? JSON.parse(text) : null
  } catch (error) {
    if (attempt < 5 && (error.message === 'fetch failed' || error.cause?.code === 'ECONNRESET')) {
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempt))
      return api(method, pathStr, body, attempt + 1)
    }
    throw error
  }
}

function href(type, id) {
  return { meta: { href: `${API}/entity/${type}/${id}`, type, mediaType: 'application/json' } }
}

function money(minor) {
  return ((minor || 0) / 100).toFixed(2)
}

async function fetchPositions() {
  const data = await api(
    'GET',
    `/entity/commissionreportin/${REPORT.id}/positions?limit=100&expand=assortment`,
  )
  return data.rows || []
}

function positionPayload(position, quantity) {
  return {
    meta: position.meta,
    quantity,
    price: position.price,
    reward: position.reward ?? 0,
    assortment: { meta: position.assortment.meta },
    vat: position.vat,
    vatEnabled: position.vatEnabled,
  }
}

async function exportPdf() {
  const body = {
    template: {
      meta: {
        href: `${API}/entity/commissionreportin/metadata/customtemplate/${TEMPLATE_ID}`,
        type: 'customtemplate',
        mediaType: 'application/json',
      },
    },
    extension: 'pdf',
  }
  const response = await fetch(`${API}/entity/commissionreportin/${REPORT.id}/export`, {
    method: 'POST',
    headers: { Authorization: AUTH, Accept: '*/*', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    redirect: 'manual',
  })
  if (response.status !== 302 && response.status !== 303) {
    throw new Error(`PDF export HTTP ${response.status}: ${(await response.text()).slice(0, 600)}`)
  }
  const location = response.headers.get('location')
  if (!location) throw new Error('PDF export missing Location')
  const pdfResponse = await fetch(location)
  if (!pdfResponse.ok) throw new Error(`PDF download HTTP ${pdfResponse.status}`)
  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const outPath = path.join(ORDERS_DIR, 'GENOSYS_Shakirovna_Marina_Final_Stock_Report_01445.pdf')
  fs.writeFileSync(outPath, Buffer.from(await pdfResponse.arrayBuffer()))
  return outPath
}

async function main() {
  console.log('====================================================================')
  console.log('  Shakirovna Marina — correct final stock report 01445')
  console.log('====================================================================')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)

  const report = await api(
    'GET',
    `/entity/commissionreportin/${REPORT.id}?expand=agent,contract,state`,
  )
  if (report.name !== REPORT.name) throw new Error(`Expected report ${REPORT.name}, got ${report.name}`)
  if (report.agent?.id !== AGENT_ID) throw new Error(`Unexpected agent: ${report.agent?.name}`)
  if (report.contract?.id !== CONTRACT_ID) throw new Error(`Unexpected contract: ${report.contract?.name}`)
  if ((report.payedSum || 0) !== 0) throw new Error(`Report has payment: ${money(report.payedSum)} AED`)

  const positions = await fetchPositions()
  const byCode = new Map(positions.map((position) => [position.assortment.code, position]))
  const serumData = await api('GET', '/entity/assortment?filter=code=00195&limit=5&stockMode=all')
  const serum = (serumData.rows || []).find((item) => item.code === '00195' && !item.archived)
  if (!serum) throw new Error('Moisture Serum 00195 not found')

  console.log(`  Report: ${report.name} | ${money(report.sum)} AED | ${report.state?.name}`)
  for (const [code, target] of Object.entries(TARGET)) {
    const current = byCode.get(code)?.quantity || 0
    console.log(`    ${code}: ${current} -> ${target}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  for (const [code, target] of Object.entries(TARGET)) {
    const position = byCode.get(code)
    if (position) {
      if (Number(position.quantity) !== target) {
        await api(
          'PUT',
          `/entity/commissionreportin/${REPORT.id}/positions/${position.id}`,
          positionPayload(position, target),
        )
      }
      continue
    }
    if (code !== '00195') throw new Error(`Cannot add unexpected missing line ${code}`)
    await api('POST', `/entity/commissionreportin/${REPORT.id}/positions`, {
      quantity: target,
      price: 16500,
      reward: 0,
      assortment: href('product', serum.id),
      vat: 5,
      vatEnabled: true,
    })
  }

  const [updated, updatedPositions] = await Promise.all([
    api('GET', `/entity/commissionreportin/${REPORT.id}`),
    fetchPositions(),
  ])
  const updatedByCode = new Map(updatedPositions.map((position) => [position.assortment.code, position]))
  for (const [code, target] of Object.entries(TARGET)) {
    const actual = Number(updatedByCode.get(code)?.quantity || 0)
    if (actual !== target) throw new Error(`Verification failed ${code}: ${actual} != ${target}`)
  }
  if (updated.sum !== EXPECTED_SUM_MINOR) {
    throw new Error(`Sum ${money(updated.sum)} != expected ${money(EXPECTED_SUM_MINOR)}`)
  }

  const pdfPath = await exportPdf()
  console.log(`\n  Updated: ${updated.name} | ${money(updated.sum)} AED`)
  console.log(`  PDF: ${pdfPath}`)
  console.log(`  https://online.moysklad.ru/app/#commissionreport/edit?id=${REPORT.id}`)
}

main().catch((error) => {
  console.error('FATAL:', error.message)
  process.exit(1)
})
