import CartClient from '../../cart/CartClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'سلة التسوق - GENOSYS مستحضرات التجميل الكورية المهنية | Genosys Middle East FZ-LLC',
  description: 'راجع منتجات GENOSYS الكورية المهنية المختارة. دفع آمن مع خصومات مهنية وتوصيل في الإمارات.',
  keywords: 'سلة GENOSYS، سلة مستحضرات التجميل الكورية، سلة العناية بالبشرة المهنية، تسوق مستحضرات التجميل الإمارات، دفع GENOSYS',
  openGraph: {
    title: 'سلة التسوق - GENOSYS مستحضرات التجميل الكورية المهنية',
    description: 'راجع منتجات GENOSYS الكورية المهنية المختارة. دفع آمن مع خصومات مهنية.',
    type: 'website',
    url: 'https://genosys.ae/ar/cart',
    siteName: 'GENOSYS Middle East FZ-LLC',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'سلة التسوق GENOSYS',
      },
    ],
    locale: 'ar_AE',
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'سلة التسوق - GENOSYS مستحضرات التجميل الكورية المهنية',
    description: 'راجع منتجات GENOSYS الكورية المهنية المختارة.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/cart',
    languages: {
      'en': 'https://genosys.ae/cart',
      'ar': 'https://genosys.ae/ar/cart',
    },
  },
}

export default function ArabicCartPage() {
  return (
    <div className="bg-gray-50 md:bg-white min-h-[100dvh] cart-page">
      <BreadcrumbSchema
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'المنتجات', url: '/ar/products' },
          { name: 'السلة', url: '/ar/cart' }
        ]}
      />
      <CartClient />
    </div>
  )
}

