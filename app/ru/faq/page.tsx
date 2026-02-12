import FAQClient from '../../faq/FAQClient'
import { prisma } from '@/lib/prisma'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import GeoFaqSchema, { GENOSYS_FAQ_RU } from '@/components/schema/GeoFaqSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - Часто задаваемые вопросы | GENOSYS Middle East FZ-LLC',
  description: 'FAQ о корейской дерматокосметике GENOSYS, доставке, заказах, продуктах и профессиональном обучении в ОАЭ. Получите ответы о продуктах для ухода за кожей, доставке и услугах.',
  keywords: [
    'FAQ GENOSYS',
    'вопросы корейской косметики',
    'доставка ОАЭ',
    'вопросы профессионального ухода за кожей',
    'поддержка GENOSYS',
    'вопросы ухода за кожей ОАЭ'
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
    title: 'FAQ - Часто задаваемые вопросы | GENOSYS Middle East FZ-LLC',
    description: 'FAQ о корейской дерматокосметике GENOSYS, доставке, заказах, продуктах и профессиональном обучении в ОАЭ.',
    type: 'website',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Часто задаваемые вопросы GENOSYS - FAQ',
      },
    ],
    url: 'https://genosys.ae/ru/faq',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'ru_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'FAQ - Часто задаваемые вопросы | GENOSYS Middle East FZ-LLC',
    description: 'FAQ о корейской дерматокосметике GENOSYS, доставке, заказах и профессиональном обучении в ОАЭ.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/faq',
    languages: {
      'en': 'https://genosys.ae/faq',
      'ar': 'https://genosys.ae/ar/faq',
      'ru': 'https://genosys.ae/ru/faq',
    },
  },
}

export default async function RussianFAQPage() {
  const faqItems = await prisma.faqItem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      questionEn: true,
      answerEn: true,
      questionAr: true,
      answerAr: true,
      questionRu: true,
      answerRu: true,
    },
  })

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Вопросы и ответы', url: '/ru/faq' }
        ]}
      />
      <GeoFaqSchema items={GENOSYS_FAQ_RU} pageUrl="/ru/faq" language="ru" />
      <FAQClient faqItems={faqItems} />
    </>
  )
}



