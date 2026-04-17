#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client')
const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.POSTGRES_URL
if (!databaseUrl) { console.error('Set DB URL'); process.exit(1) }
let prisma
if (databaseUrl.startsWith('prisma+')) {
  prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })
} else {
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')
  const pool = new Pool({ connectionString: databaseUrl })
  prisma = new PrismaClient({ adapter: new PrismaPg(pool), log: ['error'] })
}

async function main() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true, title: true, slug: true, published: true,
      publishedAt: true, tags: true, views: true,
      titleAr: true, titleRu: true,
    }
  })
  console.log(`Total posts: ${posts.length}`)
  console.log(`Published:   ${posts.filter(p => p.published).length}\n`)
  for (const p of posts) {
    const status = p.published ? '✓' : '✗'
    const date = p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 10) : 'draft'
    const i18n = [p.titleAr ? 'AR' : '', p.titleRu ? 'RU' : ''].filter(Boolean).join('+') || 'EN-only'
    console.log(`${status} ${date}  views=${String(p.views).padStart(4)}  [${i18n.padEnd(5)}]  ${p.title}`)
    console.log(`   slug: ${p.slug}`)
    if (p.tags) console.log(`   tags: ${p.tags}`)
  }
}
main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
