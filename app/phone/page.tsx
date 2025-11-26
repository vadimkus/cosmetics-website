'use client'

import { useState } from 'react'

const PHONE_MODELS = {
  'iPhone 17 Pro Max': { width: 440, height: 956 },
  'iPhone 17 Pro': { width: 402, height: 874 },
  'iPhone 16 Pro Max': { width: 440, height: 956 },
  'iPhone 16 Pro': { width: 402, height: 874 },
  'iPhone 15 Pro Max': { width: 430, height: 932 },
  'iPhone 15 Pro': { width: 393, height: 852 },
  'iPhone 14': { width: 390, height: 844 },
  'iPhone SE': { width: 375, height: 667 },
  'iPhone 12 Mini': { width: 375, height: 812 },
}

const QUICK_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Contact', path: '/contact' },
  { name: 'About', path: '/about' },
  { name: 'Cart', path: '/cart' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Beauty Boxes', path: '/products?categories=beauty-boxes' },
  { name: 'AR Home', path: '/ar' },
  { name: 'AR Contact', path: '/ar/contact' },
]

export default function PhoneSimulatorPage() {
  const [selectedPhone, setSelectedPhone] = useState<keyof typeof PHONE_MODELS>('iPhone 16 Pro')
  const [currentPath, setCurrentPath] = useState('/')
  const [customPath, setCustomPath] = useState('')
  
  const phone = PHONE_MODELS[selectedPhone]
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

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 p-4 md:p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            📱 Mobile Preview
          </h1>
          <p className="text-gray-400 text-sm">
            Test mobile layouts in an iPhone simulator
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Controls Panel */}
          <div className="w-full md:w-80 flex-shrink-0 space-y-4">
            {/* Phone Model Selector */}
            <div className="bg-gray-800 rounded-xl p-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Device
              </label>
              <select
                value={selectedPhone}
                onChange={(e) => setSelectedPhone(e.target.value as keyof typeof PHONE_MODELS)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {Object.keys(PHONE_MODELS).map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              <p className="text-gray-500 text-xs mt-2">
                {phone.width} × {phone.height}px
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
                  placeholder="/products/123"
                  className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
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
                        ? 'bg-blue-600 text-white'
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
              <code className="block bg-gray-900 text-green-400 rounded-lg px-3 py-2 text-sm break-all">
                {currentPath}
              </code>
            </div>
          </div>

          {/* Phone Frame */}
          <div className="flex-1 flex justify-center items-start">
            <div
              className="relative"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
              }}
            >
              {/* iPhone Frame */}
              <div
                className="relative bg-black rounded-[60px] p-3 shadow-2xl"
                style={{
                  width: phone.width + 24,
                  height: phone.height + 24,
                }}
              >
                {/* Dynamic Island / Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-black rounded-full w-28 h-8 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-gray-800 mr-2" />
                    <div className="w-2 h-2 rounded-full bg-gray-700" />
                  </div>
                </div>

                {/* Screen */}
                <div
                  className="bg-white rounded-[48px] overflow-hidden relative flex flex-col"
                  style={{
                    width: phone.width,
                    height: phone.height,
                  }}
                >
                  {/* Safari-style Browser Address Bar */}
                  <div className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-b border-gray-200 flex-shrink-0">
                    {/* Status bar icons */}
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <span>9:41</span>
                    </div>
                    {/* URL Bar */}
                    <div className="flex-1 bg-white rounded-lg px-3 py-1.5 flex items-center justify-center">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="truncate max-w-[200px]">localhost:3000{currentPath}</span>
                      </div>
                    </div>
                    {/* Refresh icon */}
                    <div className="text-blue-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                  </div>
                  {/* Page Content */}
                  <iframe
                    src={`http://localhost:3000${currentPath}`}
                    className="flex-1 border-0"
                    style={{
                      width: phone.width,
                    }}
                    title="Mobile Preview"
                  />
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                  <div className="w-32 h-1 bg-gray-600 rounded-full" />
                </div>
              </div>

              {/* Side Buttons */}
              <div className="absolute -left-1 top-28 w-1 h-8 bg-gray-700 rounded-l" />
              <div className="absolute -left-1 top-44 w-1 h-16 bg-gray-700 rounded-l" />
              <div className="absolute -left-1 top-64 w-1 h-16 bg-gray-700 rounded-l" />
              <div className="absolute -right-1 top-36 w-1 h-24 bg-gray-700 rounded-r" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Use this page to preview mobile layouts. The iframe shows the actual site at mobile viewport size.</p>
        </div>
      </div>
    </div>
  )
}

