/**
 * Generate a signed-delivery / proof-of-delivery PDF from a MoySklad invoice.
 *
 * - Pulls items directly from MoySklad by invoice number
 * - Uses an image file as header (embedded as base64 in the PDF)
 * - Hard-codes 30-day payment-term language
 * - Renders HTML → PDF via headless Chrome
 *
 * Usage:
 *   node scripts/generate-delivery-signoff.js \
 *     --invoice 04391 \
 *     --header /path/to/header.png \
 *     --stamp  /path/to/digital-stamp.png \
 *     --delivered-on 2026-04-18 \
 *     --delivered-to Fujairah \
 *     --out "$HOME/Desktop/signoff-04391.pdf"
 *
 * --stamp is optional; when provided, the image is rendered inside the
 * Supplier signature box so the document is pre-signed from Genosys' side.
 */

const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local'), override: false });

// ---------- arg parsing ----------
function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        out[key] = next;
        i++;
      } else {
        out[key] = true;
      }
    }
  }
  return out;
}

const args = parseArgs(process.argv);
const invoiceNumber = args.invoice;
const headerPath = args.header;
const stampPath = args.stamp;
const deliveredOn = args['delivered-on'] || new Date().toISOString().slice(0, 10);
const deliveredTo = args['delivered-to'] || '';
const outPath = args.out || path.join(require('os').homedir(), 'Desktop', `signoff-${invoiceNumber || 'invoice'}.pdf`);
const paymentDays = Number(args['payment-days'] || 30);

if (!invoiceNumber) {
  console.error('❌ --invoice <number> is required');
  process.exit(1);
}
if (!headerPath || !fs.existsSync(headerPath)) {
  console.error('❌ --header <image-path> is required and must exist');
  process.exit(1);
}
if (stampPath && !fs.existsSync(stampPath)) {
  console.error('❌ --stamp path does not exist:', stampPath);
  process.exit(1);
}

// Load image as data URI (or return null if path not set)
function imageDataUri(filePath) {
  if (!filePath) return null;
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
  const b64 = fs.readFileSync(filePath).toString('base64');
  return `data:${mime};base64,${b64}`;
}

// ---------- MoySklad ----------
const MOYSKLAD_API = 'https://api.moysklad.ru/api/remap/1.2';
const login = process.env.MOYSKLAD_LOGIN?.trim();
const password = process.env.MOYSKLAD_PASSWORD?.trim();
if (!login || !password) {
  console.error('❌ MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD not set');
  process.exit(1);
}
const AUTH = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64');

