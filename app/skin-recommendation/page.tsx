'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Heart, CheckCircle } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { useFavorites } from '@/components/FavoritesProvider'

// Product interface for database integration
interface DatabaseProduct {
  id: string
  name: string
  price: number
  description: string
  image: string
  images: string | null // JSON array of all images
  category: string
  inStock: boolean
  skinType?: string | null
  targetConcerns?: string | null
  usage?: string | null
  ageGroup?: string | null
}

// Skin types
const SKIN_TYPES = [
  { 
    value: 'dry', 
    label: 'Dry', 
    description: 'Skin that lacks moisture and may feel tight or flaky. Often has a rough texture, visible fine lines, and may appear dull. Requires intensive hydration and gentle, nourishing products to restore the skin barrier.' 
  },
  { 
    value: 'oily', 
    label: 'Oily', 
    description: 'Skin that produces excess oil and may appear shiny, especially in the T-zone. Often has enlarged pores and is prone to blackheads and acne. Requires oil-controlling and mattifying products to balance sebum production.' 
  },
  { 
    value: 'combination', 
    label: 'Combination', 
    description: 'Skin that is oily in some areas (like T-zone) and dry in others. The forehead, nose, and chin may be oily while cheeks are dry. Requires targeted care with different products for different areas of the face.' 
  },
  { 
    value: 'normal', 
    label: 'Normal', 
    description: 'Well-balanced skin that is neither too oily nor too dry. Has a smooth texture, small pores, and good circulation. Requires gentle maintenance with balanced products to preserve the skin\'s natural equilibrium.' 
  },
  { 
    value: 'sensitive', 
    label: 'Sensitive', 
    description: 'Skin that reacts easily to products and environmental factors. Often experiences redness, irritation, burning, or stinging. Requires hypoallergenic, fragrance-free products with soothing ingredients like aloe and chamomile.' 
  }
]

// Age groups
const AGE_GROUPS = [
  { 
    value: 'teen', 
    label: 'Teen (13-19)', 
    targetConcerns: ['acne-blemishes', 'hydration', 'pore-care'] 
  },
  { 
    value: 'young-adult', 
    label: 'Young Adult (20-29)', 
    targetConcerns: ['acne-blemishes', 'hydration', 'brightening', 'pore-care'] 
  },
  { 
    value: 'adult', 
    label: 'Adult (30-39)', 
    targetConcerns: ['anti-aging', 'hydration', 'brightening', 'sensitivity'] 
  },
  { 
    value: 'mature', 
    label: 'Mature (40+)', 
    targetConcerns: ['anti-aging', 'hydration', 'sensitivity', 'eye-care'] 
  }
]

// Target concerns
const TARGET_CATEGORIES = [
  { 
    value: 'anti-aging', 
    label: 'Anti-Aging', 
    icon: '🕰️',
    description: 'Reduce fine lines, wrinkles, and signs of aging'
  },
  { 
    value: 'acne-blemishes', 
    label: 'Acne & Blemishes', 
    icon: '🎯',
    description: 'Clear acne, reduce blemishes, and prevent breakouts'
  },
  { 
    value: 'hydration', 
    label: 'Hydration', 
    icon: '💧',
    description: 'Boost moisture levels and prevent dehydration'
  },
  { 
    value: 'brightening', 
    label: 'Brightening', 
    icon: '✨',
    description: 'Even skin tone and reduce dark spots'
  },
  { 
    value: 'sensitivity', 
    label: 'Sensitivity', 
    icon: '🤲',
    description: 'Calm and soothe sensitive, reactive skin'
  },
  { 
    value: 'pore-care', 
    label: 'Pore Care', 
    icon: '🔍',
    description: 'Minimize pores and improve skin texture'
  },
  { 
    value: 'eye-care', 
    label: 'Eye Care', 
    icon: '👁️',
    description: 'Target under-eye concerns and crow\'s feet'
  },
  { 
    value: 'hair', 
    label: 'Hair', 
    icon: '💇‍♀️',
    description: 'Hair care products including shampoo, tonic, and solutions'
  }
]

// Usage options
const USAGE_OPTIONS = [
  { value: 'morning', label: 'Morning', icon: '🌅' },
  { value: 'evening', label: 'Evening', icon: '🌙' },
  { value: 'all-day', label: 'All Day', icon: '☀️' },
  { value: 'morning-evening', label: 'Morning & Evening', icon: '🔄' }
]

