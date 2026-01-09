const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addImage() {
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

    // Add biomeso2.png image after the BIO-MESO PDRN EXPERT AMPOULE 60000 section
    // Find a good insertion point - after the "Professional Treatment Protocol" section
    let content = post.content

    // Insert image after the treatment protocol section
    const imageHtml = `
<div class="my-10">
  <div class="relative w-full rounded-xl overflow-hidden shadow-lg bg-gray-50" style="aspectRatio: 'auto'; minHeight: '300px'">
    <img 
      src="/blog/biomeso2.png" 
      alt="BIO-MESO PDRN Ampoule Product Details" 
      className="object-contain w-full h-auto"
      loading="lazy"
    />
  </div>
</div>
`

    // Insert after the treatment protocol section (after the closing </ol> and treatment tip)
    const insertAfter = '</ol>\n\n<p><strong>Treatment Tip:</strong> To reduce the intensity of the treatment, skip the HSC application step.</p>'
    
    if (content.includes(insertAfter)) {
      content = content.replace(
        insertAfter,
        insertAfter + imageHtml
      )
    } else {
      // Fallback: insert after the EXPERT AMPOULE section
      const fallbackInsert = '<h3>BIO-MESO PDRN HOMECARE AMPOULE 5000</h3>'
      if (content.includes(fallbackInsert)) {
        content = content.replace(
          fallbackInsert,
          imageHtml + '\n\n' + fallbackInsert
        )
      } else {
        // Last resort: add at the end before the "Why Choose" section
        const lastResort = '<h3>Why Choose GENOSYS BIO-MESO PDRN Ampoule?</h3>'
        if (content.includes(lastResort)) {
          content = content.replace(
            lastResort,
            imageHtml + '\n\n' + lastResort
          )
        } else {
          // Add before the closing
          content = content + imageHtml
        }
      }
    }

    await prisma.blogPost.update({
      where: { slug },
      data: { content },
    })

    console.log('✅ Image added successfully!')
    console.log('📝 Blog post URL: http://localhost:3000/blog/' + slug)
  } catch (error) {
    console.error('❌ Error adding image:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addImage()

