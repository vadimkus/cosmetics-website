import Link from 'next/link'
import { ArrowLeft, Clock, Truck, MapPin, Phone, Mail, Gift } from 'lucide-react'

export default function DeliveryPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Delivery Information
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fast and reliable delivery service across the UAE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-8 w-8 text-black mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Delivery Time</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We provide fast delivery services with <strong>1 hour delivery within Dubai</strong> and 
                <strong> 24-36 hours across UAE</strong>. Our commitment to efficient delivery ensures you receive 
                your premium Korean dermacosmetics products as quickly as possible.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <Truck className="h-8 w-8 text-black mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Delivery Partner</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Delivery is done by <strong>Careem/QuipQup</strong> directly to your doorstep. 
                Our partnership with Careem and QuipQup ensures professional, reliable tracking, and safe delivery 
                of your beauty products throughout the UAE.
              </p>
            </div>
          </div>

          <div className="bg-primary-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Delivery Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Service Area</h3>
                    <p className="text-gray-600">United Arab Emirates</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Delivery Time</h3>
                    <p className="text-gray-600">Within 1 hour of order placement across Dubai</p>
                    <p className="text-gray-600">Within 24-36 hours across UAE</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Delivery Partner</h3>
                    <p className="text-gray-600">Careem/QuipQup</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Delivery Type</h3>
                    <p className="text-gray-600">Direct to doorstep</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Free Shipping Section */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-8 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Gift className="h-10 w-10 text-green-600" />
                <h2 className="text-3xl font-bold text-gray-800">Free Shipping Offer</h2>
              </div>
              <p className="text-xl text-black mb-6">
                Enjoy FREE DELIVERY on all orders above 1,000 AED
              </p>
              <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">1,000 AED+</div>
                  <div className="text-2xl font-semibold text-green-600">FREE DELIVERY</div>
                </div>
              </div>
              <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
                No minimum order restrictions, no hidden fees. Simply place an order worth 1,000 AED or more 
                and enjoy complimentary delivery service across the United Arab Emirates.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Need Help with Your Order?</h2>
            <p className="text-gray-600 mb-6">
              Contact us for assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/971585487665"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <Phone className="mr-2 h-5 w-5" />
                WhatsApp Support
              </a>
              <a 
                href="mailto:sales@genosys.ae"
                className="inline-flex items-center justify-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                <Mail className="mr-2 h-5 w-5" />
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
