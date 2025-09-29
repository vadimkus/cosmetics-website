'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Send } from 'lucide-react'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/manual-order-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
    } catch (error) {
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Manual Order Notification
          </CardTitle>
          <p className="text-sm text-gray-600">
            Send admin notification for orders that were created before the email system was fixed.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orderNumber">Order Number *</Label>
                <Input
                  id="orderNumber"
                  value={formData.orderNumber}
                  onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                  placeholder="e.g., 123456789"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="e.g., John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="customerEmail">Customer Email *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                placeholder="e.g., customer@example.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="total">Total Amount (AED) *</Label>
                <Input
                  id="total"
                  type="number"
                  step="0.01"
                  value={formData.total}
                  onChange={(e) => handleInputChange('total', e.target.value)}
                  placeholder="e.g., 150.00"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="itemCount">Number of Items</Label>
                <Input
                  id="itemCount"
                  type="number"
                  value={formData.itemCount}
                  onChange={(e) => handleInputChange('itemCount', e.target.value)}
                  placeholder="e.g., 2"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
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
            </Button>
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
            <h3 className="font-medium text-blue-900 mb-2">Quick Fill for Yesterday's Order</h3>
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
        </CardContent>
      </Card>
    </div>
  )
}
