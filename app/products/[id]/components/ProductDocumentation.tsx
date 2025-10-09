'use client'

import { Product } from '@/types'
import { getProductDocumentation } from '@/data/productConfig'

interface ProductDocumentationProps {
  product: Product
}

export default function ProductDocumentation({ product }: ProductDocumentationProps) {
  const documentation = getProductDocumentation(product.id)

  if (!documentation?.hasDocumentation) {
    return null
  }

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Documentation</h3>
      
      {documentation.pdfUrl && (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">
              Download detailed product information and usage instructions.
            </p>
          </div>
          <a
            href={documentation.pdfUrl}
            download={documentation.pdfName}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download
          </a>
        </div>
      )}
    </div>
  )
}
