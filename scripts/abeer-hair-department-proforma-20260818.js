/**
 * GENOSYS Hair Treatment Department — clinic proforma for Abeer Mekki
 * Output: ~/Desktop/orders/GENOSYS_Abeer_Hair_Treatment_Department_Proforma.pdf
 */
const fs = require('fs')
const path = require('path')
const os = require('os')

const ORDERS = path.join(os.homedir(), 'Desktop', 'orders')
const HEADER = `data:image/png;base64,${fs.readFileSync(path.join(ORDERS, 'Header.png')).toString('base64')}`

const css = `
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; font-size: 9pt; line-height: 1.32; }
  .page { width: 210mm; height: 296.5mm; page-break-after: always; position: relative; padding: 60mm 13mm 16mm 13mm; overflow: hidden; background: #fff; }
  .page:last-child { page-break-after: auto; }
  .letterhead { position: absolute; top: 0; left: 0; width: 210mm; }
  .letterhead img { width: 100%; display: block; }
  h1 { font-family: Georgia, 'Times New Roman', serif; font-size: 16.5pt; color: #12355B; font-weight: 700; line-height: 1.12; }
  h2.sec { font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; color: #fff; background: #12355B; padding: 1.4mm 3mm; margin: 2.2mm 0 0 0; }
  h2.sec.alt { background: #2E7D82; }
  .page > h2.sec:first-child { margin-top: 0; }
  .exhibit { font-size: 7.6pt; letter-spacing: 1.6px; text-transform: uppercase; color: #2E7D82; font-weight: 700; margin-bottom: 0.8mm; }
  .rule { border: none; border-top: 2.5px solid #12355B; margin: 1.6mm 0 2.2mm 0; }
  .cover-meta { font-size: 9pt; color: #44576b; margin: 1.4mm 0 2mm 0; }
  .lead { font-size: 9.3pt; line-height: 1.35; color: #1f2f42; border-left: 4px solid #2E7D82; padding: 1.5mm 0 1.5mm 4mm; margin: 0 0 2mm 0; }
  table.list { width: 100%; border-collapse: collapse; }
  table.list th { background: #EAF4F4; color: #12355B; font-size: 6.8pt; letter-spacing: .25px; text-transform: uppercase; text-align: left; padding: 1.2mm 1.6mm; border-bottom: 1px solid #C9D3E0; }
  table.list th.n { text-align: right; }
  table.list td { border-bottom: 1px solid #E3E9F0; padding: 1.15mm 1.6mm; vertical-align: middle; }
  table.list td.n { text-align: right; font-variant-numeric: tabular-nums; font-weight: 700; color: #12355B; }
  table.list td.c { text-align: center; color: #5b6b7c; }
  table.list a { color: #12355B; text-decoration: none; font-weight: 700; }
  table.list .spec { font-size: 7.6pt; color: #5b6b7c; font-weight: 400; }
  table.list tr.tot td { background: #F4F6F9; font-weight: 700; color: #12355B; border-bottom: none; }
  table.stages { width: 100%; border-collapse: collapse; margin-top: 2mm; }
  table.stages th, table.stages td { border: 1px solid #D8E0EA; padding: 1.8mm 2.2mm; }
  table.stages th { background: #12355B; color: #fff; font-size: 8pt; text-align: left; }
  table.stages td.a { background: #EAF4F4; font-weight: 700; color: #12355B; text-align: right; }
  table.stages td.n { text-align: right; font-weight: 700; color: #12355B; }
  .sum { margin-top: 2.5mm; background: #EAF4F4; border-left: 4px solid #2E7D82; padding: 2.2mm 3.5mm; font-size: 10pt; }
  .sum strong { color: #12355B; }
  .footer { position: absolute; bottom: 5.5mm; left: 13mm; right: 13mm; font-size: 7.2pt; color: #7a8896; border-top: 1px solid #E3E9F0; padding-top: 1.4mm; }
  .source { font-size: 7.3pt; color: #7a8896; margin-top: 2mm; }
`

const img = (src) => `<img src="${src}" />`

function page(inner) {
  return `<div class="page">
    <div class="letterhead">${img(HEADER)}</div>
    ${inner}
    <div class="footer">Genosys Middle East FZ-LLC · Official UAE Distributor · sales@genosys.ae · +971 58 548 7665 · www.genosys.ae &nbsp;|&nbsp; Clinic AED, VAT included · Abeer Mekki · Al Ain · 18 August 2026</div>
  </div>`
}

