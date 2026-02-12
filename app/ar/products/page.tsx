import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import ProductsPageClient from '../../products/ProductsPageClient'
import { CONCERN_PAGES } from '@/lib/concernsData'

export const metadata: Metadata = {
  title: 'منتجات GENOSYS - مجموعة مستحضرات التجميل الكورية المهنية الإمارات',
  description: 'تسوق مستحضرات التجميل الكورية المهنية GENOSYS. مجموعة كاملة من أجهزة الوخز بالإبر الدقيقة، الأمصال، الكريمات، الأقنعة وحلول العناية بالبشرة. الموزع الرسمي في الإمارات. شحن مجاني لأكثر من 1000 درهم.',
  keywords: [
    'منتجات GENOSYS',
    'مستحضرات التجميل الكورية',
    'العناية بالبشرة المهنية الإمارات',
    'أجهزة الوخز بالإبر الدقيقة',
    'منتجات العناية بالبشرة الكورية',
    'أمصال الإمارات',
    'كريمات التجميل دبي',
    'العناية بالبشرة المهنية دبي',
    'مستحضرات التجميل الكورية الإمارات'
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
    title: 'منتجات GENOSYS - مجموعة مستحضرات التجميل الكورية المهنية الإمارات',
    description: 'تسوق مستحضرات التجميل الكورية المهنية GENOSYS. مجموعة كاملة من أجهزة الوخز بالإبر الدقيقة، الأمصال، الكريمات، الأقنعة وحلول العناية بالبشرة.',
    type: 'website',
    url: 'https://genosys.ae/ar/products',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'مجموعة منتجات GENOSYS',
      },
    ],
    locale: 'ar_AE',
    siteName: 'GENOSYS Middle East FZ-LLC',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'منتجات GENOSYS - مجموعة مستحضرات التجميل الكورية المهنية الإمارات',
    description: 'تسوق مستحضرات التجميل الكورية المهنية GENOSYS. مجموعة كاملة من أجهزة الوخز بالإبر الدقيقة، الأمصال، الكريمات، والمزيد.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/products',
    languages: {
      'en': 'https://genosys.ae/products',
      'ar': 'https://genosys.ae/ar/products',
      'ru': 'https://genosys.ae/ru/products',
    },
  },
}

export default function ArabicProductsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'المنتجات', url: '/ar/products' },
        ]}
      />
      <ProductsPageClient />

      <section className="hidden sm:block bg-primary-50 py-10 px-4 mt-8 border-t border-primary-100" dir="rtl">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تسوق حسب مشكلة البشرة</h2>
          <p className="text-gray-500 mb-6">اعثر على المنتجات المناسبة لاحتياجات بشرتك</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CONCERN_PAGES.map(concern => (
              <Link key={concern.slug} href={`/ar/products/concern/${concern.slug}`}
                className="block p-4 bg-white rounded-xl border border-primary-100 hover:border-primary-300 hover:shadow-md transition-all duration-200 group">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-primary-600 transition-colors">{concern.seo.ar.h1}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

