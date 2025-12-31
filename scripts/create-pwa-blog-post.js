/**
 * Script to create blog post about PWA installation
 * Run: node scripts/create-pwa-blog-post.js
 */

const fs = require('fs')

const blogPostData = {
  // English content
  title: "📱 Install GENOSYS App on Your Phone - Easy PWA Guide",
  slug: "install-genosys-pwa-app-iphone-android-2025",
  excerpt: "Get the GENOSYS app experience without downloading from app stores! Learn how to install our Progressive Web App (PWA) on iPhone, iPad, and Android devices with our simple step-by-step guide.",
  content: `
<div class="blog-post-content">
  <div class="hero-section">
    <h2>🚀 Your Favorite Skincare Shop, Now as an App!</h2>
    <p>We're excited to announce that you can now install GENOSYS directly to your home screen and enjoy a native app experience - no app store required! Our Progressive Web App (PWA) gives you instant access to your favorite Korean dermacosmetics.</p>
    <p><strong>Visit our installation guide:</strong> <a href="/pwa">genosys.ae/pwa</a></p>
  </div>

  <div class="image-section">
    <img src="/images/pwa/pwa-device-selection.png" alt="GENOSYS PWA Installation - Device Selection" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
    <p style="text-align: center; color: #666; font-size: 14px; margin-top: 8px;">Choose your device type for customized installation instructions</p>
  </div>

  <div class="benefits-section">
    <h3>✨ Why Install Our PWA?</h3>
    <div class="image-section" style="margin: 20px 0;">
      <img src="/images/pwa/pwa-benefits.svg" alt="PWA Benefits Overview" style="max-width: 100%; border-radius: 12px;" />
    </div>
    <ul>
      <li><strong>🏠 Quick Access:</strong> Launch GENOSYS with one tap from your home screen</li>
      <li><strong>📱 Full-Screen Experience:</strong> No browser bars - pure immersive shopping</li>
      <li><strong>⚡ Lightning Fast:</strong> Optimized performance with instant loading</li>
      <li><strong>🔔 Order Notifications:</strong> Stay updated on your order status</li>
      <li><strong>📴 Offline Browsing:</strong> Browse products even without internet</li>
      <li><strong>🔒 Secure:</strong> HTTPS-encrypted connection for safe shopping</li>
      <li><strong>📲 No Storage Needed:</strong> Takes minimal space unlike native apps</li>
    </ul>
  </div>

  <div class="comparison-section">
    <h3>📊 PWA vs Traditional App vs Website</h3>
    <div class="image-section" style="margin: 20px 0;">
      <img src="/images/pwa/pwa-vs-native.svg" alt="PWA vs Native App vs Website Comparison" style="max-width: 100%; border-radius: 12px;" />
    </div>
    <p>Progressive Web Apps combine the best of both worlds - the reliability of native apps with the accessibility of websites. No app store approval needed, automatic updates, and works across all devices!</p>
  </div>

  <div class="ios-section">
    <h3>🍎 How to Install on iPhone / iPad</h3>
    <div class="image-section" style="margin: 20px 0;">
      <img src="/images/pwa/pwa-ios-step1.png" alt="iOS PWA Installation Step 1" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
    </div>
    <ol>
      <li><strong>Step 1:</strong> Open <a href="https://genosys.ae">genosys.ae</a> in <strong>Safari</strong> (Chrome/Firefox won't work for installation)</li>
      <li><strong>Step 2:</strong> Tap the <strong>Share button</strong> (square with arrow) at the bottom of Safari</li>
      <li><strong>Step 3:</strong> Scroll down and tap <strong>"Add to Home Screen"</strong></li>
      <li><strong>Step 4:</strong> Tap <strong>"Add"</strong> in the top right corner</li>
    </ol>
    <p>✅ Done! The GENOSYS app icon will appear on your home screen!</p>
  </div>

  <div class="android-section">
    <h3>🤖 How to Install on Android</h3>
    <div class="image-section" style="margin: 20px 0;">
      <img src="/images/pwa/pwa-android-step1.png" alt="Android PWA Installation Step 1" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
    </div>
    <ol>
      <li><strong>Step 1:</strong> Open <a href="https://genosys.ae">genosys.ae</a> in <strong>Chrome</strong></li>
      <li><strong>Step 2:</strong> Tap the <strong>three-dot menu</strong> (⋮) in the top right corner</li>
      <li><strong>Step 3:</strong> Tap <strong>"Install app"</strong> or "Add to Home screen"</li>
      <li><strong>Step 4:</strong> Tap <strong>"Install"</strong> to confirm</li>
    </ol>
    <p>✅ The GENOSYS app will be installed and appear on your home screen!</p>
  </div>

  <div class="features-section">
    <h3>📦 What You Get with Our PWA</h3>
    <ul>
      <li><strong>🛒 Easy Shopping:</strong> Browse and purchase all GENOSYS products</li>
      <li><strong>❤️ Favorites:</strong> Save your favorite products for quick access</li>
      <li><strong>📋 Order Tracking:</strong> Check your order status anytime</li>
      <li><strong>🌐 Multi-Language:</strong> Available in English, Arabic, and Russian</li>
      <li><strong>💳 Secure Checkout:</strong> Apple Pay, Google Pay, and card payments</li>
      <li><strong>📞 WhatsApp Support:</strong> Instant customer service integration</li>
    </ul>
  </div>

  <div class="cta-section">
    <h3>🎉 Ready to Install?</h3>
    <p>Visit our dedicated installation page for an interactive, step-by-step guide that detects your device automatically!</p>
    <p><a href="/pwa" class="cta-button" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Install GENOSYS App Now →</a></p>
    <p style="margin-top: 16px; color: #666;">Already have our iOS app? <a href="https://apps.apple.com/app/genosys">Download from App Store</a></p>
  </div>
</div>
  `,
  
  // Russian content
  titleRu: "📱 Установите приложение GENOSYS на телефон - Простое руководство PWA",
  excerptRu: "Получите опыт приложения GENOSYS без загрузки из магазинов приложений! Узнайте, как установить наше прогрессивное веб-приложение (PWA) на iPhone, iPad и Android устройства с нашим простым пошаговым руководством.",
  contentRu: `
<div class="blog-post-content">
  <div class="hero-section">
    <h2>🚀 Ваш любимый магазин косметики теперь как приложение!</h2>
    <p>Мы рады сообщить, что теперь вы можете установить GENOSYS прямо на домашний экран и наслаждаться нативным опытом приложения - без магазина приложений! Наше прогрессивное веб-приложение (PWA) дает вам мгновенный доступ к вашей любимой корейской дермакосметике.</p>
    <p><strong>Посетите наше руководство по установке:</strong> <a href="/ru/pwa">genosys.ae/ru/pwa</a></p>
  </div>

  <div class="benefits-section">
    <h3>✨ Почему стоит установить наше PWA?</h3>
    <ul>
      <li><strong>🏠 Быстрый доступ:</strong> Запускайте GENOSYS одним касанием с домашнего экрана</li>
      <li><strong>📱 Полноэкранный режим:</strong> Без панелей браузера - чистый иммерсивный шоппинг</li>
      <li><strong>⚡ Молниеносная скорость:</strong> Оптимизированная производительность с мгновенной загрузкой</li>
      <li><strong>🔔 Уведомления о заказах:</strong> Будьте в курсе статуса вашего заказа</li>
      <li><strong>📴 Офлайн просмотр:</strong> Просматривайте продукты даже без интернета</li>
      <li><strong>🔒 Безопасность:</strong> HTTPS-шифрование для безопасного шоппинга</li>
    </ul>
  </div>

  <div class="ios-section">
    <h3>🍎 Как установить на iPhone / iPad</h3>
    <ol>
      <li><strong>Шаг 1:</strong> Откройте <a href="https://genosys.ae/ru">genosys.ae</a> в <strong>Safari</strong></li>
      <li><strong>Шаг 2:</strong> Нажмите кнопку <strong>Поделиться</strong> (квадрат со стрелкой)</li>
      <li><strong>Шаг 3:</strong> Прокрутите вниз и нажмите <strong>"На экран Домой"</strong></li>
      <li><strong>Шаг 4:</strong> Нажмите <strong>"Добавить"</strong> в правом верхнем углу</li>
    </ol>
    <p>✅ Готово! Иконка GENOSYS появится на вашем домашнем экране!</p>
  </div>

  <div class="android-section">
    <h3>🤖 Как установить на Android</h3>
    <ol>
      <li><strong>Шаг 1:</strong> Откройте <a href="https://genosys.ae/ru">genosys.ae</a> в <strong>Chrome</strong></li>
      <li><strong>Шаг 2:</strong> Нажмите <strong>меню с тремя точками</strong> (⋮) в правом верхнем углу</li>
      <li><strong>Шаг 3:</strong> Нажмите <strong>"Установить приложение"</strong></li>
      <li><strong>Шаг 4:</strong> Нажмите <strong>"Установить"</strong> для подтверждения</li>
    </ol>
    <p>✅ Приложение GENOSYS будет установлено на вашем домашнем экране!</p>
  </div>

  <div class="cta-section">
    <h3>🎉 Готовы к установке?</h3>
    <p><a href="/ru/pwa" class="cta-button" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Установить приложение GENOSYS →</a></p>
  </div>
</div>
  `,

  // Arabic content
  titleAr: "📱 ثبّت تطبيق GENOSYS على هاتفك - دليل سهل لتطبيق الويب التقدمي",
  excerptAr: "احصل على تجربة تطبيق GENOSYS دون التحميل من متاجر التطبيقات! تعلم كيفية تثبيت تطبيق الويب التقدمي (PWA) على أجهزة iPhone و iPad و Android مع دليلنا البسيط خطوة بخطوة.",
  contentAr: `
<div class="blog-post-content" dir="rtl">
  <div class="hero-section">
    <h2>🚀 متجر العناية بالبشرة المفضل لديك، الآن كتطبيق!</h2>
    <p>يسعدنا أن نعلن أنه يمكنك الآن تثبيت GENOSYS مباشرة على شاشتك الرئيسية والاستمتاع بتجربة تطبيق أصلية - بدون متجر التطبيقات! يمنحك تطبيق الويب التقدمي (PWA) وصولاً فورياً إلى مستحضرات التجميل الكورية المفضلة لديك.</p>
    <p><strong>زر دليل التثبيت:</strong> <a href="/ar/pwa">genosys.ae/ar/pwa</a></p>
  </div>

  <div class="benefits-section">
    <h3>✨ لماذا تثبت تطبيق PWA؟</h3>
    <ul>
      <li><strong>🏠 وصول سريع:</strong> افتح GENOSYS بلمسة واحدة من شاشتك الرئيسية</li>
      <li><strong>📱 تجربة ملء الشاشة:</strong> بدون أشرطة المتصفح - تسوق غامر</li>
      <li><strong>⚡ سرعة البرق:</strong> أداء محسّن مع تحميل فوري</li>
      <li><strong>🔔 إشعارات الطلبات:</strong> ابقَ على اطلاع بحالة طلبك</li>
      <li><strong>📴 تصفح بدون إنترنت:</strong> تصفح المنتجات حتى بدون اتصال</li>
      <li><strong>🔒 آمن:</strong> اتصال مشفر HTTPS للتسوق الآمن</li>
    </ul>
  </div>

  <div class="ios-section">
    <h3>🍎 كيفية التثبيت على iPhone / iPad</h3>
    <ol>
      <li><strong>الخطوة 1:</strong> افتح <a href="https://genosys.ae/ar">genosys.ae</a> في <strong>Safari</strong></li>
      <li><strong>الخطوة 2:</strong> اضغط على زر <strong>المشاركة</strong> (المربع مع السهم)</li>
      <li><strong>الخطوة 3:</strong> مرر لأسفل واضغط على <strong>"إضافة إلى الشاشة الرئيسية"</strong></li>
      <li><strong>الخطوة 4:</strong> اضغط <strong>"إضافة"</strong> في الزاوية العلوية اليمنى</li>
    </ol>
    <p>✅ تم! ستظهر أيقونة GENOSYS على شاشتك الرئيسية!</p>
  </div>

  <div class="android-section">
    <h3>🤖 كيفية التثبيت على Android</h3>
    <ol>
      <li><strong>الخطوة 1:</strong> افتح <a href="https://genosys.ae/ar">genosys.ae</a> في <strong>Chrome</strong></li>
      <li><strong>الخطوة 2:</strong> اضغط على <strong>قائمة النقاط الثلاث</strong> (⋮) في الزاوية العلوية</li>
      <li><strong>الخطوة 3:</strong> اضغط على <strong>"تثبيت التطبيق"</strong></li>
      <li><strong>الخطوة 4:</strong> اضغط <strong>"تثبيت"</strong> للتأكيد</li>
    </ol>
    <p>✅ سيتم تثبيت تطبيق GENOSYS على شاشتك الرئيسية!</p>
  </div>

  <div class="cta-section">
    <h3>🎉 مستعد للتثبيت؟</h3>
    <p><a href="/ar/pwa" class="cta-button" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">ثبّت تطبيق GENOSYS الآن ←</a></p>
  </div>
</div>
  `,

  // Metadata
  featuredImage: "/images/pwa/pwa-device-selection.png",
  authorName: "GENOSYS Team",
  published: true,
  tags: ["pwa", "app", "installation", "mobile", "ios", "android", "progressive-web-app", "how-to"]
}

