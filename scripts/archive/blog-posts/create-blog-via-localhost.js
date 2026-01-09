/**
 * Create blog post by calling localhost API
 * Make sure Next.js dev server is running first: npm run dev
 */

const fs = require('fs')

// Read the blog post data
const blogPostData = JSON.parse(fs.readFileSync('payment-blog-post.json', 'utf8'))

async function createBlogPost() {
  try {
    console.log('🚀 Creating blog post via localhost API...')
    
    // Use localhost API
    const response = await fetch('http://localhost:3000/api/blog/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogPostData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error:', response.status, errorText)
      
      if (response.status === 401 || response.status === 403) {
        console.log('')
        console.log('🔑 Authentication required. The blog post data has been saved to:')
        console.log('📄 payment-blog-post.json')
        console.log('📄 payment-blog-post.sql')
        console.log('')
        console.log('✨ You can:')
        console.log('1. Run the SQL script directly in your database')
        console.log('2. Use the admin panel to create the blog post')
        console.log('3. Manually insert using the JSON data')
        return
      }
      
      throw new Error(`API request failed: ${response.status}`)
    }

    const result = await response.json()
    const post = result.post

    console.log('✅ Blog post created successfully!')
    console.log(`📝 Post ID: ${post.id}`)
    console.log(`🔗 Slug: ${post.slug}`)
    console.log('')
    console.log('📱 URLs:')
    console.log(`🇬🇧 English: https://genosys.ae/blog/${post.slug}`)
    console.log(`🇷🇺 Russian: https://genosys.ae/ru/blog/${post.slug}`)
    console.log(`🇸🇦 Arabic: https://genosys.ae/ar/blog/${post.slug}`)
    
  } catch (error) {
    if (error.message.includes('ECONNREFUSED')) {
      console.log('❌ Could not connect to localhost:3000')
      console.log('📋 Make sure Next.js dev server is running: npm run dev')
      console.log('')
      console.log('📄 Alternative: Use the generated files:')
      console.log('   - payment-blog-post.sql (run in database)')
      console.log('   - payment-blog-post.json (use in admin panel)')
    } else {
      console.error('❌ Error:', error.message)
    }
  }
}

createBlogPost()