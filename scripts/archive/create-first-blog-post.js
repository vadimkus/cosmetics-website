const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createBlogPost() {
  try {
    const blogPost = await prisma.blogPost.create({
      data: {
        title: 'NEW: Skin Barrier Strengthening & Lifting Effect - GENOSYS Skin Reboot PDRN Mask Pack',
        slug: 'genosys-skin-reboot-pdrn-mask-pack-launch',
        excerpt: 'Introducing the newest tissue-type DAME (Double Ampoule Mask Experience) mask pack from GENOSYS - a professional-grade intensive regeneration mask that soothes irritated skin fast while strengthening the skin barrier and improving elasticity.',
        content: `
<h2>Introducing GENOSYS Skin Reboot PDRN Mask Pack</h2>

<p>We're excited to announce the launch of the newest addition to the GENOSYS professional skincare line: the <strong>Skin Reboot PDRN Mask Pack</strong>. This revolutionary tissue-type DAME (Double Ampoule Mask Experience) mask pack represents a breakthrough in intensive skin regeneration technology.</p>

<h3>What Makes This Mask Pack Special?</h3>

<p>The GENOSYS Skin Reboot PDRN Mask Pack is a professional-grade intensive regeneration mask designed to address multiple skin concerns simultaneously. It combines advanced ingredients to deliver comprehensive skin benefits:</p>

<h4>💧 Fortified Skin Barrier Protection</h4>
<p>The mask is enriched with <strong>Panthenol</strong> and <strong>5 types of Ceramides</strong> that work together to strengthen and protect the skin barrier. Ceramides are essential lipids that form a protective layer on the skin, preventing moisture loss and protecting against environmental aggressors. Panthenol (Vitamin B5) provides deep hydration and helps soothe irritated skin.</p>

<h4>🌿 PDRN Technology for Skin Rejuvenation</h4>
<p>Infused with <strong>PDRN (Polynucleotides)</strong>, this mask energizes and nourishes tired skin. PDRN is derived from salmon DNA and has been clinically proven to promote collagen production, enhance skin elasticity, and improve overall skin texture. This advanced ingredient helps accelerate skin cell regeneration and repair.</p>

<h4>🌬️ Ultra-Thin Lyocell Sheet Technology</h4>
<p>The mask features an ultra-thin lyocell sheet that ensures flawless adherence to the skin and maximized essence delivery. This innovative material allows for better penetration of active ingredients, ensuring that your skin receives the full benefits of the potent formula.</p>

<h3>Clinical Results</h3>

<p>Dermatological clinical studies have demonstrated impressive results:</p>
<ul>
  <li><strong>34.969% improvement in TEWL (Transepidermal Water Loss)</strong> - This significant reduction in water loss indicates a stronger, more resilient skin barrier</li>
  <li><strong>2.886% improvement in cheek lifting angle</strong> - Visible lifting and firming effects, contributing to a more youthful appearance</li>
</ul>

<p>These clinically proven results demonstrate the mask pack's effectiveness in both barrier strengthening and skin lifting.</p>

<h3>Key Benefits</h3>

<ul>
  <li><strong>Rapid Soothing:</strong> Quickly calms irritated and sensitive skin</li>
  <li><strong>Barrier Strengthening:</strong> Multiple ceramides and panthenol work together to rebuild and fortify the skin's natural barrier</li>
  <li><strong>Improved Elasticity:</strong> PDRN technology promotes collagen production for firmer, more elastic skin</li>
  <li><strong>Deep Hydration:</strong> Advanced formulation ensures long-lasting moisture retention</li>
  <li><strong>Professional-Grade:</strong> Designed for use in professional skincare clinics and by licensed practitioners</li>
</ul>

<h3>Who Can Benefit?</h3>

<p>This mask pack is ideal for:</p>
<ul>
  <li>Clients with compromised skin barriers</li>
  <li>Those experiencing skin irritation or sensitivity</li>
  <li>Individuals seeking intensive skin regeneration</li>
  <li>Clients looking to improve skin elasticity and firmness</li>
  <li>Post-treatment recovery and maintenance</li>
</ul>

<h3>Professional Application</h3>

<p>As a professional-grade product, the GENOSYS Skin Reboot PDRN Mask Pack should be used by licensed skincare professionals. It can be incorporated into facial treatments, used as a post-treatment recovery mask, or recommended for at-home use between professional sessions.</p>

<h3>About GENOSYS</h3>

<p>GENOSYS is a professional Korean dermacosmetics brand distributed by GENOSYS Middle East FZ-LLC in the UAE. All our products are certified by Dubai Municipality and are suitable for licensed practitioners and professional beauty clinics. We are the official distributor of DTS MG Co., Ltd. Korea, ensuring authentic and certified products.</p>

<h3>Experience Clinically Proven Results</h3>

<p>Experience the clinically proven skin rebooting effects with the new GENOSYS Skin Reboot PDRN Mask Pack. This innovative product combines cutting-edge Korean skincare technology with proven ingredients to deliver exceptional results.</p>

<p>For more information about this product or to place an order, please contact our sales team at <a href="mailto:sales@genosys.ae">sales@genosys.ae</a> or WhatsApp us at <a href="https://wa.me/971585487665">+971 58 548 76 65</a>.</p>

<p><em>Source: <a href="https://dtsmg.com/new-skin-barrier-strengthening-lifting-effect-genosys-skin-reboot-pdrn-mask-pack-launch/" target="_blank" rel="noopener noreferrer">DTSMG Official Announcement</a></em></p>
        `.trim(),
        featuredImage: '/blog/pd.jpg',
        authorName: 'GENOSYS Team',
        published: true,
        publishedAt: new Date(),
        tags: JSON.stringify(['PDRN', 'Mask Pack', 'Skin Barrier', 'Ceramides', 'Professional Skincare', 'Korean Skincare', 'DAME', 'Skin Rejuvenation']),
      },
    })

    console.log('✅ Blog post created successfully!')
    console.log('Post ID:', blogPost.id)
    console.log('Slug:', blogPost.slug)
    console.log('Title:', blogPost.title)
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

