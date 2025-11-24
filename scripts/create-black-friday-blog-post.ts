import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'

async function createBlackFridayBlogPost() {
  try {
    const title = '✨ BLACK FRIDAY SALE — 20% OFF ✨'
    const slug = 'black-friday-sale-20-off'
    const excerpt = 'This year, we\'re giving you something special. –20% on ALL GENOSYS products, exclusively for online purchases.'
    const content = `<div class="blog-content">
  <div class="intro-section bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6 md:p-8 mb-8">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">✨ BLACK FRIDAY SALE — 20% OFF ✨</h2>
    <p class="text-xl md:text-2xl text-gray-700 font-semibold text-center mb-2">Nov 26th — Nov 29th</p>
  </div>

  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      This year, we're giving you something special.
    </p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 font-semibold">
      –20% on ALL GENOSYS products, exclusively for online purchases.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">🛒 How to get the discount:</h3>
    <ul class="list-disc list-inside space-y-3 text-gray-700 text-lg">
      <li>Order directly through our official website (link in bio)</li>
      <li>or place your order via Instagram Direct Message</li>
    </ul>
    <p class="text-lg text-gray-700 mt-4">
      No promo codes. No minimum spend.
    </p>
    <p class="text-lg text-gray-700 mt-2 font-semibold">
      Just premium professional skincare — now with a rare Black Friday offer.
    </p>
  </div>

  <div class="feature-section mb-8 text-center">
    <img 
      src="/blog/friday.jpeg" 
      alt="Black Friday Sale - 20% OFF on all GENOSYS products" 
      class="rounded-xl shadow-lg mx-auto max-w-full h-auto"
    />
  </div>

  <div class="cta-section bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl p-6 md:p-8 text-center">
    <p class="text-lg md:text-xl font-bold mb-2">💥 Valid for online purchases only.</p>
    <p class="text-base md:text-lg">
      Don't miss it — our biggest yearly offer ends Nov 29th.
    </p>
  </div>
</div>`
    const featuredImage = '/blog/friday.jpeg'
    const authorName = 'GENOSYS Team'
    const published = true
    const publishedAt = new Date('2024-11-26T00:00:00Z')
    const tags = ['sale', 'black-friday', 'discount', 'promotion', 'special-offer']

    // Check if post already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    })

    if (existingPost) {
      debugLog('Blog post already exists, updating...')
      const updatedPost = await prisma.blogPost.update({
        where: { slug },
        data: {
          title,
          excerpt,
          content,
          featuredImage,
          authorName,
          published,
          publishedAt,
          tags: JSON.stringify(tags),
        }
      })
      debugLog('✅ Blog post updated successfully:')
      debugLog(`   ID: ${updatedPost.id}`)
      debugLog(`   Slug: ${updatedPost.slug}`)
      debugLog(`   Title: ${updatedPost.title}`)
      debugLog(`   Published: ${updatedPost.published}`)
      debugLog(`   Published At: ${updatedPost.publishedAt}`)
    } else {
      const post = await prisma.blogPost.create({
        data: {
          title,
          slug,
          excerpt,
          content,
          featuredImage,
          authorName,
          published,
          publishedAt,
          tags: JSON.stringify(tags),
        }
      })
      debugLog('✅ Blog post created successfully:')
      debugLog(`   ID: ${post.id}`)
      debugLog(`   Slug: ${post.slug}`)
      debugLog(`   Title: ${post.title}`)
      debugLog(`   Published: ${post.published}`)
      debugLog(`   Published At: ${post.publishedAt}`)
    }
  } catch (error) {
    errorLog('❌ Failed to create blog post:', error)
    throw error
  }
}

createBlackFridayBlogPost()
  .then(() => console.log('Done!'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

