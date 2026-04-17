#!/usr/bin/env node

/**
 * Create Android App Blog Post — March 2026
 * Announces the GENOSYS UAE app on Google Play for Android devices
 * Slug: genosys-android-app-2026
 */

const { PrismaClient } = require('@prisma/client')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('DATABASE_URL or PRISMA_DATABASE_URL environment variable is required.')
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

const slug = 'genosys-android-app-2026'
const featuredImage = '/blog/post_android/google-play-listing.png'
const authorName = 'GENOSYS Team'
const publishedAt = new Date('2026-03-30T18:00:00+04:00')
const tags = JSON.stringify(['Android App', 'Google Play', 'Mobile Shopping', 'AI', 'Free Download', 'Technology', 'GENOSYS UAE', 'Cash on Delivery'])

// ============================================================
// ENGLISH CONTENT
// ============================================================
const title = 'GENOSYS Is Now on Android — Download Free from Google Play'
const excerpt = 'The GENOSYS UAE app is now available on Android. Browse the full catalog, get AI skin recommendations, build custom sets, and check out with COD or card — all from your Android phone. Free on Google Play.'

const content = `<div class="blog-content">

  <!-- App Icon + Hero -->
  <div class="bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-2xl p-8 md:p-12 mb-10 text-center border border-green-100 shadow-sm">
    <img
      src="/blog/post_android/app.png"
      alt="GENOSYS UAE App Icon"
      class="w-32 h-32 md:w-40 md:h-40 rounded-[22%] shadow-2xl mx-auto mb-6"
    />
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">GENOSYS UAE</h2>
    <p class="text-lg md:text-xl text-gray-600 mb-6">Now Available on Android</p>
    <a
      href="https://play.google.com/store/apps/details?id=ae.genosys.app"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
    >
      <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z"/></svg>
      Get It on Google Play
    </a>
    <p class="text-sm text-gray-500 mt-4">Free download · Android 5.0+ · Phone & Tablet</p>
  </div>

  <!-- Google Play Store Listing Screenshot -->
  <div class="mb-10">
    <a href="https://play.google.com/store/apps/details?id=ae.genosys.app" target="_blank" rel="noopener noreferrer" class="block">
      <img
        src="/blog/post_android/google-play-listing.png"
        alt="Genosys UAE on Google Play — Korean Skincare & Beauty UAE — Free"
        class="rounded-2xl shadow-lg mx-auto max-w-2xl w-full hover:shadow-xl transition-shadow"
      />
    </a>
  </div>

  <!-- Introduction -->
  <div class="mb-10">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-5">
      Great news for Android users across the UAE — the <strong class="text-gray-900">GENOSYS UAE app</strong> is officially live on Google Play. After a successful launch on iOS, we've brought every feature our iPhone customers love to Android, and then some.
    </p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed">
      The app is <strong class="text-gray-900">completely free</strong>, works on phones and tablets, and gives you the fastest, smartest way to shop for professional Korean dermacosmetics in the UAE.
    </p>
  </div>

  <!-- App Screenshots Grid -->
  <div class="mb-10">
    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">See It in Action</h3>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
      <div class="text-center">
        <img
          src="/blog/post_android/screen-product.png"
          alt="GENOSYS Android App - Product detail with pricing and Add to Bag"
          class="rounded-xl shadow-lg w-full border border-gray-200"
        />
        <p class="text-xs text-gray-500 mt-2">Product Detail</p>
      </div>
      <div class="text-center">
        <img
          src="/blog/post_android/screen-cart.png"
          alt="GENOSYS Android App - Shopping cart with bundle discount and free gifts"
          class="rounded-xl shadow-lg w-full border border-gray-200"
        />
        <p class="text-xs text-gray-500 mt-2">Shopping Cart</p>
      </div>
      <div class="text-center">
        <img
          src="/blog/post_android/screen-checkout.png"
          alt="GENOSYS Android App - Checkout with Cash on Delivery and Card Payment"
          class="rounded-xl shadow-lg w-full border border-gray-200"
        />
        <p class="text-xs text-gray-500 mt-2">Secure Checkout</p>
      </div>
    </div>
  </div>

  <!-- Key Features -->
  <div class="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl p-6 md:p-10 mb-10 border border-violet-100">
    <div class="flex items-center gap-3 mb-6">
      <span class="text-4xl">🤖</span>
      <h3 class="text-2xl md:text-3xl font-bold text-gray-900">AI-Powered Skincare</h3>
    </div>
    <p class="text-lg text-gray-700 leading-relaxed mb-6">
      The Android app includes the same <strong class="text-violet-700">AI features</strong> that made our iOS app a hit — personalized skin analysis, smart product recommendations, and a 24/7 AI chat assistant that knows every ingredient in our catalog.
    </p>

    <div class="grid md:grid-cols-2 gap-5">
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center text-xl">📸</span>
          <h4 class="font-bold text-gray-900">AI Skin Analysis</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">Snap a photo or take a quick quiz — our AI analyzes your skin type, concerns, and environment to recommend the perfect products for you.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center text-xl">🎯</span>
          <h4 class="font-bold text-gray-900">Smart Recommendations</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">The more you browse, the smarter the app gets. AI learns your preferences to surface products you'll love.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center text-xl">🎙️</span>
          <h4 class="font-bold text-gray-900">Voice Search</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">Say what you need — "moisturizer for oily skin" or "eye cream" — and the app finds it instantly. Hands-free product discovery.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center text-xl">💬</span>
          <h4 class="font-bold text-gray-900">AI Chat Assistant</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">Ask anything about skincare, ingredients, or routines. Our built-in AI assistant is available 24/7 with expert-level answers.</p>
      </div>
    </div>
  </div>

  <!-- Build Your Set -->
  <div class="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 md:p-10 mb-10 border border-pink-100">
    <div class="flex items-center gap-3 mb-6">
      <span class="text-4xl">🎁</span>
      <h3 class="text-2xl md:text-3xl font-bold text-gray-900">Build Your Set</h3>
    </div>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      Create a custom skincare bundle with our 8-step bundle builder. Mix and match products from cleansers to serums to masks — the more you add, the bigger your discount. It's the smartest way to build a complete routine.
    </p>
    <div class="flex flex-wrap gap-3">
      <span class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-pink-100">3 items → 5% off</span>
      <span class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-pink-100">5 items → 10% off</span>
      <span class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-pink-100">8 items → 15% off</span>
    </div>
  </div>

  <!-- Easy Checkout Section -->
  <div class="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 md:p-10 mb-10 border border-emerald-100">
    <div class="flex items-center gap-3 mb-6">
      <span class="text-4xl">⚡</span>
      <h3 class="text-2xl md:text-3xl font-bold text-gray-900">Fast & Flexible Checkout</h3>
    </div>
    <p class="text-lg text-gray-700 leading-relaxed mb-6">
      We know convenience matters. That's why we offer every payment option you need, including <strong class="text-gray-900">Cash on Delivery</strong> across all emirates — no card needed.
    </p>

    <div class="grid md:grid-cols-3 gap-5 mb-6">
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3 border border-emerald-100">
          <span class="text-3xl">💵</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">Cash on Delivery</h4>
        <p class="text-gray-600 text-sm">Pay when it arrives at your door</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3 border border-emerald-100">
          <span class="text-3xl">💳</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">Card Payment</h4>
        <p class="text-gray-600 text-sm">Visa, Mastercard, Amex via Stripe</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3 border border-emerald-100">
          <span class="text-3xl">📱</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">Google Pay</h4>
        <p class="text-gray-600 text-sm">One tap with biometric authentication</p>
      </div>
    </div>

    <div class="bg-white/70 rounded-xl p-5 border border-emerald-100/50">
      <p class="text-gray-700 text-sm leading-relaxed"><strong>Free shipping</strong> on orders over 1,000 AED. Dubai orders delivered within <strong>1–2 hours</strong>. All other emirates within 1–3 business days.</p>
    </div>
  </div>

  <!-- Complete Feature Grid -->
  <div class="mb-10">
    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Everything You Need, Right in the App</h3>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-xl">🛍️</span>
          <h4 class="font-bold text-gray-900">61+ Products</h4>
        </div>
        <p class="text-gray-600 text-sm">Browse the complete GENOSYS catalog — cleansers, serums, masks, beauty boxes, and more.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-xl">📖</span>
          <h4 class="font-bold text-gray-900">Expert Blog</h4>
        </div>
        <p class="text-gray-600 text-sm">Read skincare articles, ingredient guides, and treatment protocols from our experts.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">📍</span>
          <h4 class="font-bold text-gray-900">Find a Partner</h4>
        </div>
        <p class="text-gray-600 text-sm">Locate authorized GENOSYS clinics and salons near you across the UAE.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-xl">🔐</span>
          <h4 class="font-bold text-gray-900">Fingerprint Login</h4>
        </div>
        <p class="text-gray-600 text-sm">Biometric authentication for quick, secure access — no passwords to remember.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center text-xl">🌍</span>
          <h4 class="font-bold text-gray-900">3 Languages</h4>
        </div>
        <p class="text-gray-600 text-sm">Full support for English, Arabic (with RTL layout), and Russian.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-xl">❤️</span>
          <h4 class="font-bold text-gray-900">Favorites & Wishlist</h4>
        </div>
        <p class="text-gray-600 text-sm">Save products you love with one tap. Your wishlist syncs across devices.</p>
      </div>
    </div>
  </div>

  <!-- Both Platforms -->
  <div class="bg-gray-900 text-white rounded-2xl p-6 md:p-10 mb-10">
    <h3 class="text-2xl font-bold mb-4 text-center">Available on Both Platforms</h3>
    <p class="text-gray-300 text-center mb-8 max-w-xl mx-auto">Whether you use iPhone or Android, the GENOSYS UAE app delivers the same premium shopping experience.</p>

    <div class="grid grid-cols-2 gap-6 max-w-md mx-auto">
      <a href="https://apps.apple.com/ae/app/genosys-uae/id6756648064" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-3 bg-white/10 rounded-xl p-5 hover:bg-white/20 transition-colors">
        <svg viewBox="0 0 24 24" class="w-10 h-10 fill-current text-white"><path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.97 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/></svg>
        <span class="text-sm font-semibold">App Store</span>
      </a>
      <a href="https://play.google.com/store/apps/details?id=ae.genosys.app" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-3 bg-emerald-500/20 rounded-xl p-5 hover:bg-emerald-500/30 transition-colors ring-2 ring-emerald-400">
        <svg viewBox="0 0 24 24" class="w-10 h-10 fill-current text-emerald-400"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z"/></svg>
        <span class="text-sm font-semibold text-emerald-400">Google Play — NEW</span>
      </a>
    </div>
  </div>

  <!-- FAQ -->
  <div class="mb-10">
    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h3>

    <div class="space-y-4 max-w-3xl mx-auto">
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">Is the app free?</p>
        <p class="text-gray-600">Yes, completely free to download and use. No subscriptions, no hidden fees, no in-app purchases.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">Can I use my existing genosys.ae account?</p>
        <p class="text-gray-600">Absolutely. Sign in with the same email and password, or use Google Sign-In. Your favorites, addresses, and order history sync automatically.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">What Android version is required?</p>
        <p class="text-gray-600">Android 5.0 (Lollipop) or later. Works on virtually all modern Android phones and tablets.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">Is Cash on Delivery available?</p>
        <p class="text-gray-600">Yes! COD is available across all UAE emirates. You can also pay by card (Visa, Mastercard, Amex) or Google Pay.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">Do you deliver to all emirates?</p>
        <p class="text-gray-600">Yes — Dubai orders arrive within 1–2 hours. All other emirates within 1–3 business days. Free shipping on orders over 1,000 AED.</p>
      </div>
    </div>
  </div>

  <!-- Download CTA -->
  <div class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 text-center text-white mb-10">
    <img
      src="/blog/post_android/app.png"
      alt="GENOSYS UAE App Icon"
      class="w-24 h-24 rounded-[22%] shadow-2xl mx-auto mb-6"
    />
    <h3 class="text-2xl md:text-3xl font-bold mb-3">Download GENOSYS UAE — It's Free</h3>
    <p class="text-lg text-gray-300 mb-6 max-w-xl mx-auto">Professional Korean dermacosmetics, AI-powered recommendations, and doorstep delivery across the UAE. Now on Android.</p>
    <a
      href="https://play.google.com/store/apps/details?id=ae.genosys.app"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-emerald-600 transition-colors shadow-lg"
    >
      <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z"/></svg>
      Get It on Google Play
    </a>
    <p class="text-sm text-gray-500 mt-4">Free · No ads · No in-app purchases</p>
  </div>

  <!-- Contact -->
  <div class="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8 border border-gray-100">
    <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">Need Help? We're Here for You</h3>
    <div class="flex flex-wrap justify-center gap-6 text-center">
      <div>
        <p class="font-semibold text-gray-900 mb-1">Email</p>
        <a href="mailto:sales@genosys.ae" class="text-emerald-600 hover:underline text-sm">sales@genosys.ae</a>
      </div>
      <div>
        <p class="font-semibold text-gray-900 mb-1">WhatsApp</p>
        <a href="https://wa.me/971585487665" class="text-emerald-600 hover:underline text-sm">+971 58 548 76 65</a>
      </div>
      <div>
        <p class="font-semibold text-gray-900 mb-1">Website</p>
        <a href="https://genosys.ae" class="text-emerald-600 hover:underline text-sm">genosys.ae</a>
      </div>
    </div>
  </div>

  <!-- Signature -->
  <div class="text-center pt-6 border-t border-gray-200">
    <p class="text-gray-700 font-semibold">The GENOSYS Middle East Team</p>
    <p class="text-gray-500 text-sm italic mt-1">Professional Korean dermacosmetics, delivered with care.</p>
  </div>
</div>`

