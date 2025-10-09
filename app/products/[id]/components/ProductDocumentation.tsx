'use client'

import { Product } from '@/types'
import { getProductDocumentation } from '@/data/productConfig'

interface ProductDocumentationProps {
  product: Product
}

export default function ProductDocumentation({ product }: ProductDocumentationProps) {
  const documentation = getProductDocumentation(product.id)

  if (!documentation || documentation.length === 0) {
    return null
  }

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Documentation</h3>
      
      <div className="space-y-4">
        {documentation.map((doc, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{doc.title}</h4>
              <p className="text-sm text-gray-600">
                {doc.type === 'pdf' && 'Download detailed product information and usage instructions.'}
                {doc.type === 'video' && 'Watch product demonstration and application guide.'}
                {doc.type === 'link' && 'Access additional product resources and information.'}
              </p>
            </div>
            <a
              href={doc.url}
              target={doc.type === 'link' ? '_blank' : undefined}
              rel={doc.type === 'link' ? 'noopener noreferrer' : undefined}
              download={doc.type === 'pdf' ? doc.title : undefined}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              {doc.type === 'pdf' && (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              {doc.type === 'video' && (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                </svg>
              )}
              {doc.type === 'link' && (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              )}
              {doc.type === 'pdf' ? 'Download' : doc.type === 'video' ? 'Watch' : 'Open'}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
