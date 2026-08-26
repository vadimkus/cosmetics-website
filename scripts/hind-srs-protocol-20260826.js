/**
 * SRS how-to protocol for Hind Lougay.
 * Carton / Intertek method only. Output: ~/Desktop/orders/GENOSYS_Hind_SRS_Protocol.pdf
 * Header.png. No print.
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
const OUT_PDF = path.join(ORDERS, 'GENOSYS_Hind_SRS_Protocol.pdf')

const P = {
  srs: IMG('images', 'SRS.jpg'),
  peptide: IMG('images', 'peptide_mask', 'main.jpeg'),
  post: IMG('images', 'SRC.jpg'),
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
  .acids { width: 100%; border-collapse: collapse; margin: 0 0 2mm 0; }
  .acids th { background: #EAF4F4; color: #12355B; font-size: 7.2pt; text-transform: uppercase; letter-spacing: .3px; text-align: left; padding: 1.3mm 2mm; }
  .acids td { border-bottom: 1px solid #E3E9F0; padding: 1.4mm 2mm; font-size: 9.3pt; }
  .acids td.n { text-align: right; font-weight: 700; color: #12355B; }
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
    <div class="footer">GENOSYS Middle East FZ-LLC · Official UAE Distributor · sales@genosys.ae · +971 58 548 7665 · www.genosys.ae &nbsp;|&nbsp; Prepared for Hind Lougay · 26 August 2026</div>
  </div>`
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>SRS Protocol — Hind Lougay</title>
<style>${css}</style>
</head>
<body>
${page(`
  <div class="exhibit">Personal peeling protocol</div>
  <h1>How to use SKIN RENEWAL<br/>PEELING SYSTEM (SRS)</h1>
  <div class="cover-meta">Prepared for <strong>Hind Lougay</strong> · 26 August 2026 · <a href="https://genosys.ae/products/13">genosys.ae/products/13</a></div>
  <hr class="rule" />
  <div class="hero">
    <img src="${P.srs}" alt="GENOSYS SKIN RENEWAL PEELING SYSTEM" />
    <div class="txt">
      <div class="lead">A professional soft peel for smoother, brighter, more even-looking skin. One 2 ml vial is one session. Ten vials in the box.</div>
      <table class="acids">
        <tr><th>Acid</th><th class="n">In the formula</th></tr>
        <tr><td>Glycolic acid</td><td class="n">15%</td></tr>
        <tr><td>Lactic acid</td><td class="n">13.5%</td></tr>
        <tr><td>Mandelic acid</td><td class="n">2%</td></tr>
      </table>
    </div>
  </div>
  <h2>How to use — one vial</h2>
  <table class="steps">
    <tr><td class="num">1</td><td><div class="pname">Patch test first</div><div class="how">Before the first session, try a little on the inner arm. Wait. If the skin stays calm, you can use the face.</div></td></tr>
    <tr><td class="num">2</td><td><div class="pname">Clean, dry skin</div><div class="how">Face only. Skin must be intact — no cuts, no scratches, no open or irritated areas.</div></td></tr>
    <tr><td class="num">3</td><td><div class="pname">Apply evenly</div><div class="how">Open one 2 ml vial. Spread a thin, even layer on the face. Keep off the lips and the eye area.</div></td></tr>
    <tr><td class="num">4</td><td><div class="pname">Leave 15–20 minutes</div><div class="how">Sit still. Do not layer other products on top. First time: start at 15 minutes.</div></td></tr>
    <tr><td class="num">5</td><td><div class="pname">Rinse with cold water</div><div class="how">Rinse thoroughly. Cold water takes the peel off. There is no separate neutralize step.</div></td></tr>
    <tr><td class="num">6</td><td><div class="pname">Sunscreen after</div><div class="how">The carton asks for sunscreen after the rinse. Keep it on that day, and the days that follow.</div></td></tr>
  </table>
`)}
${page(`
  <h2 class="alt">After the rinse — if the skin wants comfort</h2>
  <p style="margin:0 0 1.5mm 0;color:#1f2f42">SRS itself is a mild professional peel. After cold water you can rest the skin with a peptide mask or a soothing cream, then sunscreen.</p>
  <div class="after">
    <div class="cell"><img src="${P.peptide}" alt="Peptide Gel Mask" /><div class="lbl">Peptide Gel Mask<br/>one sheet, then massage leftover in</div></div>
    <div class="cell"><img src="${P.post}" alt="Soothing Repair Postcream" /><div class="lbl">Soothing Repair Postcream<br/>thin layer</div></div>
    <div class="cell"><img src="${P.hydro}" alt="Intensive Hydro Soothing Cream" /><div class="lbl">Hydro Soothing Cream<br/>if you already have it</div></div>
    <div class="cell"><img src="${P.spf}" alt="Ultra Shield Sun Cream" /><div class="lbl">Sunscreen<br/>after every session</div></div>
  </div>
  <div class="callout">One vial = one session. Do not save an opened vial. This is not the home cellulose peeling gel (Epi). It is a rinse-off AHA peel.</div>
  <h2>Do this</h2>
  <ul class="tight">
    <li>Patch test before the first use.</li>
    <li>Keep it off the lips, the eyes and mucous membranes. If it gets in the eye, rinse with cool water.</li>
    <li>Rinse with cold water after 15–20 minutes.</li>
    <li>Use sunscreen after.</li>
    <li>If redness, swelling or irritation appears, stop and speak to a doctor.</li>
  </ul>
  <h2 class="alt">Do not</h2>
  <ul class="tight">
    <li>Do not use on broken, scratched, open or already irritated skin.</li>
    <li>Do not leave it longer than 20 minutes.</li>
    <li>Do not combine it with a roller, spicules or another peel on the same evening.</li>
    <li>Do not use it as a daily toner. It is a session product.</li>
  </ul>
  <div class="warn"><strong>High-AHA peel.</strong> If anything feels unclear, message us before you open a vial. External use only. Dermatologically tested. Made in Korea.</div>
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
