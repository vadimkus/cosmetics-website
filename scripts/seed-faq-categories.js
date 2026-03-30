/**
 * Seed FAQ Categories + App FAQ Items
 * 
 * Run AFTER the Prisma migration that adds the `category` column to faq_items:
 *   npx prisma migrate dev --name add-faq-category
 *   node scripts/seed-faq-categories.js
 * 
 * This script:
 * 1. Assigns categories to existing FAQ items based on question content
 * 2. Adds new Mobile App FAQ items (EN/AR/RU)
 */

const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!databaseUrl) {
  console.error('Error: DATABASE_URL or POSTGRES_URL environment variable is required')
  process.exit(1)
}

const pool = new Pool({ connectionString: databaseUrl, max: 2 })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const CATEGORY_MAP = {
  'What is GENOSYS': 'general',
  'Why choose GENOSYS': 'general',
  'Do you have a blog': 'general',
  'Are GENOSYS products suitable for home use': 'products',
  'Are GENOSYS products certified': 'products',
  'Are your products suitable for sensitive': 'products',
  'What payment methods': 'orders',
  'Can I return or exchange': 'orders',
  'What is your return policy': 'orders',
  'Do you offer bulk discounts': 'orders',
  'How do I track my order': 'orders',
  'Do you ship to all UAE': 'shipping',
  'How long does shipping': 'shipping',
  'Do you ship internationally': 'shipping',
  'How do I become a registered': 'account',
  'Can I delete my account': 'account',
  'How can I contact customer': 'account',
  'Do you offer professional training': 'account',
}

