import Link from 'next/link'
import { ArrowLeft, Clock, Truck, Phone, Mail, Gift, RotateCcw } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Информация о доставке - Быстрая доставка ОАЭ | Genosys Middle East FZ-LLC',
  description: 'Быстрая и надежная служба доставки по всему ОАЭ. Доставка в течение 1 часа в Дубае, 24-36 часов по всему ОАЭ. Бесплатная доставка при заказе свыше 1,000 дирхамов.',
  keywords: [
    'доставка ОАЭ',
    'быстрая доставка Дубай',
    'доставка Careem',
    'доставка QuipQup',
    'бесплатная доставка ОАЭ',
    'доставка корейской косметики'
  ],
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
    title: 'Информация о доставке - Быстрая доставка ОАЭ',
    description: 'Быстрая и надежная служба доставки по всему ОАЭ. Доставка в течение 1 часа в Дубае, 24-36 часов по всему ОАЭ. Бесплатная доставка при заказе свыше 1,000 дирхамов.',
    type: 'website',
    url: 'https://genosys.ae/ru/delivery',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'ru_AE',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Служба доставки GENOSYS ОАЭ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'Информация о доставке - Быстрая доставка ОАЭ',
    description: 'Быстрая и надежная служба доставки по всему ОАЭ. Доставка в течение 1 часа в Дубае, 24-36 часов по всему ОАЭ.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/delivery',
    languages: {
      'en': 'https://genosys.ae/delivery',
      'ar': 'https://genosys.ae/ar/delivery',
      'ru': 'https://genosys.ae/ru/delivery',
    },
  },
}

