/**
 * Toggles availability of hyaluron cream variants (product id 29).
 *
 * Usage:
 *   npx tsx scripts/set-hyaluron-cream-availability.ts block-50g
 *   npx tsx scripts/set-hyaluron-cream-availability.ts restore-50g
 *
 * Why this exists: hardcoded-size product with DB variants. Blocking 50g
 * requires (1) DB flag flip (mobile API + checkout filters) AND (2)
 * removing 50g from utils/productPricing.ts getProductSizeOptions('29')
 * (website UI reads from there, not from DB). This script handles (1);
 * the companion website change is a commit.
 */
import { prisma } from '../lib/prisma'

const PRODUCT_ID = '29' // MOISTURE REPLENISHING HYALURON CREAM

async function block50g() {
  const product = await prisma.product.findUnique({
    where: { id: PRODUCT_ID },
    include: { variants: true },
  })
  if (!product) throw new Error(`Product ${PRODUCT_ID} not found`)

  const v50 = product.variants.find((v) => v.size === '50g')
  const v250 = product.variants.find((v) => v.size === '250g')
  if (!v50 || !v250) {
    throw new Error(
      `Expected both 50g and 250g variants on product ${PRODUCT_ID}, got: ${product.variants
        .map((v) => v.size)
        .join(', ')}`,
    )
  }

  await prisma.$transaction([
    prisma.productVariant.update({
      where: { id: v50.id },
      data: { available: false, isDefault: false },
    }),
    prisma.productVariant.update({
      where: { id: v250.id },
      data: { available: true, isDefault: true },
    }),
  ])

  const after = await prisma.product.findUnique({
    where: { id: PRODUCT_ID },
    include: { variants: { orderBy: { size: 'asc' } } },
  })
  console.log(`✅ Blocked ${product.name}:`)
  for (const v of after!.variants) {
    console.log(
      `   ${v.size}  available=${v.available}  default=${v.isDefault}  price=${v.price}`,
    )
  }
}

async function restore50g() {
  const product = await prisma.product.findUnique({
    where: { id: PRODUCT_ID },
    include: { variants: true },
  })
  if (!product) throw new Error(`Product ${PRODUCT_ID} not found`)

  const v50 = product.variants.find((v) => v.size === '50g')
  const v250 = product.variants.find((v) => v.size === '250g')
  if (!v50 || !v250) throw new Error('Missing variants')

  await prisma.$transaction([
    prisma.productVariant.update({
      where: { id: v50.id },
      data: { available: true, isDefault: true },
    }),
    prisma.productVariant.update({
      where: { id: v250.id },
      data: { available: true, isDefault: false },
    }),
  ])

  const after = await prisma.product.findUnique({
    where: { id: PRODUCT_ID },
    include: { variants: { orderBy: { size: 'asc' } } },
  })
  console.log(`✅ Restored ${product.name}:`)
  for (const v of after!.variants) {
    console.log(
      `   ${v.size}  available=${v.available}  default=${v.isDefault}  price=${v.price}`,
    )
  }
  console.log('')
  console.log(
    'Reminder: also revert utils/productPricing.ts getProductSizeOptions(\'29\') to include both sizes.',
  )
}

const action = process.argv[2]
if (action === 'block-50g') {
  block50g()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
} else if (action === 'restore-50g') {
  restore50g()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
} else {
  console.error('Usage: npx tsx scripts/set-hyaluron-cream-availability.ts <block-50g|restore-50g>')
  process.exit(1)
}