// ============================================================
// ARABIC CONTENT
// ============================================================
const titleAr = 'GENOSYS متاح الآن على أندرويد — حمّل مجاناً من Google Play'
const excerptAr = 'تطبيق GENOSYS UAE متاح الآن على أندرويد. تصفح الكتالوج الكامل، واحصل على توصيات ذكية للعناية بالبشرة، وابنِ مجموعتك المخصصة، وادفع نقداً عند الاستلام أو بالبطاقة — كل ذلك من هاتفك الأندرويد. مجاني على Google Play.'

const contentAr = `<div class="blog-content" dir="rtl">

  <!-- App Icon + Hero -->
  <div class="bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-2xl p-8 md:p-12 mb-10 text-center border border-green-100 shadow-sm">
    <img
      src="/blog/post_android/app.png"
      alt="أيقونة تطبيق GENOSYS UAE"
      class="w-32 h-32 md:w-40 md:h-40 rounded-[22%] shadow-2xl mx-auto mb-6"
    />
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">GENOSYS UAE</h2>
    <p class="text-lg md:text-xl text-gray-600 mb-6">متاح الآن على أندرويد</p>
    <a
      href="https://play.google.com/store/apps/details?id=ae.genosys.app"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
    >
      حمّل من Google Play
    </a>
    <p class="text-sm text-gray-500 mt-4">تحميل مجاني · Android 5.0+ · هاتف وتابلت</p>
  </div>

  <!-- Google Play Screenshot -->
  <div class="mb-10">
    <a href="https://play.google.com/store/apps/details?id=ae.genosys.app" target="_blank" rel="noopener noreferrer" class="block">
      <img
        src="/blog/post_android/google-play-listing.png"
        alt="Genosys UAE على Google Play — مجاني"
        class="rounded-2xl shadow-lg mx-auto max-w-2xl w-full hover:shadow-xl transition-shadow"
      />
    </a>
  </div>

  <!-- Introduction -->
  <div class="mb-10">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-5">
      أخبار رائعة لمستخدمي أندرويد في الإمارات — <strong class="text-gray-900">تطبيق GENOSYS UAE</strong> متاح رسمياً على Google Play. بعد إطلاقنا الناجح على iOS، جلبنا كل الميزات التي يحبها عملاؤنا إلى أندرويد، وأكثر.
    </p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed">
      التطبيق <strong class="text-gray-900">مجاني بالكامل</strong> ويعمل على الهواتف والتابلت، ويمنحك أسرع وأذكى طريقة لتسوق مستحضرات العناية بالبشرة الكورية الاحترافية.
    </p>
  </div>

  <!-- AI Features -->
  <div class="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl p-6 md:p-10 mb-10 border border-violet-100">
    <div class="flex items-center gap-3 mb-6">
      <span class="text-4xl">🤖</span>
      <h3 class="text-2xl md:text-3xl font-bold text-gray-900">عناية بالبشرة مدعومة بالذكاء الاصطناعي</h3>
    </div>
    <div class="grid md:grid-cols-2 gap-5">
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <h4 class="font-bold text-gray-900 mb-2">📸 تحليل البشرة بالذكاء الاصطناعي</h4>
        <p class="text-gray-600 text-sm">التقط صورة أو أجب على اختبار سريع — الذكاء الاصطناعي يحلل نوع بشرتك ويوصي بالمنتجات المناسبة.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <h4 class="font-bold text-gray-900 mb-2">🎯 توصيات ذكية</h4>
        <p class="text-gray-600 text-sm">كلما تصفحت أكثر، أصبح التطبيق أذكى. يتعلم تفضيلاتك ويقترح المنتجات التي ستحبها.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <h4 class="font-bold text-gray-900 mb-2">🎙️ بحث صوتي</h4>
        <p class="text-gray-600 text-sm">قل ما تحتاجه — "مرطب للبشرة الدهنية" أو "كريم للعيون" — والتطبيق يجده فوراً.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <h4 class="font-bold text-gray-900 mb-2">💬 مساعد ذكي في الدردشة</h4>
        <p class="text-gray-600 text-sm">اسأل عن أي شيء — المكونات، المقارنات، الروتين — مساعد الذكاء الاصطناعي متاح 24/7.</p>
      </div>
    </div>
  </div>

  <!-- Checkout -->
  <div class="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 md:p-10 mb-10 border border-emerald-100">
    <div class="flex items-center gap-3 mb-6">
      <span class="text-4xl">⚡</span>
      <h3 class="text-2xl md:text-3xl font-bold text-gray-900">دفع سريع ومرن</h3>
    </div>
    <div class="grid md:grid-cols-3 gap-5 mb-6">
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
          <span class="text-3xl">💵</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">الدفع عند الاستلام</h4>
        <p class="text-gray-600 text-sm">ادفع عند وصول الطلب</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
          <span class="text-3xl">💳</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">بطاقة ائتمان</h4>
        <p class="text-gray-600 text-sm">Visa، Mastercard، Amex</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
          <span class="text-3xl">📱</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">Google Pay</h4>
        <p class="text-gray-600 text-sm">نقرة واحدة مع بصمة الإصبع</p>
      </div>
    </div>
  </div>

  <!-- Both Platforms -->
  <div class="bg-gray-900 text-white rounded-2xl p-6 md:p-10 mb-10">
    <h3 class="text-2xl font-bold mb-4 text-center">متاح على المنصتين</h3>
    <p class="text-gray-300 text-center mb-8">سواء كنت تستخدم iPhone أو Android، تطبيق GENOSYS يقدم نفس التجربة المميزة.</p>
    <div class="grid grid-cols-2 gap-6 max-w-md mx-auto">
      <a href="https://apps.apple.com/ae/app/genosys-uae/id6756648064" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-3 bg-white/10 rounded-xl p-5 hover:bg-white/20 transition-colors">
        <span class="text-3xl">🍎</span>
        <span class="text-sm font-semibold">App Store</span>
      </a>
      <a href="https://play.google.com/store/apps/details?id=ae.genosys.app" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-3 bg-emerald-500/20 rounded-xl p-5 hover:bg-emerald-500/30 transition-colors ring-2 ring-emerald-400">
        <span class="text-3xl">▶️</span>
        <span class="text-sm font-semibold text-emerald-400">Google Play — جديد</span>
      </a>
    </div>
  </div>

  <!-- Download CTA -->
  <div class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 text-center text-white mb-10">
    <img
      src="/blog/post_android/app.png"
      alt="أيقونة التطبيق"
      class="w-24 h-24 rounded-[22%] shadow-2xl mx-auto mb-6"
    />
    <h3 class="text-2xl md:text-3xl font-bold mb-3">حمّل GENOSYS UAE — مجاناً</h3>
    <p class="text-lg text-gray-300 mb-6">مستحضرات كورية احترافية، توصيات ذكية، وتوصيل للباب في الإمارات. الآن على أندرويد.</p>
    <a
      href="https://play.google.com/store/apps/details?id=ae.genosys.app"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-emerald-600 transition-colors shadow-lg"
    >
      حمّل من Google Play
    </a>
    <p class="text-sm text-gray-500 mt-4">مجاني · بدون إعلانات · بدون مشتريات داخلية</p>
  </div>

  <!-- Contact -->
  <div class="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8 border border-gray-100">
    <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">تحتاج مساعدة؟ نحن هنا</h3>
    <div class="flex flex-wrap justify-center gap-6 text-center">
      <div>
        <p class="font-semibold text-gray-900 mb-1">البريد الإلكتروني</p>
        <a href="mailto:sales@genosys.ae" class="text-emerald-600 hover:underline text-sm">sales@genosys.ae</a>
      </div>
      <div>
        <p class="font-semibold text-gray-900 mb-1">واتساب</p>
        <a href="https://wa.me/971585487665" class="text-emerald-600 hover:underline text-sm">+971 58 548 76 65</a>
      </div>
      <div>
        <p class="font-semibold text-gray-900 mb-1">الموقع</p>
        <a href="https://genosys.ae" class="text-emerald-600 hover:underline text-sm">genosys.ae</a>
      </div>
    </div>
  </div>

  <div class="text-center pt-6 border-t border-gray-200">
    <p class="text-gray-700 font-semibold">فريق GENOSYS الشرق الأوسط</p>
    <p class="text-gray-500 text-sm italic mt-1">مستحضرات العناية بالبشرة الكورية الاحترافية، تُوصل بعناية.</p>
  </div>
</div>`

