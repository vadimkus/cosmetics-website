const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createBlogPost() {
  try {
    const blogPost = await prisma.blogPost.create({
      data: {
        title: '2025 GENOSYS NEW PRODUCTS - BIO-MESO PDRN Ampoule & PDRN Mask Pack',
        slug: '2025-genosys-new-products-bio-meso-pdrn-ampoule-mask-pack',
        excerpt: 'Discover GENOSYS\'s latest 2025 innovations: BIO-MESO PDRN Ampoule and enhanced PDRN Mask Pack. Advanced PDRN technology for professional skin regeneration and barrier repair.',
        content: `
<div class="intro-section mb-8 pb-8 border-b border-gray-200">
  <h2>Introducing GENOSYS 2025 New Products: BIO-MESO PDRN Ampoule & PDRN Mask Pack</h2>
  
  <p>We're thrilled to announce GENOSYS's latest innovations for 2025: the <strong>BIO-MESO PDRN Ampoule</strong> and the enhanced <strong>PDRN Mask Pack</strong>. These cutting-edge products represent the next generation of professional skincare, combining advanced PDRN (Polynucleotides) technology with innovative delivery systems for exceptional skin regeneration and barrier repair.</p>
</div>

<h3>What is PDRN Technology?</h3>

<p>PDRN (Polynucleotides) is a revolutionary ingredient derived from salmon DNA that has been clinically proven to promote skin regeneration, enhance collagen production, and accelerate wound healing. This advanced biotechnology ingredient energizes tired skin and supports natural cellular repair processes.</p>

<h3>BIO-MESO PDRN Ampoule</h3>

<p>The <strong>BIO-MESO PDRN Ampoule</strong> is a concentrated serum formulation designed for professional use. This powerful ampoule delivers high concentrations of PDRN directly to the skin, making it ideal for:</p>

<ul>
  <li><strong>Intensive Skin Regeneration:</strong> Accelerates cell renewal and tissue repair</li>
  <li><strong>Post-Procedure Recovery:</strong> Supports healing after professional treatments</li>
  <li><strong>Barrier Repair:</strong> Strengthens compromised skin barriers</li>
  <li><strong>Anti-Aging Benefits:</strong> Promotes collagen and elastin production</li>
  <li><strong>Hydration Boost:</strong> Provides deep, long-lasting moisture</li>
</ul>

<h3>PDRN Mask Pack</h3>

<p>The enhanced <strong>PDRN Mask Pack</strong> combines PDRN technology with advanced mask sheet technology for optimal ingredient delivery. Key features include:</p>

<ul>
  <li><strong>Ultra-Thin Lyocell Sheet:</strong> Ensures flawless adherence and maximum essence absorption</li>
  <li><strong>DAME Technology:</strong> Double Ampoule Mask Experience for intensive treatment</li>
  <li><strong>Barrier Strengthening:</strong> Enriched with Panthenol and 5 types of Ceramides</li>
  <li><strong>Professional-Grade:</strong> Designed for clinic use and licensed practitioners</li>
</ul>

<h3>Clinical Benefits</h3>

<p>Both products have been clinically tested and proven to deliver exceptional results:</p>

<ul>
  <li>Significant improvement in skin barrier function</li>
  <li>Enhanced skin elasticity and firmness</li>
  <li>Reduced transepidermal water loss (TEWL)</li>
  <li>Accelerated skin cell regeneration</li>
  <li>Improved overall skin texture and radiance</li>
</ul>

<h3>Professional Application</h3>

<p>These products are designed for professional use by licensed skincare practitioners. They can be incorporated into facial treatments, used as post-procedure recovery protocols, or recommended for at-home maintenance between professional sessions.</p>

<h3>Why Choose GENOSYS PDRN Products?</h3>

<p>GENOSYS is committed to providing professional-grade Korean dermacosmetics backed by clinical research. Our PDRN products are:</p>

<ul>
  <li><strong>Certified:</strong> All products are certified by Dubai Municipality</li>
  <li><strong>Authentic:</strong> Official distributor of DTS MG Co., Ltd. Korea</li>
  <li><strong>Clinically Proven:</strong> Backed by dermatological studies</li>
  <li><strong>Professional-Grade:</strong> Designed for licensed practitioners</li>
</ul>

<h3>Experience Advanced Skin Regeneration</h3>

<p>Discover the power of PDRN technology with GENOSYS's new 2025 products. Whether you're looking for intensive regeneration with the BIO-MESO PDRN Ampoule or convenient treatment with the PDRN Mask Pack, these innovations deliver professional-grade results.</p>

<p>For more information about these products or to place an order, please contact our sales team at <a href="mailto:sales@genosys.ae">sales@genosys.ae</a> or WhatsApp us at <a href="https://wa.me/971585487665">+971 58 548 76 65</a>.</p>

<p>Explore our <a href="/products/52">SKIN REBOOT PDRN MASK PACK</a> product page for more details.</p>
        `.trim(),
        featuredImage: '/blog/pd.jpg', // You can update this with a specific BIO-MESO image
        authorName: 'GENOSYS Team',
        published: true,
        publishedAt: new Date(),
        tags: JSON.stringify(['PDRN', 'BIO-MESO', 'Ampoule', 'Mask Pack', '2025', 'New Products', 'Skin Regeneration', 'Professional Skincare', 'Korean Skincare', 'Barrier Repair']),
      },
    })

    console.log('✅ Blog post created successfully!')
    console.log('Post ID:', blogPost.id)
    console.log('Slug:', blogPost.slug)
    console.log('Title:', blogPost.title)
    console.log('\n📝 Blog post URL: http://localhost:3000/blog/' + blogPost.slug)
  } catch (error) {
    console.error('❌ Error creating blog post:', error)
    if (error.code === 'P2002') {
      console.error('A blog post with this slug already exists. Please use a different slug or delete the existing post first.')
    }
  } finally {
    await prisma.$disconnect()
  }
}

createBlogPost()

