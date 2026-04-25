import type { Metadata } from 'next'
import ContactClient from '../../contact/ContactClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'Свяжитесь с нами - GENOSYS Middle East FZ-LLC | Genosys.ae',
  description: 'Свяжитесь с GENOSYS Middle East FZ-LLC для профессиональной корейской дерматокосметики. Телефон: +971 58 548 76 65, Email: sales@genosys.ae. Расположены в Дубае, ОАЭ.',
  keywords: [
    'связаться с GENOSYS',
    'контакты косметика ОАЭ',
    'корейская дерматокосметика ОАЭ',
    'дистрибьютор косметики Дубай',
    'телефон GENOSYS',
  ],
  openGraph: {
    title: 'Свяжитесь с нами - GENOSYS Middle East FZ-LLC',
    description: 'Свяжитесь с GENOSYS Middle East FZ-LLC для профессиональной корейской дерматокосметики. Телефон: +971 58 548 76 65, Email: sales@genosys.ae.',
    type: 'website',
    url: 'https://genosys.ae/ru/contact',
    siteName: 'GENOSYS',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-logo.png',
        width: 400,
        height: 200,
        alt: 'Контакты GENOSYS',
      },
    ],
    locale: 'ru_RU',
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
    title: 'Свяжитесь с нами - GENOSYS Middle East FZ-LLC',
    description: 'Свяжитесь с GENOSYS для профессиональной корейской дерматокосметики. Телефон: +971 58 548 76 65, Email: sales@genosys.ae.',
    images: ['https://genosys.ae/images/genosys-logo.png'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/contact',
    languages: {
      'en': 'https://genosys.ae/contact',
      'ar': 'https://genosys.ae/ar/contact',
      'ru': 'https://genosys.ae/ru/contact',
    },
  },
}

export default function RussianContactPage() {
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
