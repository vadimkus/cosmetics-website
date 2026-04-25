import CheckoutClient from '../../checkout/CheckoutClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الدفع الآمن - مستحضرات التجميل الكورية المهنية GENOSYS',
  description: 'أكمل طلب مستحضرات التجميل الكورية المهنية GENOSYS بأمان. خصومات مهنية، توصيل في الإمارات، ومعالجة دفع آمنة.',
  keywords: 'دفع GENOSYS، دفع مستحضرات التجميل الكورية، طلب العناية بالبشرة المهنية، شراء مستحضرات التجميل الإمارات، دفع آمن',
  openGraph: {
    title: 'الدفع الآمن - مستحضرات التجميل الكورية المهنية GENOSYS',
    description: 'أكمل طلب مستحضرات التجميل الكورية المهنية GENOSYS بأمان. خصومات مهنية وتوصيل في الإمارات.',
    type: 'website',
    url: 'https://genosys.ae/ar/checkout',
    siteName: 'GENOSYS',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'الدفع الآمن GENOSYS',
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
    title: 'الدفع الآمن - مستحضرات التجميل الكورية المهنية GENOSYS',
    description: 'أكمل طلب مستحضرات التجميل الكورية المهنية GENOSYS بأمان.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/checkout',
    languages: {
      'en': 'https://genosys.ae/checkout',
      'ar': 'https://genosys.ae/ar/checkout',
    },
  },
}

export default function ArabicCheckoutPage() {
  return (
    <div className="bg-gray-50 md:bg-white min-h-[100dvh] checkout-page">
      <BreadcrumbSchema
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'المنتجات', url: '/ar/products' },
          { name: 'السلة', url: '/ar/cart' },
          { name: 'الدفع', url: '/ar/checkout' }
        ]}
      />
      <CheckoutClient />
    </div>
  )
}

