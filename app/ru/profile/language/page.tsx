import type { Metadata } from 'next'
import LanguagePage from '../../../profile/language/page'

export const metadata: Metadata = {
  title: 'Язык | GENOSYS',
  description: 'Выберите ваш предпочтительный язык для приложения GENOSYS',
  robots: {
    index: false,
    follow: true,
  },
}

export default function RussianLanguagePage() {
  return <LanguagePage />
}


