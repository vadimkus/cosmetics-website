import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

const NUMBERS = [
  '4', '5', '6', '7', '8', '9',
  '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '24', '33', '34', '35', '37', '38', '50', '51', '52', '53',
  '55', '56', '57', '58', '59', '60', '61', '63', '64', '65', '66',
]

async function main() {
  for (const n of NUMBERS) {
    const p = await prisma.product.findFirst({
      where: { productNumber: n },
      select: { productNumber: true, name: true, image: true, images: true },
    })
    if (!p) {
      console.log(`${n}\tMISSING`)
      continue
    }
    let gallery: string[] = []
    try {
      const parsed = JSON.parse(p.images || '[]')
      if (Array.isArray(parsed)) gallery = parsed
    } catch {
      gallery = []
    }
    console.log(`${n}\t${p.name}`)
    console.log(`   main: ${p.image}`)
    console.log(`   gallery(${gallery.length}): ${gallery.join(' ')}`)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
