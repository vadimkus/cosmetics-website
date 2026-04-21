/**
 * Swap a single order item in place (keeps OrderItem.id, order totals unchanged).
 * Use when the replacement product has the same price — no subtotal/VAT/total math.
 *
 * Usage:
 *   node scripts/update-order-item.js <orderNumber> <orderItemId> <newProductId>
 *
 * Example:
 *   node scripts/update-order-item.js GENCardW2604183818 cmo4ek5bp00k0gfjxacb5gbj8 15
 *
 * Set DRY_RUN=1 to preview without writing.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { PrismaClient } = require('@prisma/client');

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL or PRISMA_DATABASE_URL not found');
  process.exit(1);
}

let prisma;
const isAccelerate = databaseUrl.startsWith('prisma+');
if (isAccelerate) {
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
  const [orderNumber, orderItemId, newProductKey] = process.argv.slice(2);
  if (!orderNumber || !orderItemId || !newProductKey) {
    console.error('Usage: node scripts/update-order-item.js <orderNumber> <orderItemId> <newProductId>');
    process.exit(1);
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order) {
    console.error('❌ Order not found:', orderNumber);
    process.exit(1);
  }

  const item = order.items.find((i) => i.id === orderItemId);
  if (!item) {
    console.error('❌ OrderItem not found on this order:', orderItemId);
    process.exit(1);
  }

  const newProduct = await prisma.product.findFirst({
    where: {
      OR: [{ id: newProductKey }, { productNumber: newProductKey }],
    },
    include: { variants: true },
  });
  if (!newProduct) {
    console.error('❌ Replacement product not found:', newProductKey);
    process.exit(1);
  }

  if (newProduct.price !== item.price) {
    console.error(
      `❌ Price mismatch. Current item price=${item.price}, new product price=${newProduct.price}. ` +
        'Aborting to avoid silent total changes. Update the script to handle repricing if intended.'
    );
    process.exit(1);
  }

  if (order.moySkladOrderId) {
    console.warn(
      `⚠️  Order already pushed to MoySklad (id=${order.moySkladOrderId}). ` +
        'DB update will NOT propagate to MoySklad — you will need to fix it there manually.'
    );
  }

  console.log('═══ PLANNED CHANGE ═══');
  console.log(`orderNumber:   ${order.orderNumber}`);
  console.log(`orderItem.id:  ${item.id}`);
  console.log('');
  console.log('BEFORE:');
  console.log('  productId:   ', item.productId);
  console.log('  productName: ', item.productName);
  console.log('  price:       ', item.price);
  console.log('  quantity:    ', item.quantity);
  console.log('  size:        ', item.size);
  console.log('  color:       ', item.color);
  console.log('  image:       ', item.image);
  console.log('');
  console.log('AFTER:');
  console.log('  productId:   ', newProduct.id);
  console.log('  productName: ', newProduct.name);
  console.log('  price:       ', newProduct.price, '(unchanged)');
  console.log('  quantity:    ', item.quantity, '(unchanged)');
  console.log('  size:        ', item.size, '(unchanged)');
  console.log('  color:       ', item.color, '(unchanged)');
  console.log('  image:       ', newProduct.image);
  console.log('');

  if (DRY_RUN) {
    console.log('🟡 DRY_RUN=1 — no changes written.');
    return;
  }

  const updated = await prisma.orderItem.update({
    where: { id: item.id },
    data: {
      productId: newProduct.id,
      productName: newProduct.name,
      image: newProduct.image,
    },
  });

  console.log('✅ OrderItem updated.');
  console.log('   new productId:   ', updated.productId);
  console.log('   new productName: ', updated.productName);
  console.log('   new image:       ', updated.image);

  // Touch the order so updatedAt reflects this manual change.
  await prisma.order.update({
    where: { id: order.id },
    data: { updatedAt: new Date() },
  });
  console.log('✅ Order updatedAt refreshed.');
}

main()
  .catch((err) => {
    console.error('💥 Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
