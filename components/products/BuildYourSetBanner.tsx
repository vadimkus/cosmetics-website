'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { useAnimationStore } from '@/lib/animationStore'

/**
 * Build Your Set Banner
 * 
 * Displays on the Beauty Boxes category page as an entry point
 * to the Bundle Builder feature.
 * 
 * Apple-like design: Clean, minimal, professional - not advertisement-like
 */
export default function BuildYourSetBanner() {
  const { t, locale } = useTranslation()
  const { enabled: animationsEnabled } = useAnimationStore()
  
  const isRTL = locale === 'ar'
  
  const MotionLink = animationsEnabled ? motion(Link) : Link
  
  return (
    <MotionLink
      href={getLocalizedPath('/bundle-builder', locale)}
      {...(animationsEnabled ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        whileHover: { scale: 1.01 },
        whileTap: { scale: 0.99 },
        transition: { duration: 0.3 }
      } : {})}
      className={`
        relative block overflow-hidden rounded-2xl
        bg-gradient-to-br from-primary-50 via-red-50 to-primary-100
        border border-primary-100
        p-6 sm:p-8
        group cursor-pointer
        transition-all duration-300
        hover:shadow-lg hover:border-primary-200 hover:shadow-primary/10
        ${isRTL ? 'text-right' : 'text-left'}
      `}
    >
      {/* Subtle decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-200/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary-200/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/80 shadow-sm flex items-center justify-center border border-primary-100">
            <Sparkles className="w-6 h-6 text-primary-600" />
          </div>
          
          {/* Text */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
              {t('bundleBuilder.buildYourOwn')}
            </h3>
            <p className="text-sm text-gray-600 max-w-md">
              {t('bundleBuilder.buildYourOwnSubtitle')}
            </p>
            
            {/* Discount Tiers Preview */}
            <div className={`flex flex-wrap gap-2 mt-3 ${isRTL ? 'justify-end' : ''}`}>
              {['5%', '10%', '15%', '20%'].map((discount, index) => (
                <span
                  key={discount}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/80 text-primary-700 border border-primary-100"
                >
                  {index + 2}+ → {discount}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA Button */}
        <div className={`flex-shrink-0 ${isRTL ? 'sm:ml-0 sm:mr-auto' : 'sm:ml-auto'}`}>
          <span className={`
            inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-primary-600 text-white text-sm font-medium
            group-hover:bg-primary-700 transition-colors shadow-sm shadow-primary/20
            ${isRTL ? 'flex-row-reverse' : ''}
          `}>
            {t('bundleBuilder.startBuilding')}
            <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
          </span>
        </div>
      </div>
    </MotionLink>
  )
}
