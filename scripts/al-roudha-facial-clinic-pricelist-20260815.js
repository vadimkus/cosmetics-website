/**
 * GENOSYS UAE Clinic Price List — Facial (links + clinic AED)
 * Output: ~/Desktop/orders/GENOSYS_Al_Roudha_Facial_Clinic_Price_List.pdf
 */
const fs = require('fs')
const path = require('path')
const os = require('os')

const ROOT = path.join(__dirname, '..')
const IMG = (...p) => {
  const full = path.join(ROOT, 'public', ...p)
  const ext = full.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'
  return `data:${ext};base64,${fs.readFileSync(full).toString('base64')}`
}
const ORDERS = path.join(os.homedir(), 'Desktop', 'orders')
const HEADER = `data:image/png;base64,${fs.readFileSync(path.join(ORDERS, 'Header.png')).toString('base64')}`

const I = {
  cera: IMG('images', 'cera', 'main3.jpeg'),
  snow: IMG('images', 'cleanser', 'main_clean.jpeg'),
  booster: IMG('images', 'Second', 'main_booster.jpg'),
  pcToner: IMG('images', 'problem', 'Main.jpg'),
  remover: IMG('images', 'remover', 'Main2.jpg'),
  mist: IMG('images', 'mist', 'main2.jpeg'),
  epi: IMG('images', 'epi', 'main.jpeg'),
  srs: IMG('images', 'SRS.jpg'),
  aws: IMG('images', 'AWS.jpg'),
  sws: IMG('images', 'SWS.jpg'),
  pcs: IMG('images', 'PCS.jpg'),
  cvs: IMG('images', 'cvs-hero.jpg'),
  cts: IMG('images', 'CTS.jpg'),
  hes: IMG('images', 'hes_power', 'main.jpeg'),
  ez: IMG('images', 'ez_mask', 'main.jpeg'),
  collagen: IMG('images', 'collagen_mask', 'Main.jpeg'),
  algae: IMG('images', 'sea_algae', 'Main.jpeg'),
  peptide: IMG('images', 'peptide_mask', 'main.jpeg'),
  ferment: IMG('images', 'bio_ferment', 'bferment_main.jpg'),
  pdrn: IMG('images', 'pdrn_mask', 'main.jpeg'),
  hydroMask: IMG('images', 'HYDR.jpg'),
  awSerum: IMG('images', 'multif_serum', 'main.jpeg'),
  radSerum: IMG('images', 'radiance_serum', 'main.jpeg'),
  hySerum: IMG('images', 'hyaluron_serum', 'main.jpeg'),
  pcSerum: IMG('images', 'problems_serum', 'main.jpeg'),
  afs: IMG('images', 'sensitive_serum', 'main.jpeg'),
  awCream: IMG('images', 'multifunc_cream', 'main.jpeg'),
  hydro: IMG('images', 'HSC.jpg'),
  hyCream: IMG('images', 'hyaluron', 'main.jpeg'),
  pcCream: IMG('images', 'problem_cream', 'main.jpeg'),
  radCream: IMG('images', 'radiance', 'main.jpeg'),
  barrier: IMG('images', 'skin_barr', 'main.jpeg'),
  post: IMG('images', 'SRC.jpg'),
  overnight: IMG('images', 'overnight', 'main.jpeg'),
  spf40: IMG('images', 'sun', 'main.jpeg'),
  spf50: IMG('images', 'ultra', 'main.jpeg'),
  blemish: IMG('images', 'BLEM.jpg'),
  revita: IMG('images', 'revita', 'main.jpg'),
  cushion: IMG('images', 'cushion_2', 'main.jpeg'),
  pdrn5: IMG('images', 'meso_5000', 'main.jpg'),
  pdrn60: IMG('images', '6000', 'main.jpg'),
  roller: IMG('images', 'genosys-microneedling-devices.jpg'),
  pen: IMG('images', 'Needle-pen.jpg'),
  led: IMG('images', 'LEDD.jpg'),
}

