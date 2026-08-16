/** Find products whose main image is repeated inside the gallery array. */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

async function main() {
  const all = await prisma.product.findMany({
    select: { productNumber: true, name: true, image: true, images: true },
  })
  for (const p of all) {
    let g: string[] = []
    try {
      const parsed = JSON.parse(p.images || '[]')
      if (Array.isArray(parsed)) g = parsed
    } catch {
      console.log(`${p.productNumber}\tBAD JSON`)
      continue
    }
    const dupMain = p.image && g.includes(p.image)
    const dupSelf = new Set(g).size !== g.length
    if (dupMain || dupSelf) {
      console.log(
        `${p.productNumber}\t${p.name}\tmain-in-gallery=${!!dupMain}\tinternal-dupe=${dupSelf}`
      )
      console.log(`   main: ${p.image}`)
      console.log(`   gallery: ${g.join(' ')}`)
    }
  }
  console.log('audit complete')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
