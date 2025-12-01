import type { Metadata } from 'next'
import ProductsPageClient from '../../products/ProductsPageClient'

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
        url: '/images/genosys-products.jpg',
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
    images: ['/images/genosys-products.jpg'],
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
  return <ProductsPageClient />
}