async function msGet(pathStr) {
  const url = pathStr.startsWith('http') ? pathStr : `${MOYSKLAD_API}${pathStr}`;
  const res = await fetch(url, {
    headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip' },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.substring(0, 500)}`);
  }
  return res.json();
}

// ---------- utils ----------
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function fmtAed(n) {
  return new Intl.NumberFormat('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function fmtHumanDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

// Strip "Genosys " prefix + common weight suffixes to get a cleaner product
// name for the signed document (matches how the customer sees products).
function cleanProductName(raw) {
  return String(raw ?? '').replace(/^\s*Genosys\s+/i, '').trim();
}

// ---------- main ----------
async function main() {
  console.log(`🔍 MoySklad invoiceout name=${invoiceNumber}`);
  const search = await msGet(
    `/entity/invoiceout?filter=name=${encodeURIComponent(invoiceNumber)}&limit=1&expand=agent,positions.assortment,organization`
  );
  if (!search.rows?.[0]) {
    console.error('❌ Invoice not found');
    process.exit(1);
  }
  const invoice = search.rows[0];

  const agent = invoice.agent;
  const org = invoice.organization;

  const items = (invoice.positions?.rows || []).map((p) => ({
    name: cleanProductName(p.assortment?.name),
    quantity: p.quantity,
    unitPrice: p.price / 100,
    vatPct: p.vat ?? 0,
    discountPct: p.discount ?? 0,
    lineTotal: (p.quantity * (p.price / 100)) * (1 - (p.discount ?? 0) / 100),
  }));

  const subtotalInc = invoice.sum / 100; // VAT-inclusive total from MoySklad
  const vatSum = (invoice.vatSum ?? 0) / 100;
  const subtotalNet = subtotalInc - vatSum;
  const invoiceDate = invoice.moment.slice(0, 10);

  const dueDate = addDays(deliveredOn, paymentDays);

  // Embed images as base64 data URIs
  const headerDataUri = imageDataUri(headerPath);
  const stampDataUri = imageDataUri(stampPath);

  const totalUnits = items.reduce((s, i) => s + i.quantity, 0);

  // ---------- HTML ----------
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Delivery Acknowledgment — ${esc(invoice.name)}</title>
<style>
  @page { size: A4; margin: 14mm 14mm 18mm 14mm; }
  * { box-sizing: border-box; }
  html, body { font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif; color: #1a1a1a; font-size: 10.5pt; line-height: 1.4; }
  body { margin: 0; padding: 0; }

  .header { margin-bottom: 10mm; }
  .header img { width: 100%; display: block; }

  h1 {
    font-size: 14pt;
    font-weight: 700;
    margin: 0 0 4mm 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #d62d2d;
  }

  .doc-meta {
    display: flex;
    justify-content: space-between;
    gap: 6mm;
    margin-bottom: 6mm;
    font-size: 9.5pt;
    border: 1px solid #e0e0e0;
    border-radius: 3px;
    padding: 3mm 4mm;
    background: #fafafa;
  }
  .doc-meta .block { flex: 1; min-width: 0; }
  .doc-meta .label { color: #666; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 0.8mm; }
  .doc-meta .value { font-weight: 600; }

  .parties { display: flex; gap: 6mm; margin-bottom: 6mm; }
  .parties .party { flex: 1; border: 1px solid #e0e0e0; border-radius: 3px; padding: 3mm 4mm; }
  .parties .party h3 { margin: 0 0 1.5mm 0; font-size: 8.5pt; color: #666; text-transform: uppercase; letter-spacing: 0.3px; font-weight: 600; }
  .parties .party .name { font-weight: 700; font-size: 10.5pt; margin-bottom: 1mm; }
  .parties .party .addr, .parties .party .contact { font-size: 9pt; color: #333; }

  table.items { width: 100%; border-collapse: collapse; margin-bottom: 4mm; font-size: 9.5pt; }
  table.items thead th {
    background: #1a1a1a;
    color: #fff;
    text-align: left;
    padding: 2mm 3mm;
    font-weight: 600;
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  table.items tbody td {
    border-bottom: 1px solid #ececec;
    padding: 2mm 3mm;
    vertical-align: top;
  }
  table.items tbody tr:nth-child(even) td { background: #fafafa; }
  table.items .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  table.items .idx { color: #999; width: 9mm; }
  table.items .qty { width: 14mm; }
  table.items .price { width: 22mm; }
  table.items .total { width: 24mm; font-weight: 600; }

  .totals { width: 60mm; margin-left: auto; font-size: 10pt; margin-bottom: 6mm; }
  .totals .row { display: flex; justify-content: space-between; padding: 1.2mm 0; border-bottom: 1px solid #ececec; }
  .totals .row.total { border-bottom: none; border-top: 2px solid #1a1a1a; font-weight: 700; font-size: 11.5pt; padding-top: 2mm; margin-top: 1mm; }
  .totals .label { color: #333; }
  .totals .value { font-variant-numeric: tabular-nums; }

  .terms {
    border: 1px solid #d62d2d;
    background: #fef7f7;
    border-radius: 3px;
    padding: 4mm 5mm;
    margin-bottom: 6mm;
    font-size: 9.5pt;
  }
  .terms h3 { margin: 0 0 1.5mm 0; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.3px; color: #d62d2d; }
  .terms .due { font-weight: 700; font-size: 11pt; }

  .sign { margin-top: 8mm; display: flex; gap: 10mm; }
  .sign .box { flex: 1; display: flex; flex-direction: column; }
  .sign .label { font-size: 8.5pt; color: #666; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2mm; }
  .sign .line-area {
    border-bottom: 1px solid #1a1a1a;
    min-height: 24mm;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5mm 0;
  }
  .sign .line-area.empty { min-height: 18mm; }
  .sign .stamp { width: 62mm; height: auto; display: block; }
  .sign .hint { font-size: 8.5pt; color: #999; margin-top: 1.5mm; font-style: italic; }

  .footer-note {
    margin-top: 8mm;
    padding-top: 3mm;
    border-top: 1px solid #e0e0e0;
    font-size: 8.5pt;
    color: #666;
    line-height: 1.5;
  }
</style>
</head>
<body>

<div class="header"><img src="${headerDataUri}" alt="Genosys Middle East FZ-LLC" /></div>

<h1>Delivery Acknowledgment &amp; Payment Agreement</h1>

<div class="doc-meta">
  <div class="block">
    <div class="label">Reference Invoice</div>
    <div class="value">${esc(invoice.name)} · ${esc(fmtHumanDate(invoiceDate))}</div>
  </div>
  <div class="block">
    <div class="label">Delivered On</div>
    <div class="value">${esc(fmtHumanDate(deliveredOn))}</div>
  </div>
  <div class="block">
    <div class="label">Delivered To</div>
    <div class="value">${esc(deliveredTo || '—')}</div>
  </div>
  <div class="block">
    <div class="label">Payment Due</div>
    <div class="value">${esc(fmtHumanDate(dueDate))}</div>
  </div>
</div>

<div class="parties">
  <div class="party">
    <h3>Supplier</h3>
    <div class="name">${esc(org.name)}</div>
    ${org.actualAddress ? `<div class="addr">${esc(org.actualAddress)}</div>` : ''}
  </div>
  <div class="party">
    <h3>Customer</h3>
    <div class="name">${esc(agent.name)}</div>
    ${agent.actualAddress ? `<div class="addr">${esc(agent.actualAddress)}</div>` : ''}
    <div class="contact">
      ${agent.phone ? `Phone: ${esc(agent.phone)}` : ''}
    </div>
  </div>
</div>

<table class="items">
  <thead>
    <tr>
      <th class="idx">#</th>
      <th>Product</th>
      <th class="qty num">Qty</th>
      <th class="price num">Unit Price</th>
      <th class="total num">Line Total</th>
    </tr>
  </thead>
  <tbody>
    ${items
      .map(
        (it, i) => `
      <tr>
        <td class="idx num">${i + 1}</td>
        <td>${esc(it.name)}</td>
        <td class="qty num">${it.quantity}</td>
        <td class="price num">AED ${fmtAed(it.unitPrice)}</td>
        <td class="total num">AED ${fmtAed(it.lineTotal)}</td>
      </tr>`
      )
      .join('')}
  </tbody>
</table>

<div class="totals">
  <div class="row"><div class="label">Subtotal (excl. VAT)</div><div class="value">AED ${fmtAed(subtotalNet)}</div></div>
  <div class="row"><div class="label">VAT (5%)</div><div class="value">AED ${fmtAed(vatSum)}</div></div>
  <div class="row total"><div class="label">Total (incl. VAT)</div><div class="value">AED ${fmtAed(subtotalInc)}</div></div>
</div>

<div class="terms">
  <h3>Payment Terms — ${paymentDays} Days Net</h3>
  <p style="margin: 0 0 1.5mm 0;">
    The Customer acknowledges receipt of the goods listed above in full, in good condition, and undertakes
    to pay the Supplier the total invoice amount of
    <strong>AED ${fmtAed(subtotalInc)} (VAT inclusive)</strong>
    against invoice <strong>#${esc(invoice.name)}</strong> no later than
  </p>
  <div class="due">${esc(fmtHumanDate(dueDate))} (${paymentDays} days from delivery).</div>
  <p style="margin: 1.5mm 0 0 0;">
    Payment shall be made in full, in AED, by bank transfer to the Supplier's account or by such other means
    as the Supplier may approve in writing. Partial payments, credit offsets, or returns must be agreed in
    writing before the due date.
  </p>
</div>

<div class="sign">
  <div class="box">
    <div class="label">Customer — Received &amp; Agreed</div>
    <div class="line-area empty"></div>
    <div class="hint">Name · Position · Signature &amp; Stamp · Date</div>
  </div>
  <div class="box">
    <div class="label">Supplier — Delivered</div>
    <div class="line-area">
      ${stampDataUri ? `<img class="stamp" src="${stampDataUri}" alt="Digitally signed — Genosys Middle East FZ-LLC" />` : ''}
    </div>
    <div class="hint">Digitally signed by Genosys Middle East FZ-LLC · ${esc(fmtHumanDate(deliveredOn))}</div>
  </div>
</div>

<div class="footer-note">
  This document serves as proof of delivery against invoice <strong>#${esc(invoice.name)}</strong>
  issued on ${esc(fmtHumanDate(invoiceDate))}. Items delivered: ${totalUnits} units across ${items.length}
  SKUs. The Customer's signature below constitutes acceptance of the goods and agreement to the
  ${paymentDays}-day net payment terms set out above.
</div>

</body>
</html>`;

  // Write HTML side-car (useful for debugging / re-printing)
  const tmpDir = path.join(__dirname, '..', 'tmp');
  fs.mkdirSync(tmpDir, { recursive: true });
  const htmlPath = path.join(tmpDir, `signoff-${invoiceNumber}.html`);
  fs.writeFileSync(htmlPath, html);
  console.log(`📝 HTML written: ${htmlPath}`);

  // Chrome headless → PDF
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (!fs.existsSync(chromePath)) {
    console.error('❌ Google Chrome not found at', chromePath);
    process.exit(1);
  }

  console.log(`🖨️  Generating PDF via headless Chrome…`);
  // Use `--headless=new` (stable since Chrome 109) + file:// URL
  // `--no-pdf-header-footer` removes the browser's default URL/date header
  execFileSync(
    chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      `--print-to-pdf=${outPath}`,
      `file://${htmlPath}`,
    ],
    { stdio: 'inherit' }
  );

  if (!fs.existsSync(outPath)) {
    console.error('❌ Chrome did not produce a PDF file');
    process.exit(1);
  }
  const bytes = fs.statSync(outPath).size;
  console.log(`\n✅ PDF ready: ${outPath} (${(bytes / 1024).toFixed(1)} KB)`);
  console.log(`   Invoice: ${invoice.name}`);
  console.log(`   Customer: ${agent.name}`);
  console.log(`   Delivered: ${deliveredOn} → ${deliveredTo}`);
  console.log(`   Payment due: ${dueDate} (${paymentDays} days)`);
  console.log(`   Total: AED ${fmtAed(subtotalInc)} (${items.length} lines, ${totalUnits} units)`);
}

main().catch((err) => {
  console.error('💥 Error:', err.message);
  process.exit(1);
});
