import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { buildUrl } from '@/lib/siteConfig'
import { SEO_LANDING_PAGES, getSeoLandingPage } from '@/lib/seoLandingPages'

type GuidePageProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400

export function generateStaticParams() {
  return SEO_LANDING_PAGES.map(page => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params
  const page = getSeoLandingPage(slug)

  if (!page) {
    return {
      title: 'Guide Not Found | GENOSYS',
      robots: { index: false, follow: false },
    }
  }

  const url = buildUrl(`/guides/${page.slug}`)

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'article',
      url,
      siteName: 'GENOSYS',
      locale: 'en_AE',
      images: [
        {
          url: buildUrl('/images/genosys-products.jpg'),
          width: 1200,
          height: 630,
          alt: page.h1,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [buildUrl('/images/genosys-products.jpg')],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function SeoGuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const page = getSeoLandingPage(slug)

  if (!page) {
    notFound()
  }

  const pageUrl = buildUrl(`/guides/${page.slug}`)

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.h1,
    headline: page.h1,
    description: page.description,
    url: pageUrl,
    inLanguage: 'en-AE',
    about: page.keywords.map(keyword => ({ '@type': 'Thing', name: keyword })),
    publisher: {
      '@type': 'Organization',
      name: 'GENOSYS Middle East FZ-LLC',
      url: buildUrl('/'),
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
          { name: page.h1, url: `/guides/${page.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema, null, 2) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema, null, 2) }}
      />

      <article className="mx-auto max-w-5xl px-4 py-12 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
          {page.eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
          {page.h1}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
          {page.intro}
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {page.sections.map(section => (
            <section key={section.heading} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <h2 className="text-xl font-semibold text-gray-950">{section.heading}</h2>
              <p className="mt-3 leading-7 text-gray-600">{section.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-950">Recommended Next Steps</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {page.links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-md"
              >
                <span className="font-semibold text-primary-700">{link.label}</span>
                <p className="mt-2 text-sm leading-6 text-gray-600">{link.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-primary-50 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-950">Quick Answers</h2>
          <div className="mt-5 space-y-5">
            {page.faq.map(item => (
              <div key={item.question}>
                <h3 className="font-semibold text-gray-950">{item.question}</h3>
                <p className="mt-2 leading-7 text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-gray-950 p-6 text-white md:p-8">
          <h2 className="text-2xl font-bold">Need product guidance?</h2>
          <p className="mt-3 max-w-2xl text-gray-300">
            Contact GENOSYS Middle East for product recommendations, professional training, or clinic partnership support in the UAE.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/products" className="rounded-full bg-white px-5 py-3 text-center font-semibold text-gray-950">
              Shop Products
            </Link>
            <Link href="/contact" className="rounded-full border border-white/30 px-5 py-3 text-center font-semibold text-white">
              Contact GENOSYS UAE
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}
