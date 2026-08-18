import Link from 'next/link'
import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { buildUrl } from '@/lib/siteConfig'
import { SEO_LANDING_PAGES } from '@/lib/seoLandingPages'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

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
    <div className={`cera-page genosys-page ${ceraSerif.variable} cera-page genosys-page ${ceraSerif.variable} bg-white min-h-screen`}>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
        ]}
      />

      <main className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--cera-rose-ink)]">
          UAE Skincare Guides
        </p>
        <h1 className="cera-serif mt-3 max-w-3xl text-4xl tracking-tight text-[var(--cera-ink)] md:text-5xl">
          Professional Korean Dermacosmetics Guides
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--cera-body)]">
          Focused guides for Dubai and UAE customers, clinics, salons, and skincare professionals researching GENOSYS products and routines.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {SEO_LANDING_PAGES.map(page => (
            <Link
              key={page.slug}
              href={`/guides/${page.slug}`}
              className="rounded-2xl border border-[var(--cera-line)] bg-[var(--cera-cream-deep)] p-6 transition hover:border-[var(--cera-blush-deep)] hover:bg-white hover:shadow-md"
            >
              <h2 className="cera-serif text-xl text-[var(--cera-ink)]">{page.h1}</h2>
              <p className="mt-3 leading-7 text-[var(--cera-body)]">{page.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
