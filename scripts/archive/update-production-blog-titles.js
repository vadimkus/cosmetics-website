const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateProductionBlogTitles() {
  try {
    console.log('🔄 Updating blog post titles in production...')
    console.log('📊 Database URL:', process.env.DATABASE_URL ? 'Set (hidden)' : 'Not set - using default')

    // Update PDRN Mask Pack post
    const pdrnPost = await prisma.blogPost.findUnique({
      where: { slug: 'genosys-skin-reboot-pdrn-mask-pack-launch' },
    })

    if (pdrnPost) {
      const newTitle = pdrnPost.title.replace(/^NEW:\s*/i, '').replace(/^NEW\s+/i, '')
      if (newTitle !== pdrnPost.title) {
        await prisma.blogPost.update({
          where: { slug: 'genosys-skin-reboot-pdrn-mask-pack-launch' },
          data: { title: newTitle },
        })
        console.log('✅ Updated PDRN post title:')
        console.log('  Old:', pdrnPost.title)
        console.log('  New:', newTitle)
      } else {
        console.log('ℹ️  PDRN post title already updated:', pdrnPost.title)
      }
    } else {
      console.log('❌ PDRN post not found')
    }

    // Update BIO-FERMENT post
    const bioFermentPost = await prisma.blogPost.findUnique({
      where: { slug: 'bio-ferment-age-defying-powder-mask-launch' },
    })

    if (bioFermentPost) {
      const newTitle = bioFermentPost.title.replace(/^NEW:\s*/i, '').replace(/^NEW\s+/i, '')
      if (newTitle !== bioFermentPost.title) {
        await prisma.blogPost.update({
          where: { slug: 'bio-ferment-age-defying-powder-mask-launch' },
          data: { title: newTitle },
        })
        console.log('✅ Updated BIO-FERMENT post title:')
        console.log('  Old:', bioFermentPost.title)
        console.log('  New:', newTitle)
      } else {
        console.log('ℹ️  BIO-FERMENT post title already updated:', bioFermentPost.title)
      }
    } else {
      console.log('❌ BIO-FERMENT post not found')
    }

    console.log('✅ All updates completed!')

  } catch (error) {
    console.error('❌ Error updating blog post titles:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

updateProductionBlogTitles()

