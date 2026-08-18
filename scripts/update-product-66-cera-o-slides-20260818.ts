/**
 * Product 66 (CERABARRIER BIOME GEL CLEANSER) — point the record at the Aug 2026 studio
 * set in `/images/cera_o/`.
 *
 * The old set (`/images/cera/`) was a mix of a packshot, two per-size bottle shots and
 * three claim slides, shot in July. The new set is a coherent seven-slide story plus a
 * clean two-bottle packshot, and every claim printed on it is already in
 * cerabarrierCopy.ts: +145.8% immediate hydration, 2.4x, the five ceramides
 * NP/AS/AP/NS/EOP, the pro- and prebiotic list, 200 ml homecare / 600 ml professional,
 * dermatologically tested, made in Korea. Nothing new is being claimed.
 *
 * MAIN IMAGE  /images/cera_o/Main.jpeg — both bottles, no text.
 *
 * GALLERY (the `images` field, main deliberately excluded — web and mobile both prepend
 * `product.image` themselves):
 *   s1  Barrier Lipid Complex x Microbiome Complex     also inline: the complex section
 *   s2  CLEAN SKIN. INTACT BARRIER.                    gallery only
 *   s3  GEL. WATER. FOAM.                              also inline: the texture section
 *   s4  CLINICAL PROOF +145.8% / 2.4x                  also inline: the proof section
 *   s5  MORE THAN CERAMIDES.                           also inline: the actives section
 *   s6  NO TIGHTNESS.                                  also inline: the how-to section
 *   s7  200 ml homecare / 600 ml professional          gallery only
 *
 * NOTHING IS DELETED. The old `/images/cera/` files stay on disk: `main3.jpeg` and the
 * rest are referenced by order emails already sent, and the size cards on the page still
 * use `S4.jpeg` and `S5.jpeg` because the new set photographs the two sizes together
 * rather than separately.
 *
 * New filenames in a new folder, so the immutable one-year Cache-Control on /images/*
 * cannot serve a stale copy.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-66-cera-o-slides-20260818.ts
 */

import { prisma } from '../lib/prisma'

const MAIN = '/images/cera_o/Main.jpeg'

const GALLERY = [
  '/images/cera_o/s1.jpeg',
  '/images/cera_o/s2.jpeg',
  '/images/cera_o/s3.jpeg',
  '/images/cera_o/s4.jpeg',
  '/images/cera_o/s5.jpeg',
  '/images/cera_o/s6.jpeg',
  '/images/cera_o/s7.jpeg',
]

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '66' }, { name: { contains: 'CERABARRIER' } }] },
  })
  if (!p) throw new Error('Product 66 not found')

  console.log('before:', p.image, JSON.parse(p.images || '[]').length, 'gallery images')

  await prisma.product.update({
    where: { id: p.id },
    data: { image: MAIN, images: JSON.stringify(GALLERY) },
  })

  const after = await prisma.product.findUnique({ where: { id: p.id } })
  const gallery = JSON.parse(after?.images || '[]') as string[]
  console.log('after :', after?.image, gallery.length, 'gallery images')

  if (gallery.includes(after?.image ?? '')) {
    throw new Error('main image must not appear inside the gallery array')
  }
  console.log('main not duplicated in gallery: ok')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
