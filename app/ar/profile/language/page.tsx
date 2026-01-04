import type { Metadata } from 'next'
import LanguagePage from '../../../profile/language/page'

export const metadata: Metadata = {
  title: 'اللغة | GENOSYS',
  description: 'اختر لغتك المفضلة لتطبيق GENOSYS',
  robots: {
    index: false,
    follow: true,
  },
}

export default function ArabicLanguagePage() {
  return <LanguagePage />
}


