/**
 * Simple Node.js script to create a payment blog post
 * Run with: node create-payment-blog-post.js
 */

const fs = require('fs')

// Blog post content
const blogPost = {
  title: "New Payment Options: Pay Effortlessly with Apple Pay, Google Pay & More",
  slug: "new-stripe-payment-options-apple-pay-google-pay-2025", 
  excerpt: "Experience seamless checkout with our new Stripe-powered payment system. Now supporting Apple Pay, Google Pay, Link, and all major credit cards for secure and instant online payments.",
  
  // English content (simplified HTML)
  content: `
<div class="space-y-8">
  <div>
    <h2 class="text-3xl font-bold mb-4">🚀 Exciting News: Enhanced Payment Experience</h2>
    <p class="text-lg text-gray-700">We're thrilled to announce a major upgrade to our checkout experience! Our new Stripe-powered payment system now supports multiple payment methods, making it easier than ever to complete your GENOSYS skincare purchases.</p>
  </div>

  <div>
    <h3 class="text-2xl font-semibold mb-4">💳 Available Payment Options</h3>
    <div class="grid gap-4 md:grid-cols-2">
      <div class="p-4 bg-gray-50 rounded-lg">
        <h4 class="font-semibold">🍎 Apple Pay</h4>
        <p>iPhone and Mac users can now pay instantly using Touch ID, Face ID, or Apple Watch.</p>
      </div>
      <div class="p-4 bg-blue-50 rounded-lg">
        <h4 class="font-semibold">📱 Google Pay</h4>
        <p>Android users can enjoy seamless checkout with Google Pay.</p>
      </div>
      <div class="p-4 bg-purple-50 rounded-lg">
        <h4 class="font-semibold">🔗 Link by Stripe</h4>
        <p>Save your payment information securely and enjoy one-click payments.</p>
      </div>
      <div class="p-4 bg-green-50 rounded-lg">
        <h4 class="font-semibold">💳 Credit & Debit Cards</h4>
        <p>All major cards accepted including Visa, Mastercard, American Express.</p>
      </div>
    </div>
  </div>

  <div>
    <h3 class="text-2xl font-semibold mb-4">✨ Benefits</h3>
    <ul class="space-y-2">
      <li>🔒 Enhanced security through Stripe's infrastructure</li>
      <li>⚡ Faster checkout with saved payment methods</li>
      <li>🌍 Global support for UAE, GCC, and international customers</li>
      <li>📱 Perfect mobile experience</li>
      <li>🛡️ Advanced fraud protection</li>
    </ul>
  </div>

  <div class="text-center p-6 bg-red-600 text-white rounded-lg">
    <h3 class="text-xl font-bold mb-2">Ready to try the new payment experience?</h3>
    <p class="mb-4">Shop now with our enhanced checkout system!</p>
    <a href="/products" class="inline-block bg-white text-red-600 px-6 py-2 rounded font-semibold">Shop Now</a>
  </div>
</div>`,

  // Russian content 
  contentRu: `
<div class="space-y-8">
  <div>
    <h2 class="text-3xl font-bold mb-4">🚀 Захватывающие новости: Улучшенный опыт оплаты</h2>
    <p class="text-lg text-gray-700">Мы рады объявить о крупном обновлении нашего процесса оформления заказа! Наша новая платёжная система на базе Stripe теперь поддерживает несколько способов оплаты.</p>
  </div>

  <div>
    <h3 class="text-2xl font-semibold mb-4">💳 Доступные способы оплаты</h3>
    <div class="grid gap-4 md:grid-cols-2">
      <div class="p-4 bg-gray-50 rounded-lg">
        <h4 class="font-semibold">🍎 Apple Pay</h4>
        <p>Пользователи iPhone и Mac теперь могут мгновенно оплачивать через Touch ID, Face ID или Apple Watch.</p>
      </div>
      <div class="p-4 bg-blue-50 rounded-lg">
        <h4 class="font-semibold">📱 Google Pay</h4>
        <p>Пользователи Android могут наслаждаться беспрепятственной оплатой с Google Pay.</p>
      </div>
      <div class="p-4 bg-purple-50 rounded-lg">
        <h4 class="font-semibold">🔗 Link от Stripe</h4>
        <p>Сохраните свою платёжную информацию безопасно и наслаждайтесь оплатой одним кликом.</p>
      </div>
      <div class="p-4 bg-green-50 rounded-lg">
        <h4 class="font-semibold">💳 Кредитные и дебетовые карты</h4>
        <p>Принимаются все основные карты включая Visa, Mastercard, American Express.</p>
      </div>
    </div>
  </div>

  <div>
    <h3 class="text-2xl font-semibold mb-4">✨ Преимущества</h3>
    <ul class="space-y-2">
      <li>🔒 Повышенная безопасность через инфраструктуру Stripe</li>
      <li>⚡ Более быстрая оплата с сохранёнными способами оплаты</li>
      <li>🌍 Глобальная поддержка для клиентов ОАЭ, ССАГПЗ и международных покупателей</li>
      <li>📱 Идеальный мобильный опыт</li>
      <li>🛡️ Продвинутая защита от мошенничества</li>
    </ul>
  </div>

  <div class="text-center p-6 bg-red-600 text-white rounded-lg">
    <h3 class="text-xl font-bold mb-2">Готовы попробовать новый опыт оплаты?</h3>
    <p class="mb-4">Покупайте сейчас с нашей улучшенной системой оплаты!</p>
    <a href="/ru/products" class="inline-block bg-white text-red-600 px-6 py-2 rounded font-semibold">Покупать сейчас</a>
  </div>
</div>`,

  // Arabic content
  contentAr: `
<div class="space-y-8" dir="rtl">
  <div>
    <h2 class="text-3xl font-bold mb-4">🚀 أخبار مثيرة: تجربة دفع محسّنة</h2>
    <p class="text-lg text-gray-700">يسعدنا أن نعلن عن ترقية كبيرة لتجربة الخروج لدينا! نظام الدفع الجديد المدعوم من Stripe يدعم الآن طرق دفع متعددة.</p>
  </div>

  <div>
    <h3 class="text-2xl font-semibold mb-4">💳 خيارات الدفع المتاحة</h3>
    <div class="grid gap-4 md:grid-cols-2">
      <div class="p-4 bg-gray-50 rounded-lg">
        <h4 class="font-semibold">🍎 Apple Pay</h4>
        <p>يمكن لمستخدمي iPhone و Mac الآن الدفع فورياً باستخدام Touch ID أو Face ID أو Apple Watch.</p>
      </div>
      <div class="p-4 bg-blue-50 rounded-lg">
        <h4 class="font-semibold">📱 Google Pay</h4>
        <p>يمكن لمستخدمي Android الاستمتاع بتجربة دفع سلسة مع Google Pay.</p>
      </div>
      <div class="p-4 bg-purple-50 rounded-lg">
        <h4 class="font-semibold">🔗 Link من Stripe</h4>
        <p>احفظ معلومات الدفع الخاصة بك بأمان واستمتع بالدفع بنقرة واحدة.</p>
      </div>
      <div class="p-4 bg-green-50 rounded-lg">
        <h4 class="font-semibold">💳 البطاقات الائتمانية والمدينة</h4>
        <p>جميع البطاقات الرئيسية مقبولة بما في ذلك Visa و Mastercard و American Express.</p>
      </div>
    </div>
  </div>

  <div>
    <h3 class="text-2xl font-semibold mb-4">✨ الفوائد</h3>
    <ul class="space-y-2">
      <li>🔒 أمان معزز من خلال بنية Stripe التحتية</li>
      <li>⚡ دفع أسرع مع طرق الدفع المحفوظة</li>
      <li>🌍 دعم عالمي للعملاء في دولة الإمارات ودول مجلس التعاون الخليجي والعملاء الدوليين</li>
      <li>📱 تجربة مثالية للهواتف المحمولة</li>
      <li>🛡️ حماية متقدمة من الاحتيال</li>
    </ul>
  </div>

  <div class="text-center p-6 bg-red-600 text-white rounded-lg">
    <h3 class="text-xl font-bold mb-2">مستعد لتجربة تجربة الدفع الجديدة؟</h3>
    <p class="mb-4">تسوق الآن مع نظام الدفع المحسن لدينا!</p>
    <a href="/ar/products" class="inline-block bg-white text-red-600 px-6 py-2 rounded font-semibold">تسوق الآن</a>
  </div>
</div>`,

  titleRu: "Новые способы оплаты: Легко платите с Apple Pay, Google Pay и другими",
  excerptRu: "Испытайте бесшовную оплату с нашей новой платёжной системой Stripe. Теперь поддерживаются Apple Pay, Google Pay, Link и все основные кредитные карты.",
  
  titleAr: "خيارات دفع جديدة: ادفع بسهولة مع Apple Pay و Google Pay والمزيد", 
  excerptAr: "استمتع بتجربة دفع سلسة مع نظام الدفع الجديد المدعوم من Stripe. يدعم الآن Apple Pay و Google Pay و Link وجميع البطاقات الائتمانية الرئيسية.",

  authorName: "GENOSYS Team",
  published: true,
  tags: ["payments", "stripe", "apple-pay", "google-pay", "checkout", "ecommerce", "security"]
}

