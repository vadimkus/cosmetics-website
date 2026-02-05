import Hero from '@/components/Hero'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import MobileRedirect from '@/components/MobileRedirect'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GENOSYS Middle East FZ-LLC | Официальный дистрибьютор корейской дерматокосметики в ОАЭ',
  description: 'Официальный дистрибьютор профессиональной корейской дерматокосметики GENOSYS в ОАЭ. Премиальные устройства для микронидлинга, продукты для ухода за кожей и косметические процедуры. Бесплатная доставка при заказе свыше 1000 дирхамов. Дубай, Абу-Даби, Шарджа.',
  keywords: [
    'GENOSYS ОАЭ',
    'Корейская дерматокосметика Дубай',
    'Профессиональный уход за кожей ОАЭ',
    'Устройства для микронидлинга Дубай',
    'Корейские продукты красоты ОАЭ',
    'Дистрибьютор GENOSYS ОАЭ',
    'Профессиональный уход за кожей Дубай',
    'Корейская косметика Абу-Даби',
    'Дерматокосметика Шарджа',
    'Косметические устройства ОАЭ',
    'GENOSYS Ближний Восток',
    'Корейский уход за кожей ОАЭ'
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
    title: 'GENOSYS Middle East FZ-LLC | Официальный дистрибьютор корейской дерматокосметики в ОАЭ',
    description: 'Официальный дистрибьютор профессиональной корейской дерматокосметики GENOSYS в ОАЭ. Премиальные устройства для микронидлинга, продукты для ухода за кожей и косметические процедуры. Бесплатная доставка при заказе свыше 1000 дирхамов.',
    type: 'website',
    url: 'https://genosys.ae/ru',
    siteName: 'GENOSYS Middle East FZ-LLC',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Премиальная корейская дерматокосметика GENOSYS',
      },
    ],
    locale: 'ru_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'GENOSYS Middle East FZ-LLC | Официальный дистрибьютор корейской дерматокосметики в ОАЭ',
    description: 'Откройте для себя премиальную корейскую дерматокосметику от GENOSYS. Официальный дистрибьютор в ОАЭ.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru',
    languages: {
      'en': 'https://genosys.ae',
      'ar': 'https://genosys.ae/ar',
      'ru': 'https://genosys.ae/ru',
    },
  },
}

export default function RussianHome() {
  return (
    <MobileRedirect to="/ru/products">
      <div className="bg-white" dir="ltr">
        <BreadcrumbSchema 
          items={[
            { name: 'Главная', url: '/ru' }
          ]}
        />
        <Hero initialLocale="ru" initialDir="ltr" />
      </div>
    </MobileRedirect>
  )
}



