'use client'

import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { partnersData } from '@/lib/partners'
import { useTranslation } from '@/hooks/useTranslation'
import PartnerCard from './PartnerCard'

type AreaKey =
  | 'all'
  | 'marina'
  | 'downtown-difc'
  | 'jumeirah'
  | 'palm-bluewaters'
  | 'other-dubai'
  | 'abu-dhabi'
  | 'online'

type TypeKey = 'all' | 'salon' | 'clinic' | 'spa' | 'reseller'

interface AreaDef {
  key: AreaKey
  matchers: string[]
}

const AREA_MATCHERS: AreaDef[] = [
  { key: 'marina', matchers: ['marina', 'marsa dubai', 'jumeirah beach residence'] },
  { key: 'downtown-difc', matchers: ['downtown', 'difc', 'business bay', 'trade center', 'sheikh zayed'] },
  { key: 'palm-bluewaters', matchers: ['palm jumeirah', 'nakheel mall', 'bluewaters', 'blue waters'] },
  { key: 'jumeirah', matchers: ['jumeira', 'umm suqeim', 'al wasl', 'al athar'] },
  { key: 'abu-dhabi', matchers: ['abu dhabi', 'al ain', 'khalifa city', 'al bateen'] },
  { key: 'online', matchers: ['online'] },
]

function getAreaForLocation(location: string): AreaKey {
  const haystack = location.toLowerCase()
  for (const def of AREA_MATCHERS) {
    if (def.matchers.some((m) => haystack.includes(m))) {
      return def.key
    }
  }
  return 'other-dubai'
}

function matchesType(typeText: string, key: TypeKey): boolean {
  if (key === 'all') return true
  const t = typeText.toLowerCase()
  switch (key) {
    case 'salon':
      return /salon|beauty|nail|hair|brau|sugar|lounge/.test(t)
    case 'clinic':
      return /clinic|medical|aesthetic|dermat/.test(t)
    case 'spa':
      return /spa|wellness|massage|facial|body/.test(t)
    case 'reseller':
      return /reseller|distribut|store|online/.test(t)
    default:
      return true
  }
}

const AREA_LABELS: Record<AreaKey, { en: string; ru: string; ar: string }> = {
  all: { en: 'All areas', ru: 'Все районы', ar: 'كل المناطق' },
  marina: { en: 'Dubai Marina', ru: 'Дубай Марина', ar: 'دبي مارينا' },
  'downtown-difc': { en: 'Downtown & DIFC', ru: 'Даунтаун и DIFC', ar: 'وسط المدينة و DIFC' },
  jumeirah: { en: 'Jumeirah', ru: 'Джумейра', ar: 'جميرا' },
  'palm-bluewaters': { en: 'Palm & Bluewaters', ru: 'Палм и Bluewaters', ar: 'النخلة و Bluewaters' },
  'other-dubai': { en: 'Other Dubai', ru: 'Другие районы Дубая', ar: 'مناطق أخرى في دبي' },
  'abu-dhabi': { en: 'Abu Dhabi & Al Ain', ru: 'Абу-Даби и Аль-Айн', ar: 'أبوظبي والعين' },
  online: { en: 'Online', ru: 'Онлайн', ar: 'عبر الإنترنت' },
}

const TYPE_LABELS: Record<TypeKey, { en: string; ru: string; ar: string }> = {
  all: { en: 'All types', ru: 'Все типы', ar: 'كل الأنواع' },
  salon: { en: 'Beauty salons', ru: 'Салоны красоты', ar: 'صالونات تجميل' },
  clinic: { en: 'Aesthetic clinics', ru: 'Эстетические клиники', ar: 'عيادات تجميلية' },
  spa: { en: 'Spa & wellness', ru: 'Спа и wellness', ar: 'سبا وعافية' },
  reseller: { en: 'Resellers & online', ru: 'Реселлеры и онлайн', ar: 'موزعون وأونلاين' },
}

