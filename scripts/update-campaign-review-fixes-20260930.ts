/**
 * Campaign review fixes, 30 Sep 2026 (.cursor/rules/campaign-slides-conceptual.mdc):
 * - 49 GENO-LED IR II: s9 (woman in a towel on a spa bed) leaves the gallery.
 * - 41 BB Cushion: s4b (real compact and puff) and s5b (formula swatch) replace the multi-tool and the
 *   pins; the rest of the "Covered." set stays.
 * - 69 Eye Roller: s3b (pearls) replaces the sewing needle.
 * - 53 Collagen Mask: main back to the clean packshot /images/collagen_mask/Main.jpeg.
 *
 * Run after the deploy carrying the new slides is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-campaign-review-fixes-20260930.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-campaign-review-fixes-20260930.ts --apply
 */
import { prisma } from '../lib/prisma'

const gallery = (dir: string, names: string[]) => names.map(n => `/images/${dir}/${n}.jpg`)

const UPDATES: Record<string, { images?: string[]; image?: string }> = {
  '49': { images: gallery('led_campaign', ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's10', 's11', 's12']) },
  '41': { images: gallery('cushion_art', ['s1', 's2', 's3', 's4b', 's5b', 's6', 's7', 's8', 's9', 's10', 's11', 's13', 's12']) },
  '69': { images: gallery('eyeroller_art', ['s1', 's2', 's3b', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12']) },
  '53': { image: '/images/collagen_mask/Main.jpeg' },
}

const NEW_FILES = [
  ...['', 'ru/', 'ar/'].flatMap(l => [`/images/cushion_art/${l}s4b.jpg`, `/images/cushion_art/${l}s5b.jpg`, `/images/eyeroller_art/${l}s3b.jpg`]),
  '/images/collagen_mask/Main.jpeg',
  '/images/cutout/53.webp',
]

async function live(path: string): Promise<boolean> {
  for (let attempt = 1; ; attempt++) {
    try {
      return (await fetch(`https://genosys.ae${path}`, { method: 'HEAD' })).ok
    } catch (error) {
      if (attempt === 3) throw error
    }
  }
}

async function main() {
  const apply = process.argv.includes('--apply')
  const missing: string[] = []
  for (const path of NEW_FILES) if (!(await live(path))) missing.push(path)
  if (missing.length) {
    console.error(`Not live yet (${missing.length}):`, missing.join(', '))
    process.exitCode = 1
    return
  }
  console.log(`  all ${NEW_FILES.length} new files return 200`)

  for (const [number, update] of Object.entries(UPDATES)) {
    const product = await prisma.product.findFirst({ where: { productNumber: number } })
    if (!product) throw new Error(`Product ${number} not found`)
    const data = {
      ...(update.images ? { images: JSON.stringify(update.images) } : {}),
      ...(update.image ? { image: update.image } : {}),
    }
    console.log(`${number} ${product.name}:`, update.images ? `${update.images.length} slides` : '', update.image ?? '')
    if (apply) await prisma.product.update({ where: { id: product.id }, data })
  }
  console.log(apply ? 'Applied.' : 'Dry run - pass --apply to write.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
