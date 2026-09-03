'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, MapPin, ShieldCheck, Sparkles } from 'lucide-react'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import PartnersList from '@/components/partners/PartnersList'
import PartnersSchema from '@/components/schema/PartnersSchema'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { partnersData } from '@/lib/partners'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

export default function ArabicPartnersPageClient() {
  const { t, locale, dir } = useTranslation()
  const isRTL = dir === 'rtl'
  const partnerCount = partnersData.length
  const certifiedCount = partnersData.filter((p) => p.certificateUrl).length

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: t('navigation.home'), url: getLocalizedPath('/', locale) },
          { name: t('navigation.partners'), url: getLocalizedPath('/partners', locale) },
        ]}
      />
      <PartnersSchema />
      <div className={`cera-page genosys-page min-h-screen`} dir={dir}>
        <PageBreadcrumb
          items={[
            { name: t('navigation.home'), href: getLocalizedPath('/', locale) },
            { name: t('navigation.partners') },
          ]}
        />

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <Link
              href={getLocalizedPath('/', locale)}
              className={`inline-flex items-center gap-1 text-xs md:text-sm text-[var(--cera-body)] hover:text-[var(--cera-ink)] mb-6 md:mb-10 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${isRTL ? 'rotate-180' : ''}`} />
              <span>{t('common.backToHome')}</span>
            </Link>

            {/* Editorial hero */}
            <header className="mb-8 md:mb-14">
              <p className="text-[11px] md:text-xs font-mono uppercase tracking-[0.32em] text-[var(--cera-muted)]">
                شبكتنا · الإمارات
              </p>
              <h1 className="cera-serif mt-3 max-w-4xl text-3xl md:text-5xl lg:text-[3.4rem] leading-[1.05] tracking-tight text-[var(--cera-ink)]">
                شركاء GENOSYS الموثوقون
              </h1>
              <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-[var(--cera-body)]">
                صالونات وعيادات وسبا منتقاة بعناية تقدم بروتوكولات GENOSYS الكورية الاحترافية في جميع أنحاء الإمارات منذ عام 2019.
              </p>

              <dl className="mt-8 hidden md:grid md:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[var(--cera-line)] bg-[var(--cera-cream-deep)]">
                <div className="bg-white px-6 py-5">
                  <dt className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--cera-muted)]">
                    <Sparkles className="h-3.5 w-3.5 text-[var(--cera-rose-ink)]" />
                    شريك ومنشأة
                  </dt>
                  <dd className="mt-2 text-3xl font-semibold tracking-tight text-[var(--cera-ink)]">
                    {partnerCount}+
                  </dd>
                </div>
                <div className="bg-white px-6 py-5">
                  <dt className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--cera-muted)]">
                    <MapPin className="h-3.5 w-3.5 text-[var(--cera-rose-ink)]" />
                    كل الإمارات السبع
                  </dt>
                  <dd className="mt-2 flex items-baseline gap-2 text-3xl font-semibold tracking-tight text-[var(--cera-ink)]">
                    <span>7</span>
                    <span className="text-sm font-medium text-[var(--cera-muted)]">
                      تغطية على مستوى الإمارات
                    </span>
                  </dd>
                  <p className="mt-1.5 text-[11px] leading-snug text-[var(--cera-muted)]">
                    دبي · أبوظبي · الشارقة · عجمان · رأس الخيمة · الفجيرة · أم القيوين
                  </p>
                </div>
                <div className="bg-white px-6 py-5">
                  <dt className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--cera-muted)]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[var(--cera-rose-ink)]" />
                    موزعون معتمدون رسميًا
                  </dt>
                  <dd className="mt-2 text-3xl font-semibold tracking-tight text-[var(--cera-ink)]">
                    {certifiedCount}
                    <span className="mr-2 align-middle text-sm font-medium text-[var(--cera-muted)]">
                      منذ 2019
                    </span>
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-2 md:hidden">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cera-cta)] px-3 py-1 text-[11px] font-semibold text-white">
                  <Sparkles className="h-3 w-3" />
                  {partnerCount}+ شريك
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cera-cream-deep)] px-3 py-1 text-[11px] font-semibold text-[var(--cera-body)]">
                  <MapPin className="h-3 w-3" /> كل الإمارات السبع
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cera-blush)] px-3 py-1 text-[11px] font-semibold text-[var(--cera-rose-ink)] ring-1 ring-inset ring-amber-200">
                  <ShieldCheck className="h-3 w-3" />
                  منذ 2019
                </span>
              </div>
            </header>

            <PartnersList />

            {/* Become a partner CTA */}
            <section className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[var(--cera-cta)] bg-[var(--cera-cta)] text-white">
              <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[var(--cera-rose)]/30 blur-3xl" />
              <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[var(--cera-ink)]/20 blur-3xl" />
              <div className="relative grid gap-6 px-6 py-8 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-10 md:px-12 md:py-14">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.32em] text-red-300">
                    دعوة للتعاون
                  </p>
                  <h2 className="cera-serif mt-3 text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight">
                    {t('partners.becomePartner')}
                  </h2>
                  <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-[var(--cera-blush-deep)]">
                    {t('partners.becomePartnerDescription')}
                  </p>
                </div>
                <div className="flex flex-col gap-3 md:items-end">
                  <Link
                    href={getLocalizedPath('/contact', locale)}
                    className="group inline-flex flex-row-reverse items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--cera-ink)] transition-all hover:bg-[var(--cera-blush)] hover:text-[var(--cera-rose-ink)]"
                  >
                    <span>{t('partners.contactUs')}</span>
                    <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-0.5" />
                  </Link>
                  <Link
                    href={getLocalizedPath('/products', locale)}
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/60"
                  >
                    {t('partners.viewProducts')}
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
