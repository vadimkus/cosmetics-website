import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const rows = await prisma.newsletterSubscriber.findMany({
  orderBy: { createdAt: 'desc' },
  take: 5,
  select: { email: true, locale: true, source: true, isActive: true, userId: true, unsubscribeToken: true, subscribedAt: true },
})
console.log(JSON.stringify(rows, null, 2))
await prisma.$disconnect()
