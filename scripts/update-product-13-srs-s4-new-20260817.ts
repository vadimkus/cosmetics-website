/**
 * Product 13 — SRS — swap the multi-acid callout slide for the re-exported one.
 *
 * Position 4 of the gallery moves from `s4.jpeg` to `s4_new.jpeg`.
 *
 * Background: the slide as originally delivered carried fabricated figures —
 * lactic 10%, SALICYLIC 2%, mandelic 5%, glycerin 20% — with no glycolic acid at
 * all, and SRS contains no salicylic acid. It was never published. I regenerated
 * it from the slide script, which draws the audited figures but produces flatter
 * art than the rest of the set.
 *
 * This re-export has both: the correct figures (glycolic 15%, lactic 13.5%,
 * mandelic 2%, glycerin 25% — matching the quali-quanti and the certificate) and
 * the photographic still-life treatment the other six slides use.
 *
 * A NEW FILENAME on purpose. /images/* is served immutable for a year, so
 * replacing a published file in place would leave repeat visitors on the old
 * copy. `s4.jpeg` stays on disk rather than being deleted: product pages are
 * ISR-cached for about five minutes, and a stale page still referencing it would
 * otherwise 404 during that window.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-13-srs-s4-new-20260817.ts
 */

import { prisma } from '../lib/prisma'

const GALLERY = [
  '/images/srs_new/s1.jpeg',
  '/images/srs_new/s2.jpeg',
  '/images/srs_new/s3.jpeg',
  '/images/srs_new/s4_new.jpeg',
  '/images/srs_new/s5.jpeg',
  '/images/srs_new/s6.jpeg',
  '/images/srs_new/s7.jpeg',
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '13' }, { id: '13' }] },
  })
  if (!product) throw new Error('product 13 not found')

  console.log('before:', product.images)

  await prisma.product.update({
    where: { id: product.id },
    data: { images: JSON.stringify(GALLERY) },
  })

  const after = await prisma.product.findUnique({ where: { id: product.id } })
  console.log('after :', after?.images)
  console.log('\nmain image unchanged:', after?.image)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
