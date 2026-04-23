require('dotenv').config({ path: '.env' })
require('dotenv').config({ path: '.env.local', override: true })

const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')

const url = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!url) {
  console.error('No DB URL. Set DATABASE_URL or POSTGRES_URL_NON_POOLING.')
  process.exit(1)
}

const pool = new Pool({ connectionString: url })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const mapping = [
  ['microneedling', 'Microneedling'],
  ['pro-solution', 'PRO Solution'],
  ['cleanser', 'Cleanser'],
  ['peeling', 'Peeling'],
  ['toner-mist', 'Toner/Mist'],
  ['serum', 'Serum'],
  ['cream', 'Cream'],
  ['mask', 'Mask'],
  ['sun', 'Sun'],
  ['cushion-bb', 'Cushion BB'],
  ['scalp-hair', 'Scalp/Hair'],
  ['eye-care', 'Eye care'],
  ['device', 'Device'],
  ['bio-meso', 'Bio Meso'],
]

async function main() {
  console.log('category landing page → product counts (case-insensitive contains)\n')
  for (const [slug, key] of mapping) {
    const c = await prisma.product.count({
      where: { category: { contains: key, mode: 'insensitive' }, isHidden: false },
    })
    console.log(`  ${String(c).padStart(3)}  /products/category/${slug}   (DB key: "${key}")`)
  }
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1 })
  .finally(async () => { await prisma.$disconnect(); await pool.end() })
