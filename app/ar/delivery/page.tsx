import Link from 'next/link'
import { ArrowLeft, Clock, Truck, Phone, Mail, Gift, RotateCcw } from 'lucide-react'
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
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-4xl mx-auto">

          {/* Navigation Breadcrumb */}
          <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4 text-right" aria-label="Breadcrumb">
            <Link href="/ar" className="hover:text-primary-600 transition-colors">الرئيسية</Link>
            <span> / </span>
            <span className="text-gray-900 font-medium">التوصيل</span>
          </nav>
          
          {/* Back to Home */}
          <Link href="/ar" className="inline-flex items-center flex-row-reverse gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8">
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 rotate-180" />
            <span>العودة للرئيسية</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-6 md:mb-12">
            <h1 className="text-xl md:text-5xl font-bold text-gray-800 mb-2 md:mb-6">
              معلومات التوصيل
            </h1>
            <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto">
              توصيل سريع في الإمارات
            </p>
          </div>

          {/* Delivery Time & Partner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 mb-4 md:mb-12">
            <div className="bg-white rounded-lg shadow-sm border p-3 md:p-6">
              <div className="flex items-center mb-2 md:mb-4">
                <Clock className="h-5 w-5 md:h-8 md:w-8 text-black ml-2 md:ml-3" />
                <h2 className="text-sm md:text-2xl font-semibold text-gray-800">وقت التوصيل</h2>
              </div>
              <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                <strong>ساعة واحدة في دبي</strong>، <strong>24-36 ساعة في الإمارات</strong>
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-3 md:p-6">
              <div className="flex items-center mb-2 md:mb-4">
                <Truck className="h-5 w-5 md:h-8 md:w-8 text-black ml-2 md:ml-3" />
                <h2 className="text-sm md:text-2xl font-semibold text-gray-800">شريك التوصيل</h2>
              </div>
              <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                <strong>Careem/QuipQup</strong> - إلى باب المنزل
              </p>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-primary-50 rounded-lg p-3 md:p-8 mb-3 md:mb-8">
            <h2 className="text-sm md:text-2xl font-semibold text-gray-800 mb-3 md:mb-6 text-center">تفاصيل التوصيل</h2>
            <div className="grid grid-cols-2 gap-2 md:gap-6 text-xs md:text-base">
              <div><span className="font-semibold text-gray-800">المنطقة:</span> الإمارات</div>
              <div><span className="font-semibold text-gray-800">الشريك:</span> Careem/QuipQup</div>
              <div><span className="font-semibold text-gray-800">دبي:</span> ساعة واحدة</div>
              <div><span className="font-semibold text-gray-800">الإمارات:</span> 24-36 ساعة</div>
            </div>
          </div>

          {/* Free Shipping Section */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 md:p-8 mb-3 md:mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-4">
                <Gift className="h-6 w-6 md:h-10 md:w-10 text-green-600" />
                <h2 className="text-base md:text-3xl font-bold text-gray-800">شحن مجاني</h2>
              </div>
              <div className="bg-white rounded-lg p-3 md:p-6 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold text-green-600 mb-1">1,000 درهم+</div>
                  <div className="text-sm md:text-2xl font-semibold text-green-600">توصيل مجاني</div>
                </div>
              </div>
              <p className="text-xs md:text-base text-gray-600 mt-3 md:mt-6">
                بدون حد أدنى، بدون رسوم خفية
              </p>
            </div>
          </div>

          {/* Return Policy Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 md:p-8 mb-3 md:mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-4">
                <RotateCcw className="h-6 w-6 md:h-10 md:w-10 text-blue-600" />
                <h2 className="text-base md:text-3xl font-bold text-gray-800">سياسة الإرجاع</h2>
              </div>
              <div className="bg-white rounded-lg p-3 md:p-6">
                <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-base text-right">
                  <div><span className="font-semibold text-gray-800">المدة:</span> 10 أيام</div>
                  <div><span className="font-semibold text-gray-800">الاسترداد:</span> 3-5 أيام</div>
                  <div><span className="font-semibold text-gray-800">الحالة:</span> غير مستخدم، تغليف أصلي</div>
                  <div><span className="font-semibold text-gray-800">العملية:</span> اتصل بنا</div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-lg shadow-sm border p-3 md:p-8 text-center">
            <h2 className="text-sm md:text-2xl font-semibold text-gray-800 mb-2 md:mb-4">تحتاج مساعدة؟</h2>
            <div className="flex flex-row gap-2 md:gap-4 justify-center">
              <a 
                href="https://wa.me/971585487665"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-green-700 transition-colors"
              >
                <Phone className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
                واتساب
              </a>
              <a 
                href="mailto:sales@genosys.ae"
                className="inline-flex items-center justify-center bg-primary-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-primary-700 transition-colors"
              >
                <Mail className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
                بريد
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

