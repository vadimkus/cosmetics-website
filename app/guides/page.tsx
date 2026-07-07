import Link from 'next/link'
import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { buildUrl } from '@/lib/siteConfig'
import { SEO_LANDING_PAGES } from '@/lib/seoLandingPages'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'GENOSYS UAE Skincare Guides | Korean Dermacosmetics Dubai',
  description: 'Commercial skincare guides for UAE customers and clinics: Korean skincare Dubai, microneedling devices, SPF, acne care, pigmentation, and GENOSYS distributor information.',
  alternates: {
    canonical: buildUrl('/guides'),
    languages: {
      en: buildUrl('/guides'),
      ar: buildUrl('/ar/guides'),
      ru: buildUrl('/ru/guides'),
      'x-default': buildUrl('/guides'),
    },
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function GuidesPage() {
  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
        ]}
      />

      <main className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
          UAE Skincare Guides
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
          Professional Korean Dermacosmetics Guides
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
          Focused guides for Dubai and UAE customers, clinics, salons, and skincare professionals researching GENOSYS products and routines.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {SEO_LANDING_PAGES.map(page => (
            <Link
              key={page.slug}
              href={`/guides/${page.slug}`}
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
