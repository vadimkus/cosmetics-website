'use client'

import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Search, X,
  Store, Sparkles, CreditCard, Truck, Smartphone, UserCircle, LayoutGrid,
  ChevronsDown, ChevronsUp, MessageCircle, Clock, BookOpen, Globe2,
} from 'lucide-react'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import PWAPageWrapper from '@/components/pwa/PWAPageWrapper'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { sanitizeHtml } from '@/lib/sanitize'
import { stripHtml } from '@/lib/sanitizeHtml'
import { toJsonLd } from '@/lib/jsonLd'
import { usePWAMode } from '@/hooks/usePWAMode'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'

interface FaqItemData {
  id: string
  category: string | null
  questionEn: string
  answerEn: string
  questionAr: string | null
  answerAr: string | null
  questionRu: string | null
  answerRu: string | null
}

type CategoryKey = 'all' | 'general' | 'products' | 'orders' | 'shipping' | 'app' | 'account'

const CATEGORIES: Record<CategoryKey, {
  en: string; ar: string; ru: string
  icon: typeof Store
}> = {
  all:      { en: 'All',                ar: 'الكل',              ru: 'Все',                  icon: LayoutGrid },
  general:  { en: 'About GENOSYS',      ar: 'عن GENOSYS',        ru: 'О GENOSYS',            icon: Store },
  products: { en: 'Products',           ar: 'المنتجات',          ru: 'Продукты',             icon: Sparkles },
  orders:   { en: 'Orders & Payment',   ar: 'الطلبات والدفع',    ru: 'Заказы и оплата',      icon: CreditCard },
  shipping: { en: 'Shipping',           ar: 'الشحن',             ru: 'Доставка',             icon: Truck },
  app:      { en: 'Mobile App',         ar: 'التطبيق',           ru: 'Приложение',           icon: Smartphone },
  account:  { en: 'Account & Support',  ar: 'الحساب والدعم',     ru: 'Аккаунт и поддержка',  icon: UserCircle },
}

const CATEGORY_ORDER: CategoryKey[] = ['all', 'general', 'products', 'orders', 'shipping', 'app', 'account']

const APP_STORE_URL = 'https://apps.apple.com/ae/app/genosys-uae/id6756648064'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=ae.genosys.app'

