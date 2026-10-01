/**
 * Product 50 EyeCell EYE ZONE CARE KIT: new main with the real GENOSYS Eye Roller (the first main had a
 * generic roller, pedestals and an acrylic disc). Packs apart on white.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-50-main-v2-20261001.ts
 */
import { prisma } from '../lib/prisma'

const OLD = '/images/eyekit_campaign/main.jpg'
const NEW = '/images/eyekit_campaign/main-v2.jpg'

async function main() {
  const p = await prisma.product.findFirst({ where: { productNumber: '50' } })
  if (!p) throw new Error('product 50 not found')
  if (p.image !== OLD && p.image !== NEW) throw new Error(`unexpected main ${p.image}`)
  await prisma.product.update({ where: { id: p.id }, data: { image: NEW } })
  console.log(`product 50 main: ${p.image} -> ${NEW}`)
}

main().finally(() => prisma.$disconnect())
