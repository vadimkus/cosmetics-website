'use client'

import { useState } from 'react'
import { Gift, Copy, ExternalLink, RefreshCw, Check } from 'lucide-react'

interface GeneratedCertificate {
  code: string
  amount: number
  url: string
}

export default function CertificateGeneratorClient() {
  const [amount, setAmount] = useState<number>(200)
  const [generatedCertificate, setGeneratedCertificate] = useState<GeneratedCertificate | null>(null)
  const [copied, setCopied] = useState(false)

  const generateCode = () => {
    // Generate a random 5-character alphanumeric code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Excluding similar-looking characters
    let code = ''
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const handleGenerate = () => {
    const code = generateCode()
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://www.genosys.ae'
    const url = `${baseUrl}/certificate/${code}`
    
    setGeneratedCertificate({
      code,
      amount,
      url,
    })
    setCopied(false)
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleOpenCertificate = () => {
    if (generatedCertificate) {
      window.open(generatedCertificate.url, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gift className="text-rose-500" size={40} />
            <h1 className="text-4xl font-bold text-gray-900">
              Gift Certificate Generator
            </h1>
          </div>
          <p className="text-gray-600">
            Create beautiful gift certificates for your customers
          </p>
        </div>

        {/* Generator Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Amount (AED)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="10"
              step="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-lg font-semibold"
              placeholder="Enter amount"
            />
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 rounded-lg font-semibold text-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            Generate Certificate
          </button>

          {/* Quick Amount Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <p className="w-full text-sm text-gray-600 mb-2">Quick amounts:</p>
            {[100, 200, 300, 500, 1000].map((value) => (
              <button
                key={value}
                onClick={() => setAmount(value)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                {value} AED
              </button>
            ))}
          </div>
        </div>

        {/* Generated Certificate */}
        {generatedCertificate && (
          <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-6">
              <Check className="text-green-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">
                Certificate Generated!
              </h2>
            </div>

            <div className="space-y-4">
              {/* Certificate Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Code
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={generatedCertificate.code}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-lg font-bold"
                  />
                  <button
                    onClick={() => handleCopy(generatedCertificate.code)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Copy code"
                  >
                    {copied ? <Check className="text-green-500" size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              {/* Certificate Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="px-4 py-3 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-lg">
                  <p className="text-2xl font-bold text-rose-600">
                    {generatedCertificate.amount} AED
                  </p>
                </div>
              </div>

              {/* Certificate URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={generatedCertificate.url}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => handleCopy(generatedCertificate.url)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Copy URL"
                  >
                    {copied ? <Check className="text-green-500" size={20} /> : <Copy size={20} />}
                  </button>
                  <button
                    onClick={handleOpenCertificate}
                    className="p-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors"
                    title="Open certificate"
                  >
                    <ExternalLink size={20} />
                  </button>
                </div>
              </div>

              {/* QR Code Preview */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3 text-center">
                  Certificate Preview QR Code
                </p>
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generatedCertificate.url)}`}
                      alt="Certificate QR Code"
                      width={200}
                      height={200}
                      className="rounded"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Scan this QR code to view the certificate
                </p>
              </div>

              {/* Share Instructions */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 font-medium mb-2">
                  📤 How to Share
                </p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Copy and send the URL via email, WhatsApp, or SMS</li>
                  <li>Share the certificate code for the customer to access</li>
                  <li>Print the QR code for physical gift cards</li>
                  <li>Download the certificate as PDF from the certificate page</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            💡 Usage Notes
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <span>Each certificate code is unique and randomly generated</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <span>Certificates are valid for 6 months from the date of issue</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <span>Customers can print or save the certificate as PDF</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <span>Track redemptions by implementing database integration (see documentation)</span>
            </li>
          </ul>
        </div>

        {/* Database Notice */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900">
            <strong>⚠️ Note:</strong> Currently, certificates are generated randomly and not stored in a database. 
            For production use with redemption tracking, implement the database schema described in{' '}
            <code className="bg-yellow-100 px-2 py-1 rounded text-xs">GIFT_CERTIFICATE_FEATURE.md</code>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}


