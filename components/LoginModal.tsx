'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Eye, EyeOff, Gift } from 'lucide-react'
import { useAuth } from './AuthProvider'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  isLoginMode: boolean
  setIsLoginMode: (mode: boolean) => void
}

export default function LoginModal({ isOpen, onClose, isLoginMode, setIsLoginMode }: LoginModalProps) {
  const { login, register, isLoading } = useAuth()
  const { t, locale, dir } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    emirate: '',
    birthday: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const lastInputRef = useRef<HTMLInputElement>(null)

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus()
    }
  }, [isOpen])

  // Handle escape key and focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'input, button, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>

        if (!focusableElements.length) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement && lastElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement && firstElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
    
    return undefined
  }, [isOpen, onClose])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isLoginMode) {
      const success = await login(formData.email, formData.password)
      if (success) {
        onClose()
        setFormData({ name: '', email: '', password: '', phone: '', address: '', emirate: '', birthday: '' })
      }
    } else {
      if (!formData.name.trim()) {
        setError(t('login.nameRequired'))
        return
      }
      if (!formData.email.trim()) {
        setError(t('login.emailRequired'))
        return
      }
      if (!formData.password.trim()) {
        setError(t('login.passwordRequired'))
        return
      }
      if (formData.password.length < 6) {
        setError(t('login.passwordMinLength'))
        return
      }
      if (!formData.phone.trim()) {
        setError(t('login.phoneRequired'))
        return
      }
      if (!formData.address.trim()) {
        setError(t('login.addressRequired'))
        return
      }
      if (!formData.emirate.trim()) {
        setError(t('login.emirateRequired'))
        return
      }
      if (!privacyConsent) {
        setError(t('login.privacyConsentRequired'))
        return
      }

      const success = await register(formData.name, formData.email, formData.password, formData.phone, formData.address, formData.emirate, formData.birthday)
      if (success) {
        onClose()
        setFormData({ name: '', email: '', password: '', phone: '', address: '', emirate: '', birthday: '' })
        setPrivacyConsent(false)
      }
    }
  }


  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    setError('')
    setFormData({ name: '', email: '', password: '', phone: '', address: '', emirate: '', birthday: '' })
    setPrivacyConsent(false)
    setShowPrivacyPolicy(false)
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      dir={dir}
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-xl p-4 md:p-6 max-w-sm md:max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl ${dir === 'rtl' ? 'text-right' : ''}`}
      >
        {/* Header */}
        <div className="relative mb-4 md:mb-5">
          <button
            onClick={onClose}
            className={`absolute top-0 ${dir === 'rtl' ? 'left-0' : 'right-0'} text-gray-400 hover:text-gray-600 p-1 touch-manipulation transition-colors`}
            aria-label={t('common.close')}
          >
            <X className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
          </button>
          <h2 id="modal-title" className="text-base md:text-lg font-bold text-gray-900 text-center pr-6">
            {isLoginMode ? t('login.professionalLogin') : t('login.professionalAccount')}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5 text-center">
            {t('login.unitedArabEmirates')}
          </p>
        </div>

        <div className={`${isLoginMode ? 'space-y-3 md:space-y-4' : 'space-y-2 md:space-y-3'}`}>
          {error && (
            <div id="error-message" className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs md:text-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={`${isLoginMode ? 'space-y-3 md:space-y-4' : 'space-y-2 md:space-y-3'}`}>
            {!isLoginMode && (
              <div>
                <label htmlFor="name" className="sr-only">{t('login.fullName')}</label>
                <input
                  ref={firstInputRef}
                  type="text"
                  id="name"
                  name="name"
                  placeholder={t('login.fullNamePlaceholder')}
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white text-gray-900 placeholder:text-gray-400 transition-shadow ${dir === 'rtl' ? 'text-right' : ''}`}
                  required={!isLoginMode}
                  aria-describedby={error && !isLoginMode ? "error-message" : undefined}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">{t('login.emailAddress')}</label>
              <input
                ref={!isLoginMode ? undefined : firstInputRef}
                type="email"
                id="email"
                name="email"
                placeholder={isLoginMode ? t('login.emailAddressPlaceholder') : t('login.emailAddressRequired')}
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 ${isLoginMode ? 'py-2.5 md:py-2' : 'py-2'} border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white text-gray-900 placeholder:text-gray-400 transition-shadow ${dir === 'rtl' ? 'text-right' : ''}`}
                required
                aria-describedby={error ? "error-message" : undefined}
              />
            </div>

            {!isLoginMode && (
              <div>
                <label htmlFor="phone" className="sr-only">{t('login.uaePhoneNumber')}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder={t('login.uaePhoneNumberPlaceholder')}
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white text-gray-900 placeholder:text-gray-400 transition-shadow ${dir === 'rtl' ? 'text-right' : ''}`}
                  required={!isLoginMode}
                  aria-describedby={error && !isLoginMode ? "error-message" : undefined}
                />
              </div>
            )}

            {!isLoginMode && (
              <div>
                <label htmlFor="address" className="sr-only">{t('login.uaeAddress')}</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder={t('login.uaeAddressPlaceholder')}
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white text-gray-900 placeholder:text-gray-400 transition-shadow ${dir === 'rtl' ? 'text-right' : ''}`}
                  required={!isLoginMode}
                  aria-describedby={error && !isLoginMode ? "error-message" : undefined}
                />
              </div>
            )}

            {!isLoginMode && (
              <div>
                <label htmlFor="emirate" className="sr-only">{t('login.emirate')}</label>
                <select
                  id="emirate"
                  name="emirate"
                  value={formData.emirate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white ${formData.emirate ? 'text-gray-900' : 'text-gray-400'} transition-shadow ${dir === 'rtl' ? 'text-right' : ''}`}
                  required={!isLoginMode}
                  aria-describedby={error && !isLoginMode ? "error-message" : undefined}
                >
                  <option value="">{t('login.selectEmirate')}</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Ajman">Ajman</option>
                  <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                  <option value="Fujairah">Fujairah</option>
                  <option value="Umm Al Quwain">Umm Al Quwain</option>
                </select>
              </div>
            )}

            {!isLoginMode && (
              <div>
                <label htmlFor="birthday" className={`block text-[10px] md:text-xs font-medium text-gray-600 mb-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t('login.birthday')}
                </label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white ${formData.birthday ? 'text-gray-900' : 'text-gray-400'} transition-shadow ${dir === 'rtl' ? 'text-right' : ''}`}
                  aria-describedby={error && !isLoginMode ? "error-message" : undefined}
                />
                <p className={`text-[10px] text-gray-500 mt-0.5 flex items-center justify-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  {t('login.birthdayMessage')} <Gift className="h-3 w-3 text-primary-600" />
                </p>
              </div>
            )}

            <div className="relative">
              <label htmlFor="password" className="sr-only">{t('login.password')}</label>
              <input
                ref={lastInputRef}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder={t('login.passwordPlaceholder')}
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 ${isLoginMode ? 'py-2.5 md:py-2' : 'py-2'} ${dir === 'rtl' ? 'pl-10' : 'pr-10'} border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white text-gray-900 transition-shadow ${dir === 'rtl' ? 'text-right' : ''}`}
                required
                aria-describedby={error ? "error-message" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 ${dir === 'rtl' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center touch-manipulation`}
                aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Forgot Password Link - Only show in login mode */}
            {isLoginMode && (
              <div className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                <Link
                  href={getLocalizedPath('/forgot-password', locale)}
                  onClick={onClose}
                  className="text-xs md:text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>
            )}

            {/* Privacy Policy Section - Only show for registration */}
            {!isLoginMode && (
              <div className="space-y-2">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 overflow-hidden">
                  <div className={`flex items-center justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <h4 className={`font-semibold text-gray-800 text-[11px] ${dir === 'rtl' ? 'text-right' : ''}`}>{t('login.privacyPolicy')}</h4>
                    <button
                      type="button"
                      onClick={() => setShowPrivacyPolicy(!showPrivacyPolicy)}
                      className="text-primary-600 hover:text-primary-700 text-[10px] font-medium underline flex-shrink-0"
                    >
                      {showPrivacyPolicy ? t('login.hideDetails') : t('login.viewDetails')}
                    </button>
                  </div>
                  
                  {showPrivacyPolicy && (
                    <div 
                      className="mt-2 pt-2 border-t border-gray-200 h-28 overflow-y-auto"
                      style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                      <div className={`text-[9px] text-gray-600 space-y-1.5 pr-1 ${dir === 'rtl' ? 'text-right pl-1 pr-0' : ''}`}>
                        <p>{t('login.privacyPolicyDescription')}</p>
                        <div>
                          <p className="font-semibold">1. {t('login.personalInformationProcessed')}</p>
                          <p>{t('login.privacyPolicyContent1')}</p>
                        </div>
                        <div>
                          <p className="font-semibold">1.1. {t('login.authenticationMethods')}</p>
                          <p>{t('login.authenticationMethodsDescription')}</p>
                        </div>
                        <div>
                          <p className="font-semibold">1.2. {t('login.googleAuthentication')}</p>
                          <p>{t('login.googleAuthenticationDescription')}</p>
                          <p className="mt-1">{t('login.googleDataShared')}</p>
                          <p className="mt-1">{t('login.googlePrivacyPolicy')}</p>
                          <p className="mt-1">{t('login.googleDataUsage')}</p>
                          <p className="mt-1">{t('login.googleAccountLinking')}</p>
                          <p className="mt-1">{t('login.googleDataControl')}</p>
                          <p className="mt-1">{t('login.googleAlternative')}</p>
                        </div>
                        <div>
                          <p className="font-semibold">2. {t('login.purposeOfProcessing')}</p>
                          <p>{t('login.purposeDescription')}</p>
                        </div>
                        <div>
                          <p className="font-semibold">3. {t('login.retentionPeriod')}</p>
                          <p>{t('login.retentionDescription')}</p>
                        </div>
                        <div>
                          <p className="font-semibold">4. {t('login.rightToRefuse')}</p>
                          <p>{t('login.rightToRefuseDescription')}</p>
                        </div>
                        <div className="p-1.5 bg-amber-50 border border-amber-200 rounded text-amber-800">
                          <p><strong>{t('login.important')}</strong> {t('login.importantMessage')}</p>
                        </div>
                        <p className="text-primary-600 font-medium">{t('login.privacyContact')}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={`flex items-start gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="checkbox"
                    id="privacy-consent"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded flex-shrink-0"
                    required
                  />
                  <label htmlFor="privacy-consent" className={`text-[10px] text-gray-600 leading-tight ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {t('login.agreeToPrivacy')}{' '}
                    <span className="text-primary-600 font-medium">{t('login.privacyPolicy')}</span>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-primary-600 text-white ${isLoginMode ? 'py-2.5 md:py-3 text-sm md:text-base' : 'py-2 text-sm'} rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm`}
            >
              {isLoading ? t('login.pleaseWait') : (isLoginMode ? t('login.signIn') : t('login.createProfessionalAccount'))}
            </button>
          </form>

          <div className={`text-center ${isLoginMode ? 'pt-2 md:pt-3' : 'pt-2'} border-t border-gray-100`}>
            <div className={`flex flex-col gap-1 text-xs text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>
              <span>{isLoginMode ? t('login.dontHaveAccount') : t('login.alreadyHaveAccount')}</span>
              <button 
                onClick={toggleMode}
                className="text-primary-600 hover:text-primary-700 font-medium"
                aria-label={isLoginMode ? t('login.switchToCreate') : t('login.switchToLogin')}
              >
                {isLoginMode ? t('login.switchToCreate') : t('login.switchToLogin')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