// Create a SQL file that can be run to insert the blog post
const sqlContent = `
-- Insert new blog post about payment options
INSERT INTO blog_posts (
  id, title, slug, excerpt, content, "authorName", published, "publishedAt", 
  "createdAt", "updatedAt", tags, "titleAr", "excerptAr", "contentAr", 
  "titleRu", "excerptRu", "contentRu"
) VALUES (
  gen_random_uuid(),
  '${blogPost.title.replace(/'/g, "''")}',
  '${blogPost.slug}',
  '${blogPost.excerpt.replace(/'/g, "''")}',
  '${blogPost.content.replace(/'/g, "''")}',
  '${blogPost.authorName}',
  ${blogPost.published},
  NOW(),
  NOW(),
  NOW(),
  '["payments", "stripe", "apple-pay", "google-pay", "checkout", "ecommerce", "security"]',
  '${blogPost.titleAr.replace(/'/g, "''")}',
  '${blogPost.excerptAr.replace(/'/g, "''")}', 
  '${blogPost.contentAr.replace(/'/g, "''")}',
  '${blogPost.titleRu.replace(/'/g, "''")}',
  '${blogPost.excerptRu.replace(/'/g, "''")}',
  '${blogPost.contentRu.replace(/'/g, "''")}'
);
`

// Write SQL file
fs.writeFileSync('payment-blog-post.sql', sqlContent)

// Also create a JSON file with the blog post data
fs.writeFileSync('payment-blog-post.json', JSON.stringify(blogPost, null, 2))

console.log('✅ Blog post files created:')
console.log('📄 payment-blog-post.sql - SQL script to insert the blog post')
console.log('📄 payment-blog-post.json - Blog post data in JSON format')
console.log('')
console.log('🚀 To add the blog post:')
console.log('1. Run the SQL script in your database, or')
console.log('2. Use the JSON data to create the post via admin interface')
console.log('')
console.log('📱 After creation, the blog will be available at:')
console.log(`🇬🇧 English: https://genosys.ae/blog/${blogPost.slug}`)
console.log(`🇷🇺 Russian: https://genosys.ae/ru/blog/${blogPost.slug}`)
console.log(`🇸🇦 Arabic: https://genosys.ae/ar/blog/${blogPost.slug}`)