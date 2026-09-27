/**
 * Product 49 (GENO-LED IR II): write the RU/AR selling descriptions from
 * data/product49LocalizedCopy.ts to the record. Touches descriptionRu and
 * descriptionAr only; the EN fields and the gallery stay as they are.
 *
 *   npx tsx --env-file=.env.local scripts/update-product-49-ru-ar-selling-copy-20260927.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-49-ru-ar-selling-copy-20260927.ts --apply
 */
import { prisma } from '../lib/prisma'
import { PRODUCT_49_AR_TRANSLATION, PRODUCT_49_RU_TRANSLATION } from '../data/product49LocalizedCopy'

const APPLY = process.argv.includes('--apply')

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: '49' },
    select: { id: true, name: true, descriptionRu: true, descriptionAr: true },
  })
  if (!product) throw new Error('Product 49 not found')

  const data = {
    descriptionRu: PRODUCT_49_RU_TRANSLATION.description,
    descriptionAr: PRODUCT_49_AR_TRANSLATION.description,
  }
  console.log('BEFORE ru:', product.descriptionRu?.slice(0, 120))
  console.log('BEFORE ar:', product.descriptionAr?.slice(0, 120))
  console.log('AFTER  ru:', data.descriptionRu.slice(0, 120))
  console.log('AFTER  ar:', data.descriptionAr.slice(0, 120))

  if (!APPLY) {
    console.log('Dry run. Pass --apply to write.')
    return
  }
  await prisma.product.update({ where: { id: product.id }, data })
  console.log('written')
}

main().finally(() => prisma.$disconnect())