const APP_FAQS = [
  {
    sortOrder: 190,
    isActive: true,
    category: 'app',
    questionEn: 'Does GENOSYS have a mobile app?',
    answerEn: 'Yes! The GENOSYS UAE app is available for free on both iOS and Android. It offers the full shopping experience — browse our complete product catalog, pay securely with Apple Pay, Google Pay, or card, track your orders in real time, receive push notifications about promotions and new arrivals, and earn membership loyalty points. Download it from the <a href="https://apps.apple.com/ae/app/genosys-uae/id6756648064" target="_blank" rel="noopener noreferrer">App Store</a> or <a href="https://play.google.com/store/apps/details?id=ae.genosys.app" target="_blank" rel="noopener noreferrer">Google Play</a>.',
    questionAr: 'هل لدى GENOSYS تطبيق جوال؟',
    answerAr: 'نعم! تطبيق GENOSYS الإمارات متاح مجاناً على iOS و Android. يوفر تجربة تسوق كاملة — تصفح كتالوج المنتجات، الدفع الآمن عبر Apple Pay و Google Pay أو البطاقة، تتبع الطلبات بالوقت الفعلي، إشعارات العروض والمنتجات الجديدة، ونقاط مكافآت العضوية. حمّله من <a href="https://apps.apple.com/ae/app/genosys-uae/id6756648064" target="_blank" rel="noopener noreferrer">App Store</a> أو <a href="https://play.google.com/store/apps/details?id=ae.genosys.app" target="_blank" rel="noopener noreferrer">Google Play</a>.',
    questionRu: 'Есть ли у GENOSYS мобильное приложение?',
    answerRu: 'Да! Приложение GENOSYS UAE доступно бесплатно для iOS и Android. Оно предлагает полноценный шопинг — каталог продукции, безопасную оплату через Apple Pay, Google Pay или картой, отслеживание заказов в реальном времени, push-уведомления об акциях и новинках, а также бонусы программы лояльности. Скачайте из <a href="https://apps.apple.com/ae/app/genosys-uae/id6756648064" target="_blank" rel="noopener noreferrer">App Store</a> или <a href="https://play.google.com/store/apps/details?id=ae.genosys.app" target="_blank" rel="noopener noreferrer">Google Play</a>.',
  },
  {
    sortOrder: 191,
    isActive: true,
    category: 'app',
    questionEn: 'How do I download the GENOSYS app?',
    answerEn: '<strong>For iPhone & iPad:</strong> Open the App Store, search for "Genosys UAE", and tap Download. Or visit <a href="https://apps.apple.com/ae/app/genosys-uae/id6756648064" target="_blank" rel="noopener noreferrer">this direct link</a>.<br/><br/><strong>For Android:</strong> Open the Google Play Store, search for "Genosys UAE", and tap Install. Or visit <a href="https://play.google.com/store/apps/details?id=ae.genosys.app" target="_blank" rel="noopener noreferrer">this direct link</a>.<br/><br/>The app is completely free and available in English, Arabic, and Russian.',
    questionAr: 'كيف أحمّل تطبيق GENOSYS؟',
    answerAr: '<strong>لأجهزة iPhone و iPad:</strong> افتح App Store، ابحث عن "Genosys UAE"، واضغط تحميل. أو زر <a href="https://apps.apple.com/ae/app/genosys-uae/id6756648064" target="_blank" rel="noopener noreferrer">الرابط المباشر</a>.<br/><br/><strong>لأجهزة Android:</strong> افتح Google Play Store، ابحث عن "Genosys UAE"، واضغط تثبيت. أو زر <a href="https://play.google.com/store/apps/details?id=ae.genosys.app" target="_blank" rel="noopener noreferrer">الرابط المباشر</a>.<br/><br/>التطبيق مجاني بالكامل ومتوفر بالعربية والإنجليزية والروسية.',
    questionRu: 'Как скачать приложение GENOSYS?',
    answerRu: '<strong>Для iPhone и iPad:</strong> Откройте App Store, найдите "Genosys UAE" и нажмите Загрузить. Или перейдите по <a href="https://apps.apple.com/ae/app/genosys-uae/id6756648064" target="_blank" rel="noopener noreferrer">прямой ссылке</a>.<br/><br/><strong>Для Android:</strong> Откройте Google Play Store, найдите "Genosys UAE" и нажмите Установить. Или перейдите по <a href="https://play.google.com/store/apps/details?id=ae.genosys.app" target="_blank" rel="noopener noreferrer">прямой ссылке</a>.<br/><br/>Приложение полностью бесплатное и доступно на русском, английском и арабском языках.',
  },
  {
    sortOrder: 192,
    isActive: true,
    category: 'app',
    questionEn: 'What features does the GENOSYS app offer?',
    answerEn: 'The GENOSYS app provides a premium shopping experience with:<br/>• <strong>Full product catalog</strong> with detailed descriptions and reviews<br/>• <strong>Secure checkout</strong> via credit/debit card, Apple Pay, or Google Pay<br/>• <strong>Real-time order tracking</strong> from confirmation to delivery<br/>• <strong>Push notifications</strong> for exclusive deals, new arrivals, and flash sales<br/>• <strong>Membership & loyalty rewards</strong> — earn points on every purchase<br/>• <strong>Personalized skincare recommendations</strong> based on your skin type<br/>• <strong>Quick reorder</strong> of your previous purchases<br/>• <strong>Multilingual support</strong> — English, Arabic, and Russian<br/>• <strong>Apple Sign-In</strong> for quick, secure registration',
    questionAr: 'ما هي ميزات تطبيق GENOSYS؟',
    answerAr: 'يوفر تطبيق GENOSYS تجربة تسوق متميزة تشمل:<br/>• <strong>كتالوج المنتجات الكامل</strong> مع وصف تفصيلي ومراجعات<br/>• <strong>دفع آمن</strong> عبر البطاقة أو Apple Pay أو Google Pay<br/>• <strong>تتبع الطلبات بالوقت الفعلي</strong> من التأكيد حتى التوصيل<br/>• <strong>إشعارات فورية</strong> للعروض الحصرية والمنتجات الجديدة<br/>• <strong>مكافآت العضوية والولاء</strong> — اكسب نقاط على كل عملية شراء<br/>• <strong>توصيات مخصصة للعناية بالبشرة</strong> بناءً على نوع بشرتك<br/>• <strong>إعادة الطلب السريع</strong> لمشترياتك السابقة<br/>• <strong>دعم متعدد اللغات</strong> — العربية والإنجليزية والروسية',
    questionRu: 'Какие возможности предлагает приложение GENOSYS?',
    answerRu: 'Приложение GENOSYS предлагает премиальный шопинг:<br/>• <strong>Полный каталог продукции</strong> с подробными описаниями и отзывами<br/>• <strong>Безопасная оплата</strong> картой, Apple Pay или Google Pay<br/>• <strong>Отслеживание заказов в реальном времени</strong> от подтверждения до доставки<br/>• <strong>Push-уведомления</strong> об эксклюзивных акциях и новинках<br/>• <strong>Программа лояльности</strong> — бонусные баллы за каждую покупку<br/>• <strong>Персональные рекомендации</strong> по уходу за кожей<br/>• <strong>Быстрый повторный заказ</strong> предыдущих покупок<br/>• <strong>Мультиязычная поддержка</strong> — русский, английский и арабский',
  },
  {
    sortOrder: 193,
    isActive: true,
    category: 'app',
    questionEn: 'Is the GENOSYS app free?',
    answerEn: 'Yes, the GENOSYS UAE app is completely free to download and use. There are no subscription fees or hidden charges. Simply download it from the App Store (iPhone/iPad) or Google Play Store (Android), create an account or sign in, and start shopping.',
    questionAr: 'هل تطبيق GENOSYS مجاني؟',
    answerAr: 'نعم، تطبيق GENOSYS الإمارات مجاني بالكامل للتحميل والاستخدام. لا توجد رسوم اشتراك أو تكاليف مخفية. فقط حمّل التطبيق من App Store (iPhone/iPad) أو Google Play Store (Android)، أنشئ حساباً أو سجّل دخولك، وابدأ التسوق.',
    questionRu: 'Приложение GENOSYS бесплатное?',
    answerRu: 'Да, приложение GENOSYS UAE полностью бесплатное. Нет подписок и скрытых платежей. Просто скачайте из App Store (iPhone/iPad) или Google Play Store (Android), создайте аккаунт или войдите, и начните покупки.',
  },
]

