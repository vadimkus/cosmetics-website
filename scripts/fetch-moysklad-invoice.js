/**
 * Fetch a MoySklad customer invoice (Счет покупателю / invoiceout) with
 * full positions and counterparty details. Prints JSON-ready output that
 * a PDF generator can consume.
 *
 * Usage:
 *   node scripts/fetch-moysklad-invoice.js <invoiceNumber>
 *   node scripts/fetch-moysklad-invoice.js 04391
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local'), override: false });

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

async function main() {
  const invoiceNumber = process.argv[2];
  if (!invoiceNumber) {
    console.error('Usage: node scripts/fetch-moysklad-invoice.js <invoiceNumber>');
    process.exit(1);
  }

  console.log(`🔍 Searching MoySklad invoiceout name=${invoiceNumber}`);
  const search = await msGet(
    `/entity/invoiceout?filter=name=${encodeURIComponent(invoiceNumber)}&limit=5&expand=agent,positions.assortment,organization`
  );
  if (!search.rows || search.rows.length === 0) {
    console.error('❌ Invoice not found');
    process.exit(1);
  }
  if (search.rows.length > 1) {
    console.warn(`⚠️ Multiple invoices with this name, using first`);
  }

  const invoice = search.rows[0];

  console.log('\n═══ INVOICE ═══');
  console.log('id:           ', invoice.id);
  console.log('name:         ', invoice.name);
  console.log('moment:       ', invoice.moment);
  console.log('sum:          ', invoice.sum / 100, 'AED');
  console.log('vatSum:       ', (invoice.vatSum ?? 0) / 100, 'AED');
  console.log('vatEnabled:   ', invoice.vatEnabled);
  console.log('vatIncluded:  ', invoice.vatIncluded);
  console.log('applicable:   ', invoice.applicable);
  console.log('description:  ', invoice.description || '(empty)');
  console.log('paymentPlannedMoment: ', invoice.paymentPlannedMoment || '(not set)');
  console.log('shipmentAddress:      ', invoice.shipmentAddress || '(empty)');
  if (invoice.shipmentAddressFull) {
    const f = invoice.shipmentAddressFull;
    console.log('shipmentAddressFull.country: ', f.country?.meta?.href ? 'set' : '(empty)');
    console.log('shipmentAddressFull.city:    ', f.city || '(empty)');
    console.log('shipmentAddressFull.street:  ', f.street || '(empty)');
  }

  // Counterparty
  const agent = invoice.agent;
  console.log('\n═══ COUNTERPARTY ═══');
  console.log('id:             ', agent.id);
  console.log('name:           ', agent.name);
  console.log('phone:          ', agent.phone || '(empty)');
  console.log('email:          ', agent.email || '(empty)');
  console.log('actualAddress:  ', agent.actualAddress || '(empty)');
  console.log('legalAddress:   ', agent.legalAddress || '(empty)');
  if (agent.actualAddressFull) {
    const a = agent.actualAddressFull;
    console.log('actualAddressFull.city:   ', a.city || '(empty)');
    console.log('actualAddressFull.street: ', a.street || '(empty)');
  }
  console.log('inn:            ', agent.inn || '(empty)');
  console.log('kpp:            ', agent.kpp || '(empty)');

  // Organization
  const org = invoice.organization;
  console.log('\n═══ ORGANIZATION ═══');
  console.log('name:           ', org.name);
  console.log('actualAddress:  ', org.actualAddress || '(empty)');
  console.log('legalAddress:   ', org.legalAddress || '(empty)');

  // Positions
  console.log('\n═══ POSITIONS ═══');
  const positions = invoice.positions?.rows || [];
  const items = [];
  for (const p of positions) {
    const assortment = p.assortment || {};
    const name = assortment.name || '(unknown)';
    const qty = p.quantity;
    const priceAed = p.price / 100;
    const vatPct = p.vat ?? 0;
    const discount = p.discount ?? 0;
    const subtotalAed = qty * priceAed * (1 - discount / 100);

    console.log(
      `  ${qty}× ${name}  ·  ${priceAed.toFixed(2)} AED  ·  vat ${vatPct}% · disc ${discount}%  ·  = ${subtotalAed.toFixed(2)} AED`
    );
    items.push({
      name,
      quantity: qty,
      unitPrice: priceAed,
      discountPct: discount,
      vatPct,
      lineTotal: subtotalAed,
      assortmentHref: assortment.meta?.href,
    });
  }

  // Write a JSON file with everything the PDF generator needs
  const out = {
    invoice: {
      id: invoice.id,
      number: invoice.name,
      moment: invoice.moment,
      totalAed: invoice.sum / 100,
      vatSumAed: (invoice.vatSum ?? 0) / 100,
      vatEnabled: invoice.vatEnabled,
      vatIncluded: invoice.vatIncluded,
      description: invoice.description || '',
      paymentPlannedMoment: invoice.paymentPlannedMoment || null,
      shipmentAddress: invoice.shipmentAddress || '',
    },
    counterparty: {
      id: agent.id,
      name: agent.name,
      phone: agent.phone || '',
      email: agent.email || '',
      actualAddress: agent.actualAddress || '',
      legalAddress: agent.legalAddress || '',
    },
    organization: {
      name: org.name,
      actualAddress: org.actualAddress || '',
      legalAddress: org.legalAddress || '',
    },
    items,
    totals: {
      itemCount: items.length,
      totalQuantity: items.reduce((s, i) => s + i.quantity, 0),
      linesSum: items.reduce((s, i) => s + i.lineTotal, 0),
      invoiceTotal: invoice.sum / 100,
      vatSum: (invoice.vatSum ?? 0) / 100,
    },
  };

  const outPath = path.join(__dirname, '..', 'tmp', `moysklad-invoice-${invoiceNumber}.json`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`\n✅ Wrote ${outPath}`);
}

main().catch((err) => {
  console.error('💥 Error:', err.message);
  process.exit(1);
});
