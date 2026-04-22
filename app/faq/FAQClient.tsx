'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ChevronDown, ChevronUp, Search, X,
  Store, Sparkles, CreditCard, Truck, Smartphone, UserCircle, LayoutGrid,
  ChevronsDown, ChevronsUp,
} from 'lucide-react'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import PWAPageWrapper from '@/components/pwa/PWAPageWrapper'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { sanitizeHtml } from '@/lib/sanitize'
import { usePWAMode } from '@/hooks/usePWAMode'

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
        f.answer.toLowerCase().includes(q)
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
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setExpandAll(false)
  }

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
    <div className={`bg-gradient-to-b from-gray-50 to-white min-h-[100dvh] ${isAppLikeMode ? 'pb-32' : ''}`} dir={dir}>
      <BreadcrumbSchema 
        items={[
          { name: t('common.home'), url: getLocalizedPath('/', locale) },
          { name: t('faq.title'), url: getLocalizedPath('/faq', locale) }
        ]}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          }, null, 2)
        }}
      />
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-4xl mx-auto">
          {!isAppLikeMode && (
            <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
              <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
              <span> / </span>
              <span className="text-gray-900 font-medium">{t('faq.title')}</span>
            </nav>
          )}
          
          {!isAppLikeMode && (
            <Link href={getLocalizedPath('/', locale)} className="inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8">
              <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              <span>{t('common.backToHome')}</span>
            </Link>
          )}

          {/* Page Header.
           *  Mobile/PWA: tight single-row h1 + subtitle cut to one line — header
           *  already announces "Help & Support", so we avoid a 4-line hero above
           *  the fold and show the FAQ list sooner.
           *  Desktop: full hero (h1 + description). */}
          <div className={`${isAppLikeMode ? 'mb-3' : 'text-center mb-6 md:mb-10'}`}>
            <h1 className={`font-bold text-gray-900 ${isAppLikeMode ? 'text-lg mb-0.5' : 'text-2xl md:text-5xl mb-2 md:mb-4'}`}>
              {t('faq.subtitle')}
            </h1>
            <p className={`text-gray-500 ${isAppLikeMode ? 'text-xs line-clamp-1' : 'text-sm md:text-lg text-gray-600 max-w-2xl mx-auto'}`}>
              {t('faq.description')}
            </p>
          </div>

          {/* Sticky filter bar (mobile web/PWA): search + tabs stay in view while
              scrolling. Background is solid (not fading to transparent) so
              content doesn't show through the pinned bar. */}
          <div className={isAppLikeMode ? 'sticky top-0 z-20 bg-gray-50/95 backdrop-blur-md pt-2 pb-2 -mx-3 px-3 border-b border-gray-100' : ''}>
            {/* Search Bar */}
            <div className="relative mb-3 md:mb-6">
              <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setActiveCategory('all')
                }}
                placeholder={locale === 'ar' ? 'ابحث في الأسئلة الشائعة...' : locale === 'ru' ? 'Поиск по вопросам...' : 'Search FAQ...'}
                className={`w-full bg-white border border-gray-200 rounded-xl py-2.5 md:py-3 text-sm md:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm ${dir === 'rtl' ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute inset-y-0 ${dir === 'rtl' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center`}
                  aria-label={locale === 'ar' ? 'مسح البحث' : locale === 'ru' ? 'Очистить поиск' : 'Clear search'}
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
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
                        className={`flex items-center gap-1.5 whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600'
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
                  className={`pointer-events-none absolute inset-y-0 w-8 ${dir === 'rtl' ? 'left-0 bg-gradient-to-r from-gray-50 to-transparent' : 'right-0 bg-gradient-to-l from-gray-50 to-transparent'}`}
                  aria-hidden="true"
                />
              )}
            </div>
          </div>

          {/* Toolbar: result count + expand/collapse */}
          <div className={`flex items-center justify-between mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <span className="text-xs md:text-sm text-gray-500">
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
                className={`flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
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
                  <div className={`flex items-center gap-2 ${isAppLikeMode ? 'mb-2 px-1' : 'mb-3 md:mb-4'} ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    {(() => {
                      const Icon = CATEGORIES[groupCat]?.icon || Store
                      return <Icon className="h-4 w-4 md:h-5 md:w-5 text-primary-600" />
                    })()}
                    <h2 className={`font-bold text-gray-900 ${isAppLikeMode ? 'text-sm uppercase tracking-wide' : 'text-base md:text-lg'}`}>
                      {getCategoryLabel(groupCat)}
                    </h2>
                    {!isAppLikeMode && <div className="flex-1 h-px bg-gray-200" />}
                  </div>
                )}

                {isAppLikeMode ? (
                  // Grouped card: one container, hairline dividers between rows
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {items.map((faq, idx) => {
                      const isOpen = expandAll || openIds.has(faq.id)
                      const sanitizedAnswer = sanitizeHtml(faq.answer)
                      return (
                        <div
                          key={faq.id}
                          className={idx > 0 ? 'border-t border-gray-100' : ''}
                        >
                          <button
                            onClick={() => toggleFAQ(faq.id)}
                            className="w-full px-4 py-3.5 text-left flex items-center justify-between active:bg-gray-50 transition-colors"
                            aria-expanded={isOpen}
                          >
                            <h3 className={`text-sm font-semibold text-gray-900 ${dir === 'rtl' ? 'pl-2 text-right' : 'pr-2'} flex-1`}>
                              {faq.question}
                            </h3>
                            <div className="flex-shrink-0">
                              {isOpen ? (
                                <ChevronUp className="h-4 w-4 text-primary-600 transition-transform" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-400 transition-colors" />
                              )}
                            </div>
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="px-4 pb-4">
                              {/* Explicit classes (no template literals) so Tailwind JIT emits them. */}
                              <div className={dir === 'rtl' ? 'border-r-2 border-primary-200 pr-3' : 'border-l-2 border-primary-200 pl-3'}>
                                <div
                                  className="text-xs text-gray-600 leading-relaxed prose prose-sm max-w-none"
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
                  // Desktop: existing per-question shadowed cards
                  <div className="space-y-2 md:space-y-3">
                    {items.map((faq) => {
                      const isOpen = expandAll || openIds.has(faq.id)
                      const sanitizedAnswer = sanitizeHtml(faq.answer)
                      return (
                        <div
                          key={faq.id}
                          className="bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                        >
                          <button
                            onClick={() => toggleFAQ(faq.id)}
                            className="w-full px-3 md:px-6 py-3 md:py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors group"
                            aria-expanded={isOpen}
                          >
                            <h3 className={`text-sm md:text-lg font-semibold text-gray-800 ${dir === 'rtl' ? 'pl-2 text-right' : 'pr-2'} flex-1`}>
                              {faq.question}
                            </h3>
                            <div className="flex-shrink-0">
                              {isOpen ? (
                                <ChevronUp className="h-4 w-4 md:h-5 md:w-5 text-primary-600 transition-transform" />
                              ) : (
                                <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                              )}
                            </div>
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className={`px-3 md:px-6 pb-3 md:pb-6`}>
                              <div className={`border-${dir === 'rtl' ? 'r' : 'l'}-2 border-primary-200 ${dir === 'rtl' ? 'pr-3 md:pr-6' : 'pl-3 md:pl-6'}`}>
                                <div
                                  className="text-xs md:text-base text-gray-600 leading-relaxed prose prose-sm max-w-none"
                                  dangerouslySetInnerHTML={{ __html: sanitizedAnswer }}
                                />
                              </div>
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
                <Search className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm md:text-base">
                  {locale === 'ar'
                    ? 'لم يتم العثور على نتائج. جرب البحث بكلمات مختلفة.'
                    : locale === 'ru'
                    ? 'Ничего не найдено. Попробуйте другие ключевые слова.'
                    : 'No results found. Try different keywords.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategory('all') }}
                    className="mt-3 text-sm text-primary-600 hover:text-primary-700 underline"
                  >
                    {locale === 'ar' ? 'مسح البحث' : locale === 'ru' ? 'Очистить поиск' : 'Clear search'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* App Download Banner */}
          <div className="mb-6 md:mb-10 p-4 md:p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl md:rounded-2xl shadow-lg overflow-hidden relative">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
            </div>
            <div className="relative text-center">
              <div className="flex justify-center mb-3 md:mb-4">
                <Smartphone className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-white mb-2">
                {locale === 'ar' ? 'حمّل تطبيق GENOSYS' : locale === 'ru' ? 'Скачайте приложение GENOSYS' : 'Get the GENOSYS App'}
              </h3>
              <p className="text-xs md:text-base text-gray-300 mb-4 md:mb-6 max-w-lg mx-auto">
                {locale === 'ar'
                  ? 'تسوق، تتبع طلباتك، واحصل على عروض حصرية — كل شيء في تطبيق واحد.'
                  : locale === 'ru'
                  ? 'Покупайте, отслеживайте заказы и получайте эксклюзивные предложения — всё в одном приложении.'
                  : 'Shop, track orders, and get exclusive offers — all in one app.'}
              </p>
              <div className="flex flex-row gap-3 justify-center items-center">
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl hover:bg-white/20 transition-all border border-white/20"
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[9px] md:text-[10px] font-normal opacity-80">
                      {locale === 'ar' ? 'حمّل من' : locale === 'ru' ? 'Загрузите в' : 'Download on the'}
                    </span>
                    <span className="text-sm md:text-base font-semibold -mt-0.5">App Store</span>
                  </div>
                </a>
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl hover:bg-white/20 transition-all border border-white/20"
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.808 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                  </svg>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[9px] md:text-[10px] font-normal opacity-80">
                      {locale === 'ar' ? 'متوفر على' : locale === 'ru' ? 'Доступно в' : 'GET IT ON'}
                    </span>
                    <span className="text-sm md:text-base font-semibold -mt-0.5">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="p-4 md:p-8 bg-gradient-to-r from-primary-50 to-red-50 rounded-lg md:rounded-xl border border-primary-100 shadow-sm">
            <div className="text-center">
              <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">
                {locale === 'ar' ? 'لا تزال لديك أسئلة؟' : locale === 'ru' ? 'Остались вопросы?' : 'Still have questions?'}
              </h3>
              <p className="text-xs md:text-base text-gray-600 mb-4 md:mb-6 max-w-xl mx-auto">
                {locale === 'ar'
                  ? 'لا تجد الإجابة التي تبحث عنها؟ فريق الدعم لدينا هنا لمساعدتك.'
                  : locale === 'ru'
                  ? 'Не нашли ответ на свой вопрос? Наша служба поддержки готова помочь.'
                  : 'Can\'t find the answer you\'re looking for? Our support team is here to help.'}
              </p>
              <div className="flex flex-row gap-3 justify-center">
                <Link
                  href={getLocalizedPath('/contact', locale)}
                  className="bg-primary-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-primary-700 transition-colors shadow-md flex items-center justify-center"
                >
                  {t('common.contact')}
                </Link>
                <a
                  href={`https://wa.me/971585487665?text=${locale === 'ar' ? 'مرحباً، لدي سؤال حول منتجات GENOSYS.' : locale === 'ru' ? 'Здравствуйте, у меня вопрос о продукции GENOSYS.' : 'Hi, I have a question about GENOSYS products.'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-green-700 transition-colors shadow-md flex items-center justify-center"
                >
                  {locale === 'ar' ? 'واتساب' : 'WhatsApp'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PWAPageWrapper>
  )
}
