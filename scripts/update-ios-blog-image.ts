import 'dotenv/config'
import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'

async function updateIOSBlogPostImage() {
  try {
    const slug = 'native-ios-app-coming-january-2026'
    
    // Check if post exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug }
    })

    if (!existing) {
      console.log(`❌ Blog post with slug "${slug}" not found.`)
      return
    }

    // Update the featured image
    const updated = await prisma.blogPost.update({
      where: { slug },
      data: {
        featuredImage: '/images/ios.png'
      }
    })

    debugLog('✅ Blog post image updated successfully!')
    debugLog('📝 Post ID:', updated.id)
    debugLog('🖼️ New Image:', updated.featuredImage)
    console.log('\n🎉 Blog post image updated successfully!')
    console.log(`🌐 View at: https://genosys.ae/blog/${slug}`)
    console.log(`🖼️ Featured Image: /images/ios.png`)

  } catch (error) {
    errorLog('❌ Error updating blog post image:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateIOSBlogPostImage()
