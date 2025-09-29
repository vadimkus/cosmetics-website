'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Mail, Eye } from 'lucide-react'

interface Order {
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  itemCount: number
  status: string
  createdAt: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [resending, setResending] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      // Get all recent orders by fetching from a known email or implementing a getAllOrders function
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const resendNotification = async (orderNumber: string) => {
    try {
      setResending(orderNumber)
      const response = await fetch('/api/admin/resend-order-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderNumber }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert('Admin notification sent successfully!')
      } else {
        alert('Failed to send notification: ' + result.error)
      }
    } catch (error) {
      console.error('Error resending notification:', error)
      alert('Error sending notification')
    } finally {
      setResending(null)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return `AED ${amount.toFixed(2)}`
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <Button onClick={fetchOrders} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.orderNumber}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.customerName} ({order.customerEmail})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={order.status === 'PENDING' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resendNotification(order.orderNumber)}
                      disabled={resending === order.orderNumber}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      {resending === order.orderNumber ? 'Sending...' : 'Resend Email'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-600">Total Amount</p>
                    <p className="text-lg font-bold text-red-600">{formatCurrency(order.total)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Items</p>
                    <p className="text-lg">{order.itemCount}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Order Date</p>
                    <p className="text-sm">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Status</p>
                    <Badge variant={order.status === 'PENDING' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
