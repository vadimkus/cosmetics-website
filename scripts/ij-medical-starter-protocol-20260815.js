/**
 * GENOSYS Clinic Protocol — IJ Medical Center starter pack
 * Output: ~/Desktop/orders/GENOSYS_IJ_Medical_Starter_Pack_Protocol.pdf
 */
const fs = require('fs')
const path = require('path')
const os = require('os')

const ROOT = path.join(__dirname, '..')
const IMG = (...p) => {
  const full = path.join(ROOT, 'public', ...p)
  const ext = full.endsWith('.png') ? 'image/png' : 'image/jpeg'
  return `data:${ext};base64,${fs.readFileSync(full).toString('base64')}`
}
const ORDERS = path.join(os.homedir(), 'Desktop', 'orders')
const HEADER = `data:image/png;base64,${fs.readFileSync(path.join(ORDERS, 'Header.png')).toString('base64')}`

const P = {
  snow: IMG('images', 'cleanser', 'main_clean.jpeg'),
  epi: IMG('images', 'epi', 'main.jpeg'),
  srs: IMG('images', 'SRS.jpg'),
  algae: IMG('images', 'sea_algae', 'Main.jpeg'),
  serum: IMG('images', 'radiance_serum', 'main.jpeg'),
  hydro: IMG('images', 'HSC.jpg'),
  radiance: IMG('images', 'radiance', 'main.jpeg'),
  post: IMG('images', 'SRC.jpg'),
  spf: IMG('images', 'sun', 'main.jpeg'),
}

const css = `
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; font-size: 10pt; line-height: 1.4; }
  .page { width: 210mm; height: 296.5mm; page-break-after: always; position: relative; padding: 34mm 16mm 16mm 16mm; overflow: hidden; background: #fff; }
  .page:last-child { page-break-after: auto; }
  .letterhead { position: absolute; top: 0; left: 0; width: 210mm; }
  .letterhead img { width: 100%; display: block; }
  h1 { font-family: Georgia, 'Times New Roman', serif; font-size: 22pt; color: #12355B; font-weight: 700; line-height: 1.15; }
  h2.action { font-family: Georgia, 'Times New Roman', serif; font-size: 14.5pt; color: #12355B; line-height: 1.25; margin: 0 0 2mm 0; }
  .exhibit { font-size: 8pt; letter-spacing: 1.6px; text-transform: uppercase; color: #2E7D82; font-weight: 700; margin-bottom: 1.2mm; }
  .rule { border: none; border-top: 2.5px solid #12355B; margin: 2.5mm 0 3.5mm 0; }
  .cover-meta { font-size: 10pt; color: #44576b; margin: 2.5mm 0 4mm 0; }
  .lead { font-size: 11.2pt; line-height: 1.45; color: #1f2f42; border-left: 4px solid #2E7D82; padding: 2mm 0 2mm 4.5mm; margin: 3.5mm 0; }
  .lead strong { color: #12355B; }
  .strip { display: table; width: 100%; border-spacing: 2mm 0; margin: 2mm -2mm 1mm; }
  .strip .cell { display: table-cell; width: 11%; vertical-align: top; text-align: center; }
  .strip img { width: 100%; height: 22mm; object-fit: contain; }
  .strip .lbl { font-size: 6.8pt; color: #44576b; margin-top: 0.8mm; line-height: 1.15; }
  .callout-red { background: #FBECEA; border-left: 4px solid #B3261E; padding: 2.6mm 3.5mm; font-size: 9.3pt; margin: 3mm 0; }
  .callout-red strong { color: #B3261E; }
  .callout-teal { background: #EAF4F4; border-left: 4px solid #2E7D82; padding: 2.6mm 3.5mm; font-size: 9.3pt; margin: 3mm 0; }
  .callout-grey { background: #F4F6F9; border: 1px solid #DDE4EC; padding: 2.6mm 3.5mm; font-size: 9pt; margin: 2.5mm 0; }
  table.steps { width: 100%; border-collapse: collapse; margin: 2mm 0; }
  table.steps td, table.steps th { border-bottom: 1px solid #E3E9F0; padding: 1.9mm 2mm; vertical-align: middle; text-align: left; }
  table.steps th { background: #12355B; color: #fff; font-size: 8.8pt; letter-spacing: .3px; border-bottom: none; padding: 1.8mm 2mm; }
  table.steps th.alt { background: #2E7D82; }
  table.steps td.num { width: 8mm; font-family: Georgia, serif; font-size: 12.5pt; color: #2E7D82; text-align: center; font-weight: 700; }
  table.steps td.pic { width: 16mm; }
  table.steps td.pic img { width: 14mm; height: 14mm; object-fit: contain; }
  table.steps .pname { font-weight: 700; color: #12355B; }
  table.steps .how { font-size: 8.9pt; color: #33475b; }
  table.cal { width: 100%; border-collapse: collapse; margin-top: 2mm; }
  table.cal th, table.cal td { border: 1px solid #D8E0EA; padding: 1.7mm 2mm; font-size: 8.7pt; text-align: left; }
  table.cal th { background: #12355B; color: #fff; }
  table.cal td.a { background: #EAF4F4; font-weight: 700; color: #12355B; }
  ul.tight { margin: 1mm 0 2mm 5mm; }
  ul.tight li { margin-bottom: 1.2mm; }
  .footer { position: absolute; bottom: 6mm; left: 16mm; right: 16mm; font-size: 7.5pt; color: #7a8896; border-top: 1px solid #E3E9F0; padding-top: 1.5mm; }
  .source { font-size: 7.6pt; color: #7a8896; margin-top: 2mm; }
`

