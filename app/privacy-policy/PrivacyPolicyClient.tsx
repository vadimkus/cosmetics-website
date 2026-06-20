'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, Shield, Mail, Phone, ExternalLink, Clock, ArrowUp } from 'lucide-react'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useAuth } from '@/components/auth/AuthProvider'

export default function PrivacyPolicyClient() {
  const { locale, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isRTL = dir === 'rtl'
  const fromProfile = searchParams?.get('from') === 'profile'
  const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const checkMobileWeb = () => {
      const isMobile = window.innerWidth < 768
      setIsMobileWeb(isMobile && !isPWA)
    }
    checkMobileWeb()
    window.addEventListener('resize', checkMobileWeb)
    return () => window.removeEventListener('resize', checkMobileWeb)
  }, [isPWA])

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isAppLikeMode = (isClient && isPWA) || isMobileWeb

  const lastUpdated = locale === 'ar' ? '20 يونيو 2026' : locale === 'ru' ? '20 июня 2026' : 'June 20, 2026'

  const t = {
    title: locale === 'ar' ? 'سياسة الخصوصية' : locale === 'ru' ? 'Политика конфиденциальности' : 'Privacy Policy',
    subtitle: locale === 'ar' ? 'بياناتك، حقوقك' : locale === 'ru' ? 'Ваши данные, ваши права' : 'Your Data, Your Rights',
    lastUpdatedLabel: locale === 'ar' ? 'آخر تحديث:' : locale === 'ru' ? 'Последнее обновление:' : 'Last Updated:',

    // Your Privacy Rights
    rightsTitle: locale === 'ar' ? 'حقوقك في الخصوصية' : locale === 'ru' ? 'Ваши права на конфиденциальность' : 'Your Privacy Rights',
    rightsText: locale === 'ar'
      ? 'كمستخدم مسجّل، لديك الحق في الوصول إلى معلوماتك الشخصية أو تحديثها أو حذفها في أي وقت. يمكنك طلب نسخة من بياناتك أو حذف حسابك بالتواصل معنا. نلتزم بقوانين حماية البيانات في دولة الإمارات العربية المتحدة بما في ذلك المرسوم بقانون اتحادي رقم 45 لسنة 2021 بشأن حماية البيانات الشخصية.'
      : locale === 'ru'
        ? 'Как зарегистрированный пользователь, вы имеете право на доступ, обновление или удаление вашей личной информации в любое время. Вы можете запросить копию своих данных или удаление аккаунта, связавшись с нами. Мы соблюдаем законы о защите данных ОАЭ, включая Федеральный декрет-закон № 45 от 2021 года о защите персональных данных.'
        : 'As a registered user, you have the right to access, update, or delete your personal information at any time. You can request a copy of your data or account deletion by contacting us. We comply with UAE data protection laws including Federal Decree-Law No. 45 of 2021 on Personal Data Protection (PDPL).',

    // 1. Personal Information We Collect
    s1Title: locale === 'ar' ? '1. المعلومات الشخصية التي نجمعها' : locale === 'ru' ? '1. Личная информация, которую мы собираем' : '1. Personal Information We Collect',
    accountLabel: locale === 'ar' ? 'معلومات الحساب:' : locale === 'ru' ? 'Информация об аккаунте:' : 'Account Information:',
    accountText: locale === 'ar' ? 'الاسم، البريد الإلكتروني، رقم الهاتف، كلمة المرور (مشفرة)' : locale === 'ru' ? 'Имя, email, телефон, пароль (зашифрован)' : 'Name, email, phone number, password (encrypted)',
    profileLabel: locale === 'ar' ? 'بيانات الملف الشخصي:' : locale === 'ru' ? 'Данные профиля:' : 'Profile Data:',
    profileText: locale === 'ar' ? 'تاريخ الميلاد، صورة الملف الشخصي، تفضيلات العناية بالبشرة' : locale === 'ru' ? 'День рождения, фото профиля, предпочтения по уходу за кожей' : 'Birthday, profile picture, skincare preferences',
    orderLabel: locale === 'ar' ? 'معلومات الطلبات:' : locale === 'ru' ? 'Информация о заказах:' : 'Order Information:',
    orderText: locale === 'ar' ? 'سجل المشتريات، عناوين الشحن، طريقة الدفع المفضلة' : locale === 'ru' ? 'История покупок, адреса доставки, предпочитаемый способ оплаты' : 'Purchase history, shipping addresses, preferred payment method',
    deliveryLabel: locale === 'ar' ? 'عناوين التوصيل:' : locale === 'ru' ? 'Адреса доставки:' : 'Delivery Addresses:',
    deliveryText: locale === 'ar' ? 'عناوين التوصيل المحفوظة في جميع أنحاء الإمارات (الإمارة، المنطقة، المبنى، الطابق)' : locale === 'ru' ? 'Сохранённые адреса доставки по ОАЭ (эмират, район, здание, этаж)' : 'Saved delivery addresses across the UAE (emirate, area, building, floor)',
    usageLabel: locale === 'ar' ? 'بيانات الاستخدام:' : locale === 'ru' ? 'Данные использования:' : 'Usage Data:',
    usageText: locale === 'ar' ? 'تفاعلات الموقع والتطبيق، مشاهدات الصفحات، بيانات الجلسة، نوع الجهاز' : locale === 'ru' ? 'Взаимодействие с сайтом/приложением, просмотры страниц, данные сессии, тип устройства' : 'Website and app interactions, page views, session data, device type',

    // 2. How We Use Your Information
    s2Title: locale === 'ar' ? '2. كيف نستخدم معلوماتك' : locale === 'ru' ? '2. Как мы используем вашу информацию' : '2. How We Use Your Information',
    s2Items: locale === 'ar' ? [
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

    // 3. Mobile Applications
    s3Title: locale === 'ar' ? '3. تطبيقات الهاتف المحمول' : locale === 'ru' ? '3. Мобильные приложения' : '3. Mobile Applications',
    s3Intro: locale === 'ar'
      ? 'تطبيق GENOSYS UAE متاح على iOS (App Store) و Android (Google Play). عند استخدام تطبيقاتنا، قد نجمع معلومات إضافية:'
      : locale === 'ru'
        ? 'Приложение GENOSYS UAE доступно на iOS (App Store) и Android (Google Play). При использовании наших приложений мы можем собирать дополнительную информацию:'
        : 'The GENOSYS UAE app is available on iOS (App Store) and Android (Google Play). When using our mobile apps, we may collect additional information:',
    s3DeviceLabel: locale === 'ar' ? 'معلومات الجهاز:' : locale === 'ru' ? 'Информация об устройстве:' : 'Device Information:',
    s3DeviceText: locale === 'ar' ? 'طراز الجهاز، إصدار نظام التشغيل، معرّف التطبيق الفريد' : locale === 'ru' ? 'Модель устройства, версия ОС, уникальный идентификатор приложения' : 'Device model, operating system version, unique app identifier',
    s3PushLabel: locale === 'ar' ? 'الإشعارات الفورية:' : locale === 'ru' ? 'Push-уведомления:' : 'Push Notifications:',
    s3PushText: locale === 'ar' ? 'رمز الإشعارات الفورية (فقط إذا سمحت بذلك). يمكنك تعطيلها في أي وقت من إعدادات جهازك.' : locale === 'ru' ? 'Токен push-уведомлений (только с вашего разрешения). Можно отключить в настройках устройства.' : 'Push notification token (only if you grant permission). You can disable notifications at any time in your device settings.',
    s3BiometricLabel: locale === 'ar' ? 'المصادقة البيومترية:' : locale === 'ru' ? 'Биометрическая аутентификация:' : 'Biometric Authentication:',
    s3BiometricText: locale === 'ar' ? 'بصمة الإصبع / Face ID تُستخدم محلياً على جهازك فقط للتحقق السريع. لا يتم إرسال أو تخزين البيانات البيومترية على خوادمنا.' : locale === 'ru' ? 'Отпечаток пальца / Face ID используются локально на устройстве для быстрого входа. Биометрические данные не передаются и не хранятся на наших серверах.' : 'Fingerprint / Face ID is used locally on your device for quick login. Biometric data is never sent to or stored on our servers.',
    s3CameraLabel: locale === 'ar' ? 'الكاميرا (اختياري):' : locale === 'ru' ? 'Камера (по желанию):' : 'Camera (Optional):',
    s3CameraText: locale === 'ar' ? 'تُستخدم فقط لميزة تحليل البشرة بالذكاء الاصطناعي. لا يتم تخزين الصور على خوادمنا بعد اكتمال التحليل.' : locale === 'ru' ? 'Используется только для ИИ-анализа кожи. Фотографии не сохраняются на наших серверах после завершения анализа.' : 'Used only for the AI Skin Analysis feature. Photos are not stored on our servers after analysis is complete.',
    s3StoresLabel: locale === 'ar' ? 'روابط التحميل:' : locale === 'ru' ? 'Ссылки для скачивания:' : 'Download Links:',

    // 4. AI Features
    s4Title: locale === 'ar' ? '4. ميزات الذكاء الاصطناعي' : locale === 'ru' ? '4. Функции искусственного интеллекта' : '4. AI Features & Skin Analysis',
    s4Text: locale === 'ar'
      ? 'نستخدم الذكاء الاصطناعي (مدعوم بـ OpenAI GPT-4o) لتقديم تجربة مخصصة:'
      : locale === 'ru'
        ? 'Мы используем искусственный интеллект (на базе OpenAI GPT-4o) для персонализированного опыта:'
        : 'We use artificial intelligence (powered by OpenAI GPT-4o) to provide a personalized experience:',
    s4SkinLabel: locale === 'ar' ? 'تحليل البشرة بالذكاء الاصطناعي:' : locale === 'ru' ? 'ИИ-анализ кожи:' : 'AI Skin Analysis:',
    s4SkinText: locale === 'ar' ? 'عند استخدام ميزة تحليل البشرة، يتم إرسال صورتك إلى OpenAI للتحليل. لا نحتفظ بالصور بعد اكتمال التحليل. يتم استخدام النتائج فقط لتقديم توصيات المنتجات.' : locale === 'ru' ? 'При использовании анализа кожи ваше фото отправляется в OpenAI для обработки. Мы не сохраняем фотографии после анализа. Результаты используются только для рекомендаций продуктов.' : 'When you use the skin analysis feature, your photo is sent to OpenAI for processing. We do not retain photos after analysis is complete. Results are used solely for product recommendations.',
    s4ChatLabel: locale === 'ar' ? 'مساعد الدردشة الذكي (Genie):' : locale === 'ru' ? 'ИИ-ассистент (Genie):' : 'AI Chat Assistant (Genie):',
    s4ChatText: locale === 'ar' ? 'محادثاتك مع المساعد الذكي لا يتم تخزينها أو ربطها بحسابك. كل جلسة مستقلة.' : locale === 'ru' ? 'Ваши разговоры с ИИ-ассистентом не сохраняются и не привязываются к аккаунту. Каждая сессия независима.' : 'Your conversations with the AI assistant are not stored or linked to your account. Each session is independent.',

    // 5. Google Auth
    s5Title: locale === 'ar' ? '5. تسجيل الدخول عبر Google' : locale === 'ru' ? '5. Вход через Google (OAuth)' : '5. Google Authentication (OAuth)',
    googleSignInLabel: locale === 'ar' ? 'تسجيل الدخول عبر Google:' : locale === 'ru' ? 'Вход через Google:' : 'Google Sign-In:',
    googleSignInText: locale === 'ar'
      ? 'عند تسجيل الدخول عبر Google، نستلم معلومات ملفك الأساسية (الاسم، البريد الإلكتروني، صورة الملف) من Google وفقًا لإعدادات الخصوصية في حسابك.'
      : locale === 'ru'
        ? 'При входе через Google мы получаем вашу основную информацию профиля (имя, email, фото) от Google в соответствии с настройками конфиденциальности вашего аккаунта.'
        : 'When you sign in with Google, we receive your basic profile information (name, email, profile picture) from Google according to your Google account privacy settings.',
    googleDataLabel: locale === 'ar' ? 'البيانات التي تتم مشاركتها:' : locale === 'ru' ? 'Передаваемые данные:' : 'Data Shared:',
    googleDataText: locale === 'ar'
      ? 'نستلم فقط المعلومات التي وافقت صراحة على مشاركتها أثناء عملية تسجيل الدخول. لا نصل إلى جهات اتصالك أو ملفاتك أو بيانات Google الأخرى.'
      : locale === 'ru'
        ? 'Мы получаем только информацию, на передачу которой вы явно согласились при входе. Мы не получаем доступ к вашим контактам, файлам или другим данным Google.'
        : 'We only receive information you explicitly consent to share during sign-in. We do not access your contacts, files, or other Google data.',

    // 6. Apple Auth
    s6Title: locale === 'ar' ? '6. تسجيل الدخول عبر Apple' : locale === 'ru' ? '6. Вход через Apple' : '6. Apple Sign‑In',
    appleSignInLabel: locale === 'ar' ? 'Sign in with Apple:' : locale === 'ru' ? 'Вход через Apple:' : 'Sign in with Apple:',
    appleSignInText: locale === 'ar'
      ? 'عند تسجيل الدخول عبر Apple، قد نستلم اسمك وعنوان بريدك الإلكتروني (حسب اختيارك). قد توفّر Apple بريدًا إلكترونيًا خاصًا (Private Relay) بدلًا من بريدك الحقيقي لحماية خصوصيتك.'
      : locale === 'ru'
        ? 'При входе через Apple мы можем получить ваше имя и email (по вашему выбору). Apple может предоставить частный email (Private Relay) вместо реального для защиты конфиденциальности.'
        : 'When you sign in with Apple, we may receive your name and email (depending on your choice). Apple may provide a private relay email instead of your real address to protect your privacy.',

    // 7. Payment Processing
    s7Title: locale === 'ar' ? '7. معالجة المدفوعات' : locale === 'ru' ? '7. Обработка платежей' : '7. Payment Processing',
    s7Text: locale === 'ar'
      ? 'نحن لا نخزّن بيانات بطاقتك المصرفية. جميع المدفوعات بالبطاقة تتم عبر Stripe، مزود خدمة دفع معتمد ومتوافق مع معايير PCI DSS. عند اختيار الدفع عند الاستلام، لا يتم جمع أي بيانات مالية.'
      : locale === 'ru'
        ? 'Мы не храним данные вашей банковской карты. Все карточные платежи обрабатываются через Stripe — сертифицированного платёжного провайдера, соответствующего стандарту PCI DSS. При оплате наложенным платежом финансовые данные не собираются.'
        : 'We do not store your card details. All card payments are processed through Stripe, a PCI DSS-compliant payment provider. When you choose Cash on Delivery, no financial data is collected.',
    s7Methods: locale === 'ar' ? 'طرق الدفع المتاحة: بطاقة ائتمان/خصم (Visa، Mastercard، Amex)، Apple Pay، Google Pay، والدفع عند الاستلام.' : locale === 'ru' ? 'Доступные способы оплаты: карта (Visa, Mastercard, Amex), Apple Pay, Google Pay и наложенный платёж.' : 'Available payment methods: Credit/debit card (Visa, Mastercard, Amex), Apple Pay, Google Pay, and Cash on Delivery.',

    // 8. Data Sharing
    s8Title: locale === 'ar' ? '8. مشاركة البيانات مع أطراف ثالثة' : locale === 'ru' ? '8. Передача данных третьим лицам' : '8. Data Sharing & Third Parties',
    s8Intro: locale === 'ar' ? 'لا نبيع معلوماتك الشخصية أبداً. قد نشارك بياناتك مع:' : locale === 'ru' ? 'Мы никогда не продаём вашу личную информацию. Мы можем передавать данные:' : 'We never sell your personal information. We may share your data with:',
    s8Items: locale === 'ar' ? [
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

    // 9. Cookies
    s9Title: locale === 'ar' ? '9. ملفات تعريف الارتباط والتتبع' : locale === 'ru' ? '9. Файлы cookie и отслеживание' : '9. Cookies & Tracking',
    s9Text: locale === 'ar'
      ? 'نستخدم ملفات تعريف الارتباط الأساسية للحفاظ على جلسة تسجيل الدخول وسلة التسوق وتفضيلات اللغة. لا نستخدم ملفات تعريف ارتباط للتتبع من أطراف ثالثة أو إعلانات مستهدفة.'
      : locale === 'ru'
        ? 'Мы используем только необходимые файлы cookie для поддержания сессии входа, корзины и языковых настроек. Мы не используем сторонние отслеживающие cookie или таргетированную рекламу.'
        : 'We use essential cookies to maintain your login session, shopping cart, and language preferences. We do not use third-party tracking cookies or targeted advertising.',

    // 10. Data Security
    s10Title: locale === 'ar' ? '10. أمن البيانات' : locale === 'ru' ? '10. Безопасность данных' : '10. Data Security',
    s10Text: locale === 'ar'
      ? 'نتخذ تدابير أمنية مناسبة لحماية بياناتك:'
      : locale === 'ru'
        ? 'Мы принимаем соответствующие меры безопасности для защиты ваших данных:'
        : 'We implement appropriate security measures to protect your data:',
    s10Items: locale === 'ar' ? [
      'تشفير جميع البيانات أثناء النقل باستخدام HTTPS/TLS',
      'كلمات المرور مشفرة ولا يمكن قراءتها',
      'بيانات الدفع تُعالج بواسطة Stripe المعتمد بمعايير PCI DSS',
      'حماية CSRF لجميع النماذج وطلبات API',
      'تحديد معدل الطلبات لمنع إساءة الاستخدام',
      'مراجعات أمنية دورية',
    ] : locale === 'ru' ? [
      'Шифрование всех данных при передаче через HTTPS/TLS',
      'Пароли хешируются и не могут быть прочитаны',
      'Платёжные данные обрабатываются через Stripe (PCI DSS)',
      'CSRF-защита для всех форм и API-запросов',
      'Ограничение частоты запросов для предотвращения злоупотреблений',
      'Регулярные проверки безопасности',
    ] : [
      'All data encrypted in transit via HTTPS/TLS',
      'Passwords are hashed and cannot be read back',
      'Payment data processed through PCI DSS-compliant Stripe',
      'CSRF protection on all forms and API requests',
      'Rate limiting to prevent abuse',
      'Regular security audits',
    ],

    // 11. Data Retention
    s11Title: locale === 'ar' ? '11. الاحتفاظ بالبيانات' : locale === 'ru' ? '11. Хранение данных' : '11. Data Retention',
    s11Text: locale === 'ar'
      ? 'نحتفظ ببياناتك الشخصية طالما حسابك نشط أو حسب الحاجة لتقديم خدماتنا. يتم الاحتفاظ ببيانات الطلبات لمدة 5 سنوات للامتثال للمتطلبات المحاسبية والضريبية في الإمارات. يمكنك طلب حذف حسابك في أي وقت عبر التواصل معنا — سيتم حذف بياناتك الشخصية خلال 30 يوماً، مع الاحتفاظ بسجلات المعاملات حسب ما يقتضيه القانون.'
      : locale === 'ru'
        ? 'Мы храним персональные данные, пока ваш аккаунт активен или пока это необходимо для предоставления услуг. Данные заказов хранятся 5 лет для соблюдения бухгалтерских и налоговых требований ОАЭ. Вы можете запросить удаление аккаунта в любое время — персональные данные будут удалены в течение 30 дней, за исключением записей о транзакциях, требуемых законом.'
        : 'We retain personal data as long as your account is active or as needed to provide our services. Order data is kept for 5 years to comply with UAE accounting and tax requirements. You can request account deletion at any time by contacting us — personal data will be removed within 30 days, except transaction records required by law.',

    // 12. Children's Privacy
    s12Title: locale === 'ar' ? '12. خصوصية الأطفال' : locale === 'ru' ? '12. Конфиденциальность детей' : "12. Children's Privacy",
    s12Text: locale === 'ar'
      ? 'خدماتنا غير موجهة للأطفال دون سن 16 عاماً. لا نجمع معلومات شخصية عن قصد من الأطفال. إذا علمنا أننا جمعنا بيانات طفل دون موافقة الوالدين، سنحذفها فوراً.'
      : locale === 'ru'
        ? 'Наши услуги не предназначены для детей младше 16 лет. Мы не собираем осознанно личную информацию детей. Если мы узнаем, что собрали данные ребёнка без согласия родителей, мы немедленно их удалим.'
        : 'Our services are not directed at children under 16. We do not knowingly collect personal information from children. If we learn we have collected data from a child without parental consent, we will delete it promptly.',

    // 13. Changes
    s13Title: locale === 'ar' ? '13. التغييرات على هذه السياسة' : locale === 'ru' ? '13. Изменения в политике' : '13. Changes to This Policy',
    s13Text: locale === 'ar'
      ? 'قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة مع تحديث تاريخ "آخر تحديث". للتغييرات الجوهرية، سنرسل إشعاراً عبر البريد الإلكتروني أو إشعار التطبيق.'
      : locale === 'ru'
        ? 'Мы можем периодически обновлять эту политику. Изменения публикуются на этой странице с обновлённой датой. О существенных изменениях мы сообщим по email или через уведомление в приложении.'
        : 'We may update this policy from time to time. Changes will be posted on this page with an updated date. For material changes, we will notify you by email or app notification.',

    // 14. Contact
    s14Title: locale === 'ar' ? '14. تواصل معنا' : locale === 'ru' ? '14. Свяжитесь с нами' : '14. Contact Us',
    contactText: locale === 'ar'
      ? 'إذا كانت لديك أي أسئلة حول سياسة الخصوصية أو ممارسات البيانات لدينا، أو إذا كنت ترغب في ممارسة حقوقك في الخصوصية، يرجى التواصل معنا:'
      : locale === 'ru'
        ? 'Если у вас есть вопросы о политике конфиденциальности, наших практиках обработки данных или вы хотите воспользоваться своими правами на конфиденциальность, свяжитесь с нами:'
        : 'If you have questions about this Privacy Policy, our data practices, or wish to exercise your privacy rights, please contact us:',

    backToHome: locale === 'ar' ? 'الرجوع للرئيسية' : locale === 'ru' ? 'Вернуться на главную' : 'Back to Home',
    home: locale === 'ar' ? 'الرئيسية' : locale === 'ru' ? 'Главная' : 'Home',
    back: locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account',
  }

  const handleBack = () => {
    if (fromProfile) {
      router.push(getLocalizedPath('/profile', locale))
    } else {
      router.push(getLocalizedPath('/products', locale))
    }
  }

  const renderContent = (compact: boolean) => {
    const headingClass = compact ? 'text-lg font-bold text-gray-900 mb-3' : 'text-2xl font-bold text-gray-900 mb-4'
    const textClass = compact ? 'text-sm text-gray-700 leading-relaxed' : 'text-gray-700 leading-relaxed'
    const sectionClass = compact ? 'mb-5' : 'border-t border-gray-200 pt-8'
    const listClass = compact ? 'text-sm text-gray-700' : 'text-gray-700'
    const rtl = isRTL ? 'text-right' : ''
    const calloutPad = compact ? 'p-4' : 'p-6'
    const calloutMb = compact ? 'mb-5' : 'mb-6'

    // Renders a label/description pair as a clearly separated row (divided list)
    const LabelRow = ({ label, text, divider }: { label: string; text: string; divider: boolean }) => (
      <div className={`${divider ? (isRTL ? 'border-t border-gray-200 pt-3 mt-3' : 'border-t border-gray-200 pt-3 mt-3') : ''} ${rtl}`}>
        <div className="font-semibold text-gray-900 mb-0.5">{label}</div>
        <div className={textClass}>{text}</div>
      </div>
    )

    return (
      <>
        {/* Last Updated — pill badge. Clock icon already conveys
            "last updated" so we show just the date, keeping the pill tight */}
        <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'} mb-4`}>
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 text-gray-600 px-2.5 py-1 text-xs font-medium"
            title={`${t.lastUpdatedLabel} ${lastUpdated}`}
          >
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="sr-only">{t.lastUpdatedLabel} </span>
            {lastUpdated}
          </span>
        </div>

        {/* Rights Highlight — uses side-specific full classes (avoid template-literal JIT pitfall) */}
        <div
          className={`bg-red-50 ${calloutPad} rounded-xl ${calloutMb} ${rtl} ${
            isRTL ? 'border-r-4 border-red-600' : 'border-l-4 border-red-600'
          }`}
        >
          <h2 className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-red-700 mb-2`}>{t.rightsTitle}</h2>
          <p className={textClass}>{t.rightsText}</p>
        </div>

        {/* 1. Personal Information — divided rows for scannability */}
        <div className={sectionClass}>
          <h2 className={`${headingClass} ${rtl}`}>{t.s1Title}</h2>
          <div className={`bg-gray-50 rounded-lg p-4 ${listClass}`}>
            <LabelRow label={t.accountLabel} text={t.accountText} divider={false} />
            <LabelRow label={t.profileLabel} text={t.profileText} divider={true} />
            <LabelRow label={t.orderLabel} text={t.orderText} divider={true} />
            <LabelRow label={t.deliveryLabel} text={t.deliveryText} divider={true} />
            <LabelRow label={t.usageLabel} text={t.usageText} divider={true} />
          </div>
        </div>

        {/* 2. How We Use Your Information */}
        <div className={sectionClass}>
          <h2 className={`${headingClass} ${rtl}`}>{t.s2Title}</h2>
          <ul className={`${listClass} ${rtl} list-disc ${isRTL ? 'pr-5' : 'pl-5'}`}>
            {t.s2Items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        {/* 3. Mobile Applications */}
        <div className={sectionClass}>
          <h2 className={`${headingClass} ${rtl}`}>{t.s3Title}</h2>
          <p className={`${textClass} mb-3 ${rtl}`}>{t.s3Intro}</p>
          <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${listClass}`}>
            <LabelRow label={t.s3DeviceLabel} text={t.s3DeviceText} divider={false} />
            <LabelRow label={t.s3PushLabel} text={t.s3PushText} divider={true} />
            <LabelRow label={t.s3BiometricLabel} text={t.s3BiometricText} divider={true} />
            <LabelRow label={t.s3CameraLabel} text={t.s3CameraText} divider={true} />
          </div>
          <div className={`mt-3 flex flex-wrap gap-3 ${rtl}`}>
            <a href="https://apps.apple.com/ae/app/genosys-uae/id6756648064" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:underline">
              <ExternalLink className="w-4 h-4" /> App Store (iOS)
            </a>
            <a href="https://play.google.com/store/apps/details?id=ae.genosys.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:underline">
              <ExternalLink className="w-4 h-4" /> Google Play (Android)
            </a>
          </div>
        </div>

        {/* 4. AI Features */}
        <div className={sectionClass}>
          <h2 className={`${headingClass} ${rtl}`}>{t.s4Title}</h2>
          <p className={`${textClass} mb-3 ${rtl}`}>{t.s4Text}</p>
          <div className={`bg-violet-50 border border-violet-200 rounded-lg p-4 ${listClass}`}>
            <LabelRow label={t.s4SkinLabel} text={t.s4SkinText} divider={false} />
            <LabelRow label={t.s4ChatLabel} text={t.s4ChatText} divider={true} />
          </div>
        </div>

        {/* 5. Google Auth */}
        <div className={sectionClass}>
          <h2 className={`${headingClass} ${rtl}`}>{t.s5Title}</h2>
          <div className={`bg-purple-50 border border-purple-200 rounded-lg p-4 ${listClass}`}>
            <LabelRow label={t.googleSignInLabel} text={t.googleSignInText} divider={false} />
            <LabelRow label={t.googleDataLabel} text={t.googleDataText} divider={true} />
            <div className={`mt-3 pt-3 border-t border-purple-200 flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <ExternalLink className="w-4 h-4 text-primary-600" />
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Google Privacy Policy</a>
            </div>
          </div>
        </div>

        {/* 6. Apple Auth */}
        <div className={sectionClass}>
          <h2 className={`${headingClass} ${rtl}`}>{t.s6Title}</h2>
          <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${listClass}`}>
            <LabelRow label={t.appleSignInLabel} text={t.appleSignInText} divider={false} />
            <div className={`mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <ExternalLink className="w-4 h-4 text-primary-600" />
              <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Apple Privacy Policy</a>
            </div>
          </div>
        </div>

        {/* 7. Payment Processing */}
        <div className={sectionClass}>
          <h2 className={`${headingClass} ${rtl}`}>{t.s7Title}</h2>
          <p className={`${textClass} mb-2 ${rtl}`}>{t.s7Text}</p>
          <p className={`${textClass} ${rtl}`}>{t.s7Methods}</p>
        </div>

        {/* 8. Data Sharing */}
        <div className={sectionClass}>
          <h2 className={`${headingClass} ${rtl}`}>{t.s8Title}</h2>
          <p className={`${textClass} mb-3 ${rtl}`}>{t.s8Intro}</p>
          <ul className={`${listClass} ${rtl} list-disc ${isRTL ? 'pr-5' : 'pl-5'}`}>
            {t.s8Items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        {/* 9. Cookies */}
        <div className={sectionClass}>
          <h2 className={`${headingClass} ${rtl}`}>{t.s9Title}</h2>
          <p className={`${textClass} ${rtl}`}>{t.s9Text}</p>
        </div>

        {/* 10. Data Security */}
        <div className={sectionClass}>
          <h2 className={`${headingClass} ${rtl}`}>{t.s10Title}</h2>
          <p className={`${textClass} mb-3 ${rtl}`}>{t.s10Text}</p>
          <ul className={`${listClass} ${rtl} list-disc ${isRTL ? 'pr-5' : 'pl-5'}`}>
            {t.s10Items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        {/* 11. Data Retention */}
        <div className={sectionClass}>
          <h2 className={`${headingClass} ${rtl}`}>{t.s11Title}</h2>
          <p className={`${textClass} ${rtl}`}>{t.s11Text}</p>
        </div>

        {/* 12. Children's Privacy */}
        <div className={sectionClass}>
          <h2 className={`${headingClass} ${rtl}`}>{t.s12Title}</h2>
          <p className={`${textClass} ${rtl}`}>{t.s12Text}</p>
        </div>

        {/* 13. Changes */}
        <div className={sectionClass}>
          <h2 className={`${headingClass} ${rtl}`}>{t.s13Title}</h2>
          <p className={`${textClass} ${rtl}`}>{t.s13Text}</p>
        </div>

        {/* 14. Contact */}
        <div className={sectionClass}>
          <h2 className={`${headingClass} ${rtl}`}>{t.s14Title}</h2>
          <p className={`${textClass} mb-3 ${rtl}`}>{t.contactText}</p>
          <div className={`bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-${compact ? '4' : '6'} space-y-3`}>
            <h3 className="font-bold text-gray-900">GENOSYS Middle East FZ-LLC</h3>
            <div className="space-y-2">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <a href="mailto:sales@genosys.ae" className="text-primary-600 hover:underline">sales@genosys.ae</a>
              </div>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <a href="tel:+971585487665" className="text-primary-600 hover:underline" dir="ltr">+971 58 548 76 65</a>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (isAppLikeMode) {
    return (
      <div className="min-h-screen bg-gray-50 pb-32" dir={dir}>
        {/* Unified nav header */}
        <div className={`sticky top-0 z-10 bg-white/95 backdrop-blur flex items-center justify-between px-5 py-4 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button onClick={handleBack} className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ArrowLeft className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} />
            <span className="text-base text-red-600">{t.back}</span>
          </button>
          <h1 className="text-base font-semibold text-gray-900">{t.title}</h1>
          <button onClick={() => router.push(getLocalizedPath('/profile', locale))} className="min-w-[80px] flex justify-end" aria-label="Profile">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">{userInitial.toUpperCase()}</span>
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
            </div>
          </button>
        </div>
        <div className="px-5 py-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            {renderContent(true)}
          </div>
          <div className="text-center mt-4 text-sm text-gray-400">
            <p>&copy; 2026 GENOSYS Middle East FZ-LLC</p>
          </div>
        </div>

        {/* Floating back-to-top — only shown after user has scrolled (long policy) */}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label={locale === 'ar' ? 'العودة إلى الأعلى' : locale === 'ru' ? 'Наверх' : 'Back to top'}
            className={`fixed bottom-24 ${isRTL ? 'left-4' : 'right-4'} z-40 w-11 h-11 rounded-full bg-gray-900/90 text-white shadow-lg backdrop-blur flex items-center justify-center active:scale-95 transition-transform`}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir={dir}>
      <BreadcrumbSchema
        items={[
          { name: t.home, url: getLocalizedPath('/', locale) },
          { name: t.title, url: getLocalizedPath('/privacy-policy', locale) },
        ]}
      />
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <Link
          href={getLocalizedPath('/', locale)}
          className={`inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors group ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`w-4 h-4 group-hover:-translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
          <span>{t.backToHome}</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className={`flex items-center gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="bg-primary-100 p-4 rounded-xl">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600 mt-1">{t.subtitle}</p>
            </div>
          </div>
          <p className={`text-gray-600 text-lg ${isRTL ? 'text-right' : ''}`}>
            {t.lastUpdatedLabel} <span className="font-semibold">{lastUpdated}</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          {renderContent(false)}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 GENOSYS Middle East FZ-LLC. {locale === 'ar' ? 'جميع الحقوق محفوظة.' : locale === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}</p>
        </div>
      </div>
    </div>
  )
}
