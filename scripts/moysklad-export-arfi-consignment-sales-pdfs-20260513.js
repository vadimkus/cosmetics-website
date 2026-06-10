#!/usr/bin/env node

/**
 * Export + print MoySklad **consignment sales** PDFs for ARFI commissioner reports 01355 / 01356
 * (template: Invoice_Consignment_Sales_Genosys → server uses *_CLEAN build in print filename).
 *
 *   node --import dotenv/config scripts/moysklad-export-arfi-consignment-sales-pdfs-20260513.js
 *   node --import dotenv/config scripts/moysklad-export-arfi-consignment-sales-pdfs-20260513.js --no-print
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

/** GET …/entity/commissionreportin/metadata/customtemplate — Invoice_Consignment_Sales_Genosys */
const CONSIGNMENT_SALES_TEMPLATE_ID = '9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede'

const DOCS = [
  {
    label: 'Barsha',
    id: 'd0c40651-4ee3-11f1-0a80-188400230f01',
    moyskladName: '01355',
  },
  {
    label: 'Jumeirah',
    id: 'd1c232fe-4ee3-11f1-0a80-14520022dc20',
    moyskladName: '01356',
  },
]

async function exportCommissionSalesPdf(reportId) {
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
    headers: {
      Authorization: AUTH,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    redirect: 'manual',
  })

  if (res.status === 412) {
    const t = await res.text()
    throw new Error(`Export 412: ${t.slice(0, 600)}`)
  }
  if (res.status !== 303 && res.status !== 302) {
    const t = await res.text()
    throw new Error(`Export expected 302/303, got ${res.status}: ${t.slice(0, 600)}`)
  }
  const location = res.headers.get('location')
  if (!location) throw new Error('Export missing Location')

  const pdfRes = await fetch(location)
  if (!pdfRes.ok) throw new Error(`PDF download HTTP ${pdfRes.status}`)
  return Buffer.from(await pdfRes.arrayBuffer())
}

function desktopPath(label, docName) {
  const desktop = path.join(os.homedir(), 'Desktop')
  const dir = fs.existsSync(desktop) ? desktop : os.tmpdir()
  const safe = `GENOSYS_ARFI_Nails_${label}_Consignment_Sales_${docName}.pdf`.replace(/\s+/g, '_')
  return path.join(dir, safe)
}

function sendPdfToPrint(pdfPath) {
  if (process.platform !== 'darwin') {
    console.log(`  (non-macOS) PDF: ${pdfPath}`)
    return
  }
  const whichLp = spawnSync('which', ['lp'], { encoding: 'utf8' })
  if (whichLp.status === 0 && whichLp.stdout.trim()) {
    try {
      execFileSync('lp', [pdfPath], { stdio: 'inherit' })
      console.log('    Sent to default printer (lp).')
      return
    } catch (e) {
      console.warn('    lp failed:', e.message)
    }
  }
  execFileSync('open', [pdfPath], { stdio: 'inherit' })
}

async function main() {
  console.log('====================================================================')
  console.log('  ARFI — export consignment sales PDF (commission reports)')
  console.log('====================================================================')

  for (const doc of DOCS) {
    console.log(`\n  ${doc.label} (${doc.moyskladName}) …`)
    const buf = await exportCommissionSalesPdf(doc.id)
    const out = desktopPath(doc.label, doc.moyskladName)
    fs.writeFileSync(out, buf)
    console.log(`    Saved: ${out} (${buf.length} bytes)`)
    if (!NO_PRINT) sendPdfToPrint(out)
  }

  console.log('\n  Done.')
}

main().catch((e) => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
