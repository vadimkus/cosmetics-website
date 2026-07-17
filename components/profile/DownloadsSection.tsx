'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Download } from 'lucide-react'
import PDFDownloadButton from '@/components/PDFDownloadButton'

export default function DownloadsSection() {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 lg:p-8">
      
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
                  39.9 MB
                </p>
              </div>
              <PDFDownloadButton
                href="https://genosys.ae/documents/GENOSYS%20Catalogue_2026.pdf"
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
          
          <div className="group border border-gray-200 rounded-lg p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                <Download className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  Achieve Korean Glass Skin with GENOSYS approach
                </h4>
                <p className="text-xs text-gray-400">
                  10 MB
                </p>
              </div>
              <PDFDownloadButton
                href="/documents/ppt/Achieve%20Korean%20Glass%20Skin%20with%20GENOSYS%20approach_F.pdf"
                filename="Achieve Korean Glass Skin with GENOSYS approach"
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
                  Bio-Meso PDRN Expert Treatment Guide
                </h4>
                <p className="text-xs text-gray-400">
                  8.9 MB
                </p>
              </div>
              <PDFDownloadButton
                href="/documents/ppt/Bio-Meso%20PDRN%20Expert_Treatment%20guide_for%20print_S.pdf"
                filename="Bio-Meso PDRN Expert Treatment Guide"
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
                    src="/images/remover/Main2.jpg"
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
                    src="/images/mist/main2.jpeg"
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
                    src="/images/overnight/main.jpeg"
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
                    src="/images/problem/Main.jpg"
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
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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

          {/* SKIN REBOOT PDRN MASK PACK */}
          <div className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <Link href="/products/52">
                  <Image
                    src="/images/PDRN.png"
                    alt="SKIN REBOOT PDRN MASK PACK"
                    width={500}
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  SKIN REBOOT PDRN MASK PACK
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
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                    height={300} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
  )
}