#!/usr/bin/env node

/**
 * Update iOS App Blog Post - February 2026 Refresh
 * Updates the existing blog post with new content, new date, and new features
 * Slug: genosys-ios-app-launched-2026 (same slug, updated content + date)
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
// ENGLISH CONTENT
// ============================================================
const title = 'GENOSYS iOS App — Free Download, AI-Powered Shopping & Instant Checkout'
const excerpt = 'The GENOSYS UAE app for iPhone and iPad brings AI-powered skincare recommendations, Apple Pay instant checkout, and exclusive in-app deals — all completely free. Download now from the App Store and experience the smartest way to shop for premium Korean dermacosmetics in the UAE.'

const content = `<div class="blog-content">

  <!-- App Icon + Hero -->
  <div class="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl p-8 md:p-12 mb-10 text-center border border-gray-100 shadow-sm">
    <img 
      src="/blog/post_app/app.png" 
      alt="GENOSYS UAE App Icon" 
      class="w-32 h-32 md:w-40 md:h-40 rounded-[22%] shadow-2xl mx-auto mb-6"
    />
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">GENOSYS UAE</h2>
    <p class="text-lg md:text-xl text-gray-600 mb-6">Premium Skincare & Beauty — Now in Your Pocket</p>
    <a 
      href="https://apps.apple.com/app/id6756648064" 
      target="_blank" 
      rel="noopener noreferrer"
      class="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
    >
      <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current"><path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.97 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/></svg>
      Download Free on App Store
    </a>
    <p class="text-sm text-gray-500 mt-4">Free download · iOS 15.0+ · iPhone & iPad</p>
  </div>

  <!-- App Store Banner -->
  <div class="mb-10">
    <a href="https://apps.apple.com/app/id6756648064" target="_blank" rel="noopener noreferrer" class="block">
      <img 
        src="/blog/post_app/app2.png" 
        alt="Genosys UAE on the App Store — Korean Skincare & Beauty UAE — Free" 
        class="rounded-2xl shadow-lg mx-auto max-w-2xl w-full hover:shadow-xl transition-shadow"
      />
    </a>
  </div>

  <!-- App Screenshot -->
  <div class="mb-10 text-center">
    <img 
      src="/blog/post_app/screen.png" 
      alt="GENOSYS UAE iOS App - Browse and shop 61+ premium Korean skincare products" 
      class="rounded-2xl shadow-2xl mx-auto max-w-sm w-full border border-gray-200"
    />
    <p class="text-sm text-gray-500 mt-4 italic">The GENOSYS UAE app — browse 61+ premium products right from your iPhone</p>
  </div>

  <!-- Introduction -->
  <div class="mb-10">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-5">
      Since launching on the Apple App Store, the <strong class="text-gray-900">GENOSYS UAE app</strong> has become the go-to destination for skincare enthusiasts across the Emirates. We've been listening to your feedback and continuously improving the experience — and today we're excited to share everything that makes this app the smartest, fastest, and most convenient way to shop for professional Korean dermacosmetics.
    </p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed">
      Whether you're a long-time GENOSYS customer or just discovering us, the app is <strong class="text-gray-900">completely free to download</strong> and packed with features you won't find anywhere else.
    </p>
  </div>

  <!-- NEW: AI-Powered Features -->
  <div class="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl p-6 md:p-10 mb-10 border border-violet-100">
    <div class="flex items-center gap-3 mb-6">
      <span class="text-4xl">🤖</span>
      <h3 class="text-2xl md:text-3xl font-bold text-gray-900">AI-Powered Shopping Experience</h3>
    </div>
    <p class="text-lg text-gray-700 leading-relaxed mb-6">
      Our latest updates bring <strong class="text-violet-700">artificial intelligence</strong> directly into your skincare routine. The GENOSYS app now learns from your preferences, skin type, and purchase history to deliver a truly personalized experience.
    </p>
    
    <div class="grid md:grid-cols-2 gap-5">
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center text-xl">🎯</span>
          <h4 class="font-bold text-gray-900">Smart Recommendations</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">AI analyzes your skin concerns, past purchases, and browsing patterns to suggest the perfect products for your routine. The more you use the app, the smarter it gets.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center text-xl">🔍</span>
          <h4 class="font-bold text-gray-900">Intelligent Search</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">Type naturally — "something for dry skin" or "anti-aging serum" — and our AI understands exactly what you need, surfacing the most relevant products instantly.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center text-xl">📊</span>
          <h4 class="font-bold text-gray-900">Personalized Routines</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">Get AI-curated morning and evening skincare routines tailored to your specific skin type, climate conditions in the UAE, and your skincare goals.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center text-xl">💡</span>
          <h4 class="font-bold text-gray-900">Reorder Predictions</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">The app learns how quickly you use products and sends timely reminders before you run out, so you never miss a day of your routine.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50 md:col-span-2">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center text-xl">💬</span>
          <h4 class="font-bold text-gray-900">AI Chat Assistant</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">Have a question about a product or need skincare advice? Our built-in AI chat assistant is available 24/7 right inside the app. Ask anything — from ingredient details and product comparisons to personalized routine suggestions — and get instant, expert-level answers.</p>
      </div>
    </div>
  </div>

  <!-- Easy Checkout Section -->
  <div class="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 md:p-10 mb-10 border border-emerald-100">
    <div class="flex items-center gap-3 mb-6">
      <span class="text-4xl">⚡</span>
      <h3 class="text-2xl md:text-3xl font-bold text-gray-900">Checkout in Under 10 Seconds</h3>
    </div>
    <p class="text-lg text-gray-700 leading-relaxed mb-6">
      We've obsessed over making checkout as effortless as possible. With Apple Pay and saved payment methods, you can go from browsing to order confirmed in a single gesture.
    </p>

    <div class="grid md:grid-cols-3 gap-5 mb-6">
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3 border border-emerald-100">
          <span class="text-3xl">🛒</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">1. Add to Cart</h4>
        <p class="text-gray-600 text-sm">Tap any product to add it instantly</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3 border border-emerald-100">
          <span class="text-3xl">🍎</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">2. Apple Pay</h4>
        <p class="text-gray-600 text-sm">Double-click and authenticate with Face ID</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3 border border-emerald-100">
          <span class="text-3xl">✅</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">3. Done!</h4>
        <p class="text-gray-600 text-sm">Order confirmed — delivery on its way</p>
      </div>
    </div>

    <div class="bg-white/70 rounded-xl p-5 border border-emerald-100/50">
      <h4 class="font-bold text-gray-900 mb-3">All Payment Methods Accepted</h4>
      <div class="flex flex-wrap gap-3">
        <span class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-gray-100">🍎 Apple Pay</span>
        <span class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-gray-100">💳 Visa</span>
        <span class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-gray-100">💳 Mastercard</span>
        <span class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-gray-100">💳 Amex</span>
        <span class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-gray-100">🔗 Payment Links</span>
        <span class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-gray-100">🔒 Stripe Secure</span>
      </div>
    </div>
  </div>

  <!-- Complete Feature Grid -->
  <div class="mb-10">
    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Everything You Need, Right in the App</h3>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-xl">🛍️</span>
          <h4 class="font-bold text-gray-900">58+ Products</h4>
        </div>
        <p class="text-gray-600 text-sm">Browse our complete catalog of professional Korean dermacosmetics with high-res Retina images.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-xl">❤️</span>
          <h4 class="font-bold text-gray-900">Favorites & Wishlist</h4>
        </div>
        <p class="text-gray-600 text-sm">Save products you love with one tap. Build your wishlist and never lose track of items you want.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">📦</span>
          <h4 class="font-bold text-gray-900">Real-Time Tracking</h4>
        </div>
        <p class="text-gray-600 text-sm">Follow your order from warehouse to doorstep with live status updates and push notifications.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-xl">🔐</span>
          <h4 class="font-bold text-gray-900">Face ID & Touch ID</h4>
        </div>
        <p class="text-gray-600 text-sm">Secure biometric login — no passwords to remember. Your data is encrypted and private.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center text-xl">🌍</span>
          <h4 class="font-bold text-gray-900">3 Languages</h4>
        </div>
        <p class="text-gray-600 text-sm">Full support for English, Arabic (with RTL), and Russian — switch anytime from the app.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center text-xl">🔔</span>
          <h4 class="font-bold text-gray-900">Push Notifications</h4>
        </div>
        <p class="text-gray-600 text-sm">Get notified about order updates, new arrivals, exclusive sales, and personalized offers.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-xl">🏷️</span>
          <h4 class="font-bold text-gray-900">Smart Categories</h4>
        </div>
        <p class="text-gray-600 text-sm">Filter by Microneedling, PRO Solution, Cleansers, Serums, Masks, Eye Care, and more.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-xl">🔄</span>
          <h4 class="font-bold text-gray-900">Quick Reorder</h4>
        </div>
        <p class="text-gray-600 text-sm">Reorder your favorite products from your order history with a single tap — no searching needed.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-xl">📍</span>
          <h4 class="font-bold text-gray-900">Address Management</h4>
        </div>
        <p class="text-gray-600 text-sm">Save multiple delivery addresses across the UAE. Switch between home, office, or any location.</p>
      </div>
    </div>
  </div>

  <!-- App Performance Stats -->
  <div class="bg-gray-900 text-white rounded-2xl p-6 md:p-10 mb-10">
    <h3 class="text-2xl font-bold mb-8 text-center">Why Thousands of UAE Customers Prefer the App</h3>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      <div>
        <p class="text-4xl font-bold text-emerald-400 mb-1">5x</p>
        <p class="text-sm text-gray-400">Faster Than Web</p>
      </div>
      <div>
        <p class="text-4xl font-bold text-emerald-400 mb-1">&lt;10s</p>
        <p class="text-sm text-gray-400">Checkout Time</p>
      </div>
      <div>
        <p class="text-4xl font-bold text-emerald-400 mb-1">4.9</p>
        <p class="text-sm text-gray-400">App Store Rating</p>
      </div>
      <div>
        <p class="text-4xl font-bold text-emerald-400 mb-1">Free</p>
        <p class="text-sm text-gray-400">Download & Use</p>
      </div>
    </div>
  </div>

  <!-- What Users Say -->
  <div class="mb-10">
    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">What Our Customers Say</h3>
    
    <div class="grid md:grid-cols-2 gap-5">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center gap-1 mb-3 text-yellow-400">
          <span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span>
        </div>
        <p class="text-gray-700 italic mb-4 leading-relaxed">"Apple Pay checkout is a game changer. I added a serum to my cart and paid with Face ID — the whole thing took maybe 8 seconds. Incredible."</p>
        <p class="text-sm font-semibold text-gray-900">Sarah M. — Dubai</p>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center gap-1 mb-3 text-yellow-400">
          <span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span>
        </div>
        <p class="text-gray-700 italic mb-4 leading-relaxed">"I love that it recommends products based on what I've bought before. The Arabic language support is excellent — feels like the app was made for the UAE market."</p>
        <p class="text-sm font-semibold text-gray-900">Fatima A. — Abu Dhabi</p>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center gap-1 mb-3 text-yellow-400">
          <span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span>
        </div>
        <p class="text-gray-700 italic mb-4 leading-relaxed">"As a clinic owner, I reorder supplies weekly. The quick reorder feature saves me so much time. Best beauty app in the region, hands down."</p>
        <p class="text-sm font-semibold text-gray-900">Dr. Ahmed R. — Dubai</p>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center gap-1 mb-3 text-yellow-400">
          <span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span>
        </div>
        <p class="text-gray-700 italic mb-4 leading-relaxed">"Push notifications let me know the moment new products drop. I got the new Beauty Box set before it even appeared on the website. Love it!"</p>
        <p class="text-sm font-semibold text-gray-900">Maria K. — Sharjah</p>
      </div>
    </div>
  </div>

  <!-- FAQ -->
  <div class="mb-10">
    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h3>
    
    <div class="space-y-4 max-w-3xl mx-auto">
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">Is the app free?</p>
        <p class="text-gray-600">Yes, completely free to download and use. No subscriptions, no hidden fees. Just open the App Store, search "Genosys UAE", and tap Get.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">Can I use my existing website account?</p>
        <p class="text-gray-600">Absolutely. Use the same email and password you use on genosys.ae. Your favorites, order history, and saved addresses sync automatically.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">What iOS version is required?</p>
        <p class="text-gray-600">iOS 15.0 or later. The app works on iPhone (2016 and newer) and all iPad models that support iOS 15.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">Is Apple Pay secure?</p>
        <p class="text-gray-600">100%. Apple Pay uses tokenization — your actual card number is never stored or shared. Payments are authenticated with Face ID or Touch ID.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">Do you ship across the UAE?</p>
        <p class="text-gray-600">Yes! We deliver to all emirates. Free shipping on orders over 1,000 AED. Most orders in Dubai arrive within 1-2 business days.</p>
      </div>
    </div>
  </div>

  <!-- Download CTA -->
  <div class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 text-center text-white mb-10">
    <img 
      src="/blog/post_app/app.png" 
      alt="GENOSYS UAE App Icon" 
      class="w-24 h-24 rounded-[22%] shadow-2xl mx-auto mb-6"
    />
    <h3 class="text-2xl md:text-3xl font-bold mb-3">Download GENOSYS UAE — It's Free</h3>
    <p class="text-lg text-gray-300 mb-6 max-w-xl mx-auto">Join thousands of customers across the UAE who've upgraded their skincare shopping experience. Available on iPhone and iPad.</p>
    <a 
      href="https://apps.apple.com/app/id6756648064" 
      target="_blank" 
      rel="noopener noreferrer"
      class="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
    >
      <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current"><path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.97 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/></svg>
      Download on the App Store
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
const titleAr = 'تطبيق GENOSYS للآيفون — تحميل مجاني، تسوق ذكي بالذكاء الاصطناعي ودفع فوري'
const excerptAr = 'تطبيق GENOSYS UAE للآيفون والآيباد يقدم توصيات ذكية للعناية بالبشرة، دفع فوري عبر Apple Pay، وعروض حصرية — مجاناً بالكامل. حمّله الآن من App Store واستمتع بأذكى طريقة لشراء مستحضرات العناية بالبشرة الكورية الاحترافية في الإمارات.'

const contentAr = `<div class="blog-content" dir="rtl">

  <!-- App Icon + Hero -->
  <div class="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl p-8 md:p-12 mb-10 text-center border border-gray-100 shadow-sm">
    <img 
      src="/blog/post_app/app.png" 
      alt="أيقونة تطبيق GENOSYS UAE" 
      class="w-32 h-32 md:w-40 md:h-40 rounded-[22%] shadow-2xl mx-auto mb-6"
    />
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">GENOSYS UAE</h2>
    <p class="text-lg md:text-xl text-gray-600 mb-6">العناية بالبشرة الفاخرة — الآن في جيبك</p>
    <a 
      href="https://apps.apple.com/app/id6756648064" 
      target="_blank" 
      rel="noopener noreferrer"
      class="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
    >
      حمّل مجاناً من App Store
    </a>
    <p class="text-sm text-gray-500 mt-4">تحميل مجاني · iOS 15.0+ · iPhone و iPad</p>
  </div>

  <!-- App Store Banner -->
  <div class="mb-10">
    <a href="https://apps.apple.com/app/id6756648064" target="_blank" rel="noopener noreferrer" class="block">
      <img 
        src="/blog/post_app/app2.png" 
        alt="Genosys UAE في متجر التطبيقات — مجاني" 
        class="rounded-2xl shadow-lg mx-auto max-w-2xl w-full hover:shadow-xl transition-shadow"
      />
    </a>
  </div>

  <!-- App Screenshot -->
  <div class="mb-10 text-center">
    <img 
      src="/blog/post_app/screen.png" 
      alt="تطبيق GENOSYS UAE iOS - تصفح وتسوق" 
      class="rounded-2xl shadow-2xl mx-auto max-w-sm w-full border border-gray-200"
    />
    <p class="text-sm text-gray-500 mt-4 italic">تطبيق GENOSYS UAE — تصفح أكثر من 61 منتجاً احترافياً مباشرة من الآيفون</p>
  </div>

  <!-- Introduction -->
  <div class="mb-10">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-5">
      منذ إطلاقه على App Store، أصبح <strong class="text-gray-900">تطبيق GENOSYS UAE</strong> الوجهة المفضلة لعشاق العناية بالبشرة في الإمارات. نستمع لملاحظاتكم ونحسّن التجربة باستمرار — واليوم نشارككم كل ما يجعل هذا التطبيق الأذكى والأسرع والأكثر راحة لتسوق مستحضرات العناية بالبشرة الكورية الاحترافية.
    </p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed">
      التطبيق <strong class="text-gray-900">مجاني بالكامل</strong> ومليء بالميزات التي لن تجدها في أي مكان آخر.
    </p>
  </div>

  <!-- AI Features -->
  <div class="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl p-6 md:p-10 mb-10 border border-violet-100">
    <div class="flex items-center gap-3 mb-6">
      <span class="text-4xl">🤖</span>
      <h3 class="text-2xl md:text-3xl font-bold text-gray-900">تسوق ذكي بالذكاء الاصطناعي</h3>
    </div>
    <p class="text-lg text-gray-700 leading-relaxed mb-6">
      تحديثاتنا الأخيرة تجلب <strong class="text-violet-700">الذكاء الاصطناعي</strong> مباشرة إلى روتين العناية ببشرتك. يتعلم التطبيق من تفضيلاتك ونوع بشرتك وتاريخ مشترياتك لتقديم تجربة شخصية بالكامل.
    </p>
    
    <div class="grid md:grid-cols-2 gap-5">
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <h4 class="font-bold text-gray-900 mb-2">🎯 توصيات ذكية</h4>
        <p class="text-gray-600 text-sm">الذكاء الاصطناعي يحلل اهتمامات بشرتك ومشترياتك السابقة لاقتراح المنتجات المثالية لروتينك.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <h4 class="font-bold text-gray-900 mb-2">🔍 بحث ذكي</h4>
        <p class="text-gray-600 text-sm">اكتب بشكل طبيعي — "شيء للبشرة الجافة" أو "سيروم مكافحة الشيخوخة" — والذكاء الاصطناعي يفهم ما تحتاجه.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <h4 class="font-bold text-gray-900 mb-2">📊 روتين مخصص</h4>
        <p class="text-gray-600 text-sm">روتين صباحي ومسائي مصمم خصيصاً لنوع بشرتك ومناخ الإمارات.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <h4 class="font-bold text-gray-900 mb-2">💡 تنبيهات إعادة الطلب</h4>
        <p class="text-gray-600 text-sm">التطبيق يتعلم سرعة استخدامك للمنتجات ويذكرك قبل نفادها.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50 md:col-span-2">
        <h4 class="font-bold text-gray-900 mb-2">💬 مساعد الذكاء الاصطناعي</h4>
        <p class="text-gray-600 text-sm">هل لديك سؤال عن منتج أو تحتاج نصيحة للعناية بالبشرة؟ مساعد الذكاء الاصطناعي المدمج متاح على مدار الساعة داخل التطبيق. اسأل عن أي شيء — من تفاصيل المكونات ومقارنات المنتجات إلى اقتراحات الروتين المخصص — واحصل على إجابات فورية بمستوى الخبراء.</p>
      </div>
    </div>
  </div>

  <!-- Easy Checkout -->
  <div class="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 md:p-10 mb-10 border border-emerald-100">
    <div class="flex items-center gap-3 mb-6">
      <span class="text-4xl">⚡</span>
      <h3 class="text-2xl md:text-3xl font-bold text-gray-900">الدفع في أقل من 10 ثوانٍ</h3>
    </div>
    <p class="text-lg text-gray-700 leading-relaxed mb-6">
      مع Apple Pay وطرق الدفع المحفوظة، يمكنك الانتقال من التصفح إلى تأكيد الطلب بحركة واحدة.
    </p>
    <div class="grid md:grid-cols-3 gap-5 mb-6">
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
          <span class="text-3xl">🛒</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">1. أضف للسلة</h4>
        <p class="text-gray-600 text-sm">انقر على أي منتج لإضافته فوراً</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
          <span class="text-3xl">🍎</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">2. Apple Pay</h4>
        <p class="text-gray-600 text-sm">انقر مرتين وتحقق بـ Face ID</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
          <span class="text-3xl">✅</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">3. تم!</h4>
        <p class="text-gray-600 text-sm">تم تأكيد الطلب — التوصيل في الطريق</p>
      </div>
    </div>
  </div>

  <!-- Stats -->
  <div class="bg-gray-900 text-white rounded-2xl p-6 md:p-10 mb-10">
    <h3 class="text-2xl font-bold mb-8 text-center">لماذا يفضل عملاء الإمارات التطبيق</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      <div>
        <p class="text-4xl font-bold text-emerald-400 mb-1">5x</p>
        <p class="text-sm text-gray-400">أسرع من الويب</p>
      </div>
      <div>
        <p class="text-4xl font-bold text-emerald-400 mb-1">&lt;10s</p>
        <p class="text-sm text-gray-400">وقت الدفع</p>
      </div>
      <div>
        <p class="text-4xl font-bold text-emerald-400 mb-1">4.9</p>
        <p class="text-sm text-gray-400">تقييم App Store</p>
      </div>
      <div>
        <p class="text-4xl font-bold text-emerald-400 mb-1">مجاني</p>
        <p class="text-sm text-gray-400">التحميل والاستخدام</p>
      </div>
    </div>
  </div>

  <!-- Download CTA -->
  <div class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 text-center text-white mb-10">
    <img 
      src="/blog/post_app/app.png" 
      alt="أيقونة التطبيق" 
      class="w-24 h-24 rounded-[22%] shadow-2xl mx-auto mb-6"
    />
    <h3 class="text-2xl md:text-3xl font-bold mb-3">حمّل GENOSYS UAE — مجاناً</h3>
    <p class="text-lg text-gray-300 mb-6">انضم إلى آلاف العملاء في الإمارات. متوفر على iPhone و iPad.</p>
    <a 
      href="https://apps.apple.com/app/id6756648064" 
      target="_blank" 
      rel="noopener noreferrer"
      class="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
    >
      حمّل من App Store
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

  <!-- Signature -->
  <div class="text-center pt-6 border-t border-gray-200">
    <p class="text-gray-700 font-semibold">فريق GENOSYS الشرق الأوسط</p>
    <p class="text-gray-500 text-sm italic mt-1">مستحضرات العناية بالبشرة الكورية الاحترافية، تُوصل بعناية.</p>
  </div>
</div>`

// ============================================================
// RUSSIAN CONTENT
// ============================================================
const titleRu = 'Приложение GENOSYS для iOS — бесплатно, с ИИ-рекомендациями и мгновенной оплатой'
const excerptRu = 'Приложение GENOSYS UAE для iPhone и iPad предлагает ИИ-рекомендации по уходу за кожей, мгновенную оплату через Apple Pay и эксклюзивные предложения — абсолютно бесплатно. Скачайте из App Store и откройте для себя самый умный способ покупки профессиональной корейской дермакосметики в ОАЭ.'

const contentRu = `<div class="blog-content">

  <!-- App Icon + Hero -->
  <div class="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl p-8 md:p-12 mb-10 text-center border border-gray-100 shadow-sm">
    <img 
      src="/blog/post_app/app.png" 
      alt="Иконка приложения GENOSYS UAE" 
      class="w-32 h-32 md:w-40 md:h-40 rounded-[22%] shadow-2xl mx-auto mb-6"
    />
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">GENOSYS UAE</h2>
    <p class="text-lg md:text-xl text-gray-600 mb-6">Премиум-косметика — теперь у вас в кармане</p>
    <a 
      href="https://apps.apple.com/app/id6756648064" 
      target="_blank" 
      rel="noopener noreferrer"
      class="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
    >
      Скачать бесплатно в App Store
    </a>
    <p class="text-sm text-gray-500 mt-4">Бесплатно · iOS 15.0+ · iPhone и iPad</p>
  </div>

  <!-- App Store Banner -->
  <div class="mb-10">
    <a href="https://apps.apple.com/app/id6756648064" target="_blank" rel="noopener noreferrer" class="block">
      <img 
        src="/blog/post_app/app2.png" 
        alt="Genosys UAE в App Store — бесплатно" 
        class="rounded-2xl shadow-lg mx-auto max-w-2xl w-full hover:shadow-xl transition-shadow"
      />
    </a>
  </div>

  <!-- App Screenshot -->
  <div class="mb-10 text-center">
    <img 
      src="/blog/post_app/screen.png" 
      alt="Приложение GENOSYS UAE iOS" 
      class="rounded-2xl shadow-2xl mx-auto max-w-sm w-full border border-gray-200"
    />
    <p class="text-sm text-gray-500 mt-4 italic">Приложение GENOSYS UAE — более 61 премиум-продуктов прямо на вашем iPhone</p>
  </div>

  <!-- Introduction -->
  <div class="mb-10">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-5">
      С момента запуска в App Store <strong class="text-gray-900">приложение GENOSYS UAE</strong> стало главным инструментом для ценителей ухода за кожей в Эмиратах. Мы постоянно прислушиваемся к вашим отзывам и совершенствуем приложение — и сегодня мы рады рассказать обо всём, что делает его самым умным, быстрым и удобным способом покупки профессиональной корейской дермакосметики.
    </p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed">
      Приложение <strong class="text-gray-900">полностью бесплатное</strong> и наполнено функциями, которых вы не найдёте больше нигде.
    </p>
  </div>

  <!-- AI Features -->
  <div class="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl p-6 md:p-10 mb-10 border border-violet-100">
    <div class="flex items-center gap-3 mb-6">
      <span class="text-4xl">🤖</span>
      <h3 class="text-2xl md:text-3xl font-bold text-gray-900">ИИ-рекомендации для покупок</h3>
    </div>
    <p class="text-lg text-gray-700 leading-relaxed mb-6">
      Последние обновления привносят <strong class="text-violet-700">искусственный интеллект</strong> прямо в ваш уход за кожей. Приложение учится на ваших предпочтениях, типе кожи и истории покупок, чтобы предложить по-настоящему персонализированный опыт.
    </p>
    
    <div class="grid md:grid-cols-2 gap-5">
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <h4 class="font-bold text-gray-900 mb-2">🎯 Умные рекомендации</h4>
        <p class="text-gray-600 text-sm">ИИ анализирует потребности вашей кожи и историю покупок, предлагая идеальные продукты для вашего ухода.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <h4 class="font-bold text-gray-900 mb-2">🔍 Умный поиск</h4>
        <p class="text-gray-600 text-sm">Пишите естественно — «для сухой кожи» или «антивозрастная сыворотка» — ИИ точно понимает, что вам нужно.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <h4 class="font-bold text-gray-900 mb-2">📊 Персональные программы</h4>
        <p class="text-gray-600 text-sm">ИИ составляет утренний и вечерний уход, учитывая ваш тип кожи и климат ОАЭ.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50">
        <h4 class="font-bold text-gray-900 mb-2">💡 Напоминания о повторных заказах</h4>
        <p class="text-gray-600 text-sm">Приложение запоминает, как быстро вы используете продукты, и напоминает до того, как они закончатся.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-violet-100/50 md:col-span-2">
        <h4 class="font-bold text-gray-900 mb-2">💬 ИИ-ассистент в чате</h4>
        <p class="text-gray-600 text-sm">Есть вопрос о продукте или нужен совет по уходу за кожей? Встроенный ИИ-ассистент доступен 24/7 прямо в приложении. Спрашивайте о чём угодно — от состава и сравнения продуктов до персональных рекомендаций — и получайте мгновенные экспертные ответы.</p>
      </div>
    </div>
  </div>

  <!-- Easy Checkout -->
  <div class="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 md:p-10 mb-10 border border-emerald-100">
    <div class="flex items-center gap-3 mb-6">
      <span class="text-4xl">⚡</span>
      <h3 class="text-2xl md:text-3xl font-bold text-gray-900">Оплата менее чем за 10 секунд</h3>
    </div>
    <p class="text-lg text-gray-700 leading-relaxed mb-6">
      С Apple Pay и сохранёнными способами оплаты можно перейти от просмотра к подтверждению заказа одним движением.
    </p>
    <div class="grid md:grid-cols-3 gap-5 mb-6">
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
          <span class="text-3xl">🛒</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">1. В корзину</h4>
        <p class="text-gray-600 text-sm">Нажмите на любой товар</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
          <span class="text-3xl">🍎</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">2. Apple Pay</h4>
        <p class="text-gray-600 text-sm">Двойное нажатие и Face ID</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
          <span class="text-3xl">✅</span>
        </div>
        <h4 class="font-bold text-gray-900 mb-1">3. Готово!</h4>
        <p class="text-gray-600 text-sm">Заказ подтверждён — доставка в пути</p>
      </div>
    </div>
  </div>

  <!-- Stats -->
  <div class="bg-gray-900 text-white rounded-2xl p-6 md:p-10 mb-10">
    <h3 class="text-2xl font-bold mb-8 text-center">Почему клиенты в ОАЭ выбирают приложение</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      <div>
        <p class="text-4xl font-bold text-emerald-400 mb-1">5x</p>
        <p class="text-sm text-gray-400">Быстрее веба</p>
      </div>
      <div>
        <p class="text-4xl font-bold text-emerald-400 mb-1">&lt;10с</p>
        <p class="text-sm text-gray-400">Время оплаты</p>
      </div>
      <div>
        <p class="text-4xl font-bold text-emerald-400 mb-1">4.9</p>
        <p class="text-sm text-gray-400">Рейтинг App Store</p>
      </div>
      <div>
        <p class="text-4xl font-bold text-emerald-400 mb-1">Бесплатно</p>
        <p class="text-sm text-gray-400">Скачать и использовать</p>
      </div>
    </div>
  </div>

  <!-- Reviews -->
  <div class="mb-10">
    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Что говорят наши клиенты</h3>
    <div class="grid md:grid-cols-2 gap-5">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center gap-1 mb-3 text-yellow-400">
          <span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span>
        </div>
        <p class="text-gray-700 italic mb-4">"Оплата через Apple Pay — это нечто. Добавила сыворотку и оплатила через Face ID за 8 секунд. Невероятно."</p>
        <p class="text-sm font-semibold text-gray-900">Сара М. — Дубай</p>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center gap-1 mb-3 text-yellow-400">
          <span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span>
        </div>
        <p class="text-gray-700 italic mb-4">"Как владелец клиники, я заказываю каждую неделю. Быстрый повторный заказ экономит мне массу времени."</p>
        <p class="text-sm font-semibold text-gray-900">Доктор Ахмед Р. — Дубай</p>
      </div>
    </div>
  </div>

  <!-- FAQ -->
  <div class="mb-10">
    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Частые вопросы</h3>
    <div class="space-y-4 max-w-3xl mx-auto">
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">Приложение бесплатное?</p>
        <p class="text-gray-600">Да, полностью бесплатное. Без подписок, без скрытых платежей. Просто найдите «Genosys UAE» в App Store и нажмите «Загрузить».</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">Можно использовать аккаунт с сайта?</p>
        <p class="text-gray-600">Конечно. Используйте тот же email и пароль. Избранное, история заказов и адреса синхронизируются автоматически.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">Какая версия iOS нужна?</p>
        <p class="text-gray-600">iOS 15.0 или новее. Работает на iPhone (с 2016 года) и всех iPad с iOS 15.</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="font-bold text-gray-900 mb-2">Apple Pay безопасен?</p>
        <p class="text-gray-600">Да, на 100%. Apple Pay использует токенизацию — ваши данные карты никогда не хранятся и не передаются.</p>
      </div>
    </div>
  </div>

  <!-- Download CTA -->
  <div class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 text-center text-white mb-10">
    <img 
      src="/blog/post_app/app.png" 
      alt="Иконка приложения" 
      class="w-24 h-24 rounded-[22%] shadow-2xl mx-auto mb-6"
    />
    <h3 class="text-2xl md:text-3xl font-bold mb-3">Скачайте GENOSYS UAE — бесплатно</h3>
    <p class="text-lg text-gray-300 mb-6">Присоединяйтесь к тысячам клиентов в ОАЭ. Доступно на iPhone и iPad.</p>
    <a 
      href="https://apps.apple.com/app/id6756648064" 
      target="_blank" 
      rel="noopener noreferrer"
      class="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
    >
      Скачать в App Store
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

  <!-- Signature -->
  <div class="text-center pt-6 border-t border-gray-200">
    <p class="text-gray-700 font-semibold">Команда GENOSYS Middle East</p>
    <p class="text-gray-500 text-sm italic mt-1">Профессиональная корейская дермакосметика с доставкой и заботой.</p>
  </div>
</div>`

// ============================================================
// UPDATE THE POST
// ============================================================
const newSlug = 'genosys-ios-app-2026'
const featuredImage = '/blog/post_app/app2.png'
const authorName = 'GENOSYS Team'
const publishedAt = new Date('2026-02-09T10:00:00+04:00') // Today's date in UAE time
const tags = JSON.stringify(['iOS App', 'Mobile Shopping', 'Apple Pay', 'AI', 'Free Download', 'Artificial Intelligence', 'Technology', 'GENOSYS UAE'])

async function updateBlogPost() {
  try {
    console.log('🔄 Updating iOS App blog post with refreshed February 2026 content...')
    console.log('')
    
    // First, check if the post exists (could be old or new slug)
    let existingPost = await prisma.blogPost.findUnique({
      where: { slug: newSlug }
    })
    if (!existingPost) {
      existingPost = await prisma.blogPost.findUnique({
        where: { slug: 'genosys-ios-app-launched-2026' }
      })
    }
    
    if (!existingPost) {
      console.log('⚠️  Old post with slug "genosys-ios-app-launched-2026" not found.')
      console.log('   Trying to find any iOS app post...')
      
      const anyPost = await prisma.blogPost.findFirst({
        where: { 
          OR: [
            { slug: { contains: 'ios' } },
            { slug: { contains: 'app' } },
            { title: { contains: 'iOS' } },
          ]
        }
      })
      
      if (anyPost) {
        console.log(`   Found: "${anyPost.title}" (slug: ${anyPost.slug})`)
      } else {
        console.log('   No iOS app posts found. Creating a new one...')
      }
    }
    
    // Check if new slug already exists (different from old slug)
    const existingNewSlug = await prisma.blogPost.findUnique({
      where: { slug: newSlug }
    })
    
    if (existingNewSlug && existingPost && existingNewSlug.id !== existingPost.id) {
      console.log(`⚠️  Post with slug "${newSlug}" already exists. Deleting it first...`)
      await prisma.blogPost.delete({ where: { slug: newSlug } })
    }
    
    if (existingPost) {
      // Update the existing post
      const updatedPost = await prisma.blogPost.update({
        where: { id: existingPost.id },
        data: {
          title,
          titleAr,
          titleRu,
          slug: newSlug,
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
          views: 0, // Reset views for fresh post appearance
        }
      })
      
      console.log('✅ Blog post UPDATED successfully!')
      console.log(`   ID: ${updatedPost.id}`)
      console.log(`   New slug: ${updatedPost.slug}`)
      console.log(`   Published at: ${updatedPost.publishedAt}`)
    } else {
      // Create a new post
      const newPost = await prisma.blogPost.create({
        data: {
          title,
          titleAr,
          titleRu,
          slug: newSlug,
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
      
      console.log('✅ Blog post CREATED successfully!')
      console.log(`   ID: ${newPost.id}`)
      console.log(`   Slug: ${newPost.slug}`)
      console.log(`   Published at: ${newPost.publishedAt}`)
    }

    console.log('')
    console.log('🌐 URLs:')
    console.log(`   EN: https://genosys.ae/blog/${newSlug}`)
    console.log(`   AR: https://genosys.ae/ar/blog/${newSlug}`)
    console.log(`   RU: https://genosys.ae/ru/blog/${newSlug}`)
    console.log('')
    console.log('📱 App Store: https://apps.apple.com/app/id6756648064')
    
    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error updating blog post:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

updateBlogPost()
