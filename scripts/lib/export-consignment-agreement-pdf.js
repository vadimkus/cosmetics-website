const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const DEFAULT_CSS = path.join(__dirname, '../../docs/reference/consignment-agreement-pdf-2page.css')
const LEGACY_CSS = path.join(__dirname, '../../docs/reference/consignment-agreement-pdf.css')

function imageDataUri(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null
  const ext = path.extname(filePath).slice(1).toLowerCase()
  const mime =
    ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png'
  return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function mdInlineToHtml(s) {
  const parts = []
  let rest = String(s ?? '')
  while (true) {
    const idx = rest.indexOf('**')
    if (idx === -1) {
      parts.push(esc(rest))
      break
    }
    parts.push(esc(rest.slice(0, idx)))
    rest = rest.slice(idx + 2)
    const end = rest.indexOf('**')
    if (end === -1) {
      parts.push(esc('**' + rest))
      break
    }
    parts.push(`<strong>${esc(rest.slice(0, end))}</strong>`)
    rest = rest.slice(end + 2)
  }
  return parts.join('')
}

/** Parse structured agreement markdown into HTML body (2-page layout). */
function parseStructuredAgreementMd(md) {
  const agreementNoMatch = md.match(/\*\*Agreement No\.\s*([^*]+)\*\*/)
  const agreementNo = agreementNoMatch ? agreementNoMatch[1].trim() : ''

  const clauseRe = /^\*\*(\d+\.\s[^*]+)\*\*\s*(.+)$/gm
  const clauses = []
  let m
  while ((m = clauseRe.exec(md)) !== null) {
    clauses.push({ title: m[1].trim(), body: m[2].trim() })
  }

  let consigneeName = ''
  let clinicLine = ''
  let phone = ''
  let contact = ''
  let licenseLines = ''
  let trn = ''

  const c2 =
    md.match(
      /\*\*\(2\)\s+([^*]+)\*\*[\s\S]*?clinic\s+\*\*([^*]+)\*\*;\s+tel\.\s+\/\s+WhatsApp\s+\*\*([^*]+)\*\*;\s+contact\s+\*\*([^*]+)\*\*[^;]*;\s+([^;]+;\s*[^;]+);\s+TRN\s+\*\*([^*]+)\*\*/
    ) ||
    md.match(
      /\*\*([^*]+)\*\*\s+\("Consignee"\)\s+—\s+clinic\s+\*\*([^*]+)\*\*;\s+tel\.\s+\/\s+WhatsApp\s+\*\*([^*]+)\*\*;\s+contact\s+\*\*([^*]+)\*\*[^;]*;\s+([^;]+;\s*[^;]+);\s+TRN\s+\*\*([^*]+)\*\*/
    ) ||
    // Single license line (e.g. DET only, no DHA)
    md.match(
      /\*\*\(2\)\s+([^*]+)\*\*[\s\S]*?clinic\s+\*\*([^*]+)\*\*;\s+tel\.\s+\/\s+WhatsApp\s+\*\*([^*]+)\*\*;\s+contact\s+\*\*([^*]+)\*\*[^;]*;\s+([^;]+);\s+TRN\s+\*\*([^*]+)\*\*/
    )

  if (c2) {
    consigneeName = c2[1].trim()
    clinicLine = c2[2].trim()
    phone = c2[3].trim()
    contact = c2[4].trim()
    licenseLines = c2[5].trim()
    trn = c2[6].trim()
  }

  const dateMatch = md.match(/\*\*(\d{1,2}\s+\w+\s+\d{4})\*\*/)
  const effectiveDate = dateMatch ? dateMatch[1] : ''

  const introMatch = md.match(
    /Consignor is the authorised UAE distributor[\s\S]*?attached to this Agreement\)\./
  )
  const intro = introMatch ? introMatch[0] : ''

  const sigConsigneeMatch = md.match(/\*\*Consignee — ([^*]+)\*\*[\s\S]*?Name: \*\*([^*]+)\*\*/)
  const sigConsigneeTitle =
    md.match(/Consignee[\s\S]*?Title: ([^\n]+)/)?.[1]?.replace(/\*\*/g, '').trim() ||
    'Owner / Manager / Authorised Signatory'
  const sigConsigneeName = sigConsigneeMatch ? sigConsigneeMatch[2].trim() : contact

  const clauseHtml = (c) =>
    `<div class="clause"><h2>${esc(c.title)}</h2><p>${mdInlineToHtml(c.body)}</p></div>`

  const page1Clauses = clauses.slice(0, 3).map(clauseHtml).join('\n')
  const page2Clauses = clauses.slice(3).map(clauseHtml).join('\n')

  return `
<h1>CONSIGNMENT AGREEMENT</h1>
<div class="doc-meta"><strong>Agreement No. ${esc(agreementNo)}</strong> · <strong>${esc(effectiveDate)}</strong> · United Arab Emirates</div>

<div class="parties-grid">
  <div class="party-box">
    <h3>Consignor</h3>
    <p class="name">Genosys Middle East FZ-LLC</p>
    <p>RAKEZ License <strong>5023192</strong></p>
    <p>TRN <strong>104229886700003</strong></p>
    <p>Compass Coworking Centre, Al Shohada Road, Al Jazeera, Al Hamra, Ras Al Khaimah, UAE</p>
    <p>sales@genosys.ae · +971 58 548 7665</p>
  </div>
  <div class="party-box">
    <h3>Consignee</h3>
    <p class="name">${esc(consigneeName)}</p>
    <p>${esc(clinicLine)}</p>
    <p>Tel / WhatsApp: <strong>${esc(phone)}</strong></p>
    <p>Contact: <strong>${esc(contact)}</strong></p>
    <p>${mdInlineToHtml(licenseLines)}</p>
    <p>TRN <strong>${esc(trn)}</strong></p>
  </div>
</div>

<p class="intro">${mdInlineToHtml(intro)}</p>

${page1Clauses}

<div class="page-break"></div>
<div class="page-continued">Consignment Agreement No. ${esc(agreementNo)} — continued</div>

${page2Clauses}

<div class="signatures">
  <div class="sigcol">
    <p class="sig-title">Consignor — Genosys Middle East FZ-LLC</p>
    <p class="sig-line"><span class="label">Name:</span> <strong>Vadim Sagatdinov</strong></p>
    <p class="sig-line"><span class="label">Title:</span> General Manager / Authorised Signatory</p>
    <p class="sig-line"><span class="label">Signature:</span> _________________________</p>
    <p class="sig-line"><span class="label">Date:</span> _________________________</p>
    <div class="stamp-slot"></div>
  </div>
  <div class="sigcol">
    <p class="sig-title">Consignee — ${esc(consigneeName)}</p>
    <p class="sig-line"><span class="label">Name:</span> <strong>${esc(sigConsigneeName)}</strong></p>
    <p class="sig-line"><span class="label">Title:</span> ${esc(sigConsigneeTitle)}</p>
    <p class="sig-line"><span class="label">Signature:</span> _________________________</p>
    <p class="sig-line"><span class="label">Date:</span> _________________________</p>
    <p class="sig-line"><span class="label">Stamp (if any):</span> _________________________</p>
  </div>
</div>

<p class="doc-footer">Genosys Middle East FZ-LLC · License 5023192 · TRN 104229886700003 · sales@genosys.ae · www.genosys.ae</p>
`
}

