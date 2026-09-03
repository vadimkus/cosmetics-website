import Link from 'next/link'
import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { buildUrl } from '@/lib/siteConfig'
import { SEO_LANDING_PAGES_AR } from '@/lib/seoLandingPagesAr'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'أدلة GENOSYS للعناية بالبشرة في الإمارات | مستحضرات تجميل كورية دبي',
  description: 'أدلة عملية للعناية بالبشرة لعملاء وعيادات الإمارات: العناية الكورية في دبي، أجهزة الوخز الدقيق بالإبر، الحماية من الشمس، علاج حب الشباب، التصبغات، ومعلومات موزع GENOSYS.',
  alternates: {
    canonical: buildUrl('/ar/guides'),
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

export default function ArabicGuidesPage() {
  return (
    <div className={`cera-page genosys-page cera-page genosys-page bg-white min-h-screen`} dir="rtl">
      <BreadcrumbSchema
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'الأدلة', url: '/ar/guides' },
        ]}
      />

      <main className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--cera-rose-ink)]">
          أدلة العناية بالبشرة في الإمارات
        </p>
        <h1 className="cera-serif mt-3 max-w-3xl text-4xl tracking-tight text-[var(--cera-ink)] md:text-5xl">
          أدلة مستحضرات التجميل الكورية الاحترافية
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--cera-body)]">
          أدلة مركّزة لعملاء دبي والإمارات والعيادات والصالونات ومتخصصي العناية بالبشرة الباحثين عن منتجات GENOSYS وروتيناتها.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {SEO_LANDING_PAGES_AR.map(page => (
            <Link
              key={page.slug}
              href={`/ar/guides/${page.slug}`}
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
