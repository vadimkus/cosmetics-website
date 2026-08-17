/**
 * Soften MULTI VITA RADIANCE CREAM (31) UV wording to match brand PDF.
 * MELAZERO is serum-only; live DB already uses Astaxanthin.
 *
 *   npx tsx --env-file=.env.local scripts/fix-product-31-cream-copy-20260726.ts
 *   npx tsx --env-file=.env.local scripts/fix-product-31-cream-copy-20260726.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : ({ datasourceUrl: databaseUrl, log: ['error'] } as never),
)

const NEXT_DESCRIPTION =
  "GENOSYS MULTI VITA RADIANCE CREAM combines a complex of 12 vitamins with potent antioxidants like Astaxanthin to provide effective protection against free radicals, thereby slowing down the skin's aging process. This advanced formula deeply nourishes and moisturizes the skin, evens out skin tone, and imparts a noticeable radiance while activating collagen production and helping defend against environmental stressors. Astaxanthin assists UV defense but does not replace sunscreen."

async function main() {
  const apply = process.argv.includes('--apply')
  const prod = await prisma.product.findFirst({
    where: { OR: [{ id: '31' }, { productNumber: '31' }] },
  })
  if (!prod) {
    console.log('Product 31 not found')
    return
  }

  const blob = JSON.stringify(prod)
  console.log('id:', prod.id)
  console.log('MELAZERO in DB:', /MELAZERO/i.test(blob))
  console.log('Astaxanthin in DB:', /Astaxanthin/i.test(blob))
  console.log('current desc:', (prod.description || '').slice(0, 280))
  console.log('---')
  console.log('next desc:', NEXT_DESCRIPTION.slice(0, 280))

  if (!apply) {
    console.log('Dry run only. Pass --apply to update description.')
    return
  }

  await prisma.product.update({
    where: { id: prod.id },
    data: { description: NEXT_DESCRIPTION },
  })
  console.log('Updated product 31 description.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
