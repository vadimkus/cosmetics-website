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

// Extended Product interface for skin recommendations
interface SkinRecommendationProduct extends Product {
  skinType?: string | null
  targetConcerns?: string | null
  usage?: string | null
  ageGroup?: string | null
}

// Skin types with detailed descriptions
const SKIN_TYPES = [
  { 
    value: 'dry', 
    label: 'Dry Skin', 
    icon: '🌵',
    description: 'Skin that lacks moisture and may feel tight or flaky. Often has a rough texture, visible fine lines, and may appear dull.',
    tips: 'Focus on intensive hydration and barrier repair products with hyaluronic acid and ceramides.'
  },
  { 
    value: 'oily', 
    label: 'Oily Skin', 
    icon: '💧',
    description: 'Skin that produces excess oil and may appear shiny, especially in the T-zone. Often has enlarged pores and is prone to blackheads and acne.',
    tips: 'Use oil-controlling and mattifying products with salicylic acid or niacinamide to balance sebum production.'
  },
  { 
    value: 'combination', 
    label: 'Combination Skin', 
    icon: '⚖️',
    description: 'Skin that is oily in some areas (like T-zone) and dry in others. The forehead, nose, and chin may be oily while cheeks are dry.',
    tips: 'Use targeted care with different products for different areas, or balanced formulas that address both concerns.'
  },
  { 
    value: 'normal', 
    label: 'Normal Skin', 
    icon: '✨',
    description: 'Well-balanced skin that is neither too oily nor too dry. Has a smooth texture, small pores, and good circulation.',
    tips: 'Maintain your skin\'s natural balance with gentle, balanced products that preserve the skin\'s equilibrium.'
  },
  { 
    value: 'sensitive', 
    label: 'Sensitive Skin', 
    icon: '🤲',
    description: 'Skin that reacts easily to products and environmental factors. Often experiences redness, irritation, burning, or stinging.',
    tips: 'Use hypoallergenic, fragrance-free products with soothing ingredients like aloe, chamomile, and centella asiatica.'
  }
]

// Age groups with skincare focus
const AGE_GROUPS = [
  { 
    value: 'teen', 
    label: 'Teen (13-19)', 
    icon: '🎓',
    focus: 'Acne prevention, oil control, and establishing a basic routine',
    targetConcerns: ['acne-blemishes', 'hydration', 'pore-care'] 
  },
  { 
    value: 'young-adult', 
    label: 'Young Adult (20-29)', 
    icon: '🌟',
    focus: 'Prevention, hydration, and early anti-aging',
    targetConcerns: ['acne-blemishes', 'hydration', 'brightening', 'pore-care'] 
  },
  { 
    value: 'adult', 
    label: 'Adult (30-39)', 
    icon: '💼',
    focus: 'Anti-aging prevention, hydration, and skin repair',
    targetConcerns: ['anti-aging', 'hydration', 'brightening', 'sensitivity'] 
  },
  { 
    value: 'mature', 
    label: 'Mature (40+)', 
    icon: '👑',
    focus: 'Advanced anti-aging, firming, and intensive repair',
    targetConcerns: ['anti-aging', 'hydration', 'sensitivity', 'eye-care'] 
  }
]

