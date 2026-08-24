/**
 * Marks every pre-existing published post as already announced.
 *
 * `announcedAt` starts null on every row, and null means "never announced". Left
 * alone, editing any of the back catalogue in the admin panel would fire a push
 * and an email for an article published months ago. This backdates the stamp to
 * each post's publish date so only genuinely new posts can notify anyone.
 *
 * Pass slugs to exclude if a post is waiting to be announced for real.
 *
 * Run: npx tsx --env-file=.env.local scripts/backfill-blog-announced-at.ts [--except slug,slug]
 */
import { prisma } from '../lib/prisma'

async function main() {
  const exceptArg = process.argv.indexOf('--except')
  const except = exceptArg === -1 ? [] : (process.argv[exceptArg + 1] || '').split(',').filter(Boolean)

  const pending = await prisma.blogPost.findMany({
    where: { published: true, announcedAt: null, slug: { notIn: except } },
    select: { id: true, slug: true, publishedAt: true, createdAt: true },
  })

  for (const post of pending) {
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { announcedAt: post.publishedAt ?? post.createdAt },
    })
    console.log(`  stamped ${post.slug}`)
  }

  console.log(`\n${pending.length} post(s) marked as already announced.`)
  if (except.length) console.log(`Left unannounced: ${except.join(', ')}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
