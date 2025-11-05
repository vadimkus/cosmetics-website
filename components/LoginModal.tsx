'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { useAuth } from './AuthProvider'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  isLoginMode: boolean
  setIsLoginMode: (mode: boolean) => void
}

export default function LoginModal({ isOpen, onClose, isLoginMode, setIsLoginMode }: LoginModalProps) {
  const { login, register, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    emirate: ''
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
        setFormData({ name: '', email: '', password: '', phone: '', address: '', emirate: '' })
      }
    } else {
      if (!formData.name.trim()) {
        setError('Name is required')
        return
      }
      if (!formData.email.trim()) {
        setError('Email is required')
        return
      }
      if (!formData.password.trim()) {
        setError('Password is required')
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
      if (!formData.phone.trim()) {
        setError('Phone number is required')
        return
      }
      if (!formData.address.trim()) {
        setError('Address is required')
        return
      }
      if (!formData.emirate.trim()) {
        setError('Emirate is required')
        return
      }
      if (!privacyConsent) {
        setError('You must accept the privacy policy to create an account')
        return
      }

      const success = await register(formData.name, formData.email, formData.password, formData.phone, formData.address, formData.emirate)
      if (success) {
        onClose()
        setFormData({ name: '', email: '', password: '', phone: '', address: '', emirate: '' })
        setPrivacyConsent(false)
      }
    }
  }


  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    setError('')
    setFormData({ name: '', email: '', password: '', phone: '', address: '', emirate: '' })
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
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="relative mb-6">
          <h2 id="modal-title" className="text-lg md:text-xl font-bold text-gray-800 text-center">
            {isLoginMode ? 'Genosys Professional Login' : 'Genosys Professional Account'}
          </h2>
          <p className="text-sm text-gray-600 mt-1 text-center">
            United Arab Emirates ❤️
          </p>
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 p-2 touch-manipulation"
            aria-label="Close modal"
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
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                  ref={firstInputRef}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Full Name * (Required)"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 md:py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-base text-gray-900 bg-white bg-opacity-50 backdrop-blur-sm placeholder:text-gray-400"
                  required={!isLoginMode}
                  aria-describedby={error && !isLoginMode ? "error-message" : undefined}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                ref={!isLoginMode ? undefined : firstInputRef}
                type="email"
                id="email"
                name="email"
                placeholder={isLoginMode ? "Email address" : "Email address * (Required)"}
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 md:py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-base text-gray-900 bg-white bg-opacity-50 backdrop-blur-sm placeholder:text-gray-400"
                required
                aria-describedby={error ? "error-message" : undefined}
              />
            </div>

            {!isLoginMode && (
              <div>
                <label htmlFor="phone" className="sr-only">UAE Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="UAE Phone Number * (Required)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 md:py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-base text-gray-900 bg-white bg-opacity-50 backdrop-blur-sm placeholder:text-gray-400"
                  required={!isLoginMode}
                  aria-describedby={error && !isLoginMode ? "error-message" : undefined}
                />
              </div>
            )}

            {!isLoginMode && (
              <div>
                <label htmlFor="address" className="sr-only">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Address * (Required)"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 md:py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-base text-gray-900 bg-white bg-opacity-50 backdrop-blur-sm placeholder:text-gray-400"
                  required={!isLoginMode}
                  aria-describedby={error && !isLoginMode ? "error-message" : undefined}
                />
              </div>
            )}

            {!isLoginMode && (
              <div>
                <label htmlFor="emirate" className="sr-only">Emirate</label>
                <select
                  id="emirate"
                  name="emirate"
                  value={formData.emirate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 md:py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-base text-gray-900 bg-white bg-opacity-50 backdrop-blur-sm"
                  required={!isLoginMode}
                  aria-describedby={error && !isLoginMode ? "error-message" : undefined}
                >
                  <option value="">Select Emirate</option>
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

            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                ref={lastInputRef}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 md:py-2 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-base text-gray-900 bg-white bg-opacity-50 backdrop-blur-sm"
                required
                aria-describedby={error ? "error-message" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center touch-manipulation"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Privacy Policy Section - Only show for registration */}
            {!isLoginMode && (
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm">Privacy Policy</h4>
                      <p className="text-xs text-gray-600 mb-3">
                        By creating an account, you agree to our privacy policy regarding the collection and use of personal information.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowPrivacyPolicy(!showPrivacyPolicy)}
                        className="text-primary-600 hover:text-primary-700 text-xs font-medium underline"
                      >
                        {showPrivacyPolicy ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>
                  
                  {showPrivacyPolicy && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-xs text-gray-700 space-y-3 max-h-60 overflow-y-auto">
                        <div>
                          <h5 className="font-semibold mb-1">1. Personal Information Processed</h5>
                          <p className="mb-2">GENOSYS MIDDLE EAST FZ-LLC (hereinafter referred to as the &quot;Company&quot;) processes the following types of personal information:</p>
                          
                          <div className="ml-2 space-y-2">
                            <div>
                              <p className="font-medium">1. Website Membership Registration and Management</p>
                              <p className="ml-2">• Required Information: ID, password, name, nickname, email, mobile phone number</p>
                              <p className="ml-2">• Optional Information: (If applicable, specify here)</p>
                            </div>
                            
                            <div>
                              <p className="font-medium">2. Provision of Goods or Services</p>
                              <p className="ml-2">• ID, password, name, nickname, email, mobile phone number</p>
                            </div>
                            
                            <div>
                              <p className="font-medium">3. Automatically Collected Information During Internet Service Usage</p>
                              <p className="ml-2">• IP address, cookies, MAC address, service usage history, visit records, records of improper use, etc.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold mb-1">2. Purpose of Processing Personal Information</h5>
                          <p className="mb-2">The Company processes personal information for the following purposes. Personal information will not be used for purposes other than those stated below. If the purpose of use changes, necessary measures such as obtaining separate consent in accordance with Article 18 of the Personal Information Protection Act will be implemented.</p>
                          
                          <div className="ml-2 space-y-2">
                            <div>
                              <p className="font-medium">1. Website Membership Registration and Management</p>
                              <p className="ml-2">• To confirm membership registration intent, verify and authenticate users for membership-based services, maintain and manage membership status, enforce identity verification under the limited identity verification system, prevent fraudulent use of services, issue various notices and notifications, and handle user inquiries and complaints.</p>
                            </div>
                            
                            <div>
                              <p className="font-medium">2. Provision of Goods or Services</p>
                              <p className="ml-2">• To provide services, deliver content, offer customized services, and verify users&apos; identity.</p>
                            </div>
                            
                            <div>
                              <p className="font-medium">3. Handling User Inquiries and Complaints</p>
                              <p className="ml-2">• To verify the identity of the complainant, check complaint details, conduct fact-checking, provide notifications regarding the investigation, and inform the results.</p>
                            </div>
                            
                            <div>
                              <p className="font-medium">4. Marketing and Advertising</p>
                              <p className="ml-2">• To provide event and promotional information, offer participation opportunities, and generate statistics on users&apos; service usage.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold mb-1">3. Retention and Use Period of Personal Information</h5>
                          <p className="mb-2">The Company processes and retains personal information within the period specified by relevant UAE laws and regulations or within the period agreed upon at the time of personal information collection.</p>
                          
                          <div className="ml-2 space-y-2">
                            <div>
                              <p className="font-medium">1. Website Membership Registration and Management</p>
                              <p className="ml-2">• Until the user withdraws their membership from the Company&apos;s website.</p>
                              <p className="ml-2">• However, if the following conditions apply, the information will be retained until the relevant situation is resolved:</p>
                              <p className="ml-4">· If an investigation or inquiry is ongoing due to a violation of related UAE laws, retention continues until the investigation or inquiry is concluded.</p>
                              <p className="ml-4">· If there are outstanding financial obligations related to website usage, retention continues until the debts are settled.</p>
                            </div>
                            
                            <div>
                              <p className="font-medium">2. Provision of Goods and Services</p>
                              <p className="ml-2">• Until the completion of service provision, payment, and settlement of related charges.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold mb-1">4. Right to Refuse Consent to Collection and Use of Personal Information</h5>
                          <p className="mb-2">Users have the right to refuse consent to the collection and use of personal information.</p>
                          <p className="mb-2">However, as the aforementioned personal information is essential for the operation of this website, users who do not consent to the collection and use of personal information may be restricted from membership registration and service usage.</p>
                          <p className="mb-2">By checking the consent box or submitting your information, you acknowledge that you have read, understood, and agreed to the terms outlined in this Privacy Notice.</p>
                        </div>
                        
                        <div className="text-primary-600">
                          <p><strong>For further inquiries regarding our privacy policy, please contact us at sales@genosys.ae</strong></p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="privacy-consent"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="privacy-consent" className="text-sm text-gray-700">
                    I have read, understood, and agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setShowPrivacyPolicy(!showPrivacyPolicy)}
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      Privacy Policy
                    </button>
                    {' '}outlined above.
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Please wait...' : (isLoginMode ? 'Sign In' : 'Create Professional Account')}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={toggleMode}
                className="text-primary-600 hover:text-primary-700 font-medium"
                aria-label={isLoginMode ? 'Switch to create account' : 'Switch to login'}
              >
                {isLoginMode ? 'Create Genosys Professional Account' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
