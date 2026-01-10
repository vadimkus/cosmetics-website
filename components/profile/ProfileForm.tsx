'use client'

import Link from 'next/link'
import { User, Shield, Eye, Lock, CheckCircle, X, MessageCircle, Zap, Clock, Gift, Sparkles, Heart, Mail, AlertCircle } from 'lucide-react'
import { User as UserType } from '@/types/user'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

interface ProfileFormProps {
  user: UserType
  isEditing: boolean
  editData: {
    name: string
    phone: string
    address: string
    birthday: string
    contactEmail: string
  }
  onEditDataChange: (data: { name: string; phone: string; address: string; birthday: string; contactEmail: string }) => void
  onSave: () => void
  onCancel: () => void
}

export default function ProfileForm({
  user,
  isEditing,
  editData,
  onEditDataChange,
  onSave,
  onCancel
}: ProfileFormProps) {
  const { t, locale } = useTranslation()
  const handleInputChange = (field: keyof typeof editData, value: string) => {
    onEditDataChange({
      ...editData,
      [field]: value
    })
  }

  // Check if user signed in with Apple Private Relay or has a deleted/anonymized account
  const isApplePrivateRelay = user.email.includes('@privaterelay.appleid.com') || user.email.includes('@genosys.local')
  // Also check if user originally used Apple (deleted accounts start with "deleted+")
  const isDeletedAppleAccount = user.email.startsWith('deleted+') && user.email.includes('@genosys.local')

  return (
    <div className="space-y-3 md:space-y-8">
      
      {/* Personal Information */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-lg border border-gray-100 p-3 md:p-6 lg:p-8">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
          <div className="p-2 md:p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg md:rounded-xl">
            <User className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
          </div>
          <h2 className="text-sm md:text-2xl font-bold text-gray-800">{t('profile.personalInformation')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          
          {/* Name */}
          <div className="space-y-1 md:space-y-2">
            <label className="text-xs md:text-sm font-medium text-gray-700">{t('profile.fullName')}</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
              />
            ) : (
              <div className="px-3 md:px-4 py-2 md:py-3 bg-gray-50 rounded-lg md:rounded-xl border border-gray-100">
                <p className="text-sm md:text-base text-gray-800">{user.name}</p>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1 md:space-y-2">
            <label className="text-xs md:text-sm font-medium text-gray-700">{t('profile.email')}</label>
            <div className="px-3 md:px-4 py-2 md:py-3 bg-gray-50 rounded-lg md:rounded-xl border border-gray-100">
              <p className="text-sm md:text-base text-gray-800 break-all">{user.email}</p>
            </div>
            {user.email.includes('@privaterelay.appleid.com') && (
              <div className="flex items-start gap-2 p-2 md:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Shield className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                  <strong>Apple Private Relay:</strong> This email is private. Add a contact email below to receive notifications.
                </p>
              </div>
            )}
            {isDeletedAppleAccount && (
              <div className="flex items-start gap-2 p-2 md:p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-orange-800">
                  Logged in with Apple. Please add a contact email below to receive notifications.
                </p>
              </div>
            )}
          </div>

          {/* Contact Email (for Apple Private Relay users and anonymized accounts) - Full Width */}
          {isApplePrivateRelay && (
            <div className="space-y-1 md:space-y-2 md:col-span-2">
              <label className="text-xs md:text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-600" />
                Contact Email
                <span className="text-xs text-gray-500">(for order confirmation)</span>
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="your.real.email@example.com"
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                />
              ) : (
                <div className="px-3 md:px-4 py-2 md:py-3 bg-gray-50 rounded-lg md:rounded-xl border border-gray-100">
                  <p className="text-sm md:text-base text-gray-800">
                    {user.contactEmail || (
                      <span className="text-gray-500 italic">Not provided</span>
                    )}
                  </p>
                </div>
              )}
              {!isEditing && !user.contactEmail && (
                <div className="flex items-start gap-2 p-2 md:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs md:text-sm text-yellow-800">
                    Add your real email to receive order updates and notifications.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Phone */}
          <div className="space-y-1 md:space-y-2">
            <label className="text-xs md:text-sm font-medium text-gray-700">{t('profile.phone')}</label>
            {isEditing ? (
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
              />
            ) : (
              <div className="px-3 md:px-4 py-2 md:py-3 bg-gray-50 rounded-lg md:rounded-xl border border-gray-100">
                <p className="text-sm md:text-base text-gray-800">{user.phone || t('profile.notProvided')}</p>
              </div>
            )}
          </div>

          {/* Birthday */}
          <div className="space-y-1 md:space-y-2">
            <label className="text-xs md:text-sm font-medium text-gray-700">{t('profile.birthday')}</label>
            {isEditing ? (
              <input
                type="date"
                value={editData.birthday}
                onChange={(e) => handleInputChange('birthday', e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
              />
            ) : (
              <div className="px-3 md:px-4 py-2 md:py-3 bg-gray-50 rounded-lg md:rounded-xl border border-gray-100">
                <p className="text-sm md:text-base text-gray-800">
                  {user.birthday ? new Date(user.birthday).toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-AE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : t('profile.notProvided')}
                </p>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1 md:space-y-2 md:col-span-2">
            <label className="text-xs md:text-sm font-medium text-gray-700">{t('profile.address')}</label>
            {isEditing ? (
              <textarea
                value={editData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={2}
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white resize-none"
                placeholder={t('profile.enterYourAddress')}
              />
            ) : (
              <div className="px-3 md:px-4 py-2 md:py-3 bg-gray-50 rounded-lg md:rounded-xl border border-gray-100">
                <p className="text-sm md:text-base text-gray-800">{user.address || t('profile.notProvided')}</p>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-2 md:gap-4 mt-4 md:mt-8 pt-3 md:pt-6 border-t border-gray-200">
            <button
              onClick={onSave}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-emerald-600 text-white rounded-lg md:rounded-xl text-sm md:text-base font-semibold hover:bg-emerald-700 transition-all min-h-[40px] md:min-h-[44px] touch-manipulation"
            >
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
              {t('profile.saveChanges')}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gray-200 text-gray-700 rounded-lg md:rounded-xl text-sm md:text-base font-semibold hover:bg-gray-300 transition-all min-h-[40px] md:min-h-[44px] touch-manipulation"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
              {t('common.cancel')}
            </button>
          </div>
        )}
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-lg border border-gray-100 p-3 md:p-6 lg:p-8">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
          <div className="p-2 md:p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg md:rounded-xl">
            <Shield className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
          </div>
          <h2 className="text-sm md:text-2xl font-bold text-gray-800">{t('profile.accountStatus')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
          {/* Price Access */}
          <div className="p-3 md:p-6 bg-emerald-50 rounded-lg md:rounded-xl border border-emerald-100">
            <div className="flex items-center justify-between md:justify-start md:gap-3 mb-2 md:mb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
                <h3 className="text-xs md:text-base font-semibold text-gray-800">{t('profile.priceAccess')}</h3>
              </div>
              {user.canSeePrices ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-200 text-emerald-800 rounded-full text-[10px] md:text-sm font-medium">
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
                  {t('profile.allowed')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-200 text-red-800 rounded-full text-[10px] md:text-sm font-medium">
                  <Lock className="h-3 w-3 md:h-4 md:w-4" />
                  {t('profile.restricted')}
                </span>
              )}
            </div>
          </div>

          {/* Discount Level */}
          {user.discountType && (
            <div className={`p-3 md:p-6 rounded-lg md:rounded-xl border ${
              user.discountType === 'CLINIC' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
            }`}>
              <div className="flex items-center justify-between md:justify-start md:gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 md:h-5 md:w-5 ${user.discountType === 'CLINIC' ? 'text-green-600' : 'text-red-600'}`} />
                  <h3 className="text-xs md:text-base font-semibold text-gray-800">{t('profile.discountLevel')}</h3>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-sm font-medium ${
                  user.discountType === 'CLINIC' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}>
                  {user.discountPercentage}% {t('product.off')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Support Section - Compact on mobile */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-lg border border-gray-100 p-3 md:p-6 lg:p-8">
        <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-6">
          <div className="p-2 md:p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg md:rounded-xl">
            <MessageCircle className="h-4 w-4 md:h-8 md:w-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-sm md:text-2xl font-bold text-gray-800">{t('profile.needHelp')}</h2>
            <p className="text-[10px] md:text-base text-gray-500 hidden md:block">{t('profile.getInstantSupport')}</p>
          </div>
        </div>
        
        <a
          href="https://wa.me/971585487665"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 md:gap-2 bg-green-600 text-white px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl text-xs md:text-base font-medium md:font-semibold hover:bg-green-700 transition-all min-h-[36px] md:min-h-[44px] touch-manipulation w-full md:w-auto"
        >
          <MessageCircle className="h-3.5 w-3.5 md:h-5 md:w-5" />
          {t('profile.startWhatsAppChat')}
        </a>
        
        <div className="hidden md:grid mt-6 grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2"><Zap className="h-4 w-4" /><span>{t('profile.available247')}</span></div>
          <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{t('profile.quickResponse')}</span></div>
          <div className="flex items-center gap-2"><Gift className="h-4 w-4" /><span>{t('profile.productRecommendations')}</span></div>
        </div>
      </div>

      {/* Skin Recommendation - Compact on mobile */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-lg border border-gray-100 p-3 md:p-6 lg:p-8">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
          <div className="p-2 md:p-3 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg md:rounded-xl">
            <Sparkles className="h-4 w-4 md:h-6 md:w-6 text-pink-600" />
          </div>
          <div>
            <h2 className="text-sm md:text-2xl font-bold text-gray-800">{t('profile.skinRecommendation')}</h2>
            <p className="text-[10px] md:text-base text-gray-500 hidden md:block">{t('profile.getPersonalizedRecommendations')}</p>
          </div>
        </div>
        
        <Link
          href={getLocalizedPath('/skin-recommendation', locale)}
          className="flex items-center justify-center gap-1.5 md:gap-2 bg-pink-600 text-white px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl text-xs md:text-base font-medium md:font-semibold hover:bg-pink-700 transition-all min-h-[36px] md:min-h-[44px] touch-manipulation w-full md:w-auto"
        >
          <Sparkles className="h-3.5 w-3.5 md:h-5 md:w-5" />
          {t('profile.getSkinAnalysis')}
        </Link>
        
        <div className="hidden md:grid mt-6 grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2"><Sparkles className="h-4 w-4" /><span>{t('profile.aiPoweredAnalysis')}</span></div>
          <div className="flex items-center gap-2"><Heart className="h-4 w-4" /><span>{t('profile.personalizedResults')}</span></div>
          <div className="flex items-center gap-2"><Gift className="h-4 w-4" /><span>{t('profile.productSuggestions')}</span></div>
        </div>
      </div>
    </div>
  )
}
