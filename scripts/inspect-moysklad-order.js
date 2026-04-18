/**
 * Query MoySklad directly and show the raw server-side state of a pushed order
 * AND the linked counterparty (customer) record.
 *
 * Use to debug "what did MoySklad actually receive / store?".
 *
 * Usage:
 *   node scripts/inspect-moysklad-order.js <orderNumber>
 */

const path = require('path');
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
    headers: {
      Authorization: AUTH,
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.substring(0, 500)}`);
  }
  return res.json();
}

function printAddressFull(label, obj) {
  console.log(`\n── ${label} ──`);
  if (!obj) {
    console.log('  (not set)');
    return;
  }
  console.log('  postalCode:  ', obj.postalCode || '(empty)');
  console.log('  country:     ', obj.country?.meta?.href?.split('/').slice(-2).join('/') || '(empty)');
  console.log('  region:      ', obj.region?.name || obj.region?.meta?.href?.split('/').slice(-2).join('/') || '(empty)');
  console.log('  city:        ', obj.city || '(empty)');
  console.log('  street:      ', obj.street || '(empty)');
  console.log('  house:       ', obj.house || '(empty)');
  console.log('  apartment:   ', obj.apartment || '(empty)');
  console.log('  addInfo:     ', obj.addInfo || '(empty)');
  console.log('  comment:     ', obj.comment || '(empty)');
}

async function main() {
  const orderNumber = process.argv[2];
  if (!orderNumber) {
    console.error('Usage: node scripts/inspect-moysklad-order.js <orderNumber>');
    process.exit(1);
  }

  console.log('🔍 Searching MoySklad for customerorder name=' + orderNumber);

  const search = await msGet(
    `/entity/customerorder?filter=name=${encodeURIComponent(orderNumber)}&limit=5`
  );

  if (!search.rows || search.rows.length === 0) {
    console.error('❌ Not found in MoySklad');
    process.exit(1);
  }

  for (const row of search.rows) {
    console.log('\n═══ CUSTOMER ORDER ═══');
    console.log('id:            ', row.id);
    console.log('name:          ', row.name);
    console.log('moment:        ', row.moment);
    console.log('sum:           ', row.sum / 100, 'AED');
    console.log('description:   ', row.description);

    console.log('\n── order.shipmentAddress (plain string) ──');
    console.log('  ', row.shipmentAddress || '(empty)');

    printAddressFull('order.shipmentAddressFull (structured)', row.shipmentAddressFull);

    // Fetch the counterparty (customer)
    if (row.agent?.meta?.href) {
      const cpPath = row.agent.meta.href.replace(MOYSKLAD_API, '');
      try {
        const cp = await msGet(cpPath);
        console.log('\n═══ COUNTERPARTY (Customer) ═══');
        console.log('id:           ', cp.id);
        console.log('name:         ', cp.name);
        console.log('phone:        ', cp.phone || '(empty)');
        console.log('email:        ', cp.email || '(empty)');
        console.log('description:  ', cp.description || '(empty)');
        console.log('companyType:  ', cp.companyType);
        console.log('createdAt:    ', cp.created);
        console.log('updatedAt:    ', cp.updated);

        console.log('\n── counterparty.legalAddress (plain) ──');
        console.log('  ', cp.legalAddress || '(empty)');

        console.log('\n── counterparty.actualAddress (plain) ──');
        console.log('  ', cp.actualAddress || '(empty)');

        printAddressFull('counterparty.legalAddressFull', cp.legalAddressFull);
        printAddressFull('counterparty.actualAddressFull', cp.actualAddressFull);
      } catch (e) {
        console.log('  (could not fetch counterparty:', e.message + ')');
      }
    }
  }
}

main().catch((err) => {
  console.error('💥 Error:', err.message);
  process.exit(1);
});
