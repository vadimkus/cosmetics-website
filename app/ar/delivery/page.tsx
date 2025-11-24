import Link from 'next/link'
import { ArrowLeft, Clock, Truck, MapPin, Phone, Mail, Gift, RotateCcw } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'معلومات التوصيل - شحن سريع الإمارات | Genosys Middle East FZ-LLC',
  description: 'خدمة توصيل سريعة وموثوقة في جميع أنحاء الإمارات. توصيل خلال ساعة واحدة في دبي، 24-36 ساعة في جميع أنحاء الإمارات. شحن مجاني على الطلبات التي تزيد عن 1,000 درهم.',
  keywords: 'توصيل الإمارات، شحن سريع دبي، توصيل Careem، توصيل QuipQup، شحن مجاني الإمارات، توصيل مستحضرات التجميل الكورية',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'معلومات التوصيل - شحن سريع الإمارات',
    description: 'خدمة توصيل سريعة وموثوقة في جميع أنحاء الإمارات. توصيل خلال ساعة واحدة في دبي، 24-36 ساعة في جميع أنحاء الإمارات. شحن مجاني على الطلبات التي تزيد عن 1,000 درهم.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'خدمة توصيل GENOSYS الإمارات',
      },
    ],
    locale: 'ar_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'معلومات التوصيل - شحن سريع الإمارات',
    description: 'خدمة توصيل سريعة وموثوقة في جميع أنحاء الإمارات. توصيل خلال ساعة واحدة في دبي، 24-36 ساعة في جميع أنحاء الإمارات.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/delivery',
    languages: {
      'ar': 'https://genosys.ae/ar/delivery',
      'en': 'https://genosys.ae/delivery',
    },
  },
}

