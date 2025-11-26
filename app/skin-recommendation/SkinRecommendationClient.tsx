'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, Sparkles, ArrowRight, CheckCircle2, Info, Star } from 'lucide-react'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { errorLog } from '@/lib/logger'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import { calculateDiscountedPrice, canUserSeePrices } from '@/lib/discountUtils'
import { Product } from '@/types'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

// Extended Product interface for skin recommendations
interface SkinRecommendationProduct extends Product {
  skinType?: string | null
  targetConcerns?: string | null
  usage?: string | null
  ageGroup?: string | null
}

export default function SkinRecommendationClient() {
  const { t, locale, dir } = useTranslation()
  const { user } = useAuth()
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  
  const [selectedSkinType, setSelectedSkinType] = useState('')
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('')
  const [selectedTargetConcerns, setSelectedTargetConcerns] = useState<string[]>([])
  const [selectedUsage, setSelectedUsage] = useState('')
  const [recommendations, setRecommendations] = useState<SkinRecommendationProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  // Get translated data arrays
  const SKIN_TYPES = [
    { 
      value: 'dry', 
      label: t('skinRecommendation.drySkin'), 
      icon: '🌵',
      description: t('skinRecommendation.drySkinDescription'),
      tips: t('skinRecommendation.drySkinTips')
    },
    { 
      value: 'oily', 
      label: t('skinRecommendation.oilySkin'), 
      icon: '💧',
      description: t('skinRecommendation.oilySkinDescription'),
      tips: t('skinRecommendation.oilySkinTips')
    },
    { 
      value: 'combination', 
      label: t('skinRecommendation.combinationSkin'), 
      icon: '⚖️',
      description: t('skinRecommendation.combinationSkinDescription'),
      tips: t('skinRecommendation.combinationSkinTips')
    },
    { 
      value: 'normal', 
      label: t('skinRecommendation.normalSkin'), 
      icon: '✨',
      description: t('skinRecommendation.normalSkinDescription'),
      tips: t('skinRecommendation.normalSkinTips')
    },
    { 
      value: 'sensitive', 
      label: t('skinRecommendation.sensitiveSkin'), 
      icon: '🤲',
      description: t('skinRecommendation.sensitiveSkinDescription'),
      tips: t('skinRecommendation.sensitiveSkinTips')
    }
  ]

  const AGE_GROUPS = [
    { 
      value: 'teen', 
      label: t('skinRecommendation.teen'), 
      icon: '🎓',
      focus: t('skinRecommendation.teenFocus'),
      targetConcerns: ['acne-blemishes', 'hydration', 'pore-care'] 
    },
    { 
      value: 'young-adult', 
      label: t('skinRecommendation.youngAdult'), 
      icon: '🌟',
      focus: t('skinRecommendation.youngAdultFocus'),
      targetConcerns: ['acne-blemishes', 'hydration', 'brightening', 'pore-care'] 
    },
    { 
      value: 'adult', 
      label: t('skinRecommendation.adult'), 
      icon: '💼',
      focus: t('skinRecommendation.adultFocus'),
      targetConcerns: ['anti-aging', 'hydration', 'brightening', 'sensitivity'] 
    },
    { 
      value: 'mature', 
      label: t('skinRecommendation.mature'), 
      icon: '👑',
      focus: t('skinRecommendation.matureFocus'),
      targetConcerns: ['anti-aging', 'hydration', 'sensitivity', 'eye-care'] 
    }
  ]

  const TARGET_CONCERNS = [
    { 
      value: 'anti-aging', 
      label: t('skinRecommendation.antiAging'), 
      icon: '🕰️',
      description: t('skinRecommendation.antiAgingDescription'),
      keyIngredients: t('skinRecommendation.antiAgingIngredients')
    },
    { 
      value: 'acne-blemishes', 
      label: t('skinRecommendation.acneBlemishes'), 
      icon: '🎯',
      description: t('skinRecommendation.acneBlemishesDescription'),
      keyIngredients: t('skinRecommendation.acneBlemishesIngredients')
    },
    { 
      value: 'hydration', 
      label: t('skinRecommendation.hydration'), 
      icon: '💧',
      description: t('skinRecommendation.hydrationDescription'),
      keyIngredients: t('skinRecommendation.hydrationIngredients')
    },
    { 
      value: 'brightening', 
      label: t('skinRecommendation.brightening'), 
      icon: '✨',
      description: t('skinRecommendation.brighteningDescription'),
      keyIngredients: t('skinRecommendation.brighteningIngredients')
    },
    { 
      value: 'sensitivity', 
      label: t('skinRecommendation.sensitivity'), 
      icon: '🤲',
      description: t('skinRecommendation.sensitivityDescription'),
      keyIngredients: t('skinRecommendation.sensitivityIngredients')
    },
    { 
      value: 'pore-care', 
      label: t('skinRecommendation.poreCare'), 
      icon: '🔍',
      description: t('skinRecommendation.poreCareDescription'),
      keyIngredients: t('skinRecommendation.poreCareIngredients')
    },
    { 
      value: 'eye-care', 
      label: t('skinRecommendation.eyeCare'), 
      icon: '👁️',
      description: t('skinRecommendation.eyeCareDescription'),
      keyIngredients: t('skinRecommendation.eyeCareIngredients')
    },
    { 
      value: 'hair', 
      label: t('skinRecommendation.hairCare'), 
      icon: '💇‍♀️',
      description: t('skinRecommendation.hairCareDescription'),
      keyIngredients: t('skinRecommendation.hairCareIngredients')
    }
  ]

  const USAGE_OPTIONS = [
    { value: 'morning', label: t('skinRecommendation.morning'), icon: '🌅', description: t('skinRecommendation.morningDescription') },
    { value: 'evening', label: t('skinRecommendation.evening'), icon: '🌙', description: t('skinRecommendation.eveningDescription') },
    { value: 'all-day', label: t('skinRecommendation.allDay'), icon: '☀️', description: t('skinRecommendation.allDayDescription') },
    { value: 'morning-evening', label: t('skinRecommendation.morningEvening'), icon: '🔄', description: t('skinRecommendation.morningEveningDescription') }
  ]

  const handleTargetConcernToggle = (concern: string) => {
    setSelectedTargetConcerns(prev => 
      prev.includes(concern) 
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const params = new URLSearchParams()
      if (selectedSkinType) params.append('skinType', selectedSkinType)
      if (selectedAgeGroup) params.append('ageGroup', selectedAgeGroup)
      if (selectedTargetConcerns.length > 0) {
        params.append('targetConcerns', selectedTargetConcerns.join(','))
      }

      const response = await fetch(`/api/skin-recommendations?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }
      const products = await response.json()
      
      setRecommendations(products)
      setShowResults(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      errorLog('Error fetching recommendations:', error)
      alert(t('skinRecommendation.failedToLoadRecommendations'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = (product: SkinRecommendationProduct) => {
    if (!user) {
      window.location.href = getLocalizedPath('/login', locale)
      return
    }
    addItem(product, 1, '', '')
  }

  const resetForm = () => {
    setSelectedSkinType('')
    setSelectedAgeGroup('')
    setSelectedTargetConcerns([])
    setSelectedUsage('')
    setRecommendations([])
    setShowResults(false)
    setCurrentStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Group products by category for better display
  const groupedProducts = useMemo(() => {
    const groups: Record<string, SkinRecommendationProduct[]> = {}
    recommendations.forEach(product => {
      const category = product.category || 'Other'
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(product)
    })
    return groups
  }, [recommendations])

  // Parse target concerns from product
  const getProductConcerns = (product: SkinRecommendationProduct): string[] => {
    if (!product.targetConcerns) return []
    try {
      return JSON.parse(product.targetConcerns)
    } catch {
      return []
    }
  }

  // Get why product is recommended
  const getRecommendationReason = (product: SkinRecommendationProduct): string => {
    const reasons: string[] = []
    if (product.skinType === selectedSkinType) {
      reasons.push(`${t('skinRecommendation.perfectFor')} ${SKIN_TYPES.find(st => st.value === selectedSkinType)?.label.toLowerCase()}`)
    }
    const concerns = getProductConcerns(product)
    const matchedConcerns = concerns.filter(c => selectedTargetConcerns.includes(c))
    if (matchedConcerns.length > 0) {
      reasons.push(`${t('skinRecommendation.targets')}: ${matchedConcerns.map(c => TARGET_CONCERNS.find(tc => tc.value === c)?.label).join(', ')}`)
    }
    if (product.ageGroup === selectedAgeGroup) {
      reasons.push(`${t('skinRecommendation.idealFor')} ${AGE_GROUPS.find(a => a.value === selectedAgeGroup)?.label.toLowerCase()}`)
    }
    return reasons.join(' • ') || t('skinRecommendation.recommendedForSkinProfile')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir={dir}>
      <BreadcrumbSchema 
        items={[
          { name: t('common.home'), url: getLocalizedPath('/', locale) },
          { name: t('profile.skinRecommendation'), url: getLocalizedPath('/skin-recommendation', locale) }
        ]}
      />

      {!showResults ? (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
              <Sparkles className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('skinRecommendation.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              {t('skinRecommendation.subtitle')}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className={`flex items-center justify-between mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <span className="text-sm font-medium text-gray-700">{t('skinRecommendation.step')} {currentStep} {t('skinRecommendation.of')} 4</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / 4) * 100)}% {t('skinRecommendation.complete')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Skin Type */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full text-primary-600 font-bold">
                  1
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('skinRecommendation.whatsYourSkinType')}</h2>
              </div>
              <p className="text-gray-600 mb-6">{t('skinRecommendation.selectBestDescribes')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SKIN_TYPES.map((skinType) => (
                  <button
                    key={skinType.value}
                    type="button"
                    onClick={() => {
                      setSelectedSkinType(skinType.value)
                      setCurrentStep(2)
                    }}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${dir === 'rtl' ? 'text-right' : 'text-left'} group ${
                      selectedSkinType === skinType.value
                        ? 'border-primary-500 bg-primary-50 shadow-md'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{skinType.icon}</span>
                      <div className="font-semibold text-lg text-gray-900">{skinType.label}</div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{skinType.description}</p>
                    {selectedSkinType === skinType.value && (
                      <div className="mt-3 pt-3 border-t border-primary-200">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-primary-700">{skinType.tips}</p>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Age Group */}
            {selectedSkinType && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full text-primary-600 font-bold">
                    2
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('skinRecommendation.whatsYourAgeGroup')}</h2>
                </div>
                <p className="text-gray-600 mb-6">{t('skinRecommendation.helpsRecommendAgeAppropriate')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AGE_GROUPS.map((ageGroup) => (
                    <button
                      key={ageGroup.value}
                      type="button"
                      onClick={() => {
                        setSelectedAgeGroup(ageGroup.value)
                        setCurrentStep(3)
                      }}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${dir === 'rtl' ? 'text-right' : 'text-left'} ${
                        selectedAgeGroup === ageGroup.value
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{ageGroup.icon}</span>
                        <div className="font-semibold text-lg text-gray-900">{ageGroup.label}</div>
                      </div>
                      <p className="text-sm text-gray-600">{ageGroup.focus}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Target Concerns */}
            {selectedAgeGroup && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full text-primary-600 font-bold">
                    3
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('skinRecommendation.whatAreMainConcerns')}</h2>
                </div>
                <p className="text-gray-600 mb-6">{t('skinRecommendation.selectAllThatApply')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {TARGET_CONCERNS.map((concern) => (
                    <button
                      key={concern.value}
                      type="button"
                      onClick={() => {
                        handleTargetConcernToggle(concern.value)
                        setCurrentStep(4)
                      }}
                      className={`p-5 rounded-xl border-2 transition-all duration-200 ${dir === 'rtl' ? 'text-right' : 'text-left'} ${
                        selectedTargetConcerns.includes(concern.value)
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{concern.icon}</span>
                        <span className="font-semibold text-base text-gray-900">{concern.label}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{concern.description}</p>
                      {selectedTargetConcerns.includes(concern.value) && concern.keyIngredients && (
                        <div className="mt-2 pt-2 border-t border-primary-200">
                          <p className="text-xs text-primary-700 font-medium">{t('skinRecommendation.keyIngredients')}: {concern.keyIngredients}</p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Usage Time */}
            {selectedTargetConcerns.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full text-primary-600 font-bold">
                    4
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('skinRecommendation.whenPreferUseSkincare')}</h2>
                </div>
                <p className="text-gray-600 mb-6">{t('skinRecommendation.helpsRecommendRoutine')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {USAGE_OPTIONS.map((usage) => (
                    <button
                      key={usage.value}
                      type="button"
                      onClick={() => setSelectedUsage(usage.value)}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 text-center ${
                        selectedUsage === usage.value
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-4xl mb-3">{usage.icon}</div>
                      <div className="font-semibold text-lg text-gray-900 mb-1">{usage.label}</div>
                      <p className="text-xs text-gray-600">{usage.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            {selectedSkinType && (
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={!selectedSkinType || isLoading}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-4 px-12 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg disabled:shadow-none flex items-center gap-2 mx-auto"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {t('skinRecommendation.gettingRecommendations')}
                    </>
                  ) : (
                    <>
                      {t('skinRecommendation.getMyRecommendations')}
                      <ArrowRight className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>
                {!selectedTargetConcerns.length && selectedSkinType && (
                  <p className="text-sm text-gray-500 mt-4">
                    {t('skinRecommendation.tipSelectingConcerns')}
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('skinRecommendation.yourPersonalizedRecommendations')}
            </h1>
            
            {/* Selection Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 max-w-3xl mx-auto shadow-sm">
              <h2 className={`text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <Info className="w-5 h-5 text-primary-600" />
                {t('skinRecommendation.yourSkinProfile')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className={`text-sm font-medium text-gray-600 mb-1 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('skinRecommendation.skinType')}</div>
                  <div className={`text-lg text-primary-600 font-semibold capitalize flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    {SKIN_TYPES.find(type => type.value === selectedSkinType)?.icon}
                    {SKIN_TYPES.find(type => type.value === selectedSkinType)?.label || selectedSkinType}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className={`text-sm font-medium text-gray-600 mb-1 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('skinRecommendation.ageGroup')}</div>
                  <div className={`text-lg text-primary-600 font-semibold flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    {AGE_GROUPS.find(age => age.value === selectedAgeGroup)?.icon}
                    {AGE_GROUPS.find(age => age.value === selectedAgeGroup)?.label || t('skinRecommendation.anyAge')}
                  </div>
                </div>
              </div>
              
              {selectedTargetConcerns.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className={`text-sm font-medium text-gray-600 mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('skinRecommendation.targetConcerns')}</div>
                  <div className={`flex flex-wrap gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    {selectedTargetConcerns.map(concern => {
                      const concernData = TARGET_CONCERNS.find(c => c.value === concern)
                      return (
                        <span key={concern} className={`bg-primary-100 text-primary-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          {concernData?.icon} {concernData?.label}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-lg text-gray-600 mb-6">
              {t('skinRecommendation.weFound')} <span className="font-bold text-primary-600">{recommendations.length}</span> {t('skinRecommendation.productsPerfectFor')} {SKIN_TYPES.find(type => type.value === selectedSkinType)?.label?.toLowerCase() || selectedSkinType} {t('skinRecommendation.skin')}
            </p>
            <button
              onClick={resetForm}
              className={`text-primary-600 hover:text-primary-700 underline font-medium inline-flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              {t('skinRecommendation.startOver')}
              <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? '' : 'rotate-180'}`} />
            </button>
          </div>

          {/* Results by Category */}
          {recommendations.length > 0 ? (
            <div className="space-y-12">
              {Object.entries(groupedProducts).map(([category, products]) => (
                <div key={category} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                  <h2 className={`text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <Sparkles className="w-6 h-6 text-primary-600" />
                    {category}
                    <span className="text-lg font-normal text-gray-500">({products.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => {
                      const discountedPrice = calculateDiscountedPrice(product, user)
                      const canSeePrice = canUserSeePrices(user)
                      const productConcerns = getProductConcerns(product)
                      
                      return (
                        <div
                          key={product.id}
                          className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                        >
                          <Link href={getLocalizedPath(`/products/${product.id}`, locale)}>
                            <div className="relative aspect-square bg-gray-100">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              />
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  toggleFavorite(product)
                                }}
                                className={`absolute top-3 ${dir === 'rtl' ? 'left-3' : 'right-3'} p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10`}
                              >
                                <Heart
                                  className={`w-5 h-5 ${
                                    isFavorite(product.id)
                                      ? 'text-red-500 fill-current'
                                      : 'text-gray-400'
                                  }`}
                                />
                              </button>
                              {product.rating && (
                                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs font-semibold text-gray-900">
                                    {product.rating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </Link>
                          
                          <div className="p-5">
                            <Link href={getLocalizedPath(`/products/${product.id}`, locale)}>
                              <h3 className={`font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors ${dir === 'rtl' ? 'text-right' : ''}`}>
                                {product.name}
                              </h3>
                            </Link>
                            
                            {/* Recommendation Reason */}
                            <div className="mb-3">
                              <p className={`text-xs text-primary-700 bg-primary-50 rounded-lg px-2 py-1.5 line-clamp-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                                {getRecommendationReason(product)}
                              </p>
                            </div>
                            
                            {/* Product Concerns */}
                            {productConcerns.length > 0 && (
                              <div className={`flex flex-wrap gap-1 mb-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                {productConcerns.slice(0, 3).map(concern => {
                                  const concernData = TARGET_CONCERNS.find(tc => tc.value === concern)
                                  return concernData ? (
                                    <span key={concern} className={`text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                      {concernData.icon} {concernData.label}
                                    </span>
                                  ) : null
                                })}
                              </div>
                            )}
                            
                            {/* Usage Badge */}
                            {product.usage && (
                              <div className="mb-3">
                                <span className={`text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                  {USAGE_OPTIONS.find(u => u.value === product.usage)?.icon} {USAGE_OPTIONS.find(u => u.value === product.usage)?.label || product.usage}
                                </span>
                              </div>
                            )}
                            
                            <p className={`text-gray-600 text-sm mb-4 line-clamp-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                              {product.description}
                            </p>
                            
                            <div className={`flex items-center justify-between mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                              {canSeePrice ? (
                                <div>
                                  {discountedPrice.hasDiscount ? (
                                    <>
                                      <div className="text-2xl font-bold text-primary-600">
                                        AED {discountedPrice.discountedPrice.toFixed(2)}
                                      </div>
                                      <div className="text-sm text-gray-500 line-through">
                                        AED {product.price.toFixed(2)}
                                      </div>
                                    </>
                                  ) : (
                                    <div className="text-2xl font-bold text-primary-600">
                                      AED {product.price.toFixed(2)}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-lg font-semibold text-gray-600">
                                  {t('skinRecommendation.loginToSeePrice')}
                                </div>
                              )}
                              {product.inStock ? (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                  {t('skinRecommendation.inStock')}
                                </span>
                              ) : (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                                  {t('skinRecommendation.outOfStock')}
                                </span>
                              )}
                            </div>
                            
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                              className={`w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                            >
                              <ShoppingCart className="w-5 h-5" />
                              {t('skinRecommendation.addToCart')}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="text-gray-400 mb-4">
                <CheckCircle2 className="w-20 h-20 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{t('skinRecommendation.noProductsFound')}</h3>
              <p className={`text-gray-600 mb-8 max-w-md mx-auto ${dir === 'rtl' ? 'text-right' : ''}`}>
                {t('skinRecommendation.couldntFindProducts')}
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 justify-center ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={resetForm}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  {t('skinRecommendation.adjustSelections')}
                </button>
                <Link
                  href={getLocalizedPath('/products', locale)}
                  className={`bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors inline-flex items-center justify-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                >
                  {t('skinRecommendation.browseAllProducts')}
                  <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
