'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import PWAPageWrapper from '@/components/pwa/PWAPageWrapper'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { sanitizeHtml } from '@/lib/sanitize'
import { usePWAMode } from '@/hooks/usePWAMode'

interface FaqItemData {
  id: string
  questionEn: string
  answerEn: string
  questionAr: string | null
  answerAr: string | null
  questionRu: string | null
  answerRu: string | null
}

export default function FAQClient({ faqItems }: { faqItems: FaqItemData[] }) {
  const { t, locale, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  
  useEffect(() => {
    if (isClient) {
      setIsMobileWeb(window.innerWidth < 768 && !isPWA)
    }
  }, [isClient, isPWA])

  // Build FAQ list from DB data with locale selection
  const faqs = faqItems.map((item) => {
    let question = item.questionEn
    let answer = item.answerEn

    if (locale === 'ar' && item.questionAr) {
      question = item.questionAr
      answer = item.answerAr || item.answerEn
    } else if (locale === 'ru' && item.questionRu) {
      question = item.questionRu
      answer = item.answerRu || item.answerEn
    }

    return { question, answer }
  })

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
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
      
      {/* FAQPage Schema */}
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
          {/* Navigation Breadcrumb - hide in PWA and mobile web */}
          {!isAppLikeMode && (
            <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
              <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
              <span> / </span>
              <span className="text-gray-900 font-medium">{t('faq.title')}</span>
            </nav>
          )}
          
          {/* Back to Home - hide in PWA and mobile web */}
          {!isAppLikeMode && (
            <Link href={getLocalizedPath('/', locale)} className="inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8">
              <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              <span>{t('common.backToHome')}</span>
            </Link>
          )}

          {/* Page Header */}
          <div className="text-center mb-6 md:mb-12">
            <h1 className="text-2xl md:text-5xl font-bold text-gray-800 mb-2 md:mb-4">
              {t('faq.subtitle')}
            </h1>
            <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
              {t('faq.description')}
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-2 md:space-y-4 mb-6 md:mb-12">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              const sanitizedAnswer = sanitizeHtml(faq.answer)
              return (
                <div 
                  key={index} 
                  className="bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-3 md:px-6 py-3 md:py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors group"
                    aria-expanded={isOpen}
                  >
                    <div className={`flex items-start gap-2 md:gap-4 flex-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg flex items-center justify-center transition-colors ${
                        isOpen ? 'bg-primary-600' : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <span className={`text-xs md:text-sm font-bold ${
                          isOpen ? 'text-white' : 'text-gray-600'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                      <h2 className={`text-sm md:text-xl font-semibold text-gray-800 ${dir === 'rtl' ? 'pl-2' : 'pr-2'}`}>
                        {faq.question}
                      </h2>
                    </div>
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
                      isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className={`px-3 md:px-6 pb-3 md:pb-6 ${dir === 'rtl' ? 'pr-10 md:pr-[72px]' : 'pl-10 md:pl-[72px]'}`}>
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

          {/* Contact CTA */}
          <div className="mt-6 md:mt-12 p-4 md:p-8 bg-gradient-to-r from-primary-50 to-red-50 rounded-lg md:rounded-xl border border-primary-100 shadow-sm">
            <div className="text-center">
              <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">
                {locale === 'ar' ? 'لا تزال لديك أسئلة؟' : 'Still have questions?'}
              </h3>
              <p className="text-xs md:text-base text-gray-600 mb-4 md:mb-6 max-w-xl mx-auto">
                {locale === 'ar' ? 'لا تجد الإجابة التي تبحث عنها؟ فريق الدعم لدينا هنا لمساعدتك.' : 'Can\'t find the answer you\'re looking for? Our support team is here to help.'}
              </p>
              <div className="flex flex-row gap-3 justify-center">
                <Link
                  href={getLocalizedPath('/contact', locale)}
                  className="bg-primary-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-primary-700 transition-colors shadow-md flex items-center justify-center"
                >
                  {t('common.contact')}
                </Link>
                <a
                  href={`https://wa.me/971585487665?text=${locale === 'ar' ? 'مرحباً، لدي سؤال حول منتجات GENOSYS.' : 'Hi, I have a question about GENOSYS products.'}`}
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