export default function RussianDeliveryPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Какое время доставки для продуктов GENOSYS в ОАЭ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Мы предоставляем быструю доставку: в течение 1 часа в Дубае и 24-36 часов по всему ОАЭ. Доставка осуществляется через Careem/QuipQup прямо к вашему порогу."
        }
      },
      {
        "@type": "Question",
        "name": "Есть ли бесплатная доставка?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Да, мы предлагаем БЕСПЛАТНУЮ ДОСТАВКУ для всех заказов свыше 1,000 дирхамов. Нет ограничений по минимальному заказу, нет скрытых платежей. Просто сделайте заказ на сумму 1,000 дирхамов или более и наслаждайтесь бесплатной доставкой по всему ОАЭ."
        }
      },
      {
        "@type": "Question",
        "name": "Какая политика возврата для продуктов GENOSYS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Мы принимаем возвраты в течение 10 дней с даты доставки. Товары должны быть неиспользованными и в оригинальной упаковке. Обработка возврата занимает 3-5 рабочих дней. Свяжитесь с нами, чтобы начать процесс возврата."
        }
      },
      {
        "@type": "Question",
        "name": "Каких партнеров по доставке использует GENOSYS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Доставка осуществляется через Careem/QuipQup прямо к вашему порогу. Наше партнерство с Careem и QuipQup обеспечивает профессиональное, надежное отслеживание и безопасную доставку ваших косметических продуктов по всему ОАЭ."
        }
      },
      {
        "@type": "Question",
        "name": "В какие районы вы доставляете?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Мы доставляем по всему ОАЭ, включая Дубай, Абу-Даби, Шарджу и все другие эмираты."
        }
      }
    ]
  }

  return (
    <div className="bg-white min-h-screen" dir="ltr">
      <BreadcrumbSchema 
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Доставка', url: '/ru/delivery' }
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema, null, 2) }}
      />
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-4xl mx-auto">

          {/* Navigation Breadcrumb */}
          <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
            <Link href="/ru" className="hover:text-primary-600 transition-colors">Главная</Link>
            <span> / </span>
            <span className="text-gray-900 font-medium">Доставка</span>
          </nav>
          
          {/* Back to Home */}
          <Link href="/ru" className="inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8">
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
            <span>На главную</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-6 md:mb-12">
            <h1 className="text-xl md:text-5xl font-bold text-gray-800 mb-2 md:mb-6">
              Информация о доставке
            </h1>
            <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto">
              Быстрая доставка в ОАЭ
            </p>
          </div>

          {/* Delivery Time & Partner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 mb-4 md:mb-12">
            <div className="bg-white rounded-lg shadow-sm border p-3 md:p-6">
              <div className="flex items-center mb-2 md:mb-4">
                <Clock className="h-5 w-5 md:h-8 md:w-8 text-black mr-2 md:mr-3" />
                <h2 className="text-sm md:text-2xl font-semibold text-gray-800">Время доставки</h2>
              </div>
              <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                <strong>1 час в Дубае</strong>, <strong>24-36 часов в ОАЭ</strong>
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-3 md:p-6">
              <div className="flex items-center mb-2 md:mb-4">
                <Truck className="h-5 w-5 md:h-8 md:w-8 text-black mr-2 md:mr-3" />
                <h2 className="text-sm md:text-2xl font-semibold text-gray-800">Партнер по доставке</h2>
              </div>
              <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                <strong>Careem/QuipQup</strong> - прямо к вашему порогу
              </p>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-primary-50 rounded-lg p-3 md:p-8 mb-3 md:mb-8">
            <h2 className="text-sm md:text-2xl font-semibold text-gray-800 mb-3 md:mb-6 text-center">Детали доставки</h2>
            <div className="grid grid-cols-2 gap-2 md:gap-6 text-xs md:text-base">
              <div><span className="font-semibold text-gray-800">Регион:</span> ОАЭ</div>
              <div><span className="font-semibold text-gray-800">Партнер:</span> Careem/QuipQup</div>
              <div><span className="font-semibold text-gray-800">Дубай:</span> 1 час</div>
              <div><span className="font-semibold text-gray-800">ОАЭ:</span> 24-36 часов</div>
            </div>
          </div>

          {/* Free Shipping Section */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 md:p-8 mb-3 md:mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-4">
                <Gift className="h-6 w-6 md:h-10 md:w-10 text-green-600" />
                <h2 className="text-base md:text-3xl font-bold text-gray-800">Бесплатная доставка</h2>
              </div>
              <div className="bg-white rounded-lg p-3 md:p-6 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold text-green-600 mb-1">1,000+ дирхамов</div>
                  <div className="text-sm md:text-2xl font-semibold text-green-600">Бесплатная доставка</div>
                </div>
              </div>
              <p className="text-xs md:text-base text-gray-600 mt-3 md:mt-6">
                Без минимума, без скрытых платежей
              </p>
            </div>
          </div>

          {/* Return Policy Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 md:p-8 mb-3 md:mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-4">
                <RotateCcw className="h-6 w-6 md:h-10 md:w-10 text-blue-600" />
                <h2 className="text-base md:text-3xl font-bold text-gray-800">Политика возврата</h2>
              </div>
              <div className="bg-white rounded-lg p-3 md:p-6">
                <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-base">
                  <div><span className="font-semibold text-gray-800">Срок:</span> 10 дней</div>
                  <div><span className="font-semibold text-gray-800">Возврат:</span> 3-5 дней</div>
                  <div><span className="font-semibold text-gray-800">Состояние:</span> Неиспользовано, оригинальная упаковка</div>
                  <div><span className="font-semibold text-gray-800">Процесс:</span> Свяжитесь с нами</div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-lg shadow-sm border p-3 md:p-8 text-center">
            <h2 className="text-sm md:text-2xl font-semibold text-gray-800 mb-2 md:mb-4">Нужна помощь?</h2>
            <div className="flex flex-row gap-2 md:gap-4 justify-center">
              <a 
                href="https://wa.me/971585487665"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-green-700 transition-colors"
              >
                <Phone className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                WhatsApp
              </a>
              <a 
                href="mailto:sales@genosys.ae"
                className="inline-flex items-center justify-center bg-primary-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-primary-700 transition-colors"
              >
                <Mail className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



