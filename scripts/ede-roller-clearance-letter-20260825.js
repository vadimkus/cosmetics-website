/**
 * Formal letter to EDE — 30 × GRFS050 rollers held at Dubai Customs.
 * Output: ~/Desktop/orders/GENOSYS_EDE_Roller_Clearance_EQ-32661-K0V4H.pdf
 * Letterhead Header.png. Stamp.png on last page. No auto-print.
 */
const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync } = require('child_process')

const ORDERS = path.join(os.homedir(), 'Desktop', 'orders')
const EDE_DIR = path.join(os.homedir(), 'Desktop', '18082029', 'EDE')
const ROLLER_FILE = fs.readdirSync(EDE_DIR).find((f) => f.startsWith('Screenshot 2026-08-25 at 1.57.43'))
if (!ROLLER_FILE) throw new Error('Roller screenshot not found in EDE folder')
const HEADER = `data:image/png;base64,${fs.readFileSync(path.join(ORDERS, 'Header.png')).toString('base64')}`
const STAMP = `data:image/png;base64,${fs.readFileSync(path.join(ORDERS, 'Stamp.png')).toString('base64')}`
const ROLLER = `data:image/png;base64,${fs.readFileSync(path.join(EDE_DIR, ROLLER_FILE)).toString('base64')}`
const OUT_PDF = path.join(ORDERS, 'GENOSYS_EDE_Roller_Clearance_EQ-32661-K0V4H.pdf')

const css = `
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; font-size: 10pt; line-height: 1.38; }
  .page { width: 210mm; height: 296.5mm; page-break-after: always; position: relative; padding: 60mm 16mm 18mm 16mm; overflow: hidden; background: #fff; }
  .page:last-child { page-break-after: auto; }
  .letterhead { position: absolute; top: 0; left: 0; width: 210mm; }
  .letterhead img { width: 100%; display: block; }
  .kicker { font-size: 7.6pt; letter-spacing: 1.5px; text-transform: uppercase; color: #2E7D82; font-weight: 700; margin-bottom: 1mm; }
  h1 { font-family: Georgia, 'Times New Roman', serif; font-size: 14.5pt; color: #12355B; font-weight: 700; line-height: 1.15; }
  .rule { border: none; border-top: 2.5px solid #12355B; margin: 2mm 0 3mm 0; }
  .meta { font-size: 9.4pt; color: #33485c; margin-bottom: 3.2mm; }
  .meta .row { display: flex; gap: 3mm; margin: 0.4mm 0; }
  .meta .lab { width: 28mm; color: #7a8896; text-transform: uppercase; font-size: 7.4pt; letter-spacing: 0.4px; padding-top: 0.4mm; }
  p { margin: 0 0 2.4mm 0; color: #1f2f42; }
  h2 { font-family: Georgia, 'Times New Roman', serif; font-size: 10.5pt; color: #fff; background: #12355B; padding: 1.4mm 3mm; margin: 3mm 0 2mm 0; }
  h2.alt { background: #2E7D82; }
  table.list { width: 100%; border-collapse: collapse; margin-bottom: 2.6mm; }
  table.list th { background: #EAF4F4; color: #12355B; font-size: 7.2pt; letter-spacing: .3px; text-transform: uppercase; text-align: left; padding: 1.4mm 2mm; border-bottom: 1px solid #C9D3E0; }
  table.list td { border-bottom: 1px solid #E3E9F0; padding: 1.5mm 2mm; vertical-align: top; font-size: 9.4pt; }
  table.list td.k { width: 48mm; color: #5b6b7c; }
  table.list td.v { font-weight: 700; color: #12355B; }
  .desc { display: flex; gap: 5mm; align-items: flex-start; margin: 0 0 2.4mm 0; }
  .lead { flex: 1; font-size: 10pt; line-height: 1.38; color: #1f2f42; border-left: 4px solid #2E7D82; padding: 1.8mm 0 1.8mm 4mm; }
  .photo { width: 34mm; flex: 0 0 34mm; text-align: center; }
  .photo img { width: 34mm; height: auto; display: block; border: 1px solid #E3E9F0; }
  .photo .cap { font-size: 6.8pt; color: #7a8896; margin-top: 0.8mm; }
  ol { margin: 0 0 2.8mm 5mm; }
  ol li { margin: 0 0 1mm 0; color: #1f2f42; }
  .sign { margin-top: 6mm; }
  .sign .name { font-family: Georgia, 'Times New Roman', serif; font-size: 12pt; color: #12355B; font-weight: 700; }
  .sign .role { font-size: 9.4pt; color: #33485c; }
  .stamp { width: 46mm; height: auto; display: block; margin-top: 4mm; }
  .footer { position: absolute; bottom: 6mm; left: 16mm; right: 16mm; font-size: 7.2pt; color: #7a8896; border-top: 1px solid #E3E9F0; padding-top: 1.4mm; }
`

