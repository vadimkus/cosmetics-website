/**
 * Product 11 — SKIN DEFENDER LIP & EYE MAKEUP REMOVER — new main packshot.
 *
 * `image` moves from `/images/remover/Main2.jpg` to `/images/remover/main4.jpeg`.
 * The gallery (S1b–S6b) is unchanged.
 *
 * The new shot puts the bottle square on white with the two-phase separation
 * clearly visible — the yellow oil sitting above the clear water — which is the
 * one thing a customer needs to understand before they use it, since the product
 * has to be shaken to work.
 *
 * A NEW FILENAME on purpose. /images/* is served immutable for a year, so
 * replacing a published file in place would leave repeat visitors on the old
 * copy.
 *
 * `Main2.jpg` STAYS ON DISK. Historical order rows may reference it, and the
 * gallery-images rule requires running scripts/repair-dead-order-item-images.ts
 * before deleting a main image. Nothing here deletes an asset, so there is no
 * dead-path repair to run.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-11-remover-main4-20260817.ts
 */

import { prisma } from '../lib/prisma'

const MAIN = '/images/remover/main4.jpeg'

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '11' }, { id: '11' }] },
  })
  if (!product) throw new Error('product 11 not found')

  console.log('before:')
  console.log('  image :', product.image)
  console.log('  images:', product.images)

  await prisma.product.update({
    where: { id: product.id },
    data: { image: MAIN },
  })

  const after = await prisma.product.findUnique({ where: { id: product.id } })
  console.log('\nafter:')
  console.log('  image :', after?.image)
  console.log('  images:', after?.images, '(unchanged)')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
