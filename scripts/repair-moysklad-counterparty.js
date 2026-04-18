/**
 * Repair the actualAddressFull on a MoySklad counterparty linked to one of
 * our pushed orders. Looks up the order, reads our DB for the source
 * address, then PATCHes the counterparty with a structured address.
 *
 * Use when the Apr-17 fix populated the ORDER's shipmentAddressFull but the
 * counterparty card was left blank (or manually truncated) because it was
 * created before the counterparty-address fix.
 *
 * Usage:
 *   node scripts/repair-moysklad-counterparty.js <orderNumber>
 *
 * Set DRY_RUN=1 to preview without writing.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local'), override: false });

const { PrismaClient } = require('@prisma/client');

const MOYSKLAD_API = 'https://api.moysklad.ru/api/remap/1.2';
const MOYSKLAD_COUNTRY_UAE_ID = '8afef359-33c6-11ea-0a80-0043000aceae';

const login = process.env.MOYSKLAD_LOGIN?.trim();
const password = process.env.MOYSKLAD_PASSWORD?.trim();
if (!login || !password) {
  console.error('❌ MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD not set');
  process.exit(1);
}
const AUTH = 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64');

async function msFetch(pathStr, options = {}) {
  const url = pathStr.startsWith('http') ? pathStr : `${MOYSKLAD_API}${pathStr}`;
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      Authorization: AUTH,
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip',
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.substring(0, 500)}`);
  }
  return res.json();
}

function entityMeta(type, id) {
  return {
    meta: {
      href: `${MOYSKLAD_API}/entity/${type}/${id}`,
      type,
      mediaType: 'application/json',
    },
  };
}

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL / PRISMA_DATABASE_URL not set');
  process.exit(1);
}

let prisma;
if (databaseUrl.startsWith('prisma+')) {
  prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] });
} else {
  const { PrismaPg } = require('@prisma/adapter-pg');
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter, log: ['error'] });
}

const DRY_RUN = process.env.DRY_RUN === '1';

async function main() {
  const orderNumber = process.argv[2];
  if (!orderNumber) {
    console.error('Usage: node scripts/repair-moysklad-counterparty.js <orderNumber>');
    process.exit(1);
  }

  // 1. Get source address from our DB
  const order = await prisma.order.findUnique({ where: { orderNumber } });
  if (!order) {
    console.error('❌ Order not found in our DB:', orderNumber);
    process.exit(1);
  }
  const street = (order.customerAddress || '').replace(/\s+/g, ' ').trim();
  const city = (order.customerEmirate || '').trim();
  console.log('── source from our DB ──');
  console.log('  customerName:   ', order.customerName);
  console.log('  customerEmirate:', city);
  console.log('  customerAddress:', street);

  // 2. Find the order in MoySklad
  const search = await msFetch(
    `/entity/customerorder?filter=name=${encodeURIComponent(orderNumber)}&limit=1`
  );
  const msOrder = search.rows?.[0];
  if (!msOrder) {
    console.error('❌ Order not found in MoySklad:', orderNumber);
    process.exit(1);
  }
  if (!msOrder.agent?.meta?.href) {
    console.error('❌ MoySklad order has no counterparty link');
    process.exit(1);
  }

  // 3. Fetch the current counterparty
  const cpPath = msOrder.agent.meta.href.replace(MOYSKLAD_API, '');
  const cp = await msFetch(cpPath);
  console.log('\n── MoySklad counterparty BEFORE ──');
  console.log('  id:                           ', cp.id);
  console.log('  name:                         ', cp.name);
  console.log('  actualAddress:                ', cp.actualAddress || '(empty)');
  if (cp.actualAddressFull) {
    console.log('  actualAddressFull.country:    ', cp.actualAddressFull.country?.meta?.href ? 'set' : '(empty)');
    console.log('  actualAddressFull.city:       ', cp.actualAddressFull.city || '(empty)');
    console.log('  actualAddressFull.street:     ', cp.actualAddressFull.street || '(empty)');
    console.log('  actualAddressFull.addInfo:    ', cp.actualAddressFull.addInfo || '(empty)');
  } else {
    console.log('  actualAddressFull:            (not set)');
  }

  // Guard: if address already looks populated AND matches our source, do nothing.
  const alreadyClean =
    cp.actualAddressFull &&
    cp.actualAddressFull.country?.meta?.href &&
    cp.actualAddressFull.city === city &&
    cp.actualAddressFull.street === street &&
    !cp.actualAddressFull.addInfo;
  if (alreadyClean) {
    console.log('\n🟢 Counterparty already has clean structured address matching our DB. Nothing to do.');
    return;
  }

  // 4. Build PATCH body. Clear `actualAddress` (plain string) and set
  //    `actualAddressFull` structured, same way we do for the order.
  const patchBody = {
    actualAddress: '', // clear any stale / truncated manual entry
    actualAddressFull: {
      country: entityMeta('country', MOYSKLAD_COUNTRY_UAE_ID),
      ...(city ? { city } : {}),
      ...(street ? { street } : {}),
      addInfo: '', // wipe any leftover plain-string leak
    },
  };

  console.log('\n── PATCH body ──');
  console.log(JSON.stringify(patchBody, null, 2));

  if (DRY_RUN) {
    console.log('\n🟡 DRY_RUN=1 — no PATCH sent.');
    return;
  }

  // 5. PATCH the counterparty
  const updated = await msFetch(cpPath, { method: 'PUT', body: patchBody });
  console.log('\n── MoySklad counterparty AFTER ──');
  console.log('  id:                           ', updated.id);
  console.log('  actualAddress:                ', updated.actualAddress || '(empty)');
  if (updated.actualAddressFull) {
    console.log('  actualAddressFull.country:    ', updated.actualAddressFull.country?.meta?.href ? 'set' : '(empty)');
    console.log('  actualAddressFull.city:       ', updated.actualAddressFull.city || '(empty)');
    console.log('  actualAddressFull.street:     ', updated.actualAddressFull.street || '(empty)');
    console.log('  actualAddressFull.addInfo:    ', updated.actualAddressFull.addInfo || '(empty)');
  }
  console.log('\n✅ Counterparty address repaired.');
}

main()
  .catch((err) => {
    console.error('💥 Error:', err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
