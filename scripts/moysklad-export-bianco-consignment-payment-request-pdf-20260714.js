#!/usr/bin/env node

/**
 * Export BIANCO consignment payment request → print-ready HTML + PDF in ~/Desktop/orders/
 *
 *   node scripts/moysklad-export-bianco-consignment-payment-request-pdf-20260714.js
 *   node scripts/moysklad-export-bianco-consignment-payment-request-pdf-20260714.js --open
 */

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync, spawnSync } = require('child_process')

const { uaeToday } = require('./lib/moysklad-uae-date')

const ORDERS_DIR = path.join(os.homedir(), 'Desktop', 'orders')
const TODAY = uaeToday()
const BASE = `GENOSYS_BIANCO_Consignment_Payment_Request_${TODAY}`
const MD_PATH = path.join(ORDERS_DIR, `${BASE}.md`)
const HTML_PATH = path.join(ORDERS_DIR, `${BASE}.html`)
const PDF_PATH = path.join(ORDERS_DIR, `${BASE}.pdf`)
const STAMP_PATH = path.join(ORDERS_DIR, 'Stamp.png')
const OPEN = process.argv.includes('--open')

const PRINT_CSS = `
@page { size: A4; margin: 14mm 16mm; }
* { box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 10pt;
  color: #1a1a1a;
  line-height: 1.45;
  max-width: 190mm;
  margin: 0 auto;
  padding: 0;
}
h1 { font-size: 16pt; color: #b91c1c; border-bottom: 2px solid #b91c1c; padding-bottom: 4px; margin-top: 0; }
h2 { font-size: 13pt; color: #1a1a1a; margin-top: 18px; page-break-after: avoid; }
h3 { font-size: 11pt; margin-top: 14px; page-break-after: avoid; }
h4 { font-size: 10pt; margin-top: 10px; page-break-after: avoid; }
p { margin: 6px 0; }
table { width: 100%; border-collapse: collapse; font-size: 9pt; margin: 8px 0 12px; page-break-inside: avoid; }
th, td { border: 1px solid #ccc; padding: 4px 6px; text-align: left; vertical-align: top; }
th { background: #f5f5f5; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.3px; }
td:last-child, th:last-child { text-align: right; }
hr { border: none; border-top: 1px solid #ddd; margin: 16px 0; }
strong { font-weight: 600; }
em { color: #444; }
ul { margin: 6px 0; padding-left: 18px; }
.internal-only { display: none !important; }
.signature-stamp { margin-top: 10mm; page-break-inside: avoid; }
.signature-stamp .stamp { width: 58mm; height: auto; display: block; }
@media print {
  body { font-size: 9.5pt; }
  h3, h4 { page-break-inside: avoid; }
  table { page-break-inside: auto; }
  tr { page-break-inside: avoid; }
}
`

function stripInternalSummary(md) {
  const marker = '# Payment request letter — Bianco Group'
  const idx = md.indexOf(marker)
  if (idx === -1) return md
  return `# GENOSYS — BIANCO consignment payment request\n\n**Date:** ${TODAY}\n\n---\n\n${md.slice(idx)}`
}

function mdToHtml(md) {
  const tmpMd = path.join(os.tmpdir(), `${BASE}.md`)
  fs.writeFileSync(tmpMd, md)
  const body = execFileSync('pandoc', [tmpMd, '-f', 'markdown', '-t', 'html'], { encoding: 'utf8' })
  fs.unlinkSync(tmpMd)
  return body
}

function imageDataUri(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null
  const ext = path.extname(filePath).slice(1).toLowerCase()
  const mime =
    ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png'
  return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`
}

function injectStamp(html, stampDataUri) {
  if (!stampDataUri) return html
  const stampBlock = `<div class="signature-stamp"><img class="stamp" src="${stampDataUri}" alt="Genosys company seal" /></div>`
  const signatureEnd =
    /<p><strong>Vadim Sagatdinov<\/strong><br\s*\/?>\s*Genosys Middle East FZ-LLC<br\s*\/?>\s*sales@genosys\.ae<\/p>/
  if (signatureEnd.test(html)) {
    return html.replace(signatureEnd, (m) => `${m}\n${stampBlock}`)
  }
  return html.replace(/<hr\s*\/>/, `${stampBlock}\n<hr />`)
}

function wrapHtml(body, stampDataUri) {
  const cleaned = body.replace(
    /<h1[^>]*>GENOSYS — BIANCO consignment payment request<\/h1>[\s\S]*?<h1[^>]*>Payment request letter — Bianco Group<\/h1>/,
    '<h1>Payment request — Bianco Group</h1>'
  )
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>GENOSYS BIANCO Consignment Payment Request ${TODAY}</title>
<style>${PRINT_CSS}</style>
</head>
<body>
<div class="header-meta" style="margin-bottom:12px;font-size:9pt;color:#666;">
  Genosys Middle East FZ-LLC · Consignment payment request · ${TODAY}
</div>
${injectStamp(cleaned, stampDataUri)}
</body>
</html>`
}

function htmlToPdf(htmlPath, pdfPath) {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  if (!fs.existsSync(chromePath)) {
    throw new Error('Google Chrome not found — open HTML manually and Print → Save as PDF')
  }
  execFileSync(
    chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      `--print-to-pdf=${pdfPath}`,
      `file://${htmlPath}`,
    ],
    { stdio: 'inherit' }
  )
  return fs.existsSync(pdfPath)
}

function main() {
  if (!fs.existsSync(MD_PATH)) {
    throw new Error(`Missing source file: ${MD_PATH}\nRun moysklad-generate-bianco-consignment-payment-request-20260714.js first.`)
  }

  fs.mkdirSync(ORDERS_DIR, { recursive: true })
  const md = stripInternalSummary(fs.readFileSync(MD_PATH, 'utf8'))
  const stampDataUri = imageDataUri(STAMP_PATH)
  if (!stampDataUri) {
    console.warn(`WARN: stamp not found at ${STAMP_PATH} — PDF will export without seal`)
  }
  const html = wrapHtml(mdToHtml(md), stampDataUri)
  fs.writeFileSync(HTML_PATH, html)

  htmlToPdf(HTML_PATH, PDF_PATH)
  console.log(`HTML: ${HTML_PATH}`)
  console.log(`PDF:  ${PDF_PATH} (${fs.statSync(PDF_PATH).size} bytes)`)

  if (OPEN && process.platform === 'darwin') {
    execFileSync('open', [PDF_PATH], { stdio: 'inherit' })
  }
}

main()
