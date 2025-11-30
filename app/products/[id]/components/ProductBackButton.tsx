'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

export default function ProductBackButton() {
  const { t, locale, dir } = useTranslation()
  
  return (
    <div className={`flex items-center mb-4 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
      <Link 
        href={getLocalizedPath('/products', locale)}
        className={`flex items-center text-gray-600 hover:text-primary-600 transition-colors text-sm md:text-sm ${dir === 'rtl' ? 'flex-row-reverse ml-4' : 'mr-4'}`}
      >
        <ArrowLeft className={`h-4 w-4 md:h-5 md:w-5 ${dir === 'rtl' ? 'ml-2 rotate-180' : 'mr-2'}`} />
        {t('cart.backToProducts')}
      </Link>
    </div>
  )
}
