/**
 * Check exact variant data in database
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { prisma } from '../lib/prisma'

async function checkVariant() {
  try {
    console.log('Checking Product 10 variants in database...\n')
    
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: '10' },
          { productNumber: '10' }
        ]
      },
      include: {
        variants: {
          orderBy: [
            { isDefault: 'desc' },
            { price: 'asc' }
          ]
        }
      }
    })

    if (!product) {
      console.log('Product 10 not found!')
      return
    }

    console.log(`Product: ${product.name}`)
    console.log(`ID: ${product.id}`)
    console.log(`Product Number: ${product.productNumber}`)
    console.log(`Base Price: ${product.price}`)
    console.log(`\nVariants:`)
    
    for (const variant of product.variants) {
      console.log(`\nVariant ID: ${variant.id}`)
      console.log(`  Size: ${variant.size}`)
      console.log(`  Color: ${variant.color}`)
      console.log(`  Price: ${variant.price}`)
      console.log(`  Available: ${variant.available}`)
      console.log(`  Is Default: ${variant.isDefault}`)
      console.log(`  Stock Quantity: ${variant.stockQuantity}`)
      console.log(`  SKU: ${variant.sku}`)
      console.log(`  Created At: ${variant.createdAt}`)
      console.log(`  Updated At: ${variant.updatedAt}`)
    }

    // Also try rawQuery to see exactly what's in DB
    console.log('\n\nRaw SQL Query Result:')
    const rawVariants = await prisma.$queryRaw`
      SELECT * FROM product_variants 
      WHERE "productId" = ${product.id}
      ORDER BY "isDefault" DESC, price ASC
    `
    console.log(JSON.stringify(rawVariants, null, 2))

  } catch {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkVariant()
