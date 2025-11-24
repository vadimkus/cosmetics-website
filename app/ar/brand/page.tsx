import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'قصة علامة GENOSYS - نظام إعادة ولادة الجينات',
  description: 'اكتشف GENOSYS، أول علامة تجارية مخصصة للوخز بالإبر الدقيقة في العالم. نظام إعادة ولادة الجينات يجمع بين الوخز بالإبر الدقيقة ومستحضرات التجميل المصممة خصيصاً.',
  keywords: 'GENOSYS، نظام إعادة ولادة الجينات، الوخز بالإبر الدقيقة، مستحضرات التجميل الكورية، العناية بالبشرة المهنية',
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
    title: 'قصة علامة GENOSYS - نظام إعادة ولادة الجينات',
    description: 'اكتشف GENOSYS، أول علامة تجارية مخصصة للوخز بالإبر الدقيقة في العالم. نظام إعادة ولادة الجينات يجمع بين الوخز بالإبر الدقيقة ومستحضرات التجميل المصممة خصيصاً.',
    type: 'website',
    url: 'https://genosys.ae/ar/brand',
    siteName: 'GENOSYS Middle East FZ-LLC',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS مستحضرات التجميل الكورية المهنية',
      },
    ],
    locale: 'ar_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'قصة علامة GENOSYS - نظام إعادة ولادة الجينات',
    description: 'اكتشف GENOSYS، أول علامة تجارية مخصصة للوخز بالإبر الدقيقة في العالم.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/brand',
    languages: {
      'ar': 'https://genosys.ae/ar/brand',
      'en': 'https://genosys.ae/brand',
    },
  },
}

export default function ArabicBrandPage() {
  return (
    <div className="bg-white min-h-screen" dir="rtl">
      <BreadcrumbSchema 
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'العلامة التجارية', url: '/ar/brand' }
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
                العلامة التجارية
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
                العلامة التجارية
              </span>
            </div>
          </nav>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              نظام GENOSYS لإعادة ولادة الجينات
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              GENOSYS هي أول علامة تجارية مخصصة للوخز بالإبر الدقيقة في العالم، ولدت من خلال الجمع بين الوخز بالإبر الدقيقة ومستحضرات التجميل المصممة خصيصاً لعلاج الوخز بالإبر الدقيقة لتحسين تأثيرات العناية بالبشرة.
            </p>
            
            {/* Video Section */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                  src="https://www.youtube.com/embed/4L9xZc7wAjI"
                  title="نظام GENOSYS لإعادة ولادة الجينات"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <p className="text-gray-600 leading-relaxed text-lg text-center mb-8">
              مع التركيبات الصديقة للبشرة والمكونات النشطة القوية، لا توفر خطوط GENOSYS للعناية المنزلية/المهنية نتائج مرئية طويلة الأمد فحسب، بل تعزز أيضاً فعالية العلاجات المهنية.
            </p>
            
            {/* Video Section */}
            <div className="max-w-4xl mx-auto">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                  src="https://www.youtube.com/embed/v-i6CHJfWIg?autoplay=1&loop=1&playlist=v-i6CHJfWIg&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1"
                  title="علاج GENOSYS المهني"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center">
              <div className="mt-6">
                <Image
                  src="/Logo/Full.png"
                  alt="GENOSYS نظام إعادة ولادة الجينات - شعار العلامة التجارية لمستحضرات التجميل الكورية المهنية"
                  width={200}
                  height={100}
                  className="mx-auto"
                />
              </div>
              <div className="mt-6">
                <Image
                  src="/images/genosys-products.jpg"
                  alt="مجموعة منتجات العناية بالبشرة المهنية GENOSYS الكورية - أجهزة الوخز بالإبر الدقيقة وحلول العناية بالبشرة"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-md mx-auto"
                  priority
                />
              </div>
              <p className="text-gray-500 text-base mt-4">
                خط GENOSYS للعناية بالبشرة المهنية - منتجات مختبرة من قبل أطباء الجلد.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

