import Link from 'next/link'
import { ArrowLeft, Phone, Mail, MapPin, FileText, Globe, Instagram } from 'lucide-react'
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
    },
  },
}

export default function ArabicContactPage() {
  return (
    <div className="bg-white min-h-screen" dir="rtl">
      <BreadcrumbSchema 
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'اتصل بنا', url: '/ar/contact' }
        ]}
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
                اتصل بنا
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
                اتصل بنا
              </span>
            </div>
          </nav>
          
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
              اتصل بنا
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
            <div className="text-center p-4 md:p-6 bg-gray-50 rounded-lg">
              <Phone className="h-6 w-6 md:h-8 md:w-8 text-black mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">الهاتف/واتساب</h3>
              <a 
                href="https://wa.me/971585487665"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors flex items-center justify-center gap-2 text-sm md:text-base touch-manipulation"
              >
                +971 58 548 76 65
                <span className="text-green-500">📱</span>
              </a>
            </div>

            <div className="text-center p-4 md:p-6 bg-gray-50 rounded-lg">
              <Mail className="h-6 w-6 md:h-8 md:w-8 text-black mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">البريد الإلكتروني</h3>
              <a 
                href="mailto:sales@genosys.ae"
                className="text-gray-600 hover:text-primary-600 transition-colors text-sm md:text-base break-all"
              >
                sales@genosys.ae
              </a>
            </div>

            <div className="text-center p-4 md:p-6 bg-gray-50 rounded-lg">
              <Globe className="h-6 w-6 md:h-8 md:w-8 text-black mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">الموقع الإلكتروني</h3>
              <a 
                href="https://genosys.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors text-sm md:text-base break-all"
              >
                https://genosys.ae
              </a>
            </div>

            <div className="text-center p-4 md:p-6 bg-gray-50 rounded-lg">
              <Instagram className="h-6 w-6 md:h-8 md:w-8 text-black mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">إنستغرام</h3>
              <a 
                href="https://instagram.com/genosys.uae"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors text-sm md:text-base"
              >
                @genosys.uae
              </a>
            </div>

            <div className="text-center p-4 md:p-6 bg-gray-50 rounded-lg sm:col-span-2 lg:col-span-1">
              <MapPin className="h-6 w-6 md:h-8 md:w-8 text-black mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">الموقع</h3>
              <a 
                href="https://maps.google.com/?q=Cordoba+Residence,+Villa+E02,+Dubai+United+Arab+Emirates"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors text-sm md:text-base touch-manipulation"
              >
                Cordoba Residence, Villa E02, Dubai United Arab Emirates
              </a>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-primary-50 rounded-lg p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                الموزع الرسمي في الإمارات
              </h2>
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                شركة GENOSYS الشرق الأوسط FZ-LLC هي موزع رسمي لشركة DTSMG. Co., Ltd، كوريا في الإمارات العربية المتحدة منذ عام 2019.
              </p>
              <p className="text-xs md:text-sm text-gray-500 mb-6">
                جميع منتجات GENOSYS معتمدة في نظام Montaji من قبل <a href="https://www.dm.gov.ae/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">بلدية دبي</a>.
              </p>
              <div className="space-y-3">
                <a
                  href="/documents/commercial-license.pdf"
                  download="Genosys-Commercial-License-5023192.pdf"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors text-sm md:text-base touch-manipulation"
                >
                  <FileText className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  الترخيص التجاري
                </a>
                <a
                  href="/documents/genosys-trn-104229886700003.pdf"
                  download="GENOSYS-TRN-104229886700003.pdf"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors text-sm md:text-base touch-manipulation"
                >
                  <FileText className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  TRN: 104229886700003
                </a>
                <a
                  href="https://dnbuae.com/duns-number/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors text-sm md:text-base touch-manipulation"
                >
                  <FileText className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  <span>
                    رقم D&B D-U-N-S®: <span className="text-primary-600">850215607</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

