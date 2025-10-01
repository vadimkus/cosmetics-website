'use client'

import { Download, FileText, Image, Video, Archive, ExternalLink } from 'lucide-react'
import PDFDownloadButton from '@/components/PDFDownloadButton'

export default function DownloadsSection() {
  const documents = [
    {
      id: 1,
      title: 'Microneedle Roller Training Guide',
      description: 'Comprehensive guide for professional microneedling techniques',
      type: 'pdf',
      size: '2.4 MB',
      downloadUrl: '/documents/ppt/Overview of Microneedling_S.pdf',
      category: 'Training'
    },
    {
      id: 2,
      title: 'GENOSYS Product Catalog 2024',
      description: 'Complete catalog of all GENOSYS products and specifications',
      type: 'pdf',
      size: '5.2 MB',
      downloadUrl: '/documents/catalog/genosys-catalog-2024.pdf',
      category: 'Catalog'
    },
    {
      id: 3,
      title: 'Professional Training Certificate',
      description: 'Your official GENOSYS professional training certificate',
      type: 'pdf',
      size: '1.8 MB',
      downloadUrl: '/documents/certificates/training-certificate.pdf',
      category: 'Certificate'
    },
    {
      id: 4,
      title: 'Product Usage Guidelines',
      description: 'Detailed guidelines for safe and effective product usage',
      type: 'pdf',
      size: '3.1 MB',
      downloadUrl: '/documents/guidelines/product-usage-guidelines.pdf',
      category: 'Guidelines'
    },
    {
      id: 5,
      title: 'Safety Data Sheets',
      description: 'Comprehensive safety information for all products',
      type: 'pdf',
      size: '4.7 MB',
      downloadUrl: '/documents/safety/safety-data-sheets.pdf',
      category: 'Safety'
    }
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-600" />
      case 'image':
        return <Image className="h-5 w-5 text-blue-600" />
      case 'video':
        return <Video className="h-5 w-5 text-purple-600" />
      case 'archive':
        return <Archive className="h-5 w-5 text-green-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Training':
        return 'bg-blue-100 text-blue-800'
      case 'Catalog':
        return 'bg-green-100 text-green-800'
      case 'Certificate':
        return 'bg-purple-100 text-purple-800'
      case 'Guidelines':
        return 'bg-yellow-100 text-yellow-800'
      case 'Safety':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Documents</h3>
        <p className="text-gray-600">Access your training materials, certificates, and professional resources.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              {getFileIcon(doc.type)}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{doc.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(doc.category)}`}>
                    {doc.category}
                  </span>
                  <span className="text-xs text-gray-500">{doc.size}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <PDFDownloadButton
                href={doc.downloadUrl}
                filename={doc.title}
                className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                <Download className="h-4 w-4" />
                Download
              </PDFDownloadButton>
              
              <button className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm">
                <ExternalLink className="h-4 w-4" />
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            Download All
          </button>
          <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            Request New Document
          </button>
          <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            Share Documents
          </button>
        </div>
      </div>

      {/* Download History */}
      <div className="mt-8">
        <h4 className="font-medium text-gray-900 mb-3">Recent Downloads</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Microneedle Roller Training Guide</p>
                <p className="text-xs text-gray-600">Downloaded 2 days ago</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">2.4 MB</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">GENOSYS Product Catalog 2024</p>
                <p className="text-xs text-gray-600">Downloaded 1 week ago</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">5.2 MB</span>
          </div>
        </div>
      </div>
    </div>
  )
}

