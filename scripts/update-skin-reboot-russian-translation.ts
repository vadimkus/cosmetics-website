import 'dotenv/config'
import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'

async function updateSkinRebootRussianTranslation() {
  try {
    const slug = 'genosys-skin-reboot-pdrn-mask-pack-launch'
    
    const titleRu = 'НОВИНКА: Укрепление кожного барьера и эффект лифтинга — маска GENOSYS Skin Reboot PDRN'
    const excerptRu = 'Представляем новейшую маску типа DAME (Double Ampoule Mask Experience) от GENOSYS — профессиональную маску интенсивной регенерации, которая быстро успокаивает раздраженную кожу, одновременно укрепляя кожный барьер и улучшая эластичность.'
    
    const contentRu = `<div class="blog-content">
  <div class="intro-section mb-8 pb-8 border-b border-gray-200">
    <p class="text-xl text-gray-700 leading-relaxed mb-4">
      Мы рады объявить о запуске новейшего дополнения к профессиональной линии ухода за кожей GENOSYS: <a href="/ru/products/52" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">маска Skin Reboot PDRN Mask Pack</a>. Эта революционная маска типа DAME (Double Ampoule Mask Experience) представляет собой прорыв в технологии интенсивной регенерации кожи.
    </p>
  </div>

  <div class="feature-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6 mt-8">Что делает эту маску особенной?</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      <a href="/ru/products/52" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">Маска GENOSYS Skin Reboot PDRN Mask Pack</a> — это профессиональная маска интенсивной регенерации, разработанная для одновременного решения множественных проблем кожи. Она сочетает передовые ингредиенты для комплексного воздействия на кожу:
    </p>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <div class="text-4xl mb-4">💧</div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">Усиленная защита кожного барьера</h3>
        <p class="text-gray-700 leading-relaxed">
          Маска обогащена <strong class="text-primary-600">пантенолом</strong> и <strong class="text-primary-600">5 типами церамидов</strong>, которые работают вместе для укрепления и защиты кожного барьера. Церамиды — это незаменимые липиды, которые образуют защитный слой на коже, предотвращая потерю влаги и защищая от агрессивных факторов окружающей среды. Пантенол (витамин B5) обеспечивает глубокое увлажнение и помогает успокоить раздраженную кожу.
        </p>
      </div>

      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <div class="text-4xl mb-4">🌿</div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">Технология PDRN для омоложения кожи</h3>
        <p class="text-gray-700 leading-relaxed">
          Обогащенная <strong class="text-primary-600">PDRN (полинуклеотидами)</strong>, эта маска оживляет и питает уставшую кожу. PDRN получают из ДНК лосося и клинически доказано, что он способствует выработке коллагена, повышает эластичность кожи и улучшает общую текстуру кожи. Этот передовой ингредиент помогает ускорить регенерацию и восстановление клеток кожи.
        </p>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
        <div class="text-4xl mb-4">🌬️</div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">Технология ультратонкой лиоцелловой основы</h3>
        <p class="text-gray-700 leading-relaxed">
          Маска оснащена ультратонкой лиоцелловой основой, которая обеспечивает безупречное прилегание к коже и максимальную доставку эссенции. Этот инновационный материал обеспечивает лучшее проникновение активных ингредиентов, гарантируя, что ваша кожа получает все преимущества мощной формулы.
        </p>
      </div>
    </div>
  </div>

  <div class="clinical-results-section mb-10 bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-8 border border-primary-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Клинические результаты</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      Дерматологические клинические исследования продемонстрировали впечатляющие результаты:
    </p>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="text-3xl font-bold text-primary-600 mb-2">34.969%</div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Улучшение TEWL</h3>
        <p class="text-gray-600">
          Снижение трансэпидермальной потери воды указывает на более сильный и устойчивый кожный барьер
        </p>
      </div>
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="text-3xl font-bold text-primary-600 mb-2">2.886%</div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Улучшение лифтинга щек</h3>
        <p class="text-gray-600">
          Видимые эффекты лифтинга и подтяжки, способствующие более молодому внешнему виду
        </p>
      </div>
    </div>
    <p class="text-gray-700 mt-6 leading-relaxed">
      Эти клинически доказанные результаты демонстрируют эффективность маски как в укреплении барьера, так и в лифтинге кожи.
    </p>
  </div>

  <div class="benefits-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Ключевые преимущества</h2>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Быстрое успокоение</h3>
          <p class="text-gray-600 text-sm">Быстро успокаивает раздраженную и чувствительную кожу</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Укрепление барьера</h3>
          <p class="text-gray-600 text-sm">Множественные церамиды и пантенол восстанавливают и укрепляют естественный барьер кожи</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Улучшенная эластичность</h3>
          <p class="text-gray-600 text-sm">Технология PDRN способствует выработке коллагена для более упругой и эластичной кожи</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Глубокое увлажнение</h3>
          <p class="text-gray-600 text-sm">Передовая формула обеспечивает длительное удержание влаги</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Профессиональный уровень</h3>
          <p class="text-gray-600 text-sm">Разработана для использования в профессиональных клиниках по уходу за кожей и лицензированными специалистами</p>
        </div>
      </div>
    </div>
  </div>

  <div class="beneficiaries-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Кому это подходит?</h2>
    <p class="text-lg text-gray-700 mb-4 leading-relaxed">
      Эта маска идеальна для:
    </p>
    <ul class="space-y-3 text-gray-700">
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>Клиентов с ослабленным кожным барьером</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>Тех, кто испытывает раздражение или чувствительность кожи</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>Людей, стремящихся к интенсивной регенерации кожи</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>Клиентов, желающих улучшить эластичность и упругость кожи</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>Восстановления после процедур и поддержания результата</span>
      </li>
    </ul>
  </div>

  <div class="application-section mb-10 bg-blue-50 rounded-xl p-8 border border-blue-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">Профессиональное применение</h2>
    <p class="text-lg text-gray-700 leading-relaxed">
      Как продукт профессионального уровня, <a href="/ru/products/52" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">маска GENOSYS Skin Reboot PDRN Mask Pack</a> должна использоваться лицензированными специалистами по уходу за кожей. Она может быть включена в процедуры для лица, использоваться как восстановительная маска после процедур или рекомендована для домашнего использования между профессиональными сеансами.
    </p>
  </div>

  <div class="about-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">О GENOSYS</h2>
    <p class="text-lg text-gray-700 leading-relaxed">
      GENOSYS — это профессиональный корейский бренд дерматокосметики, распространяемый GENOSYS Middle East FZ-LLC в ОАЭ. Все наши продукты сертифицированы муниципалитетом Дубая и подходят для лицензированных специалистов и профессиональных клиник красоты. Мы являемся официальным дистрибьютором DTS MG Co., Ltd. Korea, что гарантирует подлинные и сертифицированные продукты.
    </p>
  </div>

  <div class="cta-section bg-gradient-to-r from-primary-600 to-red-600 rounded-xl p-8 text-white mb-8">
    <h2 class="text-3xl font-bold mb-4">Ощутите клинически доказанные результаты</h2>
    <p class="text-lg mb-6 opacity-95 leading-relaxed">
      Ощутите клинически доказанные эффекты перезагрузки кожи с новой <a href="/ru/products/52" class="text-white font-bold underline hover:text-gray-100 transition-colors">маской GENOSYS Skin Reboot PDRN Mask Pack</a>. Этот инновационный продукт сочетает передовые корейские технологии ухода за кожей с проверенными ингредиентами для достижения исключительных результатов.
    </p>
    <div class="flex flex-col sm:flex-row gap-4">
      <a href="mailto:sales@genosys.ae" class="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center">
        Связаться с отделом продаж
      </a>
      <a href="https://wa.me/971585487665" target="_blank" rel="noopener noreferrer" class="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors text-center">
        Написать в WhatsApp
      </a>
    </div>
  </div>

  <div class="source-section text-sm text-gray-500 border-t border-gray-200 pt-6">
    <p>
      <em>Источник: <a href="https://dtsmg.com/new-skin-barrier-strengthening-lifting-effect-genosys-skin-reboot-pdrn-mask-pack-launch/" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline">Официальное объявление DTSMG</a></em>
    </p>
  </div>
</div>`

    const post = await prisma.blogPost.findUnique({
      where: { slug }
    })

    if (!post) {
      errorLog(`Blog post with slug "${slug}" not found.`)
      return
    }

    await prisma.blogPost.update({
      where: { slug },
      data: {
        titleRu,
        excerptRu,
        contentRu,
      }
    })

    debugLog('✅ Updated Russian translation for Skin Reboot PDRN blog post')
    debugLog(`   Title: ${titleRu}`)
    debugLog(`   Excerpt length: ${excerptRu.length}`)
    debugLog(`   Content length: ${contentRu.length}`)
  } catch (error) {
    errorLog('❌ Failed to update Russian translation:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateSkinRebootRussianTranslation()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })

