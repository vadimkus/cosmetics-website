/**
 * Put the studio / claim-slide galleries back on products 11, 13, 14, 15, 16, 18.
 * Intertek carton flats stay on disk. They do not go on the customer gallery.
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

const RESTORE: Record<string, { image: string; images: string[] }> = {
  '11': {
    image: '/images/remover/Main2.jpg',
    images: [
      '/images/remover/S1b.jpg',
      '/images/remover/S2b.jpg',
      '/images/remover/S3b.jpg',
      '/images/remover/S4b.jpg',
      '/images/remover/S5b.jpg',
      '/images/remover/S6b.jpg',
    ],
  },
  '13': {
    image: '/images/SRS.jpg',
    images: ['/images/Second/sss1.jpg', '/images/Second/sss2.jpg'],
  },
  '14': {
    image: '/images/mist/main2.jpeg',
    images: [
      '/images/mist/S1.jpeg',
      '/images/mist/S2.jpeg',
      '/images/mist/S3.jpeg',
      '/images/mist/S4.jpeg',
      '/images/mist/S5.jpeg',
      '/images/mist/S6.jpeg',
    ],
  },
  '15': {
    image: '/images/problem/Main.jpg',
    images: [
      '/images/problem/S1.jpg',
      '/images/problem/S2.jpg',
      '/images/problem/S3.jpg',
      '/images/problem/S4.jpg',
      '/images/problem/S5.jpg',
      '/images/problem/S6.jpg',
    ],
  },
  '16': {
    image: '/images/Second/main_booster.jpg',
    images: ['/images/Second/main_booster2.png'],
  },
  '18': {
    image: '/images/hyaluron_serum/main.jpeg',
    images: [
      '/images/hyaluron_serum/s1.jpeg',
      '/images/hyaluron_serum/s2.jpeg',
      '/images/hyaluron_serum/s3.jpeg',
      '/images/hyaluron_serum/s4.jpeg',
      '/images/hyaluron_serum/s5.jpeg',
      '/images/hyaluron_serum/s6.jpeg',
    ],
  },
}

async function main() {
  for (const [productNumber, next] of Object.entries(RESTORE)) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: productNumber }, { productNumber }],
      },
    })
    if (!product) throw new Error(`product ${productNumber} not found`)

    await prisma.product.update({
      where: { id: product.id },
      data: {
        image: next.image,
        images: JSON.stringify(next.images),
      },
    })

    console.log('restored', productNumber, product.name, next.images.length)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