// Save as JSON for manual creation
fs.writeFileSync('pwa-blog-post.json', JSON.stringify(blogPostData, null, 2))
console.log('✅ Blog post data saved to pwa-blog-post.json')

// Generate SQL for direct database insertion
const sqlContent = `
-- Insert PWA blog post
INSERT INTO "BlogPost" (
  "title", "slug", "excerpt", "content", "featuredImage", "authorName", "published", "publishedAt", "tags",
  "titleRu", "excerptRu", "contentRu", "titleAr", "excerptAr", "contentAr"
) VALUES (
  '${blogPostData.title.replace(/'/g, "''")}',
  '${blogPostData.slug}',
  '${blogPostData.excerpt.replace(/'/g, "''")}',
  '${blogPostData.content.replace(/'/g, "''").replace(/\n/g, ' ')}',
  '${blogPostData.featuredImage}',
  '${blogPostData.authorName}',
  true,
  NOW(),
  '${JSON.stringify(blogPostData.tags)}',
  '${blogPostData.titleRu.replace(/'/g, "''")}',
  '${blogPostData.excerptRu.replace(/'/g, "''")}',
  '${blogPostData.contentRu.replace(/'/g, "''").replace(/\n/g, ' ')}',
  '${blogPostData.titleAr.replace(/'/g, "''")}',
  '${blogPostData.excerptAr.replace(/'/g, "''")}',
  '${blogPostData.contentAr.replace(/'/g, "''").replace(/\n/g, ' ')}'
);
`

