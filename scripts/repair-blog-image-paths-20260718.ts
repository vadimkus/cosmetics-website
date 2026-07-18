/**
 * Repairs image paths found by scripts/audit-blog-images.ts on 2026-07-18.
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/repair-blog-image-paths-20260718.ts
 */
import { prisma } from '../lib/prisma'

const K_BEAUTY_SLUG =
  'k-beauty-delivery-tech-pdrn-exosomes-spicules-2026'
const SUMMER_SLUG = 'uae-summer-skincare-survival-guide-2026'

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.blogPost.update({
      where: { slug: K_BEAUTY_SLUG },
      data: { featuredImage: '/images/6000/main.jpg' },
    })

    const summer = await tx.blogPost.findUniqueOrThrow({
      where: { slug: SUMMER_SLUG },
      select: { content: true, contentAr: true, contentRu: true },
    })

    const replaceSnow = (html: string | null) =>
      html?.replaceAll('/images/SNOW.jpg', '/images/cleanser/Main.jpg') ?? null

    await tx.blogPost.update({
      where: { slug: SUMMER_SLUG },
      data: {
        content: replaceSnow(summer.content) ?? summer.content,
        contentAr: replaceSnow(summer.contentAr),
        contentRu: replaceSnow(summer.contentRu),
      },
    })
  })

  console.log(`Repaired ${K_BEAUTY_SLUG} featured image`)
  console.log(`Repaired ${SUMMER_SLUG} Snow O₂ image in EN/AR/RU`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
