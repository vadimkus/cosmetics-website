/**
 * Power Solutions + SRS chair protocol for Madalina Bogdan / ToneTrendz.
 * Carton / Intertek / SA method only. No microneedling-as-purpose, no neutralize.
 * Output: ~/Desktop/orders/GENOSYS_Madalina_Power_Solutions_SRS_Protocol.pdf
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
const OUT_PDF = path.join(ORDERS, 'GENOSYS_Madalina_Power_Solutions_SRS_Protocol.pdf')

const P = {
  hes: IMG('images', 'hes_power', 'main.jpeg'),
  cvs: IMG('images', 'cvs-hero.jpg'),
  cts: IMG('images', 'cts-hero.jpg'),
  pcs: IMG('images', 'pcs-hero.jpg'),
  sws: IMG('images', 'sws_0', 'Main.jpeg'),
  aws: IMG('images', 'aws-hero.jpg'),
  srs: IMG('images', 'srs_2_new', 'main.jpeg'),
  peptide: IMG('images', 'peptide_mask', 'main.jpeg'),
  post: IMG('images', 'SRC.jpg'),
  hydro: IMG('images', 'HSC.jpg'),
  spf: IMG('images', 'ultra', 'main.jpeg'),
}

const css = `
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; font-size: 9.6pt; line-height: 1.36; }
  .page { width: 210mm; height: 296.5mm; page-break-after: always; position: relative; padding: 60mm 15mm 15mm 15mm; overflow: hidden; background: #fff; }
  .page:last-child { page-break-after: auto; }
  .letterhead { position: absolute; top: 0; left: 0; width: 210mm; }
  .letterhead img { width: 100%; display: block; }
  .exhibit { font-size: 7.4pt; letter-spacing: 1.5px; text-transform: uppercase; color: #2E7D82; font-weight: 700; margin-bottom: 1mm; }
  h1 { font-family: Georgia, 'Times New Roman', serif; font-size: 16.5pt; color: #12355B; font-weight: 700; line-height: 1.12; }
  h2 { font-family: Georgia, 'Times New Roman', serif; font-size: 10.4pt; color: #fff; background: #12355B; padding: 1.2mm 3mm; margin: 2.2mm 0 1.5mm 0; }
  h2.alt { background: #2E7D82; }
  .rule { border: none; border-top: 2.5px solid #12355B; margin: 1.6mm 0 2.4mm 0; }
  .cover-meta { font-size: 9pt; color: #44576b; margin: 1.4mm 0 1.8mm 0; }
  .lead { font-size: 10pt; line-height: 1.38; color: #1f2f42; border-left: 4px solid #2E7D82; padding: 1.8mm 0 1.8mm 3.6mm; margin: 0 0 2.4mm 0; }
  table.grid { width: 100%; border-collapse: collapse; }
  table.grid th { background: #EAF4F4; color: #12355B; font-size: 7pt; text-transform: uppercase; letter-spacing: .25px; text-align: left; padding: 1.2mm 1.8mm; }
  table.grid td { border-bottom: 1px solid #E3E9F0; padding: 1.5mm 1.8mm; vertical-align: top; font-size: 8.9pt; }
  table.grid td.code { font-weight: 700; color: #12355B; width: 14mm; }
  table.grid td.n { text-align: right; font-weight: 700; color: #12355B; white-space: nowrap; }
  table.steps { width: 100%; border-collapse: collapse; }
  table.steps td { border-bottom: 1px solid #E3E9F0; padding: 1.4mm 1.8mm; vertical-align: top; }
  table.steps td.num { width: 8mm; font-family: Georgia, serif; font-size: 13pt; color: #2E7D82; font-weight: 700; }
  table.steps .pname { font-weight: 700; color: #12355B; }
  table.steps .how { font-size: 8.9pt; color: #33475b; margin-top: 0.3mm; }
  .thumbs { display: flex; gap: 2.2mm; margin: 0 0 2mm 0; }
  .thumbs .cell { flex: 1; text-align: center; }
  .thumbs img { width: 100%; height: 20mm; object-fit: contain; border: 1px solid #E3E9F0; background: #f7f9fb; }
  .thumbs .lbl { font-size: 6.8pt; color: #44576b; margin-top: 0.7mm; font-weight: 700; }
  .hero { display: flex; gap: 4.5mm; align-items: flex-start; margin: 0 0 2mm 0; }
  .hero img { width: 34mm; height: auto; display: block; border: 1px solid #E3E9F0; }
  .hero .txt { flex: 1; }
  .acids { width: 100%; border-collapse: collapse; }
  .acids th { background: #EAF4F4; color: #12355B; font-size: 7pt; text-transform: uppercase; text-align: left; padding: 1.1mm 1.8mm; }
  .acids td { border-bottom: 1px solid #E3E9F0; padding: 1.2mm 1.8mm; font-size: 9pt; }
  .acids td.n { text-align: right; font-weight: 700; color: #12355B; }
  .callout { background: #EAF4F4; border-left: 4px solid #2E7D82; padding: 2mm 3.2mm; font-size: 9pt; margin: 2mm 0; }
  .warn { background: #FBECEA; border-left: 4px solid #B3261E; padding: 1.8mm 3mm; font-size: 8.7pt; margin: 1.6mm 0 0 0; }
  .warn strong { color: #B3261E; }
  ul.tight { margin: 0 0 0 4.2mm; }
  ul.tight li { margin: 0 0 1.1mm 0; color: #1f2f42; }
  .two { display: flex; gap: 4mm; }
  .two .col { flex: 1; }
  .after { display: flex; gap: 2.6mm; margin-top: 1.6mm; }
  .after .cell { flex: 1; text-align: center; }
  .after img { width: 100%; height: 24mm; object-fit: contain; }
  .after .lbl { font-size: 7pt; color: #44576b; margin-top: 0.8mm; }
  a { color: #12355B; font-weight: 700; text-decoration: none; }
  .footer { position: absolute; bottom: 6mm; left: 15mm; right: 15mm; font-size: 7pt; color: #7a8896; border-top: 1px solid #E3E9F0; padding-top: 1.3mm; }
`

function page(inner) {
  return `<div class="page">
    <div class="letterhead"><img src="${HEADER}" alt="GENOSYS Middle East FZ-LLC" /></div>
    ${inner}
    <div class="footer">GENOSYS Middle East FZ-LLC · Official UAE Distributor · sales@genosys.ae · +971 58 548 7665 · www.genosys.ae &nbsp;|&nbsp; Prepared for Madalina Bogdan, ToneTrendz · 26 August 2026</div>
  </div>`
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Power Solutions + SRS Protocol — Madalina Bogdan</title>
<style>${css}</style>
</head>
<body>
${page(`
  <div class="exhibit">Professional chair protocol</div>
  <h1>POWER SOLUTION ampoules<br/>and SKIN RENEWAL PEELING (SRS)</h1>
  <div class="cover-meta">Prepared for <strong>Madalina Bogdan · ToneTrendz</strong> · 26 August 2026</div>
  <hr class="rule" />
  <div class="lead">Two different products. The ampoule is leave-on: cleanse, open, apply, absorb. The peel sits 15–20 minutes and comes off with cold water. One 2 ml vial is one client. Ten vials in every box.</div>
  <div class="thumbs">
    <div class="cell"><img src="${P.hes}" alt="HES" /><div class="lbl">HES</div></div>
    <div class="cell"><img src="${P.cvs}" alt="CVS" /><div class="lbl">CVS</div></div>
    <div class="cell"><img src="${P.cts}" alt="CTS" /><div class="lbl">CTS</div></div>
    <div class="cell"><img src="${P.pcs}" alt="PCS" /><div class="lbl">PCS</div></div>
    <div class="cell"><img src="${P.sws}" alt="SWS" /><div class="lbl">SWS</div></div>
    <div class="cell"><img src="${P.aws}" alt="AWS" /><div class="lbl">AWS</div></div>
  </div>
  <h2>Which Power Solution — pick by the skin</h2>
  <table class="grid">
    <tr><th>Code</th><th>Full name</th><th>Carton job</th><th>Give it to</th></tr>
    <tr><td class="code">HES</td><td>HA Volume Enhancing Solution</td><td>Firming and hydration</td><td>Dry, tight, thirsty skin</td></tr>
    <tr><td class="code">CVS</td><td>Concentrated Vitality Solution</td><td>Skin nourishment</td><td>Tired, dull, depleted skin</td></tr>
    <tr><td class="code">CTS</td><td>Cytokine Concentrate Solution</td><td>Improvement of skin texture</td><td>Rough, uneven, soft-focus needed</td></tr>
    <tr><td class="code">PCS</td><td>Problem Control Solution</td><td>Oil and sebum control</td><td>Shine, congested T-zone, blemishes</td></tr>
    <tr><td class="code">SWS</td><td>Skin Depigmenting &amp; Whitening Solution</td><td>Tone evening: arbutin 2%</td><td>Spots, uneven tone, leftover marks</td></tr>
    <tr><td class="code">AWS</td><td>Anti-Wrinkle Solution</td><td>Lines and firmness: adenosine 0.04%</td><td>Expression lines, loss of bounce</td></tr>
  </table>
  <h2 class="alt">How to use one Power Solution vial</h2>
  <table class="steps">
    <tr><td class="num">1</td><td><div class="pname">Cleanse</div><div class="how">Wash the face. Pat dry. The carton starts on clean skin.</div></td></tr>
    <tr><td class="num">2</td><td><div class="pname">Open one vial</div><div class="how">Snap the cap. One 2 ml vial is one client, one visit. Ten in the box.</div></td></tr>
    <tr><td class="num">3</td><td><div class="pname">Apply</div><div class="how">Work the whole face. Two millilitres covers face and neck without stretching it thin. Keep off the eyes.</div></td></tr>
    <tr><td class="num">4</td><td><div class="pname">Let it absorb</div><div class="how">Leave-on. Do not rinse. Give it a minute before cream or mask.</div></td></tr>
    <tr><td class="num">5</td><td><div class="pname">Finish, then discard</div><div class="how">Moisturiser, then sunscreen if it is daytime. An opened vial does not go back in the fridge. Use it or throw it.</div></td></tr>
  </table>
`)}
${page(`
  <h2>Booking the course — how often for the client</h2>
  <p style="margin:0 0 2mm 0;color:#1f2f42">The carton does not print a weekly number. This is how we book it so she can sell a result, not a one-off wipe.</p>
  <table class="grid">
    <tr><th>Treatment</th><th>How often</th><th>Course</th><th>Vials used</th></tr>
    <tr><td>Power Solution only</td><td>1–2 times a week</td><td>6–10 visits</td><td>1 vial per visit</td></tr>
    <tr><td>SRS peel only</td><td>Every 2–4 weeks</td><td>4–6 peels</td><td>1 vial per peel</td></tr>
    <tr><td>SRS + Power Solution, same chair</td><td>Every 3–4 weeks</td><td>4–6 combined visits</td><td>1 SRS + 1 Power Solution</td></tr>
  </table>
  <div class="callout">First-time client: do SRS alone. If the skin stays calm, add the ampoule on visit two. Do not stack another peel, a roller or spicules on the same day as SRS.</div>
  <h2 class="alt">Trade price — box of 10 vials</h2>
  <table class="grid">
    <tr><th>Product</th><th>Pack</th><th class="n">Clinic / box</th><th>Treatments in the box</th></tr>
    <tr><td>Any Power Solution (HES / CVS / CTS / PCS / SWS / AWS)</td><td>2 ml × 10</td><td class="n">AED 290</td><td>10 client sessions</td></tr>
    <tr><td>SKIN RENEWAL PEELING SYSTEM (SRS)</td><td>2 ml × 10</td><td class="n">AED 405</td><td>10 peel sessions</td></tr>
  </table>
  <p style="margin:1.6mm 0 0 0;color:#44576b;font-size:8.4pt">Clinic list 2026. Same price for every Power Solution code. Pages: <a href="https://genosys.ae/products/4">HES</a> · <a href="https://genosys.ae/products/5">CVS</a> · <a href="https://genosys.ae/products/6">CTS</a> · <a href="https://genosys.ae/products/7">PCS</a> · <a href="https://genosys.ae/products/8">SWS</a> · <a href="https://genosys.ae/products/9">AWS</a> · <a href="https://genosys.ae/products/13">SRS</a></p>
  <h2>After the ampoule — if the skin wants comfort</h2>
  <div class="after">
    <div class="cell"><img src="${P.peptide}" alt="Peptide Gel Mask" /><div class="lbl">Peptide Gel Mask<br/>optional, after absorb</div></div>
    <div class="cell"><img src="${P.post}" alt="Soothing Repair Postcream" /><div class="lbl">Soothing Repair Postcream<br/>thin layer</div></div>
    <div class="cell"><img src="${P.hydro}" alt="Hydro Soothing Cream" /><div class="lbl">Hydro Soothing Cream<br/>if you already have it</div></div>
    <div class="cell"><img src="${P.spf}" alt="Ultra Shield Sun Cream" /><div class="lbl">Sunscreen<br/>same day, every time</div></div>
  </div>
  <h2 class="alt">Power Solution — do / do not</h2>
  <div class="two">
    <div class="col">
      <ul class="tight">
        <li>One fresh vial per client per visit.</li>
        <li>Leave it on. Do not rinse it off.</li>
        <li>Keep it off the eyes. Cool water if it gets there.</li>
        <li>Match the code to the concern. Do not mix two codes in one vial.</li>
      </ul>
    </div>
    <div class="col">
      <ul class="tight">
        <li>Do not save an opened vial for the next client.</li>
        <li>Do not use during pregnancy or breastfeeding. The carton prints this.</li>
        <li>Do not sell it as a daily home toner. It is a session product.</li>
        <li>Do not put it on broken or already stinging skin.</li>
      </ul>
    </div>
  </div>
`)}
${page(`
  <div class="hero">
    <img src="${P.srs}" alt="GENOSYS SKIN RENEWAL PEELING SYSTEM" />
    <div class="txt">
      <div class="exhibit">The peel</div>
      <h1 style="font-size:15pt;margin-bottom:1.4mm">SKIN RENEWAL<br/>PEELING SYSTEM (SRS)</h1>
      <div class="lead" style="margin-bottom:1.6mm">A professional soft peel. Glycolic 15% + lactic 13.5% + mandelic 2%. One 2 ml vial is one session. Not the home cellulose roll (Epi).</div>
      <table class="acids">
        <tr><th>Acid</th><th class="n">In the formula</th></tr>
        <tr><td>Glycolic acid</td><td class="n">15%</td></tr>
        <tr><td>Lactic acid</td><td class="n">13.5%</td></tr>
        <tr><td>Mandelic acid</td><td class="n">2%</td></tr>
      </table>
    </div>
  </div>
  <h2>How to use one SRS vial</h2>
  <table class="steps">
    <tr><td class="num">1</td><td><div class="pname">Patch test first</div><div class="how">Inner arm before the first face. If the skin stays calm, you can book the face.</div></td></tr>
    <tr><td class="num">2</td><td><div class="pname">Clean, dry, intact skin</div><div class="how">No cuts, no scratches, no open or already irritated areas. Face only.</div></td></tr>
    <tr><td class="num">3</td><td><div class="pname">Apply evenly</div><div class="how">Open one 2 ml vial. Thin even layer. Keep off the lips and the eye area.</div></td></tr>
    <tr><td class="num">4</td><td><div class="pname">Leave 15–20 minutes</div><div class="how">First time: 15 minutes. Later visits: up to 20. Sit still. Nothing layered on top of the peel.</div></td></tr>
    <tr><td class="num">5</td><td><div class="pname">Rinse with cold water</div><div class="how">Rinse thoroughly. Cold water takes the peel off. There is no separate neutralize step.</div></td></tr>
    <tr><td class="num">6</td><td><div class="pname">Sunscreen after</div><div class="how">The carton asks for it. Same day, and the days that follow.</div></td></tr>
  </table>
  <h2 class="alt">Same chair — SRS then Power Solution</h2>
  <table class="steps">
    <tr><td class="num">1</td><td><div class="pname">Peel first</div><div class="how">SRS steps 1–5. Rinse with cold water. Pat dry. Look at the skin.</div></td></tr>
    <tr><td class="num">2</td><td><div class="pname">Only if calm</div><div class="how">No sting, no swelling, no broken surface. If it is hot or angry, stop. Peptide mask or soothing cream, sunscreen, send her home. Ampoule next visit.</div></td></tr>
    <tr><td class="num">3</td><td><div class="pname">Then the ampoule</div><div class="how">One Power Solution vial on the rinsed face. Leave on. Then cream and sunscreen.</div></td></tr>
  </table>
  <div class="warn"><strong>High-AHA peel.</strong> Do not leave SRS longer than 20 minutes. Do not neutralize with anything else. Do not needle, roll or layer another peel on the same evening. If anything is unclear, message us before you open a vial. External use only. Dermatologically tested. Made in Korea.</div>
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
      const first = p.querySelector('h1, h2, .exhibit').getBoundingClientRect()
      const extras = [...p.querySelectorAll('p, table, ul, .lead, .hero, .after, .thumbs, .callout, .warn, .two')]
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
