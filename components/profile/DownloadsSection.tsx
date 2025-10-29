'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Download } from 'lucide-react'
import PDFDownloadButton from '@/components/PDFDownloadButton'

export default function DownloadsSection() {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
      
      {/* Training Documents Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          Training Documents
        </h3>
        <div className="space-y-2">
          <div className="group border border-gray-200 rounded-lg p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                <Download className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  Product Catalogue 2026
                </h4>
                <p className="text-xs text-gray-400">
                  235.5 MB
                </p>
              </div>
              <PDFDownloadButton
                href="https://u.pcloud.link/publink/show?code=XZ9wc15ZDTFcM6uvKg0snY1dEJwzwQgHsEF7"
                filename="Product Catalogue 2026.pdf"
                external={true}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-xs font-medium flex-shrink-0"
              >
                <Download className="h-3 w-3 mr-1" />
                View PDF
              </PDFDownloadButton>
            </div>
          </div>
          
          <div className="group border border-gray-200 rounded-lg p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                <Download className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  Home Care Guide 2026
                </h4>
                <p className="text-xs text-gray-400">
                  9.8 MB
                </p>
              </div>
              <PDFDownloadButton
                href="https://genosys.ae/documents/Genosys-Home-Care-Guide.pdf"
                filename="Home Care Guide 2026"
                external={true}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-xs font-medium flex-shrink-0"
              >
                <Download className="h-3 w-3 mr-1" />
                View PDF
              </PDFDownloadButton>
            </div>
          </div>
          
          <div className="group border border-gray-200 rounded-lg p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                <Download className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  Professional Manual 2026
                </h4>
                <p className="text-xs text-gray-400">
                  10.4 MB
                </p>
              </div>
              <PDFDownloadButton
                href="https://genosys.ae/documents/Genosys-Professional-Manual.pdf"
                filename="Professional Manual 2026"
                external={true}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-xs font-medium flex-shrink-0"
              >
                <Download className="h-3 w-3 mr-1" />
                View PDF
              </PDFDownloadButton>
            </div>
          </div>
          
          <div className="group border border-gray-200 rounded-lg p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                <Download className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  Facial Treatment Homecare 2026
                </h4>
                <p className="text-xs text-gray-400">
                  8.2 MB
                </p>
              </div>
              <PDFDownloadButton
                href="/documents/ppt/GENOSYS%20FACIAL%20TREATMENT_Homecare_2025.pdf"
                filename="Facial Treatment Homecare 2026"
                external={true}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-xs font-medium flex-shrink-0"
              >
                <Download className="h-3 w-3 mr-1" />
                View PDF
              </PDFDownloadButton>
            </div>
          </div>
          
          <div className="group border border-gray-200 rounded-lg p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                <Download className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  Facial Treatment Professional 2026
                </h4>
                <p className="text-xs text-gray-400">
                  8.2 MB
                </p>
              </div>
              <PDFDownloadButton
                href="/documents/ppt/GENOSYS%20FACIAL%20TREATMENT_Professional_2025.pdf"
                filename="Facial Treatment Professional 2026"
                external={true}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-xs font-medium flex-shrink-0"
              >
                <Download className="h-3 w-3 mr-1" />
                View PDF
              </PDFDownloadButton>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Documentation Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          Product Documentation
        </h3>
        <div className="space-y-2">
          <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <Link href="/products/31">
                  <Image
                    src="/images/RAA.jpg"
                    alt="MULTI VITA RADIANCE CREAM"
                    width={500}
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  MULTI VITA RADIANCE CREAM
                </h4>
                <p className="text-xs text-gray-400">
                  2.1 MB
                </p>
              </div>
              <PDFDownloadButton 
                href="/documents/ppt/GENOSYS%20MULTI%20VITA%20RADIANCE%20CREAM.pdf"
                filename="MULTI VITA RADIANCE CREAM"
                external={true}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
              >
                <Download className="h-3 w-3 mr-1" />
                View PDF
              </PDFDownloadButton>
            </div>
          </div>
          
          <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <Link href="/products/50">
                  <Image
                    src="/images/EYEZ.jpg"
                    alt="EyeCell EYE ZONE CARE SYSTEM"
                    width={500}
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  EyeCell EYE ZONE CARE SYSTEM
                </h4>
                <p className="text-xs text-gray-400">
                  1.8 MB
                </p>
              </div>
              <PDFDownloadButton 
                href="/documents/ppt/GENOSYS%20EyeCell%20EYE%20ZONE%20CARE%20SYSTEM.pdf" 
                filename="EyeCell EYE ZONE CARE SYSTEM"
                external={true}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
              >
                <Download className="h-3 w-3 mr-1" />
                View PDF
              </PDFDownloadButton>
            </div>
          </div>
          
          {/* EPI TURNOVER BOOSTING PEELING GEL */}
          <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <Link href="/products/12">
                  <Image
                    src="/images/EPI.jpg"
                    alt="EPI TURNOVER BOOSTING PEELING GEL"
                    width={500}
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  EPI TURNOVER BOOSTING PEELING GEL
                </h4>
                <p className="text-xs text-gray-400">
                  3.8 MB
                </p>
              </div>
              <PDFDownloadButton 
                href="/documents/ppt/GENOSYS%20EPI%20TURNOVER%20BOOSTING%20PEELING%20GEL.pdf" 
                filename="EPI TURNOVER BOOSTING PEELING GEL"
                external={true}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
              >
                <Download className="h-3 w-3 mr-1" />
                View PDF
              </PDFDownloadButton>
            </div>
          </div>
          
          {/* MULTI VITA RADIANCE SERUM */}
          <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <Link href="/products/21">
                  <Image
                    src="/images/RADS.jpg"
                    alt="MULTI VITA RADIANCE SERUM"
                    width={500}
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  MULTI VITA RADIANCE SERUM
                </h4>
                <p className="text-xs text-gray-400">
                  1.5 MB
                </p>
              </div>
              <PDFDownloadButton 
                href="/documents/ppt/GENOSYS%20MULTI%20VITA%20RADIANCE%20SERUM.pdf" 
                filename="MULTI VITA RADIANCE SERUM"
                external={true}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
              >
                <Download className="h-3 w-3 mr-1" />
                View PDF
              </PDFDownloadButton>
            </div>
          </div>
          
          {/* SKIN DEFENDER LIP & EYE MAKEUP REMOVER */}
          <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <Link href="/products/11">
                  <Image
                    src="/images/DEF.jpg"
                    alt="SKIN DEFENDER LIP & EYE MAKEUP REMOVER"
                    width={500}
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  SKIN DEFENDER LIP & EYE MAKEUP REMOVER
                </h4>
                <p className="text-xs text-gray-400">
                  0.7 MB
                </p>
              </div>
              <PDFDownloadButton 
                href="/documents/ppt/GENOSYS%20SKIN%20DEFENDER%20LIP%20%26%20EYE%20MAKEUP%20REMOVER.pdf"
                filename="SKIN DEFENDER LIP & EYE MAKEUP REMOVER"
                external={true}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
              >
                <Download className="h-3 w-3 mr-1" />
                View PDF
              </PDFDownloadButton>
            </div>
          </div>
          
          {/* MICROBIOME ENERGY INFUSING MIST */}
          <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <Link href="/products/14">
                  <Image
                    src="/images/mist.jpg"
                    alt="MICROBIOME ENERGY INFUSING MIST"
                    width={500}
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  MICROBIOME ENERGY INFUSING MIST
                </h4>
                <p className="text-xs text-gray-400">
                  0.8 MB
                </p>
              </div>
              <PDFDownloadButton 
                href="/documents/ppt/GENOSYS%20MICROBIOME%20ENERGY%20INFUSING%20MIST.pdf" 
                filename="MICROBIOME ENERGY INFUSING MIST"
                external={true}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
              >
                <Download className="h-3 w-3 mr-1" />
                View PDF
              </PDFDownloadButton>
            </div>
          </div>
          
          {/* SKIN RESCUE OVERNIGHT CREAM MASK */}
          <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <Link href="/products/34">
                  <Image
                    src="/images/SKIN.jpg"
                    alt="SKIN RESCUE OVERNIGHT CREAM MASK"
                    width={500}
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  SKIN RESCUE OVERNIGHT CREAM MASK
                </h4>
                <p className="text-xs text-gray-400">
                  1.3 MB
                </p>
              </div>
              <PDFDownloadButton 
                href="/documents/ppt/GENOSYS%20SKIN%20RESCUE%20OVERNIGHT%20CREAM%20MASK.pdf" 
                filename="SKIN RESCUE OVERNIGHT CREAM MASK"
                external={true}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
              >
                <Download className="h-3 w-3 mr-1" />
                View PDF
              </PDFDownloadButton>
            </div>
          </div>
          
          {/* INTENSIVE PROBLEM CONTROL TONER */}
          <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <Link href="/products/15">
                  <Image
                    src="/images/PRS.jpg"
                    alt="INTENSIVE PROBLEM CONTROL TONER"
                    width={500}
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  INTENSIVE PROBLEM CONTROL TONER
                </h4>
                <p className="text-xs text-gray-400">
                  1.0 MB
                </p>
              </div>
              <PDFDownloadButton 
                href="/documents/ppt/GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20TONER.pdf"
                filename="INTENSIVE PROBLEM CONTROL TONER"
                external={true}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
              >
                <Download className="h-3 w-3 mr-1" />
                View PDF
              </PDFDownloadButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}