// ============================================================
// RUSSIAN CONTENT
// ============================================================
const titleRu = 'GENOSYS теперь на Android — скачайте бесплатно из Google Play'
const excerptRu = 'Приложение GENOSYS UAE теперь доступно на Android. Полный каталог, ИИ-рекомендации по уходу за кожей, конструктор наборов и оплата наложенным платежом или картой — всё с вашего Android-телефона. Бесплатно в Google Play.'

const contentRu = `<div class="blog-content">

  <!-- App Icon + Hero -->
  <div class="bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-2xl p-8 md:p-12 mb-10 text-center border border-green-100 shadow-sm">
    <img
      src="/blog/post_android/app.png"
      alt="Иконка приложения GENOSYS UAE"
      class="w-32 h-32 md:w-40 md:h-40 rounded-[22%] shadow-2xl mx-auto mb-6"
    />
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">GENOSYS UAE</h2>
    <p class="text-lg md:text-xl text-gray-600 mb-6">Теперь на Android</p>
    <a
      href="https://play.google.com/store/apps/details?id=ae.genosys.app"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
    >
      Скачать в Google Play
    </a>
    <p class="text-sm text-gray-500 mt-4">Бесплатно · Android 5.0+ · Телефон и планшет</p>
  </div>

  <!-- Google Play Screenshot -->
  <div class="mb-10">
    <a href="https://play.google.com/store/apps/details?id=ae.genosys.app" target="_blank" rel="noopener noreferrer" class="block">
      <img
        src="/blog/post_android/google-play-listing.png"
        alt="Genosys UAE в Google Play — бесплатно"
        class="rounded-2xl shadow-lg mx-auto max-w-2xl w-full hover:shadow-xl transition-shadow"
      />
    </a>
  </div>

  <!-- Introduction -->
  <div class="mb-10">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-5">
      Отличная новость для пользователей Android в ОАЭ — <strong class="text-gray-900">приложение GENOSYS UAE</strong> теперь доступно в Google Play. После успешного запуска на iOS мы перенесли все любимые функции наших клиентов на Android — и добавили новые.
    </p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed">
      Приложение <strong class="text-gray-900">полностью бесплатное</strong>, работает на телефонах и планшетах и предлагает самый быстрый и умный способ покупки профессиональной корейской дермакосметики в ОАЭ.
    </p>
  </div>

  <!-- AI Features -->
  <div class="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl p-6 md:p-10 mb-10 border border-violet-100">
    <div class="flex items-center gap-3 mb-6">
      <span class="text-4xl">🤖</span>
      <h3 class="text-2xl md:text-3xl font-bold text-gray-900">ИИ для ухода за кожей</h3>
    </div>
    <div class="grid md:grid-cols-2 gap-5">
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <h4 class="font-bold text-gray-900 mb-2">📸 ИИ-анализ кожи</h4>
        <p class="text-gray-600 text-sm">Сделайте фото или пройдите тест — ИИ определит тип кожи и подберёт идеальные средства.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <h4 class="font-bold text-gray-900 mb-2">🎯 Умные рекомендации</h4>
        <p class="text-gray-600 text-sm">Чем больше вы пользуетесь, тем умнее становится приложение. ИИ изучает ваши предпочтения.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <h4 class="font-bold text-gray-900 mb-2">🎙️ Голосовой поиск</h4>
        <p class="text-gray-600 text-sm">Скажите, что нужно — «увлажняющий крем» или «сыворотка от морщин» — и приложение найдёт мгновенно.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <h4 class="font-bold text-gray-900 mb-2">💬 ИИ-ассистент в чате</h4>
        <p class="text-gray-600 text-sm">Спрашивайте о чём угодно — состав, сравнение, подбор рутины. ИИ доступен 24/7.</p>
      </div>
    </div>
  </div>

  <!-- Checkout -->
  <div class="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 md:p-10 mb-10 border border-emerald-100">
    <div class="flex items-center gap-3 mb-6">
      <span class="text-4xl">⚡</span>
      <h3 class="text-2xl md:text-3xl font-bold text-gray-900">Быстрая и гибкая оплата</h3>
    </div>
    <div class="grid md:grid-cols-3 gap-5 mb-6">
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
          <span class="text-3xl">💵</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">Наложенный платёж</h4>
        <p class="text-gray-600 text-sm">Оплата при получении</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
          <span class="text-3xl">💳</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">Карта</h4>
        <p class="text-gray-600 text-sm">Visa, Mastercard, Amex</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
          <span class="text-3xl">📱</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">Google Pay</h4>
        <p class="text-gray-600 text-sm">Одно касание с отпечатком</p>
      </div>
    </div>
  </div>

  <!-- Both Platforms -->
  <div class="bg-gray-900 text-white rounded-2xl p-6 md:p-10 mb-10">
    <h3 class="text-2xl font-bold mb-4 text-center">Доступно на обеих платформах</h3>
    <p class="text-gray-300 text-center mb-8">iPhone или Android — GENOSYS UAE работает одинаково хорошо.</p>
    <div class="grid grid-cols-2 gap-6 max-w-md mx-auto">
      <a href="https://apps.apple.com/ae/app/genosys-uae/id6756648064" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-3 bg-white/10 rounded-xl p-5 hover:bg-white/20 transition-colors">
        <span class="text-3xl">🍎</span>
        <span class="text-sm font-semibold">App Store</span>
      </a>
      <a href="https://play.google.com/store/apps/details?id=ae.genosys.app" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-3 bg-emerald-500/20 rounded-xl p-5 hover:bg-emerald-500/30 transition-colors ring-2 ring-emerald-400">
        <span class="text-3xl">▶️</span>
        <span class="text-sm font-semibold text-emerald-400">Google Play — НОВИНКА</span>
      </a>
    </div>
  </div>

  <!-- FAQ -->
  <div class="mb-10">
    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Частые вопросы</h3>
    <div class="space-y-4 max-w-3xl mx-auto">
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">Приложение бесплатное?</p>
        <p class="text-gray-600">Да, полностью. Без подписок, без скрытых платежей, без рекламы.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">Можно войти через аккаунт сайта?</p>
        <p class="text-gray-600">Конечно. Тот же email и пароль или Google Sign-In. Избранное, адреса и история синхронизируются.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">Какая версия Android нужна?</p>
        <p class="text-gray-600">Android 5.0 (Lollipop) или новее. Работает на большинстве современных устройств.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">Есть оплата при получении?</p>
        <p class="text-gray-600">Да, наложенный платёж доступен по всем эмиратам. Также принимаем карты и Google Pay.</p>
      </div>
    </div>
  </div>

  <!-- Download CTA -->
  <div class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 text-center text-white mb-10">
    <img
      src="/blog/post_android/app.png"
      alt="Иконка приложения"
      class="w-24 h-24 rounded-[22%] shadow-2xl mx-auto mb-6"
    />
    <h3 class="text-2xl md:text-3xl font-bold mb-3">Скачайте GENOSYS UAE — бесплатно</h3>
    <p class="text-lg text-gray-300 mb-6">Корейская дермакосметика, ИИ-рекомендации и доставка до двери по ОАЭ. Теперь на Android.</p>
    <a
      href="https://play.google.com/store/apps/details?id=ae.genosys.app"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-emerald-600 transition-colors shadow-lg"
    >
      Скачать в Google Play
    </a>
    <p class="text-sm text-gray-500 mt-4">Бесплатно · Без рекламы · Без встроенных покупок</p>
  </div>

  <!-- Contact -->
  <div class="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8 border border-gray-100">
    <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">Нужна помощь? Мы рядом</h3>
    <div class="flex flex-wrap justify-center gap-6 text-center">
      <div>
        <p class="font-semibold text-gray-900 mb-1">Email</p>
        <a href="mailto:sales@genosys.ae" class="text-emerald-600 hover:underline text-sm">sales@genosys.ae</a>
      </div>
      <div>
        <p class="font-semibold text-gray-900 mb-1">WhatsApp</p>
        <a href="https://wa.me/971585487665" class="text-emerald-600 hover:underline text-sm">+971 58 548 76 65</a>
      </div>
      <div>
        <p class="font-semibold text-gray-900 mb-1">Сайт</p>
        <a href="https://genosys.ae" class="text-emerald-600 hover:underline text-sm">genosys.ae</a>
      </div>
    </div>
  </div>

  <div class="text-center pt-6 border-t border-gray-200">
    <p class="text-gray-700 font-semibold">Команда GENOSYS Middle East</p>
    <p class="text-gray-500 text-sm italic mt-1">Профессиональная корейская дермакосметика с доставкой и заботой.</p>
  </div>
</div>`

