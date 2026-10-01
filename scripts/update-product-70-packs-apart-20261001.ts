/**
 * Product 70 MESOPECIA KIT: the main and the two pack slides are re-shot so the stamp no longer lies on
 * the Hair Solution box (main.jpg -> main-v2.jpg, s11 -> s11b, s12 -> s12b).
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-70-packs-apart-20261001.ts
 */
import { prisma } from '../lib/prisma'

const DIR = '/images/mesopecia_art'
const SWAP: Record<string, string> = { [`${DIR}/s11.jpg`]: `${DIR}/s11b.jpg`, [`${DIR}/s12.jpg`]: `${DIR}/s12b.jpg` }

async function main() {
  const p = await prisma.product.findFirst({ where: { productNumber: '70' } })
  if (!p) throw new Error('product 70 not found')
  const gallery: string[] = JSON.parse(p.images || '[]')
  const next = gallery.map(g => SWAP[g] ?? g)
  if (next.filter((g, i) => g !== gallery[i]).length !== 2) throw new Error('expected s11 and s12 in the gallery')
  await prisma.product.update({ where: { id: p.id }, data: { image: `${DIR}/main-v2.jpg`, images: JSON.stringify(next) } })
  console.log(`product 70 main ${DIR}/main-v2.jpg, gallery: ${next.join(', ')}`)
}

main().finally(() => prisma.$disconnect())
