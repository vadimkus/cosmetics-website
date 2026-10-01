/**
 * Product 70 MESOPECIA KIT: the stamp had come out cream against the box, bottle and vials. The main and
 * the eight slides that show it are re-shot with the stamp off-white (main-v2.jpg and s1b, s2b, s7b to
 * s12b; s3 to s6 have no stamp). Refuses to write until every new file answers 200 on the live site.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-70-stamp-offwhite-20261001.ts
 */
import { prisma } from '../lib/prisma'

const DIR = '/images/mesopecia_tend'
const MAIN = `${DIR}/main-v2.jpg`
const GALLERY = ['s1b', 's2b', 's3', 's4', 's5', 's6', 's7b', 's8b', 's9b', 's10b', 's11b', 's12b'].map(n => `${DIR}/${n}.jpg`)

async function main() {
  const urls = [MAIN, ...GALLERY, ...['ru', 'ar'].flatMap(l => GALLERY.map(g => g.replace(DIR, `${DIR}/${l}`)))]
  for (const u of urls) {
    const r = await fetch(`https://genosys.ae${u}`, { method: 'HEAD' })
    if (r.status !== 200) throw new Error(`${u} returned ${r.status}; deploy first`)
  }
  const p = await prisma.product.findFirst({ where: { productNumber: '70' } })
  if (!p) throw new Error('product 70 not found')
  await prisma.product.update({ where: { id: p.id }, data: { image: MAIN, images: JSON.stringify(GALLERY) } })
  console.log(`product 70 main ${MAIN}, gallery: ${GALLERY.join(', ')}`)
}

main().finally(() => prisma.$disconnect())
