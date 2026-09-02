'use client'

import { Heart } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface HeaderDesktopBrandingProps {
  isRTL: boolean
  isHeartBeating: boolean
}

/**
 * Desktop header branding (company name + UAE with heart)
 * Handles both LTR and RTL layouts
 */
export default function HeaderDesktopBranding({ isRTL, isHeartBeating }: HeaderDesktopBrandingProps) {
  const { t } = useTranslation()

  const heartIcon = (
    <Heart 
      className={`h-3 w-3 text-[var(--brand-wordmark)] fill-current transition-transform duration-300 ${
        isHeartBeating ? 'animate-pulse' : ''
      }`} 
      style={isHeartBeating ? {
        animation: 'heartbeat 0.6s ease-in-out'
      } : {}} 
    />
  )

  return (
    <div className="hidden md:flex flex-col items-center">
      <span className="text-lg md:text-2xl font-bold text-[var(--brand-wordmark)] tracking-tight whitespace-nowrap">
        GENOSYS MIDDLE EAST
      </span>
      <div className="flex w-full justify-center items-center gap-1 text-sm text-[var(--cera-muted)] header-margin">
        {isRTL ? (
          <>
            {heartIcon}
            {t('common.uae')}
          </>
        ) : (
          <>
            {t('common.uae')}
            {heartIcon}
          </>
        )}
      </div>
    </div>
  )
}
