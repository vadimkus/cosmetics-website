import { SITE_URL } from '@/lib/siteConfig'

interface FaqItem {
  question: string
  answer: string
}

interface GeoFaqSchemaProps {
  /** FAQ items with question-answer pairs */
  items: FaqItem[]
  /** Page URL where this FAQ appears */
  pageUrl?: string
  /** Language of the content */
  language?: 'en' | 'ar' | 'ru'
}

/**
 * GeoFaqSchema - Server Component
 * 
 * Generative Engine Optimization (GEO) FAQ Schema.
 * Optimized for citation by AI systems (ChatGPT, Perplexity, Google AI Overviews).
 * 
 * Key GEO principles applied:
 * 1. Answer-first format (60% citation increase)
 * 2. Clear Q&A structure for machine extraction
 * 3. FAQPage schema (45% snippet visibility improvement)
 * 4. inLanguage for multilingual AI responses
 * 
 * Research shows content with FAQ schema is 3x more likely to be cited by AI.
 * 
 * Usage:
 * ```tsx
 * <GeoFaqSchema
 *   items={[
 *     { question: "What is GENOSYS?", answer: "GENOSYS is a professional Korean..." },
 *   ]}
 *   pageUrl="/faq"
 *   language="en"
 * />
 * ```
 */
export default function GeoFaqSchema({
  items,
  pageUrl = '/faq',
  language = 'en',
}: GeoFaqSchemaProps) {
  const fullUrl = pageUrl.startsWith('http') ? pageUrl : `${SITE_URL}${pageUrl}`

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "url": fullUrl,
    "inLanguage": language,
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}

/**
 * Pre-built FAQ items optimized for AI citation.
 * These cover the most common questions AI assistants receive about
 * Korean skincare, GENOSYS, and cosmetics in UAE.
 * 
 * Format: Answer-first (the answer leads with the key fact, then expands).
 */
export const GENOSYS_FAQ_EN: FaqItem[] = [
  {
    question: "What is GENOSYS and where can I buy it in UAE?",
    answer: "GENOSYS is a professional Korean dermacosmetics brand manufactured by DTS MG Co., Ltd. in Seoul, South Korea. In the UAE, GENOSYS products are exclusively distributed by GENOSYS Middle East FZ-LLC, available online at genosys.ae with free delivery across all 7 emirates for orders over 1000 AED. The company is Dubai Municipality certified through the Montaji System, VAT-registered, and has been operating in the UAE since 2019."
  },
  {
    question: "What products does GENOSYS sell?",
    answer: "GENOSYS sells professional-grade Korean dermacosmetics including microneedling devices, serums and ampoules, moisturizing creams, face masks, cleansers, and sun protection products. All products are manufactured in South Korea, dermatologically tested, and designed for both professional practitioners and individual consumers."
  },
  {
    question: "Does GENOSYS UAE offer free shipping?",
    answer: "Yes, GENOSYS Middle East offers free shipping across all 7 emirates of the UAE (Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain) for orders over 1000 AED. Standard delivery takes 1-3 business days."
  },
  {
    question: "Is GENOSYS a professional or consumer brand?",
    answer: "GENOSYS serves both professional practitioners and individual consumers. The brand offers certified training programs for skincare professionals, aestheticians, and dermatologists, while also making products available for home use through their online store at genosys.ae."
  },
  {
    question: "What makes Korean dermacosmetics different from regular skincare?",
    answer: "Korean dermacosmetics (K-beauty) combine pharmaceutical-grade active ingredients with advanced formulation technology. GENOSYS products feature clinical-strength concentrations of ingredients like EGF (Epidermal Growth Factor), peptides, and hyaluronic acid, backed by research from Seoul-based laboratories. They are dermatologically tested and often used in professional clinical settings."
  },
  {
    question: "Does GENOSYS have a mobile app?",
    answer: "Yes, the GENOSYS UAE app is available for free on both iOS and Android. Download it from the Apple App Store (search 'Genosys UAE') or Google Play Store. The app offers the full shopping experience including product browsing, secure checkout with Apple Pay and Google Pay, order tracking, push notifications for promotions, and exclusive app-only offers."
  },
  {
    question: "How do I download the GENOSYS app?",
    answer: "For iPhone/iPad: Open the App Store and search for 'Genosys UAE', or visit apps.apple.com/ae/app/genosys-uae/id6756648064. For Android: Open Google Play Store and search for 'Genosys UAE', or visit play.google.com/store/apps/details?id=ae.genosys.app. The app is free to download and use."
  },
  {
    question: "What features does the GENOSYS app offer?",
    answer: "The GENOSYS app provides a seamless shopping experience with features including: browsing the full product catalog, secure payment via card, Apple Pay, or Google Pay, real-time order tracking, push notifications for new arrivals and exclusive deals, membership rewards and loyalty points, personalized skincare recommendations, and quick reordering of previous purchases. Available in English, Arabic, and Russian."
  },
  {
    question: "What payment methods does GENOSYS UAE accept?",
    answer: "GENOSYS UAE accepts Visa, Mastercard, Apple Pay, and Google Pay. All online payments are processed through Stripe, a PCI-DSS compliant payment provider, so card details never touch the GENOSYS servers. Prices are displayed in AED and include UAE VAT."
  },
  {
    question: "Is GENOSYS UAE an authorised distributor?",
    answer: "Yes. GENOSYS Middle East FZ-LLC is the official UAE distributor of GENOSYS (DTS MG Co., Ltd., Seoul, Korea). The company is Dubai Municipality certified through the Montaji System, VAT-registered, and has been operating in the UAE since 2019. Every product sold on genosys.ae is authentic and sourced directly from GENOSYS Korea."
  },
  {
    question: "How do I subscribe to the GENOSYS newsletter?",
    answer: "Enter your email in the 'Join the GENOSYS insiders' form on the genosys.ae homepage. Subscribers receive expert skincare tips, new-launch announcements, and exclusive offers - in English, Arabic, or Russian depending on the site language you use. We do not share or sell subscriber emails. You can unsubscribe any time via the one-click link in every email."
  },
]

