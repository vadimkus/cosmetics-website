/**
 * One-off: point INTENSIVE REPAIR COLLAGEN MASK (product 53) at the new
 * /images/collagen_mask/ photo set (Main + S1..S5 gallery).
 * Run: node scripts/update-collagen-mask-images-20260709.js
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
    where: { name: 'INTENSIVE REPAIR COLLAGEN MASK' },
    select: { id: true, name: true, image: true, images: true, productNumber: true },
  })
  if (!p) {
    console.log('product not found')
    return
  }
  console.log('before:', JSON.stringify(p, null, 2))
  await prisma.product.update({
    where: { id: p.id },
    data: {
      image: '/images/collagen_mask/Main.jpeg',
      images: JSON.stringify([
        '/images/collagen_mask/S1.jpeg',
        '/images/collagen_mask/S2.jpeg',
        '/images/collagen_mask/S3.jpeg',
        '/images/collagen_mask/S4.jpeg',
        '/images/collagen_mask/S5.jpeg',
      ]),
    },
  })
  console.log('updated: main -> /images/collagen_mask/Main.jpeg, gallery -> S1..S5')
}

main()
  .catch((e) => {
    console.error('ERROR:', e.message)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
