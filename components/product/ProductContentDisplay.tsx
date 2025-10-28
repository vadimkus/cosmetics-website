import React from 'react'
import { Product } from '@/types'
import { getProductDocumentation } from '@/data/productConfig'

interface ProductContentDisplayProps {
  product: Product
}

export default function ProductContentDisplay({ product }: ProductContentDisplayProps) {
  // Parse JSON fields safely
  const productDetails = product.productDetails ? tryParseJSON(product.productDetails) : null
  const keyFeatures = product.keyFeatures ? tryParseJSON(product.keyFeatures) : null
  const benefits = product.benefits ? tryParseJSON(product.benefits) : null
  const ingredients = product.ingredients ? tryParseJSON(product.ingredients) : null
  const howToUse = product.howToUse ? tryParseJSON(product.howToUse) : null
  const documentation = getProductDocumentation(product.id)

  return (
    <div className="space-y-6">
      {/* Product Description heading (if we have detailed content) */}
      {productDetails && (
        <>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Description</h2>
          <p className="text-gray-600 mb-4 text-sm">
            {product.description}
          </p>
        </>
      )}

      {/* Product Details - Always just the specs */}
      {productDetails && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h3>
          <div className="space-y-2 text-blue-800 text-sm">
            {Object.entries(productDetails).map(([key, value]) => (
              <p key={key}>
                <strong>{formatKey(key)}:</strong> {String(value)}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Product Documentation Section - ALWAYS right after Product Details */}
      {documentation && documentation.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Product Documentation</h4>
          <p className="text-blue-700 text-sm mb-3">
            Download the complete product manual and usage guide for professional application.
          </p>
          <div className="flex gap-3">
            <a
              href={documentation[0]?.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View PDF
            </a>
            <a
              href={documentation[0]?.url || '#'}
              download={documentation[0]?.title || 'documentation'}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </a>
          </div>
        </div>
      )}

      {/* Key Features - only shown if they exist (for products that have them) */}
      {keyFeatures && Array.isArray(keyFeatures) && keyFeatures.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-800 mb-3 text-sm">Key Features</h2>
          <div className="space-y-3">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Benefits - ALWAYS a separate section */}
      {benefits && Array.isArray(benefits) && benefits.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            {benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Directions - When howToUse is a string (not array) */}
      {howToUse && typeof howToUse === 'string' && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Directions</h4>
          <p className="text-gray-600 mb-4 text-sm">
            {howToUse}
          </p>
        </div>
      )}

      {/* How to Use - When howToUse is an array with steps */}
      {howToUse && Array.isArray(howToUse) && (
        <div>
          <h2 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
              {howToUse.map((step, index) => (
                <li key={index}>
                  <strong>{step.step}:</strong> {step.instruction}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Key Ingredients */}
      {ingredients && Array.isArray(ingredients) && ingredients.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h2>
          <div className="space-y-4 mb-4">
            {ingredients.map((ingredient, index) => (
              <div key={index}>
                <h5 className="font-semibold text-gray-800 mb-2 text-sm">{ingredient.name}</h5>
                {/* Handle special formatting for Repairing Pep9 Complex */}
                {ingredient.name === 'Repairing Pep9 Complex' && ingredient.subList ? (
                  <div className="text-sm text-gray-600 space-y-2 mb-4">
                    <div>
                      <strong>Promotion of collagen induction and skin regeneration:</strong>
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                        {ingredient.subList.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Firming:</strong> Acetyl Hexapeptide-8
                    </div>
                    <div>
                      <strong>Skin brightening:</strong> Nonapeptide-1
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 mb-4">
                    {ingredient.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Directions / Note */}
      {product.directions && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">
            <strong>Note:</strong> {product.directions}
          </p>
        </div>
      )}

    </div>
  )
}

// Helper function to safely parse JSON - returns original string if not valid JSON
function tryParseJSON(jsonString: string): any {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    // If it's not valid JSON, return the original string
    return jsonString
  }
}

// Helper function to format keys (camelCase to Sentence Case)
function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

