/**
 * GENOSYS Professional Meso-Homecare Protocol — Miss Khadija Faidar
 * McKinsey-style PDF (Georgia titles / Arial body / navy+teal), Header.png on every page.
 * Output: ~/Desktop/orders/GENOSYS_Khadija_Professional_Meso_Homecare_Protocol.pdf
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
  snowBooster: IMG('images', 'Second', 'main_booster.jpg'),
  hyaluron: IMG('images', 'hyaluron_serum', 'main.jpeg'),
  postcream: IMG('images', 'SRC.jpg'),
  overnight: IMG('images', 'overnight', 'main.jpeg'),
  spf50: IMG('images', 'ultra', 'main.jpeg'),
  mist: IMG('images', 'mist', 'main2.jpeg'),
  pdrn5000: IMG('images', 'meso_5000', 'main.jpg'),
  cts: IMG('images', 'CTS.jpg'),
  srs: IMG('images', 'SRS.jpg'),
  roller: IMG('images', 'Second', 'roller1.jpg'),
  seaAlgae: IMG('images', 'sea_algae', 'Main.jpeg'),
  collagen: IMG('images', 'collagen_mask', 'Main.jpeg'),
}

const css = `
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; font-size: 10.2pt; line-height: 1.42; }
  .page { width: 210mm; height: 296.5mm; page-break-after: always; position: relative; padding: 34mm 16mm 16mm 16mm; overflow: hidden; background: #fff; }
  .page:last-child { page-break-after: auto; }
  .letterhead { position: absolute; top: 0; left: 0; width: 210mm; }
  .letterhead img { width: 100%; display: block; }

  h1 { font-family: Georgia, 'Times New Roman', serif; font-size: 24pt; color: #12355B; font-weight: 700; line-height: 1.15; }
  h2.action { font-family: Georgia, 'Times New Roman', serif; font-size: 15.5pt; color: #12355B; line-height: 1.25; margin: 0 0 2mm 0; }
  .exhibit { font-size: 8pt; letter-spacing: 1.6px; text-transform: uppercase; color: #2E7D82; font-weight: 700; margin-bottom: 1.2mm; }
  .rule { border: none; border-top: 2.5px solid #12355B; margin: 2.5mm 0 4mm 0; }
  .thin { border: none; border-top: 1px solid #C9D3E0; margin: 3mm 0; }
  .muted { color: #5b6b7c; }
  .small { font-size: 8.3pt; }

  .cover-meta { font-size: 10pt; color: #44576b; margin: 3mm 0 5mm 0; }
  .lead { font-size: 11.6pt; line-height: 1.5; color: #1f2f42; border-left: 4px solid #2E7D82; padding: 2.5mm 0 2.5mm 5mm; margin: 5mm 0; }
  .lead strong { color: #12355B; }

  .strip { display: table; width: 100%; border-spacing: 2.2mm 0; margin: 3mm -2.2mm; }
  .strip .cell { display: table-cell; width: 10%; vertical-align: top; text-align: center; }
  .strip img { width: 100%; height: 24mm; object-fit: contain; }
  .strip .lbl { font-size: 7.2pt; color: #44576b; margin-top: 1mm; line-height: 1.2; }

  .callout-red { background: #FBECEA; border-left: 4px solid #B3261E; padding: 3mm 4mm; font-size: 9.6pt; margin: 4mm 0; }
  .callout-red strong { color: #B3261E; }
  .callout-teal { background: #EAF4F4; border-left: 4px solid #2E7D82; padding: 3mm 4mm; font-size: 9.6pt; margin: 4mm 0; }
  .callout-grey { background: #F4F6F9; border: 1px solid #DDE4EC; padding: 3mm 4mm; font-size: 9.3pt; margin: 3mm 0; }

  table.steps { width: 100%; border-collapse: collapse; margin: 2.5mm 0; }
  table.steps td, table.steps th { border-bottom: 1px solid #E3E9F0; padding: 2.2mm 2mm; vertical-align: middle; text-align: left; }
  table.steps th { background: #12355B; color: #fff; font-size: 9pt; letter-spacing: .4px; border-bottom: none; padding: 2mm; }
  table.steps td.num { width: 8mm; font-family: Georgia, serif; font-size: 13pt; color: #2E7D82; text-align: center; font-weight: 700; }
  table.steps td.pic { width: 17mm; }
  table.steps td.pic img { width: 15mm; height: 15mm; object-fit: contain; }
  table.steps .pname { font-weight: 700; color: #12355B; }
  table.steps .how { font-size: 9.2pt; color: #33475b; }

  .cols { display: table; width: 100%; table-layout: fixed; border-spacing: 4mm 0; margin: 0 -4mm; }
  .col { display: table-cell; vertical-align: top; }
  .cols.compact td, .cols.compact th { padding: 1.8mm 1.5mm; }
  .cols.compact .how { font-size: 8.6pt; line-height: 1.35; }
  .cols.compact .pname { font-size: 9.3pt; }
  .track-head { font-family: Georgia, serif; font-size: 12pt; color: #fff; background: #12355B; padding: 2mm 3mm; }
  .track-head.alt { background: #2E7D82; }
  .track-head.peel { background: #7A4A8C; }
  .track-sub { font-size: 8.4pt; color: #EAF4F4; font-family: Arial; }

  .footer { position: absolute; bottom: 6mm; left: 16mm; right: 16mm; font-size: 7.6pt; color: #7a8896; border-top: 1px solid #E3E9F0; padding-top: 1.6mm; }
  .source { font-size: 7.8pt; color: #7a8896; margin-top: 2mm; }

  table.cal { width: 100%; border-collapse: collapse; margin-top: 2mm; }
  table.cal th, table.cal td { border: 1px solid #D8E0EA; padding: 1.8mm 2mm; font-size: 8.8pt; text-align: center; }
  table.cal th { background: #12355B; color: #fff; }
  table.cal td.a { background: #EAF4F4; font-weight: 700; color: #12355B; }
  table.cal td.b { background: #F0F4FA; font-weight: 700; color: #2E5F8A; }
  table.cal td.c { background: #F3EAF7; font-weight: 700; color: #7A4A8C; }

  ul.tight { margin: 1mm 0 2mm 5mm; }
  ul.tight li { margin-bottom: 1.4mm; }
`

const img = (src, style = '') => `<img src="${src}" style="${style}" />`

function page(inner, last = false) {
  return `<div class="page">
    <div class="letterhead">${img(HEADER)}</div>
    ${inner}
    <div class="footer">Genosys Middle East FZ-LLC · Official UAE Distributor · sales@genosys.ae · +971 58 548 7665 · www.genosys.ae &nbsp;|&nbsp; Personal protocol prepared for Miss Khadija Faidar · 11 August 2026</div>
  </div>`
}

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>

${page(`
  <div class="exhibit">Professional Homecare Protocol</div>
  <h1>Weekly Meso-Night + Daily Hydration:<br/>Khadija's Renewal Program</h1>
  <div class="cover-meta">Prepared for <strong>Miss Khadija Faidar</strong> · Arabian Ranches 3, Dubai · 11 August 2026 · Order CODM2608106779</div>
  <hr class="rule"/>

  <p class="lead"><strong>The program in one sentence:</strong> one weekly meso-night — alternating the BIO-MESO PDRN 5000 spicule ampoule and CTS microneedling with the 0.5&nbsp;mm roller — plus a monthly SRS renewal peel on its own evening, layered over a simple hydrating daily routine for visible firmness, smoothness and glow within 4–6 weeks.</p>

  <div class="strip">
    <div class="cell">${img(P.snowBooster)}<div class="lbl">Snow Booster</div></div>
    <div class="cell">${img(P.hyaluron)}<div class="lbl">Hyaluron Serum</div></div>
    <div class="cell">${img(P.postcream)}<div class="lbl">Soothing Repair Postcream</div></div>
    <div class="cell">${img(P.overnight)}<div class="lbl">Skin Rescue Overnight Mask</div></div>
    <div class="cell">${img(P.spf50)}<div class="lbl">Ultra Shield SPF 50</div></div>
    <div class="cell">${img(P.pdrn5000)}<div class="lbl">PDRN Homecare 5000</div></div>
    <div class="cell">${img(P.cts)}<div class="lbl">CTS Power Solution</div></div>
    <div class="cell">${img(P.roller)}<div class="lbl">0.5 mm Roller</div></div>
    <div class="cell">${img(P.srs)}<div class="lbl">SRS Peeling System</div></div>
    <div class="cell">${img(P.mist)}<div class="lbl">Microbiome Mist</div></div>
  </div>

  <div class="callout-red"><strong>Two rules that protect your skin:</strong><br/>
  1) The meso-night is <strong>ONCE PER WEEK ONLY</strong> — never both tracks in the same week, never daily.<br/>
  2) The <strong>SRS peel is ONCE A MONTH</strong>, always on its own evening — never within 7 days of a meso-night, and always after a patch test.</div>

  <div class="callout-teal"><strong>Why this works:</strong> microneedling and PDRN spicules open micro-channels and trigger the skin's own repair cycle; CTS growth-factor peptides rebuild elasticity; the monthly SRS peel lifts away dull surface cells; the daily routine keeps the barrier hydrated and protected so results compound week after week.</div>

  <p class="source">Source: GENOSYS professional product documentation; protocol prepared by Genosys Middle East FZ-LLC.</p>
`)}

${page(`
  <div class="exhibit">Exhibit 1</div>
  <h2 class="action">Every day, the skin barrier is hydrated and protected — morning routine takes under 3 minutes</h2>
  <hr class="rule"/>

  <table class="steps">
    <tr><th colspan="3">MORNING — hydrate, calm, protect</th></tr>
    <tr><td class="num">1</td><td class="pic"></td><td><span class="pname">Gentle cleanse</span><br/><span class="how">Lukewarm water with a mild, low-pH cleanser. Pat dry — never rub.</span></td></tr>
    <tr><td class="num">2</td><td class="pic">${img(P.snowBooster)}</td><td><span class="pname">Snow Booster</span><br/><span class="how">A few pumps on a cotton pad or palms; press into skin. Restores pH and preps absorption.</span></td></tr>
    <tr><td class="num">3</td><td class="pic">${img(P.hyaluron)}</td><td><span class="pname">Moisture Replenishing Hyaluron Serum</span><br/><span class="how">2–3 drops over face and neck. Multi-depth hyaluronic hydration.</span></td></tr>
    <tr><td class="num">4</td><td class="pic">${img(P.postcream)}</td><td><span class="pname">Soothing Repair Postcream — thin layer</span><br/><span class="how">Light daily recovery cream. Apply more whenever skin feels warm, tight or irritated.</span></td></tr>
    <tr><td class="num">5</td><td class="pic">${img(P.spf50)}</td><td><span class="pname">Ultra Shield Sun Cream SPF 50+ PA++++</span><br/><span class="how">Generous layer as the final step. Non-negotiable — especially the morning after a meso-night.</span></td></tr>
  </table>

  <table class="steps">
    <tr><th colspan="3">EVENING — repair overnight</th></tr>
    <tr><td class="num">1</td><td class="pic"></td><td><span class="pname">Gentle cleanse</span><br/><span class="how">Remove sunscreen and the day. Pat dry.</span></td></tr>
    <tr><td class="num">2</td><td class="pic">${img(P.snowBooster)}</td><td><span class="pname">Snow Booster</span><br/><span class="how">Same as morning.</span></td></tr>
    <tr><td class="num">3</td><td class="pic">${img(P.hyaluron)}</td><td><span class="pname">Moisture Replenishing Hyaluron Serum</span><br/><span class="how">2–3 drops over face and neck.</span></td></tr>
    <tr><td class="num">4</td><td class="pic">${img(P.overnight)}</td><td><span class="pname">Skin Rescue Overnight Cream Mask</span><br/><span class="how">Even layer as the last step — oxygen capsules and pink ceramide work while you sleep.</span></td></tr>
  </table>

  <div class="callout-grey"><strong>Microbiome Energy Infusing Mist — anytime:</strong> shake well, close your eyes and spray from 10–20 cm. Use after the serum, during the day for a hydration top-up, and even over makeup.</div>

  <p class="source">Source: GENOSYS product usage instructions.</p>
`)}

${page(`
  <div class="exhibit">Exhibit 2</div>
  <h2 class="action">One treatment evening per week — PDRN and CTS alternate weekly; once a month the SRS peel takes that evening instead</h2>
  <hr class="rule"/>

  <div class="cols compact">
    <div class="col">
      <div class="track-head">Week A — PDRN 5000<br/><span class="track-sub">Spicule ampoule · no roller needed</span></div>
      <table class="steps">
        <tr><td class="num">1</td><td><span class="how">Cleanse and pat fully dry. No toner, no serum beforehand.</span></td></tr>
        <tr><td class="num">2</td><td><span class="pname">BIO-MESO PDRN 5000</span><br/><span class="how">Apply over face; massage 2–3 minutes until absorbed. A light prickly tingle is normal — the spicules working.</span></td></tr>
        <tr><td class="num">3</td><td><span class="pname">Sheet mask</span><br/><span class="how">Sea Algae or Collagen Mask, 15–20 minutes.</span></td></tr>
        <tr><td class="num">4</td><td><span class="pname">Postcream</span><br/><span class="how">Generous layer. Sleep. Nothing else that night.</span></td></tr>
      </table>
    </div>
    <div class="col">
      <div class="track-head alt">Week B — CTS Roller Night<br/><span class="track-sub">0.5 mm roller + Power Solution CTS vial</span></div>
      <table class="steps">
        <tr><td class="num">1</td><td><span class="how">Cleanse; wash hands; disinfect roller head in 70% alcohol, air-dry.</span></td></tr>
        <tr><td class="num">2</td><td><span class="pname">Half the CTS vial</span><br/><span class="how">Spread over the face as a gliding layer.</span></td></tr>
        <tr><td class="num">3</td><td><span class="pname">Roll gently</span><br/><span class="how">3–4 light passes per zone — vertical, horizontal, diagonal. Never over eyes, lips or active breakouts.</span></td></tr>
        <tr><td class="num">4</td><td><span class="how">Remaining CTS, then <strong>sheet mask 15–20 min</strong>, then <strong>Postcream</strong>.</span></td></tr>
      </table>
    </div>
    <div class="col">
      <div class="track-head peel">Monthly — SRS Peel Night<br/><span class="track-sub">Skin Renewal Peeling System · replaces that week's meso-night</span></div>
      <table class="steps">
        <tr><td class="num">1</td><td><span class="how"><strong>Patch test 24h before first use</strong> — a drop behind the ear or on the jawline.</span></td></tr>
        <tr><td class="num">2</td><td><span class="how">Cleanse and dry fully. Apply a <strong>thin, even layer</strong> — avoid eyes, lips, nostrils. Never on irritated or broken skin.</span></td></tr>
        <tr><td class="num">3</td><td><span class="how">Leave <strong>15–20 minutes</strong>. Rinse sooner with cool water if burning feels strong.</span></td></tr>
        <tr><td class="num">4</td><td><span class="how">Rinse thoroughly with cool water, pat dry, apply <strong>Postcream</strong> generously. Sleep.</span></td></tr>
      </table>
    </div>
  </div>

  <div class="callout-red"><strong>Treatment-night rules:</strong> a treatment evening <strong>replaces</strong> the evening routine (no Hyaluron Serum, no Overnight Mask that night). Maximum <strong>one treatment per week</strong> — Weeks A and B alternate, and once a month the SRS peel takes that week's slot. Keep <strong>at least 7 days</strong> between SRS and any roller/spicule session. After any treatment night: no acids, retinol or scrubs for 48 hours (5–7 days after SRS); SPF 50 every morning.</div>

  <div class="callout-grey"><strong>Mild redness, warmth or light flaking after a treatment night is expected</strong> and should settle within a few hours (1–2 days of light flaking after SRS). The Postcream is designed exactly for this window.</div>

  <p class="source">Source: GENOSYS BIO-MESO, Power Solution and SRS professional usage guidance.</p>
`)}

${page(`
  <div class="exhibit">Exhibit 3</div>
  <h2 class="action">Clean tools, protected skin and a simple six-week rhythm keep the program safe and compounding</h2>
  <hr class="rule"/>

  <div class="cols">
    <div class="col">
      <h2 class="action" style="font-size:11.5pt;">Roller hygiene — every single time</h2>
      <ul class="tight">
        <li>Rinse the roller head under hot running water before and after use.</li>
        <li>Disinfect with 70% alcohol; air-dry completely before the case.</li>
        <li>Never share the roller; never roll over active acne, cold sores, sunburn, or irritated/broken skin.</li>
        <li>Replace the roller head after roughly 10 uses or if needles look bent.</li>
      </ul>

      <h2 class="action" style="font-size:11.5pt; margin-top:4mm;">Stop and contact us if you see</h2>
      <ul class="tight">
        <li>Burning, swelling or rash that does not settle within a few hours.</li>
        <li>Any blistering, oozing or unusual breakouts after a meso-night.</li>
        <li>Persistent redness lasting more than 48 hours.</li>
      </ul>
    </div>
    <div class="col">
      <h2 class="action" style="font-size:11.5pt;">Your first six weeks</h2>
      <table class="cal">
        <tr><th>Week</th><th>Treatment night</th><th>Focus</th></tr>
        <tr><td>1</td><td class="a">PDRN 5000</td><td>Hydration + first renewal</td></tr>
        <tr><td>2</td><td class="b">CTS + roller</td><td>Firmness, elasticity</td></tr>
        <tr><td>3</td><td class="a">PDRN 5000</td><td>Barrier regeneration</td></tr>
        <tr><td>4</td><td class="c">SRS peel</td><td>Surface renewal, glow</td></tr>
        <tr><td>5</td><td class="a">PDRN 5000</td><td>Glow consolidation</td></tr>
        <tr><td>6</td><td class="b">CTS + roller</td><td>Visible firmness milestone</td></tr>
      </table>
      <p class="small muted" style="margin-top:2mm;">Daily AM/PM routine (Exhibit 1) runs every day, all six weeks. A treatment night replaces the PM routine — once a week, with the SRS peel taking week 4's slot.</p>
    </div>
  </div>

  <div class="callout-red"><strong>SRS peel — read before first use:</strong> professional-grade AHA peel (glycolic, lactic, mandelic, phytic acids). Patch test 24 hours before the first application. Never apply on irritated, broken, scratched or sunburned skin. Keep clear of eyes, lips and mucous membranes — rinse immediately with cool water if contact occurs. Do not combine with other peels, acids or retinol within 5–7 days, and never within 7 days of a roller or spicule session. SPF 50 daily after peeling is essential — freshly renewed skin is sun-sensitive.</div>

  <div class="callout-teal"><strong>What to expect:</strong> softness and glow from week 1; smoother texture by weeks 3–4 (the first SRS peel visibly brightens); visible firmness and refined pores by weeks 5–6. Consistency of the weekly rhythm — not intensity — is what delivers results.</div>

  <p class="source">Source: GENOSYS professional product documentation and usage instructions.</p>
`, true)}

</body></html>`

const outHtml = path.join(ORDERS, 'GENOSYS_Khadija_Professional_Meso_Homecare_Protocol.html')
const outPdf = path.join(ORDERS, 'GENOSYS_Khadija_Professional_Meso_Homecare_Protocol.pdf')
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
  const pages = html.match(/class="page"/g).length
  console.log(JSON.stringify({ ok: true, outPdf, outHtml, pages }))
}

main().catch((e) => { console.error(e.message); process.exit(1) })