// ============================================================
// CREATE OR UPDATE THE POST
// ============================================================
async function createBlogPost() {
  try {
    console.log('Creating Android App blog post...')
    console.log('')

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    })

    if (existingPost) {
      const updatedPost = await prisma.blogPost.update({
        where: { slug },
        data: {
          title,
          titleAr,
          titleRu,
          excerpt,
          excerptAr,
          excerptRu,
          content,
          contentAr,
          contentRu,
          featuredImage,
          authorName,
          published: true,
          publishedAt,
          tags,
        }
      })

      console.log('Blog post UPDATED successfully!')
      console.log(`   ID: ${updatedPost.id}`)
      console.log(`   Slug: ${updatedPost.slug}`)
    } else {
      const newPost = await prisma.blogPost.create({
        data: {
          title,
          titleAr,
          titleRu,
          slug,
          excerpt,
          excerptAr,
          excerptRu,
          content,
          contentAr,
          contentRu,
          featuredImage,
          authorName,
          published: true,
          publishedAt,
          tags,
        }
      })

      console.log('Blog post CREATED successfully!')
      console.log(`   ID: ${newPost.id}`)
      console.log(`   Slug: ${newPost.slug}`)
    }

    console.log('')
    console.log('URLs:')
    console.log(`   EN: https://genosys.ae/blog/${slug}`)
    console.log(`   AR: https://genosys.ae/ar/blog/${slug}`)
    console.log(`   RU: https://genosys.ae/ru/blog/${slug}`)
    console.log('')
    console.log('Google Play: https://play.google.com/store/apps/details?id=ae.genosys.app')

    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error('Error creating blog post:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

createBlogPost()
