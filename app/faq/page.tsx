import FAQClient from './FAQClient'
import { prisma } from '@/lib/prisma'
import GeoFaqSchema, { GENOSYS_FAQ_EN } from '@/components/schema/GeoFaqSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | GENOSYS Middle East FZ-LLC',
  description: 'Frequently asked questions about GENOSYS Korean dermacosmetics, shipping, orders, products, and professional training in UAE. Get answers about our skincare products, delivery, and services.',
  keywords: [
    'GENOSYS FAQ',
    'Korean dermacosmetics questions',
    'UAE shipping',
    'professional skincare FAQ',
    'GENOSYS support',
    'skincare questions UAE'
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
  const faqItems = await prisma.faqItem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      questionEn: true,
      answerEn: true,
      questionAr: true,
      answerAr: true,
      questionRu: true,
      answerRu: true,
    },
  })

  return (
    <>
      <GeoFaqSchema items={GENOSYS_FAQ_EN} pageUrl="/faq" language="en" />
      <FAQClient faqItems={faqItems} />
    </>
  )
}