function money(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function rows(items) {
  return items
    .map(([name, spec, qty, unit, id]) => {
      const line = qty * unit
      const title = id
        ? `<a href="https://genosys.ae/products/${id}">${name}</a>`
        : `<span style="font-weight:700;color:#12355B">${name}</span>`
      return `<tr>
        <td>${title}<br/><span class="spec">${spec}</span></td>
        <td class="c">${qty}</td>
        <td class="n">${money(unit)}</td>
        <td class="n">${money(line)}</td>
      </tr>`
    })
    .join('')
}

function table(items, total) {
  return `<table class="list">
    <tr><th>Product · tap name to open page</th><th class="n">Qty</th><th class="n">Clinic AED</th><th class="n">Line</th></tr>
    ${rows(items)}
    <tr class="tot"><td colspan="3">Section total</td><td class="n">${money(total)}</td></tr>
  </table>`
}

const devices = [
  ['HairGen BOOSTER', 'Clinic LED / high-frequency hair device', 1, 1800, '3'],
  ['Hair-GENTRON', 'Clinic hair device, 5–6 V DC', 1, 3300, '48'],
  ['Hair stamps for HairGen BOOSTER', '8 stamps per box · 1 stamp per HairGen session', 3, 370, '64'],
]

const professional = [
  ['HR³ Matrix Hair Solution', 'Clinic box · 5 ml × 8 vials', 5, 370, '45'],
  ['HR³ Matrix Scalp Peeling α', '100 ml · clinic use', 4, 145, '46'],
  ['HR³ Matrix Hair Tonic α', '70 ml · clinic use', 4, 145, '43'],
  ['HR³ Matrix Scalp & Hair Shampoo', '300 ml · clinic use', 3, 170, '44'],
  ['HR³ Matrix Mesopecia Kit', 'Stamp / roller system · CHS × 6 + peeling + droppers', 2, 550, '47'],
  ['Droppers', '5 pcs sterile, for solutions', 2, 10, null],
  ['HR³ Matrix Scalp Brush', 'Clinic tool', 2, 50, '61'],
]

const retail = [
  ['HR³ Matrix Scalp & Hair Shampoo', '300 ml · patient take-home', 6, 170, '44'],
  ['HR³ Matrix Hair Tonic α', '70 ml · patient take-home', 6, 145, '43'],
  ['HR³ Matrix Scalp Peeling α', '100 ml · patient take-home', 4, 145, '46'],
  ['HR³ Matrix Hair Solution α Homecare', '8 ampoules + applicator + brush + jar', 4, 450, '45'],
  ['HR³ Matrix Scalp Brush', 'Patient take-home', 6, 50, '61'],
]

const dTot = 6210
const pTot = 4740
const rTot = 4570
const all = 15520

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>

${page(`
  <div class="exhibit">Clinic proforma · Hair department</div>
  <h1>GENOSYS Hair Treatment Department</h1>
  <div class="cover-meta">Prepared for <strong>Abeer Mekki Beauty Ladies Center</strong> · Al Ain · 18 August 2026<br/>Clinic AED, VAT included · Official UAE clinic list 2026</div>
  <hr class="rule"/>
  <p class="lead">Complete initial investment to open the department. Stock covers about <strong>40 clinic treatments</strong> (5 patients × 8-session course), plus a starter retail shelf. Product names open genosys.ae.</p>

  <h2 class="sec">1 · Devices (one time)</h2>
  ${table(devices, dTot)}

  <h2 class="sec alt">2 · Professional HR³ + tools</h2>
  ${table(professional, pTot)}
  <p class="source">HairGen BOOSTER and Hair-GENTRON are the two devices in the protocol. Mesopecia Kit is the stamp / roller system. One stamp + one Hair Solution vial per HairGen session.</p>
`)}

${page(`
  <h2 class="sec">3 · Retail starter for patients</h2>
  ${table(retail, rTot)}
  <p class="lead" style="margin-top:3mm">Home care during the course. Without it the clinic programme gives only part of the result. Patients buy these to use between visits.</p>

  <h2 class="sec alt">Investment</h2>
  <table class="stages">
    <tr><th>Option</th><th>What it includes</th><th>Clinic AED</th></tr>
    <tr><td>Stage 1</td><td>Devices + professional stock — department can treat</td><td class="n">${money(dTot + pTot)}</td></tr>
    <tr><td>Stage 2</td><td>Retail shelf for patients</td><td class="n">${money(rTot)}</td></tr>
    <tr><td class="a">Complete department</td><td class="a">Stage 1 + Stage 2</td><td class="a">${money(all)}</td></tr>
  </table>

  <div class="sum">Complete department: <strong>${money(all)} AED</strong><br/>Stage 1 only: <strong>${money(dTot + pTot)} AED</strong> &nbsp;·&nbsp; Stage 2 only: <strong>${money(rTot)} AED</strong></div>
  <p class="source">Prices from GENOSYS UAE Price List Clinics 2026. Delivery to Al Ain is added on the sales order when you confirm complete or Stage 1. This sheet is a proforma, not an invoice. Official distributor — Genosys Middle East FZ-LLC.</p>
`)}

</body></html>`

const outHtml = path.join(ORDERS, 'GENOSYS_Abeer_Hair_Treatment_Department_Proforma.html')
const outPdf = path.join(ORDERS, 'GENOSYS_Abeer_Hair_Treatment_Department_Proforma.pdf')
fs.writeFileSync(outHtml, html)

async function main() {
  const { chromium } = require('playwright')
  const browser = await chromium.launch()
  const pageObj = await browser.newPage()
  await pageObj.setViewportSize({ width: 794, height: 1123 })
  await pageObj.setContent(html, { waitUntil: 'load' })
  await pageObj.pdf({
    path: outPdf,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  })
  const measure = await pageObj.evaluate(() => {
    return [...document.querySelectorAll('.page')].map((p, i) => {
      const pr = p.getBoundingClientRect()
      const header = p.querySelector('.letterhead img').getBoundingClientRect()
      const first = p.querySelector('h1, h2.sec').getBoundingClientRect()
      const extras = [...p.querySelectorAll('.source, .lead, .sum, tr')]
      const last = extras[extras.length - 1].getBoundingClientRect()
      const footer = p.querySelector('.footer').getBoundingClientRect()
      return {
        page: i + 1,
        titleClear: first.top >= header.bottom - 2,
        gap: Math.round(footer.top - last.bottom),
        overlap: last.bottom > footer.top - 6,
      }
    })
  })
  await browser.close()
  console.log(JSON.stringify({ ok: true, outPdf, measure }))
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
