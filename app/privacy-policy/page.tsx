import Link from 'next/link'
import { ArrowLeft, Shield, Mail, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'Privacy Policy - GENOSYS Middle East FZ-LLC | Data Protection & Your Rights',
  description: 'Read our comprehensive privacy policy. Learn how GENOSYS Middle East FZ-LLC protects your personal data, processes information, and respects your privacy rights in the UAE.',
  keywords: [
    'privacy policy',
    'data protection',
    'personal information',
    'GDPR',
    'privacy rights',
    'data security',
    'GENOSYS privacy'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Privacy Policy - GENOSYS Middle East FZ-LLC',
    description: 'Learn how GENOSYS Middle East FZ-LLC protects your personal data and respects your privacy rights.',
    type: 'website',
    url: 'https://genosys.ae/privacy-policy',
    siteName: 'GENOSYS Middle East FZ-LLC',
  },
  alternates: {
    canonical: 'https://genosys.ae/privacy-policy',
    languages: {
      'en': 'https://genosys.ae/privacy-policy',
      'ar': 'https://genosys.ae/ar/privacy-policy',
      'ru': 'https://genosys.ae/ru/privacy-policy',
    },
  },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://genosys.ae' },
          { name: 'Privacy Policy', url: 'https://genosys.ae/privacy-policy' },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary-100 p-4 rounded-xl">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Privacy Policy</h1>
                <p className="text-gray-600 mt-1">Your Data, Your Rights</p>
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              Last Updated: <span className="font-semibold">December 14, 2024</span>
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
            {/* Introduction */}
            <section>
              <p className="text-lg text-gray-700 leading-relaxed">
                At <strong className="text-primary-600">GENOSYS Middle East FZ-LLC</strong> (hereinafter referred to as the "Company"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our website and services.
              </p>
            </section>

            {/* Section 1 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Personal Information We Collect
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>
                  We collect and process the following types of personal information to provide you with our services:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Account Information:</strong> Name, email address, phone number, billing and shipping address</li>
                  <li><strong>Authentication Data:</strong> Login credentials, password (encrypted), authentication tokens</li>
                  <li><strong>Order Information:</strong> Purchase history, order details, payment information (processed securely through Stripe)</li>
                  <li><strong>Profile Data:</strong> Profile picture, birthday, customer preferences</li>
                  <li><strong>Communication Data:</strong> Contact form submissions, customer support inquiries, email correspondence</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, device information, cookies, and usage analytics</li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <h3 className="font-bold text-gray-900 mb-2">1.1. Authentication Methods</h3>
                  <p className="mb-2">We offer three secure authentication methods:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Email/Password Authentication:</strong> Your password is encrypted and securely stored</li>
                    <li><strong>Google OAuth 2.0:</strong> Sign in with your Google account for faster, more secure access</li>
                    <li><strong>Sign in with Apple:</strong> Use your Apple ID for secure authentication on iOS devices</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                  <h3 className="font-bold text-gray-900 mb-2">1.2. Google Authentication</h3>
                  <p className="mb-2">When you choose to sign in with Google, we collect:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Your Google account email address</li>
                    <li>Your full name from your Google profile</li>
                    <li>Your Google profile picture (optional)</li>
                  </ul>
                  <p className="mt-3 text-sm">
                    <strong>Important:</strong> We do not store your Google password. Authentication is handled securely by Google. You can review Google's Privacy Policy at{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      https://policies.google.com/privacy
                    </a>
                  </p>
                  <p className="mt-2 text-sm">
                    Your Google data is used solely for account authentication and profile creation. We never share your Google information with third parties. You can unlink your Google account at any time from your profile settings.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                  <h3 className="font-bold text-gray-900 mb-2">1.3. Sign in with Apple</h3>
                  <p className="mb-2">When you use Sign in with Apple, we collect:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Your Apple ID email address (or private relay email if you choose to hide your email)</li>
                    <li>Your full name from your Apple ID (if provided)</li>
                  </ul>
                  <p className="mt-3 text-sm">
                    <strong>Important:</strong> We do not store your Apple ID password. Authentication is handled securely by Apple. Apple's Sign in with Apple provides additional privacy features, including the option to hide your email address using Apple's private email relay service. You can review Apple's Privacy Policy at{' '}
                    <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      https://www.apple.com/legal/privacy/
                    </a>
                  </p>
                  <p className="mt-2 text-sm">
                    Your Apple ID data is used solely for account authentication and profile creation. We never share your Apple information with third parties. You can manage your Sign in with Apple settings directly through your Apple ID account settings or unlink your Apple account from your profile settings.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                How We Use Your Information
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>We process your personal information for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Account Management:</strong> Creating and managing your customer account, authentication, and profile</li>
                  <li><strong>Order Processing:</strong> Processing your orders, managing payments, and arranging delivery</li>
                  <li><strong>Customer Service:</strong> Responding to your inquiries, providing support, and resolving issues</li>
                  <li><strong>Marketing Communications:</strong> Sending promotional emails, special offers, and product updates (with your consent)</li>
                  <li><strong>Website Improvement:</strong> Analyzing usage patterns to improve our website, products, and services</li>
                  <li><strong>Security:</strong> Protecting against fraud, unauthorized access, and other security threats</li>
                  <li><strong>Legal Compliance:</strong> Meeting our legal obligations and enforcing our terms of service</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                Data Storage & Security
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>We take data security seriously and implement industry-standard security measures:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Encryption:</strong> All sensitive data is encrypted using SSL/TLS technology</li>
                  <li><strong>Secure Storage:</strong> Your data is stored on secure servers with restricted access</li>
                  <li><strong>Password Protection:</strong> Passwords are hashed and encrypted using bcrypt</li>
                  <li><strong>Payment Security:</strong> All payment processing is handled by Stripe, a PCI DSS compliant payment processor</li>
                  <li><strong>Regular Audits:</strong> We conduct regular security audits and updates</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                Data Retention
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>We retain your personal information for the following periods:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Account Data:</strong> Retained while your account is active, plus 3 years after account deletion (for legal compliance)</li>
                  <li><strong>Order History:</strong> Retained for 7 years (UAE commercial record-keeping requirements)</li>
                  <li><strong>Marketing Data:</strong> Retained until you withdraw consent or opt-out</li>
                  <li><strong>Technical Logs:</strong> Retained for 90 days for security and troubleshooting purposes</li>
                </ul>
                <p className="mt-4">
                  You can request the deletion of your data at any time by contacting us or deleting your account through your profile settings.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                Your Privacy Rights
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>You have the following rights regarding your personal data:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                  <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Right to Restriction:</strong> Limit how we use your data</li>
                  <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
                  <li><strong>Right to Object:</strong> Object to processing of your data for marketing purposes</li>
                  <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time (without affecting prior processing)</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
                Cookies & Tracking
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Remember your login status and preferences</li>
                  <li>Analyze website traffic and user behavior</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Measure the effectiveness of our marketing campaigns</li>
                </ul>
                <p className="mt-4">
                  You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our website.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
                Third-Party Services
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>We work with trusted third-party service providers:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Stripe:</strong> Payment processing (PCI DSS compliant)</li>
                  <li><strong>Google OAuth:</strong> Authentication services</li>
                  <li><strong>Vercel:</strong> Website hosting and infrastructure</li>
                  <li><strong>Email Service Providers:</strong> Transactional and marketing emails</li>
                  <li><strong>Analytics Providers:</strong> Website analytics and performance monitoring</li>
                </ul>
                <p className="mt-4">
                  These providers have access to your personal information only to perform services on our behalf and are obligated to maintain confidentiality.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
                Right to Refuse Consent
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>
                  You have the right to refuse or withdraw consent for the collection and processing of your personal information. However, please note:
                </p>
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-amber-900 mb-2">⚠️ Important Notice</p>
                  <p className="text-amber-800">
                    If you refuse to provide necessary personal information, we may not be able to provide certain services, including account registration, order processing, and customer support. Essential data is required for basic website functionality.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">9</span>
                Children's Privacy
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>
                  Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">10</span>
                Changes to This Policy
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending an email notification to registered users</li>
                  <li>Displaying a prominent notice on our website</li>
                </ul>
                <p className="mt-4">
                  Your continued use of our services after such changes constitutes acceptance of the updated Privacy Policy.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">11</span>
                Contact Us
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p className="mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
                </p>
                
                <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">GENOSYS Middle East FZ-LLC</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Email:</p>
                          <a href="mailto:sales@genosys.ae" className="text-primary-600 hover:underline">
                            sales@genosys.ae
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Phone / WhatsApp:</p>
                          <a href="tel:+971585487665" className="text-primary-600 hover:underline">
                            +971 58 548 76 65
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    We aim to respond to all privacy-related inquiries within 1 business day.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>This Privacy Policy is effective as of December 14, 2024</p>
            <p className="mt-2">© 2026 GENOSYS Middle East FZ-LLC. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  )
}
