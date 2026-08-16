/** Which live products still fall back to the shared PDP. */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

const BESPOKE = new Set([
  '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16',
  '17', '18', '19', '24', '33', '34', '35', '37', '38', '50', '51', '52',
  '53', '55', '56', '57', '58', '59', '60', '61', '63', '64', '65', '66',
])

async function main() {
  const all = await prisma.product.findMany({
    select: {
      id: true,
      productNumber: true,
      name: true,
      category: true,
      inStock: true,
      image: true,
      images: true,
    },
  })

  const rows = all.map(p => {
    let g: string[] = []
    try {
      const parsed = JSON.parse(p.images || '[]')
      if (Array.isArray(parsed)) g = parsed
    } catch {
      g = []
    }
    return { ...p, key: p.productNumber || p.id, gallery: g.length }
  })

  rows.sort((a, b) => Number(a.key) - Number(b.key))

  const missing = rows.filter(r => !BESPOKE.has(r.key))
  console.log(`total products: ${rows.length}`)
  console.log(`bespoke: ${rows.length - missing.length}`)
  console.log(`shared PDP: ${missing.length}`)
  console.log('')
  console.log('num\tstock\tslides\tcategory\tname')
  for (const r of missing) {
    console.log(
      `${r.key}\t${r.inStock ? 'in' : 'OUT'}\t${r.gallery}\t${r.category}\t${r.name}`
    )
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
