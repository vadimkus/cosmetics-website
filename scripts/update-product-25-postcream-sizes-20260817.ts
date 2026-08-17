/**
 * Product 25 — SOOTHING REPAIR POSTCREAM: add the size-comparison image to the gallery.
 *
 * CONTEXT. This product is sold in two real sizes, each with its own MoySklad SKU:
 * 20 g (code 00038) at 204 AED and 100 g (code 54465) at 440 AED. Both were already
 * configured in data/productConfig.ts and in utils/productPricing.ts, and the generic
 * PDP rendered a selector for them. The bespoke page built for this product on 17 Aug
 * did not, so the 100 g tube could not be bought from the product page at all and the
 * price shown was always the 20 g one. That is fixed in PostcreamProductPage.tsx.
 *
 * THE IMAGE. There is no photograph of the 100 g tube anywhere in the asset library or
 * the Intertek dossier — the only packshot we hold, /images/SRC.jpg, shows the 20 g tube
 * on its own. /images/postcream/two-sizes.jpeg is therefore a RENDERED MOCK-UP whose job
 * is to show the size difference, not to depict the carton artwork. It is accurate on
 * the things that matter — the product name, the two fill weights, and three ingredients
 * the formula genuinely contains at working doses — but the tube design is stylised and
 * does not match the real GENOSYS tube. It is added as a SECONDARY gallery image only;
 * the real photograph stays as the main image. Replace it with a real photograph of the
 * two tubes together as soon as one exists.
 *
 * Note the gallery convention: product.image is prepended automatically by both web and
 * mobile, so it must not appear inside `images`. The pre-existing config entry for this
 * product breaks that rule by listing SRC.jpg in its own images array; the bespoke page
 * de-duplicates with a Set so it does not double up, and that legacy entry is left alone.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-25-postcream-sizes-20260817.ts
 */

import { prisma } from '../lib/prisma'

const SIZE_IMAGE = '/images/postcream/two-sizes.jpeg'

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

  // Keep whatever is already there, drop the main image if it has crept in, and add ours.
  const next = Array.from(
    new Set([...existing.filter(src => src !== product.image), SIZE_IMAGE])
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
