import { PrismaClient } from '@prisma/client'
import { debugLog, errorLog } from '@/lib/logger'

const prisma = new PrismaClient()

async function updateBlackFridayInstagram() {
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

    // Update English content - add Instagram handle
    let content = post.content || ''
    content = content.replace(
      /or place your order via Instagram Direct Message/g,
      'or place your order via Instagram Direct Message: <a href="https://www.instagram.com/genosys.uae" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">@Genosys.UAE</a>'
    )

    // Update Arabic content - add Instagram handle
    let contentAr = post.contentAr || ''
    contentAr = contentAr.replace(
      /أو ضع طلبك عبر رسالة Instagram المباشرة/g,
      'أو ضع طلبك عبر رسالة Instagram المباشرة: <a href="https://www.instagram.com/genosys.uae" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">@Genosys.UAE</a>'
    )

    await prisma.blogPost.update({
      where: { slug },
      data: {
        content,
        contentAr,
      }
    })

    debugLog('✅ Added Instagram handle')
    debugLog(`   Added @Genosys.UAE with link`)
  } catch {
    errorLog('❌ Failed to add Instagram handle:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateBlackFridayInstagram()
  .then(() => console.log('Done!'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

