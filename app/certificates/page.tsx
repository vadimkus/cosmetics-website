import { Metadata } from 'next'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

export const metadata: Metadata = {
  title: 'Gift Certificates | GENOSYS',
  description: 'Purchase and manage GENOSYS gift certificates for premium Korean dermacosmetics',
}

export default function CertificatesIndexPage() {
  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} cera-page genosys-page ${ceraSerif.variable} min-h-screen bg-[var(--cera-cream)] py-12 px-4`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="cera-serif text-5xl text-[var(--cera-ink)] mb-4">
            GENOSYS Gift Certificates
          </h1>
          <p className="text-xl text-[var(--cera-body)]">
            Give the gift of beautiful skin with premium Korean dermacosmetics
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-3">🎁</div>
            <h3 className="cera-serif  text-lg mb-2">Perfect Gift</h3>
            <p className="text-sm text-[var(--cera-body)]">
              Ideal for birthdays, holidays, or any special occasion
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-3">💎</div>
            <h3 className="cera-serif  text-lg mb-2">Premium Products</h3>
            <p className="text-sm text-[var(--cera-body)]">
              Valid for all professional Korean dermacosmetics
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-3">⏱️</div>
            <h3 className="cera-serif  text-lg mb-2">Valid 6 Months</h3>
            <p className="text-sm text-[var(--cera-body)]">
              Plenty of time to choose the perfect products
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-12">
          <h2 className="cera-serif text-2xl text-[var(--cera-ink)] mb-6">How It Works</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="cera-serif  mb-1">Purchase Certificate</h3>
                <p className="text-[var(--cera-body)] text-sm">
                  Contact us at sales@genosys.ae or +971 58 548 76 65 to purchase a gift certificate
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="cera-serif  mb-1">Receive Your Certificate</h3>
                <p className="text-[var(--cera-body)] text-sm">
                  Get a unique certificate code and beautiful digital certificate via email
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="cera-serif  mb-1">Share the Gift</h3>
                <p className="text-[var(--cera-body)] text-sm">
                  Send the certificate URL or code to your recipient via email, WhatsApp, or print it
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="cera-serif  mb-1">Redeem</h3>
                <p className="text-[var(--cera-body)] text-sm">
                  Present the certificate code at checkout to apply the credit to any order
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Certificate */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200 mb-12">
          <h2 className="cera-serif text-2xl text-[var(--cera-ink)] mb-4 text-center">
            View Sample Certificate
          </h2>
          <p className="text-center text-[var(--cera-body)] mb-6">
            See what your gift certificate will look like
          </p>
          <div className="text-center">
            <a
              href="/certificate/178B2"
              target="_blank"
              className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View Sample Certificate →
            </a>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <h2 className="cera-serif text-2xl text-[var(--cera-ink)] mb-4">
            Ready to Give the Gift of Beauty?
          </h2>
          <p className="text-[var(--cera-body)] mb-6">
            Contact us to purchase a gift certificate in any amount
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:sales@genosys.ae"
              className="bg-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-600 transition-colors"
            >
              📧 Email Us
            </a>
            <a
              href="tel:+971585487665"
              className="bg-[var(--cera-ink)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--cera-rose-ink)] transition-colors"
            >
              📞 Call Us
            </a>
            <a
              href="https://wa.me/971585487665"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 bg-gradient-to-r from-[var(--cera-cream-deep)] to-[var(--cera-cream-deep)] rounded-xl p-8">
          <h2 className="cera-serif text-2xl text-[var(--cera-ink)] mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow-sm">
              <summary className="font-semibold cursor-pointer">
                Can I purchase any amount?
              </summary>
              <p className="mt-2 text-[var(--cera-body)] text-sm">
                Yes! Gift certificates can be purchased in any amount starting from 100 AED.
              </p>
            </details>
            
            <details className="bg-white rounded-lg p-4 shadow-sm">
              <summary className="font-semibold cursor-pointer">
                How long is the certificate valid?
              </summary>
              <p className="mt-2 text-[var(--cera-body)] text-sm">
                All certificates are valid for 6 months from the date of issue.
              </p>
            </details>
            
            <details className="bg-white rounded-lg p-4 shadow-sm">
              <summary className="font-semibold cursor-pointer">
                Can I use multiple certificates?
              </summary>
              <p className="mt-2 text-[var(--cera-body)] text-sm">
                Yes, you can use multiple certificate codes on a single order.
              </p>
            </details>
            
            <details className="bg-white rounded-lg p-4 shadow-sm">
              <summary className="font-semibold cursor-pointer">
                Are certificates refundable?
              </summary>
              <p className="mt-2 text-[var(--cera-body)] text-sm">
                Gift certificates are non-refundable but can be transferred to another person.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}



