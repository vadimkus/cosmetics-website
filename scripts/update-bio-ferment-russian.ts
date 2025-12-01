/**
 * Script to update the Russian translation for the bio-ferment-age-defying-powder-mask-launch blog post
 */

import { prisma } from '../lib/prisma'

const slug = 'bio-ferment-age-defying-powder-mask-launch'

const translation = {
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

async function updateBioFermentRussian() {
  try {
    console.log(`🔍 Looking for blog post with slug: ${slug}`)
    
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { 
        id: true, 
        slug: true, 
        title: true,
        titleRu: true,
        excerptRu: true,
        contentRu: true
      }
    })

    if (!post) {
      console.error(`❌ Blog post not found with slug: ${slug}`)
      process.exit(1)
    }

    console.log(`📝 Found blog post: ${post.title}`)
    console.log(`   Current titleRu: ${post.titleRu || '(not set)'}`)
    
    console.log(`\n🔄 Updating Russian translation (force update)...`)
    
    await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        titleRu: translation.titleRu,
        excerptRu: translation.excerptRu,
        contentRu: translation.contentRu,
      }
    })

    console.log(`✅ Successfully updated Russian translation for: ${post.title}`)
    console.log(`   New titleRu: ${translation.titleRu.substring(0, 60)}...`)
    
  } catch (error) {
    console.error('❌ Failed to update Russian translation:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateBioFermentRussian()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((e) => {
    console.error('\n💥 Fatal error:', e)
    process.exit(1)
  })

