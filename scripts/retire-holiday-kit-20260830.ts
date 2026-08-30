/**
 * Retires the Holiday Kit (product 54).
 *
 * Same treatment products 2 and 26 already had: the row stays so past orders
 * can still resolve the name, price and image on an invoice or in order
 * history, and `isHidden` takes it out of every public listing. Deleting it
 * would leave those orders pointing at nothing.
 *
 * Run: npx tsx --env-file=.env.local scripts/retire-holiday-kit-20260830.ts [--apply]
 */
import { prisma } from '@/lib/prisma'

const PRODUCT_NUMBER = '54'
const apply = process.argv.includes('--apply')

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: PRODUCT_NUMBER },
    select: { id: true, name: true, inStock: true, isHidden: true, category: true },
  })
  if (!product) throw new Error(`No product with productNumber ${PRODUCT_NUMBER}`)

  // Worth knowing before hiding it, because these are the places a retired
  // product can still surface: an order someone can reopen, or a wishlist row.
  const [orderItems, wishlist] = await Promise.all([
    prisma.orderItem.count({ where: { productId: product.id } }),
    prisma.wishlistItem.count({ where: { productId: product.id } }).catch(() => -1),
  ])

  console.log(`${product.name}: inStock=${product.inStock} isHidden=${product.isHidden}`)
  console.log(`appears in ${orderItems} order items` + (wishlist >= 0 ? `, ${wishlist} wishlists` : ''))

  if (product.isHidden && !product.inStock) {
    console.log('already retired, nothing to do')
    return
  }
  if (!apply) {
    console.log('\nwould set isHidden=true, inStock=false. Re-run with --apply')
    return
  }

  await prisma.product.update({
    where: { id: product.id },
    data: { isHidden: true, inStock: false },
  })
  console.log('retired')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
