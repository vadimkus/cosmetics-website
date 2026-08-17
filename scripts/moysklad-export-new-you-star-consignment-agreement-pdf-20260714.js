#!/usr/bin/env node

/**
 * Re-export NEW YOU STAR consignment agreement PDF with Header.png + Stamp.png
 *
 *   node scripts/moysklad-export-new-you-star-consignment-agreement-pdf-20260714.js
 *   node scripts/moysklad-export-new-you-star-consignment-agreement-pdf-20260714.js --open
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync } = require('child_process')
const { exportConsignmentAgreementPdf } = require('./lib/export-consignment-agreement-pdf')

const AGREEMENT_NO = '37'
const CONTRACT_FOLDER = path.join(
  os.homedir(),
  'Desktop/Drive/Genosys/Contract_Customers/New_YOU_STAR'
)
const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const MD_PATH = path.join(CONTRACT_FOLDER, `Genosys_Consignment_Agreement_NEW_YOU_STAR_${AGREEMENT_NO}.md`)
const HTML_PATH = path.join(CONTRACT_FOLDER, `Genosys_Consignment_Agreement_NEW_YOU_STAR_${AGREEMENT_NO}.html`)
const PDF_CONTRACT = path.join(CONTRACT_FOLDER, `Genosys_Consignment_Agreement_NEW_YOU_STAR_${AGREEMENT_NO}.pdf`)
const PDF_ORDERS = path.join(ORDERS_DIR, `GENOSYS_NEW_YOU_STAR_Consignment_Agreement_${AGREEMENT_NO}.pdf`)
const HEADER_PATH = path.join(ORDERS_DIR, 'Header.png')
const STAMP_PATH = path.join(ORDERS_DIR, 'Stamp.png')
const OPEN = process.argv.includes('--open')

function main() {
  if (!fs.existsSync(MD_PATH)) {
    throw new Error(`Missing agreement markdown: ${MD_PATH}`)
  }
  if (!fs.existsSync(HEADER_PATH)) {
    throw new Error(`Missing header image: ${HEADER_PATH}`)
  }
  if (!fs.existsSync(STAMP_PATH)) {
    throw new Error(`Missing stamp image: ${STAMP_PATH}`)
  }

  const result = exportConsignmentAgreementPdf({
    mdPath: MD_PATH,
    htmlPath: HTML_PATH,
    pdfPaths: [PDF_CONTRACT, PDF_ORDERS],
    headerPath: HEADER_PATH,
    stampPath: STAMP_PATH,
  })

  for (const pdf of result.pdfPaths) {
    console.log(`PDF: ${pdf} (${fs.statSync(pdf).size} bytes)`)
  }
  console.log(`HTML: ${result.htmlPath}`)
  console.log(`Header: ${result.headerUsed ? 'yes' : 'no'} | Stamp: ${result.stampUsed ? 'yes' : 'no'}`)

  if (OPEN && process.platform === 'darwin') {
    execFileSync('open', [PDF_ORDERS], { stdio: 'inherit' })
  }
}

main()
