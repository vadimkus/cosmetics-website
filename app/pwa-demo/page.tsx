import PWAFeaturesDemo from '@/components/pwa/PWAFeaturesDemo'
import ProductShareButton from '@/components/ProductShareButton'
import ShareButton from '@/components/ShareButton'
import LocaleDebugger from '@/components/LocaleDebugger'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PWA Features Demo - GENOSYS',
  description: 'Test Progressive Web App features including install prompt, app badge API, and Web Share API',
  robots: {
    index: false,
    follow: false,
  },
}

// Mock product for testing share functionality
const mockProduct = {
  id: '1',
  name: 'GENOSYS Bio Ferment Age Defying Powder Mask',
  price: 299,
  description: 'Revolutionary anti-aging mask with bio-fermented ingredients for youthful, radiant skin. Clinically tested for visible results in just 15 minutes.',
  image: '/images/products/bio-ferment-mask.jpg'
}

export default function PWADemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PWA Features Demo
          </h1>
          <p className="text-gray-600">
            Test the new Progressive Web App features for GENOSYS
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Main PWA Features Demo */}
          <div className="md:col-span-2">
            <PWAFeaturesDemo />
          </div>

          {/* Share Button Examples */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Share Button Examples
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Basic Share Button</h4>
                <ShareButton
                  title="GENOSYS PWA Demo"
                  text="Check out these amazing PWA features!"
                  variant="button"
                />
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Icon Share Button</h4>
                <ShareButton
                  title="GENOSYS PWA Demo"
                  text="Check out these amazing PWA features!"
                  variant="icon"
                />
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Product Share Button</h4>
                <ProductShareButton
                  product={mockProduct}
                  variant="button"
                />
              </div>
            </div>
          </div>

          {/* Install Prompt Variants */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Install Prompt Variants
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Card Style</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    The card variant is shown below (if install is available):
                  </p>
                  {/* PWAInstallPrompt with card variant would appear here if installable */}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Banner Style</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    The banner variant appears at the bottom of the page after a delay.
                    It&apos;s already integrated into the main layout.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="md:col-span-2 bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Testing Instructions
            </h3>
            
            <div className="space-y-3 text-sm text-blue-800">
              <div>
                <strong>Install Prompt:</strong> Available on supported browsers when the app meets PWA criteria and isn&apos;t already installed.
              </div>
              <div>
                <strong>App Badge:</strong> Works on Chrome 81+ and Edge. The badge appears on the app icon (visible when app is installed).
              </div>
              <div>
                <strong>Web Share:</strong> Available on mobile browsers and some desktop browsers. Falls back to manual sharing options.
              </div>
              <div>
                <strong>Cart Badge:</strong> Automatically updates when items are added to cart (test by adding products to cart).
              </div>
            </div>
          </div>

          {/* Locale Debugger */}
          <div className="md:col-span-2">
            <LocaleDebugger />
          </div>

          {/* Browser Compatibility */}
          <div className="md:col-span-2 bg-green-50 rounded-xl border border-green-200 p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">
              Browser Compatibility
            </h3>
            
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-green-800 mb-2">Chrome/Edge</h4>
                <ul className="space-y-1 text-green-700">
                  <li>✓ Install Prompt</li>
                  <li>✓ App Badge API</li>
                  <li>✓ Web Share (mobile)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-green-800 mb-2">Safari</h4>
                <ul className="space-y-1 text-green-700">
                  <li>✓ Install Prompt (iOS)</li>
                  <li>⊝ App Badge API</li>
                  <li>✓ Web Share (iOS)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-green-800 mb-2">Firefox</h4>
                <ul className="space-y-1 text-green-700">
                  <li>✓ Install Prompt</li>
                  <li>⊝ App Badge API</li>
                  <li>⊝ Web Share</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}