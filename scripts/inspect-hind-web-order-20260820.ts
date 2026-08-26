import { prisma } from '../lib/prisma'

async function main() {
  const order = await prisma.order.findUnique({
    where: { orderNumber: 'CODM2608193118' },
    include: { items: true },
  })
  if (!order) throw new Error('Website order not found')
  const collagen = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '53' }, { name: { contains: 'Collagen Mask', mode: 'insensitive' } }] },
    select: { id: true, productNumber: true, name: true, image: true, price: true },
  })
  console.log(JSON.stringify({
    id: order.id,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    shipping: order.shipping,
    vat: order.vat,
    total: order.total,
    moySkladOrderId: order.moySkladOrderId,
    items: order.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      productName: i.productName,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
    })),
    collagen,
  }, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