const img = (src) => `<img src="${src}" />`

function page(inner) {
  return `<div class="page">
    <div class="letterhead">${img(HEADER)}</div>
    ${inner}
    <div class="footer">Genosys Middle East FZ-LLC · Official UAE Distributor · sales@genosys.ae · +971 58 548 7665 · www.genosys.ae &nbsp;|&nbsp; Clinic protocol · IJ Medical Center (Attractive Smile) · 15 August 2026</div>
  </div>`
}

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>

${page(`
  <div class="exhibit">Clinic Protocol · Starter Pack</div>
  <h1>Glow Facial + SRS Peel:<br/>IJ Medical Center pack</h1>
  <div class="cover-meta">Prepared for <strong>IJ Medical Center (Attractive Smile)</strong> · Sharjah · Contact Miss Amal · Order <strong>GENCardM260803IJMC</strong> · 15 August 2026</div>
  <hr class="rule"/>

  <p class="lead"><strong>Two tracks, never combined:</strong> Protocol A is a weekly glow facial with EPI. Protocol B is the professional SRS peel — <strong>1 vial = 1 face = 1 treatment</strong>. This pack contains <strong>10 SRS peels</strong>.</p>

  <div class="strip">
    <div class="cell">${img(P.snow)}<div class="lbl">Snow O₂<br/>180 + 500 ml</div></div>
    <div class="cell">${img(P.epi)}<div class="lbl">EPI Peeling<br/>Gel 100 g</div></div>
    <div class="cell">${img(P.srs)}<div class="lbl">SRS Peel<br/>2 ml × 10</div></div>
    <div class="cell">${img(P.algae)}<div class="lbl">Sea Algae<br/>Mask × 1</div></div>
    <div class="cell">${img(P.serum)}<div class="lbl">Multi Vita<br/>Serum 30 ml</div></div>
    <div class="cell">${img(P.hydro)}<div class="lbl">Hydro Cream<br/>50 + 250 g</div></div>
    <div class="cell">${img(P.radiance)}<div class="lbl">Radiance<br/>Cream 50 g</div></div>
    <div class="cell">${img(P.post)}<div class="lbl">Postcream<br/>20 g</div></div>
    <div class="cell">${img(P.spf)}<div class="lbl">Multi Sun<br/>SPF 40</div></div>
  </div>

  <div class="callout-red"><strong>Do not use EPI and SRS on the same visit.</strong> Two peels in one session over-exfoliate. First SRS: patch test 24 h before. No SRS on irritated, broken, inflamed or sunburned skin. Keep off eyes, lips and nostrils.</div>

  <table class="cal">
    <tr><th>In this pack</th><th>Treatments</th></tr>
    <tr><td>SRS 10 × 2 ml</td><td class="a">10 professional peels (10 patients × 1, or fewer patients with repeats)</td></tr>
    <tr><td>EPI Peeling Gel 100 g</td><td>~20–25 glow facials (about 3–5 g per face)</td></tr>
    <tr><td>Sea Algae Mask</td><td>1 only — reserve for first SRS or the most reactive face</td></tr>
    <tr><td>Postcream 20 g</td><td>A few faces — not all 10 peels (100 g is the clinic size)</td></tr>
  </table>

  <p class="source">Source: GENOSYS artwork / clinic usage. SRS leave-on 15–20 min (label); first visit may be shorter under observation.</p>
`)}

