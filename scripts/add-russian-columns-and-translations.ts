import 'dotenv/config'
import { prisma } from '@/lib/prisma'

async function addRussianColumnsAndTranslations() {
  try {
    console.log('🔍 Step 1: Checking for Russian columns...')
    
    // Check if Russian columns exist
    let hasRussianColumns = false
    try {
      const columns = await prisma.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'blog_posts' 
        AND column_name IN ('titleRu', 'excerptRu', 'contentRu')
      `
      hasRussianColumns = columns.length === 3
      if (hasRussianColumns) {
        console.log('✅ Russian columns already exist')
      }
    } catch (error) {
      hasRussianColumns = false
    }
    
    // Add Russian columns if they don't exist
    if (!hasRussianColumns) {
      console.log('📝 Step 2: Adding Russian columns...')
      try {
        await prisma.$executeRaw`
          ALTER TABLE blog_posts 
          ADD COLUMN IF NOT EXISTS "titleRu" TEXT,
          ADD COLUMN IF NOT EXISTS "excerptRu" TEXT,
          ADD COLUMN IF NOT EXISTS "contentRu" TEXT
        `
        console.log('✅ Russian columns added successfully')
      } catch (error: any) {
        if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('owner')) {
          console.log('⚠️  Cannot add columns (permission denied)')
          console.log('   Please add them manually or via admin API: POST /api/admin/add-russian-blog-fields')
          console.log('   Or run: npx prisma db push')
          return
        } else {
          throw error
        }
      }
    }
    
    console.log('')
    console.log('📝 Step 3: Adding Russian translations to the multilingual announcement post...')
    
    const slug = 'genosys-website-now-available-in-3-languages'
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

    // Update the multilingual announcement post
    await prisma.$executeRaw`
      UPDATE blog_posts 
      SET 
        "titleRu" = ${titleRu},
        "excerptRu" = ${excerptRu},
        "contentRu" = ${contentRu},
        "updatedAt" = NOW()
      WHERE slug = ${slug}
    `
    
    console.log('✅ Russian translations added to multilingual announcement post')
    
    // Verify
    const post = await prisma.$queryRaw<Array<{ 
      title: string
      "titleRu": string | null
      published: boolean
    }>>`
      SELECT title, "titleRu", published 
      FROM blog_posts 
      WHERE slug = ${slug} 
      LIMIT 1
    `
    
    if (post.length > 0) {
      const p = post[0]
      console.log('')
      console.log('✅ Verification:')
      console.log(`   English: ${p.title}`)
      console.log(`   Russian: ${p.titleRu || 'Not set'}`)
      console.log(`   Published: ${p.published}`)
    }
    
    console.log('')
    console.log('📊 Summary:')
    const allPosts = await prisma.$queryRaw<Array<{ 
      slug: string
      title: string
      "titleRu": string | null
    }>>`
      SELECT slug, title, "titleRu"
      FROM blog_posts
      WHERE published = true
      ORDER BY "publishedAt" DESC
      LIMIT 10
    `
    
    console.log(`   Total published posts: ${allPosts.length}`)
    const withRussian = allPosts.filter(p => p.titleRu).length
    console.log(`   Posts with Russian translations: ${withRussian}`)
    console.log(`   Posts without Russian: ${allPosts.length - withRussian}`)
    
  } catch (error) {
    console.error('❌ Failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addRussianColumnsAndTranslations()
  .then(() => {
    console.log('\n✅ Done!')
    console.log('')
    console.log('🌐 Now refresh http://localhost:3000/ru/blog to see Russian posts!')
    process.exit(0)
  })
  .catch((e) => {
    console.error('\n💥 Fatal error:', e)
    process.exit(1)
  })






