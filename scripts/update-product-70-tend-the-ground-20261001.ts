/**
 * Product 70 MESOPECIA KIT: new main (box straight, bottle at true size, the ivory stamp uncapped, two
 * vials) and the "Tend the ground." campaign, all under /images/mesopecia_tend. Refuses to write until
 * every new file answers 200 on the live site.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-70-tend-the-ground-20261001.ts
 */
import { prisma } from '../lib/prisma'

const DIR = '/images/mesopecia_tend'
const MAIN = `${DIR}/main.jpg`
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}.jpg`)

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
