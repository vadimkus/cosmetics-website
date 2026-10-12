import Link from 'next/link'
import type { Metadata } from 'next'

type Locale = 'en' | 'ru' | 'ar'

export const MCP_URL = 'https://genosys.ae/mcp'

const COPY = {
  en: {
    title: 'GENOSYS in ChatGPT, Claude and your AI assistant',
    description:
      'Connect the GENOSYS MCP server to ChatGPT, Claude, Cursor or any MCP-compatible assistant: search Korean professional skincare, compare products, get a routine and a ready bag link with UAE prices.',
    eyebrow: 'GENOSYS for AI assistants',
    lead: 'Ask your AI assistant about GENOSYS and it answers from our live catalog: real products, AED prices with VAT and how to use them. When you are ready, order right there in the chat and pay on a secure Stripe page. Delivery across the UAE.',
    canTitle: 'What your assistant can do',
    can: [
      'Find products for your skin or concern, in English, Russian or Arabic',
      'Explain a product: key ingredients, how to use it, sizes and shades',
      'Suggest a routine for your skin type',
      'Give delivery, payment and returns information for the UAE',
      'Place your order right in the chat and pay on a secure Stripe page (card, Apple Pay, Google Pay)',
      'Or create one link that fills your bag on genosys.ae',
      'Check an order with its number and your email',
    ],
    urlLabel: 'Server address',
    howTitle: 'How to connect',
    chatgptTitle: 'ChatGPT',
    chatgpt:
      'GENOSYS is being submitted to the ChatGPT Plugins directory. Once it is listed, search for GENOSYS there and connect it. Until then, ChatGPT users with developer mode can add it as a custom app with the server address above.',
    claudeTitle: 'Claude',
    claude: 'In Claude, add a custom connector and paste the server address above. No sign-in needed.',
    devTitle: 'Cursor, VS Code and other MCP clients',
    dev: 'Add this to your MCP configuration:',
    tryTitle: 'Try asking',
    tries: [
      'What GENOSYS serum is good for dry skin in the AC?',
      'Build me a morning routine for oily, acne-prone skin from GENOSYS.',
      'How do I use the GLASS SKIN RITUAL KIT, and which shade fits light skin?',
      'Order the GLASS SKIN RITUAL KIT in #01 Bright to my address in Dubai Marina.',
    ],
    privacyTitle: 'Privacy',
    privacy:
      'Browsing uses only the public catalog. When you order in the chat, your assistant sends GENOSYS the name, email, phone and address you give it, used only to deliver your order. Payment happens on Stripe: GENOSYS and your assistant never see your card. Nothing is charged until you pay.',
    privacyLink: 'Privacy policy',
    shop: 'Browse products',
  },
  ru: {
    title: 'GENOSYS в ChatGPT, Claude и вашем AI-ассистенте',
    description:
      'Подключите MCP-сервер GENOSYS к ChatGPT, Claude, Cursor или любому совместимому ассистенту: подбор корейской профессиональной косметики, сравнение, уход и готовая ссылка в корзину с ценами в ОАЭ.',
    eyebrow: 'GENOSYS для AI-ассистентов',
    lead: 'Спросите своего AI-ассистента о GENOSYS, и он ответит по нашему живому каталогу: реальные товары, цены в AED с НДС и способ применения. Когда будете готовы, оформите заказ прямо в чате и оплатите на защищённой странице Stripe. Доставка по всем ОАЭ.',
    canTitle: 'Что умеет ассистент',
    can: [
      'Подобрать средства для вашей кожи или задачи на русском, английском или арабском',
      'Рассказать о продукте: ключевые компоненты, применение, объёмы и оттенки',
      'Предложить уход под ваш тип кожи',
      'Рассказать о доставке, оплате и возврате в ОАЭ',
      'Оформить заказ прямо в чате и оплатить на защищённой странице Stripe (карта, Apple Pay, Google Pay)',
      'Или создать одну ссылку, которая наполнит корзину на genosys.ae',
      'Проверить заказ по номеру и email',
    ],
    urlLabel: 'Адрес сервера',
    howTitle: 'Как подключить',
    chatgptTitle: 'ChatGPT',
    chatgpt:
      'GENOSYS подаётся в каталог плагинов ChatGPT. Когда он появится в каталоге, найдите там GENOSYS и подключите. До этого пользователи ChatGPT с режимом разработчика могут добавить его как своё приложение по адресу сервера выше.',
    claudeTitle: 'Claude',
    claude: 'В Claude добавьте свой коннектор и вставьте адрес сервера выше. Вход не нужен.',
    devTitle: 'Cursor, VS Code и другие MCP-клиенты',
    dev: 'Добавьте это в конфигурацию MCP:',
    tryTitle: 'Попробуйте спросить',
    tries: [
      'Какая сыворотка GENOSYS подойдёт для сухой кожи под кондиционером?',
      'Составь утренний уход GENOSYS для жирной кожи, склонной к акне.',
      'Как пользоваться GLASS SKIN RITUAL KIT и какой оттенок подойдёт светлой коже?',
      'Закажи GLASS SKIN RITUAL KIT в оттенке #01 Bright с доставкой в Дубай Марину.',
    ],
    privacyTitle: 'Конфиденциальность',
    privacy:
      'Для подбора используется только открытый каталог. Когда вы заказываете в чате, ассистент передаёт GENOSYS имя, email, телефон и адрес, которые вы ему дали, только для доставки заказа. Оплата проходит на Stripe: ни GENOSYS, ни ассистент не видят вашу карту. Ничего не списывается, пока вы не оплатите.',
    privacyLink: 'Политика конфиденциальности',
    shop: 'Смотреть товары',
  },
  ar: {
    title: 'GENOSYS في ChatGPT وClaude ومساعدكِ الذكي',
    description:
      'اربطي خادم MCP من GENOSYS بـChatGPT أو Claude أو Cursor أو أي مساعد متوافق: ابحثي في العناية الكورية الاحترافية، قارني المنتجات، واحصلي على روتين ورابط سلة جاهز بأسعار الإمارات.',
    eyebrow: 'GENOSYS للمساعدات الذكية',
    lead: 'اسألي مساعدكِ الذكي عن GENOSYS فيجيبكِ من كتالوجنا المباشر: منتجات حقيقية، أسعار بالدرهم شاملة الضريبة وطريقة الاستخدام. وعندما تكونين جاهزة، اطلبي داخل المحادثة وادفعي عبر صفحة Stripe الآمنة. التوصيل لجميع أنحاء الإمارات.',
    canTitle: 'ما يمكن لمساعدكِ فعله',
    can: [
      'العثور على منتجات لبشرتكِ أو مشكلتكِ بالعربية أو الإنجليزية أو الروسية',
      'شرح المنتج: المكونات الأساسية وطريقة الاستخدام والأحجام والدرجات',
      'اقتراح روتين يناسب نوع بشرتكِ',
      'معلومات التوصيل والدفع والإرجاع في الإمارات',
      'إتمام الطلب داخل المحادثة والدفع عبر صفحة Stripe الآمنة (بطاقة، Apple Pay، Google Pay)',
      'أو إنشاء رابط واحد يملأ سلتكِ على genosys.ae',
      'متابعة الطلب برقمه وبريدكِ الإلكتروني',
    ],
    urlLabel: 'عنوان الخادم',
    howTitle: 'طريقة الربط',
    chatgptTitle: 'ChatGPT',
    chatgpt:
      'يجري تقديم GENOSYS إلى دليل الإضافات في ChatGPT. بعد إدراجه، ابحثي عن GENOSYS هناك واربطيه. وحتى ذلك الحين، يمكن لمستخدمي ChatGPT الذين فعّلوا وضع المطوّر إضافته كتطبيق مخصص بعنوان الخادم أعلاه.',
    claudeTitle: 'Claude',
    claude: 'في Claude، أضيفي موصّلاً مخصصاً والصقي عنوان الخادم أعلاه. لا حاجة لتسجيل الدخول.',
    devTitle: 'Cursor وVS Code وعملاء MCP الآخرون',
    dev: 'أضيفي هذا إلى إعدادات MCP:',
    tryTitle: 'جرّبي أن تسألي',
    tries: [
      'أي سيروم من GENOSYS يناسب البشرة الجافة بسبب المكيّف؟',
      'اقترح لي روتيناً صباحياً من GENOSYS للبشرة الدهنية المعرضة للحبوب.',
      'كيف أستخدم GLASS SKIN RITUAL KIT وأي درجة تناسب البشرة الفاتحة؟',
      'اطلب GLASS SKIN RITUAL KIT بدرجة #01 Bright إلى عنواني في دبي مارينا.',
    ],
    privacyTitle: 'الخصوصية',
    privacy:
      'يستخدم البحث الكتالوج العام فقط. عند الطلب داخل المحادثة، يرسل مساعدكِ إلى GENOSYS الاسم والبريد والهاتف والعنوان التي تقدمينها، وتُستخدم لتوصيل طلبكِ فقط. يتم الدفع عبر Stripe، فلا ترى GENOSYS ولا مساعدكِ بيانات بطاقتكِ. لا يُخصم أي مبلغ قبل الدفع.',
    privacyLink: 'سياسة الخصوصية',
    shop: 'تصفّحي المنتجات',
  },
} as const

