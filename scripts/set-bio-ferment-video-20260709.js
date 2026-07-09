/**
 * One-off: attach /videos/bio.mp4 to BIO-FERMENT AGE DEFYING POWDER MASK
 * (product 51). DB videoUrl flows to the web PDP video block and the mobile
 * app (priority 1 in getProductVideoUrl) — no app update needed.
 * Run: node scripts/set-bio-ferment-video-20260709.js
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
    where: { name: 'BIO-FERMENT AGE DEFYING POWDER MASK' },
    select: { id: true, name: true, videoUrl: true },
  })
  if (!p) {
    console.log('product not found')
    return
  }
  console.log('before:', JSON.stringify(p))
  await prisma.product.update({
    where: { id: p.id },
    data: { videoUrl: '/videos/bio.mp4' },
  })
  console.log('updated: videoUrl -> /videos/bio.mp4')
}

main()
  .catch((e) => {
    console.error('ERROR:', e.message)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
