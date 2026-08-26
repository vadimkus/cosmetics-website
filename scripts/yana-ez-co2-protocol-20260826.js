/**
 * EZ CO₂ Mask how-to protocol for Yana.
 * Carton / Intertek / SA method only (10 minutes). No print.
 * Output: ~/Desktop/orders/GENOSYS_Yana_EZ_CO2_Protocol.pdf
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
const OUT_PDF = path.join(ORDERS, 'GENOSYS_Yana_EZ_CO2_Protocol.pdf')

const P = {
  ez: IMG('images', 'ez_mask', 'main.jpeg'),
  mist: IMG('images', 'mist', 'main2.jpeg'),
  hydro: IMG('images', 'HSC.jpg'),
  spf: IMG('images', 'ultra', 'main.jpeg'),
}

const css = `
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; font-size: 10pt; line-height: 1.38; }
  .page { width: 210mm; height: 296.5mm; page-break-after: always; position: relative; padding: 60mm 16mm 18mm 16mm; overflow: hidden; background: #fff; }
  .page:last-child { page-break-after: auto; }
  .letterhead { position: absolute; top: 0; left: 0; width: 210mm; }
  .letterhead img { width: 100%; display: block; }
  .exhibit { font-size: 7.6pt; letter-spacing: 1.6px; text-transform: uppercase; color: #2E7D82; font-weight: 700; margin-bottom: 1.2mm; }
  h1 { font-family: Georgia, 'Times New Roman', serif; font-size: 18pt; color: #12355B; font-weight: 700; line-height: 1.15; }
  h2 { font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; color: #fff; background: #12355B; padding: 1.5mm 3mm; margin: 3.2mm 0 2mm 0; }
  h2.alt { background: #2E7D82; }
  .rule { border: none; border-top: 2.5px solid #12355B; margin: 2mm 0 3mm 0; }
  .cover-meta { font-size: 9.4pt; color: #44576b; margin: 1.6mm 0 2.4mm 0; }
  .lead { font-size: 10.4pt; line-height: 1.4; color: #1f2f42; border-left: 4px solid #2E7D82; padding: 2mm 0 2mm 4mm; margin: 0 0 3mm 0; }
  .hero { display: flex; gap: 5mm; align-items: flex-start; margin: 0 0 2.5mm 0; }
  .hero img { width: 38mm; height: auto; display: block; border: 1px solid #E3E9F0; }
  .hero .txt { flex: 1; }
  .kit { width: 100%; border-collapse: collapse; margin: 0 0 2mm 0; }
  .kit th { background: #EAF4F4; color: #12355B; font-size: 7.2pt; text-transform: uppercase; letter-spacing: .3px; text-align: left; padding: 1.3mm 2mm; }
  .kit td { border-bottom: 1px solid #E3E9F0; padding: 1.4mm 2mm; font-size: 9.3pt; }
  .kit td.n { text-align: right; font-weight: 700; color: #12355B; }
  table.steps { width: 100%; border-collapse: collapse; }
  table.steps td { border-bottom: 1px solid #E3E9F0; padding: 2mm 2mm; vertical-align: top; }
  table.steps td.num { width: 9mm; font-family: Georgia, serif; font-size: 14pt; color: #2E7D82; font-weight: 700; }
  table.steps .pname { font-weight: 700; color: #12355B; }
  table.steps .how { font-size: 9.2pt; color: #33475b; margin-top: 0.4mm; }
  .callout { background: #EAF4F4; border-left: 4px solid #2E7D82; padding: 2.4mm 3.5mm; font-size: 9.4pt; margin: 2.5mm 0; }
  .warn { background: #FBECEA; border-left: 4px solid #B3261E; padding: 2.4mm 3.5mm; font-size: 9.3pt; margin: 2.5mm 0 0 0; }
  .warn strong { color: #B3261E; }
  ul.tight { margin: 0 0 0 4.5mm; }
  ul.tight li { margin: 0 0 1.3mm 0; color: #1f2f42; }
  .after { display: flex; gap: 3mm; margin-top: 2mm; }
  .after .cell { flex: 1; text-align: center; }
  .after img { width: 100%; height: 28mm; object-fit: contain; }
  .after .lbl { font-size: 7.4pt; color: #44576b; margin-top: 1mm; }
  a { color: #12355B; font-weight: 700; text-decoration: none; }
  .footer { position: absolute; bottom: 6mm; left: 16mm; right: 16mm; font-size: 7.2pt; color: #7a8896; border-top: 1px solid #E3E9F0; padding-top: 1.4mm; }
`

function page(inner) {
  return `<div class="page">
    <div class="letterhead"><img src="${HEADER}" alt="GENOSYS Middle East FZ-LLC" /></div>
    ${inner}
    <div class="footer">GENOSYS Middle East FZ-LLC · Official UAE Distributor · sales@genosys.ae · +971 58 548 7665 · www.genosys.ae &nbsp;|&nbsp; Prepared for Yana · 26 August 2026</div>
  </div>`
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>EZ CO₂ Mask Protocol — Yana</title>
<style>${css}</style>
</head>
<body>
${page(`
  <div class="exhibit">Personal carboxy protocol</div>
  <h1>How to use EZ CO₂ MASK KIT</h1>
  <div class="cover-meta">Prepared for <strong>Yana</strong> · 26 August 2026 · <a href="https://genosys.ae/products/38">genosys.ae/products/38</a></div>
  <hr class="rule" />
  <div class="hero">
    <img src="${P.ez}" alt="GENOSYS EZ CO2 MASK KIT" />
    <div class="txt">
      <div class="lead">An acidic gel and a bicarbonate sheet meet on dry skin. CO₂ forms, you wait <strong>ten minutes</strong>, you rinse. Five treatments in the box.</div>
      <table class="kit">
        <tr><th>In the kit</th><th class="n">Qty</th></tr>
        <tr><td>Gel 20 g</td><td class="n">×5</td></tr>
        <tr><td>Mask sheet 12 g</td><td class="n">×5</td></tr>
        <tr><td>Spatula</td><td class="n">×1</td></tr>
      </table>
    </div>
  </div>
  <h2>How to use — one treatment</h2>
  <table class="steps">
    <tr><td class="num">1</td><td><div class="pname">Clean, then dry</div><div class="how">The gel is for dry skin, not a wet face. Pat thoroughly dry.</div></td></tr>
    <tr><td class="num">2</td><td><div class="pname">Gel</div><div class="how">Open one 20 g tube. Spread an even layer with the spatula. Keep off the eyes, scars and broken skin.</div></td></tr>
    <tr><td class="num">3</td><td><div class="pname">Sheet</div><div class="how">Open one pouch. Lay the mask close to the face, <strong>coated side upward</strong>. Press so it meets the gel.</div></td></tr>
    <tr><td class="num">4</td><td><div class="pname">Wait ten minutes</div><div class="how">Sparkling for 20–30 seconds at the start is normal. Not 15, not 20. Ten minutes, then rinse.</div></td></tr>
    <tr><td class="num">5</td><td><div class="pname">Rinse</div><div class="how">Peel the sheet off. Cleanse the gel off gently. Then mist and cream. Keep strong sun off the skin afterwards.</div></td></tr>
  </table>
`)}
${page(`
  <h2 class="alt">After the rinse</h2>
  <p style="margin:0 0 1.5mm 0;color:#1f2f42">Mist and cream keep the new surface comfortable. Then sunscreen. The carton asks you to avoid strong UV after the session.</p>
  <div class="after">
    <div class="cell"><img src="${P.mist}" alt="Microbiome mist" /><div class="lbl">Mist<br/>after the rinse</div></div>
    <div class="cell"><img src="${P.hydro}" alt="Hydro Soothing Cream" /><div class="lbl">Soothing cream<br/>thin layer</div></div>
    <div class="cell"><img src="${P.spf}" alt="Ultra Shield Sun Cream" /><div class="lbl">Sunscreen<br/>same day</div></div>
  </div>
  <div class="callout"><strong>How often:</strong> once a week as standard. Twice a week on the intensive programme. One gel + one sheet = one treatment. Use an opened tube and pouch at once. Do not put the kit in the fridge.</div>
  <h2>Do this</h2>
  <ul class="tight">
    <li>Use on clean, dry, intact skin.</li>
    <li>Gel first, then the sheet, coated side up.</li>
    <li>Leave ten minutes. A short sparkle at the start is the reaction starting.</li>
    <li>Rinse, then mist and cream. Keep strong sun off afterwards.</li>
    <li>If it reaches the eyes, rinse with cool water. Stop and speak to a doctor if swelling appears.</li>
  </ul>
  <h2 class="alt">Do not</h2>
  <ul class="tight">
    <li>Do not use on eyes, scars, wounds or already stinging skin.</li>
    <li>Do not leave it 15–20 minutes. The directions are ten.</li>
    <li>Do not refrigerate the kit.</li>
    <li>Do not save an opened tube or pouch for later.</li>
    <li>Do not expect slimming or fat loss. That is not this kit.</li>
    <li>There is no peptide sheet in the box. The kit is gel, mask and a spatula.</li>
  </ul>
  <div class="warn"><strong>External use only.</strong> Dermatologically tested. Made in Korea. If anything feels unclear, message us before you open a tube.</div>
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
      const extras = [...p.querySelectorAll('p, table, ul, .lead, .hero, .after, .callout, .warn')]
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
  console.log(JSON.stringify({ ok: true, outPdf: OUT_PDF, measure }))
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
