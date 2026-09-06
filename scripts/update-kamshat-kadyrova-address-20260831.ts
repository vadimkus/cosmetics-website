/**
 * Kamshat Kadyrova — website address to Kingsgate Hotel Al Jadaf, apt 701.
 * Does not rewrite historical completed orders.
 *
 *   npx tsx --env-file=.env.local scripts/update-kamshat-kadyrova-address-20260831.ts
 *   npx tsx --env-file=.env.local scripts/update-kamshat-kadyrova-address-20260831.ts --commit
 */

import { prisma } from '../lib/prisma'

const COMMIT = process.argv.includes('--commit')
const EMAIL = 'kamshat86@mail.ru'
const ADDRESS_LINE1 = 'Kingsgate Hotel Al Jadaf'
const ADDRESS_LINE2 = 'apt 701'
const USER_ADDRESS = 'Kingsgate Hotel Al Jadaf, apt 701, Dubai'
const ORDER_ADDRESS = 'Kingsgate Hotel Al Jadaf, apt 701, Dubai, United Arab Emirates'
const OPEN_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED']

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: EMAIL },
    include: {
      addresses: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { orderNumber: true, status: true, customerAddress: true, createdAt: true },
      },
    },
  })
  if (!user) throw new Error(`User not found: ${EMAIL}`)
  if (!/kamshat/i.test(user.name)) throw new Error(`Unexpected name: ${user.name}`)

  console.log('====================================================================')
  console.log('  Kamshat — website address')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('====================================================================')
  console.log(`  Was: ${user.address || '—'}`)
  console.log(`  Now: ${USER_ADDRESS}`)
  console.log(`  Saved addresses: ${user.addresses.length}`)
  for (const o of user.orders) {
    console.log(`  Order ${o.orderNumber} ${o.status} ${o.customerAddress}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { address: USER_ADDRESS },
  })

  const existing = user.addresses.find((a) => a.isDefault) || user.addresses[0]
  if (existing) {
    await prisma.address.update({
      where: { id: existing.id },
      data: {
        addressLine1: ADDRESS_LINE1,
        addressLine2: ADDRESS_LINE2,
        city: 'Dubai',
        emirate: 'Dubai',
        country: 'United Arab Emirates',
      },
    })
  } else {
    await prisma.address.create({
      data: {
        userId: user.id,
        type: 'home',
        label: 'Home',
        name: user.name,
        phone: user.phone || '+971551762261',
        addressLine1: ADDRESS_LINE1,
        addressLine2: ADDRESS_LINE2,
        city: 'Dubai',
        emirate: 'Dubai',
        country: 'United Arab Emirates',
        isDefault: true,
      },
    })
  }

  const openOrders = await prisma.order.findMany({
    where: { customerEmail: EMAIL, status: { in: OPEN_STATUSES } },
  })
  for (const order of openOrders) {
    await prisma.order.update({
      where: { id: order.id },
      data: { customerAddress: ORDER_ADDRESS, customerEmirate: 'Dubai' },
    })
    console.log(`  Updated open order ${order.orderNumber} (${order.status})`)
  }

  console.log('  Updated website profile + saved address')
}

main()
  .catch((e) => {
    console.error('FATAL:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
