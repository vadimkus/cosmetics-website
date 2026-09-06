#!/usr/bin/env node

/**
 * Detailed customer-facing GENOSYS SRS professional protocol.
 * Output: ~/Desktop/GENOSYS_SRS_Detailed_Professional_Protocol.pdf
 * No printing and no external system mutation.
 */

const fs = require('fs')
const os = require('os')
const path = require('path')
const { chromium } = require('playwright')

const ROOT = path.join(__dirname, '..')
const DESKTOP = path.join(os.homedir(), 'Desktop')
const ORDERS = path.join(DESKTOP, 'orders')
const OUT_PDF = path.join(DESKTOP, 'GENOSYS_SRS_Detailed_Professional_Protocol.pdf')

const image = (...parts) => {
  const full = path.join(ROOT, 'public', ...parts)
  const ext = path.extname(full).toLowerCase()
  const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
  return `data:${mime};base64,${fs.readFileSync(full).toString('base64')}`
}

const HEADER = `data:image/png;base64,${fs.readFileSync(path.join(ORDERS, 'Header.png')).toString('base64')}`
const STAMP = `data:image/png;base64,${fs.readFileSync(path.join(ORDERS, 'Stamp.png')).toString('base64')}`

const P = {
  srs: image('images', 'SRS.jpg'),
  cleanser: image('images', 'cleanser', 'main_clean.jpeg'),
  peptide: image('images', 'peptide_mask', 'main.jpeg'),
  collagen: image('images', 'collagen_mask', 'Main.jpeg'),
  sea: image('images', 'sea_algae', 'Main.jpeg'),
  post: image('images', 'SRC.jpg'),
  hydro: image('images', 'HSC.jpg'),
  spf: image('images', 'ultra', 'main.jpeg'),
}