${page(`
  <div class="exhibit">Protocol A</div>
  <h2 class="action">Glow Facial — weekly maintenance. No SRS. About 30–35 minutes.</h2>
  <hr class="rule"/>

  <table class="steps">
    <tr><th colspan="3">PROTOCOL A — first visit, sensitive skin, or weeks between peels · 1× per week</th></tr>
    <tr>
      <td class="num">1</td>
      <td class="pic">${img(P.snow)}</td>
      <td><span class="pname">Snow O₂ Cleanser 500 ml</span><br/><span class="how">Apply on dry skin, wait for oxygen bubbles, wet fingers and spread, rinse lukewarm. Pat <strong>fully dry</strong> — EPI goes on dry skin.</span></td>
    </tr>
    <tr>
      <td class="num">2</td>
      <td class="pic">${img(P.epi)}</td>
      <td><span class="pname">EPI Turnover Boosting Peeling Gel</span><br/><span class="how">Thin layer on clean dry face. Circular massage <strong>up to 1 minute</strong> until dead cells roll. Keep off eyes and mouth. Rinse with tepid water.</span></td>
    </tr>
    <tr>
      <td class="num">3</td>
      <td class="pic">${img(P.algae)}</td>
      <td><span class="pname">Sea Algae Mask — optional</span><br/><span class="how">Only if you use the single mask on this facial. 15–20 minutes, then remove. Prefer saving it for Protocol B.</span></td>
    </tr>
    <tr>
      <td class="num">4</td>
      <td class="pic">${img(P.serum)}</td>
      <td><span class="pname">Multi Vita Radiance Serum</span><br/><span class="how">2–3 drops. Press into face and neck.</span></td>
    </tr>
    <tr>
      <td class="num">5</td>
      <td class="pic">${img(P.hydro)}</td>
      <td><span class="pname">Cream</span><br/><span class="how">Calm / redness → <strong>Hydro Soothing Cream 250 g</strong>. Glow finish → <strong>Multi Vita Radiance Cream</strong>.</span></td>
    </tr>
    <tr>
      <td class="num">6</td>
      <td class="pic">${img(P.spf)}</td>
      <td><span class="pname">Multi Sun Cream SPF 40 PA++</span><br/><span class="how">If the patient leaves in daylight.</span></td>
    </tr>
  </table>

  <div class="callout-teal"><strong>Clinic vs take-home:</strong> 500 ml cleanser and 250 g Hydro stay in the treatment room. 180 ml cleanser, 50 g Hydro, Radiance Cream, serum and SPF go home between visits.</div>
  <div class="callout-grey"><strong>Do not add SRS</strong> on a Glow Facial day. Next peel is Protocol B, 3–4 weeks after the last SRS, not after EPI the same week.</div>
  <p class="source">Source: EPI artwork — clean dry skin, up to 1 minute, rinse tepid water.</p>
`)}

${page(`
  <div class="exhibit">Protocol B</div>
  <h2 class="action">SRS Peel — 1 vial, 1 face. About 40–45 minutes. Every 3–4 weeks.</h2>
  <hr class="rule"/>

  <table class="steps">
    <tr><th class="alt" colspan="3">PROTOCOL B — dullness, texture, tone · after patch test · 10 peels in this pack</th></tr>
    <tr>
      <td class="num">1</td>
      <td class="pic">${img(P.snow)}</td>
      <td><span class="pname">Snow O₂ Cleanser 500 ml</span><br/><span class="how">Thorough cleanse. Skin clean and dry. <strong>No EPI today.</strong></span></td>
    </tr>
    <tr>
      <td class="num">2</td>
      <td class="pic">${img(P.srs)}</td>
      <td><span class="pname">SRS — 1 vial 2 ml</span><br/><span class="how">Apply evenly with brush or gauze. Avoid eyes, lips, nostrils. Never on broken or inflamed skin.</span></td>
    </tr>
    <tr>
      <td class="num">3</td>
      <td class="pic"></td>
      <td><span class="pname">Leave on</span><br/><span class="how"><strong>First visit:</strong> 5–10 minutes, watch the skin. <strong>Later visits:</strong> up to <strong>15–20 minutes</strong> (label). Rinse sooner if burning is strong.</span></td>
    </tr>
    <tr>
      <td class="num">4</td>
      <td class="pic"></td>
      <td><span class="pname">Rinse</span><br/><span class="how">Cool / cold water, thoroughly. Pat dry.</span></td>
    </tr>
    <tr>
      <td class="num">5</td>
      <td class="pic">${img(P.algae)}</td>
      <td><span class="pname">Sea Algae Mask</span><br/><span class="how">15–20 minutes. Use the 1 mask on the first peel or the most reactive face.</span></td>
    </tr>
    <tr>
      <td class="num">6</td>
      <td class="pic">${img(P.post)}</td>
      <td><span class="pname">Soothing Repair Postcream</span><br/><span class="how">Thin layer — this is the recovery step.</span></td>
    </tr>
    <tr>
      <td class="num">7</td>
      <td class="pic">${img(P.hydro)}</td>
      <td><span class="pname">Hydro Soothing Cream 250 g</span><br/><span class="how">Extra thin layer if tightness remains. Skip Multi Vita Serum if the skin is hot or very red.</span></td>
    </tr>
    <tr>
      <td class="num">8</td>
      <td class="pic">${img(P.spf)}</td>
      <td><span class="pname">Multi Sun Cream SPF 40</span><br/><span class="how">Mandatory if the patient goes outside.</span></td>
    </tr>
  </table>

  <div class="callout-red"><strong>Stop and rinse</strong> if burning, swelling or unusual rash appears. Persistent redness beyond 48 hours — medical review. Freshly peeled skin is sun-sensitive: SPF daily for at least 7 days.</div>
  <p class="source">Source: SRS artwork — 15–20 min, cool-water rinse, avoid eyes/lips, patch test, no open skin.</p>
`)}

