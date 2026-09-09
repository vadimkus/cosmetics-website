import { prisma } from '@/lib/prisma'

// Product 21, MULTI VITA RADIANCE SERUM: Sep 2026 campaign slides S1-S8
// (Olga Artjomova, campaign order per INSTRUCTIONS.txt). Main unchanged.
// Run after the deploy carrying the files is live.
const GALLERY = Array.from({ length: 8 }, (_, i) => `/images/radiance_serum/S${i + 1}.jpeg`)
const apply = process.argv.includes('--apply')

async function main() {
  const product = await prisma.product.findFirst({ where: { productNumber: '21' }, select: { id: true, name: true, image: true, images: true } })
  if (!product) throw new Error('No product 21')
  console.log(`${product.name}\n  main    ${product.image}\n  images  ${product.images}\n      ->  ${JSON.stringify(GALLERY)}`)
  if (!apply) return console.log('dry run. Re-run with --apply')
  for (const p of GALLERY) {
    const r = await fetch('https://genosys.ae' + p, { method: 'HEAD' })
    if (!r.ok) throw new Error(`${p} is not live yet (HTTP ${r.status})`)
  }
  await prisma.product.update({ where: { id: product.id }, data: { images: JSON.stringify(GALLERY) } })
  console.log('updated')
}

main().catch((e) => { console.error(e); process.exitCode = 1 }).finally(() => prisma.$disconnect())
