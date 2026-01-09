const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixImage() {
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

    // Fix the image HTML - replace className with class and fix style
    const oldImageHtml = `<div class="my-10">
  <div class="relative w-full rounded-xl overflow-hidden shadow-lg bg-gray-50" style="aspectRatio: 'auto'; minHeight: '300px'">
    <img 
      src="/blog/biomeso2.png" 
      alt="BIO-MESO PDRN Ampoule Product Details" 
      className="object-contain w-full h-auto"
      loading="lazy"
    />
  </div>
</div>`

    const newImageHtml = `<div class="my-10">
  <div class="relative w-full rounded-xl overflow-hidden shadow-lg bg-gray-50" style="aspect-ratio: 816 / 392; min-height: 300px;">
    <img 
      src="/blog/biomeso2.png" 
      alt="BIO-MESO PDRN Ampoule Product Details" 
      class="object-contain w-full h-auto"
      loading="lazy"
    />
  </div>
</div>`

    content = content.replace(oldImageHtml, newImageHtml)

    await prisma.blogPost.update({
      where: { slug },
      data: { content },
    })

    console.log('✅ Image HTML fixed successfully!')
  } catch (error) {
    console.error('❌ Error fixing image:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixImage()

