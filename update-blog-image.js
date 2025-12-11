#!/usr/bin/env node

/**
 * Script to add featured image to the Stripe payment blog post
 */

const { Client } = require('pg')

// Use the direct PostgreSQL URL for connection
const client = new Client({
  connectionString: "postgres://bba1d642802ecf0af6b89802617217c7ee4bd9e45a9df009f7fcc332176072e7:sk_-vf4T6G2TVhfLC4FwIJsi@db.prisma.io:5432/postgres?sslmode=require"
})

async function updateBlogImage() {
  try {
    console.log('🚀 Connecting to PostgreSQL database...')
    await client.connect()

    console.log('🖼️ Adding featured image to Stripe payment blog post...')
    
    const updateQuery = `
      UPDATE blog_posts 
      SET "featuredImage" = $1, "updatedAt" = NOW()
      WHERE slug = $2
      RETURNING id, slug, "featuredImage"
    `
    
    const values = [
      '/images/stripe.png',  // Featured image path
      'new-stripe-payment-options-apple-pay-google-pay-2025'  // Blog post slug
    ]

    const result = await client.query(updateQuery, values)
    
    if (result.rows.length === 0) {
      console.log('❌ Blog post not found!')
      return
    }

    const post = result.rows[0]

    console.log('✅ Blog post updated successfully!')
    console.log(`📝 Post ID: ${post.id}`)
    console.log(`🔗 Slug: ${post.slug}`)
    console.log(`🖼️ Featured Image: ${post.featuredImage}`)
    console.log('')
    console.log('📱 URLs with featured image:')
    console.log(`🇬🇧 English: https://genosys.ae/blog/${post.slug}`)
    console.log(`🇷🇺 Russian: https://genosys.ae/ru/blog/${post.slug}`)
    console.log(`🇸🇦 Arabic: https://genosys.ae/ar/blog/${post.slug}`)
    console.log('')
    console.log('🎉 Stripe image now featured on the blog post!')
    
    return post
  } catch (error) {
    console.error('❌ Error updating blog post:', error)
    throw error
  } finally {
    await client.end()
  }
}

// Run the function
updateBlogImage()
  .then(() => {
    console.log('✨ Script completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Script failed:', error)
    process.exit(1)
  })