const SEARCH_PLACEHOLDER = {
  en: 'Search by name, area, or type…',
  ru: 'Поиск по названию, району или типу…',
  ar: 'ابحث بالاسم أو المنطقة أو النوع…',
}

const COUNT_LABEL = {
  en: (n: number) => `${n} ${n === 1 ? 'partner' : 'partners'}`,
  ru: (n: number) => {
    const mod10 = n % 10
    const mod100 = n % 100
    let word = 'партнёров'
    if (mod10 === 1 && mod100 !== 11) word = 'партнёр'
    else if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) word = 'партнёра'
    return `${n} ${word}`
  },
  ar: (n: number) => `${n} ${n === 1 ? 'شريك' : 'شركاء'}`,
}

const NO_RESULTS = {
  en: { title: 'No partners match these filters.', cta: 'Clear filters' },
  ru: { title: 'Нет партнёров по выбранным фильтрам.', cta: 'Сбросить фильтры' },
  ar: { title: 'لا يوجد شركاء يطابقون عوامل التصفية.', cta: 'إعادة تعيين' },
}

export default function PartnersList() {
  const { locale, dir } = useTranslation()
  const lang = (locale === 'ar' || locale === 'ru' ? locale : 'en') as 'en' | 'ru' | 'ar'

  const [query, setQuery] = useState('')
  const [area, setArea] = useState<AreaKey>('all')
  const [type, setType] = useState<TypeKey>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return partnersData.filter((p) => {
      if (q) {
        const haystack = `${p.name} ${p.type} ${p.location}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (area !== 'all') {
        const partnerArea = getAreaForLocation(p.location)
        if (partnerArea !== area) return false
      }
      if (type !== 'all' && !matchesType(p.type, type)) return false
      return true
    })
  }, [query, area, type])

  const hasActiveFilter = query.length > 0 || area !== 'all' || type !== 'all'

  return (
    <div className="mb-10 md:mb-14" dir={dir}>
      {/* Filter bar — desktop only */}
      <div className="hidden md:block sticky top-0 z-10 -mx-4 mb-8 border-y border-gray-100 bg-white/90 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-full max-w-sm flex-shrink-0">
            <Search
              className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 ${dir === 'rtl' ? 'right-3' : 'left-3'}`}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={SEARCH_PLACEHOLDER[lang]}
              aria-label={SEARCH_PLACEHOLDER[lang]}
              className={`w-full rounded-full border border-gray-200 bg-white py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className={`absolute top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 ${dir === 'rtl' ? 'left-2' : 'right-2'}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Result count */}
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-gray-500">
            {COUNT_LABEL[lang](filtered.length)}
          </span>

          {/* Reset */}
          {hasActiveFilter && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setArea('all')
                setType('all')
              }}
              className="ml-auto text-xs font-semibold text-gray-600 underline-offset-4 hover:text-gray-900 hover:underline"
            >
              {NO_RESULTS[lang].cta}
            </button>
          )}
        </div>

        {/* Area pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(Object.keys(AREA_LABELS) as AreaKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setArea(key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                area === key
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {AREA_LABELS[key][lang]}
            </button>
          ))}
        </div>

        {/* Type pills */}
        <div className="mt-2.5 flex flex-wrap gap-2">
          {(Object.keys(TYPE_LABELS) as TypeKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setType(key)}
              className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wide transition-all ${
                type === key
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:ring-gray-400'
              }`}
            >
              {TYPE_LABELS[key][lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile result count (subtle) */}
      <p className="md:hidden mb-3 text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500">
        {COUNT_LABEL[lang](filtered.length)}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {filtered.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-16 text-center">
          <p className="text-sm font-semibold text-gray-700">{NO_RESULTS[lang].title}</p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setArea('all')
              setType('all')
            }}
            className="mt-3 inline-flex items-center rounded-full bg-gray-900 px-5 py-2 text-xs font-semibold text-white hover:bg-black"
          >
            {NO_RESULTS[lang].cta}
          </button>
        </div>
      )}
    </div>
  )
}
