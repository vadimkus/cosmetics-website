/**
 * Debug Script: Print product variants from DB
 *
 * Usage:
 *   cd cosmetics-website
 *   npx tsx scripts/debug-product-variants.ts --id 10
 *   npx tsx scripts/debug-product-variants.ts --name "SNOW O₂ CLEANSER"
 *
 * Env:
 *   Reads DATABASE_URL / PRISMA_DATABASE_URL / POSTGRES_URL from .env.local (or process env)
 */
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag)
  if (idx === -1) return undefined
  return process.argv[idx + 1]
}

function initializePrisma() {
  const databaseUrl =
    process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL || process.env.POSTGRES_URL

  if (!databaseUrl) {
    throw new Error('No database URL found (DATABASE_URL / PRISMA_DATABASE_URL / POSTGRES_URL)')
  }

  const isAccelerate = databaseUrl.startsWith('prisma+')
  if (isAccelerate) {
    return new PrismaClient({
      accelerateUrl: databaseUrl,
      log: ['error']
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaPg } = require('@prisma/adapter-pg')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Pool } = require('pg')
  const pool = new Pool({ connectionString: databaseUrl })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({
    adapter,
    log: ['error']
  })
}

async function main() {
  const id = getArgValue('--id')
  const name = getArgValue('--name')

  if (!id && !name) {
    // eslint-disable-next-line no-console
    console.error('Provide --id <productId> or --name "<product name>"')
    process.exit(1)
  }

  const prisma = initializePrisma()
  try {
    const product = await prisma.product.findFirst({
      where: {
        ...(id ? { id } : {}),
        ...(name ? { name: { equals: name, mode: 'insensitive' } } : {})
      },
      select: {
        id: true,
        productNumber: true,
        name: true,
        price: true,
        variants: {
          select: {
            id: true,
            size: true,
            color: true,
            price: true,
            available: true,
            isDefault: true,
            stockQuantity: true
          },
          orderBy: [{ isDefault: 'desc' }, { price: 'asc' }]
        }
      }
    })

    if (!product) {
      // eslint-disable-next-line no-console
      console.log('Product not found')
      return
    }

    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify(
        {
          id: product.id,
          productNumber: product.productNumber,
          name: product.name,
          baseProductPrice: product.price,
          variants: product.variants
        },
        null,
        2
      )
    )
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})


