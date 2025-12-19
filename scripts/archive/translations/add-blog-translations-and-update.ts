import 'dotenv/config'
import { prisma } from '@/lib/prisma'

async function addTranslationsAndUpdatePost() {
  try {
    const slug = 'genosys-website-now-available-in-3-languages'
    
    console.log('🔍 Checking for translation columns...')
    
    // Check if Arabic columns exist
    let hasArabicColumns = false
    try {
      const arabicCols = await prisma.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'blog_posts' 
        AND column_name IN ('titleAr', 'excerptAr', 'contentAr')
      `
      hasArabicColumns = arabicCols.length === 3
    } catch (error) {
      hasArabicColumns = false
    }
    
    // Check if Russian columns exist
    let hasRussianColumns = false
    try {
      const russianCols = await prisma.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'blog_posts' 
        AND column_name IN ('titleRu', 'excerptRu', 'contentRu')
      `
      hasRussianColumns = russianCols.length === 3
    } catch (error) {
      hasRussianColumns = false
    }
    
    // Add Arabic columns if they don't exist
    if (!hasArabicColumns) {
      console.log('📝 Adding Arabic translation columns...')
      await prisma.$executeRaw`
        ALTER TABLE blog_posts 
        ADD COLUMN IF NOT EXISTS "titleAr" TEXT,
        ADD COLUMN IF NOT EXISTS "excerptAr" TEXT,
        ADD COLUMN IF NOT EXISTS "contentAr" TEXT
      `
      console.log('✅ Arabic columns added')
    } else {
      console.log('✅ Arabic columns already exist')
    }
    
    // Add Russian columns if they don't exist
    if (!hasRussianColumns) {
      console.log('📝 Adding Russian translation columns...')
      try {
        await prisma.$executeRaw`
          ALTER TABLE blog_posts 
          ADD COLUMN IF NOT EXISTS "titleRu" TEXT,
          ADD COLUMN IF NOT EXISTS "excerptRu" TEXT,
          ADD COLUMN IF NOT EXISTS "contentRu" TEXT
        `
        console.log('✅ Russian columns added')
      } catch (error: any) {
        if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('owner')) {
          console.log('⚠️  Cannot add Russian columns (permission denied)')
          console.log('   The columns may need to be added manually via database admin')
          console.log('   Continuing to update Arabic translations only...')
        } else {
          throw error
        }
      }
    } else {
      console.log('✅ Russian columns already exist')
    }
    
    // Re-check Russian columns after attempt
    try {
      const russianColsCheck = await prisma.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'blog_posts' 
        AND column_name IN ('titleRu', 'excerptRu', 'contentRu')
      `
      hasRussianColumns = russianColsCheck.length === 3
    } catch (error) {
      hasRussianColumns = false
    }
    
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

    console.log('')
    console.log('📝 Updating blog post with translations...')
    
    // Update the blog post with translations (only update columns that exist)
    if (hasRussianColumns) {
      await prisma.$executeRaw`
        UPDATE blog_posts 
        SET 
          "titleAr" = ${titleAr},
          "excerptAr" = ${excerptAr},
          "contentAr" = ${contentAr},
          "titleRu" = ${titleRu},
          "excerptRu" = ${excerptRu},
          "contentRu" = ${contentRu},
          "updatedAt" = NOW()
        WHERE slug = ${slug}
      `
      console.log('✅ Blog post updated with Arabic and Russian translations!')
    } else {
      await prisma.$executeRaw`
        UPDATE blog_posts 
        SET 
          "titleAr" = ${titleAr},
          "excerptAr" = ${excerptAr},
          "contentAr" = ${contentAr},
          "updatedAt" = NOW()
        WHERE slug = ${slug}
      `
      console.log('✅ Blog post updated with Arabic translations!')
      console.log('⚠️  Russian translations not added (columns do not exist)')
    }
    
    // Verify
    const post = await prisma.$queryRaw<Array<{ 
      title: string
      "titleAr": string | null
      "titleRu": string | null
      published: boolean
    }>>`
      SELECT title, "titleAr", ${hasRussianColumns ? '"titleRu"' : 'NULL as "titleRu"'}, published 
      FROM blog_posts 
      WHERE slug = ${slug} 
      LIMIT 1
    `
    
    if (post.length > 0) {
      const p = post[0]
      console.log('')
      console.log('✅ Verification:')
      console.log(`   English: ${p.title}`)
      console.log(`   Arabic: ${p.titleAr ? '✅ Set' : '❌ Not set'}`)
      console.log(`   Russian: ${p.titleRu ? '✅ Set' : '❌ Not set (columns missing)'}`)
      console.log(`   Published: ${p.published}`)
      console.log('')
      if (hasRussianColumns) {
        console.log('🎉 Blog post now has all three language versions!')
      } else {
        console.log('🎉 Blog post updated with Arabic translations!')
        console.log('📝 To add Russian translations, add columns via database admin or Prisma migrate')
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to add translations:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addTranslationsAndUpdatePost()
  .then(() => {
    console.log('\n✅ Done!')
    process.exit(0)
  })
  .catch((e) => {
    console.error('\n💥 Fatal error:', e)
    process.exit(1)
  })

