import Link from 'next/link'
import { ArrowLeft, Phone, Mail, MapPin, FileText, Globe, Instagram, Facebook } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'اتصل بنا - GENOSYS Middle East FZ-LLC | تواصل معنا | Genosys.ae',
  description: 'تواصل مع شركة GENOSYS الشرق الأوسط FZ-LLC لمستحضرات التجميل الكورية المهنية. الهاتف: +971 58 548 76 65، البريد الإلكتروني: sales@genosys.ae. موجود في دبي، الإمارات.',
  keywords: 'اتصل بنا GENOSYS، اتصال مستحضرات التجميل الإمارات، مستحضرات التجميل الكورية الإمارات، موزع العناية بالبشرة دبي، رقم هاتف GENOSYS',
  openGraph: {
    title: 'اتصل بنا - GENOSYS Middle East FZ-LLC | تواصل معنا',
    description: 'تواصل مع شركة GENOSYS الشرق الأوسط FZ-LLC لمستحضرات التجميل الكورية المهنية. الهاتف: +971 58 548 76 65، البريد الإلكتروني: sales@genosys.ae.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-logo.png',
        width: 400,
        height: 400,
        alt: 'اتصال GENOSYS Middle East FZ-LLC',
      },
    ],
    locale: 'ar_AE',
  },
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
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'اتصل بنا - GENOSYS Middle East FZ-LLC | تواصل معنا',
    description: 'تواصل مع شركة GENOSYS الشرق الأوسط FZ-LLC لمستحضرات التجميل الكورية المهنية. الهاتف: +971 58 548 76 65، البريد الإلكتروني: sales@genosys.ae.',
    images: ['/images/genosys-logo.png'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/contact',
    languages: {
      'ar': 'https://genosys.ae/ar/contact',
      'en': 'https://genosys.ae/contact',
      'ru': 'https://genosys.ae/ru/contact',
    },
  },
}

export default function ArabicContactPage() {
  return (
    <div className="bg-white" dir="rtl">
      <BreadcrumbSchema 
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'اتصل بنا', url: '/ar/contact' }
        ]}
      />
      <div className="container mx-auto px-3 md:px-4 py-4 md:pt-16 pb-0 mb-0">
        <div className="max-w-4xl mx-auto mb-0 pb-0">

          {/* Navigation Breadcrumb */}
          <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
            <Link href="/ar" className="hover:text-primary-600 transition-colors">الرئيسية</Link>
            <span> / </span>
            <span className="text-gray-900 font-medium">اتصل بنا</span>
          </nav>
          
          {/* Back to Home */}
          <Link href="/ar" className="inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8">
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 rotate-180" />
            <span>العودة إلى الرئيسية</span>
          </Link>
          
          <div className="text-center mb-4 md:mb-12">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 md:mb-6">
              اتصل بنا
            </h1>
          </div>

          {/* Contact Grid - 2 columns on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 mb-4 md:mb-12">
            <a 
              href="https://wa.me/971585487665"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center p-3 md:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Phone className="h-5 w-5 md:h-8 md:w-8 text-green-600 mx-auto mb-1.5 md:mb-4" />
              <h3 className="text-xs md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-2">واتساب</h3>
              <span className="text-[10px] md:text-base text-gray-600">+971 58 548 76 65</span>
            </a>

            <a 
              href="mailto:sales@genosys.ae"
              className="text-center p-3 md:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Mail className="h-5 w-5 md:h-8 md:w-8 text-primary-600 mx-auto mb-1.5 md:mb-4" />
              <h3 className="text-xs md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-2">البريد</h3>
              <span className="text-[10px] md:text-base text-gray-600 break-all">sales@genosys.ae</span>
            </a>

            <a 
              href="https://genosys.ae"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center p-3 md:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Globe className="h-5 w-5 md:h-8 md:w-8 text-blue-600 mx-auto mb-1.5 md:mb-4" />
              <h3 className="text-xs md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-2">الموقع</h3>
              <span className="text-[10px] md:text-base text-gray-600">genosys.ae</span>
            </a>

            <a 
              href="https://instagram.com/genosys.uae"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center p-3 md:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Instagram className="h-5 w-5 md:h-8 md:w-8 text-pink-600 mx-auto mb-1.5 md:mb-4" />
              <h3 className="text-xs md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-2">إنستغرام</h3>
              <span className="text-[10px] md:text-base text-gray-600">@genosys.uae</span>
            </a>

            <a 
              href="https://www.facebook.com/genosys.ae"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center p-3 md:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Facebook className="h-5 w-5 md:h-8 md:w-8 text-blue-600 mx-auto mb-1.5 md:mb-4" />
              <h3 className="text-xs md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-2">فيسبوك</h3>
              <span className="text-[10px] md:text-base text-gray-600">genosys.ae</span>
            </a>

            <a 
              href="https://maps.google.com/?q=Cordoba+Residence,+Villa+E02,+Dubai+United+Arab+Emirates"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center p-3 md:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors col-span-2 lg:col-span-1"
            >
              <MapPin className="h-5 w-5 md:h-8 md:w-8 text-red-600 mx-auto mb-1.5 md:mb-4" />
              <h3 className="text-xs md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-2">العنوان</h3>
              <span className="text-[10px] md:text-base text-gray-600">Cordoba Residence, E02, Dubai, UAE</span>
            </a>
          </div>

          {/* Official Distributor Section */}
          <div className="text-center mb-8 md:mb-12 pb-8 md:pb-12">
            <div className="bg-primary-50 rounded-lg px-4 md:px-8 py-4 md:py-8">
              <h2 className="text-base md:text-2xl font-semibold text-gray-800 mb-2 md:mb-4">
                الموزع الرسمي في الإمارات
              </h2>
              <p className="text-gray-600 mb-2 md:mb-4 text-xs md:text-base">
                موزع رسمي لشركة DTSMG. Co., Ltd، كوريا منذ 2019.
              </p>
              <p className="text-[10px] md:text-sm text-gray-500 mb-3 md:mb-4">
                المنتجات معتمدة في نظام Montaji من <a href="https://www.dm.gov.ae/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">بلدية دبي</a>.
              </p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                <a
                  href="/documents/commercial-license.pdf"
                  download="Genosys-Commercial-License-5023192.pdf"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors text-[10px] md:text-sm touch-manipulation bg-white px-2 py-1 md:px-3 md:py-1.5 rounded-md shadow-sm"
                >
                  <FileText className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                  الترخيص
                </a>
                <a
                  href="/documents/genosys-trn-104229886700003.pdf"
                  download="GENOSYS-TRN-104229886700003.pdf"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors text-[10px] md:text-sm touch-manipulation bg-white px-2 py-1 md:px-3 md:py-1.5 rounded-md shadow-sm"
                >
                  <FileText className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                  TRN
                </a>
                <a
                  href="https://dnbuae.com/duns-number/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors text-[10px] md:text-sm touch-manipulation bg-white px-2 py-1 md:px-3 md:py-1.5 rounded-md shadow-sm"
                >
                  <FileText className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                  D-U-N-S®
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

