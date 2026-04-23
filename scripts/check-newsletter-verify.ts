import { prisma } from '../lib/prisma'

async function main() {
  const mode = process.argv[2] || 'list'
  if (mode === 'token') {
    const r = await prisma.newsletterSubscriber.findFirst({
      where: { locale: 'en', isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    console.log(r?.unsubscribeToken || '')
  } else {
    const rows = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        email: true,
        locale: true,
        source: true,
        isActive: true,
        userId: true,
        unsubscribeToken: true,
        subscribedAt: true,
        unsubscribedAt: true,
      },
    })
    console.log('Newsletter subscribers (latest 5):')
    for (const r of rows) {
      console.log(
        `  ${r.isActive ? 'active ' : 'UNSUB  '}${r.email}  [${r.locale}] src=${r.source}  token=${r.unsubscribeToken.slice(0, 10)}...  sub=${r.subscribedAt.toISOString()}${r.unsubscribedAt ? ` unsub=${r.unsubscribedAt.toISOString()}` : ''}`
      )
    }
  }
  await prisma.$disconnect()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
