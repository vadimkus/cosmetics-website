'use client'

import { Phone, Globe, MapPin, FileText, BadgeCheck, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { Partner } from '@/types/partner'
import { useTranslation } from '@/hooks/useTranslation'

interface PartnerCardProps {
  partner: Partner
}

const themeClasses = {
  emerald: {
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    icon: "text-emerald-600",
    button: "bg-emerald-600 hover:bg-emerald-700",
    buttonBorder: "border-emerald-600 text-emerald-600 hover:bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700"
  },
  pink: {
    bg: "from-pink-50 to-rose-50",
    border: "border-pink-200",
    icon: "text-pink-600",
    button: "bg-pink-600 hover:bg-pink-700",
    buttonBorder: "border-pink-600 text-pink-600 hover:bg-pink-50",
    badge: "bg-pink-100 text-pink-700"
  },
  blue: {
    bg: "from-blue-50 to-indigo-50",
    border: "border-blue-200",
    icon: "text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
    buttonBorder: "border-blue-600 text-blue-600 hover:bg-blue-50",
    badge: "bg-blue-100 text-blue-700"
  },
  purple: {
    bg: "from-purple-50 to-violet-50",
    border: "border-purple-200",
    icon: "text-purple-600",
    button: "bg-purple-600 hover:bg-purple-700",
    buttonBorder: "border-purple-600 text-purple-600 hover:bg-purple-50",
    badge: "bg-purple-100 text-purple-700"
  }
}

export default function PartnerCard({ partner }: PartnerCardProps) {
  const { t, dir, locale } = useTranslation()
  const theme = themeClasses[partner.theme]
  const isInstagram = partner.website?.includes('instagram.com')
  const websiteButtonText = isInstagram ? t('common.instagram') : t('common.website')
  const isCertified = Boolean(partner.certificateUrl)
  const certifiedLabel =
    locale === 'ar' ? 'موزع معتمد' : locale === 'ru' ? 'Сертифицированный реселлер' : 'Certified reseller'

  return (
    <>
      {/* Mobile card (unchanged) */}
      <div
        className={`md:hidden bg-white rounded-lg shadow-sm border ${theme.border} overflow-hidden transition-all hover:shadow-md`}
        dir={dir}
      >
        {/* Compact gradient header */}
        <div className={`bg-gradient-to-r ${theme.bg} p-3 border-b ${theme.border}`}>
          <div className="flex items-start gap-2.5">
            <div className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border ${theme.border} flex-shrink-0`}>
              <Image
                src={partner.logo}
                alt={partner.name}
                width={32}
                height={32}
                className="object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <h3 className="text-sm font-bold text-gray-800 leading-tight mb-0.5 break-words">{partner.name}</h3>
              <p className="text-[10px] text-gray-600 leading-tight break-words">{partner.type}</p>
            </div>
          </div>
        </div>

        <div className="p-2.5">
          <div className="space-y-2">
            <div className="flex items-start gap-1.5" dir="ltr">
              <MapPin className={`h-3 w-3 ${theme.icon} flex-shrink-0 mt-0.5`} />
              <span className="text-[11px] text-gray-700 leading-none flex-1 text-left">{partner.location}</span>
            </div>
            {partner.phone && (
              <a
                href={`tel:${partner.phone.replace(/\s/g, '')}`}
                className={`flex items-center gap-1.5 ${dir === 'rtl' ? 'flex-row-reverse' : ''} group`}
              >
                <Phone className={`h-3 w-3 ${theme.icon} flex-shrink-0`} />
                <span className={`text-[11px] ${theme.icon} group-hover:underline break-all leading-none`}>
                  {partner.phone}
                </span>
              </a>
            )}
            {partner.website && (
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 ${dir === 'rtl' ? 'flex-row-reverse' : ''} group`}
              >
                <Globe className={`h-3 w-3 ${theme.icon} flex-shrink-0`} />
                <span className={`text-[11px] ${theme.icon} group-hover:underline break-all truncate leading-none`}>
                  {partner.website.replace('https://', '').replace('http://', '')}
                </span>
              </a>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-3">
            {partner.directions && (
              <a
                href={partner.directions}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-1.5 ${theme.button} text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors min-h-[40px] touch-manipulation`}
              >
                <MapPin className="h-3.5 w-3.5" />
                {t('common.directions')}
              </a>
            )}
            {partner.website && (
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-1.5 border ${theme.buttonBorder} px-3 py-2 rounded-lg text-xs font-semibold transition-colors min-h-[40px] touch-manipulation`}
              >
                <Globe className="h-3.5 w-3.5" />
                {websiteButtonText}
              </a>
            )}
            {partner.certificateUrl && (
              <a
                href={partner.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors min-h-[40px] touch-manipulation shadow-sm"
              >
                <FileText className="h-3.5 w-3.5" />
                {t('common.viewCertificate')}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Desktop card - editorial, uniform brand styling, grid-friendly */}
      <article
        className="group hidden md:flex relative h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.25)]"
        dir={dir}
      >
        {/* Brand accent rail - grows on hover */}
        <span
          aria-hidden
          className={`pointer-events-none absolute top-0 ${dir === 'rtl' ? 'right-0' : 'left-0'} h-full w-[3px] bg-gradient-to-b from-red-500 via-red-500 to-red-600 opacity-0 transition-all duration-300 group-hover:w-1 group-hover:opacity-100`}
        />

        {/* Header: logo + name + type + certified pill */}
        <div className="flex items-start gap-4 p-6 pb-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50/60">
            <Image
              src={partner.logo}
              alt={partner.name}
              width={44}
              height={44}
              className="object-contain"
            />
          </div>
          <div className={`min-w-0 flex-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
            <h3 className="text-[15px] font-semibold leading-snug text-gray-900 line-clamp-2">
              {partner.name}
            </h3>
            <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{partner.type}</p>
            {isCertified && (
              <span
                className={`mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 ring-1 ring-inset ring-amber-200 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                <BadgeCheck className="h-3 w-3" />
                {certifiedLabel}
              </span>
            )}
          </div>
        </div>

        {/* Hairline divider */}
        <div className="mx-6 h-px bg-gray-100" />

        {/* Contact rows */}
        <div className="flex flex-1 flex-col gap-2.5 p-6 pt-4 text-sm text-gray-600">
          <div className={`flex items-start gap-2 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className="leading-relaxed line-clamp-2">{partner.location}</span>
          </div>

          {partner.phone && (
            <a
              href={`tel:${partner.phone.replace(/\s/g, '')}`}
              dir="ltr"
              className={`group/row flex items-center gap-2 transition-colors hover:text-red-600 ${dir === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}
            >
              <Phone className="h-4 w-4 flex-shrink-0 text-gray-400 transition-colors group-hover/row:text-red-600" />
              <span className="font-medium tabular-nums">{partner.phone}</span>
            </a>
          )}

          {partner.website && (
            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`group/row flex items-center gap-2 transition-colors hover:text-red-600 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <Globe className="h-4 w-4 flex-shrink-0 text-gray-400 transition-colors group-hover/row:text-red-600" />
              <span className="truncate">
                {partner.website.replace('https://', '').replace('http://', '').replace(/\/$/, '')}
              </span>
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 flex-shrink-0 text-gray-300 transition-all group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-red-600" />
            </a>
          )}
        </div>

        {/* Action footer */}
        <div className="flex items-center gap-2 border-t border-gray-100 bg-gray-50/40 px-4 py-3">
          {partner.directions && (
            <a
              href={partner.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-black"
            >
              <MapPin className="h-3.5 w-3.5" />
              {t('common.directions')}
            </a>
          )}
          {partner.website && (
            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-800 transition-all hover:border-gray-900 hover:text-gray-900"
            >
              <Globe className="h-3.5 w-3.5" />
              {websiteButtonText}
            </a>
          )}
          {partner.certificateUrl && (
            <a
              href={partner.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('common.viewCertificate')}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-amber-600"
            >
              <FileText className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </article>
    </>
  )
}
