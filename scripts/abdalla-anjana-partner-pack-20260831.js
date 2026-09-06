#!/usr/bin/env node

/**
 * ANJANA SPA - FZE / Abdalla partner pack.
 *
 * Creates four customer-facing PDFs in ~/Desktop/ABdulla:
 *  1. Professional treatment protocols
 *  2. Retail consignment conditions
 *  3. Draft professional starter sales order
 *  4. Draft retail consignment sales order / stock proposal
 *
 * No MoySklad documents are created. Prices are the verified clinic and retail
 * price-list values read from MoySklad on 31 August 2026.
 */

const fs = require('fs')
const os = require('os')
const path = require('path')
const { chromium } = require('playwright')

const OUT = path.join(os.homedir(), 'Desktop', 'ABdulla')
const ORDERS = path.join(os.homedir(), 'Desktop', 'orders')
const HEADER = `data:image/png;base64,${fs.readFileSync(path.join(ORDERS, 'Header.png')).toString('base64')}`
const STAMP = `data:image/png;base64,${fs.readFileSync(path.join(ORDERS, 'Stamp.png')).toString('base64')}`

const CUSTOMER = {
  name: 'ANJANA SPA - FZE',
  contact: 'Mr. Abdalla',
  phone: '+971 50 755 8090',
  address: 'Anjana Spa at Rixos The Palm, Jumeirah, Dubai, UAE',
  licence: 'PCFC Trakhees Professional Licence No. 3249',
}

const DATE = '31 August 2026'
const VALID_TO = '7 September 2026'

const professional = [
  ['54461', 'Skin Defender Lip & Eye Makeup Remover 200 ml', 1, 145],
  ['00024', 'Snow O₂ Cleanser 500 ml', 1, 255],
  ['00025', 'Snow Booster Toner 1000 ml', 1, 245],
  ['00018', 'Power Solution AWS · Anti-Wrinkle · 2 ml vial', 10, 29],
  ['00020', 'Power Solution SWS · Pigment & Uneven Tone · 2 ml vial', 10, 29],
  ['00065', 'Power Solution PCS · Oil & Blemishes · 2 ml vial', 10, 29],
  ['00071', 'Power Solution HES · Hydrating & Firming · 2 ml vial', 10, 29],
  ['00069', 'Power Solution CTS · Texture & Elasticity · 2 ml vial', 10, 29],
  ['00067', 'Power Solution CVS · Tired & Dry Skin · 2 ml vial', 10, 29],
  ['00015', 'Skin Renewal Peeling System (SRS) · 2 ml vial', 10, 40.5],
  ['54470', 'BIO-MESO PDRN Expert Ampoule 60000 · 3 ml × 4', 2, 300],
  ['00011', 'EZ CO₂ Mask Professional Box · 5 treatments', 2, 230],
  ['00013', 'Hydro Cool Modeling Mask 1 kg', 1, 300],
  ['54465', 'Soothing Repair Postcream 100 g', 1, 220],
  ['00032', 'Intensive Hydro Soothing Cream 250 g', 1, 210],
  ['00036', 'Intensive Problem Control Cream 250 g', 1, 210],
  ['00002', 'Standard Detachable Manual Roller 0.50 mm', 5, 115],
  ['00041', 'Multi Sun Cream SPF 40 / PA++ 40 g', 2, 105],
]

const retail = [
  ['00021', 'Snow O₂ Cleanser 180 ml', 4, 165, 330],
  ['00022', 'Snow Booster Toner 200 ml', 3, 130, 260],
  ['00030', 'All For Sensitive Serum 30 ml', 2, 165, 330],
  ['00195', 'Moisture Replenishing Hyaluron Serum 30 ml', 2, 165, 330],
  ['00194', 'Multi Vita Radiance Serum 30 ml', 2, 165, 330],
  ['00191', 'Multi Functional Anti-Wrinkle Serum 30 ml', 2, 165, 330],
  ['00029', 'Problem Control Serum 30 ml', 2, 165, 330],
  ['54458', 'Moisture Replenishing Hyaluron Cream 50 g', 2, 145, 290],
  ['00122', 'Multi Vita Radiance Cream 50 g', 2, 145, 290],
  ['00035', 'Intensive Problem Control Cream 50 g', 2, 145, 290],
  ['00189', 'Skin Rescue Overnight Cream Mask 100 g', 2, 170, 340],
  ['54457', 'Ultra Shield Sun Cream SPF 50+ / PA++++ 50 g', 4, 125, 250],
  ['00041', 'Multi Sun Cream SPF 40 / PA++ 40 g', 4, 105, 210],
  ['00188', 'Microbiome Energy Infusing Mist 80 ml', 4, 80, 160],
  ['54475', 'BIO-MESO PDRN Homecare Ampoule 5000', 2, 150, 300],
  ['00059', 'EyeCell Eye Zone Care Kit', 1, 490, 980],
  ['00143', 'Skin Caring BB Cushion #1 Ivory', 2, 150, 300],
  ['00144', 'Skin Caring BB Cushion #2 Beige', 3, 150, 300],
  ['54464', 'Skin Caring BB Cushion #3 Camel', 2, 150, 300],
  ['54472', 'Revita Glow BB Cream #01 Bright 50 g', 2, 125, 250],
  ['54473', 'Revita Glow BB Cream #02 Natural 50 g', 2, 125, 250],
  ['00038', 'Soothing Repair Postcream 20 g', 4, 102, 204],
  ['00129', 'EPI Turnover Boosting Peeling Gel 100 g', 2, 125, 250],
  ['00037', 'Skin Barrier Protecting Cream 100 g', 2, 225, 450],
  ['54484', 'CERABARRIER Biome Gel Cleanser 200 ml', 2, 190, 380],
]

const sum = (rows, priceIndex) => rows.reduce((total, row) => total + row[2] * row[priceIndex], 0)
const proTotal = sum(professional, 3)
const consignmentValue = sum(retail, 3)
const retailValue = sum(retail, 4)
const retailUnits = retail.reduce((total, row) => total + row[2], 0)

if (proTotal !== 5575) throw new Error(`Professional total changed: ${proTotal}`)
if (consignmentValue !== 8978) throw new Error(`Consignment total changed: ${consignmentValue}`)
if (retailValue !== 17956) throw new Error(`Retail total changed: ${retailValue}`)
if (retailUnits !== 61) throw new Error(`Retail unit count changed: ${retailUnits}`)

