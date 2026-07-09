/**
 * One-off: point Holiday Kit (product 54) main image at the new studio shot.
 * New filename (Hol_kit_v2.jpg) because /images/* is cached immutable 1 year.
 * Run: node scripts/update-holiday-kit-image-20260709.js
 */
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_0-9]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, '')
}

const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 2,
  ssl: { rejectUnauthorized: false },
})
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '54' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!p) {
    console.log('product 54 not found')
    return
  }
  console.log('before:', JSON.stringify(p, null, 2))
  await prisma.product.update({
    where: { id: p.id },
    data: { image: '/images/Hol_kit_v2.jpg' },
  })
  console.log('updated: main -> /images/Hol_kit_v2.jpg')
}

main()
  .catch((e) => {
    console.error('ERROR:', e.message)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
