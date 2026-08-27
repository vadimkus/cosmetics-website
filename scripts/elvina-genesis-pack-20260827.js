/**
 * Genesis Healthcare Centre / Elvina — brand sheet + 5 chair protocols.
 * Carton / Intertek / SA method only. English. No print.
 * Output: ~/Desktop/Genesis_Healthcare_Elvina/
 */
const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync } = require('child_process')

const ROOT = path.join(__dirname, '..')
const IMG = (...p) => {
  const full = path.join(ROOT, 'public', ...p)
  const ext = full.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'
  return `data:${ext};base64,${fs.readFileSync(full).toString('base64')}`
}
const DEST = path.join(os.homedir(), 'Desktop', 'Genesis_Healthcare_Elvina')
const ORDERS_HEADER = path.join(os.homedir(), 'Desktop', 'orders', 'Header.png')
const LETTERHEAD_PNG = path.join(os.tmpdir(), 'genosys-header-training.png')

execFileSync('python3', [
  '-c',
  [
    'from PIL import Image',
    `im = Image.open(${JSON.stringify(ORDERS_HEADER)})`,
    'w, h = im.size',
    `im.crop((0, 0, w, int(h * 0.62))).save(${JSON.stringify(LETTERHEAD_PNG)})`,
  ].join('\n'),
])

const HEADER = `data:image/png;base64,${fs.readFileSync(LETTERHEAD_PNG).toString('base64')}`
const FOOT = 'GENOSYS Middle East FZ-LLC · Official UAE Distributor · sales@genosys.ae · +971 58 548 7665 · www.genosys.ae &nbsp;|&nbsp; Prepared for Elvina, Genesis Healthcare Centre · 27 August 2026'

const P = {
  cleanser: IMG('images', 'cleanser', 'main_clean.jpeg'),
  booster: IMG('images', 'Second', 'main_booster.jpg'),
  ez: IMG('images', 'ez_mask', 'main.jpeg'),
  hes: IMG('images', 'hes_power', 'main.jpeg'),
  cvs: IMG('images', 'cvs-hero.jpg'),
  cts: IMG('images', 'cts-hero.jpg'),
  pcs: IMG('images', 'pcs-hero.jpg'),
  sws: IMG('images', 'sws_0', 'Main.jpeg'),
  aws: IMG('images', 'aws-hero.jpg'),
  peptide: IMG('images', 'peptide_mask', 'main.jpeg'),
  hydrocool: IMG('images', 'HYDR.jpg'),
}

const css = `
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; font-size: 9.5pt; line-height: 1.36; }
  .page { width: 210mm; height: 296.5mm; page-break-after: always; position: relative; padding: 42mm 15mm 15mm 15mm; overflow: hidden; background: #fff; }
  .page:last-child { page-break-after: auto; }
  .letterhead { position: absolute; top: 0; left: 0; width: 210mm; }
  .letterhead img { width: 100%; display: block; }
  .exhibit { font-size: 7.4pt; letter-spacing: 1.5px; text-transform: uppercase; color: #2E7D82; font-weight: 700; margin-bottom: 1mm; }
  h1 { font-family: Georgia, 'Times New Roman', serif; font-size: 16pt; color: #12355B; font-weight: 700; line-height: 1.12; }
  h2 { font-family: Georgia, 'Times New Roman', serif; font-size: 10.2pt; color: #fff; background: #12355B; padding: 1.2mm 3mm; margin: 2.4mm 0 1.6mm 0; }
  h2.alt { background: #2E7D82; }
  .rule { border: none; border-top: 2.5px solid #12355B; margin: 1.5mm 0 2.2mm 0; }
  .cover-meta { font-size: 8.8pt; color: #44576b; margin: 1.3mm 0 1.6mm 0; }
  .lead { font-size: 9.8pt; line-height: 1.38; color: #1f2f42; border-left: 4px solid #2E7D82; padding: 1.6mm 0 1.6mm 3.4mm; margin: 0 0 2.2mm 0; }
  table.grid { width: 100%; border-collapse: collapse; }
  table.grid th { background: #EAF4F4; color: #12355B; font-size: 7pt; text-transform: uppercase; letter-spacing: .25px; text-align: left; padding: 1.2mm 1.8mm; }
  table.grid td { border-bottom: 1px solid #E3E9F0; padding: 1.5mm 1.8mm; vertical-align: top; font-size: 8.8pt; }
  table.grid td.code { font-weight: 700; color: #12355B; }
  table.grid td.n { text-align: right; font-weight: 700; color: #12355B; white-space: nowrap; }
  table.steps { width: 100%; border-collapse: collapse; }
  table.steps td { border-bottom: 1px solid #E3E9F0; padding: 1.35mm 1.8mm; vertical-align: top; }
  table.steps td.num { width: 8mm; font-family: Georgia, serif; font-size: 13pt; color: #2E7D82; font-weight: 700; }
  table.steps .pname { font-weight: 700; color: #12355B; }
  table.steps .how { font-size: 8.8pt; color: #33475b; margin-top: 0.3mm; }
  .thumbs { display: flex; gap: 2.2mm; margin: 0 0 2mm 0; }
  .thumbs .cell { flex: 1; text-align: center; }
  .thumbs img { width: 100%; height: 20mm; object-fit: contain; border: 1px solid #E3E9F0; background: #f7f9fb; }
  .thumbs .lbl { font-size: 6.8pt; color: #44576b; margin-top: 0.7mm; font-weight: 700; }
  .hero { display: flex; gap: 4mm; align-items: flex-start; margin: 0 0 2mm 0; }
  .hero img { width: 34mm; height: auto; display: block; border: 1px solid #E3E9F0; }
  .hero .pair { width: 34mm; display: flex; flex-direction: column; gap: 2mm; }
  .hero .pair img { width: 100%; }
  .hero .txt { flex: 1; }
  .callout { background: #EAF4F4; border-left: 4px solid #2E7D82; padding: 2mm 3.2mm; font-size: 8.9pt; margin: 2mm 0; }
  .warn { background: #FBECEA; border-left: 4px solid #B3261E; padding: 1.8mm 3mm; font-size: 8.6pt; margin: 2mm 0 0 0; }
  .warn strong { color: #B3261E; }
  ul.tight { margin: 0 0 0 4.2mm; }
  ul.tight li { margin: 0 0 1.15mm 0; color: #1f2f42; }
  .two { display: flex; gap: 4mm; }
  .two .col { flex: 1; }
  .after { display: flex; gap: 2.6mm; margin-top: 1.4mm; }
  .after .cell { flex: 1; text-align: center; }
  .after img { width: 100%; height: 30mm; object-fit: contain; }
  .after .lbl { font-size: 7pt; color: #44576b; margin-top: 0.8mm; }
  a { color: #12355B; font-weight: 700; text-decoration: none; }
  .footer { position: absolute; bottom: 6mm; left: 15mm; right: 15mm; font-size: 7pt; color: #7a8896; border-top: 1px solid #E3E9F0; padding-top: 1.3mm; }
`

