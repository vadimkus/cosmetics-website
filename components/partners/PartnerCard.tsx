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
    <div className={`bg-gradient-to-r ${theme.bg} rounded-xl shadow-lg border ${theme.border} p-6 mb-8`}>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <div className={`w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border ${theme.border}`}>
            <Image
              src={partner.logo}
              alt={`${partner.name} Logo`}
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex-1 text-center lg:text-left">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{partner.name}</h3>
          <p className="text-base text-gray-600 mb-2">{partner.type}</p>
          <p className="text-sm text-gray-600 mb-3">
            {partner.description}
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <Building className={`h-4 w-4 ${theme.icon}`} />
              <span>{partner.location}</span>
            </div>
            {partner.phone && (
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className={theme.icon}>📞</span>
                <a href={`tel:${partner.phone.replace(/\s/g, '')}`} className={`hover:${theme.icon} transition-colors`}>
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
                  className={`hover:${theme.icon} transition-colors`}
                >
                  {partner.website.replace('https://', '').replace('http://', '')}
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {partner.directions && (
            <a 
              href={partner.directions}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center ${theme.button} text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors`}
            >
              📍 Directions
            </a>
          )}
          {partner.website && (
            <a 
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center border ${theme.buttonBorder} px-4 py-2 rounded-lg text-sm font-semibold transition-colors`}
            >
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
