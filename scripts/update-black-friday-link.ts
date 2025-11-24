import { PrismaClient } from '@prisma/client'
import { debugLog, errorLog } from '@/lib/logger'

const prisma = new PrismaClient()

async function updateBlackFridayLink() {
  try {
    const slug = 'black-friday-sale-20-off'
    
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { content: true, contentAr: true }
    })

    if (!post) {
      errorLog(`Blog post with slug "${slug}" not found.`)
      return
    }

    // Update English content - add link to www.genosys.ae
    let content = post.content || ''
    content = content.replace(
      /Order directly through our official website: www\.genosys\.ae/g,
      'Order directly through our official website: <a href="https://www.genosys.ae" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">www.genosys.ae</a>'
    )

    // Update Arabic content - add link to www.genosys.ae
    let contentAr = post.contentAr || ''
    contentAr = contentAr.replace(
      /اطلب مباشرة من خلال موقعنا الرسمي: www\.genosys\.ae/g,
      'اطلب مباشرة من خلال موقعنا الرسمي: <a href="https://www.genosys.ae" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">www.genosys.ae</a>'
    )

    await prisma.blogPost.update({
      where: { slug },
      data: {
        content,
        contentAr,
      }
    })

    debugLog('✅ Added link to website URL')
    debugLog(`   Added clickable link to www.genosys.ae`)
  } catch (error) {
    errorLog('❌ Failed to add link:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateBlackFridayLink()
  .then(() => console.log('Done!'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