function page(inner) {
  return `<div class="page">
    <div class="letterhead"><img src="${HEADER}" alt="GENOSYS Middle East FZ-LLC" /></div>
    ${inner}
    <div class="footer">${FOOT}</div>
  </div>`
}

function wrap(title, pages) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><title>${title}</title><style>${css}</style></head><body>${pages.join('')}</body></html>`
}

function steps(rows) {
  return `<table class="steps">${rows
    .map((r, i) => `<tr><td class="num">${i + 1}</td><td><div class="pname">${r.t}</div><div class="how">${r.b}</div></td></tr>`)
    .join('')}</table>`
}

function grid(headers, rows) {
  return `<table class="grid"><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>${rows}</table>`
}

const brand = wrap('GENOSYS Brand — Genesis Healthcare Centre', [
  page(`
    <div class="exhibit">Brand briefing</div>
    <h1>GENOSYS for Genesis<br/>Healthcare Centre</h1>
    <div class="cover-meta">Prepared for <strong>Elvina</strong> · English · 27 August 2026 · <a href="https://genosys.ae">genosys.ae</a></div>
    <hr class="rule" />
    <div class="lead">Korean professional skincare by DTS MG. You use it in the chair. The client can take the same line home. GENOSYS Middle East FZ-LLC is the official UAE distributor.</div>
    <h2>Who we are</h2>
    <ul class="tight">
      <li>Made in Korea by DTS MG, the company that owns GENOSYS.</li>
      <li>Dermatologically tested. External use only.</li>
      <li>Two lanes: professional vials and masks for the chair, and home care that continues the same idea.</li>
      <li>UAE office: Ras Al Khaimah. Training and orders: sales@genosys.ae · +971 58 548 7665.</li>
    </ul>
    <h2 class="alt">What you already have</h2>
    <p style="margin:0 0 1.6mm 0;color:#1f2f42">July invoice 04830, paid 25 July 2026, AED 2,970. Shipment 06555. These protocols use this stock.</p>
    ${grid(
      ['Product', 'You hold', 'What it does'],
      `
      <tr><td>Snow O₂ Cleanser</td><td>500 ml</td><td>Dry-face oxygen-bubble cleanse, then rinse</td></tr>
      <tr><td>Snow Booster</td><td>1000 ml</td><td>Toner after the wash. Leave on. Morning and evening at home</td></tr>
      <tr><td>EZ CO₂ MASK Pro</td><td>5 treatments</td><td>Gel + sheet. Ten minutes. Then rinse</td></tr>
      <tr><td>Power Solution HES, CVS, CTS, PCS, AWS</td><td>2 ml × 10 each</td><td>Leave-on ampoule. One vial = one client</td></tr>
      <tr><td>Peptide Gel Mask</td><td>40 sheets</td><td>20–40 minutes, sheet off, leftover massaged in</td></tr>
      <tr><td>Hydro Cool Modeling Mask</td><td>1 kg</td><td>Mix 30 g with water at 1 : 0.8. Peel after 15–20 minutes</td></tr>
    `,
    )}
    <div class="callout">SWS is not in this order. Protocol 03 is the brightening chair for when you add that box. Until then, dull tired skin is CVS (Protocol 04 swap), not PCS.</div>
    <h2>How every chair is built</h2>
    <p style="margin:0 0 2mm 0;color:#1f2f42">Same spine each visit. Swap only the ampoule and the finishing mask. Do not add a second peel or a roller on top of these steps.</p>
    ${grid(
      ['#', 'Step', 'Product', 'Method'],
      `
      <tr><td class="code">1</td><td>Cleanse</td><td>Snow O₂</td><td>Dry face, bubbles, circular massage, tepid rinse</td></tr>
      <tr><td class="code">2</td><td>Tone</td><td>Snow Booster</td><td>Apply or spray. Leave on</td></tr>
      <tr><td class="code">3</td><td>Carboxy (optional)</td><td>EZ CO₂</td><td>Dry skin, gel, sheet coated side up, 10 minutes, rinse</td></tr>
      <tr><td class="code">4</td><td>Ampoule</td><td>One Power Solution</td><td>Open, apply, absorb. Do not rinse. One vial per client</td></tr>
      <tr><td class="code">5</td><td>Mask</td><td>Peptide or Hydro Cool</td><td>Peptide 20–40 min. Hydro Cool mix, 15–20 min, peel</td></tr>
      <tr><td class="code">6</td><td>Sun</td><td>The client's own SPF</td><td>After EZ or an ampoule if it is daytime</td></tr>
    `,
    )}
  `),
  page(`
    <h2>First demo this week</h2>
    <ul class="tight">
      <li>Run Protocol 01 on a colleague or a willing client. Dry face, bubbles, rinse, booster.</li>
      <li>If the skin is calm, add EZ for ten minutes, then one PCS, HES or AWS vial, then a Peptide sheet.</li>
      <li>Watch the Facial Treatment, Snow O₂ and EZ CO₂ lessons from genosys.ae/training. Open Videos/Open_training_videos.html before the first paying client.</li>
    </ul>
    <h2 class="alt">Time in the chair</h2>
    ${grid(
      ['Visit', 'Minutes'],
      `
      <tr><td>Cleanse only (Protocol 01)</td><td class="n">5–8</td></tr>
      <tr><td>Full chair without EZ, Peptide finish</td><td class="n">27–50</td></tr>
      <tr><td>Full chair with EZ, Peptide finish</td><td class="n">37–60</td></tr>
      <tr><td>Full chair without EZ, Hydro Cool finish</td><td class="n">22–30</td></tr>
      <tr><td>Full chair with EZ, Hydro Cool finish</td><td class="n">32–40</td></tr>
    `,
    )}
    <h2>Which vial for which skin</h2>
    <div class="thumbs">
      <div class="cell"><img src="${P.hes}" alt="HES" /><div class="lbl">HES</div></div>
      <div class="cell"><img src="${P.cvs}" alt="CVS" /><div class="lbl">CVS</div></div>
      <div class="cell"><img src="${P.cts}" alt="CTS" /><div class="lbl">CTS</div></div>
      <div class="cell"><img src="${P.pcs}" alt="PCS" /><div class="lbl">PCS</div></div>
      <div class="cell"><img src="${P.aws}" alt="AWS" /><div class="lbl">AWS</div></div>
      <div class="cell"><img src="${P.sws}" alt="SWS" /><div class="lbl">SWS</div></div>
    </div>
    ${grid(
      ['Code', 'Job', 'Give it to', 'In your stock'],
      `
      <tr><td class="code">HES</td><td>Firming and hydration</td><td>Dry, tight, thirsty</td><td>Yes</td></tr>
      <tr><td class="code">CVS</td><td>Skin nourishment</td><td>Tired, dull, depleted</td><td>Yes</td></tr>
      <tr><td class="code">CTS</td><td>Improvement of skin texture</td><td>Rough, uneven</td><td>Yes</td></tr>
      <tr><td class="code">PCS</td><td>Oil and sebum control</td><td>Shine, congestion, blemishes</td><td>Yes</td></tr>
      <tr><td class="code">AWS</td><td>Lines and firmness (adenosine 0.04%)</td><td>Expression lines</td><td>Yes</td></tr>
      <tr><td class="code">SWS</td><td>Tone evening (arbutin 2%)</td><td>Spots, leftover marks</td><td>Order the box</td></tr>
    `,
    )}
    <h2>This pack</h2>
    <ul class="tight">
      <li>Open START_HERE.txt first.</li>
      <li>00 Brand (this file). 01 Cleansing. 02 Acne / PCS. 03 Brightening / SWS. 04 Hydration / HES. 05 Anti-wrinkle / AWS.</li>
      <li>Videos: open Videos/Open_training_videos.html, or <a href="https://genosys.ae/training">genosys.ae/training</a>.</li>
      <li>Catalogue, Professional Manual and Home Care Guide are in Brand_materials. Read READ_FIRST.txt there first.</li>
    </ul>
    <div class="callout">If a 2025 or 2026 manual prints a different minute count, a needle step, or EZ at 15–20 minutes, follow these six PDFs. They match the cartons in your cupboard.</div>
    <div class="warn"><strong>Method.</strong> Power Solutions stay on the skin. EZ is ten minutes, not fifteen. Peptide sits 20–40 minutes. Hydro Cool is mixed powder, then peeled. Message us before you open a vial if anything is unclear.</div>
  `),
])

function protocolDoc(opts) {
  const {
    fileTitle,
    exhibit,
    title,
    link,
    lead,
    heroImgs,
    heroAlt,
    kitRows,
    stepRows,
    clockRows,
    bookRows,
    homeRows,
    tellClient,
    afterNote,
    afterCells,
    dos,
    donts,
    warn,
  } = opts
  const heroInner =
    heroImgs.length > 1
      ? `<div class="pair">${heroImgs.map((src, i) => `<img src="${src}" alt="${heroAlt} ${i + 1}" />`).join('')}</div>`
      : `<img src="${heroImgs[0]}" alt="${heroAlt}" />`
  return wrap(fileTitle, [
    page(`
      <div class="exhibit">${exhibit}</div>
      <h1>${title}</h1>
      <div class="cover-meta">Prepared for <strong>Elvina · Genesis Healthcare Centre</strong> · 27 August 2026 · <a href="${link}">${link.replace('https://', '')}</a></div>
      <hr class="rule" />
      <div class="hero">
        ${heroInner}
        <div class="txt">
          <div class="lead">${lead}</div>
          ${grid(
            ['You use', 'Stock'],
            kitRows.map((r) => `<tr><td>${r.n}</td><td class="n">${r.q}</td></tr>`).join(''),
          )}
        </div>
      </div>
      <h2>How to run one session</h2>
      ${steps(stepRows)}
      <h2 class="alt">Time in the chair</h2>
      ${grid(
        ['Step', 'Minutes'],
        clockRows.map((r) => `<tr><td>${r.a}</td><td class="n">${r.b}</td></tr>`).join(''),
      )}
    `),
    page(`
      <h2>How often to book</h2>
      ${grid(
        ['What', 'How often', 'Course'],
        bookRows.map((r) => `<tr><td>${r.a}</td><td>${r.b}</td><td>${r.c}</td></tr>`).join(''),
      )}
      <h2>Home, between visits</h2>
      ${grid(
        ['When', 'What'],
        homeRows.map((r) => `<tr><td>${r.a}</td><td>${r.b}</td></tr>`).join(''),
      )}
      <h2 class="alt">Tell the client</h2>
      <ul class="tight">${tellClient.map((t) => `<li>${t}</li>`).join('')}</ul>
      <div class="callout">${afterNote}</div>
      <div class="after">
        ${afterCells
          .map((c) => `<div class="cell"><img src="${c.img}" alt="${c.alt}" /><div class="lbl">${c.lbl}</div></div>`)
          .join('')}
      </div>
      <div class="two" style="margin-top:2.2mm">
        <div class="col">
          <h2>Do this</h2>
          <ul class="tight">${dos.map((d) => `<li>${d}</li>`).join('')}</ul>
        </div>
        <div class="col">
          <h2 class="alt">Do not</h2>
          <ul class="tight">${donts.map((d) => `<li>${d}</li>`).join('')}</ul>
        </div>
      </div>
      <h2>After she leaves</h2>
      <ul class="tight">
        <li>Same evening: no second peel, no roller, no second ampoule.</li>
        <li>Next morning: Snow O₂, rinse, Snow Booster, then the client's own SPF if it is daytime.</li>
        <li>If the skin stings, stop the course and message sales@genosys.ae before the next vial.</li>
      </ul>
      <div class="warn">${warn}</div>
    `),
  ])
}

const p01 = protocolDoc({
  fileTitle: 'Protocol 01 Cleansing — Snow O2 + Snow Booster',
  exhibit: 'Protocol 01 · every client, every visit',
  title: 'Cleansing<br/>Snow O₂ + Snow Booster',
  link: 'https://genosys.ae/products/10',
  lead: 'The start of every chair in this pack. Dry-face oxygen cleanse, then a leave-on toner. The client uses the same two products morning and evening at home.',
  heroImgs: [P.cleanser, P.booster],
  heroAlt: 'GENOSYS Snow O2 and Snow Booster',
  kitRows: [
    { n: 'Snow O₂ Cleanser 500 ml', q: 'You have this' },
    { n: 'Snow Booster 1000 ml', q: 'You have this' },
  ],
  stepRows: [
    { t: 'Start on a dry face', b: 'Do not wet the skin first. Keep the cleanser off the eyes.' },
    { t: 'Snow O₂', b: 'Apply. Oxygen bubbles lift make-up and dirt. Circular massage. Rinse with tepid water.' },
    { t: 'Pat dry', b: 'Do not leave the face dripping. The booster goes on clean, dry skin.' },
    { t: 'Snow Booster', b: 'Apply or spray enough to give moisture. Leave on. At home the client can also use it over makeup.' },
    { t: 'Stop, or continue', b: 'A simple cleanse visit ends here. A full chair goes on to EZ, then one Power Solution, then a mask. See protocols 02 to 05.' },
  ],
  clockRows: [
    { a: 'Snow O₂ + rinse', b: '3–5' },
    { a: 'Snow Booster', b: '1' },
    { a: 'Cleanse visit total', b: '5–8' },
    { a: 'If you continue to a full chair', b: 'see 02–05' },
  ],
  bookRows: [
    { a: 'In clinic, opening step', b: 'Every visit', c: 'Always' },
    { a: 'Home, Snow O₂', b: 'Morning and evening', c: 'Daily' },
    { a: 'Home, Snow Booster', b: 'Morning and evening, after the rinse', c: 'Daily' },
  ],
  homeRows: [
    { a: 'Morning', b: 'Snow O₂ on a dry face, rinse, Snow Booster, then cream and SPF' },
    { a: 'Evening', b: 'Snow O₂, rinse, Snow Booster, then night cream' },
  ],
  tellClient: [
    'The wash goes on dry skin. Bubbles are normal. Then rinse.',
    'The booster stays on. It is not a peel.',
    'Same two products at home, morning and evening.',
  ],
  afterNote: 'Snow O₂ is a facial cleanser. Snow Booster is a toner. Neither is an acid peel. Neither is Problem Control Toner. Daytime sun is the client\'s own SPF. It is not in this order.',
  afterCells: [
    { img: P.cleanser, alt: 'Snow O2', lbl: 'Snow O₂<br/>dry face, then rinse' },
    { img: P.booster, alt: 'Snow Booster', lbl: 'Snow Booster<br/>leave on' },
    { img: P.ez, alt: 'EZ CO2', lbl: 'Full chair next<br/>EZ CO₂ 10 min' },
  ],
  dos: [
    'Start every protocol with these two steps.',
    'Keep the cleanser off the eyes.',
    'Use the 500 ml in the chair.',
  ],
  donts: [
    'Do not wet the face first.',
    'Do not skip the rinse on Snow O₂.',
    'Do not use Snow O₂ during pregnancy or breastfeeding. The pack prints this.',
  ],
  warn: '<strong>Cleanser first.</strong> If it reaches the eyes, rinse with cool water. External use only. Dermatologically tested. Made in Korea.',
})

const p02 = protocolDoc({
  fileTitle: 'Protocol 02 Acne — PCS',
  exhibit: 'Protocol 02 · oil, shine, blemishes',
  title: 'Acne / problem skin<br/>Power Solution PCS',
  link: 'https://genosys.ae/products/7',
  lead: 'PCS is Problem Control Solution. The job on the pack is oil and sebum control. Leave-on. One 2 ml vial is one client. You hold ten vials.',
  heroImgs: [P.pcs],
  heroAlt: 'GENOSYS Power Solution PCS',
  kitRows: [
    { n: 'Snow O₂ + Snow Booster', q: 'You have this' },
    { n: 'EZ CO₂, optional', q: 'You have this' },
    { n: 'Power Solution PCS 2 ml', q: '10 vials' },
    { n: 'Peptide Gel Mask', q: '40 sheets · you have this' },
  ],
  stepRows: [
    { t: 'Cleanse and tone', b: 'Snow O₂ on a dry face, rinse. Snow Booster, leave on. Protocol 01.' },
    { t: 'EZ CO₂, if booked', b: 'Dry skin. Gel with the spatula. Sheet coated side up. Ten minutes. Rinse. A short sparkle at the start is normal.' },
    { t: 'Open one PCS vial', b: 'Snap the cap. One vial, one client, one visit. Do not mix with another code.' },
    { t: 'Apply and absorb', b: 'Work the solution onto the face. Keep it off the eyes. Leave on. Do not rinse. Wait one minute.' },
    { t: 'Peptide Gel Mask', b: 'Sheet on for 20–40 minutes. Take it off. Massage the leftover in. Keep the sheet off the eyes.' },
    { t: 'Daytime sun', b: 'The client\'s own SPF after EZ or the ampoule.' },
  ],
  clockRows: [
    { a: 'Cleanse + booster', b: '5–8' },
    { a: 'EZ CO₂, if booked', b: '10' },
    { a: 'PCS, absorb', b: '2' },
    { a: 'Peptide sheet', b: '20–40' },
    { a: 'Visit without EZ', b: '27–50' },
    { a: 'Visit with EZ', b: '37–60' },
  ],
  bookRows: [
    { a: 'PCS chair', b: '1–2 times a week', c: '6–10 visits, one vial each' },
    { a: 'With EZ in the same chair', b: 'Once a week (twice if intensive)', c: 'Same 6–10' },
  ],
  homeRows: [
    { a: 'Morning and evening', b: 'Snow O₂, rinse, Snow Booster' },
    { a: 'Daytime', b: 'The client\'s own SPF. No second clinic peel at home' },
  ],
  tellClient: [
    'This vial stays on the skin. It is not rinsed off.',
    'Book the course. One visit is an introduction.',
    'Keep the sun off the skin after EZ.',
  ],
  afterNote: 'The pack does not print a weekly number. Book a course so the client sees a result, not one wipe. Daytime sun is the client\'s own SPF.',
  afterCells: [
    { img: P.pcs, alt: 'PCS', lbl: 'PCS<br/>leave on' },
    { img: P.ez, alt: 'EZ', lbl: 'EZ CO₂<br/>10 minutes' },
    { img: P.peptide, alt: 'Peptide', lbl: 'Peptide sheet<br/>20–40 minutes' },
  ],
  dos: [
    'One fresh PCS vial per client.',
    'Leave the ampoule on.',
    'Give PCS to shine and congestion. Tired dry skin is HES or CVS.',
  ],
  donts: [
    'Do not save an opened vial.',
    'Do not use Power Solutions during pregnancy or breastfeeding.',
    'Do not put PCS on broken or already stinging skin.',
    'Do not add another peel or a roller the same evening.',
  ],
  warn: '<strong>Leave-on ampoule.</strong> Cool water if it reaches the eyes. External use only. Dermatologically tested. Made in Korea.',
})

const p03 = protocolDoc({
  fileTitle: 'Protocol 03 Brightening — SWS',
  exhibit: 'Protocol 03 · tone, spots, leftover marks',
  title: 'Brightening<br/>Power Solution SWS',
  link: 'https://genosys.ae/products/8',
  lead: 'SWS is the tone vial. Korea names arbutin 2%. Leave-on, same method as the five codes you hold. You do not have this box yet. Order it before you book this chair.',
  heroImgs: [P.sws],
  heroAlt: 'GENOSYS Power Solution SWS',
  kitRows: [
    { n: 'Snow O₂ + Snow Booster', q: 'You have this' },
    { n: 'EZ CO₂, optional', q: 'You have this' },
    { n: 'Power Solution SWS 2 ml × 10', q: 'Order this box' },
    { n: 'Peptide Gel Mask', q: '40 sheets · you have this' },
  ],
  stepRows: [
    { t: 'Cleanse and tone', b: 'Protocol 01. Dry-face Snow O₂, rinse, Snow Booster leave on.' },
    { t: 'EZ CO₂, if booked', b: 'Gel, sheet coated side up, ten minutes, rinse. Keep strong sun off the skin afterwards.' },
    { t: 'Open one SWS vial', b: 'One 2 ml vial per client. Do not mix with PCS or AWS in the same vial.' },
    { t: 'Apply and absorb', b: 'Whole face. Keep it off the eyes. Leave on. Do not rinse.' },
    { t: 'Peptide Gel Mask', b: '20–40 minutes, sheet off, leftover massaged in.' },
    { t: 'Sunscreen', b: 'The client\'s own SPF. Same day, and the days that follow.' },
  ],
  clockRows: [
    { a: 'Cleanse + booster', b: '5–8' },
    { a: 'EZ CO₂, if booked', b: '10' },
    { a: 'SWS, absorb', b: '2' },
    { a: 'Peptide sheet', b: '20–40' },
    { a: 'Visit without EZ', b: '27–50' },
    { a: 'Visit with EZ', b: '37–60' },
  ],
  bookRows: [
    { a: 'SWS chair, once you hold the box', b: '1–2 times a week', c: '6–10 visits' },
    { a: 'Until the box arrives', b: 'Do not run this protocol', c: 'Use CVS for tired dull skin (Protocol 04 swap)' },
  ],
  homeRows: [
    { a: 'Morning and evening', b: 'Snow O₂, rinse, Snow Booster' },
    { a: 'Daytime after SWS', b: 'SPF. No fade in one visit' },
  ],
  tellClient: [
    'This chair starts only when the SWS box is in the cupboard.',
    'Sunscreen every day of the course.',
    'Tone takes a course, not one visit.',
  ],
  afterNote: 'Do not use PCS for spots. PCS is oil and sebum. CVS is nourishment. SWS is the tone vial. Three different jobs. Daytime sun is the client\'s own SPF.',
  afterCells: [
    { img: P.sws, alt: 'SWS', lbl: 'SWS<br/>arbutin 2%' },
    { img: P.ez, alt: 'EZ', lbl: 'EZ CO₂<br/>10 minutes' },
    { img: P.peptide, alt: 'Peptide', lbl: 'Peptide sheet<br/>20–40 minutes' },
  ],
  dos: [
    'Order the SWS box before you sell this chair.',
    'Sunscreen after every SWS visit.',
    'One fresh vial per client.',
  ],
  donts: [
    'Do not book this chair on stock you do not have.',
    'Do not skip sun protection.',
    'Do not use during pregnancy or breastfeeding.',
    'Do not save an opened vial.',
  ],
  warn: '<strong>SWS is not in the July order.</strong> Same method as HES / CVS / CTS / PCS / AWS when the box arrives. External use only. Dermatologically tested. Made in Korea.',
})

const p04 = protocolDoc({
  fileTitle: 'Protocol 04 Hydration — HES',
  exhibit: 'Protocol 04 · dry, tight, thirsty',
  title: 'Hydration<br/>Power Solution HES + Hydro Cool',
  link: 'https://genosys.ae/products/4',
  lead: 'HES is HA Volume Enhancing Solution. The job is firming and hydration. Leave-on. Finish with Hydro Cool: mix the powder, let it set, peel it off.',
  heroImgs: [P.hes],
  heroAlt: 'GENOSYS Power Solution HES',
  kitRows: [
    { n: 'Snow O₂ + Snow Booster', q: 'You have this' },
    { n: 'EZ CO₂, optional', q: 'You have this' },
    { n: 'Power Solution HES 2 ml', q: '10 vials' },
    { n: 'Hydro Cool Modeling Mask 1 kg', q: 'You have this' },
  ],
  stepRows: [
    { t: 'Cleanse and tone', b: 'Protocol 01.' },
    { t: 'EZ CO₂, if booked', b: 'Ten minutes, coated side up, rinse. Then pat dry.' },
    { t: 'Open one HES vial', b: 'Apply to the face and neck. Leave on. Do not rinse.' },
    { t: 'Mix Hydro Cool', b: '30 g powder with water at 1 : 0.8. Mix 1–2 minutes. Keep off the eyes and eyebrows.' },
    { t: 'Peel at 15–20 minutes', b: 'It sets and stays cool. Peel it off. Wipe residue with Snow Booster if needed.' },
    { t: 'Daytime sun', b: 'The client\'s own SPF after EZ or the ampoule.' },
  ],
  clockRows: [
    { a: 'Cleanse + booster', b: '5–8' },
    { a: 'EZ CO₂, if booked', b: '10' },
    { a: 'HES, absorb', b: '2' },
    { a: 'Hydro Cool mix + set', b: '15–20' },
    { a: 'Visit without EZ', b: '22–30' },
    { a: 'Visit with EZ', b: '32–40' },
  ],
  bookRows: [
    { a: 'HES chair', b: '1–2 times a week', c: '6–10 visits' },
    { a: 'Swap vial, same steps', b: 'CVS if tired; CTS if rough', c: 'You hold both ×10' },
  ],
  homeRows: [
    { a: 'Morning and evening', b: 'Snow O₂, rinse, Snow Booster' },
    { a: 'Mask at home', b: 'No. Hydro Cool stays in the chair' },
  ],
  tellClient: [
    'The ampoule stays on. The blue mask is mixed, sets, then peels.',
    'The face can feel cool until the mask comes off.',
    'Hydro Cool is not for home.',
  ],
  afterNote: 'Hydro Cool is mixed powder, not a sheet. Peptide can replace it. Do not mix two ampoule codes in one dish. Daytime sun is the client\'s own SPF.',
  afterCells: [
    { img: P.hes, alt: 'HES', lbl: 'HES<br/>leave on' },
    { img: P.hydrocool, alt: 'Hydro Cool', lbl: 'Hydro Cool<br/>30 g, 15–20 min' },
    { img: P.peptide, alt: 'Peptide', lbl: 'Or Peptide sheet<br/>if you prefer' },
  ],
  dos: [
    'Weigh 30 g. Do not guess a handful.',
    'One HES vial per client.',
    'Keep Hydro Cool off the eyes and brows.',
  ],
  donts: [
    'Do not rinse HES off before the modeling mask.',
    'Do not use an opened vial on the next client.',
    'Do not use Power Solutions during pregnancy or breastfeeding.',
  ],
  warn: '<strong>Powder + water, then peel.</strong> Mix at 1 : 0.8. External use only. Dermatologically tested. Made in Korea.',
})

const p05 = protocolDoc({
  fileTitle: 'Protocol 05 Anti-wrinkle — AWS',
  exhibit: 'Protocol 05 · lines and loss of bounce',
  title: 'Anti-wrinkle<br/>Power Solution AWS',
  link: 'https://genosys.ae/products/9',
  lead: 'AWS is Anti-Wrinkle Solution. Korea names adenosine 0.04%. Leave-on. Finish with a Peptide sheet from the 40 you hold.',
  heroImgs: [P.aws],
  heroAlt: 'GENOSYS Power Solution AWS',
  kitRows: [
    { n: 'Snow O₂ + Snow Booster', q: 'You have this' },
    { n: 'EZ CO₂, optional', q: 'You have this' },
    { n: 'Power Solution AWS 2 ml', q: '10 vials' },
    { n: 'Peptide Gel Mask', q: '40 sheets · you have this' },
  ],
  stepRows: [
    { t: 'Cleanse and tone', b: 'Protocol 01.' },
    { t: 'EZ CO₂, if booked', b: 'Ten minutes only. Coated side up. Rinse.' },
    { t: 'Open one AWS vial', b: 'Apply to the face and neck. Keep it off the eyes. Leave on.' },
    { t: 'Peptide Gel Mask', b: '20–40 minutes. Sheet off. Massage leftover in. This sheet is not an eye patch. Keep it off the eyes.' },
    { t: 'Daytime sun', b: 'The client\'s own SPF after EZ or the ampoule.' },
  ],
  clockRows: [
    { a: 'Cleanse + booster', b: '5–8' },
    { a: 'EZ CO₂, if booked', b: '10' },
    { a: 'AWS, absorb', b: '2' },
    { a: 'Peptide sheet', b: '20–40' },
    { a: 'Visit without EZ', b: '27–50' },
    { a: 'Visit with EZ', b: '37–60' },
  ],
  bookRows: [
    { a: 'AWS chair', b: '1–2 times a week', c: '6–10 visits' },
    { a: 'CTS on alternate visits', b: 'When texture is the second complaint', c: 'You hold CTS ×10' },
  ],
  homeRows: [
    { a: 'Morning and evening', b: 'Snow O₂, rinse, Snow Booster' },
    { a: 'AWS at home', b: 'No. It is a session vial, not a daily serum' },
  ],
  tellClient: [
    'This vial stays on. Then a cool sheet for 20–40 minutes.',
    'One visit is an introduction. Book the course.',
    'The Peptide sheet is not for the eyes.',
  ],
  afterNote: 'Adenosine 0.04% is why this vial exists. Ten sealed vials in the box. One visit is an introduction. Book the course. Daytime sun is the client\'s own SPF.',
  afterCells: [
    { img: P.aws, alt: 'AWS', lbl: 'AWS<br/>adenosine 0.04%' },
    { img: P.ez, alt: 'EZ', lbl: 'EZ CO₂<br/>10 minutes' },
    { img: P.peptide, alt: 'Peptide', lbl: 'Peptide sheet<br/>20–40 minutes' },
  ],
  dos: [
    'One fresh AWS vial per client.',
    'Leave it on. Then the sheet.',
    'Book a course.',
  ],
  donts: [
    'Do not put the Peptide sheet on the eyes.',
    'Do not use during pregnancy or breastfeeding.',
    'Do not mix AWS and SWS in one vial.',
    'Do not needle or roll the same evening as EZ plus AWS. These steps are leave-on and rinse-off.',
  ],
  warn: '<strong>Leave-on ampoule.</strong> Cool water if it reaches the eyes. External use only. Dermatologically tested. Made in Korea.',
})

const jobs = [
  { name: '00_GENOSYS_Brand.pdf', html: brand },
  { name: '01_Protocol_Cleansing.pdf', html: p01 },
  { name: '02_Protocol_Acne_PCS.pdf', html: p02 },
  { name: '03_Protocol_Brightening_SWS.pdf', html: p03 },
  { name: '04_Protocol_Hydration_HES.pdf', html: p04 },
  { name: '05_Protocol_AntiWrinkle_AWS.pdf', html: p05 },
]

async function renderOne(browser, name, html) {
  const out = path.join(DEST, name)
  const pageObj = await browser.newPage()
  await pageObj.setViewportSize({ width: 794, height: 1123 })
  await pageObj.setContent(html, { waitUntil: 'load' })
  await pageObj.pdf({
    path: out,
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
  await pageObj.close()
  return { name, out, measure }
}

function writeWebloc(file, url) {
  fs.writeFileSync(
    file,
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>URL</key>
  <string>${url}</string>
</dict>
</plist>
`,
  )
}

