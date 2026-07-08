'use client'

import Image from 'next/image'
import { Camera, X, Crown, Building, Eye, Calendar, Sparkles } from 'lucide-react'
import { User as UserType } from '@/types/user'
import { useTranslation } from '@/hooks/useTranslation'

interface ProfileHeaderProps {
  user: UserType
  isEditing: boolean
  previewImage: string | null
  customerNumber: number
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

export default function ProfileHeader({
  user,
  isEditing,
  previewImage,
  customerNumber,
  onImageUpload,
  onRemoveImage,
  fileInputRef
}: ProfileHeaderProps) {
  const { t, locale } = useTranslation()
  
  // Check if user logged in with Apple (private relay or anonymized email)
  const isAppleLogin = user.email.includes('@privaterelay.appleid.com') || user.email.includes('@genosys.local')
  
  // Display email logic: for Apple users, show contactEmail or "Logged in with Apple"
  const displayEmail = isAppleLogin 
    ? (user.contactEmail || 'Logged in with Apple')
    : user.email
    
  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-xl border border-gray-100 p-3 md:p-6 lg:p-8 mb-3 md:mb-6 lg:mb-8">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex items-center gap-3">
          {/* Small Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-green-100 to-emerald-200 border-2 border-white shadow-md">
              {previewImage ? (
                <Image src={previewImage} alt="Profile" width={64} height={64} className="w-full h-full object-cover" />
              ) : user.profilePicture ? (
                <Image src={user.profilePicture} alt="Profile" width={64} height={64} className="w-full h-full object-cover" />
              ) : (
                <Image src="/images/avatar/avatar.png" alt="Profile" width={64} height={64} className="w-full h-full object-cover" />
              )}
            </div>
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-6 h-6 bg-white border-2 border-primary-600 text-primary-600 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-50 active:bg-primary-100 transition-colors touch-manipulation"
                aria-label={t('profile.uploadPhoto')}
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          
          {/* Name & Email */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-gray-900 truncate">{user.name}</h1>
            <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
            {customerNumber > 0 && (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-900 text-white rounded-full mt-1">
                <Sparkles className="h-2.5 w-2.5" />
                <span className="text-[10px] font-medium">#{customerNumber}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Compact Badges Row */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {user.canSeePrices && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-medium">
              <Eye className="h-2.5 w-2.5" />
              {t('profile.priceAccess')}
            </span>
          )}
          {user.discountType && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
              user.discountType === 'CLINIC' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {user.discountType === 'CLINIC' ? <Building className="h-2.5 w-2.5" /> : <Crown className="h-2.5 w-2.5" />}
              {user.discountPercentage}% {t('product.off')}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium">
            <Calendar className="h-2.5 w-2.5" />
            {new Date(user.createdAt).getFullYear()}
          </span>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:flex-row md:items-center md:gap-6 lg:gap-8">
        {/* Profile Picture */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-gradient-to-br from-green-100 to-emerald-200 border-4 border-white shadow-xl flex items-center justify-center">
            {previewImage ? (
              <Image src={previewImage} alt="Profile" width={112} height={112} className="w-full h-full object-cover" />
            ) : user.profilePicture ? (
              <Image src={user.profilePicture} alt="Profile" width={112} height={112} className="w-full h-full object-cover" />
            ) : (
              <Image src="/images/avatar/avatar.png" alt="Profile" width={112} height={112} className="w-full h-full object-cover" />
            )}
          </div>
          {isEditing && (
            <div className="absolute -bottom-1 -right-1 flex gap-1.5">
              <button onClick={() => fileInputRef.current?.click()} className="bg-primary-600 text-white p-2.5 rounded-full hover:bg-primary-700 transition-colors shadow-md" title={t('profile.uploadPhoto')}>
                <Camera className="h-3.5 w-3.5" />
              </button>
              {previewImage && (
                <button onClick={onRemoveImage} className="bg-white text-gray-600 border border-gray-200 p-2.5 rounded-full hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors shadow-md" title={t('profile.removePhoto')}>
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0 text-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 truncate">{user.name}</h1>
          <p className="text-gray-600 text-sm lg:text-base break-all">{displayEmail}</p>
          {customerNumber > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 text-white rounded-full shadow-sm mt-3">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="text-xs lg:text-sm font-semibold">{t('profile.familyMember')} #{customerNumber}</span>
            </div>
          )}

          {/* User Type Badges */}
          <div className="flex flex-wrap gap-2 justify-start mt-3">
            {user.canSeePrices && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs lg:text-sm font-medium">
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                {t('profile.priceAccess')}
              </div>
            )}
            {user.discountType && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs lg:text-sm font-medium ${
                user.discountType === 'CLINIC' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.discountType === 'CLINIC' ? <Building className="h-3.5 w-3.5" aria-hidden="true" /> : <Crown className="h-3.5 w-3.5" aria-hidden="true" />}
                {user.discountType === 'CLINIC' ? `${t('profile.clinicPartner')}:` : t('profile.standard')} {user.discountPercentage}% {t('product.off')}
              </div>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs lg:text-sm font-medium">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {t('profile.memberSince')} {new Date(user.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-AE', { year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
    </div>
  )
}