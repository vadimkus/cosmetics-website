import type { Metadata } from 'next'
import ContactClient from '../../contact/ContactClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'اتصل بنا - GENOSYS Middle East FZ-LLC | تواصل معنا | Genosys.ae',
  description: 'تواصل مع شركة GENOSYS الشرق الأوسط FZ-LLC لمستحضرات التجميل الكورية الاحترافية. الهاتف: +971 58 548 76 65، البريد الإلكتروني: sales@genosys.ae. موجود في دبي، الإمارات.',
  keywords: 'اتصل بنا GENOSYS، اتصال مستحضرات التجميل الإمارات، مستحضرات التجميل الكورية الإمارات، موزع العناية بالبشرة دبي، رقم هاتف GENOSYS',
  openGraph: {
    title: 'اتصل بنا - GENOSYS Middle East FZ-LLC | تواصل معنا',
    description: 'تواصل مع شركة GENOSYS الشرق الأوسط FZ-LLC لمستحضرات التجميل الكورية الاحترافية. الهاتف: +971 58 548 76 65، البريد الإلكتروني: sales@genosys.ae.',
    type: 'website',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-logo.png',
        width: 400,
        height: 400,
        alt: 'اتصال GENOSYS Middle East FZ-LLC',
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
    title: 'اتصل بنا - GENOSYS Middle East FZ-LLC | تواصل معنا',
    description: 'تواصل مع شركة GENOSYS الشرق الأوسط FZ-LLC لمستحضرات التجميل الكورية الاحترافية. الهاتف: +971 58 548 76 65، البريد الإلكتروني: sales@genosys.ae.',
    images: ['https://genosys.ae/images/genosys-logo.png'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/contact',
    languages: {
      'ar': 'https://genosys.ae/ar/contact',
      'en': 'https://genosys.ae/contact',
      'ru': 'https://genosys.ae/ru/contact',
    },
  },
}

export default function ArabicContactPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'اتصل بنا', url: '/ar/contact' }
        ]}
      />
      <ContactClient />
    </>
  )
}
