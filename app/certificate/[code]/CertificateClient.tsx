'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Gift, Calendar, Phone, Mail, Globe, Sparkles, Award, QrCode } from 'lucide-react'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

interface CertificateClientProps {
  code: string
  amount: number
  currency: string
  issueDate: string
  validityMonths: number
}

export default function CertificateClient({
  code,
  amount,
  currency,
  issueDate,
  validityMonths,
}: CertificateClientProps) {
  const [mounted, setMounted] = useState(false)
  const [expiryDate, setExpiryDate] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  useEffect(() => {
    setMounted(true)
    // Calculate expiry date
    const issue = new Date(issueDate)
    const expiry = new Date(issue)
    expiry.setMonth(expiry.getMonth() + validityMonths)
    setExpiryDate(expiry.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    }))
    
    // Generate QR code URL using a free API
    if (typeof window !== 'undefined') {
      const certificateUrl = window.location.href
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(certificateUrl)}`)
    }
  }, [issueDate, validityMonths])

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  if (!mounted) {
    return null // Avoid hydration issues
  }

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .no-print {
            display: none !important;
          }
          
          .certificate-container {
            page-break-inside: avoid;
            box-shadow: none !important;
            margin: 0 !important;
            max-width: 100% !important;
            padding: 2rem !important;
          }
          
          .certificate-ornament,
          .certificate-pattern {
            opacity: 0.15 !important;
          }
        }
        
        /* Custom animations */
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(218, 165, 32, 0.2) 50%,
            transparent 100%
          );
          background-size: 1000px 100%;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Luxury gold gradient */
        .gold-gradient {
          background: linear-gradient(135deg, #d4af37 0%, #f9e79f 25%, #d4af37 50%, #f9e79f 75%, #d4af37 100%);
          background-size: 200% 200%;
          animation: shimmer 3s linear infinite;
        }
        
        /* Ornamental pattern */
        .ornamental-border {
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 10px,
              rgba(218, 165, 32, 0.1) 10px,
              rgba(218, 165, 32, 0.1) 11px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 10px,
              rgba(218, 165, 32, 0.1) 10px,
              rgba(218, 165, 32, 0.1) 11px
            );
        }
      `}</style>

      <div className={`cera-page genosys-page ${ceraSerif.variable} cera-page genosys-page ${ceraSerif.variable} min-h-screen bg-[var(--cera-cream)] py-8 px-4 sm:py-12 sm:px-6 lg:px-8`}>
        {/* No Print - Action Buttons */}
        <div className="no-print max-w-4xl mx-auto mb-6 flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-white text-[var(--cera-body)] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
          >
            ← Back
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 font-medium hover:scale-105"
          >
            🖨️ Print Certificate
          </button>
        </div>

        {/* Certificate Container */}
        <div className="certificate-container max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden relative">
          {/* Decorative Background Patterns */}
          <div className="absolute inset-0 certificate-pattern opacity-5 ornamental-border pointer-events-none" />
          
          {/* Top Decorative Border */}
          <div className="h-3 gold-gradient" />
          
          {/* Certificate Content */}
          <div className="relative p-8 sm:p-12 lg:p-16">
            {/* Decorative Corner Ornaments */}
            <div className="absolute top-8 left-8 w-16 h-16 certificate-ornament">
              <div className="absolute inset-0 border-t-4 border-l-4 border-gold-400 rounded-tl-2xl opacity-30" />
            </div>
            <div className="absolute top-8 right-8 w-16 h-16 certificate-ornament">
              <div className="absolute inset-0 border-t-4 border-r-4 border-gold-400 rounded-tr-2xl opacity-30" />
            </div>
            <div className="absolute bottom-8 left-8 w-16 h-16 certificate-ornament">
              <div className="absolute inset-0 border-b-4 border-l-4 border-gold-400 rounded-bl-2xl opacity-30" />
            </div>
            <div className="absolute bottom-8 right-8 w-16 h-16 certificate-ornament">
              <div className="absolute inset-0 border-b-4 border-r-4 border-gold-400 rounded-br-2xl opacity-30" />
            </div>

            {/* Logo */}
            <div className="flex justify-center mb-8 animate-fade-in-up">
              <div className="relative w-48 h-24 sm:w-64 sm:h-32">
                <Image
                  src="/Logo/BIGLogo-high.png"
                  alt="GENOSYS Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Floating Sparkle Icons */}
            <div className="absolute top-24 right-20 text-gold-400 opacity-20 animate-float">
              <Sparkles size={32} />
            </div>
            <div className="absolute top-32 left-24 text-rose-300 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
              <Sparkles size={24} />
            </div>

            {/* Title */}
            <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center justify-center gap-3 mb-4">
                <Gift className="text-rose-500" size={32} />
                <h1 className="text-4xl sm:text-5xl font-serif text-[var(--cera-ink)] tracking-wide">
                  Gift certificate
                </h1>
                <Gift className="text-rose-500" size={32} />
              </div>
              <div className="flex items-center justify-center gap-2 text-[var(--cera-body)]">
                <Award size={20} className="text-gold-500" />
                <p className="text-lg font-light italic">Professional Korean dermacosmetics</p>
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
              <Sparkles className="mx-4 text-gold-400" size={20} />
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
            </div>

            {/* Certificate Number */}
            <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <p className="text-sm text-[var(--cera-muted)] uppercase tracking-widest mb-2 font-medium">
                Certificate number
              </p>
              <div className="inline-block px-8 py-4 bg-gradient-to-r from-gold-50 to-yellow-50 rounded-lg border-2 border-gold-300 shadow-lg">
                <p className="text-3xl sm:text-4xl font-bold text-[var(--cera-ink)] tracking-wider font-mono">
                  {code}
                </p>
              </div>
            </div>

            {/* Amount Badge */}
            <div className="flex justify-center mb-10 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative px-12 py-6 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 rounded-full shadow-2xl border-4 border-white">
                  <p className="text-5xl sm:text-6xl font-bold text-white tracking-tight">
                    {amount} <span className="text-3xl sm:text-4xl">{currency}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="max-w-2xl mx-auto text-center mb-10 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <p className="text-lg text-[var(--cera-body)] leading-relaxed mb-6 font-light">
                This certificate entitles the bearer to products or services worth{' '}
                <span className="font-semibold text-rose-600">{amount} {currency}</span> from{' '}
                <span className="font-semibold">GENOSYS Middle East</span>.
              </p>
              
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200 shadow-sm">
                <p className="text-sm text-[var(--cera-body)] font-medium mb-3">
                  🎁 How to Redeem
                </p>
                <p className="text-sm text-[var(--cera-body)] leading-relaxed">
                  Share this certificate or code with GENOSYS while placing your order to deduct the amount from your order total. Valid for professional Korean dermacosmetics and beauty treatments.
                </p>
              </div>
            </div>

            {/* Validity Information & QR Code */}
            <div className="max-w-3xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Validity */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-start gap-3 text-sm text-[var(--cera-body)]">
                    <Calendar className="text-purple-500 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium mb-1">Validity period</p>
                      <p className="text-[var(--cera-body)]">
                        Valid for <span className="font-semibold text-purple-600">{validityMonths} months</span> from date of issue.
                        <br />
                        <span className="text-xs">
                          Expires: <span className="font-semibold">{expiryDate}</span>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* QR Code */}
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-6 border border-rose-200 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <QrCode className="text-rose-500" size={20} />
                    <p className="font-medium text-sm text-[var(--cera-body)]">Scan to view</p>
                  </div>
                  {qrCodeUrl && (
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element -- external QR API, host not in remotePatterns */}
                      <img 
                        src={qrCodeUrl} 
                        alt="Certificate QR Code" 
                        width={120}
                        height={120}
                        className="rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            {/* Footer - Contact Information */}
            <div className="text-center text-sm text-[var(--cera-body)] animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
              <p className="font-semibold text-[var(--cera-ink)] mb-4 text-base">
                GENOSYS
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Mail className="text-rose-500" size={16} />
                  <a href="mailto:sales@genosys.ae" className="hover:text-rose-600 transition-colors">
                    sales@genosys.ae
                  </a>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="text-rose-500" size={16} />
                  <a href="tel:+971585487665" className="hover:text-rose-600 transition-colors">
                    +971 58 548 76 65
                  </a>
                </div>
                
                <div className="flex items-center gap-2">
                  <Globe className="text-rose-500" size={16} />
                  <a 
                    href="https://www.genosys.ae" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-rose-600 transition-colors"
                  >
                    www.genosys.ae
                  </a>
                </div>
              </div>

              <p className="text-xs text-[var(--cera-muted)] italic">
                Thank you for choosing GENOSYS - Your trusted partner in professional Korean dermacosmetics
              </p>
            </div>
          </div>

          {/* Bottom Decorative Border */}
          <div className="h-3 gold-gradient" />
        </div>

        {/* Additional Info (No Print) */}
        <div className="no-print max-w-4xl mx-auto mt-8 text-center">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-[var(--cera-body)] mb-4">
              📱 <strong>Share this certificate:</strong> You can share this page URL or take a screenshot to send via WhatsApp, email, or social media.
            </p>
            <p className="text-xs text-[var(--cera-muted)]">
              Certificate URL: {typeof window !== 'undefined' ? window.location.href : ''}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