// Target concerns with detailed information
const TARGET_CONCERNS = [
  { 
    value: 'anti-aging', 
    label: 'Anti-Aging', 
    icon: '🕰️',
    description: 'Reduce fine lines, wrinkles, and signs of aging',
    keyIngredients: 'Retinol, peptides, bakuchiol, vitamin C'
  },
  { 
    value: 'acne-blemishes', 
    label: 'Acne & Blemishes', 
    icon: '🎯',
    description: 'Clear acne, reduce blemishes, and prevent breakouts',
    keyIngredients: 'Salicylic acid, benzoyl peroxide, niacinamide, tea tree'
  },
  { 
    value: 'hydration', 
    label: 'Hydration', 
    icon: '💧',
    description: 'Boost moisture levels and prevent dehydration',
    keyIngredients: 'Hyaluronic acid, ceramides, glycerin, squalane'
  },
  { 
    value: 'brightening', 
    label: 'Brightening', 
    icon: '✨',
    description: 'Even skin tone and reduce dark spots',
    keyIngredients: 'Vitamin C, niacinamide, arbutin, licorice root'
  },
  { 
    value: 'sensitivity', 
    label: 'Sensitivity', 
    icon: '🤲',
    description: 'Calm and soothe sensitive, reactive skin',
    keyIngredients: 'Centella asiatica, aloe vera, chamomile, allantoin'
  },
  { 
    value: 'pore-care', 
    label: 'Pore Care', 
    icon: '🔍',
    description: 'Minimize pores and improve skin texture',
    keyIngredients: 'Salicylic acid, niacinamide, retinol, AHA/BHA'
  },
  { 
    value: 'eye-care', 
    label: 'Eye Care', 
    icon: '👁️',
    description: 'Target under-eye concerns and crow\'s feet',
    keyIngredients: 'Peptides, caffeine, retinol, vitamin K'
  },
  { 
    value: 'hair', 
    label: 'Hair Care', 
    icon: '💇‍♀️',
    description: 'Hair care products including shampoo, tonic, and solutions',
    keyIngredients: 'Biotin, peptides, natural extracts'
  }
]

// Usage options
const USAGE_OPTIONS = [
  { value: 'morning', label: 'Morning', icon: '🌅', description: 'Start your day with protection and hydration' },
  { value: 'evening', label: 'Evening', icon: '🌙', description: 'Repair and restore while you sleep' },
  { value: 'all-day', label: 'All Day', icon: '☀️', description: 'Products you can use anytime' },
  { value: 'morning-evening', label: 'Morning & Evening', icon: '🔄', description: 'Complete daily routine' }
]


