/**
 * Shared renderer for the concern protocol PDFs.
 *
 * The hair-loss protocol was hand-written as HTML because it was the first and needed
 * bespoke sections. The remaining seven share one structure, so they are data here and
 * markup once — which also means a correction to the house style or the letterhead
 * happens in a single place.
 *
 * Letterhead comes from lib/siteConfig.ts. The previous generation of these PDFs printed
 * "Genosys Middle FZ-LLC" at a superseded Al Hamra address with an old phone number.
 */

export interface Step {
  title: string
  meta?: string
  body: string[]
}

export interface Section {
  heading: string
  intro?: string
  steps?: Step[]
  bullets?: string[]
  numbered?: string[]
  note?: string
}

export interface DoseRow {
  ingredient: string
  where: string
  note: string
}

export interface SetRow {
  label: string
  price: string
  total?: boolean
}

export interface ProtocolSet {
  heading: string
  rows: SetRow[]
}

export interface Protocol {
  slug: string
  out: string
  title: string
  standfirst: string
  scope: string[]
  sections: Section[]
  doseIntro: string
  doses: DoseRow[]
  /** Named and refused out loud, the way the product pages refuse carton claims. */
  correction?: string
  sets: ProtocolSet[]
  closing: string
  warnings?: Array<{ title: string; body: string; items?: string[] }>
}

const CSS = `
  @page { size: A4; margin: 16mm 15mm 18mm; }
  :root {
    --ink:#1c1c1c; --body:#3a3a3a; --muted:#767676; --rule:#e3dedb;
    --crimson:#a4123f; --crimson-deep:#7d0e30; --tint:#f7f4f2;
    --amber-bg:#fdf8ef; --amber-edge:#b4801f;
  }
  * { box-sizing: border-box; }
  body { margin:0; color:var(--body); font:10.2pt/1.49 "Helvetica Neue",Helvetica,Arial,sans-serif; -webkit-font-smoothing:antialiased; }
  .letterhead { display:flex; align-items:flex-start; justify-content:space-between; gap:18mm; padding-bottom:7px; border-bottom:2px solid var(--crimson); }
  .letterhead img { width:42mm; height:auto; }
  .entity { text-align:right; font-size:7.4pt; line-height:1.45; color:var(--muted); }
  .entity b { color:var(--ink); font-weight:600; }
  h1 { margin:16px 0 0; font-size:20pt; line-height:1.18; font-weight:700; color:var(--ink); letter-spacing:-0.01em; }
  .standfirst { margin:7px 0 0; font-size:10.6pt; line-height:1.5; color:var(--crimson-deep); }
  h2 { margin:20px 0 8px; font-size:12.6pt; font-weight:700; color:var(--crimson); padding-bottom:5px; border-bottom:1px solid var(--rule); break-after:avoid; }
  h3 { margin:15px 0 5px; font-size:10.4pt; font-weight:700; color:var(--ink); break-after:avoid; }
  p { margin:0 0 7px; }
  b, strong { color:var(--ink); font-weight:600; }
  .scope { break-inside:avoid; margin-top:14px; padding:12px 15px; background:var(--tint); border-left:3px solid var(--crimson); }
  .scope p { margin:0 0 5px; font-size:9.6pt; }
  .scope p:last-child { margin-bottom:0; }
  .warn { margin:12px 0; padding:12px 15px; background:var(--amber-bg); border:1px solid #e0c9a4; border-left:3px solid var(--amber-edge); break-inside:avoid; }
  .warn .title { font-weight:700; color:#6f4d0d; font-size:9.6pt; margin-bottom:5px; }
  .warn p, .warn li { font-size:9.4pt; }
  .warn p:last-child { margin-bottom:0; }
  .step { margin:12px 0; padding-left:13px; border-left:2px solid var(--rule); break-inside:avoid; }
  .step .meta { font-size:8.8pt; color:var(--muted); margin:0 0 5px; }
  .step .meta b { color:var(--crimson-deep); }
  ul, ol { margin:0 0 7px; padding-left:17px; }
  li { margin-bottom:3.5px; }
  table { width:100%; border-collapse:collapse; margin:9px 0 10px; font-size:9.2pt; break-inside:avoid; }
  th { text-align:left; font-size:7.6pt; text-transform:uppercase; letter-spacing:0.06em; color:var(--muted); font-weight:700; border-bottom:1.5px solid var(--rule); padding:0 8px 5px 0; }
  td { padding:5px 8px 5px 0; border-bottom:1px solid #f0ecea; vertical-align:top; }
  td.num, th.num { text-align:right; padding-right:0; white-space:nowrap; font-variant-numeric:tabular-nums; }
  tr.total td { font-weight:700; color:var(--ink); border-bottom:none; border-top:1.5px solid var(--rule); }
  .dose { font-variant-numeric:tabular-nums; color:var(--crimson-deep); font-weight:600; }
  footer.sig { break-before:avoid; margin-top:14px; padding-top:8px; border-top:1px solid var(--rule); font-size:8pt; color:var(--muted); }
`

