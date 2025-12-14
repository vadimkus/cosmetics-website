import { PrismaClient } from '@prisma/client'
import { debugLog, errorLog } from '@/lib/logger'

// Initialize Prisma client with proper configuration
const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL or PRISMA_DATABASE_URL environment variable is required')
}

let prisma: PrismaClient

// Check if it's a Prisma Accelerate URL
const isAccelerateUrl = databaseUrl.startsWith('prisma+postgres://accelerate.prisma-data.net')

if (isAccelerateUrl) {
  console.log('🚀 Initializing Prisma Client with Accelerate URL')
  prisma = new PrismaClient({
    accelerateUrl: databaseUrl,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  })
} else {
  console.log('📦 Initializing Prisma Client with PostgreSQL adapter')
  try {
    const { PrismaPg } = require('@prisma/adapter-pg')
    const { Pool } = require('pg')
    const pool = new Pool({ connectionString: databaseUrl })
    const adapter = new PrismaPg(pool)
    prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
    })
  } catch (error) {
    console.error('❌ Failed to initialize Prisma client with adapter:', error)
    throw error
  }
}

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
    titleRu: 'Маска BIO-FERMENT AGE DEFYING POWDER — продвинутая антивозрастная защита с факторами роста и ферментированной энергией',
    excerptRu: 'Откройте силу ферментации в новой маске GENOSYS, которая сочетает факторы роста и ферментированную энергию для продвинутой антивозрастной защиты.',
    contentRu: `<div class="blog-content">
  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      С гордостью представляем новую маску BIO-FERMENT AGE DEFYING POWDER — революционный продукт, который сочетает силу факторов роста и ферментированную энергию для продвинутой антивозрастной защиты.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">Основные компоненты</h3>
    <ul class="list-disc list-inside space-y-3 text-gray-700 text-lg">
      <li>Продвинутые факторы роста</li>
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

async function translateBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { id: true, slug: true, title: true, titleRu: true }
    })

    console.log(`Found ${posts.length} published blog posts`)

    for (const post of posts) {
      const translation = blogTranslations[post.slug]
      
      if (!translation) {
        console.log(`⚠️  No translation found for post: ${post.slug} (${post.title})`)
        // For posts without manual translations, we'll use AI translation
        // But for now, just skip them
        continue
      }

      // Skip if already translated
      if (post.titleRu) {
        console.log(`⏭️  Already translated: ${post.title}`)
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
        console.log(`✅ Translated: ${post.title}`)
      } catch (error) {
        console.error(`❌ Failed to translate post ${post.slug}:`, error)
      }
    }

    console.log('✅ Blog posts translation completed!')
  } catch (error) {
    console.error('❌ Failed to translate blog posts:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

translateBlogPosts()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })




