fs.writeFileSync('pwa-blog-post.sql', sqlContent)
console.log('✅ SQL script saved to pwa-blog-post.sql')

// Try to create via localhost API
async function createBlogPost() {
  try {
    console.log('🚀 Creating blog post via localhost API...')
    
    const response = await fetch('http://localhost:3000/api/blog/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogPostData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error:', response.status, errorText)
      
      if (response.status === 401 || response.status === 403) {
        console.log('')
        console.log('🔑 Authentication required. The blog post data has been saved to:')
        console.log('📄 pwa-blog-post.json')
        console.log('📄 pwa-blog-post.sql')
        console.log('')
        console.log('✨ You can:')
        console.log('1. Run the SQL script directly in your database')
        console.log('2. Use the admin panel to create the blog post')
        console.log('3. Manually insert using the JSON data')
        return
      }
      
      throw new Error('API request failed: ' + response.status)
    }

    const result = await response.json()
    const post = result.post

    console.log('✅ Blog post created successfully!')
    console.log('📝 Post ID: ' + post.id)
    console.log('🔗 Slug: ' + post.slug)
    console.log('')
    console.log('📱 URLs:')
    console.log('🇬🇧 English: https://genosys.ae/blog/' + post.slug)
    console.log('🇷🇺 Russian: https://genosys.ae/ru/blog/' + post.slug)
    console.log('🇸🇦 Arabic: https://genosys.ae/ar/blog/' + post.slug)
    
  } catch (error) {
    if (error.message && error.message.includes('ECONNREFUSED')) {
      console.log('❌ Could not connect to localhost:3000')
      console.log('📋 Make sure Next.js dev server is running: npm run dev')
    } else {
      console.error('❌ Error:', error.message || error)
    }
    console.log('')
    console.log('📄 Alternative: Use the generated files:')
    console.log('   - pwa-blog-post.sql (run in database)')
    console.log('   - pwa-blog-post.json (use in admin panel)')
  }
}

createBlogPost()

