require('dotenv').config({ path: '.env.local' })
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addSpacing() {
  try {
    const slug = '2025-genosys-new-products-bio-meso-pdrn-ampoule-mask-pack'
    
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { content: true },
    })

    if (!post) {
      console.error('Blog post not found')
      return
    }

    let content = post.content

    // Find the pattern: closing divs followed by paragraph with BIO-MESO™ PDRN
    const pattern = /(biomeso\.png[\s\S]*?<\/div>\s*<\/div>)\s*(<p><strong>BIO-MESO™ PDRN<\/strong>)/

    if (pattern.test(content)) {
      // Replace with extra spacing (3 newlines instead of 2)
      content = content.replace(pattern, '$1\n\n\n$2')
      
      await prisma.blogPost.update({
        where: { slug },
        data: { content },
      })

      console.log('✅ Added extra spacing between biomeso.png image and BIO-MESO™ PDRN text')
    } else {
      console.log('Pattern not found')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addSpacing()

