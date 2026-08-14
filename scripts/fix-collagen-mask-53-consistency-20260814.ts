/**
 * Product 53 - INTENSIVE REPAIR COLLAGEN MASK
 *
 * Second pass, after the bespoke page was built and read end to end. Three
 * inconsistencies were visible once every claim sat on one page together:
 *
 *  1. The botanical card claimed "antioxidant care". Nothing in the dossier or
 *     on the sachet claims antioxidant activity for this product, and the page
 *     header already lists antioxidant among the deliberate omissions. The five
 *     extracts still earn their card on soothing and toning.
 *
 *  2. Two key features promised the mask to sensitive skin while the page's own
 *     guidance tells fragrance-avoiders to buy something else. Parfum is in the
 *     formula, so the page keeps the caution and these lose "sensitive".
 *
 *  3. "Deep Nourishment - Delivers essential nutrients for skin health" is
 *     filler that names no ingredient and no mechanism. Replaced with the
 *     leftover-essence point, which is true, checkable and worth knowing.
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient(
  url.startsWith('prisma') ? ({ accelerateUrl: url } as any) : ({ datasources: { db: { url } } } as any)
)

const APPLY = process.argv.includes('--commit')

type Edit = { field: string; from: string; to: string }

const EDITS: Edit[] = [
  {
    field: 'ingredients',
    from: 'five extracts for soothing, toning and antioxidant care.',
    to: 'five extracts that soothe, tone and keep skin comfortable.',
  },
  {
    field: 'keyFeatures',
    from: 'Tested on skin and certified for it, so sensitive and mature complexions can use it with confidence.',
    to: 'Tested on skin and certified for it, so you know what is going on your face for fifteen minutes.',
  },
  {
    field: 'keyFeatures',
    from: 'Gentle yet effective formula suitable for sensitive and mature skin.',
    to: 'A near-neutral pH and no acids, no retinoids and no exfoliants, so it slots into any routine.',
  },
  {
    field: 'benefits',
    from: 'Deep Nourishment - Delivers essential nutrients for skin health',
    to: 'Generous Essence - Enough left in the pouch to carry on into neck and hands',
  },
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: '53' },
    select: { id: true, name: true, ingredients: true, keyFeatures: true, benefits: true },
  })
  if (!product) throw new Error('product 53 not found')

  const next: Record<string, string> = {}
  for (const edit of EDITS) {
    const current = next[edit.field] ?? ((product as any)[edit.field] as string)
    if (!current.includes(edit.from)) {
      throw new Error(`${edit.field}: source text not found -> ${edit.from.slice(0, 60)}`)
    }
    next[edit.field] = current.split(edit.from).join(edit.to)
    console.log(`${edit.field}\n  - ${edit.from}\n  + ${edit.to}\n`)
  }

  if (!APPLY) {
    console.log('dry run, pass --commit to write')
    return
  }
  await prisma.product.update({ where: { id: product.id }, data: next })
  console.log('updated', product.name)
}

main().finally(() => prisma.$disconnect())
