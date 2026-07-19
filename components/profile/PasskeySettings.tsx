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
    return <Laptop className="h-5 w-5 text-gray-600" />
  }

  // Don't show if passkeys are not supported
  if (!isSupported) {
    return null
  }

  return (
    <div className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-[0_14px_40px_rgba(17,24,39,0.04)] sm:p-6 lg:p-8">
      {/* Header */}
      <div className={`flex items-center gap-2 md:gap-3 mb-4 md:mb-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <div className="rounded-xl bg-gray-100 p-2 text-gray-700 md:p-3">
          <Fingerprint className="h-4 w-4 md:h-6 md:w-6" />
        </div>
        <div className={dir === 'rtl' ? 'text-right' : ''}>
          <h2 className="text-lg font-semibold tracking-tight text-gray-950 md:text-2xl">
            {t('login.managePasskeys') || 'Manage Passkeys'}
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            Face ID / Touch ID
          </p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className={`mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <span className="text-sm text-green-700">{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={`mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Description */}
      <p className={`text-sm text-gray-600 mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
        {t('profile.passkeyDescription') || 'Use Face ID or Touch ID to sign in quickly and securely without a password.'}
      </p>

      {/* Passkey List */}
      {passkeys.length > 0 ? (
        <div className="space-y-3 mb-4">
          {passkeys.map((passkey: Passkey) => (
            <div
              key={passkey.id}
              className={`flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {getDeviceIcon(passkey.deviceType)}
                <div className={dir === 'rtl' ? 'text-right' : ''}>
                  <p className="font-medium text-gray-800 text-sm md:text-base">
                    {passkey.deviceName || 'Unknown Device'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {passkey.lastUsedAt 
                      ? `Last used: ${formatDate(passkey.lastUsedAt)}`
                      : `Added: ${formatDate(passkey.createdAt)}`
                    }
                  </p>
                  {passkey.backedUp && (
                    <div className={`flex items-center gap-1 mt-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Shield className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600">Synced to iCloud</span>
                    </div>
                  )}
                </div>
              </div>
              
              {showConfirmDelete === passkey.id ? (
                <div className={`flex gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => handleDeletePasskey(passkey.id)}
                    disabled={isLoading}
                    className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {t('common.confirm') || 'Confirm'}
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(null)}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    {t('common.cancel') || 'Cancel'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmDelete(passkey.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title={t('login.deletePasskey') || 'Delete Passkey'}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={`p-4 md:p-6 bg-gray-50 rounded-lg border border-gray-200 text-center mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
          <Fingerprint className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            {t('login.noPasskeysRegistered') || 'No passkeys registered'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Add a passkey to enable quick sign-in with Face ID or Touch ID
          </p>
        </div>
      )}

      {/* Add Passkey Button */}
      {isPlatformAuthenticatorAvailable && (
        <button
          onClick={handleAddPasskey}
          disabled={isLoading}
          className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 py-3 font-semibold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50 md:gap-3 md:py-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
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