function renderSection(s: Section): string {
  const parts: string[] = [`<h2>${s.heading}</h2>`]
  if (s.intro) parts.push(`<p>${s.intro}</p>`)
  if (s.bullets) parts.push(`<ul>${s.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`)
  if (s.numbered) parts.push(`<ol>${s.numbered.map(b => `<li>${b}</li>`).join('')}</ol>`)
  if (s.steps) {
    for (const st of s.steps) {
      parts.push(
        `<div class="step"><h3>${st.title}</h3>`
        + (st.meta ? `<p class="meta">${st.meta}</p>` : '')
        + st.body.map(b => `<p>${b}</p>`).join('')
        + `</div>`
      )
    }
  }
  if (s.note) parts.push(`<p>${s.note}</p>`)
  return parts.join('\n')
}

export function renderProtocol(p: Protocol, logoDataUri: string): string {
  const warnings = (p.warnings ?? []).map(w =>
    `<div class="warn"><div class="title">${w.title}</div><p>${w.body}</p>`
    + (w.items ? `<ul style="margin-bottom:0">${w.items.map(i => `<li>${i}</li>`).join('')}</ul>` : '')
    + `</div>`
  ).join('\n')

  const doses = `
    <h2>What is actually in these products</h2>
    <p>${p.doseIntro}</p>
    <table>
      <thead><tr><th style="width:26%">Ingredient</th><th style="width:40%">Where it is, and how much</th><th style="width:34%">Worth knowing</th></tr></thead>
      <tbody>
        ${p.doses.map(d => `<tr><td><b>${d.ingredient}</b></td><td>${d.where}</td><td>${d.note}</td></tr>`).join('\n')}
      </tbody>
    </table>
    ${p.correction ? `<div class="warn"><div class="title">A correction to our own earlier advice</div><p>${p.correction}</p></div>` : ''}
  `

  const sets = p.sets.map(s => `
    <table>
      <thead><tr><th>${s.heading}</th><th class="num">Price</th></tr></thead>
      <tbody>${s.rows.map(r => `<tr${r.total ? ' class="total"' : ''}><td>${r.label}</td><td class="num">${r.price}</td></tr>`).join('')}</tbody>
    </table>`).join('\n')

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>${p.title}</title><style>${CSS}</style></head>
<body>
<header class="letterhead">
  <img src="${logoDataUri}" alt="GENOSYS">
  <div class="entity">
    <b>Genosys Middle East FZ-LLC</b><br>
    VUET0209, Compass Building &ndash; Al Hulaila<br>
    Al Hulaila Industrial Zone-FZ, Ras Al Khaimah, UAE<br>
    +971 58 548 76 65 &nbsp;|&nbsp; sales@genosys.ae &nbsp;|&nbsp; genosys.ae
  </div>
</header>

<h1>${p.title}</h1>
<p class="standfirst">${p.standfirst}</p>

<div class="scope">${p.scope.map(s => `<p>${s}</p>`).join('')}</div>

${p.sections.map(renderSection).join('\n')}

${warnings}

${doses}

<h2>Sets</h2>
${sets}
<p style="font-size:9pt;color:var(--muted)">Prices include VAT. Orders over AED 1,000 ship free within the UAE.</p>

<div class="scope"><p>${p.closing}</p></div>

<footer class="sig">
  GENOSYS Middle East FZ-LLC &middot; official UAE distributor of GENOSYS Korean dermacosmetics since 2019 &middot; genosys.ae<br>
  Concentrations quoted are from the manufacturer&rsquo;s signed formulas and certificates of analysis. Revised August 2026.
</footer>
</body></html>`
}
