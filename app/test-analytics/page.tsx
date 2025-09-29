'use client'

import { useState } from 'react'
import { trackPageView, trackProductView, trackAddToCart, trackPurchase, trackPDFDownload } from '@/lib/analytics'

export default function TestAnalyticsPage() {
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testPageView = () => {
    trackPageView('/test-analytics')
    addLog('✅ Page view tracked in Google Analytics')
  }

  const testProductView = () => {
    trackProductView({
      id: 'test-product-1',
      name: 'Test Product',
      category: 'cosmetics',
      price: 100
    })
    addLog('✅ Product view tracked in Google Analytics')
  }

  const testAddToCart = () => {
    trackAddToCart({
      id: 'test-product-1',
      name: 'Test Product',
      category: 'cosmetics',
      price: 100,
      quantity: 2
    })
    addLog('✅ Add to cart tracked in Google Analytics')
  }

  const testPurchase = () => {
    trackPurchase({
      id: 'test-order-123',
      total: 200,
      items: [{
        id: 'test-product-1',
        name: 'Test Product',
        category: 'cosmetics',
        price: 100,
        quantity: 2
      }]
    })
    addLog('✅ Purchase tracked in Google Analytics')
  }

  const testPDFDownload = () => {
    trackPDFDownload('test-document.pdf')
    addLog('✅ PDF download tracked in Google Analytics')
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Google Analytics Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Test Google Analytics Events</h2>
          <div className="space-y-4">
            <button
              onClick={testPageView}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Page View
            </button>
            
            <button
              onClick={testProductView}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Test Product View
            </button>
            
            <button
              onClick={testAddToCart}
              className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Test Add to Cart
            </button>
            
            <button
              onClick={testPurchase}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Test Purchase
            </button>
            
            <button
              onClick={testPDFDownload}
              className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Test PDF Download
            </button>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Test Logs</h2>
            <button
              onClick={clearLogs}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
          
          <div className="bg-gray-100 p-4 rounded h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet. Click the test buttons above.</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div key={index} className="text-sm font-mono">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Open your browser's Developer Tools (F12)</li>
          <li>Go to the Network tab</li>
          <li>Click the test buttons above</li>
          <li>Look for requests to <code>google-analytics.com</code> or <code>googletagmanager.com</code></li>
          <li>Check the Console tab for any Google Analytics events</li>
        </ol>
      </div>
    </div>
  )
}