export default function ArabicDeliveryPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "ما هو وقت التوصيل لمنتجات GENOSYS في الإمارات؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نوفر خدمات توصيل سريعة مع توصيل خلال ساعة واحدة داخل دبي و 24-36 ساعة في جميع أنحاء الإمارات. يتم التوصيل بواسطة Careem/QuipQup مباشرة إلى باب منزلك."
        }
      },
      {
        "@type": "Question",
        "name": "هل يوجد شحن مجاني متاح؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نعم، نقدم التوصيل المجاني على جميع الطلبات التي تزيد عن 1,000 درهم. لا توجد قيود على الحد الأدنى للطلب، ولا توجد رسوم خفية. ببساطة قم بتقديم طلب بقيمة 1,000 درهم أو أكثر واستمتع بخدمة التوصيل المجانية في جميع أنحاء الإمارات العربية المتحدة."
        }
      },
      {
        "@type": "Question",
        "name": "ما هي سياسة الإرجاع لمنتجات GENOSYS؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نقبل الإرجاع خلال 10 أيام من تاريخ التسليم. يجب أن تكون العناصر غير مستخدمة وفي التغليف الأصلي. تستغرق معالجة الاسترداد 3-5 أيام عمل. اتصل بنا لبدء عملية الإرجاع."
        }
      },
      {
        "@type": "Question",
        "name": "ما هي شركات التوصيل التي يستخدمها GENOSYS؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "يتم التوصيل بواسطة Careem/QuipQup مباشرة إلى باب منزلك. تضمن شراكتنا مع Careem و QuipQup تتبعاً مهنياً وموثوقاً وتوصيلاً آمناً لمنتجات التجميل الخاصة بك في جميع أنحاء الإمارات."
        }
      },
      {
        "@type": "Question",
        "name": "إلى أي مناطق تقدمون التوصيل؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نوصل إلى جميع أنحاء الإمارات العربية المتحدة، بما في ذلك دبي وأبوظبي والشارقة وجميع الإمارات الأخرى."
        }
      }
    ]
  }

  return (
    <div className="bg-white min-h-screen" dir="rtl">
      <BreadcrumbSchema 
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'التوصيل', url: '/ar/delivery' }
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema, null, 2) }}
      />
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">

          {/* Navigation Breadcrumb */}
          <nav className="flex flex-col gap-2 text-sm md:text-base text-gray-600 mb-8" aria-label="Breadcrumb">
            {/* Mobile Breadcrumb */}
            <div className="md:hidden flex items-center gap-2">
              <Link 
                href="/ar"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                الرئيسية
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center">
                التوصيل
              </span>
            </div>
            
            {/* Mobile Back Button */}
            <Link 
              href="/ar"
              className="md:hidden flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 rotate-180" />
              <span className="font-medium">العودة إلى الرئيسية</span>
            </Link>
            
            {/* Desktop Breadcrumb */}
            <div className="hidden md:flex items-center gap-2">
              <Link 
                href="/ar"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                الرئيسية
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center">
                التوصيل
              </span>
            </div>
          </nav>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              معلومات التوصيل
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              خدمة توصيل سريعة وموثوقة في جميع أنحاء الإمارات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-8 w-8 text-black ml-3" />
                <h2 className="text-2xl font-semibold text-gray-800">وقت التوصيل</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                نوفر خدمات توصيل سريعة مع <strong>توصيل خلال ساعة واحدة داخل دبي</strong> و
                <strong> 24-36 ساعة في جميع أنحاء الإمارات</strong>. التزامنا بالتوصيل الفعال يضمن لك الحصول على 
                منتجات مستحضرات التجميل الكورية المميزة في أسرع وقت ممكن.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <Truck className="h-8 w-8 text-black ml-3" />
                <h2 className="text-2xl font-semibold text-gray-800">شريك التوصيل</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                يتم التوصيل بواسطة <strong>Careem/QuipQup</strong> مباشرة إلى باب منزلك. 
                تضمن شراكتنا مع Careem و QuipQup تتبعاً مهنياً وموثوقاً وتوصيلاً آمناً 
                لمنتجات التجميل الخاصة بك في جميع أنحاء الإمارات.
              </p>
            </div>
          </div>

          <div className="bg-primary-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">تفاصيل التوصيل</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary-600 ml-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">منطقة الخدمة</h3>
                    <p className="text-gray-600">الإمارات العربية المتحدة</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary-600 ml-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">وقت التوصيل</h3>
                    <p className="text-gray-600">خلال ساعة واحدة من تقديم الطلب في جميع أنحاء دبي</p>
                    <p className="text-gray-600">خلال 24-36 ساعة في جميع أنحاء الإمارات</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-primary-600 ml-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">شريك التوصيل</h3>
                    <p className="text-gray-600">Careem/QuipQup</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary-600 ml-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">نوع التوصيل</h3>
                    <p className="text-gray-600">مباشرة إلى باب المنزل</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Free Shipping Section */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-8 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Gift className="h-10 w-10 text-green-600" />
                <h2 className="text-3xl font-bold text-gray-800">عرض الشحن المجاني</h2>
              </div>
              <p className="text-xl text-black mb-6">
                استمتع بالتوصيل المجاني على جميع الطلبات التي تزيد عن 1,000 درهم
              </p>
              <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">1,000 درهم+</div>
                  <div className="text-2xl font-semibold text-green-600">توصيل مجاني</div>
                </div>
              </div>
              <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
                لا توجد قيود على الحد الأدنى للطلب، ولا توجد رسوم خفية. ببساطة قم بتقديم طلب بقيمة 1,000 درهم أو أكثر 
                واستمتع بخدمة التوصيل المجانية في جميع أنحاء الإمارات العربية المتحدة.
              </p>
            </div>
          </div>

          {/* Return Policy Section */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <RotateCcw className="h-10 w-10 text-primary-600" />
                <h2 className="text-3xl font-bold text-gray-800">سياسة الإرجاع</h2>
              </div>
              <p className="text-xl text-gray-600">
                نقبل الإرجاع لراحة بالك
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary-50 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">فترة الإرجاع</h3>
                  <p className="text-gray-600">10 أيام من تاريخ التسليم</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-primary-50 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">وقت المعالجة</h3>
                  <p className="text-gray-600">3-5 أيام عمل لمعالجة الاسترداد</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-primary-50 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">الحالة</h3>
                  <p className="text-gray-600">يجب أن تكون العناصر غير مستخدمة وفي التغليف الأصلي</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                <strong>عملية الإرجاع:</strong> اتصل بنا لبدء عملية الإرجاع
              </p>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">تحتاج مساعدة في طلبك؟</h2>
            <p className="text-gray-600 mb-6">
              اتصل بنا للحصول على المساعدة.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/971585487665" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="h-5 w-5" />
                دعم واتساب
              </a>
              <a 
                href="mailto:sales@genosys.ae"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="h-5 w-5" />
                دعم البريد الإلكتروني
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

