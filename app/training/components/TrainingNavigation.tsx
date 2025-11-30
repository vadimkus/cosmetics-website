'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

export default function TrainingNavigation() {
  const { t, locale, dir } = useTranslation()
  
  return (
    <nav className={`flex flex-col gap-2 text-sm md:text-base text-gray-600 mb-8 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
      {/* Mobile Breadcrumb */}
      <div className={`md:hidden flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <Link 
          href={getLocalizedPath('/', locale)}
          className="hover:text-primary-600 transition-colors flex items-center"
        >
          {t('common.home')}
        </Link>
        <span className="flex items-center">/</span>
        <span className="text-gray-900 font-medium flex items-center">
          {t('common.training')}
        </span>
      </div>
      
      {/* Mobile Back Button */}
      <Link 
        href={getLocalizedPath('/', locale)}
        className={`md:hidden flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
      >
        <ArrowLeft className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        <span className="font-medium">{t('common.backToHome')}</span>
      </Link>
      
      {/* Desktop Breadcrumb */}
      <div className={`hidden md:flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <Link 
          href={getLocalizedPath('/', locale)}
          className="hover:text-primary-600 transition-colors flex items-center"
        >
          {t('common.home')}
        </Link>
        <span className="flex items-center">/</span>
        <span className="text-gray-900 font-medium flex items-center">
          {t('common.training')}
        </span>
      </div>
    </nav>
  )
}
