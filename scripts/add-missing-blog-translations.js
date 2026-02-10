#!/usr/bin/env node

/**
 * Add missing Arabic & Russian translations for all blog posts
 * Posts that already have translations (e.g. genosys-ios-app-2026) are skipped.
 */

const { PrismaClient } = require('@prisma/client')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('❌ DATABASE_URL or PRISMA_DATABASE_URL environment variable is required.')
  process.exit(1)
}

let prisma
const isAccelerate = databaseUrl.startsWith('prisma+')

if (isAccelerate) {
  prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error', 'warn'] })
} else {
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')
  const pool = new Pool({ connectionString: databaseUrl })
  const adapter = new PrismaPg(pool)
  prisma = new PrismaClient({ adapter, log: ['error', 'warn'] })
}

// ============================================================
// TRANSLATIONS DATA
// ============================================================

const translations = {

  // ----------------------------------------------------------
  // 1. AR Skin Analysis & Power Animal Game
  // ----------------------------------------------------------
  'ar-skin-analysis-power-animal-tools': {
    titleAr: 'اكتشف إمكانات بشرتك الحقيقية مع تحليل الواقع المعزز ولعبة الحيوان الروحي',
    excerptAr: 'اختبر مستقبل العناية بالبشرة مع أداة تحليل البشرة المباشر بالواقع المعزز واكتشف حيوانك الروحي في لعبتنا الممتعة. التكنولوجيا المتقدمة تلتقي بالترفيه!',
    titleRu: 'Откройте истинный потенциал вашей кожи с AR-анализом и игрой «Тотемное животное»',
    excerptRu: 'Откройте для себя будущее ухода за кожей с новым AR-анализом кожи в реальном времени и узнайте своё тотемное животное в нашей увлекательной игре. Передовые технологии встречают развлечение!',
    contentAr: `<div class="blog-content" dir="rtl">
  <div class="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-6 md:p-10 mb-10 text-center border border-purple-100">
    <div class="text-5xl mb-4">🚀</div>
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">مستقبل العناية بالبشرة هنا!</h2>
    <p class="text-lg text-gray-600">ميزتان رائدتان: تحليل البشرة المباشر بالواقع المعزز ولعبة الحيوان الروحي</p>
  </div>

  <div class="mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">⚡ تحليل البشرة المباشر بالواقع المعزز</h3>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      أداة تحليل البشرة المباشر بالواقع المعزز تستخدم الذكاء الاصطناعي المتقدم لتحليل بشرتك في الوقت الفعلي من خلال كاميرا جهازك. لا مزيد من التخمين حول نوع بشرتك — احصل على تحليل احترافي فوري.
    </p>
  </div>

  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-10">
    <h3 class="text-xl font-bold text-gray-900 mb-4">📊 ما الذي يحلله</h3>
    <div class="grid md:grid-cols-2 gap-3">
      <div class="flex items-center gap-2"><span>💧</span> <span>ترطيب البشرة</span></div>
      <div class="flex items-center gap-2"><span>✨</span> <span>كشف الدهون</span></div>
      <div class="flex items-center gap-2"><span>🎯</span> <span>تحليل الملمس</span></div>
      <div class="flex items-center gap-2"><span>🎨</span> <span>لون البشرة والتوحيد</span></div>
      <div class="flex items-center gap-2"><span>📅</span> <span>تقدير العمر</span></div>
      <div class="flex items-center gap-2"><span>🔍</span> <span>تحليل حجم المسام</span></div>
      <div class="flex items-center gap-2"><span>👁️</span> <span>تقييم منطقة تحت العين</span></div>
      <div class="flex items-center gap-2"><span>💪</span> <span>مرونة البشرة</span></div>
      <div class="flex items-center gap-2"><span>☀️</span> <span>كشف أضرار الشمس</span></div>
      <div class="flex items-center gap-2"><span>📏</span> <span>مقياس فيتزباتريك</span></div>
    </div>
  </div>

  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-10">
    <h3 class="text-xl font-bold text-gray-900 mb-4">📱 كيفية الاستخدام</h3>
    <ol class="space-y-2 text-gray-700">
      <li><strong>1.</strong> قم بزيارة صفحة توصيات البشرة</li>
      <li><strong>2.</strong> انقر على زر الواقع المعزز المباشر</li>
      <li><strong>3.</strong> اسمح بالوصول إلى الكاميرا</li>
      <li><strong>4.</strong> ضع وجهك في الدائرة الإرشادية</li>
      <li><strong>5.</strong> ابقَ ثابتاً للحصول على قراءات دقيقة</li>
      <li><strong>6.</strong> انقر لالتقاط تقرير التحليل الكامل!</li>
    </ol>
  </div>

  <div class="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 md:p-10 mb-10 border border-amber-100">
    <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">🦁 لعبة الحيوان الروحي</h3>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      هل تبحث عن شيء ممتع؟ جرب لعبة الحيوان الروحي — محاكاة مرحة لتحليل البشرة تكشف عن حيوانك الروحي الداخلي!
    </p>
    <div class="space-y-2 text-gray-700">
      <p>🦁 الأسد — "زئير على المرطب. الملوك الحقيقيون لا يستحمون."</p>
      <p>🐼 الباندا — "تلك الهالات السوداء؟ هذا يسمى إطلالة."</p>
      <p>🦄 يونيكورن — "ضع دموع قوس قزح لتوهج أسطوري."</p>
      <p>🔥 العنقاء — "أحرق كل شيء — تقشير نهائي."</p>
    </div>
  </div>

  <div class="grid md:grid-cols-3 gap-4 mb-10">
    <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
      <div class="text-2xl mb-2">🔐</div>
      <p class="font-bold text-gray-900">الخصوصية أولاً</p>
      <p class="text-sm text-gray-600">كل المعالجة على جهازك</p>
    </div>
    <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
      <div class="text-2xl mb-2">⚡</div>
      <p class="font-bold text-gray-900">بدون حساب</p>
      <p class="text-sm text-gray-600">جربها فوراً</p>
    </div>
    <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
      <div class="text-2xl mb-2">🎁</div>
      <p class="font-bold text-gray-900">مجاني بالكامل</p>
      <p class="text-sm text-gray-600">عناية بالبشرة متاحة للجميع</p>
    </div>
  </div>

  <div class="bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl p-8 text-center">
    <h3 class="text-2xl font-bold mb-3">🚀 جربها الآن!</h3>
    <p class="mb-4">قم بزيارة صفحة توصيات البشرة لتجربة تحليل الواقع المعزز واكتشاف حيوانك الروحي!</p>
  </div>
</div>`,
    contentRu: `<div class="blog-content">
  <div class="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-6 md:p-10 mb-10 text-center border border-purple-100">
    <div class="text-5xl mb-4">🚀</div>
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Будущее ухода за кожей — уже здесь!</h2>
    <p class="text-lg text-gray-600">Две революционные функции: AR-анализ кожи в реальном времени и игра «Тотемное животное»</p>
  </div>

  <div class="mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">⚡ AR-анализ кожи в реальном времени</h3>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      Наш новый инструмент AR-анализа использует искусственный интеллект для анализа вашей кожи в реальном времени через камеру устройства. Больше не нужно гадать о типе кожи — получите мгновенный профессиональный анализ.
    </p>
  </div>

  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-10">
    <h3 class="text-xl font-bold text-gray-900 mb-4">📊 Что анализируется</h3>
    <div class="grid md:grid-cols-2 gap-3">
      <div class="flex items-center gap-2"><span>💧</span> <span>Увлажнённость кожи</span></div>
      <div class="flex items-center gap-2"><span>✨</span> <span>Определение жирности</span></div>
      <div class="flex items-center gap-2"><span>🎯</span> <span>Анализ текстуры</span></div>
      <div class="flex items-center gap-2"><span>🎨</span> <span>Тон и равномерность кожи</span></div>
      <div class="flex items-center gap-2"><span>📅</span> <span>Оценка возраста</span></div>
      <div class="flex items-center gap-2"><span>🔍</span> <span>Анализ размера пор</span></div>
      <div class="flex items-center gap-2"><span>👁️</span> <span>Оценка зоны под глазами</span></div>
      <div class="flex items-center gap-2"><span>💪</span> <span>Упругость кожи</span></div>
      <div class="flex items-center gap-2"><span>☀️</span> <span>Обнаружение солнечных повреждений</span></div>
      <div class="flex items-center gap-2"><span>📏</span> <span>Шкала Фитцпатрика</span></div>
    </div>
  </div>

  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-10">
    <h3 class="text-xl font-bold text-gray-900 mb-4">📱 Как использовать</h3>
    <ol class="space-y-2 text-gray-700">
      <li><strong>1.</strong> Перейдите на страницу рекомендаций по коже</li>
      <li><strong>2.</strong> Нажмите кнопку Live AR</li>
      <li><strong>3.</strong> Разрешите доступ к камере</li>
      <li><strong>4.</strong> Расположите лицо в направляющем круге</li>
      <li><strong>5.</strong> Держите неподвижно для точных показаний</li>
      <li><strong>6.</strong> Нажмите, чтобы получить полный отчёт!</li>
    </ol>
  </div>

  <div class="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 md:p-10 mb-10 border border-amber-100">
    <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">🦁 Игра «Тотемное животное»</h3>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      Хотите повеселиться? Попробуйте нашу игру — весёлую пародию на анализ кожи, которая раскроет ваше тотемное животное!
    </p>
    <div class="space-y-2 text-gray-700">
      <p>🦁 Лев — «Рычи на увлажняющий крем. Настоящие короли не умываются.»</p>
      <p>🐼 Панда — «Тёмные круги? Это называется ОБРАЗ.»</p>
      <p>🦄 Единорог — «Нанесите радужные слёзы для эфирного сияния.»</p>
      <p>🔥 Феникс — «Сожги всё дотла — идеальный пилинг.»</p>
    </div>
  </div>

  <div class="grid md:grid-cols-3 gap-4 mb-10">
    <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
      <div class="text-2xl mb-2">🔐</div>
      <p class="font-bold text-gray-900">Приватность прежде всего</p>
      <p class="text-sm text-gray-600">Вся обработка на вашем устройстве</p>
    </div>
    <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
      <div class="text-2xl mb-2">⚡</div>
      <p class="font-bold text-gray-900">Без регистрации</p>
      <p class="text-sm text-gray-600">Попробуйте мгновенно</p>
    </div>
    <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
      <div class="text-2xl mb-2">🎁</div>
      <p class="font-bold text-gray-900">Полностью бесплатно</p>
      <p class="text-sm text-gray-600">Доступный уход для всех</p>
    </div>
  </div>

  <div class="bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl p-8 text-center">
    <h3 class="text-2xl font-bold mb-3">🚀 Попробуйте прямо сейчас!</h3>
    <p class="mb-4">Перейдите на страницу рекомендаций по коже, чтобы попробовать AR-анализ и узнать своё тотемное животное!</p>
  </div>
</div>`
  },

  // ----------------------------------------------------------
  // 2. PWA Install Guide
  // ----------------------------------------------------------
  'install-genosys-pwa-app-iphone-android-2025': {
    titleAr: '📱 ثبّت تطبيق GENOSYS على هاتفك — دليل سهل',
    excerptAr: 'احصل على تجربة تطبيق GENOSYS بدون تحميل من متاجر التطبيقات! تعلم كيفية تثبيت تطبيقنا التقدمي (PWA) على iPhone و iPad و Android مع دليلنا البسيط خطوة بخطوة.',
    titleRu: '📱 Установите приложение GENOSYS на телефон — простое руководство по PWA',
    excerptRu: 'Получите опыт приложения GENOSYS без загрузки из магазинов! Узнайте, как установить наше прогрессивное веб-приложение (PWA) на iPhone, iPad и Android с помощью пошагового руководства.',
    contentAr: `<div class="blog-content" dir="rtl">
  <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 md:p-10 mb-10 text-center border border-blue-100">
    <div class="text-5xl mb-4">📱</div>
    <h2 class="text-3xl font-bold text-gray-900 mb-3">متجرك المفضل للعناية بالبشرة، الآن كتطبيق!</h2>
    <p class="text-lg text-gray-600 mb-4">ثبّت GENOSYS مباشرة على شاشتك الرئيسية واستمتع بتجربة تطبيق أصلية — بدون متجر تطبيقات!</p>
  </div>

  <div class="mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">✨ لماذا تثبّت تطبيق PWA؟</h3>
    <div class="grid md:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
        <div class="text-2xl mb-2">🏠</div>
        <p class="font-bold text-gray-900">وصول سريع</p>
        <p class="text-sm text-gray-600">افتح GENOSYS بنقرة واحدة من شاشتك الرئيسية</p>
      </div>
      <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
        <div class="text-2xl mb-2">📱</div>
        <p class="font-bold text-gray-900">تجربة شاشة كاملة</p>
        <p class="text-sm text-gray-600">بدون أشرطة متصفح — تسوق بلا تشتيت</p>
      </div>
      <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
        <div class="text-2xl mb-2">⚡</div>
        <p class="font-bold text-gray-900">سرعة فائقة</p>
        <p class="text-sm text-gray-600">تحميل فوري وتصفح سلس</p>
      </div>
      <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
        <div class="text-2xl mb-2">🔔</div>
        <p class="font-bold text-gray-900">إشعارات الطلبات</p>
        <p class="text-sm text-gray-600">تابع حالة طلبك بتنبيهات فورية</p>
      </div>
      <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
        <div class="text-2xl mb-2">📴</div>
        <p class="font-bold text-gray-900">تصفح بدون إنترنت</p>
        <p class="text-sm text-gray-600">تصفح المنتجات والمفضلة بدون اتصال</p>
      </div>
      <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
        <div class="text-2xl mb-2">💾</div>
        <p class="font-bold text-gray-900">بدون مساحة تخزين</p>
        <p class="text-sm text-gray-600">يأخذ مساحة قليلة (~2 ميجابايت فقط)</p>
      </div>
    </div>
  </div>

  <div class="bg-blue-50 rounded-xl p-6 md:p-8 mb-10 border border-blue-100">
    <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">🍎 التثبيت على iPhone / iPad</h3>
    <ol class="space-y-3 text-gray-700">
      <li><strong>1.</strong> افتح genosys.ae في متصفح Safari</li>
      <li><strong>2.</strong> انقر على زر المشاركة (↑) في أسفل Safari</li>
      <li><strong>3.</strong> انقر على "إضافة إلى الشاشة الرئيسية"</li>
      <li><strong>4.</strong> انقر "إضافة" — ستظهر أيقونة GENOSYS على شاشتك الرئيسية!</li>
    </ol>
  </div>

  <div class="bg-green-50 rounded-xl p-6 md:p-8 mb-10 border border-green-100">
    <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">🤖 التثبيت على Android</h3>
    <ol class="space-y-3 text-gray-700">
      <li><strong>1.</strong> افتح genosys.ae في Google Chrome</li>
      <li><strong>2.</strong> انقر على قائمة النقاط الثلاث (⋮) في الزاوية العلوية</li>
      <li><strong>3.</strong> انقر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"</li>
      <li><strong>4.</strong> انقر "تثبيت" للتأكيد!</li>
    </ol>
  </div>

  <div class="text-center">
    <p class="text-gray-600">تفضل التطبيقات الأصلية؟ تطبيق iOS متوفر أيضاً!</p>
    <a href="https://apps.apple.com/app/id6756648064" class="text-primary-600 font-semibold hover:underline">📱 حمّل من App Store ←</a>
  </div>
</div>`,
    contentRu: `<div class="blog-content">
  <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 md:p-10 mb-10 text-center border border-blue-100">
    <div class="text-5xl mb-4">📱</div>
    <h2 class="text-3xl font-bold text-gray-900 mb-3">Ваш любимый магазин косметики — теперь как приложение!</h2>
    <p class="text-lg text-gray-600 mb-4">Установите GENOSYS прямо на домашний экран и наслаждайтесь нативным приложением — без магазина приложений!</p>
  </div>

  <div class="mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">✨ Зачем устанавливать PWA?</h3>
    <div class="grid md:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
        <div class="text-2xl mb-2">🏠</div>
        <p class="font-bold text-gray-900">Быстрый доступ</p>
        <p class="text-sm text-gray-600">Открывайте GENOSYS одним нажатием с домашнего экрана</p>
      </div>
      <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
        <div class="text-2xl mb-2">📱</div>
        <p class="font-bold text-gray-900">Полноэкранный режим</p>
        <p class="text-sm text-gray-600">Без панелей браузера — полное погружение в шопинг</p>
      </div>
      <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
        <div class="text-2xl mb-2">⚡</div>
        <p class="font-bold text-gray-900">Молниеносная скорость</p>
        <p class="text-sm text-gray-600">Мгновенная загрузка и плавная навигация</p>
      </div>
      <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
        <div class="text-2xl mb-2">🔔</div>
        <p class="font-bold text-gray-900">Уведомления о заказах</p>
        <p class="text-sm text-gray-600">Следите за статусом заказа в реальном времени</p>
      </div>
      <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
        <div class="text-2xl mb-2">📴</div>
        <p class="font-bold text-gray-900">Офлайн-просмотр</p>
        <p class="text-sm text-gray-600">Смотрите товары и избранное без интернета</p>
      </div>
      <div class="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
        <div class="text-2xl mb-2">💾</div>
        <p class="font-bold text-gray-900">Без места на диске</p>
        <p class="text-sm text-gray-600">Занимает всего ~2 МБ, не как обычные приложения</p>
      </div>
    </div>
  </div>

  <div class="bg-blue-50 rounded-xl p-6 md:p-8 mb-10 border border-blue-100">
    <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">🍎 Установка на iPhone / iPad</h3>
    <ol class="space-y-3 text-gray-700">
      <li><strong>1.</strong> Откройте genosys.ae в браузере Safari</li>
      <li><strong>2.</strong> Нажмите кнопку «Поделиться» (↑) внизу Safari</li>
      <li><strong>3.</strong> Нажмите «На экран Домой»</li>
      <li><strong>4.</strong> Нажмите «Добавить» — иконка GENOSYS появится на домашнем экране!</li>
    </ol>
  </div>

  <div class="bg-green-50 rounded-xl p-6 md:p-8 mb-10 border border-green-100">
    <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">🤖 Установка на Android</h3>
    <ol class="space-y-3 text-gray-700">
      <li><strong>1.</strong> Откройте genosys.ae в Google Chrome</li>
      <li><strong>2.</strong> Нажмите меню с тремя точками (⋮) в правом верхнем углу</li>
      <li><strong>3.</strong> Нажмите «Установить приложение» или «Добавить на главный экран»</li>
      <li><strong>4.</strong> Нажмите «Установить» для подтверждения!</li>
    </ol>
  </div>

  <div class="text-center">
    <p class="text-gray-600">Предпочитаете нативные приложения? Наше iOS-приложение тоже доступно!</p>
    <a href="https://apps.apple.com/app/id6756648064" class="text-primary-600 font-semibold hover:underline">📱 Скачать из App Store →</a>
  </div>
</div>`
  },

  // ----------------------------------------------------------
  // 3. Payment Options
  // ----------------------------------------------------------
  'new-stripe-payment-options-apple-pay-google-pay-2025': {
    titleAr: 'خيارات دفع جديدة: ادفع بسهولة عبر Apple Pay و Google Pay والمزيد',
    excerptAr: 'استمتع بتجربة دفع سلسة مع نظام الدفع الجديد من Stripe. الآن يدعم Apple Pay و Google Pay و Link وجميع بطاقات الائتمان الرئيسية للدفع الآمن والفوري.',
    titleRu: 'Новые способы оплаты: Apple Pay, Google Pay и другие',
    excerptRu: 'Оцените удобство оформления заказа с новой платёжной системой Stripe. Теперь поддерживаются Apple Pay, Google Pay, Link и все основные кредитные карты для безопасной и мгновенной оплаты.',
    contentAr: `<div class="blog-content" dir="rtl">
  <div class="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 md:p-10 mb-10 text-center border border-green-100">
    <div class="text-5xl mb-4">🚀</div>
    <h2 class="text-3xl font-bold text-gray-900 mb-3">أخبار مثيرة: تجربة دفع محسّنة</h2>
    <p class="text-lg text-gray-600">نظام الدفع الجديد من Stripe يدعم طرق دفع متعددة لجعل التسوق أسهل من أي وقت مضى.</p>
  </div>

  <div class="mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">💳 خيارات الدفع المتاحة</h3>
    <div class="grid md:grid-cols-2 gap-5">
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h4 class="font-bold text-gray-900 mb-2">🍎 Apple Pay</h4>
        <p class="text-gray-600 text-sm">ادفع فوراً باستخدام Touch ID أو Face ID أو Apple Watch. معلومات الدفع محمية بأمان Apple المتقدم.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h4 class="font-bold text-gray-900 mb-2">📱 Google Pay</h4>
        <p class="text-gray-600 text-sm">لمستخدمي Android — دفع سلس وسريع وآمن بنقرات قليلة فقط.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h4 class="font-bold text-gray-900 mb-2">🔗 Link من Stripe</h4>
        <p class="text-gray-600 text-sm">احفظ معلومات الدفع بأمان واستمتع بالدفع بنقرة واحدة عبر جميع متاجرك المفضلة.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h4 class="font-bold text-gray-900 mb-2">💳 بطاقات الائتمان والخصم</h4>
        <p class="text-gray-600 text-sm">نقبل جميع البطاقات الرئيسية بما في ذلك Visa و Mastercard و American Express وبطاقات البنوك الإماراتية.</p>
      </div>
    </div>
  </div>

  <div class="bg-gray-50 rounded-xl p-6 mb-10 border border-gray-100">
    <h3 class="text-xl font-bold text-gray-900 mb-4">✨ لماذا هذا مهم لك</h3>
    <ul class="space-y-2 text-gray-700">
      <li>🔒 <strong>أمان محسّن:</strong> جميع المدفوعات تُعالج عبر بنية Stripe الأمنية الرائدة</li>
      <li>⚡ <strong>دفع أسرع:</strong> أكمل عملية الشراء في ثوانٍ مع طرق الدفع المحفوظة</li>
      <li>🌍 <strong>دعم عالمي:</strong> يعمل بسلاسة في الإمارات والخليج وعالمياً</li>
      <li>📱 <strong>محسّن للموبايل:</strong> تجربة دفع مثالية على أي جهاز</li>
      <li>🛡️ <strong>حماية من الاحتيال:</strong> كشف احتيال متقدم يحافظ على أمان مدفوعاتك</li>
    </ul>
  </div>

  <div class="bg-gradient-to-r from-primary-600 to-green-600 text-white rounded-xl p-8 text-center">
    <h3 class="text-2xl font-bold mb-3">🎉 جاهز لتجربة مستقبل الدفع؟</h3>
    <p>قم بزيارة متجرنا الآن وجرب تجربة الدفع الجديدة!</p>
  </div>
</div>`,
    contentRu: `<div class="blog-content">
  <div class="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 md:p-10 mb-10 text-center border border-green-100">
    <div class="text-5xl mb-4">🚀</div>
    <h2 class="text-3xl font-bold text-gray-900 mb-3">Отличные новости: улучшенная оплата</h2>
    <p class="text-lg text-gray-600">Новая платёжная система Stripe поддерживает множество способов оплаты для максимально удобных покупок.</p>
  </div>

  <div class="mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">💳 Доступные способы оплаты</h3>
    <div class="grid md:grid-cols-2 gap-5">
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h4 class="font-bold text-gray-900 mb-2">🍎 Apple Pay</h4>
        <p class="text-gray-600 text-sm">Мгновенная оплата через Touch ID, Face ID или Apple Watch. Данные защищены передовой системой безопасности Apple.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h4 class="font-bold text-gray-900 mb-2">📱 Google Pay</h4>
        <p class="text-gray-600 text-sm">Для пользователей Android — быстрая, безопасная и удобная оплата в несколько нажатий.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h4 class="font-bold text-gray-900 mb-2">🔗 Link от Stripe</h4>
        <p class="text-gray-600 text-sm">Сохраните данные оплаты и оплачивайте в один клик во всех любимых магазинах.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h4 class="font-bold text-gray-900 mb-2">💳 Кредитные и дебетовые карты</h4>
        <p class="text-gray-600 text-sm">Принимаем все основные карты: Visa, Mastercard, American Express и местные карты ОАЭ.</p>
      </div>
    </div>
  </div>

  <div class="bg-gray-50 rounded-xl p-6 mb-10 border border-gray-100">
    <h3 class="text-xl font-bold text-gray-900 mb-4">✨ Почему это важно для вас</h3>
    <ul class="space-y-2 text-gray-700">
      <li>🔒 <strong>Усиленная безопасность:</strong> все платежи обрабатываются через ведущую инфраструктуру Stripe</li>
      <li>⚡ <strong>Быстрая оплата:</strong> завершите покупку за секунды с сохранёнными способами оплаты</li>
      <li>🌍 <strong>Глобальная поддержка:</strong> работает в ОАЭ, странах Персидского залива и по всему миру</li>
      <li>📱 <strong>Оптимизация для мобильных:</strong> идеальная оплата на любом устройстве</li>
      <li>🛡️ <strong>Защита от мошенничества:</strong> продвинутое обнаружение мошенничества для безопасных платежей</li>
    </ul>
  </div>

  <div class="bg-gradient-to-r from-primary-600 to-green-600 text-white rounded-xl p-8 text-center">
    <h3 class="text-2xl font-bold mb-3">🎉 Готовы попробовать новую оплату?</h3>
    <p>Посетите наш магазин и оцените обновлённый процесс оформления заказа!</p>
  </div>
</div>`
  },

  // ----------------------------------------------------------
  // 4. Website in 3 Languages
  // ----------------------------------------------------------
  'genosys-website-now-available-in-3-languages': {
    titleAr: '🌍 موقع GENOSYS متاح الآن بثلاث لغات!',
    excerptAr: 'يسعدنا الإعلان عن أن موقعنا أصبح متاحاً باللغات الإنجليزية والعربية والروسية! انضم إلى مجتمعنا المتنوع من العملاء من جميع أنحاء العالم.',
    titleRu: '🌍 Сайт GENOSYS теперь доступен на 3 языках!',
    excerptRu: 'Мы рады сообщить, что наш сайт теперь доступен на английском, арабском и русском языках! Присоединяйтесь к нашему многообразному сообществу клиентов со всего мира.',
    contentAr: `<div class="blog-content" dir="rtl">
  <div class="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 md:p-10 mb-10 text-center border border-blue-100">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">🌍 موقع GENOSYS متاح الآن بثلاث لغات!</h2>
    <p class="text-xl text-gray-600">English • العربية • Русский</p>
  </div>

  <div class="mb-10">
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      يسعدنا الإعلان عن إنجاز كبير لـ GENOSYS الشرق الأوسط! موقعنا متاح الآن بثلاث لغات: الإنجليزية والعربية والروسية.
    </p>
    <p class="text-lg text-gray-700 leading-relaxed">
      هذا ليس مجرد ترجمة — إنه تواصل مع مجتمعنا الرائع من العملاء من ثقافات وخلفيات متنوعة في الإمارات وخارجها.
    </p>
  </div>

  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-10">
    <h3 class="text-xl font-bold text-gray-900 mb-4">✨ ماذا يعني هذا لك</h3>
    <ul class="space-y-2 text-gray-700">
      <li>🛍️ تسوق بلغتك المفضلة — تصفح مجموعتنا بالإنجليزية أو العربية أو الروسية</li>
      <li>✅ تجربة سلسة — جميع أوصاف المنتجات والدفع وخدمة العملاء بلغتك</li>
      <li>🌍 شمولية ثقافية — نحتفل بتنوع عملائنا</li>
      <li>📖 فهم أفضل — اقرأ عن منتجاتنا ومكوناتنا بلغتك المريحة</li>
    </ul>
  </div>

  <div class="bg-gray-50 rounded-xl p-6 mb-10 border border-gray-100">
    <h3 class="text-xl font-bold text-gray-900 mb-4">🚀 كيفية تبديل اللغة</h3>
    <p class="text-gray-700 mb-3">تبديل اللغة سهل جداً! ابحث عن محوّل اللغة في شريط التنقل العلوي:</p>
    <ul class="space-y-1 text-gray-700">
      <li><strong>EN</strong> للإنجليزية</li>
      <li><strong>AR</strong> للعربية</li>
      <li><strong>RU</strong> للروسية</li>
    </ul>
    <p class="text-gray-600 mt-3">سيتم حفظ تفضيل لغتك تلقائياً!</p>
  </div>

  <div class="bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl p-8 text-center">
    <h3 class="text-2xl font-bold mb-3">💫 مستعد للاستكشاف؟</h3>
    <p class="mb-2">تصفح مجموعتنا الكاملة من مستحضرات العناية بالبشرة الكورية الاحترافية بلغتك المفضلة.</p>
    <p class="font-semibold">شحن مجاني للطلبات فوق 1,000 درهم في جميع أنحاء الإمارات! 🚚</p>
  </div>
</div>`,
    contentRu: `<div class="blog-content">
  <div class="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 md:p-10 mb-10 text-center border border-blue-100">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">🌍 Сайт GENOSYS теперь на 3 языках!</h2>
    <p class="text-xl text-gray-600">English • العربية • Русский</p>
  </div>

  <div class="mb-10">
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      Мы рады сообщить о важном событии для GENOSYS Middle East! Наш сайт теперь доступен на трёх языках: английском, арабском и русском.
    </p>
    <p class="text-lg text-gray-700 leading-relaxed">
      Это не просто перевод — это связь с нашим замечательным сообществом клиентов из разных культур и стран, живущих в ОАЭ и за их пределами.
    </p>
  </div>

  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-10">
    <h3 class="text-xl font-bold text-gray-900 mb-4">✨ Что это значит для вас</h3>
    <ul class="space-y-2 text-gray-700">
      <li>🛍️ Покупайте на своём языке — просматривайте коллекцию на английском, арабском или русском</li>
      <li>✅ Бесшовный опыт — описания товаров, оплата и поддержка на вашем языке</li>
      <li>🌍 Культурная инклюзивность — мы ценим разнообразие наших клиентов</li>
      <li>📖 Лучшее понимание — читайте о продуктах и ингредиентах на удобном языке</li>
    </ul>
  </div>

  <div class="bg-gray-50 rounded-xl p-6 mb-10 border border-gray-100">
    <h3 class="text-xl font-bold text-gray-900 mb-4">🚀 Как переключить язык</h3>
    <p class="text-gray-700 mb-3">Переключение языка очень простое! Найдите переключатель в верхней панели навигации:</p>
    <ul class="space-y-1 text-gray-700">
      <li><strong>EN</strong> — English</li>
      <li><strong>AR</strong> — العربية (арабский)</li>
      <li><strong>RU</strong> — Русский</li>
    </ul>
    <p class="text-gray-600 mt-3">Ваш выбор языка сохранится автоматически!</p>
  </div>

  <div class="bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl p-8 text-center">
    <h3 class="text-2xl font-bold mb-3">💫 Готовы к покупкам?</h3>
    <p class="mb-2">Просматривайте полную коллекцию профессиональной корейской дермакосметики на вашем языке.</p>
    <p class="font-semibold">Бесплатная доставка при заказе от 1 000 дирхамов по всем ОАЭ! 🚚</p>
  </div>
</div>`
  },

  // ----------------------------------------------------------
  // 5. BIO-MESO PDRN Ampoule (technical — keep concise translations)
  // ----------------------------------------------------------
  '2025-genosys-new-products-bio-meso-pdrn-ampoule-mask-pack': {
    titleAr: '2025 منتج GENOSYS الجديد — أمبول BIO-MESO PDRN',
    excerptAr: 'اكتشف أحدث ابتكارات GENOSYS لعام 2025: أمبول BIO-MESO PDRN EXPERT 60000 وأمبول HOMECARE 5000. تقنية PDRN البيولوجية المتقدمة بتركيز 60,000ppm للمحترفين و5,000ppm للعناية المنزلية لتجديد استثنائي للبشرة.',
    titleRu: 'Новинка GENOSYS 2025 — ампула BIO-MESO PDRN',
    excerptRu: 'Откройте для себя новейшую разработку GENOSYS 2025: BIO-MESO PDRN EXPERT AMPOULE 60000 и HOMECARE AMPOULE 5000. Передовая биотехнология PDRN с профессиональной концентрацией 60 000 ppm и домашней формулой 5 000 ppm для исключительной регенерации кожи.',
    contentAr: null,  // Keep English content for this technical post (too complex for translation)
    contentRu: null   // Keep English content for this technical post
  },

  // ----------------------------------------------------------
  // 6. Growth Factors in Skincare (technical — keep concise translations)
  // ----------------------------------------------------------
  'what-are-growth-factors-in-skincare': {
    titleAr: 'ما هي عوامل النمو في العناية بالبشرة — ولماذا تحبها بشرتك',
    excerptAr: 'اكتشف كيف تحوّل عوامل النمو العناية الاحترافية بالبشرة من خلال إصلاح وترميم وتجديد البشرة على المستوى الخلوي. تعرف على دورها في مكافحة الشيخوخة وكيف يستخدم قناع GENOSYS Bio-Ferment Age-Defying قوتها.',
    titleRu: 'Что такое факторы роста в уходе за кожей — и почему ваша кожа их любит',
    excerptRu: 'Узнайте, как факторы роста преображают профессиональный уход за кожей, восстанавливая и регенерируя кожу на клеточном уровне. О роли факторов роста в антивозрастном уходе и о маске GENOSYS Bio-Ferment Age-Defying Powder Mask.',
    contentAr: null,  // Keep English content for this technical post
    contentRu: null   // Keep English content for this technical post
  },
}