const css = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #fff; color: #172231; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 9.3pt; line-height: 1.38; }
  .page { width: 210mm; height: 296.5mm; page-break-after: always; position: relative; padding: 38mm 15mm 17mm; overflow: hidden; background: #fff; }
  .page:last-child { page-break-after: auto; }
  .letterhead { position: absolute; top: 0; left: 0; width: 210mm; height: 35mm; overflow: hidden; }
  .letterhead img { display: block; width: 210mm; }
  h1, h2, h3, p { margin-top: 0; }
  h1 { font-family: Georgia, "Times New Roman", serif; color: #12355b; font-size: 22pt; line-height: 1.12; margin-bottom: 2mm; }
  h2 { font-family: Georgia, "Times New Roman", serif; color: #12355b; font-size: 15pt; line-height: 1.2; margin: 0 0 2mm; }
  h3 { color: #12355b; font-size: 10.4pt; margin: 3mm 0 1mm; }
  .eyebrow { color: #2e7d82; font-size: 7.6pt; font-weight: 700; letter-spacing: 1.55px; text-transform: uppercase; margin-bottom: 1mm; }
  .meta { color: #52657a; font-size: 8.6pt; margin-bottom: 2.5mm; }
  .rule { border: 0; border-top: 2.5px solid #12355b; margin: 2mm 0 3mm; }
  .lead { border-left: 4px solid #2e7d82; padding: 2.2mm 0 2.2mm 4mm; font-size: 10.2pt; color: #293d54; margin: 2.5mm 0; }
  .hero { display: grid; grid-template-columns: 43mm 1fr; gap: 5mm; align-items: start; margin: 2.5mm 0; }
  .hero img { width: 43mm; max-height: 62mm; object-fit: contain; border: 1px solid #dce4ec; padding: 2mm; }
  .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2.2mm; margin: 3mm 0; }
  .card { border: 1px solid #d8e1e9; padding: 2.7mm; min-height: 22mm; }
  .card .value { color: #12355b; font-family: Georgia, serif; font-size: 16pt; font-weight: 700; line-height: 1.1; }
  .card .label { color: #607286; font-size: 7.7pt; margin-top: 1mm; }
  .callout { background: #eaf4f4; border-left: 4px solid #2e7d82; padding: 2.5mm 3.5mm; margin: 2.5mm 0; }
  .callout.red { background: #fbecea; border-left-color: #b3261e; }
  .callout.grey { background: #f4f6f9; border: 1px solid #dce4ec; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #12355b; color: #fff; font-size: 7.4pt; text-transform: uppercase; letter-spacing: .25px; text-align: left; padding: 1.6mm 1.8mm; }
  th.alt { background: #2e7d82; }
  td { border-bottom: 1px solid #e0e7ed; padding: 1.45mm 1.8mm; vertical-align: top; }
  td.num, th.num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  td.center, th.center { text-align: center; }
  .steps td:first-child { width: 10mm; text-align: center; font-family: Georgia, serif; color: #2e7d82; font-size: 13pt; font-weight: 700; }
  .timeline td:first-child { width: 25mm; color: #12355b; font-weight: 700; }
  ul { margin: 1mm 0 2mm 5mm; padding-left: 4mm; }
  li { margin-bottom: 1.1mm; }
  .line { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; margin: 2.5mm 0; }
  .product { text-align: center; }
  .product img { width: 100%; height: 27mm; object-fit: contain; }
  .product .name { color: #12355b; font-size: 7.6pt; font-weight: 700; line-height: 1.2; margin-top: 1mm; }
  .small { color: #607286; font-size: 7.8pt; }
  .footer { position: absolute; bottom: 5.5mm; left: 15mm; right: 15mm; border-top: 1px solid #dce4ec; padding-top: 1.4mm; color: #788797; font-size: 7pt; display: flex; justify-content: space-between; }
  .stamp { width: 47mm; display: block; margin: 3mm 0 0 auto; }
  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
  a { color: #12355b; text-decoration: none; font-weight: 700; }
`

function page(content, pageNo) {
  return `<section class="page">
    <div class="letterhead"><img src="${HEADER}" alt="GENOSYS Middle East FZ-LLC"></div>
    ${content}
    <div class="footer">
      <span>GENOSYS Middle East FZ-LLC · Official UAE Distributor · sales@genosys.ae · +971 58 548 7665</span>
      <span>${pageNo} / 5</span>
    </div>
  </section>`
}

function steps(rows) {
  return rows.map(([title, body], index) => `<tr><td>${index + 1}</td><td><strong>${title}</strong><br>${body}</td></tr>`).join('')
}

const fullInci =
  'Aqua (Water), Glycerin, Glycolic Acid, Lactic Acid, Sodium Hydroxide, Mandelic Acid, Phytic Acid, sh-Polypeptide-7, Scutellaria Baicalensis Root Extract, Citrus Junos Fruit Extract, Camellia Sinensis Leaf Extract, Lactobacillus Ferment Lysate Filtrate, Houttuynia Cordata Extract, Artemisia Vulgaris Extract, Artemisia Princeps Extract, Chamaecyparis Obtusa Water, Hydroxyethylcellulose, Lecithin, Sodium Phosphate, Sodium Chloride, Glycine, Lysine, Disodium EDTA.'

const html = `<!doctype html><html><head><meta charset="utf-8"><title>GENOSYS SRS Detailed Professional Protocol</title><style>${css}</style></head><body>

${page(`
  <div class="eyebrow">GENOSYS Professional Line · Detailed Protocol</div>
  <h1>SKIN RENEWAL<br>PEELING SYSTEM · SRS</h1>
  <div class="meta">Professional AHA peel · 2 ml × 10 vials · <a href="https://genosys.ae/products/13">genosys.ae/products/13</a> · 31 August 2026</div>
  <hr class="rule">
  <div class="hero">
    <img src="${P.srs}" alt="GENOSYS Skin Renewal Peeling System">
    <div>
      <p class="lead"><strong>SRS is the intensive peel inside the GENOSYS professional facial line:</strong> a measured single-use vial for smoother, brighter, more even-looking skin.</p>
      <h3>Benefits</h3>
      <ul>
        <li>Soft professional peeling of dead surface cells</li>
        <li>Smoother-looking skin texture</li>
        <li>Brighter, fresher-looking surface</li>
        <li>More even-looking skin tone</li>
        <li>Encourages surface cell turnover</li>
        <li>Single-use 2 ml format for consistent treatment control</li>
      </ul>
    </div>
  </div>
  <div class="summary">
    <div class="card"><div class="value">15%</div><div class="label">Glycolic acid</div></div>
    <div class="card"><div class="value">13.5%</div><div class="label">Lactic acid</div></div>
    <div class="card"><div class="value">2%</div><div class="label">Mandelic acid</div></div>
    <div class="card"><div class="value">15–20</div><div class="label">Minutes, then cold rinse</div></div>
  </div>
  <div class="callout"><strong>The peel engine:</strong> the three AHAs total 30.5%. Glycerin makes up 25% of the vial, and the finished product measures pH 3.02 within its written 3.00–5.00 specification.</div>
  <div class="callout red"><strong>This is not EPI Peeling Gel.</strong> EPI is the homecare cellulose roll massaged briefly and rinsed. SRS is a professional high-AHA peel that sits for 15–20 minutes and is removed with cold water.</div>
  <p class="small">Benefits above follow the registered GENOSYS carton wording. No clinical percentage result is claimed because no finished-product efficacy trial is on file.</p>
`, 1)}

${page(`
  <div class="eyebrow">Consultation · Selection</div>
  <h2>Choose the right face before opening the vial</h2>
  <hr class="rule">
  <div class="two">
    <div>
      <h3>A suitable client</h3>
      <ul>
        <li>Wants a professional AHA peel rather than a weekly home polish</li>
        <li>Has intact, calm skin on treatment day</li>
        <li>Has dullness, rough surface texture, or uneven-looking tone</li>
        <li>Can follow sunscreen and aftercare instructions</li>
        <li>Has completed a patch test before the first treatment</li>
      </ul>
    </div>
    <div>
      <h3>Do not treat today</h3>
      <ul>
        <li>Broken, scratched, open, or irritated skin</li>
        <li>Active infection, active herpes, inflamed dermatitis, or severe flare</li>
        <li>Fresh sunburn, recent tanning, or unusually sensitised skin</li>
        <li>Recent peel, laser, microneedling, or other intensive procedure before full recovery</li>
        <li>Client cannot keep the product away from eyes, lips, and mucous membranes</li>
      </ul>
    </div>
  </div>
  <h3>Consultation checklist</h3>
  <table>
    <tr><th>Ask and record</th><th>Why it changes the session</th></tr>
    <tr><td>Current acids, retinoids, exfoliants, and prescription skin treatment</td><td>A compromised or over-exfoliated barrier increases irritation risk.</td></tr>
    <tr><td>Recent procedures and date</td><td>SRS must not be stacked onto skin still recovering.</td></tr>
    <tr><td>History of eczema, dermatitis, allergies, herpes, or unusual reactions</td><td>May require postponement, patch testing, or medical guidance.</td></tr>
    <tr><td>Pregnancy, breastfeeding, and medical conditions</td><td>Follow clinic policy and obtain medical clearance where appropriate.</td></tr>
    <tr><td>Sun exposure, holiday, or outdoor plans</td><td>Freshly peeled skin requires disciplined UV protection.</td></tr>
  </table>
  <h3>Patch test</h3>
  <p>Before the first full application, test a small area according to clinic policy and observe for an abnormal response. The carton requires a patch test because the AHA concentration is high.</p>
  <div class="callout red"><strong>Stop before opening the vial</strong> if the skin is not calm and intact. Reschedule rather than trying to “work around” an unsafe area.</div>
  <h3>Room setup</h3>
  <ul>
    <li>Gloves, headband, cotton pads, fan brush or gauze, timer, cool water, clean towels</li>
    <li>One sealed SRS vial, one selected calming mask, Postcream, and sunscreen</li>
    <li>Client record ready for photographs, start/end time, skin response, and aftercare</li>
  </ul>
`, 2)}

${page(`
  <div class="eyebrow">Chair Protocol · One Vial</div>
  <h2>Cleanse. Apply. Observe. Rinse cold.</h2>
  <hr class="rule">
  <table class="steps">
    ${steps([
      ['Confirm consent and baseline', 'Review the consultation, confirm the patch-test outcome, photograph consistently, and document the skin condition before treatment.'],
      ['Remove makeup', 'Use Skin Defender around lips and eyes where required, then remove all residue.'],
      ['Cleanse', 'Apply Snow O₂ Cleanser to dry skin, allow bubbles to form, massage with wet fingertips, rinse with lukewarm water, and pat completely dry.'],
      ['Protect sensitive borders', 'Keep SRS away from eyelids, lips, nostrils, mucous membranes, and any compromised area.'],
      ['Open one 2 ml vial', 'One sealed vial is one face and one session. Do not keep an opened vial for another client.'],
      ['Apply evenly', 'Use a fan brush or gauze to spread a thin, controlled layer over the selected facial area. Do not microneedle or roll the peel.'],
      ['Start the timer', 'Leave for 15–20 minutes while continuously observing the client and visible response. Do not leave the client unattended.'],
      ['Rinse with cold water', 'Remove thoroughly with cold water. There is no separate neutraliser step on the GENOSYS carton.'],
      ['Calm and protect', 'Pat dry, apply the selected GENOSYS calming finish on intact skin, and finish with sunscreen before daylight exposure.'],
    ])}
  </table>
  <div class="callout"><strong>Exposure control:</strong> 15–20 minutes is the printed treatment window. For a first session, stay at the conservative end of that window. Rinse earlier if burning is strong or the response becomes abnormal.</div>
  <div class="callout red"><strong>Stop and rinse immediately</strong> for strong burning, rapidly increasing redness, swelling, hives, blistering, or client distress. Persistent or unusual reactions require medical assessment.</div>
  <p class="small">Do not combine SRS with EPI, another acid peel, a needle roller, spicule treatment, or another intensive procedure in the same visit.</p>
`, 3)}

${page(`
  <div class="eyebrow">GENOSYS Line · Before and After SRS</div>
  <h2>The peel is one step inside a complete facial</h2>
  <hr class="rule">
  <div class="line">
    <div class="product"><img src="${P.cleanser}" alt="Snow O2 Cleanser"><div class="name">1 · Snow O₂ Cleanser<br>Clean, dry preparation</div></div>
    <div class="product"><img src="${P.srs}" alt="SRS"><div class="name">2 · SRS<br>15–20 minutes</div></div>
    <div class="product"><img src="${P.peptide}" alt="Peptide Gel Mask"><div class="name">3 · Calming mask<br>Choose one</div></div>
    <div class="product"><img src="${P.post}" alt="Postcream"><div class="name">4 · Postcream<br>Intact skin only</div></div>
  </div>
  <h3>Choose one calming mask after the cold rinse</h3>
  <table>
    <tr><th>GENOSYS mask</th><th>Chair use</th><th>Time</th></tr>
    <tr><td><strong>Peptide Gel Mask</strong></td><td>Premium gel-sheet finish when the client wants a richer post-treatment step</td><td>20–40 min</td></tr>
    <tr><td><strong>Intensive Repair Collagen Mask</strong></td><td>Simple sheet-mask finish for comfort after the peel</td><td>15–20 min</td></tr>
    <tr><td><strong>Soothing Bomb Sea Algae Mask</strong></td><td>Simple soothing sheet-mask finish</td><td>15–20 min</td></tr>
  </table>
  <h3>Finish</h3>
  <div class="line">
    <div class="product"><img src="${P.collagen}" alt="Collagen Mask"><div class="name">Collagen Mask</div></div>
    <div class="product"><img src="${P.sea}" alt="Sea Algae Mask"><div class="name">Sea Algae Mask</div></div>
    <div class="product"><img src="${P.hydro}" alt="Hydro Soothing Cream"><div class="name">Hydro Soothing Cream<br>if extra comfort is needed</div></div>
    <div class="product"><img src="${P.spf}" alt="Ultra Shield SPF50"><div class="name">Daily sunscreen<br>mandatory after peeling</div></div>
  </div>
  <div class="callout"><strong>Postcream rule:</strong> apply a thin layer only when the skin is intact but feels warm, pink, or tight. It is not a wound dressing and must not go on open or broken skin.</div>
  <h3>First 72 hours</h3>
  <table class="timeline">
    <tr><td>Treatment day</td><td>Gentle cleanse if needed, calming moisturiser, sunscreen. No makeup if the skin is reactive.</td></tr>
    <tr><td>Days 1–3</td><td>Keep the routine simple. No acids, retinoids, scrubs, brushes, waxing, sauna, or picking.</td></tr>
    <tr><td>Day 4 onward</td><td>Resume normal products only when the skin is calm and no longer sensitised.</td></tr>
  </table>
`, 4)}

${page(`
  <div class="eyebrow">Course Planning · Quality · Quick Reference</div>
  <h2>Build results with recovery time, not extra intensity</h2>
  <hr class="rule">
  <div class="summary">
    <div class="card"><div class="value">1 vial</div><div class="label">Per face, per session</div></div>
    <div class="card"><div class="value">10</div><div class="label">Treatments in one box</div></div>
    <div class="card"><div class="value">3–4 wk</div><div class="label">Practical professional interval</div></div>
    <div class="card"><div class="value">pH 3.02</div><div class="label">Measured finished product</div></div>
  </div>
  <h3>Course framework</h3>
  <p>Begin with one treatment and review the skin after full recovery. Where repeated peeling is appropriate, allow approximately 3–4 weeks between sessions. Adjust or stop according to the client’s response. The carton itself specifies the application and 15–20-minute exposure, not a mandatory number of sessions.</p>
  <table>
    <tr><th>Do</th><th>Do not</th></tr>
    <tr><td>Patch test before first use</td><td>Do not apply to broken or irritated skin</td></tr>
    <tr><td>Use one fresh vial per face</td><td>Do not exceed 20 minutes</td></tr>
    <tr><td>Observe throughout exposure</td><td>Do not neutralise with an invented extra step</td></tr>
    <tr><td>Rinse thoroughly with cold water</td><td>Do not combine with EPI, rollers, spicules, or another peel</td></tr>
    <tr><td>Use sunscreen after every session</td><td>Do not promise clinical percentages that have not been tested</td></tr>
  </table>
  <h3>Formula and quality</h3>
  <table>
    <tr><th>Specification</th><th>Verified detail</th></tr>
    <tr><td>Function</td><td>Soft peeling</td></tr>
    <tr><td>Primary acids</td><td>Glycolic 15% · Lactic 13.5% · Mandelic 2%</td></tr>
    <tr><td>Support base</td><td>Glycerin 25% · Sodium hydroxide 2.7%</td></tr>
    <tr><td>Measured pH</td><td>3.02 within a 3.00–5.00 specification</td></tr>
    <tr><td>Pack</td><td>2 ml × 10 sealed vials</td></tr>
    <tr><td>Testing / origin</td><td>Dermatologically tested · Made in Korea</td></tr>
  </table>
  <h3>Full INCI</h3>
  <p class="small">${fullInci}</p>
  <div class="callout grey"><strong>Storage and incident response:</strong> keep cool and dry, away from direct sunlight and children. If redness, swelling, itching, or irritation occurs, stop use and seek appropriate medical advice.</div>
  <img class="stamp" src="${STAMP}" alt="Digitally signed">
`, 5)}

</body></html>`

async function main() {
  const browser = await chromium.launch()
  const pageObj = await browser.newPage({ viewport: { width: 794, height: 1123 } })
  await pageObj.setContent(html, { waitUntil: 'load' })

  const measure = await pageObj.evaluate(() =>
    [...document.querySelectorAll('.page')].map((node, index) => {
      const header = node.querySelector('.letterhead').getBoundingClientRect()
      const title = node.querySelector('h1, h2').getBoundingClientRect()
      const footer = node.querySelector('.footer').getBoundingClientRect()
      const content = [...node.children].filter((child) => !child.classList.contains('letterhead') && !child.classList.contains('footer'))
      const last = content[content.length - 1].getBoundingClientRect()
      return {
        page: index + 1,
        titleClear: title.top >= header.bottom - 2,
        footerGap: Math.round(footer.top - last.bottom),
        overlap: last.bottom > footer.top - 5,
      }
    })
  )

  if (measure.some((item) => !item.titleClear || item.overlap)) {
    throw new Error(`Layout check failed: ${JSON.stringify(measure)}`)
  }

  await pageObj.pdf({
    path: OUT_PDF,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  })

  await browser.close()
  console.log(JSON.stringify({ ok: true, output: OUT_PDF, bytes: fs.statSync(OUT_PDF).size, measure }, null, 2))
}

main().catch((error) => {
  console.error(error.stack || error.message)
  process.exit(1)
})