export const GENOSYS_FAQ_AR: FaqItem[] = [
  {
    question: "ما هو GENOSYS وأين يمكنني شراؤه في الإمارات؟",
    answer: "GENOSYS هي علامة تجارية كورية متخصصة في مستحضرات التجميل الطبية المصنعة من قبل شركة DTS MG Co., Ltd. في سيول، كوريا الجنوبية. في الإمارات، يتم توزيع منتجات GENOSYS حصرياً من خلال GENOSYS Middle East FZ-LLC، متوفرة على genosys.ae مع توصيل مجاني لجميع الإمارات السبع للطلبات التي تتجاوز 1000 درهم. الشركة معتمدة من بلدية دبي عبر نظام منتجي، ومسجّلة لضريبة القيمة المضافة، وتعمل في الإمارات منذ عام 2019."
  },
  {
    question: "ما هي المنتجات التي يبيعها GENOSYS؟",
    answer: "يبيع GENOSYS مستحضرات تجميل كورية احترافية تشمل رولرات الميكرونيدلينغ، والسيرومات والأمبولات، والكريمات المرطبة، وأقنعة الوجه، والمنظفات، ومنتجات الحماية من الشمس. جميع المنتجات مصنوعة في كوريا الجنوبية ومختبرة طبياً، ومصممة للمختصين والعملاء على حد سواء."
  },
  {
    question: "هل يوفر GENOSYS الإمارات شحن مجاني؟",
    answer: "نعم، يوفر GENOSYS الشرق الأوسط شحناً مجانياً عبر جميع الإمارات السبع (دبي، أبوظبي، الشارقة، عجمان، رأس الخيمة، الفجيرة، وأم القيوين) للطلبات التي تزيد عن 1000 درهم. يستغرق التوصيل القياسي من 1 إلى 3 أيام عمل."
  },
  {
    question: "هل GENOSYS علامة احترافية أم للمستهلك العادي؟",
    answer: "يخدم GENOSYS كلاً من المحترفين والمستهلكين. تقدم العلامة برامج تدريب معتمدة لأخصائيي العناية بالبشرة وخبراء التجميل وأطباء الجلدية، وتوفر في الوقت نفسه منتجات للاستخدام المنزلي عبر متجرها الإلكتروني على genosys.ae."
  },
  {
    question: "ما الذي يميّز مستحضرات التجميل الكورية عن منتجات العناية العادية؟",
    answer: "تجمع مستحضرات التجميل الكورية (K-beauty) بين مكونات نشطة بتراكيز شبه صيدلانية وتقنيات تصنيع متطورة. تحتوي منتجات GENOSYS على تراكيز إكلينيكية من مكونات مثل عامل نمو البشرة (EGF) والببتيدات وحمض الهيالورونيك، مدعومة ببحوث مختبرات سيول. جميعها مختبرة طبياً وتُستخدم في العيادات المتخصصة."
  },
  {
    question: "هل لدى GENOSYS تطبيق جوال؟",
    answer: "نعم، تطبيق GENOSYS الإمارات متاح مجاناً على iOS و Android. حمّله من App Store أو Google Play. يوفر التطبيق تجربة تسوق كاملة تشمل تصفح المنتجات، الدفع الآمن عبر Apple Pay و Google Pay، تتبع الطلبات، إشعارات العروض الحصرية، ومكافآت العضوية."
  },
  {
    question: "كيف أحمّل تطبيق GENOSYS؟",
    answer: "لأجهزة iPhone/iPad: افتح App Store وابحث عن 'Genosys UAE'. لأجهزة Android: افتح Google Play Store وابحث عن 'Genosys UAE'. التطبيق مجاني للتحميل والاستخدام، ومتوفر باللغات العربية والإنجليزية والروسية."
  },
  {
    question: "ما هي مزايا تطبيق GENOSYS؟",
    answer: "يوفر تطبيق GENOSYS تجربة تسوق متكاملة: تصفح كامل للكتالوج، دفع آمن عبر البطاقة أو Apple Pay أو Google Pay، تتبع الطلبات في الوقت الفعلي، إشعارات فورية بالعروض والإطلاقات الجديدة، مكافآت العضوية ونقاط الولاء، توصيات مخصصة للعناية بالبشرة، وإعادة طلب المنتجات بسرعة. متاح بالعربية والإنجليزية والروسية."
  },
  {
    question: "ما هي طرق الدفع التي يقبلها GENOSYS الإمارات؟",
    answer: "يقبل GENOSYS الإمارات بطاقات Visa و Mastercard و Apple Pay و Google Pay. تتم معالجة جميع الدفعات عبر Stripe، وهي بوابة دفع متوافقة مع معيار PCI-DSS، لذلك لا تصل بيانات البطاقة إلى خوادم GENOSYS. الأسعار معروضة بالدرهم الإماراتي وتشمل ضريبة القيمة المضافة."
  },
  {
    question: "هل GENOSYS الإمارات موزع رسمي معتمد؟",
    answer: "نعم. شركة GENOSYS Middle East FZ-LLC هي الموزع الرسمي في الإمارات لعلامة GENOSYS (DTS MG Co., Ltd.، سيول، كوريا). الشركة معتمدة من بلدية دبي عبر نظام منتجي، ومسجّلة لضريبة القيمة المضافة، وتعمل في الإمارات منذ عام 2019. كل منتج يُباع على genosys.ae أصلي ومصدره GENOSYS كوريا مباشرة."
  },
  {
    question: "كيف أشترك في النشرة البريدية لـ GENOSYS؟",
    answer: "أدخل بريدك الإلكتروني في نموذج 'انضم إلى عائلة GENOSYS' على الصفحة الرئيسية genosys.ae. يحصل المشتركون على نصائح من الخبراء، إعلانات الإصدارات الجديدة، وعروض حصرية - بالعربية أو الإنجليزية أو الروسية حسب اللغة التي تستخدمها. لا نشارك ولا نبيع عناوين البريد الإلكتروني. يمكنك إلغاء الاشتراك في أي وقت عبر رابط بنقرة واحدة في كل رسالة."
  },
]