export default function SkinRecommendationPage() {
  const [selectedSkinType, setSelectedSkinType] = useState('')
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('')
  const [selectedTargetConcerns, setSelectedTargetConcerns] = useState<string[]>([])
  const [selectedUsage, setSelectedUsage] = useState('')
  const [recommendations, setRecommendations] = useState<DatabaseProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const { addItem } = useCartStore()
  const { favorites, toggleFavorite } = useFavorites()

  const handleSkinTypeChange = (skinType: string) => {
    setSelectedSkinType(skinType)
  }

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
      const products = await response.json()
      
      setRecommendations(products)
      setShowResults(true)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = (product: DatabaseProduct) => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category,
      inStock: product.inStock,
      images: JSON.stringify([product.image])
    })
  }

  const handleProductClick = (productId: string) => {
    // Navigate to product page
    window.location.href = `/products/${productId}`
  }

  const resetForm = () => {
    setSelectedSkinType('')
    setSelectedAgeGroup('')
    setSelectedTargetConcerns([])
    setSelectedUsage('')
    setRecommendations([])
    setShowResults(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Skin</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showResults ? (
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Skin Recommendation
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the perfect GENOSYS products for your unique skin type.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Skin Type Selection */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">1. What's your skin type?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SKIN_TYPES.map((skinType) => (
                    <button
                      key={skinType.value}
                      type="button"
                      onClick={() => handleSkinTypeChange(skinType.value)}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                        selectedSkinType === skinType.value
                          ? 'border-primary-500 bg-primary-50 text-primary-900'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-semibold text-lg mb-3">{skinType.label}</div>
                      {selectedSkinType === skinType.value && (
                        <div className="text-sm text-gray-600 leading-relaxed border-t border-primary-200 pt-3">
                          {skinType.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Group Selection */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">2. What's your age group?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AGE_GROUPS.map((ageGroup) => (
                    <button
                      key={ageGroup.value}
                      type="button"
                      onClick={() => setSelectedAgeGroup(ageGroup.value)}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                        selectedAgeGroup === ageGroup.value
                          ? 'border-primary-500 bg-primary-50 text-primary-900'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-semibold text-lg">{ageGroup.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Concerns */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">3. What are your main skin concerns?</h2>
                <p className="text-gray-600 mb-6">Select all that apply</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TARGET_CATEGORIES.map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => handleTargetConcernToggle(category.value)}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                        selectedTargetConcerns.includes(category.value)
                          ? 'border-primary-500 bg-primary-50 text-primary-900'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">{category.icon}</span>
                        <span className="font-semibold text-lg">{category.label}</span>
                      </div>
                      <div className="text-sm text-gray-600">{category.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Usage Time */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">4. When do you prefer to use skincare?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {USAGE_OPTIONS.map((usage) => (
                    <button
                      key={usage.value}
                      type="button"
                      onClick={() => setSelectedUsage(usage.value)}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 text-center ${
                        selectedUsage === usage.value
                          ? 'border-primary-500 bg-primary-50 text-primary-900'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{usage.icon}</div>
                      <div className="font-semibold">{usage.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={!selectedSkinType || isLoading}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-4 px-12 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Getting Recommendations...' : 'Get Recommendations'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Results Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-black mb-4">Skin Recommendation</h1>
              
              {/* Selection Summary */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Selection</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-medium text-gray-700 mb-1">Skin Type</div>
                    <div className="text-primary-600 font-semibold capitalize">
                      {SKIN_TYPES.find(type => type.value === selectedSkinType)?.label || selectedSkinType}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-medium text-gray-700 mb-1">Age Group</div>
                    <div className="text-primary-600 font-semibold">
                      {AGE_GROUPS.find(age => age.value === selectedAgeGroup)?.label || 'Any Age'}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-medium text-gray-700 mb-1">Daily Routine</div>
                    <div className="text-primary-600 font-semibold">
                      {USAGE_OPTIONS.find(usage => usage.value === selectedUsage)?.label || 'Any Time'}
                    </div>
                  </div>
                </div>
                
                {selectedTargetConcerns.length > 0 && (
                  <div className="mt-4">
                    <div className="font-medium text-gray-700 mb-2">Target Concerns</div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedTargetConcerns.map(concern => {
                        const concernData = TARGET_CATEGORIES.find(c => c.value === concern)
                        return (
                          <span key={concern} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                            {concernData?.icon} {concernData?.label}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-lg text-gray-600 mb-6">
                We've selected {recommendations.length} products perfect for your {SKIN_TYPES.find(type => type.value === selectedSkinType)?.label?.toLowerCase() || selectedSkinType} skin
              </p>
              <button
                onClick={resetForm}
                className="text-primary-600 hover:text-primary-700 underline font-medium"
              >
                Start Over
              </button>
            </div>

            {/* Results Grid */}
            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendations.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <div 
                      className="relative cursor-pointer"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(product)
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.some(fav => fav.id === product.id)
                              ? 'text-red-500 fill-current'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-primary-600">
                          AED {product.price}
                        </span>
                        {product.usage && (
                          <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                            {product.usage}
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToCart(product)
                        }}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <CheckCircle className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find products matching your criteria. Try adjusting your selections.
                </p>
                <button
                  onClick={resetForm}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}