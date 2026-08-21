'use client'

import '@/components/product/cerabarrier/cerabarrier.css'
import './training.css'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Download, FileText, PlayCircle } from 'lucide-react'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import PDFDownloadButton from '@/components/PDFDownloadButton'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { getLocalizedPath } from '@/lib/i18n'
import { TRAINING_COPY } from './trainingCopy'
import {
  PRODUCT_SHEETS,
  TRAINING_GUIDES,
  TRAINING_VIDEOS,
  type ProductSheet,
  type TrainingGuide,
} from './trainingCatalogue'

/**
 * /training, /ru/training and /ar/training all render this.
 *
 * Before it existed each language carried its own hand-unrolled copy of the
 * library and they had drifted: English showed 6 video lessons, Russian 7 and
 * Arabic 11. One component over one data file means that cannot happen again.
 */
export default function TrainingLibrary({ embedded = false }: { embedded?: boolean }) {
  const { t, locale, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()

  const copy = TRAINING_COPY[(locale as 'en' | 'ar' | 'ru') ?? 'en'] ?? TRAINING_COPY.en
  const rtl = dir === 'rtl'

  // In the installed app a PDF opens in the in-app viewer rather than landing
  // in a downloads folder the user cannot reach, so the button says so.
  const fileAction = isPWA && isClient ? copy.view : copy.download

  const counts = [
    { value: TRAINING_GUIDES.length, label: copy.countGuides },
    { value: PRODUCT_SHEETS.length, label: copy.countSheets },
    { value: TRAINING_VIDEOS.length, label: copy.countVideos },
  ]

  function DocumentRow({ doc }: { doc: TrainingGuide | ProductSheet }) {
    const sheet = 'image' in doc ? doc : null

    return (
      <li className="training-row">
        {sheet ? (
          <Link
            href={getLocalizedPath(`/products/${sheet.productId}`, locale)}
            className="training-row__mark training-row__mark--shot"
            aria-label={sheet.title}
          >
            <Image src={sheet.image} alt="" width={44} height={44} className="h-full w-full object-cover" />
          </Link>
        ) : (
          <span className="training-row__mark" aria-hidden="true">
            <FileText className="h-[18px] w-[18px]" />
          </span>
        )}

        <div className="min-w-0 flex-1">
          {/* Both lines are Latin runs. Left to themselves inside an Arabic
              paragraph the bidi algorithm reorders them, which turned
              "39.9 MB" into "MB 9.9 3" on /ar/training. */}
          <p dir="ltr" className={`cera-serif truncate text-[15px] leading-snug text-[var(--cera-ink)] ${rtl ? 'text-right' : ''}`}>
            {doc.title}
          </p>
          <p dir="ltr" className={`cera-numeral mt-0.5 text-[12px] text-[var(--cera-muted)] ${rtl ? 'text-right' : ''}`}>
            {doc.size}
          </p>
        </div>

        <PDFDownloadButton href={doc.href} filename={doc.title} external className="training-pdf">
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          {fileAction}
        </PDFDownloadButton>
      </li>
    )
  }

  function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
    return (
      <header className="mb-7 max-w-[62ch] md:mb-9">
        <p className="cera-eyebrow mb-2.5">{eyebrow}</p>
        <h2 className="cera-serif text-[26px] leading-tight md:text-[38px]">{title}</h2>
        <p className="mt-2.5 text-[14.5px] leading-relaxed text-[var(--cera-muted)] md:text-[16px]">{lead}</p>
      </header>
    )
  }

  return (
    <div className={`cera-page training-page ${ceraSerif.variable} ${embedded ? '' : 'min-h-[100dvh]'}`} dir={dir}>
      {!embedded && (
        <PageBreadcrumb
          items={[
            { name: t('common.home'), href: getLocalizedPath('/', locale) },
            { name: copy.breadcrumb },
          ]}
        />
      )}

      <div className={embedded ? 'mx-auto max-w-[1120px]' : 'mx-auto max-w-[1120px] px-4 py-8 md:px-8 md:py-16'}>
        {!embedded ? (
          <>
            <Link
              href={getLocalizedPath('/', locale)}
              className={`mt-3 inline-flex items-center gap-1.5 text-[13px] text-[var(--cera-rose-ink)] transition-opacity hover:opacity-70 ${
                rtl ? 'flex-row-reverse' : ''
              }`}
            >
              <ArrowLeft className={`h-3.5 w-3.5 ${rtl ? 'rotate-180' : ''}`} />
              {copy.backHome}
            </Link>

            {/* ─────────────────────────────── Hero ─────────────────────────── */}
            <header className="mt-10 text-center md:mt-16">
              <p className="cera-eyebrow mb-3">{copy.eyebrow}</p>
              <h1 className="cera-serif text-[36px] leading-[1.05] md:text-[58px] lg:text-[68px]">{copy.title}</h1>
              <p className="mx-auto mt-5 max-w-[60ch] text-[15.5px] leading-relaxed text-[var(--cera-muted)] md:text-[17px]">
                {copy.lead}
              </p>

              <dl className="mt-10 flex items-start justify-center md:mt-12">
                {counts.map((count) => (
                  <div key={count.label} className="training-count text-center">
                    <dd className="cera-numeral text-[28px] leading-none text-[var(--cera-ink)] md:text-[36px]">
                      {count.value}
                    </dd>
                    <dt className="mt-2 text-[11.5px] leading-tight text-[var(--cera-muted)] md:text-[13px]">
                      {count.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </header>

            <div className="cera-rule mt-12 md:mt-16" />
          </>
        ) : (
          <dl className="flex items-start justify-center rounded-3xl border border-[var(--cera-line)] bg-white px-3 py-6 shadow-[0_12px_32px_-24px_rgba(23,20,15,0.22)]">
            {counts.map((count) => (
              <div key={count.label} className="training-count text-center">
                <dd className="cera-numeral text-[28px] leading-none text-[var(--cera-ink)] md:text-[36px]">
                  {count.value}
                </dd>
                <dt className="mt-2 text-[11.5px] leading-tight text-[var(--cera-muted)] md:text-[13px]">
                  {count.label}
                </dt>
              </div>
            ))}
          </dl>
        )}

        {/* ───────────────────────── Protocols and guides ─────────────────── */}
        <section className={embedded ? 'mt-10' : 'mt-12 md:mt-16'}>
          <SectionHead eyebrow={copy.guidesEyebrow} title={copy.guidesTitle} lead={copy.guidesLead} />
          <ul className="grid gap-2.5 md:grid-cols-2 md:gap-3">
            {TRAINING_GUIDES.map((doc) => (
              <DocumentRow key={doc.id} doc={doc} />
            ))}
          </ul>
        </section>

        {/* ──────────────────────────── Product sheets ────────────────────── */}
        <section className="mt-14 md:mt-20">
          <SectionHead eyebrow={copy.sheetsEyebrow} title={copy.sheetsTitle} lead={copy.sheetsLead} />
          <ul className="grid gap-2.5 md:grid-cols-2 md:gap-3">
            {PRODUCT_SHEETS.map((doc) => (
              <DocumentRow key={doc.id} doc={doc} />
            ))}
          </ul>
        </section>

        {/* ───────────────────────────── Filmed lessons ───────────────────── */}
        <section className="mt-14 md:mt-20">
          <SectionHead eyebrow={copy.videosEyebrow} title={copy.videosTitle} lead={copy.videosLead} />

          <div className="grid gap-5 md:grid-cols-2 md:gap-7">
            {TRAINING_VIDEOS.map((video) => (
              <article key={video.id} className="training-video">
                <div className="training-video__frame">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="p-4 md:p-5">
                  {/* Lesson titles are published in English in every locale. */}
                  <h3 dir="ltr" className={`cera-serif text-[17px] leading-snug md:text-[19px] ${rtl ? 'text-right' : ''}`}>
                    {video.title}
                  </h3>
                  <div className={`mt-3 flex flex-wrap items-center gap-2 ${rtl ? 'flex-row-reverse justify-end' : ''}`}>
                    <span className="training-pill cera-numeral">
                      {video.duration} {copy.minutes}
                    </span>
                    <span className="training-pill training-pill--level">
                      {video.level === 'advanced' ? copy.levelAdvanced : copy.levelProfessional}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="cera-rule mt-14 md:mt-20" />

        <p className="mx-auto mt-8 flex max-w-[62ch] items-start gap-3 text-[14.5px] leading-relaxed text-[var(--cera-muted)]">
          <PlayCircle className="mt-[3px] h-4 w-4 flex-none text-[var(--cera-rose)]" aria-hidden="true" />
          {copy.closing}
        </p>
      </div>
    </div>
  )
}
