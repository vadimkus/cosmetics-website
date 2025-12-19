import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'

export async function POST(_request: NextRequest) {
  try {
    // Blog post data
    const blogPostData = {
      title: "New Payment Options: Pay Effortlessly with Apple Pay, Google Pay & More",
      slug: "new-stripe-payment-options-apple-pay-google-pay-2025",
      excerpt: "Experience seamless checkout with our new Stripe-powered payment system. Now supporting Apple Pay, Google Pay, Link, and all major credit cards for secure and instant online payments.",
      content: `<div class="max-w-4xl mx-auto space-y-8">
  <div>
    <h2 class="text-3xl font-bold mb-4">🚀 Exciting News: Enhanced Payment Experience</h2>
    <p class="text-lg text-gray-700 mb-6">We're thrilled to announce a major upgrade to our checkout experience! Our new Stripe-powered payment system now supports multiple payment methods, making it easier than ever to complete your GENOSYS skincare purchases.</p>
  </div>

  <div>
    <h3 class="text-2xl font-semibold mb-6">💳 Available Payment Options</h3>
    <div class="grid gap-6 md:grid-cols-2">
      <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg">
        <h4 class="text-xl font-semibold mb-3">🍎 Apple Pay</h4>
        <p class="text-gray-700">iPhone and Mac users can now pay instantly using Touch ID, Face ID, or Apple Watch. Your payment information is securely stored and protected by Apple's advanced security features.</p>
      </div>
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
        <h4 class="text-xl font-semibold mb-3">📱 Google Pay</h4>
        <p class="text-gray-700">Android users can enjoy seamless checkout with Google Pay. Fast, secure, and convenient - complete your purchase with just a few taps.</p>
      </div>
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
        <h4 class="text-xl font-semibold mb-3">🔗 Link by Stripe</h4>
        <p class="text-gray-700">Save your payment information securely with Link and enjoy lightning-fast checkout across all your favorite stores. One-click payments, maximum security.</p>
      </div>
      <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
        <h4 class="text-xl font-semibold mb-3">💳 Credit & Debit Cards</h4>
        <p class="text-gray-700">All major credit and debit cards are accepted, including Visa, Mastercard, American Express, and local UAE banking cards. Your transactions are protected by bank-level security.</p>
      </div>
    </div>
  </div>

  <div>
    <h3 class="text-2xl font-semibold mb-4">✨ Why This Matters for You</h3>
    <div class="bg-red-50 p-6 rounded-lg">
      <ul class="space-y-3">
        <li class="flex items-start gap-3"><span class="text-red-600 font-semibold">🔒</span><span><strong>Enhanced Security:</strong> All payments are processed through Stripe's industry-leading security infrastructure</span></li>
        <li class="flex items-start gap-3"><span class="text-red-600 font-semibold">⚡</span><span><strong>Faster Checkout:</strong> Complete your purchase in seconds with saved payment methods</span></li>
        <li class="flex items-start gap-3"><span class="text-red-600 font-semibold">🌍</span><span><strong>Global Support:</strong> Works seamlessly across UAE, GCC, and international customers</span></li>
        <li class="flex items-start gap-3"><span class="text-red-600 font-semibold">📱</span><span><strong>Mobile Optimized:</strong> Perfect checkout experience on any device</span></li>
        <li class="flex items-start gap-3"><span class="text-red-600 font-semibold">🛡️</span><span><strong>Fraud Protection:</strong> Advanced fraud detection keeps your payments safe</span></li>
      </ul>
    </div>
  </div>

  <div class="text-center bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-lg">
    <h3 class="text-2xl font-bold mb-4">🎉 Ready to Experience the Future of Payment?</h3>
    <p class="text-lg mb-6">Visit our store now and try the new checkout experience. Whether you're purchasing our latest Bio-Meso PDRN treatments, HR³ Matrix solutions, or EyeCell products, payment has never been this smooth!</p>
    <a href="/products" class="inline-block bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">Shop Now with New Payment Options</a>
  </div>
</div>`,

      titleRu: "Новые способы оплаты: Легко платите с Apple Pay, Google Pay и другими",
      excerptRu: "Испытайте бесшовную оплату с нашей новой платёжной системой Stripe. Теперь поддерживаются Apple Pay, Google Pay, Link и все основные кредитные карты для безопасных и мгновенных онлайн-платежей.",
      contentRu: `<div class="max-w-4xl mx-auto space-y-8">
  <div>
    <h2 class="text-3xl font-bold mb-4">🚀 Захватывающие новости: Улучшенный опыт оплаты</h2>
    <p class="text-lg text-gray-700 mb-6">Мы рады объявить о крупном обновлении нашего процесса оформления заказа! Наша новая платёжная система на базе Stripe теперь поддерживает несколько способов оплаты, что делает покупку продуктов GENOSYS ещё проще.</p>
  </div>
  <div>
    <h3 class="text-2xl font-semibold mb-6">💳 Доступные способы оплаты</h3>
    <div class="grid gap-6 md:grid-cols-2">
      <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg">
        <h4 class="text-xl font-semibold mb-3">🍎 Apple Pay</h4>
        <p class="text-gray-700">Пользователи iPhone и Mac теперь могут мгновенно оплачивать через Touch ID, Face ID или Apple Watch. Ваша платёжная информация надёжно сохранена и защищена передовыми функциями безопасности Apple.</p>
      </div>
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
        <h4 class="text-xl font-semibold mb-3">📱 Google Pay</h4>
        <p class="text-gray-700">Пользователи Android могут наслаждаться беспрепятственной оплатой с Google Pay. Быстро, безопасно и удобно - завершите покупку всего несколькими касаниями.</p>
      </div>
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
        <h4 class="text-xl font-semibold mb-3">🔗 Link от Stripe</h4>
        <p class="text-gray-700">Сохраните свою платёжную информацию безопасно с Link и наслаждайтесь молниеносной оплатой во всех ваших любимых магазинах. Оплата одним кликом, максимальная безопасность.</p>
      </div>
      <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
        <h4 class="text-xl font-semibold mb-3">💳 Кредитные и дебетовые карты</h4>
        <p class="text-gray-700">Принимаются все основные кредитные и дебетовые карты, включая Visa, Mastercard, American Express и местные банковские карты ОАЭ. Ваши транзакции защищены банковским уровнем безопасности.</p>
      </div>
    </div>
  </div>
  <div class="text-center bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-lg">
    <h3 class="text-2xl font-bold mb-4">🎉 Готовы испытать будущее платежей?</h3>
    <p class="text-lg mb-6">Посетите наш магазин сейчас и попробуйте новый опыт оплаты. Покупаете ли вы наши последние процедуры Bio-Meso PDRN, решения HR³ Matrix или продукты EyeCell, оплата ещё никогда не была такой простой!</p>
    <a href="/ru/products" class="inline-block bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">Покупайте сейчас с новыми способами оплаты</a>
  </div>
</div>`,

      titleAr: "خيارات دفع جديدة: ادفع بسهولة مع Apple Pay و Google Pay والمزيد",
      excerptAr: "استمتع بتجربة دفع سلسة مع نظام الدفع الجديد المدعوم من Stripe. يدعم الآن Apple Pay و Google Pay و Link وجميع البطاقات الائتمانية الرئيسية للمدفوعات الآمنة والفورية عبر الإنترنت.",
      contentAr: `<div class="max-w-4xl mx-auto space-y-8" dir="rtl">
  <div>
    <h2 class="text-3xl font-bold mb-4">🚀 أخبار مثيرة: تجربة دفع محسّنة</h2>
    <p class="text-lg text-gray-700 mb-6">يسعدنا أن نعلن عن ترقية كبيرة لتجربة الخروج لدينا! نظام الدفع الجديد المدعوم من Stripe يدعم الآن طرق دفع متعددة، مما يجعل إكمال مشترياتك من منتجات GENOSYS أسهل من أي وقت مضى.</p>
  </div>
  <div>
    <h3 class="text-2xl font-semibold mb-6">💳 خيارات الدفع المتاحة</h3>
    <div class="grid gap-6 md:grid-cols-2">
      <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg">
        <h4 class="text-xl font-semibold mb-3">🍎 Apple Pay</h4>
        <p class="text-gray-700">يمكن لمستخدمي iPhone و Mac الآن الدفع فورياً باستخدام Touch ID أو Face ID أو Apple Watch. معلومات الدفع الخاصة بك محفوظة بأمان ومحمية بميزات الأمان المتقدمة من Apple.</p>
      </div>
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
        <h4 class="text-xl font-semibold mb-3">📱 Google Pay</h4>
        <p class="text-gray-700">يمكن لمستخدمي Android الاستمتاع بتجربة دفع سلسة مع Google Pay. سريع وآمن ومريح - أكمل مشترياتك بلمسات قليلة فقط.</p>
      </div>
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
        <h4 class="text-xl font-semibold mb-3">🔗 Link من Stripe</h4>
        <p class="text-gray-700">احفظ معلومات الدفع الخاصة بك بأمان مع Link واستمتع بتجربة دفع سريعة البرق في جميع متاجرك المفضلة. دفع بنقرة واحدة، أمان أقصى.</p>
      </div>
      <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
        <h4 class="text-xl font-semibold mb-3">💳 البطاقات الائتمانية والمدينة</h4>
        <p class="text-gray-700">جميع البطاقات الائتمانية والمدينة الرئيسية مقبولة، بما في ذلك Visa و Mastercard و American Express وبطاقات البنوك المحلية في دولة الإمارات. معاملاتك محمية بأمان مصرفي المستوى.</p>
      </div>
    </div>
  </div>
  <div class="text-center bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-lg">
    <h3 class="text-2xl font-bold mb-4">🎉 مستعد لتجربة مستقبل المدفوعات؟</h3>
    <p class="text-lg mb-6">زر متجرنا الآن وجرب تجربة الدفع الجديدة. سواء كنت تشتري علاجات Bio-Meso PDRN الأحدث لدينا، أو حلول HR³ Matrix، أو منتجات EyeCell، لم يكن الدفع بهذه السهولة من قبل!</p>
    <a href="/ar/products" class="inline-block bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">تسوق الآن مع خيارات الدفع الجديدة</a>
  </div>
</div>`,

      authorName: "GENOSYS Team",
      published: true,
      publishedAt: new Date(),
      tags: JSON.stringify(["payments", "stripe", "apple-pay", "google-pay", "checkout", "ecommerce", "security", "technology"])
    }

    // Check if blog post already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: blogPostData.slug }
    })

    if (existingPost) {
      return NextResponse.json({
        success: true,
        message: 'Blog post already exists',
        post: existingPost
      })
    }

    // Create the blog post
    const post = await prisma.blogPost.create({
      data: blogPostData
    })

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      post: {
        ...post,
        publishedAt: post.publishedAt?.toISOString() || null,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      },
      urls: {
        english: `https://genosys.ae/blog/${post.slug}`,
        russian: `https://genosys.ae/ru/blog/${post.slug}`,
        arabic: `https://genosys.ae/ar/blog/${post.slug}`
      }
    })

  } catch (error) {
    errorLog('Error creating payment blog post:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}