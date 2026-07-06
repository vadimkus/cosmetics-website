import { prisma } from '../lib/prisma'

// Fix product 60 (Bio Meso PDRN Ampoule 60000): the home-care variant is named
// "Homecare Ampoule 5000" (see product 65), but this product's description and
// howToUse mistakenly say "50000". Replace only "50000" -> "5000".
// The product name itself ("...Ampoule 60000") is correct and untouched.
async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: '60' }, { productNumber: '60' }] },
    select: { id: true, name: true, description: true, howToUse: true },
  })
  if (!product) {
    console.log('Product 60 not found — aborting')
    return
  }

  const newDescription = (product.description || '').replaceAll('50000', '5000')
  const newHowToUse = (product.howToUse || '').replaceAll('50000', '5000')

  const descChanged = newDescription !== product.description
  const howChanged = newHowToUse !== product.howToUse

  if (!descChanged && !howChanged) {
    console.log('Nothing to change (no "50000" found).')
    return
  }

  await prisma.product.update({
    where: { id: product.id },
    data: {
      ...(descChanged ? { description: newDescription } : {}),
      ...(howChanged ? { howToUse: newHowToUse } : {}),
    },
  })

  console.log('Updated product', product.id, `(${product.name})`)
  console.log('  description changed:', descChanged)
  console.log('  howToUse changed:', howChanged)
  // Verify no 50000 remains, 60000 preserved
  console.log('  desc still has 50000?', newDescription.includes('50000'))
  console.log('  desc preserves 60000?', newDescription.includes('60000'))
}

main().finally(() => prisma.$disconnect())
