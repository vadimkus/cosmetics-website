import { PrismaClient } from '@prisma/client'
import { debugLog, errorLog } from '@/lib/logger'

const prisma = new PrismaClient()

// Arabic translations for blog posts
const blogTranslations: Record<string, {
  titleAr: string
  excerptAr: string
  contentAr: string
}> = {
  'black-friday-sale-20-off': {
    titleAr: '✨ عرض الجمعة السوداء — خصم 20% ✨',
    excerptAr: 'هذا العام، نقدم لك شيئاً مميزاً. خصم 20% على جميع منتجات GENOSYS، حصرياً للشراء عبر الإنترنت.',
    contentAr: `<div class="blog-content">
  <div class="intro-section bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6 md:p-8 mb-8">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">✨ عرض الجمعة السوداء — خصم 20% ✨</h2>
    <p class="text-xl md:text-2xl text-gray-700 font-semibold text-center mb-2">26 نوفمبر — 29 نوفمبر</p>
  </div>

  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      هذا العام، نقدم لك شيئاً مميزاً.
    </p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 font-semibold">
      خصم 20% على جميع منتجات GENOSYS، حصرياً للشراء عبر الإنترنت.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">🛒 كيفية الحصول على الخصم:</h3>
    <ul class="list-disc list-inside space-y-3 text-gray-700 text-lg">
      <li>اطلب مباشرة من خلال موقعنا الرسمي (الرابط في السيرة الذاتية)</li>
      <li>أو ضع طلبك عبر رسالة Instagram المباشرة</li>
    </ul>
    <p class="text-lg text-gray-700 mt-4">
      لا توجد رموز ترويجية. لا يوجد حد أدنى للإنفاق.
    </p>
    <p class="text-lg text-gray-700 mt-2 font-semibold">
      فقط منتجات العناية بالبشرة المهنية المميزة — الآن مع عرض الجمعة السوداء النادر.
    </p>
  </div>

  <div class="feature-section mb-8 text-center">
    <img 
      src="/blog/friday.jpeg" 
      alt="عرض الجمعة السوداء - خصم 20% على جميع منتجات GENOSYS" 
      class="rounded-xl shadow-lg mx-auto max-w-full h-auto"
    />
  </div>

  <div class="cta-section bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl p-6 md:p-8 text-center">
    <p class="text-lg md:text-xl font-bold mb-2">💥 صالح للشراء عبر الإنترنت فقط.</p>
    <p class="text-base md:text-lg">
      لا تفوتها — أكبر عرض سنوي لدينا ينتهي في 29 نوفمبر.
    </p>
  </div>
</div>`
  },
  'what-are-growth-factors-in-skincare': {
    titleAr: 'ما هي عوامل النمو في العناية بالبشرة — ولماذا تحبها بشرتك',
    excerptAr: 'اكتشف كيف تعمل عوامل النمو في منتجات العناية بالبشرة ولماذا تعتبر مكونات قوية لمكافحة الشيخوخة.',
    contentAr: `<div class="blog-content">
  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      عوامل النمو هي بروتينات طبيعية تلعب دوراً حيوياً في إصلاح وتجديد خلايا الجلد. في منتجات العناية بالبشرة، تساعد هذه العوامل القوية في تحفيز إنتاج الكولاجين، وتحسين مرونة الجلد، وتقليل علامات الشيخوخة.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">كيف تعمل عوامل النمو</h3>
    <p class="text-lg text-gray-700 mb-4">
      عندما يتم تطبيق عوامل النمو موضعياً، فإنها تعمل على:
    </p>
    <ul class="list-disc list-inside space-y-3 text-gray-700 text-lg">
      <li>تحفيز إنتاج الكولاجين والإيلاستين</li>
      <li>تعزيز تجديد الخلايا</li>
      <li>تحسين نسيج الجلد ومرونته</li>
      <li>تقليل الخطوط الدقيقة والتجاعيد</li>
    </ul>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">لماذا تعتبر مهمة</h3>
    <p class="text-lg text-gray-700 leading-relaxed">
      مع تقدمنا في العمر، تنخفض مستويات عوامل النمو الطبيعية في بشرتنا. من خلال إضافة منتجات تحتوي على عوامل النمو إلى روتين العناية بالبشرة، يمكننا المساعدة في استعادة هذه المستويات وتعزيز صحة الجلد بشكل عام.
    </p>
  </div>
</div>`
  },
  'genosys-skin-reboot-pdrn-mask-pack-launch': {
    titleAr: 'تعزيز حاجز البشرة وتأثير الرفع — قناع GENOSYS Skin Reboot PDRN',
    excerptAr: 'اكتشف قوة PDRN في قناع GENOSYS الجديد الذي يعزز حاجز البشرة ويوفر تأثير رفع ملحوظ.',
    contentAr: `<div class="blog-content">
  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      نقدم بفخر قناع GENOSYS Skin Reboot PDRN الجديد — منتج ثوري يجمع بين قوة PDRN (حمض الديوكسي ريبونوكلييك متعدد النوكليوتيدات) وتقنيات العناية بالبشرة المتقدمة.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">الفوائد الرئيسية</h3>
    <ul class="list-disc list-inside space-y-3 text-gray-700 text-lg">
      <li>تعزيز حاجز البشرة الطبيعي</li>
      <li>تأثير رفع ملحوظ</li>
      <li>ترطيب عميق ومكثف</li>
      <li>تحسين مرونة الجلد</li>
      <li>تقليل علامات الشيخوخة</li>
    </ul>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">كيفية الاستخدام</h3>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      لتحقيق أفضل النتائج، استخدم القناع 2-3 مرات في الأسبوع. ضع طبقة متساوية على الوجه النظيف واتركه لمدة 15-20 دقيقة قبل الشطف.
    </p>
  </div>
</div>`
  },
  '2025-genosys-new-products-bio-meso-pdrn-ampoule-mask-pack': {
    titleAr: 'منتج GENOSYS الجديد 2025 — أمبولة BIO-MESO PDRN',
    excerptAr: 'اكتشف منتج GENOSYS الجديد المبتكر — أمبولة BIO-MESO PDRN المصممة لتجديد البشرة وتعزيز الإشراق.',
    contentAr: `<div class="blog-content">
  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      نقدم بفخر منتج GENOSYS الجديد لعام 2025 — أمبولة BIO-MESO PDRN. هذا المنتج المبتكر يجمع بين أحدث تقنيات العناية بالبشرة الكورية ومكونات PDRN القوية.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">الميزات الرئيسية</h3>
    <ul class="list-disc list-inside space-y-3 text-gray-700 text-lg">
      <li>تركيز عالي من PDRN</li>
      <li>تجديد عميق للبشرة</li>
      <li>تحسين الإشراق والنضارة</li>
      <li>تقليل الخطوط الدقيقة والتجاعيد</li>
      <li>مناسب لجميع أنواع البشرة</li>
    </ul>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">الاستخدام الموصى به</h3>
    <p class="text-lg text-gray-700 leading-relaxed">
      استخدم الأمبولة بعد التنظيف وقبل المرطب. ضع بضع قطرات على الوجه والرقبة وقم بالتدليك برفق حتى الامتصاص الكامل.
    </p>
  </div>
</div>`
  },
  'bio-ferment-age-defying-powder-mask-launch': {
    titleAr: 'قناع BIO-FERMENT AGE DEFYING POWDER — مكافحة الشيخوخة المتقدمة بعوامل النمو والطاقة المخمرة',
    excerptAr: 'اكتشف قوة التخمير في قناع GENOSYS الجديد الذي يجمع بين عوامل النمو والطاقة المخمرة لمكافحة الشيخوخة المتقدمة.',
    contentAr: `<div class="blog-content">
  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      نقدم بفخر قناع BIO-FERMENT AGE DEFYING POWDER الجديد — منتج ثوري يجمع بين قوة عوامل النمو والطاقة المخمرة لمكافحة الشيخوخة المتقدمة.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">المكونات الرئيسية</h3>
    <ul class="list-disc list-inside space-y-3 text-gray-700 text-lg">
      <li>عوامل النمو المتقدمة</li>
      <li>مكونات مخمرة قوية</li>
      <li>مستخلصات طبيعية</li>
      <li>فيتامينات ومعادن</li>
    </ul>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">الفوائد</h3>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      هذا القناع الفريد يوفر:
    </p>
    <ul class="list-disc list-inside space-y-3 text-gray-700 text-lg">
      <li>مكافحة الشيخوخة المتقدمة</li>
      <li>تحسين مرونة الجلد</li>
      <li>تقليل الخطوط الدقيقة والتجاعيد</li>
      <li>إشراق ونضارة فورية</li>
      <li>ترطيب عميق</li>
    </ul>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">كيفية الاستخدام</h3>
    <p class="text-lg text-gray-700 leading-relaxed">
      اخلط المسحوق مع الماء أو السيروم المفضل لديك لتكوين عجينة ناعمة. ضع على الوجه النظيف واتركه لمدة 15-20 دقيقة قبل الشطف بالماء الفاتر.
    </p>
  </div>
</div>`
  }
}

async function translateBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { id: true, slug: true, title: true }
    })

    debugLog(`Found ${posts.length} published blog posts`)

    for (const post of posts) {
      const translation = blogTranslations[post.slug]
      
      if (!translation) {
        errorLog(`No translation found for post: ${post.slug} (${post.title})`)
        continue
      }

      try {
        await prisma.blogPost.update({
          where: { id: post.id },
          data: {
            titleAr: translation.titleAr,
            excerptAr: translation.excerptAr,
            contentAr: translation.contentAr,
          }
        })
        debugLog(`✅ Translated: ${post.title}`)
      } catch (error) {
        errorLog(`❌ Failed to translate post ${post.slug}:`, error)
      }
    }

    debugLog('✅ All blog posts translated successfully!')
  } catch (error) {
    errorLog('❌ Failed to translate blog posts:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

translateBlogPosts()
  .then(() => console.log('Done!'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

