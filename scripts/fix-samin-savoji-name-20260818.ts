/**
 * Samin Savoji — capitalize name on website order / user if present.
 * MoySklad counterparty already renamed.
 *
 *   npx tsx --env-file=.env --env-file=.env.local scripts/fix-samin-savoji-name-20260818.ts
 *   npx tsx --env-file=.env --env-file=.env.local scripts/fix-samin-savoji-name-20260818.ts --commit
 */

import { prisma } from '../lib/prisma'

const COMMIT = process.argv.includes('--commit')
const NAME = 'Samin Savoji'
const ORDER_NUMBER = 'GENCardW2608173711'

async function main() {
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { orderNumber: ORDER_NUMBER },
        { customerName: { equals: 'samin savoji', mode: 'insensitive' } },
      ],
    },
    select: { id: true, orderNumber: true, customerName: true, customerEmail: true },
  })

  console.log('====================================================================')
  console.log('  Website name → Samin Savoji')
  console.log(`  Mode: ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log('====================================================================')

  if (!order) {
    console.log('  No matching website order — MoySklad only.')
    return
  }

  console.log(`  Order ${order.orderNumber}: "${order.customerName}" ${order.customerEmail || ''}`)

  const user = order.customerEmail
    ? await prisma.user.findUnique({
        where: { email: order.customerEmail },
        include: { addresses: true },
      })
    : null
  if (user) {
    console.log(`  User: "${user.name}"`)
    console.log(`  Addresses: ${user.addresses.map((a) => a.name).join(', ') || '—'}`)
  }

  if (!COMMIT) {
    console.log('\n  DRY RUN — re-run with --commit')
    return
  }

  if (order.customerName !== NAME) {
    await prisma.order.update({
      where: { id: order.id },
      data: { customerName: NAME },
    })
    console.log('  Order name updated')
  }

  if (user && user.name !== NAME) {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: NAME },
    })
    console.log('  User name updated')
  }

  if (user) {
    for (const address of user.addresses) {
      if (/samin\s+savoji/i.test(address.name) && address.name !== NAME) {
        await prisma.address.update({
          where: { id: address.id },
          data: { name: NAME },
        })
        console.log(`  Address ${address.id} name updated`)
      }
    }
  }
}

main()
  .catch((e) => {
    console.error('FATAL:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
