/**
 * Product 53 - the English `directions` field.
 *
 * The first two passes cleaned description, benefits, keyFeatures and
 * ingredients but missed this field, so "clinically proven to improve skin
 * hydration" was still being served on the live page after the Russian copy of
 * the same sentence had already been removed. No study exists for this product.
 * Dermatologically tested is documented by the 2024 artwork and stays.
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient(
  url.startsWith('prisma') ? ({ accelerateUrl: url } as any) : ({ datasources: { db: { url } } } as any)
)

const APPLY = process.argv.includes('--commit')

const FROM = 'This product is dermatologically tested and clinically proven to improve skin hydration.'
const TO = 'This product is dermatologically tested.'

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: '53' },
    select: { id: true, name: true, directions: true },
  })
  if (!product) throw new Error('product 53 not found')
  if (!product.directions?.includes(FROM)) {
    console.log('nothing to do, current value:\n', product.directions)
    return
  }

  const next = product.directions.split(FROM).join(TO)
  console.log('- ' + product.directions + '\n')
  console.log('+ ' + next + '\n')
  if (!APPLY) {
    console.log('dry run, pass --commit to write')
    return
  }
  await prisma.product.update({ where: { id: product.id }, data: { directions: next } })
  console.log('updated', product.name)
}

main().finally(() => prisma.$disconnect())
