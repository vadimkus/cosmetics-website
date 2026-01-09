import { PrismaClient } from '@prisma/client'
import { debugLog, errorLog } from '@/lib/logger'

const prisma = new PrismaClient()

async function updateBioFermentArabicTranslation() {
  try {
    const slug = 'bio-ferment-age-defying-powder-mask-launch'
    
    const titleAr = 'قناع BIO-FERMENT AGE DEFYING POWDER — مكافحة الشيخوخة المتقدمة بعوامل النمو والطاقة المخمرة'
    const excerptAr = 'تقديم قناع GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK — قناع مسحوق ثوري معزز بالطاقة المخمرة وعوامل النمو الذي يوفر تهدئة سريعة وتغذية عميقة للبشرة الضعيفة بسبب الضغوط الخارجية.'
    
    const contentAr = `<div class="blog-content">
  <div class="intro-section mb-8 pb-8 border-b border-gray-200">
    <p class="text-xl text-gray-700 leading-relaxed mb-4">
      يسعدنا أن نقدم أحدث إضافة إلى مجموعة GENOSYS المهنية للعناية بالبشرة: <a href="/ar/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">قناع BIO-FERMENT AGE DEFYING POWDER MASK</a>. يجمع هذا القناع المسحوق الثوري بين قوة الطاقة المخمرة وعوامل النمو لتوفير تهدئة سريعة وتغذية عميقة للبشرة الضعيفة بسبب الضغوط الخارجية.
    </p>
    <p class="text-lg text-gray-700 leading-relaxed">
      على عكس الأقنعة التقليدية التي تجف، يوفر هذا القناع عالي الجودة القائم على التراب الدياتومي الذي يحبس الرطوبة فوائد قوية لمكافحة الشيخوخة مع تأثيرات ترطيب استثنائية وانخفاض مؤقت في درجة حرارة البشرة لإحساس بالبرودة.
    </p>
  </div>

  <div class="feature-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6 mt-8">ما الذي يجعل هذا القناع المسحوق مميزاً؟</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      تم تصميم <a href="/ar/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">قناع GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK</a> للاستخدام المهني والمنزلي. يتميز بمزيجه الفريد من المكونات المتقدمة:
    </p>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
        <div class="text-4xl mb-4">🌿</div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">6 أنواع من الببتيدات التجديدية</h3>
        <p class="text-gray-700 leading-relaxed">
          يتضمن مركب عوامل النمو الشامل بما في ذلك EGF و FGF و IGF و KGF و VEGF و TGF. تحفز هذه الببتيدات القوية تكاثر الخلايا، وتعزز تخليق الكولاجين، وتسريع التئام الجروح، وتحسين عملية تجديد البشرة الطبيعية.
        </p>
      </div>

      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <div class="text-4xl mb-4">⚗️</div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">4 أنواع من المنتجات المخمرة</h3>
        <p class="text-gray-700 leading-relaxed">
          يستفيد من قوة التخمير مع تخمير Lactobacillus/Punica Granatum Fruit، وتخمير Bacillus/Soybean، ومرشح تخمير Galactomyces، ومستخلص تخمير Bifida. يعزز التخمير فعالية المكونات وسلامتها مع دعم حاجز البشرة.
        </p>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <div class="text-4xl mb-4">💧</div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">تقنية حبس الرطوبة</h3>
        <p class="text-gray-700 leading-relaxed">
          مبني على قاعدة تراب دياتومي عالي الجودة، لا يجف هذا القناع مثل الأقنعة التقليدية. يحبس الرطوبة مع توفير ترطيب عميق وتأثير تبريد مؤقت يقلل من درجة حرارة البشرة.
        </p>
      </div>
    </div>
  </div>

  <div class="comparison-section mb-10 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">المقارنة: BIO-FERMENT مقابل HYDRO COOL MODELING MASK</h2>
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">قناع BIO-FERMENT AGE DEFYING POWDER MASK</h3>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start gap-2">
              <span class="text-primary-600 mt-1">•</span>
              <span><strong>الحجم:</strong> 300 جم / 10.582 أونصة</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary-600 mt-1">•</span>
              <span><strong>الاستخدام:</strong> مهني / منزلي</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary-600 mt-1">•</span>
              <span><strong>الخاصية:</strong> قناع مرطب لا يجف</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary-600 mt-1">•</span>
              <span><strong>الأفضل لـ:</strong> الترطيب والتهدئة مع العناصر الغذائية المضافة</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">قناع HYDRO COOL MODELING MASK</h3>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start gap-2">
              <span class="text-gray-400 mt-1">•</span>
              <span><strong>الحجم:</strong> 1 كجم / 35.2 أونصة</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-gray-400 mt-1">•</span>
              <span><strong>الاستخدام:</strong> للاستخدام المهني</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-gray-400 mt-1">•</span>
              <span><strong>الخاصية:</strong> قناع تبريد حتى الإزالة</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-gray-400 mt-1">•</span>
              <span><strong>الأفضل لـ:</strong> تهدئة درجة حرارة البشرة بسرعة</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="clinical-results-section mb-10 bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-8 border border-primary-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">النتائج السريرية</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      أظهرت الدراسات السريرية نتائج استثنائية في كل من ترطيب البشرة وتأثيرات التبريد:
    </p>
    
    <div class="grid md:grid-cols-2 gap-6 mb-6">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">تحسين ترطيب البشرة</h3>
        <div class="space-y-3">
          <div>
            <div class="text-2xl font-bold text-primary-600 mb-1">322.971%</div>
            <p class="text-sm text-gray-600">تحسين محتوى رطوبة البشرة</p>
            <p class="text-xs text-gray-500 mt-1">منتصف الخمسينات، بشرة عادية إلى جافة</p>
          </div>
          <div class="border-t border-gray-200 pt-3">
            <div class="text-2xl font-bold text-primary-600 mb-1">327.066%</div>
            <p class="text-sm text-gray-600">تحسين محتوى رطوبة البشرة</p>
            <p class="text-xs text-gray-500 mt-1">أواخر الأربعينات، بشرة جافة</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">انخفاض درجة حرارة البشرة (تأثير التبريد)</h3>
        <div class="space-y-3">
          <div>
            <div class="text-2xl font-bold text-primary-600 mb-1">29.569%</div>
            <p class="text-sm text-gray-600">انخفاض درجة الحرارة (-11°م)</p>
            <p class="text-xs text-gray-500 mt-1">منتصف الخمسينات، بشرة عادية إلى جافة</p>
          </div>
          <div class="border-t border-gray-200 pt-3">
            <div class="text-2xl font-bold text-primary-600 mb-1">27.520%</div>
            <p class="text-sm text-gray-600">انخفاض درجة الحرارة (-10°م)</p>
            <p class="text-xs text-gray-500 mt-1">أواخر الثلاثينات، بشرة دهنية</p>
          </div>
        </div>
      </div>
    </div>
    
    <p class="text-gray-700 mt-4 leading-relaxed">
      تثبت هذه النتائج السريرية قدرة القناع الاستثنائية على تحسين ترطيب البشرة مع توفير تأثير تبريد كبير، مما يجعله مثالياً لتهدئة البشرة المتهيجة أو المحمومة.
    </p>
  </div>

  <div class="images-section mb-10">
    <div class="grid md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
        <img src="/blog/biof.jpeg" alt="قناع BIO-FERMENT AGE DEFYING POWDER MASK" class="w-full h-64 object-cover" />
      </div>
      <div class="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
        <img src="/blog/biof2.jpeg" alt="تطبيق قناع BIO-FERMENT AGE DEFYING POWDER MASK" class="w-full h-64 object-cover" />
      </div>
      <div class="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
        <img src="/blog/biof3.jpeg" alt="نتائج قناع BIO-FERMENT AGE DEFYING POWDER MASK" class="w-full h-64 object-cover" />
      </div>
    </div>
  </div>

  <div class="ingredients-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">المكونات الرئيسية</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      تمت صياغة <a href="/ar/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">قناع BIO-FERMENT AGE DEFYING POWDER MASK</a> بمزيج شامل من المكونات المثبتة علمياً المنظمة في ثلاثة مركبات رئيسية:
    </p>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4">مركب عوامل النمو (6GFs)</h3>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">EGF (عامل النمو البشري):</strong> يحفز تكاثر وتمايز الخلايا الكيراتينية، ويعزز تجديد الخلايا الطبيعية والتئام الجروح.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">FGF (عامل النمو الليفي):</strong> يحفز نمو خلايا الأرومة الليفية، ويعزز تخليق الكولاجين والإيلاستين ومكونات المصفوفة خارج الخلية.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">IGF (عامل النمو الشبيه بالأنسولين):</strong> يحفز تكاثر الخلايا ويعزز التئام الجروح.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">KGF (عامل النمو الكيراتيني):</strong> يحفز تكاثر وهجرة الخلايا الكيراتينية، ويسرع الشفاء الطبيعي، ويعزز نمو الطبقة القرنية.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">VEGF (عامل النمو البطاني الوعائي):</strong> يحفز تكوين الأوعية الدموية، مما يعزز توصيل الأكسجين والمواد المغذية إلى البشرة.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">TGF (عامل النمو التحويلي):</strong> يحفز تكاثر وتمايز الخلايا، ويلئم الجروح.
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4">مركب الطاقة المخمرة</h3>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">مستخلص تخمير Lactobacillus/Punica Granatum Fruit:</strong> فوائد بروبيوتيك تدعم حاجز البشرة وتقلل الالتهاب.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">مستخلص تخمير Bacillus/Soybean:</strong> تعزيز التوافر الحيوي والفعالية من خلال عملية التخمير.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">مرشح تخمير Galactomyces:</strong> غني بالأحماض الأمينية والفيتامينات، يضيء ويرطب البشرة.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">مستخلص تخمير Bifida:</strong> يقوي حاجز البشرة، ويحسن مرونة البشرة ويقلل الحساسية.
            </div>
          </li>
        </ul>
        <p class="text-sm text-gray-600 mt-4 italic">
          يستفيد التخمير من التفاعلات الكيميائية الحيوية الطبيعية لتعزيز الفعالية والسلامة، مما ينتج بروبيوتيك أو ما بعد البروبيوتيك التي تدعم حاجز البشرة وتقلل الالتهاب.
        </p>
      </div>

      <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4">مركب الترطيب والتهدئة</h3>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">مستخلص جذر Glycyrrhiza Glabra (عرق السوس):</strong> غني بالفلافونويد (glabridin، liquiritin، licochalcone) والصابونين (Glycyrrhizin). يمنع تكوين الميلانين، ويوفر تأثيرات مضادة للالتهابات، ويزيل الجذور الحرة.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">مستخلص Oryza Sativa (نخالة الأرز):</strong> مصدر غني بأكثر من 100 مركب مضاد للأكسدة بما في ذلك فيتامين E وحمض الفيروليك والأوريزانول. يحمي من الإجهاد التأكسدي، ويحافظ على نعومة ورطوبة البشرة.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">ماء Chamaecyparis Obtusa (ماء السرو):</strong> غني بالفيتونسيدات مع خصائص مضادة للميكروبات ومضادة للالتهابات وتهدئة. يهدئ البشرة المتهيجة ويحسن التهابات البشرة.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">مستخلص أوراق Aloe Barbadensis:</strong> غني بالفيتامينات (A، B، C، E، B12) والأحماض الأمينية والمعادن. يوفر صفات مضادة للأكسدة، ويقلل التهيج، ويعزز الشفاء، ويرطب البشرة.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">الكولاجين المتحلل:</strong> يعزز المظهر الندي والناعم عن طريق زيادة مستويات رطوبة البشرة، ويشد البشرة.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">الألانتوين:</strong> خصائص ممتازة مضادة للالتهابات ومضادة للتهيج. يزيد محتوى الماء، ويقشر خلايا الجلد الميتة لمظهر أنظف وأكثر إشراقاً.
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div class="how-to-use-section mb-10 bg-blue-50 rounded-xl p-8 border border-blue-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">كيفية الاستخدام</h2>
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <ol class="space-y-4 text-gray-700">
        <li class="flex items-start gap-3">
          <span class="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
          <span class="pt-1">اخلط ثلاث ملاعق من المسحوق (40 جم) مع أربعة ملاعق ونصف من الماء باستخدام كوب القياس المرفق. استخدم نسبة مسحوق 1: ماء 1.5.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
          <span class="pt-1">ضع بالتساوي على منطقة المعالجة، مع تجنب العينين والحواجب.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
          <span class="pt-1">انزع بعد 15-20 دقيقة وامسح أي بقايا باستخدام التونر.</span>
        </li>
      </ol>
      <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p class="text-sm text-gray-700 font-semibold mb-2">⚠️ تحذير مهم:</p>
        <ul class="text-sm text-gray-600 space-y-1">
          <li>• بعد الاستخدام، أغلق الغطاء وأحكم إغلاقه.</li>
          <li>• بسبب طبيعة نوع المسحوق، قد يتدهور المنتج إذا تعرض للضوء أو الرطوبة في الهواء.</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="benefits-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">الفوائد الرئيسية</h2>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">ترطيب استثنائي</h3>
          <p class="text-gray-600 text-sm">مثبت سريرياً لتحسين محتوى رطوبة البشرة بأكثر من 320%</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">تأثير التبريد</h3>
          <p class="text-gray-600 text-sm">يقلل درجة حرارة البشرة حتى 11°م، مما يوفر إحساس تبريد فوري</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">قوة مكافحة الشيخوخة</h3>
          <p class="text-gray-600 text-sm">6 أنواع من عوامل النمو تحفز تخليق الكولاجين وتجديد الخلايا</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">تقنية حبس الرطوبة</h3>
          <p class="text-gray-600 text-sm">لا يجف مثل الأقنعة التقليدية، يحافظ على الترطيب طوال الاستخدام</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">استخدام مزدوج</h3>
          <p class="text-gray-600 text-sm">مناسب للاستخدام المهني في العيادات وتطبيقات العناية المنزلية</p>
        </div>
      </div>
    </div>
  </div>

  <div class="beneficiaries-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">من يمكنه الاستفادة؟</h2>
    <p class="text-lg text-gray-700 mb-4 leading-relaxed">
      هذا القناع المسحوق مثالي لـ:
    </p>
    <ul class="space-y-3 text-gray-700">
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>العملاء الذين يسعون للحصول على علاجات متقدمة لمكافحة الشيخوخة</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>أولئك الذين يعانون من بشرة جافة أو مجففة</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>الأفراد الذين يعانون من تهيج أو التهاب البشرة</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>العملاء الذين يحتاجون إلى التعافي بعد العلاج والتهدئة</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>العيادات المهنية التي تتطلب علاجات فعالة لمكافحة الشيخوخة</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>مستخدمي العناية المنزلية الذين يسعون للحصول على نتائج على مستوى مهني</span>
      </li>
    </ul>
  </div>

  <div class="application-section mb-10 bg-blue-50 rounded-xl p-8 border border-blue-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">التطبيق المهني</h2>
    <p class="text-lg text-gray-700 leading-relaxed">
      تم تصميم <a href="/ar/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">قناع GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK</a> للاستخدام المهني في العيادات والمنتجعات الصحية، وكذلك تطبيقات العناية المنزلية. يمكن دمجه في علاجات الوجه، أو استخدامه كقناع تعافي بعد العلاج، أو التوصية به للاستخدام المنزلي المنتظم. يوفر الحجم 300 جم تطبيقات متعددة، مما يجعله فعالاً من حيث التكلفة للاستخدام المهني والشخصي.
    </p>
  </div>

  <div class="about-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">حول GENOSYS</h2>
    <p class="text-lg text-gray-700 leading-relaxed">
      GENOSYS هي علامة تجارية كورية مهنية لمستحضرات التجميل الطبية يتم توزيعها من قبل شركة GENOSYS الشرق الأوسط FZ-LLC في الإمارات. جميع منتجاتنا معتمدة من بلدية دبي ومناسبة للممارسين المرخصين وعيادات التجميل المهنية. نحن الموزع الرسمي لشركة DTS MG Co., Ltd. Korea، مما يضمن منتجات أصلية ومعتمدة.
    </p>
  </div>

  <div class="cta-section bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-8 border border-primary-100 mb-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">اختبر النتائج المثبتة سريرياً</h2>
    <p class="text-lg mb-6 text-gray-700 leading-relaxed">
      اختبر تأثيرات مكافحة الشيخوخة والترطيب الاستثنائية مع <a href="/ar/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">قناع GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK</a> الجديد. يجمع هذا المنتج المبتكر بين تقنية العناية بالبشرة الكورية المتطورة والطاقة المخمرة وعوامل النمو لتقديم نتائج استثنائية.
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

  <div class="source-section text-sm text-gray-500 border-t border-gray-200 pt-6">
    <p>
      <em>المصدر: <a href="/documents/ppt/GENOSYS%20BIO-FERMENT%20AGE%20DEFYING%20POWDER%20MASK.pdf" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline">وثائق المنتج PDF</a></em>
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

    debugLog('✅ Updated Arabic translation for BIO-FERMENT blog post')
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

updateBioFermentArabicTranslation()
  .then(() => console.log('Done!'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

