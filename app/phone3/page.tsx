'use client'

import { useState } from 'react'

const PWA_MODELS = {
  'iPhone 17 Pro Max': { width: 440, height: 956 },
  'iPhone 17 Pro': { width: 402, height: 874 },
  'iPhone 16 Pro Max': { width: 440, height: 956 },
  'iPhone 16 Pro': { width: 402, height: 874 },
  'iPhone 15 Pro Max': { width: 430, height: 932 },
  'iPhone 15 Pro': { width: 393, height: 852 },
  'Samsung Galaxy S24 Ultra': { width: 412, height: 915 },
  'Samsung Galaxy S24': { width: 393, height: 852 },
  'Google Pixel 8 Pro': { width: 412, height: 915 },
}

const QUICK_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Training', path: '/training' },
  { name: 'Contact', path: '/contact' },
  { name: 'About', path: '/about' },
  { name: 'Cart', path: '/cart' },
  { name: 'Profile', path: '/profile' },
  { name: 'AR Home', path: '/ar' },
  { name: 'RU Home', path: '/ru' },
]

export default function PWAPreviewPage() {
  const [selectedDevice, setSelectedDevice] = useState<keyof typeof PWA_MODELS>('iPhone 16 Pro')
  const [currentPath, setCurrentPath] = useState('/')
  const [customPath, setCustomPath] = useState('')
  
  const device = PWA_MODELS[selectedDevice]
  const scale = 0.85

  const handleNavigate = (path: string) => {
    setCurrentPath(path)
    setCustomPath(path)
  }

  const handleCustomNavigate = (e: React.FormEvent) => {
    e.preventDefault()
    if (customPath) {
      setCurrentPath(customPath)
    }
  }

  const isIOS = selectedDevice.includes('iPhone')

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 p-4 md:p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            📱 PWA Preview
          </h1>
          <p className="text-gray-400 text-sm">
            Preview how the Progressive Web App looks when installed (standalone mode)
          </p>
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-blue-900/30 rounded">No Browser UI</span>
            <span className="px-2 py-1 bg-green-900/30 rounded">Full Screen</span>
            <span className="px-2 py-1 bg-purple-900/30 rounded">App-like Experience</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Controls Panel */}
          <div className="w-full md:w-80 flex-shrink-0 space-y-4">
            {/* Device Selector */}
            <div className="bg-gray-800 rounded-xl p-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Device
              </label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value as keyof typeof PWA_MODELS)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              >
                {Object.keys(PWA_MODELS).map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              <p className="text-gray-500 text-xs mt-2">
                {device.width} × {device.height}px
              </p>
            </div>

            {/* Custom URL Input */}
            <div className="bg-gray-800 rounded-xl p-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Navigate to URL
              </label>
              <form onSubmit={handleCustomNavigate} className="flex gap-2">
                <input
                  type="text"
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  placeholder="/products/27"
                  className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Go
                </button>
              </form>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-800 rounded-xl p-4">
              <label className="block text-gray-300 text-sm font-medium mb-3">
                Quick Links
              </label>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_LINKS.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleNavigate(link.path)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      currentPath === link.path
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Path */}
            <div className="bg-gray-800 rounded-xl p-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Current Path
              </label>
              <code className="block bg-gray-900 text-purple-400 rounded-lg px-3 py-2 text-sm break-all">
                {currentPath}
              </code>
            </div>

            {/* PWA Info */}
            <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4">
              <h3 className="text-purple-300 text-sm font-medium mb-2">PWA Features</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>✓ No browser address bar</li>
                <li>✓ Full screen experience</li>
                <li>✓ App-like navigation</li>
                <li>✓ Offline support</li>
                <li>✓ Installable</li>
              </ul>
            </div>
          </div>

          {/* PWA Device Frame */}
          <div className="flex-1 flex justify-center items-start">
            <div
              className="relative"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
              }}
            >
              {/* Device Frame */}
              <div
                className={`relative ${isIOS ? 'bg-black' : 'bg-gray-800'} ${isIOS ? 'rounded-[60px]' : 'rounded-[32px]'} ${isIOS ? 'p-3' : 'p-2'} shadow-2xl`}
                style={{
                  width: device.width + (isIOS ? 24 : 16),
                  height: device.height + (isIOS ? 24 : 16),
                }}
              >
                {/* iOS Dynamic Island / Android Notch */}
                {isIOS ? (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-black rounded-full w-28 h-8 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-gray-800 mr-2" />
                      <div className="w-2 h-2 rounded-full bg-gray-700" />
                    </div>
                  </div>
                ) : (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gray-800 rounded-b-2xl w-32 h-6 flex items-center justify-center">
                      <div className="w-16 h-1.5 rounded-full bg-gray-700" />
                    </div>
                  </div>
                )}

                {/* PWA Screen - No Browser UI */}
                <div
                  className={`${isIOS ? 'bg-white' : 'bg-white'} ${isIOS ? 'rounded-[48px]' : 'rounded-[24px]'} overflow-hidden relative flex flex-col`}
                  style={{
                    width: device.width,
                    height: device.height,
                  }}
                >
                  {/* Status Bar Only (PWA has minimal UI) */}
                  <div className={`${isIOS ? 'bg-white' : 'bg-gray-900'} ${isIOS ? 'px-6' : 'px-4'} py-2 flex items-center ${isIOS ? 'justify-between' : 'justify-between'} text-${isIOS ? 'black' : 'white'} text-xs flex-shrink-0`}>
                    <div className="flex items-center gap-1">
                      {isIOS ? (
                        <>
                          <span className="font-semibold">9:41</span>
                        </>
                      ) : (
                        <>
                          <span>9:41</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {isIOS ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.24 0 1 1 0 01-1.415-1.415 5 5 0 017.07 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          <div className="flex items-end gap-0.5">
                            <div className="w-1 h-1.5 bg-black rounded-t" />
                            <div className="w-1 h-2 bg-black rounded-t" />
                            <div className="w-1 h-2.5 bg-black rounded-t" />
                            <div className="w-1 h-3 bg-black rounded-t" />
                          </div>
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.24 0 1 1 0 01-1.415-1.415 5 5 0 017.07 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          </svg>
                        </>
                      )}
                    </div>
                  </div>

                  {/* PWA Content - No Browser UI, Just App Content */}
                  <iframe
                    src={`http://localhost:3000${currentPath}${currentPath.includes('?') ? '&' : '?'}pwa=true`}
                    className="flex-1 border-0"
                    style={{
                      width: device.width,
                    }}
                    title="PWA Preview"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                    allow="fullscreen"
                  />

                  {/* iOS Home Indicator / Android Navigation */}
                  {isIOS ? (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                      <div className="w-32 h-1 bg-gray-600 rounded-full" />
                    </div>
                  ) : (
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-800" />
                  )}
                </div>

                {/* Device Side Buttons (iOS only) */}
                {isIOS && (
                  <>
                    <div className="absolute -left-1 top-28 w-1 h-8 bg-gray-700 rounded-l" />
                    <div className="absolute -left-1 top-44 w-1 h-16 bg-gray-700 rounded-l" />
                    <div className="absolute -left-1 top-64 w-1 h-16 bg-gray-700 rounded-l" />
                    <div className="absolute -right-1 top-36 w-1 h-24 bg-gray-700 rounded-r" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>
            PWA Preview - This simulates how the app looks when installed as a Progressive Web App.
          </p>
          <p className="mt-2 text-xs text-gray-600">
            Notice: No browser address bar, full-screen experience, app-like interface
          </p>
        </div>
      </div>
    </div>
  )
}
