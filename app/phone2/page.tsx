'use client'

import { useState } from 'react'

const ANDROID_MODELS = {
  'Samsung Galaxy S24 Ultra': { width: 412, height: 915 },
  'Samsung Galaxy S24': { width: 393, height: 852 },
  'Samsung Galaxy S23 Ultra': { width: 412, height: 915 },
  'Google Pixel 8 Pro': { width: 412, height: 915 },
  'Google Pixel 8': { width: 393, height: 852 },
  'Google Pixel 7 Pro': { width: 412, height: 915 },
  'OnePlus 12': { width: 412, height: 915 },
  'Xiaomi 14 Pro': { width: 412, height: 915 },
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

export default function AndroidSimulatorPage() {
  const [selectedPhone, setSelectedPhone] = useState<keyof typeof ANDROID_MODELS>('Samsung Galaxy S24 Ultra')
  const [currentPath, setCurrentPath] = useState('/')
  const [customPath, setCustomPath] = useState('')
  
  const phone = ANDROID_MODELS[selectedPhone]
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
            🤖 Android Preview
          </h1>
          <p className="text-gray-400 text-sm">
            Test mobile layouts in an Android device simulator
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
                onChange={(e) => setSelectedPhone(e.target.value as keyof typeof ANDROID_MODELS)}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
              >
                {Object.keys(ANDROID_MODELS).map((model) => (
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
                  className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
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
                        ? 'bg-green-600 text-white'
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
              {/* Android Phone Frame */}
              <div
                className="relative bg-gray-800 rounded-[32px] p-2 shadow-2xl"
                style={{
                  width: phone.width + 16,
                  height: phone.height + 16,
                }}
              >
                {/* Screen */}
                <div
                  className="bg-white rounded-[24px] overflow-hidden relative flex flex-col"
                  style={{
                    width: phone.width,
                    height: phone.height,
                  }}
                >
                  {/* Android Status Bar */}
                  <div className="bg-gray-900 px-4 py-2 flex items-center justify-between text-white text-xs flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <span>9:41</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.24 0 1 1 0 01-1.415-1.415 5 5 0 017.07 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {/* Chrome-style Browser Address Bar */}
                  <div className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-b border-gray-200 flex-shrink-0">
                    {/* Back button */}
                    <button className="text-gray-600 hover:text-gray-900">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    {/* URL Bar */}
                    <div className="flex-1 bg-white rounded-lg px-3 py-1.5 flex items-center gap-2">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-xs text-gray-600 truncate max-w-[200px]">localhost:3000{currentPath}</span>
                    </div>
                    {/* More options */}
                    <button className="text-gray-600 hover:text-gray-900">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>

                  {/* Page Content */}
                  <iframe
                    src={`http://localhost:3000${currentPath}`}
                    className="flex-1 border-0"
                    style={{
                      width: phone.width,
                    }}
                    title="Android Mobile Preview"
                  />
                </div>

                {/* Android Navigation Bar Area */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-800 rounded-b-[24px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Use this page to preview mobile layouts on Android devices. The iframe shows the actual site at mobile viewport size.</p>
        </div>
      </div>
    </div>
  )
}

