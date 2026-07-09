#!/usr/bin/env node

/**
 * Export Genosys Consignment Stock Note PDF for an existing Melanta demand + print.
 *
 *   node --import dotenv/config scripts/moysklad-export-melanta-consignment-stock-note.js 06361
 *   node --import dotenv/config scripts/moysklad-export-melanta-consignment-stock-note.js 06361 --no-print
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync, spawnSync } = require('child_process')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const NO_PRINT = process.argv.includes('--no-print')
const demandRef = process.argv.find((a) => !a.startsWith('-') && !a.endsWith('.js') && a !== process.argv[0] && a !== process.argv[1])

if (!demandRef) {
  console.error('Usage: node scripts/moysklad-export-melanta-consignment-stock-note.js <demand-name-or-id>')
  process.exit(1)
}

const STOCK_NOTE_TEMPLATE_ID = '09ef2604-4a14-4571-bc17-dc266c9190c3'

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
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${pathStr} — ${text.slice(0, 800)}`)
  return text ? JSON.parse(text) : null
}

async function resolveDemand(ref) {
  if (/^[0-9a-f-]{36}$/i.test(ref)) {
    return api('GET', `/entity/demand/${ref}`)
  }
  const data = await api('GET', `/entity/demand?filter=name=${encodeURIComponent(ref)}&limit=1`)
  const row = data?.rows?.[0]
  if (!row) throw new Error(`Demand not found: ${ref}`)
  return row
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
    throw new Error(`Export expected 302/303, got ${res.status}: ${t.slice(0, 500)}`)
  }

  const location = res.headers.get('location')
  if (!location) throw new Error('Export response missing Location header')

  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

function defaultPdfPath(demandName) {
  const safe = String(demandName || 'demand').replace(/[^\w.-]+/g, '_')
  const desktop = path.join(os.homedir(), 'Desktop')
  if (fs.existsSync(desktop)) {
    return path.join(desktop, `GENOSYS_Melanta_${safe}_Consignment_Stock_Note.pdf`)
  }
  return path.join(os.tmpdir(), `GENOSYS_Melanta_${safe}_Consignment_Stock_Note.pdf`)
}

function sendPdfToPrint(pdfPath) {
  if (process.platform !== 'darwin') {
    console.log(`  PDF saved (non-macOS): open manually → ${pdfPath}`)
    return
  }

  const whichLp = spawnSync('which', ['lp'], { encoding: 'utf8' })
  if (whichLp.status === 0 && whichLp.stdout.trim()) {
    try {
      execFileSync('lp', [pdfPath], { stdio: 'inherit' })
      console.log('  Sent to default printer (lp).')
      return
    } catch (e) {
      console.warn('  lp failed, opening PDF:', e.message)
    }
  }

  execFileSync('open', [pdfPath], { stdio: 'inherit' })
  console.log('  Opened PDF in default app — use File → Print if needed.')
}

async function main() {
  console.log('  Melanta — Consignment Stock Note PDF export')
  const demand = await resolveDemand(demandRef)
  console.log(`  Demand: ${demand.name} | ${(demand.sum / 100).toFixed(2)} AED`)
  console.log(`  https://online.moysklad.ru/app/#demand/edit?id=${demand.id}`)

  console.log('\n  Exporting PDF...')
  const pdfBuf = await exportStockNotePdf(demand.id)
  const outPath = defaultPdfPath(demand.name)
  fs.writeFileSync(outPath, pdfBuf)
  console.log(`  Saved: ${outPath} (${pdfBuf.length} bytes)`)

  if (!NO_PRINT) sendPdfToPrint(outPath)
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