function page(inner) {
  return `<div class="page">
    <div class="letterhead"><img src="${HEADER}" alt="GENOSYS Middle East FZ-LLC" /></div>
    ${inner}
    <div class="footer">GENOSYS Middle East FZ-LLC · Official UAE Distributor · sales@genosys.ae · +971 58 548 7665 · www.genosys.ae &nbsp;|&nbsp; EDE Ref. EQ-32661-K0V4H · 25 August 2026</div>
  </div>`
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Letter to EDE — GENOSYS Manual Detachable Roller × 30</title>
<style>${css}</style>
</head>
<body>
${page(`
  <div class="kicker">Official correspondence</div>
  <h1>Request for customs clearance support<br/>GENOSYS Manual Detachable Roller 0.5 mm × 30 pcs</h1>
  <hr class="rule" />
  <div class="meta">
    <div class="row"><div class="lab">Date</div><div>25 August 2026</div></div>
    <div class="row"><div class="lab">To</div><div>Emirates Drug Establishment (EDE)<br/>Customer Happiness Team · info@ede.gov.ae</div></div>
    <div class="row"><div class="lab">From</div><div>GENOSYS Middle East FZ-LLC<br/>Cordoba Residences, Villa E02, Knowledge Village, Dubai, UAE</div></div>
    <div class="row"><div class="lab">Reference</div><div>EQ-32661-K0V4H</div></div>
    <div class="row"><div class="lab">Subject</div><div>Release of 30 cosmetic skin rollers held by Dubai Customs</div></div>
  </div>
  <p>Dear Customer Happiness Team,</p>
  <p>I write on behalf of GENOSYS Middle East FZ-LLC regarding your reference <strong>EQ-32661-K0V4H</strong>.</p>
  <p>Dubai Customs is holding <strong>30 pieces</strong> of our GENOSYS Manual Detachable Roller 0.5 mm from a Korea air shipment and has asked us to obtain EDE confirmation or approval before release.</p>
  <h2>Shipment</h2>
  <table class="list">
    <tr><td class="k">Importer</td><td class="v">GENOSYS Middle East FZ-LLC</td></tr>
    <tr><td class="k">Supplier / manufacturer</td><td class="v">DTS MG Co., Ltd, Seoul, Republic of Korea</td></tr>
    <tr><td class="k">Invoice</td><td class="v">DM GME 260810 · 18 August 2026</td></tr>
    <tr><td class="k">Item 1</td><td class="v">GRFS050 — GENOSYS MANUAL DETACHABLE ROLLER −0.5 mm</td></tr>
    <tr><td class="k">Quantity / value</td><td class="v">30 pcs · USD 8.00 · USD 240.00</td></tr>
    <tr><td class="k">Lot / MFG</td><td class="v">290604 / 260605</td></tr>
    <tr><td class="k">Air Waybill</td><td class="v">176-2056-4025 · Emirates EK323 · Incheon–Dubai · 22 August 2026</td></tr>
    <tr><td class="k">Bill of Entry</td><td class="v">101-01485535-26</td></tr>
    <tr><td class="k">Country of origin</td><td class="v">Republic of Korea</td></tr>
  </table>
  <h2>Full product description</h2>
  <div class="desc">
    <div class="lead">The item is a manual, non-electric, handheld cosmetic skin roller with a detachable 0.5 mm drum. It is a mechanical personal-care / cosmetic accessory used on the skin surface. It contains no medicine, no drug, no cream, and no sterile implant. It is not powered and is not a pharmaceutical product. We regularly import this roller from South Korea as part of the GENOSYS professional cosmetics range.</div>
    <figure class="photo"><img src="${ROLLER}" alt="GENOSYS Manual Detachable Roller 0.5 mm" /><div class="cap">GRFS050 · 0.5 mm</div></figure>
  </div>
`)}
${page(`
  <h2 class="alt">Previous ruling (MOHAP, 20 May 2020)</h2>
  <p>When Dubai Customs previously held the same type of GENOSYS roller, the MOHAP Import &amp; Export Section wrote that <strong>the derma roller is not subject to MOHAP</strong> and asked us to refer to the other competent authority. Dubai Customs then closed ticket <strong>2020051810000679</strong>, classifying the Genosys Roller as a <strong>mechanical device for home and personal care</strong>.</p>
  <p>We understand medical-product import functions now sit with EDE. We therefore request your written confirmation that this item <strong>does not require an EDE import permit</strong>, or, if a permit is required, the exact documents and next step so Customs can release the 30 pieces.</p>
  <h2>Attachments</h2>
  <ol>
    <li>This letter (full product description)</li>
    <li>Commercial / shipping invoice DM GME 260810 (Item 1)</li>
    <li>Air Waybill 176-2056-4025</li>
    <li>MOHAP email dated 20 May 2020</li>
    <li>Dubai Customs ticket close 2020051810000679</li>
  </ol>
  <p>Please reply to this correspondence. I am available on +971 55 915 2985.</p>
  <p>Kind regards,</p>
  <div class="sign">
    <div class="name">Vadim Sagatdinov</div>
    <div class="role">Manager</div>
    <div class="role">GENOSYS Middle East FZ-LLC</div>
    <div class="role">Cordoba Residences, Villa E02, Knowledge Village, Dubai, UAE</div>
    <div class="role">Tel: +971 55 915 2985</div>
    <img class="stamp" src="${STAMP}" alt="GENOSYS Middle East FZ-LLC digitally signed stamp" />
  </div>
`)}
</body>
</html>`

async function main() {
  const { chromium } = require('playwright')
  const browser = await chromium.launch()
  const pageObj = await browser.newPage()
  await pageObj.setViewportSize({ width: 794, height: 1123 })
  await pageObj.setContent(html, { waitUntil: 'load' })
  await pageObj.pdf({
    path: OUT_PDF,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  })
  const measure = await pageObj.evaluate(() => {
    return [...document.querySelectorAll('.page')].map((p, i) => {
      const header = p.querySelector('.letterhead img').getBoundingClientRect()
      const first = p.querySelector('h1, h2').getBoundingClientRect()
      const extras = [...p.querySelectorAll('p, table, ol, .sign, .desc, .lead')]
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
  if (measure.some((m) => !m.titleClear || m.overlap || m.gap < 8)) {
    console.error(JSON.stringify({ ok: false, measure }))
    process.exit(1)
  }
  console.log(JSON.stringify({ ok: true, outPdf: OUT_PDF, printed: false, measure }))
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
