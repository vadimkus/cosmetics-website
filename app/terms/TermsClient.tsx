'use client'

import Link from 'next/link'
import { ArrowLeft, FileText, Mail, Phone, MapPin } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import PWAPageWrapper from '@/components/PWAPageWrapper'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'

interface SectionProps {
  title: string
  children: React.ReactNode
  isRTL?: boolean
}

function Section({ title, children, isRTL }: SectionProps) {
  return (
    <div className="border-b border-gray-100 py-6">
      <h2 className={`text-xl font-bold text-gray-900 mb-4 ${isRTL ? 'text-right' : ''}`}>{title}</h2>
      {children}
    </div>
  )
}

export default function TermsClient() {
  const { locale, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()
  const isRTL = dir === 'rtl'
  
  // Date translations
  const lastUpdated = locale === 'ar' ? '11 ديسمبر 2025' : locale === 'ru' ? '11 декабря 2025' : 'December 11, 2025'
  
  // All translations organized by section
  const translations = {
    title: locale === 'ar' ? 'الشروط والأحكام' : locale === 'ru' ? 'Условия использования' : 'Terms & Conditions',
    lastUpdatedLabel: locale === 'ar' ? 'آخر تحديث:' : locale === 'ru' ? 'Последнее обновление:' : 'Last updated:',
    backToHome: locale === 'ar' ? 'الرجوع للرئيسية' : locale === 'ru' ? 'Вернуться на главную' : 'Back to Home',
    home: locale === 'ar' ? 'الرئيسية' : locale === 'ru' ? 'Главная' : 'Home',
    
    // Section: Agreement
    agreementTitle: locale === 'ar' ? 'الموافقة على الشروط' : locale === 'ru' ? 'Соглашение с условиями' : 'Agreement to Terms',
    agreementText: locale === 'ar' 
      ? 'من خلال الوصول إلى تطبيق Genosys واستخدامه، فإنك تقرّ وتوافق على الالتزام بشروط وأحكام هذه الاتفاقية. إذا لم توافق على الالتزام بما ورد أعلاه، فيرجى عدم استخدام هذه الخدمة.'
      : locale === 'ru' 
        ? 'Получая доступ к приложению Genosys и используя его, вы принимаете и соглашаетесь соблюдать условия и положения данного соглашения. Если вы не согласны с вышеизложенным, пожалуйста, не используйте этот сервис.'
        : 'By accessing and using the Genosys application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
    
    // Section: Use License
    useLicenseTitle: locale === 'ar' ? 'ترخيص الاستخدام' : locale === 'ru' ? 'Лицензия на использование' : 'Use License',
    useLicenseText: locale === 'ar' 
      ? 'يُسمح لك باستخدام تطبيق Genosys مؤقتًا للاستخدام الشخصي وغير التجاري فقط. هذا ترخيص استخدام وليس نقل ملكية، وبموجب هذا الترخيص لا يجوز لك:'
      : locale === 'ru' 
        ? 'Разрешается временно использовать приложение Genosys только для личного некоммерческого просмотра. Это лицензия на использование, а не передача права собственности, и по этой лицензии вы не можете:'
        : 'Permission is granted to temporarily use the Genosys application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:',
    useLicenseB1: locale === 'ar' ? 'تعديل المواد أو نسخها' : locale === 'ru' ? 'Модифицировать или копировать материалы' : 'Modify or copy the materials',
    useLicenseB2: locale === 'ar' ? 'استخدام المواد لأغراض تجارية أو للعرض العام' : locale === 'ru' ? 'Использовать материалы в коммерческих целях или для публичного показа' : 'Use the materials for commercial purposes or public display',
    useLicenseB3: locale === 'ar' ? 'محاولة فك التجميع أو الهندسة العكسية لأي برنامج' : locale === 'ru' ? 'Пытаться декомпилировать или проводить обратную разработку программного обеспечения' : 'Attempt to decompile or reverse engineer any software',
    useLicenseB4: locale === 'ar' ? 'إزالة أي إشعارات حقوق نشر أو ملكية' : locale === 'ru' ? 'Удалять любые уведомления об авторских правах или собственности' : 'Remove any copyright or proprietary notations',
    
    // Section: Account Terms
    accountTitle: locale === 'ar' ? 'شروط الحساب' : locale === 'ru' ? 'Условия аккаунта' : 'Account Terms',
    accountText: locale === 'ar' 
      ? 'عند إنشاء حساب لدينا، يجب عليك تقديم معلومات دقيقة وكاملة ومحدّثة في جميع الأوقات.'
      : locale === 'ru' 
        ? 'При создании аккаунта у нас вы должны предоставлять точную, полную и актуальную информацию в любое время.'
        : 'When you create an account with us, you must provide information that is accurate, complete, and current at all times.',
    accountB1: locale === 'ar' ? 'أنت مسؤول عن حماية كلمة المرور الخاصة بك' : locale === 'ru' ? 'Вы несете ответственность за сохранность своего пароля' : 'You are responsible for safeguarding your password',
    accountB2: locale === 'ar' ? 'لا يجوز مشاركة حسابك مع الآخرين' : locale === 'ru' ? 'Вы не должны передавать свой аккаунт другим' : 'You must not share your account with others',
    accountB3: locale === 'ar' ? 'يجب إخطارنا فورًا بأي استخدام غير مصرح به' : locale === 'ru' ? 'Вы должны немедленно уведомить нас о любом несанкционированном использовании' : 'You must notify us immediately of any unauthorized use',
    accountB4: locale === 'ar' ? 'نحتفظ بالحق في إنهاء الحسابات التي تنتهك هذه الشروط' : locale === 'ru' ? 'Мы оставляем за собой право закрывать аккаунты, нарушающие эти условия' : 'We reserve the right to terminate accounts that violate these terms',
    
    // Section: Products
    productsTitle: locale === 'ar' ? 'المنتجات والخدمات' : locale === 'ru' ? 'Продукты и услуги' : 'Products and Services',
    productsText: locale === 'ar' 
      ? 'جميع المنتجات خاضعة للتوفر. نحتفظ بالحق في إيقاف أي منتج في أي وقت.'
      : locale === 'ru' 
        ? 'Все продукты доступны при наличии. Мы оставляем за собой право прекратить продажу любого продукта в любое время.'
        : 'All products are subject to availability. We reserve the right to discontinue any product at any time.',
    productsB1: locale === 'ar' ? 'قد تتغير أوصاف المنتجات والأسعار دون إشعار مسبق' : locale === 'ru' ? 'Описания и цены продуктов могут изменяться без уведомления' : 'Product descriptions and prices are subject to change without notice',
    productsB2: locale === 'ar' ? 'نبذل قصارى جهدنا لعرض ألوان وصور دقيقة' : locale === 'ru' ? 'Мы прилагаем все усилия для точного отображения цветов и изображений' : 'We make every effort to display accurate colors and images',
    productsB3: locale === 'ar' ? 'قد تختلف نتائج منتجات العناية بالبشرة من شخص لآخر' : locale === 'ru' ? 'Результаты от средств по уходу за кожей могут варьироваться индивидуально' : 'Results from skincare products may vary by individual',
    productsB4: locale === 'ar' ? 'يوصى باستشارة مختص للحالات الحساسة' : locale === 'ru' ? 'Рекомендуется консультация специалиста при чувствительной коже' : 'Professional consultation is recommended for sensitive skin conditions',
    
    // Section: Orders
    ordersTitle: locale === 'ar' ? 'الطلبات والدفع' : locale === 'ru' ? 'Заказы и оплата' : 'Orders and Payment',
    ordersText: locale === 'ar' 
      ? 'عند تقديم طلب، فإنك توافق على تقديم معلومات شراء حديثة وكاملة ودقيقة.'
      : locale === 'ru' 
        ? 'Размещая заказ, вы соглашаетесь предоставить актуальную, полную и точную информацию о покупке.'
        : 'By placing an order, you agree to provide current, complete, and accurate purchase information.',
    ordersB1: locale === 'ar' ? 'جميع الأسعار بالدرهم الإماراتي (AED)' : locale === 'ru' ? 'Все цены указаны в дирхамах ОАЭ (AED)' : 'All prices are in UAE Dirhams (AED)',
    ordersB2: locale === 'ar' ? 'الدفع مطلوب عند تقديم الطلب' : locale === 'ru' ? 'Оплата требуется при оформлении заказа' : 'Payment is required at the time of order',
    ordersB3: locale === 'ar' ? 'نقبل بطاقات الدفع الرئيسية وطرق الدفع المعتمدة' : locale === 'ru' ? 'Мы принимаем основные кредитные карты и одобренные способы оплаты' : 'We accept major credit cards and approved payment methods',
    ordersB4: locale === 'ar' ? 'الطلبات خاضعة لتوفر المنتج' : locale === 'ru' ? 'Заказы зависят от наличия товара' : 'Orders are subject to product availability',
    ordersB5: locale === 'ar' ? 'نحتفظ بالحق في رفض أو إلغاء أي طلب' : locale === 'ru' ? 'Мы оставляем за собой право отклонить или отменить любой заказ' : 'We reserve the right to refuse or cancel any order',
    
    // Section: Shipping
    shippingTitle: locale === 'ar' ? 'الشحن والتسليم' : locale === 'ru' ? 'Доставка' : 'Shipping and Delivery',
    shippingText: locale === 'ar' 
      ? 'نقوم حاليًا بالشحن داخل دولة الإمارات العربية المتحدة فقط.'
      : locale === 'ru' 
        ? 'В настоящее время мы осуществляем доставку только в пределах ОАЭ.'
        : 'We currently ship within the United Arab Emirates only.',
    shippingB1: locale === 'ar' ? 'أوقات التسليم تقديرية وليست مضمونة' : locale === 'ru' ? 'Сроки доставки являются ориентировочными и не гарантируются' : 'Delivery times are estimates and not guaranteed',
    shippingB2: locale === 'ar' ? 'تنتقل مسؤولية الفقدان إليك عند التسليم' : locale === 'ru' ? 'Риск потери переходит к вам при доставке' : 'Risk of loss transfers to you upon delivery',
    shippingB3: locale === 'ar' ? 'قد تنطبق رسوم إضافية للمناطق البعيدة' : locale === 'ru' ? 'Могут применяться дополнительные сборы для отдаленных районов' : 'Additional charges may apply for remote areas',
    shippingB4: locale === 'ar' ? 'يجب تواجد شخص لاستلام الشحنة' : locale === 'ru' ? 'Кто-то должен быть на месте для получения посылки' : 'Someone must be available to receive the package',
    
    // Section: Returns
    returnsTitle: locale === 'ar' ? 'الاستبدال والإرجاع' : locale === 'ru' ? 'Возврат и обмен' : 'Returns and Exchanges',
    returnsText: locale === 'ar' 
      ? 'نقبل الإرجاع والاستبدال خلال 7 أيام من تاريخ التسليم للمنتجات غير المفتوحة وفي عبوتها الأصلية. يرجى التواصل معنا لبدء عملية الإرجاع أو الاستبدال.'
      : locale === 'ru' 
        ? 'Мы принимаем возврат и обмен в течение 7 дней с момента доставки для невскрытых товаров в оригинальной упаковке. Пожалуйста, свяжитесь с нами, чтобы начать процесс возврата или обмена.'
        : 'We accept returns and exchanges within 7 days of delivery for unopened products in their original packaging. Please contact us to initiate a return or exchange.',
    
    // Section: Disclaimers
    disclaimersTitle: locale === 'ar' ? 'إخلاء المسؤولية' : locale === 'ru' ? 'Отказ от ответственности' : 'Disclaimers',
    disclaimersP1: locale === 'ar' 
      ? 'يتم تقديم المعلومات في هذا التطبيق على أساس «كما هي». وإلى أقصى حد يسمح به القانون، تخلي هذه الشركة مسؤوليتها عن جميع الإقرارات والضمانات والشروط المتعلقة بالتطبيق واستخدامه.'
      : locale === 'ru' 
        ? 'Информация в этом приложении предоставляется «как есть». В максимальной степени, разрешенной законом, компания отказывается от всех заявлений, гарантий и условий, связанных с приложением и его использованием.'
        : 'The information on this application is provided on an "as is" basis. To the fullest extent permitted by law, this company excludes all representations, warranties, and conditions relating to our app and the use of this app.',
    disclaimersP2: locale === 'ar' 
      ? 'قد تختلف النتائج الفردية لمنتجات العناية بالبشرة. استشر مختصًا صحيًا قبل الاستخدام إذا كانت لديك حالات طبية أو حساسية جلدية.'
      : locale === 'ru' 
        ? 'Индивидуальные результаты от средств по уходу за кожей могут различаться. Проконсультируйтесь с врачом перед использованием, если у вас есть заболевания или чувствительность кожи.'
        : 'Individual results from skincare products may vary. Consult with a healthcare professional before use if you have any medical conditions or skin sensitivities.',
    
    // Section: Governing Law
    governingLawTitle: locale === 'ar' ? 'القانون الحاكم' : locale === 'ru' ? 'Применимое право' : 'Governing Law',
    governingLawText: locale === 'ar' 
      ? 'تخضع هذه الشروط والأحكام وتُفسَّر وفقًا لقوانين دولة الإمارات العربية المتحدة، وتخضع للاختصاص القضائي الحصري لمحاكم دبي، الإمارات العربية المتحدة.'
      : locale === 'ru' 
        ? 'Настоящие условия и положения регулируются и толкуются в соответствии с законодательством Объединенных Арабских Эмиратов, и вы безоговорочно подчиняетесь исключительной юрисдикции судов Дубая, ОАЭ.'
        : 'These terms and conditions are governed by and construed in accordance with the laws of the United Arab Emirates, and you irrevocably submit to the exclusive jurisdiction of the courts in Dubai, UAE.',
    
    // Section: Contact
    contactTitle: locale === 'ar' ? 'تواصل معنا' : locale === 'ru' ? 'Свяжитесь с нами' : 'Contact Us',
    contactText: locale === 'ar' 
      ? 'إذا كانت لديك أي أسئلة حول الشروط والأحكام، يرجى التواصل معنا:'
      : locale === 'ru' 
        ? 'Если у вас есть вопросы об условиях и положениях, пожалуйста, свяжитесь с нами:'
        : 'If you have any questions about these Terms & Conditions, please contact us:',
    emailLabel: locale === 'ar' ? 'البريد الإلكتروني' : locale === 'ru' ? 'Email' : 'Email',
    whatsappLabel: locale === 'ar' ? 'واتساب' : locale === 'ru' ? 'WhatsApp' : 'WhatsApp',
    addressLabel: locale === 'ar' ? 'العنوان' : locale === 'ru' ? 'Адрес' : 'Address',
    addressValue: locale === 'ar' ? 'دبي، الإمارات العربية المتحدة' : locale === 'ru' ? 'Дубай, ОАЭ' : 'Dubai, UAE',
  }

  const content = (
    <div className={`min-h-screen bg-white ${isPWA ? 'pb-32' : ''}`} dir={dir}>
      <BreadcrumbSchema
        items={[
          { name: translations.home, url: getLocalizedPath('/', locale) },
          { name: translations.title, url: getLocalizedPath('/terms', locale) },
        ]}
      />

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Back Button - Hide in PWA mode */}
        {!isPWA && (
          <Link 
            href={getLocalizedPath('/', locale)}
            className={`inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors group ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`w-4 h-4 group-hover:-translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
            <span>{translations.backToHome}</span>
          </Link>
        )}

        {/* Header */}
        <div className={`flex items-center gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="bg-primary-100 p-3 rounded-xl">
            <FileText className="w-6 h-6 text-primary-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{translations.title}</h1>
        </div>

        {/* Last Updated */}
        <div className={`bg-gray-50 rounded-lg px-4 py-3 mb-8 ${isRTL ? 'text-right' : ''}`}>
          <p className="text-sm text-gray-500 italic">
            {translations.lastUpdatedLabel} {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-0">
          {/* Agreement to Terms */}
          <Section title={translations.agreementTitle} isRTL={isRTL}>
            <p className={`text-gray-700 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
              {translations.agreementText}
            </p>
          </Section>

          {/* Use License */}
          <Section title={translations.useLicenseTitle} isRTL={isRTL}>
            <p className={`text-gray-700 leading-relaxed mb-3 ${isRTL ? 'text-right' : ''}`}>
              {translations.useLicenseText}
            </p>
            <ul className={`space-y-2 ${isRTL ? 'text-right' : ''}`}>
              {[translations.useLicenseB1, translations.useLicenseB2, translations.useLicenseB3, translations.useLicenseB4].map((item, i) => (
                <li key={i} className={`text-gray-700 flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-red-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Account Terms */}
          <Section title={translations.accountTitle} isRTL={isRTL}>
            <p className={`text-gray-700 leading-relaxed mb-3 ${isRTL ? 'text-right' : ''}`}>
              {translations.accountText}
            </p>
            <ul className={`space-y-2 ${isRTL ? 'text-right' : ''}`}>
              {[translations.accountB1, translations.accountB2, translations.accountB3, translations.accountB4].map((item, i) => (
                <li key={i} className={`text-gray-700 flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-red-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Products and Services */}
          <Section title={translations.productsTitle} isRTL={isRTL}>
            <p className={`text-gray-700 leading-relaxed mb-3 ${isRTL ? 'text-right' : ''}`}>
              {translations.productsText}
            </p>
            <ul className={`space-y-2 ${isRTL ? 'text-right' : ''}`}>
              {[translations.productsB1, translations.productsB2, translations.productsB3, translations.productsB4].map((item, i) => (
                <li key={i} className={`text-gray-700 flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-red-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Orders and Payment */}
          <Section title={translations.ordersTitle} isRTL={isRTL}>
            <p className={`text-gray-700 leading-relaxed mb-3 ${isRTL ? 'text-right' : ''}`}>
              {translations.ordersText}
            </p>
            <ul className={`space-y-2 ${isRTL ? 'text-right' : ''}`}>
              {[translations.ordersB1, translations.ordersB2, translations.ordersB3, translations.ordersB4, translations.ordersB5].map((item, i) => (
                <li key={i} className={`text-gray-700 flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-red-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Shipping and Delivery */}
          <Section title={translations.shippingTitle} isRTL={isRTL}>
            <p className={`text-gray-700 leading-relaxed mb-3 ${isRTL ? 'text-right' : ''}`}>
              {translations.shippingText}
            </p>
            <ul className={`space-y-2 ${isRTL ? 'text-right' : ''}`}>
              {[translations.shippingB1, translations.shippingB2, translations.shippingB3, translations.shippingB4].map((item, i) => (
                <li key={i} className={`text-gray-700 flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-red-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Returns and Exchanges */}
          <Section title={translations.returnsTitle} isRTL={isRTL}>
            <p className={`text-gray-700 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
              {translations.returnsText}
            </p>
          </Section>

          {/* Disclaimers */}
          <Section title={translations.disclaimersTitle} isRTL={isRTL}>
            <p className={`text-gray-700 leading-relaxed mb-3 ${isRTL ? 'text-right' : ''}`}>
              {translations.disclaimersP1}
            </p>
            <div className={`bg-amber-50 border border-amber-200 rounded-lg p-4 ${isRTL ? 'text-right' : ''}`}>
              <p className="text-amber-800">
                {translations.disclaimersP2}
              </p>
            </div>
          </Section>

          {/* Governing Law */}
          <Section title={translations.governingLawTitle} isRTL={isRTL}>
            <p className={`text-gray-700 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
              {translations.governingLawText}
            </p>
          </Section>

          {/* Contact Us */}
          <Section title={translations.contactTitle} isRTL={isRTL}>
            <p className={`text-gray-700 leading-relaxed mb-4 ${isRTL ? 'text-right' : ''}`}>
              {translations.contactText}
            </p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className={isRTL ? 'text-right' : ''}>
                  <span className="text-sm text-gray-500">{translations.emailLabel}:</span>{' '}
                  <a href="mailto:sales@genosys.ae" className="text-red-600 hover:underline font-medium">
                    sales@genosys.ae
                  </a>
                </div>
              </div>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className={isRTL ? 'text-right' : ''}>
                  <span className="text-sm text-gray-500">{translations.whatsappLabel}:</span>{' '}
                  <a href="tel:+971585487665" className="text-red-600 hover:underline font-medium" dir="ltr">
                    +971 58 548 76 65
                  </a>
                </div>
              </div>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className={isRTL ? 'text-right' : ''}>
                  <span className="text-sm text-gray-500">{translations.addressLabel}:</span>{' '}
                  <span className="text-gray-700 font-medium">{translations.addressValue}</span>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className={`mt-8 text-center text-sm text-gray-500 ${isRTL ? 'text-center' : ''}`}>
          <p>© 2025 GENOSYS Middle East FZ-LLC</p>
        </div>
      </div>
    </div>
  )

  // Wrap with PWAPageWrapper when in PWA mode
  if (isClient && isPWA) {
    return (
      <PWAPageWrapper 
        title={translations.title}
        icon={<FileText className="w-5 h-5 text-red-600" />}
      >
        {content}
      </PWAPageWrapper>
    )
  }

  return content
}

