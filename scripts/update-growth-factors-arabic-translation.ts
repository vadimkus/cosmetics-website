import { PrismaClient } from '@prisma/client'
import { debugLog, errorLog } from '@/lib/logger'

const prisma = new PrismaClient()

async function updateGrowthFactorsArabicTranslation() {
  try {
    const slug = 'what-are-growth-factors-in-skincare'
    
    const titleAr = 'ما هي عوامل النمو في العناية بالبشرة — ولماذا تحبها بشرتك'
    const excerptAr = 'اكتشف كيف تحول عوامل النمو العناية بالبشرة المهنية من خلال إصلاح واستعادة وتجديد البشرة على المستوى الخلوي. تعرف على دورها في مكافحة الشيخوخة وكيف يستفيد قناع GENOSYS Bio-Ferment Age-Defying Powder Mask من قوتها.'
    
    const contentAr = `<div class="blog-content">
  <div class="intro-section mb-8 pb-8 border-b border-gray-200">
    <p class="text-xl text-gray-700 leading-relaxed mb-4">
      في عالم التجميل المتقدم، قلة من المكونات حولت العناية بالبشرة المهنية بقوة مثل <strong class="text-gray-900">عوامل النمو</strong>. كانت تستخدم في السابق بشكل رئيسي في التئام الجروح الطبية، وهي الآن في قلب تركيبات مكافحة الشيخوخة بفضل قدرتها على إصلاح واستعادة وتجديد البشرة على المستوى الخلوي.
    </p>
    <p class="text-lg text-gray-700 leading-relaxed">
      لكن ما هي عوامل النمو بالضبط، وكيف تعمل؟ دعنا نشرح ذلك.
    </p>
  </div>

  <div class="images-section mb-10">
    <div class="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
      <img src="/blog/bioo.jpeg" alt="قناع GENOSYS Bio-Ferment Age-Defying Powder Mask مع عوامل النمو" class="w-full h-auto object-contain" />
    </div>
  </div>

  <div class="what-are-growth-factors-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6 mt-8">ما هي عوامل النمو؟</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      عوامل النمو هي بروتينات طبيعية موجودة في جسم الإنسان. تعمل كرسائل تتواصل مع خلايا البشرة، تخبرها بـ:
    </p>
    
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 mb-6">
      <ul class="space-y-3 text-gray-700">
        <li class="flex items-start gap-3">
          <span class="text-primary-600 font-bold mt-1">•</span>
          <span><strong class="text-gray-900">إصلاح الضرر</strong> – تسريع الشفاء والتعافي</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary-600 font-bold mt-1">•</span>
          <span><strong class="text-gray-900">إنتاج الكولاجين والإيلاستين</strong> – بروتينات أساسية لبنية البشرة ومرونتها</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary-600 font-bold mt-1">•</span>
          <span><strong class="text-gray-900">تجديد خلايا جديدة وصحية</strong> – تعزيز دوران الخلايا</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary-600 font-bold mt-1">•</span>
          <span><strong class="text-gray-900">تقوية حاجز البشرة</strong> – تحسين الحماية والمرونة</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary-600 font-bold mt-1">•</span>
          <span><strong class="text-gray-900">تقليل الالتهاب</strong> – تهدئة البشرة المتهيجة والحساسة</span>
        </li>
      </ul>
    </div>

    <p class="text-lg text-gray-700 leading-relaxed">
      مع تقدمنا في العمر، ينخفض إنتاجنا الطبيعي لعوامل النمو، مما يؤدي إلى تجديد أبطأ للخلايا وفقدان المرونة والجفاف وظهور الخطوط الدقيقة.
    </p>
    <p class="text-lg text-gray-700 leading-relaxed mt-4">
      هنا تأتي عوامل النمو الموضعية المشتقة من التكنولوجيا الحيوية. عند تطبيقها على البشرة، تساعد في "تذكير" الخلايا بكيفية التصرف مثل نسخ أصغر سناً وأكثر نشاطاً من نفسها.
    </p>
  </div>

  <div class="how-growth-factors-work-section mb-10 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">كيف تعمل عوامل النمو في العناية بالبشرة</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      في تركيبات العناية بالبشرة المهنية، توفر عوامل النمو فوائد شاملة:
    </p>
    
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="text-2xl font-bold text-primary-600 mb-2">1</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-3">تعزيز تخليق الكولاجين والإيلاستين</h3>
        <p class="text-gray-700 leading-relaxed">
          مما يؤدي إلى بشرة أكثر صلابة وامتلاء ومرونة مع دعم هيكلي محسن.
        </p>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="text-2xl font-bold text-primary-600 mb-2">2</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-3">تسريع التجديد</h3>
        <p class="text-gray-700 leading-relaxed">
          مثالي للتعافي بعد الإجراءات، وتقليل الاحمرار، وتقوية البشرة التالفة.
        </p>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="text-2xl font-bold text-primary-600 mb-2">3</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-3">تقليل الالتهاب</h3>
        <p class="text-gray-700 leading-relaxed">
          تهدئة البشرة الحساسة أو المتهيجة أو المجهدة لمظهر أكثر توازناً.
        </p>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="text-2xl font-bold text-primary-600 mb-2">4</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-3">تحسين مستويات الترطيب</h3>
        <p class="text-gray-700 leading-relaxed">
          تحسن بعض عوامل النمو المصفوفة خارج الخلية، مما يساعد البشرة على الاحتفاظ بمزيد من الرطوبة.
        </p>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 md:col-span-2">
        <div class="text-2xl font-bold text-primary-600 mb-2">5</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-3">إشراق وتوحيد لون البشرة</h3>
        <p class="text-gray-700 leading-relaxed">
          من خلال دعم التجديد الخلوي المتوازن وتقليل الإجهاد التأكسدي، تساعد عوامل النمو في تحقيق مظهر أكثر إشراقاً ومتساوياً.
        </p>
      </div>
    </div>
  </div>

  <div class="genosys-product-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">عوامل النمو في قناع GENOSYS Bio-Ferment Age-Defying Powder Mask</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      <a href="/ar/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">قناع GENOSYS Bio-Ferment Age-Defying Powder Mask</a> هو مثال قوي على كيف يمكن لعوامل النمو أن تحول البشرة. يجمع بين عوامل النمو متعددة الببتيدات مع المكونات النشطة المخمرة، مما يخلق تأثيراً تآزرياً لمكافحة الشيخوخة وإصلاح البشرة.
    </p>

    <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-100 mb-8">
      <h3 class="text-2xl font-bold text-gray-800 mb-6">عوامل النمو المضمنة</h3>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h4 class="font-semibold text-gray-800 mb-2">SH-Oligopeptide-1 (EGF)</h4>
          <p class="text-gray-700 text-sm">عامل النمو البشري – يحفز تجديد البشرة وتجديد الخلايا</p>
        </div>
        <div class="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h4 class="font-semibold text-gray-800 mb-2">SH-Oligopeptide-2 (IGF)</h4>
          <p class="text-gray-700 text-sm">عامل النمو الشبيه بالأنسولين – يحفز تكاثر الخلايا ويعزز التئام الجروح</p>
        </div>
        <div class="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h4 class="font-semibold text-gray-800 mb-2">SH-Polypeptide-1 (bFGF)</h4>
          <p class="text-gray-700 text-sm">عامل النمو الليفي – يدعم نشاط الأرومة الليفية وتخليق الكولاجين</p>
        </div>
        <div class="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h4 class="font-semibold text-gray-800 mb-2">SH-Polypeptide-3 (KGF)</h4>
          <p class="text-gray-700 text-sm">عامل النمو الكيراتيني – يشجع على تكوين خلايا جلد جديدة وصحية</p>
        </div>
        <div class="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h4 class="font-semibold text-gray-800 mb-2">SH-Polypeptide-9 (VEGF)</h4>
          <p class="text-gray-700 text-sm">عامل النمو البطاني الوعائي – يدعم الدورة الدموية الدقيقة وتوصيل العناصر الغذائية</p>
        </div>
        <div class="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h4 class="font-semibold text-gray-800 mb-2">SH-Polypeptide-22 (TGF)</h4>
          <p class="text-gray-700 text-sm">عامل النمو التحويلي – يقوي بنية الأدمة</p>
        </div>
      </div>
      <p class="text-gray-700 mt-6 leading-relaxed">
        معاً، تساعد هذه العوامل البشرة على التعافي بشكل أسرع، وتبدو أكثر صلابة، وتشعر بالنعومة.
      </p>
    </div>
  </div>

  <div class="why-standout-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">لماذا يتميز هذا القناع</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      إلى جانب عوامل النمو، <a href="/ar/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">قناع GENOSYS Bio-Ferment Age-Defying Powder Mask</a> معزز بمركب مخمر يعزز التوافر الحيوي ويقوي حاجز البشرة:
    </p>

    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4">مركب الطاقة المخمرة</h3>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-3">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">مرشح تخمير Galactomyces:</strong> خصائص مضادة للأكسدة وإشراق وتهدئة
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">مستخلص تخمير Bifida:</strong> يقلل الحساسية ويقوي حاجز البشرة
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">مستخلص تخمير Lactobacillus/الرمان:</strong> فوائد مكافحة الشيخوخة ومكافحة التصبغ
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">مستخلص تخمير فول الصويا:</strong> خصائص مضادة للأكسدة وتكييف
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4">مستخلصات النباتات</h3>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-3">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">مستخلص نخالة الأرز:</strong> غني بمضادات الأكسدة والسكريات المتعددة المرطبة
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">مستخلص جذر عرق السوس:</strong> تأثيرات مضادة للالتهابات وإشراق
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">مستخلص الصبار:</strong> خصائص مهدئة وشفائية
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">ماء السرو:</strong> فوائد مضادة للميكروبات ومضادة للالتهابات
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="clinical-results-section bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-8 border border-primary-100">
      <h3 class="text-2xl font-bold text-gray-800 mb-6">النتائج المثبتة سريرياً</h3>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="text-3xl font-bold text-primary-600 mb-2">+218%</div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">زيادة ترطيب البشرة</h4>
          <p class="text-gray-600 text-sm">
            تحسن كبير في محتوى رطوبة البشرة ووظيفة الحاجز
          </p>
        </div>
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="text-3xl font-bold text-primary-600 mb-2">-10 إلى -11°م</div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">انخفاض درجة حرارة البشرة</h4>
          <p class="text-gray-600 text-sm">
            تأثير مهدئ عميق ومضاد للاحمرار لبشرة أكثر هدوءاً وراحة
          </p>
        </div>
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="text-3xl font-bold text-primary-600 mb-2">✓</div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">تحسينات مرئية</h4>
          <p class="text-gray-600 text-sm">
            نعومة وإشراق محسنة وحيوية عامة للبشرة
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="why-need-growth-factors-section mb-10 bg-blue-50 rounded-xl p-8 border border-blue-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">لماذا تحتاج بشرتك إلى عوامل النمو</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      إذا كانت أهدافك تشمل:
    </p>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="flex items-start gap-3 p-4 bg-white rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">بشرة أكثر صلابة وشباباً</h3>
          <p class="text-gray-600 text-sm">إنتاج محسن للكولاجين والإيلاستين</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-white rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">شفاء متسارع</h3>
          <p class="text-gray-600 text-sm">تعافي وتجديد أسرع</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-white rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">مظهر هادئ ومتوازن</h3>
          <p class="text-gray-600 text-sm">تقليل الالتهاب والتهيج</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-white rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">الدعم بعد الإجراءات</h3>
          <p class="text-gray-600 text-sm">مثالي للتعافي بعد العلاج</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-white rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">ترطيب طويل الأمد</h3>
          <p class="text-gray-600 text-sm">احتفاظ محسن بالرطوبة</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-white rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">تقليل التجاعيد والباهت</h3>
          <p class="text-gray-600 text-sm">فوائد مرئية لمكافحة الشيخوخة</p>
        </div>
      </div>
    </div>
    <p class="text-lg text-gray-700 mt-6 leading-relaxed">
      ...إذن فإن العناية بالبشرة بعوامل النمو هي واحدة من أكثر الأدوات فعالية المتاحة. وفي تركيبات مثل <a href="/ar/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">قناع GENOSYS Bio-Ferment Age-Defying Powder Mask</a>، حيث يتم دمج عوامل النمو مع المكونات النشطة المخمرة والنباتات وتقنية الترطيب، يصبح أداؤها أقوى بكثير.
    </p>
  </div>

  <div class="cta-section bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-8 border border-primary-100 mb-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">اختبر قوة عوامل النمو</h2>
    <p class="text-lg mb-6 text-gray-700 leading-relaxed">
      اكتشف الفوائد التحويلية لعوامل النمو مع <a href="/ar/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">قناع GENOSYS Bio-Ferment Age-Defying Powder Mask</a>. تجمع هذه التركيبة على مستوى مهني بين ستة أنواع من عوامل النمو مع الطاقة المخمرة ومستخلصات النباتات لنتائج استثنائية لمكافحة الشيخوخة وإصلاح البشرة.
    </p>
    <div class="flex flex-col sm:flex-row gap-4">
      <a href="/ar/products/51" class="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center shadow-md hover:shadow-lg">
        عرض تفاصيل المنتج
      </a>
      <a href="mailto:sales@genosys.ae" class="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center border border-primary-600 shadow-md hover:shadow-lg">
        الاتصال بفريق المبيعات
      </a>
      <a href="https://wa.me/971585487665" target="_blank" rel="noopener noreferrer" class="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors text-center shadow-md hover:shadow-lg">
        واتسابنا
      </a>
    </div>
  </div>

  <div class="about-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">حول GENOSYS</h2>
    <p class="text-lg text-gray-700 leading-relaxed">
      GENOSYS هي علامة تجارية كورية مهنية لمستحضرات التجميل الطبية يتم توزيعها من قبل شركة GENOSYS الشرق الأوسط FZ-LLC في الإمارات. جميع منتجاتنا معتمدة من بلدية دبي ومناسبة للممارسين المرخصين وعيادات التجميل المهنية. نحن الموزع الرسمي لشركة DTS MG Co., Ltd. Korea، مما يضمن منتجات أصلية ومعتمدة.
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

    debugLog('✅ Updated Arabic translation for Growth Factors blog post')
    debugLog(`   Title: ${titleAr}`)
    debugLog(`   Excerpt length: ${excerptAr.length}`)
    debugLog(`   Content length: ${contentAr.length}`)
  } catch {
    errorLog('❌ Failed to update Arabic translation:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateGrowthFactorsArabicTranslation()
  .then(() => console.log('Done!'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

