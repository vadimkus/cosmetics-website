/**
 * Inspect an order and the replacement product before doing any updates.
 * Usage: node scripts/inspect-order.js <orderNumber> <targetProductNumberOrId>
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

async function main() {
  const orderNumber = process.argv[2];
  const targetProductKey = process.argv[3];

  if (!orderNumber || !targetProductKey) {
    console.error('Usage: node scripts/inspect-order.js <orderNumber> <targetProductNumberOrId>');
    process.exit(1);
  }

  console.log('🔍 Looking up order:', orderNumber);
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
    },
  });

  if (!order) {
    console.error('❌ Order not found');
    process.exit(1);
  }

  console.log('\n═══ ORDER ═══');
  console.log('id:            ', order.id);
  console.log('orderNumber:   ', order.orderNumber);
  console.log('customer:      ', order.customerName, '<' + order.customerEmail + '>');
  console.log('phone:         ', order.customerPhone);
  console.log('emirate:       ', order.customerEmirate);
  console.log('status:        ', order.status);
  console.log('paymentStatus: ', order.paymentStatus);
  console.log('paymentMethod: ', order.paymentMethod);
  console.log('subtotal:      ', order.subtotal);
  console.log('shipping:      ', order.shipping);
  console.log('vat:           ', order.vat);
  console.log('total:         ', order.total);
  console.log('createdAt:     ', order.createdAt);
  console.log('moySkladId:    ', order.moySkladOrderId || '(not pushed)');

  console.log('\n═══ ITEMS (' + order.items.length + ') ═══');
  for (const item of order.items) {
    console.log('---');
    console.log('id:          ', item.id);
    console.log('productId:   ', item.productId);
    console.log('productName: ', item.productName);
    console.log('price:       ', item.price);
    console.log('quantity:    ', item.quantity);
    console.log('size:        ', item.size);
    console.log('color:       ', item.color);
    console.log('image:       ', item.image);
  }

  console.log('\n🔍 Looking up target product. Trying id=' + targetProductKey + ' and productNumber=' + targetProductKey);
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: targetProductKey },
        { productNumber: targetProductKey },
      ],
    },
    include: {
      variants: true,
    },
  });

  if (!product) {
    console.error('❌ Product not found by id or productNumber');
    process.exit(1);
  }

  console.log('\n═══ TARGET PRODUCT ═══');
  console.log('id:            ', product.id);
  console.log('productNumber: ', product.productNumber);
  console.log('name:          ', product.name);
  console.log('category:      ', product.category);
  console.log('price:         ', product.price);
  console.log('size:          ', product.size);
  console.log('image:         ', product.image);

  if (product.variants && product.variants.length > 0) {
    console.log('\n── VARIANTS ──');
    for (const v of product.variants) {
      console.log('  size=' + v.size, 'color=' + v.color, 'price=' + v.price, 'default=' + v.isDefault, 'available=' + v.available);
    }
  } else {
    console.log('(no variants)');
  }

  // Also look up the current product from the item for comparison
  if (order.items.length > 0) {
    const currentItem = order.items[0];
    console.log('\n🔍 Looking up CURRENT product in the order: id=' + currentItem.productId);
    const currentProduct = await prisma.product.findFirst({
      where: {
        OR: [
          { id: currentItem.productId },
          { productNumber: currentItem.productId },
        ],
      },
    });
    if (currentProduct) {
      console.log('current product.id:            ', currentProduct.id);
      console.log('current product.productNumber: ', currentProduct.productNumber);
      console.log('current product.name:          ', currentProduct.name);
    } else {
      console.log('(current product not found in products table)');
    }
  }
}

main()
  .catch((err) => {
    console.error('💥 Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
