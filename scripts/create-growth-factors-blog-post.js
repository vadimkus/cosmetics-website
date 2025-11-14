const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createGrowthFactorsBlogPost() {
  try {
    const title = 'What Are Growth Factors in Skincare — and Why Your Skin Loves Them'
    const slug = 'what-are-growth-factors-in-skincare'
    const excerpt = 'Discover how growth factors transform professional skincare by repairing, restoring, and regenerating skin at a cellular level. Learn about their role in anti-aging and how GENOSYS Bio-Ferment Age-Defying Powder Mask harnesses their power.'
    
    const content = `
<div class="blog-content">
  <div class="intro-section mb-8 pb-8 border-b border-gray-200">
    <p class="text-xl text-gray-700 leading-relaxed mb-4">
      In the world of advanced aesthetics, few ingredients have transformed professional skincare as powerfully as <strong class="text-gray-900">growth factors</strong>. Once used mainly in medical wound-healing, they are now at the center of anti-aging formulations thanks to their ability to repair, restore, and regenerate the skin at a cellular level.
    </p>
    <p class="text-lg text-gray-700 leading-relaxed">
      But what exactly are growth factors, and how do they work? Let's break it down.
    </p>
  </div>

  <div class="what-are-growth-factors-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6 mt-8">What Are Growth Factors?</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      Growth factors are naturally occurring proteins found in the human body. They act like messengers that communicate with skin cells, telling them to:
    </p>
    
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 mb-6">
      <ul class="space-y-3 text-gray-700">
        <li class="flex items-start gap-3">
          <span class="text-primary-600 font-bold mt-1">•</span>
          <span><strong class="text-gray-900">Repair damage</strong> – Accelerate healing and recovery</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary-600 font-bold mt-1">•</span>
          <span><strong class="text-gray-900">Produce collagen and elastin</strong> – Essential proteins for skin structure and elasticity</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary-600 font-bold mt-1">•</span>
          <span><strong class="text-gray-900">Regenerate new, healthy cells</strong> – Promote cellular turnover</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary-600 font-bold mt-1">•</span>
          <span><strong class="text-gray-900">Strengthen the skin barrier</strong> – Improve protection and resilience</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary-600 font-bold mt-1">•</span>
          <span><strong class="text-gray-900">Reduce inflammation</strong> – Calm irritated and sensitive skin</span>
        </li>
      </ul>
    </div>

    <p class="text-lg text-gray-700 leading-relaxed">
      As we age, our natural production of growth factors decreases, resulting in slower cell renewal, loss of elasticity, dryness, and the appearance of fine lines.
    </p>
    <p class="text-lg text-gray-700 leading-relaxed mt-4">
      This is where topical, biotech-derived growth factors come into play. When applied to the skin, they help "remind" the cells how to behave like younger, more active versions of themselves.
    </p>
  </div>

  <div class="how-growth-factors-work-section mb-10 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">How Growth Factors Work in Skincare</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      In professional skincare formulas, growth factors deliver comprehensive benefits:
    </p>
    
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="text-2xl font-bold text-primary-600 mb-2">1</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-3">Boost Collagen and Elastin Synthesis</h3>
        <p class="text-gray-700 leading-relaxed">
          Leading to firmer, plumper, more elastic skin with improved structural support.
        </p>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="text-2xl font-bold text-primary-600 mb-2">2</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-3">Accelerate Regeneration</h3>
        <p class="text-gray-700 leading-relaxed">
          Perfect for post-procedure recovery, redness reduction, and strengthening damaged skin.
        </p>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="text-2xl font-bold text-primary-600 mb-2">3</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-3">Reduce Inflammation</h3>
        <p class="text-gray-700 leading-relaxed">
          Calming sensitive, irritated, or stressed skin for a more balanced complexion.
        </p>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="text-2xl font-bold text-primary-600 mb-2">4</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-3">Improve Hydration Levels</h3>
        <p class="text-gray-700 leading-relaxed">
          Some growth factors improve the extracellular matrix, helping the skin retain more moisture.
        </p>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 md:col-span-2">
        <div class="text-2xl font-bold text-primary-600 mb-2">5</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-3">Brighten and Even Out Skin Tone</h3>
        <p class="text-gray-700 leading-relaxed">
          By supporting balanced cellular renewal and reducing oxidative stress, growth factors help achieve a more radiant, even complexion.
        </p>
      </div>
    </div>
  </div>

  <div class="genosys-product-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Growth Factors in GENOSYS Bio-Ferment Age-Defying Powder Mask</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      Our <a href="/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">GENOSYS Bio-Ferment Age-Defying Powder Mask</a> is a powerful example of how growth factors can transform the skin. It combines multiple polypeptide growth factors with fermented active ingredients, creating a synergistic anti-aging and skin-repairing effect.
    </p>

    <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-100 mb-8">
      <h3 class="text-2xl font-bold text-gray-800 mb-6">Included Growth Factors</h3>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h4 class="font-semibold text-gray-800 mb-2">SH-Oligopeptide-1 (EGF)</h4>
          <p class="text-gray-700 text-sm">Epidermal Growth Factor – stimulates epidermal regeneration and cell renewal</p>
        </div>
        <div class="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h4 class="font-semibold text-gray-800 mb-2">SH-Oligopeptide-2 (IGF)</h4>
          <p class="text-gray-700 text-sm">Insulin-like Growth Factor – stimulates cell proliferation and promotes wound healing</p>
        </div>
        <div class="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h4 class="font-semibold text-gray-800 mb-2">SH-Polypeptide-1 (bFGF)</h4>
          <p class="text-gray-700 text-sm">Fibroblast Growth Factor – supports fibroblast activity and collagen synthesis</p>
        </div>
        <div class="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h4 class="font-semibold text-gray-800 mb-2">SH-Polypeptide-3 (KGF)</h4>
          <p class="text-gray-700 text-sm">Keratinocyte Growth Factor – encourages new healthy skin cell formation</p>
        </div>
        <div class="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h4 class="font-semibold text-gray-800 mb-2">SH-Polypeptide-9 (VEGF)</h4>
          <p class="text-gray-700 text-sm">Vascular Endothelial Growth Factor – supports microcirculation and nutrient delivery</p>
        </div>
        <div class="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h4 class="font-semibold text-gray-800 mb-2">SH-Polypeptide-22 (TGF)</h4>
          <p class="text-gray-700 text-sm">Transforming Growth Factor – strengthens the dermal structure</p>
        </div>
      </div>
      <p class="text-gray-700 mt-6 leading-relaxed">
        Together, these factors help the skin recover faster, look firmer, and feel smoother.
      </p>
    </div>
  </div>

  <div class="why-standout-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Why This Mask Stands Out</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      Beyond growth factors, the <a href="/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">GENOSYS Bio-Ferment Age-Defying Powder Mask</a> is infused with a fermented complex that enhances bioavailability and strengthens the skin barrier:
    </p>

    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Fermented Energy Complex</h3>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-3">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Galactomyces Ferment Filtrate:</strong> Antioxidant, brightening, and soothing properties
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Bifida Ferment Lysate:</strong> Reduces sensitivity and strengthens the skin barrier
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Lactobacillus/Pomegranate Ferment Extract:</strong> Anti-aging and anti-pigmentation benefits
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Soybean Ferment Extract:</strong> Antioxidant and conditioning properties
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Plant Extracts</h3>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-3">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Rice Bran Extract:</strong> Rich in antioxidants and moisturizing polysaccharides
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Licorice Root Extract:</strong> Anti-inflammatory and brightening effects
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Aloe Vera Extract:</strong> Soothing and healing properties
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Cypress Water:</strong> Antimicrobial and anti-inflammatory benefits
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="clinical-results-section bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-8 border border-primary-100">
      <h3 class="text-2xl font-bold text-gray-800 mb-6">Clinically Proven Results</h3>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="text-3xl font-bold text-primary-600 mb-2">+218%</div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">Increase in Skin Hydration</h4>
          <p class="text-gray-600 text-sm">
            Significant improvement in skin moisture content and barrier function
          </p>
        </div>
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="text-3xl font-bold text-primary-600 mb-2">-10 to -11°C</div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">Reduction in Skin Temperature</h4>
          <p class="text-gray-600 text-sm">
            Deep soothing and anti-redness effect for calmer, more comfortable skin
          </p>
        </div>
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="text-3xl font-bold text-primary-600 mb-2">✓</div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">Visible Improvements</h4>
          <p class="text-gray-600 text-sm">
            Enhanced smoothness, brightness, and overall skin vitality
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="why-need-growth-factors-section mb-10 bg-blue-50 rounded-xl p-8 border border-blue-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Why Your Skin Needs Growth Factors</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      If your goals include:
    </p>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="flex items-start gap-3 p-4 bg-white rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Firmer, More Youthful Skin</h3>
          <p class="text-gray-600 text-sm">Enhanced collagen and elastin production</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-white rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Accelerated Healing</h3>
          <p class="text-gray-600 text-sm">Faster recovery and regeneration</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-white rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Calm, Balanced Complexion</h3>
          <p class="text-gray-600 text-sm">Reduced inflammation and irritation</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-white rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Support After Procedures</h3>
          <p class="text-gray-600 text-sm">Ideal for post-treatment recovery</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-white rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Long-Lasting Hydration</h3>
          <p class="text-gray-600 text-sm">Improved moisture retention</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-white rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Reduction in Wrinkles and Dullness</h3>
          <p class="text-gray-600 text-sm">Visible anti-aging benefits</p>
        </div>
      </div>
    </div>
    <p class="text-lg text-gray-700 mt-6 leading-relaxed">
      …then growth factor skincare is one of the most effective tools available. And in formulations like the <a href="/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">GENOSYS Bio-Ferment Age-Defying Powder Mask</a>, where growth factors are combined with fermented actives, botanicals, and hydration technology, their performance becomes even more powerful.
    </p>
  </div>

  <div class="cta-section bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-8 border border-primary-100 mb-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">Experience the Power of Growth Factors</h2>
    <p class="text-lg mb-6 text-gray-700 leading-relaxed">
      Discover the transformative benefits of growth factors with the <a href="/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">GENOSYS Bio-Ferment Age-Defying Powder Mask</a>. This professional-grade formulation combines six types of growth factors with fermented energy and botanical extracts for exceptional anti-aging and skin-repairing results.
    </p>
    <div class="flex flex-col sm:flex-row gap-4">
      <a href="/products/51" class="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center shadow-md hover:shadow-lg">
        View Product Details
      </a>
      <a href="mailto:sales@genosys.ae" class="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center border border-primary-600 shadow-md hover:shadow-lg">
        Contact Sales Team
      </a>
      <a href="https://wa.me/971585487665" target="_blank" rel="noopener noreferrer" class="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors text-center shadow-md hover:shadow-lg">
        WhatsApp Us
      </a>
    </div>
  </div>

  <div class="about-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">About GENOSYS</h2>
    <p class="text-lg text-gray-700 leading-relaxed">
      GENOSYS is a professional Korean dermacosmetics brand distributed by GENOSYS Middle East FZ-LLC in the UAE. All our products are certified by Dubai Municipality and are suitable for licensed practitioners and professional beauty clinics. We are the official distributor of DTS MG Co., Ltd. Korea, ensuring authentic and certified products.
    </p>
  </div>
</div>
    `.trim()

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (existingPost) {
      console.log(`Blog post with slug "${slug}" already exists. Updating instead...`)
      const updatedPost = await prisma.blogPost.update({
        where: { slug },
        data: {
          title,
          excerpt,
          content,
          featuredImage: null, // Will be added when images are shared
          authorName: 'GENOSYS Team',
          published: true,
          publishedAt: new Date(),
          tags: JSON.stringify(['Growth Factors', 'Anti-Aging', 'Professional Skincare', 'Korean Skincare', 'BIO-FERMENT', 'Skincare Science', 'Collagen', 'Elastin', 'Cellular Regeneration']),
        },
      })
      console.log('✅ Blog post updated successfully!')
      console.log('Post ID:', updatedPost.id)
      console.log('Slug:', updatedPost.slug)
      console.log('Title:', updatedPost.title)
      return
    }

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage: null, // Will be added when images are shared
        authorName: 'GENOSYS Team',
        published: true,
        publishedAt: new Date(),
        tags: JSON.stringify(['Growth Factors', 'Anti-Aging', 'Professional Skincare', 'Korean Skincare', 'BIO-FERMENT', 'Skincare Science', 'Collagen', 'Elastin', 'Cellular Regeneration']),
      },
    })

    console.log('✅ Blog post created successfully!')
    console.log('Post ID:', newPost.id)
    console.log('Slug:', newPost.slug)
    console.log('Title:', newPost.title)
  } catch (error) {
    console.error('❌ Error creating blog post:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createGrowthFactorsBlogPost()

