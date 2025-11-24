import { PrismaClient } from '@prisma/client'
import { debugLog, errorLog } from '@/lib/logger'

const prisma = new PrismaClient()

async function updateBlackFridayDate() {
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

    // Update English content - change to "Nov 26th — Nov 28th"
    let content = post.content || ''
    content = content.replace(/Nov \d+th — Nov \d+th/g, 'Nov 26th — Nov 28th')
    // Also update the end date in the CTA section
    content = content.replace(/ends Nov \d+th/g, 'ends Nov 28th')

    // Update Arabic content - change to "26 نوفمبر — 28 نوفمبر"
    let contentAr = post.contentAr || ''
    contentAr = contentAr.replace(/\d+ نوفمبر — \d+ نوفمبر/g, '26 نوفمبر — 28 نوفمبر')
    // Also update the end date in the CTA section
    contentAr = contentAr.replace(/ينتهي في \d+ نوفمبر/g, 'ينتهي في 28 نوفمبر')

    await prisma.blogPost.update({
      where: { slug },
      data: {
        content,
        contentAr,
      }
    })

    debugLog('✅ Updated Black Friday sale dates')
    debugLog(`   Changed to "Nov 26th — Nov 28th"`)
  } catch (error) {
    errorLog('❌ Failed to update Black Friday dates:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateBlackFridayDate()
  .then(() => console.log('Done!'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
