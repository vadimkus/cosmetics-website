#!/usr/bin/env node

/**
 * Fix iOS App Blog Post - Convert markdown to HTML
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

// Properly formatted HTML content
const htmlContent = `<div class="blog-content">
  <!-- Hero Section -->
  <div class="intro-section bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 rounded-xl p-6 md:p-8 mb-8 text-center">
    <div class="text-6xl mb-4">🎉</div>
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">GENOSYS iOS App Successfully Launched!</h2>
    <p class="text-xl md:text-2xl text-green-700 font-semibold mb-4">Now Available on Apple App Store</p>
    <p class="text-gray-600">Published: January 1st, 2026 • Category: Product Updates, Mobile App</p>
  </div>

  <!-- App Store Banner -->
  <div class="bg-black rounded-2xl p-8 mb-8 text-center">
    <img src="/images/app-store-badge.svg" alt="Download on App Store" class="h-16 mx-auto mb-4" onerror="this.style.display='none'" />
    <p class="text-white text-2xl font-bold mb-2">Search "Genosys UAE" on the App Store</p>
    <p class="text-gray-400">Free Download • iOS 15.0 or later</p>
  </div>

  <!-- We Did It Section -->
  <div class="mb-10">
    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
      <span class="text-3xl">🚀</span> We Did It! The GENOSYS iOS App is Here!
    </h3>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      We are thrilled to announce that <strong class="text-green-600">the GENOSYS Middle East native iOS app has officially launched</strong> and is now available for download on the Apple App Store!
    </p>
    <p class="text-lg text-gray-700 leading-relaxed">
      After months of development, testing, and refinement, we're proud to deliver an app that transforms how you shop for premium Korean skincare products on your iPhone and iPad.
    </p>
  </div>

  <!-- Features Delivered -->
  <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 md:p-8 mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">✨ Everything We Promised – Now in Your Hands</h3>
    
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Apple Pay -->
      <div class="bg-white rounded-lg p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-2xl">🍎</span>
          <h4 class="font-bold text-lg text-gray-900">Apple Pay Integration</h4>
        </div>
        <p class="text-gray-600"><strong>Lightning-fast checkout</strong> with Face ID or Touch ID. No typing, no hassle – just tap and done.</p>
      </div>

      <!-- Multiple Payment Methods -->
      <div class="bg-white rounded-lg p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-2xl">💳</span>
          <h4 class="font-bold text-lg text-gray-900">Multiple Payment Methods</h4>
        </div>
        <ul class="text-gray-600 space-y-1">
          <li>🍎 <strong>Apple Pay</strong> – Instant and secure</li>
          <li>💳 <strong>Stripe</strong> – Industry-leading processing</li>
          <li>🔗 <strong>Payment Links</strong> – Share and pay easily</li>
          <li>💰 <strong>All major cards</strong> – Visa, Mastercard, Amex</li>
        </ul>
      </div>

      <!-- Native Performance -->
      <div class="bg-white rounded-lg p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-2xl">⚡️</span>
          <h4 class="font-bold text-lg text-gray-900">Native iOS Performance</h4>
        </div>
        <ul class="text-gray-600 space-y-1">
          <li>⚡️ <strong>5x faster</strong> than mobile web</li>
          <li>🎨 <strong>Beautifully designed</strong> following Apple's guidelines</li>
          <li>🔄 <strong>Smooth animations</strong> that feel natural</li>
          <li>📱 <strong>Optimized</strong> for iPhone and iPad</li>
        </ul>
      </div>

      <!-- Multi-Language -->
      <div class="bg-white rounded-lg p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-2xl">🌍</span>
          <h4 class="font-bold text-lg text-gray-900">Multi-Language Support</h4>
        </div>
        <ul class="text-gray-600 space-y-1">
          <li>🇬🇧 <strong>English</strong> – Full support</li>
          <li>🇸🇦 <strong>العربية (Arabic)</strong> – Complete RTL support</li>
          <li>🇷🇺 <strong>Русский (Russian)</strong> – Full localization</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Complete Feature Set -->
  <div class="mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">📱 Complete Feature Set</h3>
    
    <div class="grid md:grid-cols-3 gap-6">
      <!-- Shopping Features -->
      <div class="border border-gray-200 rounded-xl p-5">
        <h4 class="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <span class="text-xl">🛍️</span> Shopping Features
        </h4>
        <ul class="text-gray-600 space-y-2 text-sm">
          <li>✓ Seamless shopping cart with auto-sync</li>
          <li>✓ One-tap favorites and wishlist</li>
          <li>✓ Advanced product search and filtering</li>
          <li>✓ High-resolution Retina images</li>
          <li>✓ Personalized recommendations</li>
        </ul>
      </div>

      <!-- Order Management -->
      <div class="border border-gray-200 rounded-xl p-5">
        <h4 class="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <span class="text-xl">📦</span> Order Management
        </h4>
        <ul class="text-gray-600 space-y-2 text-sm">
          <li>✓ Real-time order tracking</li>
          <li>✓ Push notifications for updates</li>
          <li>✓ Order history with reorder option</li>
          <li>✓ Easy returns and exchanges</li>
          <li>✓ Multiple shipping addresses</li>
        </ul>
      </div>

      <!-- Security -->
      <div class="border border-gray-200 rounded-xl p-5">
        <h4 class="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <span class="text-xl">🔐</span> Security & Convenience
        </h4>
        <ul class="text-gray-600 space-y-2 text-sm">
          <li>✓ Face ID & Touch ID authentication</li>
          <li>✓ Secure biometric login</li>
          <li>✓ Encrypted payment processing</li>
          <li>✓ SSL/TLS security throughout</li>
          <li>✓ Privacy-first design</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Special Launch Benefits -->
  <div class="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl p-6 md:p-8 mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">🎁 Special Launch Benefits</h3>
    <p class="text-center text-gray-700 mb-6">To celebrate our iOS app launch, we're offering <strong>exclusive benefits</strong> for app users:</p>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-white rounded-lg p-4 text-center shadow-sm">
        <div class="text-2xl mb-2">🚚</div>
        <p class="font-semibold text-gray-900">Free Shipping</p>
        <p class="text-sm text-gray-600">Orders over 500 AED</p>
      </div>
      <div class="bg-white rounded-lg p-4 text-center shadow-sm">
        <div class="text-2xl mb-2">⭐</div>
        <p class="font-semibold text-gray-900">Double Points</p>
        <p class="text-sm text-gray-600">On all app purchases</p>
      </div>
      <div class="bg-white rounded-lg p-4 text-center shadow-sm">
        <div class="text-2xl mb-2">🎯</div>
        <p class="font-semibold text-gray-900">Early Access</p>
        <p class="text-sm text-gray-600">New product launches</p>
      </div>
      <div class="bg-white rounded-lg p-4 text-center shadow-sm">
        <div class="text-2xl mb-2">🎁</div>
        <p class="font-semibold text-gray-900">Exclusive Products</p>
        <p class="text-sm text-gray-600">App-only bundles</p>
      </div>
      <div class="bg-white rounded-lg p-4 text-center shadow-sm">
        <div class="text-2xl mb-2">💬</div>
        <p class="font-semibold text-gray-900">Priority Support</p>
        <p class="text-sm text-gray-600">Fast customer service</p>
      </div>
    </div>
  </div>

  <!-- How to Get Started -->
  <div class="mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">📱 How to Get Started</h3>
    
    <div class="grid md:grid-cols-3 gap-6">
      <div class="text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl font-bold text-green-600">1</span>
        </div>
        <h4 class="font-bold text-lg mb-2">Download the App</h4>
        <p class="text-gray-600 text-sm">Open the App Store, search for "Genosys UAE", and tap "Get" to download (it's free!)</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl font-bold text-green-600">2</span>
        </div>
        <h4 class="font-bold text-lg mb-2">Create Your Account</h4>
        <p class="text-gray-600 text-sm">Sign up or log in with existing credentials, then set up Face ID for quick login</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl font-bold text-green-600">3</span>
        </div>
        <h4 class="font-bold text-lg mb-2">Start Shopping</h4>
        <p class="text-gray-600 text-sm">Browse products, add to cart, and checkout with Apple Pay in seconds!</p>
      </div>
    </div>
  </div>

  <!-- App vs Web Comparison -->
  <div class="bg-gray-50 rounded-xl p-6 md:p-8 mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">🆚 App vs Mobile Web – Why Download?</h3>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b-2 border-gray-300">
            <th class="py-3 px-4 font-bold text-gray-900">Feature</th>
            <th class="py-3 px-4 font-bold text-green-600">📱 Native App</th>
            <th class="py-3 px-4 font-bold text-gray-500">🌐 Mobile Web</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          <tr class="border-b border-gray-200">
            <td class="py-3 px-4 font-medium">Speed</td>
            <td class="py-3 px-4 text-green-600">⚡️ 5x faster</td>
            <td class="py-3 px-4 text-gray-500">Standard</td>
          </tr>
          <tr class="border-b border-gray-200 bg-white">
            <td class="py-3 px-4 font-medium">Apple Pay</td>
            <td class="py-3 px-4 text-green-600">✅ Full support</td>
            <td class="py-3 px-4 text-gray-500">Limited</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-3 px-4 font-medium">Face ID Login</td>
            <td class="py-3 px-4 text-green-600">✅ Built-in</td>
            <td class="py-3 px-4 text-gray-500">❌ Not available</td>
          </tr>
          <tr class="border-b border-gray-200 bg-white">
            <td class="py-3 px-4 font-medium">Push Notifications</td>
            <td class="py-3 px-4 text-green-600">✅ Real-time</td>
            <td class="py-3 px-4 text-gray-500">❌ Not available</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-3 px-4 font-medium">Offline Browsing</td>
            <td class="py-3 px-4 text-green-600">✅ Favorites & history</td>
            <td class="py-3 px-4 text-gray-500">❌ Requires connection</td>
          </tr>
          <tr class="border-b border-gray-200 bg-white">
            <td class="py-3 px-4 font-medium">Performance</td>
            <td class="py-3 px-4 text-green-600">✅ Buttery smooth</td>
            <td class="py-3 px-4 text-gray-500">Standard</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- User Testimonials -->
  <div class="mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">💬 What Early Users Are Saying</h3>
    
    <div class="grid md:grid-cols-2 gap-4">
      <div class="bg-white border border-gray-200 rounded-lg p-5">
        <p class="text-gray-700 italic mb-3">"The app is incredibly fast and beautiful. Apple Pay makes checkout so easy!"</p>
        <p class="text-sm font-semibold text-gray-900">– Sarah M., Dubai</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-lg p-5">
        <p class="text-gray-700 italic mb-3">"Finally! A skincare app that actually works perfectly. Love the Arabic support."</p>
        <p class="text-sm font-semibold text-gray-900">– Fatima A., Abu Dhabi</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-lg p-5">
        <p class="text-gray-700 italic mb-3">"Best shopping app I've used. The product images are stunning and checkout is instant."</p>
        <p class="text-sm font-semibold text-gray-900">– Maria K., Sharjah</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-lg p-5">
        <p class="text-gray-700 italic mb-3">"As a clinic owner, this app makes ordering supplies so much easier. Highly recommended!"</p>
        <p class="text-sm font-semibold text-gray-900">– Dr. Ahmed R., Dubai</p>
      </div>
    </div>
  </div>

  <!-- Coming Soon -->
  <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 md:p-8 mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">🌟 What's Coming Next?</h3>
    
    <div class="grid md:grid-cols-2 gap-4">
      <div class="flex items-start gap-3">
        <span class="text-xl">📸</span>
        <div>
          <p class="font-semibold text-gray-900">AR Try-On</p>
          <p class="text-sm text-gray-600">Virtually test products (Q1 2026)</p>
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-xl">🤖</span>
        <div>
          <p class="font-semibold text-gray-900">AI Skin Analysis</p>
          <p class="text-sm text-gray-600">Personalized recommendations (Q2 2026)</p>
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-xl">💬</span>
        <div>
          <p class="font-semibold text-gray-900">In-App Chat</p>
          <p class="text-sm text-gray-600">Talk to skincare experts (Q1 2026)</p>
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-xl">📅</span>
        <div>
          <p class="font-semibold text-gray-900">Subscription Plans</p>
          <p class="text-sm text-gray-600">Auto-delivery service (Q2 2026)</p>
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-xl">⌚</span>
        <div>
          <p class="font-semibold text-gray-900">Apple Watch App</p>
          <p class="text-sm text-gray-600">Quick order tracking (Coming Soon)</p>
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-xl">🎙️</span>
        <div>
          <p class="font-semibold text-gray-900">Siri Shortcuts</p>
          <p class="text-sm text-gray-600">Voice ordering (Coming Soon)</p>
        </div>
      </div>
    </div>
  </div>

  <!-- By the Numbers -->
  <div class="bg-gray-900 text-white rounded-xl p-6 md:p-8 mb-10">
    <h3 class="text-2xl font-bold mb-6 text-center">📊 By the Numbers</h3>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div>
        <p class="text-3xl font-bold text-green-400">6</p>
        <p class="text-sm text-gray-400">Months Development</p>
      </div>
      <div>
        <p class="text-3xl font-bold text-green-400">50K+</p>
        <p class="text-sm text-gray-400">Lines of Code</p>
      </div>
      <div>
        <p class="text-3xl font-bold text-green-400">1000+</p>
        <p class="text-sm text-gray-400">Hours Testing</p>
      </div>
      <div>
        <p class="text-3xl font-bold text-green-400">21</p>
        <p class="text-sm text-gray-400">Device Sizes</p>
      </div>
      <div>
        <p class="text-3xl font-bold text-green-400">3</p>
        <p class="text-sm text-gray-400">Languages</p>
      </div>
      <div>
        <p class="text-3xl font-bold text-green-400">100%</p>
        <p class="text-sm text-gray-400">Feature Complete</p>
      </div>
      <div>
        <p class="text-3xl font-bold text-green-400">✓</p>
        <p class="text-sm text-gray-400">On-Time Delivery</p>
      </div>
      <div>
        <p class="text-3xl font-bold text-green-400">Jan 1</p>
        <p class="text-sm text-gray-400">Launch Date</p>
      </div>
    </div>
  </div>

  <!-- FAQ Section -->
  <div class="mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">❓ Common Questions</h3>
    
    <div class="space-y-4">
      <div class="border border-gray-200 rounded-lg p-4">
        <p class="font-semibold text-gray-900 mb-2">Q: Is the app free?</p>
        <p class="text-gray-600">A: Yes! The app is completely free to download and use.</p>
      </div>
      <div class="border border-gray-200 rounded-lg p-4">
        <p class="font-semibold text-gray-900 mb-2">Q: Can I use my website account?</p>
        <p class="text-gray-600">A: Absolutely! Use the same credentials you use on genosys.ae.</p>
      </div>
      <div class="border border-gray-200 rounded-lg p-4">
        <p class="font-semibold text-gray-900 mb-2">Q: What iOS version do I need?</p>
        <p class="text-gray-600">A: iOS 15.0 or later (works on most iPhones from 2016+).</p>
      </div>
      <div class="border border-gray-200 rounded-lg p-4">
        <p class="font-semibold text-gray-900 mb-2">Q: Is my payment information secure?</p>
        <p class="text-gray-600">A: 100%. We use bank-level encryption and never store your card details.</p>
      </div>
    </div>
  </div>

  <!-- Contact Section -->
  <div class="bg-green-50 border-2 border-green-200 rounded-xl p-6 md:p-8 mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-4 text-center">🆘 Need Help?</h3>
    
    <div class="grid md:grid-cols-2 gap-4 text-center">
      <div>
        <p class="font-semibold mb-2">📧 Email</p>
        <a href="mailto:apps@genosys.ae" class="text-green-600 hover:underline">apps@genosys.ae</a>
      </div>
      <div>
        <p class="font-semibold mb-2">📱 WhatsApp</p>
        <a href="https://wa.me/971585487665" class="text-green-600 hover:underline">+971 58 548 76 65</a>
      </div>
    </div>
  </div>

  <!-- Final CTA -->
  <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-center text-white">
    <h3 class="text-2xl md:text-3xl font-bold mb-4">🎉 Download "Genosys UAE" Today!</h3>
    <p class="text-lg mb-6 opacity-90">Experience the future of skincare shopping on your iPhone and iPad</p>
    <p class="text-sm opacity-75">Available now on the Apple App Store • Free Download</p>
  </div>

  <!-- Signature -->
  <div class="text-center mt-10 pt-6 border-t border-gray-200">
    <p class="text-gray-700 font-semibold">The GENOSYS Middle East Team</p>
    <p class="text-gray-500 italic">Building the future of beauty, one app at a time. ✨</p>
  </div>
</div>`;

// Arabic content
const htmlContentAr = `<div class="blog-content" dir="rtl">
  <!-- Hero Section -->
  <div class="intro-section bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 rounded-xl p-6 md:p-8 mb-8 text-center">
    <div class="text-6xl mb-4">🎉</div>
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">تم إطلاق تطبيق GENOSYS لنظام iOS بنجاح!</h2>
    <p class="text-xl md:text-2xl text-green-700 font-semibold mb-4">متوفر الآن على متجر Apple</p>
    <p class="text-gray-600">تاريخ النشر: 1 يناير 2026 • الفئة: تحديثات المنتج، تطبيق الجوال</p>
  </div>

  <!-- App Store Banner -->
  <div class="bg-black rounded-2xl p-8 mb-8 text-center">
    <p class="text-white text-2xl font-bold mb-2">ابحث عن "Genosys UAE" في متجر التطبيقات</p>
    <p class="text-gray-400">تحميل مجاني • iOS 15.0 أو أحدث</p>
  </div>

  <!-- Features -->
  <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 md:p-8 mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">✨ كل ما وعدنا به - الآن بين يديك</h3>
    
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg p-5 shadow-sm">
        <h4 class="font-bold text-lg text-gray-900 mb-3">🍎 تكامل Apple Pay</h4>
        <p class="text-gray-600">دفع سريع مع Face ID أو Touch ID. بدون كتابة - فقط انقر وانتهى!</p>
      </div>
      <div class="bg-white rounded-lg p-5 shadow-sm">
        <h4 class="font-bold text-lg text-gray-900 mb-3">🌍 دعم متعدد اللغات</h4>
        <p class="text-gray-600">🇬🇧 الإنجليزية • 🇸🇦 العربية (RTL كامل) • 🇷🇺 الروسية</p>
      </div>
      <div class="bg-white rounded-lg p-5 shadow-sm">
        <h4 class="font-bold text-lg text-gray-900 mb-3">⚡️ أداء أصلي لـ iOS</h4>
        <p class="text-gray-600">أسرع 5 مرات من الويب • تصميم جميل • رسوم متحركة سلسة</p>
      </div>
      <div class="bg-white rounded-lg p-5 shadow-sm">
        <h4 class="font-bold text-lg text-gray-900 mb-3">🔐 الأمان والراحة</h4>
        <p class="text-gray-600">Face ID • معالجة مشفرة • تصميم يحترم الخصوصية</p>
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-center text-white">
    <h3 class="text-2xl md:text-3xl font-bold mb-4">🎉 حمّل "Genosys UAE" اليوم!</h3>
    <p class="text-lg mb-6 opacity-90">اكتشف مستقبل التسوق للعناية بالبشرة على iPhone و iPad</p>
  </div>
</div>`;

// Russian content
const htmlContentRu = `<div class="blog-content">
  <!-- Hero Section -->
  <div class="intro-section bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 rounded-xl p-6 md:p-8 mb-8 text-center">
    <div class="text-6xl mb-4">🎉</div>
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Приложение GENOSYS для iOS успешно запущено!</h2>
    <p class="text-xl md:text-2xl text-green-700 font-semibold mb-4">Теперь доступно в Apple App Store</p>
    <p class="text-gray-600">Дата публикации: 1 января 2026 • Категория: Обновления продукта, Мобильное приложение</p>
  </div>

  <!-- App Store Banner -->
  <div class="bg-black rounded-2xl p-8 mb-8 text-center">
    <p class="text-white text-2xl font-bold mb-2">Ищите "Genosys UAE" в App Store</p>
    <p class="text-gray-400">Бесплатная загрузка • iOS 15.0 или новее</p>
  </div>

  <!-- Features -->
  <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 md:p-8 mb-10">
    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">✨ Всё, что мы обещали — теперь в ваших руках</h3>
    
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg p-5 shadow-sm">
        <h4 class="font-bold text-lg text-gray-900 mb-3">🍎 Интеграция Apple Pay</h4>
        <p class="text-gray-600">Молниеносная оплата с Face ID или Touch ID. Без ввода данных — просто нажмите и готово!</p>
      </div>
      <div class="bg-white rounded-lg p-5 shadow-sm">
        <h4 class="font-bold text-lg text-gray-900 mb-3">🌍 Мультиязычная поддержка</h4>
        <p class="text-gray-600">🇬🇧 Английский • 🇸🇦 Арабский (полный RTL) • 🇷🇺 Русский</p>
      </div>
      <div class="bg-white rounded-lg p-5 shadow-sm">
        <h4 class="font-bold text-lg text-gray-900 mb-3">⚡️ Нативная производительность iOS</h4>
        <p class="text-gray-600">В 5 раз быстрее веба • Красивый дизайн • Плавные анимации</p>
      </div>
      <div class="bg-white rounded-lg p-5 shadow-sm">
        <h4 class="font-bold text-lg text-gray-900 mb-3">🔐 Безопасность и удобство</h4>
        <p class="text-gray-600">Face ID • Зашифрованная обработка • Конфиденциальность прежде всего</p>
      </div>
    </div>
  </div>

  <!-- Stats -->
  <div class="bg-gray-900 text-white rounded-xl p-6 md:p-8 mb-10">
    <h3 class="text-2xl font-bold mb-6 text-center">📊 В цифрах</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div>
        <p class="text-3xl font-bold text-green-400">6</p>
        <p class="text-sm text-gray-400">Месяцев разработки</p>
      </div>
      <div>
        <p class="text-3xl font-bold text-green-400">50K+</p>
        <p class="text-sm text-gray-400">Строк кода</p>
      </div>
      <div>
        <p class="text-3xl font-bold text-green-400">3</p>
        <p class="text-sm text-gray-400">Языка</p>
      </div>
      <div>
        <p class="text-3xl font-bold text-green-400">100%</p>
        <p class="text-sm text-gray-400">Готовность</p>
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-center text-white">
    <h3 class="text-2xl md:text-3xl font-bold mb-4">🎉 Скачайте "Genosys UAE" сегодня!</h3>
    <p class="text-lg mb-6 opacity-90">Откройте для себя будущее шопинга косметики на iPhone и iPad</p>
  </div>

  <!-- Signature -->
  <div class="text-center mt-10 pt-6 border-t border-gray-200">
    <p class="text-gray-700 font-semibold">Команда GENOSYS Middle East</p>
    <p class="text-gray-500 italic">Строим будущее красоты, одно приложение за раз. ✨</p>
  </div>
</div>`;

async function updateBlogPost() {
  try {
    console.log('🔄 Updating iOS App blog post with HTML content...')
    
    const updatedPost = await prisma.blogPost.update({
      where: { slug: 'genosys-ios-app-launched-2026' },
      data: {
        content: htmlContent,
        contentAr: htmlContentAr,
        contentRu: htmlContentRu,
        updatedAt: new Date()
      }
    })
    
    console.log('✅ Blog post updated successfully!')
    console.log('   ID:', updatedPost.id)
    console.log('   URL: https://genosys.ae/blog/genosys-ios-app-launched-2026')
    
    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error updating blog post:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

updateBlogPost()

