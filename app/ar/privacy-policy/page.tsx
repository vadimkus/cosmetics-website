import Link from 'next/link'
import { ArrowRight, Shield, Mail, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية - GENOSYS Middle East FZ-LLC | حماية البيانات وحقوقك',
  description: 'اقرأ سياسة الخصوصية الشاملة لدينا. تعرف على كيفية حماية GENOSYS Middle East FZ-LLC لبياناتك الشخصية ومعالجة المعلومات واحترام حقوق الخصوصية الخاصة بك في الإمارات العربية المتحدة.',
  keywords: [
    'سياسة الخصوصية',
    'حماية البيانات',
    'المعلومات الشخصية',
    'حقوق الخصوصية',
    'أمن البيانات',
    'خصوصية GENOSYS'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'سياسة الخصوصية - GENOSYS Middle East FZ-LLC',
    description: 'تعرف على كيفية حماية GENOSYS Middle East FZ-LLC لبياناتك الشخصية واحترام حقوق الخصوصية الخاصة بك.',
    type: 'website',
    url: 'https://genosys.ae/ar/privacy-policy',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'ar_AE',
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/privacy-policy',
    languages: {
      'en': 'https://genosys.ae/privacy-policy',
      'ar': 'https://genosys.ae/ar/privacy-policy',
      'ru': 'https://genosys.ae/ru/privacy-policy',
    },
  },
}

