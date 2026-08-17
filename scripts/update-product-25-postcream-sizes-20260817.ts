/**
 * Product 25 — SOOTHING REPAIR POSTCREAM: put the real two-size photograph in the gallery.
 *
 * CONTEXT. This product is sold in two real sizes, each with its own MoySklad SKU:
 * 20 g (code 00038) at 204 AED and 100 g (code 54465) at 440 AED. Both were already
 * configured in data/productConfig.ts and utils/productPricing.ts, and the generic PDP
 * rendered a selector for them. The bespoke page built on 17 Aug did not, so the 100 g
 * tube could not be bought from the product page and the price shown was always the
 * 20 g one. Fixed in PostcreamProductPage.tsx.
 *
 * THE IMAGE. `/images/Second/soothrep.png` is a real studio photograph of both tubes
 * side by side, captioned 20g and 100g, and it has been in the repository since
 * February 2026. It was already listed in this product's `data/productConfig.ts`
 * gallery — but the DB `images` column was null, and the bespoke page builds its
 * gallery from the DB (`product.image` plus `product.images`), not from the config. So
 * the asset existed, was already wired for the generic page, and simply never reached
 * the bespoke one.
 *
 * This script puts it in the DB gallery, which is where galleries belong per
 * .cursor/rules/product-gallery-images.mdc.
 *
 * A generated size-comparison mock-up was briefly added here and is now removed: the
 * real photograph is better in every respect, and a rendered tube that does not match
 * the real packaging has no business on a page that trades on authenticity.
 *
 * Gallery convention: product.image is prepended automatically by web and mobile, so it
 * must not appear inside `images`. The legacy config entry for this product does list
 * SRC.jpg in its own array; the bespoke page de-duplicates with a Set, so it does not
 * double up, and that entry is left alone.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-25-postcream-sizes-20260817.ts
 */

import { prisma } from '../lib/prisma'

/** The real photograph of the 20 g and 100 g tubes together. */
const SIZE_IMAGE = '/images/Second/soothrep.png'

/** The generated mock-up this replaces. Removed wherever it appears. */
const RETIRED_MOCKUP = '/images/postcream/two-sizes.jpeg'

async function main() {
  const product = await prisma.product.findFirst({
    where: { name: { contains: 'POSTCREAM' } },
  })
  if (!product) throw new Error('Product 25 (SOOTHING REPAIR POSTCREAM) not found')

  const existing: string[] = (() => {
    try {
      const parsed = JSON.parse(product.images || '[]')
      return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
    } catch {
      return []
    }
  })()

  const next = Array.from(
    new Set([
      ...existing.filter(src => src !== product.image && src !== RETIRED_MOCKUP),
      SIZE_IMAGE,
    ])
  )

  console.log(`Updating id=${product.id} — ${product.name}`)
  console.log('  main  :', product.image, '(unchanged)')
  console.log('  images:', product.images ?? '(null)', '→', JSON.stringify(next))

  await prisma.product.update({
    where: { id: product.id },
    data: { images: JSON.stringify(next) },
  })

  const after = await prisma.product.findUnique({ where: { id: product.id } })
  console.log('\nGallery now:', after?.images)
  console.log('Sizes remain 20 g at 204 AED (default) and 100 g at 440 AED, unchanged.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