export default function SkinRecommendationPage() {
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
      alert('Failed to load recommendations. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = (product: SkinRecommendationProduct) => {
    if (!user) {
      window.location.href = '/login'
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
      reasons.push(`Perfect for ${SKIN_TYPES.find(t => t.value === selectedSkinType)?.label.toLowerCase()}`)
    }
    const concerns = getProductConcerns(product)
    const matchedConcerns = concerns.filter(c => selectedTargetConcerns.includes(c))
    if (matchedConcerns.length > 0) {
      reasons.push(`Targets: ${matchedConcerns.map(c => TARGET_CONCERNS.find(tc => tc.value === c)?.label).join(', ')}`)
    }
    if (product.ageGroup === selectedAgeGroup) {
      reasons.push(`Ideal for ${AGE_GROUPS.find(a => a.value === selectedAgeGroup)?.label.toLowerCase()}`)
    }
    return reasons.join(' • ') || 'Recommended for your skin profile'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Skin Recommendation', url: '/skin-recommendation' }
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
              Personalized Skin Recommendation
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the perfect GENOSYS products tailored to your unique skin needs. Our AI-powered recommendation system analyzes your skin profile to suggest the best professional Korean dermacosmetics.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of 4</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / 4) * 100)}% Complete</span>
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
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What&apos;s your skin type?</h2>
              </div>
              <p className="text-gray-600 mb-6">Select the option that best describes your skin</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SKIN_TYPES.map((skinType) => (
                  <button
                    key={skinType.value}
                    type="button"
                    onClick={() => {
                      setSelectedSkinType(skinType.value)
                      setCurrentStep(2)
                    }}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 text-left group ${
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
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What&apos;s your age group?</h2>
                </div>
                <p className="text-gray-600 mb-6">This helps us recommend age-appropriate products</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AGE_GROUPS.map((ageGroup) => (
                    <button
                      key={ageGroup.value}
                      type="button"
                      onClick={() => {
                        setSelectedAgeGroup(ageGroup.value)
                        setCurrentStep(3)
                      }}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
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
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What are your main skin concerns?</h2>
                </div>
                <p className="text-gray-600 mb-6">Select all that apply - we&apos;ll find products that address these</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {TARGET_CONCERNS.map((concern) => (
                    <button
                      key={concern.value}
                      type="button"
                      onClick={() => {
                        handleTargetConcernToggle(concern.value)
                        setCurrentStep(4)
                      }}
                      className={`p-5 rounded-xl border-2 transition-all duration-200 text-left ${
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
                          <p className="text-xs text-primary-700 font-medium">Key ingredients: {concern.keyIngredients}</p>
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
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">When do you prefer to use skincare?</h2>
                </div>
                <p className="text-gray-600 mb-6">This helps us recommend products for your routine</p>
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
                      Getting Recommendations...
                    </>
                  ) : (
                    <>
                      Get My Recommendations
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                {!selectedTargetConcerns.length && selectedSkinType && (
                  <p className="text-sm text-gray-500 mt-4">
                    💡 Tip: Selecting skin concerns will give you more targeted recommendations
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
              Your Personalized Recommendations
            </h1>
            
            {/* Selection Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 max-w-3xl mx-auto shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary-600" />
                Your Skin Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-600 mb-1">Skin Type</div>
                  <div className="text-lg text-primary-600 font-semibold capitalize flex items-center gap-2">
                    {SKIN_TYPES.find(type => type.value === selectedSkinType)?.icon}
                    {SKIN_TYPES.find(type => type.value === selectedSkinType)?.label || selectedSkinType}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-600 mb-1">Age Group</div>
                  <div className="text-lg text-primary-600 font-semibold flex items-center gap-2">
                    {AGE_GROUPS.find(age => age.value === selectedAgeGroup)?.icon}
                    {AGE_GROUPS.find(age => age.value === selectedAgeGroup)?.label || 'Any Age'}
                  </div>
                </div>
              </div>
              
              {selectedTargetConcerns.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-600 mb-3">Target Concerns</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTargetConcerns.map(concern => {
                      const concernData = TARGET_CONCERNS.find(c => c.value === concern)
                      return (
                        <span key={concern} className="bg-primary-100 text-primary-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                          {concernData?.icon} {concernData?.label}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-lg text-gray-600 mb-6">
              We found <span className="font-bold text-primary-600">{recommendations.length}</span> products perfect for your {SKIN_TYPES.find(type => type.value === selectedSkinType)?.label?.toLowerCase() || selectedSkinType} skin
            </p>
            <button
              onClick={resetForm}
              className="text-primary-600 hover:text-primary-700 underline font-medium inline-flex items-center gap-1"
            >
              Start Over
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>

          {/* Results by Category */}
          {recommendations.length > 0 ? (
            <div className="space-y-12">
              {Object.entries(groupedProducts).map(([category, products]) => (
                <div key={category} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
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
                          <Link href={`/products/${product.id}`}>
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
                                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
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
                            <Link href={`/products/${product.id}`}>
                              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                                {product.name}
                              </h3>
                            </Link>
                            
                            {/* Recommendation Reason */}
                            <div className="mb-3">
                              <p className="text-xs text-primary-700 bg-primary-50 rounded-lg px-2 py-1.5 line-clamp-2">
                                {getRecommendationReason(product)}
                              </p>
                            </div>
                            
                            {/* Product Concerns */}
                            {productConcerns.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {productConcerns.slice(0, 3).map(concern => {
                                  const concernData = TARGET_CONCERNS.find(tc => tc.value === concern)
                                  return concernData ? (
                                    <span key={concern} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                      {concernData.icon} {concernData.label}
                                    </span>
                                  ) : null
                                })}
                              </div>
                            )}
                            
                            {/* Usage Badge */}
                            {product.usage && (
                              <div className="mb-3">
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                  {USAGE_OPTIONS.find(u => u.value === product.usage)?.icon} {USAGE_OPTIONS.find(u => u.value === product.usage)?.label || product.usage}
                                </span>
                              </div>
                            )}
                            
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {product.description}
                            </p>
                            
                            <div className="flex items-center justify-between mb-4">
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
                                  Login to see price
                                </div>
                              )}
                              {product.inStock ? (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                  In Stock
                                </span>
                              ) : (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                            
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                            >
                              <ShoppingCart className="w-5 h-5" />
                              Add to Cart
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
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn&apos;t find products matching your exact criteria. Try adjusting your selections or browse our full product catalog.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetForm}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Adjust Selections
                </button>
                <Link
                  href="/products"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors inline-flex items-center justify-center gap-2"
                >
                  Browse All Products
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
