import { Building } from 'lucide-react'
import Image from 'next/image'
import { Partner } from '@/types/partner'

interface PartnerCardProps {
  partner: Partner
}

const themeClasses = {
  emerald: {
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    icon: "text-emerald-600",
    button: "bg-emerald-600 hover:bg-emerald-700",
    buttonBorder: "border-emerald-600 text-emerald-600 hover:bg-emerald-50"
  },
  pink: {
    bg: "from-pink-50 to-rose-50",
    border: "border-pink-200",
    icon: "text-pink-600",
    button: "bg-pink-600 hover:bg-pink-700",
    buttonBorder: "border-pink-600 text-pink-600 hover:bg-pink-50"
  },
  blue: {
    bg: "from-blue-50 to-indigo-50",
    border: "border-blue-200",
    icon: "text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
    buttonBorder: "border-blue-600 text-blue-600 hover:bg-blue-50"
  },
  purple: {
    bg: "from-purple-50 to-violet-50",
    border: "border-purple-200",
    icon: "text-purple-600",
    button: "bg-purple-600 hover:bg-purple-700",
    buttonBorder: "border-purple-600 text-purple-600 hover:bg-purple-50"
  }
}

export default function PartnerCard({ partner }: PartnerCardProps) {
  const theme = themeClasses[partner.theme]
  
  return (
    <div className={`bg-gradient-to-r ${theme.bg} rounded-xl shadow-lg border ${theme.border} p-4 sm:p-6 mb-6 sm:mb-8`}>
      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
        <div className="flex-shrink-0">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg border ${theme.border}`}>
            <Image
              src={partner.logo}
              alt={`${partner.name} Logo`}
              width={40}
              height={40}
              className="object-contain sm:w-[50px] sm:h-[50px]"
            />
          </div>
        </div>
        <div className="flex-1 text-center lg:text-left">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{partner.name}</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-2">{partner.type}</p>
          <p className="text-xs sm:text-sm text-gray-600 mb-3">
            {partner.description}
          </p>
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <Building className={`h-3 w-3 sm:h-4 sm:w-4 ${theme.icon}`} />
              <span className="break-words">{partner.location}</span>
            </div>
            {partner.phone && (
              <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className={theme.icon}>📞</span>
              <a href={`tel:${partner.phone.replace(/\s/g, '')}`} className={`hover:${theme.icon} transition-colors break-all`}>
                {partner.phone}
              </a>
            </div>
            )}
            {partner.website && (
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className={theme.icon}>🌐</span>
                <a 
                  href={partner.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`hover:${theme.icon} transition-colors break-all`}
                >
                  {partner.website.replace('https://', '').replace('http://', '')}
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full sm:w-auto gap-2 mt-4 lg:mt-0">
          {partner.directions && (
            <a 
              href={partner.directions}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center ${theme.button} text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors`}
            >
              📍 Directions
            </a>
          )}
          {partner.website && (
            <a 
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center border ${theme.buttonBorder} px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors`}
            >
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