const css = `
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; font-size: 9pt; line-height: 1.3; }
  .page { width: 210mm; height: 296.5mm; page-break-after: always; position: relative; padding: 60mm 14mm 16mm 14mm; overflow: hidden; background: #fff; }
  .page:last-child { page-break-after: auto; }
  .letterhead { position: absolute; top: 0; left: 0; width: 210mm; }
  .letterhead img { width: 100%; display: block; }
  h1 { font-family: Georgia, 'Times New Roman', serif; font-size: 17.5pt; color: #12355B; font-weight: 700; line-height: 1.12; }
  h2.sec { font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; color: #fff; background: #12355B; padding: 1.3mm 3mm; margin: 2.2mm 0 0 0; }
  .page > h2.sec:first-child { margin-top: 0; }
  h2.sec.alt { background: #2E7D82; }
  .exhibit { font-size: 7.6pt; letter-spacing: 1.6px; text-transform: uppercase; color: #2E7D82; font-weight: 700; margin-bottom: 0.8mm; }
  .rule { border: none; border-top: 2.5px solid #12355B; margin: 1.6mm 0 2.2mm 0; }
  .cover-meta { font-size: 9pt; color: #44576b; margin: 1.4mm 0 2mm 0; }
  .lead { font-size: 9.4pt; line-height: 1.35; color: #1f2f42; border-left: 4px solid #2E7D82; padding: 1.4mm 0 1.4mm 4mm; margin: 0 0 2.2mm 0; }
  table.list { width: 100%; border-collapse: collapse; }
  table.list th { background: #EAF4F4; color: #12355B; font-size: 7.2pt; letter-spacing: .3px; text-transform: uppercase; text-align: left; padding: 1.1mm 2mm; border-bottom: 1px solid #C9D3E0; }
  table.list td { border-bottom: 1px solid #E3E9F0; padding: 1mm 2mm; vertical-align: middle; }
  table.list td.pic { width: 12mm; }
  table.list td.pic img { width: 10mm; height: 10mm; object-fit: contain; }
  table.list td.price { width: 38mm; text-align: right; font-weight: 700; color: #12355B; white-space: nowrap; }
  table.list a { color: #12355B; text-decoration: none; font-weight: 700; }
  table.list a:hover { color: #2E7D82; text-decoration: underline; }
  table.list .spec { font-size: 8pt; color: #5b6b7c; font-weight: 400; }
  .footer { position: absolute; bottom: 5.5mm; left: 14mm; right: 14mm; font-size: 7.3pt; color: #7a8896; border-top: 1px solid #E3E9F0; padding-top: 1.4mm; }
  .source { font-size: 7.4pt; color: #7a8896; margin-top: 2.5mm; }
`

const img = (src) => `<img src="${src}" />`

function page(inner) {
  return `<div class="page">
    <div class="letterhead">${img(HEADER)}</div>
    ${inner}
    <div class="footer">Genosys Middle East FZ-LLC · Official UAE Distributor · sales@genosys.ae · +971 58 548 7665 · www.genosys.ae &nbsp;|&nbsp; Clinic prices VAT included · Al Roudha Medical Center · 15 August 2026</div>
  </div>`
}

function rows(items) {
  return items
    .map(
      ([pic, name, spec, price, id]) => `
    <tr>
      <td class="pic">${img(pic)}</td>
      <td><a href="https://genosys.ae/products/${id}">${name}</a><br/><span class="spec">${spec}</span></td>
      <td class="price">${price}</td>
    </tr>`
    )
    .join('')
}

function table(items) {
  return `<table class="list">
    <tr><th></th><th>Product · tap name to open page</th><th style="text-align:right">Clinic AED</th></tr>
    ${rows(items)}
  </table>`
}

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>

${page(`
  <div class="exhibit">Clinic Price List · Facial</div>
  <h1>GENOSYS UAE — Facial clinic prices</h1>
  <div class="cover-meta">Prepared for <strong>Al Roudha Medical Center</strong> · 15 August 2026 · Same clinic prices as <strong>GENOSYS_UAE_PriceList_Clinics_2026.pdf</strong></div>
  <hr class="rule"/>
  <p class="lead">VAT included. Product names are <strong>clickable</strong> — they open the page on genosys.ae. Personal / professional sizes shown where both exist.</p>

  <h2 class="sec">Cleansers, toner, prep</h2>
  ${table([
    [I.cera, 'Cerabarrier Biome Gel Cleanser', '200 ml personal · 600 ml professional', '190 / 310', '66'],
    [I.snow, 'Snow O₂ Cleanser', '180 ml personal · 500 ml professional', '165 / 255', '10'],
    [I.booster, 'Snow Booster', '200 ml personal · 1000 ml professional', '130 / 245', '16'],
    [I.pcToner, 'Problem Control Toner', '200 ml personal · 500 ml professional', '130 / 245', '15'],
    [I.remover, 'Skin Defender Lip & Eye Makeup Remover', '200 ml', '145', '11'],
    [I.mist, 'Microbiome Energy Infusing Mist', '80 ml', '80', '14'],
    [I.epi, 'EPI Turnover Boosting Peeling Gel', '100 g', '125', '12'],
  ])}
  <p class="source">Source: GENOSYS UAE Price List Clinics 2026. Official distributor — Genosys Middle East FZ-LLC.</p>
`)}

${page(`
  <h2 class="sec">Peels &amp; Power Solution</h2>
  ${table([
    [I.srs, 'Skin Renewal Peeling System (SRS)', '2 ml × 10 vials', '405', '13'],
    [I.aws, 'Power Solution AWS', '2 ml × 10 · anti-wrinkle', '290', '9'],
    [I.sws, 'Power Solution SWS', '2 ml × 10 · brightening', '290', '8'],
    [I.pcs, 'Power Solution PCS', '2 ml × 10 · problem control', '290', '7'],
    [I.cvs, 'Power Solution CVS', '2 ml × 10 · nutrition', '290', '5'],
    [I.cts, 'Power Solution CTS', '2 ml × 10 · remodeling', '290', '6'],
    [I.hes, 'Power Solution HES', '2 ml × 10 · plumping / redness', '290', '4'],
  ])}

  <h2 class="sec alt">Masks</h2>
  ${table([
    [I.ez, 'EZ CO₂ Mask Kit', 'Gel 20 g × 5 + mask 12 g × 5', '230', '38'],
    [I.collagen, 'Intensive Repair Collagen Mask', '23 g sheet', '18', '53'],
    [I.algae, 'Soothing Bomb Sea Algae Mask', '23 g sheet', '18', '36'],
    [I.peptide, 'Peptide Gel Mask', '39 g × 5 sheets', '190', '37'],
    [I.ferment, 'Bio-Ferment Age Defying Powder Mask', '300 g', '125', '51'],
    [I.pdrn, 'Skin Reboot PDRN Mask Pack', '30 sheets', '200', '52'],
    [I.hydroMask, 'Hydro Cool Modeling Mask', '1 kg', '300', '35'],
  ])}
`)}

