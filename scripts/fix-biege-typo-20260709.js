/**
 * One-off: fix "Biege" -> "Beige" typo in CHARMING LOOK BEAUTY BOX description.
 * Run: node scripts/fix-biege-typo-20260709.js
 */
const fs = require('fs')
const path = require('path')

// minimal .env.local loader (no dotenv dependency)
const envPath = path.join(__dirname, '..', '.env.local')
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_0-9]+)=(.*)$/)
  if (m && !process.env[m[1]]) {
    process.env[m[1]] = m[2].replace(/^"|"$/g, '')
  }
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
  const p = await prisma.product.findUnique({
    where: { id: 'cmhoyw7d500008o9tdprqkkhb' },
    select: { id: true, name: true, description: true },
  })
  if (!p) {
    console.log('product not found')
    return
  }
  const fixed = p.description.replace(/Biege/g, 'Beige')
  if (fixed === p.description) {
    console.log('no typo found — already clean')
    return
  }
  await prisma.product.update({ where: { id: p.id }, data: { description: fixed } })
  console.log('fixed typo in:', p.name)
}

main()
  .catch((e) => {
    console.error('ERROR:', e.message)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