function mdToHtmlBody(mdPath) {
  const md = fs.readFileSync(mdPath, 'utf8')
  if (md.includes('**1. Appointment.**') && md.includes('**Parties.**')) {
    return parseStructuredAgreementMd(md)
  }
  return execFileSync('pandoc', [mdPath, '-f', 'markdown', '-t', 'html'], { encoding: 'utf8' })
}

function injectStamp(html, stampDataUri) {
  if (!stampDataUri) return html
  const stampBlock = `<div class="stamp-wrap"><img class="stamp" src="${stampDataUri}" alt="Genosys company seal" /></div>`
  if (html.includes('stamp-slot')) {
    return html.replace('<div class="stamp-slot"></div>', stampBlock)
  }
  const consignorSig =
    /(<div class="sigcol">[\s\S]*?Consignor — Genosys Middle East FZ-LLC[\s\S]*?Date: _________________________<\/p>)(\s*<\/div>)/
  if (consignorSig.test(html)) {
    return html.replace(consignorSig, `$1\n${stampBlock}$2`)
  }
  return `${html}\n${stampBlock}`
}

function wrapAgreementHtml(bodyHtml, { headerDataUri, stampDataUri, cssPath = DEFAULT_CSS }) {
  const cssFile = cssPath && fs.existsSync(cssPath) ? cssPath : DEFAULT_CSS
  const css = fs.readFileSync(cssFile, 'utf8')
  const headerBlock = headerDataUri
    ? `<div class="doc-header"><img src="${headerDataUri}" alt="Genosys Middle East FZ-LLC" /></div>\n`
    : ''
  const body = injectStamp(bodyHtml, stampDataUri)
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Consignment Agreement</title>
<style>${css}</style>
</head>
<body>
${headerBlock}${body}
</body>
</html>`
}

function htmlToPdf(htmlPath, pdfPath) {
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  if (!fs.existsSync(chrome)) throw new Error('Google Chrome required for agreement PDF')
  execFileSync(
    chrome,
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
}

/**
 * @param {object} opts
 * @param {string} opts.mdPath
 * @param {string[]} opts.pdfPaths
 * @param {string} [opts.htmlPath]
 * @param {string} [opts.headerPath]
 * @param {string} [opts.stampPath]
 * @param {string} [opts.cssPath]
 */
function exportConsignmentAgreementPdf(opts) {
  const { mdPath, pdfPaths, htmlPath, headerPath, stampPath, cssPath } = opts
  if (!fs.existsSync(mdPath)) throw new Error(`Missing markdown: ${mdPath}`)

  const headerDataUri = imageDataUri(headerPath)
  const stampDataUri = imageDataUri(stampPath)
  const bodyHtml = mdToHtmlBody(mdPath)
  const html = wrapAgreementHtml(bodyHtml, { headerDataUri, stampDataUri, cssPath })

  const htmlOut = htmlPath || mdPath.replace(/\.md$/i, '.html')
  fs.writeFileSync(htmlOut, html)

  const written = []
  for (const pdfPath of pdfPaths) {
    fs.mkdirSync(path.dirname(pdfPath), { recursive: true })
    htmlToPdf(htmlOut, pdfPath)
    written.push(pdfPath)
  }

  return {
    htmlPath: htmlOut,
    pdfPaths: written,
    headerUsed: Boolean(headerDataUri),
    stampUsed: Boolean(stampDataUri),
  }
}

module.exports = {
  exportConsignmentAgreementPdf,
  imageDataUri,
  wrapAgreementHtml,
  parseStructuredAgreementMd,
  DEFAULT_CSS,
  LEGACY_CSS,
}
