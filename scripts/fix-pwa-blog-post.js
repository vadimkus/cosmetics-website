#!/usr/bin/env node

/**
 * Fix PWA Blog Post - Professional HTML formatting
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

// Professional HTML content
const htmlContent = `<div class="blog-content">
  <!-- Hero Section -->
  <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 md:p-8 mb-10 text-center">
    <div class="text-5xl mb-4">📱</div>
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Favorite Skincare Shop, Now as an App!</h2>
    <p class="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
      Install GENOSYS directly to your home screen and enjoy a native app experience — no app store required! 
      Our Progressive Web App gives you instant access to premium Korean dermacosmetics.
    </p>
    <a href="/pwa" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
      <span>📲</span> Install Now
    </a>
  </div>

  <!-- Benefits Grid -->
  <div class="mb-12">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
      <span>✨</span> Why Install Our PWA?
    </h3>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
        <div class="text-2xl mb-3">🏠</div>
        <h4 class="font-bold text-gray-900 mb-2">Quick Access</h4>
        <p class="text-gray-600 text-sm">Launch GENOSYS with one tap from your home screen — no browser needed</p>
      </div>
      
      <div class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
        <div class="text-2xl mb-3">📱</div>
        <h4 class="font-bold text-gray-900 mb-2">Full-Screen Experience</h4>
        <p class="text-gray-600 text-sm">No browser bars or distractions — pure immersive shopping</p>
      </div>
      
      <div class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
        <div class="text-2xl mb-3">⚡</div>
        <h4 class="font-bold text-gray-900 mb-2">Lightning Fast</h4>
        <p class="text-gray-600 text-sm">Optimized performance with instant loading and smooth navigation</p>
      </div>
      
      <div class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
        <div class="text-2xl mb-3">🔔</div>
        <h4 class="font-bold text-gray-900 mb-2">Order Notifications</h4>
        <p class="text-gray-600 text-sm">Stay updated on your order status with real-time alerts</p>
      </div>
      
      <div class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
        <div class="text-2xl mb-3">📴</div>
        <h4 class="font-bold text-gray-900 mb-2">Offline Browsing</h4>
        <p class="text-gray-600 text-sm">Browse products and favorites even without internet connection</p>
      </div>
      
      <div class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
        <div class="text-2xl mb-3">💾</div>
        <h4 class="font-bold text-gray-900 mb-2">No Storage Needed</h4>
        <p class="text-gray-600 text-sm">Takes minimal space unlike native apps — saves your device storage</p>
      </div>
    </div>
  </div>

  <!-- Comparison Section -->
  <div class="bg-gray-50 rounded-xl p-6 md:p-8 mb-12">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
      <span>📊</span> PWA vs Native App vs Website
    </h3>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b-2 border-gray-300">
            <th class="py-3 px-4 font-bold text-gray-900">Feature</th>
            <th class="py-3 px-4 font-bold text-blue-600">📱 PWA</th>
            <th class="py-3 px-4 font-bold text-gray-500">📲 Native App</th>
            <th class="py-3 px-4 font-bold text-gray-500">🌐 Website</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          <tr class="border-b border-gray-200 bg-white">
            <td class="py-3 px-4 font-medium">Installation</td>
            <td class="py-3 px-4 text-blue-600">✅ Instant, no store</td>
            <td class="py-3 px-4 text-gray-500">App store required</td>
            <td class="py-3 px-4 text-gray-500">N/A</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-3 px-4 font-medium">Home Screen Icon</td>
            <td class="py-3 px-4 text-blue-600">✅ Yes</td>
            <td class="py-3 px-4 text-gray-500">✅ Yes</td>
            <td class="py-3 px-4 text-gray-500">❌ No</td>
          </tr>
          <tr class="border-b border-gray-200 bg-white">
            <td class="py-3 px-4 font-medium">Full-Screen Mode</td>
            <td class="py-3 px-4 text-blue-600">✅ Yes</td>
            <td class="py-3 px-4 text-gray-500">✅ Yes</td>
            <td class="py-3 px-4 text-gray-500">❌ No</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-3 px-4 font-medium">Offline Access</td>
            <td class="py-3 px-4 text-blue-600">✅ Yes</td>
            <td class="py-3 px-4 text-gray-500">✅ Yes</td>
            <td class="py-3 px-4 text-gray-500">❌ No</td>
          </tr>
          <tr class="border-b border-gray-200 bg-white">
            <td class="py-3 px-4 font-medium">Storage Space</td>
            <td class="py-3 px-4 text-blue-600">✅ Minimal (~2MB)</td>
            <td class="py-3 px-4 text-gray-500">50-200MB</td>
            <td class="py-3 px-4 text-gray-500">✅ None</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-3 px-4 font-medium">Auto Updates</td>
            <td class="py-3 px-4 text-blue-600">✅ Automatic</td>
            <td class="py-3 px-4 text-gray-500">Manual/Store</td>
            <td class="py-3 px-4 text-gray-500">✅ Always latest</td>
          </tr>
          <tr class="bg-white">
            <td class="py-3 px-4 font-medium">Works Cross-Platform</td>
            <td class="py-3 px-4 text-blue-600">✅ All devices</td>
            <td class="py-3 px-4 text-gray-500">iOS or Android only</td>
            <td class="py-3 px-4 text-gray-500">✅ All devices</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- iOS Installation -->
  <div class="mb-10">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
        <span class="text-2xl">🍎</span>
      </div>
      <h3 class="text-2xl font-bold text-gray-900">Install on iPhone / iPad</h3>
    </div>
    
    <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
      <div class="space-y-4">
        <div class="flex items-start gap-4">
          <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">1</div>
          <div>
            <p class="font-semibold text-gray-900">Open in Safari</p>
            <p class="text-gray-600 text-sm">Visit <strong>genosys.ae</strong> using Safari browser (Chrome/Firefox won't work for installation)</p>
          </div>
        </div>
        
        <div class="flex items-start gap-4">
          <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">2</div>
          <div>
            <p class="font-semibold text-gray-900">Tap Share Button</p>
            <p class="text-gray-600 text-sm">Tap the <strong>Share button</strong> (square with arrow ↑) at the bottom of Safari</p>
          </div>
        </div>
        
        <div class="flex items-start gap-4">
          <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">3</div>
          <div>
            <p class="font-semibold text-gray-900">Add to Home Screen</p>
            <p class="text-gray-600 text-sm">Scroll down and tap <strong>"Add to Home Screen"</strong></p>
          </div>
        </div>
        
        <div class="flex items-start gap-4">
          <div class="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">✓</div>
          <div>
            <p class="font-semibold text-gray-900">Done!</p>
            <p class="text-gray-600 text-sm">Tap <strong>"Add"</strong> and the GENOSYS icon will appear on your home screen</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Android Installation -->
  <div class="mb-10">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
        <span class="text-2xl">🤖</span>
      </div>
      <h3 class="text-2xl font-bold text-gray-900">Install on Android</h3>
    </div>
    
    <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
      <div class="space-y-4">
        <div class="flex items-start gap-4">
          <div class="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">1</div>
          <div>
            <p class="font-semibold text-gray-900">Open in Chrome</p>
            <p class="text-gray-600 text-sm">Visit <strong>genosys.ae</strong> using Google Chrome browser</p>
          </div>
        </div>
        
        <div class="flex items-start gap-4">
          <div class="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">2</div>
          <div>
            <p class="font-semibold text-gray-900">Open Menu</p>
            <p class="text-gray-600 text-sm">Tap the <strong>three-dot menu</strong> (⋮) in the top right corner</p>
          </div>
        </div>
        
        <div class="flex items-start gap-4">
          <div class="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">3</div>
          <div>
            <p class="font-semibold text-gray-900">Install App</p>
            <p class="text-gray-600 text-sm">Tap <strong>"Install app"</strong> or "Add to Home screen"</p>
          </div>
        </div>
        
        <div class="flex items-start gap-4">
          <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">✓</div>
          <div>
            <p class="font-semibold text-gray-900">Done!</p>
            <p class="text-gray-600 text-sm">Tap <strong>"Install"</strong> to confirm — the app will appear on your home screen</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Features Section -->
  <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 md:p-8 mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
      <span>📦</span> What You Get with Our PWA
    </h3>
    
    <div class="grid md:grid-cols-2 gap-4">
      <div class="flex items-start gap-3 bg-white rounded-lg p-4">
        <span class="text-xl">🛒</span>
        <div>
          <p class="font-semibold text-gray-900">Easy Shopping</p>
          <p class="text-sm text-gray-600">Browse and purchase all GENOSYS products</p>
        </div>
      </div>
      
      <div class="flex items-start gap-3 bg-white rounded-lg p-4">
        <span class="text-xl">❤️</span>
        <div>
          <p class="font-semibold text-gray-900">Favorites</p>
          <p class="text-sm text-gray-600">Save products for quick access</p>
        </div>
      </div>
      
      <div class="flex items-start gap-3 bg-white rounded-lg p-4">
        <span class="text-xl">📋</span>
        <div>
          <p class="font-semibold text-gray-900">Order Tracking</p>
          <p class="text-sm text-gray-600">Check your order status anytime</p>
        </div>
      </div>
      
      <div class="flex items-start gap-3 bg-white rounded-lg p-4">
        <span class="text-xl">🌐</span>
        <div>
          <p class="font-semibold text-gray-900">Multi-Language</p>
          <p class="text-sm text-gray-600">English, Arabic, and Russian</p>
        </div>
      </div>
      
      <div class="flex items-start gap-3 bg-white rounded-lg p-4">
        <span class="text-xl">💳</span>
        <div>
          <p class="font-semibold text-gray-900">Secure Checkout</p>
          <p class="text-sm text-gray-600">Apple Pay, Google Pay, and cards</p>
        </div>
      </div>
      
      <div class="flex items-start gap-3 bg-white rounded-lg p-4">
        <span class="text-xl">📞</span>
        <div>
          <p class="font-semibold text-gray-900">WhatsApp Support</p>
          <p class="text-sm text-gray-600">Instant customer service</p>
        </div>
      </div>
    </div>
  </div>

  <!-- CTA Section -->
  <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white mb-10">
    <h3 class="text-2xl md:text-3xl font-bold mb-4">🎉 Ready to Install?</h3>
    <p class="text-lg mb-6 opacity-90">Visit our dedicated installation page for an interactive, step-by-step guide!</p>
    <a href="/pwa" class="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
      <span>📲</span> Install GENOSYS App Now
    </a>
  </div>

  <!-- iOS App Note -->
  <div class="bg-gray-100 rounded-xl p-6 text-center">
    <p class="text-gray-700 mb-3">
      <strong>Already prefer native apps?</strong> Our iOS app is also available!
    </p>
    <a href="/blog/genosys-ios-app-launched-2026" class="text-blue-600 hover:underline font-semibold">
      📱 Download from App Store →
    </a>
  </div>
</div>`;

// Arabic content
const htmlContentAr = `<div class="blog-content" dir="rtl">
  <!-- Hero Section -->
  <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 md:p-8 mb-10 text-center">
    <div class="text-5xl mb-4">📱</div>
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">متجر العناية بالبشرة المفضل لديك، الآن كتطبيق!</h2>
    <p class="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
      قم بتثبيت GENOSYS مباشرة على شاشتك الرئيسية واستمتع بتجربة تطبيق أصلية — بدون متجر تطبيقات!
    </p>
    <a href="/pwa" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
      <span>📲</span> ثبت الآن
    </a>
  </div>

  <!-- Benefits Grid -->
  <div class="mb-12">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">✨ لماذا تثبت تطبيق PWA؟</h3>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <div class="text-2xl mb-3">🏠</div>
        <h4 class="font-bold text-gray-900 mb-2">وصول سريع</h4>
        <p class="text-gray-600 text-sm">افتح GENOSYS بنقرة واحدة من شاشتك الرئيسية</p>
      </div>
      
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <div class="text-2xl mb-3">⚡</div>
        <h4 class="font-bold text-gray-900 mb-2">سريع للغاية</h4>
        <p class="text-gray-600 text-sm">أداء محسن مع تحميل فوري</p>
      </div>
      
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <div class="text-2xl mb-3">📴</div>
        <h4 class="font-bold text-gray-900 mb-2">تصفح بدون إنترنت</h4>
        <p class="text-gray-600 text-sm">تصفح المنتجات حتى بدون اتصال</p>
      </div>
    </div>
  </div>

  <!-- iOS Installation -->
  <div class="mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-6">🍎 التثبيت على iPhone / iPad</h3>
    <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 space-y-4">
      <p><strong>1.</strong> افتح genosys.ae في Safari</p>
      <p><strong>2.</strong> اضغط على زر المشاركة (↑)</p>
      <p><strong>3.</strong> اضغط على "إضافة إلى الشاشة الرئيسية"</p>
      <p><strong>4.</strong> اضغط على "إضافة"</p>
    </div>
  </div>

  <!-- Android Installation -->
  <div class="mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-6">🤖 التثبيت على Android</h3>
    <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 space-y-4">
      <p><strong>1.</strong> افتح genosys.ae في Chrome</p>
      <p><strong>2.</strong> اضغط على القائمة (⋮)</p>
      <p><strong>3.</strong> اضغط على "تثبيت التطبيق"</p>
      <p><strong>4.</strong> اضغط على "تثبيت" للتأكيد</p>
    </div>
  </div>

  <!-- CTA -->
  <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
    <h3 class="text-2xl font-bold mb-4">🎉 هل أنت جاهز للتثبيت؟</h3>
    <a href="/pwa" class="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg">
      <span>📲</span> ثبت تطبيق GENOSYS الآن
    </a>
  </div>
</div>`;

// Russian content
const htmlContentRu = `<div class="blog-content">
  <!-- Hero Section -->
  <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 md:p-8 mb-10 text-center">
    <div class="text-5xl mb-4">📱</div>
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ваш любимый магазин косметики теперь как приложение!</h2>
    <p class="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
      Установите GENOSYS прямо на главный экран и наслаждайтесь нативным опытом — без App Store!
      PWA даёт мгновенный доступ к премиальной корейской дерматокосметике.
    </p>
    <a href="/pwa" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
      <span>📲</span> Установить сейчас
    </a>
  </div>

  <!-- Benefits Grid -->
  <div class="mb-12">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">✨ Почему стоит установить PWA?</h3>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <div class="text-2xl mb-3">🏠</div>
        <h4 class="font-bold text-gray-900 mb-2">Быстрый доступ</h4>
        <p class="text-gray-600 text-sm">Запускайте GENOSYS одним касанием с главного экрана</p>
      </div>
      
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <div class="text-2xl mb-3">📱</div>
        <h4 class="font-bold text-gray-900 mb-2">Полноэкранный режим</h4>
        <p class="text-gray-600 text-sm">Без панелей браузера — чистый шопинг</p>
      </div>
      
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <div class="text-2xl mb-3">⚡</div>
        <h4 class="font-bold text-gray-900 mb-2">Молниеносная скорость</h4>
        <p class="text-gray-600 text-sm">Оптимизированная производительность с мгновенной загрузкой</p>
      </div>
      
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <div class="text-2xl mb-3">🔔</div>
        <h4 class="font-bold text-gray-900 mb-2">Уведомления о заказах</h4>
        <p class="text-gray-600 text-sm">Следите за статусом заказа в реальном времени</p>
      </div>
      
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <div class="text-2xl mb-3">📴</div>
        <h4 class="font-bold text-gray-900 mb-2">Офлайн-доступ</h4>
        <p class="text-gray-600 text-sm">Просматривайте товары даже без интернета</p>
      </div>
      
      <div class="bg-white border border-gray-200 rounded-xl p-5">
        <div class="text-2xl mb-3">💾</div>
        <h4 class="font-bold text-gray-900 mb-2">Минимум памяти</h4>
        <p class="text-gray-600 text-sm">Занимает ~2МБ вместо 50-200МБ обычных приложений</p>
      </div>
    </div>
  </div>

  <!-- Comparison Table -->
  <div class="bg-gray-50 rounded-xl p-6 md:p-8 mb-12">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">📊 PWA vs Обычное приложение vs Сайт</h3>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b-2 border-gray-300">
            <th class="py-3 px-4 font-bold">Функция</th>
            <th class="py-3 px-4 font-bold text-blue-600">📱 PWA</th>
            <th class="py-3 px-4 text-gray-500">📲 Приложение</th>
            <th class="py-3 px-4 text-gray-500">🌐 Сайт</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b bg-white">
            <td class="py-3 px-4">Установка</td>
            <td class="py-3 px-4 text-blue-600">✅ Мгновенно</td>
            <td class="py-3 px-4 text-gray-500">Через магазин</td>
            <td class="py-3 px-4 text-gray-500">—</td>
          </tr>
          <tr class="border-b">
            <td class="py-3 px-4">Иконка</td>
            <td class="py-3 px-4 text-blue-600">✅ Да</td>
            <td class="py-3 px-4 text-gray-500">✅ Да</td>
            <td class="py-3 px-4 text-gray-500">❌ Нет</td>
          </tr>
          <tr class="border-b bg-white">
            <td class="py-3 px-4">Офлайн</td>
            <td class="py-3 px-4 text-blue-600">✅ Да</td>
            <td class="py-3 px-4 text-gray-500">✅ Да</td>
            <td class="py-3 px-4 text-gray-500">❌ Нет</td>
          </tr>
          <tr class="border-b">
            <td class="py-3 px-4">Память</td>
            <td class="py-3 px-4 text-blue-600">✅ ~2МБ</td>
            <td class="py-3 px-4 text-gray-500">50-200МБ</td>
            <td class="py-3 px-4 text-gray-500">✅ 0</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- iOS Installation -->
  <div class="mb-10">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
        <span class="text-2xl">🍎</span>
      </div>
      <h3 class="text-2xl font-bold text-gray-900">Установка на iPhone / iPad</h3>
    </div>
    
    <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 space-y-4">
      <div class="flex items-start gap-4">
        <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">1</div>
        <p>Откройте <strong>genosys.ae</strong> в браузере Safari</p>
      </div>
      <div class="flex items-start gap-4">
        <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">2</div>
        <p>Нажмите кнопку <strong>«Поделиться»</strong> (↑) внизу экрана</p>
      </div>
      <div class="flex items-start gap-4">
        <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">3</div>
        <p>Выберите <strong>«На экран Домой»</strong></p>
      </div>
      <div class="flex items-start gap-4">
        <div class="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">✓</div>
        <p>Нажмите <strong>«Добавить»</strong> — готово!</p>
      </div>
    </div>
  </div>

  <!-- Android Installation -->
  <div class="mb-10">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
        <span class="text-2xl">🤖</span>
      </div>
      <h3 class="text-2xl font-bold text-gray-900">Установка на Android</h3>
    </div>
    
    <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 space-y-4">
      <div class="flex items-start gap-4">
        <div class="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">1</div>
        <p>Откройте <strong>genosys.ae</strong> в браузере Chrome</p>
      </div>
      <div class="flex items-start gap-4">
        <div class="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">2</div>
        <p>Нажмите на <strong>меню</strong> (⋮) в правом верхнем углу</p>
      </div>
      <div class="flex items-start gap-4">
        <div class="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">3</div>
        <p>Выберите <strong>«Установить приложение»</strong></p>
      </div>
      <div class="flex items-start gap-4">
        <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">✓</div>
        <p>Подтвердите <strong>«Установить»</strong> — готово!</p>
      </div>
    </div>
  </div>

  <!-- CTA Section -->
  <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white mb-10">
    <h3 class="text-2xl md:text-3xl font-bold mb-4">🎉 Готовы к установке?</h3>
    <p class="text-lg mb-6 opacity-90">Интерактивное руководство с автоопределением устройства!</p>
    <a href="/pwa" class="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
      <span>📲</span> Установить GENOSYS
    </a>
  </div>

  <!-- iOS App Note -->
  <div class="bg-gray-100 rounded-xl p-6 text-center">
    <p class="text-gray-700 mb-3">
      <strong>Предпочитаете нативные приложения?</strong> Наше iOS-приложение тоже доступно!
    </p>
    <a href="/blog/genosys-ios-app-launched-2026" class="text-blue-600 hover:underline font-semibold">
      📱 Скачать из App Store →
    </a>
  </div>
</div>`;

async function updateBlogPost() {
  try {
    console.log('🔄 Updating PWA blog post with professional HTML content...')
    
    const updatedPost = await prisma.blogPost.update({
      where: { slug: 'install-genosys-pwa-app-iphone-android-2025' },
      data: {
        content: htmlContent,
        contentAr: htmlContentAr,
        contentRu: htmlContentRu,
        updatedAt: new Date()
      }
    })
    
    console.log('✅ Blog post updated successfully!')
    console.log('   ID:', updatedPost.id)
    console.log('   URL: https://genosys.ae/blog/install-genosys-pwa-app-iphone-android-2025')
    
    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error updating blog post:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

updateBlogPost()

