/**
 * Hind Lougay — copy phone + address from CODM2608193118 onto the user card.
 *
 *   npx tsx --env-file=.env.local scripts/fix-hind-lougay-details-20260819.ts
 *   npx tsx --env-file=.env.local scripts/fix-hind-lougay-details-20260819.ts --commit
 */

import { prisma } from '../lib/prisma'

const COMMIT = process.argv.includes('--commit')
const EMAIL = 'hlougay@gmail.com'
const ORDER_NUMBER = 'CODM2608193118'
const PHONE = '+971507806962'
const ADDRESS_LINE1 = 'Mohamed Bin Zayed Zone 14 Inshad Street Compound 23 Villa 28'
const USER_ADDRESS = `${ADDRESS_LINE1}, Abu Dhabi`

async function main() {
  const order = await prisma.order.findUnique({
    where: { orderNumber: ORDER_NUMBER },
    select: {
      orderNumber: true,
      customerEmail: true,
      customerPhone: true,
      customerAddress: true,
      customerEmirate: true,
    },
  })
  if (!order) throw new Error(`Order not found: ${ORDER_NUMBER}`)
  if (order.customerEmail !== EMAIL) throw new Error(`Email mismatch: ${order.customerEmail}`)
  if (order.customerPhone !== PHONE) throw new Error(`Phone mismatch: ${order.customerPhone}`)

  const user = await prisma.user.findUnique({
    where: { email: EMAIL },
    include: { addresses: true },
  })
  if (!user) throw new Error(`User not found: ${EMAIL}`)
  if (user.name !== 'Hind Lougay') throw new Error(`Unexpected name: ${user.name}`)

  console.log('====================================================================')
  console.log('  Hind Lougay — fill phone + address from order')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('====================================================================')
  console.log(`  User:  ${user.id}`)
  console.log(`  Order: ${order.orderNumber}`)
  console.log(`  Phone was:    ${user.phone || '—'}`)
  console.log(`  Phone now:    ${PHONE}`)
  console.log(`  Address was:  ${user.address || '—'}`)
  console.log(`  Address now:  ${USER_ADDRESS}`)
  console.log(`  Saved addresses: ${user.addresses.length}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { phone: PHONE, address: USER_ADDRESS },
  })

  const existing = user.addresses.find((a) => a.isDefault) || user.addresses[0]
  if (existing) {
    await prisma.address.update({
      where: { id: existing.id },
      data: {
        phone: PHONE,
        addressLine1: ADDRESS_LINE1,
        addressLine2: null,
        city: 'Abu Dhabi',
        emirate: 'Abu Dhabi',
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
        phone: PHONE,
        addressLine1: ADDRESS_LINE1,
        city: 'Abu Dhabi',
        emirate: 'Abu Dhabi',
        country: 'United Arab Emirates',
        isDefault: true,
      },
    })
  }

  const check = await prisma.user.findUnique({
    where: { id: user.id },
    select: { phone: true, address: true },
  })
  console.log(`\n  Updated phone:   ${check?.phone}`)
  console.log(`  Updated address: ${check?.address}`)
}

main()
  .catch((e) => {
    console.error('FATAL:', e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
