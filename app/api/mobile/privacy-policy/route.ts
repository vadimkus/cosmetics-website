/**
 * Mobile Privacy Policy API - GET /api/mobile/privacy-policy
 * Single source of truth for privacy policy content across website and apps.
 * Returns structured sections in the requested locale.
 *
 * Accepts x-locale header: 'en' | 'ar' | 'ru' (defaults to 'en')
 */

import { NextRequest, NextResponse } from 'next/server'

const LAST_UPDATED = '2026-03-30'

function getContent(locale: string) {
  const lastUpdated = locale === 'ar' ? '30 مارس 2026' : locale === 'ru' ? '30 марта 2026' : 'March 30, 2026'

  const sections = [
    {
      id: 'rights',
      type: 'highlight',
      title: locale === 'ar' ? 'حقوقك في الخصوصية' : locale === 'ru' ? 'Ваши права на конфиденциальность' : 'Your Privacy Rights',
      content: locale === 'ar'
        ? 'كمستخدم مسجّل، لديك الحق في الوصول إلى معلوماتك الشخصية أو تحديثها أو حذفها في أي وقت. يمكنك طلب نسخة من بياناتك أو حذف حسابك بالتواصل معنا. نلتزم بقوانين حماية البيانات في دولة الإمارات العربية المتحدة بما في ذلك المرسوم بقانون اتحادي رقم 45 لسنة 2021 بشأن حماية البيانات الشخصية.'
        : locale === 'ru'
          ? 'Как зарегистрированный пользователь, вы имеете право на доступ, обновление или удаление вашей личной информации в любое время. Вы можете запросить копию своих данных или удаление аккаунта, связавшись с нами. Мы соблюдаем законы о защите данных ОАЭ, включая Федеральный декрет-закон № 45 от 2021 года о защите персональных данных.'
          : 'As a registered user, you have the right to access, update, or delete your personal information at any time. You can request a copy of your data or account deletion by contacting us. We comply with UAE data protection laws including Federal Decree-Law No. 45 of 2021 on Personal Data Protection (PDPL).',
    },
    {
      id: 'personal-info',
      type: 'list',
      number: 1,
      title: locale === 'ar' ? 'المعلومات الشخصية التي نجمعها' : locale === 'ru' ? 'Личная информация, которую мы собираем' : 'Personal Information We Collect',
      items: locale === 'ar' ? [
        { label: 'معلومات الحساب:', text: 'الاسم، البريد الإلكتروني، رقم الهاتف، كلمة المرور (مشفرة)' },
        { label: 'بيانات الملف الشخصي:', text: 'تاريخ الميلاد، صورة الملف الشخصي، تفضيلات العناية بالبشرة' },
        { label: 'معلومات الطلبات:', text: 'سجل المشتريات، عناوين الشحن، طريقة الدفع المفضلة' },
        { label: 'عناوين التوصيل:', text: 'عناوين التوصيل المحفوظة في جميع أنحاء الإمارات' },
        { label: 'بيانات الاستخدام:', text: 'تفاعلات الموقع والتطبيق، مشاهدات الصفحات، بيانات الجلسة، نوع الجهاز' },
      ] : locale === 'ru' ? [
        { label: 'Информация об аккаунте:', text: 'Имя, email, телефон, пароль (зашифрован)' },
        { label: 'Данные профиля:', text: 'День рождения, фото профиля, предпочтения по уходу за кожей' },
        { label: 'Информация о заказах:', text: 'История покупок, адреса доставки, предпочитаемый способ оплаты' },
        { label: 'Адреса доставки:', text: 'Сохранённые адреса доставки по ОАЭ' },
        { label: 'Данные использования:', text: 'Взаимодействие с сайтом/приложением, просмотры страниц, данные сессии, тип устройства' },
      ] : [
        { label: 'Account Information:', text: 'Name, email, phone number, password (encrypted)' },
        { label: 'Profile Data:', text: 'Birthday, profile picture, skincare preferences' },
        { label: 'Order Information:', text: 'Purchase history, shipping addresses, preferred payment method' },
        { label: 'Delivery Addresses:', text: 'Saved delivery addresses across the UAE' },
        { label: 'Usage Data:', text: 'Website and app interactions, page views, session data, device type' },
      ],
    },
    {
      id: 'how-we-use',
      type: 'bullets',
      number: 2,
      title: locale === 'ar' ? 'كيف نستخدم معلوماتك' : locale === 'ru' ? 'Как мы используем вашу информацию' : 'How We Use Your Information',
      items: locale === 'ar' ? [
        'معالجة وتنفيذ طلباتك وتوصيلها',
        'إدارة حسابك وتقديم دعم العملاء',
        'إرسال تأكيدات الطلبات وتحديثات التوصيل',
        'تخصيص تجربة التسوق وتوصيات المنتجات',
        'تقديم تحليل البشرة بالذكاء الاصطناعي واقتراحات روتين العناية',
        'إرسال إشعارات حول المنتجات الجديدة والعروض (بموافقتك)',
        'تحسين موقعنا وتطبيقاتنا وخدماتنا',
        'منع الاحتيال وضمان أمن المعاملات',
        'الامتثال للمتطلبات القانونية والتنظيمية في الإمارات',
      ] : locale === 'ru' ? [
        'Обработка, выполнение и доставка ваших заказов',
        'Управление аккаунтом и поддержка клиентов',
        'Отправка подтверждений заказов и обновлений доставки',
        'Персонализация покупок и рекомендации продуктов',
        'ИИ-анализ кожи и рекомендации по уходу',
        'Уведомления о новинках и акциях (с вашего согласия)',
        'Улучшение сайта, приложений и сервисов',
        'Предотвращение мошенничества и безопасность транзакций',
        'Соблюдение законодательных требований ОАЭ',
      ] : [
        'Processing, fulfilling, and delivering your orders',
        'Managing your account and providing customer support',
        'Sending order confirmations and delivery updates',
        'Personalizing your shopping experience and product recommendations',
        'Providing AI skin analysis and skincare routine suggestions',
        'Sending notifications about new products and promotions (with your consent)',
        'Improving our website, mobile apps, and services',
        'Preventing fraud and ensuring transaction security',
        'Complying with UAE legal and regulatory requirements',
      ],
    },
    {
      id: 'mobile-apps',
      type: 'list',
      number: 3,
      title: locale === 'ar' ? 'تطبيقات الهاتف المحمول' : locale === 'ru' ? 'Мобильные приложения' : 'Mobile Applications',
      content: locale === 'ar'
        ? 'تطبيق GENOSYS UAE متاح على iOS (App Store) و Android (Google Play). عند استخدام تطبيقاتنا، قد نجمع معلومات إضافية:'
        : locale === 'ru'
          ? 'Приложение GENOSYS UAE доступно на iOS (App Store) и Android (Google Play). При использовании наших приложений мы можем собирать дополнительную информацию:'
          : 'The GENOSYS UAE app is available on iOS (App Store) and Android (Google Play). When using our mobile apps, we may collect additional information:',
      items: locale === 'ar' ? [
        { label: 'معلومات الجهاز:', text: 'طراز الجهاز، إصدار نظام التشغيل، معرّف التطبيق الفريد' },
        { label: 'الإشعارات الفورية:', text: 'رمز الإشعارات (فقط إذا سمحت بذلك). يمكنك تعطيلها من إعدادات جهازك.' },
        { label: 'المصادقة البيومترية:', text: 'بصمة الإصبع / Face ID تُستخدم محلياً على جهازك فقط. لا يتم إرسال البيانات البيومترية إلى خوادمنا.' },
        { label: 'الكاميرا (اختياري):', text: 'تُستخدم فقط لميزة تحليل البشرة بالذكاء الاصطناعي. لا يتم تخزين الصور بعد التحليل.' },
      ] : locale === 'ru' ? [
        { label: 'Информация об устройстве:', text: 'Модель устройства, версия ОС, уникальный идентификатор приложения' },
        { label: 'Push-уведомления:', text: 'Токен уведомлений (только с вашего разрешения). Можно отключить в настройках устройства.' },
        { label: 'Биометрическая аутентификация:', text: 'Отпечаток пальца / Face ID используются локально на устройстве. Биометрические данные не передаются на наши серверы.' },
        { label: 'Камера (по желанию):', text: 'Используется только для ИИ-анализа кожи. Фотографии не сохраняются после анализа.' },
      ] : [
        { label: 'Device Information:', text: 'Device model, operating system version, unique app identifier' },
        { label: 'Push Notifications:', text: 'Push notification token (only if you grant permission). You can disable notifications in your device settings.' },
        { label: 'Biometric Authentication:', text: 'Fingerprint / Face ID is used locally on your device. Biometric data is never sent to our servers.' },
        { label: 'Camera (Optional):', text: 'Used only for AI Skin Analysis. Photos are not stored after analysis.' },
      ],
      links: [
        { label: 'App Store (iOS)', url: 'https://apps.apple.com/ae/app/genosys-uae/id6756648064' },
        { label: 'Google Play (Android)', url: 'https://play.google.com/store/apps/details?id=ae.genosys.app' },
      ],
    },
    {
      id: 'ai-features',
      type: 'list',
      number: 4,
      title: locale === 'ar' ? 'ميزات الذكاء الاصطناعي' : locale === 'ru' ? 'Функции искусственного интеллекта' : 'AI Features & Skin Analysis',
      content: locale === 'ar'
        ? 'نستخدم الذكاء الاصطناعي (مدعوم بـ OpenAI GPT-4o) لتقديم تجربة مخصصة:'
        : locale === 'ru'
          ? 'Мы используем искусственный интеллект (на базе OpenAI GPT-4o) для персонализированного опыта:'
          : 'We use artificial intelligence (powered by OpenAI GPT-4o) to provide a personalized experience:',
      items: locale === 'ar' ? [
        { label: 'تحليل البشرة بالذكاء الاصطناعي:', text: 'عند استخدام الميزة، يتم إرسال صورتك إلى OpenAI للتحليل. لا نحتفظ بالصور بعد اكتمال التحليل.' },
        { label: 'مساعد الدردشة الذكي (Genie):', text: 'محادثاتك لا يتم تخزينها أو ربطها بحسابك. كل جلسة مستقلة.' },
      ] : locale === 'ru' ? [
        { label: 'ИИ-анализ кожи:', text: 'Ваше фото отправляется в OpenAI для обработки. Мы не сохраняем фотографии после анализа.' },
        { label: 'ИИ-ассистент (Genie):', text: 'Ваши разговоры не сохраняются и не привязываются к аккаунту. Каждая сессия независима.' },
      ] : [
        { label: 'AI Skin Analysis:', text: 'Your photo is sent to OpenAI for processing. We do not retain photos after analysis is complete.' },
        { label: 'AI Chat Assistant (Genie):', text: 'Conversations are not stored or linked to your account. Each session is independent.' },
      ],
    },
    {
      id: 'google-auth',
      type: 'list',
      number: 5,
      title: locale === 'ar' ? 'تسجيل الدخول عبر Google' : locale === 'ru' ? 'Вход через Google (OAuth)' : 'Google Authentication (OAuth)',
      items: locale === 'ar' ? [
        { label: 'تسجيل الدخول عبر Google:', text: 'نستلم معلومات ملفك الأساسية (الاسم، البريد الإلكتروني، صورة الملف) وفقًا لإعدادات الخصوصية في حسابك.' },
        { label: 'البيانات التي تتم مشاركتها:', text: 'نستلم فقط المعلومات التي وافقت صراحة على مشاركتها. لا نصل إلى جهات اتصالك أو ملفاتك.' },
      ] : locale === 'ru' ? [
        { label: 'Вход через Google:', text: 'Мы получаем основную информацию профиля (имя, email, фото) в соответствии с настройками конфиденциальности аккаунта.' },
        { label: 'Передаваемые данные:', text: 'Мы получаем только информацию, на передачу которой вы согласились. Мы не получаем доступ к контактам или файлам.' },
      ] : [
        { label: 'Google Sign-In:', text: 'We receive your basic profile information (name, email, picture) according to your Google account privacy settings.' },
        { label: 'Data Shared:', text: 'We only receive information you explicitly consent to share. We do not access your contacts or files.' },
      ],
      links: [{ label: 'Google Privacy Policy', url: 'https://policies.google.com/privacy' }],
    },
    {
      id: 'apple-auth',
      type: 'list',
      number: 6,
      title: locale === 'ar' ? 'تسجيل الدخول عبر Apple' : locale === 'ru' ? 'Вход через Apple' : 'Apple Sign‑In',
      items: locale === 'ar' ? [
        { label: 'Sign in with Apple:', text: 'قد نستلم اسمك وبريدك الإلكتروني (حسب اختيارك). قد توفّر Apple بريدًا إلكترونيًا خاصًا بدلًا من بريدك الحقيقي.' },
      ] : locale === 'ru' ? [
        { label: 'Вход через Apple:', text: 'Мы можем получить имя и email (по вашему выбору). Apple может предоставить частный email вместо реального.' },
      ] : [
        { label: 'Sign in with Apple:', text: 'We may receive your name and email (depending on your choice). Apple may provide a private relay email instead of your real address.' },
      ],
      links: [{ label: 'Apple Privacy Policy', url: 'https://www.apple.com/legal/privacy/' }],
    },
    {
      id: 'payment',
      type: 'text',
      number: 7,
      title: locale === 'ar' ? 'معالجة المدفوعات' : locale === 'ru' ? 'Обработка платежей' : 'Payment Processing',
      content: locale === 'ar'
        ? 'نحن لا نخزّن بيانات بطاقتك المصرفية. جميع المدفوعات بالبطاقة تتم عبر Stripe المعتمد بمعايير PCI DSS. عند اختيار الدفع عند الاستلام، لا يتم جمع أي بيانات مالية. طرق الدفع: بطاقة ائتمان/خصم (Visa، Mastercard، Amex)، Apple Pay، Google Pay، والدفع عند الاستلام.'
        : locale === 'ru'
          ? 'Мы не храним данные карты. Все карточные платежи обрабатываются через Stripe (PCI DSS). При оплате наложенным платежом финансовые данные не собираются. Способы оплаты: карта (Visa, Mastercard, Amex), Apple Pay, Google Pay и наложенный платёж.'
          : 'We do not store your card details. All card payments are processed through Stripe, a PCI DSS-compliant payment provider. When you choose Cash on Delivery, no financial data is collected. Available methods: Credit/debit card (Visa, Mastercard, Amex), Apple Pay, Google Pay, and Cash on Delivery.',
    },
    {
      id: 'data-sharing',
      type: 'bullets',
      number: 8,
      title: locale === 'ar' ? 'مشاركة البيانات مع أطراف ثالثة' : locale === 'ru' ? 'Передача данных третьим лицам' : 'Data Sharing & Third Parties',
      content: locale === 'ar' ? 'لا نبيع معلوماتك الشخصية أبداً. قد نشارك بياناتك مع:' : locale === 'ru' ? 'Мы никогда не продаём вашу личную информацию. Мы можем передавать данные:' : 'We never sell your personal information. We may share your data with:',
      items: locale === 'ar' ? [
        'Stripe: لمعالجة المدفوعات بشكل آمن',
        'شركاء التوصيل: لتسليم طلباتك (الاسم، العنوان، رقم الهاتف فقط)',
        'OpenAI: لميزات تحليل البشرة والمساعد الذكي (بيانات مجهولة الهوية)',
        'Vercel: استضافة الموقع (بيانات مجهولة الهوية)',
        'السلطات القانونية: عند الطلب بموجب القانون الإماراتي',
      ] : locale === 'ru' ? [
        'Stripe: для безопасной обработки платежей',
        'Партнёры по доставке: для доставки заказов (только имя, адрес, телефон)',
        'OpenAI: для анализа кожи и ИИ-ассистента (обезличенные данные)',
        'Vercel: хостинг сайта (обезличенные данные)',
        'Правоохранительные органы: по требованию закона ОАЭ',
      ] : [
        'Stripe: for secure payment processing',
        'Delivery partners: to fulfil your orders (name, address, phone only)',
        'OpenAI: for AI skin analysis and chat assistant (anonymized data)',
        'Vercel: website hosting (anonymized data)',
        'Law enforcement: when required by UAE law',
      ],
    },
    {
      id: 'cookies',
      type: 'text',
      number: 9,
      title: locale === 'ar' ? 'ملفات تعريف الارتباط والتتبع' : locale === 'ru' ? 'Файлы cookie и отслеживание' : 'Cookies & Tracking',
      content: locale === 'ar'
        ? 'نستخدم ملفات تعريف الارتباط الأساسية للحفاظ على جلسة تسجيل الدخول وسلة التسوق وتفضيلات اللغة. لا نستخدم ملفات تعريف ارتباط للتتبع من أطراف ثالثة أو إعلانات مستهدفة.'
        : locale === 'ru'
          ? 'Мы используем только необходимые файлы cookie для поддержания сессии входа, корзины и языковых настроек. Мы не используем сторонние отслеживающие cookie или таргетированную рекламу.'
          : 'We use essential cookies to maintain your login session, shopping cart, and language preferences. We do not use third-party tracking cookies or targeted advertising.',
    },
    {
      id: 'security',
      type: 'bullets',
      number: 10,
      title: locale === 'ar' ? 'أمن البيانات' : locale === 'ru' ? 'Безопасность данных' : 'Data Security',
      content: locale === 'ar' ? 'نتخذ تدابير أمنية مناسبة لحماية بياناتك:' : locale === 'ru' ? 'Мы принимаем соответствующие меры безопасности:' : 'We implement appropriate security measures to protect your data:',
      items: locale === 'ar' ? [
        'تشفير جميع البيانات أثناء النقل باستخدام HTTPS/TLS',
        'كلمات المرور مشفرة ولا يمكن قراءتها',
        'بيانات الدفع تُعالج بواسطة Stripe (PCI DSS)',
        'حماية CSRF لجميع النماذج وطلبات API',
        'تحديد معدل الطلبات لمنع إساءة الاستخدام',
        'مراجعات أمنية دورية',
      ] : locale === 'ru' ? [
        'Шифрование данных при передаче через HTTPS/TLS',
        'Пароли хешируются и не могут быть прочитаны',
        'Платёжные данные через Stripe (PCI DSS)',
        'CSRF-защита для всех форм и API-запросов',
        'Ограничение частоты запросов',
        'Регулярные проверки безопасности',
      ] : [
        'All data encrypted in transit via HTTPS/TLS',
        'Passwords are hashed and cannot be read back',
        'Payment data processed through PCI DSS-compliant Stripe',
        'CSRF protection on all forms and API requests',
        'Rate limiting to prevent abuse',
        'Regular security audits',
      ],
    },
    {
      id: 'retention',
      type: 'text',
      number: 11,
      title: locale === 'ar' ? 'الاحتفاظ بالبيانات' : locale === 'ru' ? 'Хранение данных' : 'Data Retention',
      content: locale === 'ar'
        ? 'نحتفظ ببياناتك طالما حسابك نشط. يتم الاحتفاظ ببيانات الطلبات لمدة 5 سنوات للمتطلبات الضريبية. يمكنك طلب حذف حسابك — سيتم حذف بياناتك خلال 30 يوماً، مع الاحتفاظ بسجلات المعاملات حسب القانون.'
        : locale === 'ru'
          ? 'Мы храним данные, пока аккаунт активен. Данные заказов хранятся 5 лет для налоговых требований. Вы можете запросить удаление — данные удаляются за 30 дней, кроме записей о транзакциях по закону.'
          : 'We retain personal data as long as your account is active. Order data is kept for 5 years for UAE tax requirements. You can request account deletion — personal data removed within 30 days, except transaction records required by law.',
    },
    {
      id: 'children',
      type: 'text',
      number: 12,
      title: locale === 'ar' ? 'خصوصية الأطفال' : locale === 'ru' ? 'Конфиденциальность детей' : "Children's Privacy",
      content: locale === 'ar'
        ? 'خدماتنا غير موجهة للأطفال دون سن 16 عاماً. لا نجمع معلومات شخصية عن قصد من الأطفال.'
        : locale === 'ru'
          ? 'Наши услуги не предназначены для детей младше 16 лет. Мы не собираем осознанно личную информацию детей.'
          : 'Our services are not directed at children under 16. We do not knowingly collect personal information from children.',
    },
    {
      id: 'changes',
      type: 'text',
      number: 13,
      title: locale === 'ar' ? 'التغييرات على هذه السياسة' : locale === 'ru' ? 'Изменения в политике' : 'Changes to This Policy',
      content: locale === 'ar'
        ? 'قد نقوم بتحديث هذه السياسة. سيتم نشر التغييرات مع تحديث التاريخ. للتغييرات الجوهرية، سنرسل إشعاراً عبر البريد أو التطبيق.'
        : locale === 'ru'
          ? 'Мы можем обновлять эту политику. Изменения публикуются с обновлённой датой. О существенных изменениях сообщим по email или в приложении.'
          : 'We may update this policy from time to time. Changes will be posted with an updated date. For material changes, we will notify you by email or app notification.',
    },
    {
      id: 'contact',
      type: 'contact',
      number: 14,
      title: locale === 'ar' ? 'تواصل معنا' : locale === 'ru' ? 'Свяжитесь с нами' : 'Contact Us',
      content: locale === 'ar'
        ? 'إذا كانت لديك أسئلة حول سياسة الخصوصية أو ترغب في ممارسة حقوقك، يرجى التواصل معنا:'
        : locale === 'ru'
          ? 'Если у вас есть вопросы или вы хотите воспользоваться правами на конфиденциальность, свяжитесь с нами:'
          : 'If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:',
      contact: {
        company: 'GENOSYS Middle East FZ-LLC',
        email: 'sales@genosys.ae',
        phone: '+971 58 548 76 65',
        website: 'https://genosys.ae',
        address: locale === 'ar' ? 'دبي، الإمارات العربية المتحدة' : locale === 'ru' ? 'Дубай, ОАЭ' : 'Dubai, UAE',
      },
    },
  ]

  return { lastUpdated, lastUpdatedISO: LAST_UPDATED, sections }
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.MOBILE_APP_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locale = request.headers.get('x-locale') || 'en'
    const data = getContent(locale)

    return NextResponse.json({
      title: locale === 'ar' ? 'سياسة الخصوصية' : locale === 'ru' ? 'Политика конфиденциальности' : 'Privacy Policy',
      subtitle: locale === 'ar' ? 'بياناتك، حقوقك' : locale === 'ru' ? 'Ваши данные, ваши права' : 'Your Data, Your Rights',
      lastUpdated: data.lastUpdated,
      lastUpdatedISO: data.lastUpdatedISO,
      sections: data.sections,
      locale,
      fullPolicyUrl: `https://genosys.ae/${locale === 'en' ? '' : locale + '/'}privacy-policy`,
    })
  } catch (error) {
    console.error('Mobile Privacy Policy API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
