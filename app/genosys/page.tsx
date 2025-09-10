import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Logo from '@/components/Logo'

export default function GenosysPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Genosys Middle East FZ-LLC
          </h1>
          <div className="flex justify-center mb-6">
            <Logo size="lg" className="justify-center" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">About Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Genosys Middle East FZ-LLC is an official distributor of DTSMG. Co., Ltd, Korea in the United Arab Emirates.
            </p>
            <p className="text-gray-600 leading-relaxed">
              All Genosys products on sale in United Arab Emirates are certified in Montaji System by 
              <a href="https://www.dm.gov.ae/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline ml-1">
                Dubai Municipality
              </a>.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To provide exceptional beauty products and services that enhance our customers' 
              confidence and natural beauty, while maintaining the highest standards of quality 
              and customer satisfaction.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Legal Information & Contact</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Company Details */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Company Details</h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Company Name</span>
                  <span className="mt-1">Genosys Middle East FZ-LLC</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Year of Incorporation</span>
                  <span className="mt-1">2019</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Commercial License</span>
                  <a href="/documents/commercial-license.pdf" download="Genosys-Commercial-License-5023192.pdf" className="text-primary-600 hover:text-primary-700 underline mt-1">5023192</a>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">TRN</span>
                  <a href="/documents/genosys-trn-104229886700003.pdf" download="GENOSYS-TRN-104229886700003.pdf" className="text-primary-600 hover:text-primary-700 underline mt-1">104229886700003</a>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Office Address</span>
                  <span className="mt-1">Cordoba Residence, Villa E02<br />Dubai, United Arab Emirates</span>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Contact Information</h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Phone</span>
                  <a href="tel:+971585487665" className="text-primary-600 hover:text-primary-700 mt-1">+971 58 548 76 65</a>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Email</span>
                  <a href="mailto:sales@genosys.ae" className="text-primary-600 hover:text-primary-700 mt-1">sales@genosys.ae</a>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Website</span>
                  <a href="https://genosys.ae" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 mt-1">https://genosys.ae</a>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Instagram</span>
                  <a href="https://www.instagram.com/genosys.uae/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 mt-1">@genosys.uae</a>
                </div>
              </div>
            </div>
            
            {/* Business Information */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Business Information</h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Official Distributor</span>
                  <span className="mt-1">DTSMG Co., Ltd, Korea</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Certification</span>
                  <span className="mt-1">Montaji System by <a href="https://www.dm.gov.ae/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">Dubai Municipality</a></span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Products</span>
                  <span className="mt-1">Premium Korean dermacosmetics</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Service Area</span>
                  <span className="mt-1">United Arab Emirates</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 text-center border">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Ready to discover our products? Contact us today to learn more about our products and services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              View Products
            </Link>
            <Link 
              href="/contact"
              className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