const money = (value) =>
  Number(value).toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const baseCss = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #fff; color: #172231; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 9.4pt; line-height: 1.38; }
  .page { width: 210mm; height: 296.5mm; position: relative; page-break-after: always; overflow: hidden; background: #fff; }
  .page:last-child { page-break-after: auto; }
  .page.training { padding: 38mm 15mm 17mm; }
  .page.commercial { padding: 61mm 13mm 18mm; }
  .letterhead { position: absolute; top: 0; left: 0; width: 210mm; overflow: hidden; }
  .training .letterhead { height: 35mm; }
  .commercial .letterhead { height: 59mm; }
  .letterhead img { display: block; width: 210mm; }
  h1, h2, h3, p { margin-top: 0; }
  h1 { font-family: Georgia, "Times New Roman", serif; color: #12355b; font-size: 22pt; line-height: 1.12; margin-bottom: 2mm; }
  h2 { font-family: Georgia, "Times New Roman", serif; color: #12355b; font-size: 15pt; line-height: 1.2; margin-bottom: 2mm; }
  h3 { color: #12355b; font-size: 10.4pt; margin: 3mm 0 1mm; }
  .eyebrow { color: #2e7d82; font-size: 7.7pt; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 1mm; }
  .meta { color: #52657a; font-size: 8.7pt; margin-bottom: 2.5mm; }
  .rule { border: 0; border-top: 2.5px solid #12355b; margin: 2mm 0 3mm; }
  .lead { border-left: 4px solid #2e7d82; padding: 2.2mm 0 2.2mm 4mm; font-size: 10.2pt; color: #293d54; margin: 2.5mm 0; }
  .callout { background: #eaf4f4; border-left: 4px solid #2e7d82; padding: 2.5mm 3.5mm; margin: 2.5mm 0; }
  .callout.red { background: #fbecea; border-left-color: #b3261e; }
  .callout.grey { background: #f4f6f9; border: 1px solid #dce4ec; }
  .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5mm; margin: 3mm 0; }
  .summary.two { grid-template-columns: repeat(2, 1fr); }
  .card { border: 1px solid #d8e1e9; padding: 3mm; min-height: 22mm; }
  .card .value { color: #12355b; font-family: Georgia, serif; font-size: 17pt; font-weight: 700; }
  .card .label { color: #607286; font-size: 8pt; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #12355b; color: #fff; font-size: 7.5pt; text-transform: uppercase; letter-spacing: .25px; text-align: left; padding: 1.6mm 1.7mm; }
  th.alt { background: #2e7d82; }
  td { border-bottom: 1px solid #e0e7ed; padding: 1.35mm 1.7mm; vertical-align: top; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  td.center, th.center { text-align: center; }
  tr.total td { background: #eaf4f4; color: #12355b; font-weight: 700; border: 0; }
  .steps td:first-child { width: 9mm; color: #2e7d82; font-family: Georgia, serif; font-size: 13pt; font-weight: 700; text-align: center; }
  ul { margin: 1mm 0 2mm 5mm; padding-left: 4mm; }
  li { margin-bottom: 1.1mm; }
  .small { font-size: 8pt; color: #607286; }
  .footer { position: absolute; bottom: 5.5mm; left: 13mm; right: 13mm; border-top: 1px solid #dce4ec; padding-top: 1.4mm; color: #788797; font-size: 7pt; display: flex; justify-content: space-between; }
  .stamp { width: 47mm; margin: 2mm 0 0 auto; display: block; }
  .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10mm; margin-top: 6mm; }
  .signature { border-top: 1px solid #7f8c98; padding-top: 2mm; min-height: 20mm; }
  .page-number::after { content: attr(data-page); }
  a { color: #12355b; text-decoration: none; }
`

function documentHtml(title, pages) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>${baseCss}</style></head><body>${pages.join('')}</body></html>`
}

function page(content, options = {}) {
  const kind = options.kind || 'training'
  const pageNo = options.pageNo || ''
  return `<section class="page ${kind}">
    <div class="letterhead"><img src="${HEADER}" /></div>
    ${content}
    <div class="footer">
      <span>GENOSYS Middle East FZ-LLC · Official UAE Distributor · sales@genosys.ae · +971 58 548 7665</span>
      <span>${pageNo}</span>
    </div>
  </section>`
}

function stepRows(steps) {
  return steps
    .map(([title, body], index) => `<tr><td>${index + 1}</td><td><strong>${title}</strong><br>${body}</td></tr>`)
    .join('')
}

function protocolHtml() {
  const pages = []

  pages.push(page(`
    <div class="eyebrow">Professional Treatment Protocols</div>
    <h1>ANJANA SPA<br>GENOSYS Treatment Menu</h1>
    <div class="meta">Prepared for <strong>${CUSTOMER.contact}</strong> · ${CUSTOMER.name} · ${CUSTOMER.address} · ${DATE}</div>
    <hr class="rule">
    <p class="lead"><strong>A practical first menu for the treatment room:</strong> one consultation flow and five clearly separated treatments. Select one treatment per visit. Do not combine SRS, BIO-MESO PDRN 60000, microneedling, or another intensive procedure on the same day.</p>
    <div class="summary">
      <div class="card"><div class="value">60</div><div class="label">Power Solution single-use vials across six skin concerns</div></div>
      <div class="card"><div class="value">10</div><div class="label">SRS professional peel treatments</div></div>
      <div class="card"><div class="value">8</div><div class="label">BIO-MESO PDRN Expert 60000 sessions</div></div>
    </div>
    <table>
      <tr><th>Treatment</th><th>Best fit</th><th class="center">Cadence</th><th class="center">Core stock</th></tr>
      <tr><td><strong>Power Solution Facial</strong></td><td>Choose the vial by the concern in front of you</td><td class="center">As assessed</td><td class="center">1 vial</td></tr>
      <tr><td><strong>HES Roller Hydration</strong></td><td>Hydration and the look of firmness</td><td class="center">Professional judgement</td><td class="center">HES + roller</td></tr>
      <tr><td><strong>SRS Renewal Peel</strong></td><td>Dullness, texture and uneven surface</td><td class="center">Every 3–4 weeks</td><td class="center">1 vial</td></tr>
      <tr><td><strong>BIO-MESO PDRN 60000</strong></td><td>Wrinkles, elasticity and hydration</td><td class="center">Once monthly</td><td class="center">1 ampoule</td></tr>
      <tr><td><strong>EZ CO₂ Mask</strong></td><td>Ten-minute sparkling mask treatment</td><td class="center">As assessed</td><td class="center">1 gel + 1 sheet</td></tr>
      <tr><td><strong>Hydro Cool Finish</strong></td><td>Cooling finish after a suitable facial</td><td class="center">As needed</td><td class="center">~30 g powder</td></tr>
    </table>
    <div class="callout red"><strong>Professional-use boundary:</strong> screen contraindications before every intensive treatment. No treatment over open, broken, infected, sunburned, or actively inflamed skin. Keep products away from eyes, lips, and mucous membranes. Follow the client’s doctor where medical conditions or prescription treatment are involved.</div>
    <p class="small">The proposed order uses the Collagen and Sea Algae masks already purchased by ANJANA SPA, so those masks are not charged again.</p>
  `, { pageNo: '1 / 6' }))

  pages.push(page(`
    <div class="eyebrow">Protocol 0 · Every Client</div>
    <h2>Consult, prepare, document</h2>
    <hr class="rule">
    <table class="steps">
      ${stepRows([
        ['Consultation', 'Record the concern, current routine, allergies, medication, recent procedures, pregnancy or breastfeeding status, history of sensitivity, active infection, cold sores, and recent sun exposure.'],
        ['Choose one track', 'Pick a single treatment from this pack. Do not stack SRS, BIO-MESO PDRN 60000, microneedling, or another intensive procedure in one visit.'],
        ['Photograph and consent', 'Take consistent before photographs and record the exact products, quantity, exposure time, device depth if any, and skin response.'],
        ['Remove makeup', 'Use Skin Defender around lips and eyes, then remove residue gently.'],
        ['Cleanse', 'Apply Snow O₂ Cleanser to dry skin, allow bubbles to form, massage with wet fingertips, rinse with lukewarm water, and pat dry.'],
        ['Tone where appropriate', 'Apply Snow Booster. Skip unnecessary layers before SRS; SRS must go onto clean, dry skin.'],
        ['Close the visit', 'Use the finish specified for that protocol. Give written aftercare and confirm daily sunscreen.'],
      ])}
    </table>
    <div class="callout"><strong>Patch testing:</strong> mandatory before the first SRS peel and sensible whenever the client has a reactive history. A patch test does not cancel the need to watch the skin during the full treatment.</div>
    <h3>Stop the session</h3>
    <ul>
      <li>Strong burning, unexpected swelling, hives, blistering, or rapidly increasing redness.</li>
      <li>Any sign of infection, active herpes, open skin, or an undisclosed recent intensive procedure.</li>
      <li>Client discomfort that is not settling after product removal.</li>
    </ul>
    <p class="small">For adverse reactions, remove the product as directed, cool the skin, document the response, and refer for medical assessment when appropriate.</p>
  `, { pageNo: '2 / 6' }))

  pages.push(page(`
    <div class="eyebrow">Protocol 1 · Power Solutions</div>
    <h2>One vial, selected by concern</h2>
    <hr class="rule">
    <table>
      <tr><th>Vial</th><th>Use when the main concern is</th><th>Verified positioning</th></tr>
      <tr><td><strong>AWS</strong></td><td>Lines and loss of firmness</td><td>Anti-wrinkle; adenosine 0.04%</td></tr>
      <tr><td><strong>SWS</strong></td><td>Pigmentation and uneven tone</td><td>Whitening functional cosmetic; arbutin 2%</td></tr>
      <tr><td><strong>PCS</strong></td><td>Excess oil and the look of blemishes</td><td>Oil and sebum control</td></tr>
      <tr><td><strong>HES</strong></td><td>Dehydration and the look of firmness</td><td>Hydrating and firming; HA 1%</td></tr>
      <tr><td><strong>CTS</strong></td><td>Rough texture and loss of elasticity</td><td>Improvement of skin texture</td></tr>
      <tr><td><strong>CVS</strong></td><td>Tired, dry-looking skin</td><td>Concentrated vitality treatment</td></tr>
    </table>
    <h3>Topical professional facial · all six variants</h3>
    <table class="steps">
      ${stepRows([
        ['Cleanse and dry', 'Complete the universal preparation.'],
        ['Open one vial', 'Use one fresh 2 ml vial for one client. Do not store an opened vial.'],
        ['Apply', 'Distribute over face and, where appropriate, neck. Avoid eyes and mucous membranes.'],
        ['Absorb', 'Press gently until absorbed. These are leave-on solutions and are not rinsed.'],
        ['Mask', 'Apply the already-held Collagen or Sea Algae Mask for 15–20 minutes.'],
        ['Finish', 'Use the appropriate professional cream. Use Postcream when skin is intact but feels warm, tight, or irritated. Apply SPF 40 if the client leaves in daylight.'],
      ])}
    </table>
    <div class="callout"><strong>HES roller option:</strong> HES is the Power Solution in this pack with explicit roller positioning. A trained practitioner may pair it with the client-dedicated 0.50 mm roller under the clinic’s approved microneedling protocol. Do not imply that every Power Solution carton instructs microneedling.</div>
    <div class="callout red"><strong>Pregnancy / breastfeeding:</strong> do not use Power Solutions where the carton says to avoid them. Check the exact pack before treatment rather than assuming one rule fits all six.</div>
  `, { pageNo: '3 / 6' }))

  pages.push(page(`
    <div class="eyebrow">Protocol 2 · SRS</div>
    <h2>Skin Renewal Peeling System</h2>
    <div class="meta">30.5% total AHA · 2 ml single-use vial · 15–20 minutes · cold-water rinse</div>
    <hr class="rule">
    <table class="steps">
      ${stepRows([
        ['Patch test', 'Complete at least 24 hours before the first full treatment.'],
        ['Prepare', 'Cleanse thoroughly and pat completely dry. No EPI peeling gel and no microneedling in this visit.'],
        ['Apply', 'Use one 2 ml vial. Apply a thin, even layer, keeping clear of eyes, lips, nostrils, and mucous membranes.'],
        ['Observe for 15–20 minutes', 'Stay with the client and monitor the skin. Rinse earlier if burning is strong or the response is abnormal.'],
        ['Rinse', 'Remove thoroughly with cold water and pat dry.'],
        ['Calm', 'Apply a Collagen or Sea Algae Mask for 15–20 minutes, then a thin layer of Soothing Repair Postcream on intact skin.'],
        ['Protect', 'Apply SPF 40 before daylight exposure and give strict aftercare.'],
      ])}
    </table>
    <div class="summary">
      <div class="card"><div class="value">10</div><div class="label">Treatments in the proposed first order</div></div>
      <div class="card"><div class="value">3–4 wk</div><div class="label">Typical interval between SRS sessions</div></div>
      <div class="card"><div class="value">7 days</div><div class="label">No acids, retinoids, scrubs, waxing, or intensive procedures</div></div>
    </div>
    <div class="callout red"><strong>Do not treat:</strong> irritated, scratched, infected, inflamed, recently sunburned, or broken skin. Do not apply around the eyes or lips. Stop and refer if redness, swelling, or irritation is unusual or persistent.</div>
    <p class="small">Aftercare: gentle cleanse, soothing moisturiser, no picking or exfoliation, and sunscreen every morning.</p>
  `, { pageNo: '4 / 6' }))

  pages.push(page(`
    <div class="eyebrow">Protocol 3 · BIO-MESO</div>
    <h2>PDRN Expert Ampoule 60000</h2>
    <div class="meta">Professional spicule treatment · 3 ml × 4 · once monthly</div>
    <hr class="rule">
    <table class="steps">
      ${stepRows([
        ['Screen carefully', 'Do not treat active infection, open or broken skin, severe acne or rosacea, autoimmune skin conditions, recent peel/laser/microneedling, recent sunburn or tanning, or suspicious lesions. Pregnancy and breastfeeding require doctor clearance.'],
        ['Prepare', 'Remove makeup, cleanse with Snow O₂, and apply Snow Booster. Protect the eyes with damp cotton and avoid eyes and lips throughout.'],
        ['Apply and press', 'Spread one 3 ml ampoule evenly. Press and work it in using the trained spicule technique. Do not combine it with the needle roller.'],
        ['Layer', 'Apply Intensive Hydro Soothing Cream and continue the trained pressing/rolling massage. For sensitive skin, omit the second working pass and reduce intensity.'],
        ['Mask', 'Use a fresh Collagen or Sea Algae Mask for 15–20 minutes.'],
        ['Finish', 'Apply Soothing Repair Postcream to intact skin.'],
        ['Aftercare', 'Sunscreen every morning. No acids, retinoids, scrubs, or other intensive procedures until exfoliation has finished and the skin is calm.'],
      ])}
    </table>
    <div class="summary">
      <div class="card"><div class="value">8</div><div class="label">Sessions from two boxes in the proposed order</div></div>
      <div class="card"><div class="value">1× month</div><div class="label">Professional treatment cadence</div></div>
      <div class="card"><div class="value">2–3 days</div><div class="label">Typical start of surface exfoliation</div></div>
    </div>
    <div class="callout red"><strong>Retinoids:</strong> stop cosmetic retinoids 7–10 days before; allow 14 days for prescription tretinoin and do not resume it for 14 days afterward. Defer six months after oral isotretinoin.</div>
    <p class="small">Expected sequence: warmth and tightness on treatment day, possible mild irritation for up to three days, exfoliation around days 2–3, and a smoother surface around days 5–7.</p>
  `, { pageNo: '5 / 6' }))

  pages.push(page(`
    <div class="eyebrow">Protocols 4–5 · Masks & Finish</div>
    <h2>EZ CO₂ and Hydro Cool</h2>
    <hr class="rule">
    <h3>EZ CO₂ Mask · 10-minute professional treatment</h3>
    <table class="steps">
      ${stepRows([
        ['Cleanse and dry', 'Complete the universal preparation.'],
        ['Apply one 20 g gel tube', 'Spread evenly with the supplied spatula.'],
        ['Place one sheet', 'Apply the coated side as instructed and press it closely against the gel. Sparkling begins for approximately 20–30 seconds.'],
        ['Wait 10 minutes', 'Keep the sheet in close contact.'],
        ['Remove and rinse', 'Remove the sheet and rinse the remaining gel thoroughly.'],
        ['Finish', 'Choose the suitable professional cream and apply SPF in daylight.'],
      ])}
    </table>
    <h3>Hydro Cool Modeling Mask · cooling finish</h3>
    <table class="steps">
      ${stepRows([
        ['Prepare the skin', 'Use after a compatible, non-contraindicated facial. Protect hairline and brows.'],
        ['Mix one treatment', 'Use the trained clinic ratio and approximately 30 g powder per face. Mix immediately before use.'],
        ['Apply evenly', 'Work quickly into an even layer, avoiding nostrils and unsafe areas.'],
        ['Allow to set', 'Remove as one piece when set, clean residue, and apply the selected finish.'],
      ])}
    </table>
    <div class="callout"><strong>Commercial logic:</strong> the proposed two EZ CO₂ boxes provide 10 complete treatments. One Hydro Cool 1 kg pack provides approximately 34 finishes at 30 g per treatment. The existing Collagen and Sea Algae masks support the Power Solution, SRS, and PDRN protocols without duplicate opening cost.</div>
    <h3>Client hand-off after any intensive treatment</h3>
    <ul>
      <li>Give a simple written routine: gentle cleanse, soothing moisturiser, and daily sunscreen.</li>
      <li>No acids, retinoids, scrubs, waxing, sauna, or another intensive treatment during the stated recovery window.</li>
      <li>Postcream goes on intact skin that is red, warm, or tight, never on an open wound.</li>
    </ul>
  `, { pageNo: '6 / 6' }))

  return documentHtml('ANJANA SPA Professional Treatment Protocols', pages)
}

function termsHtml() {
  const pages = []
  pages.push(page(`
    <div class="eyebrow">Commercial Terms · Retail Consignment</div>
    <h1>Start retail without buying the shelf</h1>
    <div class="meta">Prepared for <strong>${CUSTOMER.name}</strong> · ${CUSTOMER.address} · ${DATE}</div>
    <hr class="rule">
    <p class="lead"><strong>The simple structure:</strong> ANJANA SPA purchases professional treatment-room stock. GENOSYS places the proposed homecare retail stock on consignment, so no payment is due for unsold retail stock.</p>
    <div class="summary">
      <div class="card"><div class="value">AED ${money(proTotal)}</div><div class="label">Professional starter order · payable before delivery</div></div>
      <div class="card"><div class="value">AED 0</div><div class="label">Retail consignment payment due at placement</div></div>
      <div class="card"><div class="value">AED ${money(retailValue)}</div><div class="label">Recommended retail value placed on the shelf</div></div>
    </div>
    <h3>What ANJANA SPA receives</h3>
    <ul>
      <li>A professional starter set supporting Power Solution, SRS, BIO-MESO PDRN 60000, EZ CO₂, and Hydro Cool treatments.</li>
      <li>A ${retailUnits}-unit retail homecare shelf across ${retail.length} lines, with a clinic-value liability of AED ${money(consignmentValue)} and recommended retail value of AED ${money(retailValue)}.</li>
      <li>Professional protocols, product guidance, and replenishment based on actual sales.</li>
      <li>Delivery included for this proposed opening package within the UAE.</li>
    </ul>
    <div class="callout red"><strong>Before activation:</strong> a signed GENOSYS Consignment Agreement is required. The licence currently on file, No. 3249, expires on 5 September 2026, so please provide the renewed trade licence. Provide the TRN certificate as well if ANJANA SPA is VAT registered.</div>
    <h3>What is not consignment</h3>
    <p>Professional sizes, treatment ampoules, professional masks, peel vials, rollers, and treatment-room consumables are normal paid clinic purchases. Consignment is restricted to approved retail homecare products.</p>
    <div class="callout grey"><strong>This is a proposal, not yet a signed agreement or tax invoice.</strong> Final stock is reserved only after written approval, licence verification, and execution of the Consignment Agreement.</div>
  `, { kind: 'commercial', pageNo: '1 / 2' }))

  pages.push(page(`
    <div class="eyebrow">How Consignment Works</div>
    <h2>Stock first. Report sales. Pay only for sold units.</h2>
    <hr class="rule">
    <table>
      <tr><th>Step</th><th>Responsibility</th><th>Timing</th></tr>
      <tr><td><strong>1 · Delivery</strong></td><td>GENOSYS delivers approved retail stock against a Consignment Stock Note. Title remains with GENOSYS.</td><td>After agreement and approval</td></tr>
      <tr><td><strong>2 · Inspection</strong></td><td>ANJANA SPA checks quantities and visible condition and reports discrepancies.</td><td>Within 48 hours</td></tr>
      <tr><td><strong>3 · Sale</strong></td><td>ANJANA SPA sells at the recommended retail price. Any discount comes from its margin unless agreed otherwise.</td><td>During the month</td></tr>
      <tr><td><strong>4 · Report</strong></td><td>Send sales by SKU plus closing-stock reconciliation to sales@genosys.ae, including nil sales where applicable.</td><td>Days 1–5 of each month</td></tr>
      <tr><td><strong>5 · Invoice</strong></td><td>GENOSYS issues the tax invoice for units reported sold.</td><td>After the monthly report</td></tr>
      <tr><td><strong>6 · Payment</strong></td><td>ANJANA SPA pays 100% of the clinic/consignment value for sold units.</td><td>Within 14 days of invoice</td></tr>
      <tr><td><strong>7 · Replenishment</strong></td><td>Fast sellers are replenished; slow stock is reviewed rather than duplicated.</td><td>After reconciliation</td></tr>
    </table>
    <h3>Core conditions</h3>
    <ul>
      <li>Non-exclusive UAE retail placement only. No sub-consignment, pledge, export, relabelling, or repacking.</li>
      <li>Store products indoors and according to label conditions. Maintain accurate stock records.</li>
      <li>Shortage, negligent damage, improper storage, or expiry while in ANJANA SPA custody is chargeable at clinic/consignment value.</li>
      <li>GENOSYS may count stock on at least two business days’ notice.</li>
      <li>Returns require prior written approval and a return note. Opened or expired products are not returnable unless there is a confirmed manufacturing defect.</li>
      <li>Late or incomplete reporting may pause replenishment. Unexplained shortages may be invoiced as sold.</li>
      <li>Use approved GENOSYS claims and materials only. Do not make medical claims.</li>
      <li>Either party may terminate according to the signed agreement; unsold stock must then be reconciled and returned.</li>
    </ul>
    <div class="signature-grid">
      <div class="signature"><strong>GENOSYS Middle East FZ-LLC</strong><br>Vadim Sagatdinov<br>Authorised Signatory</div>
      <div class="signature"><strong>${CUSTOMER.name}</strong><br>Authorised Signatory<br>Date: __________________</div>
    </div>
    <img class="stamp" src="${STAMP}" />
  `, { kind: 'commercial', pageNo: '2 / 2' }))
  return documentHtml('ANJANA SPA Retail Consignment Conditions', pages)
}

function orderRows(rows, options = {}) {
  return rows
    .map((row, index) => {
      const [code, name, qty, unit, rrp] = row
      return `<tr>
        <td class="center">${index + 1}</td>
        <td>${code}</td>
        <td><strong>${name}</strong></td>
        <td class="num">${qty}</td>
        <td class="num">${money(unit)}</td>
        <td class="num">${money(qty * unit)}</td>
        ${options.retail ? `<td class="num">${money(rrp)}</td><td class="num">${money(qty * rrp)}</td>` : ''}
      </tr>`
    })
    .join('')
}

function professionalOrderHtml() {
  const pages = []
  const first = professional.slice(0, 10)
  const second = professional.slice(10)
  pages.push(page(`
    <div class="eyebrow">Draft Sales Order · Professional Treatment Stock</div>
    <h1>Professional Starter Order</h1>
    <div class="meta"><strong>Reference:</strong> SO-PRO-ANJ-310826-DRAFT · <strong>Date:</strong> ${DATE} · <strong>Valid to:</strong> ${VALID_TO}</div>
    <hr class="rule">
    <table>
      <tr><td style="width:50%"><strong>Supplier</strong><br>GENOSYS Middle East FZ-LLC<br>RAKEZ Licence 5023192 · TRN 104229886700003</td><td><strong>Customer</strong><br>${CUSTOMER.name}<br>${CUSTOMER.licence}<br>${CUSTOMER.address}<br>${CUSTOMER.phone}</td></tr>
    </table>
    <div class="callout"><strong>Purpose:</strong> paid treatment-room stock for the protocol pack supplied with this proposal. Clinic prices include 5% VAT. Existing Collagen and Sea Algae masks are used, so no duplicate masks are charged.</div>
    <table>
      <tr><th class="center">#</th><th>Code</th><th>Professional item</th><th class="num">Qty</th><th class="num">Unit AED</th><th class="num">Line AED</th></tr>
      ${orderRows(first)}
    </table>
    <p class="small">Continued on page 2. Source: GENOSYS clinic price list / MoySklad, verified 31 August 2026.</p>
  `, { kind: 'commercial', pageNo: '1 / 2' }))

  pages.push(page(`
    <div class="eyebrow">Draft Sales Order · Continued</div>
    <h2>Professional Starter Order</h2>
    <div class="meta">SO-PRO-ANJ-310826-DRAFT · ${CUSTOMER.name}</div>
    <hr class="rule">
    <table>
      <tr><th class="center">#</th><th>Code</th><th>Professional item</th><th class="num">Qty</th><th class="num">Unit AED</th><th class="num">Line AED</th></tr>
      ${orderRows(second).replace(/<td class="center">(\d+)<\/td>/g, (_, n) => `<td class="center">${Number(n) + 10}</td>`)}
      <tr class="total"><td colspan="5">TOTAL · VAT INCLUDED</td><td class="num">AED ${money(proTotal)}</td></tr>
    </table>
    <div class="summary two">
      <div class="card"><div class="value">AED ${money(proTotal)}</div><div class="label">Amount payable before delivery</div></div>
      <div class="card"><div class="value">AED 0</div><div class="label">Delivery charge for this opening package</div></div>
    </div>
    <h3>Commercial notes</h3>
    <ul>
      <li>Normal paid clinic sale. These professional products are not consignment stock.</li>
      <li>Prices include 5% VAT and are subject to stock availability at final approval.</li>
      <li>Payment is required before delivery. Tax invoice and shipment documents follow confirmation/payment.</li>
      <li>Products remain unreserved until written acceptance. This draft creates no MoySklad order.</li>
      <li>Licence renewal must be provided before release because Licence No. 3249 expires 5 September 2026.</li>
    </ul>
    <div class="signature-grid">
      <div class="signature"><strong>Prepared by</strong><br>Vadim Sagatdinov<br>GENOSYS Middle East FZ-LLC</div>
      <div class="signature"><strong>Approved by customer</strong><br>Name: __________________<br>Date: __________________</div>
    </div>
    <img class="stamp" src="${STAMP}" />
  `, { kind: 'commercial', pageNo: '2 / 2' }))
  return documentHtml('ANJANA SPA Professional Starter Sales Order', pages)
}

function retailOrderHtml() {
  const pages = []
  const chunks = [retail.slice(0, 10), retail.slice(10, 20), retail.slice(20)]
  chunks.forEach((rows, pageIndex) => {
    const start = pageIndex === 0 ? 0 : pageIndex === 1 ? 10 : 20
    const tableBody = orderRows(rows, { retail: true }).replace(
      /<td class="center">(\d+)<\/td>/g,
      (_, n) => `<td class="center">${Number(n) + start}</td>`
    )
    pages.push(page(`
      <div class="eyebrow">Draft Retail Consignment Sales Order${pageIndex ? ' · Continued' : ''}</div>
      <h1 style="font-size:${pageIndex ? '17pt' : '21pt'}">Retail Homecare Opening Shelf</h1>
      <div class="meta"><strong>Reference:</strong> SO-CONS-ANJ-310826-DRAFT · ${CUSTOMER.name} · ${DATE}</div>
      <hr class="rule">
      ${pageIndex === 0 ? `<p class="lead"><strong>No upfront payment for this retail stock.</strong> Clinic value becomes payable only as units are sold and reported under the signed Consignment Agreement.</p>` : ''}
      <table style="font-size:8.2pt">
        <tr><th class="center">#</th><th>Code</th><th>Retail item</th><th class="num">Qty</th><th class="num">Consign unit</th><th class="num">Consign line</th><th class="num">RRP unit</th><th class="num">RRP line</th></tr>
        ${tableBody}
        ${pageIndex === 2 ? `
          <tr class="total"><td colspan="5">TOTAL CONSIGNMENT VALUE</td><td class="num">AED ${money(consignmentValue)}</td><td></td><td></td></tr>
          <tr class="total"><td colspan="7">TOTAL RECOMMENDED RETAIL VALUE</td><td class="num">AED ${money(retailValue)}</td></tr>
        ` : ''}
      </table>
      ${pageIndex === 0 ? `<p class="small">Source: GENOSYS clinic and retail price lists / MoySklad, verified 31 August 2026. Continued on page 2.</p>` : ''}
      ${pageIndex === 1 ? `<p class="small">Continued on page 3.</p>` : ''}
      ${pageIndex === 2 ? `
        <div class="summary">
          <div class="card"><div class="value">${retailUnits}</div><div class="label">Retail units across ${retail.length} lines</div></div>
          <div class="card"><div class="value">AED ${money(consignmentValue)}</div><div class="label">Liability if every unit is sold</div></div>
          <div class="card"><div class="value">AED ${money(retailValue - consignmentValue)}</div><div class="label">Gross shelf margin at recommended retail price</div></div>
        </div>
        <div class="callout"><strong>Document status:</strong> stock proposal only. It is not a tax invoice and no payment is requested now. On approval, GENOSYS issues a Consignment Stock Note under the signed agreement. Sold units are reported monthly and then invoiced.</div>
        <ul>
          <li>Recommended retail prices include 5% VAT. Any discount comes from ANJANA SPA’s margin unless agreed otherwise.</li>
          <li>Subject to renewed trade licence, signed agreement, product availability, and final quantity approval.</li>
          <li>Unsold stock remains the property of GENOSYS Middle East FZ-LLC.</li>
        </ul>
        <div class="signature-grid">
          <div class="signature"><strong>Prepared by</strong><br>Vadim Sagatdinov<br>GENOSYS Middle East FZ-LLC</div>
          <div class="signature"><strong>Approved by customer</strong><br>Name: __________________<br>Date: __________________</div>
        </div>
        <img class="stamp" src="${STAMP}" />
      ` : ''}
    `, { kind: 'commercial', pageNo: `${pageIndex + 1} / 3` }))
  })
  return documentHtml('ANJANA SPA Retail Consignment Sales Order', pages)
}

const additionalProtocols = [
  {
    filename: '05_Protocol_Signature_Cleansing_HydroCool.pdf',
    title: 'Signature Oxygen Cleanse + Hydro Cool',
    eyebrow: 'Additional Chair Protocol 1',
    fit: 'Normal, combination, dehydrated, or travel-tired skin needing a polished spa facial without an intensive peel.',
    duration: '40–50 minutes',
    cadence: 'Weekly or as assessed',
    core: 'Snow O₂ · Snow Booster · Hydro Cool · Hydro Soothing Cream',
    steps: [
      ['Consult and prepare', 'Confirm the skin is intact. Remove eye and lip makeup with Skin Defender.'],
      ['Snow O₂ Cleanser', 'Apply to dry skin, allow the bubbles to form, massage with wet fingertips, rinse with lukewarm water, and pat dry.'],
      ['Snow Booster', 'Press over face and neck. Do not rub sensitised areas.'],
      ['Optional manual massage', 'Use only a suitable clinic massage medium and avoid active inflammation. Do not add SRS or microneedling to this facial.'],
      ['Hydro Cool Modeling Mask', 'Mix approximately 30 g immediately before use at the trained clinic ratio. Protect brows and hairline, apply evenly, allow to set, and remove in one piece.'],
      ['Finish', 'Apply Intensive Hydro Soothing Cream 250 g. Use Multi Sun SPF 40 if the client leaves in daylight.'],
    ],
    result: 'A clean, cooled, hydrated finish with no intensive recovery window.',
    homecare: ['Snow O₂ Cleanser 180 ml', 'Snow Booster 200 ml', 'Hyaluron Serum and Cream', 'SPF 40 or SPF 50+'],
    cautions: ['Do not apply Hydro Cool over open or infected skin.', 'Keep mask clear of nostrils and unsafe areas.', 'Do not promise a peel result: this is cleansing, hydration, and a cooling finish.'],
  },
  {
    filename: '06_Protocol_Problem_Skin_PCS.pdf',
    title: 'Oil & Blemish Control Facial · PCS',
    eyebrow: 'Additional Chair Protocol 2',
    fit: 'Oily or combination skin with excess sebum and the visible appearance of blemishes, without open or severely inflamed lesions.',
    duration: '35–45 minutes',
    cadence: '1–2 times weekly during a short course, then review',
    core: 'Snow O₂ · PCS vial · Sea Algae Mask · Problem Control Cream',
    steps: [
      ['Consult', 'Exclude active infection, open lesions, severe inflammation, and recent aggressive treatment.'],
      ['Cleanse', 'Use Snow O₂ Cleanser, rinse thoroughly, and pat dry.'],
      ['Tone', 'Press on Snow Booster only if the skin is comfortable.'],
      ['PCS', 'Open one fresh 2 ml vial, apply evenly, keep away from eyes and mucous membranes, press until absorbed, and do not rinse.'],
      ['Mask', 'Apply one existing Sea Algae Mask for 15–20 minutes, then remove.'],
      ['Finish', 'Apply a thin layer of Intensive Problem Control Cream 250 g. Apply SPF 40 before daylight exposure.'],
    ],
    result: 'A complete oil-and-sebum focused treatment built around the exact function printed on the PCS carton.',
    homecare: ['Problem Control Serum 30 ml', 'Problem Control Cream 50 g', 'Snow O₂ Cleanser 180 ml', 'Daily sunscreen'],
    cautions: ['Do not roll over active acne.', 'PCS is leave-on; do not rinse after application.', 'Avoid use during pregnancy or breastfeeding where the carton instructs this.'],
  },
  {
    filename: '07_Protocol_Brightening_SWS.pdf',
    title: 'Pigmentation & Even-Tone Facial · SWS',
    eyebrow: 'Additional Chair Protocol 3',
    fit: 'Uneven tone, visible pigmentation, or post-blemish marks on intact, non-irritated skin.',
    duration: '35–45 minutes',
    cadence: '1–2 times weekly during a short course, then review',
    core: 'Snow O₂ · SWS vial · Collagen/Sea Algae Mask · SPF',
    steps: [
      ['Consult', 'Record the pigment type, current actives, recent sun exposure, and pregnancy or breastfeeding status. Refer suspicious or changing lesions.'],
      ['Cleanse', 'Use Snow O₂ Cleanser and pat the skin dry.'],
      ['Tone', 'Press on Snow Booster if tolerated.'],
      ['SWS', 'Open one fresh 2 ml vial and apply evenly. SWS is a leave-on solution with arbutin at 2%. Avoid eyes and mucous membranes.'],
      ['Mask', 'Apply an existing Collagen or Sea Algae Mask for 15–20 minutes.'],
      ['Finish and protect', 'Apply Intensive Hydro Soothing Cream if needed, then SPF 40 before daylight exposure. Daily SPF remains mandatory at home.'],
    ],
    result: 'A pigment-focused facial using the Power Solution specifically registered for whitening and even tone.',
    homecare: ['Multi Vita Radiance Serum', 'Multi Vita Radiance Cream', 'Ultra Shield SPF 50+', 'EPI only on a separate, non-irritated evening'],
    cautions: ['Do not use SWS during pregnancy or breastfeeding.', 'Do not microneedle SWS: its verified carton method is cleanse, open, apply, absorb.', 'No brightening program works without consistent sunscreen.'],
  },
  {
    filename: '08_Protocol_Hydration_HES.pdf',
    title: 'Deep Hydration Facial · HES',
    eyebrow: 'Additional Chair Protocol 4',
    fit: 'Dehydrated skin and skin showing loss of plumpness or firmness.',
    duration: '40–55 minutes',
    cadence: 'Topical as assessed · roller only under trained protocol',
    core: 'Snow O₂ · HES vial · Hydro Cool · Hydro Soothing Cream',
    steps: [
      ['Consult', 'Check sensitivity, allergies, recent procedures, medication, and whether a topical or roller session is appropriate.'],
      ['Cleanse', 'Use Snow O₂ Cleanser, rinse, and pat dry.'],
      ['HES', 'Open one fresh 2 ml vial. Apply over the face and press until absorbed. It remains on the skin.'],
      ['Optional trained roller track', 'Only a trained practitioner may use the client-dedicated 0.50 mm roller under the clinic’s approved microneedling protocol. Never share rollers.'],
      ['Mask', 'Choose Hydro Cool for a modeling-mask finish or one existing Collagen/Sea Algae sheet mask. Do not stack both unless the skin and appointment plan justify it.'],
      ['Finish', 'Apply Intensive Hydro Soothing Cream. Apply SPF 40 in daylight.'],
    ],
    result: 'A hydrating and firming treatment using HES, the Power Solution with explicit roller positioning.',
    homecare: ['Hyaluron Serum 30 ml', 'Hyaluron Cream 50 g', 'Skin Rescue Overnight Mask', 'Daily sunscreen'],
    cautions: ['Topical HES and roller HES are two intensities; choose one deliberately.', 'No roller on active acne, infection, irritated, or broken skin.', 'Use a dedicated roller per client and document depth and passes.'],
  },
  {
    filename: '09_Protocol_AntiWrinkle_AWS_CTS.pdf',
    title: 'Lines or Texture Facial · AWS / CTS',
    eyebrow: 'Additional Chair Protocol 5',
    fit: 'Choose AWS when the priority is lines and firmness. Choose CTS when the priority is rough texture, elasticity, and skin strength.',
    duration: '40–50 minutes',
    cadence: 'One selected vial per visit · review after 4–6 sessions',
    core: 'Snow O₂ · AWS or CTS · Collagen Mask · Hydro/Postcream',
    steps: [
      ['Choose one vial', 'AWS and CTS are alternatives, not a cocktail. Record why the chosen vial matches the client’s main concern.'],
      ['Cleanse', 'Remove makeup, cleanse with Snow O₂, rinse, and pat dry.'],
      ['Apply', 'Open one fresh 2 ml AWS or CTS vial, distribute evenly, press until absorbed, and do not rinse.'],
      ['Mask', 'Apply one existing Collagen Mask for 15–20 minutes.'],
      ['Finish', 'Use Intensive Hydro Soothing Cream for hydration. Use Postcream only when intact skin feels warm, tight, or irritated.'],
      ['Protect', 'Apply SPF 40 before daylight exposure and write down the recommended home routine.'],
    ],
    result: 'A precise anti-ageing facial that changes the vial according to the actual concern instead of mixing products without a reason.',
    homecare: ['Multi Functional Anti-Wrinkle Serum', 'Hyaluron or Barrier Cream', 'EyeCell care where appropriate', 'Daily sunscreen'],
    cautions: ['AWS: wrinkle-improving functional positioning with adenosine 0.04%.', 'CTS: texture-focused positioning; contains hydrolysed fish collagen, so screen fish allergy.', 'Avoid Power Solutions in pregnancy or breastfeeding where the carton instructs this.'],
  },
  {
    filename: '10_Protocol_Vitality_CVS.pdf',
    title: 'Vitality Facial · CVS',
    eyebrow: 'Additional Chair Protocol 6',
    fit: 'Tired, dry-looking skin that needs nourishment and comfort rather than a pigment, oil-control, or wrinkle-specific treatment.',
    duration: '35–45 minutes',
    cadence: 'Weekly during a short course, then as assessed',
    core: 'Snow O₂ · CVS vial · Collagen Mask · Hydro Soothing Cream',
    steps: [
      ['Consult', 'Confirm dryness rather than active dermatitis or a damaged/open barrier requiring medical review.'],
      ['Cleanse', 'Use Snow O₂ Cleanser gently and pat dry.'],
      ['Tone', 'Press on Snow Booster if comfortable.'],
      ['CVS', 'Open one fresh 2 ml vial, apply over face and neck, press until absorbed, and do not rinse.'],
      ['Mask', 'Apply one existing Collagen Mask for 15–20 minutes.'],
      ['Finish', 'Apply Intensive Hydro Soothing Cream. Use SPF 40 if leaving in daylight.'],
    ],
    result: 'A general-purpose nourishing facial for tired and dry skin, using the Power Solution registered for skin nourishment.',
    homecare: ['Hyaluron Serum and Cream', 'Skin Rescue Overnight Cream Mask', 'Snow O₂ Cleanser', 'Daily sunscreen'],
    cautions: ['Do not use CVS as a substitute for treating dermatitis or infection.', 'One fresh vial per client; discard any remainder.', 'Keep away from eyes and mucous membranes.'],
  },
]

function additionalProtocolHtml(protocol, protocolNumber) {
  const pages = []
  pages.push(page(`
    <div class="eyebrow">${protocol.eyebrow}</div>
    <h1>${protocol.title}</h1>
    <div class="meta">Prepared for <strong>${CUSTOMER.name}</strong> · ${CUSTOMER.address} · ${DATE}</div>
    <hr class="rule">
    <p class="lead"><strong>Best fit:</strong> ${protocol.fit}</p>
    <div class="summary">
      <div class="card"><div class="value">${protocol.duration}</div><div class="label">Appointment time</div></div>
      <div class="card"><div class="value" style="font-size:12pt">${protocol.cadence}</div><div class="label">Suggested chair cadence</div></div>
      <div class="card"><div class="value" style="font-size:11pt">${protocol.core}</div><div class="label">Core products</div></div>
    </div>
    <table class="steps">
      ${stepRows(protocol.steps)}
    </table>
    <div class="callout"><strong>Treatment result:</strong> ${protocol.result}</div>
    <div class="callout red"><strong>One intensive track per visit.</strong> Do not add SRS, BIO-MESO PDRN 60000, or another intensive procedure unless a separate approved protocol specifically calls for it.</div>
  `, { pageNo: '1 / 2' }))

  pages.push(page(`
    <div class="eyebrow">${protocol.eyebrow} · Chair Card</div>
    <h2>${protocol.title}</h2>
    <hr class="rule">
    <h3>Before the client arrives</h3>
    <ul>
      <li>Prepare single-use consumables and disinfect reusable surfaces and tools.</li>
      <li>Confirm product expiry and that opened clinic sizes remain within their period after opening.</li>
      <li>Keep the client record ready for photographs, products, quantities, timing, and response.</li>
    </ul>
    <h3>Homecare bridge</h3>
    <table>
      <tr><th>Recommend according to need</th><th>Why it supports the chair result</th></tr>
      ${protocol.homecare.map((item, index) => `<tr><td><strong>${item}</strong></td><td>${[
        'Maintains the cleansing and comfort routine between visits.',
        'Extends the concern-led routine at home without repeating a professional procedure.',
        'Protects or supports the skin during the interval between appointments.',
        'Keeps UV exposure from undoing visible progress.',
      ][index] || 'Supports the between-visit routine.'}</td></tr>`).join('')}
    </table>
    <h3>Safety notes</h3>
    <ul>${protocol.cautions.map((item) => `<li>${item}</li>`).join('')}</ul>
    <div class="callout grey"><strong>After the client leaves:</strong> record the products and timing, send the home routine, arrange follow-up for any intensive treatment, and ask the client to contact the clinic if redness, swelling, itching, blistering, or discomfort is unusual or persistent.</div>
    <div class="callout"><strong>Stock control:</strong> deduct every single-use vial, mask, or EZ set immediately. Record opening dates on 100 g / 250 g / 1 kg professional sizes and reconcile treatment usage against stock weekly.</div>
    <p class="small">Protocol ${protocolNumber} of 6 additional chair protocols. Product-specific carton precautions and professional judgement take priority.</p>
  `, { pageNo: '2 / 2' }))
  return documentHtml(`${protocol.title} · ANJANA SPA`, pages)
}

async function render(browser, filename, html) {
  const output = path.join(OUT, filename)
  const pageObj = await browser.newPage({ viewport: { width: 794, height: 1123 } })
  await pageObj.setContent(html, { waitUntil: 'load' })

  const measure = await pageObj.evaluate(() =>
    [...document.querySelectorAll('.page')].map((node, index) => {
      const footer = node.querySelector('.footer').getBoundingClientRect()
      const children = [...node.children].filter((child) => !child.classList.contains('letterhead') && !child.classList.contains('footer'))
      const last = children[children.length - 1]?.getBoundingClientRect()
      const heading = node.querySelector('h1, h2')?.getBoundingClientRect()
      const header = node.querySelector('.letterhead')?.getBoundingClientRect()
      return {
        page: index + 1,
        titleClear: !heading || !header || heading.top >= header.bottom - 2,
        footerGap: last ? Math.round(footer.top - last.bottom) : null,
        overlap: Boolean(last && last.bottom > footer.top - 5),
      }
    })
  )

  await pageObj.pdf({
    path: output,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  })
  await pageObj.close()
  return { filename, output, bytes: fs.statSync(output).size, measure }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch()
  const results = []
  try {
    results.push(await render(browser, '01_GENOSYS_Anjana_Professional_Protocols.pdf', protocolHtml()))
    results.push(await render(browser, '02_GENOSYS_Anjana_Consignment_Conditions.pdf', termsHtml()))
    results.push(await render(browser, '03_GENOSYS_Anjana_Professional_Starter_SO.pdf', professionalOrderHtml()))
    results.push(await render(browser, '04_GENOSYS_Anjana_Retail_Consignment_SO.pdf', retailOrderHtml()))
    for (const [index, protocol] of additionalProtocols.entries()) {
      results.push(await render(browser, protocol.filename, additionalProtocolHtml(protocol, index + 1)))
    }
  } finally {
    await browser.close()
  }

  const readme = `GENOSYS PARTNER PACK — ANJANA SPA - FZE
Prepared for Mr. Abdalla
Date: ${DATE}

OPEN IN THIS ORDER
1. 02_GENOSYS_Anjana_Consignment_Conditions.pdf
2. 03_GENOSYS_Anjana_Professional_Starter_SO.pdf
3. 04_GENOSYS_Anjana_Retail_Consignment_SO.pdf
4. 01_GENOSYS_Anjana_Professional_Protocols.pdf
5. 05–10: six additional chair protocols by concern

COMMERCIAL SUMMARY
- Professional treatment stock to buy now: AED ${money(proTotal)} including VAT
- Retail homecare stock placed on consignment: AED ${money(consignmentValue)} clinic value
- Recommended retail shelf value: AED ${money(retailValue)}
- Retail payment due at placement: AED 0

IMPORTANT
- These are draft proposals. No MoySklad SO, tax invoice, shipment, or consignment placement was created.
- Retail consignment starts only after signed agreement and renewed Trade Licence No. 3249.
- Current licence copy on file expires 5 September 2026.
- Existing Collagen and Sea Algae masks are used in the protocols and were not duplicated in the professional order.
- Protocols 05–10 are separate two-page chair cards for easy staff sharing and printing.
`
  fs.writeFileSync(path.join(OUT, '00_READ_FIRST.txt'), readme)

  console.log(JSON.stringify({
    ok: true,
    outputFolder: OUT,
    professionalTotal: proTotal,
    consignmentValue,
    retailValue,
    retailUnits,
    results,
  }, null, 2))
}

main().catch((error) => {
  console.error(error.stack || error.message)
  process.exit(1)
})
