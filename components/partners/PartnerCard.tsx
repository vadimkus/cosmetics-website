'use client'

import { Phone, Globe, MapPin } from 'lucide-react'
import Image from 'next/image'
import { Partner } from '@/types/partner'
import { useTranslation } from '@/hooks/useTranslation'

interface PartnerCardProps {
  partner: Partner
}

const themeClasses = {
  emerald: {
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    icon: "text-emerald-600",
    button: "bg-emerald-600 hover:bg-emerald-700",
    buttonBorder: "border-emerald-600 text-emerald-600 hover:bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700"
  },
  pink: {
    bg: "from-pink-50 to-rose-50",
    border: "border-pink-200",
    icon: "text-pink-600",
    button: "bg-pink-600 hover:bg-pink-700",
    buttonBorder: "border-pink-600 text-pink-600 hover:bg-pink-50",
    badge: "bg-pink-100 text-pink-700"
  },
  blue: {
    bg: "from-blue-50 to-indigo-50",
    border: "border-blue-200",
    icon: "text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
    buttonBorder: "border-blue-600 text-blue-600 hover:bg-blue-50",
    badge: "bg-blue-100 text-blue-700"
  },
  purple: {
    bg: "from-purple-50 to-violet-50",
    border: "border-purple-200",
    icon: "text-purple-600",
    button: "bg-purple-600 hover:bg-purple-700",
    buttonBorder: "border-purple-600 text-purple-600 hover:bg-purple-50",
    badge: "bg-purple-100 text-purple-700"
  }
}

export default function PartnerCard({ partner }: PartnerCardProps) {
  const { t, dir } = useTranslation()
  const theme = themeClasses[partner.theme]
  const isInstagram = partner.website?.includes('instagram.com')
  const websiteButtonText = isInstagram ? t('common.instagram') : t('common.website')
  
  return (
    <div className={`bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md border ${theme.border} overflow-hidden transition-all hover:shadow-md md:hover:shadow-lg`} dir={dir}>
      {/* Mobile: Compact Header */}
      <div className={`md:hidden bg-gradient-to-r ${theme.bg} p-3 border-b ${theme.border}`}>
        <div className="flex items-start gap-2.5">
          <div className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border ${theme.border} flex-shrink-0`}>
            <Image
              src={partner.logo}
              alt={partner.name}
              width={32}
              height={32}
              className="object-contain p-1"
            />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <h3 className="text-sm font-bold text-gray-800 leading-tight mb-0.5 break-words">{partner.name}</h3>
            <p className="text-[10px] text-gray-600 leading-tight break-words">{partner.type}</p>
          </div>
        </div>
      </div>

      {/* Desktop: Full Header */}
      <div className={`hidden md:block bg-gradient-to-r ${theme.bg} p-4 md:p-6 border-b ${theme.border}`}>
        <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <div className={`w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg border ${theme.border} flex-shrink-0`}>
            <Image
              src={partner.logo}
              alt={partner.name}
              width={40}
              height={40}
              className="object-contain md:w-[50px] md:h-[50px]"
            />
          </div>
          <div className={`flex-1 min-w-0 ${dir === 'rtl' ? 'text-right' : ''}`}>
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 break-words leading-tight">{partner.name}</h3>
            <p className="text-sm md:text-base text-gray-600">{partner.type}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5 md:p-4 md:p-6">
        {/* Description - Mobile: Hidden, Desktop: Shown */}
        <p className="hidden md:block text-sm text-gray-600 mb-4 leading-relaxed">
          {partner.description}
        </p>

        {/* Contact Info - Compact for mobile */}
        <div className="[&>*]:mb-[-4px] md:[&>*]:mb-0 md:space-y-3">
          {/* Location */}
          <div className={`flex items-start gap-1.5 md:gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <MapPin className={`h-3 w-3 md:h-4 md:w-4 ${theme.icon} flex-shrink-0 mt-0.5`} />
            <span className="text-[11px] md:text-sm text-gray-700 leading-none md:leading-relaxed flex-1">{partner.location}</span>
          </div>
          {/* Phone */}
          {partner.phone && (
            <a 
              href={`tel:${partner.phone.replace(/\s/g, '')}`}
              className={`flex items-center gap-1.5 md:gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''} group`}
            >
              <Phone className={`h-3 w-3 md:h-4 md:w-4 ${theme.icon} flex-shrink-0`} />
              <span className={`text-[11px] md:text-sm ${theme.icon} group-hover:underline break-all leading-none md:leading-normal`}>
                {partner.phone}
              </span>
            </a>
          )}
          {/* Website */}
          {partner.website && (
            <a 
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 md:gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''} group`}
            >
              <Globe className={`h-3 w-3 md:h-4 md:w-4 ${theme.icon} flex-shrink-0`} />
              <span className={`text-[11px] md:text-sm ${theme.icon} group-hover:underline break-all truncate leading-none md:leading-normal`}>
                {partner.website.replace('https://', '').replace('http://', '')}
              </span>
            </a>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-3 md:mt-4">
          {partner.directions && (
            <a 
              href={partner.directions}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 ${theme.button} text-white px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-colors min-h-[40px] md:min-h-[44px] touch-manipulation`}
            >
              <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4" />
              {t('common.directions')}
            </a>
          )}
          {partner.website && (
            <a 
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 border ${theme.buttonBorder} px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-colors min-h-[40px] md:min-h-[44px] touch-manipulation`}
            >
              <Globe className="h-3.5 w-3.5 md:h-4 md:w-4" />
              {websiteButtonText}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
