import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { errorLog, debugLog, infoLog, warnLog } from '@/lib/logger'

// Russian translations for blog posts
const blogTranslations: Record<string, {
  titleRu: string
  excerptRu: string
  contentRu: string
}> = {
  'black-friday-sale-20-off': {
    titleRu: '✨ Черная пятница — скидка 20% ✨',
    excerptRu: 'В этом году мы предлагаем вам что-то особенное. Скидка 20% на все продукты GENOSYS, эксклюзивно для онлайн-покупок.',
    contentRu: `<div class="blog-content">
  <div class="intro-section bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6 md:p-8 mb-8">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">✨ Черная пятница — скидка 20% ✨</h2>
    <p class="text-xl md:text-2xl text-gray-700 font-semibold text-center mb-2">26 ноября — 29 ноября</p>
  </div>

  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      В этом году мы предлагаем вам что-то особенное.
    </p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 font-semibold">
      Скидка 20% на все продукты GENOSYS, эксклюзивно для онлайн-покупок.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">🛒 Как получить скидку:</h3>
    <ul class="list-disc list-inside space-y-3 text-gray-700 text-lg">
      <li>Закажите напрямую через наш официальный сайт (ссылка в биографии)</li>
      <li>Или разместите заказ через прямое сообщение в Instagram</li>
    </ul>
    <p class="text-lg text-gray-700 mt-4">
      Нет промокодов. Нет минимальной суммы заказа.
    </p>
    <p class="text-lg text-gray-700 mt-2 font-semibold">
      Только премиальные профессиональные средства по уходу за кожей — теперь с редким предложением Черной пятницы.
    </p>
  </div>

  <div class="feature-section mb-8 text-center">
    <img 
      src="/blog/friday.jpeg" 
      alt="Черная пятница - скидка 20% на все продукты GENOSYS" 
      class="rounded-xl shadow-lg mx-auto max-w-full h-auto"
    />
  </div>

  <div class="cta-section bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl p-6 md:p-8 text-center">
    <p class="text-lg md:text-xl font-bold mb-2">💥 Действительно только для онлайн-покупок.</p>
    <p class="text-base md:text-lg">
      Не упустите — наше самое большое годовое предложение заканчивается 29 ноября.
    </p>
  </div>
</div>`
  },
  'what-are-growth-factors-in-skincare': {
    titleRu: 'Что такое факторы роста в уходе за кожей — и почему ваша кожа их любит',
    excerptRu: 'Узнайте, как работают факторы роста в продуктах по уходу за кожей и почему они являются мощными компонентами против старения.',
    contentRu: `<div class="blog-content">
  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      Факторы роста — это естественные белки, которые играют жизненно важную роль в восстановлении и обновлении клеток кожи. В продуктах по уходу за кожей эти мощные факторы помогают стимулировать выработку коллагена, улучшать эластичность кожи и уменьшать признаки старения.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">Как работают факторы роста</h3>
    <p class="text-lg text-gray-700 mb-4">
      При местном применении факторы роста работают следующим образом:
    </p>
    <ul class="list-disc list-inside space-y-3 text-gray-700 text-lg">
      <li>Стимулируют выработку коллагена и эластина</li>
      <li>Улучшают регенерацию клеток</li>
      <li>Повышают текстуру и эластичность кожи</li>
      <li>Уменьшают тонкие линии и морщины</li>
    </ul>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">Почему они важны</h3>
    <p class="text-lg text-gray-700 leading-relaxed">
      С возрастом уровень естественных факторов роста в нашей коже снижается. Добавляя продукты с факторами роста в наш режим ухода за кожей, мы можем помочь восстановить эти уровни и улучшить общее здоровье кожи.
    </p>
  </div>
</div>`
  },
  'genosys-skin-reboot-pdrn-mask-pack-launch': {
    titleRu: 'Укрепление кожного барьера и эффект лифтинга — маска GENOSYS Skin Reboot PDRN',
    excerptRu: 'Откройте силу PDRN в новой маске GENOSYS, которая укрепляет кожный барьер и обеспечивает заметный эффект лифтинга.',
    contentRu: `<div class="blog-content">
  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      С гордостью представляем новую маску GENOSYS Skin Reboot PDRN — революционный продукт, который сочетает силу PDRN (полидезоксирибонуклеотидной кислоты) с передовыми технологиями ухода за кожей.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">Основные преимущества</h3>
    <ul class="list-disc list-inside space-y-3 text-gray-700 text-lg">
      <li>Укрепление естественного кожного барьера</li>
      <li>Заметный эффект лифтинга</li>
      <li>Глубокое и интенсивное увлажнение</li>
      <li>Улучшение эластичности кожи</li>
      <li>Уменьшение признаков старения</li>
    </ul>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">Как использовать</h3>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      Для достижения наилучших результатов используйте маску 2-3 раза в неделю. Нанесите равномерный слой на очищенное лицо и оставьте на 15-20 минут перед смыванием.
    </p>
  </div>
</div>`
  },
  '2025-genosys-new-products-bio-meso-pdrn-ampoule-mask-pack': {
    titleRu: 'Новый продукт GENOSYS 2025 — ампула BIO-MESO PDRN',
    excerptRu: 'Откройте для себя новый инновационный продукт GENOSYS — ампулу BIO-MESO PDRN, разработанную для обновления кожи и усиления сияния.',
    contentRu: `<div class="blog-content">
  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      С гордостью представляем новый продукт GENOSYS на 2025 год — ампулу BIO-MESO PDRN. Этот инновационный продукт сочетает в себе новейшие корейские технологии ухода за кожей с мощными компонентами PDRN.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">Основные особенности</h3>
    <ul class="list-disc list-inside space-y-3 text-gray-700 text-lg">
      <li>Высокая концентрация PDRN</li>
      <li>Глубокое обновление кожи</li>
      <li>Улучшение сияния и свежести</li>
      <li>Уменьшение тонких линий и морщин</li>
      <li>Подходит для всех типов кожи</li>
    </ul>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">Рекомендуемое использование</h3>
    <p class="text-lg text-gray-700 leading-relaxed">
      Используйте ампулу после очищения и перед увлажняющим кремом. Нанесите несколько капель на лицо и шею и аккуратно помассируйте до полного впитывания.
    </p>
  </div>
</div>`
  },
  'bio-ferment-age-defying-powder-mask-launch': {
    titleRu: 'BIO-FERMENT AGE DEFYING POWDER MASK — антивозрастная пудровая маска с факторами роста',
    excerptRu: 'Пудровая маска GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK сочетает ферментированные компоненты и факторы роста, чтобы успокаивать кожу, питать её и поддерживать восстановление после стресса.',
    contentRu: `<div class="blog-content">
  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      Представляем BIO-FERMENT AGE DEFYING POWDER MASK — пудровую маску с ферментированными компонентами и факторами роста для профессионального антивозрастного ухода.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">Основные компоненты</h3>
    <ul class="list-disc list-inside space-y-3 text-gray-700 text-lg">
      <li>Факторы роста</li>
      <li>Мощные ферментированные компоненты</li>
      <li>Натуральные экстракты</li>
      <li>Витамины и минералы</li>
    </ul>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">Преимущества</h3>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      Эта уникальная маска обеспечивает:
    </p>
    <ul class="list-disc list-inside space-y-3 text-gray-700 text-lg">
      <li>Продвинутую антивозрастную защиту</li>
      <li>Улучшение эластичности кожи</li>
      <li>Уменьшение тонких линий и морщин</li>
      <li>Мгновенное сияние и свежесть</li>
      <li>Глубокое увлажнение</li>
    </ul>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">Как использовать</h3>
    <p class="text-lg text-gray-700 leading-relaxed">
      Смешайте порошок с водой или вашим любимым сывороткой, чтобы создать гладкую пасту. Нанесите на очищенное лицо и оставьте на 15-20 минут перед смыванием теплой водой.
    </p>
  </div>
</div>`
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const auth = await requireAdminAuth(request)
    if (!auth.authorized) {
      return auth.response
    }

    // Parse query parameters and body
    const { searchParams } = new URL(request.url)
    const force = searchParams.get('force') === 'true'
    const slugParam = searchParams.get('slug')
    
    let body: { force?: boolean; slug?: string } | null = null
    try {
      body = await request.json().catch(() => null)
    } catch {
      // Body is optional
    }

    const forceUpdate = force || body?.force === true
    const targetSlug = slugParam || body?.slug || null

    debugLog(`🔍 Fetching published blog posts...`)
    if (targetSlug) {
      debugLog(`   Targeting specific slug: ${targetSlug}`)
    }
    if (forceUpdate) {
      debugLog(`   Force update enabled: will update even if already translated`)
    }
    
    const whereClause: { published: boolean; slug?: string } = { published: true }
    if (targetSlug) {
      whereClause.slug = targetSlug
    }
    
    const posts = await prisma.blogPost.findMany({
      where: whereClause,
      select: { 
        id: true, 
        slug: true, 
        title: true,
        titleRu: true,
        excerpt: true,
        excerptRu: true,
        content: true,
        contentRu: true
      }
    })

    infoLog(`📝 Found ${posts.length} published blog post(s)\n`)

    const results = {
      translated: 0,
      skipped: 0,
      missing: 0,
      errors: [] as string[]
    }

    for (const post of posts) {
      const translation = blogTranslations[post.slug]
      
      if (!translation) {
        warnLog(`⚠️  No translation found for: ${post.slug} (${post.title})`)
        results.missing++
        continue
      }

      // Skip if already translated (unless force update is enabled)
      if (!forceUpdate && post.titleRu && post.excerptRu && post.contentRu) {
        debugLog(`⏭️  Already translated: ${post.title} (use ?force=true to override)`)
        results.skipped++
        continue
      }

      try {
        await prisma.blogPost.update({
          where: { id: post.id },
          data: {
            titleRu: translation.titleRu,
            excerptRu: translation.excerptRu,
            contentRu: translation.contentRu,
          }
        })
        const action = forceUpdate && post.titleRu ? 'Updated' : 'Translated'
        infoLog(`✅ ${action}: ${post.title}`)
        results.translated++
      } catch (error) {
        const errorMsg = `Failed to translate post ${post.slug}: ${error instanceof Error ? error.message : String(error)}`
        errorLog(`❌ ${errorMsg}`)
        results.errors.push(errorMsg)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Blog posts translation completed',
      results,
      forceUpdate,
      targetSlug: targetSlug || 'all'
    })
  } catch (error) {
    errorLog('Failed to translate blog posts:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

