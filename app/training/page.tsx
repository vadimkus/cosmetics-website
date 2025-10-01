/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Download } from 'lucide-react'
import PDFDownloadButton from '@/components/PDFDownloadButton'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Training - GENOSYS Skincare Training | Genosys Middle East FZ-LLC',
  description: 'Professional training resources for GENOSYS skincare products. Download training documents, watch video lessons, and master professional techniques for Korean dermacosmetics.',
  keywords: 'GENOSYS training, professional skincare training, Korean dermacosmetics training, microneedling training, UAE skincare training',
  openGraph: {
    title: 'Professional Training - GENOSYS Skincare Training',
    description: 'Professional training resources for GENOSYS skincare products. Download training documents, watch video lessons, and master professional techniques.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-logo.png',
        width: 400,
        height: 200,
        alt: 'GENOSYS Professional Training',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_me',
    creator: '@genosys_me',
    title: 'Professional Training - GENOSYS Skincare Training',
    description: 'Professional training resources for GENOSYS skincare products. Download training documents, watch video lessons, and master professional techniques.',
    images: ['/images/genosys-logo.png'],
  },
  alternates: {
    canonical: 'https://genosys.ae/training',
  },
}

export default function TrainingPage() {
  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Training', url: '/training' }
        ]}
      />
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">

          {/* Navigation Breadcrumb */}
          <nav className="flex flex-col gap-2 text-sm md:text-base text-gray-600 mb-8" aria-label="Breadcrumb">
            {/* Mobile Breadcrumb */}
            <div className="md:hidden flex items-center gap-2">
              <Link 
                href="/"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                Home
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center">
                Training
              </span>
            </div>
            
            {/* Mobile Back Button */}
            <Link 
              href="/"
              className="md:hidden flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Home</span>
            </Link>
            
            {/* Desktop Breadcrumb */}
            <div className="hidden md:flex items-center gap-2">
              <Link 
                href="/"
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                Home
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center">
                Training
              </span>
            </div>
          </nav>

          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Image 
                src="/images/genosys-logo.png" 
                alt="Genosys Professional Training" 
                width={400} 
                height={200} 
                className="object-contain w-full max-w-xs sm:max-w-sm md:max-w-md"
                priority
              />
            </div>
          </div>

          {/* Download Documents Section */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-12">
            <div className="p-4 sm:p-6 md:p-8">
              
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
                        filename="Product Catalogue 2026"
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
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                        filename="Product Documentation"
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
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                        filename="Product Documentation"
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
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                        filename="Product Documentation"
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
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                        filename="Product Documentation"
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
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                        filename="Product Documentation"
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
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                        filename="Product Documentation"
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
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                        filename="Product Documentation"
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
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                        filename="Product Documentation"
                        external={true}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        View PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* ULTRA SHIELD SUN CREAM */}
                  <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/products/39">
                          <Image
        src="/images/SPF50.jpg"
        alt="ULTRA SHIELD SUN CREAM"
        width={500}
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
      />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                        ULTRA SHIELD SUN CREAM
                      </h4>
                        <p className="text-xs text-gray-400">
                        0.6 MB
                      </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20ULTRA%20SHIELD%20SUN%20CREAM.pdf"
                        filename="Product Documentation"
                        external={true}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        View PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* HR³ MATRIX SCALP SHAMPOO α */}
                  <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/products/44">
                          <Image
        src="/images/Sham.jpg"
        alt="HR³ MATRIX SCALP SHAMPOO α"
        width={500}
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
      />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                        HR³ MATRIX SCALP SHAMPOO α
                      </h4>
                        <p className="text-xs text-gray-400">
                        2.3 MB
                      </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20HR3%20MATRIX%20SCALP%20SHAMPOO%20ALPHA.pdf"
                        filename="Product Documentation"
                        external={true}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        View PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* MOISTURE REPLENISHING HYALURON SERUM */}
                  <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/products/18">
                          <Image
        src="/images/HRS.jpg"
        alt="MOISTURE REPLENISHING HYALURON SERUM"
        width={500}
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
      />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                        MOISTURE REPLENISHING HYALURON SERUM
                      </h4>
                        <p className="text-xs text-gray-400">
                        1.9 MB
                      </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20SERUM.pdf"
                        filename="Product Documentation"
                        external={true}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        View PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* MOISTURE REPLENISHING HYALURON CREAM */}
                  <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/products/29">
                          <Image
        src="/images/HER.jpg"
        alt="MOISTURE REPLENISHING HYALURON CREAM"
        width={500}
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
      />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                        MOISTURE REPLENISHING HYALURON CREAM
                      </h4>
                        <p className="text-xs text-gray-400">
                        2.0 MB
                      </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20CREAM.pdf"
                        filename="Product Documentation"
                        external={true}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        View PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* SKIN CARING BLEMISH BALM CUSHION */}
                  <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/products/41">
                          <Image
        src="/images/BBC.jpg"
        alt="SKIN CARING BLEMISH BALM CUSHION"
        width={500}
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
      />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                        SKIN CARING BLEMISH BALM CUSHION
                      </h4>
                        <p className="text-xs text-gray-400">
                        1.2 MB
                      </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20SKIN%20CARING%20BLEMISH%20BALM%20CUSHION.pdf"
                        filename="Product Documentation"
                        external={true}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        View PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* EyeCell EYE PEPTIDE GEL PATCH */}
                  <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/products/33">
                          <Image
        src="/images/Patch.jpg"
        alt="EyeCell EYE PEPTIDE GEL PATCH"
        width={500}
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
      />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                        EyeCell EYE PEPTIDE GEL PATCH
                      </h4>
                        <p className="text-xs text-gray-400">
                        1.4 MB
                      </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20EyeCell%20EYE%20PEPTIDE%20GEL%20PATCH.pdf"
                        filename="Product Documentation"
                        external={true}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        View PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* BIO-FERMENT AGE DEFYING POWDER MASK */}
                  <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/products/51">
                          <Image
        src="/images/BFAD.png"
        alt="BIO-FERMENT AGE DEFYING POWDER MASK"
        width={500}
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
      />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                        BIO-FERMENT AGE DEFYING POWDER MASK
                      </h4>
                        <p className="text-xs text-gray-400">
                        2.1 MB
                      </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20BIO-FERMENT%20AGE%20DEFYING%20POWDER%20MASK.pdf"
                        filename="Product Documentation"
                        external={true}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        View PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* HAIR GENTRON */}
                  <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/products/48">
                          <Image
        src="/images/gen.jpg"
        alt="HAIR GENTRON"
        width={500}
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
      />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                        HAIR GENTRON
                      </h4>
                        <p className="text-xs text-gray-400">
                        1.8 MB
                      </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/HAIR%20GENTRON.pdf"
                        filename="Product Documentation"
                        external={true}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        View PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* HR³ MATRIX HAIR SOLUTION α */}
                  <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/products/45">
                          <Image
        src="/images/HHR.jpg"
        alt="HR³ MATRIX HAIR SOLUTION α"
        width={500}
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
      />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                        HR³ MATRIX HAIR SOLUTION α
                      </h4>
                        <p className="text-xs text-gray-400">
                        2.3 MB
                      </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20HR3%20MATRIX%20HAIR%20SOLUTION%20ALPHA.pdf"
                        filename="Product Documentation"
                        external={true}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        View PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* HR³ MATRIX HAIR TONIC α */}
                  <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/products/43">
                          <Image
        src="/images/HT.jpg"
        alt="HR³ MATRIX HAIR TONIC α"
        width={500}
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
      />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                        HR³ MATRIX HAIR TONIC α
                      </h4>
                        <p className="text-xs text-gray-400">
                        1.9 MB
                      </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20HR3%20MATRIX%20HAIR%20TONIC%20ALPHA.pdf"
                        filename="Product Documentation"
                        external={true}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        View PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* HR³ MATRIX SCALP PEELING α */}
                  <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/products/46">
                          <Image
        src="/images/scal.jpg"
        alt="HR³ MATRIX SCALP PEELING α"
        width={500}
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
      />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                        HR³ MATRIX SCALP PEELING α
                      </h4>
                        <p className="text-xs text-gray-400">
                        2.1 MB
                      </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20HR3%20MATRIX%20SCALP%20PEELING%20ALPHA.pdf"
                        filename="Product Documentation"
                        external={true}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        View PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* GENO-LED IR II */}
                  <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/products/49">
                          <Image
        src="/images/LEDD.jpg"
        alt="GENO-LED IR II"
        width={500}
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
      />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                        GENO-LED IR II
                      </h4>
                        <p className="text-xs text-gray-400">
                        4.6 MB
                      </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENO-LED%20IR%20II_2025.pdf"
                        filename="Product Documentation"
                        external={true}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        View PDF
                      </PDFDownloadButton>
                    </div>
                  </div>

                  {/* GENOSYS SKIN REBOOT PDRN MASK PACK */}
                  <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/products/52">
                          <Image
        src="/images/PDRN.png"
        alt="GENOSYS SKIN REBOOT PDRN MASK PACK"
        width={500}
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
      />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                        GENOSYS SKIN REBOOT PDRN MASK PACK
                      </h4>
                        <p className="text-xs text-gray-400">
                        1.2 MB
                      </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20SKIN%20REBOOT%20PDRN%20MASK%20PACK.pdf"
                        filename="Product Documentation"
                        external={true}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        View PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* EZ CO₂ MASK KIT */}
                  <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/products/38">
                          <Image
        src="/images/EZE.jpg"
        alt="EZ CO₂ MASK KIT"
        width={500}
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
      />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                        EZ CO₂ MASK KIT
                      </h4>
                        <p className="text-xs text-gray-400">
                        0.5 MB
                      </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/Genosys%20Ez%20Co2%20Mask.pdf"
                        filename="Product Documentation"
                        external={true}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        View PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* Microneedle Roller */}
                  <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/products/1">
                          <Image
        src="/images/genosys-microneedling-devices.jpg"
        alt="Microneedle Roller"
        width={500}
        height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
      />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                        Microneedle Roller
                      </h4>
                        <p className="text-xs text-gray-400">
                        1.5 MB
                      </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/Overview%20of%20Microneedling_S.pdf"
                        filename="Product Documentation"
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
          </div>

          {/* Training Lessons Section */}
          <div className="mt-16">
            
            <div className="grid gap-8">
              {/* Genosys Bodycell Stretch Mark Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Genosys Bodycell Stretch Mark Treatment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Learn the professional techniques for treating stretch marks using Genosys Bodycell technology. 
                    This comprehensive training covers proper application methods, safety protocols, and expected results.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/SvjziVjhb8s"
                      title="Genosys Bodycell Stretch Mark Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You&apos;ll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Proper product application techniques</li>
                        <li>• Safety protocols and precautions</li>
                        <li>• Treatment duration and frequency</li>
                        <li>• Expected results and timeline</li>
                        <li>• Client consultation best practices</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 15-20 minutes</li>
                        <li>• Level: Professional</li>
                        <li>• Category: Body Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genosys NDcell Neck & Decollete Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Genosys NDcell Neck & Decollete Treatment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Master the specialized techniques for treating the delicate neck and décolletage area using Genosys NDcell technology. 
                    This advanced training covers proper application methods, safety considerations, and achieving optimal results for this sensitive area.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/m07q2XRt_OM"
                      title="Genosys NDcell Neck & Decollete Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You&apos;ll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Specialized neck and décolletage techniques</li>
                        <li>• Proper handling of sensitive skin areas</li>
                        <li>• Treatment protocols and timing</li>
                        <li>• Client positioning and comfort</li>
                        <li>• Post-treatment care instructions</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 18-22 minutes</li>
                        <li>• Level: Advanced Professional</li>
                        <li>• Category: Specialized Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genosys EyeCell Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Genosys EyeCell Treatment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Learn the precise techniques for treating the delicate eye area using Genosys EyeCell technology. 
                    This specialized training covers safe application methods, client comfort protocols, and achieving optimal results for the sensitive periocular region.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/xH58EZtykZE"
                      title="Genosys EyeCell Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You&apos;ll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Precise eye area treatment techniques</li>
                        <li>• Safety protocols for sensitive eye region</li>
                        <li>• Client positioning and eye protection</li>
                        <li>• Treatment intensity and duration</li>
                        <li>• Post-treatment care and recommendations</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 16-20 minutes</li>
                        <li>• Level: Advanced Professional</li>
                        <li>• Category: Specialized Eye Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genosys HR3 Matrix Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Genosys HR3 Matrix Treatment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Master the advanced HR3 Matrix treatment techniques using Genosys technology. 
                    This comprehensive training covers matrix application methods, treatment protocols, and achieving optimal results for skin rejuvenation and matrix enhancement.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/qQRcEvd3Ks4"
                      title="Genosys HR3 Matrix Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You&apos;ll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• HR3 Matrix application techniques</li>
                        <li>• Treatment protocols and timing</li>
                        <li>• Skin preparation and assessment</li>
                        <li>• Client consultation and expectations</li>
                        <li>• Post-treatment care and follow-up</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 20-25 minutes</li>
                        <li>• Level: Advanced Professional</li>
                        <li>• Category: Matrix Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Facial Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Facial Treatment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Learn comprehensive facial treatment techniques using Genosys products and protocols. 
                    This essential training covers complete facial procedures, product application sequences, and achieving optimal results for various skin types and concerns.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/hMtodh45sME"
                      title="Facial Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You&apos;ll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Complete facial treatment protocols</li>
                        <li>• Product application sequences</li>
                        <li>• Skin analysis and assessment</li>
                        <li>• Client consultation techniques</li>
                        <li>• Treatment customization methods</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 25-30 minutes</li>
                        <li>• Level: Professional</li>
                        <li>• Category: Facial Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* How to use Genosys Snow 02 Cleanser Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    How to use Genosys Snow 02 Cleanser
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Master the proper techniques for using Genosys Snow 02 Cleanser effectively. 
                    This detailed training covers correct application methods, timing, and achieving optimal cleansing results for different skin types and conditions.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/SWY0f2gSzl8"
                      title="How to use Genosys Snow 02 Cleanser Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You&apos;ll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Proper Snow 02 Cleanser application</li>
                        <li>• Correct timing and duration</li>
                        <li>• Skin type considerations</li>
                        <li>• Product benefits and results</li>
                        <li>• Integration with other treatments</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 12-15 minutes</li>
                        <li>• Level: Professional</li>
                        <li>• Category: Product Usage</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* GENOSYS HR3 MATRIX Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    GENOSYS HR3 MATRIX
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Advanced training on GENOSYS HR3 MATRIX technology and application techniques. 
                    This comprehensive lesson covers matrix treatment protocols, advanced application methods, and achieving optimal results for skin rejuvenation and matrix enhancement.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/pM8qIUNdORY"
                      title="GENOSYS HR3 MATRIX Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You&apos;ll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Advanced HR3 MATRIX techniques</li>
                        <li>• Matrix treatment protocols</li>
                        <li>• Skin assessment and preparation</li>
                        <li>• Treatment customization methods</li>
                        <li>• Results optimization strategies</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 22-28 minutes</li>
                        <li>• Level: Advanced Professional</li>
                        <li>• Category: Matrix Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Specialized training on GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA for advanced hair treatment protocols. 
                    This comprehensive lesson covers hair matrix treatment techniques, scalp preparation, and achieving optimal results for hair restoration and enhancement.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/ZVg5mBVStSw"
                      title="GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You&apos;ll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Hair matrix treatment protocols</li>
                        <li>• Scalp preparation techniques</li>
                        <li>• ALPHA solution application methods</li>
                        <li>• Hair restoration procedures</li>
                        <li>• Treatment customization for hair types</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 24-30 minutes</li>
                        <li>• Level: Advanced Professional</li>
                        <li>• Category: Hair Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eye Cell Treatment - Eye zone treatment with Eye Roller 0.25mm Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Eye Cell Treatment - Eye zone treatment with Eye Roller 0.25mm
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Specialized training on Eye Cell Treatment using the Eye Roller 0.25mm for precise eye zone treatments. 
                    This detailed lesson covers proper roller techniques, eye area safety protocols, and achieving optimal results for the delicate periocular region.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/zTOnPRnMy8k"
                      title="Eye Cell Treatment - Eye zone treatment with Eye Roller 0.25mm Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You&apos;ll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Eye Roller 0.25mm application techniques</li>
                        <li>• Eye zone treatment protocols</li>
                        <li>• Safety measures for delicate eye area</li>
                        <li>• Proper roller pressure and movement</li>
                        <li>• Post-treatment care for eye zone</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 14-18 minutes</li>
                        <li>• Level: Professional</li>
                        <li>• Category: Eye Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genosys HAIRGEN BOOSTER Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Genosys HAIRGEN BOOSTER Treatment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Master the advanced hair treatment techniques using Genosys HAIRGEN BOOSTER technology. 
                    This comprehensive training covers hair restoration protocols, scalp preparation methods, and achieving optimal results for hair growth and enhancement.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/dsS-d8HahQA"
                      title="Genosys HAIRGEN BOOSTER Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You&apos;ll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Advanced hair treatment protocols</li>
                        <li>• Scalp preparation and assessment techniques</li>
                        <li>• HAIRGEN BOOSTER application methods</li>
                        <li>• Hair growth stimulation procedures</li>
                        <li>• Treatment customization for different hair types</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 20-25 minutes</li>
                        <li>• Level: Advanced Professional</li>
                        <li>• Category: Hair Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* HR3 MATRIX Anti Hair Loss Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    HR3 MATRIX Anti Hair Loss Treatment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Learn the specialized techniques for treating hair loss using HR3 MATRIX technology. 
                    This advanced training covers anti-hair loss protocols, scalp treatment methods, and achieving optimal results for hair restoration and prevention of further hair loss.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/XwOIRrizmF4"
                      title="HR3 MATRIX Anti Hair Loss Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You&apos;ll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Anti-hair loss treatment protocols</li>
                        <li>• HR3 MATRIX application techniques</li>
                        <li>• Scalp assessment and preparation methods</li>
                        <li>• Hair loss prevention strategies</li>
                        <li>• Treatment customization for different hair loss types</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 18-22 minutes</li>
                        <li>• Level: Advanced Professional</li>
                        <li>• Category: Hair Loss Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Placeholder for future lessons */}
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  More Training Lessons Coming Soon
                </h3>
                <p className="text-gray-500">
                  We&apos;re continuously adding new training content. Check back regularly for updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
