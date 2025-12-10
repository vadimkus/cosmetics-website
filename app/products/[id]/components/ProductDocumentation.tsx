'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { getProductDocumentation } from '@/data/productConfig'
import { useTranslation } from '@/hooks/useTranslation'
import { isPWA } from '@/lib/pwaDetection'
import PDFModal from '@/components/PDFModal'

interface ProductDocumentationProps {
  product: Product
}

export default function ProductDocumentation({ product }: ProductDocumentationProps) {
  const { locale, t } = useTranslation()
  const documentation = getProductDocumentation(product.id, locale)
  const [selectedDoc, setSelectedDoc] = useState<{ url: string; title: string } | null>(null)
  const isPWAMode = isPWA()

  if (!documentation || documentation.length === 0) {
    return null
  }

  const handleDocClick = (e: React.MouseEvent, doc: { url: string; title: string; type: string }) => {
    // For PDFs in PWA mode, open in modal
    if (doc.type === 'pdf' && isPWAMode) {
      e.preventDefault()
      setSelectedDoc({ url: doc.url, title: doc.title })
    }
    // For links, let default behavior happen (open in new tab)
    // For videos, let default behavior happen
  }

  return (
    <>
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('product.productDocumentation')}</h3>
        
        <div className="space-y-4">
          {documentation.map((doc, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{doc.title}</h4>
                <p className="text-sm text-gray-600">
                  {doc.type === 'pdf' && t('product.documentationDescription')}
                  {doc.type === 'video' && t('product.documentationDescription')}
                  {doc.type === 'link' && t('product.documentationDescription')}
                </p>
              </div>
              <a
                href={doc.url}
                target={doc.type === 'link' ? '_blank' : undefined}
                rel={doc.type === 'link' ? 'noopener noreferrer' : undefined}
                download={doc.type === 'pdf' && !isPWAMode ? doc.title : undefined}
                onClick={(e) => handleDocClick(e, doc)}
                data-pdf-handled={doc.type === 'pdf' ? 'true' : undefined}
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
                {doc.type === 'pdf' ? t('product.download') : doc.type === 'video' ? t('product.viewPdf') : t('product.viewPdf')}
              </a>
            </div>
          ))}
        </div>
      </div>
      
      {isPWAMode && selectedDoc && (
        <PDFModal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          pdfUrl={selectedDoc.url}
          filename={selectedDoc.title}
        />
      )}
    </>
  )
}
