/**
 * GENOSYS /prof treatment-cost tables for Shakirovna Ladies Beauty Saloon
 * Source: https://genosys.ae/prof
 * Output: ~/Desktop/orders/GENOSYS_Shakirovna_Salon_Professional_Treatment_Costs.pdf
 */
const fs = require('fs')
const path = require('path')
const os = require('os')

const ORDERS = path.join(os.homedir(), 'Desktop', 'orders')
const HEADER = `data:image/png;base64,${fs.readFileSync(path.join(ORDERS, 'Header.png')).toString('base64')}`

const css = `
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; font-size: 8.6pt; line-height: 1.3; }
  .page { width: 210mm; height: 296.5mm; page-break-after: always; position: relative; padding: 60mm 12mm 16mm 12mm; overflow: hidden; background: #fff; }
  .page:last-child { page-break-after: auto; }
  .letterhead { position: absolute; top: 0; left: 0; width: 210mm; }
  .letterhead img { width: 100%; display: block; }
  h1 { font-family: Georgia, 'Times New Roman', serif; font-size: 16.5pt; color: #12355B; font-weight: 700; line-height: 1.12; }
  h2.sec { font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; color: #fff; background: #12355B; padding: 1.4mm 3mm; margin: 0 0 0 0; }
  h2.sec.alt { background: #2E7D82; }
  .exhibit { font-size: 7.6pt; letter-spacing: 1.6px; text-transform: uppercase; color: #2E7D82; font-weight: 700; margin-bottom: 0.8mm; }
  .rule { border: none; border-top: 2.5px solid #12355B; margin: 1.6mm 0 2.2mm 0; }
  .cover-meta { font-size: 9pt; color: #44576b; margin: 1.4mm 0 2mm 0; }
  .lead { font-size: 9.2pt; line-height: 1.35; color: #1f2f42; border-left: 4px solid #2E7D82; padding: 1.4mm 0 1.4mm 4mm; margin: 0 0 2.4mm 0; }
  table.list { width: 100%; border-collapse: collapse; }
  table.list th { background: #EAF4F4; color: #12355B; font-size: 6.6pt; letter-spacing: .2px; text-transform: uppercase; text-align: left; padding: 1.1mm 1.4mm; border-bottom: 1px solid #C9D3E0; }
  table.list th.n { text-align: right; }
  table.list td { border-bottom: 1px solid #E3E9F0; padding: 1.05mm 1.4mm; vertical-align: middle; }
  table.list td.n { text-align: right; font-variant-numeric: tabular-nums; }
  table.list td.c { text-align: center; color: #5b6b7c; font-size: 8pt; }
  table.list a { color: #12355B; text-decoration: none; font-weight: 700; }
  table.list tr.tot td { background: #F4F6F9; font-weight: 700; color: #12355B; border-bottom: none; }
  .sum { margin-top: 2.5mm; background: #EAF4F4; border-left: 4px solid #2E7D82; padding: 2mm 3.5mm; font-size: 9.3pt; }
  .sum strong { color: #12355B; }
  .footer { position: absolute; bottom: 5.5mm; left: 12mm; right: 12mm; font-size: 7.2pt; color: #7a8896; border-top: 1px solid #E3E9F0; padding-top: 1.4mm; }
  .source { font-size: 7.3pt; color: #7a8896; margin-top: 2.2mm; }
`

const img = (src) => `<img src="${src}" />`

function page(inner) {
  return `<div class="page">
    <div class="letterhead">${img(HEADER)}</div>
    ${inner}
    <div class="footer">Genosys Middle East FZ-LLC · Official UAE Distributor · sales@genosys.ae · +971 58 548 7665 · www.genosys.ae &nbsp;|&nbsp; Clinic AED, VAT included · Shakirovna Ladies Beauty Saloon · 18 August 2026</div>
  </div>`
}

function nameCell(name, id) {
  if (Array.isArray(id)) {
    const links = id
      .map(([code, pid]) => `<a href="https://genosys.ae/products/${pid}">${code}</a>`)
      .join(' / ')
    return `PRO Solutions (${links})`
  }
  if (id) return `<a href="https://genosys.ae/products/${id}">${name}</a>`
  return `<span style="font-weight:700;color:#12355B">${name}</span>`
}

function rows(items) {
  return items
    .map(
      ([name, vol, cost, per, one, n, id]) => `
    <tr>
      <td>${nameCell(name, id)}</td>
      <td class="c">${vol}</td>
      <td class="n">${Number(cost).toFixed(2)}</td>
      <td class="c">${per}</td>
      <td class="n">${Number(one).toFixed(2)}</td>
      <td class="n">${n}</td>
    </tr>`
    )
    .join('')
}

function table(items, extra = '') {
  return `<table class="list">
    <tr>
      <th>Product · tap name to open page</th>
      <th>Volume</th>
      <th class="n">Clinic AED</th>
      <th>Per 1 treatment</th>
      <th class="n">Cost / 1</th>
      <th class="n">Treatments</th>
    </tr>
    ${rows(items)}
    ${extra}
  </table>`
}

const sol = [
  ['AWS', '9'],
  ['SWS', '8'],
  ['PCS', '7'],
  ['HES', '4'],
  ['CTS', '6'],
  ['CVS', '5'],
]

