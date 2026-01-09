import { PrismaClient } from '@prisma/client'
import { debugLog, errorLog } from '@/lib/logger'

const prisma = new PrismaClient()

async function updateBlackFridayCTA() {
  try {
    const slug = 'black-friday-sale-20-off'
    
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { contentAr: true }
    })

    if (!post) {
      errorLog(`Blog post with slug "${slug}" not found.`)
      return
    }

    // Update the CTA section from bright red to softer styling
    let contentAr = post.contentAr || ''
    
    // Replace the bright red CTA section
    const oldCTA = `<div class="cta-section bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl p-6 md:p-8 text-center">
    <p class="text-lg md:text-xl font-bold mb-2">💥 صالح للشراء عبر الإنترنت فقط.</p>
    <p class="text-base md:text-lg">
      لا تفوتها — أكبر عرض سنوي لدينا ينتهي في 29 نوفمبر.
    </p>
  </div>`

    const newCTA = `<div class="cta-section bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 md:p-8 border border-red-100 text-center">
    <p class="text-lg md:text-xl font-bold text-gray-800 mb-2">💥 صالح للشراء عبر الإنترنت فقط.</p>
    <p class="text-base md:text-lg text-gray-700">
      لا تفوتها — أكبر عرض سنوي لدينا ينتهي في 29 نوفمبر.
    </p>
  </div>`

    contentAr = contentAr.replace(oldCTA, newCTA)

    await prisma.blogPost.update({
      where: { slug },
      data: {
        contentAr,
      }
    })

    debugLog('✅ Updated Black Friday CTA section styling')
    debugLog(`   Changed from bright red to softer red/pink background`)
  } catch {
    errorLog('❌ Failed to update Black Friday CTA:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateBlackFridayCTA()
  .then(() => console.log('Done!'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

