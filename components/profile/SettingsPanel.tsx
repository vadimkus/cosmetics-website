'use client'

import Link from 'next/link'
import { ArrowLeft, Settings, Trash2, Zap, ShoppingBag, Heart, MessageCircle, RefreshCw, Sun } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { ThemeToggle } from '@/components/ThemeToggle'
import PasskeySettings from './PasskeySettings'

interface SettingsPanelProps {
  isRefreshing: boolean
  onLogout: () => void
  onDeleteAccount: () => void
  onRefresh: () => void
}

export default function SettingsPanel({
  isRefreshing,
  onLogout,
  onDeleteAccount,
  onRefresh
}: SettingsPanelProps) {
  const { t, locale, dir } = useTranslation()
  return (
    <div className="space-y-4 md:space-y-8">
      
      {/* Passkey Settings - Face ID / Touch ID */}
      <PasskeySettings />

      {/* Appearance Settings */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/20 p-3 sm:p-6 lg:p-8">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="p-2 md:p-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg md:rounded-xl">
            <Sun className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
          </div>
          <h2 className="text-lg md:text-2xl font-bold text-[var(--cera-ink)]">{t('theme.appearance') || 'Appearance'}</h2>
        </div>

        <div className={`${dir === 'rtl' ? 'text-right' : ''}`}>
          <p className="text-sm md:text-base text-[var(--cera-body)] mb-4">
            {t('theme.chooseTheme') || 'Choose your preferred color scheme'}
          </p>
          <ThemeToggle variant="buttons" showLabels={true} />
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/20 p-3 sm:p-6 lg:p-8">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="p-2 md:p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg md:rounded-xl">
            <Settings className="h-4 w-4 md:h-6 md:w-6 text-[var(--cera-body)]" />
          </div>
          <h2 className="text-lg md:text-2xl font-bold text-[var(--cera-ink)]">{t('profile.accountActions')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          
          {/* Logout */}
          <button
            onClick={onLogout}
            className={`flex items-center gap-2 md:gap-4 p-3 sm:p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg md:rounded-xl border border-red-200 hover:from-red-100 hover:to-red-200 transition-all duration-200 group min-h-[44px] touch-manipulation ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            <div className="p-2 md:p-3 bg-red-200 rounded-md md:rounded-lg group-hover:bg-red-300 transition-colors">
              <ArrowLeft className={`h-4 w-4 md:h-6 md:w-6 text-red-700 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </div>
            <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
              <h3 className="text-sm md:text-base font-semibold text-[var(--cera-ink)]">{t('common.logout')}</h3>
              <p className="text-xs md:text-sm text-[var(--cera-body)]">{t('profile.signOutOfYourAccount')}</p>
            </div>
          </button>

          {/* Delete Account */}
          <button
            onClick={onDeleteAccount}
            className={`flex items-center gap-2 md:gap-4 p-3 sm:p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg md:rounded-xl border border-red-200 hover:from-red-100 hover:to-red-200 transition-all duration-200 group min-h-[44px] touch-manipulation ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            <div className="p-2 md:p-3 bg-red-200 rounded-md md:rounded-lg group-hover:bg-red-300 transition-colors">
              <Trash2 className="h-4 w-4 md:h-6 md:w-6 text-red-700" />
            </div>
            <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
              <h3 className="text-sm md:text-base font-semibold text-[var(--cera-ink)]">{t('profile.deleteAccount')}</h3>
              <p className="text-xs md:text-sm text-[var(--cera-body)]">{t('profile.permanentlyDeleteYourAccount')}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/20 p-3 sm:p-6 lg:p-8">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="p-2 md:p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg md:rounded-xl">
            <Zap className="h-4 w-4 md:h-6 md:w-6 text-[var(--cera-rose-ink)]" />
          </div>
          <h2 className="text-lg md:text-2xl font-bold text-[var(--cera-ink)]">{t('profile.quickActions')}</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          
          <Link
            href={getLocalizedPath('/products', locale)}
            className="flex flex-col items-center gap-2 md:gap-3 p-3 sm:p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg md:rounded-xl border border-emerald-200 hover:from-emerald-100 hover:to-emerald-200 transition-all duration-200 group min-h-[80px] sm:min-h-[120px] touch-manipulation"
          >
            <div className="p-2 md:p-3 bg-emerald-200 rounded-md md:rounded-lg group-hover:bg-emerald-300 transition-colors">
              <ShoppingBag className="h-4 w-4 md:h-6 md:w-6 text-emerald-700" />
            </div>
            <div className="text-center">
              <h3 className="text-xs md:text-base font-semibold text-[var(--cera-ink)]">{t('profile.browseProducts')}</h3>
              <p className="text-[10px] md:text-sm text-[var(--cera-body)] hidden md:block">{t('profile.shopOurCollection')}</p>
            </div>
          </Link>

          <Link
            href={getLocalizedPath('/favorites', locale)}
            className="flex flex-col items-center gap-2 md:gap-3 p-3 sm:p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg md:rounded-xl border border-pink-200 hover:from-pink-100 hover:to-pink-200 transition-all duration-200 group min-h-[80px] sm:min-h-[120px] touch-manipulation"
          >
            <div className="p-2 md:p-3 bg-pink-200 rounded-md md:rounded-lg group-hover:bg-pink-300 transition-colors">
              <Heart className="h-4 w-4 md:h-6 md:w-6 text-pink-700" />
            </div>
            <div className="text-center">
              <h3 className="text-xs md:text-base font-semibold text-[var(--cera-ink)]">{t('common.favorites')}</h3>
              <p className="text-[10px] md:text-sm text-[var(--cera-body)] hidden md:block">{t('profile.yourSavedItems')}</p>
            </div>
          </Link>

          <a
            href="https://wa.me/971585487665"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 md:gap-3 p-3 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg md:rounded-xl border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-200 group min-h-[80px] sm:min-h-[120px] touch-manipulation"
          >
            <div className="p-2 md:p-3 bg-green-200 rounded-md md:rounded-lg group-hover:bg-green-300 transition-colors">
              <MessageCircle className="h-4 w-4 md:h-6 md:w-6 text-green-700" />
            </div>
            <div className="text-center">
              <h3 className="text-xs md:text-base font-semibold text-[var(--cera-ink)]">{t('common.contact')}</h3>
              <p className="text-[10px] md:text-sm text-[var(--cera-body)] hidden md:block">{t('profile.getHelpViaWhatsApp')}</p>
            </div>
          </a>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex flex-col items-center gap-2 md:gap-3 p-3 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg md:rounded-xl border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed min-h-[80px] sm:min-h-[120px] touch-manipulation"
          >
            <div className="p-2 md:p-3 bg-green-200 rounded-md md:rounded-lg group-hover:bg-green-300 transition-colors">
              <RefreshCw className={`h-4 w-4 md:h-6 md:w-6 text-green-700 ${isRefreshing ? 'animate-spin' : ''}`} />
            </div>
            <div className="text-center">
              <h3 className="text-xs md:text-base font-semibold text-[var(--cera-ink)]">{t('profile.refresh')}</h3>
              <p className="text-[10px] md:text-sm text-[var(--cera-body)] hidden md:block">{t('profile.updateProfileData')}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