function writePackSidecars() {
  const videos = path.join(DEST, 'Videos')
  const brandDir = path.join(DEST, 'Brand_materials')
  fs.mkdirSync(videos, { recursive: true })
  fs.mkdirSync(brandDir, { recursive: true })

  for (const promo of [
    '04_Snow_O2_Cleanser_product.mp4',
    '05_Snow_Booster_product.mp4',
    '06_Peptide_Gel_Mask_product.mp4',
    '07_Hydro_Cool_Modeling_Mask_product.mp4',
    '08_Power_Solution_SWS_product.mp4',
  ]) {
    const gone = path.join(videos, promo)
    if (fs.existsSync(gone)) fs.unlinkSync(gone)
  }

  writeWebloc(path.join(videos, '01_Facial_Treatment_WATCH.webloc'), 'https://www.youtube.com/watch?v=hMtodh45sME')
  writeWebloc(path.join(videos, '02_How_to_use_Snow_O2_Cleanser_WATCH.webloc'), 'https://www.youtube.com/watch?v=SWY0f2gSzl8')
  fs.writeFileSync(
    path.join(videos, '01_Facial_Treatment_WATCH.url'),
    '[InternetShortcut]\nURL=https://www.youtube.com/watch?v=hMtodh45sME\n',
  )
  fs.writeFileSync(
    path.join(videos, '02_How_to_use_Snow_O2_Cleanser_WATCH.url'),
    '[InternetShortcut]\nURL=https://www.youtube.com/watch?v=SWY0f2gSzl8\n',
  )

  fs.writeFileSync(
    path.join(videos, 'Open_training_videos.html'),
    `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>GENOSYS videos — Elvina, Genesis Healthcare Centre</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; max-width: 720px; margin: 32px auto; color: #1a1a1a; line-height: 1.45; }
    h1 { color: #12355B; font-size: 22px; }
    a { color: #12355B; font-weight: 700; }
    li { margin: 0 0 10px 0; }
    .note { background: #EAF4F4; padding: 12px 14px; }
  </style>
</head>
<body>
  <h1>Training videos</h1>
  <p>These are the three lessons from <a href="https://genosys.ae/training">genosys.ae/training</a> that match the stock you hold. Product-page promo clips are not in this folder.</p>
  <p class="note">Facial Treatment and Snow O₂ open in a browser. EZ CO₂ is saved as an mp4.</p>
  <h2>Lessons for this chair</h2>
  <ul>
    <li><a href="https://www.youtube.com/watch?v=hMtodh45sME">Facial Treatment</a></li>
    <li><a href="https://www.youtube.com/watch?v=SWY0f2gSzl8">How to use Snow O₂ Cleanser</a></li>
    <li><a href="https://www.youtube.com/watch?v=ZOYtKGNrWJM">How to use EZ CO₂ Mask</a> (also saved as 03_How_to_use_EZ_CO2_Mask.mp4)</li>
  </ul>
  <p>Hair, eye and body lessons on /training are a different line. Not copied.</p>
</body>
</html>
`,
  )

  fs.writeFileSync(
    path.join(videos, 'Video_index.txt'),
    `GENOSYS training lessons — Genesis Healthcare Centre / Elvina
Source: https://genosys.ae/training only. No product-page promo clips.
27 August 2026

OPEN FIRST
  Open_training_videos.html

FROM /training (her stock)
  01_Facial_Treatment_WATCH.webloc
      https://www.youtube.com/watch?v=hMtodh45sME
  02_How_to_use_Snow_O2_Cleanser_WATCH.webloc
      https://www.youtube.com/watch?v=SWY0f2gSzl8
  03_How_to_use_EZ_CO2_Mask.mp4
      https://www.youtube.com/watch?v=ZOYtKGNrWJM

Hair, eye and body lessons on /training are a different line. Not copied.
`,
  )

  fs.writeFileSync(
    path.join(brandDir, 'READ_FIRST.txt'),
    `READ THIS FIRST — Brand_materials

The three PDFs in this folder are the official 2026 Catalogue,
Professional Manual and Home Care Guide from genosys.ae/training.

They are brand background, not the chair method for your stock.

If they disagree with files 00–05 in the parent folder — EZ minutes,
needles, weekly numbers, or what a Power Solution is for — follow 00–05.
Those six PDFs match the cartons you hold from invoice 04830.

Examples that can differ:
  EZ CO₂ is 10 minutes on the carton, not 15–20.
  Power Solutions are leave-on. The carton does not print a needle step.
  SWS is not in your July order. Do not book Protocol 03 until that box arrives.

GENOSYS Middle East FZ-LLC
sales@genosys.ae · +971 58 548 7665
`,
  )

  fs.writeFileSync(
    path.join(DEST, 'START_HERE.txt'),
    `START HERE — Elvina, Genesis Healthcare Centre
English · 27 August 2026

1. Open 00_GENOSYS_Brand.pdf
2. Run Protocol 01 on a colleague before a paying client
3. Then use 02 (PCS), 04 (HES) or 05 (AWS) from the stock you hold
4. Do not book 03 (SWS) until that box arrives
5. Watch Videos/Open_training_videos.html
6. Brand_materials are background. Read READ_FIRST.txt in that folder first

Carton method: leave-on ampoules, EZ 10 minutes, Peptide 20–40 minutes,
Hydro Cool mix 30 g then peel at 15–20 minutes.
Daytime sun: the client's own SPF. It is not in this order.

Invoice 04830 / shipment 06555 / AED 2,970 paid 25 July 2026
`,
  )

  fs.writeFileSync(
    path.join(DEST, 'README.txt'),
    `GENOSYS pack — Genesis Healthcare Centre / Elvina
English · 27 August 2026
Built on invoice 04830 / shipment 06555 / AED 2,970 paid 25 July 2026

Open START_HERE.txt first.

00_GENOSYS_Brand.pdf
    Who GENOSYS is, what you already hold, how the chair is built.

01_Protocol_Cleansing.pdf
    Snow O₂ + Snow Booster. Start of every visit. Home morning and evening.

02_Protocol_Acne_PCS.pdf
    Oil, shine, blemishes. PCS leave-on. Optional EZ. Peptide sheet.

03_Protocol_Brightening_SWS.pdf
    Spots and uneven tone. SWS (arbutin 2%). Not in the July order.
    Do not book until the box arrives.

04_Protocol_Hydration_HES.pdf
    Dry, tight skin. HES leave-on. Hydro Cool mix 30 g, peel 15–20 min.

05_Protocol_AntiWrinkle_AWS.pdf
    Lines. AWS (adenosine 0.04%). Peptide sheet 20–40 min.

Brand_materials/
    Official 2026 Catalogue, Professional Manual, Home Care Guide.
    Read READ_FIRST.txt in that folder first. If a manual disagrees
    with files 00–05, follow 00–05.

Videos/
    Lessons from genosys.ae/training only. No product-page promo clips.
    Facial Treatment and Snow O₂: YouTube (.webloc).
    EZ CO₂: mp4 plus the same YouTube link.

Carton method only. Power Solutions stay on the skin. EZ is ten minutes.
These cartons do not print a needle step. Do not add one.

GENOSYS Middle East FZ-LLC
sales@genosys.ae · +971 58 548 7665 · https://genosys.ae
`,
  )
}

async function main() {
  fs.mkdirSync(DEST, { recursive: true })
  const { chromium } = require('playwright')
  const browser = await chromium.launch()
  const results = []
  for (const job of jobs) {
    const r = await renderOne(browser, job.name, job.html)
    results.push(r)
    if (r.measure.some((m) => !m.titleClear || m.overlap || m.gap < 8)) {
      await browser.close()
      console.error(JSON.stringify({ ok: false, results }, null, 2))
      process.exit(1)
    }
  }
  await browser.close()
  writePackSidecars()
  console.log(JSON.stringify({ ok: true, dest: DEST, letterhead: LETTERHEAD_PNG, results }, null, 2))
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
