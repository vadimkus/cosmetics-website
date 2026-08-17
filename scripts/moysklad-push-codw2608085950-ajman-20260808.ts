/**
 * Push CODW2608085950 (Ajman / meryem malak lezzar) after Ajman delivery mapping fix.
 *
 *   npx tsx --env-file=.env.local scripts/moysklad-push-codw2608085950-ajman-20260808.ts
 */
import path from 'path'
import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { createMoySkladOrder, prepareMoySkladOrderForPush } from '../lib/moysklad'

config({ path: path.join(__dirname, '..', '.env.local') })

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL required')

let prisma: PrismaClient
if (databaseUrl.startsWith('prisma+') || databaseUrl.includes('accelerate') || databaseUrl.includes('prisma.io')) {
  prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })
} else {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaPg } = require('@prisma/adapter-pg')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool } = require('pg')
  prisma = new PrismaClient({
    adapter: new PrismaPg(new Pool({ connectionString: databaseUrl })),
    log: ['error'],
  })
}

const ORDER_NUMBER = 'CODW2608085950'

async function main() {
  const order = await prisma.order.findFirst({
    where: { orderNumber: ORDER_NUMBER },
    include: { items: true },
  })
  if (!order) throw new Error(`order not found: ${ORDER_NUMBER}`)

  console.log(
    `Pushing ${order.orderNumber} total=${order.total} shipping=${order.shipping} emirate=${order.customerEmirate}`
  )

  const prep = await prepareMoySkladOrderForPush(
    order.orderNumber,
    order.moySkladOrderId,
    order.total
  )
  if (!prep.ok) throw new Error(prep.error || 'prep failed')

  const freePromoProductIds = order.items
    .filter((item) => Number(item.price || 0) === 0 && item.size === '__PROMO__')
    .map((item) => item.productId)

  const freePromoProducts =
    freePromoProductIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: freePromoProductIds } },
          select: { id: true, price: true },
        })
      : []

  const productPriceById = new Map(freePromoProducts.map((p) => [p.id, p.price]))

  const result = await createMoySkladOrder({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone || '',
    customerAddress: order.customerAddress || '',
    customerEmirate: order.customerEmirate || '',
    items: order.items.map((item) => {
      const bundleDiscount = Number(item.bundleDiscount || 0)
      const hasBundleDiscount =
        bundleDiscount > 0 && bundleDiscount < 100 && Number(item.price || 0) > 0
      const isFreePromo = Number(item.price || 0) === 0 && item.size === '__PROMO__'
      const isBeautyBox = item.productName.toLowerCase().includes('beauty box')
      const retailPrice = isFreePromo
        ? productPriceById.get(item.productId) || item.price
        : hasBundleDiscount || isBeautyBox
          ? Math.round((item.price / (1 - (hasBundleDiscount ? bundleDiscount : 15) / 100)) * 100) /
            100
          : item.price

      return {
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        retailPrice,
        ...(isFreePromo || hasBundleDiscount || isBeautyBox
          ? { discountPercent: isFreePromo ? 100 : hasBundleDiscount ? bundleDiscount : 15 }
          : {}),
        color: item.color,
        size: item.size,
      }
    }),
    total: order.total,
    shipping: order.shipping || 0,
    loyaltyDiscountAmount: order.loyaltyDiscountAmount || 0,
    loyaltyPointsRedeemed: order.loyaltyPointsRedeemed || 0,
    paymentMethod: order.paymentMethod || 'cod',
    paymentStatus: order.paymentStatus || 'pending',
  })

  console.log(JSON.stringify(result, null, 2))
  if (!result.success) process.exit(1)

  await prisma.order.update({
    where: { id: order.id },
    data: {
      moySkladOrderId: result.moySkladOrderId ?? null,
      moySkladSyncedAt: new Date(),
    },
  })
  console.log('DB updated moySkladOrderId=', result.moySkladOrderId)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
