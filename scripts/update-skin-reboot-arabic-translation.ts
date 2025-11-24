import { PrismaClient } from '@prisma/client'
import { debugLog, errorLog } from '@/lib/logger'

const prisma = new PrismaClient()

async function updateSkinRebootArabicTranslation() {
  try {
    const slug = 'genosys-skin-reboot-pdrn-mask-pack-launch'
    
    const titleAr = 'تعزيز حاجز البشرة وتأثير الرفع — قناع GENOSYS Skin Reboot PDRN'
    const excerptAr = 'اكتشف أحدث إضافة إلى خط العناية بالبشرة الاحترافي من GENOSYS: قناع Skin Reboot PDRN Mask Pack. هذا القناع الثوري من نوع الأنسجة DAME (تجربة القناع المزدوج للأمبولة) يمثل اختراقاً في تقنية تجديد البشرة المكثف.'
    
    const contentAr = `<div class="blog-content">
  <div class="intro-section mb-8 pb-8 border-b border-gray-200">
    <p class="text-xl text-gray-700 leading-relaxed mb-4">
      يسعدنا أن نعلن عن إطلاق أحدث إضافة إلى خط العناية بالبشرة الاحترافي من GENOSYS: <a href="/ar/products/52" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">قناع Skin Reboot PDRN Mask Pack</a>. يمثل هذا القناع الثوري من نوع الأنسجة DAME (تجربة القناع المزدوج للأمبولة) اختراقاً في تقنية تجديد البشرة المكثف.
    </p>
  </div>

  <div class="feature-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6 mt-8">ما الذي يجعل هذا القناع مميزاً؟</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      <a href="/ar/products/52" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">قناع GENOSYS Skin Reboot PDRN Mask Pack</a> هو قناع تجديد مكثف على المستوى المهني مصمم لمعالجة مخاوف البشرة المتعددة في وقت واحد. يجمع بين المكونات المتقدمة لتقديم فوائد شاملة للبشرة:
    </p>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <div class="text-4xl mb-4">💧</div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">حماية حاجز البشرة المعزز</h3>
        <p class="text-gray-700 leading-relaxed">
          القناع غني بـ <strong class="text-primary-600">البانثينول</strong> و<strong class="text-primary-600">5 أنواع من السيراميدات</strong> التي تعمل معاً لتقوية وحماية حاجز البشرة. السيراميدات هي دهون أساسية تشكل طبقة واقية على البشرة، مما يمنع فقدان الرطوبة ويحمي من العوامل البيئية. يوفر البانثينول (فيتامين B5) ترطيباً عميقاً ويساعد في تهدئة البشرة المتهيجة.
        </p>
      </div>

      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <div class="text-4xl mb-4">🌿</div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">تقنية PDRN لإحياء البشرة</h3>
        <p class="text-gray-700 leading-relaxed">
          معزز بـ <strong class="text-primary-600">PDRN (متعدد النوكليوتيدات)</strong>، ينشط هذا القناع ويغذي البشرة المتعبة. PDRN مشتق من DNA السلمون وقد ثبت سريرياً أنه يعزز إنتاج الكولاجين، ويحسن مرونة البشرة، ويحسن نسيج البشرة بشكل عام. تساعد هذه المكونات المتقدمة على تسريع تجديد وإصلاح خلايا البشرة.
        </p>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
        <div class="text-4xl mb-4">🌬️</div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">تقنية ورقة الليوسيل فائقة الرقة</h3>
        <p class="text-gray-700 leading-relaxed">
          يتميز القناع بورقة ليوسيل فائقة الرقة تضمن التصاقاً مثالياً بالبشرة وتوصيلاً أقصى للمستخلص. تسمح هذه المادة المبتكرة باختراق أفضل للمكونات النشطة، مما يضمن أن بشرتك تحصل على الفوائد الكاملة للتركيبة القوية.
        </p>
      </div>
    </div>
  </div>

  <div class="clinical-results-section mb-10 bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-8 border border-primary-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">النتائج السريرية</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      أظهرت الدراسات السريرية الجلدية نتائج مذهلة:
    </p>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="text-3xl font-bold text-primary-600 mb-2">34.969%</div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">تحسن في TEWL</h3>
        <p class="text-gray-600">
          يشير انخفاض فقدان الماء عبر البشرة إلى حاجز بشرة أقوى وأكثر مرونة
        </p>
      </div>
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="text-3xl font-bold text-primary-600 mb-2">2.886%</div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">تحسن في رفع الخد</h3>
        <p class="text-gray-600">
          تأثيرات رفع وشد مرئية، مما يساهم في مظهر أكثر شباباً
        </p>
      </div>
    </div>
    <p class="text-gray-700 mt-6 leading-relaxed">
      تثبت هذه النتائج المثبتة سريرياً فعالية القناع في كل من تقوية الحاجز ورفع البشرة.
    </p>
  </div>

  <div class="benefits-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">الفوائد الرئيسية</h2>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">التهدئة السريعة</h3>
          <p class="text-gray-600 text-sm">يهدئ بسرعة البشرة المتهيجة والحساسة</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">تقوية الحاجز</h3>
          <p class="text-gray-600 text-sm">تعمل السيراميدات المتعددة والبانثينول معاً على إعادة بناء وتعزيز حاجز البشرة الطبيعي</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">تحسين المرونة</h3>
          <p class="text-gray-600 text-sm">تعزز تقنية PDRN إنتاج الكولاجين للحصول على بشرة أكثر صلابة ومرونة</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">الترطيب العميق</h3>
          <p class="text-gray-600 text-sm">تضمن التركيبة المتقدمة الاحتفاظ بالرطوبة على المدى الطويل</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">على المستوى المهني</h3>
          <p class="text-gray-600 text-sm">مصمم للاستخدام في عيادات العناية بالبشرة المهنية ومن قبل الممارسين المرخصين</p>
        </div>
      </div>
    </div>
  </div>

  <div class="beneficiaries-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">من يمكنه الاستفادة؟</h2>
    <p class="text-lg text-gray-700 mb-4 leading-relaxed">
      هذا القناع مثالي لـ:
    </p>
    <ul class="space-y-3 text-gray-700">
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>العملاء الذين يعانون من حاجز بشرة ضعيف</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>أولئك الذين يعانون من تهيج البشرة أو الحساسية</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>الأفراد الذين يسعون لتجديد البشرة المكثف</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>العملاء الذين يتطلعون لتحسين مرونة البشرة وصلابتها</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>التعافي بعد العلاج والصيانة</span>
      </li>
    </ul>
  </div>

  <div class="application-section mb-10 bg-blue-50 rounded-xl p-8 border border-blue-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">التطبيق المهني</h2>
    <p class="text-lg text-gray-700 leading-relaxed">
      كمنتج على المستوى المهني، يجب استخدام <a href="/ar/products/52" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">قناع GENOSYS Skin Reboot PDRN Mask Pack</a> من قبل متخصصي العناية بالبشرة المرخصين. يمكن دمجه في علاجات الوجه، أو استخدامه كقناع للتعافي بعد العلاج، أو التوصية به للاستخدام المنزلي بين الجلسات المهنية.
    </p>
  </div>

  <div class="about-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">عن GENOSYS</h2>
    <p class="text-lg text-gray-700 leading-relaxed">
      GENOSYS هي علامة تجارية كورية احترافية لمستحضرات التجميل الطبية توزعها GENOSYS Middle East FZ-LLC في الإمارات العربية المتحدة. جميع منتجاتنا معتمدة من بلدية دبي ومناسبة للممارسين المرخصين وعيادات التجميل الاحترافية. نحن الموزع الرسمي لشركة DTS MG Co., Ltd. Korea، مما يضمن منتجات أصلية ومعتمدة.
    </p>
  </div>

  <div class="cta-section bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-8 border border-primary-100 mb-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">اختبر النتائج المثبتة سريرياً</h2>
    <p class="text-lg mb-6 text-gray-700 leading-relaxed">
      اختبر تأثيرات إعادة تشغيل البشرة المثبتة سريرياً مع <a href="/ar/products/52" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">قناع GENOSYS Skin Reboot PDRN Mask Pack</a> الجديد. يجمع هذا المنتج المبتكر بين تقنية العناية بالبشرة الكورية المتقدمة والمكونات المثبتة لتقديم نتائج استثنائية.
    </p>
    <div class="flex flex-col sm:flex-row gap-4">
      <a href="mailto:sales@genosys.ae" class="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center shadow-md hover:shadow-lg">
        اتصل بفريق المبيعات
      </a>
      <a href="https://wa.me/971585487665" target="_blank" rel="noopener noreferrer" class="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors text-center shadow-md hover:shadow-lg">
        تواصل معنا عبر واتساب
      </a>
    </div>
  </div>

  <div class="source-section text-sm text-gray-500 border-t border-gray-200 pt-6">
    <p>
      <em>المصدر: <a href="https://dtsmg.com/new-skin-barrier-strengthening-lifting-effect-genosys-skin-reboot-pdrn-mask-pack-launch/" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline">إعلان DTSMG الرسمي</a></em>
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
        titleAr,
        excerptAr,
        contentAr,
      }
    })

    debugLog('✅ Updated Arabic translation for Skin Reboot PDRN Mask Pack blog post')
    debugLog(`   Title: ${titleAr}`)
    debugLog(`   Excerpt length: ${excerptAr.length}`)
    debugLog(`   Content length: ${contentAr.length}`)
  } catch (error) {
    errorLog('❌ Failed to update Arabic translation:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateSkinRebootArabicTranslation()
  .then(() => console.log('Done!'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

