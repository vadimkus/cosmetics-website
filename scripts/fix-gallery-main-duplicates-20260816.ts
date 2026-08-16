/**
 * Drop the main image from the gallery array wherever it is repeated there.
 * Web and mobile both prepend product.image, so a main listed in `images`
 * shows the same shot twice in the thumbnail strip.
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

async function main() {
  const apply = process.argv.includes('--apply')
  const all = await prisma.product.findMany({
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })

  for (const p of all) {
    let g: string[] = []
    try {
      const parsed = JSON.parse(p.images || '[]')
      if (Array.isArray(parsed)) g = parsed
    } catch {
      continue
    }
    if (!p.image || !g.includes(p.image)) continue

    const cleaned = g.filter(src => src !== p.image)
    console.log(`${p.productNumber ?? p.id}\t${p.name}`)
    console.log(`   ${g.length} -> ${cleaned.length}: ${cleaned.join(' ') || '(empty)'}`)
    if (apply) {
      await prisma.product.update({
        where: { id: p.id },
        data: { images: JSON.stringify(cleaned) },
      })
    }
  }
  console.log(apply ? 'applied' : 'dry run, pass --apply to write')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
