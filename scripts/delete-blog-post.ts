import { prisma } from '../lib/prisma'

async function deleteBlogPost() {
  const slug = 'black-friday-sale-20-off'
  
  try {
    // Find the post by slug
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true, title: true }
    })

    if (!post) {
      console.log(`❌ Post with slug "${slug}" not found`)
      return
    }

    console.log(`📝 Found post: ${post.title} (ID: ${post.id})`)
    
    // Delete the post (comments will be cascade deleted)
    await prisma.blogPost.delete({
      where: { id: post.id }
    })

    console.log(`✅ Successfully deleted blog post: ${post.title}`)
  } catch (error) {
    console.error('❌ Error deleting blog post:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

deleteBlogPost()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })

