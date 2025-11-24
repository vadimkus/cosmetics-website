import FAQClient from './FAQClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | GENOSYS Middle East FZ-LLC',
  description: 'Frequently asked questions about GENOSYS Korean dermacosmetics, shipping, orders, products, and professional training in UAE. Get answers about our skincare products, delivery, and services.',
  keywords: 'GENOSYS FAQ, Korean dermacosmetics questions, UAE shipping, professional skincare FAQ, GENOSYS support, skincare questions UAE',
  openGraph: {
    title: 'FAQ - Frequently Asked Questions | GENOSYS Middle East FZ-LLC',
    description: 'Frequently asked questions about GENOSYS Korean dermacosmetics, shipping, orders, products, and professional training in UAE.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-products.jpg',
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
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/faq',
  },
}

export default function FAQPage() {
  return <FAQClient />
}

