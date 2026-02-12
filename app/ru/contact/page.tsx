import type { Metadata } from 'next'
import ContactClient from '../../contact/ContactClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'التدريب المهني - تدريب GENOSYS للعناية بالبشرة | Genosys Middle East FZ-LLC',
  description: 'موارد التدريب المهني لمنتجات العناية بالبشرة GENOSYS. قم بتنزيل وثائق التدريب، ومشاهدة دروس الفيديو، وإتقان التقنيات المهنية لمستحضرات التجميل الكورية.',
  keywords: [
    'تدريب GENOSYS',
    'تدريب العناية بالبشرة المهنية',
    'تدريب مستحضرات التجميل الكورية',
    'تدريب الوخز بالإبر الدقيقة',
    'تدريب العناية بالبشرة الإمارات'
  ],
  openGraph: {
    title: 'التدريب المهني - تدريب GENOSYS للعناية بالبشرة',
    description: 'موارد التدريب المهني لمنتجات العناية بالبشرة GENOSYS. قم بتنزيل وثائق التدريب، ومشاهدة دروس الفيديو، وإتقان التقنيات المهنية.',
    type: 'website',
    url: 'https://genosys.ae/ar/training',
    siteName: 'GENOSYS Middle East FZ-LLC',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-logo.png',
        width: 400,
        height: 200,
        alt: 'التدريب المهني GENOSYS',
      },
    ],
    locale: 'ar_AE',
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
    title: 'التدريب المهني - تدريب GENOSYS للعناية بالبشرة',
    description: 'موارد التدريب المهني لمنتجات العناية بالبشرة GENOSYS. قم بتنزيل وثائق التدريب، ومشاهدة دروس الفيديو، وإتقان التقنيات المهنية.',
    images: ['https://genosys.ae/images/genosys-logo.png'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/training',
    languages: {
      'en': 'https://genosys.ae/training',
      'ar': 'https://genosys.ae/ar/training',
      'ru': 'https://genosys.ae/ru/training',
    },
  },
}

export default function ArabicTrainingPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Контакты', url: '/ru/contact' }
        ]}
      />
      <ContactClient />
    </>
  )
}

