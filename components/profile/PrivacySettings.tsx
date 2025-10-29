'use client'

import { Shield, Eye, Edit3, Trash2, Download, MessageCircle } from 'lucide-react'

export default function PrivacySettings() {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Privacy Policy</h2>
      </div>

      <div className="space-y-6">
        {/* Introduction */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-800 mb-3 text-lg">Your Privacy Rights</h3>
          <p className="text-blue-700 text-sm leading-relaxed">
            As a registered user of GENOSYS MIDDLE EAST FZ-LLC, you have the right to access, update, or delete your personal information. 
            This section outlines how we handle your data and your rights under our privacy policy in accordance with UAE laws and regulations.
          </p>
        </div>

        {/* Personal Information Collected */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
            <span className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg px-3 py-1 text-sm">1</span>
            Personal Information We Collect
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <div><strong>Account Information:</strong> Name, email, phone number, address</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <div><strong>Profile Data:</strong> Birthday, profile picture, customer preferences</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <div><strong>Order Information:</strong> Purchase history, shipping addresses, payment details</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <div><strong>Usage Data:</strong> IP address, cookies, MAC address, service usage history, visit records</div>
              </li>
            </ul>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
            <span className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg px-3 py-1 text-sm">2</span>
            How We Use Your Information
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <div>Process and fulfill your orders</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <div>Provide customer support and respond to inquiries</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <div>Send order updates and promotional communications (with your consent)</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <div>Improve our website and services</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <div>Comply with legal obligations under UAE law</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Data Retention */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
            <span className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg px-3 py-1 text-sm">3</span>
            Data Retention Period
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-3">
              We retain your personal information within the period specified by relevant UAE laws and regulations:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 flex-shrink-0">•</span>
                <div><strong>Account Data:</strong> Until you withdraw your membership or delete your account</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 flex-shrink-0">•</span>
                <div><strong>Order Information:</strong> Retained for accounting and legal compliance (anonymized after account deletion)</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 flex-shrink-0">•</span>
                <div><strong>Legal Investigations:</strong> If ongoing, retention continues until resolved</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 flex-shrink-0">•</span>
                <div><strong>Account Deletion:</strong> All personal information is permanently removed from our systems</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
            <span className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg px-3 py-1 text-sm">4</span>
            Your Privacy Rights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Access
              </div>
              <p className="text-sm text-blue-700">View all personal information we have about you</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                Correction
              </div>
              <p className="text-sm text-green-700">Update or correct inaccurate information</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Deletion
              </div>
              <p className="text-sm text-red-700">When you delete your account, all your personal information is permanently removed from our systems.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Portability
              </div>
              <p className="text-sm text-purple-700">Export your data in machine-readable format</p>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
            <span className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg px-3 py-1 text-sm">5</span>
            Data Security Measures
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. This includes:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <div>SSL/TLS encryption for data transmission</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <div>Secure server infrastructure with regular backups</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <div>Regular security assessments and updates</div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <div>Access controls and authentication protocols</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <h4 className="font-semibold text-green-800 mb-3 text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Contact Us About Privacy
          </h4>
          <p className="text-green-700 text-sm mb-4 leading-relaxed">
            For any privacy-related questions, to exercise your rights, or to request deletion of your account data, 
            please contact us. When you delete your account, all your personal information is permanently removed from our systems:
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a 
              href="mailto:sales@genosys.ae" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              sales@genosys.ae
            </a>
            <a 
              href="https://wa.me/971585487665" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-green-600 text-green-700 rounded-lg hover:bg-green-50 transition-colors font-medium"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
