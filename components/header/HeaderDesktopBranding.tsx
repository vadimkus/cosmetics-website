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
      className={`h-3 w-3 text-primary-600 fill-current transition-transform duration-300 ${
        isHeartBeating ? 'animate-pulse' : ''
      }`} 
      style={isHeartBeating ? {
        animation: 'heartbeat 0.6s ease-in-out'
      } : {}} 
    />
  )

  return (
    <div className={`hidden md:flex flex-col ${isRTL ? 'items-end' : ''}`}>
      <span className="text-lg md:text-2xl font-bold text-primary-600">
        Genosys Middle East FZ-LLC
      </span>
      <div className={`flex text-sm text-gray-600 items-center gap-1 ${
        isRTL ? 'mr-0 md:mr-40' : 'ml-0 md:ml-28'
      } header-margin`}>
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
