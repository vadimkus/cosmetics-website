/**
 * Product 17 EyeCell EYE CONTOUR SERUM: the "Tired has a shape." campaign replaces the eye_serum s1-s7
 * gallery (/images/eyeserum_shape/s1-s12, + ru/ and ar/). The main (eye_serum/main-v2.jpg) stays.
 * Refuses to write until every new file answers 200 on the live site.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-17-tired-has-a-shape-20261001.ts
 */
import { prisma } from '../lib/prisma'

const DIR = '/images/eyeserum_shape'
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}.jpg`)

async function main() {
  const urls = [...GALLERY, ...['ru', 'ar'].flatMap(l => GALLERY.map(g => g.replace(DIR, `${DIR}/${l}`)))]
  for (const u of urls) {
    const r = await fetch(`https://genosys.ae${u}`, { method: 'HEAD' })
    if (r.status !== 200) throw new Error(`${u} returned ${r.status}; deploy first`)
  }
  const p = await prisma.product.findFirst({ where: { productNumber: '17' } })
  if (!p) throw new Error('product 17 not found')
  await prisma.product.update({ where: { id: p.id }, data: { images: JSON.stringify(GALLERY) } })
  console.log(`product 17 gallery: ${GALLERY.join(', ')}`)
}

main().finally(() => prisma.$disconnect())