const roller = [
  ['Skin Defender Lip & Eye Makeup Remover', '200 ml', 145, '0.5 g', 0.68, 400, '11'],
  ['Snow O₂ Cleanser', '500 ml', 255, '0.5 g', 0.25, 1000, '10'],
  ['Snow Booster', '1000 ml', 245, '1.0 g', 0.24, 1000, '16'],
  ['EZ CO₂ Mask', '20 g × 5 + 12 g × 5', 230, '1 tube + 1 sheet', 46, 5, '38'],
  ['Standard detachable Roller', '1 pcs', 115, '1 pcs', 7.66, 15, '1'],
  ['PRO Solutions (AWS / SWS / PCS / HES / CTS / CVS)', '2 ml × 10', 290, '1 vial', 29, 10, sol],
  ['Hydro Cool Modeling Mask', '1000 g', 300, '30 g', 9, 34, '35'],
  ['Soothing Repair Postcream', '20 g', 102, '0.5 g', 2.55, 40, '25'],
  ['Multi Sun Cream SPF 40', '40 g', 105, '0.5 g', 1.31, 80, '40'],
  ['Intensive Blemish Balm Cream', '50 g', 125, '0.5 g', 1.25, 100, '42'],
]

const calcA = [
  ['Skin Defender Lip & Eye Makeup Remover', '200 ml', 145, '0.5 g', 0.68, 400, '11'],
  ['Snow O₂ Cleanser', '500 ml', 255, '0.5 g', 0.25, 1000, '10'],
  ['Snow Booster', '1000 ml', 245, '1.0 g', 0.24, 1000, '16'],
  ['PRO Solutions (AWS / SWS / PCS / HES / CTS / CVS)', '2 ml × 10', 290, '1 vial', 29, 10, sol],
  ['Standard Manual Roller', '1 pcs', 115, '1 pcs', 7.66, 15, '1'],
  ['Soothing Repair Postcream', '20 g', 102, '0.5 g', 2.55, 40, '25'],
  ['Multi Sun Cream SPF 40', '40 g', 105, '0.5 g', 1.31, 80, '40'],
  ['EZ CO₂ Mask', '20 g × 5 + 12 g × 5', 230, '1 tube + 1 sheet', 46, 5, '38'],
  ['Intensive Blemish Balm Cream', '50 g', 125, '0.5 g', 1.25, 100, '42'],
  ['Hydro Cool Modeling Mask', '1000 g', 300, '30 g', 9, 34, '35'],
  ['Skin Renewal Peeling System (SRS)', '2 ml × 10', 405, '1 vial', 40.5, 10, '13'],
  ['Intensive Hydro Soothing Cream', '250 g', 210, '0.5 g', 0.42, 500, '28'],
]

const calcB = [
  ['Intensive Multi Functional Cream', '250 g', 210, '0.5 g', 0.42, 500, '32'],
  ['Intensive Problem Control Cream', '250 g', 210, '0.5 g', 0.42, 500, '30'],
  ['Skin Barrier Protecting Cream', '100 g', 225, '0.5 g', 1.12, 200, '27'],
  ['Peptide Gel Mask', '39 g × 5', 190, '1 sheet', 38, 5, '37'],
  ['ND Cell Anti-Wrinkle Cream', '50 ml', 185, '1 ml', 3.7, 50, '23'],
  ['EyeCell Eye Contour Cream', '20 g', 185, '0.2 g', 1.85, 40, '24'],
  ['EyeCell Eye Contour Serum', '10 ml', 185, '0.2 ml', 3.7, 20, '17'],
  ['HR³ Matrix Hair Solution α', '8 vials', 370, '1 vial', 46.25, 8, '45'],
  ['HR³ Matrix Scalp & Hair Shampoo', '300 ml', 170, '5 ml', 2.83, 60, '44'],
  ['HR³ Matrix Scalp Peeling', '100 ml', 145, '2 ml', 2.9, 50, '46'],
  ['HR³ Matrix Hair Tonic', '70 ml', 145, '2 ml', 4.14, 35, '43'],
  ['HR³ Matrix Hair Solution box', '5 ml × 8', 370, '1 vial', 46, 8, '45'],
]

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>

${page(`
  <div class="exhibit">Professional treatment costs</div>
  <h1>GENOSYS clinic cost per treatment</h1>
  <div class="cover-meta">Prepared for <strong>Shakirovna Ladies Beauty Saloon</strong> · 18 August 2026 · Same figures as <a href="https://genosys.ae/prof" style="color:#12355B;font-weight:700">genosys.ae/prof</a></div>
  <hr class="rule"/>
  <p class="lead">Clinic AED, VAT included. Product names are <strong>clickable</strong>. The first table is the basic roller microneedling set. The next pages list cost per treatment for other GENOSYS lines.</p>

  <h2 class="sec">Basic microneedling treatment · Roller</h2>
  ${table(
    roller,
    `<tr class="tot"><td colspan="2">Full product set</td><td class="n">1,912.00</td><td class="c">—</td><td class="n">97.94</td><td></td></tr>`
  )}
  <div class="sum">1. Full product set: <strong>1,912.00 AED</strong><br/>2. One treatment purchase cost: <strong>97.88 AED</strong></div>
  <p class="source">Source: genosys.ae/prof · Official distributor Genosys Middle East FZ-LLC. Usage per treatment is a working estimate for salon costing.</p>
`)}

${page(`
  <h2 class="sec">Genosys product calculation</h2>
  ${table([...calcA, ...calcB])}
  <p class="lead" style="margin-top:2.5mm">You can calculate any GENOSYS product cost per 1 treatment from these figures.</p>
  <p class="source">Source: genosys.ae/prof · Prepared for Shakirovna Ladies Beauty Saloon · 18 August 2026.</p>
`)}

</body></html>`

const outHtml = path.join(ORDERS, 'GENOSYS_Shakirovna_Salon_Professional_Treatment_Costs.html')
const outPdf = path.join(ORDERS, 'GENOSYS_Shakirovna_Salon_Professional_Treatment_Costs.pdf')
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
  const pages = await pageObj.$$('.page')
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
  console.log(JSON.stringify({ ok: true, outPdf, pages: pages.length, measure }))
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