export default function FAQClient({ faqItems }: { faqItems: FaqItemData[] }) {
  const { t, locale, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandAll, setExpandAll] = useState(false)
  
  useEffect(() => {
    if (isClient) {
      setIsMobileWeb(window.innerWidth < 768 && !isPWA)
    }
  }, [isClient, isPWA])

  const faqs = useMemo(() => faqItems.map((item) => {
    let question = item.questionEn
    let answer = item.answerEn

    if (locale === 'ar' && item.questionAr) {
      question = item.questionAr
      answer = item.answerAr || item.answerEn
    } else if (locale === 'ru' && item.questionRu) {
      question = item.questionRu
      answer = item.answerRu || item.answerEn
    }

    return {
      id: item.id,
      category: (item.category || 'general') as CategoryKey,
      question,
      answer,
      // Plain-text copy of the answer for search — matching against raw HTML
      // would let tag/attribute names (e.g. "strong", "href") count as hits.
      answerText: stripHtml(answer),
    }
  }), [faqItems, locale])

  const availableCategories = useMemo(() => {
    const cats = new Set(faqs.map(f => f.category))
    return CATEGORY_ORDER.filter(c => c === 'all' || cats.has(c))
  }, [faqs])

  const filteredFaqs = useMemo(() => {
    let result = faqs

    if (activeCategory !== 'all') {
      result = result.filter(f => f.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(f =>
        f.question.toLowerCase().includes(q) ||
        f.answerText.toLowerCase().includes(q)
      )
    }

    return result
  }, [faqs, activeCategory, searchQuery])

  const groupedFaqs = useMemo(() => {
    if (activeCategory !== 'all' || searchQuery.trim()) {
      return [{ category: activeCategory === 'all' ? null : activeCategory, items: filteredFaqs }]
    }
    const groups: { category: CategoryKey; items: typeof filteredFaqs }[] = []
    const catOrder = CATEGORY_ORDER.filter(c => c !== 'all')
    for (const cat of catOrder) {
      const items = filteredFaqs.filter(f => f.category === cat)
      if (items.length > 0) {
        groups.push({ category: cat, items })
      }
    }
    return groups
  }, [filteredFaqs, activeCategory, searchQuery])

  const toggleFAQ = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        // Reflect the opened question in the URL so it can be shared/bookmarked.
        // replaceState (not a hash assignment) avoids a scroll jump.
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', `#q-${id}`)
        }
      }
      return next
    })
    setExpandAll(false)
  }

  // Open + scroll to a question linked directly via #q-<id> (shared/bookmarked
  // link, or a click from elsewhere on the site). Runs once after the list is
  // populated.
  useEffect(() => {
    if (typeof window === 'undefined' || faqs.length === 0) return
    const hash = window.location.hash
    if (!hash.startsWith('#q-')) return
    const id = hash.slice(3)
    if (!faqs.some(f => f.id === id)) return
    setOpenIds(prev => new Set(prev).add(id))
    // Wait a frame so the target is in the DOM before scrolling.
    const t = setTimeout(() => {
      document.getElementById(`q-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 150)
    return () => clearTimeout(t)
  }, [faqs])

  const handleExpandAll = () => {
    if (expandAll) {
      setOpenIds(new Set())
      setExpandAll(false)
    } else {
      setOpenIds(new Set(filteredFaqs.map(f => f.id)))
      setExpandAll(true)
    }
  }

  const handleCategoryChange = (cat: CategoryKey) => {
    setActiveCategory(cat)
    setOpenIds(new Set())
    setExpandAll(false)
  }

  const getCategoryLabel = (cat: CategoryKey) => {
    const c = CATEGORIES[cat]
    return locale === 'ar' ? c.ar : locale === 'ru' ? c.ru : c.en
  }

  const isAppLikeMode = (isClient && isPWA) || isMobileWeb
  
  return (
    <PWAPageWrapper 
      title={locale === 'ar' ? 'الأسئلة الشائعة' : locale === 'ru' ? 'Помощь' : 'Help & Support'}
      defaultBackPath="/products"
    >
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-[100dvh] ${isAppLikeMode ? 'pb-32' : ''}`} dir={dir}>
      <BreadcrumbSchema 
        items={[
          { name: t('common.home'), url: getLocalizedPath('/', locale) },
          { name: t('faq.title'), url: getLocalizedPath('/faq', locale) }
        ]}
      />
      
      {/* Single FAQPage schema built from the visible questions. Answers are
          HTML-stripped to plain text (schema.org Answer.text expects text, and
          Google penalises markup that doesn't match the rendered text), and the
          whole payload is escaped so a stored `</script>` can't break out. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "url": getLocalizedPath('/faq', locale),
            "inLanguage": locale,
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": stripHtml(faq.answer)
              }
            }))
          })
        }}
      />
      
      {!isAppLikeMode && (
        <PageBreadcrumb
          items={[
            { name: t('common.home'), href: getLocalizedPath('/', locale) },
            { name: t('faq.title') },
          ]}
        />
      )}

      <div className={`container mx-auto px-3 md:px-4 ${isAppLikeMode ? 'py-4' : 'py-4 md:py-12'}`}>
        <div className={`mx-auto ${isAppLikeMode ? 'max-w-4xl' : 'max-w-5xl'}`}>
          {!isAppLikeMode && (
            <Link href={getLocalizedPath('/', locale)} className={`inline-flex items-center gap-1.5 text-[13px] text-[var(--cera-rose-ink)] transition-opacity hover:opacity-70 mb-8 md:mb-12 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              <span>{t('common.backToHome')}</span>
            </Link>
          )}

          {/* Page Header.
           *  Mobile/PWA: tight single-row h1 + subtitle cut to one line — header
           *  already announces "Help & Support", so we avoid a 4-line hero above
           *  the fold and show the FAQ list sooner.
           *  Desktop: editorial hero (kicker → big headline → subhead → stats). */}
          {isAppLikeMode ? (
            <div className="mb-3">
              <h1 className="cera-serif text-[21px] leading-tight mb-1">
                {t('faq.subtitle')}
              </h1>
              <p className="text-[13px] text-[var(--cera-muted)] line-clamp-1">
                {t('faq.description')}
              </p>
            </div>
          ) : (
            <header className="mb-8 md:mb-12">
              <p className="cera-eyebrow">
                {locale === 'ar'
                  ? 'مركز المساعدة · GENOSYS الإمارات'
                  : locale === 'ru'
                    ? 'ЦЕНТР ПОМОЩИ · GENOSYS ОАЭ'
                    : 'HELP CENTER · GENOSYS UAE'}
              </p>
              <h1 className="cera-serif mt-3 max-w-[20ch] text-[36px] md:text-[56px] lg:text-[64px] leading-[1.05]">
                {t('faq.subtitle')}
              </h1>
              <p className="mt-5 max-w-[62ch] text-[15.5px] md:text-[17px] leading-relaxed text-[var(--cera-muted)]">
                {t('faq.description')}
              </p>

              {/* Stats strip */}
              <dl className="mt-10 hidden md:flex md:items-start">
                <div className="px-8 first:ps-0">
                  <dt className="flex items-center gap-2 cera-eyebrow">
                    <BookOpen className="h-3.5 w-3.5" />
                    {locale === 'ar' ? 'سؤال موثق' : locale === 'ru' ? 'опубликованных вопросов' : 'curated questions'}
                  </dt>
                  <dd className="cera-numeral mt-2.5 text-[30px] leading-none text-[var(--cera-ink)]">
                    {faqs.length}+
                  </dd>
                </div>
                <div className="border-s border-[var(--cera-line)] px-8">
                  <dt className="flex items-center gap-2 cera-eyebrow">
                    <LayoutGrid className="h-3.5 w-3.5" />
                    {locale === 'ar' ? 'فئات' : locale === 'ru' ? 'категорий' : 'topics covered'}
                  </dt>
                  <dd className="cera-numeral mt-2.5 flex items-baseline gap-2 text-[30px] leading-none text-[var(--cera-ink)]">
                    <span>{availableCategories.filter(c => c !== 'all').length}</span>
                    <span className="text-[12.5px] text-[var(--cera-muted)]">
                      {locale === 'ar'
                        ? 'منتجات · طلبات · تطبيق · حساب'
                        : locale === 'ru'
                          ? 'продукты · заказы · приложение · аккаунт'
                          : 'products · orders · app · account'}
                    </span>
                  </dd>
                </div>
                <div className="border-s border-[var(--cera-line)] px-8">
                  <dt className="flex items-center gap-2 cera-eyebrow">
                    <Clock className="h-3.5 w-3.5" />
                    {locale === 'ar' ? 'متوسط الرد' : locale === 'ru' ? 'средний ответ' : 'avg. human reply'}
                  </dt>
                  <dd className="cera-numeral mt-2.5 flex items-baseline gap-2 text-[30px] leading-none text-[var(--cera-ink)]">
                    <span>&lt; 4h</span>
                    <span className="text-[12.5px] text-[var(--cera-muted)] inline-flex items-center gap-1">
                      <Globe2 className="h-3.5 w-3.5" />
                      EN · AR · RU
                    </span>
                  </dd>
                </div>
              </dl>
            </header>
          )}

          {/* Sticky filter bar (mobile web/PWA): search + tabs stay in view while
              scrolling. Background is solid (not fading to transparent) so
              content doesn't show through the pinned bar. */}
          <div className={isAppLikeMode ? 'sticky top-0 z-20 bg-[var(--cera-cream)]/95 backdrop-blur-md pt-2 pb-2 -mx-3 px-3 border-b border-[var(--cera-line)]' : ''}>
            {/* Search Bar */}
            <div className="relative mb-3 md:mb-6">
              <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                <Search className="h-4 w-4 md:h-[18px] md:w-[18px] text-[var(--cera-muted)]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setActiveCategory('all')
                }}
                placeholder={locale === 'ar' ? 'ابحث في الأسئلة الشائعة...' : locale === 'ru' ? 'Поиск по вопросам...' : 'Search FAQ...'}
                className="ed-field ed-field--flanked py-2.5 md:py-3"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute inset-y-0 ${dir === 'rtl' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center`}
                  aria-label={locale === 'ar' ? 'مسح البحث' : locale === 'ru' ? 'Очистить поиск' : 'Clear search'}
                >
                  <X className="h-4 w-4 text-[var(--cera-muted)] transition-colors hover:text-[var(--cera-ink)]" />
                </button>
              )}
            </div>

            {/* Category Tabs — with edge-fade signalling horizontal scroll */}
            <div className="relative mb-3 md:mb-8">
              <div className="overflow-x-auto scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
                <div className={`flex gap-2 pb-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`} role="tablist">
                  {availableCategories.map((cat) => {
                    const Icon = CATEGORIES[cat].icon
                    const isActive = activeCategory === cat
                    return (
                      <button
                        key={cat}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => handleCategoryChange(cat)}
                        className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 md:px-4 py-1.5 md:py-2 text-[12.5px] md:text-[13.5px] font-semibold transition-all duration-200 ${
                          isActive
                            ? 'border border-transparent bg-[var(--cera-ink)] text-white'
                            : 'border border-[var(--cera-line)] bg-white text-[var(--cera-muted)] hover:border-[var(--cera-blush-deep)] hover:text-[var(--cera-rose-ink)]'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        {getCategoryLabel(cat)}
                      </button>
                    )
                  })}
                </div>
              </div>
              {/* Edge fade: signals more pills exist off-screen (mobile only). */}
              {isAppLikeMode && (
                <div
                  className={`pointer-events-none absolute inset-y-0 w-8 ${dir === 'rtl' ? 'left-0 bg-gradient-to-r from-[var(--cera-cream)] to-transparent' : 'right-0 bg-gradient-to-l from-[var(--cera-cream)] to-transparent'}`}
                  aria-hidden="true"
                />
              )}
            </div>
          </div>

          {/* Toolbar: result count + expand/collapse */}
          <div className={`flex items-center justify-between mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <span className="cera-numeral text-[13px] text-[var(--cera-muted)]">
              {searchQuery.trim() ? (
                locale === 'ar'
                  ? `${filteredFaqs.length} نتيجة`
                  : locale === 'ru'
                  ? `${filteredFaqs.length} результат(ов)`
                  : `${filteredFaqs.length} result${filteredFaqs.length !== 1 ? 's' : ''}`
              ) : (
                locale === 'ar'
                  ? `${filteredFaqs.length} سؤال`
                  : locale === 'ru'
                  ? `${filteredFaqs.length} вопрос(ов)`
                  : `${filteredFaqs.length} question${filteredFaqs.length !== 1 ? 's' : ''}`
              )}
            </span>
            {filteredFaqs.length > 0 && (
              <button
                onClick={handleExpandAll}
                className={`flex items-center gap-1.5 text-[13px] font-semibold text-[var(--cera-rose-ink)] transition-opacity hover:opacity-70 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                {expandAll ? (
                  <>
                    <ChevronsUp className="h-3.5 w-3.5" />
                    {locale === 'ar' ? 'طي الكل' : locale === 'ru' ? 'Свернуть все' : 'Collapse all'}
                  </>
                ) : (
                  <>
                    <ChevronsDown className="h-3.5 w-3.5" />
                    {locale === 'ar' ? 'توسيع الكل' : locale === 'ru' ? 'Развернуть все' : 'Expand all'}
                  </>
                )}
              </button>
            )}
          </div>

          {/* FAQ Sections.
           *  Mobile/PWA: one card per category with hairline dividers between
           *  questions (iOS-native list style) — much denser than separate
           *  shadowed cards per question.
           *  Desktop: preserves the existing per-question card with shadow. */}
          <div className={`${isAppLikeMode ? 'space-y-5' : 'space-y-6 md:space-y-8'} mb-6 md:mb-12`}>
            {groupedFaqs.map(({ category: groupCat, items }) => (
              <div key={groupCat || 'search-results'}>
                {groupCat && activeCategory === 'all' && !searchQuery.trim() && (
                  isAppLikeMode ? (
                    <div className={`flex items-center gap-2 mb-2 px-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      {(() => {
                        const Icon = CATEGORIES[groupCat]?.icon || Store
                        return <Icon className="h-4 w-4 text-[var(--cera-rose)]" />
                      })()}
                      <h2 className="cera-serif text-[16px] leading-tight">
                        {getCategoryLabel(groupCat)}
                      </h2>
                    </div>
                  ) : (
                    <div className={`mb-4 flex items-end justify-between gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className={dir === 'rtl' ? 'text-right' : ''}>
                        <p className="cera-eyebrow cera-numeral">
                          {String((CATEGORY_ORDER.filter(c => c !== 'all') as CategoryKey[]).indexOf(groupCat) + 1).padStart(2, '0')}
                        </p>
                        <h2 className={`cera-serif mt-2 flex items-center gap-2.5 text-[22px] md:text-[28px] leading-tight ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          {(() => {
                            const Icon = CATEGORIES[groupCat]?.icon || Store
                            return <Icon className="h-5 w-5 text-[var(--cera-rose)]" />
                          })()}
                          {getCategoryLabel(groupCat)}
                        </h2>
                      </div>
                      <span className="cera-numeral text-[12.5px] text-[var(--cera-muted)]">
                        {items.length} {locale === 'ar' ? 'سؤال' : locale === 'ru' ? 'вопр.' : items.length === 1 ? 'question' : 'questions'}
                      </span>
                    </div>
                  )
                )}

                {isAppLikeMode ? (
                  // Grouped card: one container, hairline dividers between rows
                  <div className="overflow-hidden rounded-[18px] border border-[var(--cera-line)] bg-white">
                    {items.map((faq, idx) => {
                      const isOpen = expandAll || openIds.has(faq.id)
                      const sanitizedAnswer = sanitizeHtml(faq.answer)
                      return (
                        <div
                          key={faq.id}
                          id={`q-${faq.id}`}
                          className={`scroll-mt-24 ${idx > 0 ? 'border-t border-[var(--cera-line)]' : ''}`}
                        >
                          <button
                            onClick={() => toggleFAQ(faq.id)}
                            className="w-full px-4 py-3.5 text-start flex items-center justify-between transition-colors active:bg-[var(--cera-cream-deep)]"
                            aria-expanded={isOpen}
                            aria-controls={`faq-answer-${faq.id}`}
                          >
                            <h3 className={`cera-serif text-[15px] leading-snug ${dir === 'rtl' ? 'pl-2 text-right' : 'pr-2'} flex-1`}>
                              {faq.question}
                            </h3>
                            <div className="flex-shrink-0">
                              {isOpen ? (
                                <ChevronUp className="h-4 w-4 text-[var(--cera-rose)]" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-[var(--cera-muted)]" />
                              )}
                            </div>
                          </button>
                          <div
                            id={`faq-answer-${faq.id}`}
                            role="region"
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="px-4 pb-4">
                              {/* Explicit classes (no template literals) so Tailwind JIT emits them. */}
                              <div className={dir === 'rtl' ? 'border-r-2 border-[var(--cera-blush-deep)] pr-3' : 'border-l-2 border-[var(--cera-blush-deep)] pl-3'}>
                                <div
                                  className="text-[13px] leading-relaxed text-[var(--cera-muted)] prose prose-sm max-w-none"
                                  dangerouslySetInnerHTML={{ __html: sanitizedAnswer }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  // Desktop: single editorial container per group with hairline
                  // dividers between rows — denser and less "shadow soup" than
                  // per-question cards.
                  <div className="overflow-hidden rounded-[22px] border border-[var(--cera-line)] bg-white">
                    {items.map((faq, idx) => {
                      const isOpen = expandAll || openIds.has(faq.id)
                      const sanitizedAnswer = sanitizeHtml(faq.answer)
                      return (
                        <div
                          key={faq.id}
                          id={`q-${faq.id}`}
                          className={`group scroll-mt-24 ${idx > 0 ? 'border-t border-[var(--cera-line)]' : ''}`}
                        >
                          <button
                            onClick={() => toggleFAQ(faq.id)}
                            className={`relative flex w-full items-start gap-4 px-5 py-4 text-start transition-colors md:px-7 md:py-5 hover:bg-[var(--cera-cream)] ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}
                            aria-expanded={isOpen}
                            aria-controls={`faq-answer-d-${faq.id}`}
                          >
                            {/* Number marker — editorial detail */}
                            <span className="cera-numeral mt-1 hidden h-6 min-w-[2.25rem] flex-shrink-0 items-center justify-center rounded-full bg-[var(--cera-cream-deep)] px-2 text-[11px] text-[var(--cera-muted)] md:inline-flex">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <h3 className="cera-serif flex-1 pe-2 text-[17px] leading-snug md:text-[19px]">
                              {faq.question}
                            </h3>
                            <div className="flex-shrink-0 mt-0.5">
                              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-200 ${
                                isOpen
                                  ? 'border-transparent bg-[var(--cera-rose)] text-white'
                                  : 'border-[var(--cera-line)] bg-white text-[var(--cera-muted)] group-hover:border-[var(--cera-blush-deep)] group-hover:text-[var(--cera-rose-ink)]'
                              }`}>
                                {isOpen ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </span>
                            </div>
                          </button>
                          <div
                            id={`faq-answer-d-${faq.id}`}
                            role="region"
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className={`px-5 md:px-7 pb-5 md:pb-7 ${dir === 'rtl' ? 'md:pr-[4.5rem] md:pl-7' : 'md:pl-[4.5rem] md:pr-7'}`}>
                              <div
                                className="prose prose-sm max-w-none text-[14.5px] leading-relaxed text-[var(--cera-muted)] prose-a:text-[var(--cera-rose-ink)] prose-a:no-underline hover:prose-a:underline"
                                dangerouslySetInnerHTML={{ __html: sanitizedAnswer }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <span className="ed-mark ed-mark--round mx-auto mb-5 flex h-14 w-14" aria-hidden="true">
                  <Search className="h-5 w-5" />
                </span>
                <p className="text-[15px] text-[var(--cera-muted)]">
                  {locale === 'ar'
                    ? 'لم يتم العثور على نتائج. جرب البحث بكلمات مختلفة.'
                    : locale === 'ru'
                    ? 'Ничего не найдено. Попробуйте другие ключевые слова.'
                    : 'No results found. Try different keywords.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategory('all') }}
                    className="mt-4 text-[14px] font-semibold text-[var(--cera-rose-ink)] underline underline-offset-4 transition-opacity hover:opacity-70"
                  >
                    {locale === 'ar' ? 'مسح البحث' : locale === 'ru' ? 'Очистить поиск' : 'Clear search'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* App Download Banner — editorial dark panel with red accent blurs.
              Mobile keeps the centered layout; desktop uses an asymmetric
              two-column composition (kicker → headline → CTAs left,
              decorative phone glyph right) to feel less like a generic banner. */}
          <section className="relative mb-6 md:mb-10 overflow-hidden rounded-xl md:rounded-3xl bg-[var(--cera-ink)] text-white">
            {/* Brand accent blurs */}
            <span aria-hidden className="pointer-events-none absolute -top-32 -left-32 h-72 w-72 rounded-full bg-[var(--cera-rose)]/35 blur-3xl" />
            <span aria-hidden className="pointer-events-none absolute -bottom-40 -right-32 h-80 w-80 rounded-full bg-[var(--cera-rose)]/20 blur-3xl" />
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(255,255,255,0.04),transparent_60%)]" />

            <div className="relative grid gap-8 p-5 md:grid-cols-[1.5fr_1fr] md:items-center md:gap-10 md:p-10">
              <div className={dir === 'rtl' ? 'text-right' : ''}>
                <p className="text-[11px] font-mono uppercase tracking-[0.32em] text-red-300/90">
                  {locale === 'ar' ? 'تطبيقات الجوال' : locale === 'ru' ? 'МОБИЛЬНЫЕ ПРИЛОЖЕНИЯ' : 'MOBILE APPS · iOS & ANDROID'}
                </p>
                <h3 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-[1.1]">
                  {locale === 'ar'
                    ? 'احصل على إجاباتك أسرع في تطبيق GENOSYS.'
                    : locale === 'ru'
                      ? 'Получайте ответы быстрее в приложении GENOSYS.'
                      : 'Get answers faster in the GENOSYS app.'}
                </h3>
                <p className="mt-3 max-w-md text-sm md:text-base leading-relaxed text-gray-300">
                  {locale === 'ar'
                    ? 'تسوّق، تتبّع طلباتك، وادردش مع فريق الدعم — كل شيء في تطبيق واحد.'
                    : locale === 'ru'
                      ? 'Покупайте, отслеживайте заказы и общайтесь с поддержкой — всё в одном приложении.'
                      : 'Shop, track orders, and chat with support — all in one place.'}
                </p>

                <div className={`mt-6 flex flex-row flex-wrap gap-3 ${dir === 'rtl' ? 'justify-end' : ''}`}>
                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
                  >
                    <svg className="h-6 w-6 md:h-7 md:w-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[9px] md:text-[10px] font-normal opacity-70">
                        {locale === 'ar' ? 'حمّل من' : locale === 'ru' ? 'Загрузите в' : 'Download on the'}
                      </span>
                      <span className="text-sm md:text-base font-semibold -mt-0.5">App Store</span>
                    </div>
                  </a>
                  <a
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
                  >
                    <svg className="h-6 w-6 md:h-7 md:w-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.808 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                    </svg>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[9px] md:text-[10px] font-normal opacity-70">
                        {locale === 'ar' ? 'متوفر على' : locale === 'ru' ? 'Доступно в' : 'GET IT ON'}
                      </span>
                      <span className="text-sm md:text-base font-semibold -mt-0.5">Google Play</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Official app icon — desktop only */}
              <div className="hidden md:flex justify-center">
                <div className="relative">
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[var(--cera-rose)]/35 via-[var(--cera-rose)]/10 to-transparent blur-2xl"
                  />
                  <div className="relative h-32 w-32 overflow-hidden rounded-[1.75rem] border border-white/15 bg-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.65)] ring-1 ring-white/10">
                    <Image
                      src="/images/app-icon.png"
                      alt={
                        locale === 'ar'
                          ? 'شعار تطبيق GENOSYS'
                          : locale === 'ru'
                            ? 'Иконка приложения GENOSYS'
                            : 'GENOSYS app icon'
                      }
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                      priority={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact CTA — editorial dark panel matching /partners "Become a
              partner" style. Replaces the previous pink-gradient block. */}
          <section className="relative overflow-hidden rounded-xl md:rounded-3xl bg-[var(--cera-ink)] text-white">
            <span aria-hidden className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-[var(--cera-rose)]/28 blur-3xl" />
            <span aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[var(--cera-rose)]/16 blur-3xl" />

            <div className="relative grid gap-8 p-5 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-12 md:p-10">
              <div className={dir === 'rtl' ? 'text-right' : ''}>
                <p className="text-[11px] font-mono uppercase tracking-[0.32em] text-red-300/90">
                  {locale === 'ar' ? 'هل ما زلت بحاجة إلى مساعدة؟' : locale === 'ru' ? 'НУЖНА ПОМОЩЬ?' : 'STILL NEED HELP?'}
                </p>
                <h3 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-[1.1]">
                  {locale === 'ar'
                    ? 'تحدّث مع شخص حقيقي.'
                    : locale === 'ru'
                      ? 'Поговорите с живым человеком.'
                      : 'Talk to a real human.'}
                </h3>
                <p className="mt-3 max-w-md text-sm md:text-base leading-relaxed text-gray-300">
                  {locale === 'ar'
                    ? 'فريق الدعم في دبي يجيب باللغات الإنجليزية والعربية والروسية — عادة في أقل من 4 ساعات.'
                    : locale === 'ru'
                      ? 'Команда поддержки в Дубае отвечает на английском, арабском и русском — обычно менее чем за 4 часа.'
                      : 'Our Dubai support desk replies in English, Arabic & Russian — typically under 4 hours.'}
                </p>
              </div>

              <div className={`flex flex-col gap-3 sm:flex-row md:flex-col ${dir === 'rtl' ? 'md:items-end' : 'md:items-stretch'}`}>
                <Link
                  href={getLocalizedPath('/contact', locale)}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-[var(--cera-rose)] hover:text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t('common.contact')}
                  <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-0.5 group-hover:translate-x-0' : ''}`} />
                </Link>
                <a
                  href={`https://wa.me/971585487665?text=${encodeURIComponent(locale === 'ar' ? 'مرحباً، لدي سؤال حول منتجات GENOSYS.' : locale === 'ru' ? 'Здравствуйте, у меня вопрос о продукции GENOSYS.' : 'Hi, I have a question about GENOSYS products.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.71.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    </PWAPageWrapper>
  )
}
