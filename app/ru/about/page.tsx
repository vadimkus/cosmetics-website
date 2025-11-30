import type { Metadata } from 'next'
import AboutPageClient from '../../about/AboutPageClient'

export const metadata: Metadata = {
  title: 'О нас - GENOSYS Middle East FZ-LLC | Официальный дистрибьютор корейской дерматокосметики',
  description: 'Узнайте о GENOSYS Middle East FZ-LLC, официальном дистрибьюторе DTSMG Co., Ltd Korea в ОАЭ. Профессиональная корейская дерматокосметика с сертификацией муниципалитета Дубая.',
  keywords: 'GENOSYS Ближний Восток, дистрибьютор корейской дерматокосметики, DTSMG Корея, сертифицировано муниципалитетом Дубая, дистрибьютор косметики ОАЭ',
  openGraph: {
    title: 'О нас - GENOSYS Middle East FZ-LLC | Официальный дистрибьютор корейской дерматокосметики',
    description: 'Узнайте о GENOSYS Middle East FZ-LLC, официальном дистрибьюторе DTSMG Co., Ltd Korea в ОАЭ. Профессиональная корейская дерматокосметика с сертификацией муниципалитета Дубая.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-logo.png',
        width: 400,
        height: 400,
        alt: 'Логотип GENOSYS Middle East FZ-LLC',
      },
    ],
    url: 'https://genosys.ae/ru/about',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'ru_AE',
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
    title: 'О нас - GENOSYS Middle East FZ-LLC | Официальный дистрибьютор корейской дерматокосметики',
    description: 'Узнайте о GENOSYS Middle East FZ-LLC, официальном дистрибьюторе DTSMG Co., Ltd Korea в ОАЭ.',
    images: ['/images/genosys-logo.png'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/about',
    languages: {
      'en': 'https://genosys.ae/about',
      'ar': 'https://genosys.ae/ar/about',
      'ru': 'https://genosys.ae/ru/about',
    },
  },
}

export default function RussianAboutPage() {
  return <AboutPageClient />
}



