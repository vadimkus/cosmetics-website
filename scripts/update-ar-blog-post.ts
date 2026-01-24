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
<h2>The Future of Skincare is Here</h2>

<p>At GENOSYS, we're always pushing the boundaries of skincare technology. Today, we're excited to introduce two groundbreaking features that combine cutting-edge AI with engaging experiences: <strong>Live AR Skin Analysis</strong> and the <strong>Power Animal Game</strong>.</p>

<hr />

<h2>Live AR Skin Analysis: Real-Time Insights</h2>

<p>Our new <strong>Live AR Skin Analysis</strong> tool uses advanced artificial intelligence to analyze your skin in real-time through your device's camera. No more guessing about your skin type or concerns—get instant, professional-grade insights right from your phone or computer.</p>

<h3>What It Analyzes</h3>

<ul>
  <li><strong>Skin Hydration</strong> - Measure your skin's moisture levels in real-time</li>
  <li><strong>Oiliness Detection</strong> - Identify T-zone and overall oil production</li>
  <li><strong>Texture Analysis</strong> - Assess skin smoothness and pore visibility</li>
  <li><strong>Skin Tone & Evenness</strong> - Analyze pigmentation and color uniformity</li>
  <li><strong>Age Estimation</strong> - Get an estimated skin age based on multiple factors</li>
  <li><strong>Gender Detection</strong> - Automatic detection for personalized recommendations</li>
</ul>

<h3>Advanced Metrics</h3>

<p>We've also added professional-grade analysis for:</p>

<ul>
  <li><strong>Pore Size Analysis</strong> - Detect enlarged pores on nose and cheeks</li>
  <li><strong>Under-Eye Assessment</strong> - Dark circles, puffiness, and fine lines</li>
  <li><strong>Skin Firmness</strong> - Estimate elasticity and sagging</li>
  <li><strong>Sun Damage Detection</strong> - UV damage indicators and freckling patterns</li>
  <li><strong>Lip Condition</strong> - Dryness, color health analysis</li>
  <li><strong>Fitzpatrick Scale</strong> - Skin phototype classification (I-VI)</li>
</ul>

<h3>How to Use</h3>

<ol>
  <li>Visit our <strong>Skin Recommendation</strong> page</li>
  <li>Click on <strong>Live AR</strong> button</li>
  <li>Allow camera access when prompted</li>
  <li>Position your face in the guide circle</li>
  <li>Hold steady for accurate readings</li>
  <li>Tap to capture your full analysis report!</li>
</ol>

<hr />

<h2>Power Animal Game: Discover Your Spirit Creature</h2>

<p>Looking for something fun? Try our <strong>Power Animal</strong> game—a hilarious parody of professional skin analysis that reveals your inner spirit animal!</p>

<h3>How It Works</h3>

