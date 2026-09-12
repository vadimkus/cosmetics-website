import { prisma } from '@/lib/prisma'

// Product 45, HR3 MATRIX HAIR SOLUTION a: new studio main (box + ten vials)
// and five campaign slides. Run after the deploy carrying the files is live.
const MAIN = '/images/hair_sol_v/Main.jpeg'
const GALLERY = [...[1, 2, 3, 4, 5].map((i) => `/images/hair_sol_v/S${i}.jpeg`), '/images/hair_sol_v/S6a.jpeg', '/images/hair_sol_v/S7.jpeg', '/images/hair_sol_v/Closing.jpeg']
const apply = process.argv.includes('--apply')

async function main() {
  const product = await prisma.product.findFirst({ where: { productNumber: '45' }, select: { id: true, name: true, image: true, images: true } })
  if (!product) throw new Error('No product 45')
  console.log(`${product.name}\n  main    ${product.image} -> ${MAIN}\n  images  ${product.images}\n      ->  ${JSON.stringify(GALLERY)}`)
  if (!apply) return console.log('dry run. Re-run with --apply')
  for (const p of [MAIN, ...GALLERY]) {
    const r = await fetch('https://genosys.ae' + p, { method: 'HEAD' })
    if (!r.ok) throw new Error(`${p} is not live yet (HTTP ${r.status})`)
  }
  await prisma.product.update({ where: { id: product.id }, data: { image: MAIN, images: JSON.stringify(GALLERY) } })
  console.log('updated')
}

main().catch((e) => { console.error(e); process.exitCode = 1 }).finally(() => prisma.$disconnect())
