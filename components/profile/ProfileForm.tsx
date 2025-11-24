'use client'

import Link from 'next/link'
import { User, Shield, Eye, Lock, CheckCircle, X, MessageCircle, Phone, Zap, Clock, Gift, Sparkles, Heart } from 'lucide-react'
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
  }
  onEditDataChange: (data: { name: string; phone: string; address: string; birthday: string }) => void
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
  const { t, locale, dir } = useTranslation()
  const handleInputChange = (field: keyof typeof editData, value: string) => {
    onEditDataChange({
      ...editData,
      [field]: value
    })
  }

  return (
    <div className="space-y-8">
      
      {/* Personal Information */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
            <User className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{t('profile.personalInformation')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('profile.fullName')}</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            ) : (
              <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                <p className="text-gray-800">{user.name}</p>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('profile.email')}</label>
            <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
              <p className="text-gray-800 break-all">{user.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('profile.phone')}</label>
            {isEditing ? (
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            ) : (
              <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                <p className="text-gray-800">{user.phone || t('profile.notProvided')}</p>
              </div>
            )}
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('profile.birthday')}</label>
            {isEditing ? (
              <input
                type="date"
                value={editData.birthday}
                onChange={(e) => handleInputChange('birthday', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            ) : (
              <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                <p className="text-gray-800">
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
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">{t('profile.address')}</label>
            {isEditing ? (
              <textarea
                value={editData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm resize-none"
                placeholder={t('profile.enterYourAddress')}
              />
            ) : (
              <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                <p className="text-gray-800">{user.address || t('profile.notProvided')}</p>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              onClick={onSave}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl min-h-[44px] touch-manipulation"
            >
              <CheckCircle className="h-5 w-5" />
              {t('profile.saveChanges')}
            </button>
            <button
              onClick={onCancel}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 min-h-[44px] touch-manipulation"
            >
              <X className="h-5 w-5" />
              {t('common.cancel')}
            </button>
          </div>
        )}
      </div>

      {/* Account Status */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{t('profile.accountStatus')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Price Access */}
          <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-200 rounded-lg">
                <Eye className="h-5 w-5 text-emerald-700" />
              </div>
              <h3 className="font-semibold text-gray-800">{t('profile.priceAccess')}</h3>
            </div>
            <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {user.canSeePrices ? (
                <>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    {t('profile.allowed')}
                  </span>
                  <p className="text-emerald-700 text-sm font-medium">{t('profile.youCanViewProductPrices')}</p>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium">
                    <Lock className="h-4 w-4" />
                    {t('profile.restricted')}
                  </span>
                  <p className="text-red-700 text-sm font-medium">{t('profile.priceAccessRequired')}</p>
                </>
              )}
            </div>
          </div>

          {/* Discount Level */}
          {user.discountType && (
            <div className={`p-6 rounded-xl border ${
              user.discountType === 'CLINIC' 
                ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
                : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  user.discountType === 'CLINIC' ? 'bg-green-200' : 'bg-red-200'
                }`}>
                  <CheckCircle className={`h-5 w-5 ${
                    user.discountType === 'CLINIC' ? 'text-green-700' : 'text-red-700'
                  }`} />
                </div>
                <h3 className="font-semibold text-gray-800">{t('profile.discountLevel')}</h3>
              </div>
              <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  user.discountType === 'CLINIC' 
                    ? 'bg-green-200 text-green-800' 
                    : 'bg-red-200 text-red-800'
                }`}>
                  {user.discountType === 'CLINIC' ? t('profile.clinicPartner') : t('profile.standard')}
                </span>
                <p className={`text-sm font-medium ${
                  user.discountType === 'CLINIC' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {user.discountPercentage ? `${user.discountPercentage}% ${t('profile.discount')}` : t('profile.noDiscount')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
            <MessageCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t('profile.needHelp')}</h2>
            <p className="text-gray-600">{t('profile.getInstantSupport')}</p>
          </div>
        </div>
        
        <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <a
            href="https://wa.me/971585487665"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl min-h-[44px] touch-manipulation ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            <MessageCircle className="h-5 w-5" />
            {t('profile.startWhatsAppChat')}
          </a>
          <div className={`flex items-center justify-center gap-2 text-gray-600 py-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Phone className="h-5 w-5" />
            <span className="font-medium text-sm sm:text-base">+971 58 548 76 65</span>
          </div>
        </div>
        
        <div className={`mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>
          <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Zap className="h-4 w-4" />
            <span>{t('profile.available247')}</span>
          </div>
          <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Clock className="h-4 w-4" />
            <span>{t('profile.quickResponse')}</span>
          </div>
          <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Gift className="h-4 w-4" />
            <span>{t('profile.productRecommendations')}</span>
          </div>
        </div>
      </div>

      {/* Skin Recommendation */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl">
            <Sparkles className="h-6 w-6 text-pink-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t('profile.skinRecommendation')}</h2>
            <p className="text-gray-600">{t('profile.getPersonalizedRecommendations')}</p>
          </div>
        </div>
        
        <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <Link
            href={getLocalizedPath('/skin-recommendation', locale)}
            className={`flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl min-h-[44px] touch-manipulation ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            <Sparkles className="h-5 w-5" />
            {t('profile.getSkinAnalysis')}
          </Link>
          <div className={`flex items-center justify-center gap-2 text-gray-600 py-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Heart className="h-5 w-5" />
            <span className="font-medium text-sm sm:text-base">{t('profile.personalizedRecommendations')}</span>
          </div>
        </div>
        
        <div className={`mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>
          <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Sparkles className="h-4 w-4" />
            <span>{t('profile.aiPoweredAnalysis')}</span>
          </div>
          <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Heart className="h-4 w-4" />
            <span>{t('profile.personalizedResults')}</span>
          </div>
          <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Gift className="h-4 w-4" />
            <span>{t('profile.productSuggestions')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
