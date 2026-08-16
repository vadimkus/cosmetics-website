import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import TrainingLibrary from '@/app/training/TrainingLibrary'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Профессиональное обучение - Обучение GENOSYS уходу за кожей',
  description: 'Профессиональные обучающие материалы GENOSYS по уходу за кожей. Скачайте учебные документы, смотрите видеоуроки и освойте профессиональные техники корейской дерматокосметики.',
  keywords: [
    'Обучение GENOSYS',
    'обучение профессиональному уходу за кожей',
    'обучение корейской дерматокосметике',
    'обучение микронидлингу',
    'обучение уходу за кожей ОАЭ'
  ],
  openGraph: {
    title: 'Профессиональное обучение - Обучение GENOSYS уходу за кожей',
    description: 'Профессиональные обучающие материалы GENOSYS по уходу за кожей. Скачайте учебные документы, смотрите видеоуроки и освойте профессиональные техники.',
    type: 'website',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-logo.png',
        width: 400,
        height: 200,
        alt: 'Профессиональное обучение GENOSYS',
      },
    ],
    url: 'https://genosys.ae/ru/training',
    siteName: 'GENOSYS',
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
    title: 'Профессиональное обучение - Обучение GENOSYS уходу за кожей',
    description: 'Профессиональные обучающие материалы GENOSYS по уходу за кожей. Скачайте учебные документы, смотрите видеоуроки и освойте профессиональные техники.',
    images: ['https://genosys.ae/images/genosys-logo.png'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/training',
    languages: {
      'en': 'https://genosys.ae/training',
      'ar': 'https://genosys.ae/ar/training',
      'ru': 'https://genosys.ae/ru/training',
    },
  },
}


export default function RussianTrainingPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Обучение', url: '/ru/training' }
        ]}
      />
      <TrainingLibrary />
    </>
  )
}
