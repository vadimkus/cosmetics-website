/**
 * Updates the 4 non-square / letterboxed blog featured images on /blog to
 * crisp 1:1 1200x1200 Sunra editorial clinical luxury covers (Nov 24, 2026).
 *
 * Refuses to write until all 4 new URLs return HTTP 200 on genosys.ae.
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/update-blog-covers-sunra-2026-11.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-blog-covers-sunra-2026-11.ts --apply
 */
import { prisma } from '../lib/prisma'

const UPDATES: Array<{ slug: string; featuredImage: string }> = [
  {
    slug: 'uae-summer-skincare-survival-guide-2026',
    featuredImage: '/images/blog/cover-uae-summer-2026-v2.jpg',
  },
  {
    slug: 'genosys-android-app-2026',
    featuredImage: '/images/blog/cover-android-app-2026-v2.jpg',
  },
  {
    slug: 'revita-glow-bb-cream-glass-skin-2026',
    featuredImage: '/images/blog/cover-revita-glow-bb-2026-v2.jpg',
  },
  {
    slug: 'genosys-ios-app-2026',
    featuredImage: '/images/blog/cover-ios-app-2026-v2.jpg',
  },
]

async function live(path: string): Promise<boolean> {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`https://genosys.ae${path}`, { method: 'HEAD' })
      return res.ok
    } catch (error) {
      if (attempt === 3) throw error
    }
  }
}

async function main() {
  const apply = process.argv.includes('--apply')

  const missing: string[] = []
  for (const item of UPDATES) {
    if (!(await live(item.featuredImage))) missing.push(item.featuredImage)
  }
  if (missing.length) {
    console.error(`Not live yet (${missing.length}):`, missing.join(', '))
    process.exitCode = 1
    return
  }
  console.log(`All ${UPDATES.length} new 1:1 covers return 200 on genosys.ae`)

  for (const item of UPDATES) {
    const post = await prisma.blogPost.findUnique({
      where: { slug: item.slug },
      select: { id: true, slug: true, featuredImage: true },
    })
    if (!post) throw new Error(`BlogPost not found: ${item.slug}`)
    console.log(`${post.slug}: ${post.featuredImage} -> ${item.featuredImage}`)
    if (apply) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { featuredImage: item.featuredImage },
      })
    }
  }

  console.log(apply ? 'Updated all 4 blog covers in DB.' : 'Dry run — pass --apply to write.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
