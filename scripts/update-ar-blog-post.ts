import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')
}

const prisma = new PrismaClient({
  accelerateUrl: databaseUrl,
  log: ['error']
})

async function updateBlogPost() {
  const slug = 'ar-skin-analysis-power-animal-tools'
  
  const htmlContent = `
<div class="blog-content space-y-8">
  <div class="intro-section bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border-2 border-amber-200 rounded-xl p-6 md:p-8 mb-8">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">🚀 The Future of Skincare is Here!</h2>
    <p class="text-xl text-gray-700 text-center">Two groundbreaking features: <strong class="text-primary-600">Live AR Skin Analysis</strong> & <strong class="text-amber-600">Power Animal Game</strong></p>
  </div>

  <div class="section mb-10">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">⚡ Live AR Skin Analysis</h2>
    <p class="text-lg text-gray-700 leading-relaxed mb-6">Our new <strong>Live AR Skin Analysis</strong> tool uses advanced artificial intelligence to analyze your skin in real-time through your device's camera. No more guessing about your skin type or concerns—get instant, professional-grade insights right from your phone or computer.</p>
    
    <div class="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">📊 What It Analyzes</h3>
      <div class="grid gap-3 md:grid-cols-2">
        <div class="flex items-start gap-2"><span class="text-primary-600">💧</span><span><strong>Skin Hydration</strong> - Moisture levels in real-time</span></div>
        <div class="flex items-start gap-2"><span class="text-primary-600">✨</span><span><strong>Oiliness Detection</strong> - T-zone and oil production</span></div>
        <div class="flex items-start gap-2"><span class="text-primary-600">🎯</span><span><strong>Texture Analysis</strong> - Smoothness and pore visibility</span></div>
        <div class="flex items-start gap-2"><span class="text-primary-600">🎨</span><span><strong>Skin Tone & Evenness</strong> - Pigmentation uniformity</span></div>
        <div class="flex items-start gap-2"><span class="text-primary-600">📅</span><span><strong>Age Estimation</strong> - Estimated skin age</span></div>
        <div class="flex items-start gap-2"><span class="text-primary-600">👤</span><span><strong>Gender Detection</strong> - Personalized recommendations</span></div>
      </div>
    </div>

    <div class="bg-gradient-to-r from-primary-50 to-red-50 border border-primary-200 rounded-xl p-6 mb-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">🔬 Advanced Metrics</h3>
      <div class="grid gap-3 md:grid-cols-2">
        <div class="flex items-start gap-2"><span>🔍</span><span><strong>Pore Size Analysis</strong> - Enlarged pore detection</span></div>
        <div class="flex items-start gap-2"><span>👁️</span><span><strong>Under-Eye Assessment</strong> - Dark circles, puffiness</span></div>
        <div class="flex items-start gap-2"><span>💪</span><span><strong>Skin Firmness</strong> - Elasticity estimation</span></div>
        <div class="flex items-start gap-2"><span>☀️</span><span><strong>Sun Damage Detection</strong> - UV damage indicators</span></div>
        <div class="flex items-start gap-2"><span>💋</span><span><strong>Lip Condition</strong> - Dryness & color health</span></div>
        <div class="flex items-start gap-2"><span>📏</span><span><strong>Fitzpatrick Scale</strong> - Skin phototype (I-VI)</span></div>
      </div>
    </div>

    <div class="bg-gray-50 border border-gray-200 rounded-xl p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">📱 How to Use</h3>
      <ol class="space-y-2 text-gray-700">
        <li class="flex items-start gap-3"><span class="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span><span>Visit our <strong>Skin Recommendation</strong> page</span></li>
        <li class="flex items-start gap-3"><span class="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span><span>Click on <strong>Live AR</strong> button</span></li>
        <li class="flex items-start gap-3"><span class="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span><span>Allow camera access when prompted</span></li>
        <li class="flex items-start gap-3"><span class="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span><span>Position your face in the guide circle</span></li>
        <li class="flex items-start gap-3"><span class="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</span><span>Hold steady for accurate readings</span></li>
        <li class="flex items-start gap-3"><span class="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">6</span><span>Tap to capture your full analysis report!</span></li>
      </ol>
    </div>
  </div>

  <hr class="border-gray-200 my-10" />

  <div class="section mb-10">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">🦁 Power Animal Game</h2>
    <p class="text-lg text-gray-700 leading-relaxed mb-6">Looking for something fun? Try our <strong class="text-amber-600">Power Animal</strong> game—a hilarious parody of professional skin analysis that reveals your inner spirit animal!</p>
    
    <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">🎮 How It Works</h3>
      <ol class="space-y-2 text-gray-700">
        <li class="flex items-start gap-3"><span class="bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span><span>Take a selfie using your camera</span></li>
        <li class="flex items-start gap-3"><span class="bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span><span>Our "AI" analyzes your spirit energy</span></li>
        <li class="flex items-start gap-3"><span class="bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span><span>Discover which of <strong>20 unique animals</strong> matches your essence</span></li>
        <li class="flex items-start gap-3"><span class="bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span><span>Get your <strong>Resemblance Score</strong> (spoiler: it's always high!)</span></li>
        <li class="flex items-start gap-3"><span class="bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</span><span>Receive your personalized <strong>Skin Routine</strong>... based on your animal's habitat!</span></li>
      </ol>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">🐾 Meet the Power Animals</h3>
      <p class="text-gray-700 mb-4">From the <strong>Majestic Lion</strong> to the <strong>Mystical Unicorn</strong>, each animal comes with unique personality traits, a hilarious habitat-based skincare routine, and a beautiful animated reveal!</p>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="bg-amber-50 rounded-lg p-4"><span class="text-2xl">🦁</span> <strong>Lion</strong> - "Roar at moisturizer. Real kings don't bathe."</div>
        <div class="bg-gray-50 rounded-lg p-4"><span class="text-2xl">🐼</span> <strong>Panda</strong> - "Those dark circles? That's called a LOOK."</div>
        <div class="bg-pink-50 rounded-lg p-4"><span class="text-2xl">🦄</span> <strong>Unicorn</strong> - "Apply rainbow tears for that ethereal glow."</div>
        <div class="bg-red-50 rounded-lg p-4"><span class="text-2xl">🔥</span> <strong>Phoenix</strong> - "Burn it all down—ultimate exfoliation."</div>
      </div>
    </div>
  </div>

  <hr class="border-gray-200 my-10" />

  <div class="section mb-10">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">🔒 Why We Built These Tools</h2>
    <p class="text-lg text-gray-700 leading-relaxed mb-6">At GENOSYS, we believe skincare should be both <strong>effective</strong> and <strong>enjoyable</strong>.</p>
    <div class="grid gap-4 md:grid-cols-3">
      <div class="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
        <span class="text-3xl mb-2 block">🔐</span>
        <strong class="text-gray-900">Privacy-First</strong>
        <p class="text-sm text-gray-600 mt-1">All processing on your device</p>
      </div>
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
        <span class="text-3xl mb-2 block">⚡</span>
        <strong class="text-gray-900">No Account Required</strong>
        <p class="text-sm text-gray-600 mt-1">Try them instantly</p>
      </div>
      <div class="bg-purple-50 border border-purple-200 rounded-xl p-5 text-center">
        <span class="text-3xl mb-2 block">🎁</span>
        <strong class="text-gray-900">Completely Free</strong>
        <p class="text-sm text-gray-600 mt-1">Accessible skincare for all</p>
      </div>
    </div>
  </div>

  <div class="cta-section bg-gradient-to-r from-primary-600 to-red-600 rounded-xl p-8 text-center text-white">
    <h2 class="text-2xl md:text-3xl font-bold mb-4">🚀 Try It Now!</h2>
    <p class="text-lg mb-6 opacity-90">Visit our Skin Recommendation page to try Live AR analysis and discover your Power Animal!</p>
    <a href="/skin-recommendation" class="inline-block bg-white text-primary-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors">Get Started →</a>
  </div>

  <p class="text-center text-gray-500 mt-8"><em>Questions? Contact us at <a href="mailto:sales@genosys.ae" class="text-primary-600 hover:underline">sales@genosys.ae</a></em></p>
</div>
`

  const htmlContentAr = `
<div class="blog-content space-y-8" dir="rtl">
  <div class="intro-section bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border-2 border-amber-200 rounded-xl p-6 md:p-8 mb-8">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">🚀 مستقبل العناية بالبشرة هنا!</h2>
    <p class="text-xl text-gray-700 text-center">ميزتان رائدتان: <strong class="text-primary-600">تحليل AR المباشر</strong> و <strong class="text-amber-600">لعبة حيوان القوة</strong></p>
  </div>

  <div class="section mb-10">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">⚡ تحليل البشرة المباشر بـ AR</h2>
    <p class="text-lg text-gray-700 leading-relaxed mb-6">أداة تحليل البشرة الجديدة تستخدم الذكاء الاصطناعي المتقدم لتحليل بشرتك في الوقت الفعلي.</p>
    
    <div class="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">📊 ما يحلله</h3>
      <div class="grid gap-3 md:grid-cols-2">
        <div class="flex items-start gap-2"><span>💧</span><span><strong>ترطيب البشرة</strong></span></div>
        <div class="flex items-start gap-2"><span>✨</span><span><strong>كشف الدهون</strong></span></div>
        <div class="flex items-start gap-2"><span>🎯</span><span><strong>تحليل الملمس</strong></span></div>
        <div class="flex items-start gap-2"><span>🎨</span><span><strong>لون البشرة</strong></span></div>
        <div class="flex items-start gap-2"><span>📅</span><span><strong>تقدير العمر</strong></span></div>
        <div class="flex items-start gap-2"><span>👤</span><span><strong>كشف الجنس</strong></span></div>
      </div>
    </div>
  </div>

  <div class="section mb-10">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">🦁 لعبة حيوان القوة</h2>
    <p class="text-lg text-gray-700 leading-relaxed mb-6">جرب لعبة <strong class="text-amber-600">حيوان القوة</strong> - محاكاة ساخرة مضحكة تكشف عن حيوانك الروحي!</p>
    
    <div class="grid gap-4 md:grid-cols-2">
      <div class="bg-amber-50 rounded-lg p-4"><span class="text-2xl">🦁</span> <strong>الأسد</strong></div>
      <div class="bg-gray-50 rounded-lg p-4"><span class="text-2xl">🐼</span> <strong>الباندا</strong></div>
      <div class="bg-pink-50 rounded-lg p-4"><span class="text-2xl">🦄</span> <strong>يونيكورن</strong></div>
      <div class="bg-red-50 rounded-lg p-4"><span class="text-2xl">🔥</span> <strong>العنقاء</strong></div>
    </div>
  </div>

  <div class="cta-section bg-gradient-to-r from-primary-600 to-red-600 rounded-xl p-8 text-center text-white">
    <h2 class="text-2xl md:text-3xl font-bold mb-4">🚀 جربه الآن!</h2>
    <a href="/ar/skin-recommendation" class="inline-block bg-white text-primary-600 font-bold py-3 px-8 rounded-full">ابدأ الآن →</a>
  </div>

  <p class="text-center text-gray-500 mt-8"><em>أسئلة؟ تواصل معنا على <a href="mailto:sales@genosys.ae" class="text-primary-600">sales@genosys.ae</a></em></p>
</div>
`

  const htmlContentRu = `
<div class="blog-content space-y-8">
  <div class="intro-section bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border-2 border-amber-200 rounded-xl p-6 md:p-8 mb-8">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">🚀 Будущее ухода за кожей уже здесь!</h2>
    <p class="text-xl text-gray-700 text-center">Две инновационные функции: <strong class="text-primary-600">AR-анализ кожи</strong> и <strong class="text-amber-600">Power Animal</strong></p>
  </div>

  <div class="section mb-10">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">⚡ AR-анализ кожи в реальном времени</h2>
    <p class="text-lg text-gray-700 leading-relaxed mb-6">Наш новый инструмент использует ИИ для анализа вашей кожи через камеру устройства.</p>
    
    <div class="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">📊 Что анализируется</h3>
      <div class="grid gap-3 md:grid-cols-2">
        <div class="flex items-start gap-2"><span>💧</span><span><strong>Увлажнённость</strong> - уровень влаги</span></div>
        <div class="flex items-start gap-2"><span>✨</span><span><strong>Жирность</strong> - выработка кожного сала</span></div>
        <div class="flex items-start gap-2"><span>🎯</span><span><strong>Текстура</strong> - гладкость кожи</span></div>
        <div class="flex items-start gap-2"><span>🎨</span><span><strong>Тон кожи</strong> - пигментация</span></div>
        <div class="flex items-start gap-2"><span>📅</span><span><strong>Возраст кожи</strong> - оценка</span></div>
        <div class="flex items-start gap-2"><span>👤</span><span><strong>Пол</strong> - для рекомендаций</span></div>
      </div>
    </div>
  </div>

  <div class="section mb-10">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">🦁 Игра Power Animal</h2>
    <p class="text-lg text-gray-700 leading-relaxed mb-6">Попробуйте <strong class="text-amber-600">Power Animal</strong> — забавную пародию на анализ кожи!</p>
    
    <div class="grid gap-4 md:grid-cols-2">
      <div class="bg-amber-50 rounded-lg p-4"><span class="text-2xl">🦁</span> <strong>Лев</strong> - "Рычи на увлажняющий крем"</div>
      <div class="bg-gray-50 rounded-lg p-4"><span class="text-2xl">🐼</span> <strong>Панда</strong> - "Тёмные круги? Это стиль!"</div>
      <div class="bg-pink-50 rounded-lg p-4"><span class="text-2xl">🦄</span> <strong>Единорог</strong> - "Радужные слёзы для сияния"</div>
      <div class="bg-red-50 rounded-lg p-4"><span class="text-2xl">🔥</span> <strong>Феникс</strong> - "Сожги всё — идеальный пилинг"</div>
    </div>
  </div>

  <div class="cta-section bg-gradient-to-r from-primary-600 to-red-600 rounded-xl p-8 text-center text-white">
    <h2 class="text-2xl md:text-3xl font-bold mb-4">🚀 Попробуйте сейчас!</h2>
    <a href="/ru/skin-recommendation" class="inline-block bg-white text-primary-600 font-bold py-3 px-8 rounded-full">Начать →</a>
  </div>

  <p class="text-center text-gray-500 mt-8"><em>Вопросы? Пишите на <a href="mailto:sales@genosys.ae" class="text-primary-600">sales@genosys.ae</a></em></p>
</div>
`

  const updated = await prisma.blogPost.update({
    where: { slug },
    data: {
      content: htmlContent,
      contentAr: htmlContentAr,
      contentRu: htmlContentRu,
      updatedAt: new Date()
    }
  })

  console.log('Blog post updated with HTML content:', updated.title)
  console.log('URL: https://genosys.ae/blog/' + updated.slug)
}

updateBlogPost()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
