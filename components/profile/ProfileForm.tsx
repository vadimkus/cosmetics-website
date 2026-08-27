'use client'

import { User, Shield, Eye, Lock, CheckCircle, X, Mail, AlertCircle, Edit3 } from 'lucide-react'
import { User as UserType } from '@/types/user'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalTodayYmd } from '@/lib/validation'

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
  const maxBirthday = getLocalTodayYmd()
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
      <div className="rounded-3xl border border-[var(--cera-line)] bg-white p-5 shadow-[0_14px_40px_-28px_rgba(23,20,15,0.26)] md:p-6 lg:p-8">
        <div className="flex items-center gap-2.5 md:gap-3.5 mb-3 md:mb-6">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-[var(--cera-ink)] flex items-center justify-center shrink-0">
            <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <h2 className="text-sm md:text-xl font-semibold text-[var(--cera-ink)] tracking-tight">{t('profile.personalInformation')}</h2>
        </div>

        {isEditing && (
          <div
            role="status"
            aria-live="polite"
            className="mb-3 md:mb-6 flex items-start gap-2 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-amber-50 border border-amber-200"
          >
            <Edit3 className="h-4 w-4 md:h-5 md:w-5 text-amber-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs md:text-sm text-amber-900">
              <span className="font-semibold">{t('profile.editingMode') || 'Editing mode'}.</span>{' '}
              {t('profile.editingHint') || 'Make your changes, then press Save. Your sign-in email cannot be edited here.'}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          
          {/* Name */}
          <div className="space-y-1 md:space-y-2">
            <label htmlFor="profile-name" className="text-xs md:text-sm font-medium text-[var(--cera-body)]">
              {t('profile.fullName')}
            </label>
            {isEditing ? (
              <>
                <input
                  id="profile-name"
                  type="text"
                  value={editData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-[var(--cera-line)] rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                  aria-describedby="name-hint"
                  autoComplete="name"
                />
                <p id="name-hint" className="sr-only">
                  {t('profile.enterYourFullName') || 'Enter your full name as it appears on official documents'}
                </p>
              </>
            ) : (
              <div className="px-3 md:px-4 py-2 md:py-3 bg-[var(--cera-cream-deep)] rounded-lg md:rounded-xl border border-[var(--cera-line)]">
                <p className="text-sm md:text-base text-[var(--cera-ink)]">{user.name}</p>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1 md:space-y-2">
            <label className="text-xs md:text-sm font-medium text-[var(--cera-body)]">{t('profile.email')}</label>
            <div className="px-3 md:px-4 py-2 md:py-3 bg-[var(--cera-cream-deep)] rounded-lg md:rounded-xl border border-[var(--cera-line)]">
              <p className="text-sm md:text-base text-[var(--cera-ink)] break-all">
                {isApplePrivateRelay ? t('profile.hidden') : user.email}
              </p>
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
              <label className="text-xs md:text-sm font-medium text-[var(--cera-body)] flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-600" />
                Contact Email
                <span className="text-xs text-[var(--cera-muted)]">(for order confirmation)</span>
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="your.real.email@example.com"
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-[var(--cera-line)] rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                />
              ) : (
                <div className="px-3 md:px-4 py-2 md:py-3 bg-[var(--cera-cream-deep)] rounded-lg md:rounded-xl border border-[var(--cera-line)]">
                  <p className="text-sm md:text-base text-[var(--cera-ink)]">
                    {user.contactEmail || (
                      <span className="text-[var(--cera-muted)] italic">Not provided</span>
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
            <label htmlFor="profile-phone" className="text-xs md:text-sm font-medium text-[var(--cera-body)]">
              {t('profile.phone')}
            </label>
            {isEditing ? (
              <>
                <input
                  id="profile-phone"
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-[var(--cera-line)] rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                  aria-describedby="phone-hint"
                  autoComplete="tel"
                  placeholder="+971 XX XXX XXXX"
                />
                <p id="phone-hint" className="text-[10px] md:text-xs text-[var(--cera-muted)] mt-1">
                  {t('profile.phoneHint') || 'Enter your UAE phone number for delivery updates'}
                </p>
              </>
            ) : (
              <div className="px-3 md:px-4 py-2 md:py-3 bg-[var(--cera-cream-deep)] rounded-lg md:rounded-xl border border-[var(--cera-line)]">
                <p className="text-sm md:text-base text-[var(--cera-ink)]">{user.phone || t('profile.notProvided')}</p>
              </div>
            )}
          </div>

          {/* Birthday */}
          <div className="space-y-1 md:space-y-2">
            <label htmlFor="profile-birthday" className="text-xs md:text-sm font-medium text-[var(--cera-body)]">
              {t('profile.birthday')}
            </label>
            {isEditing ? (
              <>
                <input
                  id="profile-birthday"
                  type="date"
                  value={editData.birthday}
                  onChange={(e) => handleInputChange('birthday', e.target.value)}
                  max={maxBirthday}
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-[var(--cera-line)] rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                  aria-describedby="birthday-hint"
                  autoComplete="bday"
                />
                <p id="birthday-hint" className="text-[10px] md:text-xs text-[var(--cera-muted)] mt-1">
                  {t('profile.birthdayHint') || 'Get special offers on your birthday'}
                </p>
              </>
            ) : (
              <div className="px-3 md:px-4 py-2 md:py-3 bg-[var(--cera-cream-deep)] rounded-lg md:rounded-xl border border-[var(--cera-line)]">
                <p className="text-sm md:text-base text-[var(--cera-ink)]">
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
            <label htmlFor="profile-address" className="text-xs md:text-sm font-medium text-[var(--cera-body)]">
              {t('profile.address')}
            </label>
            {isEditing ? (
              <>
                <textarea
                  id="profile-address"
                  value={editData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-[var(--cera-line)] rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white resize-none"
                  placeholder={t('profile.enterYourAddress')}
                  aria-describedby="address-hint"
                  autoComplete="street-address"
                />
                <p id="address-hint" className="text-[10px] md:text-xs text-[var(--cera-muted)] mt-1">
                  {t('profile.addressHint') || 'Include building name, apartment number, and area for faster delivery'}
                </p>
              </>
            ) : (
              <div className="px-3 md:px-4 py-2 md:py-3 bg-[var(--cera-cream-deep)] rounded-lg md:rounded-xl border border-[var(--cera-line)]">
                <p className="text-sm md:text-base text-[var(--cera-ink)]">{user.address || t('profile.notProvided')}</p>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-2 md:gap-3 mt-4 md:mt-8 pt-3 md:pt-6 border-t border-[var(--cera-line)]">
            <button
              onClick={onSave}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-8 py-2.5 md:py-3 bg-[var(--cera-cta)] text-white rounded-lg md:rounded-xl text-sm md:text-base font-semibold hover:bg-[var(--cera-rose-ink)] active:scale-[0.99] transition-all min-h-[40px] md:min-h-[44px] touch-manipulation shadow-sm"
            >
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
              {t('profile.saveChanges')}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-white text-[var(--cera-body)] border border-[var(--cera-line)] rounded-lg md:rounded-xl text-sm md:text-base font-semibold hover:bg-[var(--cera-cream-deep)] hover:border-[var(--cera-line)] transition-all min-h-[40px] md:min-h-[44px] touch-manipulation"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
              {t('common.cancel')}
            </button>
          </div>
        )}
      </div>

      {/* Account Status */}
      <div className="rounded-3xl border border-[var(--cera-line)] bg-white p-5 shadow-[0_14px_40px_-28px_rgba(23,20,15,0.26)] md:p-6 lg:p-8">
        <div className="flex items-center gap-2.5 md:gap-3.5 mb-3 md:mb-6">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-[var(--cera-ink)] flex items-center justify-center shrink-0">
            <Shield className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <h2 className="text-sm md:text-xl font-semibold text-[var(--cera-ink)] tracking-tight">{t('profile.accountStatus')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          {/* Price Access */}
          <div className="flex items-center justify-between p-3 md:p-5 bg-[var(--cera-cream-deep)] rounded-lg md:rounded-xl border border-[var(--cera-line)]">
            <div className="flex items-center gap-2.5">
              <Eye className="h-4 w-4 md:h-5 md:w-5 text-[var(--cera-muted)]" />
              <h3 className="text-xs md:text-sm font-medium text-[var(--cera-body)]">{t('profile.priceAccess')}</h3>
            </div>
            {user.canSeePrices ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] md:text-xs font-semibold">
                <CheckCircle className="h-3 w-3 md:h-3.5 md:w-3.5" />
                {t('profile.allowed')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-[10px] md:text-xs font-semibold">
                <Lock className="h-3 w-3 md:h-3.5 md:w-3.5" />
                {t('profile.restricted')}
              </span>
            )}
          </div>

          {/* Discount Level */}
          {user.discountType ? (
            <div className="flex items-center justify-between p-3 md:p-5 bg-[var(--cera-cream-deep)] rounded-lg md:rounded-xl border border-[var(--cera-line)]">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-[var(--cera-muted)]" aria-hidden="true" />
                <h3 className="text-xs md:text-sm font-medium text-[var(--cera-body)]">{t('profile.discountLevel')}</h3>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 bg-[var(--cera-cta)] text-white rounded-full text-[10px] md:text-xs font-semibold">
                {user.discountPercentage}% {t('product.off')}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 md:p-5 bg-[var(--cera-cream-deep)] rounded-lg md:rounded-xl border border-[var(--cera-line)]">
              <div className="flex items-center gap-2.5 min-w-0">
                <Shield className="h-4 w-4 md:h-5 md:w-5 text-[var(--cera-muted)] shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <h3 className="text-xs md:text-sm font-medium text-[var(--cera-body)]">{t('profile.accountType') || 'Account type'}</h3>
                  <p className="hidden md:block text-[11px] text-[var(--cera-muted)] truncate">
                    {t('profile.standardAccountHint') || 'Contact us to apply for clinic-partner pricing.'}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 bg-white text-[var(--cera-body)] border border-[var(--cera-line)] rounded-full text-[10px] md:text-xs font-semibold shrink-0">
                {t('profile.standardAccount') || 'Standard'}
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