<ol>
  <li>Take a selfie using your camera</li>
  <li>Our "AI" analyzes your spirit energy</li>
  <li>Discover which of <strong>20 unique animals</strong> matches your essence</li>
  <li>Get your <strong>Resemblance Score</strong> (spoiler: it's always impressively high!)</li>
  <li>Receive your personalized <strong>Skin Routine</strong>... based on your animal's habitat!</li>
</ol>

<h3>Meet the Power Animals</h3>

<p>From the <strong>Majestic Lion</strong> of the African Savanna to the <strong>Mystical Unicorn</strong> of Enchanted Forests, each animal comes with:</p>

<ul>
  <li>Unique personality traits</li>
  <li>A hilarious habitat-based skincare routine</li>
  <li>Beautiful animated reveal</li>
</ul>

<p>Some of our favorites:</p>

<ul>
  <li><strong>🦁 Lion</strong> - "Roar at moisturizer. Real kings don't bathe."</li>
  <li><strong>🐼 Panda</strong> - "Those dark circles? That's called a LOOK."</li>
  <li><strong>🦄 Unicorn</strong> - "Apply rainbow tears for that ethereal glow."</li>
  <li><strong>🔥 Phoenix</strong> - "Burn it all down and start fresh—ultimate exfoliation."</li>
</ul>

<h3>Share Your Results</h3>

<p>Found your Power Animal? Share it with friends and see who gets the highest resemblance score!</p>

<hr />

<h2>Why We Built These Tools</h2>

<p>At GENOSYS, we believe skincare should be both <strong>effective</strong> and <strong>enjoyable</strong>. Our Live AR Analysis provides real value for understanding your skin, while Power Animal adds a touch of fun to your skincare journey.</p>

<p>Both tools are:</p>

<ul>
  <li><strong>Privacy-First</strong> - All processing happens on your device</li>
  <li><strong>No Account Required</strong> - Try them instantly</li>
  <li><strong>Completely Free</strong> - Part of our commitment to accessible skincare</li>
</ul>

<hr />

<h2>Try It Now</h2>

<p>Ready to explore? Visit our <a href="/skin-recommendation">Skin Recommendation</a> page and:</p>

<ol>
  <li>Try <strong>Live AR</strong> for real skin insights</li>
  <li>Play <strong>Power Animal</strong> for a good laugh</li>
  <li>Get personalized GENOSYS product recommendations</li>
</ol>

<p><em>Your skin—and your spirit animal—are waiting!</em></p>

<hr />

<p><em>Questions? Contact us at <a href="mailto:info@genosys.ae">info@genosys.ae</a></em></p>
`

  const htmlContentAr = `
<h2>مستقبل العناية بالبشرة هنا</h2>

<p>في GENOSYS، نحن دائماً ندفع حدود تكنولوجيا العناية بالبشرة. اليوم، يسعدنا تقديم ميزتين رائدتين تجمعان بين الذكاء الاصطناعي المتقدم والتجارب الممتعة: <strong>تحليل البشرة المباشر بـ AR</strong> و<strong>لعبة حيوان القوة</strong>.</p>

<hr />

<h2>تحليل البشرة المباشر بـ AR: رؤى فورية</h2>

<p>أداة <strong>تحليل البشرة المباشر بـ AR</strong> الجديدة تستخدم الذكاء الاصطناعي المتقدم لتحليل بشرتك في الوقت الفعلي من خلال كاميرا جهازك.</p>

<h3>ما يحلله</h3>

<ul>
  <li><strong>ترطيب البشرة</strong> - قياس مستويات رطوبة بشرتك</li>
  <li><strong>كشف الدهون</strong> - تحديد إنتاج الزيت في منطقة T</li>
  <li><strong>تحليل الملمس</strong> - تقييم نعومة البشرة</li>
  <li><strong>لون البشرة</strong> - تحليل التصبغ والتوحد</li>
  <li><strong>تقدير العمر</strong> - عمر البشرة المقدر</li>
  <li><strong>كشف الجنس</strong> - للتوصيات المخصصة</li>
</ul>

<hr />

<h2>لعبة حيوان القوة: اكتشف روحك الحيوانية</h2>

<p>هل تبحث عن شيء ممتع؟ جرب لعبة <strong>حيوان القوة</strong> - محاكاة ساخرة مضحكة لتحليل البشرة تكشف عن حيوانك الروحي!</p>

<h3>كيف تعمل</h3>

<ol>
  <li>التقط صورة سيلفي</li>
  <li>"الذكاء الاصطناعي" يحلل طاقة روحك</li>
  <li>اكتشف أي من <strong>20 حيواناً فريداً</strong> يتطابق مع جوهرك</li>
  <li>احصل على <strong>نسبة التشابه</strong>!</li>
  <li>استلم <strong>روتين العناية بالبشرة</strong> المخصص... بناءً على موطن حيوانك!</li>
</ol>

<hr />

<h2>جربه الآن</h2>

<p>زر صفحة <a href="/ar/skin-recommendation">توصيات البشرة</a> وجرب:</p>

<ol>
  <li><strong>AR المباشر</strong> للحصول على رؤى حقيقية</li>
  <li><strong>حيوان القوة</strong> للمتعة</li>
  <li>توصيات منتجات GENOSYS المخصصة</li>
</ol>
`

  const htmlContentRu = `
<h2>Будущее ухода за кожей уже здесь</h2>

<p>В GENOSYS мы всегда расширяем границы технологий ухода за кожей. Сегодня мы рады представить две инновационные функции: <strong>AR-анализ кожи в реальном времени</strong> и игру <strong>Power Animal</strong>.</p>

<hr />

<h2>AR-анализ кожи: мгновенные результаты</h2>

<p>Наш новый инструмент <strong>AR-анализа кожи</strong> использует передовой искусственный интеллект для анализа вашей кожи в реальном времени через камеру вашего устройства.</p>

<h3>Что анализируется</h3>

<ul>
  <li><strong>Увлажнённость кожи</strong> - измерение уровня влаги</li>
  <li><strong>Обнаружение жирности</strong> - определение выработки кожного сала</li>
  <li><strong>Анализ текстуры</strong> - оценка гладкости кожи</li>
  <li><strong>Тон кожи</strong> - анализ пигментации</li>
  <li><strong>Оценка возраста</strong> - предполагаемый возраст кожи</li>
  <li><strong>Определение пола</strong> - для персонализированных рекомендаций</li>
</ul>

<hr />

<h2>Игра Power Animal: найдите своё тотемное животное</h2>

<p>Ищете что-то весёлое? Попробуйте игру <strong>Power Animal</strong> — забавную пародию на профессиональный анализ кожи!</p>

<h3>Как это работает</h3>

<ol>
  <li>Сделайте селфи</li>
  <li>Наш "ИИ" анализирует вашу духовную энергию</li>
  <li>Узнайте, какое из <strong>20 уникальных животных</strong> соответствует вашей сущности</li>
  <li>Получите <strong>процент сходства</strong>!</li>
  <li>Получите персонализированный <strong>уход за кожей</strong>... основанный на среде обитания вашего животного!</li>
</ol>

<hr />

<h2>Попробуйте сейчас</h2>

<p>Посетите страницу <a href="/ru/skin-recommendation">Рекомендации для кожи</a>:</p>

<ol>
  <li><strong>AR-анализ</strong> для реальных результатов</li>
  <li><strong>Power Animal</strong> для веселья</li>
  <li>Персонализированные рекомендации продуктов GENOSYS</li>
</ol>
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
