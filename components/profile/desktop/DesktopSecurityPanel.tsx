'use client'

import { LogOut, Trash2 } from 'lucide-react'
import PasskeySettings from '@/components/profile/PasskeySettings'
import PrivacySettings from '@/components/profile/PrivacySettings'
import { useTranslation } from '@/hooks/useTranslation'

interface DesktopSecurityPanelProps {
  onLogout: () => void
  onDeleteAccount: () => void
}

export default function DesktopSecurityPanel({
  onLogout,
  onDeleteAccount,
}: DesktopSecurityPanelProps) {
  const { t, dir } = useTranslation()
  const isRTL = dir === 'rtl'

  return (
    <div className="space-y-5">
      <PasskeySettings />
      <PrivacySettings />

      <section className={`rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_14px_40px_rgba(17,24,39,0.04)] lg:p-8 ${isRTL ? 'text-right' : ''}`}>
        <h2 className="text-xl font-semibold tracking-tight text-gray-950">{t('profile.accountActions')}</h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">{t('profile.accountActionsDescription')}</p>

        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <button
            type="button"
            onClick={onLogout}
            className={`flex min-h-20 items-center gap-4 rounded-2xl border border-gray-200 p-4 text-left transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
              <LogOut className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-gray-950">{t('profile.signOut')}</span>
              <span className="mt-1 block text-xs text-gray-500">{t('profile.signOutOfYourAccount')}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={onDeleteAccount}
            className={`flex min-h-20 items-center gap-4 rounded-2xl border border-red-200 bg-red-50/60 p-4 text-left transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
              <Trash2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-red-900">{t('profile.deleteAccount')}</span>
              <span className="mt-1 block text-xs text-red-700">{t('profile.permanentlyDeleteYourAccount')}</span>
            </span>
          </button>
        </div>
      </section>
    </div>
  )
}
