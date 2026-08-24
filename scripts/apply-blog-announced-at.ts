/**
 * Applies the `blog_posts.announcedAt` column.
 *
 * The repo's migration history predates the current Prisma tooling in places, so
 * `migrate deploy` is not safe to run wholesale here. This applies the one
 * statement, idempotently.
 *
 * Run: npx tsx --env-file=.env.local scripts/apply-blog-announced-at.ts
 */
import { prisma } from '../lib/prisma'

async function main() {
  await prisma.$executeRawUnsafe('ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "announcedAt" TIMESTAMP(3)')

  const [row] = await prisma.$queryRawUnsafe<Array<{ column_name: string; data_type: string }>>(
    `SELECT column_name, data_type FROM information_schema.columns
     WHERE table_name = 'blog_posts' AND column_name = 'announcedAt'`
  )
  console.log(row ? `ok: announcedAt (${row.data_type})` : 'FAILED: column not present')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
