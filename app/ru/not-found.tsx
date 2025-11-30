import ErrorPage from '@/components/ErrorPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Страница не найдена - 404 | GENOSYS Middle East FZ-LLC',
  description: 'Запрашиваемая страница не найдена. Возможно, она была перемещена, удалена, или вы ввели неправильный URL.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Страница не найдена - 404 | GENOSYS Middle East FZ-LLC',
    description: 'Запрашиваемая страница не найдена. Возможно, она была перемещена, удалена, или вы ввели неправильный URL.',
    type: 'website',
    url: 'https://genosys.ae/ru/not-found',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'ru_AE',
  },
  twitter: {
    card: 'summary',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'Страница не найдена - 404',
    description: 'Запрашиваемая страница не найдена.',
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/not-found',
    languages: {
      'en': 'https://genosys.ae/not-found',
      'ar': 'https://genosys.ae/ar/not-found',
      'ru': 'https://genosys.ae/ru/not-found',
    },
  },
}

export default function RussianNotFound() {
  return (
    <ErrorPage
      type="not-found"
      showRetry={false}
      showBack={false}
      showHome={true}
    />
  )
}



