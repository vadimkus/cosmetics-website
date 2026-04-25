import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, MapPin, ShieldCheck, Sparkles } from 'lucide-react'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import PartnersList from '@/components/partners/PartnersList'
import PartnersSchema from '@/components/schema/PartnersSchema'
import { partnersData } from '@/lib/partners'

export const metadata: Metadata = {
  title: 'Партнеры GENOSYS в ОАЭ - Надежные дистрибьюторы корейской дерматокосметики',
  description: 'Откройте для себя сеть надежных партнеров GENOSYS по всему ОАЭ. Дистрибьюторы профессиональной корейской дерматокосметики в Дубае, Абу-Даби, Шардже и других городах. Найдите авторизованных розничных продавцов GENOSYS рядом с вами.',
  keywords: [
    'Партнеры GENOSYS ОАЭ',
    'Дистрибьюторы корейской дерматокосметики Дубай',
    'Авторизованные розничные продавцы GENOSYS',
    'Партнеры профессионального ухода за кожей ОАЭ',
    'Дистрибьюторы корейской красоты',
    'Партнеры дерматокосметики Дубай',
    'Поставщики GENOSYS ОАЭ',
    'Дистрибьюторы корейского ухода за кожей',
    'Партнеры салонов красоты Дубай',
    'Партнеры эстетических клиник ОАЭ'
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
    title: 'Партнеры GENOSYS в ОАЭ - Надежные дистрибьюторы корейской дерматокосметики',
    description: 'Найдите авторизованных партнеров GENOSYS по всему ОАЭ. Дистрибьюторы профессиональной корейской дерматокосметики в Дубае, Абу-Даби, Шардже и всех эмиратах.',
    type: 'website',
    url: 'https://genosys.ae/ru/partners',
    siteName: 'GENOSYS',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Сеть партнеров GENOSYS в ОАЭ',
      },
    ],
    locale: 'ru_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'Партнеры GENOSYS в ОАЭ - Надежные дистрибьюторы корейской дерматокосметики',
    description: 'Найдите авторизованных партнеров GENOSYS по всему ОАЭ. Дистрибьюторы профессиональной корейской дерматокосметики.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/partners',
    languages: {
      'en': 'https://genosys.ae/partners',
      'ar': 'https://genosys.ae/ar/partners',
      'ru': 'https://genosys.ae/ru/partners',
    },
  },
}

export default function RussianPartnersPage() {
  const partnerCount = partnersData.length
  const certifiedCount = partnersData.filter((p) => p.certificateUrl).length

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Партнеры', url: '/ru/partners' }
        ]}
      />
      <PartnersSchema />
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-3 md:px-4 py-4 md:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-xs md:text-sm text-gray-500 mb-2 md:mb-4" aria-label="Breadcrumb">
              <Link href="/ru" className="hover:text-gray-900 transition-colors">Главная</Link>
              <span className="mx-1.5">/</span>
              <span className="text-gray-900">Партнёры</span>
            </nav>

            <Link href="/ru" className="inline-flex items-center gap-1 text-xs md:text-sm text-gray-600 hover:text-gray-900 mb-6 md:mb-10">
              <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
              <span>На главную</span>
            </Link>

            {/* Editorial hero */}
            <header className="mb-8 md:mb-14">
              <p className="text-[11px] md:text-xs font-mono uppercase tracking-[0.32em] text-gray-500">
                НАША СЕТЬ · ОАЭ
              </p>
              <h1 className="mt-3 max-w-4xl text-3xl md:text-5xl lg:text-[3.4rem] font-semibold leading-[1.05] tracking-tight text-gray-900">
                Доверенные партнёры GENOSYS
              </h1>
              <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-gray-600">
                Тщательно отобранные салоны, клиники и спа, которые проводят профессиональные корейские протоколы GENOSYS по всем ОАЭ с 2019 года.
              </p>

              <dl className="mt-8 hidden md:grid md:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200">
                <div className="bg-white px-6 py-5">
                  <dt className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500">
                    <Sparkles className="h-3.5 w-3.5 text-red-600" />
                    партнёров и точек
                  </dt>
                  <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
                    {partnerCount}+
                  </dd>
                </div>
                <div className="bg-white px-6 py-5">
                  <dt className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500">
                    <MapPin className="h-3.5 w-3.5 text-red-600" />
                    все семь эмиратов
                  </dt>
                  <dd className="mt-2 flex items-baseline gap-2 text-3xl font-semibold tracking-tight text-gray-900">
                    <span>7</span>
                    <span className="text-sm font-medium text-gray-500">
                      покрытие по всей стране
                    </span>
                  </dd>
                  <p className="mt-1.5 text-[11px] leading-snug text-gray-500">
                    Дубай · Абу-Даби · Шарджа · Аджман · РАК · Фуджейра · Умм-эль-Кайвайн
                  </p>
                </div>
                <div className="bg-white px-6 py-5">
                  <dt className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-red-600" />
                    сертифицированные реселлеры
                  </dt>
                  <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
                    {certifiedCount}
                    <span className="ml-2 align-middle text-sm font-medium text-gray-500">
                      с 2019
                    </span>
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-2 md:hidden">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1 text-[11px] font-semibold text-white">
                  <Sparkles className="h-3 w-3" />
                  {partnerCount}+ партнёров
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-700">
                  <MapPin className="h-3 w-3" /> Все 7 эмиратов
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                  <ShieldCheck className="h-3 w-3" />
                  с 2019
                </span>
              </div>
            </header>

            <PartnersList />

            {/* Become a partner CTA */}
            <section className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-gray-900 bg-gray-900 text-white">
              <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-red-500/30 blur-3xl" />
              <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />
              <div className="relative grid gap-6 px-6 py-8 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-10 md:px-12 md:py-14">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.32em] text-red-300">
                    СОТРУДНИЧЕСТВО
                  </p>
                  <h2 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight">
                    Хотите стать партнёром GENOSYS?
                  </h2>
                  <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-gray-300">
                    Мы сотрудничаем с салонами, клиниками и спа, которые ставят на первое место здоровье кожи и подтверждённые результаты. Расскажем о профессиональной линейке, обучении и маркетинговой поддержке.
                  </p>
                </div>
                <div className="flex flex-col gap-3 md:items-start">
                  <Link
                    href="/ru/contact"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-red-50 hover:text-red-700"
                  >
                    <span>Связаться с нами</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/ru/products"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/60"
                  >
                    Посмотреть продукцию
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