${page(`
  <div class="exhibit">Aftercare · Coverage</div>
  <h2 class="action">Send-home care after SRS, and what this pack actually covers</h2>
  <hr class="rule"/>

  <table class="steps">
    <tr><th colspan="2">AFTER SRS — days 1–3</th></tr>
    <tr><td class="num">1</td><td><span class="pname">Snow O₂ 180 ml</span> — gentle cleanse only. If the area stings, water only there.</td></tr>
    <tr><td class="num">2</td><td><span class="pname">Hydro Soothing Cream 50 g</span> — thin layer morning and evening.</td></tr>
    <tr><td class="num">3</td><td><span class="pname">Postcream 20 g</span> — on tight or pink patches.</td></tr>
    <tr><td class="num">4</td><td><span class="pname">Multi Sun SPF 40</span> — every morning. No acids, retinol, scrubs, waxing or sauna.</td></tr>
  </table>

  <table class="steps">
    <tr><th class="alt" colspan="2">DAY 4+ — resume glow if the skin is calm</th></tr>
    <tr><td class="num">1</td><td><span class="pname">Multi Vita Radiance Serum</span> — morning and/or evening.</td></tr>
    <tr><td class="num">2</td><td><span class="pname">Multi Vita Radiance Cream</span> — day cream if tolerated.</td></tr>
    <tr><td class="num">3</td><td><span class="pname">EPI</span> — only after day 7, once a week, not in the SRS week.</td></tr>
  </table>

  <table class="cal">
    <tr><th>Question</th><th>Answer</th></tr>
    <tr><td>How many patients?</td><td class="a">10 peel treatments — 10 patients × 1 session, or e.g. 5 patients × 2 sessions</td></tr>
    <tr><td>SRS interval</td><td>Every 3–4 weeks · course 4–6 peels per patient if repeating</td></tr>
    <tr><td>Glow Facial interval</td><td>1× per week, never in the same week as SRS</td></tr>
    <tr><td>To complete all 10 peels with a mask each time</td><td>Add Sea Algae × 9 and Postcream 100 g</td></tr>
  </table>

  <div class="callout-grey"><strong>Contraindications for SRS:</strong> irritated, broken, scratched or infected skin · active dermatitis · recent sunburn · eyes / lips / mucous membranes · no patch test. This protocol supports professional use; it does not replace medical judgement.</div>
  <p class="source">Source: GENOSYS professional product documentation. Protocol prepared by Genosys Middle East FZ-LLC for IJ Medical Center.</p>
`)}

</body></html>`

const outHtml = path.join(ORDERS, 'GENOSYS_IJ_Medical_Starter_Pack_Protocol.html')
const outPdf = path.join(ORDERS, 'GENOSYS_IJ_Medical_Starter_Pack_Protocol.pdf')
fs.writeFileSync(outHtml, html)

async function main() {
  const { chromium } = require('playwright')
  const browser = await chromium.launch()
  const pageObj = await browser.newPage()
  await pageObj.setContent(html, { waitUntil: 'load' })
  await pageObj.pdf({
    path: outPdf,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  })
  await browser.close()
  console.log(JSON.stringify({ ok: true, outPdf, pages: (html.match(/class="page"/g) || []).length }))
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
