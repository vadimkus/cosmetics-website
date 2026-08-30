'use client'

import { useEffect, useState } from 'react'
import { Fingerprint, Plus, Trash2, Smartphone, Laptop, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { usePasskey, Passkey } from '@/hooks/usePasskey'
import { useTranslation } from '@/hooks/useTranslation'

export default function PasskeySettings() {
  const { t, dir } = useTranslation()
  const {
    isSupported,
    isPlatformAuthenticatorAvailable,
    isLoading,
    error,
    passkeys,
    loadPasskeys,
    registerPasskey,
    deletePasskey,
    clearError,
  } = usePasskey()

  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Load passkeys on mount
  useEffect(() => {
    loadPasskeys()
  }, [loadPasskeys])

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => setSuccessMessage(null), 3000)
      return () => clearTimeout(timeout)
    }
    return undefined
  }, [successMessage])

  const handleAddPasskey = async () => {
    clearError()
    const success = await registerPasskey()
    if (success) {
      setSuccessMessage(t('login.passkeyAdded') || 'Passkey added successfully')
    }
  }

  const handleDeletePasskey = async (passkeyId: string) => {
    clearError()
    const success = await deletePasskey(passkeyId)
    if (success) {
      setSuccessMessage(t('login.passkeyDeleted') || 'Passkey deleted successfully')
    }
    setShowConfirmDelete(null)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDeviceIcon = (deviceType: string | null) => {
    if (deviceType === 'platform') {
      return <Smartphone className="h-5 w-5 text-blue-600" />
    }
    return <Laptop className="h-5 w-5 text-[var(--cera-body)]" />
  }

  // Don't show if passkeys are not supported
  if (!isSupported) {
    return null
  }

  return (
    <div className="rounded-3xl border border-[var(--cera-line)] bg-white p-5 shadow-[0_14px_40px_-28px_rgba(23,20,15,0.26)] sm:p-6 lg:p-8">
      {/* Header */}
      <div className={`flex items-center gap-2 md:gap-3 mb-4 md:mb-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <div className="rounded-xl bg-[var(--cera-cream-deep)] p-2 text-[var(--cera-body)] md:p-3">
          <Fingerprint className="h-4 w-4 md:h-6 md:w-6" />
        </div>
        <div className={dir === 'rtl' ? 'text-right' : ''}>
          <h2 className="text-lg font-semibold tracking-tight text-[var(--cera-ink)] md:text-2xl">
            {t('login.managePasskeys') || 'Manage Passkeys'}
          </h2>
          <p className="text-xs md:text-sm text-[var(--cera-muted)]">
            Face ID / Touch ID
          </p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className={`mb-4 p-3 bg-[var(--cera-ok-bg)] border border-[var(--cera-ok-line)] rounded-lg flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <CheckCircle className="h-5 w-5 text-[var(--cera-ok)] flex-shrink-0" />
          <span className="text-sm text-[var(--cera-ok)]">{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={`mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <AlertCircle className="h-5 w-5 text-[var(--cera-rose-ink)] flex-shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Description */}
      <p className={`text-sm text-[var(--cera-body)] mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
        {t('profile.passkeyDescription') || 'Use Face ID or Touch ID to sign in quickly and securely without a password.'}
      </p>

      {/* Passkey List */}
      {passkeys.length > 0 ? (
        <div className="space-y-3 mb-4">
          {passkeys.map((passkey: Passkey) => (
            <div
              key={passkey.id}
              className={`flex items-center justify-between p-3 md:p-4 bg-[var(--cera-cream-deep)] rounded-lg border border-[var(--cera-line)] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {getDeviceIcon(passkey.deviceType)}
                <div className={dir === 'rtl' ? 'text-right' : ''}>
                  <p className="font-medium text-[var(--cera-ink)] text-sm md:text-base">
                    {passkey.deviceName || 'Unknown Device'}
                  </p>
                  <p className="text-xs text-[var(--cera-muted)]">
                    {passkey.lastUsedAt 
                      ? `Last used: ${formatDate(passkey.lastUsedAt)}`
                      : `Added: ${formatDate(passkey.createdAt)}`
                    }
                  </p>
                  {passkey.backedUp && (
                    <div className={`flex items-center gap-1 mt-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Shield className="h-3 w-3 text-[var(--cera-ok)]" />
                      <span className="text-xs text-[var(--cera-ok)]">Synced to iCloud</span>
                    </div>
                  )}
                </div>
              </div>
              
              {showConfirmDelete === passkey.id ? (
                <div className={`flex gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => handleDeletePasskey(passkey.id)}
                    disabled={isLoading}
                    className="px-3 py-1.5 text-xs font-medium bg-[var(--cera-rose)] text-white rounded-lg hover:bg-[var(--cera-rose-ink)] transition-colors disabled:opacity-50"
                  >
                    {t('common.confirm') || 'Confirm'}
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(null)}
                    className="px-3 py-1.5 text-xs font-medium bg-[var(--cera-cream-deep)] text-[var(--cera-body)] rounded-lg hover:bg-[var(--cera-blush-deep)] transition-colors"
                  >
                    {t('common.cancel') || 'Cancel'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmDelete(passkey.id)}
                  className="p-2 text-[var(--cera-rose-ink)] hover:bg-red-100 rounded-lg transition-colors"
                  title={t('login.deletePasskey') || 'Delete Passkey'}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={`p-4 md:p-6 bg-[var(--cera-cream-deep)] rounded-lg border border-[var(--cera-line)] text-center mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
          <Fingerprint className="h-10 w-10 text-[var(--cera-muted)] mx-auto mb-2" />
          <p className="text-sm text-[var(--cera-body)]">
            {t('login.noPasskeysRegistered') || 'No passkeys registered'}
          </p>
          <p className="text-xs text-[var(--cera-muted)] mt-1">
            Add a passkey to enable quick sign-in with Face ID or Touch ID
          </p>
        </div>
      )}

      {/* Add Passkey Button */}
      {isPlatformAuthenticatorAvailable && (
        <button
          onClick={handleAddPasskey}
          disabled={isLoading}
          className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--cera-cta)] py-3 font-semibold text-white transition-colors hover:bg-[var(--cera-rose-ink)] disabled:cursor-not-allowed disabled:opacity-50 md:gap-3 md:py-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Plus className="h-5 w-5" />
              <span>{t('login.addPasskey') || 'Add Face ID / Touch ID'}</span>
            </>
          )}
        </button>
      )}

      {!isPlatformAuthenticatorAvailable && (
        <p className={`text-sm text-amber-600 bg-amber-50 p-3 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
          {t('login.passkeyNotSupported') || 'Face ID / Touch ID is not available on this device.'}
        </p>
      )}
    </div>
  )
}
