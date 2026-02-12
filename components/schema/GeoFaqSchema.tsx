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
    answer: "GENOSYS is a professional Korean dermacosmetics brand manufactured by DTS MG Co., Ltd. in Seoul, South Korea. In the UAE, GENOSYS products are exclusively distributed by GENOSYS Middle East FZ-LLC, available online at genosys.ae with free delivery across all 7 emirates for orders over 1000 AED. The company is Dubai Municipality certified."
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
]

export const GENOSYS_FAQ_AR: FaqItem[] = [
  {
    question: "ما هو GENOSYS وأين يمكنني شراؤه في الإمارات؟",
    answer: "GENOSYS هي علامة تجارية كورية متخصصة في مستحضرات التجميل الطبية المصنعة من قبل شركة DTS MG Co., Ltd. في سيول، كوريا الجنوبية. في الإمارات، يتم توزيع منتجات GENOSYS حصرياً من خلال GENOSYS Middle East FZ-LLC، متوفرة على genosys.ae مع توصيل مجاني لجميع الإمارات السبع للطلبات التي تتجاوز 1000 درهم."
  },
  {
    question: "ما هي المنتجات التي يبيعها GENOSYS؟",
    answer: "يبيع GENOSYS مستحضرات تجميل كورية احترافية بما في ذلك أجهزة الوخز بالإبر الدقيقة، والأمصال، والكريمات المرطبة، وأقنعة الوجه، والمنظفات، ومنتجات الحماية من الشمس. جميع المنتجات مصنوعة في كوريا الجنوبية ومختبرة طبياً."
  },
  {
    question: "هل يوفر GENOSYS الإمارات شحن مجاني؟",
    answer: "نعم، يوفر GENOSYS الشرق الأوسط شحن مجاني عبر جميع الإمارات السبع (دبي، أبوظبي، الشارقة، عجمان، رأس الخيمة، الفجيرة، وأم القيوين) للطلبات التي تزيد عن 1000 درهم. يستغرق التوصيل القياسي من 1 إلى 3 أيام عمل."
  },
]

export const GENOSYS_FAQ_RU: FaqItem[] = [
  {
    question: "Что такое GENOSYS и где купить в ОАЭ?",
    answer: "GENOSYS — это бренд профессиональной корейской дерматокосметики, производимой компанией DTS MG Co., Ltd. в Сеуле, Южная Корея. В ОАЭ продукция GENOSYS эксклюзивно распространяется компанией GENOSYS Middle East FZ-LLC, доступна на сайте genosys.ae с бесплатной доставкой по всем 7 эмиратам при заказе свыше 1000 дирхамов."
  },
  {
    question: "Какую продукцию продает GENOSYS?",
    answer: "GENOSYS продает профессиональную корейскую дерматокосметику, включая устройства для микронидлинга, сыворотки и ампулы, увлажняющие кремы, маски для лица, очищающие средства и средства защиты от солнца. Вся продукция произведена в Южной Корее и прошла дерматологическое тестирование."
  },
  {
    question: "Есть ли бесплатная доставка GENOSYS в ОАЭ?",
    answer: "Да, GENOSYS Middle East предлагает бесплатную доставку по всем 7 эмиратам ОАЭ (Дубай, Абу-Даби, Шарджа, Аджман, Рас-эль-Хайма, Фуджейра и Умм-эль-Кайвайн) при заказе свыше 1000 дирхамов. Стандартная доставка занимает 1-3 рабочих дня."
  },
]
