import 'dotenv/config'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

async function createMultilingualAnnouncementBlogPost() {
  try {
    const slug = 'genosys-website-now-available-in-3-languages'
    
    // English content
    const title = '🌍 GENOSYS Website Now Available in 3 Languages!'
    const excerpt = 'We\'re thrilled to announce that our website is now available in English, Arabic, and Russian! Join our diverse community of customers from around the world.'
    const content = `<div class="blog-content">
  <div class="intro-section bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 rounded-xl p-6 md:p-8 mb-8">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">🌍 GENOSYS Website Now Available in 3 Languages!</h2>
    <p class="text-xl md:text-2xl text-gray-700 font-semibold text-center mb-2">English • العربية • Русский</p>
  </div>

  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      We're absolutely thrilled to announce a major milestone for GENOSYS Middle East! Our website is now available in <strong class="text-primary-600">three beautiful languages</strong>: English, Arabic, and Russian.
    </p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      This isn't just about translation—it's about <strong class="text-primary-600">connecting with our amazing community</strong> of customers from diverse cultures and backgrounds across the UAE and beyond.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">✨ What This Means for You</h3>
    <ul class="list-disc list-inside space-y-3 text-gray-700 text-lg mb-6">
      <li><strong>Shop in your preferred language</strong> – Browse our premium Korean dermacosmetics collection in English, Arabic, or Russian</li>
      <li><strong>Seamless experience</strong> – All product descriptions, checkout, and customer support available in your language</li>
      <li><strong>Cultural inclusivity</strong> – We celebrate the diversity of our customers and want everyone to feel at home</li>
      <li><strong>Better understanding</strong> – Read about our products, ingredients, and skincare routines in the language you're most comfortable with</li>
    </ul>
  </div>

  <div class="feature-section mb-8 text-center">
    <img 
      src="/images/genosys-products.jpg" 
      alt="GENOSYS Professional Korean Dermacosmetics Products" 
      class="rounded-xl shadow-lg mx-auto max-w-full h-auto mb-4"
    />
    <p class="text-sm text-gray-600 italic">Our premium products, now accessible in your language</p>
  </div>

  <div class="feature-section mb-8 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 md:p-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">🌎 Our Global Community</h3>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
      The UAE is a beautiful melting pot of cultures, and we're honored to serve customers from all walks of life. Whether you're:
    </p>
    <ul class="list-disc list-inside space-y-2 text-gray-700 text-lg mb-4">
      <li>A local Emirati customer exploring premium skincare</li>
      <li>An expat from Russia, Europe, or Asia looking for professional-grade products</li>
      <li>A skincare professional seeking the best Korean dermacosmetics</li>
      <li>Someone passionate about self-care and beauty routines</li>
    </ul>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed font-semibold">
      We're here for you, in your language! 🎉
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">🚀 How to Switch Languages</h3>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      Switching languages is super easy! Look for the language switcher in the top navigation bar:
    </p>
    <ul class="list-disc list-inside space-y-2 text-gray-700 text-lg mb-4">
      <li><strong>EN</strong> for English</li>
      <li><strong>AR</strong> for العربية (Arabic)</li>
      <li><strong>RU</strong> for Русский (Russian)</li>
    </ul>
    <p class="text-lg text-gray-700 leading-relaxed">
      Your language preference will be saved, so you'll always see the site in your chosen language when you return!
    </p>
  </div>

  <div class="feature-section mb-8 text-center">
    <img 
      src="/images/genosys-logo.png" 
      alt="GENOSYS Logo - Professional Korean Dermacosmetics" 
      class="rounded-xl shadow-lg mx-auto max-w-xs h-auto mb-4"
    />
  </div>

  <div class="cta-section bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-xl p-6 md:p-8 text-center">
    <p class="text-lg md:text-xl font-bold mb-2">💫 Ready to Explore?</p>
    <p class="text-base md:text-lg mb-4">
      Browse our complete collection of professional Korean dermacosmetics in your preferred language. From microneedling devices to serums, creams, and masks—everything you need for radiant, healthy skin.
    </p>
    <p class="text-base md:text-lg font-semibold">
      Free shipping on orders over 1,000 AED across all UAE emirates! 🚚✨
    </p>
  </div>

  <div class="feature-section mt-8 text-center">
    <p class="text-lg text-gray-600 italic">
      Thank you for being part of our diverse, beautiful community. We're excited to serve you better, in your language! 🌟
    </p>
    <p class="text-base text-gray-500 mt-4">
      — The GENOSYS Middle East Team
    </p>
  </div>
</div>`

    // Arabic content
    const titleAr = '🌍 موقع GENOSYS متاح الآن بثلاث لغات!'
    const excerptAr = 'يسرنا أن نعلن أن موقعنا الإلكتروني متاح الآن باللغة الإنجليزية والعربية والروسية! انضم إلى مجتمعنا المتنوع من العملاء من جميع أنحاء العالم.'
    const contentAr = `<div class="blog-content" dir="rtl">
  <div class="intro-section bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 rounded-xl p-6 md:p-8 mb-8">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">🌍 موقع GENOSYS متاح الآن بثلاث لغات!</h2>
    <p class="text-xl md:text-2xl text-gray-700 font-semibold text-center mb-2">English • العربية • Русский</p>
  </div>

  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      يسعدنا أن نعلن عن معلم رئيسي لـ GENOSYS الشرق الأوسط! موقعنا الإلكتروني متاح الآن بثلاث لغات جميلة: الإنجليزية والعربية والروسية.
    </p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      هذا ليس مجرد ترجمة—بل يتعلق بالتواصل مع مجتمعنا الرائع من العملاء من ثقافات وخلفيات متنوعة في جميع أنحاء الإمارات العربية المتحدة وما بعدها.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">✨ ماذا يعني هذا لك</h3>
    <ul class="list-disc list-inside space-y-3 text-gray-700 text-lg mb-6">
      <li><strong>تسوق بلغتك المفضلة</strong> – تصفح مجموعتنا من مستحضرات التجميل الكورية الفاخرة بالإنجليزية أو العربية أو الروسية</li>
      <li><strong>تجربة سلسة</strong> – جميع أوصاف المنتجات والدفع ودعم العملاء متاحة بلغتك</li>
      <li><strong>الشمولية الثقافية</strong> – نحتفل بتنوع عملائنا ونريد أن يشعر الجميع بالراحة</li>
      <li><strong>فهم أفضل</strong> – اقرأ عن منتجاتنا ومكوناتنا وروتينات العناية بالبشرة باللغة التي تشعر بالراحة معها</li>
    </ul>
  </div>

  <div class="feature-section mb-8 text-center">
    <img 
      src="/images/genosys-products.jpg" 
      alt="منتجات GENOSYS المهنية الكورية" 
      class="rounded-xl shadow-lg mx-auto max-w-full h-auto mb-4"
    />
    <p class="text-sm text-gray-600 italic">منتجاتنا الفاخرة، متاحة الآن بلغتك</p>
  </div>

  <div class="feature-section mb-8 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 md:p-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">🌎 مجتمعنا العالمي</h3>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
      الإمارات العربية المتحدة هي بوتقة انصهار جميلة للثقافات، ونحن فخورون بخدمة العملاء من جميع مناحي الحياة. سواء كنت:
    </p>
    <ul class="list-disc list-inside space-y-2 text-gray-700 text-lg mb-4">
      <li>عميل إماراتي محلي يستكشف العناية بالبشرة الفاخرة</li>
      <li>مقيم من روسيا أو أوروبا أو آسيا يبحث عن منتجات احترافية</li>
      <li>أخصائي عناية بالبشرة يبحث عن أفضل مستحضرات التجميل الكورية</li>
      <li>شخص شغوف بروتينات العناية الذاتية والجمال</li>
    </ul>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed font-semibold">
      نحن هنا من أجلك، بلغتك! 🎉
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">🚀 كيفية تغيير اللغة</h3>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      تغيير اللغة سهل للغاية! ابحث عن محول اللغة في شريط التنقل العلوي:
    </p>
    <ul class="list-disc list-inside space-y-2 text-gray-700 text-lg mb-4">
      <li><strong>EN</strong> للإنجليزية</li>
      <li><strong>AR</strong> للعربية</li>
      <li><strong>RU</strong> للروسية</li>
    </ul>
    <p class="text-lg text-gray-700 leading-relaxed">
      سيتم حفظ تفضيل اللغة الخاص بك، لذا سترى الموقع دائمًا باللغة التي اخترتها عند العودة!
    </p>
  </div>

  <div class="feature-section mb-8 text-center">
    <img 
      src="/images/genosys-logo.png" 
      alt="شعار GENOSYS - مستحضرات التجميل الكورية المهنية" 
      class="rounded-xl shadow-lg mx-auto max-w-xs h-auto mb-4"
    />
  </div>

  <div class="cta-section bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-xl p-6 md:p-8 text-center">
    <p class="text-lg md:text-xl font-bold mb-2">💫 مستعد للاستكشاف؟</p>
    <p class="text-base md:text-lg mb-4">
      تصفح مجموعتنا الكاملة من مستحضرات التجميل الكورية المهنية بلغتك المفضلة. من أجهزة الميكرونيدلينغ إلى السيرومات والكريمات والأقنعة—كل ما تحتاجه لبشرة مشرقة وصحية.
    </p>
    <p class="text-base md:text-lg font-semibold">
      شحن مجاني للطلبات التي تزيد عن 1000 درهم في جميع إمارات الإمارات! 🚚✨
    </p>
  </div>

  <div class="feature-section mt-8 text-center">
    <p class="text-lg text-gray-600 italic">
      شكرًا لكونك جزءًا من مجتمعنا المتنوع والجميل. نحن متحمسون لخدمتك بشكل أفضل، بلغتك! 🌟
    </p>
    <p class="text-base text-gray-500 mt-4">
      — فريق GENOSYS الشرق الأوسط
    </p>
  </div>
</div>`

    // Russian content
    const titleRu = '🌍 Сайт GENOSYS теперь доступен на 3 языках!'
    const excerptRu = 'Мы рады сообщить, что наш сайт теперь доступен на английском, арабском и русском языках! Присоединяйтесь к нашему разнообразному сообществу клиентов со всего мира.'
    const contentRu = `<div class="blog-content">
  <div class="intro-section bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 rounded-xl p-6 md:p-8 mb-8">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">🌍 Сайт GENOSYS теперь доступен на 3 языках!</h2>
    <p class="text-xl md:text-2xl text-gray-700 font-semibold text-center mb-2">English • العربية • Русский</p>
  </div>

  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      Мы невероятно рады объявить о важной вехе для GENOSYS Middle East! Наш сайт теперь доступен на <strong class="text-primary-600">трех прекрасных языках</strong>: английском, арабском и русском.
    </p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      Это не просто перевод—это <strong class="text-primary-600">связь с нашим удивительным сообществом</strong> клиентов из разных культур и стран ОАЭ и не только.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">✨ Что это значит для вас</h3>
    <ul class="list-disc list-inside space-y-3 text-gray-700 text-lg mb-6">
      <li><strong>Покупайте на предпочитаемом языке</strong> – Просматривайте нашу коллекцию премиальной корейской дерматокосметики на английском, арабском или русском</li>
      <li><strong>Беспрепятственный опыт</strong> – Все описания продуктов, оформление заказа и поддержка клиентов доступны на вашем языке</li>
      <li><strong>Культурная инклюзивность</strong> – Мы ценим разнообразие наших клиентов и хотим, чтобы каждый чувствовал себя как дома</li>
      <li><strong>Лучшее понимание</strong> – Читайте о наших продуктах, ингредиентах и процедурах по уходу за кожей на языке, с которым вам наиболее комфортно</li>
    </ul>
  </div>

  <div class="feature-section mb-8 text-center">
    <img 
      src="/images/genosys-products.jpg" 
      alt="Профессиональные корейские дерматокосметические продукты GENOSYS" 
      class="rounded-xl shadow-lg mx-auto max-w-full h-auto mb-4"
    />
    <p class="text-sm text-gray-600 italic">Наши премиальные продукты, теперь доступны на вашем языке</p>
  </div>

  <div class="feature-section mb-8 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6 md:p-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">🌎 Наше глобальное сообщество</h3>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
      ОАЭ — это прекрасный плавильный котел культур, и мы гордимся тем, что обслуживаем клиентов из всех слоев общества. Независимо от того, являетесь ли вы:
    </p>
    <ul class="list-disc list-inside space-y-2 text-gray-700 text-lg mb-4">
      <li>Местным клиентом из ОАЭ, изучающим премиальный уход за кожей</li>
      <li>Экспатом из России, Европы или Азии, ищущим профессиональные продукты</li>
      <li>Специалистом по уходу за кожей, ищущим лучшую корейскую дерматокосметику</li>
      <li>Человеком, увлеченным уходом за собой и красотой</li>
    </ul>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed font-semibold">
      Мы здесь для вас, на вашем языке! 🎉
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">🚀 Как переключить язык</h3>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      Переключение языка очень простое! Найдите переключатель языка в верхней панели навигации:
    </p>
    <ul class="list-disc list-inside space-y-2 text-gray-700 text-lg mb-4">
      <li><strong>EN</strong> для английского</li>
      <li><strong>AR</strong> для العربية (арабского)</li>
      <li><strong>RU</strong> для Русский (русского)</li>
    </ul>
    <p class="text-lg text-gray-700 leading-relaxed">
      Ваши языковые предпочтения будут сохранены, поэтому вы всегда будете видеть сайт на выбранном языке при возвращении!
    </p>
  </div>

  <div class="feature-section mb-8 text-center">
    <img 
      src="/images/genosys-logo.png" 
      alt="Логотип GENOSYS - Профессиональная корейская дерматокосметика" 
      class="rounded-xl shadow-lg mx-auto max-w-xs h-auto mb-4"
    />
  </div>

  <div class="cta-section bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-xl p-6 md:p-8 text-center">
    <p class="text-lg md:text-xl font-bold mb-2">💫 Готовы исследовать?</p>
    <p class="text-base md:text-lg mb-4">
      Просмотрите нашу полную коллекцию профессиональной корейской дерматокосметики на предпочитаемом языке. От устройств для микронидлинга до сывороток, кремов и масок—все, что вам нужно для сияющей, здоровой кожи.
    </p>
    <p class="text-base md:text-lg font-semibold">
      Бесплатная доставка для заказов свыше 1000 дирхамов по всем эмиратам ОАЭ! 🚚✨
    </p>
  </div>

  <div class="feature-section mt-8 text-center">
    <p class="text-lg text-gray-600 italic">
      Спасибо за то, что вы часть нашего разнообразного, прекрасного сообщества. Мы рады служить вам лучше, на вашем языке! 🌟
    </p>
    <p class="text-base text-gray-500 mt-4">
      — Команда GENOSYS Middle East
    </p>
  </div>
</div>`

    const featuredImage = '/images/genosys-products.jpg'
    const authorName = 'GENOSYS Team'
    const published = true
    const publishedAt = new Date()
    const tags = JSON.stringify(['announcement', 'multilingual', 'website-update', 'community', 'languages'])
    const id = `cl${randomBytes(12).toString('hex')}` // Generate a CUID-like ID

    // Check if post exists using raw SQL
    const existingPost = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM blog_posts WHERE slug = ${slug} LIMIT 1
    `

    // First, check if translation columns exist
    let hasTranslationColumns = false
    try {
      const columns = await prisma.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'blog_posts' 
        AND column_name IN ('titleAr', 'excerptAr', 'contentAr', 'titleRu', 'excerptRu', 'contentRu')
      `
      hasTranslationColumns = columns.length === 6
      if (hasTranslationColumns) {
        console.log('✅ Translation columns found in database')
      } else {
        console.log('📝 Translation columns not found, will create post with English only')
      }
    } catch (error) {
      console.log('📝 Could not check for translation columns, will create post with English only')
    }

    if (existingPost.length > 0) {
      console.log('Blog post already exists, updating...')
      
      if (hasTranslationColumns) {
        await prisma.$executeRaw`
          UPDATE blog_posts 
          SET 
            title = ${title},
            excerpt = ${excerpt},
            content = ${content},
            "featuredImage" = ${featuredImage},
            "authorName" = ${authorName},
            published = ${published},
            "publishedAt" = ${publishedAt},
            tags = ${tags},
            "titleAr" = ${titleAr},
            "excerptAr" = ${excerptAr},
            "contentAr" = ${contentAr},
            "titleRu" = ${titleRu},
            "excerptRu" = ${excerptRu},
            "contentRu" = ${contentRu},
            "updatedAt" = NOW()
          WHERE slug = ${slug}
        `
        console.log('✅ Blog post updated successfully with all translations!')
      } else {
        await prisma.$executeRaw`
          UPDATE blog_posts 
          SET 
            title = ${title},
            excerpt = ${excerpt},
            content = ${content},
            "featuredImage" = ${featuredImage},
            "authorName" = ${authorName},
            published = ${published},
            "publishedAt" = ${publishedAt},
            tags = ${tags},
            "updatedAt" = NOW()
          WHERE slug = ${slug}
        `
        console.log('✅ Blog post updated successfully (English only)')
        console.log('📝 Note: To add translations, sync database schema first')
      }
    } else {
      console.log('Creating new blog post...')
      
      if (hasTranslationColumns) {
        await prisma.$executeRaw`
          INSERT INTO blog_posts (
            id, title, slug, excerpt, content, "featuredImage", "authorName", 
            published, "publishedAt", tags, views, "createdAt", "updatedAt",
            "titleAr", "excerptAr", "contentAr", "titleRu", "excerptRu", "contentRu"
          ) VALUES (
            ${id}, ${title}, ${slug}, ${excerpt}, ${content}, ${featuredImage}, ${authorName},
            ${published}, ${publishedAt}, ${tags}, 0, NOW(), NOW(),
            ${titleAr}, ${excerptAr}, ${contentAr}, ${titleRu}, ${excerptRu}, ${contentRu}
          )
        `
        console.log('✅ Blog post created successfully with all translations!')
      } else {
        await prisma.$executeRaw`
          INSERT INTO blog_posts (
            id, title, slug, excerpt, content, "featuredImage", "authorName", 
            published, "publishedAt", tags, views, "createdAt", "updatedAt"
          ) VALUES (
            ${id}, ${title}, ${slug}, ${excerpt}, ${content}, ${featuredImage}, ${authorName},
            ${published}, ${publishedAt}, ${tags}, 0, NOW(), NOW()
          )
        `
        console.log('✅ Blog post created successfully (English only)')
        console.log('📝 Note: To add translations, sync database schema first')
      }
    }

    // Verify the post was created/updated
    const verifyPost = await prisma.$queryRaw<Array<{ id: string; title: string; slug: string; published: boolean }>>`
      SELECT id, title, slug, published FROM blog_posts WHERE slug = ${slug} LIMIT 1
    `
    
    if (verifyPost.length > 0) {
      const post = verifyPost[0]
      console.log('')
      console.log('✅ Verification successful!')
      console.log(`   ID: ${post.id}`)
      console.log(`   Slug: ${post.slug}`)
      console.log(`   Title: ${post.title}`)
      console.log(`   Published: ${post.published}`)
      console.log('')
      console.log('🎉 Blog post is now live!')
      console.log(`   View at: /blog/${slug}`)
    } else {
      console.error('⚠️ Warning: Post was not found after creation/update')
    }
    
  } catch (error) {
    console.error('❌ Failed to create blog post:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createMultilingualAnnouncementBlogPost()
  .then(() => console.log('\n✅ Done!'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

