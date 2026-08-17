/**
 * gildaze jamolod / CODM2608169758 — fix delivery address.
 *
 *   npx tsx --env-file=.env.local scripts/fix-gildaze-jamolod-address-20260817.ts
 *   npx tsx --env-file=.env.local scripts/fix-gildaze-jamolod-address-20260817.ts --commit
 */

import { prisma } from '../lib/prisma'

const COMMIT = process.argv.includes('--commit')
const ORDER_NUMBER = 'CODM2608169758'
const EMAIL = 'jamolodgildaze@gmail.com'
const ADDRESS_LINE1 = 'Villa 20B, 13b Street, Jumeirah 1'
const CITY = 'Dubai'
const ORDER_ADDRESS = 'Villa 20B, 13b Street, Jumeirah 1, Dubai, United Arab Emirates'
const USER_ADDRESS = 'Villa 20B, 13b Street, Jumeirah 1, Dubai'

async function main() {
  const order = await prisma.order.findUnique({
    where: { orderNumber: ORDER_NUMBER },
    select: {
      id: true,
      orderNumber: true,
      customerName: true,
      customerEmail: true,
      customerAddress: true,
    },
  })
  if (!order) throw new Error(`Order not found: ${ORDER_NUMBER}`)
  if (order.customerEmail !== EMAIL) throw new Error(`Email mismatch: ${order.customerEmail}`)

  const user = await prisma.user.findUnique({
    where: { email: EMAIL },
    include: { addresses: true },
  })
  if (!user) throw new Error(`User not found: ${EMAIL}`)

  console.log('====================================================================')
  console.log('  gildaze jamolod — address fix')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('====================================================================')
  console.log(`  Order: ${order.orderNumber}`)
  console.log(`  Was:   ${order.customerAddress}`)
  console.log(`  Now:   ${ORDER_ADDRESS}`)
  console.log(`  User address was: ${user.address || '—'}`)
  console.log(`  Saved addresses: ${user.addresses.length}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { customerAddress: ORDER_ADDRESS, customerEmirate: 'Dubai' },
  })

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
        addressLine2: null,
        city: CITY,
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
        phone: user.phone || '+971544331960',
        addressLine1: ADDRESS_LINE1,
        city: CITY,
        emirate: 'Dubai',
        country: 'United Arab Emirates',
        isDefault: true,
      },
    })
  }

  const check = await prisma.order.findUnique({
    where: { id: order.id },
    select: { customerAddress: true },
  })
  console.log(`\n  Updated order address: ${check?.customerAddress}`)
}

main()
  .catch((e) => {
    console.error('FATAL:', e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
