'use client'

import { useState, useEffect } from 'react'
import { Mail, Send } from 'lucide-react'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { errorLog } from '@/lib/logger'

export default function ManualNotificationPage() {
  const [formData, setFormData] = useState({
    orderNumber: '',
    customerName: '',
    customerEmail: '',
    total: '',
    itemCount: '1'
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  // Helper to get admin email from session
  const getAdminEmail = (): string | null => {
    if (typeof window === 'undefined') return null
    try {
      const session = localStorage.getItem('admin_session')
      if (session) {
        const parsed = JSON.parse(session)
        return parsed.email || null
      }
      } catch {
      return null
    }
    return null
  }

  // Helper to get admin headers with CSRF
  const getAdminHeaders = (): HeadersInit => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...getCsrfHeaders() as Record<string, string>
    }
    const email = getAdminEmail()
    if (email) {
      headers['X-Admin-Email'] = email
    }
    return headers as HeadersInit
  }

  // Fetch CSRF token on mount
  useEffect(() => {
    fetchCsrfToken().catch(err => {
      errorLog('Failed to fetch CSRF token:', err)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        alert('Security error: Could not verify request. Please refresh the page and try again.')
        setLoading(false)
        return
      }

      const response = await fetch('/api/admin/manual-order-notification', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(addCsrfToBody(formData)),
      })

      const data = await response.json()
      
      if (data.success) {
        setResult({ success: true, message: data.message })
        // Reset form
        setFormData({
          orderNumber: '',
          customerName: '',
          customerEmail: '',
          total: '',
          itemCount: '1'
        })
      } else {
        setResult({ success: false, message: data.error })
      }
      } catch {
      setResult({ success: false, message: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Manual Order Notification
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Send admin notification for orders that were created before the email system was fixed.
          </p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">Order Number *</label>
                <input
                  id="orderNumber"
                  type="text"
                  value={formData.orderNumber}
                  onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                  placeholder="e.g., 123456789"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <input
                  id="customerName"
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="e.g., John Doe"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">Customer Email *</label>
              <input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                placeholder="e.g., customer@example.com"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-1">Total Amount (AED) *</label>
                <input
                  id="total"
                  type="number"
                  step="0.01"
                  value={formData.total}
                  onChange={(e) => handleInputChange('total', e.target.value)}
                  placeholder="e.g., 150.00"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="itemCount" className="block text-sm font-medium text-gray-700 mb-1">Number of Items</label>
                <input
                  id="itemCount"
                  type="number"
                  value={formData.itemCount}
                  onChange={(e) => handleInputChange('itemCount', e.target.value)}
                  placeholder="e.g., 2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Admin Notification
                </>
              )}
            </button>
          </form>

          {result && (
            <div className={`mt-4 p-4 rounded-lg ${
              result.success 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <p className="font-medium">
                {result.success ? '✅ Success!' : '❌ Error'}
              </p>
              <p className="text-sm mt-1">{result.message}</p>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Quick Fill for Yesterday&apos;s Order</h3>
            <p className="text-sm text-blue-700 mb-3">
              If you have the order details from the admin panel, you can quickly fill them in:
            </p>
            <div className="text-xs text-blue-600 space-y-1">
              <p>• Order Number: Found in the admin panel</p>
              <p>• Customer Name: From the order details</p>
              <p>• Customer Email: From the order details</p>
              <p>• Total Amount: The order total in AED</p>
              <p>• Number of Items: Count of products in the order</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