async function main() {
  console.log('Starting FAQ category seeding...\n')

  // 1. Assign categories to existing FAQ items
  const existingItems = await prisma.faqItem.findMany({ orderBy: { sortOrder: 'asc' } })
  console.log(`Found ${existingItems.length} existing FAQ items`)

  let categorized = 0
  for (const item of existingItems) {
    let category = null
    for (const [keyword, cat] of Object.entries(CATEGORY_MAP)) {
      if (item.questionEn.includes(keyword)) {
        category = cat
        break
      }
    }
    if (category && item.category !== category) {
      await prisma.faqItem.update({
        where: { id: item.id },
        data: { category },
      })
      console.log(`  ✓ "${item.questionEn.substring(0, 50)}..." → ${category}`)
      categorized++
    }
  }
  console.log(`Categorized ${categorized} existing items\n`)

  // 2. Add new App FAQ items (skip if they already exist)
  let created = 0
  for (const faq of APP_FAQS) {
    const existing = await prisma.faqItem.findFirst({
      where: { questionEn: faq.questionEn },
    })
    if (existing) {
      console.log(`  ⏭ Already exists: "${faq.questionEn.substring(0, 50)}..."`)
      if (!existing.category) {
        await prisma.faqItem.update({
          where: { id: existing.id },
          data: { category: 'app' },
        })
        console.log(`    → Updated category to "app"`)
      }
      continue
    }
    await prisma.faqItem.create({ data: faq })
    console.log(`  ✓ Created: "${faq.questionEn.substring(0, 50)}..."`)
    created++
  }
  console.log(`\nCreated ${created} new App FAQ items`)

  // Summary
  const total = await prisma.faqItem.count()
  const active = await prisma.faqItem.count({ where: { isActive: true } })
  const withCategory = await prisma.faqItem.count({ where: { category: { not: null } } })
  console.log(`\nFinal state: ${total} total, ${active} active, ${withCategory} categorized`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
