import FAQClient from './FAQClient'
import { getActiveFaqItems } from '@/lib/faqDb'
import GeoFaqSchema, { GENOSYS_FAQ_EN } from '@/components/schema/GeoFaqSchema'
import type { Metadata } from 'next'

// ISR: cache for 5 min; admin routes revalidateTag('faq', 'max') on mutation.
export const revalidate = 300

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | GENOSYS Middle East FZ-LLC',
  description: 'Frequently asked questions about GENOSYS Korean dermacosmetics, shipping, orders, products, mobile app, and professional training in UAE. Get answers about our skincare products, delivery, iOS & Android app, and services.',
  keywords: [
    'GENOSYS FAQ',
    'Korean dermacosmetics questions',
    'UAE shipping',
    'professional skincare FAQ',
    'GENOSYS support',
    'skincare questions UAE',
    'GENOSYS app',
    'GENOSYS mobile app',
    'GENOSYS iOS app',
    'GENOSYS Android app',
  ],
  openGraph: {
    title: 'FAQ - Frequently Asked Questions | GENOSYS Middle East FZ-LLC',
    description: 'Frequently asked questions about GENOSYS Korean dermacosmetics, shipping, orders, products, and professional training in UAE.',
    type: 'website',
    url: 'https://genosys.ae/faq',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'en_AE',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS FAQ - Frequently Asked Questions',
      },
    ],
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
    title: 'FAQ - Frequently Asked Questions | GENOSYS Middle East FZ-LLC',
    description: 'Frequently asked questions about GENOSYS Korean dermacosmetics, shipping, orders, and professional training in UAE.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/faq',
    languages: {
      'en': 'https://genosys.ae/faq',
      'ar': 'https://genosys.ae/ar/faq',
      'ru': 'https://genosys.ae/ru/faq',
    },
  },
}

export default async function FAQPage() {
  const faqItems = await getActiveFaqItems()

  return (
    <>
      <GeoFaqSchema items={GENOSYS_FAQ_EN} pageUrl="/faq" language="en" />
      <FAQClient faqItems={faqItems} />
    </>
  )
}