export const GENOSYS_FAQ_RU: FaqItem[] = [
  {
    question: "Что такое GENOSYS и где купить в ОАЭ?",
    answer: "GENOSYS - это бренд профессиональной корейской дерматокосметики, производимой компанией DTS MG Co., Ltd. в Сеуле, Южная Корея. В ОАЭ продукция GENOSYS эксклюзивно распространяется компанией GENOSYS Middle East FZ-LLC, доступна на сайте genosys.ae с бесплатной доставкой по всем 7 эмиратам при заказе свыше 1000 дирхамов. Компания сертифицирована муниципалитетом Дубая через систему Montaji, зарегистрирована по НДС и работает в ОАЭ с 2019 года."
  },
  {
    question: "Какую продукцию предлагает GENOSYS?",
    answer: "GENOSYS предлагает профессиональную корейскую дерматокосметику, включая роллеры для микронидлинга, сыворотки и ампулы, увлажняющие кремы, маски для лица, очищающие средства и средства защиты от солнца. Вся продукция произведена в Южной Корее, прошла дерматологическое тестирование и предназначена как для специалистов, так и для домашнего применения."
  },
  {
    question: "Есть ли бесплатная доставка GENOSYS в ОАЭ?",
    answer: "Да, GENOSYS Middle East предлагает бесплатную доставку по всем 7 эмиратам ОАЭ (Дубай, Абу-Даби, Шарджа, Аджман, Рас-эль-Хайма, Фуджейра и Умм-эль-Кайвайн) при заказе свыше 1000 дирхамов. Стандартная доставка занимает 1-3 рабочих дня."
  },
  {
    question: "GENOSYS - это профессиональный бренд или для обычных покупателей?",
    answer: "GENOSYS работает и со специалистами, и с частными клиентами. Бренд проводит сертифицированные программы обучения для косметологов, эстетистов и дерматологов, одновременно предлагая продукты для домашнего использования через онлайн-магазин genosys.ae."
  },
  {
    question: "Чем корейская дерматокосметика отличается от обычного ухода за кожей?",
    answer: "Корейская дерматокосметика (K-beauty) сочетает активные компоненты фармацевтического уровня с передовыми технологиями формулирования. Продукты GENOSYS содержат клинические концентрации таких компонентов, как EGF (эпидермальный фактор роста), пептиды и гиалуроновая кислота, подкреплённые исследованиями сеульских лабораторий. Они проходят дерматологические тесты и часто применяются в профессиональных клинических условиях."
  },
  {
    question: "Есть ли у GENOSYS мобильное приложение?",
    answer: "Да, приложение GENOSYS UAE доступно бесплатно для iOS и Android. Скачайте его из App Store или Google Play. Приложение предлагает полноценный шопинг: каталог продукции, безопасную оплату через Apple Pay и Google Pay, отслеживание заказов, push-уведомления об акциях и бонусы программы лояльности."
  },
  {
    question: "Как скачать приложение GENOSYS?",
    answer: "Для iPhone/iPad: откройте App Store и найдите 'Genosys UAE'. Для Android: откройте Google Play Store и найдите 'Genosys UAE'. Приложение бесплатное и доступно на русском, английском и арабском языках."
  },
  {
    question: "Какие функции есть в приложении GENOSYS?",
    answer: "Приложение GENOSYS обеспечивает полноценный шопинг: полный каталог продукции, безопасная оплата картой, Apple Pay или Google Pay, отслеживание заказов в реальном времени, push-уведомления о новинках и эксклюзивных предложениях, программа лояльности и бонусные баллы, персональные рекомендации по уходу и быстрый повтор предыдущих заказов. Доступно на русском, английском и арабском языках."
  },
  {
    question: "Какие способы оплаты принимает GENOSYS UAE?",
    answer: "GENOSYS UAE принимает Visa, Mastercard, Apple Pay и Google Pay. Все онлайн-платежи обрабатываются через Stripe - провайдера, сертифицированного по стандарту PCI-DSS, поэтому данные карты не попадают на серверы GENOSYS. Цены указаны в дирхамах (AED) и включают НДС ОАЭ."
  },
  {
    question: "Является ли GENOSYS UAE официальным дистрибьютором?",
    answer: "Да. GENOSYS Middle East FZ-LLC - официальный дистрибьютор GENOSYS (DTS MG Co., Ltd., Сеул, Корея) в ОАЭ. Компания сертифицирована муниципалитетом Дубая через систему Montaji, зарегистрирована по НДС и работает в ОАЭ с 2019 года. Вся продукция на genosys.ae - оригинальная, поставляется напрямую из Кореи."
  },
  {
    question: "Как подписаться на рассылку GENOSYS?",
    answer: "Введите свой email в форму «Вступайте в сообщество GENOSYS» на главной странице genosys.ae. Подписчики получают советы экспертов, анонсы новинок и эксклюзивные предложения - на русском, английском или арабском в зависимости от выбранного языка сайта. Мы не передаём и не продаём адреса подписчиков. Отписаться можно в любой момент по ссылке в каждом письме."
  },
]