${page(`
  <h2 class="sec">Daily serums · 30 ml</h2>
  ${table([
    [I.awSerum, 'Multi Functional Anti-Wrinkle Serum', '30 ml', '165', '22'],
    [I.radSerum, 'Multi Vita Radiance Serum', '30 ml', '165', '21'],
    [I.hySerum, 'Moisture Replenishing Hyaluron Serum', '30 ml', '165', '18'],
    [I.pcSerum, 'Problem Control Serum', '30 ml', '165', '20'],
    [I.afs, 'All For Sensitive Serum', '30 ml', '165', '19'],
  ])}

  <h2 class="sec alt">Treatment creams</h2>
  ${table([
    [I.awCream, 'Multi Functional Anti-Wrinkle Cream', '50 g personal · 250 g professional', '145 / 210', '32'],
    [I.hydro, 'Intensive Hydro Soothing Cream', '50 g personal · 250 g professional', '145 / 210', '28'],
    [I.hyCream, 'Moisture Replenishing Hyaluron Cream', '50 g personal · 250 g professional', '145 / 210', '29'],
    [I.pcCream, 'Intensive Problem Control Cream', '50 g personal · 250 g professional', '145 / 210', '30'],
    [I.radCream, 'Multi Vita Radiance Cream', '50 g personal · 230 g professional', '145 / 210', '31'],
    [I.barrier, 'Skin Barrier Protecting Cream', '100 g professional', '225', '27'],
    [I.post, 'Soothing Repair Postcream', '20 g personal · 100 g professional', '102 / 220', '25'],
    [I.overnight, 'Skin Rescue Overnight Cream Mask', '100 g', '170', '34'],
  ])}
  <p class="source">Personal / professional sizes shown as two prices. Barrier cream is professional 100 g only. Sheet masks 18 AED are per piece; Peptide Gel Mask is a 5-sheet box.</p>
`)}

${page(`
  <h2 class="sec">SPF &amp; tinted</h2>
  ${table([
    [I.spf40, 'Multi Sun Cream SPF 40 PA++', '40 g', '105', '40'],
    [I.spf50, 'Ultra Shield Sun Cream SPF 50+ PA++++', '50 g', '125', '39'],
    [I.blemish, 'Intensive Blemish Balm Cream SPF 30', '50 g', '125', '42'],
    [I.revita, 'Revita Glow BB Cream SPF 38', '50 g · #01 Bright / #02 Natural', '125', '63'],
    [I.cushion, 'Skin Caring Blemish Balm Cushion SPF 50+', 'Ivory / Beige / Camel + refill', '150', '41'],
  ])}

  <h2 class="sec">Bio-Meso</h2>
  ${table([
    [I.pdrn5, 'Bio-Meso PDRN Homecare Ampoule 5000', '50 ml', '150', '65'],
    [I.pdrn60, 'Bio-Meso PDRN Expert Ampoule 60000', '3 ml × 4 · clinic only', '300', '60'],
  ])}

  <h2 class="sec alt">Facial devices</h2>
  ${table([
    [I.roller, 'Detachable Manual Roller', '0.25–2.00 mm', '115', '1'],
    [I.pen, 'Needle Pen-K Kit', 'Handle + 2 needles + adaptor', '1,450', '2'],
    [I.led, 'GENO-LED IR II', 'Clinic LED device', '5,500', '49'],
  ])}
  <p class="lead" style="margin-top:5mm">Hair, eye and marketing items stay on the full 5-page clinic PDF. This sheet is facial only. Product names open genosys.ae. Prices VAT included.</p>
  <p class="source">Source: GENOSYS UAE Price List Clinics 2026. Official distributor — Genosys Middle East FZ-LLC.</p>
`)}

</body></html>`

const outHtml = path.join(ORDERS, 'GENOSYS_Al_Roudha_Facial_Clinic_Price_List.html')
const outPdf = path.join(ORDERS, 'GENOSYS_Al_Roudha_Facial_Clinic_Price_List.pdf')
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
  for (let i = 0; i < pages.length; i++) {
    await pages[i].screenshot({
      path: path.join(ORDERS, `GENOSYS_Al_Roudha_Facial_Clinic_Price_List_p${i + 1}.png`),
    })
  }
  await browser.close()
  console.log(JSON.stringify({ ok: true, outPdf, pages: pages.length }))
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
