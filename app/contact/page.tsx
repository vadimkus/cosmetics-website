import Link from 'next/link'
import { ArrowLeft, Phone, Mail, MapPin, FileText, Globe, Instagram } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Get in touch with Genosys Middle East FZ-LLC:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
            <div className="text-center p-4 md:p-6 bg-gray-50 rounded-lg">
              <Phone className="h-6 w-6 md:h-8 md:w-8 text-black mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Phone/What's up</h3>
              <a 
                href="https://wa.me/971585487665"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors flex items-center justify-center gap-2 text-sm md:text-base touch-manipulation"
              >
                +971 58 548 76 65
                <span className="text-green-500">📱</span>
              </a>
            </div>

            <div className="text-center p-4 md:p-6 bg-gray-50 rounded-lg">
              <Mail className="h-6 w-6 md:h-8 md:w-8 text-black mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Email</h3>
              <a 
                href="mailto:sales@genosys.ae"
                className="text-gray-600 hover:text-primary-600 transition-colors text-sm md:text-base break-all"
              >
                sales@genosys.ae
              </a>
            </div>

            <div className="text-center p-4 md:p-6 bg-gray-50 rounded-lg">
              <Globe className="h-6 w-6 md:h-8 md:w-8 text-black mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Website</h3>
              <a 
                href="https://genosys.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors text-sm md:text-base break-all"
              >
                https://genosys.ae
              </a>
            </div>

            <div className="text-center p-4 md:p-6 bg-gray-50 rounded-lg">
              <Instagram className="h-6 w-6 md:h-8 md:w-8 text-black mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Instagram</h3>
              <a 
                href="https://instagram.com/genosys.uae"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors text-sm md:text-base"
              >
                @genosys.uae
              </a>
            </div>

            <div className="text-center p-4 md:p-6 bg-gray-50 rounded-lg sm:col-span-2 lg:col-span-1">
              <MapPin className="h-6 w-6 md:h-8 md:w-8 text-black mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Location</h3>
              <a 
                href="https://maps.google.com/?q=Cordoba+Residence,+Villa+E02,+Dubai+United+Arab+Emirates"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-colors text-sm md:text-base touch-manipulation"
              >
                Cordoba Residence, Villa E02, Dubai United Arab Emirates
              </a>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-primary-50 rounded-lg p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                Official Distributor in the UAE
              </h2>
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                Genosys Middle East FZ-LLC is an official distributor of DTSMG. Co., Ltd, Korea in the United Arab Emirates since 2019.
              </p>
              <p className="text-xs md:text-sm text-gray-500 mb-6">
                All Genosys products are certified in Montaji System by <a href="https://www.dm.gov.ae/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">Dubai Municipality</a>.
              </p>
              <div className="space-y-3">
                <a
                  href="/documents/commercial-license.pdf"
                  download="Genosys-Commercial-License-5023192.pdf"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors text-sm md:text-base touch-manipulation"
                >
                  <FileText className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Commercial License
                </a>
                <a
                  href="/documents/genosys-trn-104229886700003.pdf"
                  download="GENOSYS-TRN-104229886700003.pdf"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors text-sm md:text-base touch-manipulation"
                >
                  <FileText className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  TRN: 104229886700003
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
