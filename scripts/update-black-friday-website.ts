import { PrismaClient } from '@prisma/client'
import { debugLog, errorLog } from '@/lib/logger'

const prisma = new PrismaClient()

async function updateBlackFridayWebsite() {
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

    // Update English content
    let content = post.content || ''
    content = content.replace(
      /Order directly through our official website \(link in bio\)/g,
      'Order directly through our official website: www.genosys.ae'
    )

    // Update Arabic content
    let contentAr = post.contentAr || ''
    contentAr = contentAr.replace(
      /اطلب مباشرة من خلال موقعنا الرسمي \(الرابط في السيرة الذاتية\)/g,
      'اطلب مباشرة من خلال موقعنا الرسمي: www.genosys.ae'
    )

    await prisma.blogPost.update({
      where: { slug },
      data: {
        content,
        contentAr,
      }
    })

    debugLog('✅ Updated Black Friday website text')
    debugLog(`   Changed to "Order directly through our official website: www.genosys.ae"`)
  } catch (error) {
    errorLog('❌ Failed to update Black Friday website text:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateBlackFridayWebsite()
  .then(() => console.log('Done!'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