const prefix = (locale: Locale) => (locale === 'en' ? '' : `/${locale}`)

export function aiPageMetadata(locale: Locale): Metadata {
  const c = COPY[locale]
  const url = `https://genosys.ae${prefix(locale)}/ai`
  return {
    title: c.title,
    description: c.description,
    alternates: {
      canonical: url,
      languages: { en: 'https://genosys.ae/ai', ru: 'https://genosys.ae/ru/ai', ar: 'https://genosys.ae/ar/ai' },
    },
    openGraph: { title: c.title, description: c.description, url, type: 'website' },
  }
}

const CONFIG_SNIPPET = `{
  "mcpServers": {
    "genosys": {
      "url": "${MCP_URL}"
    }
  }
}`

export default function AiConnectPage({ locale }: { locale: Locale }) {
  const c = COPY[locale]
  const rtl = locale === 'ar'
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:py-16" dir={rtl ? 'rtl' : 'ltr'}>
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{c.eyebrow}</p>
      <h1 className="mt-3 text-3xl md:text-4xl font-light text-gray-900">{c.title}</h1>
      <p className="mt-5 text-lg text-gray-700">{c.lead}</p>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
        <p className="text-xs uppercase tracking-[0.15em] text-gray-500">{c.urlLabel}</p>
        <code className="mt-2 block break-all text-lg text-gray-900" dir="ltr">{MCP_URL}</code>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-normal text-gray-900">{c.canTitle}</h2>
        <ul className="mt-4 space-y-2 text-gray-700">
          {c.can.map((line) => (
            <li key={line}>· {line}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-normal text-gray-900">{c.howTitle}</h2>
        <div>
          <h3 className="font-medium text-gray-900">{c.chatgptTitle}</h3>
          <p className="mt-1 text-gray-700">{c.chatgpt}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{c.claudeTitle}</h3>
          <p className="mt-1 text-gray-700">{c.claude}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{c.devTitle}</h3>
          <p className="mt-1 text-gray-700">{c.dev}</p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-gray-100" dir="ltr">
            {CONFIG_SNIPPET}
          </pre>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-normal text-gray-900">{c.tryTitle}</h2>
        <ul className="mt-4 space-y-2">
          {c.tries.map((line) => (
            <li key={line} className="rounded-xl bg-gray-50 px-4 py-3 text-gray-800">“{line}”</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-normal text-gray-900">{c.privacyTitle}</h2>
        <p className="mt-2 text-gray-700">{c.privacy}</p>
        <Link href={`${prefix(locale)}/privacy-policy`} className="mt-2 inline-block text-sm text-gray-600 underline">
          {c.privacyLink}
        </Link>
      </section>

      <div className="mt-12">
        <Link href={`${prefix(locale)}/products`} className="ed-cta inline-block px-6 py-3">
          {c.shop}
        </Link>
      </div>
    </main>
  )
}
