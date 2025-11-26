'use client'

import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import { useState, useMemo } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { sanitizeHtml } from '@/lib/sanitize'

export default function FAQClient() {
  const { t, locale, dir } = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: t('faq.questions.whatIsGenosys.q'),
      answer: t('faq.questions.whatIsGenosys.a'),
    },
    {
      question: t('faq.questions.shipToAllEmirates.q'),
      answer: t('faq.questions.shipToAllEmirates.a'),
    },
    {
      question: t('faq.questions.suitableForHomeUse.q'),
      answer: t('faq.questions.suitableForHomeUse.a'),
    },
    {
      question: t('faq.questions.paymentMethods.q'),
      answer: t('faq.questions.paymentMethods.a'),
    },
    {
      question: t('faq.questions.shippingTime.q'),
      answer: t('faq.questions.shippingTime.a'),
    },
    {
      question: t('faq.questions.returnExchange.q'),
      answer: t('faq.questions.returnExchange.a'),
    },
    {
      question: t('faq.questions.professionalTraining.q'),
      answer: t('faq.questions.professionalTraining.a'),
    },
    {
      question: t('faq.questions.productsCertified.q'),
      answer: t('faq.questions.productsCertified.a'),
    },
    {
      question: t('faq.questions.trackOrder.q'),
      answer: t('faq.questions.trackOrder.a'),
    },
    {
      question: t('faq.questions.returnPolicy.q'),
      answer: t('faq.questions.returnPolicy.a'),
    },
    {
      question: t('faq.questions.bulkDiscounts.q'),
      answer: t('faq.questions.bulkDiscounts.a'),
    },
    {
      question: t('faq.questions.becomeRegistered.q'),
      answer: t('faq.questions.becomeRegistered.a'),
    },
    {
      question: t('faq.questions.sensitiveSkin.q'),
      answer: t('faq.questions.sensitiveSkin.a'),
    },
    {
      question: t('faq.questions.internationalShipping.q'),
      answer: t('faq.questions.internationalShipping.a'),
    },
    {
      question: t('faq.questions.contactSupport.q'),
      answer: t('faq.questions.contactSupport.a'),
    },
    {
      question: t('faq.questions.whyChooseGenosys.q'),
      answer: t('faq.questions.whyChooseGenosys.a'),
    },
    {
      question: t('faq.questions.haveBlog.q'),
      answer: t('faq.questions.haveBlog.a'),
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen" dir={dir}>
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
      
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Navigation Breadcrumb */}
          <nav className="flex flex-col gap-2 text-sm md:text-base text-gray-600 mb-8" aria-label="Breadcrumb">
            {/* Mobile Breadcrumb */}
            <div className="md:hidden flex items-center gap-2">
              <Link 
                href={getLocalizedPath('/', locale)}
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                {t('common.home')}
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center">
                {t('faq.title')}
              </span>
            </div>
            
            {/* Mobile Back Button */}
            <Link 
              href={getLocalizedPath('/', locale)}
              className="md:hidden flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              <span className="font-medium">{t('common.backToHome')}</span>
            </Link>
            
            {/* Desktop Breadcrumb */}
            <div className="hidden md:flex items-center gap-2">
              <Link 
                href={getLocalizedPath('/', locale)}
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                {t('common.home')}
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center">
                {t('faq.title')}
              </span>
            </div>
          </nav>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t('faq.subtitle')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('faq.description')}
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4 mb-12">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div 
                  key={index} 
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors group"
                    aria-expanded={isOpen}
                  >
                    <div className={`flex items-start gap-4 flex-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isOpen ? 'bg-primary-600' : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <span className={`text-sm font-bold ${
                          isOpen ? 'text-white' : 'text-gray-600'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                      <h2 className={`text-lg md:text-xl font-semibold text-gray-800 ${dir === 'rtl' ? 'pl-4' : 'pr-4'}`}>
                        {faq.question}
                      </h2>
                    </div>
                    <div className="flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-primary-600 transition-transform" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-transform" />
                      )}
                    </div>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className={`px-6 pb-6 ${dir === 'rtl' ? 'pr-[72px]' : 'pl-[72px]'}`}>
                      <div className={`border-${dir === 'rtl' ? 'r' : 'l'}-2 border-primary-200 ${dir === 'rtl' ? 'pr-6' : 'pl-6'}`}>
                        <div 
                          className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: useMemo(() => sanitizeHtml(faq.answer), [faq.answer]) }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 p-8 bg-gradient-to-r from-primary-50 to-red-50 rounded-xl border border-primary-100 shadow-sm">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {locale === 'ar' ? 'لا تزال لديك أسئلة؟' : 'Still have questions?'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                {locale === 'ar' ? 'لا تجد الإجابة التي تبحث عنها؟ فريق الدعم لدينا هنا لمساعدتك.' : 'Can\'t find the answer you\'re looking for? Our support team is here to help.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={getLocalizedPath('/contact', locale)}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center shadow-md hover:shadow-lg"
                >
                  {t('common.contact')}
                </Link>
                <a
                  href={`https://wa.me/971585487665?text=${locale === 'ar' ? 'مرحباً، لدي سؤال حول منتجات GENOSYS.' : 'Hi, I have a question about GENOSYS products.'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center shadow-md hover:shadow-lg"
                >
                  {locale === 'ar' ? 'واتساب' : 'WhatsApp Us'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

