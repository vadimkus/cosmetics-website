import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import ProductsPageClient from '../../products/ProductsPageClient'
import ConcernLinkGrid from '@/components/products/ConcernLinkGrid'

export const metadata: Metadata = {
  title: 'منتجات GENOSYS - مجموعة مستحضرات التجميل الكورية الاحترافية في الإمارات',
  description: 'تسوق مستحضرات التجميل الكورية الاحترافية من GENOSYS. مجموعة كاملة من رولرات الميكرونيدلينغ، والسيرومات، والكريمات، والأقنعة وحلول العناية بالبشرة. الموزع الرسمي في الإمارات. شحن مجاني للطلبات فوق 1000 درهم.',
  keywords: [
    'منتجات GENOSYS',
    'مستحضرات التجميل الكورية',
    'العناية بالبشرة الاحترافية الإمارات',
    'رولرات الميكرونيدلينغ',
    'منتجات العناية بالبشرة الكورية',
    'أمصال الإمارات',
    'كريمات التجميل دبي',
    'العناية بالبشرة الاحترافية دبي',
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
    title: 'منتجات GENOSYS - مجموعة مستحضرات التجميل الكورية الاحترافية في الإمارات',
    description: 'تسوق مستحضرات التجميل الكورية الاحترافية من GENOSYS. مجموعة كاملة من رولرات الميكرونيدلينغ، والسيرومات، والكريمات، والأقنعة وحلول العناية بالبشرة.',
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
    siteName: 'GENOSYS',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'منتجات GENOSYS - مجموعة مستحضرات التجميل الكورية الاحترافية في الإمارات',
    description: 'تسوق مستحضرات التجميل الكورية الاحترافية من GENOSYS. مجموعة كاملة من رولرات الميكرونيدلينغ، والسيرومات، والكريمات، والمزيد.',
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
          <ConcernLinkGrid locale="ar" />
        </div>
      </section>
    </>
  )
}

