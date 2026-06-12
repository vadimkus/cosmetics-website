import Link from 'next/link'
import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { buildUrl } from '@/lib/siteConfig'
import { SEO_LANDING_PAGES_RU } from '@/lib/seoLandingPagesRu'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Гиды GENOSYS по уходу за кожей в ОАЭ | Корейская дермакосметика Дубай',
  description: 'Практические гиды по уходу за кожей для клиентов и клиник в ОАЭ: корейская косметика в Дубае, аппараты для микронидлинга, SPF, уход при акне, пигментация и информация о дистрибьюторе GENOSYS.',
  alternates: {
    canonical: buildUrl('/ru/guides'),
    languages: {
      en: buildUrl('/guides'),
      ar: buildUrl('/ar/guides'),
      ru: buildUrl('/ru/guides'),
    },
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RussianGuidesPage() {
  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbSchema
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Гиды', url: '/ru/guides' },
        ]}
      />

      <main className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
          Гиды по уходу за кожей в ОАЭ
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
          Гиды по профессиональной корейской дермакосметике
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
          Тематические гиды для клиентов, клиник, салонов и специалистов по уходу за кожей в Дубае и ОАЭ, изучающих продукты и программы GENOSYS.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {SEO_LANDING_PAGES_RU.map(page => (
            <Link
              key={page.slug}
              href={`/ru/guides/${page.slug}`}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-6 transition hover:border-primary-300 hover:bg-white hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-950">{page.h1}</h2>
              <p className="mt-3 leading-7 text-gray-600">{page.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