// ============================================================
// RUN UPDATES
// ============================================================

async function addTranslations() {
  try {
    console.log('🌍 Adding missing Arabic & Russian translations for blog posts...')
    console.log('')

    let updated = 0
    let skipped = 0

    for (const [slug, data] of Object.entries(translations)) {
      const post = await prisma.blogPost.findUnique({ where: { slug } })

      if (!post) {
        console.log(`⚠️  Post not found: "${slug}" — skipping`)
        skipped++
        continue
      }

      // Build update data — only set fields that are provided and not already set
      const updateData = {}

      if (data.titleAr && !post.titleAr) updateData.titleAr = data.titleAr
      if (data.excerptAr && !post.excerptAr) updateData.excerptAr = data.excerptAr
      if (data.contentAr && !post.contentAr) updateData.contentAr = data.contentAr
      if (data.titleRu && !post.titleRu) updateData.titleRu = data.titleRu
      if (data.excerptRu && !post.excerptRu) updateData.excerptRu = data.excerptRu
      if (data.contentRu && !post.contentRu) updateData.contentRu = data.contentRu

      if (Object.keys(updateData).length === 0) {
        console.log(`✅ "${slug}" — already has translations, skipping`)
        skipped++
        continue
      }

      await prisma.blogPost.update({
        where: { slug },
        data: updateData,
      })

      const fields = Object.keys(updateData).join(', ')
      console.log(`✅ "${slug}" — added: ${fields}`)
      updated++
    }

    console.log('')
    console.log(`🎉 Done! Updated: ${updated}, Skipped: ${skipped}`)
    console.log('')
    console.log('🌐 Verify translations:')
    console.log('   AR: https://genosys.ae/ar/blog')
    console.log('   RU: https://genosys.ae/ru/blog')

    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

addTranslations()
