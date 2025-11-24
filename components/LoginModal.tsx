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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      dir={dir}
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-lg p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto ${dir === 'rtl' ? 'text-right' : ''}`}
      >
        <div className="relative mb-6">
          <h2 id="modal-title" className="text-lg md:text-xl font-bold text-gray-800 text-center">
            {isLoginMode ? t('login.professionalLogin') : t('login.professionalAccount')}
          </h2>
          <p className="text-sm text-gray-600 mt-1 text-center">
            {t('login.unitedArabEmirates')}
          </p>
          <button
            onClick={onClose}
            className={`absolute top-0 ${dir === 'rtl' ? 'left-0' : 'right-0'} text-gray-500 hover:text-gray-700 p-2 touch-manipulation`}
            aria-label={t('common.close')}
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4">
          {error && (
            <div id="error-message" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className={`w-full px-4 py-3 md:py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-base text-gray-900 bg-white bg-opacity-50 backdrop-blur-sm placeholder:text-gray-400 ${dir === 'rtl' ? 'text-right' : ''}`}
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
                className={`w-full px-4 py-3 md:py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-base text-gray-900 bg-white bg-opacity-50 backdrop-blur-sm placeholder:text-gray-400 ${dir === 'rtl' ? 'text-right' : ''}`}
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
                  className={`w-full px-4 py-3 md:py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-base text-gray-900 bg-white bg-opacity-50 backdrop-blur-sm placeholder:text-gray-400 ${dir === 'rtl' ? 'text-right' : ''}`}
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
                  className={`w-full px-4 py-3 md:py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-base text-gray-900 bg-white bg-opacity-50 backdrop-blur-sm placeholder:text-gray-400 ${dir === 'rtl' ? 'text-right' : ''}`}
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
                  className={`w-full px-4 py-3 md:py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-base bg-white bg-opacity-50 backdrop-blur-sm ${formData.emirate ? 'text-gray-900' : 'text-gray-400'} ${dir === 'rtl' ? 'text-right' : ''}`}
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
                <label htmlFor="birthday" className={`block text-sm font-medium text-gray-700 mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t('login.birthday')}
                </label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 md:py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-base bg-white bg-opacity-50 backdrop-blur-sm ${formData.birthday ? 'text-gray-900' : 'text-gray-400'} ${dir === 'rtl' ? 'text-right' : ''}`}
                  aria-describedby={error && !isLoginMode ? "error-message" : undefined}
                />
                <p className={`text-xs text-gray-500 mt-1 flex items-center justify-center gap-1 flex-wrap ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  {t('login.birthdayMessage')} <Gift className="h-3.5 w-3.5 text-primary-600 flex-shrink-0" />
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
                className={`w-full px-4 py-3 md:py-2 ${dir === 'rtl' ? 'pl-12' : 'pr-12'} border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-base text-gray-900 bg-white bg-opacity-50 backdrop-blur-sm ${dir === 'rtl' ? 'text-right' : ''}`}
                required
                aria-describedby={error ? "error-message" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 ${dir === 'rtl' ? 'left-0 pl-4' : 'right-0 pr-4'} flex items-center touch-manipulation`}
                aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Forgot Password Link - Only show in login mode */}
            {isLoginMode && (
              <div className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                <Link
                  href={getLocalizedPath('/forgot-password', locale)}
                  onClick={onClose}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>
            )}

            {/* Privacy Policy Section - Only show for registration */}
            {!isLoginMode && (
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className={`flex items-start justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-1">
                      <h4 className={`font-semibold text-gray-800 mb-2 text-sm ${dir === 'rtl' ? 'text-right' : ''}`}>{t('login.privacyPolicy')}</h4>
                      <p className={`text-xs text-gray-600 mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {t('login.privacyPolicyDescription')}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowPrivacyPolicy(!showPrivacyPolicy)}
                        className="text-primary-600 hover:text-primary-700 text-xs font-medium underline"
                      >
                        {showPrivacyPolicy ? t('login.hideDetails') : t('login.viewDetails')}
                      </button>
                    </div>
                  </div>
                  
                  {showPrivacyPolicy && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className={`text-xs text-gray-700 space-y-3 max-h-60 overflow-y-auto ${dir === 'rtl' ? 'text-right' : ''}`}>
                        <div>
                          <h5 className={`font-semibold mb-1 ${dir === 'rtl' ? 'text-right' : ''}`}>1. {t('login.personalInformationProcessed')}</h5>
                          <p className={`mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('login.privacyPolicyContent1')}</p>
                          
                          <div className={dir === 'rtl' ? 'mr-2' : 'ml-2'} style={{ direction: dir as 'rtl' | 'ltr' }}>
                            <div>
                              <p className={`font-medium ${dir === 'rtl' ? 'text-right' : ''}`}>1. {t('login.websiteMembership')}</p>
                              <p className={dir === 'rtl' ? 'mr-2 text-right' : 'ml-2'}>• {t('login.requiredInformation')}</p>
                              <p className={dir === 'rtl' ? 'mr-2 text-right' : 'ml-2'}>• {t('login.optionalInformation')}</p>
                            </div>
                            
                            <div>
                              <p className={`font-medium ${dir === 'rtl' ? 'text-right' : ''}`}>2. {t('login.provisionOfGoods')}</p>
                              <p className={dir === 'rtl' ? 'mr-2 text-right' : 'ml-2'}>• ID, password, name, nickname, email, mobile phone number</p>
                            </div>
                            
                            <div>
                              <p className={`font-medium ${dir === 'rtl' ? 'text-right' : ''}`}>3. {t('login.automaticallyCollected')}</p>
                              <p className={dir === 'rtl' ? 'mr-2 text-right' : 'ml-2'}>• {t('login.ipAddress')}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className={`font-semibold mb-1 ${dir === 'rtl' ? 'text-right' : ''}`}>2. {t('login.purposeOfProcessing')}</h5>
                          <p className={`mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('login.purposeDescription')}</p>
                          
                          <div className={dir === 'rtl' ? 'mr-2' : 'ml-2'} style={{ direction: dir as 'rtl' | 'ltr' }}>
                            <div>
                              <p className={`font-medium ${dir === 'rtl' ? 'text-right' : ''}`}>1. {t('login.websiteMembership')}</p>
                              <p className={dir === 'rtl' ? 'mr-2 text-right' : 'ml-2'}>• {t('login.membershipManagement')}</p>
                            </div>
                            
                            <div>
                              <p className={`font-medium ${dir === 'rtl' ? 'text-right' : ''}`}>2. {t('login.provisionOfGoods')}</p>
                              <p className={dir === 'rtl' ? 'mr-2 text-right' : 'ml-2'}>• {t('login.provisionOfServices')}</p>
                            </div>
                            
                            <div>
                              <p className={`font-medium ${dir === 'rtl' ? 'text-right' : ''}`}>3. {t('login.handlingInquiries')}</p>
                              <p className={dir === 'rtl' ? 'mr-2 text-right' : 'ml-2'}>• {t('login.handlingInquiriesDescription')}</p>
                            </div>
                            
                            <div>
                              <p className={`font-medium ${dir === 'rtl' ? 'text-right' : ''}`}>4. {t('login.marketing')}</p>
                              <p className={dir === 'rtl' ? 'mr-2 text-right' : 'ml-2'}>• {t('login.marketingDescription')}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className={`font-semibold mb-1 ${dir === 'rtl' ? 'text-right' : ''}`}>3. {t('login.retentionPeriod')}</h5>
                          <p className={`mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('login.retentionDescription')}</p>
                          
                          <div className={dir === 'rtl' ? 'mr-2' : 'ml-2'} style={{ direction: dir as 'rtl' | 'ltr' }}>
                            <div>
                              <p className={`font-medium ${dir === 'rtl' ? 'text-right' : ''}`}>1. {t('login.websiteMembership')}</p>
                              <p className={dir === 'rtl' ? 'mr-2 text-right' : 'ml-2'}>• {t('login.untilWithdrawal')}</p>
                              <p className={dir === 'rtl' ? 'mr-2 text-right' : 'ml-2'}>• {t('login.investigationOngoing')}</p>
                              <p className={dir === 'rtl' ? 'mr-4 text-right' : 'ml-4'}>· {t('login.investigationCondition')}</p>
                              <p className={dir === 'rtl' ? 'mr-4 text-right' : 'ml-4'}>· {t('login.financialObligations')}</p>
                            </div>
                            
                            <div>
                              <p className={`font-medium ${dir === 'rtl' ? 'text-right' : ''}`}>2. {t('login.provisionOfGoods')}</p>
                              <p className={dir === 'rtl' ? 'mr-2 text-right' : 'ml-2'}>• {t('login.untilCompletion')}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className={`font-semibold mb-1 ${dir === 'rtl' ? 'text-right' : ''}`}>4. {t('login.rightToRefuse')}</h5>
                          <p className={`mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('login.rightToRefuseDescription')}</p>
                          <p className={`mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('login.essentialInformation')}</p>
                          <p className={`mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('login.consentAcknowledgment')}</p>
                          <div className={`mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                            <p className={`text-sm text-amber-800 mb-1 ${dir === 'rtl' ? 'text-right' : ''}`}><strong>{t('login.important')}</strong> {t('login.importantMessage')}</p>
                            <p className={`text-sm text-amber-800 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('login.invalidAccountWarning')}</p>
                          </div>
                        </div>
                        
                        <div className={`text-primary-600 ${dir === 'rtl' ? 'text-right' : ''}`}>
                          <p><strong>{t('login.privacyContact')}</strong></p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={`flex items-start ${dir === 'rtl' ? 'space-x-reverse space-x-3 flex-row-reverse' : 'space-x-3'}`}>
                  <input
                    type="checkbox"
                    id="privacy-consent"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="privacy-consent" className={`text-sm text-gray-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {t('login.agreeToPrivacy')}{' '}
                    <button
                      type="button"
                      onClick={() => setShowPrivacyPolicy(!showPrivacyPolicy)}
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      {t('login.privacyPolicy')}
                    </button>
                    {' '}{t('login.privacyPolicyOutlined')}
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('login.pleaseWait') : (isLoginMode ? t('login.signIn') : t('login.createProfessionalAccount'))}
            </button>
          </form>

          <div className="text-center">
            <p className={`text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {isLoginMode ? t('login.dontHaveAccount') : t('login.alreadyHaveAccount')}{' '}
              <button 
                onClick={toggleMode}
                className="text-primary-600 hover:text-primary-700 font-medium"
                aria-label={isLoginMode ? t('login.switchToCreate') : t('login.switchToLogin')}
              >
                {isLoginMode ? t('login.switchToCreate') : t('login.switchToLogin')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
