import FAQClient from '../../faq/FAQClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة - الأسئلة المتكررة | GENOSYS Middle East FZ-LLC',
  description: 'الأسئلة المتكررة حول مستحضرات التجميل الكورية GENOSYS، الشحن، الطلبات، المنتجات، والتدريب المهني في الإمارات. احصل على إجابات حول منتجات العناية بالبشرة، التوصيل، والخدمات.',
  keywords: [
    'أسئلة GENOSYS الشائعة',
    'أسئلة مستحضرات التجميل الكورية',
    'شحن الإمارات',
    'أسئلة العناية بالبشرة المهنية',
    'دعم GENOSYS',
    'أسئلة العناية بالبشرة الإمارات'
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
    title: 'الأسئلة الشائعة - الأسئلة المتكررة | GENOSYS Middle East FZ-LLC',
    description: 'الأسئلة المتكررة حول مستحضرات التجميل الكورية GENOSYS، الشحن، الطلبات، المنتجات، والتدريب المهني في الإمارات.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'الأسئلة الشائعة GENOSYS - الأسئلة المتكررة',
      },
    ],
    url: 'https://genosys.ae/ar/faq',
    siteName: 'GENOSYS الشرق الأوسط FZ-LLC',
    locale: 'ar_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'الأسئلة الشائعة - الأسئلة المتكررة | GENOSYS Middle East FZ-LLC',
    description: 'الأسئلة المتكررة حول مستحضرات التجميل الكورية GENOSYS، الشحن، الطلبات، والتدريب المهني في الإمارات.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/faq',
    languages: {
      'en': 'https://genosys.ae/faq',
      'ar': 'https://genosys.ae/ar/faq',
      'ru': 'https://genosys.ae/ru/faq',
    },
  },
}

export default function ArabicFAQPage() {
  return <FAQClient />
}