export default function PrivacyPolicyPageArabic() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'الرئيسية', url: 'https://genosys.ae/ar' },
          { name: 'سياسة الخصوصية', url: 'https://genosys.ae/ar/privacy-policy' },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
          {/* Back Button */}
          <Link 
            href="/ar"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors group"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <span>العودة إلى الرئيسية</span>
          </Link>

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary-100 p-4 rounded-xl">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">سياسة الخصوصية</h1>
                <p className="text-gray-600 mt-1">بياناتك، حقوقك</p>
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              آخر تحديث: <span className="font-semibold">14 ديسمبر 2024</span>
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
            {/* Introduction */}
            <section>
              <p className="text-lg text-gray-700 leading-relaxed">
                في <strong className="text-primary-600">GENOSYS Middle East FZ-LLC</strong> (المشار إليها فيما يلي باسم "الشركة")، نحن ملتزمون بحماية خصوصيتك وضمان أمن معلوماتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وتخزين وحماية بياناتك عند استخدام موقعنا الإلكتروني وخدماتنا.
              </p>
            </section>

            {/* Section 1 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                المعلومات الشخصية التي نجمعها
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed mr-10">
                <p>
                  نقوم بجمع ومعالجة الأنواع التالية من المعلومات الشخصية لتزويدك بخدماتنا:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li><strong>معلومات الحساب:</strong> الاسم وعنوان البريد الإلكتروني ورقم الهاتف وعنوان الفوترة والشحن</li>
                  <li><strong>بيانات المصادقة:</strong> بيانات اعتماد تسجيل الدخول وكلمة المرور (مشفرة) ورموز المصادقة</li>
                  <li><strong>معلومات الطلب:</strong> سجل الشراء وتفاصيل الطلب ومعلومات الدفع (تتم معالجتها بشكل آمن عبر Stripe)</li>
                  <li><strong>بيانات الملف الشخصي:</strong> صورة الملف الشخصي وتاريخ الميلاد وتفضيلات العملاء</li>
                  <li><strong>بيانات الاتصال:</strong> تقديمات نموذج الاتصال واستفسارات دعم العملاء والمراسلات عبر البريد الإلكتروني</li>
                  <li><strong>البيانات التقنية:</strong> عنوان IP ونوع المتصفح ومعلومات الجهاز وملفات تعريف الارتباط وتحليلات الاستخدام</li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <h3 className="font-bold text-gray-900 mb-2">1.1. طرق المصادقة</h3>
                  <p className="mb-2">نقدم ثلاث طرق آمنة للمصادقة:</p>
                  <ul className="list-disc list-inside space-y-1 mr-4">
                    <li><strong>مصادقة البريد الإلكتروني/كلمة المرور:</strong> يتم تشفير كلمة المرور الخاصة بك وتخزينها بشكل آمن</li>
                    <li><strong>Google OAuth 2.0:</strong> تسجيل الدخول باستخدام حساب Google الخاص بك للوصول الأسرع والأكثر أماناً</li>
                    <li><strong>تسجيل الدخول باستخدام Apple:</strong> استخدم Apple ID الخاص بك للمصادقة الآمنة على أجهزة iOS</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                  <h3 className="font-bold text-gray-900 mb-2">1.2. مصادقة Google</h3>
                  <p className="mb-2">عندما تختار تسجيل الدخول باستخدام Google، نقوم بجمع:</p>
                  <ul className="list-disc list-inside space-y-1 mr-4">
                    <li>عنوان بريدك الإلكتروني في حساب Google</li>
                    <li>اسمك الكامل من ملفك الشخصي على Google</li>
                    <li>صورة ملفك الشخصي على Google (اختياري)</li>
                  </ul>
                  <p className="mt-3 text-sm">
                    <strong>مهم:</strong> لا نقوم بتخزين كلمة مرور Google الخاصة بك. تتم معالجة المصادقة بشكل آمن بواسطة Google. يمكنك مراجعة سياسة الخصوصية الخاصة بـ Google على{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      https://policies.google.com/privacy
                    </a>
                  </p>
                  <p className="mt-2 text-sm">
                    يتم استخدام بيانات Google الخاصة بك فقط للمصادقة على الحساب وإنشاء الملف الشخصي. لا نشارك معلومات Google الخاصة بك مع أطراف ثالثة أبداً. يمكنك إلغاء ربط حساب Google الخاص بك في أي وقت من إعدادات ملفك الشخصي.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                  <h3 className="font-bold text-gray-900 mb-2">1.3. تسجيل الدخول باستخدام Apple</h3>
                  <p className="mb-2">عندما تستخدم تسجيل الدخول باستخدام Apple، نقوم بجمع:</p>
                  <ul className="list-disc list-inside space-y-1 mr-4">
                    <li>عنوان بريدك الإلكتروني في Apple ID (أو بريد إلكتروني خاص إذا اخترت إخفاء بريدك الإلكتروني)</li>
                    <li>اسمك الكامل من Apple ID الخاص بك (إذا تم توفيره)</li>
                  </ul>
                  <p className="mt-3 text-sm">
                    <strong>مهم:</strong> لا نقوم بتخزين كلمة مرور Apple ID الخاصة بك. تتم معالجة المصادقة بشكل آمن بواسطة Apple. يوفر تسجيل الدخول باستخدام Apple من Apple ميزات خصوصية إضافية، بما في ذلك خيار إخفاء عنوان بريدك الإلكتروني باستخدام خدمة ترحيل البريد الإلكتروني الخاصة من Apple. يمكنك مراجعة سياسة الخصوصية الخاصة بـ Apple على{' '}
                    <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      https://www.apple.com/legal/privacy/
                    </a>
                  </p>
                  <p className="mt-2 text-sm">
                    يتم استخدام بيانات Apple ID الخاصة بك فقط للمصادقة على الحساب وإنشاء الملف الشخصي. لا نشارك معلومات Apple الخاصة بك مع أطراف ثالثة أبداً. يمكنك إدارة إعدادات تسجيل الدخول باستخدام Apple مباشرةً من خلال إعدادات حساب Apple ID الخاص بك أو إلغاء ربط حساب Apple الخاص بك من إعدادات ملفك الشخصي.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                كيفية استخدام معلوماتك
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed mr-10">
                <p>نقوم بمعالجة معلوماتك الشخصية للأغراض التالية:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li><strong>إدارة الحساب:</strong> إنشاء وإدارة حساب العميل الخاص بك والمصادقة والملف الشخصي</li>
                  <li><strong>معالجة الطلبات:</strong> معالجة طلباتك وإدارة المدفوعات وترتيب التسليم</li>
                  <li><strong>خدمة العملاء:</strong> الرد على استفساراتك وتقديم الدعم وحل المشكلات</li>
                  <li><strong>اتصالات التسويق:</strong> إرسال رسائل بريد إلكتروني ترويجية وعروض خاصة وتحديثات المنتج (بموافقتك)</li>
                  <li><strong>تحسين الموقع:</strong> تحليل أنماط الاستخدام لتحسين موقعنا ومنتجاتنا وخدماتنا</li>
                  <li><strong>الأمان:</strong> الحماية من الاحتيال والوصول غير المصرح به والتهديدات الأمنية الأخرى</li>
                  <li><strong>الامتثال القانوني:</strong> الوفاء بالتزاماتنا القانونية وإنفاذ شروط الخدمة الخاصة بنا</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                تخزين البيانات والأمان
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed mr-10">
                <p>نحن نأخذ أمن البيانات على محمل الجد ونطبق تدابير أمنية متوافقة مع معايير الصناعة:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li><strong>التشفير:</strong> يتم تشفير جميع البيانات الحساسة باستخدام تقنية SSL/TLS</li>
                  <li><strong>التخزين الآمن:</strong> يتم تخزين بياناتك على خوادم آمنة ذات وصول مقيد</li>
                  <li><strong>حماية كلمة المرور:</strong> يتم تجزئة كلمات المرور وتشفيرها باستخدام bcrypt</li>
                  <li><strong>أمان الدفع:</strong> تتم معالجة جميع المدفوعات بواسطة Stripe، معالج دفع متوافق مع PCI DSS</li>
                  <li><strong>عمليات التدقيق المنتظمة:</strong> نجري عمليات تدقيق وتحديثات أمنية منتظمة</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                الاحتفاظ بالبيانات
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed mr-10">
                <p>نحتفظ بمعلوماتك الشخصية للفترات التالية:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li><strong>بيانات الحساب:</strong> يتم الاحتفاظ بها طالما كان حسابك نشطاً، بالإضافة إلى 3 سنوات بعد حذف الحساب (للامتثال القانوني)</li>
                  <li><strong>سجل الطلبات:</strong> يتم الاحتفاظ به لمدة 7 سنوات (متطلبات حفظ السجلات التجارية في الإمارات)</li>
                  <li><strong>بيانات التسويق:</strong> يتم الاحتفاظ بها حتى تسحب الموافقة أو تلغي الاشتراك</li>
                  <li><strong>السجلات التقنية:</strong> يتم الاحتفاظ بها لمدة 90 يوماً لأغراض الأمن واستكشاف الأخطاء وإصلاحها</li>
                </ul>
                <p className="mt-4">
                  يمكنك طلب حذف بياناتك في أي وقت عن طريق الاتصال بنا أو حذف حسابك من خلال إعدادات ملفك الشخصي.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                حقوق الخصوصية الخاصة بك
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed mr-10">
                <p>لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li><strong>الحق في الوصول:</strong> طلب نسخة من بياناتك الشخصية</li>
                  <li><strong>الحق في التصحيح:</strong> تصحيح البيانات غير الدقيقة أو غير الكاملة</li>
                  <li><strong>الحق في المحو:</strong> طلب حذف بياناتك الشخصية</li>
                  <li><strong>الحق في التقييد:</strong> تحديد كيفية استخدام بياناتك</li>
                  <li><strong>الحق في نقل البيانات:</strong> تلقي بياناتك بتنسيق منظم وقابل للقراءة آلياً</li>
                  <li><strong>الحق في الاعتراض:</strong> الاعتراض على معالجة بياناتك لأغراض التسويق</li>
                  <li><strong>الحق في سحب الموافقة:</strong> سحب الموافقة في أي وقت (دون التأثير على المعالجة السابقة)</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
                ملفات تعريف الارتباط والتتبع
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed mr-10">
                <p>نستخدم ملفات تعريف الارتباط والتقنيات المماثلة من أجل:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>تذكر حالة تسجيل الدخول والتفضيلات الخاصة بك</li>
                  <li>تحليل حركة المرور على الموقع وسلوك المستخدم</li>
                  <li>تقديم محتوى وتوصيات مخصصة</li>
                  <li>قياس فعالية حملاتنا التسويقية</li>
                </ul>
                <p className="mt-4">
                  يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح. ومع ذلك، قد يؤثر تعطيل ملفات تعريف الارتباط على وظائف موقعنا.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
                خدمات الطرف الثالث
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed mr-10">
                <p>نعمل مع مقدمي خدمات موثوقين من الطرف الثالث:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li><strong>Stripe:</strong> معالجة الدفع (متوافق مع PCI DSS)</li>
                  <li><strong>Google OAuth:</strong> خدمات المصادقة</li>
                  <li><strong>Vercel:</strong> استضافة الموقع والبنية التحتية</li>
                  <li><strong>مزودو خدمة البريد الإلكتروني:</strong> رسائل البريد الإلكتروني المعاملاتية والتسويقية</li>
                  <li><strong>مزودو التحليلات:</strong> تحليلات الموقع ومراقبة الأداء</li>
                </ul>
                <p className="mt-4">
                  يمكن لهؤلاء المزودين الوصول إلى معلوماتك الشخصية فقط لأداء الخدمات نيابة عنا وهم ملزمون بالحفاظ على السرية.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
                الحق في رفض الموافقة
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed mr-10">
                <p>
                  لديك الحق في رفض أو سحب الموافقة على جمع ومعالجة معلوماتك الشخصية. ومع ذلك، يرجى ملاحظة:
                </p>
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-amber-900 mb-2">⚠️ إشعار مهم</p>
                  <p className="text-amber-800">
                    إذا رفضت تقديم المعلومات الشخصية الضرورية، فقد لا نتمكن من تقديم خدمات معينة، بما في ذلك تسجيل الحساب ومعالجة الطلبات ودعم العملاء. البيانات الأساسية مطلوبة للوظائف الأساسية للموقع.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">9</span>
                خصوصية الأطفال
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed mr-10">
                <p>
                  خدماتنا ليست موجهة للأفراد دون سن 18 عاماً. نحن لا نجمع معلومات شخصية من الأطفال عن علم. إذا كنت والداً أو وصياً وتعتقد أن طفلك قد قدم لنا معلومات شخصية، فيرجى الاتصال بنا على الفور.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">10</span>
                التغييرات على هذه السياسة
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed mr-10">
                <p>
                  قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر لتعكس التغييرات في ممارساتنا أو المتطلبات القانونية. سنخطرك بأي تغييرات جوهرية عن طريق:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>نشر السياسة المحدثة على موقعنا</li>
                  <li>إرسال إشعار عبر البريد الإلكتروني إلى المستخدمين المسجلين</li>
                  <li>عرض إشعار بارز على موقعنا</li>
                </ul>
                <p className="mt-4">
                  يشكل استمرارك في استخدام خدماتنا بعد هذه التغييرات قبولاً لسياسة الخصوصية المحدثة.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">11</span>
                اتصل بنا
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed mr-10">
                <p className="mb-4">
                  إذا كان لديك أي أسئلة أو مخاوف أو طلبات بخصوص سياسة الخصوصية هذه أو بياناتك الشخصية، يرجى الاتصال بنا:
                </p>
                
                <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">GENOSYS Middle East FZ-LLC</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">البريد الإلكتروني:</p>
                          <a href="mailto:sales@genosys.ae" className="text-primary-600 hover:underline">
                            sales@genosys.ae
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">الهاتف / واتساب:</p>
                          <a href="tel:+971585487665" className="text-primary-600 hover:underline" dir="ltr">
                            +971 58 548 76 65
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    نهدف إلى الرد على جميع الاستفسارات المتعلقة بالخصوصية في غضون يوم عمل واحد.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>تسري سياسة الخصوصية هذه اعتباراً من 14 ديسمبر 2024</p>
            <p className="mt-2">© 2026 GENOSYS Middle East FZ-LLC. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </div>
    </>
  )
}
